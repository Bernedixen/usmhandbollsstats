const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 8000);
const ROOT = __dirname;
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

function fetchRemote(targetUrl) {
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
          resolve({
            statusCode: upstreamResponse.statusCode || 502,
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

  const goalDiffs = {
    ...extractStage3GoalDiffs(stage3A.body.toString("utf8")),
    ...extractStage3GoalDiffs(stage3B.body.toString("utf8")),
  };

  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  });
  response.end(JSON.stringify(goalDiffs, null, 2));
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
    if (/^[+-]?\d+$/.test(rawGoalDiff)) {
      goalDiffs[teamName] = Number(rawGoalDiff);
    }
  });

  return goalDiffs;
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
    const filePath = path.normalize(path.join(ROOT, normalizedPath));

    if (!filePath.startsWith(ROOT)) {
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
