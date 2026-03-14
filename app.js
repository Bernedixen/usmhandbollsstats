const SNAPSHOT_URL = "./data/usm-f14-stage4-2026.json";
const LIVE_SOURCE_URL = "https://www.profixio.com/app/lx/competition/leagueid17925";
const STAGE3_A_TABLES_URL = "https://www.profixio.com/app/leagueid17925/category/1176782";
const STAGE3_B_TABLES_URL = "https://www.profixio.com/app/leagueid17925/category/1176783";
const PROXY_URLS = {
  competition: "/api/profixio/competition",
  stage3A: "/api/profixio/stage3-a",
  stage3B: "/api/profixio/stage3-b",
  stage3GoalDiffs: "/api/profixio/stage3-goaldiffs",
};
const CAPACITOR_HTTP_PLUGIN_ID = "CapacitorHttp";
const STAGE3_A_COLORS = [
  { accent: "#005f73", background: "#d9f0f3" },
  { accent: "#9b2226", background: "#f8d7d9" },
  { accent: "#6a4c93", background: "#ece3f7" },
  { accent: "#2b9348", background: "#dff3e4" },
  { accent: "#c77d00", background: "#f9e6bf" },
  { accent: "#3a86ff", background: "#deebff" },
  { accent: "#8338ec", background: "#eadcff" },
  { accent: "#e76f51", background: "#fde2db" },
  { accent: "#386641", background: "#e0ecd9" },
  { accent: "#ff006e", background: "#ffd9e9" }
];
const STAGE1_LOOKUP = {
  "Härnösands HF 1": { group: "01:25", place: 1, points: 8, maxPoints: 8 },
  "IFK Nyköping": { group: "01:06", place: 2, points: 6, maxPoints: 8 },
  "IFK Tumba HK": { group: "01:27", place: 2, points: 4, maxPoints: 6 },
  "Skuru IK": { group: "01:28", place: 1, points: 6, maxPoints: 6 },
  "Täby HBK 1": { group: "01:02", place: 1, points: 8, maxPoints: 8 },
  "Alingsås HK": { group: "01:17", place: 1, points: 6, maxPoints: 6 },
  "BK Heid": { group: "01:24", place: 3, points: 2, maxPoints: 6 },
  "HF Karlskrona": { group: "01:12", place: 3, points: 2, maxPoints: 6 },
  "KFUM Kalmar HK": { group: "01:09", place: 2, points: 4, maxPoints: 6 },
  "Redbergslids IK Blå": { group: "01:18", place: 2, points: 4, maxPoints: 6 },
  "GF Kroppskultur 1": { group: "01:12", place: 2, points: 4, maxPoints: 6 },
  "IFK Bankeryd": { group: "01:09", place: 3, points: 2, maxPoints: 6 },
  "Kävlinge HK": { group: "01:24", place: 4, points: 0, maxPoints: 6 },
  "Skara HF": { group: "01:13", place: 2, points: 6, maxPoints: 8 },
  "Åhus Handboll": { group: "01:11", place: 1, points: 6, maxPoints: 6 },
  "IK Sund": { group: "01:20", place: 1, points: 6, maxPoints: 6 },
  "Kungälvs HK": { group: "01:13", place: 4, points: 2, maxPoints: 8 },
  "Skövde HF 1": { group: "01:07", place: 2, points: 6, maxPoints: 8 },
  "Tyresö Handboll": { group: "01:30", place: 2, points: 5, maxPoints: 6 },
  "Önnereds HK 1": { group: "01:16", place: 1, points: 6, maxPoints: 6 },
  "Hässleholms HF": { group: "01:13", place: 1, points: 8, maxPoints: 8 },
  "IK Sävehof Svart": { group: "01:12", place: 1, points: 6, maxPoints: 6 },
  "Kärra HF": { group: "01:24", place: 1, points: 6, maxPoints: 6 },
  "Lödde Vikings HK": { group: "01:09", place: 1, points: 6, maxPoints: 6 },
  "RP IF Linköping": { group: "01:04", place: 3, points: 2, maxPoints: 6 },
  "Anderstorps SK": { group: "01:11", place: 2, points: 3, maxPoints: 6 },
  "KFUM Trollhättan": { group: "01:19", place: 1, points: 6, maxPoints: 6 },
  "Lugi HF 2": { group: "01:24", place: 2, points: 4, maxPoints: 6 },
  "Strömstad HK": { group: "01:20", place: 3, points: 2, maxPoints: 6 },
  "Växjö HF Gul": { group: "01:26", place: 1, points: 6, maxPoints: 6 },
  "Eskilstuna Guif IF": { group: "01:06", place: 1, points: 8, maxPoints: 8 },
  "Gustavsbergs IF HK": { group: "01:23", place: 1, points: 8, maxPoints: 8 },
  "HK Ankaret Röd": { group: "01:21", place: 1, points: 6, maxPoints: 6 },
  "HK Halmstad": { group: "01:04", place: 2, points: 5, maxPoints: 6 },
  "Skövde HF 2": { group: "01:14", place: 1, points: 8, maxPoints: 8 },
  "Haninge HK": { group: "01:27", place: 1, points: 6, maxPoints: 6 },
  "Huddinge HK": { group: "01:06", place: 4, points: 2, maxPoints: 8 },
  "IF Hallby HK": { group: "01:03", place: 2, points: 5, maxPoints: 6 },
  "Mölndals HF": { group: "01:04", place: 1, points: 5, maxPoints: 6 },
  "Torslanda HK": { group: "01:23", place: 2, points: 6, maxPoints: 8 }
};
const STAGE2_LOOKUP = {
  "Härnösands HF 1": { group: "2:09 A", place: 1, points: 4, maxPoints: 4 },
  "IFK Nyköping": { group: "2:02 A", place: 2, points: 2, maxPoints: 4 },
  "IFK Tumba HK": { group: "2:09 B", place: 3, points: 0, maxPoints: 4 },
  "Skuru IK": { group: "2:10 B", place: 1, points: 4, maxPoints: 4 },
  "Täby HBK 1": { group: "2:01 B", place: 1, points: 4, maxPoints: 4 },
  "Alingsås HK": { group: "2:06 A", place: 1, points: 4, maxPoints: 4 },
  "BK Heid": { group: "2:08 C", place: 1, points: 4, maxPoints: 4 },
  "HF Karlskrona": { group: "2:04 C", place: 1, points: 4, maxPoints: 4 },
  "KFUM Kalmar HK": { group: "2:03 B", place: 1, points: 4, maxPoints: 4 },
  "Redbergslids IK Blå": { group: "2:06 B", place: 2, points: 2, maxPoints: 4 },
  "GF Kroppskultur 1": { group: "2:04 A", place: 1, points: 4, maxPoints: 4 },
  "IFK Bankeryd": { group: "2:03 C", place: 1, points: 4, maxPoints: 4 },
  "Kävlinge HK": { group: "2:08 D", place: 1, points: 4, maxPoints: 4 },
  "Skara HF": { group: "2:05 A", place: 1, points: 4, maxPoints: 4 },
  "Åhus Handboll": { group: "2:04 B", place: 2, points: 2, maxPoints: 4 },
  "IK Sund": { group: "2:07 B", place: 1, points: 4, maxPoints: 4 },
  "Kungälvs HK": { group: "2:05 D", place: 2, points: 4, maxPoints: 6 },
  "Skövde HF 1": { group: "2:03 B", place: 2, points: 2, maxPoints: 4 },
  "Tyresö Handboll": { group: "2:10 A", place: 1, points: 4, maxPoints: 4 },
  "Önnereds HK 1": { group: "2:06 B", place: 1, points: 4, maxPoints: 4 },
  "Hässleholms HF": { group: "2:05 B", place: 1, points: 4, maxPoints: 4 },
  "IK Sävehof Svart": { group: "2:04 B", place: 1, points: 4, maxPoints: 4 },
  "Kärra HF": { group: "2:08 B", place: 1, points: 4, maxPoints: 4 },
  "Lödde Vikings HK": { group: "2:03 A", place: 1, points: 4, maxPoints: 4 },
  "RP IF Linköping": { group: "2:02 D", place: 2, points: 2, maxPoints: 4 },
  "Anderstorps SK": { group: "2:04 A", place: 2, points: 2, maxPoints: 4 },
  "KFUM Trollhättan": { group: "2:07 A", place: 2, points: 2, maxPoints: 4 },
  "Lugi HF 2": { group: "2:08 A", place: 2, points: 2, maxPoints: 4 },
  "Strömstad HK": { group: "2:07 C", place: 1, points: 4, maxPoints: 4 },
  "Växjö HF Gul": { group: "2:09 B", place: 1, points: 4, maxPoints: 4 },
  "Eskilstuna Guif IF": { group: "2:02 B", place: 2, points: 3, maxPoints: 4 },
  "Gustavsbergs IF HK": { group: "2:08 B", place: 2, points: 2, maxPoints: 4 },
  "HK Ankaret Röd": { group: "2:07 A", place: 1, points: 4, maxPoints: 4 },
  "HK Halmstad": { group: "2:02 A", place: 1, points: 4, maxPoints: 4 },
  "Skövde HF 2": { group: "2:05 A", place: 3, points: 0, maxPoints: 4 },
  "Haninge HK": { group: "2:09 A", place: 2, points: 2, maxPoints: 4 },
  "Huddinge HK": { group: "2:02 D", place: 1, points: 4, maxPoints: 4 },
  "IF Hallby HK": { group: "2:01 A", place: 1, points: 4, maxPoints: 4 },
  "Mölndals HF": { group: "2:02 B", place: 1, points: 3, maxPoints: 4 },
  "Torslanda HK": { group: "2:08 A", place: 1, points: 4, maxPoints: 4 }
};
const STAGE3_LOOKUP = {
  "Härnösands HF 1": { group: "3:02 A", place: 2, points: 4, goalDiff: null },
  "IFK Nyköping": { group: "3:01 A", place: 3, points: 2, goalDiff: null },
  "IFK Tumba HK": { group: "3:11 B", place: 1, points: 6, goalDiff: null },
  "Skuru IK": { group: "3:10 A", place: 1, points: 6, goalDiff: null },
  "Täby HBK 1": { group: "3:09 A", place: 2, points: 5, goalDiff: null },
  "Alingsås HK": { group: "3:05 A", place: 1, points: 6, goalDiff: null },
  "BK Heid": { group: "3:16 B", place: 1, points: 6, goalDiff: null },
  "HF Karlskrona": { group: "3:14 B", place: 1, points: 6, goalDiff: null },
  "KFUM Kalmar HK": { group: "3:03 A", place: 2, points: 4, goalDiff: null },
  "Redbergslids IK Blå": { group: "3:07 A", place: 2, points: 4, goalDiff: null },
  "GF Kroppskultur 1": { group: "3:01 A", place: 2, points: 4, goalDiff: null },
  "IFK Bankeryd": { group: "3:13 B", place: 1, points: 6, goalDiff: null },
  "Kävlinge HK": { group: "3:15 B", place: 1, points: 5, goalDiff: null },
  "Skara HF": { group: "3:08 A", place: 2, points: 4, goalDiff: null },
  "Åhus Handboll": { group: "3:04 A", place: 1, points: 6, goalDiff: null },
  "IK Sund": { group: "3:07 A", place: 3, points: 2, goalDiff: null },
  "Kungälvs HK": { group: "3:17 B", place: 1, points: 6, goalDiff: null },
  "Skövde HF 1": { group: "3:08 A", place: 3, points: 2, goalDiff: null },
  "Tyresö Handboll": { group: "3:02 A", place: 1, points: 6, goalDiff: null },
  "Önnereds HK 1": { group: "3:09 A", place: 1, points: 5, goalDiff: null },
  "Hässleholms HF": { group: "3:04 A", place: 2, points: 4, goalDiff: null },
  "IK Sävehof Svart": { group: "3:03 A", place: 1, points: 6, goalDiff: null },
  "Kärra HF": { group: "3:10 A", place: 2, points: 4, goalDiff: null },
  "Lödde Vikings HK": { group: "3:05 A", place: 3, points: 2, goalDiff: null },
  "RP IF Linköping": { group: "3:19 B", place: 1, points: 6, goalDiff: null },
  "Anderstorps SK": { group: "3:03 A", place: 3, points: 2, goalDiff: null },
  "KFUM Trollhättan": { group: "3:06 A", place: 3, points: 2, goalDiff: null },
  "Lugi HF 2": { group: "3:05 A", place: 2, points: 4, goalDiff: null },
  "Strömstad HK": { group: "3:12 B", place: 1, points: 6, goalDiff: null },
  "Växjö HF Gul": { group: "3:01 A", place: 1, points: 6, goalDiff: null },
  "Eskilstuna Guif IF": { group: "3:02 A", place: 3, points: 2, goalDiff: null },
  "Gustavsbergs IF HK": { group: "3:09 A", place: 3, points: 2, goalDiff: null },
  "HK Ankaret Röd": { group: "3:08 A", place: 1, points: 4, goalDiff: null },
  "HK Halmstad": { group: "3:06 A", place: 1, points: 6, goalDiff: null },
  "Skövde HF 2": { group: "3:18 B", place: 1, points: 6, goalDiff: null },
  "Haninge HK": { group: "3:10 A", place: 3, points: 2, goalDiff: null },
  "Huddinge HK": { group: "3:20 B", place: 1, points: 6, goalDiff: null },
  "IF Hallby HK": { group: "3:06 A", place: 2, points: 4, goalDiff: null },
  "Mölndals HF": { group: "3:07 A", place: 1, points: 6, goalDiff: null },
  "Torslanda HK": { group: "3:04 A", place: 3, points: 2, goalDiff: null }
};
const STAGE3_GROUP_TABLES = {
  "3:01 A": [
    { team: "Växjö HF Gul", place: 1, points: 6 },
    { team: "GF Kroppskultur 1", place: 2, points: 4 },
    { team: "IFK Nyköping", place: 3, points: 2 },
    { team: "HK Eskil", place: 4, points: 0 }
  ],
  "3:02 A": [
    { team: "Tyresö Handboll", place: 1, points: 6 },
    { team: "Härnösands HF 1", place: 2, points: 4 },
    { team: "Eskilstuna Guif IF", place: 3, points: 2 },
    { team: "Örebro SK U", place: 4, points: 0 }
  ],
  "3:03 A": [
    { team: "IK Sävehof Svart", place: 1, points: 6 },
    { team: "KFUM Kalmar HK", place: 2, points: 4 },
    { team: "Anderstorps SK", place: 3, points: 2 },
    { team: "Eslövs HK", place: 4, points: 0 }
  ],
  "3:04 A": [
    { team: "Åhus Handboll", place: 1, points: 6 },
    { team: "Hässleholms HF", place: 2, points: 4 },
    { team: "Torslanda HK", place: 3, points: 2 },
    { team: "IK Sävehof Gul", place: 4, points: 0 }
  ],
  "3:05 A": [
    { team: "Alingsås HK", place: 1, points: 6 },
    { team: "Lugi HF 2", place: 2, points: 4 },
    { team: "Lödde Vikings HK", place: 3, points: 2 },
    { team: "HK Bollebygd", place: 4, points: 0 }
  ],
  "3:06 A": [
    { team: "HK Halmstad", place: 1, points: 6 },
    { team: "IF Hallby HK", place: 2, points: 4 },
    { team: "KFUM Trollhättan", place: 3, points: 2 },
    { team: "VästeråsIrsta HF", place: 4, points: 0 }
  ],
  "3:07 A": [
    { team: "Mölndals HF", place: 1, points: 6 },
    { team: "Redbergslids IK Blå", place: 2, points: 4 },
    { team: "IK Sund", place: 3, points: 2 },
    { team: "Årsta AIK HF", place: 4, points: 0 }
  ],
  "3:08 A": [
    { team: "HK Ankaret Röd", place: 1, points: 4 },
    { team: "Skara HF", place: 2, points: 4 },
    { team: "Skövde HF 1", place: 3, points: 2 },
    { team: "IK Bolton", place: 4, points: 2 }
  ],
  "3:09 A": [
    { team: "Önnereds HK 1", place: 1, points: 5 },
    { team: "Täby HBK 1", place: 2, points: 5 },
    { team: "Gustavsbergs IF HK", place: 3, points: 2 },
    { team: "HK Aranäs Vit", place: 4, points: 0 }
  ],
  "3:10 A": [
    { team: "Skuru IK", place: 1, points: 6 },
    { team: "Kärra HF", place: 2, points: 4 },
    { team: "Haninge HK", place: 3, points: 2 },
    { team: "Härnösands HF 2", place: 4, points: 0 }
  ],
  "3:11 B": [
    { team: "IFK Tumba HK", place: 1, points: 6 },
    { team: "Arbrå HK", place: 2, points: 4 },
    { team: "Skånela IF 2", place: 3, points: 2 },
    { team: "Enköpings HF", place: 4, points: 0 }
  ],
  "3:12 B": [
    { team: "Strömstad HK", place: 1, points: 6 },
    { team: "Borlänge HK 1", place: 2, points: 4 },
    { team: "AIK", place: 3, points: 2 },
    { team: "Edsbyns IF HF", place: 4, points: 0 }
  ],
  "3:13 B": [
    { team: "IFK Bankeryd", place: 1, points: 6 },
    { team: "LIF Lindesberg", place: 2, points: 4 },
    { team: "Lysekils HK", place: 3, points: 2 },
    { team: "Eksjö BK", place: 4, points: 0 }
  ],
  "3:14 B": [
    { team: "HF Karlskrona", place: 1, points: 6 },
    { team: "Lugi HF 1", place: 2, points: 3 },
    { team: "KFUM Lundagård", place: 3, points: 3 },
    { team: "HK Guldkroken Hjo", place: 4, points: 0 }
  ],
  "3:15 B": [
    { team: "Kävlinge HK", place: 1, points: 5 },
    { team: "Önnereds HK 2", place: 2, points: 5 },
    { team: "Höörs HK H 65", place: 3, points: 2 },
    { team: "H43 Lund HF Svart", place: 4, points: 0 }
  ],
  "3:16 B": [
    { team: "BK Heid", place: 1, points: 6 },
    { team: "H43 Lund HF Vit", place: 2, points: 2 },
    { team: "HK Ankaret Vit", place: 3, points: 2 },
    { team: "Ljunghusens HK", place: 4, points: 2 }
  ],
  "3:17 B": [
    { team: "Kungälvs HK", place: 1, points: 6 },
    { team: "IF Hellton Karlstad", place: 2, points: 4 },
    { team: "Vadstena HF", place: 3, points: 1 },
    { team: "Katrineholms AIK", place: 4, points: 1 }
  ],
  "3:18 B": [
    { team: "Skövde HF 2", place: 1, points: 6 },
    { team: "Ystads IF HF", place: 2, points: 4 },
    { team: "OV Helsingborg HK", place: 3, points: 2 },
    { team: "HK Björnen", place: 4, points: 0 }
  ],
  "3:19 B": [
    { team: "RP IF Linköping", place: 1, points: 6 },
    { team: "HK Lidköping", place: 2, points: 3 },
    { team: "GT Söder HK", place: 3, points: 2 },
    { team: "Skånela IF 1", place: 4, points: 1 }
  ],
  "3:20 B": [
    { team: "Huddinge HK", place: 1, points: 6 },
    { team: "Backa HK", place: 2, points: 3 },
    { team: "Strands IF", place: 3, points: 3 },
    { team: "Hammarby IF HF", place: 4, points: 0 }
  ]
};
const WEIGHT_PRESETS = {
  default: { stage1: 15, stage2: 20, stage3: 40, groupStrength: 25 },
  "tough-path": { stage1: 10, stage2: 15, stage3: 5, groupStrength: 70 },
  "stage2-path": { stage1: 5, stage2: 25, stage3: 0, groupStrength: 70 },
  "stage1-only": { stage1: 100, stage2: 0, stage3: 0, groupStrength: 0 },
  "group-only": { stage1: 0, stage2: 0, stage3: 0, groupStrength: 100 },
};

const elements = {
  teamFilter: document.querySelector("#team-filter"),
  districtFilter: document.querySelector("#district-filter"),
  weightStage1: document.querySelector("#weight-stage1"),
  weightStage2: document.querySelector("#weight-stage2"),
  weightStage3: document.querySelector("#weight-stage3"),
  weightGroupStrength: document.querySelector("#weight-group-strength"),
  weightStage1Value: document.querySelector("#weight-stage1-value"),
  weightStage2Value: document.querySelector("#weight-stage2-value"),
  weightStage3Value: document.querySelector("#weight-stage3-value"),
  weightGroupStrengthValue: document.querySelector("#weight-group-strength-value"),
  presetButtons: document.querySelectorAll(".preset-button"),
  weightsTotal: document.querySelector("#weights-total"),
  refreshLiveButton: document.querySelector("#refresh-live-button"),
  loadSnapshotButton: document.querySelector("#load-snapshot-button"),
  toggleBreakdownsButton: document.querySelector("#toggle-breakdowns-button"),
  statusText: document.querySelector("#status-text"),
  sourceNote: document.querySelector("#source-note"),
  metrics: document.querySelector("#metrics"),
  districtSummary: document.querySelector("#district-summary"),
  groupsGrid: document.querySelector("#groups-grid"),
  qualifiersList: document.querySelector("#qualifiers-list"),
  resultsCount: document.querySelector("#results-count"),
  sourcesList: document.querySelector("#sources-list"),
  metricTemplate: document.querySelector("#metric-template"),
  districtTemplate: document.querySelector("#district-template"),
  groupTemplate: document.querySelector("#group-template"),
  teamBreakdownTemplate: document.querySelector("#team-breakdown-template"),
  teamStage3Template: document.querySelector("#team-stage3-template"),
};

const state = {
  competition: null,
  groups: [],
  filters: {
    team: "",
    district: "",
  },
  weights: {
    stage1: 15,
    stage2: 20,
    stage3: 40,
    groupStrength: 25,
  },
  showBreakdowns: false,
  activeSourceLabel: "official snapshot",
};

initialize();

async function initialize() {
  wireEvents();
  await loadSnapshot();
}

function wireEvents() {
  elements.teamFilter.addEventListener("input", (event) => {
    state.filters.team = event.target.value.trim().toLowerCase();
    render();
  });

  elements.districtFilter.addEventListener("change", (event) => {
    state.filters.district = event.target.value;
    render();
  });

  bindWeightSlider(elements.weightStage1, "stage1", elements.weightStage1Value);
  bindWeightSlider(elements.weightStage2, "stage2", elements.weightStage2Value);
  bindWeightSlider(elements.weightStage3, "stage3", elements.weightStage3Value);
  bindWeightSlider(elements.weightGroupStrength, "groupStrength", elements.weightGroupStrengthValue);
  elements.presetButtons.forEach((button) => {
    button.addEventListener("click", () => applyWeightPreset(button.dataset.preset));
  });

  elements.refreshLiveButton.addEventListener("click", refreshLiveData);
  elements.loadSnapshotButton.addEventListener("click", loadSnapshot);
  elements.toggleBreakdownsButton.addEventListener("click", toggleBreakdowns);
  updateWeightLabels();
}

async function loadSnapshot() {
  setStatus("Loading official snapshot.");

  try {
    const response = await fetch(SNAPSHOT_URL);
    if (!response.ok) {
      throw new Error(`Snapshot request failed with status ${response.status}.`);
    }

    const snapshot = await response.json();
    applyDataset(snapshot, "official snapshot");
    setStatus(`Loaded ${state.groups.length} groups from the official snapshot.`);
  } catch (error) {
    setStatus(error.message || "Could not load snapshot.");
  }
}

async function refreshLiveData() {
  setStatus("Attempting live refresh from Profixio.");

  try {
    const [competitionResponse, goalDiffsResponse] = await Promise.all([
      fetchLiveResource(PROXY_URLS.competition, LIVE_SOURCE_URL, "text"),
      loadLiveStage3GoalDiffs(),
    ]);

    if (!competitionResponse.ok) {
      throw new Error(`Live request failed with status ${competitionResponse.status}.`);
    }

    const competitionHtml = competitionResponse.data;
    const liveDataset = parseProfixioCompetitionPage(competitionHtml);

    const stage3GoalDiffs = goalDiffsResponse.ok ? goalDiffsResponse.data : {};

    mergeStage3GoalDiffs(liveDataset.groups, stage3GoalDiffs);
    applyDataset(liveDataset, "live Profixio page");
    const mappedGoalDiffs = Object.keys(stage3GoalDiffs).length;
    setStatus(`Live refresh succeeded. Parsed ${state.groups.length} groups and ${mappedGoalDiffs} Stage 3 goal differences from Profixio.`);
  } catch (error) {
    setStatus(error.message || "Live refresh failed.");
    elements.sourceNote.textContent =
      "Live refresh failed. In a desktop browser, run `node server.js` so the local `/api/profixio/*` proxy can fetch Profixio server-side. Inside Capacitor, this app can use native HTTP when the plugin is available.";
  }
}

async function fetchLiveResource(proxyUrl, directUrl, responseType) {
  const nativeHttp = getCapacitorHttp();

  if (nativeHttp && directUrl) {
    const nativeResponse = await fetchViaCapacitor(nativeHttp, directUrl, responseType);
    if (nativeResponse.ok) {
      return nativeResponse;
    }
  }

  try {
    const proxyResponse = await fetch(proxyUrl, { cache: "no-store" });
    const proxyData = responseType === "json"
      ? await proxyResponse.json()
      : await proxyResponse.text();

    return {
      ok: proxyResponse.ok,
      status: proxyResponse.status,
      data: proxyData,
    };
  } catch {
    if (!directUrl) {
      throw new Error("Proxy request failed and no direct URL is available.");
    }
  }

  const directResponse = await fetch(directUrl, { cache: "no-store" });
  const directData = responseType === "json"
    ? await directResponse.json()
    : await directResponse.text();

  return {
    ok: directResponse.ok,
    status: directResponse.status,
    data: directData,
  };
}

async function loadLiveStage3GoalDiffs() {
  const nativeHttp = getCapacitorHttp();

  if (nativeHttp) {
    const [stage3AResponse, stage3BResponse] = await Promise.all([
      fetchViaCapacitor(nativeHttp, STAGE3_A_TABLES_URL, "text"),
      fetchViaCapacitor(nativeHttp, STAGE3_B_TABLES_URL, "text"),
    ]);

    if (stage3AResponse.ok || stage3BResponse.ok) {
      return {
        ok: true,
        status: 200,
        data: {
          ...parseStage3GoalDiffs(stage3AResponse.ok ? stage3AResponse.data : ""),
          ...parseStage3GoalDiffs(stage3BResponse.ok ? stage3BResponse.data : ""),
        },
      };
    }
  }

  return fetchLiveResource(PROXY_URLS.stage3GoalDiffs, null, "json");
}

function getCapacitorHttp() {
  const capacitor = window.Capacitor;
  if (!capacitor || typeof capacitor.isNativePlatform !== "function" || !capacitor.isNativePlatform()) {
    return null;
  }

  return window.CapacitorHttp || capacitor.Plugins?.[CAPACITOR_HTTP_PLUGIN_ID] || null;
}

async function fetchViaCapacitor(nativeHttp, url, responseType) {
  try {
    const response = await nativeHttp.request({
      url,
      method: "GET",
      responseType: responseType === "json" ? "json" : "text",
      headers: {
        Accept: responseType === "json"
          ? "application/json,text/plain;q=0.9,*/*;q=0.8"
          : "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
      connectTimeout: 15000,
      readTimeout: 15000,
    });

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error,
    };
  }
}

function applyDataset(dataset, sourceLabel) {
  state.competition = dataset.competition;
  state.groups = dataset.groups;
  state.activeSourceLabel = sourceLabel;
  elements.sourceNote.textContent =
    `Current source: ${sourceLabel}. The fallback snapshot is bundled locally so the app still works offline.`;
  populateDistrictFilter(dataset.groups);
  render();
}

function populateDistrictFilter(groups) {
  const selectedValue = state.filters.district;
  const districts = Array.from(new Set(groups.flatMap((group) => group.teams.map((team) => team.district)))).sort();

  elements.districtFilter.innerHTML = '<option value="">All districts</option>';
  districts.forEach((district) => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    elements.districtFilter.appendChild(option);
  });

  elements.districtFilter.value = districts.includes(selectedValue) ? selectedValue : "";
  state.filters.district = elements.districtFilter.value;
}

function render() {
  if (!state.competition) {
    return;
  }

  const filteredGroups = getFilteredGroups();
  renderMetrics(filteredGroups);
  renderDistrictSummary(filteredGroups);
  renderQualifiers(filteredGroups);
  renderGroups(filteredGroups);
  renderSources();
}

function bindWeightSlider(element, key, valueElement) {
  element.addEventListener("input", (event) => {
    state.weights[key] = Number(event.target.value);
    valueElement.textContent = `${state.weights[key]}%`;
    updateWeightLabels();
    render();
  });
}

function updateWeightLabels() {
  elements.weightStage1Value.textContent = `${state.weights.stage1}%`;
  elements.weightStage2Value.textContent = `${state.weights.stage2}%`;
  elements.weightStage3Value.textContent = `${state.weights.stage3}%`;
  elements.weightGroupStrengthValue.textContent = `${state.weights.groupStrength}%`;

  const total =
    state.weights.stage1 +
    state.weights.stage2 +
    state.weights.stage3 +
    state.weights.groupStrength;

  elements.weightsTotal.textContent = `Total ${total}%`;
  elements.weightsTotal.classList.toggle("is-invalid", total !== 100);
  elements.toggleBreakdownsButton.textContent = state.showBreakdowns ? "Hide score breakdowns" : "Show score breakdowns";
  updatePresetButtonState();
}

function toggleBreakdowns() {
  state.showBreakdowns = !state.showBreakdowns;
  updateWeightLabels();
  render();
}

function applyWeightPreset(presetKey) {
  const preset = WEIGHT_PRESETS[presetKey];
  if (!preset) {
    return;
  }

  state.weights = { ...preset };
  elements.weightStage1.value = String(preset.stage1);
  elements.weightStage2.value = String(preset.stage2);
  elements.weightStage3.value = String(preset.stage3);
  elements.weightGroupStrength.value = String(preset.groupStrength);
  updateWeightLabels();
  render();
}

function updatePresetButtonState() {
  const activePresetKey = Object.entries(WEIGHT_PRESETS).find(([, preset]) =>
    preset.stage1 === state.weights.stage1 &&
    preset.stage2 === state.weights.stage2 &&
    preset.stage3 === state.weights.stage3 &&
    preset.groupStrength === state.weights.groupStrength
  )?.[0];

  elements.presetButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === activePresetKey);
  });
}

function getFilteredGroups() {
  return state.groups
    .map((group) => ({
      ...group,
      teams: group.teams.filter(matchesFilters),
    }))
    .filter((group) => group.teams.length);
}

function matchesFilters(team) {
  const teamMatch =
    !state.filters.team || team.name.toLowerCase().includes(state.filters.team);
  const districtMatch =
    !state.filters.district || team.district === state.filters.district;

  return teamMatch && districtMatch;
}

function renderMetrics(groups) {
  const teams = groups.flatMap((group) => group.teams);
  const representedDistricts = new Set(teams.map((team) => team.district)).size;
  const hiddenTeams = state.groups.flatMap((group) => group.teams).length - teams.length;

  const metrics = [
    { label: "Groups shown", value: groups.length },
    { label: "Teams shown", value: teams.length },
    { label: "Districts shown", value: representedDistricts },
    { label: "Only winners advance", value: groups.length },
    { label: "Teams eliminated in stage 4", value: Math.max(teams.length - groups.length, 0) },
    { label: "Hidden by filters", value: hiddenTeams },
  ];

  elements.metrics.innerHTML = "";
  metrics.forEach((metric) => {
    const fragment = elements.metricTemplate.content.cloneNode(true);
    fragment.querySelector(".metric-label").textContent = metric.label;
    fragment.querySelector(".metric-value").textContent = metric.value;
    elements.metrics.appendChild(fragment);
  });
}

function renderDistrictSummary(groups) {
  const teams = groups.flatMap((group) => group.teams);
  const counts = teams.reduce((accumulator, team) => {
    accumulator[team.district] = (accumulator[team.district] || 0) + 1;
    return accumulator;
  }, {});

  const entries = Object.entries(counts).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const highestCount = entries.length ? entries[0][1] : 1;

  elements.districtSummary.innerHTML = "";

  entries.forEach(([district, count]) => {
    const fragment = elements.districtTemplate.content.cloneNode(true);
    fragment.querySelector(".district-name").textContent = district;
    fragment.querySelector(".district-count").textContent = `${count} teams`;
    fragment.querySelector(".district-bar-fill").style.width = `${(count / highestCount) * 100}%`;
    elements.districtSummary.appendChild(fragment);
  });
}

function renderGroups(groups) {
  elements.groupsGrid.innerHTML = "";
  elements.groupsGrid.classList.toggle("has-breakdowns", state.showBreakdowns);
  elements.resultsCount.textContent = `${groups.length} groups shown from ${state.activeSourceLabel}.`;

  groups.forEach((group) => {
    const rankedTeams = getRankedTeams(group.teams);
    const predictedWinner = rankedTeams[0];
    const fragment = elements.groupTemplate.content.cloneNode(true);
    fragment.querySelector(".group-label").textContent = group.stageLabel;
    fragment.querySelector(".group-name").textContent = group.name;
    const teamList = fragment.querySelector(".team-list");

    rankedTeams.forEach((team) => {
      const stage3 = getStage3Data(team.name);
      const stage3Color = getStage3Color(team.name);
      const scoreBreakdown = getScoreBreakdown(team.name);
      const item = document.createElement("li");
      item.className = "team-row";
      item.title = scoreBreakdown.tooltip;
      if (stage3Color.className) {
        item.classList.add(stage3Color.className);
      }
      if (stage3Color.accent) {
        item.style.setProperty("--stage3-accent", stage3Color.accent);
        item.style.setProperty("--stage3-bg", stage3Color.background);
      }
      if (state.filters.team && team.name.toLowerCase().includes(state.filters.team)) {
        item.classList.add("is-match");
      }
      if (predictedWinner?.name === team.name) {
        item.classList.add("is-predicted-winner");
      }
      const winnerBadge = predictedWinner?.name === team.name
        ? '<span class="winner-star" title="Projected Stage 4 group winner">★</span>'
        : "";
      item.innerHTML = `
        <div class="team-main">
          <div class="team-head">
            <span class="team-name"><span class="team-title">${winnerBadge}${team.name}</span><button type="button" class="info-button" aria-label="Show score breakdown">i</button></span>
          </div>
          <span class="team-district">${team.district}</span>
        </div>
      `;
      const infoButton = item.querySelector(".info-button");
      const teamMain = item.querySelector(".team-main");
      infoButton.addEventListener("click", (event) => {
        event.stopPropagation();
        window.alert(scoreBreakdown.tooltip);
      });

      teamMain.appendChild(createStage3Element(stage3));

      if (state.showBreakdowns) {
        item.appendChild(createBreakdownElement(scoreBreakdown));
      }

      teamList.appendChild(item);
    });

    elements.groupsGrid.appendChild(fragment);
  });
}

function renderQualifiers(groups) {
  elements.qualifiersList.innerHTML = "";

  const qualifiers = groups.map((group) => {
    const rankedTeams = getRankedTeams(group.teams);
    const projectedWinner = rankedTeams[0];
    if (!projectedWinner) {
      return null;
    }

    return {
      groupName: group.name,
      district: projectedWinner.district,
      teamName: projectedWinner.name,
      score: projectedWinner.predictionScore,
    };
  })
    .filter(Boolean)
    .sort((left, right) =>
      right.score - left.score ||
      left.groupName.localeCompare(right.groupName)
    );

  qualifiers.forEach((qualifier) => {
    const stage3 = getStage3Data(qualifier.teamName);
    const stage3Color = getStage3Color(qualifier.teamName);
    const item = document.createElement("li");
    item.className = "qualifier-row";
    if (stage3Color.className) {
      item.classList.add(stage3Color.className);
    }
    if (stage3Color.accent) {
      item.style.setProperty("--stage3-accent", stage3Color.accent);
      item.style.setProperty("--stage3-bg", stage3Color.background);
    }
    item.innerHTML = `
      <div class="qualifier-head">
        <div class="qualifier-copy">
          <span class="qualifier-team">${qualifier.teamName}</span>
          <span class="qualifier-meta">${qualifier.groupName} | ${qualifier.district}</span>
        </div>
        <span class="qualifier-score">${qualifier.score.toFixed(1)}</span>
      </div>
    `;
    const stage3Element = createStage3Element(stage3);
    stage3Element.firstElementChild?.classList.add("team-stage3-strip-compact");
    item.appendChild(stage3Element);
    elements.qualifiersList.appendChild(item);
  });
}

function renderSources() {
  const sources = state.competition.sources || [];
  elements.sourcesList.innerHTML = "";

  sources.forEach((source) => {
    const item = document.createElement("li");
    item.innerHTML = `<a class="source-link" href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`;
    elements.sourcesList.appendChild(item);
  });
}

function setStatus(message) {
  elements.statusText.textContent = message;
}

function getStage3Summary(teamName) {
  const stage3 = STAGE3_LOOKUP[teamName];
  if (!stage3) {
    return "Stage 3: source not mapped yet";
  }

  const goalDiffLabel = stage3.goalDiff === null ? "GD n/a" : `GD ${formatSignedNumber(stage3.goalDiff)}`;
  return `Stage 3: ${ordinal(stage3.place)} in ${stage3.group} | ${stage3.points} pts | ${goalDiffLabel}`;
}

function getStage3Data(teamName) {
  const stage3 = STAGE3_LOOKUP[teamName];
  if (!stage3) {
    return {
      group: "n/a",
      place: "n/a",
      points: "n/a",
      goalDiff: "n/a",
    };
  }

  return {
    group: stage3.group,
    place: `${stage3.place}`,
    points: `${stage3.points}`,
    goalDiff: stage3.goalDiff === null ? "n/a" : formatSignedNumber(stage3.goalDiff),
  };
}

function getPredictedWinner(teams) {
  return getRankedTeams(teams)[0];
}

function getRankedTeams(teams) {
  return [...teams]
    .map((team) => ({
      ...team,
      predictionScore: getPredictionScore(team.name),
    }))
    .sort((left, right) =>
      right.predictionScore - left.predictionScore ||
      right.name.localeCompare(left.name) * -1
    );
}

function getPredictionScore(teamName) {
  return getScoreBreakdown(teamName).totalScore;
}

function getScoreBreakdown(teamName) {
  const profile = getTeamProfile(teamName);
  if (!profile) {
    return {
      totalScore: 0,
      tooltip: "No prediction data available.",
    };
  }

  const totalWeight =
    state.weights.stage1 +
    state.weights.stage2 +
    state.weights.stage3 +
    state.weights.groupStrength;

  if (!totalWeight) {
    return {
      totalScore: 0,
      tooltip: "All weights are set to 0%.",
    };
  }

  const components = [
    {
      label: "Stage 1",
      raw: profile.stage1,
      weight: state.weights.stage1,
    },
    {
      label: "Stage 2",
      raw: profile.stage2,
      weight: state.weights.stage2,
    },
    {
      label: "Stage 3",
      raw: profile.stage3,
      weight: state.weights.stage3,
    },
    {
      label: "Group strength",
      raw: profile.groupStrength,
      weight: state.weights.groupStrength,
    },
  ];

  const weightedSum = components.reduce((sum, component) => {
    return sum + (component.raw * component.weight);
  }, 0);

  const totalScore = weightedSum / totalWeight;
  const tooltipLines = [
    `${teamName}`,
    `Weighted score: ${totalScore.toFixed(1)}`,
    ...components.map((component) =>
      `${component.label}: ${component.raw.toFixed(1)} x ${component.weight}%`
    ),
  ];

  return {
    totalScore,
    components,
    tooltip: tooltipLines.join("\n"),
  };
}

function createBreakdownElement(scoreBreakdown) {
  const fragment = elements.teamBreakdownTemplate.content.cloneNode(true);
  fragment.querySelector(".team-breakdown-total").textContent = `Weighted score: ${scoreBreakdown.totalScore.toFixed(1)}`;
  const breakdownGrid = fragment.querySelector(".team-breakdown-grid");

  scoreBreakdown.components.forEach((component) => {
    const cell = document.createElement("div");
    cell.className = "team-breakdown-cell";
    cell.innerHTML = `
      <span>${component.label}</span>
      <strong>${component.raw.toFixed(1)}</strong>
      <small>${component.weight}% weight</small>
    `;
    breakdownGrid.appendChild(cell);
  });

  return fragment;
}

function createStage3Element(stage3) {
  const fragment = elements.teamStage3Template.content.cloneNode(true);
  fragment.querySelector(".team-stage3-group").textContent = stage3.group;
  fragment.querySelector(".team-stage3-place").textContent = stage3.place;
  fragment.querySelector(".team-stage3-points").textContent = stage3.points;
  fragment.querySelector(".team-stage3-goal-diff").textContent = stage3.goalDiff;
  return fragment;
}

function getStage3Color(teamName) {
  const stage3 = STAGE3_LOOKUP[teamName];
  if (!stage3) {
    return { className: "", accent: "", background: "" };
  }

  if (stage3.group.endsWith("B")) {
    return {
      className: "stage3-b",
      accent: "",
      background: "",
    };
  }

  const groupNumber = stage3.group.split(":")[1]?.split(" ")[0] || "00";
  const numericSeed = Number(groupNumber);
  const paletteEntry = STAGE3_A_COLORS[numericSeed % STAGE3_A_COLORS.length];

  return {
    className: "stage3-a",
    accent: paletteEntry.accent,
    background: paletteEntry.background,
  };
}

function getTeamProfile(teamName) {
  const stage3 = STAGE3_LOOKUP[teamName];
  const stage2 = STAGE2_LOOKUP[teamName];
  const stage1 = STAGE1_LOOKUP[teamName];
  if (!stage3) {
    return null;
  }

  const stage3Form = getStage3FormScore(stage3);
  const groupStrength = getStage3GroupStrengthScore(stage3.group);
  const stage2Form = getRoundFormScore(stage2);
  const stage1Form = getRoundFormScore(stage1);

  return {
    stage1: stage1Form,
    stage2: stage2Form,
    stage3: stage3Form,
    groupStrength,
  };
}

function getRoundFormScore(round) {
  if (!round) {
    return 0;
  }

  const pointsScore = round.maxPoints ? (round.points / round.maxPoints) * 100 : 0;
  const placementScore = getPlacementScore(round.place);
  return (pointsScore * 0.7) + (placementScore * 0.3);
}

function getStage3FormScore(stage3) {
  const pointsScore = (stage3.points / 6) * 100;
  const placementScore = getPlacementScore(stage3.place);
  const pathBonus = stage3.group.endsWith("A") ? 8 : 0;
  return (pointsScore * 0.75) + (placementScore * 0.25) + pathBonus;
}

function getStage3GroupStrengthScore(groupId) {
  const groupEntries = STAGE3_GROUP_TABLES[groupId];
  if (!groupEntries || !groupEntries.length) {
    return 50;
  }

  const averagePoints = groupEntries.reduce((sum, entry) => sum + entry.points, 0) / groupEntries.length;
  const runnerUpPoints = groupEntries[1]?.points || 0;
  const thirdPlacePoints = groupEntries[2]?.points || 0;
  const competitiveness = ((runnerUpPoints + thirdPlacePoints) / 12) * 100;
  const averageStrength = (averagePoints / 6) * 100;

  return (averageStrength * 0.45) + (competitiveness * 0.55);
}

function getPlacementScore(place) {
  const placementBase = { 1: 100, 2: 74, 3: 48, 4: 22, 5: 0 };
  return placementBase[place] ?? 0;
}

function ordinal(value) {
  const labels = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th" };
  return labels[value] || `${value}th`;
}

function formatSignedNumber(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function parseProfixioCompetitionPage(html) {
  const documentNode = new DOMParser().parseFromString(html, "text/html");
  const normalizedLines = documentNode.body.textContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const groupIds = [
    "4:01 A",
    "4:02 A",
    "4:03 A",
    "4:04 A",
    "4:05 A",
    "4:06 A",
    "4:07 A",
    "4:08 A",
  ];

  const districtByTeam = getDistrictLookup();
  const groups = groupIds.map((groupId) => {
    const marker = `Steg 4 A | Grupp ${groupId}`;
    const startIndex = normalizedLines.indexOf(marker);
    if (startIndex === -1) {
      throw new Error(`Could not find ${marker} in live source.`);
    }

    const teams = normalizedLines
      .slice(startIndex + 1, startIndex + 6)
      .map((teamName) => ({
        name: teamName,
        district: districtByTeam[teamName] || "Unknown",
      }));

    return {
      id: groupId,
      name: `Group ${groupId}`,
      stageLabel: "Steg 4 A",
      teams,
    };
  });

  return {
    competition: {
      name: "USM F14",
      season: "2025-2026",
      ageGroup: "Girls born 2011",
      stage: "Steg 4 A",
      stageDates: "2026-03-21 to 2026-03-22",
      finalDates: "2026-05-08 to 2026-05-10",
      qualificationRule: "Only the group winner in each of the eight groups qualifies for the final weekend.",
      sources: [
        {
          label: "Svenskhandboll USM",
          url: "https://www.svenskhandboll.se/handboll-i-sverige/tavling/usm",
        },
        {
          label: "Svenskhandboll F14 groupings",
          url: "https://www.svenskhandboll.se/handboll-i-sverige/tavling/usm/gruppindelningar/flickor-14",
        },
        {
          label: "Profixio F14 competition",
          url: LIVE_SOURCE_URL,
        },
      ],
    },
    groups,
  };
}

function parseStage3GoalDiffs(html) {
  const goalDiffs = {};
  let goalDiffIndex = -1;
  let headerCellCount = 0;
  const knownTeams = new Set(Object.keys(STAGE3_LOOKUP));
  const rowMatches = html.match(/<tr[\s\S]*?<\/tr>/g) || [];

  rowMatches.forEach((rowHtml) => {
    const cells = Array.from(rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)).map((match) =>
      normalizeHtmlCellText(match[1])
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

    const teamName = cells.find((cell) => knownTeams.has(cell));
    if (!teamName) {
      return;
    }

    const cellOffset = Math.max(cells.length - headerCellCount, 0);
    const rawGoalDiff = cells[goalDiffIndex + cellOffset];
    const goalDiffValue = parseSignedNumber(rawGoalDiff);
    if (goalDiffValue !== null) {
      goalDiffs[teamName] = goalDiffValue;
    }
  });

  return goalDiffs;
}

function parseSignedNumber(value) {
  const normalized = normalizeWhitespace(value).replace(/[−–]/g, "-");
  if (!/^[+-]?\d+$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeHtmlCellText(value) {
  return String(value || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeStage3GoalDiffs(groups, goalDiffs) {
  groups.forEach((group) => {
    group.teams.forEach((team) => {
      const stage3 = STAGE3_LOOKUP[team.name];
      if (stage3 && Number.isFinite(goalDiffs[team.name])) {
        stage3.goalDiff = goalDiffs[team.name];
      }
    });
  });
}

function getDistrictLookup() {
  return {
    "Eskilstuna Guif IF": "HF Mitt",
    "IFK Nyköping": "HF Mitt",
    "RP IF Linköping": "HF Mitt",
    "Härnösands HF 1": "HF Norr",
    "HF Karlskrona": "HF Syd",
    "HK Ankaret Röd": "HF Syd",
    "HK Halmstad": "HF Syd",
    "Hässleholms HF": "HF Syd",
    "IK Sund": "HF Syd",
    "KFUM Kalmar HK": "HF Syd",
    "Kävlinge HK": "HF Syd",
    "Lugi HF 2": "HF Syd",
    "Lödde Vikings HK": "HF Syd",
    "Växjö HF Gul": "HF Syd",
    "Åhus Handboll": "HF Syd",
    "Alingsås HK": "HF Väst",
    "Anderstorps SK": "HF Väst",
    "BK Heid": "HF Väst",
    "GF Kroppskultur 1": "HF Väst",
    "IF Hallby HK": "HF Väst",
    "IFK Bankeryd": "HF Väst",
    "IK Sävehof Svart": "HF Väst",
    "KFUM Trollhättan": "HF Väst",
    "Kungälvs HK": "HF Väst",
    "Kärra HF": "HF Väst",
    "Mölndals HF": "HF Väst",
    "Redbergslids IK Blå": "HF Väst",
    "Skara HF": "HF Väst",
    "Skövde HF 1": "HF Väst",
    "Skövde HF 2": "HF Väst",
    "Strömstad HK": "HF Väst",
    "Torslanda HK": "HF Väst",
    "Önnereds HK 1": "HF Väst",
    "Gustavsbergs IF HK": "HF Öst",
    "Haninge HK": "HF Öst",
    "Huddinge HK": "HF Öst",
    "IFK Tumba HK": "HF Öst",
    "Skuru IK": "HF Öst",
    "Tyresö Handboll": "HF Öst",
    "Täby HBK 1": "HF Öst",
  };
}
