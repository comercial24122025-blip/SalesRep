const APP_BASE_URL = new URL("./", window.location.href);
const DEFAULT_API_ORIGIN = window.location.protocol === "file:" ? "http://localhost:8000" : window.location.origin;
const API_STATE_URL = resolveApiUrl("/api/state");
const API_SAVE_URL = resolveApiUrl("/api/save");
const API_RESET_DEMO_URL = resolveApiUrl("/api/reset-demo");
const API_DOWNLOAD_URL = resolveApiUrl("/api/download");
const API_UPLOAD_URL = resolveApiUrl("/api/upload");
const STATIC_STATE_URL = resolveAssetUrl("data/published-state.json");
const STATIC_WORKBOOK_URL = resolveAssetUrl("data/pipeline-command-center.xlsx");
const BROWSER_STATE_STORAGE_KEY = "salesrep-published-state-v1";
const STAGE_ORDER = ["Lead", "Qualified", "Proposal", "Legal", "DD", "Integration", "Legal Approval", "Go Live", "Live", "Handover"];
const ALL_STAGES = [...STAGE_ORDER];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DEFAULT_DASHBOARD_YEARS = ["2024", "2025", "2026"];
const DEFAULT_MISSING_DEAL_VALUE = 25000;
const COMMIT_PROBABILITY = 0.75;
const STAGE_CADENCE_BENCHMARK_DAYS = 30;
const CAMPAIGN_GROWTH_BENCHMARK_RATIO = 1;
const CONTRACT_STATUS_OPTIONS = ["Not Started", "Negotiation", "Signed", "Blocked"];
const PROGRESS_STATUS_OPTIONS = ["Not Started", "Started", "In Progress", "Completed", "Blocked"];
const GO_LIVE_STATUS_OPTIONS = ["Not Started", "Legal Sign-Off", "Completed", "Live", "Blocked"];
const DEAL_PRIORITY_OPTIONS = ["High Priority", "Medium", "Low", "Observation"];
const INACTIVE_DEAL_STATUSES = ["canceled", "cancelled", "inactive", "on hold", "closed lost"];
const TASK_SCOPE_TYPES = ["Client", "Market", "Target", "Operator", "Deal"];
const TASK_STATUS_OPTIONS = ["Open", "In Progress", "Waiting", "Blocked", "Done"];
const TASK_PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];
const USER_ROLE_OPTIONS = ["Administrator", "Sales Manager", "Account Manager", "Revenue Ops", "Viewer"];
const USER_STATUS_OPTIONS = ["Active", "Invited", "Suspended"];
const CAMPAIGN_TYPE_OPTIONS = ["Activation", "Tournament", "Giveaway", "Progressive", "Free Spins", "Promo Bundle"];
const CAMPAIGN_STATUS_OPTIONS = ["Planned", "Ready", "Live", "Paused", "Completed", "Cancelled"];
const CAMPAIGN_PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];
const OPPORTUNITY_SCORE_WEIGHTS = {
  revenuePotentialScore: 0.3,
  strategicFitScore: 0.2,
  closeProbabilityScore: 0.15,
  licenseScore: 0.1,
  legalComplexityScore: 0.1,
  technicalComplexityScore: 0.1,
  commercialUrgencyScore: 0.05,
};
const STAGE_FORECAST_WEIGHTS = {
  Lead: 0.12,
  Qualified: 0.24,
  Proposal: 0.38,
  Legal: 0.52,
  DD: 0.68,
  Integration: 0.82,
  "Legal Approval": 0.93,
  "Go Live": 0.98,
  Live: 1,
  Handover: 1,
};
const STAGE_CADENCE_MILESTONES = [
  ["Lead", "prospectDate"],
  ["Proposal", "offerDate"],
  ["Legal", "signedEta"],
  ["Integration", "integrationDate"],
  ["Go Live", "liveDate"],
  ["Handover", "handover"],
];

const KPI_CATALOGUE = [
  {
    block: "Lead",
    name: "New Leads Generated",
    definition: "# de nuevos leads agregados en el periodo",
    stage: "Lead",
    frequency: "Weekly / Monthly",
    notes: "Count of distinct clients added",
  },
  {
    block: "Qualified",
    name: "Qualified Opportunities",
    definition: "# de oportunidades activas con potencial comercial real",
    stage: "Qualified",
    frequency: "Monthly",
    notes: "Use Raw Status / Next Action",
  },
  {
    block: "Proposal",
    name: "Proposal Value (€)",
    definition: "SUM of Deal Value (€) in Proposal",
    stage: "Proposal",
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
    definition: "Promedio de dias desde ingreso a Legal hasta salida de la etapa",
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
    name: "Legal to Go Live Conversion %",
    definition: "Go Live deals / opportunities that entered Legal",
    stage: "Legal-DD-Integration-Legal Approval-Go Live",
    frequency: "Monthly",
    notes: "Requires clear signed definition",
  },
  {
    block: "Handover",
    name: "Handover Completion Rate %",
    definition: "Completed Handovers / Go Live Accounts",
    stage: "Handover",
    frequency: "Monthly",
    notes: "Measures transfer discipline after launch",
  },
  {
    block: "Execution",
    name: "Stage Cadence KPI",
    definition: "Average days between recorded funnel milestone dates",
    stage: "Lead-Proposal-Legal-Integration-Go Live-Handover",
    frequency: "Weekly / Monthly",
    notes: "Uses Prospect, Offer, Signed ETA, Integration, Live, and Handover dates; benchmark <= 30 days",
  },
  {
    block: "Execution",
    name: "Avg Stage Duration",
    definition: "Average number of days spent between recorded funnel stage transitions",
    stage: "Lead-Proposal-Legal-Integration-Go Live-Handover",
    frequency: "Weekly / Monthly",
    notes: "Use stage transition dates to identify the slowest handoffs in the funnel",
  },
  {
    block: "Execution",
    name: "Tasks Completed",
    definition: "Completed tasks / total tasks in the selected review window",
    stage: "Tasks / Execution",
    frequency: "Weekly / Monthly",
    notes: "Measures execution discipline and follow-up completion",
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
  {
    block: "Growth",
    name: "Campaign Growth %",
    definition: "Forecast Lift EUR / Budget EUR x 100",
    stage: "Campaigns / Growth",
    frequency: "Weekly / Monthly",
    notes: "Projected incremental lift relative to committed campaign investment",
  },
  {
    block: "Growth",
    name: "Campaigns Executed",
    definition: "Campaigns in Ready, Live, or Completed status",
    stage: "Campaigns / Growth",
    frequency: "Weekly / Monthly",
    notes: "Tracks how many campaigns have moved from planning into active execution",
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
  ["Segment", "segment"],
  ["Primary Contact", "primaryContact"],
  ["Decision Maker", "decisionMaker"],
  ["License Status", "licenseStatus"],
  ["Products Current", "productsCurrent"],
  ["Products Potential", "productsPotential"],
  ["Current Competitors", "currentCompetitors"],
  ["Target Priority", "targetPriority"],
  ["Strategic Fit", "strategicFit"],
  ["Revenue Potential EUR", "revenuePotentialEur"],
  ["Revenue Potential Score", "revenuePotentialScore"],
  ["Strategic Fit Score", "strategicFitScore"],
  ["Close Probability Score", "closeProbabilityScore"],
  ["License Score", "licenseScore"],
  ["Legal Complexity Score", "legalComplexityScore"],
  ["Technical Complexity Score", "technicalComplexityScore"],
  ["Commercial Urgency Score", "commercialUrgencyScore"],
  ["Opportunity Score", "opportunityScore"],
  ["Priority Class", "priorityClass"],
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
  ["Task Number", "taskNumber"],
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

const CAMPAIGN_CSV_COLUMNS = [
  ["Title", "title"],
  ["Campaign Type", "campaignType"],
  ["Status", "status"],
  ["Priority", "priority"],
  ["Operator", "operator"],
  ["Client", "client"],
  ["Deal", "deal"],
  ["Market", "market"],
  ["Owner", "owner"],
  ["Channel", "channel"],
  ["Start Date", "startDate"],
  ["End Date", "endDate"],
  ["Budget EUR", "budgetEur"],
  ["Prize Value EUR", "prizeValueEur"],
  ["Forecast Lift EUR", "forecastLiftEur"],
  ["Growth %", "growthPct"],
  ["Target Players", "targetPlayers"],
  ["Target Wager", "targetWager"],
  ["Target GGR", "targetGgr"],
  ["Jira Ticket", "jiraTicket"],
  ["Landing URL", "landingUrl"],
  ["Mechanic", "mechanic"],
  ["Offer Details", "offerDetails"],
  ["Success Metric", "successMetric"],
  ["Next Step", "nextStep"],
  ["Trace Log", "traceLog"],
  ["Notes", "notes"],
  ["Updated At", "updatedAt"],
];

const appBanner = document.getElementById("app-banner");
const dealForm = document.getElementById("deal-form");
const marketIntelForm = document.getElementById("market-intel-form");
const targetForm = document.getElementById("target-form");
const taskForm = document.getElementById("task-form");
const campaignForm = document.getElementById("campaign-form");
const workspaceForm = document.getElementById("workspace-form");
const userForm = document.getElementById("user-form");

const viewTabs = Array.from(document.querySelectorAll("[data-view-trigger]"));
const views = Array.from(document.querySelectorAll("[data-view]"));

const elements = {
  focusSummary: document.getElementById("focus-summary"),
  heroStats: document.getElementById("hero-stats"),
  activeUserSelect: document.getElementById("active-user-select"),
  workspaceBadge: document.getElementById("workspace-badge"),
  workspacePlanBadge: document.getElementById("workspace-plan-badge"),
  workspaceUserRole: document.getElementById("workspace-user-role"),
  moduleFlowSummary: document.getElementById("module-flow-summary"),
  moduleFlowGrid: document.getElementById("module-flow-grid"),
  workflowCurrentTitle: document.getElementById("workflow-current-title"),
  workflowCurrentCopy: document.getElementById("workflow-current-copy"),
  workflowNextTitle: document.getElementById("workflow-next-title"),
  workflowNextCopy: document.getElementById("workflow-next-copy"),
  workflowProgressLabel: document.getElementById("workflow-progress-label"),
  workflowProgressFill: document.getElementById("workflow-progress-fill"),
  workflowOpenCurrent: document.getElementById("workflow-open-current"),
  workflowOpenNext: document.getElementById("workflow-open-next"),
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
  executiveKpiReadout: document.getElementById("executive-kpi-readout"),
  forecastMarkets: document.getElementById("forecast-markets"),
  forecastOperators: document.getElementById("forecast-operators"),
  dashboardSignals: document.getElementById("dashboard-signals"),
  decisionBoard: document.getElementById("decision-board"),
  crmPortfolioSummary: document.getElementById("crm-portfolio-summary"),
  crmKpiGrid: document.getElementById("crm-kpi-grid"),
  marketIntelSummary: document.getElementById("market-intel-summary"),
  marketIntelFormTitle: document.getElementById("market-intel-form-title"),
  marketIntelSubmitButton: document.getElementById("market-intel-submit-button"),
  marketIntelBoard: document.getElementById("market-intel-board"),
  opportunityScoreBoard: document.getElementById("opportunity-score-board"),
  crmOwnerSummary: document.getElementById("crm-owner-summary"),
  crmOwnerBoard: document.getElementById("crm-owner-board"),
  crmOperatorTableBody: document.getElementById("crm-operator-table-body"),
  dashboardTimeline: document.getElementById("dashboard-timeline"),
  dashboardSpotlight: document.getElementById("dashboard-spotlight"),
  leadMarketCounts: document.getElementById("lead-market-counts"),
  leadMarketTracker: document.getElementById("latest-leads-by-market"),
  signalLegal: document.getElementById("signal-legal"),
  signalDd: document.getElementById("signal-dd"),
  signalIntegration: document.getElementById("signal-integration"),
  signalNewTraffic: document.getElementById("signal-new-traffic"),
  marketBars: document.getElementById("market-bars"),
  marketInterpretationBoard: document.getElementById("market-interpretation-board"),
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
  campaignFormTitle: document.getElementById("campaign-form-title"),
  campaignSubmitButton: document.getElementById("campaign-submit-button"),
  campaignSummary: document.getElementById("campaign-summary"),
  campaignLiveCount: document.getElementById("campaign-live-count"),
  campaignBoard: document.getElementById("campaign-board"),
  campaignTableBody: document.getElementById("campaign-table-body"),
  workspaceFormTitle: document.getElementById("workspace-form-title"),
  workspaceSubmitButton: document.getElementById("workspace-submit-button"),
  adminLicenseSummary: document.getElementById("admin-license-summary"),
  userSubmitButton: document.getElementById("user-submit-button"),
  userSummary: document.getElementById("user-summary"),
  adminAccessSummary: document.getElementById("admin-access-summary"),
  adminWorkspaceCards: document.getElementById("admin-workspace-cards"),
  userBoard: document.getElementById("user-board"),
  userTableBody: document.getElementById("user-table-body"),
  kpiGrid: document.getElementById("kpi-grid"),
  kpiSearch: document.getElementById("kpi-search"),
  uploadExcelInput: document.getElementById("upload-excel-input"),
  loadingOverlay: document.getElementById("app-loading-overlay"),
  loadingOverlayTitle: document.getElementById("loading-overlay-title"),
  loadingOverlayCopy: document.getElementById("loading-overlay-copy"),
};

const ui = {
  activeView: "dashboard",
  editingDealId: null,
  editingMarketIntelId: null,
  editingTargetId: null,
  editingTaskId: null,
  editingCampaignId: null,
  editingUserId: null,
  activeUserId: "",
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
  pipelinePreset: null,
  taskPreset: null,
  campaignPreset: null,
  kpiSearch: "",
  isHydrating: true,
};

let state = {
  deals: [],
  marketIntel: [],
  targets: [],
  kpis: KPI_CATALOGUE,
  tasks: [],
  campaigns: [],
  users: [],
  workspace: {},
  latamReference: {
    markets: [],
    stageTotals: [],
    operatorsByMarket: [],
  },
};

const serverMeta = {
  workbookPath: "",
  workbookUrl: STATIC_WORKBOOK_URL,
  ready: false,
  storageMode: "static",
};

function resolveApiUrl(pathname) {
  const value = String(pathname || "");
  if (!value) {
    return DEFAULT_API_ORIGIN;
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return new URL(value, DEFAULT_API_ORIGIN).toString();
}

function resolveAssetUrl(pathname) {
  const value = String(pathname || "").replace(/^\/+/, "");
  if (!value) {
    return APP_BASE_URL.toString();
  }
  return new URL(value, APP_BASE_URL).toString();
}

init();

async function init() {
  setLoadingState(true, "Loading workbook", "Syncing pipeline, tasks, market intelligence, and forecast data from Excel.");
  bindEvents();
  resetDealForm();
  resetMarketIntelForm();
  resetTargetForm();
  resetTaskForm();
  resetCampaignForm();
  resetWorkspaceForm();
  resetUserForm();
  await hydrateFromExcel();
  renderAll();
  setLoadingState(false);
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
    setLoadingState(true, "Refreshing workbook", "Reloading SalesRep from the local Excel control file.");
    try {
      await hydrateFromExcel();
      renderAll();
    } finally {
      setLoadingState(false);
    }
  });

  document.getElementById("download-excel-button").addEventListener("click", async () => {
    await downloadExcelWorkbook();
  });

  document.getElementById("upload-excel-button").addEventListener("click", () => {
    elements.uploadExcelInput.click();
  });

  elements.uploadExcelInput.addEventListener("change", async (event) => {
    const [file] = Array.from(event.target.files || []);
    if (!file) {
      return;
    }
    try {
      await uploadExcelWorkbook(file);
    } finally {
      event.target.value = "";
    }
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

  elements.activeUserSelect.addEventListener("change", (event) => {
    ui.activeUserId = event.target.value;
    persistActiveUserSelection();
    renderWorkspaceChrome();
    renderAdminView();
  });

  dealForm.addEventListener("submit", handleDealSubmit);
  document.getElementById("deal-cancel-button").addEventListener("click", () => {
    ui.editingDealId = null;
    resetDealForm();
    setBanner("Deal form cleared.", "default");
  });

  marketIntelForm.addEventListener("submit", handleMarketIntelSubmit);
  document.getElementById("market-intel-cancel-button").addEventListener("click", () => {
    ui.editingMarketIntelId = null;
    resetMarketIntelForm();
    setBanner("Market intelligence form cleared.", "default");
  });

  dealForm.addEventListener("input", handleDealScoringInput);
  dealForm.addEventListener("change", handleDealScoringInput);

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

  campaignForm.addEventListener("submit", handleCampaignSubmit);
  document.getElementById("campaign-cancel-button").addEventListener("click", () => {
    ui.editingCampaignId = null;
    resetCampaignForm();
    setBanner("Campaign form cleared.", "default");
  });

  workspaceForm.addEventListener("submit", handleWorkspaceSubmit);
  document.getElementById("workspace-cancel-button").addEventListener("click", () => {
    resetWorkspaceForm();
    setBanner("Workspace settings restored.", "default");
  });

  userForm.addEventListener("submit", handleUserSubmit);
  document.getElementById("user-cancel-button").addEventListener("click", () => {
    ui.editingUserId = null;
    resetUserForm();
    setBanner("User form cleared.", "default");
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
    ui.pipelinePreset = null;
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

  elements.stageOverview.addEventListener("click", handleStageFunnelAction);
  elements.heroStats.addEventListener("click", handleExecutiveKpiAction);
  elements.marketBars.addEventListener("click", handleDashboardDrilldownAction);
  elements.forecastMarkets.addEventListener("click", handleDashboardDrilldownAction);
  elements.forecastOperators.addEventListener("click", handleDashboardDrilldownAction);
  elements.forecastSummary.addEventListener("click", handleForecastSummaryAction);
  elements.dashboardSignals.addEventListener("click", handleOperatingSignalAction);
  elements.dashboardTimeline.addEventListener("click", handleStageDurationAction);
  elements.dashboardSignals.querySelectorAll("[data-action='open-operating-signal']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openOperatingSignalDrilldown(button.dataset.signalKey);
    });
  });
  elements.pipelineSummary.addEventListener("click", handlePipelineSummaryAction);
  elements.targetProgress.addEventListener("click", handleTargetProgressAction);
  elements.pipelineBoard.addEventListener("click", handleDealAction);
  elements.dealTableBody.addEventListener("click", handleDealAction);
  elements.crmOperatorTableBody.addEventListener("click", handleDealAction);
  elements.dashboardSpotlight.addEventListener("click", handleDealAction);
  elements.executiveKpiReadout.addEventListener("click", handleExecutiveKpiAction);
  elements.marketIntelBoard.addEventListener("click", handleMarketIntelAction);
  elements.marketInterpretationBoard.addEventListener("click", handleDealAction);
  elements.moduleFlowGrid.addEventListener("click", handleModuleFlowAction);
  elements.workflowOpenCurrent.addEventListener("click", () => {
    openWorkflowModule(getWorkflowCurrentAndNext().current.view);
  });
  elements.workflowOpenNext.addEventListener("click", () => {
    openWorkflowModule(getWorkflowCurrentAndNext().next.view);
  });
  elements.leadMarketTracker.addEventListener("click", handleDealAction);
  elements.leadMarketTracker.addEventListener("submit", handleLeadTrackerSubmit);
  elements.targetTableBody.addEventListener("click", handleTargetAction);
  elements.taskBoard.addEventListener("click", handleTaskAction);
  elements.taskTableBody.addEventListener("click", handleTaskAction);
  elements.campaignBoard.addEventListener("click", handleCampaignAction);
  elements.campaignTableBody.addEventListener("click", handleCampaignAction);
  elements.userBoard.addEventListener("click", handleUserAction);
  elements.userTableBody.addEventListener("click", handleUserAction);

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
    const rows = getVisibleTasks();
    const filename = buildExportFilename("pipeline-tasks", "csv");
    downloadCsv(filename, rows, TASK_CSV_COLUMNS);
    setBanner(`CSV de tareas exportado (${rows.length} registros).`, "success");
  });

  document.getElementById("export-campaigns-csv").addEventListener("click", () => {
    const rows = getVisibleCampaigns();
    const filename = buildExportFilename("operator-campaigns", "csv");
    downloadCsv(filename, rows, CAMPAIGN_CSV_COLUMNS);
    setBanner(`Campaign CSV exported (${rows.length} records).`, "success");
  });
}

async function hydrateFromExcel(options = {}) {
  const { showSuccessBanner = true } = options;
  try {
    const response = await fetch(API_STATE_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`No fue posible leer el Excel (${response.status}).`);
    }

    const payload = await response.json();
    applyStatePayload(payload);
    synchronizeTaskSequence();
    ensureActiveUser();
    resetWorkspaceForm();
    resetUserForm();
    serverMeta.workbookPath = payload.workbookPath || "";
    serverMeta.workbookUrl = resolveApiUrl(payload.workbookUrl || API_DOWNLOAD_URL);
    serverMeta.ready = true;
    serverMeta.storageMode = "excel";
    if (showSuccessBanner) {
      setBanner(buildExcelBanner("Datos cargados desde Excel."), "success");
    }
  } catch (error) {
    const cachedPayload = readBrowserStateCache();
    if (cachedPayload) {
      applyStatePayload(cachedPayload);
      synchronizeTaskSequence();
      ensureActiveUser();
      resetWorkspaceForm();
      resetUserForm();
      serverMeta.workbookPath = "GitHub published workspace";
      serverMeta.workbookUrl = STATIC_WORKBOOK_URL;
      serverMeta.ready = false;
      serverMeta.storageMode = "browser";
      if (showSuccessBanner) {
        setBanner(buildExcelBanner("Loaded browser-saved workspace state."), "success");
      }
      return;
    }

    try {
      const publishedResponse = await fetch(STATIC_STATE_URL, { headers: { Accept: "application/json" } });
      if (!publishedResponse.ok) {
        throw new Error(`No fue posible leer el snapshot publicado (${publishedResponse.status}).`);
      }

      const publishedPayload = await publishedResponse.json();
      applyStatePayload(publishedPayload);
      synchronizeTaskSequence();
      ensureActiveUser();
      resetWorkspaceForm();
      resetUserForm();
      serverMeta.workbookPath = "GitHub published snapshot";
      serverMeta.workbookUrl = STATIC_WORKBOOK_URL;
      serverMeta.ready = false;
      serverMeta.storageMode = "static";
      if (showSuccessBanner) {
        setBanner(buildExcelBanner("Loaded published GitHub snapshot."), "success");
      }
      return;
    } catch (publishedError) {
      serverMeta.ready = false;
      serverMeta.storageMode = "static";
      state = createDefaultState();
      synchronizeTaskSequence();
      ensureActiveUser();
      resetWorkspaceForm();
      resetUserForm();
      setBanner(
        "No pude conectarme al Excel ni cargar el snapshot publicado. Inicia `./start-server.sh` o vuelve a publicar los datos en GitHub.",
        "danger"
      );
    }
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
        marketIntel: state.marketIntel,
        targets: state.targets,
        kpis: state.kpis,
        tasks: state.tasks,
        campaigns: state.campaigns,
        users: state.users,
        workspace: state.workspace,
      }),
    });

    if (!response.ok) {
      throw new Error(`No fue posible guardar en Excel (${response.status}).`);
    }

    const payload = await response.json();
    serverMeta.workbookPath = payload.workbookPath || serverMeta.workbookPath;
    serverMeta.workbookUrl = resolveApiUrl(payload.workbookUrl || API_DOWNLOAD_URL);
    serverMeta.ready = true;
    serverMeta.storageMode = "excel";
    await hydrateFromExcel({ showSuccessBanner: false });
    return true;
  } catch (error) {
    serverMeta.ready = false;
    serverMeta.workbookPath = "GitHub published workspace";
    serverMeta.workbookUrl = STATIC_WORKBOOK_URL;
    serverMeta.storageMode = "browser";
    const savedToBrowser = writeBrowserStateCache({
      deals: state.deals,
      marketIntel: state.marketIntel,
      targets: state.targets,
      kpis: state.kpis,
      tasks: state.tasks,
      campaigns: state.campaigns,
      users: state.users,
      workspace: state.workspace,
      latamReference: state.latamReference,
    });

    if (!savedToBrowser) {
      setBanner(
        "No se pudo persistir en Excel ni en el navegador. Los cambios siguen en memoria para esta sesion.",
        "warn"
      );
      return false;
    }

    setBanner("Excel backend unavailable. Changes were saved in this browser for the published GitHub app.", "warn");
    return true;
  }
}

function applyStatePayload(payload) {
  state = {
    deals: Array.isArray(payload?.deals) ? payload.deals.map(normalizeDeal) : [],
    marketIntel: Array.isArray(payload?.marketIntel) ? payload.marketIntel.map(normalizeMarketIntel) : [],
    targets: Array.isArray(payload?.targets) ? payload.targets.map(normalizeTarget) : [],
    kpis: mergeKpiCatalogue(payload?.kpis),
    tasks: Array.isArray(payload?.tasks) ? payload.tasks.map(normalizeTask) : [],
    campaigns: Array.isArray(payload?.campaigns) ? payload.campaigns.map(normalizeCampaign) : [],
    users: Array.isArray(payload?.users) ? payload.users.map(normalizeUser) : createDefaultUsers(),
    workspace: normalizeWorkspace(payload?.workspace),
    latamReference: normalizeLatamReference(payload?.latamReference),
  };
}

function readBrowserStateCache() {
  try {
    const raw = window.localStorage.getItem(BROWSER_STATE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeBrowserStateCache(payload) {
  try {
    window.localStorage.setItem(BROWSER_STATE_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

function clearBrowserStateCache() {
  try {
    window.localStorage.removeItem(BROWSER_STATE_STORAGE_KEY);
  } catch {
    // Ignore localStorage cleanup issues in restricted browser contexts.
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
    marketIntel: [
      normalizeMarketIntel({
        id: "intel-demo-mx",
        country: "Mexico",
        regulatoryStatus: "Open and active",
        licenseType: "B2C",
        activeOperators: "Betcris, Caliente, Codere",
        targetOperators: "Betcris, Codere, Strendus",
        competitorsPresent: "Pragmatic Play, Playtech",
        currentProducts: "Casino, sportsbook",
        missingProducts: "Live casino expansion, dedicated tables",
        revenuePotentialEur: 425000,
        regulatoryRisk: "Medium",
        opportunityLevel: "High Priority",
        strategicNotes: "High-value market with visible whitespace for live product expansion.",
      }),
      normalizeMarketIntel({
        id: "intel-demo-pe",
        country: "Peru",
        regulatoryStatus: "Scaling under new framework",
        licenseType: "Online gaming",
        activeOperators: "Apuesta Total, Betsson",
        targetOperators: "Apuesta Total, Inkabet, Betano",
        competitorsPresent: "Pragmatic Play, Playtech",
        currentProducts: "Casino, sportsbook",
        missingProducts: "Live casino, progressive content",
        revenuePotentialEur: 250000,
        regulatoryRisk: "Medium",
        opportunityLevel: "Medium",
        strategicNotes: "Strong opportunity for structured target mapping and cross-sell growth.",
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
    campaigns: [
      normalizeCampaign({
        id: "campaign-1",
        title: "AndesPay Free Spins Launch",
        campaignType: "Free Spins",
        status: "Ready",
        priority: "High",
        operator: "Andes Telecom",
        client: "Andes Telecom",
        dealId: "deal-1",
        deal: "AndesPay Launch",
        market: "Chile",
        owner: "LATAM Growth",
        channel: "Casino CRM",
        startDate: `${year}-05-10`,
        endDate: `${year}-05-24`,
        budgetEur: 12000,
        prizeValueEur: 8500,
        forecastLiftEur: 22000,
        targetPlayers: 400,
        targetWager: 180000,
        targetGgr: 9000,
        jiraTicket: "MKT-104",
        landingUrl: "https://example.com/andes/free-spins",
        mechanic: "20 free spins on first deposit above threshold",
        offerDetails: "Tiered reward by first-time deposit size",
        successMetric: "Incremental depositing players and net uplift",
        nextStep: "Approve CRM copy and QA reward configuration.",
        notes: "Launch should align with legal closure and go-live messaging.",
      }),
      normalizeCampaign({
        id: "campaign-2",
        title: "Iberia VIP Tournament Sprint",
        campaignType: "Tournament",
        status: "Planned",
        priority: "Medium",
        operator: "Iberia Media",
        client: "Iberia Media",
        dealId: "deal-2",
        deal: "Iberia Upsell",
        market: "Spain",
        owner: "Account Management",
        channel: "VIP / Onsite",
        startDate: `${year}-06-01`,
        endDate: `${year}-06-14`,
        budgetEur: 9000,
        prizeValueEur: 7000,
        forecastLiftEur: 18000,
        targetPlayers: 180,
        targetWager: 125000,
        targetGgr: 6500,
        jiraTicket: "MKT-118",
        landingUrl: "https://example.com/iberia/tournament",
        mechanic: "Points-based weekend tournament with leaderboard prizes",
        offerDetails: "Cash + free-bet hybrid prizes by rank",
        successMetric: "Wager uplift versus baseline cohort",
        nextStep: "Confirm VIP segmentation and prize pool split.",
        notes: "Best launched after DD package closure to avoid launch noise.",
      }),
    ],
    users: createDefaultUsers(),
    workspace: createDefaultWorkspace(year),
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
    stage: "Lead",
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
    segment: "",
    primaryContact: "",
    decisionMaker: "",
    licenseStatus: "",
    productsCurrent: "",
    productsPotential: "",
    currentCompetitors: "",
    targetPriority: "Medium",
    strategicFit: "",
    revenuePotentialEur: null,
    revenuePotentialScore: null,
    strategicFitScore: null,
    closeProbabilityScore: null,
    licenseScore: null,
    legalComplexityScore: null,
    technicalComplexityScore: null,
    commercialUrgencyScore: null,
    opportunityScore: null,
    priorityClass: "",
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

function createMarketIntelShape() {
  return {
    id: "",
    country: "",
    regulatoryStatus: "",
    licenseType: "",
    activeOperators: "",
    targetOperators: "",
    competitorsPresent: "",
    currentProducts: "",
    missingProducts: "",
    revenuePotentialEur: 0,
    regulatoryRisk: "Medium",
    opportunityLevel: "Medium",
    strategicNotes: "",
    createdAt: "",
    updatedAt: "",
  };
}

function createEmptyMarketIntel() {
  return normalizeMarketIntel({
    ...createMarketIntelShape(),
    id: generateId("intel"),
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
    taskNumber: "",
    title: "",
    scopeType: "Client",
    status: "Open",
    priority: "Medium",
    dueDate: "",
    owner: getActiveUser()?.fullName || "",
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

function createDefaultUsers() {
  return [
    normalizeUser({
      id: "user-admin",
      fullName: "LATAM Workspace Admin",
      email: "admin@salesrep.local",
      role: "Administrator",
      status: "Active",
      team: "Revenue Operations",
      marketFocus: "LATAM",
    }),
    normalizeUser({
      id: "user-manager",
      fullName: "Commercial Manager",
      email: "manager@salesrep.local",
      role: "Sales Manager",
      status: "Active",
      team: "Commercial",
      marketFocus: "Mexico, Peru, Panama",
    }),
    normalizeUser({
      id: "user-ops",
      fullName: "Integration Ops",
      email: "ops@salesrep.local",
      role: "Revenue Ops",
      status: "Active",
      team: "Operations",
      marketFocus: "Integration and Go Live",
    }),
  ];
}

function createDefaultWorkspace(year = new Date().getFullYear()) {
  return normalizeWorkspace({
    workspaceName: "SalesRep LATAM",
    organizationName: "Evolution LATAM",
    adminName: "LATAM Workspace Admin",
    adminEmail: "admin@salesrep.local",
    subscriptionPlan: "Enterprise",
    crmModel: "New + Existing Accounts",
    fiscalYear: year,
    defaultCurrency: "EUR",
    taskSequence: 0,
  });
}

function createEmptyUser() {
  return normalizeUser({
    id: generateId("user"),
    fullName: "",
    email: "",
    role: "Account Manager",
    status: "Active",
    team: "",
    marketFocus: "",
    createdAt: "",
    updatedAt: "",
  });
}

function createEmptyCampaign() {
  return normalizeCampaign({
    id: generateId("campaign"),
    title: "",
    campaignType: "Activation",
    status: "Planned",
    priority: "Medium",
    operator: "",
    client: "",
    dealId: "",
    deal: "",
    market: "",
    owner: "",
    channel: "",
    startDate: "",
    endDate: "",
    budgetEur: 0,
    prizeValueEur: 0,
    forecastLiftEur: 0,
    targetPlayers: 0,
    targetWager: 0,
    targetGgr: 0,
    jiraTicket: "",
    landingUrl: "",
    mechanic: "",
    offerDetails: "",
    successMetric: "",
    nextStep: "",
    notes: "",
    traceLog: "",
    createdAt: "",
    updatedAt: "",
  });
}

function normalizeDeal(input) {
  const base = createDealShape();
  const resolvedDealValue = resolveDealValue(input);
  const agreement = normalizeContractStatus(input.agreement || input.legalStatus);
  const ddStatus = normalizeProgressStatus(input.ddStatus);
  const integrationStatus = normalizeProgressStatus(input.integrationStatus);
  const goLiveStatus = normalizeGoLiveStatus(input.goLiveStatus);
  const revenuePotentialEur = toNullableNumber(input.revenuePotentialEur) ?? resolvedDealValue ?? 0;
  const stage = inferDealStage({
    ...input,
    agreement,
    ddStatus,
    integrationStatus,
    goLiveStatus,
  });
  const signedFlag = Boolean(input.signedFlag) || agreement === "Signed" || ["Legal Approval", "Go Live", "Live", "Handover"].includes(stage);
  const ddStartedFlag =
    Boolean(input.ddStartedFlag) || ["Started", "In Progress", "Completed"].includes(ddStatus) || ["DD", "Integration", "Legal Approval", "Go Live", "Live", "Handover"].includes(stage);
  const ddCompletedFlag =
    Boolean(input.ddCompletedFlag) || ddStatus === "Completed" || ["Integration", "Legal Approval", "Go Live", "Live", "Handover"].includes(stage);
  const integrationStartedFlag =
    Boolean(input.integrationStartedFlag) ||
    ["Started", "In Progress", "Completed"].includes(integrationStatus) ||
    ["Integration", "Legal Approval", "Go Live", "Live", "Handover"].includes(stage);
  const integrationCompletedFlag =
    Boolean(input.integrationCompletedFlag) || integrationStatus === "Completed" || ["Legal Approval", "Go Live", "Live", "Handover"].includes(stage);
  const goLiveFlag =
    Boolean(input.goLiveFlag) || ["Go Live", "Live", "Handover"].includes(stage) || goLiveStatus === "Live" || Boolean(cleanText(input.liveSince));
  const scoring = computeOpportunityScoring({
    ...input,
    stage,
    revenuePotentialEur,
    agreement,
  });

  return {
    ...base,
    ...input,
    id: String(input.id || generateId("deal")),
    deal: normalizeDealName(input.deal),
    client: cleanText(input.client),
    type: normalizeDealType(input.type),
    market: normalizeDealMarket(input.market),
    platform: normalizeDealPlatform(input.platform),
    stage: stage || base.stage,
    legalStatus: cleanText(input.legalStatus),
    agreement,
    ddStatus,
    integrationStatus,
    goLiveStatus,
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
    segment: cleanText(input.segment),
    primaryContact: cleanText(input.primaryContact),
    decisionMaker: cleanText(input.decisionMaker),
    licenseStatus: cleanText(input.licenseStatus),
    productsCurrent: cleanText(input.productsCurrent),
    productsPotential: cleanText(input.productsPotential),
    currentCompetitors: cleanText(input.currentCompetitors),
    targetPriority: cleanText(input.targetPriority) || base.targetPriority,
    strategicFit: cleanText(input.strategicFit),
    status: cleanText(input.status),
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
    revenuePotentialEur,
    revenuePotentialScore: scoring.revenuePotentialScore,
    strategicFitScore: scoring.strategicFitScore,
    closeProbabilityScore: scoring.closeProbabilityScore,
    licenseScore: scoring.licenseScore,
    legalComplexityScore: scoring.legalComplexityScore,
    technicalComplexityScore: scoring.technicalComplexityScore,
    commercialUrgencyScore: scoring.commercialUrgencyScore,
    opportunityScore: scoring.opportunityScore,
    priorityClass: scoring.priorityClass,
    newTraffic: Boolean(input.newTraffic),
    leadFlag: Boolean(input.leadFlag),
    signedFlag,
    ddStartedFlag,
    ddCompletedFlag,
    integrationStartedFlag,
    integrationCompletedFlag,
    goLiveFlag,
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

function normalizeMarketIntel(input) {
  const base = createMarketIntelShape();
  return {
    ...base,
    ...input,
    id: String(input.id || generateId("intel")),
    country: normalizeDealMarket(input.country),
    regulatoryStatus: cleanText(input.regulatoryStatus),
    licenseType: cleanText(input.licenseType),
    activeOperators: cleanText(input.activeOperators),
    targetOperators: cleanText(input.targetOperators),
    competitorsPresent: cleanText(input.competitorsPresent),
    currentProducts: cleanText(input.currentProducts),
    missingProducts: cleanText(input.missingProducts),
    revenuePotentialEur: toNullableNumber(input.revenuePotentialEur) || 0,
    regulatoryRisk: cleanText(input.regulatoryRisk) || base.regulatoryRisk,
    opportunityLevel: cleanText(input.opportunityLevel) || base.opportunityLevel,
    strategicNotes: cleanText(input.strategicNotes),
    createdAt: cleanText(input.createdAt),
    updatedAt: cleanText(input.updatedAt),
  };
}

function normalizeTask(input) {
  const base = createTaskShape();
  return {
    ...base,
    ...input,
    id: String(input.id || generateId("task")),
    taskNumber: cleanText(input.taskNumber),
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

function normalizeUser(input) {
  const base = createUserShape();
  return {
    ...base,
    ...input,
    id: String(input.id || generateId("user")),
    fullName: cleanText(input.fullName),
    email: cleanText(input.email),
    role: USER_ROLE_OPTIONS.includes(cleanText(input.role)) ? cleanText(input.role) : base.role,
    status: USER_STATUS_OPTIONS.includes(cleanText(input.status)) ? cleanText(input.status) : base.status,
    team: cleanText(input.team),
    marketFocus: cleanText(input.marketFocus),
    createdAt: cleanText(input.createdAt),
    updatedAt: cleanText(input.updatedAt),
  };
}

function normalizeWorkspace(input) {
  const year = new Date().getFullYear();
  const source = input && typeof input === "object" ? input : {};
  return {
    workspaceName: cleanText(source.workspaceName) || "SalesRep LATAM",
    organizationName: cleanText(source.organizationName) || "Evolution LATAM",
    adminName: cleanText(source.adminName) || "LATAM Workspace Admin",
    adminEmail: cleanText(source.adminEmail) || "admin@salesrep.local",
    subscriptionPlan: cleanText(source.subscriptionPlan) || "Enterprise",
    crmModel: cleanText(source.crmModel) || "New + Existing Accounts",
    fiscalYear: toNullableNumber(source.fiscalYear) || year,
    defaultCurrency: cleanText(source.defaultCurrency) || "EUR",
    taskSequence: toNullableNumber(source.taskSequence) || 0,
  };
}

function normalizeCampaign(input) {
  const base = createCampaignShape();
  const budgetEur = toNullableNumber(input.budgetEur) || 0;
  const forecastLiftEur = toNullableNumber(input.forecastLiftEur) || 0;
  const growthRatio = calculateCampaignGrowthRatio({ budgetEur, forecastLiftEur });
  return {
    ...base,
    ...input,
    id: String(input.id || generateId("campaign")),
    title: cleanText(input.title),
    campaignType: CAMPAIGN_TYPE_OPTIONS.includes(cleanText(input.campaignType)) ? cleanText(input.campaignType) : base.campaignType,
    status: CAMPAIGN_STATUS_OPTIONS.includes(cleanText(input.status)) ? cleanText(input.status) : base.status,
    priority: CAMPAIGN_PRIORITY_OPTIONS.includes(cleanText(input.priority)) ? cleanText(input.priority) : base.priority,
    operator: cleanText(input.operator),
    client: cleanText(input.client),
    dealId: cleanText(input.dealId),
    deal: cleanText(input.deal),
    market: normalizeDealMarket(input.market),
    owner: cleanText(input.owner),
    channel: cleanText(input.channel),
    startDate: normalizeDateInput(input.startDate),
    endDate: normalizeDateInput(input.endDate),
    budgetEur,
    prizeValueEur: toNullableNumber(input.prizeValueEur) || 0,
    forecastLiftEur,
    targetPlayers: toNullableNumber(input.targetPlayers) || 0,
    targetWager: toNullableNumber(input.targetWager) || 0,
    targetGgr: toNullableNumber(input.targetGgr) || 0,
    growthRatio,
    growthPct: growthRatio * 100,
    jiraTicket: cleanText(input.jiraTicket),
    landingUrl: cleanText(input.landingUrl),
    mechanic: cleanText(input.mechanic),
    offerDetails: cleanText(input.offerDetails),
    successMetric: cleanText(input.successMetric),
    nextStep: cleanText(input.nextStep),
    notes: cleanText(input.notes),
    traceLog: cleanText(input.traceLog),
    createdAt: cleanText(input.createdAt),
    updatedAt: cleanText(input.updatedAt),
  };
}

function normalizeKpiEntry(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    block: cleanText(source.block),
    name: cleanText(source.name),
    definition: cleanText(source.definition),
    stage: cleanText(source.stage),
    frequency: cleanText(source.frequency),
    notes: cleanText(source.notes),
  };
}

function getKpiEntryKey(input) {
  const kpi = normalizeKpiEntry(input);
  return cleanText(kpi.name).toLowerCase();
}

function mergeKpiCatalogue(items) {
  const merged = new Map();
  const preferredOrder = new Set();

  KPI_CATALOGUE.forEach((item) => {
    const normalized = normalizeKpiEntry(item);
    const key = getKpiEntryKey(normalized);
    preferredOrder.add(key);
    merged.set(key, normalized);
  });

  (Array.isArray(items) ? items : []).forEach((item) => {
    const normalized = normalizeKpiEntry(item);
    const key = getKpiEntryKey(normalized);
    if (!normalized.name || preferredOrder.has(key) || merged.has(key)) {
      return;
    }
    merged.set(key, normalized);
  });

  return Array.from(merged.entries())
    .sort((left, right) => {
      const leftIndex = KPI_CATALOGUE.findIndex((item) => getKpiEntryKey(item) === left[0]);
      const rightIndex = KPI_CATALOGUE.findIndex((item) => getKpiEntryKey(item) === right[0]);
      if (leftIndex !== -1 || rightIndex !== -1) {
        if (leftIndex === -1) return 1;
        if (rightIndex === -1) return -1;
        return leftIndex - rightIndex;
      }
      return left[1].name.localeCompare(right[1].name);
    })
    .map(([, value]) => value);
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
    stage: "Lead",
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
    segment: "",
    primaryContact: "",
    decisionMaker: "",
    licenseStatus: "",
    productsCurrent: "",
    productsPotential: "",
    currentCompetitors: "",
    targetPriority: "Medium",
    strategicFit: "",
    revenuePotentialEur: null,
    revenuePotentialScore: null,
    strategicFitScore: null,
    closeProbabilityScore: null,
    licenseScore: null,
    legalComplexityScore: null,
    technicalComplexityScore: null,
    commercialUrgencyScore: null,
    opportunityScore: null,
    priorityClass: "",
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
    taskNumber: "",
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

function createUserShape() {
  return {
    id: "",
    fullName: "",
    email: "",
    role: "Account Manager",
    status: "Active",
    team: "",
    marketFocus: "",
    createdAt: "",
    updatedAt: "",
  };
}

function createCampaignShape() {
  return {
    id: "",
    title: "",
    campaignType: "Activation",
    status: "Planned",
    priority: "Medium",
    operator: "",
    client: "",
    dealId: "",
    deal: "",
    market: "",
    owner: "",
    channel: "",
    startDate: "",
    endDate: "",
    budgetEur: 0,
    prizeValueEur: 0,
    forecastLiftEur: 0,
    targetPlayers: 0,
    targetWager: 0,
    targetGgr: 0,
    jiraTicket: "",
    landingUrl: "",
    mechanic: "",
    offerDetails: "",
    successMetric: "",
    nextStep: "",
    notes: "",
    traceLog: "",
    createdAt: "",
    updatedAt: "",
  };
}

function renderAll() {
  synchronizeTaskSequence();
  ensureActiveUser();
  renderGlobalFilters();
  renderViewState();
  renderWorkspaceChrome();
  renderModuleFlow();
  renderWorkflowCommandBar();
  renderHeroMetrics();
  renderDashboard();
  renderCrmView();
  renderPipeline();
  renderTargets();
  renderTasks();
  renderCampaigns();
  renderAdminView();
  renderKpiCatalogue();
}

function setLoadingState(isLoading, title = "Loading workbook", copy = "Syncing SalesRep from the local Excel workspace.") {
  ui.isHydrating = Boolean(isLoading);
  document.body.classList.toggle("app-loading", ui.isHydrating);
  elements.loadingOverlay.classList.toggle("is-visible", ui.isHydrating);
  elements.loadingOverlay.setAttribute("aria-hidden", ui.isHydrating ? "false" : "true");
  elements.loadingOverlayTitle.textContent = title;
  elements.loadingOverlayCopy.textContent = copy;
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

function renderWorkspaceChrome() {
  const workspace = normalizeWorkspace(state.workspace);
  const activeUser = getActiveUser();
  const userOptions = state.users.length > 0 ? state.users : createDefaultUsers();
  const selectOptions = userOptions.map((user) => user.id);
  setSelectOptions(elements.activeUserSelect, selectOptions, ui.activeUserId);
  Array.from(elements.activeUserSelect.options).forEach((option) => {
    const user = userOptions.find((item) => item.id === option.value);
    option.textContent = user ? user.fullName : option.value;
  });

  elements.workspaceBadge.textContent = workspace.workspaceName;
  elements.workspacePlanBadge.textContent = `${workspace.organizationName} · ${workspace.subscriptionPlan}`;
  elements.workspaceUserRole.textContent = activeUser
    ? `${activeUser.role} · ${activeUser.status}`
    : "No active user selected";

  const ownerSelect = taskForm?.elements?.owner;
  if (ownerSelect) {
    const currentValue = cleanText(ownerSelect.value);
    const names = uniqueValues([
      "",
      ...state.users.map((user) => user.fullName),
      ...state.deals.map((deal) => getDealOwner(deal)),
      currentValue,
    ]);
    setSelectOptions(ownerSelect, names, currentValue);
  }
}

function renderCrmView() {
  const scopedDeals = getScopedDeals();
  const marketIntelRows = buildMarketIntelRows();
  const scoreRows = buildOpportunityScoreRows(scopedDeals);
  const ownerRows = buildCrmOwnerRows(scopedDeals);
  const openTasks = state.tasks.filter((task) => task.status !== "Done").length;
  const newAccounts = scopedDeals.filter((deal) => String(deal.type || "").toLowerCase().includes("new") || deal.newTraffic).length;
  const existingAccounts = Math.max(scopedDeals.length - newAccounts, 0);
  const markets = uniqueValues(scopedDeals.map((deal) => deal.market)).length;
  const highPriorityCount = scoreRows.filter((row) => row.priorityClass === "High Priority").length;
  const whitespaceOpenings = sumValues(marketIntelRows.map((row) => row.whitespaceCount));

  elements.crmPortfolioSummary.textContent = `${scopedDeals.length} accounts`;
  elements.crmOwnerSummary.textContent = `${ownerRows.length} owners`;
  elements.marketIntelSummary.textContent = `${marketIntelRows.length} markets mapped`;
  elements.crmKpiGrid.innerHTML = [
    ["Accounts in Scope", `${scopedDeals.length}`, `${markets} markets active in ${buildTimeWindowLabel()}`],
    ["New vs Existing", `${newAccounts} / ${existingAccounts}`, "Balanced visibility across acquisition and client growth motions"],
    ["Markets Mapped", `${marketIntelRows.length}`, `${whitespaceOpenings} whitespace openings currently visible across target products and operators`],
    ["High Priority Opportunities", `${highPriorityCount}`, `${scoreRows.length} accounts currently carry a formal attractiveness score`],
    ["Open Tasks", `${openTasks}`, `${state.tasks.length} total task records with formal numbering`],
  ]
    .map(
      ([label, value, note]) => `
        <article class="forecast-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(note)}</small>
        </article>
      `
    )
    .join("");

  if (marketIntelRows.length === 0) {
    elements.marketIntelBoard.innerHTML = '<div class="empty-state">No market intelligence has been mapped yet.</div>';
  } else {
    elements.marketIntelBoard.innerHTML = marketIntelRows
      .map((row) => {
        return `
          <article class="market-intel-card">
            <header>
              <div>
                <strong>${escapeHtml(row.country)}</strong>
                <small>${escapeHtml(row.regulatoryStatus || "Regulatory status not defined")}</small>
              </div>
              ${renderPriorityBadge(row.opportunityLevel)}
            </header>
            <div class="intel-meta-grid">
              <div class="intel-meta">
                <span>Revenue Potential</span>
                <strong>${formatCurrency(row.revenuePotentialEur)}</strong>
              </div>
              <div class="intel-meta">
                <span>Target Operators</span>
                <strong>${row.targetOperatorCount}</strong>
              </div>
              <div class="intel-meta">
                <span>Whitespace</span>
                <strong>${row.whitespaceCount}</strong>
              </div>
              <div class="intel-meta">
                <span>Regulatory Risk</span>
                <strong>${escapeHtml(row.regulatoryRisk)}</strong>
              </div>
            </div>
            ${row.targetOperatorList.length ? `<ul class="intel-list">${row.targetOperatorList.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<small>No target operators defined yet.</small>"}
            <div class="row-actions">
              <button class="icon-button" data-action="edit-market-intel" data-id="${escapeHtml(row.id)}">Edit</button>
              <button class="icon-button" data-action="create-lead-from-intel" data-id="${escapeHtml(row.id)}">Create Lead</button>
              <button class="icon-button danger" data-action="delete-market-intel" data-id="${escapeHtml(row.id)}">Delete</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  if (scoreRows.length === 0) {
    elements.opportunityScoreBoard.innerHTML = '<div class="empty-state">No opportunities are available to score in the current review window.</div>';
  } else {
    elements.opportunityScoreBoard.innerHTML = scoreRows
      .slice(0, 6)
      .map((row) => {
        return `
          <article class="score-radar-card">
            <header>
              <div>
                <strong>${escapeHtml(row.operator)}</strong>
                <small>${escapeHtml(row.marketLine)}</small>
              </div>
              ${renderScoreBadge(row.opportunityScore, row.priorityClass)}
            </header>
            <div class="score-meta-grid">
              <div class="score-meta">
                <span>Revenue Potential</span>
                <strong>${formatCurrency(row.revenuePotentialEur)}</strong>
              </div>
              <div class="score-meta">
                <span>Forecast</span>
                <strong>${formatCurrency(row.forecastValue)}</strong>
              </div>
              <div class="score-meta">
                <span>Stage</span>
                <strong>${escapeHtml(row.stage)}</strong>
              </div>
              <div class="score-meta">
                <span>Owner</span>
                <strong>${escapeHtml(row.owner || "Unassigned")}</strong>
              </div>
            </div>
            <small>${escapeHtml(row.scoreNarrative)}</small>
          </article>
        `;
      })
      .join("");
  }

  if (ownerRows.length === 0) {
    elements.crmOwnerBoard.innerHTML = '<div class="empty-state">No account ownership has been mapped yet.</div>';
  } else {
    elements.crmOwnerBoard.innerHTML = ownerRows
      .map((row) => {
        return `
          <article class="crm-owner-card">
            <header>
              <div>
                <strong>${escapeHtml(row.owner)}</strong>
                <small>${escapeHtml(row.teamline)}</small>
              </div>
              <span class="pill neutral">${escapeHtml(row.roleHint)}</span>
            </header>
            <div class="forecast-metrics">
              ${renderForecastMetric("Accounts", `${row.accountCount}`)}
              ${renderForecastMetric("Forecast", formatCompactCurrency(row.forecastValue), formatCurrency(row.forecastValue))}
              ${renderForecastMetric("Open Tasks", `${row.openTasks}`)}
              ${renderForecastMetric("Live Accounts", `${row.liveAccounts}`)}
            </div>
            <p>${escapeHtml(row.note)}</p>
          </article>
        `;
      })
      .join("");
  }

  if (scopedDeals.length === 0) {
    elements.crmOperatorTableBody.innerHTML = `
      <tr>
        <td colspan="11">
          <div class="empty-state">No accounts are available in the current CRM review window.</div>
        </td>
      </tr>
    `;
    return;
  }

  elements.crmOperatorTableBody.innerHTML = [...scopedDeals]
    .sort((left, right) => Number(right.opportunityScore || 0) - Number(left.opportunityScore || 0) || Number(right.revenuePotentialEur || 0) - Number(left.revenuePotentialEur || 0) || left.deal.localeCompare(right.deal))
    .map((deal) => {
      const openTaskCount = countOpenTasksForDeal(deal);
      return `
        <tr>
          <td>
            <div class="entity-title">
              <strong>${escapeHtml(getPrimaryOperatorName(deal))}</strong>
              <small>${escapeHtml(deal.client || deal.deal || "No client name")}</small>
            </div>
          </td>
          <td>${escapeHtml(deal.market || "N/A")}</td>
          <td>${escapeHtml(deal.segment || "N/A")}</td>
          <td>${escapeHtml(getDealOwner(deal) || "Unassigned")}</td>
          <td><span class="pill ${taskStatusPillClass(isBlockedDeal(deal) ? "Blocked" : "Open")}">${escapeHtml(deal.stage || "N/A")}</span></td>
          <td>${escapeHtml(formatScoreValue(deal.opportunityScore))}</td>
          <td>${renderPriorityBadge(deal.priorityClass || deal.targetPriority)}</td>
          <td>${formatCurrency(getRevenuePotentialAmount(deal))}</td>
          <td>${openTaskCount}</td>
          <td>${escapeHtml(deal.actionItems || deal.statusText || "No next action defined")}</td>
          <td>
            <div class="row-actions">
              <button class="icon-button" data-action="edit-deal" data-id="${escapeHtml(deal.id)}">Edit Deal</button>
              <button class="icon-button" data-action="create-task-from-deal" data-id="${escapeHtml(deal.id)}">Create Task</button>
              <button class="icon-button" data-action="create-campaign-from-deal" data-id="${escapeHtml(deal.id)}">Create Campaign</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderAdminView() {
  const workspace = normalizeWorkspace(state.workspace);
  const adminCount = state.users.filter((user) => user.role === "Administrator").length;
  const activeCount = state.users.filter((user) => user.status === "Active").length;

  elements.adminLicenseSummary.textContent = workspace.subscriptionPlan;
  elements.userSummary.textContent = `${state.users.length} users`;
  elements.adminAccessSummary.textContent = `${adminCount} admins`;
  elements.adminWorkspaceCards.innerHTML = [
    {
      label: "Workspace",
      title: workspace.workspaceName,
      body: `${workspace.organizationName} · ${workspace.adminName || "No admin assigned"}`,
      tone: "is-good",
    },
    {
      label: "Commercial model",
      title: workspace.crmModel,
      body: `${workspace.defaultCurrency} workspace · FY ${workspace.fiscalYear}`,
      tone: "is-neutral",
    },
    {
      label: "Seat utilization",
      title: `${activeCount} active users`,
      body: `${state.users.length - activeCount} invited or suspended seats are visible in the tenant.`,
      tone: activeCount > 0 ? "is-good" : "is-warn",
    },
    {
      label: "Task governance",
      title: `${workspace.taskSequence} tasks numbered`,
      body: "Every task receives a sequential ID for follow-up, audit, and email-ready communication.",
      tone: workspace.taskSequence > 0 ? "is-good" : "is-neutral",
    },
  ]
    .map(
      (card) => `
        <article class="decision-card ${card.tone}">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.title)}</strong>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `
    )
    .join("");

  if (state.users.length === 0) {
    elements.userBoard.innerHTML = '<div class="empty-state">No users have been configured in this workspace yet.</div>';
    elements.userTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state">No user records are available.</div>
        </td>
      </tr>
    `;
    return;
  }

  elements.userBoard.innerHTML = state.users
    .map((user) => {
      const taskCount = state.tasks.filter((task) => task.owner === user.fullName && task.status !== "Done").length;
      const accountCount = state.deals.filter((deal) => getDealOwner(deal) === user.fullName).length;
      return `
        <article class="crm-owner-card">
          <header>
            <div>
              <strong>${escapeHtml(user.fullName)}</strong>
              <small>${escapeHtml(user.email || "No email")}</small>
            </div>
            <span class="pill ${user.status === "Active" ? "success" : user.status === "Invited" ? "info" : "blocked"}">${escapeHtml(user.role)}</span>
          </header>
          <div class="forecast-metrics">
            ${renderForecastMetric("Tasks", `${taskCount}`)}
            ${renderForecastMetric("Accounts", `${accountCount}`)}
            ${renderForecastMetric("Team", user.team || "N/A")}
            ${renderForecastMetric("Focus", user.marketFocus || "LATAM")}
          </div>
          <p>${escapeHtml(user.status)} access with coverage across ${user.marketFocus || "the full workspace"}.</p>
        </article>
      `;
    })
    .join("");

  elements.userTableBody.innerHTML = state.users
    .map((user) => {
      const taskCount = state.tasks.filter((task) => task.owner === user.fullName).length;
      const accountCount = state.deals.filter((deal) => getDealOwner(deal) === user.fullName).length;
      return `
        <tr>
          <td>
            <div class="entity-title">
              <strong>${escapeHtml(user.fullName)}</strong>
              <small>${escapeHtml(user.email || "No email")}</small>
            </div>
          </td>
          <td>${escapeHtml(user.role)}</td>
          <td><span class="pill ${user.status === "Active" ? "success" : user.status === "Invited" ? "info" : "blocked"}">${escapeHtml(user.status)}</span></td>
          <td>${escapeHtml(user.team || "N/A")}</td>
          <td>${escapeHtml(user.marketFocus || "N/A")}</td>
          <td>${taskCount}</td>
          <td>${accountCount}</td>
          <td>
            <div class="row-actions">
              <button class="icon-button" data-action="edit-user" data-id="${escapeHtml(user.id)}">Edit</button>
              <button class="icon-button danger" data-action="delete-user" data-id="${escapeHtml(user.id)}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderHeroMetrics() {
  const scopedDeals = getScopedDeals();
  const snapshot = buildForecastSnapshot(scopedDeals);
  const signedCount = snapshot.commitCount;
  const liveCount = scopedDeals.filter((deal) => isLiveAccountStage(deal.stage)).length;
  const atRisk = getRiskDeals(scopedDeals).length;

  elements.heroPipelineValue.textContent = formatForecastUnits(snapshot.weightedCount);
  elements.heroSignedCount.textContent = String(signedCount);
  elements.heroLiveCount.textContent = String(liveCount);
  elements.heroDdAging.textContent = String(atRisk);
}

function renderDashboard() {
  const scopedDeals = getScopedDeals();
  const usesValue = hasAnyDealValue(scopedDeals);
  const stageDurationMap = getStageDurationMap(scopedDeals);
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
      const stageDuration = stageDurationMap.get(stat.stage);
      const metricText = usesValue ? formatCurrency(stat.value) : `${formatForecastUnits(stat.weightedCount)} weighted`;
      const durationText = stageDuration ? `${formatDaysMetric(stageDuration.averageDays)} avg` : "";
      return `
        <button
          type="button"
          class="stage-card ${stat.count > 0 ? "is-clickable" : "is-static"}"
          ${stat.count > 0 ? `data-action="open-stage-funnel" data-stage="${escapeAttribute(stat.stage)}"` : "disabled"}
        >
          <header>
            <span class="chip">${escapeHtml(stat.stage)}</span>
            <span>${percentage}%</span>
          </header>
          <strong>${stat.count}</strong>
          <small>${escapeHtml(durationText ? `${metricText} • ${durationText}` : metricText)}</small>
          <div class="progress-track">
            <div class="progress-bar" style="width: ${Math.max(percentage, stat.count > 0 ? 8 : 0)}%"></div>
          </div>
        </button>
      `;
    })
    .join("");

  elements.signalLegal.textContent = String(scopedDeals.filter((deal) => deal.stage === "Legal").length);
  elements.signalDd.textContent = String(scopedDeals.filter((deal) => deal.stage === "DD").length);
  elements.signalIntegration.textContent = String(scopedDeals.filter((deal) => deal.stage === "Integration").length);
  elements.signalNewTraffic.textContent = String(scopedDeals.filter((deal) => deal.stage === "Live").length);

  renderForecastSummary(scopedDeals);
  renderExecutiveKpiReadout(scopedDeals);
  renderForecastByMarket(scopedDeals);
  renderForecastByOperator(scopedDeals);
  renderMarketInterpretationBoard(scopedDeals);
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

  getForecastEligibleDeals(deals).forEach((deal) => {
    const key = deal.market || "Unknown";
    const entry = marketMap.get(key) || { market: key, value: 0, count: 0, weightedCount: 0, operators: new Set() };
    entry.value += Number(deal.dealValue || 0);
    entry.count += 1;
    entry.weightedCount += getForecastProbability(deal);
    entry.operators.add(getPrimaryOperatorName(deal));
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
      const operatorCount = item.operators.size;
      const metricText = usesValue ? formatCurrency(item.value) : `${formatForecastUnits(item.weightedCount)} weighted`;
      return `
        <button
          type="button"
          class="market-bar is-clickable"
          data-action="open-priority-market"
          data-market="${escapeAttribute(item.market)}"
        >
          <header>
            <strong>${escapeHtml(item.market)}</strong>
            <span>${item.count} deals • ${operatorCount} operators</span>
          </header>
          <div class="market-fill"><span style="width:${percentage}%"></span></div>
          <small>${escapeHtml(`${metricText} • Open operator list`)}</small>
        </button>
      `;
    })
    .join("");
}

function renderDashboardTimeline(deals) {
  const items = buildStageDurationRows(deals)
    .sort((left, right) => right.averageDays - left.averageDays || right.count - left.count)
    .slice(0, 6);

  if (items.length === 0) {
    elements.dashboardTimeline.innerHTML = '<div class="empty-state">There is not enough dated funnel data to measure stage duration yet.</div>';
    return;
  }

  const maxValue = Math.max(...items.map((item) => item.averageDays), 1);
  elements.dashboardTimeline.innerHTML = items
    .map((item) => {
      const percentage = Math.max(8, Math.round((item.averageDays / maxValue) * 100));
      return `
        <button
          type="button"
          class="timeline-card is-clickable"
          data-action="open-stage-duration"
          data-from-stage="${escapeAttribute(item.fromStage)}"
          data-to-stage="${escapeAttribute(item.toStage)}"
          data-label="${escapeAttribute(item.label)}"
        >
          <header>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${formatDaysMetric(item.averageDays)}</span>
          </header>
          <div class="timeline-track"><span style="width:${percentage}%"></span></div>
          <small>${escapeHtml(`${item.count} recorded transitions`)}</small>
        </button>
      `;
    })
    .join("");

  elements.dashboardTimeline.querySelectorAll("[data-action='open-stage-duration']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openStageDurationDrilldown(button.dataset.fromStage, button.dataset.toStage, button.dataset.label);
    });
  });
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
        <button type="button" class="spotlight-card is-clickable" data-action="edit-deal" data-id="${escapeAttribute(deal.id)}">
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
        </button>
      `;
    })
    .join("");

  elements.dashboardSpotlight.querySelectorAll("[data-action='edit-deal']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openDealEditorById(button.dataset.id);
    });
  });
}

function renderForecastSummary(deals) {
  const snapshot = buildForecastSnapshot(deals);
  const taskSummary = getTaskCompletionSummary(getScopedTasks());
  const stageCadence = getStageCadenceSummary(deals);
  const campaignExecution = getCampaignExecutionSummary(getScopedCampaigns());
  const campaignGrowth = getCampaignGrowthSummary(getScopedCampaigns());
  const cards = [
    {
      label: "Weighted Forecast",
      value: formatForecastUnits(snapshot.weightedCount),
      note: "Probability-adjusted account output expected from the pipeline",
      key: "weighted-forecast",
    },
    {
      label: "Commit",
      value: `${snapshot.commitCount}`,
      note: "Deals currently carrying execution probability above 75%",
      key: "commit-forecast",
    },
    {
      label: "Coverage vs Target",
      value: formatPercent(snapshot.coverageRatio),
      note: `${Math.max(snapshot.targetCount - snapshot.commitEquivalent, 0).toFixed(1)} accounts still required to close the target gap`,
      key: "coverage-vs-target",
    },
    {
      label: "Active Operators",
      value: `${snapshot.operatorCount}`,
      note: `${snapshot.marketCount} markets currently showing visible pipeline activity`,
      key: "active-operators",
    },
    {
      label: "Completed Tasks",
      value: `${taskSummary.completedCount}`,
      note:
        taskSummary.totalCount > 0
          ? `${formatPercent(taskSummary.completionRatio)} of ${taskSummary.totalCount} scoped tasks are marked done`
          : "No tasks are loaded inside the active review window",
      key: "tasks-completed",
    },
    {
      label: "Campaigns Executed",
      value: `${campaignExecution.executedCount}`,
      note:
        campaignExecution.totalCount > 0
          ? `${campaignExecution.executedCount} of ${campaignExecution.totalCount} scoped campaigns are Ready, Live, or Completed`
          : "No campaigns are loaded inside the active review window",
      key: "campaigns-executed",
    },
    {
      label: "Avg Stage Duration",
      value: stageCadence.transitionCount > 0 ? formatDaysMetric(stageCadence.averageDays) : "N/A",
      note:
        stageCadence.transitionCount > 0
          ? `${formatPercent(stageCadence.onBenchmarkRatio)} of ${stageCadence.transitionCount} recorded stage transitions landed within the ${stageCadence.benchmarkDays}-day cadence window`
          : "No dated stage transitions are available in the current review window",
      key: "avg-stage-duration",
    },
    {
      label: "Campaign Growth %",
      value: campaignGrowth.count > 0 ? formatPercent(campaignGrowth.blendedGrowthRatio) : "N/A",
      note:
        campaignGrowth.count > 0
          ? `${campaignGrowth.count} campaigns project ${formatCurrency(campaignGrowth.totalForecastLift)} incremental lift on ${formatCurrency(campaignGrowth.totalBudget)} committed budget`
          : "No campaign budget and forecast lift data are available in the current review window",
      key: "campaign-growth",
    },
  ];

  elements.forecastSummary.innerHTML = cards
    .map((card) => {
      return `
        <button type="button" class="forecast-card is-clickable" data-action="open-forecast-summary" data-forecast-key="${escapeAttribute(card.key)}">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.value)}</strong>
          <small>${escapeHtml(card.note)}</small>
        </button>
      `;
    })
    .join("");

  elements.forecastSummary.querySelectorAll("[data-action='open-forecast-summary']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openForecastSummaryDrilldown(button.dataset.forecastKey);
    });
  });
}

function renderExecutiveKpiReadout(deals) {
  const cards = buildExecutiveKpiReadoutCards(deals);

  if (cards.length === 0) {
    elements.executiveKpiReadout.innerHTML = '<div class="empty-state">Not enough pipeline data is available to interpret KPI performance yet.</div>';
    return;
  }

  elements.executiveKpiReadout.innerHTML = cards
    .map((card) => {
      return `
        <button
          type="button"
          class="executive-readout-card ${escapeHtml(card.tone)} ${card.drilldownCount > 0 ? "is-clickable" : "is-static"}"
          ${card.drilldownCount > 0 ? `data-action="open-executive-kpi" data-kpi-key="${escapeAttribute(card.key)}"` : "disabled"}
          ${card.market ? `data-market="${escapeAttribute(card.market)}"` : ""}
        >
          <header>
            <div>
              <span>${escapeHtml(card.label)}</span>
              <strong>${escapeHtml(card.value)}</strong>
            </div>
            <span class="pill ${escapeHtml(card.badgeTone)}">${escapeHtml(card.badge)}</span>
          </header>
          <p>${escapeHtml(card.summary)}</p>
          <small>${escapeHtml(card.action)}</small>
          <span class="executive-readout-hint">${escapeHtml(card.drilldownCount > 0 ? `Open ${card.drilldownCount} matching accounts` : "No accounts available for drilldown")}</span>
        </button>
      `;
    })
    .join("");
}

function buildExecutiveKpiReadoutCards(deals) {
  if (!deals.length) {
    return [];
  }

  const snapshot = buildForecastSnapshot(deals);
  const staleCount = deals.filter((deal) => hasStaleFollowUp(deal)).length;
  const noActionCount = deals.filter((deal) => !isInactiveDeal(deal) && !cleanText(deal.actionItems)).length;
  const executionLoad = deals.filter((deal) => ["Legal", "DD", "Integration", "Legal Approval"].includes(deal.stage)).length;
  const blockedCount = deals.filter((deal) => isBlockedDeal(deal)).length;
  const stageCadence = getStageCadenceSummary(deals);
  const campaignGrowth = getCampaignGrowthSummary(getScopedCampaigns());
  const marketRows = buildForecastMarketRows(deals);
  const leadRows = getLeadDeals(deals);
  const strongestMarket = marketRows[0];
  const coverageGap = Math.max(snapshot.targetCount - snapshot.commitEquivalent, 0);
  const cards = [
    {
      key: "pipeline-coverage",
      label: "Pipeline Coverage",
      value: snapshot.targetCount > 0 ? formatPercent(snapshot.coverageRatio) : formatForecastUnits(snapshot.commitEquivalent),
      badge: snapshot.targetCount > 0 ? (snapshot.coverageRatio >= 1 ? "Covered" : snapshot.coverageRatio >= 0.75 ? "On Track" : "Gap") : "No Target",
      badgeTone: snapshot.targetCount > 0 ? (snapshot.coverageRatio >= 1 ? "success" : snapshot.coverageRatio >= 0.75 ? "info" : "blocked") : "neutral",
      tone: snapshot.targetCount > 0 ? (snapshot.coverageRatio >= 1 ? "is-good" : snapshot.coverageRatio >= 0.75 ? "is-neutral" : "is-warn") : "is-neutral",
      summary:
        snapshot.targetCount > 0
          ? `${formatForecastUnits(snapshot.commitEquivalent)} of ${snapshot.targetCount} target accounts are currently covered by weighted pipeline plus live accounts.`
          : `${formatForecastUnits(snapshot.commitEquivalent)} accounts are currently covered, but no annual target is loaded for the active year.`,
      action:
        snapshot.targetCount > 0
          ? coverageGap > 0
            ? `Next move: close a gap of ${formatSignedCount(coverageGap)} with more qualified pipeline or faster stage conversion.`
            : "Next move: protect execution discipline and convert coverage into signed and live outcomes."
          : "Next move: load market targets to measure commercial coverage more precisely.",
    },
    {
      key: "commit-confidence",
      label: "Commit Confidence",
      value: `${snapshot.commitCount}`,
      badge: snapshot.commitCount >= 5 ? "Strong" : snapshot.commitCount >= 2 ? "Building" : "Thin",
      badgeTone: snapshot.commitCount >= 5 ? "success" : snapshot.commitCount >= 2 ? "info" : "blocked",
      tone: snapshot.commitCount >= 5 ? "is-good" : snapshot.commitCount >= 2 ? "is-neutral" : "is-warn",
      summary: `${snapshot.commitCount} opportunities currently sit above the ${Math.round(COMMIT_PROBABILITY * 100)}% probability threshold and form the core near-term close plan.`,
      action:
        snapshot.commitCount > 0
          ? "Next move: protect these deals with tight legal, DD, and integration follow-up."
          : "Next move: promote the strongest qualified or proposal-stage accounts into true commit territory.",
    },
    {
      key: "execution-load",
      label: "Execution Load",
      value: `${executionLoad}`,
      badge: blockedCount > 0 ? `${blockedCount} blocked` : "Flowing",
      badgeTone: blockedCount > 0 ? "blocked" : "success",
      tone: blockedCount > 0 ? "is-danger" : executionLoad > 0 ? "is-neutral" : "is-good",
      summary: `${executionLoad} accounts are currently inside Legal, DD, Integration, or Legal Approval and define the delivery pressure on the funnel.`,
      action:
        blockedCount > 0
          ? "Next move: unblock the highest-value execution cases before adding more complexity to the funnel."
          : "Next move: keep approvals and technical delivery moving to prevent slippage into next period.",
    },
    {
      key: "commercial-hygiene",
      label: "Commercial Hygiene",
      value: `${staleCount + noActionCount}`,
      badge: staleCount + noActionCount === 0 ? "Clean" : staleCount > 0 ? "Follow-Up Risk" : "Missing Next Step",
      badgeTone: staleCount + noActionCount === 0 ? "success" : staleCount > 0 ? "blocked" : "info",
      tone: staleCount + noActionCount === 0 ? "is-good" : staleCount > 2 ? "is-danger" : "is-warn",
      summary: `${staleCount} accounts are stale on follow-up and ${noActionCount} accounts are missing a clear next action, weakening forecast confidence.`,
      action:
        staleCount + noActionCount > 0
          ? "Next move: refresh follow-up dates and define one concrete action for every active account."
          : `Next move: maintain the current operating cadence and keep ${leadRows.length} early-stage accounts moving.`,
    },
    {
      key: "stage-cadence",
      label: "Stage Cadence",
      value: stageCadence.transitionCount > 0 ? formatDaysMetric(stageCadence.averageDays) : "N/A",
      badge:
        stageCadence.transitionCount === 0
          ? "No data"
          : stageCadence.averageDays <= stageCadence.benchmarkDays
          ? "On Cadence"
          : stageCadence.averageDays <= stageCadence.benchmarkDays * 1.35
          ? "Watch"
          : "Slow",
      badgeTone:
        stageCadence.transitionCount === 0
          ? "neutral"
          : stageCadence.averageDays <= stageCadence.benchmarkDays
          ? "success"
          : stageCadence.averageDays <= stageCadence.benchmarkDays * 1.35
          ? "info"
          : "blocked",
      tone:
        stageCadence.transitionCount === 0
          ? "is-neutral"
          : stageCadence.averageDays <= stageCadence.benchmarkDays
          ? "is-good"
          : stageCadence.averageDays <= stageCadence.benchmarkDays * 1.35
          ? "is-warn"
          : "is-danger",
      summary:
        stageCadence.transitionCount > 0
          ? `${stageCadence.dealCount} accounts contributed ${stageCadence.transitionCount} recorded stage transitions, with ${formatPercent(stageCadence.onBenchmarkRatio)} landing within the ${stageCadence.benchmarkDays}-day benchmark.`
          : "No dated stage milestones are currently available to measure funnel cadence.",
      action:
        stageCadence.transitionCount > 0
          ? "Next move: tighten date capture and unblock the slowest stage handoffs so forecast timing becomes more reliable."
          : "Next move: populate prospect, offer, integration, live, and handover dates to activate cadence control.",
    },
    {
      key: "campaign-growth",
      label: "Campaign Growth",
      value: campaignGrowth.count > 0 ? formatPercent(campaignGrowth.blendedGrowthRatio) : "N/A",
      badge:
        campaignGrowth.count === 0
          ? "No campaigns"
          : campaignGrowth.blendedGrowthRatio >= campaignGrowth.benchmarkRatio * 1.5
          ? "High Lift"
          : campaignGrowth.blendedGrowthRatio >= campaignGrowth.benchmarkRatio
          ? "Positive"
          : "Subscale",
      badgeTone:
        campaignGrowth.count === 0
          ? "neutral"
          : campaignGrowth.blendedGrowthRatio >= campaignGrowth.benchmarkRatio * 1.5
          ? "success"
          : campaignGrowth.blendedGrowthRatio >= campaignGrowth.benchmarkRatio
          ? "info"
          : "blocked",
      tone:
        campaignGrowth.count === 0
          ? "is-neutral"
          : campaignGrowth.blendedGrowthRatio >= campaignGrowth.benchmarkRatio * 1.5
          ? "is-good"
          : campaignGrowth.blendedGrowthRatio >= campaignGrowth.benchmarkRatio
          ? "is-neutral"
          : "is-warn",
      summary:
        campaignGrowth.count > 0
          ? `${campaignGrowth.count} campaigns are projecting ${formatCurrency(campaignGrowth.totalForecastLift)} incremental lift on ${formatCurrency(campaignGrowth.totalBudget)} budget across the current time window.`
          : "No campaign budget and forecast lift data are loaded for the current time window.",
      action:
        campaignGrowth.count > 0
          ? "Next move: prioritize live and ready campaigns with the strongest lift efficiency, and pause spend on weak setups."
          : "Next move: load campaign budgets and forecast lift to connect growth planning with commercial forecast.",
    },
    {
      key: "market-leadership",
      label: "Market Leadership",
      value: strongestMarket ? strongestMarket.market : "N/A",
      badge: strongestMarket ? `${strongestMarket.totalCount} deals` : "No market",
      badgeTone: strongestMarket ? "info" : "neutral",
      tone: strongestMarket ? "is-neutral" : "is-good",
      summary: strongestMarket
        ? `${strongestMarket.market} leads the review window with ${formatCompactCurrency(strongestMarket.forecastValue)} forecast and ${formatForecastUnits(strongestMarket.weightedCount)} weighted output.`
        : "No market activity is available in the current review window.",
      action: strongestMarket
        ? `Next move: decide whether to accelerate ${strongestMarket.market} further or rebalance coverage into under-developed markets.`
        : "Next move: map the first priority market and create the initial set of leads.",
      market: strongestMarket?.market || "",
    },
  ];

  return cards.map((card) => ({
    ...card,
    drilldownCount: getExecutiveKpiDrilldownDeals(card.key, deals, { market: card.market }).length,
  }));
}

function renderMarketInterpretationBoard(deals) {
  const rows = buildMarketInterpretationRows(deals);

  if (rows.length === 0) {
    elements.marketInterpretationBoard.innerHTML = '<div class="empty-state">No market context is currently available to build an executive market narrative.</div>';
    return;
  }

  elements.marketInterpretationBoard.innerHTML = rows
    .map((row) => {
      return `
        <article class="market-interpretation-card ${escapeHtml(row.tone)}">
          <header>
            <div class="market-interpretation-copy">
              <span class="market-interpretation-kicker">${escapeHtml(row.market)}</span>
              <strong>${escapeHtml(row.signal)}</strong>
              <small>${escapeHtml(row.summary)}</small>
            </div>
            <div class="market-interpretation-badges">
              <span class="pill ${escapeHtml(row.priorityTone)}">${escapeHtml(row.priorityLabel)}</span>
              <span class="pill ${escapeHtml(row.riskTone)}">${escapeHtml(row.riskLabel)}</span>
            </div>
          </header>
          <div class="market-interpretation-metrics">
            ${renderForecastMetric("Forecast", formatCompactCurrency(row.forecastValue), `${formatCurrency(row.forecastValue)} forecast value`)}
            ${renderForecastMetric("Potential", formatCompactCurrency(row.revenuePotentialEur), `${formatCurrency(row.revenuePotentialEur)} market potential`)}
            ${renderForecastMetric("Coverage", row.coverageLabel, row.coverageTooltip)}
            ${renderForecastMetric("Whitespace", `${row.whitespaceCount}`, `${row.targetOperatorCount} target operators currently mapped`)}
          </div>
          <p>${escapeHtml(row.action)}</p>
          <div class="row-actions">
            <button type="button" class="icon-button" data-action="create-task-from-market" data-market="${escapeAttribute(row.market)}">Create Market Task</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function buildMarketInterpretationRows(deals) {
  const forecastMap = new Map(buildForecastMarketRows(deals).map((row) => [row.market, row]));
  const intelMap = new Map(buildMarketIntelRows().map((row) => [row.country, row]));
  const markets = uniqueValues([...forecastMap.keys(), ...intelMap.keys()]);

  return markets
    .map((market) => {
      const forecast = forecastMap.get(market) || {
        market,
        totalCount: 0,
        dealValueTotal: 0,
        forecastValue: 0,
        weightedCount: 0,
        commitCount: 0,
        liveCount: 0,
        targetCount: getMarketTargetCount(market),
        targetGap: 0,
        coverageRatio: 0,
      };
      const intel = intelMap.get(market) || {
        opportunityLevel: "Observation",
        regulatoryRisk: "Medium",
        revenuePotentialEur: 0,
        whitespaceCount: 0,
        targetOperatorCount: 0,
      };

      const priorityLabel = cleanText(intel.opportunityLevel) || inferMarketPriorityFromForecast(forecast);
      const riskLabel = `${cleanText(intel.regulatoryRisk) || "Medium"} Risk`;
      const coverageKnown = forecast.targetCount > 0;
      const coverageLabel = coverageKnown ? formatPercent(forecast.coverageRatio) : "No target";
      const coverageTooltip = coverageKnown
        ? `${formatForecastUnits(forecast.weightedCount + forecast.liveCount)} coverage against ${forecast.targetCount} annual target accounts`
        : "No annual target loaded for this market";
      const signalModel = buildMarketSignal({
        forecast,
        intel,
        priorityLabel,
      });

      return {
        market,
        signal: signalModel.signal,
        summary: signalModel.summary,
        action: signalModel.action,
        tone: signalModel.tone,
        priorityLabel,
        priorityTone: priorityToPillClass(priorityLabel),
        riskLabel,
        riskTone: riskToPillClass(intel.regulatoryRisk),
        forecastValue: forecast.forecastValue,
        revenuePotentialEur: Number(intel.revenuePotentialEur || 0),
        coverageLabel,
        coverageTooltip,
        whitespaceCount: Number(intel.whitespaceCount || 0),
        targetOperatorCount: Number(intel.targetOperatorCount || 0),
        sortScore:
          marketPriorityWeight(priorityLabel) * 1000 +
          Number(intel.revenuePotentialEur || 0) +
          forecast.forecastValue +
          forecast.weightedCount * 100 -
          marketRiskWeight(intel.regulatoryRisk) * 120,
      };
    })
    .sort((left, right) => right.sortScore - left.sortScore || left.market.localeCompare(right.market))
    .slice(0, 8);
}

function buildMarketSignal({ forecast, intel, priorityLabel }) {
  const riskWeight = marketRiskWeight(intel.regulatoryRisk);
  const coverageKnown = forecast.targetCount > 0;
  const coverageRatio = coverageKnown ? forecast.coverageRatio : 0;

  if (forecast.totalCount === 0 && Number(intel.targetOperatorCount || 0) > 0) {
    return {
      signal: "Unconverted target market",
      summary: `${intel.targetOperatorCount} target operators are mapped, but none have been converted into active funnel accounts yet.`,
      action: "Next move: convert the first target operators into mapped leads and assign ownership immediately.",
      tone: "is-warn",
    };
  }

  if (riskWeight >= 3 && forecast.commitCount === 0) {
    return {
      signal: "Regulatory watch",
      summary: `${cleanText(intel.regulatoryRisk) || "High"} regulatory friction is limiting confidence despite visible opportunity.`,
      action: "Next move: validate license path, legal feasibility, and market timing before scaling commercial effort.",
      tone: "is-danger",
    };
  }

  if (coverageKnown && coverageRatio >= 1) {
    return {
      signal: "Target covered",
      summary: `${forecast.market} is already covering its annual signed target with current weighted pipeline plus live accounts.`,
      action: "Next move: shift focus from raw creation into execution quality and speed-to-live.",
      tone: "is-good",
    };
  }

  if (coverageKnown && coverageRatio < 0.75) {
    return {
      signal: "Coverage gap",
      summary: `${forecast.market} is under-covered against target and still needs more qualified depth or faster stage movement.`,
      action: "Next move: add qualified pipeline and pull proposal-to-legal conversion forward in this market.",
      tone: "is-warn",
    };
  }

  if (Number(intel.whitespaceCount || 0) >= 2 || Number(intel.targetOperatorCount || 0) >= 3 || marketPriorityWeight(priorityLabel) >= 4) {
    return {
      signal: "Expansion runway",
      summary: `${forecast.market} combines mapped whitespace, visible operator interest, and commercial headroom for growth.`,
      action: "Next move: package the top whitespace products into a focused outreach and proposal plan.",
      tone: "is-neutral",
    };
  }

  if (forecast.liveCount > 0 || forecast.commitCount > 0) {
    return {
      signal: "Execution market",
      summary: `${forecast.market} already shows live or near-live momentum and now depends on disciplined execution.`,
      action: "Next move: protect delivery, tighten Jira and integration follow-up, and pull the next go-live date closer.",
      tone: "is-good",
    };
  }

  return {
    signal: "Pipeline building",
    summary: `${forecast.market} has visible activity, but still needs clearer market shape, stronger prioritization, and better next-step discipline.`,
    action: "Next move: sharpen opportunity scoring, define next actions, and concentrate effort on the highest-fit operators.",
    tone: "is-neutral",
  };
}

function inferMarketPriorityFromForecast(forecast) {
  if ((forecast.weightedCount || 0) >= 2 || (forecast.commitCount || 0) >= 1) {
    return "High Priority";
  }
  if ((forecast.totalCount || 0) >= 2) {
    return "Medium";
  }
  if ((forecast.totalCount || 0) >= 1) {
    return "Low";
  }
  return "Observation";
}

function marketPriorityWeight(priority) {
  const value = cleanText(priority).toLowerCase();
  if (value === "high priority") {
    return 4;
  }
  if (value === "medium") {
    return 3;
  }
  if (value === "low") {
    return 2;
  }
  return 1;
}

function marketRiskWeight(risk) {
  const value = cleanText(risk).toLowerCase();
  if (value.includes("high")) {
    return 3;
  }
  if (value.includes("medium")) {
    return 2;
  }
  if (value.includes("low")) {
    return 1;
  }
  return 2;
}

function priorityToPillClass(priority) {
  const value = cleanText(priority).toLowerCase();
  if (value === "high priority") {
    return "success";
  }
  if (value === "medium") {
    return "info";
  }
  if (value === "low") {
    return "neutral";
  }
  return "blocked";
}

function riskToPillClass(risk) {
  const weight = marketRiskWeight(risk);
  if (weight >= 3) {
    return "blocked";
  }
  if (weight === 2) {
    return "info";
  }
  return "success";
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
        <button
          type="button"
          class="forecast-item is-clickable"
          data-action="open-forecast-market"
          data-market="${escapeAttribute(row.market)}"
        >
          <header>
            <div class="forecast-headline">
              <strong>${escapeHtml(row.market)}</strong>
              <small>${row.totalCount} deals • ${row.operatorCount} operators • ${row.liveCount} live</small>
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
          <small>${escapeHtml(`${gapText} • Weighted ${formatForecastUnits(row.weightedCount)} • Commit ${row.commitCount}`)}</small>
          <span class="forecast-item-hint">Open matching deals</span>
        </button>
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
        <button
          type="button"
          class="forecast-item is-clickable"
          data-action="open-forecast-operator"
          data-market="${escapeAttribute(row.market)}"
          data-operator="${escapeAttribute(row.operator)}"
        >
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
          <small>${escapeHtml(`${row.owner || "No owner assigned"} • ${row.groupName || "No group assigned"} • Weighted ${formatForecastUnits(row.weightedCount)}`)}</small>
          <span class="forecast-item-hint">Open matching deals</span>
        </button>
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
    ["Visible Accounts", `${deals.length}`, buildTimeWindowLabel(), "visible-accounts"],
    ["Weighted Forecast", formatForecastUnits(snapshot.weightedCount), "Expected output within the current review window", "weighted-forecast"],
    ["Commit", `${snapshot.commitCount}`, "Deals carrying the strongest execution probability", "commit-forecast"],
    ["Attention", `${riskCount}`, "Deals with blockers or delayed follow-up", "at-risk"],
    ["Next 30 Days", `${upcomingCount}`, "ETAs landing inside the next 30 days", "next-30-days"],
  ];

  elements.pipelineSummary.innerHTML = summaryCards
    .map(([label, value, note, key]) => {
      return `
        <button type="button" class="summary-card is-clickable" data-action="open-pipeline-summary" data-kpi-key="${escapeAttribute(key)}">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(note)}</small>
        </button>
      `;
    })
    .join("");

  elements.pipelineSummary.querySelectorAll("[data-action='open-pipeline-summary']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openPipelineSummaryDrilldown(button.dataset.kpiKey);
    });
  });
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
  const baseDeals = getPipelineBaseDeals();
  syncPipelineFilterOptions(scopedDeals);
  renderPipelineFinderSuggestions(baseDeals);
  const deals = getFilteredDeals(baseDeals);
  elements.pipelineCount.textContent = `${deals.length} deals · ${buildTimeWindowLabel()}`;
  renderPipelineSearchStatus(deals.length, baseDeals.length, scopedDeals.length);
  renderPipelineSummary(deals);
  renderPipelineStageStrip(deals);
  renderPipelineBoard(deals);
  renderDealTable(deals);
}

function renderPipelineSearchStatus(filteredCount, baseCount, scopedCount) {
  const search = cleanText(ui.filters.search);
  const presetLabel = cleanText(ui.pipelinePreset?.label);
  if (!search && presetLabel) {
    elements.pipelineSearchStatus.textContent = `Dashboard drilldown active: ${presetLabel}. Showing ${filteredCount} matching accounts out of ${scopedCount} visible in the current time window. Use Clear Search to reset the drilldown.`;
    return;
  }

  if (!search) {
    elements.pipelineSearchStatus.textContent = "Search deals, clients, operators, markets, Jira tickets, DD tickets, websites, and integration traces.";
    return;
  }

  if (ui.pipelineFinder.selectedDealId && filteredCount === 1) {
    elements.pipelineSearchStatus.textContent = presetLabel
      ? `Dashboard drilldown "${presetLabel}" is focused on 1 deal for "${search}".`
      : `Focused on 1 deal for "${search}".`;
    return;
  }

  elements.pipelineSearchStatus.textContent = presetLabel
    ? `Dashboard drilldown "${presetLabel}" plus search is showing ${filteredCount} matching deals out of ${baseCount} drilldown accounts in the current time window.`
    : `Showing ${filteredCount} matching deals out of ${scopedCount} visible in the current time window.`;
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
                  <button class="icon-button" data-action="create-campaign-from-deal" data-id="${escapeHtml(deal.id)}">Create Campaign</button>
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
              <button class="icon-button" data-action="create-campaign-from-deal" data-id="${escapeHtml(deal.id)}">Create Campaign</button>
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
  const annualDeals = state.deals.filter((deal) => !isInactiveDeal(deal) && resolveDealYear(deal) === year);
  const annualTasks = getTasksForYear(year);
  const annualCampaigns = getCampaignsForYear(year);
  const taskSummary = getTaskCompletionSummary(annualTasks);
  const stageCadence = getStageCadenceSummary(annualDeals);
  const campaignExecution = getCampaignExecutionSummary(annualCampaigns);
  const campaignGrowth = getCampaignGrowthSummary(annualCampaigns);
  const summary = {
    newSigned: sumValues(targets.map((target) => target.newSigned)),
    integrations: sumValues(targets.map((target) => target.integrations)),
    ddPipeline: sumValues(targets.map((target) => target.ddPipeline)),
    newGoLive: sumValues(targets.map((target) => target.newGoLive)),
    totalGoLive: sumValues(targets.map((target) => target.totalGoLive)),
  };

  const actual = {
    newSigned: annualDeals.filter((deal) => deal.signedFlag).length,
    integrations: annualDeals.filter((deal) => deal.stage === "Integration" || deal.integrationStartedFlag).length,
    ddPipeline: annualDeals.filter((deal) => deal.stage === "DD").length,
    newGoLive: state.deals.filter((deal) => yearFromDate(deal.liveSince) === year || (deal.goLiveFlag && deal.stage === "Go Live" && resolveDealYear(deal) === year)).length,
    totalGoLive: annualDeals.filter((deal) => ["Go Live", "Live", "Handover"].includes(deal.stage)).length,
  };

  const cards = [
    buildTargetProgressCard("New Signed", actual.newSigned, summary.newSigned, "new-signed"),
    buildTargetProgressCard("Integrations", actual.integrations, summary.integrations, "integrations"),
    buildTargetProgressCard("DD Pipeline", actual.ddPipeline, summary.ddPipeline, "dd-pipeline"),
    buildTargetProgressCard("New Go Live", actual.newGoLive, summary.newGoLive, "new-go-live"),
    buildTargetProgressCard("Total Go Live", actual.totalGoLive, summary.totalGoLive, "total-go-live"),
    {
      label: "Tasks Completed",
      headline: `${taskSummary.completedCount} / ${taskSummary.totalCount}`,
      note:
        taskSummary.totalCount > 0
          ? `${formatPercent(taskSummary.completionRatio)} of tracked tasks were completed in ${year}`
          : `No task activity is recorded in ${year}`,
      percentage: taskSummary.totalCount > 0 ? Math.round(taskSummary.completionRatio * 100) : 0,
      showMinimum: taskSummary.completedCount > 0,
      drilldownKey: "tasks-completed",
    },
    {
      label: "Campaigns Executed",
      headline: `${campaignExecution.executedCount} / ${campaignExecution.totalCount}`,
      note:
        campaignExecution.totalCount > 0
          ? `${formatPercent(campaignExecution.executedRatio)} of campaigns reached Ready, Live, or Completed in ${year}`
          : `No campaigns are recorded in ${year}`,
      percentage: campaignExecution.totalCount > 0 ? Math.round(campaignExecution.executedRatio * 100) : 0,
      showMinimum: campaignExecution.executedCount > 0,
      drilldownKey: "campaigns-executed",
    },
    {
      label: "Avg Stage Duration",
      headline: stageCadence.transitionCount > 0 ? `${formatDaysMetric(stageCadence.averageDays)} / stage` : "N/A",
      note:
        stageCadence.transitionCount > 0
          ? `${stageCadence.transitionCount} transitions were measured in ${year}; ${formatPercent(stageCadence.onBenchmarkRatio)} landed within cadence`
          : `No dated stage transitions are available in ${year}`,
      percentage:
        stageCadence.transitionCount > 0 && stageCadence.averageDays
          ? Math.min(100, Math.round((stageCadence.benchmarkDays / stageCadence.averageDays) * 100))
          : 0,
      showMinimum: stageCadence.transitionCount > 0,
      drilldownKey: "avg-stage-duration",
    },
    {
      label: "Stage Cadence KPI",
      headline: stageCadence.transitionCount > 0 ? `${formatDaysMetric(stageCadence.averageDays)} / ${stageCadence.benchmarkDays}d` : "N/A / 30d",
      note:
        stageCadence.transitionCount > 0
          ? `${formatPercent(stageCadence.onBenchmarkRatio)} of ${stageCadence.transitionCount} recorded transitions landed on cadence in ${year}`
          : `No recorded funnel milestone transitions are available in ${year}`,
      percentage:
        stageCadence.transitionCount > 0 && stageCadence.averageDays
          ? Math.min(100, Math.round((stageCadence.benchmarkDays / stageCadence.averageDays) * 100))
          : 0,
      showMinimum: stageCadence.transitionCount > 0,
      drilldownKey: "stage-cadence",
    },
    {
      label: "Campaign Growth %",
      headline: campaignGrowth.count > 0 ? `${formatPercent(campaignGrowth.blendedGrowthRatio)} / ${formatPercent(campaignGrowth.benchmarkRatio)}` : "N/A / 100%",
      note:
        campaignGrowth.count > 0
          ? `${campaignGrowth.count} campaigns project ${formatCurrency(campaignGrowth.totalForecastLift)} lift on ${formatCurrency(campaignGrowth.totalBudget)} budget in ${year}`
          : `No campaign budget and forecast lift are loaded in ${year}`,
      percentage: campaignGrowth.count > 0 ? Math.min(100, Math.round(campaignGrowth.blendedGrowthRatio * 100)) : 0,
      showMinimum: campaignGrowth.count > 0,
      drilldownKey: "campaign-growth",
    },
  ];

  elements.targetProgress.innerHTML = cards
    .map((card) => {
      return `
        <button
          type="button"
          class="progress-card ${card.drilldownKey ? "is-clickable" : ""}"
          ${card.drilldownKey ? `data-action="open-target-progress" data-drilldown-key="${escapeAttribute(card.drilldownKey)}" data-year="${escapeAttribute(String(year))}"` : "disabled"}
        >
          <header>
            <strong>${escapeHtml(card.label)}</strong>
            <span>${escapeHtml(card.headline)}</span>
          </header>
          <small>${escapeHtml(card.note)}</small>
          <div class="progress-track">
            <div class="progress-bar" style="width:${Math.max(card.percentage, card.showMinimum ? 18 : 0)}%"></div>
          </div>
        </button>
      `;
    })
    .join("");

  elements.targetProgress.querySelectorAll("[data-action='open-target-progress']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openTargetProgressDrilldown(button.dataset.drilldownKey, Number(button.dataset.year || year));
    });
  });
}

function buildTargetProgressCard(label, value, target, drilldownKey = "") {
  const percentage = target === 0 ? 0 : Math.min(100, Math.round((value / target) * 100));
  return {
    label,
    headline: `${value} / ${target}`,
    note: target > 0 ? `${percentage}% of target` : "No target loaded",
    percentage,
    showMinimum: value > 0 && target === 0,
    drilldownKey,
  };
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
  const visibleTasks = getVisibleTasks();
  const openCount = visibleTasks.filter((task) => task.status !== "Done").length;
  elements.taskSummary.textContent = ui.taskPreset ? `${visibleTasks.length} tasks · ${ui.taskPreset.label}` : `${visibleTasks.length} tasks`;
  elements.taskOpenCount.textContent = `${openCount} open`;
  renderTaskBoard(visibleTasks);
  renderTaskTable(visibleTasks);
}

function renderTaskBoard(tasks = getVisibleTasks()) {
  const groups = TASK_SCOPE_TYPES.map((scopeType) => ({
    scopeType,
    tasks: tasks.filter((task) => task.scopeType === scopeType),
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
          <span class="task-number">${escapeHtml(task.taskNumber || "Pending number")}</span>
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

function renderTaskTable(tasks = getVisibleTasks()) {
  if (tasks.length === 0) {
    elements.taskTableBody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">Todavia no hay tareas creadas.</div>
        </td>
      </tr>
    `;
    return;
  }

  elements.taskTableBody.innerHTML = [...tasks]
    .sort((left, right) => compareTasks(left, right))
    .map((task) => {
      return `
        <tr>
          <td>${escapeHtml(task.taskNumber || "Pending")}</td>
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

function renderCampaigns() {
  const visibleCampaigns = getVisibleCampaigns();
  const liveCount = visibleCampaigns.filter((campaign) => ["Ready", "Live"].includes(campaign.status)).length;
  elements.campaignSummary.textContent = ui.campaignPreset ? `${visibleCampaigns.length} campaigns · ${ui.campaignPreset.label}` : `${visibleCampaigns.length} campaigns`;
  elements.campaignLiveCount.textContent = `${liveCount} ready / live`;
  renderCampaignBoard(visibleCampaigns);
  renderCampaignTable(visibleCampaigns);
}

function renderCampaignBoard(campaigns = getVisibleCampaigns()) {
  const groups = CAMPAIGN_TYPE_OPTIONS.map((campaignType) => ({
    campaignType,
    campaigns: campaigns.filter((campaign) => campaign.campaignType === campaignType),
  })).filter((group) => group.campaigns.length > 0);

  if (groups.length === 0) {
    elements.campaignBoard.innerHTML = '<div class="empty-state">No campaigns have been created yet. Use this workspace to plan activations, tournaments, giveaways, progressives, and free spins.</div>';
    return;
  }

  elements.campaignBoard.innerHTML = groups
    .map((group) => {
      return `
        <section class="campaign-column">
          <header>
            <strong>${escapeHtml(group.campaignType)}</strong>
            <span>${group.campaigns.length}</span>
          </header>
          <div class="campaign-column-list">
            ${group.campaigns
              .sort((left, right) => compareCampaigns(left, right))
              .map((campaign) => renderCampaignCard(campaign))
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderCampaignCard(campaign) {
  const growthRatio = calculateCampaignGrowthRatio(campaign);
  return `
    <article class="campaign-card ${campaignStatusClass(campaign.status)}">
      <div class="campaign-card-head">
        <div>
          <strong>${escapeHtml(campaign.title || "Untitled campaign")}</strong>
          <small>${escapeHtml(buildCampaignAudienceLine(campaign))}</small>
        </div>
        <span class="campaign-priority">${escapeHtml(campaign.priority)}</span>
      </div>
      <div class="pill-row">
        <span class="pill neutral">${escapeHtml(campaign.campaignType)}</span>
        <span class="pill ${campaignStatusPillClass(campaign.status)}">${escapeHtml(campaign.status)}</span>
      </div>
      <div class="campaign-card-meta">
        <span><strong>Window:</strong> ${escapeHtml(buildCampaignWindow(campaign))}</span>
        <span><strong>Owner:</strong> ${escapeHtml(campaign.owner || "N/A")}</span>
        <span><strong>Channel:</strong> ${escapeHtml(campaign.channel || "N/A")}</span>
      </div>
      <div class="campaign-metric-grid">
        <span><strong>Budget</strong>${formatCurrency(campaign.budgetEur)}</span>
        <span><strong>Prize</strong>${formatCurrency(campaign.prizeValueEur)}</span>
        <span><strong>Forecast Lift</strong>${formatCurrency(campaign.forecastLiftEur)}</span>
        <span><strong>Growth</strong>${growthRatio > 0 ? formatPercent(growthRatio) : "N/A"}</span>
        <span><strong>Players</strong>${campaign.targetPlayers || 0}</span>
        <span><strong>Target Wager</strong>${formatCurrency(campaign.targetWager)}</span>
        <span><strong>Target GGR</strong>${formatCurrency(campaign.targetGgr)}</span>
      </div>
      <p>${escapeHtml(campaign.nextStep || campaign.offerDetails || "No campaign brief defined yet.")}</p>
      <small class="task-trace">${escapeHtml(getLatestTraceLine(campaign.traceLog) || campaign.successMetric || "No execution trace recorded yet.")}</small>
      <div class="kanban-actions">
        <button class="icon-button" data-action="edit-campaign" data-id="${escapeHtml(campaign.id)}">Edit</button>
        <button class="icon-button danger" data-action="delete-campaign" data-id="${escapeHtml(campaign.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderCampaignTable(campaigns = getVisibleCampaigns()) {
  if (campaigns.length === 0) {
    elements.campaignTableBody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">No campaign records are available yet.</div>
        </td>
      </tr>
    `;
    return;
  }

  elements.campaignTableBody.innerHTML = [...campaigns]
    .sort((left, right) => compareCampaigns(left, right))
    .map((campaign) => {
      const growthRatio = calculateCampaignGrowthRatio(campaign);
      return `
        <tr>
          <td>
            <div class="entity-title">
              <strong>${escapeHtml(campaign.title || "Untitled campaign")}</strong>
              <small>${escapeHtml(buildCampaignAudienceLine(campaign))}</small>
            </div>
          </td>
          <td>${escapeHtml(campaign.campaignType)}</td>
          <td><span class="pill ${campaignStatusPillClass(campaign.status)}">${escapeHtml(campaign.status)}</span></td>
          <td>${escapeHtml(campaign.operator || "N/A")}</td>
          <td>${escapeHtml(campaign.market || "N/A")}</td>
          <td>${escapeHtml(buildCampaignWindow(campaign))}</td>
          <td>
            <div class="entity-title">
              <strong>${formatCurrency(campaign.budgetEur)}</strong>
              <small>${formatCurrency(campaign.forecastLiftEur)} forecast lift · ${growthRatio > 0 ? formatPercent(growthRatio) : "No budget base"} growth</small>
            </div>
          </td>
          <td>${escapeHtml(getLatestTraceLine(campaign.traceLog) || campaign.nextStep || "No trace")}</td>
          <td>
            <div class="row-actions">
              <button class="icon-button" data-action="edit-campaign" data-id="${escapeHtml(campaign.id)}">Edit</button>
              <button class="icon-button danger" data-action="delete-campaign" data-id="${escapeHtml(campaign.id)}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderKpiCatalogue() {
  const source = mergeKpiCatalogue(state.kpis);
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
    segment: formData.get("segment"),
    primaryContact: formData.get("primaryContact"),
    decisionMaker: formData.get("decisionMaker"),
    licenseStatus: formData.get("licenseStatus"),
    productsCurrent: formData.get("productsCurrent"),
    productsPotential: formData.get("productsPotential"),
    currentCompetitors: formData.get("currentCompetitors"),
    targetPriority: formData.get("targetPriority"),
    strategicFit: formData.get("strategicFit"),
    platform: formData.get("platform"),
    stage: formData.get("stage"),
    signingEta: formData.get("signingEta"),
    signingYear: formData.get("signingYear"),
    signingMonth: formData.get("signingMonth"),
    dealValue: formData.get("dealValue"),
    dealValueAlt: formData.get("dealValueAlt"),
    revenuePotentialEur: formData.get("revenuePotentialEur"),
    revenuePotentialScore: formData.get("revenuePotentialScore"),
    strategicFitScore: formData.get("strategicFitScore"),
    closeProbabilityScore: formData.get("closeProbabilityScore"),
    licenseScore: formData.get("licenseScore"),
    legalComplexityScore: formData.get("legalComplexityScore"),
    technicalComplexityScore: formData.get("technicalComplexityScore"),
    commercialUrgencyScore: formData.get("commercialUrgencyScore"),
    opportunityScore: formData.get("opportunityScore"),
    priorityClass: formData.get("priorityClass"),
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

async function handleMarketIntelSubmit(event) {
  event.preventDefault();

  const formData = new FormData(marketIntelForm);
  const existingRecord = ui.editingMarketIntelId ? state.marketIntel.find((item) => item.id === ui.editingMarketIntelId) : null;
  const now = new Date().toISOString();
  const draft = normalizeMarketIntel({
    ...existingRecord,
    id: ui.editingMarketIntelId || generateId("intel"),
    country: formData.get("country"),
    regulatoryStatus: formData.get("regulatoryStatus"),
    licenseType: formData.get("licenseType"),
    activeOperators: formData.get("activeOperators"),
    targetOperators: formData.get("targetOperators"),
    competitorsPresent: formData.get("competitorsPresent"),
    currentProducts: formData.get("currentProducts"),
    missingProducts: formData.get("missingProducts"),
    revenuePotentialEur: formData.get("revenuePotentialEur"),
    regulatoryRisk: formData.get("regulatoryRisk"),
    opportunityLevel: formData.get("opportunityLevel"),
    strategicNotes: formData.get("strategicNotes"),
    createdAt: existingRecord?.createdAt || now,
    updatedAt: now,
  });

  if (!draft.country.trim()) {
    setBanner("Country / Market is required for market intelligence.", "danger");
    return;
  }

  if (ui.editingMarketIntelId) {
    state.marketIntel = state.marketIntel.map((item) => (item.id === ui.editingMarketIntelId ? draft : item));
  } else {
    state.marketIntel = [draft, ...state.marketIntel];
  }

  const saved = await persistState();
  ui.editingMarketIntelId = null;
  resetMarketIntelForm();
  renderAll();
  ui.activeView = "crm";
  renderViewState();
  setBanner(buildExcelBanner(saved ? `Market intelligence saved: ${draft.country}.` : `Market intelligence updated in memory: ${draft.country}.`), saved ? "success" : "warn");
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
  const activeUser = getActiveUser();
  const nextSequence = Number(state.workspace.taskSequence || 0) + 1;
  const draft = normalizeTask({
    ...existingTask,
    id: ui.editingTaskId || generateId("task"),
    taskNumber: existingTask?.taskNumber || buildTaskNumber(nextSequence, { targetYear: formData.get("targetYear") }),
    title: formData.get("title"),
    scopeType: formData.get("scopeType"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    owner: formData.get("owner") || activeUser?.fullName || "",
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
    state.workspace.taskSequence = nextSequence;
  }

  const saved = await persistState();
  ui.editingTaskId = null;
  resetTaskForm();
  renderAll();
  ui.activeView = "tasks";
  renderViewState();
  setBanner(buildExcelBanner(saved ? `Tarea guardada: ${draft.title}.` : `Tarea actualizada solo en memoria: ${draft.title}.`), saved ? "success" : "warn");
}

async function handleCampaignSubmit(event) {
  event.preventDefault();

  const formData = new FormData(campaignForm);
  const existingCampaign = ui.editingCampaignId ? state.campaigns.find((campaign) => campaign.id === ui.editingCampaignId) : null;
  const now = new Date().toISOString();
  const traceEntry = cleanText(formData.get("traceEntry"));
  const draft = normalizeCampaign({
    ...existingCampaign,
    id: ui.editingCampaignId || generateId("campaign"),
    title: formData.get("title"),
    campaignType: formData.get("campaignType"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    operator: formData.get("operator"),
    client: formData.get("client"),
    dealId: formData.get("dealId"),
    deal: formData.get("deal"),
    market: formData.get("market"),
    owner: formData.get("owner"),
    channel: formData.get("channel"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    budgetEur: formData.get("budgetEur"),
    prizeValueEur: formData.get("prizeValueEur"),
    forecastLiftEur: formData.get("forecastLiftEur"),
    targetPlayers: formData.get("targetPlayers"),
    targetWager: formData.get("targetWager"),
    targetGgr: formData.get("targetGgr"),
    jiraTicket: formData.get("jiraTicket"),
    landingUrl: formData.get("landingUrl"),
    mechanic: formData.get("mechanic"),
    offerDetails: formData.get("offerDetails"),
    successMetric: formData.get("successMetric"),
    nextStep: formData.get("nextStep"),
    notes: formData.get("notes"),
    traceLog: appendTraceLog(existingCampaign?.traceLog, traceEntry),
    createdAt: existingCampaign?.createdAt || now,
    updatedAt: now,
  });

  if (!draft.title.trim()) {
    setBanner("Campaign title is required.", "danger");
    return;
  }

  if (ui.editingCampaignId) {
    state.campaigns = state.campaigns.map((campaign) => (campaign.id === ui.editingCampaignId ? draft : campaign));
  } else {
    state.campaigns = [draft, ...state.campaigns];
  }

  const saved = await persistState();
  ui.editingCampaignId = null;
  resetCampaignForm();
  renderAll();
  ui.activeView = "campaigns";
  renderViewState();
  setBanner(buildExcelBanner(saved ? `Campaign saved: ${draft.title}.` : `Campaign updated in memory only: ${draft.title}.`), saved ? "success" : "warn");
}

async function handleWorkspaceSubmit(event) {
  event.preventDefault();

  const formData = new FormData(workspaceForm);
  state.workspace = normalizeWorkspace({
    ...state.workspace,
    workspaceName: formData.get("workspaceName"),
    organizationName: formData.get("organizationName"),
    adminName: formData.get("adminName"),
    adminEmail: formData.get("adminEmail"),
    subscriptionPlan: formData.get("subscriptionPlan"),
    crmModel: formData.get("crmModel"),
    fiscalYear: formData.get("fiscalYear"),
    defaultCurrency: formData.get("defaultCurrency"),
    taskSequence: state.workspace.taskSequence,
  });

  const saved = await persistState();
  renderAll();
  setBanner(buildExcelBanner(saved ? `Workspace updated: ${state.workspace.workspaceName}.` : `Workspace updated in memory only: ${state.workspace.workspaceName}.`), saved ? "success" : "warn");
}

async function handleUserSubmit(event) {
  event.preventDefault();

  const formData = new FormData(userForm);
  const existingUser = ui.editingUserId ? state.users.find((user) => user.id === ui.editingUserId) : null;
  const now = new Date().toISOString();
  const draft = normalizeUser({
    ...existingUser,
    id: ui.editingUserId || generateId("user"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    role: formData.get("role"),
    status: formData.get("status"),
    team: formData.get("team"),
    marketFocus: formData.get("marketFocus"),
    createdAt: existingUser?.createdAt || now,
    updatedAt: now,
  });

  if (!draft.fullName || !draft.email) {
    setBanner("Full name and email are required to create a workspace user.", "danger");
    return;
  }

  if (ui.editingUserId) {
    const previousUser = existingUser;
    state.users = state.users.map((user) => (user.id === ui.editingUserId ? draft : user));
    if (previousUser && previousUser.fullName !== draft.fullName) {
      state.tasks = state.tasks.map((task) => (task.owner === previousUser.fullName ? normalizeTask({ ...task, owner: draft.fullName }) : task));
      state.deals = state.deals.map((deal) => (deal.kam === previousUser.fullName ? normalizeDeal({ ...deal, kam: draft.fullName }) : deal));
      state.campaigns = state.campaigns.map((campaign) => (campaign.owner === previousUser.fullName ? normalizeCampaign({ ...campaign, owner: draft.fullName }) : campaign));
    }
  } else {
    state.users = [draft, ...state.users];
  }

  if (!ui.activeUserId) {
    ui.activeUserId = draft.id;
  }

  const saved = await persistState();
  ui.editingUserId = null;
  resetUserForm();
  renderAll();
  ui.activeView = "admin";
  renderViewState();
  setBanner(buildExcelBanner(saved ? `User saved: ${draft.fullName}.` : `User updated in memory only: ${draft.fullName}.`), saved ? "success" : "warn");
}

function handleExecutiveKpiAction(event) {
  const button = event.target.closest("[data-action='open-executive-kpi']");
  if (!button) {
    return;
  }

  openExecutiveKpiDrilldown(button.dataset.kpiKey, {
    market: cleanText(button.dataset.market),
  });
}

function handlePipelineSummaryAction(event) {
  const button = event.target.closest("[data-action='open-pipeline-summary']");
  if (!button) {
    return;
  }

  openPipelineSummaryDrilldown(button.dataset.kpiKey);
}

function handleTargetProgressAction(event) {
  const button = event.target.closest("[data-action='open-target-progress']");
  if (!button) {
    return;
  }

  openTargetProgressDrilldown(button.dataset.drilldownKey, Number(button.dataset.year || getActiveTargetYear()));
}

function openExecutiveKpiDrilldown(kpiKey, options = {}) {
  const scopedDeals = getScopedDeals();
  const matchedDeals = getExecutiveKpiDrilldownDeals(kpiKey, scopedDeals, options);
  if (matchedDeals.length === 0) {
    setBanner("No matching accounts are available for that KPI in the current time window.", "warn");
    return;
  }

  const preset = buildPipelinePreset(kpiKey, options);
  openPipelinePresetDrilldown(preset, matchedDeals, `Pipeline drilldown loaded for ${preset.label}: ${matchedDeals.length} matching accounts.`);
}

function openPipelineSummaryDrilldown(kpiKey) {
  const scopedDeals = getPipelineBaseDeals({ ignorePreset: true });
  const matchedDeals = getExecutiveKpiDrilldownDeals(kpiKey, scopedDeals);
  if (matchedDeals.length === 0) {
    setBanner("No matching accounts are available for that pipeline metric in the current filter window.", "warn");
    return;
  }

  resetPipelineSearchOnly();
  ui.pipelinePreset = buildPipelinePreset(kpiKey, {});
  renderPipeline();
  const label = cleanText(ui.pipelinePreset?.label) || "Pipeline metric";
  setBanner(`Pipeline list focused for ${label}: ${matchedDeals.length} matching accounts.`, "success");
}

function openTargetProgressDrilldown(drilldownKey, year) {
  const activeYear = Number(year || getActiveTargetYear());
  ui.filters.year = String(activeYear);
  ui.filters.quarter = "All";
  ui.filters.month = "All";

  const label = buildTargetProgressDrilldownLabel(drilldownKey, activeYear);
  if (["tasks-completed"].includes(drilldownKey)) {
    const preset = createTaskPreset(drilldownKey, label, { year: activeYear });
    const matchedTasks = getTaskPresetItems(preset, getTasksForYear(activeYear));
    if (matchedTasks.length === 0) {
      setBanner(`No matching tasks are available for ${label}.`, "warn");
      return;
    }
    ui.taskPreset = preset;
    ui.activeView = "tasks";
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setBanner(`Task list loaded for ${label}: ${matchedTasks.length} matching tasks.`, "success");
    return;
  }

  if (["campaigns-executed", "campaign-growth"].includes(drilldownKey)) {
    const preset = createCampaignPreset(drilldownKey, label, { year: activeYear });
    const matchedCampaigns = getCampaignPresetItems(preset, getCampaignsForYear(activeYear));
    if (matchedCampaigns.length === 0) {
      setBanner(`No matching campaigns are available for ${label}.`, "warn");
      return;
    }
    ui.campaignPreset = preset;
    ui.activeView = "campaigns";
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setBanner(`Campaign list loaded for ${label}: ${matchedCampaigns.length} matching campaigns.`, "success");
    return;
  }

  const preset = createPipelinePreset("target-progress", label, {
    key: drilldownKey,
    year: activeYear,
  });
  const matchedDeals = getTargetProgressPipelineDeals(drilldownKey, activeYear);
  if (matchedDeals.length === 0) {
    setBanner(`No matching accounts are available for ${label}.`, "warn");
    return;
  }
  openPipelinePresetDrilldown(preset, matchedDeals, `Pipeline drilldown loaded for ${label}: ${matchedDeals.length} matching accounts.`);
}

function handleStageFunnelAction(event) {
  const button = event.target.closest("[data-action='open-stage-funnel']");
  if (!button) {
    return;
  }

  openStageFunnelDrilldown(cleanText(button.dataset.stage));
}

function openStageFunnelDrilldown(stage) {
  const normalizedStage = cleanText(stage);
  if (!normalizedStage) {
    return;
  }

  const scopedDeals = getScopedDeals();
  const matchedDeals = scopedDeals.filter((deal) => deal.stage === normalizedStage);
  if (matchedDeals.length === 0) {
    setBanner(`No deals are currently available in ${normalizedStage} for the active time window.`, "warn");
    return;
  }

  resetPipelineOperationalFilters();
  ui.pipelinePreset = null;
  ui.filters.stage = normalizedStage;
  ui.activeView = "pipeline";
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
  setBanner(`Pipeline filtered to ${normalizedStage}: ${matchedDeals.length} matching deals.`, "success");
}

function handleDashboardDrilldownAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, market, operator } = button.dataset;
  if (action === "open-priority-market") {
    openMarketDrilldown(market, "Priority Market");
    return;
  }
  if (action === "open-forecast-market") {
    openMarketDrilldown(market, "Market Forecast");
    return;
  }
  if (action === "open-forecast-operator") {
    openOperatorForecastDrilldown(operator, market);
  }
}

function handleForecastSummaryAction(event) {
  const button = event.target.closest("[data-action='open-forecast-summary']");
  if (!button) {
    return;
  }

  openForecastSummaryDrilldown(button.dataset.forecastKey);
}

function handleOperatingSignalAction(event) {
  const button = event.target.closest("[data-action='open-operating-signal']");
  if (!button) {
    return;
  }

  openOperatingSignalDrilldown(button.dataset.signalKey);
}

function handleStageDurationAction(event) {
  const button = event.target.closest("[data-action='open-stage-duration']");
  if (!button) {
    return;
  }

  openStageDurationDrilldown(button.dataset.fromStage, button.dataset.toStage, button.dataset.label);
}

function openForecastSummaryDrilldown(forecastKey) {
  const key = cleanText(forecastKey);
  if (!key) {
    return;
  }

  if (key === "tasks-completed") {
    const preset = createTaskPreset("tasks-completed", "Completed Tasks");
    const matchedTasks = getTaskPresetItems(preset, getScopedTasks());
    if (matchedTasks.length === 0) {
      setBanner("No completed tasks are available in the current review window.", "warn");
      return;
    }
    ui.taskPreset = preset;
    ui.activeView = "tasks";
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setBanner(`Task list loaded for Completed Tasks: ${matchedTasks.length} matching tasks.`, "success");
    return;
  }

  if (["campaigns-executed", "campaign-growth"].includes(key)) {
    const label = key === "campaigns-executed" ? "Campaigns Executed" : "Campaign Growth";
    const preset = createCampaignPreset(key, label);
    const matchedCampaigns = getCampaignPresetItems(preset, getScopedCampaigns());
    if (matchedCampaigns.length === 0) {
      setBanner(`No matching campaigns are available for ${label} in the current review window.`, "warn");
      return;
    }
    ui.campaignPreset = preset;
    ui.activeView = "campaigns";
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setBanner(`Campaign list loaded for ${label}: ${matchedCampaigns.length} matching campaigns.`, "success");
    return;
  }

  const presetConfig = {
    "weighted-forecast": { key: "weighted-forecast", label: "Weighted Forecast" },
    "commit-forecast": { key: "commit-forecast", label: "Commit Forecast" },
    "coverage-vs-target": { key: "pipeline-coverage", label: "Coverage vs Target" },
    "active-operators": { key: "pipeline-coverage", label: "Active Operators" },
    "avg-stage-duration": { key: "stage-cadence", label: "Avg Stage Duration" },
  }[key];

  if (!presetConfig) {
    return;
  }

  const matchedDeals = getExecutiveKpiDrilldownDeals(presetConfig.key, getScopedDeals());
  if (matchedDeals.length === 0) {
    setBanner(`No matching accounts are available for ${presetConfig.label} in the current review window.`, "warn");
    return;
  }

  const preset = createPipelinePreset("executive-kpi", presetConfig.label, { key: presetConfig.key });
  openPipelinePresetDrilldown(preset, matchedDeals, `Pipeline drilldown loaded for ${presetConfig.label}: ${matchedDeals.length} matching accounts.`);
}

function openOperatingSignalDrilldown(signalKey) {
  const stageMap = {
    legal: "Legal",
    dd: "DD",
    integration: "Integration",
    "handover-pending": "Live",
  };

  const stage = stageMap[cleanText(signalKey)];
  if (!stage) {
    return;
  }

  openStageFunnelDrilldown(stage);
}

function openStageDurationDrilldown(fromStage, toStage, label) {
  const normalizedFromStage = cleanText(fromStage);
  const normalizedToStage = cleanText(toStage);
  const normalizedLabel = cleanText(label) || `${normalizedFromStage} -> ${normalizedToStage}`;
  if (!normalizedFromStage || !normalizedToStage) {
    return;
  }

  const matchedDeals = getForecastEligibleDeals(getScopedDeals()).filter((deal) =>
    doesDealMatchStageTransition(deal, normalizedFromStage, normalizedToStage)
  );
  if (matchedDeals.length === 0) {
    setBanner(`No accounts are available for the ${normalizedLabel} transition in the current review window.`, "warn");
    return;
  }

  const preset = createPipelinePreset("stage-duration", `Stage Duration: ${normalizedLabel}`, {
    fromStage: normalizedFromStage,
    toStage: normalizedToStage,
  });
  openPipelinePresetDrilldown(preset, matchedDeals, `Pipeline drilldown loaded for ${normalizedLabel}: ${matchedDeals.length} matching accounts.`);
}

function openMarketDrilldown(market, sourceLabel = "Market") {
  const normalizedMarket = cleanText(market);
  if (!normalizedMarket) {
    return;
  }

  const preset = createPipelinePreset("market", `${sourceLabel}: ${normalizedMarket}`, {
    market: normalizedMarket,
    applyMarketFilter: true,
  });
  const matchedDeals = getPipelinePresetDeals(preset, getScopedDeals());
  if (matchedDeals.length === 0) {
    setBanner(`No active deals are available for ${normalizedMarket} in the current time window.`, "warn");
    return;
  }

  const operatorCount = uniqueValues(matchedDeals.map((deal) => getPrimaryOperatorName(deal))).length;
  openPipelinePresetDrilldown(
    preset,
    matchedDeals,
    `${sourceLabel} loaded for ${normalizedMarket}: ${matchedDeals.length} matching deals across ${operatorCount} operators.`
  );
}

function openOperatorForecastDrilldown(operator, market) {
  const normalizedOperator = cleanText(operator);
  const normalizedMarket = cleanText(market);
  if (!normalizedOperator || !normalizedMarket) {
    return;
  }

  const preset = createPipelinePreset("operator", `Operator Forecast: ${normalizedOperator} · ${normalizedMarket}`, {
    market: normalizedMarket,
    operator: normalizedOperator,
    applyMarketFilter: true,
  });
  const matchedDeals = getPipelinePresetDeals(preset, getScopedDeals());
  if (matchedDeals.length === 0) {
    setBanner(`No active deals are available for ${normalizedOperator} in ${normalizedMarket}.`, "warn");
    return;
  }

  openPipelinePresetDrilldown(
    preset,
    matchedDeals,
    `Operator forecast loaded for ${normalizedOperator} in ${normalizedMarket}: ${matchedDeals.length} matching deals.`
  );
}

function openPipelinePresetDrilldown(preset, matchedDeals, successMessage) {
  resetPipelineOperationalFilters();
  ui.pipelinePreset = preset;
  if (preset.applyMarketFilter && preset.market) {
    ui.filters.market = preset.market;
  }
  ui.activeView = "pipeline";
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
  setBanner(successMessage, "success");
}

function resetPipelineSearchOnly() {
  ui.filters.search = "";
  ui.pipelineFinder.isOpen = false;
  ui.pipelineFinder.activeIndex = -1;
  ui.pipelineFinder.selectedDealId = null;
}

function resetPipelineOperationalFilters() {
  resetPipelineSearchOnly();
  ui.filters.stage = "All";
  ui.filters.market = "All";
  ui.filters.type = "All";
  ui.filters.traffic = "All";
}

function buildPipelinePreset(kpiKey, options = {}) {
  const market = cleanText(options.market);
  const labels = {
    "visible-accounts": "Visible Accounts",
    "weighted-forecast": "Weighted Forecast",
    "commit-forecast": "Commit Forecast",
    "active-accounts": "Active Accounts",
    "at-risk": "At Risk",
    "next-30-days": "Next 30 Days",
    "pipeline-coverage": "Pipeline Coverage",
    "commit-confidence": "Commit Confidence",
    "execution-load": "Execution Load",
    "commercial-hygiene": "Commercial Hygiene",
    "stage-cadence": "Stage Cadence",
    "campaign-growth": "Campaign Growth",
    "market-leadership": market ? `Market Leadership: ${market}` : "Market Leadership",
  };

  return createPipelinePreset("executive-kpi", labels[kpiKey] || "Executive KPI", {
    key: kpiKey,
    market,
    year: toNullableNumber(options.year),
    applyMarketFilter: kpiKey === "market-leadership" && Boolean(market),
  });
}

function createPipelinePreset(type, label, options = {}) {
  return {
    type: cleanText(type) || "executive-kpi",
    key: cleanText(options.key),
    label: cleanText(label) || "Dashboard Drilldown",
    market: cleanText(options.market),
    operator: cleanText(options.operator),
    fromStage: cleanText(options.fromStage),
    toStage: cleanText(options.toStage),
    year: toNullableNumber(options.year),
    applyMarketFilter: Boolean(options.applyMarketFilter),
  };
}

function getPipelinePresetDeals(preset, deals = getScopedDeals()) {
  if (!preset) {
    return deals;
  }

  if (preset.type === "market") {
    const activeDeals = getForecastEligibleDeals(deals);
    return activeDeals.filter((deal) => cleanText(deal.market) === cleanText(preset.market));
  }

  if (preset.type === "operator") {
    const activeDeals = getForecastEligibleDeals(deals);
    return activeDeals.filter(
      (deal) =>
        cleanText(deal.market) === cleanText(preset.market) &&
        normalizeSearchText(getPrimaryOperatorName(deal)) === normalizeSearchText(preset.operator)
    );
  }

  if (preset.type === "target-progress") {
    return getTargetProgressPipelineDeals(preset.key, preset.year || getActiveTargetYear(), deals);
  }

  if (preset.type === "stage-duration") {
    return getForecastEligibleDeals(deals).filter((deal) => doesDealMatchStageTransition(deal, preset.fromStage, preset.toStage));
  }

  return getExecutiveKpiDrilldownDeals(preset.key, deals, { market: preset.market });
}

function getExecutiveKpiDrilldownDeals(kpiKey, deals = getScopedDeals(), options = {}) {
  const activeDeals = getForecastEligibleDeals(deals);

  if (kpiKey === "visible-accounts") {
    return deals;
  }

  if (kpiKey === "weighted-forecast") {
    return activeDeals.filter((deal) => !isLiveAccountStage(deal.stage));
  }

  if (kpiKey === "commit-forecast") {
    return activeDeals.filter((deal) => !isLiveAccountStage(deal.stage) && getForecastProbability(deal) >= COMMIT_PROBABILITY);
  }

  if (kpiKey === "active-accounts") {
    return activeDeals.filter((deal) => isLiveAccountStage(deal.stage));
  }

  if (kpiKey === "at-risk") {
    return getRiskDeals(deals).map((item) => item.deal);
  }

  if (kpiKey === "next-30-days") {
    return deals.filter((deal) => {
      const timeline = getDealTimeParts(deal);
      if (!timeline.dateText) {
        return false;
      }
      const days = daysUntil(timeline.dateText);
      return days >= 0 && days <= 30;
    });
  }

  if (kpiKey === "pipeline-coverage") {
    return activeDeals;
  }

  if (kpiKey === "commit-confidence") {
    return activeDeals.filter((deal) => !isLiveAccountStage(deal.stage) && getForecastProbability(deal) >= COMMIT_PROBABILITY);
  }

  if (kpiKey === "execution-load") {
    return deals.filter((deal) => ["Legal", "DD", "Integration", "Legal Approval"].includes(deal.stage));
  }

  if (kpiKey === "commercial-hygiene") {
    return deals.filter((deal) => !isInactiveDeal(deal) && (daysSince(deal.lastFollowUp) > 30 || !cleanText(deal.actionItems)));
  }

  if (kpiKey === "stage-cadence") {
    return activeDeals.filter((deal) => getStageCadenceTransitions(deal).length > 0);
  }

  if (kpiKey === "campaign-growth") {
    return getCampaignLinkedDeals(activeDeals, getScopedCampaigns());
  }

  if (kpiKey === "market-leadership") {
    const market = cleanText(options.market);
    return market ? activeDeals.filter((deal) => deal.market === market) : activeDeals;
  }

  return deals;
}

function buildTargetProgressDrilldownLabel(drilldownKey, year) {
  const labels = {
    "new-signed": `New Signed ${year}`,
    integrations: `Integrations ${year}`,
    "dd-pipeline": `DD Pipeline ${year}`,
    "new-go-live": `New Go Live ${year}`,
    "total-go-live": `Total Go Live ${year}`,
    "tasks-completed": `Tasks Completed ${year}`,
    "campaigns-executed": `Campaigns Executed ${year}`,
    "avg-stage-duration": `Avg Stage Duration ${year}`,
    "stage-cadence": `Stage Cadence KPI ${year}`,
    "campaign-growth": `Campaign Growth ${year}`,
  };
  return labels[drilldownKey] || `Target Progress ${year}`;
}

function getTargetProgressPipelineDeals(drilldownKey, year, deals = getScopedDeals()) {
  const activeYear = Number(year || getActiveTargetYear());
  const annualDeals = deals.filter((deal) => !isInactiveDeal(deal) && resolveDealYear(deal) === activeYear);

  if (drilldownKey === "new-signed") {
    return annualDeals.filter((deal) => deal.signedFlag);
  }

  if (drilldownKey === "integrations") {
    return annualDeals.filter((deal) => deal.stage === "Integration" || deal.integrationStartedFlag);
  }

  if (drilldownKey === "dd-pipeline") {
    return annualDeals.filter((deal) => deal.stage === "DD");
  }

  if (drilldownKey === "new-go-live") {
    return deals.filter(
      (deal) => yearFromDate(deal.liveSince) === activeYear || (deal.goLiveFlag && deal.stage === "Go Live" && resolveDealYear(deal) === activeYear)
    );
  }

  if (drilldownKey === "total-go-live") {
    return annualDeals.filter((deal) => ["Go Live", "Live", "Handover"].includes(deal.stage));
  }

  if (drilldownKey === "avg-stage-duration" || drilldownKey === "stage-cadence") {
    return annualDeals.filter((deal) => getStageCadenceTransitions(deal).length > 0);
  }

  return annualDeals;
}

function getCampaignLinkedDeals(deals, campaigns) {
  const eligibleCampaigns = campaigns.filter(
    (campaign) =>
      campaign &&
      campaign.status !== "Cancelled" &&
      (Number(campaign.budgetEur || 0) > 0 || Number(campaign.forecastLiftEur || 0) > 0)
  );

  return deals.filter((deal) => eligibleCampaigns.some((campaign) => doesCampaignMatchDeal(campaign, deal)));
}

function doesCampaignMatchDeal(campaign, deal) {
  const campaignDealId = cleanText(campaign.dealId);
  if (campaignDealId && campaignDealId === cleanText(deal.id)) {
    return true;
  }

  const market = cleanText(campaign.market);
  if (market && market !== cleanText(deal.market)) {
    return false;
  }

  const campaignEntities = [campaign.operator, campaign.client, campaign.deal]
    .map((value) => normalizeSearchText(value))
    .filter(Boolean);
  const dealEntities = [deal.operator, deal.client, deal.deal]
    .map((value) => normalizeSearchText(value))
    .filter(Boolean);

  return campaignEntities.some((value) => dealEntities.includes(value));
}

function openDealEditorById(id) {
  const deal = state.deals.find((item) => item.id === id);
  if (!deal) {
    return;
  }

  ui.activeView = "pipeline";
  ui.editingDealId = id;
  fillDealForm(deal);
  renderViewState();
  window.scrollTo({ top: 0, behavior: "smooth" });
  setBanner(`Editing deal: ${deal.deal}.`, "default");
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
  if (action === "create-campaign-from-deal") {
    const sourceDeal = state.deals.find((item) => item.id === id);
    if (sourceDeal) {
      prefillCampaignFromDeal(sourceDeal);
    }
    return;
  }

  const deal = state.deals.find((item) => item.id === id);
  if (!deal) {
    return;
  }

  if (action === "edit-deal") {
    openDealEditorById(id);
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

async function handleMarketIntelAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const record = state.marketIntel.find((item) => item.id === id);
  if (!record) {
    return;
  }

  if (action === "edit-market-intel") {
    ui.activeView = "crm";
    ui.editingMarketIntelId = id;
    fillMarketIntelForm(record);
    renderViewState();
    setBanner(`Editing market intelligence: ${record.country}.`, "default");
  }

  if (action === "create-lead-from-intel") {
    prefillDealFromMarketIntel(record);
  }

  if (action === "delete-market-intel") {
    if (!window.confirm(`Delete market intelligence for "${record.country}"?`)) {
      return;
    }

    state.marketIntel = state.marketIntel.filter((item) => item.id !== id);
    const saved = await persistState();
    if (ui.editingMarketIntelId === id) {
      ui.editingMarketIntelId = null;
      resetMarketIntelForm();
    }
    renderAll();
    setBanner(buildExcelBanner(saved ? `Market intelligence deleted: ${record.country}.` : `Market intelligence deleted in memory only: ${record.country}.`), saved ? "warn" : "danger");
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

async function handleCampaignAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const campaign = state.campaigns.find((item) => item.id === id);
  if (!campaign) {
    return;
  }

  if (action === "edit-campaign") {
    ui.activeView = "campaigns";
    ui.editingCampaignId = id;
    fillCampaignForm(campaign);
    renderViewState();
    setBanner(`Editing campaign: ${campaign.title}.`, "default");
  }

  if (action === "delete-campaign") {
    if (!window.confirm(`Delete the campaign "${campaign.title}"?`)) {
      return;
    }

    state.campaigns = state.campaigns.filter((item) => item.id !== id);
    const saved = await persistState();
    if (ui.editingCampaignId === id) {
      ui.editingCampaignId = null;
      resetCampaignForm();
    }
    renderAll();
    setBanner(buildExcelBanner(saved ? `Campaign deleted: ${campaign.title}.` : `Campaign deleted in memory only: ${campaign.title}.`), saved ? "warn" : "danger");
  }
}

async function handleUserAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const user = state.users.find((item) => item.id === id);
  if (!user) {
    return;
  }

  if (action === "edit-user") {
    ui.activeView = "admin";
    ui.editingUserId = id;
    fillUserForm(user);
    renderViewState();
    setBanner(`Editing user: ${user.fullName}.`, "default");
  }

  if (action === "delete-user") {
    if (!window.confirm(`Delete the user "${user.fullName}"?`)) {
      return;
    }

    state.users = state.users.filter((item) => item.id !== id);
    if (ui.activeUserId === id) {
      ui.activeUserId = state.users[0]?.id || "";
      persistActiveUserSelection();
    }
    const saved = await persistState();
    if (ui.editingUserId === id) {
      ui.editingUserId = null;
      resetUserForm();
    }
    renderAll();
    setBanner(buildExcelBanner(saved ? `User deleted: ${user.fullName}.` : `User deleted in memory only: ${user.fullName}.`), saved ? "warn" : "danger");
  }
}

function handleModuleFlowAction(event) {
  const button = event.target.closest("[data-module-view]");
  if (!button) {
    return;
  }

  openWorkflowModule(button.dataset.moduleView);
}

function openWorkflowModule(view) {
  ui.activeView = view;
  renderViewState();
  window.scrollTo({ top: 0, behavior: "smooth" });
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

function prefillDealFromMarketIntel(record) {
  const targetOperators = splitStructuredValues(record.targetOperators);
  const operatorName = targetOperators[0] || "";
  const draft = normalizeDeal({
    ...createEmptyDeal(),
    market: record.country,
    operator: operatorName,
    client: operatorName,
    deal: operatorName || `${record.country} Market Opportunity`,
    source: "Market Intelligence",
    segment: "",
    licenseStatus: record.licenseType || record.regulatoryStatus,
    targetPriority: record.opportunityLevel,
    productsCurrent: record.currentProducts,
    productsPotential: record.missingProducts,
    currentCompetitors: record.competitorsPresent,
    strategicFit: record.strategicNotes,
    revenuePotentialEur: record.revenuePotentialEur,
    statusText: `Created from market intelligence: ${record.country}.`,
    comments: record.strategicNotes,
  });
  ui.activeView = "pipeline";
  ui.editingDealId = null;
  fillDealForm(draft);
  renderViewState();
  setBanner(`Lead draft prepared from market intelligence: ${record.country}.`, "default");
}

function prefillCampaignFromDeal(deal) {
  const draft = normalizeCampaign({
    ...createEmptyCampaign(),
    title: `${deal.operator || deal.client || deal.deal} ${suggestCampaignTypeForDeal(deal)}`,
    campaignType: suggestCampaignTypeForDeal(deal),
    status: "Planned",
    priority: deal.newTraffic ? "High" : "Medium",
    operator: deal.operator,
    client: deal.client,
    dealId: deal.id,
    deal: deal.deal,
    market: deal.market,
    owner: deal.kam,
    jiraTicket: deal.jira,
    landingUrl: deal.url,
    nextStep: `Align campaign concept with ${deal.operator || deal.client || deal.deal} launch plan.`,
    notes: deal.statusText || deal.comments,
  });
  ui.activeView = "campaigns";
  ui.editingCampaignId = null;
  fillCampaignForm(draft);
  renderViewState();
  setBanner(`Campaign draft prepared from ${deal.deal}.`, "default");
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
    "segment",
    "primaryContact",
    "decisionMaker",
    "licenseStatus",
    "productsCurrent",
    "productsPotential",
    "currentCompetitors",
    "targetPriority",
    "strategicFit",
    "platform",
    "stage",
    "signingEta",
    "signingYear",
    "signingMonth",
    "dealValue",
    "dealValueAlt",
    "revenuePotentialEur",
    "revenuePotentialScore",
    "strategicFitScore",
    "closeProbabilityScore",
    "licenseScore",
    "legalComplexityScore",
    "technicalComplexityScore",
    "commercialUrgencyScore",
    "opportunityScore",
    "priorityClass",
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
  syncDealScoringPreview();
}

function resetDealForm() {
  const draft = createEmptyDeal();
  dealForm.reset();
  fillDealForm(draft);
  ui.editingDealId = null;
  elements.dealFormTitle.textContent = "New Deal";
  elements.dealSubmitButton.textContent = "Save Deal";
  syncDealScoringPreview();
}

function fillMarketIntelForm(record) {
  [
    "country",
    "regulatoryStatus",
    "licenseType",
    "activeOperators",
    "targetOperators",
    "competitorsPresent",
    "currentProducts",
    "missingProducts",
    "revenuePotentialEur",
    "regulatoryRisk",
    "opportunityLevel",
    "strategicNotes",
  ].forEach((field) => {
    marketIntelForm.elements[field].value = record[field] ?? "";
  });

  elements.marketIntelFormTitle.textContent = `Edit Market Intelligence: ${record.country}`;
  elements.marketIntelSubmitButton.textContent = "Update Market Intelligence";
}

function resetMarketIntelForm() {
  const draft = createEmptyMarketIntel();
  marketIntelForm.reset();
  fillMarketIntelForm(draft);
  ui.editingMarketIntelId = null;
  elements.marketIntelFormTitle.textContent = "New Market Intelligence Record";
  elements.marketIntelSubmitButton.textContent = "Save Market Intelligence";
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
  const ownerOptions = uniqueValues(["", ...state.users.map((user) => user.fullName), ...state.deals.map((deal) => getDealOwner(deal)), task.owner]);
  setSelectOptions(taskForm.elements.owner, ownerOptions, task.owner || "");

  [
    "taskNumber",
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

function fillWorkspaceForm(workspace) {
  ["workspaceName", "organizationName", "adminName", "adminEmail", "subscriptionPlan", "crmModel", "fiscalYear", "defaultCurrency"].forEach((field) => {
    workspaceForm.elements[field].value = workspace[field] ?? "";
  });

  elements.workspaceFormTitle.textContent = "Workspace Settings";
  elements.workspaceSubmitButton.textContent = "Save Workspace";
}

function resetWorkspaceForm() {
  const draft = normalizeWorkspace(state.workspace && Object.keys(state.workspace).length ? state.workspace : createDefaultWorkspace());
  workspaceForm?.reset();
  fillWorkspaceForm(draft);
}

function fillUserForm(user) {
  ["fullName", "email", "role", "status", "team", "marketFocus"].forEach((field) => {
    userForm.elements[field].value = user[field] ?? "";
  });

  elements.userSubmitButton.textContent = user.fullName ? "Update User" : "Save User";
}

function resetUserForm() {
  const draft = createEmptyUser();
  userForm?.reset();
  fillUserForm(draft);
  ui.editingUserId = null;
  elements.userSubmitButton.textContent = "Save User";
}

function fillCampaignForm(campaign) {
  [
    "title",
    "campaignType",
    "status",
    "priority",
    "operator",
    "client",
    "dealId",
    "deal",
    "market",
    "owner",
    "channel",
    "startDate",
    "endDate",
    "budgetEur",
    "prizeValueEur",
    "forecastLiftEur",
    "targetPlayers",
    "targetWager",
    "targetGgr",
    "jiraTicket",
    "landingUrl",
    "mechanic",
    "offerDetails",
    "successMetric",
    "nextStep",
    "notes",
  ].forEach((field) => {
    campaignForm.elements[field].value = campaign[field] ?? "";
  });

  campaignForm.elements.traceEntry.value = "";
  campaignForm.elements.traceLog.value = campaign.traceLog || "";
  elements.campaignFormTitle.textContent = campaign.title ? `Edit Campaign: ${campaign.title}` : "New Campaign";
  elements.campaignSubmitButton.textContent = campaign.title ? "Update Campaign" : "Save Campaign";
}

function resetCampaignForm() {
  const draft = createEmptyCampaign();
  campaignForm.reset();
  fillCampaignForm(draft);
  ui.editingCampaignId = null;
  elements.campaignFormTitle.textContent = "New Campaign";
  elements.campaignSubmitButton.textContent = "Save Campaign";
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

function getScopedCampaigns() {
  return state.campaigns.filter((campaign) => {
    const parts = getCampaignTimeParts(campaign);

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

function getTaskTimeParts(task) {
  const explicitYear = toNullableNumber(task.targetYear);
  const dateText = cleanText(task.dueDate || task.updatedAt || task.createdAt);
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
  const month = dateMonth;
  return {
    year,
    month,
    quarter: month ? `Q${Math.ceil(month / 3)}` : null,
    monthLabel: month ? MONTH_LABELS[month - 1] : null,
    dateText,
  };
}

function getScopedTasks() {
  return state.tasks.filter((task) => {
    const parts = getTaskTimeParts(task);

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

function getTasksForYear(year) {
  return state.tasks.filter((task) => String(getTaskTimeParts(task).year || "") === String(year));
}

function createTaskPreset(key, label, options = {}) {
  return {
    key: cleanText(key),
    label: cleanText(label) || "Task List",
    year: toNullableNumber(options.year),
  };
}

function getTaskPresetItems(preset, tasks = getScopedTasks()) {
  if (!preset) {
    return tasks;
  }

  if (preset.key === "tasks-completed") {
    return tasks.filter((task) => task.status === "Done");
  }

  return tasks;
}

function getVisibleTasks(tasks = getScopedTasks()) {
  return getTaskPresetItems(ui.taskPreset, tasks);
}

function createCampaignPreset(key, label, options = {}) {
  return {
    key: cleanText(key),
    label: cleanText(label) || "Campaign List",
    year: toNullableNumber(options.year),
  };
}

function getCampaignPresetItems(preset, campaigns = getScopedCampaigns()) {
  if (!preset) {
    return campaigns;
  }

  if (preset.key === "campaigns-executed") {
    return campaigns.filter((campaign) => ["Ready", "Live", "Completed"].includes(campaign.status));
  }

  if (preset.key === "campaign-growth") {
    return campaigns.filter(
      (campaign) =>
        campaign.status !== "Cancelled" &&
        (Number(campaign.budgetEur || 0) > 0 || Number(campaign.forecastLiftEur || 0) > 0)
    );
  }

  return campaigns;
}

function getVisibleCampaigns(campaigns = getScopedCampaigns()) {
  return getCampaignPresetItems(ui.campaignPreset, campaigns);
}

function getFilteredDeals(baseDeals = getPipelineBaseDeals()) {
  const search = normalizeSearchText(ui.filters.search);

  return [...baseDeals]
    .filter((deal) => {
      if (ui.pipelineFinder.selectedDealId && deal.id !== ui.pipelineFinder.selectedDealId) {
        return false;
      }

      if (!search) {
        return true;
      }

      const haystack = normalizeSearchText(
        `${deal.deal} ${deal.client} ${deal.operator} ${deal.casinoName} ${deal.groupName} ${deal.kam} ${deal.market} ${deal.platform} ${deal.legalEntity} ${deal.segment} ${deal.primaryContact} ${deal.decisionMaker} ${deal.licenseStatus} ${deal.currentCompetitors} ${deal.productsCurrent} ${deal.productsPotential} ${deal.targetPriority} ${deal.priorityClass} ${deal.statusText} ${deal.comments} ${deal.jira} ${deal.ddTicket} ${deal.url} ${deal.brands} ${deal.entityInfo} ${deal.skype} ${deal.integrationEmail} ${deal.siteStatus} ${deal.actionItems} ${deal.updates} ${deal.dd} ${deal.integration}`
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

function getPipelineBaseDeals(options = {}) {
  const ignorePreset = Boolean(options.ignorePreset);
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

    if (!ignorePreset && ui.pipelinePreset && !getPipelinePresetDeals(ui.pipelinePreset, [deal]).length) {
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

      if (hasStaleFollowUp(deal)) {
        if (deal.stage === "DD") {
          reasons.push(`DD has gone ${followUpGap} days without follow-up.`);
        } else if (isLiveAccountStage(deal.stage)) {
          reasons.push(`Active client in ${deal.stage} has gone ${followUpGap} days without follow-up.`);
        } else {
          reasons.push(`${deal.stage || "Account"} has gone ${followUpGap} days without follow-up.`);
        }
        severity += isLiveAccountStage(deal.stage) ? 3 : 2;
        if (isLiveAccountStage(deal.stage)) {
          tone = "is-danger";
        }
      }

      if (!deal.signedFlag && etaGap >= 0 && etaGap <= 14) {
        reasons.push(`Signing ETA falls within the next ${etaGap} days.`);
        severity += 1;
      }

      if (isInactiveDeal(deal)) {
        reasons.push("The account is currently marked as inactive or canceled.");
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

function isInactiveDealStatus(value) {
  const normalized = cleanText(value).toLowerCase();
  return INACTIVE_DEAL_STATUSES.includes(normalized);
}

function isInactiveDeal(deal) {
  return isInactiveDealStatus(deal?.status);
}

function isLiveAccountStage(stage) {
  return ["Live", "Handover"].includes(cleanText(stage));
}

function hasStaleFollowUp(deal, thresholdDays = 30) {
  return !isInactiveDeal(deal) && Boolean(cleanText(deal?.lastFollowUp)) && daysSince(deal.lastFollowUp) > thresholdDays;
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

function getCampaignTimeParts(campaign) {
  const dateText = cleanText(campaign.startDate || campaign.endDate || campaign.updatedAt || campaign.createdAt);
  let year = null;
  let month = null;

  if (dateText) {
    const date = new Date(`${dateText}T00:00:00`);
    if (!Number.isNaN(date.getTime())) {
      year = date.getFullYear();
      month = date.getMonth() + 1;
    }
  }

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
  return [deal.status, deal.agreement, deal.ddStatus, deal.integrationStatus, deal.goLiveStatus].filter(Boolean).slice(0, 3).join(" / ");
}

function getDealHealth(deal) {
  if (isBlockedDeal(deal) || isInactiveDeal(deal)) {
    return { label: "Attention", pillClass: "blocked", cardClass: "health-attention" };
  }
  if (deal.stage === "Handover") {
    return { label: "Handover", pillClass: "success", cardClass: "health-live" };
  }
  if (deal.stage === "Live") {
    return { label: "Live", pillClass: "success", cardClass: "health-live" };
  }
  if (deal.stage === "Go Live") {
    return { label: "Go Live", pillClass: "success", cardClass: "health-live" };
  }
  if (deal.signedFlag || deal.agreement === "Signed" || ["Legal", "Legal Approval"].includes(deal.stage)) {
    return { label: "Execution", pillClass: "info", cardClass: "health-signed" };
  }
  return { label: "Open", pillClass: "neutral", cardClass: "health-open" };
}

function getStageCadenceTransitions(deal) {
  const milestones = STAGE_CADENCE_MILESTONES.map(([stage, field]) => ({
    stage,
    date: cleanText(deal[field]),
  })).filter((item) => item.date);

  if (milestones.length < 2) {
    return [];
  }

  const transitions = [];
  for (let index = 1; index < milestones.length; index += 1) {
    const previous = milestones[index - 1];
    const current = milestones[index];
    const days = differenceInDays(previous.date, current.date);
    if (days === null || days < 0) {
      continue;
    }
    transitions.push({
      from: previous.stage,
      to: current.stage,
      label: `${previous.stage} -> ${current.stage}`,
      days,
    });
  }

  return transitions;
}

function getStageCadenceSummary(deals) {
  const activeDeals = getForecastEligibleDeals(deals);
  const transitions = [];
  const breakdown = new Map();
  let dealCount = 0;

  activeDeals.forEach((deal) => {
    const dealTransitions = getStageCadenceTransitions(deal);
    if (dealTransitions.length === 0) {
      return;
    }

    dealCount += 1;
    dealTransitions.forEach((transition) => {
      transitions.push(transition);
      const entry = breakdown.get(transition.label) || {
        label: transition.label,
        totalDays: 0,
        count: 0,
      };
      entry.totalDays += transition.days;
      entry.count += 1;
      breakdown.set(transition.label, entry);
    });
  });

  if (transitions.length === 0) {
    return {
      averageDays: null,
      benchmarkDays: STAGE_CADENCE_BENCHMARK_DAYS,
      onBenchmarkRatio: 0,
      transitionCount: 0,
      dealCount,
      stageBreakdown: [],
    };
  }

  const totalDays = sumValues(transitions.map((transition) => transition.days));
  const onBenchmarkCount = transitions.filter((transition) => transition.days <= STAGE_CADENCE_BENCHMARK_DAYS).length;

  return {
    averageDays: totalDays / transitions.length,
    benchmarkDays: STAGE_CADENCE_BENCHMARK_DAYS,
    onBenchmarkRatio: onBenchmarkCount / transitions.length,
    transitionCount: transitions.length,
    dealCount,
    stageBreakdown: Array.from(breakdown.values())
      .map((entry) => ({
        label: entry.label,
        averageDays: entry.totalDays / entry.count,
        count: entry.count,
      }))
      .sort((left, right) => left.averageDays - right.averageDays || right.count - left.count),
  };
}

function buildStageDurationRows(deals) {
  return getStageCadenceSummary(deals).stageBreakdown.map((entry) => {
    const [fromStage, toStage] = String(entry.label)
      .split("->")
      .map((value) => cleanText(value));
    return {
      ...entry,
      fromStage,
      toStage,
    };
  });
}

function doesDealMatchStageTransition(deal, fromStage, toStage) {
  const normalizedFromStage = cleanText(fromStage);
  const normalizedToStage = cleanText(toStage);
  if (!normalizedFromStage || !normalizedToStage) {
    return false;
  }

  return getStageCadenceTransitions(deal).some(
    (transition) => transition.from === normalizedFromStage && transition.to === normalizedToStage
  );
}

function getStageDurationMap(deals) {
  const stageMap = new Map();
  buildStageDurationRows(deals).forEach((entry) => {
    if (entry.fromStage && !stageMap.has(entry.fromStage)) {
      stageMap.set(entry.fromStage, entry);
    }
  });
  return stageMap;
}

function calculateCampaignGrowthRatio(campaign) {
  const budget = Number(campaign?.budgetEur || 0);
  const lift = Number(campaign?.forecastLiftEur || 0);
  if (budget <= 0 || lift <= 0) {
    return 0;
  }
  return lift / budget;
}

function getCampaignGrowthSummary(campaigns) {
  const eligibleCampaigns = campaigns.filter(
    (campaign) =>
      campaign &&
      campaign.status !== "Cancelled" &&
      (Number(campaign.budgetEur || 0) > 0 || Number(campaign.forecastLiftEur || 0) > 0)
  );

  const totalBudget = sumValues(eligibleCampaigns.map((campaign) => campaign.budgetEur));
  const totalForecastLift = sumValues(eligibleCampaigns.map((campaign) => campaign.forecastLiftEur));
  const growthRatios = eligibleCampaigns.map((campaign) => calculateCampaignGrowthRatio(campaign)).filter((value) => value > 0);

  return {
    count: eligibleCampaigns.length,
    liveCount: eligibleCampaigns.filter((campaign) => ["Ready", "Live", "Completed"].includes(campaign.status)).length,
    totalBudget,
    totalForecastLift,
    blendedGrowthRatio: totalBudget > 0 ? totalForecastLift / totalBudget : 0,
    averageGrowthRatio: growthRatios.length > 0 ? sumValues(growthRatios) / growthRatios.length : 0,
    benchmarkRatio: CAMPAIGN_GROWTH_BENCHMARK_RATIO,
  };
}

function getTaskCompletionSummary(tasks) {
  const scopedTasks = Array.isArray(tasks) ? tasks : [];
  const completedCount = scopedTasks.filter((task) => task.status === "Done").length;
  const totalCount = scopedTasks.length;
  return {
    completedCount,
    totalCount,
    openCount: scopedTasks.filter((task) => task.status !== "Done").length,
    completionRatio: totalCount > 0 ? completedCount / totalCount : 0,
  };
}

function getCampaignExecutionSummary(campaigns) {
  const scopedCampaigns = Array.isArray(campaigns) ? campaigns : [];
  const executedCount = scopedCampaigns.filter((campaign) => ["Ready", "Live", "Completed"].includes(campaign.status)).length;
  return {
    totalCount: scopedCampaigns.length,
    executedCount,
    executedRatio: scopedCampaigns.length > 0 ? executedCount / scopedCampaigns.length : 0,
  };
}

function getCampaignsForYear(year) {
  return state.campaigns.filter((campaign) => String(getCampaignTimeParts(campaign).year || "") === String(year));
}

function buildForecastSnapshot(deals) {
  const activeDeals = getForecastEligibleDeals(deals);
  const liveDeals = activeDeals.filter((deal) => isLiveAccountStage(deal.stage));
  const pipelineDeals = activeDeals.filter((deal) => !isLiveAccountStage(deal.stage));
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
      operatorSet: new Set(),
    };
    const probability = getForecastProbability(deal);
    const dealValue = getDealValueAmount(deal);
    entry.totalCount += 1;
    entry.dealValueTotal += dealValue;
    entry.operatorSet.add(getPrimaryOperatorName(deal));
    if (isLiveAccountStage(deal.stage)) {
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
        operatorCount: entry.operatorSet.size,
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
    if (!isLiveAccountStage(deal.stage)) {
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
  const staleCount = deals.filter((deal) => hasStaleFollowUp(deal)).length;
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
  const explicitScore = toNullableNumber(deal.closeProbabilityScore);
  let probability = explicitScore !== null ? clampNumber(explicitScore / 100, 0, 1) : STAGE_FORECAST_WEIGHTS[deal.stage] ?? 0.15;
  const status = cleanText(deal.status).toLowerCase();
  const agreement = cleanText(deal.agreement).toLowerCase();
  const ddStatus = cleanText(deal.ddStatus).toLowerCase();
  const integrationStatus = cleanText(deal.integrationStatus).toLowerCase();
  const goLiveStatus = cleanText(deal.goLiveStatus).toLowerCase();
  const followUpGap = daysSince(deal.lastFollowUp);

  if (status === "offer") {
    probability = Math.max(probability, 0.32);
  }
  if (["legal", "signed"].includes(status)) {
    probability = Math.max(probability, 0.68);
  }
  if (deal.signedFlag || agreement === "signed") {
    probability = Math.max(probability, 0.78);
  }
  if (deal.ddCompletedFlag || ddStatus === "completed") {
    probability = Math.max(probability, 0.86);
  }
  if (deal.integrationStartedFlag || ["started", "in progress", "completed"].includes(integrationStatus)) {
    probability = Math.max(probability, deal.stage === "Integration" ? 0.91 : 0.84);
  }
  if (deal.goLiveFlag || ["legal sign-off", "completed", "live"].includes(goLiveStatus)) {
    probability = Math.max(probability, isLiveAccountStage(deal.stage) ? 1 : 0.97);
  }
  if (isBlockedDeal(deal)) {
    probability -= 0.32;
  }
  if (isInactiveDealStatus(deal.status)) {
    probability = Math.min(probability, 0.08);
  }
  if (followUpGap > 45) {
    probability -= 0.12;
  } else if (followUpGap > 30) {
    probability -= 0.06;
  }
  if (isInactiveDeal(deal)) {
    probability = 0;
  }

  return clampNumber(probability, 0, 1);
}

function hasAnyDealValue(deals) {
  return deals.some((deal) => Number(deal.dealValue || 0) > 0);
}

function getForecastEligibleDeals(deals) {
  return deals.filter((deal) => !isInactiveDeal(deal));
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

function buildCrmOwnerRows(deals) {
  const groups = new Map();

  deals.forEach((deal) => {
    const owner = getDealOwner(deal) || "Unassigned";
    const user = state.users.find((item) => item.fullName === owner);
    const entry = groups.get(owner) || {
      owner,
      teamline: user ? `${user.team || "Commercial"} · ${user.marketFocus || "LATAM"}` : deal.market || "No market focus",
      roleHint: user?.role || "Deal owner",
      accountCount: 0,
      forecastValue: 0,
      liveAccounts: 0,
      openTasks: 0,
      note: "",
    };
    entry.accountCount += 1;
    entry.forecastValue += getForecastValue(deal);
    if (isLiveAccountStage(deal.stage)) {
      entry.liveAccounts += 1;
    }
    groups.set(owner, entry);
  });

  state.tasks.forEach((task) => {
    const owner = cleanText(task.owner) || "Unassigned";
    const entry = groups.get(owner) || {
      owner,
      teamline: "Task owner",
      roleHint: "Execution",
      accountCount: 0,
      forecastValue: 0,
      liveAccounts: 0,
      openTasks: 0,
      note: "",
    };
    if (task.status !== "Done") {
      entry.openTasks += 1;
    }
    groups.set(owner, entry);
  });

  return Array.from(groups.values())
    .map((entry) => ({
      ...entry,
      note:
        entry.openTasks > 0
          ? `${entry.openTasks} open tasks currently require follow-up discipline.`
          : `${entry.accountCount} accounts currently mapped with no open task backlog.`,
    }))
    .sort((left, right) => right.forecastValue - left.forecastValue || right.accountCount - left.accountCount || left.owner.localeCompare(right.owner));
}

function handleDealScoringInput() {
  syncDealScoringPreview();
}

function syncDealScoringPreview() {
  if (!dealForm) {
    return;
  }

  const scoring = computeOpportunityScoring({
    dealValue: dealForm.elements.dealValue?.value,
    dealValueAlt: dealForm.elements.dealValueAlt?.value,
    revenuePotentialEur: dealForm.elements.revenuePotentialEur?.value,
    revenuePotentialScore: dealForm.elements.revenuePotentialScore?.value,
    strategicFitScore: dealForm.elements.strategicFitScore?.value,
    closeProbabilityScore: dealForm.elements.closeProbabilityScore?.value,
    licenseScore: dealForm.elements.licenseScore?.value,
    legalComplexityScore: dealForm.elements.legalComplexityScore?.value,
    technicalComplexityScore: dealForm.elements.technicalComplexityScore?.value,
    commercialUrgencyScore: dealForm.elements.commercialUrgencyScore?.value,
    targetPriority: dealForm.elements.targetPriority?.value,
    licenseStatus: dealForm.elements.licenseStatus?.value,
    stage: dealForm.elements.stage?.value,
  });

  if (dealForm.elements.opportunityScore) {
    dealForm.elements.opportunityScore.value = scoring.opportunityScore;
  }
  if (dealForm.elements.priorityClass) {
    dealForm.elements.priorityClass.value = scoring.priorityClass;
  }
}

function computeOpportunityScoring(input = {}) {
  const revenuePotentialEur = getRevenuePotentialAmount(input);
  const revenuePotentialScore = normalizeScoreEntry(input.revenuePotentialScore, inferRevenuePotentialScore(revenuePotentialEur));
  const strategicFitScore = normalizeScoreEntry(input.strategicFitScore, inferPriorityFitScore(input.targetPriority));
  const closeProbabilityScore = normalizeScoreEntry(input.closeProbabilityScore, inferStageCloseProbabilityScore(input.stage));
  const licenseScore = normalizeScoreEntry(input.licenseScore, inferLicenseScore(input.licenseStatus));
  const legalComplexityScore = normalizeScoreEntry(input.legalComplexityScore, 50);
  const technicalComplexityScore = normalizeScoreEntry(input.technicalComplexityScore, 50);
  const commercialUrgencyScore = normalizeScoreEntry(input.commercialUrgencyScore, 50);
  const weightedScore =
    revenuePotentialScore * OPPORTUNITY_SCORE_WEIGHTS.revenuePotentialScore +
    strategicFitScore * OPPORTUNITY_SCORE_WEIGHTS.strategicFitScore +
    closeProbabilityScore * OPPORTUNITY_SCORE_WEIGHTS.closeProbabilityScore +
    licenseScore * OPPORTUNITY_SCORE_WEIGHTS.licenseScore +
    (100 - legalComplexityScore) * OPPORTUNITY_SCORE_WEIGHTS.legalComplexityScore +
    (100 - technicalComplexityScore) * OPPORTUNITY_SCORE_WEIGHTS.technicalComplexityScore +
    commercialUrgencyScore * OPPORTUNITY_SCORE_WEIGHTS.commercialUrgencyScore;
  const opportunityScore = Math.round(clampNumber(weightedScore, 0, 100));
  return {
    revenuePotentialEur,
    revenuePotentialScore,
    strategicFitScore,
    closeProbabilityScore,
    licenseScore,
    legalComplexityScore,
    technicalComplexityScore,
    commercialUrgencyScore,
    opportunityScore,
    priorityClass: classifyOpportunityPriority(opportunityScore),
  };
}

function normalizeScoreEntry(value, fallback = 0) {
  const parsed = toNullableNumber(value);
  if (parsed === null) {
    return Math.round(clampNumber(fallback, 0, 100));
  }
  return Math.round(clampNumber(parsed, 0, 100));
}

function inferRevenuePotentialScore(value) {
  const amount = Number(value || 0);
  if (amount >= 500000) {
    return 100;
  }
  if (amount >= 250000) {
    return 92;
  }
  if (amount >= 100000) {
    return 80;
  }
  if (amount >= 50000) {
    return 68;
  }
  if (amount >= 25000) {
    return 55;
  }
  if (amount > 0) {
    return 40;
  }
  return 0;
}

function inferPriorityFitScore(priority) {
  const value = cleanText(priority).toLowerCase();
  if (value === "high priority") {
    return 90;
  }
  if (value === "medium") {
    return 68;
  }
  if (value === "low") {
    return 42;
  }
  if (value === "observation") {
    return 24;
  }
  return 50;
}

function inferStageCloseProbabilityScore(stage) {
  const probability = STAGE_FORECAST_WEIGHTS[cleanText(stage)] ?? 0.18;
  return Math.round(clampNumber(probability * 100, 0, 100));
}

function inferLicenseScore(status) {
  const value = cleanText(status).toLowerCase();
  if (!value) {
    return 50;
  }
  if (["approved", "valid", "licensed", "active"].some((token) => value.includes(token))) {
    return 88;
  }
  if (["pending", "review", "in process"].some((token) => value.includes(token))) {
    return 62;
  }
  if (["restricted", "temporary"].some((token) => value.includes(token))) {
    return 38;
  }
  if (["blocked", "expired", "rejected"].some((token) => value.includes(token))) {
    return 14;
  }
  return 50;
}

function classifyOpportunityPriority(score) {
  const value = Number(score || 0);
  if (value >= 80) {
    return "High Priority";
  }
  if (value >= 60) {
    return "Medium";
  }
  if (value >= 40) {
    return "Low";
  }
  return "Observation";
}

function buildMarketIntelRows() {
  return [...state.marketIntel]
    .map((item) => {
      const targetOperatorList = splitStructuredValues(item.targetOperators);
      const missingProductList = splitStructuredValues(item.missingProducts);
      return {
        ...item,
        targetOperatorList,
        targetOperatorCount: targetOperatorList.length,
        whitespaceCount: Math.max(missingProductList.length, targetOperatorList.length),
      };
    })
    .sort((left, right) => Number(right.revenuePotentialEur || 0) - Number(left.revenuePotentialEur || 0) || left.country.localeCompare(right.country));
}

function buildOpportunityScoreRows(deals) {
  return [...deals]
    .filter((deal) => !isInactiveDeal(deal))
    .map((deal) => ({
      id: deal.id,
      operator: getPrimaryOperatorName(deal),
      marketLine: [deal.market, deal.segment || deal.type || "Account"].filter(Boolean).join(" · "),
      market: deal.market,
      stage: deal.stage,
      owner: getDealOwner(deal),
      forecastValue: getForecastValue(deal),
      revenuePotentialEur: getRevenuePotentialAmount(deal),
      opportunityScore: Number(deal.opportunityScore || 0),
      priorityClass: cleanText(deal.priorityClass || deal.targetPriority) || classifyOpportunityPriority(deal.opportunityScore),
      scoreNarrative: buildScoreNarrative(deal),
    }))
    .sort((left, right) => right.opportunityScore - left.opportunityScore || right.revenuePotentialEur - left.revenuePotentialEur || left.operator.localeCompare(right.operator));
}

function buildScoreNarrative(deal) {
  const parts = [
    `${formatScoreValue(deal.revenuePotentialScore)} revenue`,
    `${formatScoreValue(deal.strategicFitScore)} fit`,
    `${formatScoreValue(deal.closeProbabilityScore)} close`,
    `${formatScoreValue(deal.licenseScore)} license`,
  ];
  return `${deal.priorityClass || classifyOpportunityPriority(deal.opportunityScore)} profile with ${parts.join(" · ")}.`;
}

function renderPriorityBadge(value) {
  const label = cleanText(value) || "Observation";
  const normalized = normalizeSearchText(label);
  const className = normalized.includes("high")
    ? "success"
    : normalized.includes("medium")
      ? "info"
      : normalized.includes("low")
        ? "neutral"
        : "blocked";
  return `<span class="pill ${className}">${escapeHtml(label)}</span>`;
}

function renderScoreBadge(score, priorityClass) {
  const label = cleanText(priorityClass) || classifyOpportunityPriority(score);
  return `<span class="score-badge ${scoreBadgeClass(label)}"><strong>${escapeHtml(formatScoreValue(score))}</strong> ${escapeHtml(label)}</span>`;
}

function scoreBadgeClass(priorityClass) {
  const value = cleanText(priorityClass).toLowerCase();
  if (value === "high priority") {
    return "is-high";
  }
  if (value === "medium") {
    return "is-medium";
  }
  if (value === "low") {
    return "is-low";
  }
  return "is-watchlist";
}

function formatScoreValue(value) {
  const numeric = Math.round(Number(value || 0));
  return `${numeric}`;
}

function getRevenuePotentialAmount(deal) {
  return Number(deal?.revenuePotentialEur || deal?.dealValue || deal?.dealValueAlt || 0);
}

function splitStructuredValues(value) {
  return String(value ?? "")
    .split(/\n|,|\|/)
    .map((item) => cleanText(item))
    .filter(Boolean);
}

function countOpenTasksForDeal(deal) {
  return state.tasks.filter((task) => {
    if (task.status === "Done") {
      return false;
    }
    if (task.dealId && task.dealId === deal.id) {
      return true;
    }
    return (
      cleanText(task.deal) === cleanText(deal.deal) ||
      (cleanText(task.operator) && cleanText(task.operator) === cleanText(getPrimaryOperatorName(deal))) ||
      (cleanText(task.client) && cleanText(task.client) === cleanText(deal.client))
    );
  }).length;
}

function countLiveCampaignsForDeal(deal) {
  return state.campaigns.filter((campaign) => {
    if (!["Ready", "Live"].includes(campaign.status)) {
      return false;
    }
    if (campaign.dealId && campaign.dealId === deal.id) {
      return true;
    }
    return cleanText(campaign.operator) === cleanText(getPrimaryOperatorName(deal)) || cleanText(campaign.client) === cleanText(deal.client);
  }).length;
}

function synchronizeTaskSequence() {
  state.workspace = normalizeWorkspace(state.workspace);
  let maxSequence = Number(state.workspace.taskSequence || 0);

  state.tasks = state.tasks.map((task) => normalizeTask(task));
  state.tasks.forEach((task) => {
    const sequence = extractTaskSequence(task.taskNumber);
    if (sequence > maxSequence) {
      maxSequence = sequence;
    }
  });

  state.tasks
    .filter((task) => !cleanText(task.taskNumber))
    .sort((left, right) => (cleanText(left.createdAt) || "9999-12-31").localeCompare(cleanText(right.createdAt) || "9999-12-31") || left.title.localeCompare(right.title))
    .forEach((task) => {
      maxSequence += 1;
      task.taskNumber = buildTaskNumber(maxSequence, task);
    });

  state.workspace.taskSequence = maxSequence;
}

function buildTaskNumber(sequence, task) {
  const year = toNullableNumber(task.targetYear) || toNullableNumber(state.workspace.fiscalYear) || new Date().getFullYear();
  return `TSK-${year}-${String(sequence).padStart(4, "0")}`;
}

function extractTaskSequence(value) {
  const match = cleanText(value).match(/-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function ensureActiveUser() {
  if (!Array.isArray(state.users) || state.users.length === 0) {
    state.users = createDefaultUsers();
  }

  const storedId = getStoredActiveUserId();
  const preferredId = ui.activeUserId || storedId;
  const activeUser = state.users.find((user) => user.id === preferredId) || state.users[0];
  ui.activeUserId = activeUser ? activeUser.id : "";
  persistActiveUserSelection();
}

function getActiveUser() {
  return state.users.find((user) => user.id === ui.activeUserId) || state.users[0] || null;
}

function getStoredActiveUserId() {
  try {
    return window.localStorage.getItem("salesrep-active-user") || "";
  } catch {
    return "";
  }
}

function persistActiveUserSelection() {
  try {
    window.localStorage.setItem("salesrep-active-user", ui.activeUserId || "");
  } catch {
    // Ignore storage limitations in file:// previews.
  }
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
  if (!deal || isLiveAccountStage(deal.stage) || isInactiveDeal(deal)) {
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

  return !isInactiveDealStatus(input.status);
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
  return deals.filter((deal) => !isInactiveDeal(deal) && (deal.leadFlag || ["Lead", "Qualified"].includes(deal.stage)));
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
    buildStageStatusItem("Commercial Agreement", deal.agreement, deal.legalStatus),
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

function compareCampaigns(left, right) {
  const statusRank = CAMPAIGN_STATUS_OPTIONS.indexOf(left.status) - CAMPAIGN_STATUS_OPTIONS.indexOf(right.status);
  if (statusRank !== 0) {
    return statusRank;
  }

  const priorityRank = CAMPAIGN_PRIORITY_OPTIONS.indexOf(left.priority) - CAMPAIGN_PRIORITY_OPTIONS.indexOf(right.priority);
  if (priorityRank !== 0) {
    return priorityRank;
  }

  const leftStart = left.startDate || "9999-12-31";
  const rightStart = right.startDate || "9999-12-31";
  if (leftStart !== rightStart) {
    return leftStart.localeCompare(rightStart);
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

function campaignStatusClass(status) {
  const slug = toSlugKey(status);
  return slug ? `campaign-${slug}` : "campaign-planned";
}

function campaignStatusPillClass(status) {
  if (status === "Live" || status === "Completed") {
    return "success";
  }
  if (status === "Paused" || status === "Cancelled") {
    return "blocked";
  }
  if (status === "Ready") {
    return "info";
  }
  return "neutral";
}

function buildCampaignAudienceLine(campaign) {
  const values = [campaign.operator, campaign.client, campaign.deal, campaign.market]
    .map((value) => cleanText(value))
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
  return values.join(" · ") || "Operator campaign";
}

function buildCampaignWindow(campaign) {
  const start = formatDate(campaign.startDate);
  const end = formatDate(campaign.endDate);
  if (campaign.startDate && campaign.endDate) {
    return `${start} - ${end}`;
  }
  if (campaign.startDate) {
    return `Starts ${start}`;
  }
  if (campaign.endDate) {
    return `Ends ${end}`;
  }
  return "Timing not defined";
}

function suggestCampaignTypeForDeal(deal) {
  const platform = cleanText(deal.platform).toLowerCase();
  const type = cleanText(deal.type).toLowerCase();
  if (platform.includes("casino") || type.includes("b2c")) {
    return "Free Spins";
  }
  if (platform.includes("wallet") || platform.includes("retail")) {
    return "Activation";
  }
  return "Tournament";
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
  const fallbackValue = values.includes("All") ? "All" : values[0] || "";
  select.innerHTML = options.join("");
  select.value = values.includes(currentValue) ? currentValue : fallbackValue;

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

function renderModuleFlow() {
  const items = buildModuleFlowItems();
  const readyCount = items.filter((item) => item.status !== "Needs setup").length;

  elements.moduleFlowSummary.textContent = `${readyCount} of ${items.length} modules active`;
  elements.moduleFlowGrid.innerHTML = items
    .map((item, index) => {
      return `
        <article class="module-flow-card ${item.tone} ${ui.activeView === item.view ? "is-current" : ""}">
          <div class="module-flow-top">
            <span class="module-flow-step">Step ${index + 1}</span>
            <span class="pill ${item.pillClass}">${escapeHtml(item.status)}</span>
          </div>
          <div class="module-flow-copy">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.description)}</small>
          </div>
          <div class="module-flow-metrics">
            <span>${escapeHtml(item.metricLabel)}</span>
            <strong>${escapeHtml(item.metricValue)}</strong>
          </div>
          <p>${escapeHtml(item.nextAction)}</p>
          <button class="button button-ghost button-small" data-module-view="${escapeHtml(item.view)}">${escapeHtml(item.cta)}</button>
        </article>
      `;
    })
    .join("");
}

function buildModuleFlowItems() {
  const scopedDeals = getScopedDeals();
  const activeAccounts = scopedDeals.length;
  const mappedMarkets = state.marketIntel.length;
  const activeUsers = state.users.filter((user) => user.status === "Active").length;
  const unassignedAccounts = scopedDeals.filter((deal) => !getDealOwner(deal)).length;
  const staleAccounts = scopedDeals.filter((deal) => hasStaleFollowUp(deal)).length;
  const liveCampaigns = state.campaigns.filter((campaign) => ["Ready", "Live"].includes(campaign.status)).length;
  const activeTargets = state.targets.filter((target) => Number(target.year || 0) === getActiveTargetYear()).length;

  return [
    {
      view: "admin",
      title: "System Setup",
      description: "Configure users, ownership, and the base operating model before loading the commercial workflow.",
      metricLabel: "Active users",
      metricValue: `${activeUsers}`,
      nextAction:
        activeUsers > 0
          ? "Keep roles current and assign each user to a clear commercial or operations scope."
          : "Create the first admin and at least one commercial owner.",
      status: activeUsers > 0 ? "Ready" : "Needs setup",
      pillClass: activeUsers > 0 ? "success" : "blocked",
      tone: activeUsers > 0 ? "is-good" : "is-danger",
      cta: "Open Setup",
    },
    {
      view: "crm",
      title: "Market Intelligence & Target Mapping",
      description: "Map markets, operators, account type, owner, and commercial context before converting targets into leads.",
      metricLabel: "Mapped markets",
      metricValue: `${mappedMarkets}`,
      nextAction:
        mappedMarkets === 0
          ? "Map the first priority market and define target operators before creating new leads."
          : unassignedAccounts > 0
          ? `${unassignedAccounts} accounts still need an owner to move smoothly into execution.`
          : "All visible accounts have ownership and can move cleanly into the pipeline.",
      status: mappedMarkets > 0 ? (unassignedAccounts > 0 ? "In progress" : "Ready") : "Needs setup",
      pillClass: mappedMarkets > 0 ? (unassignedAccounts > 0 ? "info" : "success") : "blocked",
      tone: mappedMarkets > 0 ? (unassignedAccounts > 0 ? "is-warn" : "is-good") : "is-danger",
      cta: "Open Target Mapping",
    },
    {
      view: "pipeline",
      title: "Opportunity Scoring & Funnel",
      description: "Advance accounts through Lead, Qualified, Proposal, Legal, DD, Integration, Legal Approval, Go Live, Live, and Handover.",
      metricLabel: "Active stages",
      metricValue: `${uniqueValues(scopedDeals.map((deal) => deal.stage)).length}`,
      nextAction:
        scopedDeals.length > 0
          ? "Use the pipeline to keep dates, probabilities, stage status, and follow-up actions current."
          : "Create or import the first account so stage management can start.",
      status: scopedDeals.length > 0 ? "Ready" : "Needs setup",
      pillClass: scopedDeals.length > 0 ? "success" : "blocked",
      tone: scopedDeals.length > 0 ? "is-good" : "is-danger",
      cta: "Open Funnel",
    },
    {
      view: "tasks",
      title: "Execution, Jira & Blockers",
      description: "Convert each opportunity into concrete tasks, Jira actions, blocker tracking, deadlines, and traceability.",
      metricLabel: "Open tasks",
      metricValue: `${state.tasks.filter((task) => task.status !== "Done").length}`,
      nextAction:
        staleAccounts > 0
          ? `${staleAccounts} accounts show stale follow-up and should receive task assignments next.`
          : "Task coverage is healthy; keep trace logs and due dates disciplined.",
      status: state.tasks.length > 0 ? "Ready" : scopedDeals.length > 0 ? "In progress" : "Needs setup",
      pillClass: state.tasks.length > 0 ? "success" : scopedDeals.length > 0 ? "info" : "blocked",
      tone: state.tasks.length > 0 ? "is-good" : scopedDeals.length > 0 ? "is-warn" : "is-danger",
      cta: "Open Tasks",
    },
    {
      view: "campaigns",
      title: "Growth, Live & Handover",
      description: "Track launch readiness, handover discipline, and growth initiatives for active and expanding client accounts.",
      metricLabel: "Ready / live",
      metricValue: `${liveCampaigns}`,
      nextAction:
        liveCampaigns > 0
          ? "Track which activations are generating the strongest commercial lift by market and operator."
          : "Create your first growth activation once an account reaches execution readiness.",
      status: state.campaigns.length > 0 ? "Ready" : activeAccounts > 0 ? "In progress" : "Needs setup",
      pillClass: state.campaigns.length > 0 ? "success" : activeAccounts > 0 ? "info" : "blocked",
      tone: state.campaigns.length > 0 ? "is-good" : activeAccounts > 0 ? "is-neutral" : "is-danger",
      cta: "Open Growth",
    },
    {
      view: "targets",
      title: "Targets, Forecast & Performance",
      description: "Control forecast, target coverage, and performance by market, opportunity stage, and sales rep.",
      metricLabel: "Active targets",
      metricValue: `${activeTargets}`,
      nextAction:
        activeTargets > 0
          ? "Review market gaps and coverage against the active fiscal-year commitments."
          : "Load targets to complete the full onboarding-to-performance loop.",
      status: activeTargets > 0 ? "Ready" : "Needs setup",
      pillClass: activeTargets > 0 ? "success" : "blocked",
      tone: activeTargets > 0 ? "is-good" : "is-danger",
      cta: "Open Targets",
    },
  ];
}

function renderWorkflowCommandBar() {
  const { current, next, readyCount, totalCount } = getWorkflowCurrentAndNext();
  const progress = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  elements.workflowCurrentTitle.textContent = current.title;
  elements.workflowCurrentCopy.textContent = current.description;
  elements.workflowNextTitle.textContent = next.title;
  elements.workflowNextCopy.textContent = next.nextAction;
  elements.workflowProgressLabel.textContent = `${progress}% complete`;
  elements.workflowProgressFill.style.width = `${Math.max(progress, readyCount > 0 ? 8 : 0)}%`;
  elements.workflowOpenCurrent.textContent = current.cta;
  elements.workflowOpenNext.textContent = next.cta;
}

function getWorkflowCurrentAndNext() {
  const items = buildModuleFlowItems();
  const flowViews = items.map((item) => item.view);
  const readyCount = items.filter((item) => item.status !== "Needs setup").length;
  const totalCount = items.length;

  if (ui.activeView === "dashboard") {
    const firstActionIndex = items.findIndex((item) => item.status !== "Ready");
    const nextItem = items[firstActionIndex >= 0 ? firstActionIndex : 0] || items[0];
    return {
      current: {
        view: "dashboard",
        title: "Executive Dashboard",
        description: "Review the commercial picture, active risks, stage movement, and forecast before moving into execution.",
        cta: "Open Dashboard",
      },
      next: nextItem,
      readyCount,
      totalCount,
    };
  }

  const activeFlowIndex = flowViews.indexOf(ui.activeView);
  const firstIncompleteIndex = items.findIndex((item) => item.status !== "Ready");
  const fallbackIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
  const currentIndex = activeFlowIndex >= 0 ? activeFlowIndex : fallbackIndex;
  const nextIncompleteIndex = items.findIndex((item, index) => index > currentIndex && item.status !== "Ready");
  const nextIndex = nextIncompleteIndex >= 0 ? nextIncompleteIndex : Math.min(currentIndex + 1, items.length - 1);

  return {
    current: items[currentIndex] || items[0],
    next: items[nextIndex] || items[currentIndex] || items[0],
    readyCount,
    totalCount,
  };
}

async function resetDemoState() {
  setLoadingState(true, "Reloading reference workbook", "Refreshing SalesRep from your Excel reference files.");
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
    ui.editingMarketIntelId = null;
    ui.editingTargetId = null;
    ui.editingTaskId = null;
    ui.editingCampaignId = null;
    resetDealForm();
    resetMarketIntelForm();
    resetTargetForm();
    resetTaskForm();
    resetCampaignForm();
    renderAll();
    setBanner(buildExcelBanner("Datos de referencia recargados desde tus archivos Excel."), "success");
  } catch (error) {
    clearBrowserStateCache();
    try {
      const publishedResponse = await fetch(STATIC_STATE_URL, { headers: { Accept: "application/json" } });
      if (!publishedResponse.ok) {
        throw new Error(`No fue posible leer el snapshot publicado (${publishedResponse.status}).`);
      }

      applyStatePayload(await publishedResponse.json());
      synchronizeTaskSequence();
      ensureActiveUser();
      resetWorkspaceForm();
      resetUserForm();
      serverMeta.workbookPath = "GitHub published snapshot";
      serverMeta.workbookUrl = STATIC_WORKBOOK_URL;
      serverMeta.ready = false;
      serverMeta.storageMode = "static";
      renderAll();
      setBanner(buildExcelBanner("Published GitHub snapshot restored."), "success");
    } catch (publishedError) {
      state = createDefaultState();
      const saved = await persistState();
      renderAll();
      setBanner(
        buildExcelBanner(saved ? "Base local de respaldo recargada y guardada en navegador." : "Base local de respaldo cargada solo en memoria."),
        saved ? "success" : "warn"
      );
    }
  } finally {
    setLoadingState(false);
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
    if (serverMeta.storageMode === "static") {
      const response = await fetch(STATIC_STATE_URL, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`No fue posible descargar el snapshot publicado (${response.status}).`);
      }

      const payload = await response.text();
      downloadBlob(buildExportFilename("salesrep-published-snapshot", "json"), payload, "application/json;charset=utf-8");
      setBanner("Published snapshot downloaded from GitHub Pages.", "success");
      return;
    }

    const downloadUrl = serverMeta.workbookUrl || (serverMeta.ready ? API_DOWNLOAD_URL : STATIC_WORKBOOK_URL);
    const response = await fetch(downloadUrl, {
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
    setBanner("No pude descargar el archivo. Verifica que el servidor local o la publicacion de GitHub este activa e intenta otra vez.", "danger");
  }
}

async function uploadExcelWorkbook(file) {
  if (!file) {
    return;
  }

  if (!serverMeta.ready) {
    setBanner("Excel upload requires the local/server deployment. The GitHub published app works with the published snapshot plus browser storage.", "warn");
    return;
  }

  const safeName = String(file.name || "uploaded-workbook.xlsx");
  const lowerName = safeName.toLowerCase();
  if (lowerName.endsWith(".xls") && !lowerName.endsWith(".xlsx")) {
    setBanner("This upload requires a modern Excel workbook (.xlsx or .xlsm). Please resave the file and try again.", "danger");
    return;
  }
  setLoadingState(true, "Importing Excel", `Loading ${safeName} into SalesRep and rebuilding the local workbook.`);

  try {
    const response = await fetch(`${API_UPLOAD_URL}?filename=${encodeURIComponent(safeName)}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": file.type || "application/octet-stream",
      },
      body: await file.arrayBuffer(),
    });

    if (!response.ok) {
      const payload = await safeReadJson(response);
      throw new Error(payload?.error || `No fue posible importar el Excel (${response.status}).`);
    }

    const payload = await response.json();
    await hydrateFromExcel({ showSuccessBanner: false });
    renderAll();

    const summary = buildUploadSummary(payload);
    setBanner(summary, "success");
  } catch (error) {
    setBanner(
      `No pude importar el Excel. ${error?.message || "Verifica que el servidor local este activo y que el archivo tenga un formato compatible."}`,
      "danger"
    );
  } finally {
    setLoadingState(false);
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

async function safeReadJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function buildUploadSummary(payload) {
  const meta = payload?.importMeta || {};
  const counts = meta.counts || {};
  const mode = cleanText(meta.mode || "workbook");
  const filename = cleanText(meta.filename || "uploaded workbook");
  const deals = Number(counts.deals || 0);
  const targets = Number(counts.targets || 0);
  const intel = Number(counts.marketIntel || 0);

  if (mode === "salesrep-workbook") {
    return `Excel imported: ${filename}. Loaded ${deals} deals, ${targets} targets, and ${intel} market intelligence records.`;
  }

  if (mode === "opportunities-source") {
    return `Source workbook imported: ${filename}. Refreshed ${deals} deals and ${targets} targets while preserving tasks, campaigns, users, and workspace settings.`;
  }

  return `Excel imported: ${filename}. SalesRep data has been refreshed.`;
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
  if (serverMeta.storageMode === "browser") {
    return `${message} Browser storage active for this published GitHub app.`;
  }
  if (serverMeta.storageMode === "static") {
    return `${message} Published from GitHub snapshot. Changes persist in your browser until a server-backed workbook is connected.`;
  }
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

function formatDaysMetric(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return "N/A";
  }
  const rounded = Math.round(amount * 10) / 10;
  return `${String(rounded).replace(/\.0$/, "")}d`;
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

function differenceInDays(startValue, endValue) {
  const start = normalizeDateInput(startValue);
  const end = normalizeDateInput(endValue);
  if (!start || !end) {
    return null;
  }

  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }

  return Math.round((endDate.getTime() - startDate.getTime()) / 86400000);
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

function normalizeContractStatus(value) {
  const text = cleanText(value);
  const aliases = {
    "": "Not Started",
    "not started": "Not Started",
    drafting: "Negotiation",
    negotiating: "Negotiation",
    negotiation: "Negotiation",
    "in review": "Negotiation",
    "counterparty review": "Negotiation",
    approved: "Negotiation",
    legal: "Negotiation",
    contract: "Negotiation",
    offer: "Negotiation",
    signed: "Signed",
    blocked: "Blocked",
  };
  return aliases[text.toLowerCase()] || text || "Not Started";
}

function normalizeProgressStatus(value) {
  const text = cleanText(value);
  const aliases = {
    "": "Not Started",
    "not started": "Not Started",
    started: "Started",
    "in progress": "In Progress",
    "pending client": "In Progress",
    uat: "In Progress",
    integration: "In Progress",
    completed: "Completed",
    complete: "Completed",
    done: "Completed",
    live: "Completed",
    blocked: "Blocked",
  };
  return aliases[text.toLowerCase()] || text || "Not Started";
}

function normalizeGoLiveStatus(value) {
  const text = cleanText(value);
  const aliases = {
    "": "Not Started",
    "not started": "Not Started",
    "ready for sign off": "Legal Sign-Off",
    "ready for sign-off": "Legal Sign-Off",
    "legal sign off": "Legal Sign-Off",
    "legal sign-off": "Legal Sign-Off",
    scheduled: "Legal Sign-Off",
    completed: "Completed",
    live: "Live",
    blocked: "Blocked",
  };
  return aliases[text.toLowerCase()] || text || "Not Started";
}

function normalizeDealStage(value) {
  const text = cleanText(value);
  const aliases = {
    "mapped lead": "Lead",
    lead: "Lead",
    prospect: "Lead",
    "qualified lead": "Qualified",
    qualified: "Qualified",
    "new business": "Qualified",
    proposal: "Proposal",
    offer: "Proposal",
    legal: "Legal",
    signed: "Legal",
    contract: "Legal",
    negotiation: "Legal",
    dd: "DD",
    "due diligence": "DD",
    integration: "Integration",
    onboarding: "Integration",
    "legal approval": "Legal Approval",
    approval: "Legal Approval",
    signoff: "Legal Approval",
    "sign off": "Legal Approval",
    "go live": "Go Live",
    live: "Live",
    handover: "Handover",
  };
  return aliases[text.toLowerCase().replace(/-/g, " ")] || text;
}

function inferDealStage(input = {}) {
  const normalizedStage = normalizeDealStage(input.stage);
  const rawStage = cleanText(input.stage).toLowerCase();
  const rawStatus = cleanText(input.status).toLowerCase();
  const agreement = normalizeContractStatus(input.agreement || input.legalStatus);
  const ddStatus = normalizeProgressStatus(input.ddStatus);
  const integrationStatus = normalizeProgressStatus(input.integrationStatus);
  const goLiveStatus = normalizeGoLiveStatus(input.goLiveStatus);

  if (normalizedStage === "Handover" || cleanText(input.handover)) {
    return "Handover";
  }
  if (normalizedStage === "Live" || rawStatus === "live" || cleanText(input.liveSince) || goLiveStatus === "Live") {
    return "Live";
  }
  if (normalizedStage === "Go Live") {
    return "Go Live";
  }
  if (
    normalizedStage === "Legal Approval" ||
    (agreement === "Signed" &&
      ddStatus === "Completed" &&
      integrationStatus === "Completed" &&
      !cleanText(input.liveSince) &&
      !cleanText(input.handover))
  ) {
    return "Legal Approval";
  }
  if (
    normalizedStage === "Integration" ||
    ["Started", "In Progress"].includes(integrationStatus) ||
    input.integrationStartedFlag ||
    rawStatus === "integration"
  ) {
    return "Integration";
  }
  if (normalizedStage === "DD" || ["Started", "In Progress", "Completed"].includes(ddStatus) || input.ddStartedFlag || input.ddCompletedFlag) {
    return "DD";
  }
  if (
    normalizedStage === "Legal" ||
    ["Negotiation", "Signed"].includes(agreement) ||
    ["legal", "signed"].includes(rawStatus) ||
    ["In Review", "Counterparty Review", "Approved"].includes(cleanText(input.legalStatus)) ||
    rawStage.includes("contract") ||
    rawStage.includes("negotiat")
  ) {
    return "Legal";
  }
  if (
    normalizedStage === "Proposal" ||
    rawStatus === "offer" ||
    cleanText(input.offerDate) ||
    cleanText(input.signingEta)
  ) {
    return "Proposal";
  }
  if (
    normalizedStage === "Qualified" ||
    rawStatus === "qualified" ||
    rawStage.includes("qualif") ||
    rawStage.includes("business")
  ) {
    return "Qualified";
  }
  return "Lead";
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
