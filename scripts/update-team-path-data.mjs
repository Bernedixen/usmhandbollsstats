import fs from "fs/promises";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const appSource = await fs.readFile(path.join(rootDir, "app.js"), "utf8");
const snapshot = JSON.parse(
  await fs.readFile(path.join(rootDir, "data", "usm-f14-stage4-2026.json"), "utf8")
);

const STAGE1_LOOKUP = extractObjectLiteral(appSource, "STAGE1_LOOKUP");
const STAGE2_LOOKUP = extractObjectLiteral(appSource, "STAGE2_LOOKUP");
const STAGE3_LOOKUP = extractObjectLiteral(appSource, "STAGE3_LOOKUP");
const targetTeams = new Set(snapshot.groups.flatMap((group) => group.teams.map((team) => team.name)));
const stage2Groups = new Set(Object.values(STAGE2_LOOKUP).map((entry) => entry.group));
const stage3Groups = new Set(Object.values(STAGE3_LOOKUP).map((entry) => entry.group));

const competitionHtml = await fetchText("https://www.profixio.com/app/lx/competition/leagueid17925");
const groupLinks = extractCompetitionGroupLinks(competitionHtml);

const stage1Pages = groupLinks.filter((link) => link.href.includes("/category/1171543?matchgroup="));
const stage2Pages = groupLinks.filter((link) => stage2Groups.has(link.groupLabel));
const stage3Pages = groupLinks.filter((link) => stage3Groups.has(link.groupLabel));

const teamPaths = createBaseTeamPaths();

await collectStagePages("stage1", stage1Pages);
await collectStagePages("stage2", stage2Pages);
await collectStagePages("stage3", stage3Pages);

const output = {
  generatedAt: new Date().toISOString(),
  teams: teamPaths,
};

const outputPath = path.join(rootDir, "data", "usm-f14-team-paths-2026.json");
await fs.writeFile(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");
console.log(`Wrote ${outputPath}`);

async function collectStagePages(stageKey, links) {
  for (const link of links) {
    const groupPageUrl = toDirectGroupUrl(link.href);
    const html = await fetchText(groupPageUrl);
    const parsedGroup = parseGroupPage(html);
    const relevantTeams = parsedGroup.teams.filter((teamName) => targetTeams.has(teamName));

    if (!relevantTeams.length) {
      continue;
    }

    for (const teamName of relevantTeams) {
      const existing = teamPaths[teamName]?.[stageKey];
      if (!existing) {
        continue;
      }

      existing.groupPageUrl = groupPageUrl;
      existing.field = parsedGroup.teams;
      existing.matches = parsedGroup.matches
        .filter((match) => match.homeTeam === teamName || match.awayTeam === teamName)
        .map((match) => toPerspectiveMatch(match, teamName));

      if (stageKey !== "stage1" && link.groupLabel) {
        existing.group = link.groupLabel;
      }
    }
  }
}

function createBaseTeamPaths() {
  const teams = {};

  for (const teamName of targetTeams) {
    teams[teamName] = {
      stage1: createRoundEntry(STAGE1_LOOKUP[teamName]),
      stage2: createRoundEntry(STAGE2_LOOKUP[teamName]),
      stage3: createRoundEntry(STAGE3_LOOKUP[teamName]),
    };
  }

  return teams;
}

function createRoundEntry(round) {
  if (!round) {
    return null;
  }

  return {
    group: round.group,
    place: round.place,
    points: round.points,
    maxPoints: round.maxPoints ?? null,
    goalDiff: Number.isFinite(round.goalDiff) ? round.goalDiff : null,
    field: [],
    matches: [],
    groupPageUrl: "",
  };
}

function extractCompetitionGroupLinks(html) {
  return [...html.matchAll(/<a[^>]+href="([^"]*matchgroup=[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      href: match[1].replace(/&amp;/g, "&"),
      groupLabel: normalizeText(match[2]).replace(/^Grupp\s+/, ""),
    }))
    .filter((entry) => entry.groupLabel);
}

function toDirectGroupUrl(href) {
  const url = new URL(href);
  const categoryMatch = url.pathname.match(/category\/(\d+)/);
  const groupId = url.searchParams.get("matchgroup");
  if (!categoryMatch || !groupId) {
    throw new Error(`Could not convert ${href} to a direct group URL`);
  }

  return `https://www.profixio.com/app/leagueid17925/category/${categoryMatch[1]}/group/${groupId}`;
}

function parseGroupPage(html) {
  const matches = parseMatches(html);
  const teamSet = new Set();

  for (const match of matches) {
    if (match.homeTeam) {
      teamSet.add(match.homeTeam);
    }
    if (match.awayTeam) {
      teamSet.add(match.awayTeam);
    }
  }

  return {
    teams: [...teamSet],
    matches,
  };
}

function parseMatches(html) {
  const startMatches = [...html.matchAll(/wire:key="mc_mini_(\d+)"/g)];
  const blocks = startMatches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < startMatches.length ? startMatches[index + 1].index : html.length;
    return {
      matchId: match[1],
      html: html.slice(start, end),
    };
  });

  return blocks
    .map(({ matchId, html: block }) => {
      const teamNames = [...block.matchAll(/class="leading-5[^"]*">[\s\S]*?-->\s*([^<]+?)\s*<!--\[if ENDBLOCK/gi)]
        .map((match) => normalizeText(match[1]))
        .filter(Boolean)
        .slice(0, 2);
      const scores = [...block.matchAll(/class="font-bold text-right"[^>]*>\s*(\d+)\s*<\/div>/gi)]
        .map((match) => Number(match[1]))
        .slice(0, 2);
      const dateParts = block.match(/text-center text-xs flex flex-col justify-center"[^>]*>[\s\S]*?<div>([^<]+)<\/div>\s*<div>([^<]+)<\/div>\s*<div>([^<]+)<\/div>/i);
      const protocolMatch = block.match(/href="([^"]+\/match\/\d+\/protocol\/shf_m)"/i);

      if (teamNames.length !== 2 || scores.length !== 2) {
        return null;
      }

      return {
        matchId,
        homeTeam: teamNames[0],
        awayTeam: teamNames[1],
        homeScore: scores[0],
        awayScore: scores[1],
        dateLabel: dateParts ? normalizeText(`${dateParts[1]} ${dateParts[2]}`) : "",
        timeLabel: dateParts ? normalizeText(dateParts[3]) : "",
        protocolUrl: protocolMatch ? decodeHtml(protocolMatch[1]) : "",
      };
    })
    .filter(Boolean);
}

function toPerspectiveMatch(match, teamName) {
  const isHome = match.homeTeam === teamName;
  const teamScore = isHome ? match.homeScore : match.awayScore;
  const opponentScore = isHome ? match.awayScore : match.homeScore;
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const result =
    teamScore > opponentScore ? "W" :
    teamScore < opponentScore ? "L" :
    "D";

  return {
    matchId: match.matchId,
    opponent,
    result,
    teamScore,
    opponentScore,
    dateLabel: match.dateLabel,
    timeLabel: match.timeLabel,
    protocolUrl: match.protocolUrl,
  };
}

function extractObjectLiteral(source, constName) {
  const match = source.match(new RegExp(`const ${constName} = (\\{[\\s\\S]*?\\n\\});`));
  if (!match) {
    throw new Error(`Could not find ${constName} in app.js`);
  }

  return Function(`return (${match[1]});`)();
}

function fetchText(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 Codex HandballStats Fetch",
          Accept: "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        },
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const statusCode = response.statusCode || 0;
          const location = response.headers.location;

          if (location && statusCode >= 300 && statusCode < 400) {
            if (redirectCount >= 5) {
              reject(new Error(`Too many redirects while fetching ${url}`));
              return;
            }

            fetchText(new URL(location, url).toString(), redirectCount + 1).then(resolve, reject);
            return;
          }

          resolve(Buffer.concat(chunks).toString("utf8"));
        });
      }
    );

    request.on("error", reject);
  });
}

function normalizeText(value) {
  return decodeHtml(String(value || ""))
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
