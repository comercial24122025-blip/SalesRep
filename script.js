const API_STATE_URL = "/api/state";
const API_SAVE_URL = "/api/save";
const API_RESET_DEMO_URL = "/api/reset-demo";
const API_DOWNLOAD_URL = "/api/download";
const STAGE_ORDER = ["Lead", "New Business", "Legal", "Signed", "DD", "Integration", "Go Live", "Live"];
const ALL_STAGES = [...STAGE_ORDER, "On Hold", "Closed Lost"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DEFAULT_DASHBOARD_YEARS = ["2024", "2025", "2026"];
const DEFAULT_MISSING_DEAL_VALUE = 25000;
const COMMIT_PROBABILITY = 0.75;
const TASK_SCOPE_TYPES = ["Client", "Market", "Target", "Operator", "Deal"];
const TASK_STATUS_OPTIONS = ["Open", "In Progress", "Waiting", "Blocked", "Done"];
const TASK_PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];
const STAGE_FORECAST_WEIGHTS = {
  Lead: 0.18,
  "New Business": 0.3,
  Legal: 0.5,
  Signed: 0.72,
  DD: 0.82,
  Integration: 0.91,
  "Go Live": 0.97,
  Live: 1,
  "On Hold": 0.08,
  "Closed Lost": 0,
};

const KPI_CATALOGUE = [
  {
    block: "New Business",
    name: "New Leads Generated",
    definition: "# de nuevos leads agregados en el periodo",
    stage: "New Business",
    frequency: "Weekly / Monthly",
    notes: "Count of distinct clients added",
  },
  {
    block: "New Business",
    name: "Qualified Opportunities",
    definition: "# de oportunidades activas con potencial comercial real",
    stage: "New Business",
    frequency: "Monthly",
    notes: "Use Raw Status / Next Action",
  },
  {
    block: "New Business",
    name: "Pipeline Value (€)",
    definition: "SUM of Deal Value (€) in New Business",
    stage: "New Business",
    frequency: "Monthly",
    notes: "From Pipeline Data",
  },
  {
    block: "Legal",
    name: "Deals in Legal",
    definition: "# de deals actualmente en Legal",
    stage: "Legal",
    frequency: "Weekly",
    notes: "Stage = Legal",
  },
  {
    block: "Legal",
    name: "Avg Time in Legal",
    definition: "Promedio de dias desde primer ticket legal hasta salida de la etapa",
    stage: "Legal",
    frequency: "Weekly",
    notes: "Requires start/end dates if later added",
  },
  {
    block: "DD",
    name: "Deals in DD",
    definition: "# de deals actualmente en DD",
    stage: "DD",
    frequency: "Weekly",
    notes: "Stage = DD",
  },
  {
    block: "DD",
    name: "DD Completion Rate %",
    definition: "Deals moved from DD to Integration / Deals in DD",
    stage: "DD",
    frequency: "Weekly",
    notes: "Process KPI",
  },
  {
    block: "DD",
    name: "DD Aging >30d",
    definition: "# de DD deals con last follow up mayor a 30 dias",
    stage: "DD",
    frequency: "Weekly",
    notes: "Use Last Follow Up",
  },
  {
    block: "Integration",
    name: "Clients in Integration",
    definition: "# de deals actualmente en Integration",
    stage: "Integration",
    frequency: "Weekly",
    notes: "Stage = Integration",
  },
  {
    block: "Integration",
    name: "Integration Pipeline Value (€)",
    definition: "SUM of Deal Value (€) in Integration",
    stage: "Integration",
    frequency: "Weekly",
    notes: "From Pipeline Data",
  },
  {
    block: "Integration",
    name: "Integration to Go Live Conversion %",
    definition: "Deals moved to Go Live / Deals in Integration",
    stage: "Integration",
    frequency: "Weekly",
    notes: "Requires stage progression tracking",
  },
  {
    block: "Go Live",
    name: "New Go Lives",
    definition: "# de clientes con sign-off legal + tecnico",
    stage: "Go Live",
    frequency: "Monthly",
    notes: "Stage = Go Live",
  },
  {
    block: "Go Live",
    name: "Go Live Value (€)",
    definition: "SUM of Deal Value (€) in Go Live",
    stage: "Go Live",
    frequency: "Monthly",
    notes: "From Pipeline Data",
  },
  {
    block: "Execution",
    name: "Signed to Live Conversion %",
    definition: "Go Live deals / Signed deals",
    stage: "Legal-DD-Integration-Go Live",
    frequency: "Monthly",
    notes: "Requires clear signed definition",
  },
  {
    block: "Market Growth",
    name: "Market Penetration %",
    definition: "Live clients in market / total target operators",
    stage: "Live / Growth",
    frequency: "Monthly",
    notes: "Target universe needed",
  },
  {
    block: "Collaboration",
    name: "Existing Client Growth (€)",
    definition: "Revenue uplift influenced in existing clients",
    stage: "Live / Growth",
    frequency: "Monthly",
    notes: "Manual input or linked rev data",
  },
];

const PIPELINE_CSV_COLUMNS = [
  ["Deal", "deal"],
  ["Client", "client"],
  ["Operator", "operator"],
  ["Group", "groupName"],
  ["KAM", "kam"],
  ["Type", "type"],
  ["Market", "market"],
  ["Jurisdiction", "jurisdiction"],
  ["Legal Entity", "legalEntity"],
  ["Site Status", "siteStatus"],
  ["Account Scope", "accountScope"],
  ["Prospect Date", "prospectDate"],
  ["Offer Date", "offerDate"],
  ["Integration Date", "integrationDate"],
  ["Live Date", "liveDate"],
  ["Platform", "platform"],
  ["Casino Name", "casinoName"],
  ["Ezugi ID", "ezugiId"],
  ["Evo Instance", "evoInstance"],
  ["Evo Skin ID", "evoSkinId"],
  ["Ezugi Skin", "ezugiSkin"],
  ["Stage", "stage"],
  ["Deal Value (EUR)", "dealValue"],
  ["Legal Status", "legalStatus"],
  ["DD Status", "ddStatus"],
  ["Integration Status", "integrationStatus"],
  ["Go Live Status", "goLiveStatus"],
  ["Signing ETA", "signingEta"],
  ["Signed ETA", "signedEta"],
  ["Last Follow Up", "lastFollowUp"],
  ["New Traffic", "newTraffic"],
  ["Lead Flag", "leadFlag"],
  ["Signed Flag", "signedFlag"],
  ["DD Started Flag", "ddStartedFlag"],
  ["DD Completed Flag", "ddCompletedFlag"],
  ["Integration Started Flag", "integrationStartedFlag"],
  ["Integration Completed Flag", "integrationCompletedFlag"],
  ["Go Live Flag", "goLiveFlag"],
  ["Status", "status"],
  ["Source", "source"],
  ["Website URL", "url"],
  ["Jira TKT", "jira"],
  ["DD TKT", "ddTicket"],
  ["Integration Chat", "skype"],
  ["Integration Email", "integrationEmail"],
  ["Comments", "comments"],
  ["Action Items", "actionItems"],
  ["Updates", "updates"],
  ["DB Column 1", "dbColumn1"],
  ["DB Column 2", "dbColumn2"],
  ["DB Column 3", "dbColumn3"],
  ["DB Column 4", "dbColumn4"],
  ["DB Column 5", "dbColumn5"],
  ["DB Column 6", "dbColumn6"],
  ["DB Column 7", "dbColumn7"],
  ["DB Column 8", "dbColumn8"],
  ["DB Column 9", "dbColumn9"],
  ["DB Column 10", "dbColumn10"],
  ["DB Column 11", "dbColumn11"],
  ["DB Column 12", "dbColumn12"],
  ["DB Column 13", "dbColumn13"],
  ["DB Column 14", "dbColumn14"],
];

const TARGET_CSV_COLUMNS = [
  ["Year", "year"],
  ["Market", "market"],
  ["Type", "type"],
  ["Platform", "platform"],
  ["New Traffic", "newTraffic"],
  ["New Signed", "newSigned"],
  ["Integrations", "integrations"],
  ["DD Pipeline", "ddPipeline"],
  ["New Go Live", "newGoLive"],
  ["Total Go Live", "totalGoLive"],
];

const TASK_CSV_COLUMNS = [
  ["Title", "title"],
  ["Scope Type", "scopeType"],
  ["Status", "status"],
  ["Priority", "priority"],
  ["Due Date", "dueDate"],
  ["Owner", "owner"],
  ["Deal", "deal"],
  ["Client", "client"],
  ["Operator", "operator"],
  ["Market", "market"],
  ["Target Year", "targetYear"],
  ["Jira Ticket", "jiraTicket"],
  ["Next Step", "nextStep"],
  ["Trace Log", "traceLog"],
  ["Notes", "notes"],
  ["Updated At", "updatedAt"],
];

const appBanner = document.getElementById("app-banner");
const dealForm = document.getElementById("deal-form");
const targetForm = document.getElementById("target-form");
const taskForm = document.getElementById("task-form");

const viewTabs = Array.from(document.querySelectorAll("[data-view-trigger]"));
const views = Array.from(document.querySelectorAll("[data-view]"));

const elements = {
  focusSummary: document.getElementById("focus-summary"),
  globalFilterYear: document.getElementById("global-filter-year"),
  globalFilterQuarter: document.getElementById("global-filter-quarter"),
  globalFilterMonth: document.getElementById("global-filter-month"),
  heroPipelineValue: document.getElementById("hero-pipeline-value"),
  heroSignedCount: document.getElementById("hero-signed-count"),
  heroLiveCount: document.getElementById("hero-live-count"),
  heroDdAging: document.getElementById("hero-dd-aging"),
  stageOverview: document.getElementById("stage-overview"),
  dashboardStageSummary: document.getElementById("dashboard-stage-summary"),
  forecastSummary: document.getElementById("forecast-summary"),
  forecastMarkets: document.getElementById("forecast-markets"),
  forecastOperators: document.getElementById("forecast-operators"),
  decisionBoard: document.getElementById("decision-board"),
  dashboardTimeline: document.getElementById("dashboard-timeline"),
  dashboardSpotlight: document.getElementById("dashboard-spotlight"),
  leadMarketCounts: document.getElementById("lead-market-counts"),
  leadMarketTracker: document.getElementById("latest-leads-by-market"),
  signalLegal: document.getElementById("signal-legal"),
  signalDd: document.getElementById("signal-dd"),
  signalIntegration: document.getElementById("signal-integration"),
  signalNewTraffic: document.getElementById("signal-new-traffic"),
  marketBars: document.getElementById("market-bars"),
  latamFocusGrid: document.getElementById("latam-focus-grid"),
  latamStageRadar: document.getElementById("latam-stage-radar"),
  riskList: document.getElementById("risk-list"),
  riskCount: document.getElementById("risk-count"),
  pipelineSearch: document.getElementById("pipeline-search"),
  pipelineSearchStatus: document.getElementById("pipeline-search-status"),
  pipelineSearchSuggestions: document.getElementById("pipeline-search-suggestions"),
  filterStage: document.getElementById("filter-stage"),
  filterMarket: document.getElementById("filter-market"),
  filterType: document.getElementById("filter-type"),
  filterTraffic: document.getElementById("filter-traffic"),
  pipelineCount: document.getElementById("pipeline-count"),
  pipelineSummary: document.getElementById("pipeline-summary"),
  pipelineStageStrip: document.getElementById("pipeline-stage-strip"),
  pipelineBoard: document.getElementById("pipeline-board"),
  dealTableBody: document.getElementById("deal-table-body"),
  dealFormTitle: document.getElementById("deal-form-title"),
  dealSubmitButton: document.getElementById("deal-submit-button"),
  targetFormTitle: document.getElementById("target-form-title"),
  targetSubmitButton: document.getElementById("target-submit-button"),
  targetSummaryTitle: document.getElementById("target-summary-title"),
  targetCount: document.getElementById("target-count"),
  targetProgress: document.getElementById("target-progress"),
  targetTableBody: document.getElementById("target-table-body"),
  taskFormTitle: document.getElementById("task-form-title"),
  taskSubmitButton: document.getElementById("task-submit-button"),
  taskSummary: document.getElementById("task-summary"),
  taskOpenCount: document.getElementById("task-open-count"),
  taskBoard: document.getElementById("task-board"),
  taskTableBody: document.getElementById("task-table-body"),
  kpiGrid: document.getElementById("kpi-grid"),
  kpiSearch: document.getElementById("kpi-search"),
};

const ui = {
  activeView: "dashboard",
  editingDealId: null,
  editingTargetId: null,
  editingTaskId: null,
  filters: {
    year: "All",
    quarter: "All",
    month: "All",
    search: "",
    stage: "All",
    market: "All",
    type: "All",
    traffic: "All",
  },
  pipelineFinder: {
    isOpen: false,
    activeIndex: -1,
    suggestions: [],
    selectedDealId: null,
  },
  kpiSearch: "",
};

let state = {
  deals: [],
  targets: [],
  kpis: KPI_CATALOGUE,
  tasks: [],
  latamReference: {
    markets: [],
    stageTotals: [],
    operatorsByMarket: [],
  },
};

const serverMeta = {
  workbookPath: "",
  workbookUrl: API_DOWNLOAD_URL,
  ready: false,
};

init();

async function init() {
  bindEvents();
  resetDealForm();
  resetTargetForm();
  resetTaskForm();
  await hydrateFromExcel();
  renderAll();
}

function bindEvents() {
  viewTabs.forEach((button) => {
    button.addEventListener("click", () => {
      ui.activeView = button.dataset.viewTrigger;
      renderViewState();
    });
  });

  document.getElementById("reset-demo-button").addEventListener("click", () => {
    if (!window.confirm("Esto reemplazara los datos actuales por la base de referencia tomada de tus archivos Excel. ¿Continuar?")) {
      return;
    }

    resetDemoState();
  });

  document.getElementById("reload-excel-button").addEventListener("click", async () => {
    await hydrateFromExcel();
    renderAll();
  });

  document.getElementById("download-excel-button").addEventListener("click", async () => {
    await downloadExcelWorkbook();
  });

  document.getElementById("clear-time-filters").addEventListener("click", () => {
    ui.filters.year = "All";
    ui.filters.quarter = "All";
    ui.filters.month = "All";
    renderAll();
  });

  elements.globalFilterYear.addEventListener("change", (event) => {
    ui.filters.year = event.target.value;
    renderAll();
  });

  elements.globalFilterQuarter.addEventListener("change", (event) => {
    ui.filters.quarter = event.target.value;
    if (ui.filters.month !== "All" && quarterFromMonthLabel(ui.filters.month) !== ui.filters.quarter) {
      ui.filters.month = "All";
    }
    renderAll();
  });

  elements.globalFilterMonth.addEventListener("change", (event) => {
    ui.filters.month = event.target.value;
    if (ui.filters.month !== "All") {
      ui.filters.quarter = quarterFromMonthLabel(ui.filters.month);
    }
    renderAll();
  });

  dealForm.addEventListener("submit", handleDealSubmit);
  document.getElementById("deal-cancel-button").addEventListener("click", () => {
    ui.editingDealId = null;
    resetDealForm();
    setBanner("Deal form cleared.", "default");
  });

  targetForm.addEventListener("submit", handleTargetSubmit);
  document.getElementById("target-cancel-button").addEventListener("click", () => {
    ui.editingTargetId = null;
    resetTargetForm();
    setBanner("Formulario de target limpio.", "default");
  });

  taskForm.addEventListener("submit", handleTaskSubmit);
  document.getElementById("task-cancel-button").addEventListener("click", () => {
    ui.editingTaskId = null;
    resetTaskForm();
    setBanner("Formulario de tarea limpio.", "default");
  });

  elements.pipelineSearch.addEventListener("input", (event) => {
    ui.filters.search = event.target.value.trim();
    ui.pipelineFinder.isOpen = true;
    ui.pipelineFinder.activeIndex = -1;
    ui.pipelineFinder.selectedDealId = null;
    renderPipeline();
  });

  elements.pipelineSearch.addEventListener("focus", () => {
    ui.pipelineFinder.isOpen = true;
    renderPipelineFinderSuggestions(getPipelineBaseDeals());
  });

  elements.pipelineSearch.addEventListener("blur", () => {
    window.setTimeout(() => {
      ui.pipelineFinder.isOpen = false;
      ui.pipelineFinder.activeIndex = -1;
      renderPipelineFinderSuggestions(getPipelineBaseDeals());
    }, 120);
  });

  elements.pipelineSearch.addEventListener("keydown", (event) => {
    handlePipelineFinderKeydown(event);
  });

  document.getElementById("clear-pipeline-search").addEventListener("click", () => {
    ui.filters.search = "";
    ui.pipelineFinder.isOpen = false;
    ui.pipelineFinder.activeIndex = -1;
    ui.pipelineFinder.selectedDealId = null;
    elements.pipelineSearch.value = "";
    renderPipeline();
    elements.pipelineSearch.focus();
  });

  elements.pipelineSearchSuggestions.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  elements.pipelineSearchSuggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-finder-index]");
    if (!button) {
      return;
    }

    selectPipelineFinderSuggestion(Number(button.dataset.finderIndex));
  });

  elements.filterStage.addEventListener("change", (event) => {
    ui.filters.stage = event.target.value;
    ui.pipelineFinder.activeIndex = -1;
    renderPipeline();
  });

  elements.filterMarket.addEventListener("change", (event) => {
    ui.filters.market = event.target.value;
    ui.pipelineFinder.activeIndex = -1;
    renderPipeline();
  });

  elements.filterType.addEventListener("change", (event) => {
    ui.filters.type = event.target.value;
    ui.pipelineFinder.activeIndex = -1;
    renderPipeline();
  });

  elements.filterTraffic.addEventListener("change", (event) => {
    ui.filters.traffic = event.target.value;
    ui.pipelineFinder.activeIndex = -1;
    renderPipeline();
  });

  elements.kpiSearch.addEventListener("input", (event) => {
    ui.kpiSearch = event.target.value.trim().toLowerCase();
    renderKpiCatalogue();
  });

  elements.pipelineBoard.addEventListener("click", handleDealAction);
  elements.dealTableBody.addEventListener("click", handleDealAction);
  elements.leadMarketTracker.addEventListener("click", handleDealAction);
  elements.leadMarketTracker.addEventListener("submit", handleLeadTrackerSubmit);
  elements.targetTableBody.addEventListener("click", handleTargetAction);
  elements.taskBoard.addEventListener("click", handleTaskAction);
  elements.taskTableBody.addEventListener("click", handleTaskAction);

  document.getElementById("export-pipeline-csv").addEventListener("click", () => {
    const rows = getFilteredDeals();
    const filename = buildExportFilename("pipeline-visible", "csv");
    downloadCsv(filename, rows, PIPELINE_CSV_COLUMNS);
    setBanner(`Pipeline CSV exported (${rows.length} visible deals).`, "success");
  });

  document.getElementById("export-targets-csv").addEventListener("click", () => {
    const rows = state.targets;
    const filename = buildExportFilename(`pipeline-targets-${getActiveTargetYear()}`, "csv");
    downloadCsv(filename, rows, TARGET_CSV_COLUMNS);
    setBanner(`CSV de targets exportado (${rows.length} registros).`, "success");
  });

  document.getElementById("export-tasks-csv").addEventListener("click", () => {
    const rows = state.tasks;
    const filename = buildExportFilename("pipeline-tasks", "csv");
    downloadCsv(filename, rows, TASK_CSV_COLUMNS);
    setBanner(`CSV de tareas exportado (${rows.length} registros).`, "success");
  });
}

async function hydrateFromExcel() {
  try {
    const response = await fetch(API_STATE_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`No fue posible leer el Excel (${response.status}).`);
    }

    const payload = await response.json();
    state = {
      deals: Array.isArray(payload.deals) ? payload.deals.map(normalizeDeal) : [],
      targets: Array.isArray(payload.targets) ? payload.targets.map(normalizeTarget) : [],
      kpis: Array.isArray(payload.kpis) && payload.kpis.length > 0 ? payload.kpis : KPI_CATALOGUE,
      tasks: Array.isArray(payload.tasks) ? payload.tasks.map(normalizeTask) : [],
      latamReference: normalizeLatamReference(payload.latamReference),
    };
    serverMeta.workbookPath = payload.workbookPath || "";
    serverMeta.workbookUrl = payload.workbookUrl || API_DOWNLOAD_URL;
    serverMeta.ready = true;
    setBanner(buildExcelBanner("Datos cargados desde Excel."), "success");
  } catch (error) {
    serverMeta.ready = false;
    state = createDefaultState();
    setBanner(
      "No pude conectarme al archivo Excel. Inicia `./start-server.sh` y recarga la app para trabajar con almacenamiento en Excel.",
      "danger"
    );
  }
}

async function persistState() {
  try {
    const response = await fetch(API_SAVE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        deals: state.deals,
        targets: state.targets,
        kpis: state.kpis,
        tasks: state.tasks,
      }),
    });

    if (!response.ok) {
      throw new Error(`No fue posible guardar en Excel (${response.status}).`);
    }

    const payload = await response.json();
    serverMeta.workbookPath = payload.workbookPath || serverMeta.workbookPath;
    serverMeta.ready = true;
    await hydrateFromExcel();
    return true;
  } catch (error) {
    serverMeta.ready = false;
    setBanner(
      "No se pudo persistir en Excel. Los cambios siguen en memoria, pero no quedaron guardados en el workbook.",
      "warn"
    );
    return false;
  }
}

function createDefaultState() {
  const year = new Date().getFullYear();

  return {
    deals: [
      normalizeDeal({
        id: "deal-1",
        deal: "AndesPay Launch",
        client: "Andes Telecom",
        type: "New Account",
        market: "Chile",
        platform: "Direct Carrier Billing",
        stage: "Legal",
        dealValue: 120000,
        dealValueAlt: 135000,
        signingEta: `${year}-05-15`,
        signingYear: year,
        signingMonth: 5,
        signedEta: `${year}-05-28`,
        legalStatus: "In Review",
        ddStatus: "Not Started",
        integrationStatus: "Not Started",
        goLiveStatus: "Not Started",
        newTraffic: true,
        comments: "Counterparty sent a fresh markup over Annex B.",
        actionItems: "Legal to respond on liability cap before Friday.",
        source: "Outbound",
        statusText: "Commercial approved. Waiting for legal redlines closure.",
        leadFlag: true,
        signedFlag: false,
        ddStartedFlag: false,
        ddCompletedFlag: false,
        integrationStartedFlag: false,
        integrationCompletedFlag: false,
        goLiveFlag: false,
        month: "Apr",
        evo: "Q2",
        status: "Active",
        agreement: "Negotiating",
        integration: "Backlog",
        dd: "Queued",
        lastFollowUp: `${year}-04-16`,
        brands: "Andes Mobile",
        entityInfo: "Andes Telecom Chile SpA",
        url: "https://example.com/andes",
        jira: "https://jira.example.com/browse/PIPE-104",
        ddTicket: "DD-240",
        skype: "andes-launch",
        integrationEmail: "ops@andespay.example",
        updates: "Need aligned signing plan with local legal team.",
      }),
      normalizeDeal({
        id: "deal-2",
        deal: "Iberia Upsell",
        client: "Iberia Media",
        type: "Existing Account",
        market: "Spain",
        platform: "Wallet",
        stage: "DD",
        dealValue: 76000,
        dealValueAlt: 81250,
        signingEta: `${year}-05-03`,
        signingYear: year,
        signingMonth: 5,
        signedEta: `${year}-05-18`,
        legalStatus: "Approved",
        ddStatus: "In Progress",
        integrationStatus: "Not Started",
        goLiveStatus: "Not Started",
        newTraffic: false,
        comments: "Finance requested tax residency docs.",
        actionItems: "Client to send KYB package and final ownership chart.",
        source: "AM Expansion",
        statusText: "DD package incomplete, follow-up every 3 business days.",
        leadFlag: false,
        signedFlag: true,
        ddStartedFlag: true,
        ddCompletedFlag: false,
        integrationStartedFlag: false,
        integrationCompletedFlag: false,
        goLiveFlag: false,
        month: "Apr",
        evo: "Q2",
        status: "Active",
        agreement: "Signed",
        integration: "Pending intake",
        dd: "Docs collection",
        lastFollowUp: `${year}-03-02`,
        handover: `${year}-05-23`,
        brands: "Iberia Plus",
        entityInfo: "Iberia Media S.L.",
        ddTicket: "DD-261",
        jira: "https://jira.example.com/browse/PIPE-131",
        integrationEmail: "launch@iberia.example",
        updates: "Potential risk if UBO docs do not arrive this week.",
      }),
      normalizeDeal({
        id: "deal-3",
        deal: "Baltic Stream",
        client: "Baltic Connect",
        type: "New Account",
        market: "Poland",
        platform: "Aggregator",
        stage: "Integration",
        dealValue: 98000,
        dealValueAlt: 110000,
        signingEta: `${year}-04-10`,
        signingYear: year,
        signingMonth: 4,
        signedEta: `${year}-04-18`,
        legalStatus: "Approved",
        ddStatus: "Completed",
        integrationStatus: "UAT",
        goLiveStatus: "Scheduled",
        newTraffic: true,
        comments: "Sandbox stable, UAT issue on callback retries.",
        actionItems: "Engineering to patch retry handling before launch rehearsal.",
        source: "Partner referral",
        statusText: "UAT in progress with launch rehearsal locked for next week.",
        leadFlag: true,
        signedFlag: true,
        ddStartedFlag: true,
        ddCompletedFlag: true,
        integrationStartedFlag: true,
        integrationCompletedFlag: false,
        goLiveFlag: false,
        month: "Apr",
        evo: "Q2",
        status: "Active",
        agreement: "Signed",
        integration: "UAT",
        dd: "Closed",
        lastFollowUp: `${year}-04-20`,
        handover: `${year}-04-24`,
        brands: "Baltic Prime",
        entityInfo: "Baltic Connect S.A.",
        url: "https://example.com/baltic",
        jira: "https://jira.example.com/browse/PIPE-140",
        ddTicket: "DD-275",
        integrationEmail: "integration@baltic.example",
        updates: "High confidence on go-live if regression passes.",
      }),
      normalizeDeal({
        id: "deal-4",
        deal: "Lusitano Reactivation",
        client: "Lusitano Telco",
        type: "Reactivation",
        market: "Portugal",
        platform: "SDK",
        stage: "Go Live",
        dealValue: 54000,
        dealValueAlt: 56000,
        signingEta: `${year}-03-02`,
        signingYear: year,
        signingMonth: 3,
        signedEta: `${year}-03-10`,
        legalStatus: "Approved",
        ddStatus: "Completed",
        integrationStatus: "Completed",
        goLiveStatus: "Scheduled",
        newTraffic: false,
        comments: "Waiting on final technical sign-off window from carrier.",
        actionItems: "Coordinate launch bridge and post-launch QA owner.",
        source: "Reactivation campaign",
        statusText: "All dependencies clear. Launch slot held for next Monday.",
        leadFlag: false,
        signedFlag: true,
        ddStartedFlag: true,
        ddCompletedFlag: true,
        integrationStartedFlag: true,
        integrationCompletedFlag: true,
        goLiveFlag: true,
        month: "Apr",
        evo: "Q2",
        status: "Launch Ready",
        agreement: "Signed",
        integration: "Ready",
        dd: "Closed",
        lastFollowUp: `${year}-04-19`,
        handover: `${year}-04-21`,
        brands: "Lusitano Play",
        entityInfo: "Lusitano Telecomunicacoes",
        integrationEmail: "delivery@lusitano.example",
        updates: "Commercial team preparing launch communication.",
      }),
      normalizeDeal({
        id: "deal-5",
        deal: "Nordic Wallet Expansion",
        client: "Nordic Wallet",
        type: "Upsell",
        market: "Sweden",
        platform: "Wallet",
        stage: "Live",
        dealValue: 88000,
        dealValueAlt: 90500,
        signingEta: `${year}-02-06`,
        signingYear: year,
        signingMonth: 2,
        signedEta: `${year}-02-12`,
        legalStatus: "Approved",
        ddStatus: "Completed",
        integrationStatus: "Completed",
        goLiveStatus: "Live",
        newTraffic: false,
        comments: "Expansion fully launched with stable conversion.",
        actionItems: "Track upside against Q2 forecast.",
        source: "Existing growth plan",
        statusText: "Operational and stable in production.",
        leadFlag: false,
        signedFlag: true,
        ddStartedFlag: true,
        ddCompletedFlag: true,
        integrationStartedFlag: true,
        integrationCompletedFlag: true,
        goLiveFlag: true,
        month: "Apr",
        evo: "Q2",
        status: "Live",
        agreement: "Signed",
        integration: "Closed",
        dd: "Closed",
        liveSince: `${year}-03-03`,
        lastFollowUp: `${year}-04-09`,
        brands: "Nordic Rewards",
        entityInfo: "Nordic Wallet AB",
        updates: "Now monitoring revenue uplift with AM team.",
      }),
      normalizeDeal({
        id: "deal-6",
        deal: "Caribe New Lead",
        client: "Caribe Digital",
        type: "New Account",
        market: "Dominican Republic",
        platform: "Direct Carrier Billing",
        stage: "New Business",
        dealValue: 46000,
        dealValueAlt: 50000,
        signingEta: `${year}-06-15`,
        signingYear: year,
        signingMonth: 6,
        legalStatus: "Not Started",
        ddStatus: "Not Started",
        integrationStatus: "Not Started",
        goLiveStatus: "Not Started",
        newTraffic: true,
        comments: "Discovery call completed. Strong appetite on gaming vertical.",
        actionItems: "Send pricing model and schedule legal kickoff.",
        source: "Inbound",
        statusText: "Commercially qualified, moving into first proposal round.",
        leadFlag: true,
        signedFlag: false,
        ddStartedFlag: false,
        ddCompletedFlag: false,
        integrationStartedFlag: false,
        integrationCompletedFlag: false,
        goLiveFlag: false,
        month: "Apr",
        evo: "Q2",
        status: "Qualified",
        agreement: "Not Started",
        integration: "Not Started",
        dd: "Not Started",
        lastFollowUp: `${year}-04-18`,
        brands: "Caribe Pay",
        entityInfo: "Caribe Digital SRL",
        updates: "Potential fast-track if pricing lands this week.",
      }),
      normalizeDeal({
        id: "deal-7",
        deal: "Adriatic Renewal",
        client: "Adriatic Mobile",
        type: "Renewal",
        market: "Croatia",
        platform: "Messaging",
        stage: "On Hold",
        dealValue: 39000,
        dealValueAlt: 39000,
        signingEta: `${year}-05-06`,
        signingYear: year,
        signingMonth: 5,
        legalStatus: "Blocked",
        ddStatus: "Pending Client",
        integrationStatus: "Not Started",
        goLiveStatus: "Not Started",
        newTraffic: false,
        comments: "Client procurement frozen due to internal reorganization.",
        actionItems: "Resume once procurement owner confirms budget release.",
        source: "Renewal motion",
        statusText: "Commercially viable but blocked by client-side procurement.",
        leadFlag: false,
        signedFlag: false,
        ddStartedFlag: true,
        ddCompletedFlag: false,
        integrationStartedFlag: false,
        integrationCompletedFlag: false,
        goLiveFlag: false,
        month: "Apr",
        evo: "Q2",
        status: "Blocked",
        agreement: "Blocked",
        integration: "Not Started",
        dd: "Waiting client",
        lastFollowUp: `${year}-03-05`,
        brands: "Adriatic Prime",
        entityInfo: "Adriatic Mobile d.o.o.",
        updates: "Keep warm until procurement reopens.",
      }),
    ],
    targets: [
      normalizeTarget({
        id: "target-1",
        year,
        market: "Spain",
        type: "Existing Account",
        platform: "Wallet",
        newTraffic: false,
        newSigned: 4,
        integrations: 5,
        ddPipeline: 3,
        newGoLive: 2,
        totalGoLive: 6,
      }),
      normalizeTarget({
        id: "target-2",
        year,
        market: "Chile",
        type: "New Account",
        platform: "Direct Carrier Billing",
        newTraffic: true,
        newSigned: 3,
        integrations: 2,
        ddPipeline: 2,
        newGoLive: 1,
        totalGoLive: 2,
      }),
      normalizeTarget({
        id: "target-3",
        year,
        market: "Poland",
        type: "New Account",
        platform: "Aggregator",
        newTraffic: true,
        newSigned: 2,
        integrations: 2,
        ddPipeline: 1,
        newGoLive: 1,
        totalGoLive: 1,
      }),
      normalizeTarget({
        id: "target-4",
        year,
        market: "Nordics",
        type: "Existing Account",
        platform: "Wallet",
        newTraffic: false,
        newSigned: 2,
        integrations: 3,
        ddPipeline: 1,
        newGoLive: 2,
        totalGoLive: 5,
      }),
    ],
    kpis: KPI_CATALOGUE,
    tasks: [],
    latamReference: {
      markets: [],
      stageTotals: [],
      operatorsByMarket: [],
    },
  };
}

function createEmptyDeal() {
  const now = new Date();
  return normalizeDeal({
    id: generateId("deal"),
    deal: "",
    client: "",
    type: "",
    market: "",
    platform: "",
    stage: "New Business",
    signingEta: "",
    signingYear: now.getFullYear(),
    signingMonth: now.getMonth() + 1,
    dealValue: null,
    dealValueAlt: null,
    legalStatus: "Not Started",
    ddStatus: "Not Started",
    integrationStatus: "Not Started",
    goLiveStatus: "Not Started",
    newTraffic: false,
    comments: "",
    actionItems: "",
    source: "",
    statusText: "",
    leadFlag: false,
    signedFlag: false,
    ddStartedFlag: false,
    ddCompletedFlag: false,
    integrationStartedFlag: false,
    integrationCompletedFlag: false,
    goLiveFlag: false,
    month: MONTH_LABELS[now.getMonth()],
    evo: `Q${Math.floor(now.getMonth() / 3) + 1}`,
    status: "Active",
    agreement: "Not Started",
    integration: "",
    dd: "",
    signedEta: "",
    liveSince: "",
    lastFollowUp: "",
    handover: "",
    brands: "",
    entityInfo: "",
    url: "",
    jira: "",
    ddTicket: "",
    skype: "",
    integrationEmail: "",
    updates: "",
  });
}

function createEmptyTarget() {
  return normalizeTarget({
    id: generateId("target"),
    year: new Date().getFullYear(),
    market: "",
    type: "",
    platform: "",
    newTraffic: false,
    newSigned: 0,
    newSignedValue: 0,
    integrations: 0,
    integrationsValue: 0,
    ddPipeline: 0,
    ddPipelineValue: 0,
    newGoLive: 0,
    newGoLiveValue: 0,
    totalGoLive: 0,
    totalGoLiveValue: 0,
  });
}

function createEmptyTask() {
  return normalizeTask({
    id: generateId("task"),
    title: "",
    scopeType: "Client",
    status: "Open",
    priority: "Medium",
    dueDate: "",
    owner: "",
    dealId: "",
    targetId: "",
    deal: "",
    client: "",
    operator: "",
    market: "",
    targetYear: getActiveTargetYear(),
    jiraTicket: "",
    traceLog: "",
    nextStep: "",
    notes: "",
    createdAt: "",
    updatedAt: "",
  });
}

function normalizeDeal(input) {
  const base = createDealShape();
  const resolvedDealValue = resolveDealValue(input);
  return {
    ...base,
    ...input,
    id: String(input.id || generateId("deal")),
    deal: normalizeDealName(input.deal),
    client: cleanText(input.client),
    type: normalizeDealType(input.type),
    market: normalizeDealMarket(input.market),
    platform: normalizeDealPlatform(input.platform),
    stage: normalizeDealStage(input.stage) || base.stage,
    legalStatus: cleanText(input.legalStatus),
    ddStatus: cleanText(input.ddStatus),
    integrationStatus: cleanText(input.integrationStatus),
    goLiveStatus: cleanText(input.goLiveStatus),
    comments: cleanText(input.comments),
    actionItems: cleanText(input.actionItems),
    source: cleanText(input.source),
    statusText: cleanText(input.statusText),
    month: cleanText(input.month),
    evo: cleanText(input.evo),
    operator: cleanText(input.operator),
    groupName: cleanText(input.groupName),
    kam: cleanText(input.kam),
    jurisdiction: cleanText(input.jurisdiction),
    legalEntity: cleanText(input.legalEntity),
    siteStatus: cleanText(input.siteStatus),
    accountScope: cleanText(input.accountScope),
    status: cleanText(input.status),
    agreement: cleanText(input.agreement),
    integration: cleanText(input.integration),
    dd: cleanText(input.dd),
    brands: cleanText(input.brands),
    entityInfo: cleanText(input.entityInfo),
    url: cleanText(input.url),
    jira: cleanText(input.jira),
    ddTicket: cleanText(input.ddTicket),
    skype: cleanText(input.skype),
    integrationEmail: cleanText(input.integrationEmail),
    updates: cleanText(input.updates),
    prospectDate: normalizeDateInput(input.prospectDate),
    offerDate: normalizeDateInput(input.offerDate),
    integrationDate: normalizeDateInput(input.integrationDate),
    liveDate: normalizeDateInput(input.liveDate),
    casinoName: cleanText(input.casinoName),
    ezugiId: cleanText(input.ezugiId),
    evoInstance: cleanText(input.evoInstance),
    evoSkinId: cleanText(input.evoSkinId),
    ezugiSkin: cleanText(input.ezugiSkin),
    dbColumn1: cleanText(input.dbColumn1),
    dbColumn2: cleanText(input.dbColumn2),
    dbColumn3: cleanText(input.dbColumn3),
    dbColumn4: cleanText(input.dbColumn4),
    dbColumn5: cleanText(input.dbColumn5),
    dbColumn6: cleanText(input.dbColumn6),
    dbColumn7: cleanText(input.dbColumn7),
    dbColumn8: cleanText(input.dbColumn8),
    dbColumn9: cleanText(input.dbColumn9),
    dbColumn10: cleanText(input.dbColumn10),
    dbColumn11: cleanText(input.dbColumn11),
    dbColumn12: cleanText(input.dbColumn12),
    dbColumn13: cleanText(input.dbColumn13),
    dbColumn14: cleanText(input.dbColumn14),
    signingYear: toNullableNumber(input.signingYear),
    signingMonth: toNullableNumber(input.signingMonth),
    dealValue: resolvedDealValue,
    dealValueAlt: toNullableNumber(input.dealValueAlt),
    newTraffic: Boolean(input.newTraffic),
    leadFlag: Boolean(input.leadFlag),
    signedFlag: Boolean(input.signedFlag),
    ddStartedFlag: Boolean(input.ddStartedFlag),
    ddCompletedFlag: Boolean(input.ddCompletedFlag),
    integrationStartedFlag: Boolean(input.integrationStartedFlag),
    integrationCompletedFlag: Boolean(input.integrationCompletedFlag),
    goLiveFlag: Boolean(input.goLiveFlag),
  };
}

function normalizeTarget(input) {
  const base = createTargetShape();
  return {
    ...base,
    ...input,
    id: String(input.id || generateId("target")),
    year: toNullableNumber(input.year) || new Date().getFullYear(),
    market: normalizeDealMarket(input.market),
    type: normalizeDealType(input.type),
    platform: normalizeDealPlatform(input.platform),
    newTraffic: Boolean(input.newTraffic),
    newSigned: toNullableNumber(input.newSigned) || 0,
    newSignedValue: toNullableNumber(input.newSignedValue) || 0,
    integrations: toNullableNumber(input.integrations) || 0,
    integrationsValue: toNullableNumber(input.integrationsValue) || 0,
    ddPipeline: toNullableNumber(input.ddPipeline) || 0,
    ddPipelineValue: toNullableNumber(input.ddPipelineValue) || 0,
    newGoLive: toNullableNumber(input.newGoLive) || 0,
    newGoLiveValue: toNullableNumber(input.newGoLiveValue) || 0,
    totalGoLive: toNullableNumber(input.totalGoLive) || 0,
    totalGoLiveValue: toNullableNumber(input.totalGoLiveValue) || 0,
  };
}

function normalizeTask(input) {
  const base = createTaskShape();
  return {
    ...base,
    ...input,
    id: String(input.id || generateId("task")),
    title: cleanText(input.title),
    scopeType: TASK_SCOPE_TYPES.includes(cleanText(input.scopeType)) ? cleanText(input.scopeType) : base.scopeType,
    status: TASK_STATUS_OPTIONS.includes(cleanText(input.status)) ? cleanText(input.status) : base.status,
    priority: TASK_PRIORITY_OPTIONS.includes(cleanText(input.priority)) ? cleanText(input.priority) : base.priority,
    dueDate: normalizeDateInput(input.dueDate),
    owner: cleanText(input.owner),
    dealId: cleanText(input.dealId),
    targetId: cleanText(input.targetId),
    deal: cleanText(input.deal),
    client: cleanText(input.client),
    operator: cleanText(input.operator),
    market: normalizeDealMarket(input.market),
    targetYear: toNullableNumber(input.targetYear),
    jiraTicket: cleanText(input.jiraTicket),
    traceLog: cleanText(input.traceLog),
    nextStep: cleanText(input.nextStep),
    notes: cleanText(input.notes),
    createdAt: cleanText(input.createdAt),
    updatedAt: cleanText(input.updatedAt),
  };
}

function normalizeLatamReference(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    markets: Array.isArray(source.markets)
      ? source.markets.map((item) => ({
          market: String(item.market || ""),
          dealCount: toNullableNumber(item.dealCount) || 0,
          totalValue: toNullableNumber(item.totalValue) || 0,
          stageFocus: String(item.stageFocus || ""),
          priority: String(item.priority || ""),
          growthForecast: toNullableNumber(item.growthForecast) || 0,
          operatorCount: toNullableNumber(item.operatorCount) || 0,
        }))
      : [],
    stageTotals: Array.isArray(source.stageTotals)
      ? source.stageTotals.map((item) => ({
          stage: String(item.stage || ""),
          dealCount: toNullableNumber(item.dealCount) || 0,
        }))
      : [],
    operatorsByMarket: Array.isArray(source.operatorsByMarket) ? source.operatorsByMarket : [],
  };
}

function createDealShape() {
  return {
    id: "",
    deal: "",
    client: "",
    type: "",
    market: "",
    platform: "",
    stage: "New Business",
    signingEta: "",
    signingYear: null,
    signingMonth: null,
    dealValue: null,
    dealValueAlt: null,
    legalStatus: "Not Started",
    ddStatus: "Not Started",
    integrationStatus: "Not Started",
    goLiveStatus: "Not Started",
    newTraffic: false,
    comments: "",
    actionItems: "",
    source: "",
    statusText: "",
    leadFlag: false,
    signedFlag: false,
    ddStartedFlag: false,
    ddCompletedFlag: false,
    integrationStartedFlag: false,
    integrationCompletedFlag: false,
    goLiveFlag: false,
    month: "",
    evo: "",
    operator: "",
    groupName: "",
    kam: "",
    jurisdiction: "",
    legalEntity: "",
    siteStatus: "",
    accountScope: "",
    status: "",
    agreement: "Not Started",
    integration: "",
    dd: "",
    signedEta: "",
    liveSince: "",
    lastFollowUp: "",
    handover: "",
    brands: "",
    entityInfo: "",
    url: "",
    jira: "",
    ddTicket: "",
    skype: "",
    integrationEmail: "",
    updates: "",
    prospectDate: "",
    offerDate: "",
    integrationDate: "",
    liveDate: "",
    casinoName: "",
    ezugiId: "",
    evoInstance: "",
    evoSkinId: "",
    ezugiSkin: "",
    dbColumn1: "",
    dbColumn2: "",
    dbColumn3: "",
    dbColumn4: "",
    dbColumn5: "",
    dbColumn6: "",
    dbColumn7: "",
    dbColumn8: "",
    dbColumn9: "",
    dbColumn10: "",
    dbColumn11: "",
    dbColumn12: "",
    dbColumn13: "",
    dbColumn14: "",
  };
}

function createTargetShape() {
  return {
    id: "",
    year: new Date().getFullYear(),
    market: "",
    type: "",
    platform: "",
    newTraffic: false,
    newSigned: 0,
    newSignedValue: 0,
    integrations: 0,
    integrationsValue: 0,
    ddPipeline: 0,
    ddPipelineValue: 0,
    newGoLive: 0,
    newGoLiveValue: 0,
    totalGoLive: 0,
    totalGoLiveValue: 0,
  };
}

function createTaskShape() {
  return {
    id: "",
    title: "",
    scopeType: "Client",
    status: "Open",
    priority: "Medium",
    dueDate: "",
    owner: "",
    dealId: "",
    targetId: "",
    deal: "",
    client: "",
    operator: "",
    market: "",
    targetYear: null,
    jiraTicket: "",
    traceLog: "",
    nextStep: "",
    notes: "",
    createdAt: "",
    updatedAt: "",
  };
}

function renderAll() {
  renderGlobalFilters();
  renderViewState();
  renderHeroMetrics();
  renderDashboard();
  renderPipeline();
  renderTargets();
  renderTasks();
  renderKpiCatalogue();
}

function renderGlobalFilters() {
  const dataYears = uniqueValues(state.deals.map((deal) => {
    const parts = getDealTimeParts(deal);
    return parts.year ? String(parts.year) : "";
  }));
  const targetYears = uniqueValues(state.targets.map((target) => (target.year ? String(target.year) : "")));
  const years = [...new Set([...DEFAULT_DASHBOARD_YEARS, ...dataYears, ...targetYears])].sort((left, right) => Number(left) - Number(right));

  setSelectOptions(elements.globalFilterYear, ["All", ...years], ui.filters.year);
  setSelectOptions(elements.globalFilterQuarter, ["All", "Q1", "Q2", "Q3", "Q4"], ui.filters.quarter);
  setSelectOptions(elements.globalFilterMonth, ["All", ...MONTH_LABELS], ui.filters.month);
  elements.focusSummary.textContent = buildTimeFilterSummary();
}

function renderViewState() {
  viewTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTrigger === ui.activeView);
  });

  views.forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === ui.activeView);
  });
}

function renderHeroMetrics() {
  const scopedDeals = getScopedDeals();
  const snapshot = buildForecastSnapshot(scopedDeals);
  const signedCount = snapshot.commitCount;
  const liveCount = scopedDeals.filter((deal) => ["Go Live", "Live"].includes(deal.stage) || deal.goLiveFlag).length;
  const atRisk = getRiskDeals(scopedDeals).length;

  elements.heroPipelineValue.textContent = formatForecastUnits(snapshot.weightedCount);
  elements.heroSignedCount.textContent = String(signedCount);
  elements.heroLiveCount.textContent = String(liveCount);
  elements.heroDdAging.textContent = String(atRisk);
}

function renderDashboard() {
  const scopedDeals = getScopedDeals();
  const usesValue = hasAnyDealValue(scopedDeals);
  const stageStats = STAGE_ORDER.map((stage) => {
    const deals = scopedDeals.filter((deal) => deal.stage === stage);
    return {
      stage,
      count: deals.length,
      value: sumValues(deals.map((deal) => deal.dealValue)),
      weightedCount: sumValues(deals.map((deal) => getForecastProbability(deal))),
    };
  });

  const totalDeals = scopedDeals.length;
  elements.dashboardStageSummary.textContent = `${totalDeals} deals · ${buildTimeWindowLabel()}`;
  elements.stageOverview.innerHTML = stageStats
    .map((stat) => {
      const percentage = totalDeals === 0 ? 0 : Math.round((stat.count / totalDeals) * 100);
      return `
        <article class="stage-card">
          <header>
            <span class="chip">${escapeHtml(stat.stage)}</span>
            <span>${percentage}%</span>
          </header>
          <strong>${stat.count}</strong>
          <small>${usesValue ? formatCurrency(stat.value) : `${formatForecastUnits(stat.weightedCount)} weighted`}</small>
          <div class="progress-track">
            <div class="progress-bar" style="width: ${Math.max(percentage, stat.count > 0 ? 8 : 0)}%"></div>
          </div>
        </article>
      `;
    })
    .join("");

  elements.signalLegal.textContent = String(scopedDeals.filter((deal) => deal.stage === "Legal").length);
  elements.signalDd.textContent = String(scopedDeals.filter((deal) => deal.stage === "DD").length);
  elements.signalIntegration.textContent = String(scopedDeals.filter((deal) => deal.stage === "Integration").length);
  elements.signalNewTraffic.textContent = String(scopedDeals.filter((deal) => deal.newTraffic).length);

  renderForecastSummary(scopedDeals);
  renderForecastByMarket(scopedDeals);
  renderForecastByOperator(scopedDeals);
  renderDecisionBoard(scopedDeals);
  renderMarketBars(scopedDeals);
  renderDashboardTimeline(scopedDeals);
  renderDashboardSpotlight(scopedDeals);
  renderLeadMarketCounts(scopedDeals);
  renderLeadMarketTracker(scopedDeals);
  renderLatamReference();
  renderRiskList(scopedDeals);
}

function renderMarketBars(deals) {
  const usesValue = hasAnyDealValue(deals);
  const marketMap = new Map();

  deals.forEach((deal) => {
    const key = deal.market || "Unknown";
    const entry = marketMap.get(key) || { market: key, value: 0, count: 0, weightedCount: 0 };
    entry.value += Number(deal.dealValue || 0);
    entry.count += 1;
    entry.weightedCount += getForecastProbability(deal);
    marketMap.set(key, entry);
  });

  const items = Array.from(marketMap.values())
    .sort((left, right) => {
      const leftScore = usesValue ? left.value : left.weightedCount;
      const rightScore = usesValue ? right.value : right.weightedCount;
      return rightScore - leftScore || right.count - left.count;
    })
    .slice(0, 6);

  if (items.length === 0) {
    elements.marketBars.innerHTML = '<div class="empty-state">No active deals are available to build the market view.</div>';
    return;
  }

  const maxValue = (usesValue ? items[0].value : items[0].weightedCount) || 1;
  elements.marketBars.innerHTML = items
    .map((item) => {
      const baseMetric = usesValue ? item.value : item.weightedCount;
      const percentage = Math.max(8, Math.round((baseMetric / maxValue) * 100));
      return `
        <article class="market-bar">
          <header>
            <strong>${escapeHtml(item.market)}</strong>
            <span>${item.count} deals</span>
          </header>
          <div class="market-fill"><span style="width:${percentage}%"></span></div>
          <small>${usesValue ? formatCurrency(item.value) : `${formatForecastUnits(item.weightedCount)} weighted`}</small>
        </article>
      `;
    })
    .join("");
}

function renderDashboardTimeline(deals) {
  const items = buildTimelineSeries(deals);
  const usesValue = hasAnyDealValue(deals);

  if (items.length === 0) {
    elements.dashboardTimeline.innerHTML = '<div class="empty-state">There is not enough timing data to build the executive timeline.</div>';
    return;
  }

  const maxValue = Math.max(...items.map((item) => item.count), 1);
  elements.dashboardTimeline.innerHTML = items
    .map((item) => {
      const percentage = Math.max(8, Math.round((item.count / maxValue) * 100));
      return `
        <article class="timeline-card">
          <header>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${item.count} deals</span>
          </header>
          <div class="timeline-track"><span style="width:${percentage}%"></span></div>
          <small>${usesValue ? formatCurrency(item.value) : `${formatForecastUnits(item.weightedCount || 0)} weighted`}</small>
        </article>
      `;
    })
    .join("");
}

function renderDashboardSpotlight(deals) {
  const usesValue = hasAnyDealValue(deals);
  const items = [...deals]
    .sort((left, right) => {
      const stageDiff = (STAGE_ORDER.indexOf(right.stage) + 1) - (STAGE_ORDER.indexOf(left.stage) + 1);
      if (stageDiff !== 0) {
        return stageDiff;
      }
      return Number(right.dealValue || 0) - Number(left.dealValue || 0);
    })
    .slice(0, 6);

  if (items.length === 0) {
    elements.dashboardSpotlight.innerHTML = '<div class="empty-state">No priority deals are available in the current review window.</div>';
    return;
  }

  elements.dashboardSpotlight.innerHTML = items
    .map((deal) => {
      const health = getDealHealth(deal);
      return `
        <article class="spotlight-card">
          <div class="spotlight-main">
            <div>
              <strong>${escapeHtml(deal.deal)}</strong>
              <small>${escapeHtml(deal.client || deal.market || "No client assigned")}</small>
            </div>
            <span class="pill ${health.pillClass}">${escapeHtml(health.label)}</span>
          </div>
          <div class="spotlight-meta">
            <span>${escapeHtml(deal.market || "N/A")}</span>
            <span>${escapeHtml(deal.stage)}</span>
            <span>${formatDealPeriod(deal)}</span>
            <span>${usesValue ? formatCurrency(deal.dealValue) : escapeHtml(formatDealCommercialMetric(deal))}</span>
          </div>
          <p>${escapeHtml(deal.statusText || deal.comments || "No executive summary available.")}</p>
        </article>
      `;
    })
    .join("");
}

function renderForecastSummary(deals) {
  const snapshot = buildForecastSnapshot(deals);
  const cards = [
    ["Weighted Forecast", formatForecastUnits(snapshot.weightedCount), "Probability-adjusted account output expected from the pipeline"],
    ["Commit", `${snapshot.commitCount}`, "Deals currently carrying execution probability above 75%"],
    ["Coverage vs Target", formatPercent(snapshot.coverageRatio), `${Math.max(snapshot.targetCount - snapshot.commitEquivalent, 0).toFixed(1)} accounts still required to close the target gap`],
    ["Active Operators", `${snapshot.operatorCount}`, `${snapshot.marketCount} markets currently showing visible pipeline activity`],
  ];

  elements.forecastSummary.innerHTML = cards
    .map(([label, value, note]) => {
      return `
        <article class="forecast-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(note)}</small>
        </article>
      `;
    })
    .join("");
}

function renderForecastMetric(label, value, title = "") {
  const safeTitle = cleanText(title);
  return `
    <div class="forecast-metric"${safeTitle ? ` title="${escapeAttribute(safeTitle)}"` : ""}>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderForecastByMarket(deals) {
  const rows = buildForecastMarketRows(deals);

  if (rows.length === 0) {
    elements.forecastMarkets.innerHTML = '<div class="empty-state">Not enough active accounts are available to build the market forecast.</div>';
    return;
  }

  const maxForecast = Math.max(...rows.map((row) => Math.max(row.forecastValue, row.weightedCount)), 1);
  elements.forecastMarkets.innerHTML = rows
    .map((row) => {
      const coverageLabel = row.targetCount > 0 ? formatPercent(row.coverageRatio) : "No target";
      const percentage = Math.max(10, Math.round((Math.max(row.forecastValue, row.weightedCount) / maxForecast) * 100));
      const gapText = row.targetCount > 0 ? `Gap ${formatSignedCount(row.targetGap)}` : "No target";
      return `
        <article class="forecast-item">
          <header>
            <div class="forecast-headline">
              <strong>${escapeHtml(row.market)}</strong>
              <small>${row.totalCount} deals • ${row.liveCount} live</small>
            </div>
            <span class="forecast-badge">${escapeHtml(coverageLabel)}</span>
          </header>
          <div class="forecast-metrics">
            ${renderForecastMetric("Deal Count", `${row.totalCount}`, `${row.totalCount} visible deals in ${row.market}`)}
            ${renderForecastMetric("Deal Value", formatCompactCurrency(row.dealValueTotal), formatCurrency(row.dealValueTotal))}
            ${renderForecastMetric("Forecast", formatCompactCurrency(row.forecastValue), `${formatCurrency(row.forecastValue)} · ${formatForecastUnits(row.weightedCount)}`)}
            ${renderForecastMetric("Target", row.targetCount > 0 ? `${row.targetCount}` : "N/A", row.targetCount > 0 ? `${row.targetCount} new signed accounts target` : "No target loaded")}
          </div>
          <div class="forecast-fill"><span style="width:${percentage}%"></span></div>
          <small>${gapText} • Weighted ${formatForecastUnits(row.weightedCount)} • Commit ${row.commitCount}</small>
        </article>
      `;
    })
    .join("");
}

function renderForecastByOperator(deals) {
  const rows = buildForecastOperatorRows(deals);

  if (rows.length === 0) {
    elements.forecastOperators.innerHTML = '<div class="empty-state">Not enough active accounts are available to build the operator forecast.</div>';
    return;
  }

  const maxForecast = Math.max(...rows.map((row) => Math.max(row.forecastValue, row.weightedCount)), 1);
  elements.forecastOperators.innerHTML = rows
    .map((row) => {
      const percentage = Math.max(10, Math.round((Math.max(row.forecastValue, row.weightedCount) / maxForecast) * 100));
      return `
        <article class="forecast-item">
          <header>
            <div class="forecast-headline">
              <strong>${escapeHtml(row.operator)}</strong>
              <small>${escapeHtml(row.market)} • ${row.totalCount} deals</small>
            </div>
            <span class="forecast-badge">${escapeHtml(row.topStage)}</span>
          </header>
          <div class="forecast-metrics">
            ${renderForecastMetric("Deal Count", `${row.totalCount}`, `${row.totalCount} deals associated with this operator`)}
            ${renderForecastMetric("Deal Value", formatCompactCurrency(row.dealValueTotal), formatCurrency(row.dealValueTotal))}
            ${renderForecastMetric("Forecast", formatCompactCurrency(row.forecastValue), `${formatCurrency(row.forecastValue)} · ${formatForecastUnits(row.weightedCount)}`)}
            ${renderForecastMetric("Commit", `${row.commitCount}`, `${row.commitCount} deals with execution probability above 75%`)}
          </div>
          <div class="forecast-fill"><span style="width:${percentage}%"></span></div>
          <small>${escapeHtml(row.owner || "No owner assigned")} • ${escapeHtml(row.groupName || "No group assigned")} • Weighted ${formatForecastUnits(row.weightedCount)}</small>
        </article>
      `;
    })
    .join("");
}

function renderDecisionBoard(deals) {
  const cards = buildDecisionInsights(deals);

  if (cards.length === 0) {
    elements.decisionBoard.innerHTML = '<div class="empty-state">There is not enough data available to surface executive priorities.</div>';
    return;
  }

  elements.decisionBoard.innerHTML = cards
    .map((card) => {
      return `
        <article class="decision-card ${escapeHtml(card.tone)}">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.title)}</strong>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `;
    })
    .join("");
}

function renderLeadMarketCounts(deals) {
  const usesValue = hasAnyDealValue(deals);
  const leadDeals = getLeadDeals(deals);
  const marketMap = new Map();

  leadDeals.forEach((deal) => {
    const key = deal.market || "Unknown";
    const referenceDate = getLeadReferenceDate(deal);
    const entry = marketMap.get(key) || {
      market: key,
      count: 0,
      value: 0,
      weightedCount: 0,
      latestDate: "",
    };

    entry.count += 1;
    entry.value += Number(deal.dealValue || 0);
    entry.weightedCount += getForecastProbability(deal);
    if (compareNullableDates(entry.latestDate, referenceDate) < 0) {
      entry.latestDate = referenceDate;
    }
    marketMap.set(key, entry);
  });

  const items = Array.from(marketMap.values()).sort((left, right) => right.count - left.count || right.value - left.value);

  if (items.length === 0) {
    elements.leadMarketCounts.innerHTML = '<div class="empty-state">No visible leads are available in the current review window.</div>';
    return;
  }

  const maxCount = Math.max(...items.map((item) => item.count), 1);

  elements.leadMarketCounts.innerHTML = items
    .map((item) => {
      const percentage = Math.max(12, Math.round((item.count / maxCount) * 100));
      return `
        <article class="lead-market-item">
          <header>
            <strong>${escapeHtml(item.market)}</strong>
            <span>${item.count} leads</span>
          </header>
          <div class="market-fill compact"><span style="width:${percentage}%"></span></div>
          <div class="lead-market-meta">
            <span>${usesValue ? formatCurrency(item.value) : `${formatForecastUnits(item.weightedCount)} weighted`}</span>
            <span>${item.latestDate ? `Latest movement ${formatDate(item.latestDate)}` : "No recent activity date"}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderLeadMarketTracker(deals) {
  const leadDeals = getLeadDeals(deals);
  const marketMap = new Map();

  leadDeals.forEach((deal) => {
    const key = deal.market || "Unknown";
    const entry = marketMap.get(key) || {
      market: key,
      deals: [],
      count: 0,
      totalValue: 0,
      weightedCount: 0,
    };

    entry.deals.push(deal);
    entry.count += 1;
    entry.totalValue += Number(deal.dealValue || 0);
    entry.weightedCount += getForecastProbability(deal);
    marketMap.set(key, entry);
  });

  const groups = Array.from(marketMap.values())
    .map((entry) => ({
      ...entry,
      deals: [...entry.deals].sort(
        (left, right) =>
          getLeadFollowUpIndicator(right).days - getLeadFollowUpIndicator(left).days ||
          Number(right.dealValue || 0) - Number(left.dealValue || 0) ||
          left.deal.localeCompare(right.deal)
      ),
    }))
    .sort((left, right) => right.count - left.count || right.totalValue - left.totalValue || left.market.localeCompare(right.market));

  if (groups.length === 0) {
    elements.leadMarketTracker.innerHTML = '<div class="empty-state">No visible leads are available for follow-up in the current review window.</div>';
    return;
  }

  elements.leadMarketTracker.innerHTML = groups
    .map((group) => {
      return `
        <article class="lead-market-group">
          <header class="lead-market-group-head">
            <div class="lead-market-group-copy">
              <span class="lead-market-group-kicker">${escapeHtml(group.market)}</span>
              <strong>${group.count} active leads</strong>
              <small>${formatCurrency(group.totalValue)} • ${formatForecastUnits(group.weightedCount)} weighted forecast</small>
            </div>
            <div class="lead-market-group-metrics">
              <span>${group.deals.filter((deal) => deal.newTraffic).length} new traffic</span>
              <span>${group.deals.filter((deal) => getLeadFollowUpIndicator(deal).cardClass === "is-stale").length} pending follow-ups</span>
              <button type="button" class="button button-ghost button-small" data-action="create-task-from-market" data-market="${escapeAttribute(group.market)}">Create Market Task</button>
            </div>
          </header>
          <div class="lead-market-group-list">
            ${group.deals.map((deal) => renderLeadTrackerCard(deal)).join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderLeadTrackerCard(deal) {
  const followUp = getLeadFollowUpIndicator(deal);
  return `
    <article class="lead-tracker-card ${followUp.cardClass}">
      <div class="lead-tracker-head">
        <div class="latest-lead-main">
          <strong>${escapeHtml(deal.deal || "Unnamed deal")}</strong>
          <small>${escapeHtml(buildDealContextLine(deal) || deal.client || "No additional context")}</small>
        </div>
        <div class="pill-row">
          <span class="pill stage">${escapeHtml(deal.stage)}</span>
          <span class="pill ${followUp.pillClass}">${escapeHtml(followUp.label)}</span>
          ${deal.newTraffic ? '<span class="pill traffic">New traffic</span>' : ""}
        </div>
      </div>
      <div class="lead-tracker-meta">
        <span><strong>Client:</strong> ${escapeHtml(deal.client || "N/A")}</span>
        <span><strong>Operator:</strong> ${escapeHtml(getPrimaryOperatorName(deal))}</span>
        <span><strong>Value:</strong> ${escapeHtml(formatDealCommercialMetric(deal))}</span>
        <span><strong>Last Follow Up:</strong> ${formatDate(deal.lastFollowUp)}</span>
      </div>
      <p class="lead-tracker-summary">${escapeHtml(deal.statusText || deal.comments || "No operating summary available.")}</p>
      ${renderStageStatusBlock(deal, "compact")}
      ${renderTrackingLinks(deal, "compact")}
      <form class="lead-task-form" data-lead-task-form data-lead-id="${escapeAttribute(deal.id)}">
        <div class="lead-task-grid">
          <label>
            Last Follow Up
            <input name="lastFollowUp" type="date" value="${escapeAttribute(deal.lastFollowUp || "")}" />
          </label>
          <label>
            Action Items
            <textarea name="actionItems" rows="3" placeholder="Next actions">${escapeHtml(deal.actionItems || "")}</textarea>
          </label>
          <label>
            Updates
            <textarea name="updates" rows="3" placeholder="Latest update">${escapeHtml(deal.updates || "")}</textarea>
          </label>
        </div>
        <div class="lead-task-actions">
          <button type="button" class="button button-ghost button-small" data-action="create-task-from-deal" data-id="${escapeAttribute(deal.id)}">Create Task</button>
          <button type="submit" class="button button-secondary button-small">Save Follow-Up</button>
          <button type="button" class="button button-ghost button-small" data-action="edit-deal" data-id="${escapeAttribute(deal.id)}">Open Deal</button>
        </div>
      </form>
    </article>
  `;
}

function renderLatamReference() {
  const markets = state.latamReference.markets.slice(0, 6);
  const stageTotals = state.latamReference.stageTotals;

  if (markets.length === 0) {
    elements.latamFocusGrid.innerHTML = '<div class="empty-state">No LATAM reference data is currently loaded.</div>';
  } else {
    elements.latamFocusGrid.innerHTML = markets
      .map((item) => {
        return `
          <article class="signal-card">
            <span>${escapeHtml(item.market)}</span>
            <strong>${formatCurrency(item.totalValue)}</strong>
            <small>${item.dealCount} deals • ${escapeHtml(item.stageFocus || "No stage focus defined")}</small>
            <small>Priority: ${escapeHtml(item.priority || "N/A")} • Growth: ${formatPercent(item.growthForecast)} • Operators: ${item.operatorCount}</small>
          </article>
        `;
      })
      .join("");
  }

  if (stageTotals.length === 0) {
    elements.latamStageRadar.innerHTML = '<div class="empty-state">No stage mix is currently available from the LATAM reference file.</div>';
    return;
  }

  const maxValue = Math.max(...stageTotals.map((item) => item.dealCount), 1);
  elements.latamStageRadar.innerHTML = stageTotals
    .map((item) => {
      const percentage = Math.max(10, Math.round((item.dealCount / maxValue) * 100));
      return `
        <article class="market-bar">
          <header>
            <strong>${escapeHtml(item.stage)}</strong>
            <span>${item.dealCount} deals</span>
          </header>
          <div class="market-fill"><span style="width:${percentage}%"></span></div>
          <small>Stage distribution based on the LATAM reference file</small>
        </article>
      `;
    })
    .join("");
}

function renderRiskList(deals) {
  const risks = getRiskDeals(deals);
  elements.riskCount.textContent = `${risks.length} alerts`;

  if (risks.length === 0) {
    elements.riskList.innerHTML = '<div class="empty-state">No material risk cases are currently flagged under the active rules.</div>';
    return;
  }

  elements.riskList.innerHTML = risks
    .slice(0, 6)
    .map((item) => {
      return `
        <article class="risk-item ${item.tone}">
          <header>
            <strong>${escapeHtml(item.deal.deal)}</strong>
            <span>${escapeHtml(item.deal.stage)}</span>
          </header>
          <p>${escapeHtml(item.reason)}</p>
          <div class="meta-row">
            <span><strong>Client:</strong> ${escapeHtml(item.deal.client || "N/A")}</span>
            <span><strong>Market:</strong> ${escapeHtml(item.deal.market || "N/A")}</span>
            <span><strong>Last Follow Up:</strong> ${formatDate(item.deal.lastFollowUp)}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPipelineSummary(deals) {
  const snapshot = buildForecastSnapshot(deals);
  const riskCount = getRiskDeals(deals).length;
  const upcomingCount = deals.filter((deal) => {
    const timeline = getDealTimeParts(deal);
    if (!timeline.dateText) {
      return false;
    }
    const days = daysUntil(timeline.dateText);
    return days >= 0 && days <= 30;
  }).length;
  const summaryCards = [
    ["Visible Accounts", `${deals.length}`, buildTimeWindowLabel()],
    ["Weighted Forecast", formatForecastUnits(snapshot.weightedCount), "Expected output within the current review window"],
    ["Commit", `${snapshot.commitCount}`, "Deals carrying the strongest execution probability"],
    ["Attention", `${riskCount}`, "Deals with blockers or delayed follow-up"],
    ["Next 30 Days", `${upcomingCount}`, "ETAs landing inside the next 30 days"],
  ];

  elements.pipelineSummary.innerHTML = summaryCards
    .map(([label, value, note]) => {
      return `
        <article class="summary-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(note)}</small>
        </article>
      `;
    })
    .join("");
}

function renderPipelineStageStrip(deals) {
  const items = STAGE_ORDER.map((stage) => {
    const stageDeals = deals.filter((deal) => deal.stage === stage);
    return { stage, count: stageDeals.length, value: sumValues(stageDeals.map((deal) => deal.dealValue)) };
  }).filter((item) => item.count > 0);

  if (items.length === 0) {
    elements.pipelineStageStrip.innerHTML = "";
    return;
  }

  elements.pipelineStageStrip.innerHTML = items
    .map((item) => {
      return `
        <article class="stage-pill ${stageClassName(item.stage)}">
          <strong>${escapeHtml(item.stage)}</strong>
          <span>${item.count} deals</span>
          <small>${formatCurrency(item.value)}</small>
        </article>
      `;
    })
    .join("");
}

function renderPipeline() {
  const scopedDeals = getScopedDeals();
  syncPipelineFilterOptions(scopedDeals);
  renderPipelineFinderSuggestions(getPipelineBaseDeals());
  const deals = getFilteredDeals();
  elements.pipelineCount.textContent = `${deals.length} deals · ${buildTimeWindowLabel()}`;
  renderPipelineSearchStatus(deals.length, scopedDeals.length);
  renderPipelineSummary(deals);
  renderPipelineStageStrip(deals);
  renderPipelineBoard(deals);
  renderDealTable(deals);
}

function renderPipelineSearchStatus(filteredCount, scopedCount) {
  const search = cleanText(ui.filters.search);
  if (!search) {
    elements.pipelineSearchStatus.textContent = "Search deals, clients, operators, markets, Jira tickets, DD tickets, websites, and integration traces.";
    return;
  }

  if (ui.pipelineFinder.selectedDealId && filteredCount === 1) {
    elements.pipelineSearchStatus.textContent = `Focused on 1 deal for "${search}".`;
    return;
  }

  elements.pipelineSearchStatus.textContent = `Showing ${filteredCount} matching deals out of ${scopedCount} visible in the current time window.`;
}

function syncPipelineFilterOptions(scopedDeals) {
  const markets = uniqueValues(scopedDeals.map((deal) => deal.market));
  const types = uniqueValues(scopedDeals.map((deal) => deal.type));

  setSelectOptions(elements.filterStage, ["All", ...ALL_STAGES], ui.filters.stage);
  setSelectOptions(elements.filterMarket, ["All", ...markets], ui.filters.market);
  setSelectOptions(elements.filterType, ["All", ...types], ui.filters.type);
  elements.pipelineSearch.value = ui.filters.search;
  elements.filterTraffic.value = ui.filters.traffic;
}

function renderPipelineFinderSuggestions(baseDeals = getPipelineBaseDeals()) {
  const suggestions = ui.pipelineFinder.isOpen ? buildPipelineFinderSuggestions(ui.filters.search, baseDeals) : [];
  ui.pipelineFinder.suggestions = suggestions;

  const hasSearch = cleanText(ui.filters.search).length > 0;
  const showList = ui.pipelineFinder.isOpen && hasSearch;
  elements.pipelineSearch.setAttribute("aria-expanded", showList ? "true" : "false");

  if (!showList) {
    elements.pipelineSearchSuggestions.hidden = true;
    elements.pipelineSearchSuggestions.innerHTML = "";
    return;
  }

  if (suggestions.length === 0) {
    elements.pipelineSearchSuggestions.hidden = false;
    elements.pipelineSearchSuggestions.innerHTML = '<div class="finder-empty">No matching deals were found for that search.</div>';
    return;
  }

  elements.pipelineSearchSuggestions.hidden = false;
  elements.pipelineSearchSuggestions.innerHTML = suggestions
    .map((suggestion, index) => {
      const isActive = index === ui.pipelineFinder.activeIndex;
      return `
        <button
          type="button"
          class="finder-suggestion ${isActive ? "is-active" : ""}"
          data-finder-index="${index}"
        >
          <div class="finder-suggestion-top">
            <strong>${escapeHtml(suggestion.title)}</strong>
            <span>${escapeHtml(suggestion.matchLabel)}</span>
          </div>
          <small>${escapeHtml(suggestion.subtitle)}</small>
          <div class="finder-suggestion-meta">${escapeHtml(suggestion.meta)}</div>
        </button>
      `;
    })
    .join("");
}

function handlePipelineFinderKeydown(event) {
  const { suggestions } = ui.pipelineFinder;
  if (!suggestions.length) {
    if (event.key === "Escape") {
      ui.pipelineFinder.isOpen = false;
      renderPipelineFinderSuggestions(getPipelineBaseDeals());
    }
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    ui.pipelineFinder.isOpen = true;
    ui.pipelineFinder.activeIndex = (ui.pipelineFinder.activeIndex + 1 + suggestions.length) % suggestions.length;
    renderPipelineFinderSuggestions(getPipelineBaseDeals());
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    ui.pipelineFinder.isOpen = true;
    ui.pipelineFinder.activeIndex = (ui.pipelineFinder.activeIndex - 1 + suggestions.length) % suggestions.length;
    renderPipelineFinderSuggestions(getPipelineBaseDeals());
    return;
  }

  if (event.key === "Enter" && ui.pipelineFinder.activeIndex >= 0) {
    event.preventDefault();
    selectPipelineFinderSuggestion(ui.pipelineFinder.activeIndex);
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    selectPipelineFinderSuggestion(0);
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    ui.pipelineFinder.isOpen = false;
    ui.pipelineFinder.activeIndex = -1;
    renderPipelineFinderSuggestions(getPipelineBaseDeals());
  }
}

function selectPipelineFinderSuggestion(index) {
  const suggestion = ui.pipelineFinder.suggestions[index];
  if (!suggestion) {
    return;
  }

  ui.filters.search = suggestion.searchValue;
  ui.pipelineFinder.selectedDealId = suggestion.dealId;
  ui.pipelineFinder.activeIndex = -1;
  ui.pipelineFinder.isOpen = false;
  renderPipeline();
}

function renderPipelineBoard(deals) {
  const columns = STAGE_ORDER.map((stage) => {
    const stageDeals = deals.filter((deal) => deal.stage === stage);
    const totalValue = sumValues(stageDeals.map((deal) => deal.dealValue));
    return { stage, stageDeals, totalValue };
  }).filter((column) => column.stageDeals.length > 0);

  if (columns.length === 0) {
    elements.pipelineBoard.innerHTML = '<div class="empty-state">No deals match the current pipeline filters.</div>';
    return;
  }

  elements.pipelineBoard.innerHTML = columns
    .map(({ stage, stageDeals, totalValue }) => {
    const stageClass = stageClassName(stage);
    const cards = stageDeals.length
      ? stageDeals
          .map((deal) => {
            const health = getDealHealth(deal);
            return `
              <article class="kanban-card ${health.cardClass}">
                <div class="pipeline-card-head">
                  <div>
                    <h3>${escapeHtml(deal.deal)}</h3>
                    <small>${escapeHtml(buildDealContextLine(deal))}</small>
                  </div>
                  <strong>${escapeHtml(formatDealCommercialMetric(deal))}</strong>
                </div>
                <div class="pill-row">
                  <span class="pill stage">${escapeHtml(deal.market || "No market")}</span>
                  <span class="pill neutral">${escapeHtml(deal.type || "No type")}</span>
                  ${deal.newTraffic ? '<span class="pill traffic">New traffic</span>' : ""}
                  <span class="pill ${health.pillClass}">${escapeHtml(health.label)}</span>
                </div>
                <div class="pipeline-meta-grid">
                  <span><strong>Period:</strong> ${escapeHtml(formatDealPeriod(deal))}</span>
                  <span><strong>Follow up:</strong> ${formatDate(deal.lastFollowUp)}</span>
                  <span><strong>Platform:</strong> ${escapeHtml(deal.platform || "N/A")}</span>
                  <span><strong>Go Live:</strong> ${escapeHtml(deal.goLiveStatus || "N/A")}</span>
                </div>
                ${renderStageStatusBlock(deal)}
                ${renderTrackingLinks(deal)}
                <p>${escapeHtml(deal.statusText || deal.comments || "No operating summary available.")}</p>
                <div class="kanban-actions">
                  <button class="icon-button" data-action="edit-deal" data-id="${escapeHtml(deal.id)}">Edit</button>
                  <button class="icon-button danger" data-action="delete-deal" data-id="${escapeHtml(deal.id)}">Delete</button>
                </div>
              </article>
            `;
          })
          .join("")
      : '<div class="empty-state">No deals are currently mapped to this stage.</div>';

    return `
      <section class="kanban-column ${stageClass}">
        <header>
          <strong>${escapeHtml(stage)}</strong>
          <span>${stageDeals.length} / ${formatCurrency(totalValue)}</span>
        </header>
        ${cards}
      </section>
    `;
    })
    .join("");
}

function renderDealTable(deals) {
  if (deals.length === 0) {
    elements.dealTableBody.innerHTML = `
      <tr>
        <td colspan="10">
          <div class="empty-state">No deals match the active filters.</div>
        </td>
      </tr>
    `;
    return;
  }

  elements.dealTableBody.innerHTML = deals
    .map((deal) => {
      const health = getDealHealth(deal);

      return `
        <tr>
          <td>
            <div class="entity-title">
              <strong>${escapeHtml(deal.deal)}</strong>
              <small>${escapeHtml(buildDealContextLine(deal))}</small>
            </div>
          </td>
          <td>
            <div class="entity-title">
              <strong>${escapeHtml(deal.market || "N/A")}</strong>
              <small>${escapeHtml([deal.platform || "No platform", deal.jurisdiction].filter(Boolean).join(" · "))}</small>
            </div>
          </td>
          <td><span class="pill stage">${escapeHtml(deal.stage)}</span></td>
          <td>${escapeHtml(formatDealPeriod(deal))}</td>
          <td><span class="pill ${health.pillClass}">${escapeHtml(health.label)}</span></td>
          <td>${escapeHtml(formatDealCommercialMetric(deal))}</td>
          <td>${formatDate(deal.lastFollowUp)}</td>
          <td class="table-status">${renderStageStatusBlock(deal, "compact")}</td>
          <td class="table-tracking">${renderTrackingLinks(deal, "compact")}</td>
          <td>
            <div class="row-actions">
              <button class="icon-button" data-action="edit-deal" data-id="${escapeHtml(deal.id)}">Edit</button>
              <button class="icon-button danger" data-action="delete-deal" data-id="${escapeHtml(deal.id)}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderTargets() {
  const year = getActiveTargetYear();
  elements.targetSummaryTitle.textContent = `Targets y ejecucion ${year}`;
  elements.targetCount.textContent = `${state.targets.length} targets`;
  renderTargetProgress(year);
  renderTargetTable();
}

function renderTargetProgress(year) {
  const targets = state.targets.filter((target) => target.year === year);
  const summary = {
    newSigned: sumValues(targets.map((target) => target.newSigned)),
    integrations: sumValues(targets.map((target) => target.integrations)),
    ddPipeline: sumValues(targets.map((target) => target.ddPipeline)),
    newGoLive: sumValues(targets.map((target) => target.newGoLive)),
    totalGoLive: sumValues(targets.map((target) => target.totalGoLive)),
  };

  const actual = {
    newSigned: state.deals.filter((deal) => deal.signedFlag && resolveDealYear(deal) === year).length,
    integrations: state.deals.filter((deal) => deal.stage === "Integration" || deal.integrationStartedFlag).length,
    ddPipeline: state.deals.filter((deal) => deal.stage === "DD").length,
    newGoLive: state.deals.filter((deal) => yearFromDate(deal.liveSince) === year || (deal.goLiveFlag && deal.stage === "Go Live")).length,
    totalGoLive: state.deals.filter((deal) => deal.stage === "Live" || deal.goLiveFlag).length,
  };

  const cards = [
    ["New Signed", actual.newSigned, summary.newSigned],
    ["Integrations", actual.integrations, summary.integrations],
    ["DD Pipeline", actual.ddPipeline, summary.ddPipeline],
    ["New Go Live", actual.newGoLive, summary.newGoLive],
    ["Total Go Live", actual.totalGoLive, summary.totalGoLive],
  ];

  elements.targetProgress.innerHTML = cards
    .map(([label, value, target]) => {
      const percentage = target === 0 ? 0 : Math.min(100, Math.round((value / target) * 100));
      return `
        <article class="progress-card">
          <header>
            <strong>${escapeHtml(label)}</strong>
            <span>${value} / ${target}</span>
          </header>
          <small>${target > 0 ? `${percentage}% del target` : "Sin target cargado"}</small>
          <div class="progress-track">
            <div class="progress-bar" style="width:${Math.max(percentage, value > 0 && target === 0 ? 18 : 0)}%"></div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTargetTable() {
  if (state.targets.length === 0) {
    elements.targetTableBody.innerHTML = `
      <tr>
        <td colspan="11">
          <div class="empty-state">Todavia no hay targets definidos.</div>
        </td>
      </tr>
    `;
    return;
  }

  elements.targetTableBody.innerHTML = state.targets
    .sort((left, right) => right.year - left.year || left.market.localeCompare(right.market))
    .map((target) => {
      const trafficScope = isGlobalTarget(target) ? "All" : target.newTraffic ? "New" : "Existing";
      return `
        <tr>
          <td>${target.year}</td>
          <td>${escapeHtml(target.market)}</td>
          <td>${escapeHtml(target.type || "N/A")}</td>
          <td>${escapeHtml(target.platform || "N/A")}</td>
          <td>${trafficScope}</td>
          <td>${target.newSigned}</td>
          <td>${target.integrations}</td>
          <td>${target.ddPipeline}</td>
          <td>${target.newGoLive}</td>
          <td>${target.totalGoLive}</td>
          <td>
            <div class="row-actions">
              <button class="icon-button" data-action="create-task-from-target" data-id="${escapeHtml(target.id)}">Crear tarea</button>
              <button class="icon-button" data-action="edit-target" data-id="${escapeHtml(target.id)}">Editar</button>
              <button class="icon-button danger" data-action="delete-target" data-id="${escapeHtml(target.id)}">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderTasks() {
  const openCount = state.tasks.filter((task) => task.status !== "Done").length;
  elements.taskSummary.textContent = `${state.tasks.length} tareas`;
  elements.taskOpenCount.textContent = `${openCount} abiertas`;
  renderTaskBoard();
  renderTaskTable();
}

function renderTaskBoard() {
  const groups = TASK_SCOPE_TYPES.map((scopeType) => ({
    scopeType,
    tasks: state.tasks.filter((task) => task.scopeType === scopeType),
  })).filter((group) => group.tasks.length > 0);

  if (groups.length === 0) {
    elements.taskBoard.innerHTML = '<div class="empty-state">Todavia no hay tareas. Crea una desde cliente, mercado o target.</div>';
    return;
  }

  elements.taskBoard.innerHTML = groups
    .map((group) => {
      return `
        <section class="task-column">
          <header>
            <strong>${escapeHtml(group.scopeType)}</strong>
            <span>${group.tasks.length}</span>
          </header>
          <div class="task-column-list">
            ${group.tasks
              .sort((left, right) => compareTasks(left, right))
              .map((task) => renderTaskCard(task))
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderTaskCard(task) {
  return `
    <article class="task-card ${taskStatusClass(task.status)}">
      <div class="task-card-head">
        <div>
          <strong>${escapeHtml(task.title || "Tarea sin titulo")}</strong>
          <small>${escapeHtml(buildTaskScopeLabel(task))}</small>
        </div>
        <span class="task-priority">${escapeHtml(task.priority)}</span>
      </div>
      <div class="pill-row">
        <span class="pill neutral">${escapeHtml(task.scopeType)}</span>
        <span class="pill ${taskStatusPillClass(task.status)}">${escapeHtml(task.status)}</span>
      </div>
      <div class="task-card-meta">
        <span><strong>Due:</strong> ${formatDate(task.dueDate)}</span>
        <span><strong>Owner:</strong> ${escapeHtml(task.owner || "N/A")}</span>
        <span><strong>Jira:</strong> ${escapeHtml(task.jiraTicket || "N/A")}</span>
      </div>
      <p>${escapeHtml(task.nextStep || "Sin next step definido.")}</p>
      <small class="task-trace">${escapeHtml(getLatestTraceLine(task.traceLog) || "Sin trazabilidad registrada.")}</small>
      <div class="kanban-actions">
        <button class="icon-button" data-action="edit-task" data-id="${escapeHtml(task.id)}">Editar</button>
        <button class="icon-button danger" data-action="delete-task" data-id="${escapeHtml(task.id)}">Eliminar</button>
      </div>
    </article>
  `;
}

function renderTaskTable() {
  if (state.tasks.length === 0) {
    elements.taskTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">Todavia no hay tareas creadas.</div>
        </td>
      </tr>
    `;
    return;
  }

  elements.taskTableBody.innerHTML = [...state.tasks]
    .sort((left, right) => compareTasks(left, right))
    .map((task) => {
      return `
        <tr>
          <td>
            <div class="entity-title">
              <strong>${escapeHtml(task.title || "Sin titulo")}</strong>
              <small>${escapeHtml(buildTaskScopeLabel(task))}</small>
            </div>
          </td>
          <td>${escapeHtml(task.scopeType)}</td>
          <td><span class="pill ${taskStatusPillClass(task.status)}">${escapeHtml(task.status)}</span></td>
          <td>${escapeHtml(task.priority)}</td>
          <td>${formatDate(task.dueDate)}</td>
          <td>${escapeHtml(task.jiraTicket || "N/A")}</td>
          <td>${escapeHtml(getLatestTraceLine(task.traceLog) || "Sin trace")}</td>
          <td>
            <div class="row-actions">
              <button class="icon-button" data-action="edit-task" data-id="${escapeHtml(task.id)}">Editar</button>
              <button class="icon-button danger" data-action="delete-task" data-id="${escapeHtml(task.id)}">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderKpiCatalogue() {
  const source = Array.isArray(state.kpis) && state.kpis.length > 0 ? state.kpis : KPI_CATALOGUE;
  const filtered = source.filter((kpi) => {
    if (!ui.kpiSearch) {
      return true;
    }

    const haystack = `${kpi.block} ${kpi.name} ${kpi.definition} ${kpi.stage} ${kpi.frequency} ${kpi.notes}`.toLowerCase();
    return haystack.includes(ui.kpiSearch);
  });

  if (filtered.length === 0) {
    elements.kpiGrid.innerHTML = '<div class="empty-state">No hay KPIs que coincidan con esa busqueda.</div>';
    return;
  }

  elements.kpiGrid.innerHTML = filtered
    .map((kpi) => {
      return `
        <article class="catalog-card">
          <header>
            <strong>${escapeHtml(kpi.name)}</strong>
            <span>${escapeHtml(kpi.block)}</span>
          </header>
          <p>${escapeHtml(kpi.definition)}</p>
          <ul>
            <li><strong>Stage:</strong> ${escapeHtml(kpi.stage)}</li>
            <li><strong>Frequency:</strong> ${escapeHtml(kpi.frequency)}</li>
            <li><strong>Notes:</strong> ${escapeHtml(kpi.notes)}</li>
          </ul>
        </article>
      `;
    })
    .join("");
}

async function handleDealSubmit(event) {
  event.preventDefault();

  const formData = new FormData(dealForm);
  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const draft = normalizeDeal({
    ...existingDeal,
    id: ui.editingDealId || generateId("deal"),
    deal: formData.get("deal"),
    client: formData.get("client"),
    operator: formData.get("operator"),
    groupName: formData.get("groupName"),
    kam: formData.get("kam"),
    type: formData.get("type"),
    market: formData.get("market"),
    jurisdiction: formData.get("jurisdiction"),
    legalEntity: formData.get("legalEntity"),
    siteStatus: formData.get("siteStatus"),
    accountScope: formData.get("accountScope"),
    platform: formData.get("platform"),
    stage: formData.get("stage"),
    signingEta: formData.get("signingEta"),
    signingYear: formData.get("signingYear"),
    signingMonth: formData.get("signingMonth"),
    dealValue: formData.get("dealValue"),
    dealValueAlt: formData.get("dealValueAlt"),
    legalStatus: formData.get("legalStatus"),
    ddStatus: formData.get("ddStatus"),
    integrationStatus: formData.get("integrationStatus"),
    goLiveStatus: formData.get("goLiveStatus"),
    newTraffic: formData.has("newTraffic"),
    comments: formData.get("comments"),
    actionItems: formData.get("actionItems"),
    source: formData.get("source"),
    statusText: formData.get("statusText"),
    leadFlag: formData.has("leadFlag"),
    signedFlag: formData.has("signedFlag"),
    ddStartedFlag: formData.has("ddStartedFlag"),
    ddCompletedFlag: formData.has("ddCompletedFlag"),
    integrationStartedFlag: formData.has("integrationStartedFlag"),
    integrationCompletedFlag: formData.has("integrationCompletedFlag"),
    goLiveFlag: formData.has("goLiveFlag"),
    month: formData.get("month"),
    evo: formData.get("evo"),
    status: formData.get("status"),
    agreement: formData.get("agreement"),
    integration: formData.get("integration"),
    dd: formData.get("dd"),
    signedEta: formData.get("signedEta"),
    liveSince: formData.get("liveSince"),
    lastFollowUp: formData.get("lastFollowUp"),
    handover: formData.get("handover"),
    prospectDate: formData.get("prospectDate"),
    offerDate: formData.get("offerDate"),
    integrationDate: formData.get("integrationDate"),
    liveDate: formData.get("liveDate"),
    brands: formData.get("brands"),
    entityInfo: formData.get("entityInfo"),
    casinoName: formData.get("casinoName"),
    ezugiId: formData.get("ezugiId"),
    evoInstance: formData.get("evoInstance"),
    evoSkinId: formData.get("evoSkinId"),
    ezugiSkin: formData.get("ezugiSkin"),
    url: formData.get("url"),
    jira: formData.get("jira"),
    ddTicket: formData.get("ddTicket"),
    skype: formData.get("skype"),
    integrationEmail: formData.get("integrationEmail"),
    updates: formData.get("updates"),
    dbColumn1: formData.get("dbColumn1"),
    dbColumn2: formData.get("dbColumn2"),
    dbColumn3: formData.get("dbColumn3"),
    dbColumn4: formData.get("dbColumn4"),
    dbColumn5: formData.get("dbColumn5"),
    dbColumn6: formData.get("dbColumn6"),
    dbColumn7: formData.get("dbColumn7"),
    dbColumn8: formData.get("dbColumn8"),
    dbColumn9: formData.get("dbColumn9"),
    dbColumn10: formData.get("dbColumn10"),
    dbColumn11: formData.get("dbColumn11"),
    dbColumn12: formData.get("dbColumn12"),
    dbColumn13: formData.get("dbColumn13"),
    dbColumn14: formData.get("dbColumn14"),
  });

  if (!draft.deal.trim()) {
    setBanner("El campo Deal es obligatorio.", "danger");
    return;
  }

  if (ui.editingDealId) {
    state.deals = state.deals.map((deal) => (deal.id === ui.editingDealId ? draft : deal));
  } else {
    state.deals = [draft, ...state.deals];
  }

  const saved = await persistState();
  ui.editingDealId = null;
  resetDealForm();
  renderAll();
  ui.activeView = "pipeline";
  renderViewState();
  setBanner(buildExcelBanner(saved ? `Deal guardado en Excel: ${draft.deal}.` : `Deal actualizado en memoria: ${draft.deal}.`), saved ? "success" : "warn");
}

async function handleTargetSubmit(event) {
  event.preventDefault();

  const formData = new FormData(targetForm);
  const existingTarget = ui.editingTargetId ? state.targets.find((target) => target.id === ui.editingTargetId) : null;
  const draft = normalizeTarget({
    ...existingTarget,
    id: ui.editingTargetId || generateId("target"),
    year: formData.get("year"),
    market: formData.get("market"),
    type: formData.get("type"),
    platform: formData.get("platform"),
    newTraffic: formData.has("newTraffic"),
    newSigned: formData.get("newSigned"),
    integrations: formData.get("integrations"),
    ddPipeline: formData.get("ddPipeline"),
    newGoLive: formData.get("newGoLive"),
    totalGoLive: formData.get("totalGoLive"),
  });

  if (!draft.market.trim()) {
    setBanner("El campo Market es obligatorio para targets.", "danger");
    return;
  }

  if (ui.editingTargetId) {
    state.targets = state.targets.map((target) => (target.id === ui.editingTargetId ? draft : target));
  } else {
    state.targets = [draft, ...state.targets];
  }

  const saved = await persistState();
  ui.editingTargetId = null;
  resetTargetForm();
  renderAll();
  ui.activeView = "targets";
  renderViewState();
  setBanner(
    buildExcelBanner(saved ? `Target guardado en Excel para ${draft.market}.` : `Target actualizado en memoria para ${draft.market}.`),
    saved ? "success" : "warn"
  );
}

async function handleTaskSubmit(event) {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const existingTask = ui.editingTaskId ? state.tasks.find((task) => task.id === ui.editingTaskId) : null;
  const now = new Date().toISOString();
  const traceEntry = cleanText(formData.get("traceEntry"));
  const draft = normalizeTask({
    ...existingTask,
    id: ui.editingTaskId || generateId("task"),
    title: formData.get("title"),
    scopeType: formData.get("scopeType"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    owner: formData.get("owner"),
    dealId: formData.get("dealId"),
    targetId: formData.get("targetId"),
    deal: formData.get("deal"),
    client: formData.get("client"),
    operator: formData.get("operator"),
    market: formData.get("market"),
    targetYear: formData.get("targetYear"),
    jiraTicket: formData.get("jiraTicket"),
    nextStep: formData.get("nextStep"),
    notes: formData.get("notes"),
    traceLog: appendTraceLog(existingTask?.traceLog, traceEntry),
    createdAt: existingTask?.createdAt || now,
    updatedAt: now,
  });

  if (!draft.title.trim()) {
    setBanner("El campo Title es obligatorio para tareas.", "danger");
    return;
  }

  if (ui.editingTaskId) {
    state.tasks = state.tasks.map((task) => (task.id === ui.editingTaskId ? draft : task));
  } else {
    state.tasks = [draft, ...state.tasks];
  }

  const saved = await persistState();
  ui.editingTaskId = null;
  resetTaskForm();
  renderAll();
  ui.activeView = "tasks";
  renderViewState();
  setBanner(buildExcelBanner(saved ? `Tarea guardada: ${draft.title}.` : `Tarea actualizada solo en memoria: ${draft.title}.`), saved ? "success" : "warn");
}

async function handleDealAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id, market } = button.dataset;
  if (action === "create-task-from-market") {
    prefillTaskFromMarket(market);
    return;
  }
  if (action === "create-task-from-deal") {
    const sourceDeal = state.deals.find((item) => item.id === id);
    if (sourceDeal) {
      prefillTaskFromDeal(sourceDeal);
    }
    return;
  }

  const deal = state.deals.find((item) => item.id === id);
  if (!deal) {
    return;
  }

  if (action === "edit-deal") {
    ui.activeView = "pipeline";
    ui.editingDealId = id;
    fillDealForm(deal);
    renderViewState();
    setBanner(`Editing deal: ${deal.deal}.`, "default");
  }

  if (action === "delete-deal") {
    if (!window.confirm(`Delete the deal "${deal.deal}"?`)) {
      return;
    }

    state.deals = state.deals.filter((item) => item.id !== id);
    const saved = await persistState();
    if (ui.editingDealId === id) {
      ui.editingDealId = null;
      resetDealForm();
    }
    renderAll();
    setBanner(buildExcelBanner(saved ? `Deal deleted: ${deal.deal}.` : `Deal deleted in memory only: ${deal.deal}.`), saved ? "warn" : "danger");
  }
}

async function handleLeadTrackerSubmit(event) {
  const form = event.target.closest("[data-lead-task-form]");
  if (!form) {
    return;
  }

  event.preventDefault();
  const leadId = form.dataset.leadId;
  const currentLead = state.deals.find((deal) => deal.id === leadId);
  if (!currentLead) {
    return;
  }

  const formData = new FormData(form);
  const updatedLead = normalizeDeal({
    ...currentLead,
    lastFollowUp: formData.get("lastFollowUp"),
    actionItems: formData.get("actionItems"),
    updates: formData.get("updates"),
  });

  state.deals = state.deals.map((deal) => (deal.id === leadId ? updatedLead : deal));
  const saved = await persistState();
  renderAll();
  setBanner(
    buildExcelBanner(saved ? `Seguimiento actualizado: ${updatedLead.deal}.` : `Seguimiento actualizado solo en memoria: ${updatedLead.deal}.`),
    saved ? "success" : "warn"
  );
}

async function handleTargetAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const target = state.targets.find((item) => item.id === id);
  if (!target) {
    return;
  }

  if (action === "create-task-from-target") {
    prefillTaskFromTarget(target);
    return;
  }

  if (action === "edit-target") {
    ui.activeView = "targets";
    ui.editingTargetId = id;
    fillTargetForm(target);
    renderViewState();
    setBanner(`Editando target: ${target.market} ${target.year}.`, "default");
  }

  if (action === "delete-target") {
    if (!window.confirm(`Eliminar el target de ${target.market} ${target.year}?`)) {
      return;
    }

    state.targets = state.targets.filter((item) => item.id !== id);
    const saved = await persistState();
    if (ui.editingTargetId === id) {
      ui.editingTargetId = null;
      resetTargetForm();
    }
    renderAll();
    setBanner(
      buildExcelBanner(saved ? `Target eliminado: ${target.market} ${target.year}.` : `Target eliminado solo en memoria: ${target.market} ${target.year}.`),
      saved ? "warn" : "danger"
    );
  }
}

async function handleTaskAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const task = state.tasks.find((item) => item.id === id);
  if (!task) {
    return;
  }

  if (action === "edit-task") {
    ui.activeView = "tasks";
    ui.editingTaskId = id;
    fillTaskForm(task);
    renderViewState();
    setBanner(`Editando tarea: ${task.title}.`, "default");
  }

  if (action === "delete-task") {
    if (!window.confirm(`Eliminar la tarea "${task.title}"?`)) {
      return;
    }

    state.tasks = state.tasks.filter((item) => item.id !== id);
    const saved = await persistState();
    if (ui.editingTaskId === id) {
      ui.editingTaskId = null;
      resetTaskForm();
    }
    renderAll();
    setBanner(buildExcelBanner(saved ? `Tarea eliminada: ${task.title}.` : `Tarea eliminada solo en memoria: ${task.title}.`), saved ? "warn" : "danger");
  }
}

function prefillTaskFromDeal(deal) {
  const draft = normalizeTask({
    ...createEmptyTask(),
    title: `Follow-up ${deal.client || deal.deal}`,
    scopeType: "Client",
    dealId: deal.id,
    deal: deal.deal,
    client: deal.client,
    operator: deal.operator,
    market: deal.market,
    jiraTicket: deal.jira,
    owner: deal.kam,
    nextStep: deal.actionItems,
    notes: deal.statusText || deal.comments,
  });
  ui.activeView = "tasks";
  ui.editingTaskId = null;
  fillTaskForm(draft);
  renderViewState();
  setBanner(`Nueva tarea prefijada desde ${deal.deal}.`, "default");
}

function prefillTaskFromMarket(market) {
  const draft = normalizeTask({
    ...createEmptyTask(),
    title: `Market follow-up ${market || "sin mercado"}`,
    scopeType: "Market",
    market,
    targetYear: getActiveTargetYear(),
  });
  ui.activeView = "tasks";
  ui.editingTaskId = null;
  fillTaskForm(draft);
  renderViewState();
  setBanner(`Nueva tarea prefijada para ${market || "mercado"}.`, "default");
}

function prefillTaskFromTarget(target) {
  const draft = normalizeTask({
    ...createEmptyTask(),
    title: `Target coverage ${target.market} ${target.year}`,
    scopeType: "Target",
    targetId: target.id,
    market: target.market,
    targetYear: target.year,
    nextStep: `Cubrir target de ${target.newSigned} nuevos firmados.`,
    notes: `Integrations ${target.integrations} · DD ${target.ddPipeline} · Go Live ${target.newGoLive}`,
  });
  ui.activeView = "tasks";
  ui.editingTaskId = null;
  fillTaskForm(draft);
  renderViewState();
  setBanner(`Nueva tarea prefijada para target ${target.market} ${target.year}.`, "default");
}

function fillDealForm(deal) {
  const fields = [
    "deal",
    "client",
    "operator",
    "groupName",
    "kam",
    "type",
    "market",
    "jurisdiction",
    "legalEntity",
    "siteStatus",
    "accountScope",
    "platform",
    "stage",
    "signingEta",
    "signingYear",
    "signingMonth",
    "dealValue",
    "dealValueAlt",
    "legalStatus",
    "ddStatus",
    "integrationStatus",
    "goLiveStatus",
    "comments",
    "actionItems",
    "source",
    "statusText",
    "month",
    "evo",
    "status",
    "agreement",
    "integration",
    "dd",
    "signedEta",
    "liveSince",
    "lastFollowUp",
    "handover",
    "prospectDate",
    "offerDate",
    "integrationDate",
    "liveDate",
    "brands",
    "entityInfo",
    "casinoName",
    "ezugiId",
    "evoInstance",
    "evoSkinId",
    "ezugiSkin",
    "url",
    "jira",
    "ddTicket",
    "skype",
    "integrationEmail",
    "updates",
    "dbColumn1",
    "dbColumn2",
    "dbColumn3",
    "dbColumn4",
    "dbColumn5",
    "dbColumn6",
    "dbColumn7",
    "dbColumn8",
    "dbColumn9",
    "dbColumn10",
    "dbColumn11",
    "dbColumn12",
    "dbColumn13",
    "dbColumn14",
  ];

  fields.forEach((field) => {
    dealForm.elements[field].value = deal[field] ?? "";
  });

  [
    "newTraffic",
    "leadFlag",
    "signedFlag",
    "ddStartedFlag",
    "ddCompletedFlag",
    "integrationStartedFlag",
    "integrationCompletedFlag",
    "goLiveFlag",
  ].forEach((field) => {
    dealForm.elements[field].checked = Boolean(deal[field]);
  });

  elements.dealFormTitle.textContent = `Edit Deal: ${deal.deal}`;
  elements.dealSubmitButton.textContent = "Update Deal";
}

function resetDealForm() {
  const draft = createEmptyDeal();
  dealForm.reset();
  fillDealForm(draft);
  ui.editingDealId = null;
  elements.dealFormTitle.textContent = "New Deal";
  elements.dealSubmitButton.textContent = "Save Deal";
}

function fillTargetForm(target) {
  ["year", "market", "type", "platform", "newSigned", "integrations", "ddPipeline", "newGoLive", "totalGoLive"].forEach(
    (field) => {
      targetForm.elements[field].value = target[field] ?? "";
    }
  );

  targetForm.elements.newTraffic.checked = Boolean(target.newTraffic);
  elements.targetFormTitle.textContent = `Editar target: ${target.market}`;
  elements.targetSubmitButton.textContent = "Actualizar target";
}

function resetTargetForm() {
  const draft = createEmptyTarget();
  targetForm.reset();
  fillTargetForm(draft);
  ui.editingTargetId = null;
  elements.targetFormTitle.textContent = "Nuevo target";
  elements.targetSubmitButton.textContent = "Guardar target";
}

function fillTaskForm(task) {
  [
    "title",
    "scopeType",
    "status",
    "priority",
    "dueDate",
    "owner",
    "dealId",
    "targetId",
    "deal",
    "client",
    "operator",
    "market",
    "targetYear",
    "jiraTicket",
    "nextStep",
    "notes",
  ].forEach((field) => {
    taskForm.elements[field].value = task[field] ?? "";
  });

  taskForm.elements.traceEntry.value = "";
  taskForm.elements.traceLog.value = task.traceLog || "";
  elements.taskFormTitle.textContent = task.title ? `Editar tarea: ${task.title}` : "Nueva tarea";
  elements.taskSubmitButton.textContent = task.title ? "Actualizar tarea" : "Guardar tarea";
}

function resetTaskForm() {
  const draft = createEmptyTask();
  taskForm.reset();
  fillTaskForm(draft);
  ui.editingTaskId = null;
  elements.taskFormTitle.textContent = "Nueva tarea";
  elements.taskSubmitButton.textContent = "Guardar tarea";
}

function getScopedDeals() {
  return state.deals.filter((deal) => {
    const parts = getDealTimeParts(deal);

    if (ui.filters.year !== "All" && String(parts.year || "") !== ui.filters.year) {
      return false;
    }

    if (ui.filters.quarter !== "All" && parts.quarter !== ui.filters.quarter) {
      return false;
    }

    if (ui.filters.month !== "All" && parts.monthLabel !== ui.filters.month) {
      return false;
    }

    return true;
  });
}

function getFilteredDeals() {
  const search = normalizeSearchText(ui.filters.search);

  return [...getPipelineBaseDeals()]
    .filter((deal) => {
      if (ui.pipelineFinder.selectedDealId && deal.id !== ui.pipelineFinder.selectedDealId) {
        return false;
      }

      if (!search) {
        return true;
      }

      const haystack = normalizeSearchText(
        `${deal.deal} ${deal.client} ${deal.operator} ${deal.casinoName} ${deal.groupName} ${deal.kam} ${deal.market} ${deal.platform} ${deal.legalEntity} ${deal.statusText} ${deal.comments} ${deal.jira} ${deal.ddTicket} ${deal.url} ${deal.brands} ${deal.entityInfo} ${deal.skype} ${deal.integrationEmail} ${deal.siteStatus} ${deal.actionItems} ${deal.updates} ${deal.dd} ${deal.integration}`
      );
      return haystack.includes(search);
    })
    .sort((left, right) => {
      const rightValue = Number(right.dealValue || 0);
      const leftValue = Number(left.dealValue || 0);
      if (rightValue !== leftValue) {
        return rightValue - leftValue;
      }
      return left.deal.localeCompare(right.deal);
    });
}

function getPipelineBaseDeals() {
  return getScopedDeals().filter((deal) => {
    if (ui.filters.stage !== "All" && deal.stage !== ui.filters.stage) {
      return false;
    }

    if (ui.filters.market !== "All" && deal.market !== ui.filters.market) {
      return false;
    }

    if (ui.filters.type !== "All" && deal.type !== ui.filters.type) {
      return false;
    }

    if (ui.filters.traffic === "New" && !deal.newTraffic) {
      return false;
    }

    if (ui.filters.traffic === "Existing" && deal.newTraffic) {
      return false;
    }

    return true;
  });
}

function buildPipelineFinderSuggestions(query, deals) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return [];
  }

  return deals
    .map((deal) => buildPipelineFinderSuggestion(deal, normalizedQuery))
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, 8);
}

function buildPipelineFinderSuggestion(deal, normalizedQuery) {
  const matches = [
    scorePipelineFinderField("Deal", deal.deal, normalizedQuery, 5),
    scorePipelineFinderField("Lead", deal.leadFlag ? deal.deal : "", normalizedQuery, 4),
    scorePipelineFinderField("Client", deal.client, normalizedQuery, 4),
    scorePipelineFinderField("Operator", deal.operator, normalizedQuery, 4),
    scorePipelineFinderField("Market", deal.market, normalizedQuery, 3),
    scorePipelineFinderField("Casino", deal.casinoName, normalizedQuery, 3),
    scorePipelineFinderField("Group", deal.groupName, normalizedQuery, 3),
    scorePipelineFinderField("Jira", deal.jira, normalizedQuery, 3),
    scorePipelineFinderField("DD Ticket", deal.ddTicket, normalizedQuery, 3),
    scorePipelineFinderField("Website", deal.url, normalizedQuery, 2),
    scorePipelineFinderField("Integration Chat", deal.skype, normalizedQuery, 2),
  ].filter(Boolean);

  if (matches.length === 0) {
    return null;
  }

  const bestMatch = matches.sort((left, right) => right.score - left.score)[0];
  return {
    dealId: deal.id,
    title: bestMatch.value,
    matchLabel: bestMatch.label,
    subtitle: buildPipelineFinderSubtitle(deal, bestMatch.value),
    meta: [deal.market || "No market", deal.stage || "No stage", formatDealCommercialMetric(deal)].join(" · "),
    searchValue: bestMatch.value,
    score: bestMatch.score,
  };
}

function scorePipelineFinderField(label, rawValue, normalizedQuery, weight) {
  const value = cleanText(rawValue);
  const normalizedValue = normalizeSearchText(value);
  if (!normalizedValue || !normalizedQuery) {
    return null;
  }

  let score = 0;
  if (normalizedValue === normalizedQuery) {
    score = weight * 100 + 400;
  } else if (normalizedValue.startsWith(normalizedQuery)) {
    score = weight * 100 + 260;
  } else if (normalizedValue.includes(` ${normalizedQuery}`)) {
    score = weight * 100 + 180;
  } else if (normalizedValue.includes(normalizedQuery)) {
    score = weight * 100 + 120;
  } else {
    return null;
  }

  return {
    label,
    value,
    score,
  };
}

function buildPipelineFinderSubtitle(deal, activeValue) {
  const parts = [deal.deal, deal.client, deal.operator, deal.casinoName, deal.groupName]
    .map((value) => cleanText(value))
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .filter((value) => value !== cleanText(activeValue));

  return parts.join(" · ") || cleanText(deal.source || "No additional context");
}

function getRiskDeals(deals = getScopedDeals()) {
  return deals
    .map((deal) => {
      const followUpGap = daysSince(deal.lastFollowUp);
      const etaGap = daysUntil(deal.signingEta);
      const reasons = [];
      let severity = 0;
      let tone = "is-warn";

      if (isBlockedDeal(deal)) {
        reasons.push("A blocker has been flagged across legal, DD, integration, or commercial agreement.");
        severity += 3;
        tone = "is-danger";
      }

      if (deal.stage === "DD" && followUpGap > 30) {
        reasons.push(`DD has gone ${followUpGap} days without follow-up.`);
        severity += 2;
      }

      if (!deal.signedFlag && etaGap >= 0 && etaGap <= 14) {
        reasons.push(`Signing ETA falls within the next ${etaGap} days.`);
        severity += 1;
      }

      if (deal.stage === "On Hold") {
        reasons.push("The deal is currently on hold.");
        severity += 2;
      }

      if (severity === 0) {
        return null;
      }

      return {
        deal,
        severity,
        tone,
        reason: reasons.join(" "),
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.severity - left.severity || compareNullableDates(left.deal.lastFollowUp, right.deal.lastFollowUp));
}

function isBlockedDeal(deal) {
  const fields = [deal.legalStatus, deal.ddStatus, deal.integrationStatus, deal.goLiveStatus, deal.agreement, deal.status];
  return fields.some((value) => String(value || "").toLowerCase().includes("blocked"));
}

function getDealTimeParts(deal) {
  const explicitYear = toNullableNumber(deal.signingYear);
  const explicitMonth = toNullableNumber(deal.signingMonth) || monthNumberFromLabel(deal.month);
  const dateText = deal.signedEta || deal.signingEta || deal.liveSince || deal.lastFollowUp || "";

  let dateYear = null;
  let dateMonth = null;
  if (dateText) {
    const date = new Date(`${dateText}T00:00:00`);
    if (!Number.isNaN(date.getTime())) {
      dateYear = date.getFullYear();
      dateMonth = date.getMonth() + 1;
    }
  }

  const year = explicitYear || dateYear;
  const month = explicitMonth || dateMonth;
  return {
    year,
    month,
    quarter: month ? `Q${Math.ceil(month / 3)}` : null,
    monthLabel: month ? MONTH_LABELS[month - 1] : null,
    dateText,
  };
}

function monthNumberFromLabel(value) {
  const normalized = cleanText(value).slice(0, 3).toLowerCase();
  const index = MONTH_LABELS.findIndex((label) => label.toLowerCase() === normalized);
  return index >= 0 ? index + 1 : null;
}

function quarterFromMonthLabel(label) {
  const month = monthNumberFromLabel(label);
  return month ? `Q${Math.ceil(month / 3)}` : "All";
}

function buildTimeWindowLabel() {
  const parts = [];
  if (ui.filters.year !== "All") {
    parts.push(ui.filters.year);
  }
  if (ui.filters.quarter !== "All") {
    parts.push(ui.filters.quarter);
  }
  if (ui.filters.month !== "All") {
    parts.push(ui.filters.month);
  }
  return parts.length ? parts.join(" · ") : "All periods";
}

function buildTimeFilterSummary() {
  const scopedDeals = getScopedDeals();
  return `${buildTimeWindowLabel()} · ${scopedDeals.length} visible deals in scope`;
}

function buildTimelineSeries(deals) {
  if (ui.filters.year !== "All") {
    return MONTH_LABELS.map((label, index) => {
      const monthDeals = deals.filter((deal) => getDealTimeParts(deal).month === index + 1);
      return {
        label,
        count: monthDeals.length,
        value: sumValues(monthDeals.map((deal) => deal.dealValue)),
        weightedCount: sumValues(monthDeals.map((deal) => getForecastProbability(deal))),
      };
    });
  }

  const yearMap = new Map();
  deals.forEach((deal) => {
    const parts = getDealTimeParts(deal);
    const key = parts.year ? String(parts.year) : "Undated";
    const entry = yearMap.get(key) || { label: key, count: 0, value: 0, weightedCount: 0 };
    entry.count += 1;
    entry.value += Number(deal.dealValue || 0);
    entry.weightedCount += getForecastProbability(deal);
    yearMap.set(key, entry);
  });

  return Array.from(yearMap.values()).sort((left, right) => left.label.localeCompare(right.label));
}

function formatDealPeriod(deal) {
  const parts = getDealTimeParts(deal);
  if (parts.year && parts.monthLabel) {
    return `${parts.monthLabel} ${parts.year}`;
  }
  if (parts.year && parts.quarter) {
    return `${parts.quarter} ${parts.year}`;
  }
  if (parts.year) {
    return String(parts.year);
  }
  return "Undated";
}

function composeDealStateLabel(deal) {
  return [deal.status, deal.legalStatus, deal.ddStatus, deal.integrationStatus, deal.goLiveStatus].filter(Boolean).slice(0, 3).join(" / ");
}

function getDealHealth(deal) {
  if (isBlockedDeal(deal) || deal.stage === "On Hold") {
    return { label: "Attention", pillClass: "blocked", cardClass: "health-attention" };
  }
  if (deal.goLiveFlag || deal.stage === "Live") {
    return { label: "Live", pillClass: "success", cardClass: "health-live" };
  }
  if (deal.signedFlag || deal.stage === "Signed") {
    return { label: "Signed", pillClass: "info", cardClass: "health-signed" };
  }
  return { label: "Open", pillClass: "neutral", cardClass: "health-open" };
}

function buildForecastSnapshot(deals) {
  const activeDeals = getForecastEligibleDeals(deals);
  const liveDeals = activeDeals.filter((deal) => deal.stage === "Live" || deal.goLiveFlag);
  const pipelineDeals = activeDeals.filter((deal) => !["Live", "Closed Lost"].includes(deal.stage));
  const weightedCount = sumValues(pipelineDeals.map((deal) => getForecastProbability(deal)));
  const commitCount = pipelineDeals.filter((deal) => getForecastProbability(deal) >= COMMIT_PROBABILITY).length;
  const targetCount = sumValues(
    state.targets
      .filter((target) => target.year === getActiveTargetYear())
      .map((target) => target.newSigned)
  );
  const coverageBase = weightedCount + liveDeals.length;

  return {
    weightedCount,
    commitCount,
    liveCount: liveDeals.length,
    targetCount,
    commitEquivalent: coverageBase,
    coverageRatio: targetCount > 0 ? coverageBase / targetCount : 0,
    operatorCount: uniqueValues(activeDeals.map((deal) => getPrimaryOperatorName(deal))).length,
    marketCount: uniqueValues(activeDeals.map((deal) => deal.market)).length,
  };
}

function buildForecastMarketRows(deals) {
  const groups = new Map();

  getForecastEligibleDeals(deals).forEach((deal) => {
    const market = deal.market || "Unknown";
    const entry = groups.get(market) || {
      market,
      totalCount: 0,
      dealValueTotal: 0,
      forecastValue: 0,
      weightedCount: 0,
      commitCount: 0,
      liveCount: 0,
      targetCount: getMarketTargetCount(market),
    };
    const probability = getForecastProbability(deal);
    const dealValue = getDealValueAmount(deal);
    entry.totalCount += 1;
    entry.dealValueTotal += dealValue;
    if (deal.stage === "Live" || deal.goLiveFlag) {
      entry.liveCount += 1;
    } else {
      entry.weightedCount += probability;
      entry.forecastValue += getForecastValue(deal);
      if (probability >= COMMIT_PROBABILITY) {
        entry.commitCount += 1;
      }
    }
    groups.set(market, entry);
  });

  return Array.from(groups.values())
    .map((entry) => {
      const coverageBase = entry.weightedCount + entry.liveCount;
      return {
        ...entry,
        targetGap: Math.max(entry.targetCount - coverageBase, 0),
        coverageRatio: entry.targetCount > 0 ? coverageBase / entry.targetCount : 0,
      };
    })
    .sort(
      (left, right) =>
        right.forecastValue - left.forecastValue ||
        right.weightedCount - left.weightedCount ||
        right.dealValueTotal - left.dealValueTotal ||
        left.market.localeCompare(right.market)
    );
}

function buildForecastOperatorRows(deals) {
  const groups = new Map();

  getForecastEligibleDeals(deals).forEach((deal) => {
    const operator = getPrimaryOperatorName(deal);
    const key = `${operator}__${deal.market || "Unknown"}`;
    const entry = groups.get(key) || {
      operator,
      market: deal.market || "Unknown",
      owner: getDealOwner(deal),
      groupName: getDealGroup(deal),
      totalCount: 0,
      dealValueTotal: 0,
      forecastValue: 0,
      weightedCount: 0,
      commitCount: 0,
      liveCount: 0,
      topStage: deal.stage || "Lead",
      stageRank: STAGE_ORDER.indexOf(deal.stage),
    };
    const probability = getForecastProbability(deal);
    const dealValue = getDealValueAmount(deal);
    entry.totalCount += 1;
    entry.dealValueTotal += dealValue;
    if (deal.stage !== "Live" && !deal.goLiveFlag) {
      entry.weightedCount += probability;
      entry.forecastValue += getForecastValue(deal);
      if (probability >= COMMIT_PROBABILITY) {
        entry.commitCount += 1;
      }
    } else {
      entry.liveCount += 1;
    }
    if (STAGE_ORDER.indexOf(deal.stage) > entry.stageRank) {
      entry.topStage = deal.stage;
      entry.stageRank = STAGE_ORDER.indexOf(deal.stage);
    }
    if (!entry.owner && getDealOwner(deal)) {
      entry.owner = getDealOwner(deal);
    }
    if (!entry.groupName && getDealGroup(deal)) {
      entry.groupName = getDealGroup(deal);
    }
    groups.set(key, entry);
  });

  return Array.from(groups.values())
    .filter((entry) => entry.totalCount > 0)
    .sort(
      (left, right) =>
        right.forecastValue - left.forecastValue ||
        right.weightedCount - left.weightedCount ||
        right.dealValueTotal - left.dealValueTotal ||
        left.operator.localeCompare(right.operator)
    );
}

function buildDecisionInsights(deals) {
  const cards = [];
  const marketRows = buildForecastMarketRows(deals).filter((row) => row.targetCount > 0);
  const operatorRows = buildForecastOperatorRows(deals);
  const risks = getRiskDeals(deals);
  const staleCount = deals.filter((deal) => !["Live", "Closed Lost"].includes(deal.stage) && daysSince(deal.lastFollowUp) > 30).length;
  const missingOwner = deals.filter((deal) => !getDealOwner(deal)).length;
  const missingLegal = deals.filter((deal) => !cleanText(deal.legalEntity || deal.entityInfo)).length;
  const missingWebsite = deals.filter((deal) => !cleanText(deal.url)).length;

  if (marketRows.length > 0) {
    const weakestMarket = [...marketRows].sort((left, right) => right.targetGap - left.targetGap || left.coverageRatio - right.coverageRatio)[0];
    cards.push({
      label: "Coverage gap",
      title: weakestMarket.targetGap > 0 ? `${weakestMarket.market} still requires ${formatSignedCount(weakestMarket.targetGap)}` : `${weakestMarket.market} is currently covering target`,
      body: `Forecast coverage is tracking at ${formatPercent(weakestMarket.coverageRatio)} against a target of ${weakestMarket.targetCount}.`,
      tone: weakestMarket.targetGap > 0 ? "is-warn" : "is-good",
    });
  }

  if (operatorRows.length > 0) {
    const totalWeighted = sumValues(operatorRows.map((row) => row.weightedCount)) || 1;
    const topOperator = operatorRows[0];
    cards.push({
      label: "Concentration",
      title: `${topOperator.operator} represents ${formatPercent(topOperator.weightedCount / totalWeighted)}`,
      body: `Primary market ${topOperator.market}. Owner ${topOperator.owner || "not assigned"} with ${formatForecastUnits(topOperator.weightedCount)} weighted output.`,
      tone: topOperator.weightedCount / totalWeighted > 0.25 ? "is-danger" : "is-neutral",
    });
  }

  cards.push({
    label: "Follow-up discipline",
    title: `${staleCount} accounts require refresh`,
    body: risks.length > 0 ? risks[0].reason : "No critical blockers are visible, but follow-up cadence should remain disciplined.",
    tone: staleCount > 0 ? "is-warn" : "is-good",
  });

  cards.push({
    label: "Data quality",
    title: `${missingOwner} without owner · ${missingLegal} without legal entity`,
    body: `${missingWebsite} accounts are missing a live website or operating URL. These gaps reduce forecast accuracy at operator level and weaken execution visibility.`,
    tone: missingOwner + missingLegal + missingWebsite > 0 ? "is-danger" : "is-good",
  });

  return cards;
}

function getForecastProbability(deal) {
  let probability = STAGE_FORECAST_WEIGHTS[deal.stage] ?? 0.15;
  const status = cleanText(deal.status).toLowerCase();
  const agreement = cleanText(deal.agreement).toLowerCase();
  const ddStatus = cleanText(deal.ddStatus).toLowerCase();
  const integrationStatus = cleanText(deal.integrationStatus).toLowerCase();
  const goLiveStatus = cleanText(deal.goLiveStatus).toLowerCase();
  const followUpGap = daysSince(deal.lastFollowUp);

  if (status === "offer") {
    probability = Math.max(probability, 0.32);
  }
  if (status === "legal") {
    probability = Math.max(probability, 0.5);
  }
  if (deal.signedFlag || agreement === "signed") {
    probability = Math.max(probability, 0.78);
  }
  if (deal.ddCompletedFlag || ddStatus === "completed") {
    probability = Math.max(probability, 0.86);
  }
  if (deal.integrationStartedFlag || ["in progress", "uat", "completed"].includes(integrationStatus)) {
    probability = Math.max(probability, deal.stage === "Integration" ? 0.91 : 0.84);
  }
  if (deal.goLiveFlag || ["scheduled", "live", "ready for sign-off"].includes(goLiveStatus)) {
    probability = Math.max(probability, deal.stage === "Live" ? 1 : 0.97);
  }
  if (isBlockedDeal(deal)) {
    probability -= 0.32;
  }
  if (deal.stage === "On Hold") {
    probability = Math.min(probability, 0.08);
  }
  if (followUpGap > 45) {
    probability -= 0.12;
  } else if (followUpGap > 30) {
    probability -= 0.06;
  }
  if (deal.stage === "Closed Lost") {
    probability = 0;
  }

  return clampNumber(probability, 0, 1);
}

function hasAnyDealValue(deals) {
  return deals.some((deal) => Number(deal.dealValue || 0) > 0);
}

function getForecastEligibleDeals(deals) {
  return deals.filter((deal) => deal.stage !== "Closed Lost");
}

function getMarketTargetCount(market) {
  const year = getActiveTargetYear();
  const exactTargets = state.targets.filter((target) => target.year === year && target.market === market);
  return sumValues(exactTargets.map((target) => target.newSigned));
}

function getPrimaryOperatorName(deal) {
  return cleanText(deal.operator || deal.client || deal.deal || "Unknown Operator");
}

function getDealGroup(deal) {
  return cleanText(deal.groupName);
}

function getDealOwner(deal) {
  return cleanText(deal.kam);
}

function buildDealContextLine(deal) {
  const parts = [getPrimaryOperatorName(deal), getDealGroup(deal), getDealOwner(deal)];
  const unique = [];
  parts.forEach((part) => {
    if (part && !unique.includes(part) && part !== cleanText(deal.deal)) {
      unique.push(part);
    }
  });
  return unique.join(" · ") || cleanText(deal.source || "No additional context");
}

function formatForecastUnits(value) {
  const numeric = Number(value || 0);
  return `${numeric.toFixed(1)} accts`;
}

function formatSignedCount(value) {
  const numeric = Number(value || 0);
  return `${numeric.toFixed(1)} accts`;
}

function formatDealCommercialMetric(deal) {
  if (Number(deal.dealValue || 0) > 0) {
    return formatCurrency(deal.dealValue);
  }
  return `P ${Math.round(getForecastProbability(deal) * 100)}%`;
}

function getDealValueAmount(deal) {
  return Number(deal?.dealValue || 0);
}

function getForecastValue(deal) {
  if (!deal || deal.stage === "Live" || deal.goLiveFlag) {
    return 0;
  }
  return getDealValueAmount(deal) * getForecastProbability(deal);
}

function resolveDealValue(input) {
  const primaryValue = toNullableNumber(input.dealValue);
  if (primaryValue !== null) {
    return primaryValue;
  }

  const secondaryValue = toNullableNumber(input.dealValueAlt);
  if (secondaryValue !== null) {
    return secondaryValue;
  }

  return shouldApplyDefaultDealValue(input) ? DEFAULT_MISSING_DEAL_VALUE : null;
}

function shouldApplyDefaultDealValue(input) {
  const hasIdentity = [input.deal, input.client, input.operator].some((value) => cleanText(value));
  if (!hasIdentity) {
    return false;
  }

  const stage = normalizeDealStage(input.stage);
  return stage !== "Closed Lost";
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderTrackingLinks(deal, density = "default") {
  const items = getDealTrackingItems(deal);

  if (items.length === 0) {
    return '<div class="tracking-links"><span class="tracking-empty">No active tracking links</span></div>';
  }

  return `
    <div class="tracking-links ${density === "compact" ? "is-compact" : ""}">
      ${items
        .map((item) => {
          const content = `
            <span>${escapeHtml(item.label)}</span>
            <strong title="${escapeAttribute(item.value)}">${escapeHtml(item.display)}</strong>
          `;

          if (item.href) {
            return `
              <a class="tracking-link" href="${escapeAttribute(item.href)}" target="_blank" rel="noreferrer">
                ${content}
              </a>
            `;
          }

          return `
            <div class="tracking-link is-static">
              ${content}
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderStageStatusBlock(deal, density = "default") {
  const items = getStageStatusItems(deal);
  return `
    <div class="stage-status-grid ${density === "compact" ? "is-compact" : ""}">
      ${items
        .map((item) => {
          return `
            <article class="stage-status-item">
              <span>${escapeHtml(item.label)}</span>
              <strong title="${escapeAttribute(item.value)}">${escapeHtml(item.value)}</strong>
              ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function getLeadDeals(deals = getScopedDeals()) {
  return deals.filter((deal) => deal.leadFlag || deal.stage === "Lead" || deal.stage === "New Business");
}

function getLeadReferenceDate(deal) {
  return deal.lastFollowUp || deal.signingEta || deal.signedEta || deal.liveSince || "";
}

function getLeadFollowUpIndicator(deal) {
  const hasFollowUp = Boolean(deal.lastFollowUp);
  const days = hasFollowUp ? daysSince(deal.lastFollowUp) : 999;

  if (!hasFollowUp) {
    return { label: "No follow-up", pillClass: "blocked", cardClass: "is-stale", days };
  }

  if (days <= 7) {
    return { label: `${days}d`, pillClass: "success", cardClass: "is-fresh", days };
  }

  if (days <= 21) {
    return { label: `${days}d`, pillClass: "info", cardClass: "is-due", days };
  }

  return { label: `${days}d`, pillClass: "blocked", cardClass: "is-stale", days };
}

function getDealTrackingItems(deal) {
  const items = [];
  const websiteHref = toExternalHref(deal.url);
  const jiraHref = toExternalHref(deal.jira);
  const chatHref = toExternalHref(deal.skype);

  if (deal.url) {
    items.push({
      label: "Website",
      value: deal.url,
      display: compactReferenceLabel(deal.url, "Website"),
      href: websiteHref,
    });
  }

  if (deal.jira) {
    items.push({
      label: "Jira TKT",
      value: deal.jira,
      display: compactReferenceLabel(deal.jira, "Jira"),
      href: jiraHref,
    });
  }

  if (deal.ddTicket) {
    items.push({
      label: "DD TKT",
      value: deal.ddTicket,
      display: deal.ddTicket,
      href: "",
    });
  }

  if (deal.skype) {
    items.push({
      label: "Integration Chat",
      value: deal.skype,
      display: compactReferenceLabel(deal.skype, "Chat"),
      href: chatHref,
    });
  }

  if (deal.integrationEmail) {
    items.push({
      label: "Email",
      value: deal.integrationEmail,
      display: deal.integrationEmail,
      href: `mailto:${deal.integrationEmail}`,
    });
  }

  return items;
}

function getStageStatusItems(deal) {
  return [
    buildStageStatusItem("Agreement / Contract", deal.agreement, deal.legalStatus),
    buildStageStatusItem("DD Status", deal.ddStatus, deal.dd),
    buildStageStatusItem("Integration Status", deal.integrationStatus, deal.integration),
  ];
}

function buildStageStatusItem(label, primaryValue, secondaryValue) {
  const primary = cleanText(primaryValue) || "N/A";
  const secondary = cleanText(secondaryValue);
  const note = secondary && secondary !== primary ? secondary : "";
  return {
    label,
    value: primary,
    note,
  };
}

function buildTaskScopeLabel(task) {
  if (task.scopeType === "Target") {
    return [task.market, task.targetYear].filter(Boolean).join(" · ") || "Target";
  }
  return [task.client, task.operator, task.deal, task.market].filter(Boolean).join(" · ") || task.scopeType;
}

function getLatestTraceLine(traceLog) {
  const value = cleanText(traceLog);
  if (!value) {
    return "";
  }
  const lines = value.split(" | ").filter(Boolean);
  return lines[lines.length - 1] || "";
}

function appendTraceLog(currentValue, entry) {
  const traceEntry = cleanText(entry);
  const existing = cleanText(currentValue);
  if (!traceEntry) {
    return existing;
  }
  const timestamp = new Date().toISOString().slice(0, 10);
  const item = `${timestamp} ${traceEntry}`;
  return existing ? `${existing} | ${item}` : item;
}

function compareTasks(left, right) {
  const statusRank = TASK_STATUS_OPTIONS.indexOf(left.status) - TASK_STATUS_OPTIONS.indexOf(right.status);
  if (statusRank !== 0) {
    return statusRank;
  }

  const priorityRank = TASK_PRIORITY_OPTIONS.indexOf(left.priority) - TASK_PRIORITY_OPTIONS.indexOf(right.priority);
  if (priorityRank !== 0) {
    return priorityRank;
  }

  const leftDue = left.dueDate || "9999-12-31";
  const rightDue = right.dueDate || "9999-12-31";
  if (leftDue !== rightDue) {
    return leftDue.localeCompare(rightDue);
  }

  return left.title.localeCompare(right.title);
}

function taskStatusClass(status) {
  const slug = toSlugKey(status);
  return slug ? `task-${slug}` : "task-open";
}

function taskStatusPillClass(status) {
  if (status === "Done") {
    return "success";
  }
  if (status === "Blocked") {
    return "blocked";
  }
  if (status === "Waiting") {
    return "info";
  }
  return "neutral";
}

function stageClassName(stage) {
  const slug = toSlugKey(stage);
  return slug ? `stage-${slug}` : "stage-unknown";
}

function toExternalHref(value) {
  const text = cleanText(value);
  if (!text) {
    return "";
  }

  if (/^[a-z]+:/i.test(text)) {
    return text;
  }

  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(text)) {
    return `https://${text}`;
  }

  return "";
}

function compactReferenceLabel(value, fallback) {
  const href = toExternalHref(value);
  if (!href) {
    return value || fallback;
  }

  try {
    const parsed = new URL(href);
    const segment = parsed.pathname
      .split("/")
      .filter(Boolean)
      .pop();

    if (parsed.hostname && fallback === "Website") {
      return parsed.hostname.replace(/^www\./, "");
    }

    if (segment && segment.length <= 36) {
      return segment;
    }

    return parsed.hostname.replace(/^www\./, "") || fallback;
  } catch (error) {
    return value || fallback;
  }
}

function getActiveTargetYear() {
  if (ui.filters.year !== "All") {
    return Number(ui.filters.year);
  }
  const years = state.targets.map((target) => target.year).filter(Boolean);
  return years.length ? Math.max(...years) : new Date().getFullYear();
}

function resolveDealYear(deal) {
  return deal.signingYear || yearFromDate(deal.signedEta) || yearFromDate(deal.signingEta) || new Date().getFullYear();
}

function setSelectOptions(select, values, currentValue) {
  const options = values.map((value) => `<option value="${escapeAttribute(value)}">${escapeHtml(value === "All" ? "All" : value)}</option>`);
  select.innerHTML = options.join("");
  select.value = values.includes(currentValue) ? currentValue : "All";

  if (!values.includes(currentValue)) {
    if (select === elements.filterStage) {
      ui.filters.stage = "All";
    }
    if (select === elements.filterMarket) {
      ui.filters.market = "All";
    }
    if (select === elements.filterType) {
      ui.filters.type = "All";
    }
    if (select === elements.globalFilterYear) {
      ui.filters.year = "All";
    }
    if (select === elements.globalFilterQuarter) {
      ui.filters.quarter = "All";
    }
    if (select === elements.globalFilterMonth) {
      ui.filters.month = "All";
    }
  }
}

async function resetDemoState() {
  try {
    const response = await fetch(API_RESET_DEMO_URL, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`No fue posible recargar la referencia (${response.status}).`);
    }
    await hydrateFromExcel();
    ui.editingDealId = null;
    ui.editingTargetId = null;
    ui.editingTaskId = null;
    resetDealForm();
    resetTargetForm();
    resetTaskForm();
    renderAll();
    setBanner(buildExcelBanner("Datos de referencia recargados desde tus archivos Excel."), "success");
  } catch (error) {
    state = createDefaultState();
    const saved = await persistState();
    renderAll();
    setBanner(
      buildExcelBanner(saved ? "Base local de respaldo recargada y guardada en Excel." : "Base local de respaldo cargada solo en memoria."),
      saved ? "success" : "warn"
    );
  }
}

function downloadCsv(filename, rows, columns) {
  const header = columns.map(([label]) => toCsvCell(label)).join(",");
  const lines = rows.map((row) =>
    columns
      .map(([, key]) => {
        const value = row[key];
        if (typeof value === "boolean") {
          return toCsvCell(value ? "TRUE" : "FALSE");
        }
        return toCsvCell(value ?? "");
      })
        .join(",")
  );
  const payload = `\ufeff${[header, ...lines].join("\n")}`;
  downloadBlob(filename, payload, "text/csv;charset=utf-8");
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  triggerBlobDownload(blob, filename);
}

async function downloadExcelWorkbook() {
  try {
    const response = await fetch(serverMeta.workbookUrl || API_DOWNLOAD_URL, {
      method: "GET",
      headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    });

    if (!response.ok) {
      throw new Error(`No fue posible descargar el Excel (${response.status}).`);
    }

    const blob = await response.blob();
    const filename = getDownloadFilename(response.headers.get("Content-Disposition")) || buildExportFilename("pipeline-command-center", "xlsx");
    triggerBlobDownload(blob, filename);
    setBanner(`Excel descargado: ${filename}.`, "success");
  } catch (error) {
    setBanner("No pude descargar el Excel. Verifica que el servidor local este activo e intenta otra vez.", "danger");
  }
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getDownloadFilename(contentDisposition) {
  const header = String(contentDisposition || "");
  if (!header) {
    return "";
  }

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch (error) {
      return utf8Match[1];
    }
  }

  const simpleMatch = header.match(/filename=\"?([^\";]+)\"?/i);
  return simpleMatch ? simpleMatch[1] : "";
}

function buildExportFilename(baseName, extension) {
  const safeBase = String(baseName || "export")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "export";
  const suffixParts = [];
  if (ui.filters.year !== "All") {
    suffixParts.push(ui.filters.year);
  }
  if (ui.filters.quarter !== "All") {
    suffixParts.push(ui.filters.quarter.toLowerCase());
  }
  if (ui.filters.month !== "All") {
    suffixParts.push(ui.filters.month.toLowerCase());
  }
  const timestamp = new Date().toISOString().slice(0, 10);
  const suffix = suffixParts.length ? `-${suffixParts.join("-")}` : "";
  return `${safeBase}${suffix}-${timestamp}.${extension}`;
}

function setBanner(message, tone = "default") {
  appBanner.textContent = message;
  appBanner.className = "banner";
  if (tone === "success") {
    appBanner.classList.add("is-success");
  }
  if (tone === "warn") {
    appBanner.classList.add("is-warn");
  }
  if (tone === "danger") {
    appBanner.classList.add("is-danger");
  }
}

function buildExcelBanner(message) {
  if (!serverMeta.workbookPath) {
    return message;
  }
  return `${message} Workbook: ${serverMeta.workbookPath}`;
}

function sumValues(values) {
  return values.reduce((total, value) => total + Number(value || 0), 0);
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompactCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

function formatPercent(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("es-PA", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("es-PA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeDateInput(value) {
  const text = cleanText(value);
  if (!text) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return text;
  }
  return date.toISOString().slice(0, 10);
}

function cleanText(value) {
  return String(value ?? "").replace(/\u00a0/g, " ").trim().replace(/\s+/g, " ");
}

function normalizeSearchText(value) {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function toSlugKey(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDealName(value) {
  return cleanText(value);
}

function normalizeDealMarket(value) {
  const text = cleanText(value);
  const aliases = {
    latam: "LATAM",
    "peru?": "Peru",
    salvador: "El Salvador",
    ".com, pa, pe, mx, do": "Multi-market",
    "colombia - panama": "Multi-market",
    "peru - mexico": "Multi-market",
    "latam .com": "LATAM",
    "rep dominicana": "Dominican Republic",
    asia: "Asia",
    dubay: "Dubai",
  };
  return aliases[text.toLowerCase()] || text;
}

function normalizeDealType(value) {
  const text = cleanText(value);
  const aliases = {
    b2c: "B2C",
    b2b: "B2B",
    social: "Social",
    retail: "Retail",
    "b2c + retail": "B2C + Retail",
    "b2b / b2c": "B2B / B2C",
    "b2c / b2b": "B2B / B2C",
  };
  return aliases[text.toLowerCase()] || text;
}

function normalizeDealPlatform(value) {
  const text = cleanText(value);
  const aliases = {
    tbc: "TBC",
    ngx: "NGX",
    "bet construct": "BetConstruct",
    betconstruct: "BetConstruct",
  };
  return aliases[text.toLowerCase()] || text;
}

function normalizeDealStage(value) {
  const text = cleanText(value);
  const aliases = {
    lead: "Lead",
    "new business": "New Business",
    legal: "Legal",
    signed: "Signed",
    dd: "DD",
    integration: "Integration",
    "go live": "Go Live",
    live: "Live",
    "on hold": "On Hold",
    "closed lost": "Closed Lost",
  };
  return aliases[text.toLowerCase().replace(/-/g, " ")] || text;
}

function daysSince(dateText) {
  if (!dateText) {
    return 0;
  }

  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  const diff = Date.now() - date.getTime();
  return Math.floor(diff / 86400000);
}

function daysUntil(dateText) {
  if (!dateText) {
    return Number.POSITIVE_INFINITY;
  }

  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  const diff = date.getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function isGlobalTarget(target) {
  return target.market === "Global" && target.type === "All" && target.platform === "All";
}

function yearFromDate(dateText) {
  if (!dateText) {
    return null;
  }

  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getFullYear();
}

function compareNullableDates(left, right) {
  const leftTime = left ? new Date(`${left}T00:00:00`).getTime() : 0;
  const rightTime = right ? new Date(`${right}T00:00:00`).getTime() : 0;
  return leftTime - rightTime;
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function toCsvCell(value) {
  const text = String(value ?? "");
  const escaped = text.replaceAll('"', '""');
  return `"${escaped}"`;
}
