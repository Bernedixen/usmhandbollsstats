const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 8000);
const ROOT = __dirname;
const WEB_ROOT = process.argv.includes("--dist") ? path.join(ROOT, "dist") : ROOT;
const STAGE4_DATA = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data", "usm-f14-stage4-2026.json"), "utf8")
);
const KNOWN_STAGE4_TEAMS = new Set(
  STAGE4_DATA.groups.flatMap((group) => group.teams.map((team) => team.name))
);

const PROFIXIO_ENDPOINTS = {
  "/api/profixio/competition": "https://www.profixio.com/app/lx/competition/leagueid17925",
  "/api/profixio/stage3-a": "https://www.profixio.com/app/leagueid17925/category/1176782",
  "/api/profixio/stage3-b": "https://www.profixio.com/app/leagueid17925/category/1176783",
};

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === "/api/profixio/stage3-goaldiffs") {
      await serveStage3GoalDiffs(response);
      return;
    }

    if (url.pathname in PROFIXIO_ENDPOINTS) {
      await proxyRequest(PROFIXIO_ENDPOINTS[url.pathname], response);
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error.message || "Internal server error");
  }
});

server.listen(PORT, () => {
  console.log(`Handball Stats server running on http://localhost:${PORT}`);
});

function proxyRequest(targetUrl, response) {
  return fetchRemote(targetUrl).then(({ statusCode, headers, body }) => {
    response.writeHead(statusCode || 502, {
      "Content-Type": headers["content-type"] || "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    });
    response.end(body);
  });
}

function fetchRemote(targetUrl, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      targetUrl,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 Codex HandballStats Proxy",
          Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        },
      },
      (upstreamResponse) => {
        const chunks = [];

        upstreamResponse.on("data", (chunk) => chunks.push(chunk));
        upstreamResponse.on("end", () => {
          const statusCode = upstreamResponse.statusCode || 502;
          const location = upstreamResponse.headers.location;

          if (location && statusCode >= 300 && statusCode < 400) {
            if (redirectCount >= 5) {
              reject(new Error(`Too many redirects while fetching ${targetUrl}`));
              return;
            }

            let redirectedUrl;
            try {
              redirectedUrl = new URL(location, targetUrl).toString();
            } catch {
              reject(new Error(`Invalid redirect URL received for ${targetUrl}`));
              return;
            }

            fetchRemote(redirectedUrl, redirectCount + 1).then(resolve, reject);
            return;
          }

          resolve({
            statusCode,
            headers: upstreamResponse.headers,
            body: Buffer.concat(chunks),
          });
        });
      }
    );

    request.on("error", reject);
  });
}

async function serveStage3GoalDiffs(response) {
  const [stage3A, stage3B] = await Promise.all([
    fetchRemote(PROFIXIO_ENDPOINTS["/api/profixio/stage3-a"]),
    fetchRemote(PROFIXIO_ENDPOINTS["/api/profixio/stage3-b"]),
  ]);

  const stage3AHtml = stage3A.body.toString("utf8");
  const stage3BHtml = stage3B.body.toString("utf8");
  const baseGoalDiffs = {
    ...extractStage3GoalDiffs(stage3AHtml),
    ...extractStage3GoalDiffs(stage3BHtml),
  };
  const fallbackGoalDiffs = await fetchStage3GroupGoalDiffs([
    ...extractStage3GroupUrls(stage3AHtml, PROFIXIO_ENDPOINTS["/api/profixio/stage3-a"]),
    ...extractStage3GroupUrls(stage3BHtml, PROFIXIO_ENDPOINTS["/api/profixio/stage3-b"]),
  ]);
  const goalDiffs = {
    ...fallbackGoalDiffs,
    ...baseGoalDiffs,
  };

  if (!Object.keys(goalDiffs).length) {
    console.warn("Stage 3 goal diff parsing returned 0 rows.", {
      stage3AStatus: stage3A.statusCode,
      stage3BStatus: stage3B.statusCode,
      stage3AContentType: stage3A.headers["content-type"] || "",
      stage3BContentType: stage3B.headers["content-type"] || "",
      fallbackUrlCount:
        extractStage3GroupUrls(stage3AHtml, PROFIXIO_ENDPOINTS["/api/profixio/stage3-a"]).length +
        extractStage3GroupUrls(stage3BHtml, PROFIXIO_ENDPOINTS["/api/profixio/stage3-b"]).length,
      stage3ASnippet: normalizeCellText(stage3AHtml).slice(0, 200),
      stage3BSnippet: normalizeCellText(stage3BHtml).slice(0, 200),
    });
  }

  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  });
  response.end(JSON.stringify(goalDiffs, null, 2));
}

async function fetchStage3GroupGoalDiffs(groupUrls) {
  const uniqueUrls = [...new Set(groupUrls)];
  if (!uniqueUrls.length) {
    return {};
  }

  const pages = await Promise.all(
    uniqueUrls.map(async (groupUrl) => {
      try {
        const response = await fetchRemote(groupUrl);
        if ((response.statusCode || 0) >= 400) {
          return "";
        }

        return response.body.toString("utf8");
      } catch {
        return "";
      }
    })
  );

  return pages.reduce((mergedGoalDiffs, html) => {
    if (!html) {
      return mergedGoalDiffs;
    }

    return {
      ...mergedGoalDiffs,
      ...extractStage3GoalDiffs(html),
    };
  }, {});
}

function extractStage3GroupUrls(html, categoryUrl) {
  const category = new URL(categoryUrl);
  const candidateUrls = new Set();
  const hrefMatches = html.matchAll(/(?:href|data-href)=["']([^"']+)["']/gi);

  for (const match of hrefMatches) {
    const rawUrl = match[1];
    if (!rawUrl || rawUrl.startsWith("#") || rawUrl.startsWith("javascript:")) {
      continue;
    }

    let resolvedUrl;
    try {
      resolvedUrl = new URL(rawUrl, categoryUrl);
    } catch {
      continue;
    }

    if (!resolvedUrl.hostname.includes("profixio.com")) {
      continue;
    }

    const samePath = resolvedUrl.pathname === category.pathname;
    const sameSearch = resolvedUrl.search === category.search || !resolvedUrl.search;
    const referencesStage3 =
      resolvedUrl.href.includes("/group") ||
      /[?&](group|groupid|layout|view)=/i.test(resolvedUrl.search) ||
      (!samePath && resolvedUrl.pathname.includes("/category/"));

    if (!referencesStage3) {
      continue;
    }

    if (samePath && sameSearch) {
      continue;
    }

    resolvedUrl.hash = "";
    candidateUrls.add(resolvedUrl.toString());
  }

  return [...candidateUrls];
}

function extractStage3GoalDiffs(html) {
  const goalDiffs = {};
  let goalDiffIndex = -1;
  let headerCellCount = 0;
  const rowMatches = html.match(/<tr[\s\S]*?<\/tr>/g) || [];

  rowMatches.forEach((rowHtml) => {
    const cells = Array.from(rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)).map((match) =>
      normalizeCellText(match[1])
    );
    if (!cells.length) {
      return;
    }

    const plusIndex = cells.findIndex((cell) => cell === "+/-");
    const fallbackIndex = cells.findIndex((cell) => cell === "Mål +/-");
    if (plusIndex !== -1 || fallbackIndex !== -1) {
      goalDiffIndex = plusIndex !== -1 ? plusIndex : fallbackIndex;
      headerCellCount = cells.length;
      return;
    }

    if (goalDiffIndex === -1) {
      return;
    }

    const teamName = cells.find((cell) => KNOWN_STAGE4_TEAMS.has(cell));
    if (!teamName) {
      return;
    }

    const cellOffset = Math.max(cells.length - headerCellCount, 0);
    const rawGoalDiff = cells[goalDiffIndex + cellOffset];
    const parsedGoalDiff = parseSignedNumber(rawGoalDiff);
    if (parsedGoalDiff !== null) {
      goalDiffs[teamName] = parsedGoalDiff;
    }
  });

  return goalDiffs;
}

function parseSignedNumber(value) {
  const normalized = normalizeCellText(value).replace(/[−–]/g, "-");
  if (!/^[+-]?\d+$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCellText(value) {
  return String(value || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function serveStatic(requestPath, response) {
  return new Promise((resolve, reject) => {
    const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
    const filePath = path.normalize(path.join(WEB_ROOT, normalizedPath));

    if (!filePath.startsWith(WEB_ROOT)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      resolve();
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === "ENOENT") {
          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Not found");
          resolve();
          return;
        }

        reject(error);
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      response.writeHead(200, {
        "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(content);
      resolve();
    });
  });
}
