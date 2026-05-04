const APP_BASE_URL = new URL("./", window.location.href);
const DEFAULT_API_ORIGIN = window.location.protocol === "file:" ? "http://localhost:8000" : window.location.origin;
const API_STATE_URL = resolveApiUrl("/api/state");
const API_SAVE_URL = resolveApiUrl("/api/save");
const API_RESET_DEMO_URL = resolveApiUrl("/api/reset-demo");
const API_DOWNLOAD_URL = resolveApiUrl("/api/download");
const API_UPLOAD_URL = resolveApiUrl("/api/upload");
const API_EXPORT_DOCX_URL = resolveApiUrl("/api/export-docx");
const STATIC_STATE_URL = resolveAssetUrl("data/published-state.json");
const STATIC_WORKBOOK_URL = resolveAssetUrl("data/pipeline-command-center.xlsx");
const DEAL_FORM_AUTOSAVE_DELAY_MS = 450;
const DEAL_FORM_SECTION_DEFS = [
  ["deal-section-core", "Core"],
  ["deal-section-scoring", "Scoring"],
  ["deal-section-timeline", "Timeline"],
  ["deal-section-status", "Status"],
  ["deal-section-requests", "Requests"],
  ["deal-section-context", "Context"],
];
const COMMERCIAL_BUILDER_FIELD_IDS = [
  "commercial-builder-product",
  "commercial-builder-model",
  "commercial-builder-base",
  "commercial-builder-structure",
  "commercial-builder-tier-level",
  "commercial-builder-rate",
  "commercial-builder-fixed-fee",
  "commercial-builder-volume-from",
  "commercial-builder-volume-to",
  "commercial-builder-volume-unit",
  "commercial-builder-premium-rate",
  "commercial-builder-setup-fee",
  "commercial-builder-deductions",
  "commercial-builder-bonus-cap",
  "commercial-builder-tax",
  "commercial-builder-withholding",
  "commercial-builder-notes",
];
const STAGE_ORDER = ["Lead", "Qualified", "Proposal", "Legal", "DD", "Integration", "Legal Approval", "Go Live", "Live", "Handover"];
const VIEW_STAGE_ORDER = STAGE_ORDER.filter((stage) => stage !== "Qualified");
const KANBAN_STAGE_ORDER = ["Lead", "Proposal", "Legal", "DD", "Integration", "Go Live", "Live", "Handover"];
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
const FOLLOW_UP_CADENCE_OPTIONS = ["Weekly", "Biweekly", "Monthly", "Custom"];
const FOLLOW_UP_CADENCE_DAYS = {
  Weekly: 7,
  Biweekly: 14,
  Monthly: 30,
};
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
const LATAM_MARKET_FORECAST_MULTIPLIERS = {
  Mexico: 1.08,
  Peru: 1.04,
  Colombia: 1.03,
  Chile: 1.01,
  Panama: 1.01,
  "Costa Rica": 1,
  "Dominican Republic": 0.98,
  Argentina: 0.96,
  Brazil: 0.95,
  Ecuador: 0.94,
  Guatemala: 0.95,
  Venezuela: 0.82,
  LATAM: 1,
  Global: 1,
};
const OPERATOR_TYPE_FORECAST_MULTIPLIERS = {
  B2C: 1.06,
  B2B: 0.94,
  Retail: 0.92,
  Social: 0.88,
  "B2B / B2C": 0.99,
  "B2C + Retail": 0.97,
  "Existing Account": 1.1,
  Upsell: 1.12,
  Renewal: 1.08,
  Reactivation: 0.97,
  "New Account": 0.94,
};
const STAGE_CADENCE_MILESTONES = [
  ["Lead", "prospectDate"],
  ["Proposal", "offerDate"],
  ["Legal", "signedEta"],
  ["DD", "ddDate"],
  ["Integration", "integrationDate"],
  ["Legal Approval", "legalApprovalDate"],
  ["Go Live", "liveDate"],
  ["Handover", "handover"],
];
const STAGE_SLA_DAYS = {
  Legal: 20,
  DD: 35,
  Integration: 45,
};
const STAGE_ENTRY_FIELDS = {
  Lead: "prospectDate",
  Qualified: "prospectDate",
  Proposal: "offerDate",
  Legal: "signedEta",
  DD: "ddDate",
  Integration: "integrationDate",
  "Legal Approval": "legalApprovalDate",
  "Go Live": "liveDate",
  Live: "liveSince",
  Handover: "handover",
};

const DOCUMENT_STAGE_ACTIONS = {
  legal: {
    targetStage: "Legal",
    statusField: "legalStatus",
    statusValue: "In Review",
    preserveValues: ["In Review", "Counterparty Review", "Approved", "Blocked"],
    actionLabel: "Legal Request",
  },
  proposal: {
    targetStage: "Proposal",
    dateField: "offerDate",
    actionLabel: "Business Proposal",
  },
  dd: {
    targetStage: "DD",
    dateField: "ddDate",
    statusField: "ddStatus",
    statusValue: "Started",
    flagField: "ddStartedFlag",
    actionLabel: "DD Request",
  },
  integration: {
    targetStage: "Integration",
    dateField: "integrationDate",
    statusField: "integrationStatus",
    statusValue: "Started",
    flagField: "integrationStartedFlag",
    actionLabel: "Integration Request",
  },
  signoff: {
    targetStage: "Legal Approval",
    dateField: "legalApprovalDate",
    statusField: "goLiveStatus",
    statusValue: "Legal Sign-Off",
    preserveValues: ["Legal Sign-Off", "Completed", "Live", "Blocked"],
    actionLabel: "Legal Signoff",
  },
};

const REQUEST_HUB_DEFINITIONS = [
  {
    key: "proposal",
    title: "Proposal Request",
    description: "Client-facing commercial proposal with pricing, scope, validity, and negotiated terms.",
    stageHint: "Lead · Proposal",
    emptyLabel: "No visible accounts are currently sitting in the commercial proposal lane.",
  },
  {
    key: "legal",
    title: "Legal Request",
    description: "Internal request to start contract work with full client profile and agreed commercials.",
    stageHint: "Proposal · Legal",
    emptyLabel: "No visible accounts currently require a legal request handoff.",
  },
  {
    key: "dd",
    title: "DD Request",
    description: "Internal due diligence request with compliance contacts, documents, and ownership aligned.",
    stageHint: "Legal · DD",
    emptyLabel: "No visible accounts are currently waiting for DD initiation or follow-up.",
  },
  {
    key: "integration",
    title: "Integration Request",
    description: "Internal technical kickoff with Jira, products, channels, launch scope, and delivery owners.",
    stageHint: "DD · Integration",
    emptyLabel: "No visible accounts are currently inside the integration request lane.",
  },
  {
    key: "signoff",
    title: "Legal Signoff",
    description: "Internal final signoff request before launch readiness and Go Live authorization.",
    stageHint: "Legal Approval · Go Live",
    emptyLabel: "No visible accounts are currently in final legal approval.",
  },
  {
    key: "go-live",
    title: "Go Live",
    description: "Accounts cleared for launch tracking, go-live readiness, and final execution control.",
    stageHint: "Legal Approval · Go Live",
    emptyLabel: "No visible accounts are currently queued for Go Live tracking.",
  },
  {
    key: "live",
    title: "Live",
    description: "Active accounts already live and needing follow-up, growth control, or handover discipline.",
    stageHint: "Go Live · Live · Handover",
    emptyLabel: "No visible live accounts are currently in the post-launch control lane.",
  },
];

const STAGE_OPERATION_BLUEPRINT = {
  Lead: {
    objective: "Map the account, assign ownership, and establish the first commercial contact baseline.",
    nextStage: "Proposal",
    ownerHint: "Sales Rep / Owner",
    primaryActionKind: null,
  },
  Qualified: {
    objective: "Validate that the operator has real commercial potential, product fit, and decision-making access.",
    nextStage: "Proposal",
    ownerHint: "Sales Rep / Owner",
    primaryActionKind: "proposal",
  },
  Proposal: {
    objective: "Turn the opportunity into a formal commercial offer with pricing, scope, and validity controlled.",
    nextStage: "Legal",
    ownerHint: "Sales Rep / Sales Manager",
    primaryActionKind: "proposal",
  },
  Legal: {
    objective: "Launch the service agreement with full client information and the commercials already agreed.",
    nextStage: "DD",
    ownerHint: "Legal + Sales",
    primaryActionKind: "legal",
  },
  DD: {
    objective: "Open due diligence with named contacts, documents, and compliance evidence ready to review.",
    nextStage: "Integration",
    ownerHint: "Compliance / Sales Ops",
    primaryActionKind: "dd",
  },
  Integration: {
    objective: "Kick off technical execution with Jira, delivery contacts, URL, and product scope already locked.",
    nextStage: "Legal Approval",
    ownerHint: "Integration / Delivery",
    primaryActionKind: "integration",
  },
  "Legal Approval": {
    objective: "Confirm contract, DD, and integration are closed before authorizing launch readiness.",
    nextStage: "Go Live",
    ownerHint: "Legal / Ops / Sales",
    primaryActionKind: "signoff",
  },
  "Go Live": {
    objective: "Confirm sign-off, launch timing, and operating readiness before the client is treated as active.",
    nextStage: "Live",
    ownerHint: "Operations / Account Team",
    primaryActionKind: null,
  },
  Live: {
    objective: "Stabilize the active client with follow-up cadence, growth ownership, and post-launch control.",
    nextStage: "Handover",
    ownerHint: "Account Management",
    primaryActionKind: null,
  },
  Handover: {
    objective: "Transfer the live client with context, contacts, blockers, and future opportunity visibility.",
    nextStage: "Performance Review",
    ownerHint: "Account Management / Regional Team",
    primaryActionKind: null,
  },
};

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
    block: "Lead",
    name: "Active Lead Opportunities",
    definition: "# de oportunidades activas con potencial comercial real",
    stage: "Lead",
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
  ["Owner", "kam"],
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
  ["DD Date", "ddDate"],
  ["Integration Date", "integrationDate"],
  ["Legal Approval Date", "legalApprovalDate"],
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
  ["Follow-Up Cadence", "followUpCadence"],
  ["Next Follow-Up Date", "nextFollowUpDate"],
  ["Follow-Up Owner", "followUpOwner"],
  ["Follow-Up Notes", "followUpNotes"],
  ["Follow-Up Notifications Enabled", "followUpNotificationsEnabled"],
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
  ["Company Name", "companyName"],
  ["Company Registration Number", "companyRegistrationNumber"],
  ["Company Registered Address", "companyRegisteredAddress"],
  ["Company Legal Representative", "companyLegalRepresentative"],
  ["Company License", "companyLicense"],
  ["Invoice Email", "invoiceEmail"],
  ["Support Email", "supportEmail"],
  ["Management Email", "managementEmail"],
  ["DD Contact Name", "ddContactName"],
  ["DD Contact Email", "ddContactEmail"],
  ["Legal Representative Name", "legalRepresentativeName"],
  ["Legal Representative ID", "legalRepresentativeId"],
  ["Legal Representative Address", "legalRepresentativeAddress"],
  ["Legal Representative Email", "legalRepresentativeEmail"],
  ["Client Based", "clientBased"],
  ["Other Live Suppliers", "otherLiveSuppliers"],
  ["Integration Team", "integrationTeam"],
  ["Teams Group", "teamsGroup"],
  ["Integration Request", "integrationRequest"],
  ["Legal Signoff Request", "legalSignoffRequest"],
  ["Other Info", "otherInfo"],
  ["Document Client Name", "documentClientName"],
  ["Proposal Validity Days", "proposalValidityDays"],
  ["Proposal Valid Until", "proposalValidUntil"],
  ["Proposal Request", "proposalRequest"],
  ["Negotiated Products", "negotiatedProducts"],
  ["Activation Requirements", "activationRequirements"],
  ["Pricing Base", "pricingBase"],
  ["Deduction Terms", "deductionTerms"],
  ["Commercial Terms", "commercialTerms"],
  ["Commercial Schedule", "commercialSchedule"],
  ["Negotiation Scope", "negotiationScope"],
  ["Setup Fee Status", "setupFeeStatus"],
  ["Setup Fee Amount", "setupFeeAmount"],
  ["Marketing Commitments", "marketingCommitments"],
  ["Live Games Top Position", "liveGamesTopPosition"],
  ["Slots Top Position", "slotsTopPosition"],
  ["Deductions Allowed", "deductionsAllowed"],
  ["Bonus Cap", "bonusCap"],
  ["Gaming Tax", "gamingTax"],
  ["Withholding Tax", "withholdingTax"],
  ["Advance Payment", "advancePayment"],
  ["Credit Notes", "creditNotes"],
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
const DEAL_FORM_SECTION_FIELD_MAP = buildDealFormSectionFieldMap();

const viewTabs = Array.from(document.querySelectorAll("[data-view-trigger]"));
const views = Array.from(document.querySelectorAll("[data-view]"));
const VIEW_SCROLL_TARGETS = {
  dashboard: ".cockpit-command-center",
  tasks: "#task-board",
  admin: "#workspace-form",
  crm: "#market-intel-board",
  pipeline: "#pipeline-board",
  requests: "#requests-board",
  targets: "#target-progress",
  campaigns: "#campaign-board",
  catalogue: "#kpi-grid",
};
const NAV_HIGHLIGHT_DURATION_MS = 1800;

const elements = {
  focusSummary: document.getElementById("focus-summary"),
  operatingFlowShell: document.getElementById("operating-flow-shell"),
  operatingFlowToggle: document.getElementById("operating-flow-toggle"),
  heroStats: document.getElementById("hero-stats"),
  activeUserSelect: document.getElementById("active-user-select"),
  workspaceDropdownTitle: document.getElementById("workspace-dropdown-title"),
  workspaceDropdownCopy: document.getElementById("workspace-dropdown-copy"),
  workspaceBadge: document.getElementById("workspace-badge"),
  workspacePlanBadge: document.getElementById("workspace-plan-badge"),
  workspaceUserRole: document.getElementById("workspace-user-role"),
  workspaceHistorySummary: document.getElementById("workspace-history-summary"),
  workspaceHistoryCopy: document.getElementById("workspace-history-copy"),
  workspaceHistoryPreview: document.getElementById("workspace-history-preview"),
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
  companySearch: document.getElementById("company-search"),
  companySearchStatus: document.getElementById("company-search-status"),
  companySearchSuggestions: document.getElementById("company-search-suggestions"),
  openCompanyProfile: document.getElementById("open-company-profile"),
  createCompanyAccount: document.getElementById("create-company-account"),
  clearCompanySearch: document.getElementById("clear-company-search"),
  stageOverview: document.getElementById("stage-overview"),
  dashboardStageSummary: document.getElementById("dashboard-stage-summary"),
  commandCenterSummary: document.getElementById("command-center-summary"),
  commandKpiGrid: document.getElementById("command-kpi-grid"),
  fixNowCount: document.getElementById("fix-now-count"),
  fixNowAlerts: document.getElementById("fix-now-alerts"),
  commandActionsCount: document.getElementById("command-actions-count"),
  commandActionsToday: document.getElementById("command-actions-today"),
  commandPipelineBars: document.getElementById("command-pipeline-bars"),
  commandTimePressure: document.getElementById("command-time-pressure"),
  commandMarketBreakdown: document.getElementById("command-market-breakdown"),
  commandOperatorBreakdown: document.getElementById("command-operator-breakdown"),
  commandUpcomingGoLives: document.getElementById("command-upcoming-golives"),
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
  requestsSummary: document.getElementById("requests-summary"),
  requestsKpiGrid: document.getElementById("requests-kpi-grid"),
  requestsFocusChip: document.getElementById("requests-focus-chip"),
  requestsActiveDeal: document.getElementById("requests-active-deal"),
  requestsFocusGrid: document.getElementById("requests-focus-grid"),
  requestsBoard: document.getElementById("requests-board"),
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
  dealWorkflowGuide: document.getElementById("deal-workflow-guide"),
  dealWorkflowStageBadge: document.getElementById("deal-workflow-stage-badge"),
  dealFormTitle: document.getElementById("deal-form-title"),
  dealSubmitButton: document.getElementById("deal-submit-button"),
  dealAutosaveBadge: document.getElementById("deal-autosave-badge"),
  dealAutosaveCopy: document.getElementById("deal-autosave-copy"),
  dealAutosaveSections: document.getElementById("deal-autosave-sections"),
  dealFieldSummary: document.getElementById("deal-field-summary"),
  restoreDealDraftButton: document.getElementById("restore-deal-draft-button"),
  discardDealDraftButton: document.getElementById("discard-deal-draft-button"),
  dealIntakeAssistant: document.getElementById("deal-intake-assistant"),
  dealFollowUpGuide: document.getElementById("deal-follow-up-guide"),
  pipelineOperatingGuide: document.getElementById("pipeline-operating-guide"),
  pipelineOperatingStageChip: document.getElementById("pipeline-operating-stage-chip"),
  pipelineFollowUpSummary: document.getElementById("pipeline-follow-up-summary"),
  pipelineFollowUpNotifications: document.getElementById("pipeline-follow-up-notifications"),
  dealModalShell: document.getElementById("deal-modal-shell"),
  dealModalCloseButton: document.getElementById("deal-modal-close-button"),
  openNewDealModalButton: document.getElementById("open-new-deal-modal-button"),
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
  companyProfileShell: document.getElementById("company-profile-shell"),
  companyProfileTitle: document.getElementById("company-profile-title"),
  companyProfileBody: document.getElementById("company-profile-body"),
  companyProfileClose: document.getElementById("company-profile-close"),
  openRequestsModuleButton: document.getElementById("open-requests-module-button"),
  requestsOpenPipeline: document.getElementById("requests-open-pipeline"),
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
  requestsFocus: "all",
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
  companyFinder: {
    isOpen: false,
    activeIndex: -1,
    suggestions: [],
    selectedDealId: null,
  },
  companyProfileDealId: null,
  companyProfileEditMode: false,
  pipelinePreset: null,
  taskPreset: null,
  campaignPreset: null,
  kpiSearch: "",
  isHydrating: true,
  companyAssistKey: "",
  dealAutosaveStore: { drafts: {} },
  dealAutosaveStatus: "idle",
  dealAutosaveSavedAt: "",
  dealAutosaveBaseline: null,
  dealAutosaveRestored: false,
  dealModalOpen: false,
  operatingFlowCollapsed: false,
  lastScrollY: 0,
  navHighlightTimer: 0,
  navHighlightNodes: [],
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
  history: [],
  latamReference: {
    markets: [],
    stageTotals: [],
    operatorsByMarket: [],
  },
};

let derived = createDerivedState();
let dealAutosaveTimer = 0;

const serverMeta = {
  workbookPath: "",
  workbookUrl: STATIC_WORKBOOK_URL,
  lastUpdatedAt: "",
  ready: false,
  storageMode: "static",
};

const DEAL_FORM_ASSIST_LISTS = {
  client: "deal-client-options",
  operator: "deal-operator-options",
  groupName: "deal-group-options",
  kam: "deal-kam-options",
  market: "deal-market-options",
  platform: "deal-platform-options",
  companyName: "deal-company-options",
  documentClientName: "deal-company-options",
  legalEntity: "deal-legal-entity-options",
  primaryContact: "deal-contact-options",
  decisionMaker: "deal-contact-options",
  ddContactName: "deal-dd-contact-options",
  companyLegalRepresentative: "deal-legal-rep-options",
  legalRepresentativeName: "deal-legal-rep-options",
  invoiceEmail: "deal-email-options",
  supportEmail: "deal-email-options",
  managementEmail: "deal-email-options",
  integrationEmail: "deal-email-options",
  ddContactEmail: "deal-email-options",
  legalRepresentativeEmail: "deal-email-options",
  followUpOwner: "deal-kam-options",
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

function createDerivedState() {
  return {
    dealsRef: null,
    usersRef: null,
    dealDocsById: new Map(),
    dealTimePartsById: new Map(),
    companyDealsByKey: new Map(),
    companyProfiles: [],
    companyProfilesByKey: new Map(),
    formOptions: new Map(),
    scopedDealsKey: "",
    scopedDeals: [],
  };
}

function rebuildDerivedState(force = false) {
  if (!force && derived.dealsRef === state.deals && derived.usersRef === state.users) {
    return derived;
  }

  const next = createDerivedState();
  next.dealsRef = state.deals;
  next.usersRef = state.users;

  state.deals.forEach((deal) => {
    const searchText = buildDealSearchText(deal);
    const companyKey = getCompanyProfileKey(deal);
    const companyLabel = getCompanyProfileLabel(deal);
    const timeParts = getDealTimeParts(deal);
    next.dealDocsById.set(deal.id, {
      id: deal.id,
      searchText,
      companyKey,
      companyLabel,
    });
    next.dealTimePartsById.set(deal.id, timeParts);
    if (!next.companyDealsByKey.has(companyKey)) {
      next.companyDealsByKey.set(companyKey, []);
    }
    next.companyDealsByKey.get(companyKey).push(deal);
  });

  next.companyDealsByKey.forEach((items, key) => {
    const deals = [...items].sort((left, right) => {
      const stageDiff = STAGE_ORDER.indexOf(cleanText(right.stage)) - STAGE_ORDER.indexOf(cleanText(left.stage));
      if (stageDiff !== 0) {
        return stageDiff;
      }
      return Number(right.dealValue || 0) - Number(left.dealValue || 0);
    });
    next.companyDealsByKey.set(key, deals);
    const primary = deals[0];
    const contacts = collectCompanyContactRows(deals);
    const websites = uniqueValues(deals.map((item) => item.url));
    const markets = uniqueValues(deals.map((item) => item.market));
    const stages = uniqueValues(deals.map((item) => item.stage));
    const profile = {
      key,
      dealId: primary?.id || "",
      title: getCompanyProfileLabel(primary || {}),
      primary,
      deals,
      contacts,
      websites,
      markets,
      stages,
      searchText: normalizeSearchText(
        [
          getCompanyProfileLabel(primary || {}),
          ...deals.flatMap((item) => [
            item.client,
            item.operator,
            item.deal,
            item.market,
            item.url,
            item.companyName,
            item.documentClientName,
            item.legalEntity,
            item.primaryContact,
            item.decisionMaker,
            item.ddContactName,
            item.ddContactEmail,
            item.legalRepresentativeName,
            item.legalRepresentativeEmail,
            item.invoiceEmail,
            item.supportEmail,
            item.managementEmail,
            item.integrationEmail,
          ]),
          ...contacts.flatMap((contact) => [contact.role, contact.name, contact.email, contact.market]),
        ].join(" ")
      ),
    };
    next.companyProfiles.push(profile);
    next.companyProfilesByKey.set(key, profile);
  });

  next.formOptions = buildDealFormAssistOptions(next.companyProfiles);
  derived = next;
  return derived;
}

init();

async function init() {
  setLoadingState(true, "Loading workspace", "Syncing live pipeline, tasks, market intelligence, and forecast data.");
  bindEvents();
  ui.activeView = "dashboard";
  resetDealForm();
  resetMarketIntelForm();
  resetTargetForm();
  resetTaskForm();
  resetCampaignForm();
  resetWorkspaceForm();
  resetUserForm();
  await hydrateFromExcel();
  renderAll();
  activateView("dashboard", { scroll: false });
  setLoadingState(false);
}

function bindEvents() {
  ui.lastScrollY = window.scrollY || 0;

  viewTabs.forEach((button) => {
    button.addEventListener("click", () => {
      activateView(button.dataset.viewTrigger);
    });
  });

  elements.operatingFlowToggle?.addEventListener("click", () => {
    ui.operatingFlowCollapsed = false;
    renderOperatingFlowVisibility();
    elements.operatingFlowShell?.scrollIntoView({ block: "start", behavior: "smooth" });
    pulseNavigationTarget(elements.operatingFlowShell);
  });

  document.getElementById("reset-demo-button").addEventListener("click", () => {
    if (!window.confirm("Esto reemplazara los datos actuales por la base de referencia tomada de tus archivos Excel. ¿Continuar?")) {
      return;
    }

    resetDemoState();
  });

  document.getElementById("reload-excel-button").addEventListener("click", async () => {
    setLoadingState(true, "Refreshing workbook", "Reloading Cube One from the local Excel control file.");
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
  dealForm.addEventListener("input", () => {
    refreshDealFieldHighlights();
  });
  dealForm.addEventListener("change", () => {
    refreshDealFieldHighlights();
  });
  elements.dealFieldSummary?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-focus-deal-field]");
    if (!button) {
      return;
    }
    focusDealField(button.dataset.focusDealField);
  });
  document.getElementById("deal-cancel-button").addEventListener("click", () => {
    clearActiveDealAutosave(true);
    ui.editingDealId = null;
    resetDealForm();
    closeDealModal();
    setBanner("Deal form cleared and autosave draft discarded.", "default");
  });
  elements.restoreDealDraftButton?.addEventListener("click", () => {
    restoreActiveDealAutosave();
  });
  elements.discardDealDraftButton?.addEventListener("click", () => {
    clearActiveDealAutosave(true);
    setBanner("Draft autosave discarded for this deal workspace.", "default");
  });
  document.getElementById("copy-legal-brief-button").addEventListener("click", () => {
    void copyDealBrief("legal");
  });
  document.getElementById("copy-proposal-brief-button").addEventListener("click", () => {
    void copyDealBrief("proposal");
  });
  document.getElementById("seed-proposal-template-button")?.addEventListener("click", () => {
    seedProposalRequestFromTemplate();
  });
  document.getElementById("copy-integration-brief-button").addEventListener("click", () => {
    void copyDealBrief("integration");
  });
  document.getElementById("copy-legal-signoff-brief-button").addEventListener("click", () => {
    void copyDealBrief("signoff");
  });
  document.getElementById("copy-negotiation-brief-button").addEventListener("click", () => {
    void copyDealBrief("negotiation");
  });
  elements.openRequestsModuleButton?.addEventListener("click", () => {
    ui.activeView = "requests";
    renderViewState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.getElementById("export-contract-request-button").addEventListener("click", () => {
    void exportDealDocx("legal");
  });
  document.getElementById("export-commercial-proposal-button").addEventListener("click", () => {
    void exportDealDocx("proposal");
  });
  document.getElementById("export-dd-request-button").addEventListener("click", () => {
    void exportDealDocx("dd");
  });
  document.getElementById("export-integration-request-button").addEventListener("click", () => {
    void exportDealDocx("integration");
  });
  document.getElementById("export-legal-signoff-request-button").addEventListener("click", () => {
    void exportDealDocx("signoff");
  });

  marketIntelForm.addEventListener("submit", handleMarketIntelSubmit);
  document.getElementById("market-intel-cancel-button").addEventListener("click", () => {
    ui.editingMarketIntelId = null;
    resetMarketIntelForm();
    setBanner("Market intelligence form cleared.", "default");
  });

  dealForm.addEventListener("input", handleDealScoringInput);
  dealForm.addEventListener("change", handleDealScoringInput);
  dealForm.addEventListener("click", handleDealAssistAction);
  dealForm.addEventListener("change", (event) => {
    if (event.target?.id?.startsWith("commercial-builder-")) {
      if (event.target?.id === "commercial-builder-tier-level" && cleanText(event.target.value)) {
        const snapshot = getCommercialBuilderSnapshot();
        applyCommercialBuilderValues(getCommercialTierDefinition(snapshot.product, event.target.value, snapshot.base));
      }
      syncCommercialBuilderUi();
    }
    if (["client", "operator", "companyName", "documentClientName"].includes(event.target?.name)) {
      maybeHydrateDealFormFromCompanyMatch();
    }
  });
  renderDealAutosaveState();
  syncCommercialBuilderUi();

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

  elements.companySearch.addEventListener("input", (event) => {
    ui.companyFinder.selectedDealId = null;
    ui.companyFinder.isOpen = true;
    ui.companyFinder.activeIndex = -1;
    renderCompanyFinder(event.target.value.trim());
  });

  elements.companySearch.addEventListener("focus", () => {
    ui.companyFinder.isOpen = true;
    renderCompanyFinder(elements.companySearch.value.trim());
  });

  elements.companySearch.addEventListener("blur", () => {
    window.setTimeout(() => {
      ui.companyFinder.isOpen = false;
      ui.companyFinder.activeIndex = -1;
      renderCompanyFinder(elements.companySearch.value.trim());
    }, 120);
  });

  elements.companySearch.addEventListener("keydown", (event) => {
    handleCompanyFinderKeydown(event);
  });

  elements.openCompanyProfile.addEventListener("click", () => {
    openCompanyFinderBestMatch();
  });
  elements.createCompanyAccount?.addEventListener("click", () => {
    createNewAccountFromCompanyQuery(elements.companySearch?.value || "");
  });

  elements.clearCompanySearch.addEventListener("click", () => {
    ui.companyFinder.isOpen = false;
    ui.companyFinder.activeIndex = -1;
    ui.companyFinder.selectedDealId = null;
    elements.companySearch.value = "";
    renderCompanyFinder("");
    closeCompanyProfile();
    elements.companySearch.focus();
  });

  elements.companySearchSuggestions.addEventListener("pointerdown", (event) => {
    const createButton = event.target.closest("[data-company-create]");
    if (createButton) {
      event.preventDefault();
      createNewAccountFromCompanyQuery(createButton.dataset.companyCreate);
      return;
    }
    const button = event.target.closest("[data-company-finder-index]");
    if (!button) {
      return;
    }

    event.preventDefault();
    selectCompanyFinderSuggestion(Number(button.dataset.companyFinderIndex));
  });

  elements.companySearchSuggestions.addEventListener("click", (event) => {
    const createButton = event.target.closest("[data-company-create]");
    if (createButton) {
      event.preventDefault();
      createNewAccountFromCompanyQuery(createButton.dataset.companyCreate);
      return;
    }
    const button = event.target.closest("[data-company-finder-index]");
    if (!button) {
      return;
    }

    event.preventDefault();
    selectCompanyFinderSuggestion(Number(button.dataset.companyFinderIndex));
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
  elements.commandPipelineBars?.addEventListener("click", handleStageFunnelAction);
  elements.commandTimePressure?.addEventListener("click", handleStageFunnelAction);
  elements.fixNowAlerts?.addEventListener("click", handleDealAction);
  elements.fixNowAlerts?.addEventListener("click", handleTaskAction);
  elements.commandActionsToday?.addEventListener("click", handleTaskAction);
  elements.commandUpcomingGoLives?.addEventListener("click", handleDealAction);
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
  elements.dealWorkflowGuide?.addEventListener("click", handleDealWorkflowGuideAction);
  elements.pipelineOperatingGuide?.addEventListener("click", handleStageFunnelAction);
  elements.crmOperatorTableBody.addEventListener("click", handleDealAction);
  elements.dashboardSpotlight.addEventListener("click", handleDealAction);
  elements.executiveKpiReadout.addEventListener("click", handleExecutiveKpiAction);
  elements.marketIntelBoard.addEventListener("click", handleMarketIntelAction);
  elements.marketInterpretationBoard.addEventListener("click", handleDealAction);
  elements.riskList.addEventListener("click", handleDealAction);
  elements.requestsKpiGrid?.addEventListener("click", handleRequestsAction);
  elements.requestsActiveDeal?.addEventListener("click", handleRequestsAction);
  elements.requestsFocusGrid?.addEventListener("click", handleRequestsAction);
  elements.requestsBoard?.addEventListener("click", handleRequestsAction);
  elements.requestsOpenPipeline?.addEventListener("click", () => {
    ui.activeView = "pipeline";
    renderViewState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  elements.companyProfileClose?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeCompanyProfile();
  });
  elements.companyProfileBody?.addEventListener("click", (event) => {
    if (event.target.closest("[data-company-profile-close]")) {
      event.preventDefault();
      closeCompanyProfile();
      return;
    }
    const companyProfileAction = event.target.closest("[data-company-profile-action]");
    if (companyProfileAction) {
      event.preventDefault();
      const action = cleanText(companyProfileAction.dataset.companyProfileAction);
      if (action === "edit-profile") {
        ui.companyProfileEditMode = true;
        renderCompanyProfileDrawer();
      }
      if (action === "cancel-edit") {
        ui.companyProfileEditMode = false;
        renderCompanyProfileDrawer();
      }
      return;
    }
    if (event.target.closest("[data-action]")) {
      void handleDealAction(event);
    }
  });
  elements.companyProfileBody?.addEventListener("submit", (event) => {
    const form = event.target.closest("#company-profile-form");
    if (!form) {
      return;
    }
    event.preventDefault();
    void saveCompanyProfileForm(form);
  });
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
  elements.openNewDealModalButton?.addEventListener("click", () => {
    ui.activeView = "pipeline";
    resetDealForm();
    openDealModal();
    renderViewState();
  });
  elements.dealModalCloseButton?.addEventListener("click", closeDealModal);
  elements.dealModalShell?.addEventListener("click", (event) => {
    if (event.target.closest("[data-deal-modal-close]")) {
      closeDealModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && ui.dealModalOpen) {
      closeDealModal();
      return;
    }
    if (event.key === "Escape" && ui.companyProfileDealId) {
      closeCompanyProfile();
    }
  });

  window.addEventListener("scroll", handleOperatingFlowScroll, { passive: true });
  window.addEventListener("resize", handleOperatingFlowResize);

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
    serverMeta.lastUpdatedAt = cleanText(payload.savedAt) || cleanText(payload.updatedAt) || cleanText(payload.generatedAt) || "";
    serverMeta.ready = true;
    serverMeta.storageMode = "excel";
    if (showSuccessBanner) {
      setBanner(buildExcelBanner("Datos cargados desde Excel."), "success");
    }
  } catch (error) {
    try {
      const publishedResponse = await fetch(STATIC_STATE_URL, { headers: { Accept: "application/json" } });
      if (!publishedResponse.ok) {
        throw new Error(`No fue posible leer la base publicada (${publishedResponse.status}).`);
      }

      const publishedPayload = await publishedResponse.json();
      applyStatePayload(publishedPayload);
      synchronizeTaskSequence();
      ensureActiveUser();
      resetWorkspaceForm();
      resetUserForm();
      serverMeta.workbookPath = "GitHub published workspace baseline";
      serverMeta.workbookUrl = STATIC_WORKBOOK_URL;
      serverMeta.lastUpdatedAt = cleanText(publishedPayload.savedAt) || cleanText(publishedPayload.updatedAt) || cleanText(publishedPayload.generatedAt) || cleanText(publishedPayload.history?.[0]?.createdAt) || "";
      serverMeta.ready = false;
      serverMeta.storageMode = "static";
      if (showSuccessBanner) {
        setBanner(buildExcelBanner("Loaded published GitHub workspace baseline."), "success");
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
        "No pude conectarme al Excel ni cargar la base publicada. Inicia `./start-server.sh` o vuelve a publicar los datos en GitHub.",
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
    serverMeta.lastUpdatedAt = cleanText(payload.savedAt) || new Date().toISOString();
    serverMeta.ready = true;
    serverMeta.storageMode = "excel";
    recordWorkspaceHistory("Workspace sync", "Changes saved to the connected workbook.", { storageMode: "excel" });
    await hydrateFromExcel({ showSuccessBanner: false });
    return true;
  } catch (error) {
    serverMeta.ready = false;
    serverMeta.workbookPath = "GitHub published workspace baseline";
    serverMeta.workbookUrl = STATIC_WORKBOOK_URL;
    serverMeta.lastUpdatedAt = new Date().toISOString();
    serverMeta.storageMode = "session";
    recordWorkspaceHistory("Workspace sync", "Changes are visible in the current online session only until a workbook backend is connected.", {
      storageMode: "session",
    });
    setBanner("Excel backend unavailable. The online workspace stays visible, but changes are session-only until a workbook backend is connected.", "warn");
    return false;
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
    history: Array.isArray(payload?.history) ? payload.history.filter((item) => item && typeof item === "object") : [],
    latamReference: normalizeLatamReference(payload?.latamReference),
  };
}

function readBrowserStateCache() {
  return null;
}

function writeBrowserStateCache(payload) {
  void payload;
  return false;
}

function readWorkspaceHistory() {
  return Array.isArray(state?.history) ? [...state.history] : [];
}

function writeWorkspaceHistory(history) {
  state.history = Array.isArray(history) ? [...history] : [];
  return true;
}

function recordWorkspaceHistory(action, detail, meta = {}) {
  const entry = {
    id: generateId("history"),
    action: cleanText(action) || "Workspace updated",
    detail: cleanText(detail) || "Change recorded",
    storageMode: meta.storageMode || serverMeta.storageMode || "session",
    entityType: cleanText(meta.entityType),
    entityId: cleanText(meta.entityId),
    actor: getActiveUser()?.fullName || "Workspace user",
    createdAt: new Date().toISOString(),
  };
  const history = [entry, ...readWorkspaceHistory()].slice(0, 250);
  state.history = history;
  writeWorkspaceHistory(history);
  return entry;
}

function clearBrowserStateCache() {
  return;
}

function buildDealFormSectionFieldMap() {
  if (!dealForm) {
    return {};
  }

  const mapping = {};
  DEAL_FORM_SECTION_DEFS.forEach(([sectionId]) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }
    section.querySelectorAll("input[name], select[name], textarea[name]").forEach((field) => {
      if (field.name && !mapping[field.name]) {
        mapping[field.name] = sectionId;
      }
    });
  });

  COMMERCIAL_BUILDER_FIELD_IDS.forEach((fieldId) => {
    mapping[fieldId] = "deal-section-requests";
  });

  return mapping;
}

function readDealAutosaveStore() {
  if (!ui.dealAutosaveStore || typeof ui.dealAutosaveStore !== "object") {
    ui.dealAutosaveStore = { drafts: {} };
  }
  if (!ui.dealAutosaveStore.drafts || typeof ui.dealAutosaveStore.drafts !== "object") {
    ui.dealAutosaveStore.drafts = {};
  }
  return ui.dealAutosaveStore;
}

function writeDealAutosaveStore(payload) {
  ui.dealAutosaveStore = payload && typeof payload === "object" ? payload : { drafts: {} };
  return true;
}

function getActiveDealAutosaveKey() {
  return ui.editingDealId ? `deal:${ui.editingDealId}` : "deal:new";
}

function getDealAutosaveEntry(key = getActiveDealAutosaveKey()) {
  return readDealAutosaveStore().drafts?.[key] || null;
}

function clonePlainObject(value) {
  return value ? JSON.parse(JSON.stringify(value)) : {};
}

function captureDealFormSnapshot() {
  if (!dealForm) {
    return {};
  }

  const snapshot = {};
  Array.from(dealForm.elements).forEach((field) => {
    if (!field?.name || field.disabled) {
      return;
    }
    if (field.type === "submit" || field.type === "button" || field.type === "reset") {
      return;
    }
    snapshot[field.name] = field.type === "checkbox" ? Boolean(field.checked) : field.value ?? "";
  });

  COMMERCIAL_BUILDER_FIELD_IDS.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      snapshot[fieldId] = field.value ?? "";
    }
  });

  return snapshot;
}

function sectionFieldNames(sectionId) {
  return Object.entries(DEAL_FORM_SECTION_FIELD_MAP)
    .filter(([, mappedSectionId]) => mappedSectionId === sectionId)
    .map(([fieldName]) => fieldName);
}

function getSectionSnapshot(snapshot, sectionId) {
  const data = {};
  sectionFieldNames(sectionId).forEach((fieldName) => {
    data[fieldName] = snapshot[fieldName];
  });
  return data;
}

function snapshotsEqual(left = {}, right = {}) {
  const keys = new Set([...Object.keys(left || {}), ...Object.keys(right || {})]);
  for (const key of keys) {
    if ((left || {})[key] !== (right || {})[key]) {
      return false;
    }
  }
  return true;
}

function buildDealAutosaveEntry(snapshot, previousEntry = null) {
  const now = new Date().toISOString();
  const sections = {};

  DEAL_FORM_SECTION_DEFS.forEach(([sectionId, label]) => {
    const data = getSectionSnapshot(snapshot, sectionId);
    const previousSection = previousEntry?.sections?.[sectionId];
    const changed = !previousSection || !snapshotsEqual(data, previousSection.data || {});
    sections[sectionId] = {
      label,
      updatedAt: changed ? now : previousSection.updatedAt || now,
      data,
    };
  });

  return {
    key: getActiveDealAutosaveKey(),
    dealId: ui.editingDealId || "",
    mode: ui.editingDealId ? "edit" : "new",
    savedAt: now,
    summary: {
      deal: cleanText(snapshot.deal),
      client: cleanText(snapshot.client),
      operator: cleanText(snapshot.operator),
    },
    sections,
  };
}

function setDealAutosaveBaseline(snapshot = captureDealFormSnapshot()) {
  ui.dealAutosaveBaseline = clonePlainObject(snapshot);
  ui.dealAutosaveStatus = "idle";
  ui.dealAutosaveSavedAt = "";
  ui.dealAutosaveRestored = false;
  renderDealAutosaveState();
}

function applyDealFormSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return;
  }

  Object.entries(snapshot).forEach(([fieldName, value]) => {
    const field = dealForm.elements[fieldName] || document.getElementById(fieldName);
    if (!field) {
      return;
    }
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
      return;
    }
    field.value = value ?? "";
  });

  syncCommercialBuilderUi();
  syncDealScoringPreview();
}

function activeDealAutosaveHasChanges() {
  return !snapshotsEqual(captureDealFormSnapshot(), ui.dealAutosaveBaseline || {});
}

function saveDealAutosaveNow() {
  window.clearTimeout(dealAutosaveTimer);
  dealAutosaveTimer = 0;

  if (!dealForm || ui.isHydrating) {
    return;
  }

  const snapshot = captureDealFormSnapshot();
  const baseline = ui.dealAutosaveBaseline || {};
  const key = getActiveDealAutosaveKey();

  if (snapshotsEqual(snapshot, baseline)) {
    const store = readDealAutosaveStore();
    if (store.drafts[key]) {
      delete store.drafts[key];
      writeDealAutosaveStore(store);
    }
    ui.dealAutosaveStatus = "idle";
    ui.dealAutosaveSavedAt = "";
    renderDealAutosaveState();
    return;
  }

  const store = readDealAutosaveStore();
  const entry = buildDealAutosaveEntry(snapshot, store.drafts[key]);
  store.drafts[key] = entry;

  if (writeDealAutosaveStore(store)) {
    ui.dealAutosaveStatus = "saved";
    ui.dealAutosaveSavedAt = entry.savedAt;
  } else {
    ui.dealAutosaveStatus = "error";
  }
  renderDealAutosaveState();
}

function scheduleDealAutosave(options = {}) {
  if (!dealForm || ui.isHydrating) {
    return;
  }

  ui.dealAutosaveStatus = "saving";
  renderDealAutosaveState();
  window.clearTimeout(dealAutosaveTimer);

  if (options.immediate) {
    saveDealAutosaveNow();
    return;
  }

  dealAutosaveTimer = window.setTimeout(() => {
    saveDealAutosaveNow();
  }, DEAL_FORM_AUTOSAVE_DELAY_MS);
}

function clearDealAutosaveEntry(key) {
  const store = readDealAutosaveStore();
  if (!store.drafts[key]) {
    return;
  }
  delete store.drafts[key];
  writeDealAutosaveStore(store);
}

function clearActiveDealAutosave(restoreBaseline = false) {
  window.clearTimeout(dealAutosaveTimer);
  dealAutosaveTimer = 0;
  clearDealAutosaveEntry(getActiveDealAutosaveKey());
  ui.dealAutosaveStatus = "idle";
  ui.dealAutosaveSavedAt = "";
  ui.dealAutosaveRestored = false;
  if (restoreBaseline && ui.dealAutosaveBaseline) {
    applyDealFormSnapshot(ui.dealAutosaveBaseline);
  }
  renderDealAutosaveState();
}

function restoreActiveDealAutosave() {
  const entry = getDealAutosaveEntry();
  if (!entry) {
    setBanner("No draft autosave is available for this deal workspace.", "warn");
    return;
  }

  const mergedSnapshot = {};
  Object.values(entry.sections || {}).forEach((section) => {
    Object.assign(mergedSnapshot, section.data || {});
  });

  applyDealFormSnapshot(mergedSnapshot);
  ui.dealAutosaveRestored = true;
  ui.dealAutosaveStatus = "saved";
  ui.dealAutosaveSavedAt = entry.savedAt || "";
  renderDealAutosaveState();
  setBanner(`Draft restored for ${entry.summary?.deal || entry.summary?.client || "this deal workspace"}.`, "success");
}

function maybeRestoreActiveDealAutosave() {
  const entry = getDealAutosaveEntry();
  if (!entry) {
    renderDealAutosaveState();
    return false;
  }

  const shouldAutoRestore = Boolean(ui.editingDealId) || !activeDealAutosaveHasChanges();
  if (!shouldAutoRestore) {
    renderDealAutosaveState();
    return false;
  }

  const mergedSnapshot = {};
  Object.values(entry.sections || {}).forEach((section) => {
    Object.assign(mergedSnapshot, section.data || {});
  });
  applyDealFormSnapshot(mergedSnapshot);
  ui.dealAutosaveRestored = true;
  ui.dealAutosaveStatus = "saved";
  ui.dealAutosaveSavedAt = entry.savedAt || "";
  renderDealAutosaveState();
  return true;
}

function formatAutosaveTimestamp(value) {
  if (!value) {
    return "";
  }

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function renderDealAutosaveState() {
  if (!elements.dealAutosaveBadge || !elements.dealAutosaveCopy || !elements.dealAutosaveSections) {
    return;
  }

  const entry = getDealAutosaveEntry();
  const hasDraft = Boolean(entry);
  const currentSnapshot = captureDealFormSnapshot();
  const baseline = ui.dealAutosaveBaseline || {};
  const hasPendingChanges = !snapshotsEqual(currentSnapshot, baseline);

  let badgeText = "Autosave ready";
  let badgeClass = "pill neutral";
  let copyText = "Drafts are saved in this browser by section while you work on the deal.";

  if (ui.dealAutosaveStatus === "saving") {
    badgeText = "Autosaving…";
    badgeClass = "pill info";
    copyText = "Section updates are being written to this browser draft.";
  } else if (ui.dealAutosaveStatus === "error") {
    badgeText = "Autosave unavailable";
    badgeClass = "pill neutral";
    copyText = "This browser blocked draft autosave. Keep an eye on manual save for this deal.";
  } else if (hasDraft) {
    badgeText = ui.dealAutosaveSavedAt ? `Saved ${formatAutosaveTimestamp(ui.dealAutosaveSavedAt)}` : "Draft saved";
    badgeClass = "pill success";
    copyText = ui.dealAutosaveRestored
      ? "The current deal form includes a restored browser draft, grouped by section."
      : "A browser draft exists for this deal workspace. Restore it or continue from the live form.";
  } else if (hasPendingChanges) {
    badgeText = "Draft pending";
    badgeClass = "pill info";
    copyText = "Changes are different from the current baseline and will autosave shortly.";
  }

  elements.dealAutosaveBadge.className = badgeClass;
  elements.dealAutosaveBadge.textContent = badgeText;
  elements.dealAutosaveCopy.textContent = copyText;
  elements.restoreDealDraftButton.disabled = !hasDraft;
  elements.discardDealDraftButton.disabled = !hasDraft && !hasPendingChanges;

  elements.dealAutosaveSections.innerHTML = DEAL_FORM_SECTION_DEFS.map(([sectionId, label]) => {
    const currentSection = getSectionSnapshot(currentSnapshot, sectionId);
    const baselineSection = getSectionSnapshot(baseline, sectionId);
    const entrySection = entry?.sections?.[sectionId];
    const changedNow = !snapshotsEqual(currentSection, baselineSection);
    const sectionSaved = entrySection && !snapshotsEqual(entrySection.data || {}, baselineSection);
    const stateLabel = ui.dealAutosaveStatus === "saving" && changedNow ? "Saving…" : sectionSaved ? `Saved ${formatAutosaveTimestamp(entrySection.updatedAt)}` : changedNow ? "Pending" : "Ready";
    const pillClass = ui.dealAutosaveStatus === "saving" && changedNow ? "deal-autosave-pill is-active" : sectionSaved ? "deal-autosave-pill is-saved" : "deal-autosave-pill is-empty";
    return `<div class="${pillClass}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(stateLabel)}</span></div>`;
  }).join("");
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
    followUpCadence: "Biweekly",
    nextFollowUpDate: "",
    followUpOwner: "",
    followUpNotes: "",
    followUpNotificationsEnabled: true,
    handover: "",
    brands: "",
    entityInfo: "",
    url: "",
    jira: "",
    ddTicket: "",
    skype: "",
    integrationEmail: "",
    companyName: "",
    companyRegistrationNumber: "",
    companyRegisteredAddress: "",
    companyLegalRepresentative: "",
    companyLicense: "",
    invoiceEmail: "",
    supportEmail: "",
    managementEmail: "",
    ddContactName: "",
    ddContactEmail: "",
    legalRepresentativeName: "",
    legalRepresentativeId: "",
    legalRepresentativeAddress: "",
    legalRepresentativeEmail: "",
    clientBased: "",
    otherLiveSuppliers: "",
    integrationTeam: "",
    teamsGroup: "",
    integrationRequest: "",
    legalSignoffRequest: "",
    otherInfo: "",
    documentClientName: "",
    proposalValidityDays: 30,
    proposalValidUntil: "",
    proposalRequest: "",
    negotiatedProducts: "",
    activationRequirements: "",
    pricingBase: "",
    deductionTerms: "",
    commercialTerms: "",
    commercialSchedule: "",
    negotiationScope: "",
    setupFeeStatus: "",
    setupFeeAmount: "",
    marketingCommitments: "",
    liveGamesTopPosition: "",
    slotsTopPosition: "",
    deductionsAllowed: "",
    bonusCap: "",
    gamingTax: "",
    withholdingTax: "",
    advancePayment: "",
    creditNotes: "",
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
      email: "admin@cubeone.local",
      role: "Administrator",
      status: "Active",
      team: "Revenue Operations",
      marketFocus: "LATAM",
    }),
    normalizeUser({
      id: "user-manager",
      fullName: "Commercial Manager",
      email: "manager@cubeone.local",
      role: "Sales Manager",
      status: "Active",
      team: "Commercial",
      marketFocus: "Mexico, Peru, Panama",
    }),
    normalizeUser({
      id: "user-ops",
      fullName: "Integration Ops",
      email: "ops@cubeone.local",
      role: "Revenue Ops",
      status: "Active",
      team: "Operations",
      marketFocus: "Integration and Go Live",
    }),
  ];
}

function createDefaultWorkspace(year = new Date().getFullYear()) {
  return normalizeWorkspace({
    workspaceName: "Cube One LATAM",
    organizationName: "Evolution LATAM",
    adminName: "LATAM Workspace Admin",
    adminEmail: "admin@cubeone.local",
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
    signedEta: normalizeDateInput(input.signedEta),
    liveSince: normalizeDateInput(input.liveSince),
    lastFollowUp: normalizeDateInput(input.lastFollowUp),
    followUpCadence: FOLLOW_UP_CADENCE_OPTIONS.includes(cleanText(input.followUpCadence)) ? cleanText(input.followUpCadence) : base.followUpCadence,
    nextFollowUpDate: normalizeDateInput(input.nextFollowUpDate),
    followUpOwner: cleanText(input.followUpOwner),
    followUpNotes: cleanText(input.followUpNotes),
    followUpNotificationsEnabled:
      input.followUpNotificationsEnabled === false || cleanText(input.followUpNotificationsEnabled).toLowerCase() === "false"
        ? false
        : Boolean(input.followUpNotificationsEnabled ?? base.followUpNotificationsEnabled),
    brands: cleanText(input.brands),
    entityInfo: cleanText(input.entityInfo),
    url: cleanText(input.url),
    jira: cleanText(input.jira),
    ddTicket: cleanText(input.ddTicket),
    skype: cleanText(input.skype),
    integrationEmail: cleanText(input.integrationEmail),
    companyName: cleanText(input.companyName),
    companyRegistrationNumber: cleanText(input.companyRegistrationNumber),
    companyRegisteredAddress: cleanText(input.companyRegisteredAddress),
    companyLegalRepresentative: cleanText(input.companyLegalRepresentative),
    companyLicense: cleanText(input.companyLicense),
    invoiceEmail: cleanText(input.invoiceEmail),
    supportEmail: cleanText(input.supportEmail),
    managementEmail: cleanText(input.managementEmail),
    ddContactName: cleanText(input.ddContactName),
    ddContactEmail: cleanText(input.ddContactEmail),
    legalRepresentativeName: cleanText(input.legalRepresentativeName),
    legalRepresentativeId: cleanText(input.legalRepresentativeId),
    legalRepresentativeAddress: cleanText(input.legalRepresentativeAddress),
    legalRepresentativeEmail: cleanText(input.legalRepresentativeEmail),
    clientBased: cleanText(input.clientBased),
    otherLiveSuppliers: cleanText(input.otherLiveSuppliers),
    integrationTeam: cleanText(input.integrationTeam),
    teamsGroup: cleanText(input.teamsGroup),
    integrationRequest: cleanText(input.integrationRequest),
    legalSignoffRequest: cleanText(input.legalSignoffRequest),
    otherInfo: cleanText(input.otherInfo),
    documentClientName: cleanText(input.documentClientName),
    proposalValidityDays: Math.max(1, toNullableNumber(input.proposalValidityDays) || base.proposalValidityDays),
    proposalValidUntil: normalizeDateInput(input.proposalValidUntil),
    proposalRequest: cleanText(input.proposalRequest),
    negotiatedProducts: cleanText(input.negotiatedProducts),
    activationRequirements: cleanText(input.activationRequirements),
    pricingBase: cleanText(input.pricingBase),
    deductionTerms: cleanText(input.deductionTerms),
    commercialTerms: cleanText(input.commercialTerms),
    commercialSchedule: cleanMultilineText(input.commercialSchedule),
    negotiationScope: cleanText(input.negotiationScope),
    setupFeeStatus: cleanText(input.setupFeeStatus),
    setupFeeAmount: cleanText(input.setupFeeAmount),
    marketingCommitments: cleanMultilineText(input.marketingCommitments),
    liveGamesTopPosition: cleanText(input.liveGamesTopPosition),
    slotsTopPosition: cleanText(input.slotsTopPosition),
    deductionsAllowed: cleanMultilineText(input.deductionsAllowed),
    bonusCap: cleanText(input.bonusCap),
    gamingTax: cleanText(input.gamingTax),
    withholdingTax: cleanText(input.withholdingTax),
    advancePayment: cleanText(input.advancePayment),
    creditNotes: cleanMultilineText(input.creditNotes),
    updates: cleanText(input.updates),
    prospectDate: normalizeDateInput(input.prospectDate),
    offerDate: normalizeDateInput(input.offerDate),
    ddDate: normalizeDateInput(input.ddDate),
    integrationDate: normalizeDateInput(input.integrationDate),
    legalApprovalDate: normalizeDateInput(input.legalApprovalDate),
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
    workspaceName: cleanText(source.workspaceName) || "Cube One LATAM",
    organizationName: cleanText(source.organizationName) || "Evolution LATAM",
    adminName: cleanText(source.adminName) || "LATAM Workspace Admin",
    adminEmail: cleanText(source.adminEmail) || "admin@cubeone.local",
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
    companyName: "",
    companyRegistrationNumber: "",
    companyRegisteredAddress: "",
    companyLegalRepresentative: "",
    companyLicense: "",
    invoiceEmail: "",
    supportEmail: "",
    managementEmail: "",
    ddContactName: "",
    ddContactEmail: "",
    legalRepresentativeName: "",
    legalRepresentativeId: "",
    legalRepresentativeAddress: "",
    legalRepresentativeEmail: "",
    clientBased: "",
    otherLiveSuppliers: "",
    integrationTeam: "",
    teamsGroup: "",
    integrationRequest: "",
    otherInfo: "",
    documentClientName: "",
    proposalValidityDays: 30,
    proposalValidUntil: "",
    proposalRequest: "",
    negotiatedProducts: "",
    activationRequirements: "",
    pricingBase: "",
    deductionTerms: "",
    commercialTerms: "",
    commercialSchedule: "",
    negotiationScope: "",
    setupFeeStatus: "",
    setupFeeAmount: "",
    marketingCommitments: "",
    liveGamesTopPosition: "",
    slotsTopPosition: "",
    deductionsAllowed: "",
    bonusCap: "",
    gamingTax: "",
    withholdingTax: "",
    advancePayment: "",
    creditNotes: "",
    updates: "",
    prospectDate: "",
    offerDate: "",
    ddDate: "",
    integrationDate: "",
    legalApprovalDate: "",
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
  rebuildDerivedState();
  synchronizeTaskSequence();
  ensureActiveUser();
  renderGlobalFilters();
  renderViewState();
  renderWorkspaceChrome();
  renderCompanyFinder();
  renderDealFormAssist();
  renderModuleFlow();
  renderWorkflowCommandBar();
  renderHeroMetrics();
  renderDashboard();
  renderCrmView();
  renderPipeline();
  renderRequestsView();
  renderTargets();
  renderTasks();
  renderCampaigns();
  renderAdminView();
  renderKpiCatalogue();
  renderCompanyProfileDrawer();
}

function setLoadingState(isLoading, title = "Loading workspace", copy = "Syncing Cube One from the live local workspace.") {
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

  elements.dealModalShell?.toggleAttribute("hidden", !ui.dealModalOpen);
  elements.dealModalShell?.setAttribute("aria-hidden", ui.dealModalOpen ? "false" : "true");
  document.body.classList.toggle("deal-modal-open", ui.dealModalOpen);
  renderOperatingFlowVisibility();
}

function getViewContainer(viewName) {
  return views.find((view) => view.dataset.view === viewName) || null;
}

function scrollToViewTarget(viewName, selector = "") {
  const container = getViewContainer(viewName);
  if (!container) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return null;
  }

  const targetSelector = selector || VIEW_SCROLL_TARGETS[viewName] || "";
  const target = targetSelector ? container.querySelector(targetSelector) : container;
  const fallback = target || container;

  fallback.scrollIntoView({ block: "start", behavior: "smooth" });
  return fallback;
}

function activateView(viewName, options = {}) {
  const nextView = cleanText(viewName) || "dashboard";
  ui.activeView = nextView;
  renderViewState();

  if (options.scroll === false) {
    return;
  }

  window.requestAnimationFrame(() => {
    const target = scrollToViewTarget(nextView, options.targetSelector || "");
    pulseNavigationTarget(target, options);
  });
}

function resolveNavigationHighlightTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return null;
  }
  return target.closest(".panel, .workflow-command-shell, .module-flow-shell, .company-command-bar, .view-nav-shell") || target;
}

function focusFirstEditableField(target) {
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const field = target.matches("input, select, textarea")
    ? target
    : target.querySelector("input:not([type='hidden']):not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled]):not([readonly])");

  if (field instanceof HTMLElement) {
    field.focus({ preventScroll: true });
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.select?.();
    }
  }
}

function pulseNavigationTarget(target, options = {}) {
  const resolvedTarget = target instanceof HTMLElement ? target : null;
  const highlightPanel = resolveNavigationHighlightTarget(resolvedTarget);
  const nodes = [];

  if (highlightPanel) {
    nodes.push({ node: highlightPanel, className: "is-nav-target" });
  }
  if (options.editMode && resolvedTarget && resolvedTarget !== highlightPanel) {
    nodes.push({ node: resolvedTarget, className: "is-edit-target" });
  }

  ui.navHighlightNodes.forEach(({ node, className }) => node?.classList?.remove(className));
  ui.navHighlightNodes = nodes;

  nodes.forEach(({ node, className }) => node.classList.add(className));
  window.clearTimeout(ui.navHighlightTimer);
  ui.navHighlightTimer = window.setTimeout(() => {
    ui.navHighlightNodes.forEach(({ node, className }) => node?.classList?.remove(className));
    ui.navHighlightNodes = [];
  }, NAV_HIGHLIGHT_DURATION_MS);

  if (options.focusField) {
    window.setTimeout(() => focusFirstEditableField(resolvedTarget || highlightPanel), 260);
  }
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
  if (elements.workspaceDropdownTitle) {
    elements.workspaceDropdownTitle.textContent = workspace.workspaceName;
  }
  if (elements.workspaceDropdownCopy) {
    elements.workspaceDropdownCopy.textContent = activeUser
      ? `${activeUser.fullName} · ${activeUser.role}`
      : `${workspace.organizationName} · ${workspace.subscriptionPlan}`;
  }
  renderWorkspaceHistoryPreview();

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

function formatHistoryTimestamp(value) {
  if (!value) {
    return "No recent changes";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No recent changes";
  }

  const deltaMs = Date.now() - date.getTime();
  const deltaMinutes = Math.max(0, Math.round(deltaMs / 60000));

  if (deltaMinutes < 1) {
    return "Just now";
  }
  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  return formatDate(value);
}

function renderWorkspaceHistoryPreview() {
  const history = Array.isArray(state.history) ? state.history.slice(0, 3) : [];
  const latestEntry = history[0];

  if (elements.workspaceHistorySummary) {
    elements.workspaceHistorySummary.textContent = history.length ? `${history.length} events tracked` : "History starting";
  }
  if (elements.workspaceHistoryCopy) {
    elements.workspaceHistoryCopy.textContent = latestEntry
      ? `${formatHistoryTimestamp(latestEntry.createdAt)} · ${latestEntry.action}`
      : "Changes are tracked as the workspace moves.";
  }
  if (elements.workspaceHistoryPreview) {
    elements.workspaceHistoryPreview.innerHTML = history.length
      ? history
          .map(
            (entry) => `
              <article class="history-mini-item">
                <strong>${escapeHtml(entry.action)}</strong>
                <span>${escapeHtml(entry.detail)}</span>
                <small>${escapeHtml(formatHistoryTimestamp(entry.createdAt))}</small>
              </article>
            `
          )
          .join("")
      : '<div class="history-mini-empty">Your next save or stage move will appear here.</div>';
  }
}

function renderOperatingFlowVisibility() {
  const shouldCollapse = ui.operatingFlowCollapsed && window.innerWidth > 960;
  elements.operatingFlowShell?.classList.toggle("is-collapsed", shouldCollapse);
  elements.operatingFlowToggle?.classList.toggle("is-visible", shouldCollapse);
  elements.operatingFlowToggle?.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
}

function handleOperatingFlowScroll() {
  if (window.innerWidth <= 960) {
    if (ui.operatingFlowCollapsed) {
      ui.operatingFlowCollapsed = false;
      renderOperatingFlowVisibility();
    }
    ui.lastScrollY = window.scrollY || 0;
    return;
  }

  const currentScrollY = window.scrollY || 0;
  const delta = currentScrollY - ui.lastScrollY;

  if (currentScrollY <= 140) {
    if (ui.operatingFlowCollapsed) {
      ui.operatingFlowCollapsed = false;
      renderOperatingFlowVisibility();
    }
    ui.lastScrollY = currentScrollY;
    return;
  }

  if (delta > 14 && !ui.operatingFlowCollapsed) {
    ui.operatingFlowCollapsed = true;
    renderOperatingFlowVisibility();
  } else if (delta < -14 && ui.operatingFlowCollapsed) {
    ui.operatingFlowCollapsed = false;
    renderOperatingFlowVisibility();
  }

  ui.lastScrollY = currentScrollY;
}

function handleOperatingFlowResize() {
  if (window.innerWidth <= 960 && ui.operatingFlowCollapsed) {
    ui.operatingFlowCollapsed = false;
  }
  renderOperatingFlowVisibility();
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
              ${renderCompanyProfileTrigger(
                deal,
                getPrimaryOperatorName(deal),
                deal.client || deal.deal || "No client name"
              )}
            </div>
          </td>
          <td>${escapeHtml(deal.market || "N/A")}</td>
          <td>${escapeHtml(deal.segment || "N/A")}</td>
          <td>${escapeHtml(getDealOwner(deal) || "Unassigned")}</td>
          <td><span class="pill ${taskStatusPillClass(isBlockedDeal(deal) ? "Blocked" : "Open")}">${escapeHtml(getDealVisibleStage(deal) || "N/A")}</span></td>
          <td>${escapeHtml(formatScoreValue(deal.opportunityScore))}</td>
          <td>${renderPriorityBadge(deal.priorityClass || deal.targetPriority)}</td>
          <td>${formatCurrency(getRevenuePotentialAmount(deal))}</td>
          <td>${openTaskCount}</td>
          <td>${escapeHtml(deal.actionItems || deal.statusText || "No next action defined")}</td>
          <td>
            <div class="row-actions">
              ${renderDealWorkflowDocumentButtons(deal, {
                className: "icon-button",
                includeTask: true,
                includeCampaign: true,
                includeEdit: true,
                editLabel: "Edit Deal",
              })}
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
  const visibleTasks = getScopedTasks();
  const usesValue = hasAnyDealValue(scopedDeals);
  const stageDurationMap = getStageDurationMap(scopedDeals);
  const effectiveStageMap = new Map(scopedDeals.map((deal) => [deal.id, getDealVisibleStage(deal)]));
  const stageStats = VIEW_STAGE_ORDER.map((stage) => {
    const deals = scopedDeals.filter((deal) => effectiveStageMap.get(deal.id) === stage);
    return {
      stage,
      count: deals.length,
      value: sumValues(deals.map((deal) => getDealValueAmount(deal))),
      weightedCount: sumValues(deals.map((deal) => getForecastProbability(deal))),
    };
  });

  renderCommandCenter(scopedDeals, visibleTasks, stageStats, stageDurationMap);

  const totalDeals = scopedDeals.length;
  elements.dashboardStageSummary.textContent = `${totalDeals} deals · ${buildTimeWindowLabel()}`;
  elements.stageOverview.innerHTML = stageStats
    .map((stat) => {
      const stageDeals = scopedDeals.filter((deal) => effectiveStageMap.get(deal.id) === stat.stage);
      const stuckCount = stageDeals.filter((deal) => getStageSlaState(deal).tone === "stuck").length;
      const atRiskCount = stageDeals.filter((deal) => getStageSlaState(deal).tone === "at-risk").length;
      const percentage = totalDeals === 0 ? 0 : Math.round((stat.count / totalDeals) * 100);
      const stageDuration = stageDurationMap.get(stat.stage);
      const metricText = usesValue ? formatCurrency(stat.value) : `${formatForecastUnits(stat.weightedCount)} weighted`;
      const durationText = stageDuration ? `${formatDaysMetric(stageDuration.averageDays)} avg` : "";
      const pressureText = stuckCount > 0 ? `${stuckCount} stuck` : atRiskCount > 0 ? `${atRiskCount} at risk` : "Healthy flow";
      const cardTone = stuckCount > 0 ? "is-critical" : atRiskCount > 0 ? "is-warning" : stat.count > 0 ? "is-healthy" : "is-empty";
      return `
        <button
          type="button"
          class="stage-card ${stageClassName(stat.stage)} ${cardTone} ${stat.count > 0 ? "is-clickable" : "is-static"}"
          ${stat.count > 0 ? `data-action="open-stage-funnel" data-stage="${escapeAttribute(stat.stage)}"` : "disabled"}
        >
          <header>
            <span class="chip">${escapeHtml(stat.stage)}</span>
            <span>${percentage}%</span>
          </header>
          <div class="stage-card-main">
            <strong>${stat.count}</strong>
            <span class="stage-card-value">${escapeHtml(metricText)}</span>
          </div>
          <small>${escapeHtml(durationText || "No cadence data yet")}</small>
          <div class="stage-card-pressure">
            <span>${escapeHtml(pressureText)}</span>
            <span>${escapeHtml(stat.count > 0 ? "Open stage" : "Waiting for deals")}</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" style="width: ${Math.max(percentage, stat.count > 0 ? 8 : 0)}%"></div>
          </div>
        </button>
      `;
    })
    .join("");

  elements.signalLegal.textContent = String(scopedDeals.filter((deal) => effectiveStageMap.get(deal.id) === "Legal").length);
  elements.signalDd.textContent = String(scopedDeals.filter((deal) => effectiveStageMap.get(deal.id) === "DD").length);
  elements.signalIntegration.textContent = String(scopedDeals.filter((deal) => effectiveStageMap.get(deal.id) === "Integration").length);
  elements.signalNewTraffic.textContent = String(scopedDeals.filter((deal) => effectiveStageMap.get(deal.id) === "Live").length);

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

function renderCommandCenter(deals, tasks = [], stageStats = [], stageDurationMap = new Map()) {
  if (
    !elements.commandKpiGrid ||
    !elements.fixNowAlerts ||
    !elements.commandActionsToday ||
    !elements.commandPipelineBars ||
    !elements.commandTimePressure ||
    !elements.commandMarketBreakdown ||
    !elements.commandOperatorBreakdown ||
    !elements.commandUpcomingGoLives
  ) {
    return;
  }

  const activeDeals = deals.filter((deal) => !isInactiveDeal(deal));
  const scopedTasks = Array.isArray(tasks) ? tasks : [];
  const activeUser = getActiveUser();
  const myTasks = getMyActionTasks(scopedTasks, activeUser);
  const taskBuckets = getActionBuckets(myTasks);
  const fixNowAlerts = getFixNowAlerts(activeDeals, scopedTasks);
  const revenue = getCockpitRevenue(activeDeals);
  const stageData = getPipelineStageData(activeDeals, stageStats);
  const upcoming = getUpcomingGoLiveDeals(activeDeals, 60);

  renderCockpitKpis(revenue, fixNowAlerts, taskBuckets, activeDeals, activeUser);
  renderFixNowPanel(fixNowAlerts);
  renderActionsTodayPanel(taskBuckets, activeUser);
  renderPipelineValueChart(stageData);
  renderTimePressurePanel(stageDurationMap);
  renderMarketOperatorBreakdown(activeDeals);
  renderUpcomingGoLives(upcoming);
}

function getDealExecutionGaps(deal) {
  const gaps = [];
  if (!cleanText(deal.actionItems || deal.followUpNotes || deal.updates || deal.statusText || deal.comments)) {
    gaps.push("next action");
  }
  if (!cleanText(deal.followUpOwner || getDealOwner(deal))) {
    gaps.push("owner");
  }
  if (!cleanText(deal.nextFollowUpDate)) {
    gaps.push("due date");
  }
  return gaps;
}

function isDealRevenueAtRisk(deal) {
  const sla = getStageSlaState(deal);
  if (["stuck", "at-risk"].includes(sla.tone)) {
    return true;
  }
  if (isBlockedDeal(deal)) {
    return true;
  }
  return getDealExecutionGaps(deal).length > 0;
}

function getFixNowAlerts(deals, tasks = []) {
  const alerts = [];

  deals.forEach((deal) => {
    const dealName = getPrimaryOperatorName(deal);
    const stage = cleanText(deal.stage) || "No stage";
    const sla = getStageSlaState(deal);
    const hygieneGaps = getDealExecutionGaps(deal);
    const impactValue = getForecastValue(deal);
    const impactLabel = impactValue > 0 ? ` · ${formatCompactCurrency(impactValue)} weighted` : "";

    if (sla.tone === "stuck") {
      alerts.push({
        id: `sla-${deal.id}`,
        priority: 0,
        tone: "danger",
        title: `${dealName} is over SLA`,
        message: `${stage} needs intervention now.`,
        detail: `${stage}: ${sla.days} / ${sla.limit} days${impactLabel}`,
        dealId: deal.id,
        impactValue,
      });
    } else if (sla.tone === "at-risk") {
      alerts.push({
        id: `sla-risk-${deal.id}`,
        priority: 4,
        tone: "warning",
        title: `${dealName} is nearing SLA`,
        message: `${stage} is approaching the limit.`,
        detail: `${stage}: ${sla.days} / ${sla.limit} days${impactLabel}`,
        dealId: deal.id,
        impactValue,
      });
    }

    if (isBlockedDeal(deal) && sla.tone !== "stuck") {
      alerts.push({
        id: `blocked-${deal.id}`,
        priority: 2,
        tone: "danger",
        title: `${dealName} is blocked`,
        message: `${stage} has a blocker that needs resolution.`,
        detail: `${deal.market || "No market"} · unblock the current dependency${impactLabel}`,
        dealId: deal.id,
        impactValue,
      });
    }

    if (hygieneGaps.length > 0) {
      alerts.push({
        id: `missing-${deal.id}`,
        priority: 3,
        tone: "danger",
        title: `${dealName} is missing execution inputs`,
        message: `Complete ${hygieneGaps.join(", ")} to keep the deal moving.`,
        detail: `${stage} · ${deal.market || "No market"}${impactLabel}`,
        dealId: deal.id,
        impactValue,
      });
    }
  });

  tasks
    .filter((task) => task.status !== "Done" && isDatePast(task.dueDate))
    .forEach((task) => {
      const relatedDeal = getTaskRelatedDeal(task);
      const impactValue = relatedDeal ? getForecastValue(relatedDeal) : 0;
      const impactLabel = impactValue > 0 ? ` · ${formatCompactCurrency(impactValue)} weighted` : "";
      alerts.push({
        id: `task-${task.id}`,
        priority: 1,
        tone: "danger",
        title: task.title || "Overdue action",
        message: `${task.owner || "No owner"} still owes this action.`,
        detail: `${relatedDeal ? getPrimaryOperatorName(relatedDeal) : task.deal || task.client || task.operator || "Unlinked"} · due ${formatDate(task.dueDate)}${impactLabel}`,
        taskId: task.id,
        dealId: relatedDeal?.id || "",
        impactValue,
      });
    });

  const toneWeight = { danger: 0, warning: 1, info: 2 };
  return alerts
    .sort((left, right) => {
      const toneDelta = (toneWeight[left.tone] ?? 3) - (toneWeight[right.tone] ?? 3);
      const priorityDelta = (left.priority ?? 9) - (right.priority ?? 9);
      const impactDelta = Number(right.impactValue || 0) - Number(left.impactValue || 0);
      return priorityDelta || toneDelta || impactDelta || left.title.localeCompare(right.title);
    })
    .slice(0, 8);
}

function getCockpitRevenue(deals) {
  return deals.reduce(
    (accumulator, deal) => {
      const pipelineValue = getDealValueAmount(deal);
      const weightedValue = getForecastValue(deal);
      const stage = cleanText(deal.stage);

      accumulator.pipeline += pipelineValue;
      accumulator.weighted += weightedValue;

      if (["DD", "Integration", "Legal Approval", "Go Live", "Live", "Handover"].includes(stage)) {
        accumulator.commit += weightedValue;
      }

      if (isDealRevenueAtRisk(deal)) {
        accumulator.atRisk += weightedValue;
        accumulator.atRiskDeals += 1;
      }

      return accumulator;
    },
    { pipeline: 0, weighted: 0, commit: 0, atRisk: 0, atRiskDeals: 0 }
  );
}

function getPipelineStageData(deals, stageStats = []) {
  const stats = stageStats.length
    ? stageStats
    : VIEW_STAGE_ORDER.map((stage) => {
        const stageDeals = deals.filter((deal) => getDealVisibleStage(deal) === stage);
        return {
          stage,
          count: stageDeals.length,
          value: sumValues(stageDeals.map((deal) => getDealValueAmount(deal))),
        };
      });

  return stats
    .map((item) => {
      const stageDeals = deals.filter((deal) => getDealVisibleStage(deal) === item.stage);
      return {
        stage: item.stage,
        count: item.count,
        value: Number(item.value || 0),
        weightedValue: sumValues(stageDeals.map((deal) => getForecastValue(deal))),
        stuckCount: stageDeals.filter((deal) => getStageSlaState(deal).tone === "stuck").length,
      };
    })
    .filter((item) => item.count > 0);
}

function formatLastUpdatedLabel(value) {
  if (!value) {
    return "Last update not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Last update not available";
  }

  return `Last update ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)}`;
}

function renderCockpitKpis(revenue, alerts, taskBuckets, deals, activeUser = getActiveUser()) {
  const fixes = alerts.filter((item) => item.tone === "danger").length;
  const actionsToday = taskBuckets.overdue.length + taskBuckets.today.length;
  const goLivesThisMonth = deals.filter((deal) => isGoLiveThisMonth(deal)).length;
  const weightedForecastNote = `Projected weighted revenue from Go Live ETA or today through ${getForecastPeriodEndLabel()} · ${formatLastUpdatedLabel(serverMeta.lastUpdatedAt)}`;
  const atRiskNote = revenue.atRiskDeals > 0
    ? `${revenue.atRiskDeals} deals flagged by SLA, blockers, or missing execution inputs`
    : "No revenue is currently flagged at risk in the visible scope";
  const ownerLabel = getShortUserName(activeUser) || "team";

  elements.commandCenterSummary.textContent = `${fixes} fix now · ${actionsToday} actions for ${ownerLabel} today · ${goLivesThisMonth} go lives this month`;
  elements.commandKpiGrid.innerHTML = [
    ["Pipeline", formatCurrency(revenue.pipeline), "Total open value across visible deals", "forecast"],
    ["Weighted Forecast", formatCurrency(revenue.weighted), weightedForecastNote, "forecast"],
    ["Commit", formatCurrency(revenue.commit), "High-confidence execution value", "golive"],
    ["At Risk", formatCurrency(revenue.atRisk), atRiskNote, "risk"],
  ]
    .map(([label, value, note, tone]) => `
      <article class="command-kpi-card tone-${escapeAttribute(tone)}" title="${escapeAttribute(note)}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(note)}</small>
      </article>
    `)
    .join("");
}

function renderMarketOperatorBreakdown(deals) {
  renderCommandMarketBreakdown(deals);
  renderCommandOperatorBreakdown(deals);
}

function renderCommandMarketBreakdown(deals) {
  const rows = buildForecastMarketRows(deals).slice(0, 4);
  if (!rows.length) {
    elements.commandMarketBreakdown.innerHTML = '<div class="empty-state">No market exposure is visible in the active scope.</div>';
    return;
  }

  elements.commandMarketBreakdown.innerHTML = rows
    .map((row) => {
      const riskValue = sumValues(
        deals
          .filter((deal) => (deal.market || "Unknown") === row.market && isDealRevenueAtRisk(deal))
          .map((deal) => getForecastValue(deal))
      );
      return `
        <button
          type="button"
          class="command-breakdown-card"
          data-action="open-forecast-market"
          data-market="${escapeAttribute(row.market)}"
        >
          <div class="command-breakdown-copy">
            <strong>${escapeHtml(row.market)}</strong>
            <small>${row.totalCount} deals · ${row.operatorCount} operators</small>
          </div>
          <div class="command-breakdown-metrics">
            <span>${escapeHtml(formatCompactCurrency(row.forecastValue))} weighted</span>
            <small>${riskValue > 0 ? `${formatCompactCurrency(riskValue)} at risk` : "No at-risk revenue"}</small>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderCommandOperatorBreakdown(deals) {
  const rows = buildForecastOperatorRows(deals).slice(0, 4);
  if (!rows.length) {
    elements.commandOperatorBreakdown.innerHTML = '<div class="empty-state">No operator concentration is visible in the active scope.</div>';
    return;
  }

  elements.commandOperatorBreakdown.innerHTML = rows
    .map((row) => {
      const riskValue = sumValues(
        deals
          .filter((deal) => getPrimaryOperatorName(deal) === row.operator && (deal.market || "Unknown") === row.market && isDealRevenueAtRisk(deal))
          .map((deal) => getForecastValue(deal))
      );
      return `
        <button
          type="button"
          class="command-breakdown-card"
          data-action="open-forecast-operator"
          data-market="${escapeAttribute(row.market)}"
          data-operator="${escapeAttribute(row.operator)}"
        >
          <div class="command-breakdown-copy">
            <strong>${escapeHtml(row.operator)}</strong>
            <small>${escapeHtml(row.market)} · ${escapeHtml(row.owner || "No owner assigned")}</small>
          </div>
          <div class="command-breakdown-metrics">
            <span>${escapeHtml(formatCompactCurrency(row.forecastValue))} weighted</span>
            <small>${riskValue > 0 ? `${formatCompactCurrency(riskValue)} at risk` : `${row.commitCount} commit`}</small>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderFixNowPanel(alerts) {
  elements.fixNowCount.textContent = `${alerts.length} alerts`;
  elements.fixNowAlerts.innerHTML = alerts.length
    ? alerts.map(renderFixNowAlertCard).join("")
    : '<div class="empty-state">No critical execution gaps under the active filters.</div>';
}

function renderFixNowAlertCard(item) {
  const toneClass = item.tone === "danger" ? "is-danger" : item.tone === "warning" ? "is-warn" : "is-info";
  const primaryAction = item.taskId
    ? `<button type="button" class="icon-button success" data-action="mark-task-done" data-id="${escapeAttribute(item.taskId)}">Mark Done</button>`
    : `<button type="button" class="icon-button" data-action="edit-deal" data-id="${escapeAttribute(item.dealId)}">Open Deal</button>`;
  const secondaryAction = item.taskId && item.dealId
    ? `<button type="button" class="icon-button" data-action="open-company-profile" data-id="${escapeAttribute(item.dealId)}">Open Deal</button>`
    : "";

  return `
    <article class="execution-alert-card ${toneClass}">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.message)}</p>
        <small>${escapeHtml(item.detail)}</small>
      </div>
      <div class="execution-alert-actions">
        ${primaryAction}
        ${secondaryAction}
      </div>
    </article>
  `;
}

function buildActionsTodaySummary(taskBuckets, activeUser = getActiveUser()) {
  const ownerLabel = getShortUserName(activeUser) || "team";
  const overdueCount = taskBuckets.overdue.length;
  const todayCount = taskBuckets.today.length;
  const blockedCount = taskBuckets.blocked.length;
  const upcomingCount = taskBuckets.upcoming.length;
  const primaryTask = getPrimaryActionTask(taskBuckets);

  if (!primaryTask) {
    return {
      tone: "success",
      title: `Today, ${ownerLabel}: no urgent actions`,
      message: "You are clear on overdue and due-today work in the current view.",
      detail: upcomingCount > 0
        ? `${upcomingCount} upcoming actions remain queued next.`
        : "No open actions are assigned right now.",
    };
  }

  const primaryTaskLabel = buildActionTaskLabel(primaryTask);
  const primaryDeal = getTaskRelatedDeal(primaryTask);
  const weightedValue = primaryDeal ? getForecastValue(primaryDeal) : 0;
  const weightedLabel = weightedValue > 0 ? `${formatCompactCurrency(weightedValue)} weighted` : "No weighted revenue linked";

  if (overdueCount > 0) {
    return {
      tone: "danger",
      title: `Today, ${ownerLabel}: clear overdue work first`,
      message: `${overdueCount} overdue action${overdueCount === 1 ? "" : "s"} need attention before anything else.${todayCount > 0 ? ` Then close ${todayCount} due today.` : ""}`,
      detail: `Start with ${primaryTaskLabel} · ${weightedLabel}`,
    };
  }

  if (todayCount > 0) {
    return {
      tone: "warning",
      title: `Today, ${ownerLabel}: close what is due today`,
      message: `${todayCount} action${todayCount === 1 ? "" : "s"} are due today.${blockedCount > 0 ? ` ${blockedCount} blocked item${blockedCount === 1 ? " is" : "s are"} waiting behind them.` : ""}`,
      detail: `Start with ${primaryTaskLabel} · ${weightedLabel}`,
    };
  }

  if (blockedCount > 0) {
    return {
      tone: "neutral",
      title: `Today, ${ownerLabel}: unblock stalled work`,
      message: `${blockedCount} blocked action${blockedCount === 1 ? "" : "s"} need a decision or dependency cleared.`,
      detail: `Start with ${primaryTaskLabel} · ${weightedLabel}`,
    };
  }

  return {
    tone: "success",
    title: `Today, ${ownerLabel}: stay ahead of the queue`,
    message: `${upcomingCount} scheduled action${upcomingCount === 1 ? "" : "s"} are next in line.`,
    detail: `Next up: ${primaryTaskLabel} · ${weightedLabel}`,
  };
}

function getPrimaryActionTask(taskBuckets) {
  return taskBuckets.overdue[0] || taskBuckets.today[0] || taskBuckets.blocked[0] || taskBuckets.upcoming[0] || null;
}

function buildActionTaskLabel(task) {
  const title = cleanText(task.title || task.nextStep) || "Untitled action";
  const relatedDeal = getTaskRelatedDeal(task);
  const scope = relatedDeal ? getPrimaryOperatorName(relatedDeal) : task.deal || task.client || task.operator || "No linked deal";
  return `${title} for ${scope}`;
}

function getShortUserName(user) {
  const name = cleanText(user?.fullName);
  return name ? name.split(/\s+/)[0] : "";
}

function getTaskPriorityWeight(task) {
  const priority = cleanText(task.priority);
  if (priority === "High") {
    return 0;
  }
  if (priority === "Medium") {
    return 1;
  }
  return 2;
}

function sortActionTasks(tasks = []) {
  return [...tasks].sort((left, right) => {
    const leftDelta = cleanText(left.dueDate) ? daysUntil(left.dueDate) : Number.POSITIVE_INFINITY;
    const rightDelta = cleanText(right.dueDate) ? daysUntil(right.dueDate) : Number.POSITIVE_INFINITY;
    const dueDelta = leftDelta - rightDelta;
    if (dueDelta !== 0) {
      return dueDelta;
    }

    const priorityDelta = getTaskPriorityWeight(left) - getTaskPriorityWeight(right);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    const leftImpact = getForecastValue(getTaskRelatedDeal(left) || {});
    const rightImpact = getForecastValue(getTaskRelatedDeal(right) || {});
    const impactDelta = rightImpact - leftImpact;
    if (impactDelta !== 0) {
      return impactDelta;
    }

    return cleanText(left.title).localeCompare(cleanText(right.title));
  });
}

function getMyActionTasks(tasks = getVisibleTasks(), activeUser = getActiveUser()) {
  const ownerName = cleanText(activeUser?.fullName).toLowerCase();
  if (!ownerName) {
    return sortActionTasks(tasks);
  }

  const owned = tasks.filter((task) => {
    if (cleanText(task.owner).toLowerCase() === ownerName) {
      return true;
    }

    const relatedDeal = getTaskRelatedDeal(task);
    const dealOwner = cleanText(relatedDeal?.followUpOwner || getDealOwner(relatedDeal)).toLowerCase();
    return Boolean(dealOwner) && dealOwner === ownerName;
  });
  return sortActionTasks(owned);
}

function renderActionsTodayPanel(taskBuckets, activeUser = getActiveUser()) {
  const sections = [
    ["Overdue", "danger", taskBuckets.overdue],
    ["Due Today", "warning", taskBuckets.today],
    ["Blocked", "neutral", taskBuckets.blocked],
    ["Upcoming", "success", taskBuckets.upcoming],
  ];
  const totalActions = sections.reduce((count, [, , tasks]) => count + tasks.length, 0);
  const summary = buildActionsTodaySummary(taskBuckets, activeUser);

  elements.commandActionsCount.textContent = `${totalActions} actions for ${getShortUserName(activeUser) || "team"}`;
  elements.commandActionsToday.innerHTML = `
    <section class="command-action-focus tone-${escapeAttribute(summary.tone)}">
      <strong>${escapeHtml(summary.title)}</strong>
      <p>${escapeHtml(summary.message)}</p>
      <small>${escapeHtml(summary.detail)}</small>
    </section>
    ${sections
    .map(([label, tone, tasks]) => `
      <section class="command-action-section tone-${escapeAttribute(tone)}">
        <header>
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(tasks.length)}</span>
        </header>
        <div class="command-action-stack">
          ${tasks.length ? tasks.slice(0, 4).map(renderCommandActionCard).join("") : `<div class="command-action-empty">No ${escapeHtml(label.toLowerCase())} actions.</div>`}
        </div>
      </section>
    `)
    .join("")}
  `;
}

function renderCommandActionCard(task) {
  const relatedDeal = getTaskRelatedDeal(task);
  const operator = relatedDeal ? getPrimaryOperatorName(relatedDeal) : task.deal || task.client || task.operator || "No linked deal";
  const contextParts = [relatedDeal?.market, relatedDeal?.stage, task.owner].filter(Boolean);
  const dueLabel = cleanText(task.dueDate) ? formatDate(task.dueDate) : "No due date";
  const delta = cleanText(task.dueDate) ? daysUntil(task.dueDate) : null;
  const urgencyLabel = delta === null
    ? "No due date"
    : delta < 0
      ? `${Math.abs(delta)}d overdue`
      : delta === 0
        ? "Due today"
        : `Due in ${delta}d`;
  const weightedValue = relatedDeal ? getForecastValue(relatedDeal) : 0;
  const impactLabel = weightedValue > 0 ? `${formatCompactCurrency(weightedValue)} weighted` : "";

  return `
    <article class="command-action-card">
      <div class="command-action-copy">
        <strong>${escapeHtml(task.title || task.nextStep || "Untitled action")}</strong>
        <span>${escapeHtml(operator)}</span>
        <small>${escapeHtml(contextParts.join(" · ") || "No owner or stage assigned")}</small>
      </div>
      <div class="command-action-meta">
        <em>${escapeHtml(urgencyLabel)}</em>
        <small>${escapeHtml([task.priority || "Medium", dueLabel, impactLabel].filter(Boolean).join(" · "))}</small>
        <div class="command-action-buttons">
          <button type="button" class="icon-button success" data-action="mark-task-done" data-id="${escapeAttribute(task.id)}">Mark Done</button>
          ${relatedDeal ? `<button type="button" class="icon-button" data-action="open-task-deal" data-id="${escapeAttribute(task.id)}">Open Deal</button>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderPipelineValueChart(stageData) {
  if (!stageData.length) {
    elements.commandPipelineBars.innerHTML = '<div class="empty-state">No visible pipeline value in the current scope.</div>';
    return;
  }

  const maxValue = Math.max(...stageData.map((item) => item.value), 1);
  elements.commandPipelineBars.innerHTML = stageData
    .map((item) => {
      const width = Math.max(8, Math.round((item.value / maxValue) * 100));
      return `
        <button type="button" class="salesforce-bar-row" data-action="open-stage-funnel" data-stage="${escapeAttribute(item.stage)}">
          <div class="salesforce-bar-label">
            <strong>${escapeHtml(item.stage)}</strong>
            <span>${escapeHtml(item.count)} deals · ${escapeHtml(formatCurrency(item.value))} pipeline · ${escapeHtml(formatCompactCurrency(item.weightedValue))} weighted${item.stuckCount ? ` · ${item.stuckCount} stuck` : ""}</span>
          </div>
          <div class="salesforce-bar-track"><span style="width:${width}%"></span></div>
        </button>
      `;
    })
    .join("");
}

function renderTimePressurePanel(stageDurationMap = new Map()) {
  const stages = ["Legal", "DD", "Integration"];
  elements.commandTimePressure.innerHTML = stages
    .map((stage) => {
      const limit = STAGE_SLA_DAYS[stage];
      const stageEntry = stageDurationMap.get(stage);
      const averageDays = Number(stageEntry?.averageDays || 0);
      const ratio = limit ? averageDays / limit : 0;
      const tone = ratio > 1 ? "danger" : ratio >= 0.7 ? "warning" : "healthy";
      const width = Math.min(100, Math.max(stageEntry ? 12 : 0, Math.round(ratio * 100)));
      const metricLabel = stageEntry ? `${Math.round(averageDays)}d / ${limit}d` : `No cycle data / ${limit}d`;
      const helper = stageEntry ? `${stageEntry.count} deals measured` : "Waiting for dated deals";

      return `
        <button type="button" class="command-time-row tone-${escapeAttribute(tone)}" data-action="open-stage-funnel" data-stage="${escapeAttribute(stage)}">
          <div class="command-time-copy">
            <strong>${escapeHtml(stage)} Avg</strong>
            <span>${escapeHtml(metricLabel)}</span>
          </div>
          <div class="command-time-track"><i style="width:${width}%"></i></div>
          <small>${escapeHtml(helper)}</small>
        </button>
      `;
    })
    .join("");
}

function renderUpcomingGoLives(upcomingDeals) {
  elements.commandUpcomingGoLives.innerHTML = upcomingDeals.length
    ? upcomingDeals.slice(0, 6).map((deal) => {
        const dateText = cleanText(deal.liveDate || deal.liveSince || deal.signedEta || deal.signingEta);
        return `
          <article class="command-go-live-card">
            <div>
              ${renderCompanyProfileTrigger(deal, getPrimaryOperatorName(deal), buildDealContextLine(deal), "entity-trigger entity-trigger-block entity-trigger-compact")}
              <small>${escapeHtml(deal.productsFuture || deal.productsCurrent || deal.platform || "Launch scope pending")}</small>
            </div>
            <span>${escapeHtml(formatDate(dateText))}</span>
          </article>
        `;
      }).join("")
    : '<div class="empty-state">No dated go-live records are landing in the next 60 days.</div>';
}

function renderExecutionAlertCard(item) {
  const toneClass = item.tone === "stuck" ? "is-danger" : item.tone === "at-risk" ? "is-warn" : "is-info";
  const actionButton = item.task
    ? `<button type="button" class="icon-button success" data-action="mark-task-done" data-id="${escapeAttribute(item.task.id)}">Mark Done</button>`
    : `<button type="button" class="icon-button" data-action="edit-deal" data-id="${escapeAttribute(item.deal.id)}">Open Deal</button>`;
  return `
    <article class="execution-alert-card ${toneClass}">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.message)}</p>
        <small>${escapeHtml(item.detail)}</small>
      </div>
      ${actionButton}
    </article>
  `;
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
      const forecastWeight = getForecastProbability(deal);
      const weightedValue = getForecastValue(deal);
      const visibleStage = getDealVisibleStage(deal);
      return `
        <article class="spotlight-card">
          <div class="spotlight-main">
            <div>
              ${renderCompanyProfileTrigger(
                deal,
                deal.deal || getCompanyProfileLabel(deal),
                deal.client || deal.market || "No client assigned",
                "entity-trigger entity-trigger-block entity-trigger-compact"
              )}
            </div>
            <span class="pill ${health.pillClass}">${escapeHtml(health.label)}</span>
          </div>
          <div class="spotlight-meta">
            <span>${escapeHtml(deal.market || "N/A")}</span>
            <span>${escapeHtml(visibleStage)}</span>
            <span>${formatDealPeriod(deal)}</span>
            <span>${usesValue ? formatCurrency(deal.dealValue) : escapeHtml(formatDealCommercialMetric(deal))}</span>
            <span>Weight ${escapeHtml(formatPercent(forecastWeight))}</span>
            <span>Weighted ${escapeHtml(weightedValue > 0 ? formatCompactCurrency(weightedValue) : "N/A")}</span>
          </div>
          <p>${escapeHtml(deal.statusText || deal.comments || "No executive summary available.")}</p>
          <div class="row-actions">
            ${renderDealWorkflowDocumentButtons(deal, {
              className: "icon-button",
              includeTask: true,
              includeEdit: true,
              editLabel: "Edit Deal",
            })}
          </div>
        </article>
      `;
    })
    .join("");
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
  const operationalStage = getDealVisibleStage(deal);
  return `
    <article class="lead-tracker-card ${followUp.cardClass}">
      <div class="lead-tracker-head">
        <div class="latest-lead-main">
          ${renderCompanyProfileTrigger(
            deal,
            deal.deal || "Unnamed deal",
            buildDealContextLine(deal) || deal.client || "No additional context",
            "entity-trigger entity-trigger-block entity-trigger-compact"
          )}
        </div>
        <div class="pill-row">
          <span class="pill stage">${escapeHtml(operationalStage)}</span>
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
            Stage
            <select name="stage">
              ${VIEW_STAGE_ORDER.map((stage) => `<option value="${escapeAttribute(stage)}" ${getDealVisibleStage(deal) === stage ? "selected" : ""}>${escapeHtml(stage)}</option>`).join("")}
            </select>
          </label>
          <label>
            Lead Status
            <input name="status" type="text" value="${escapeAttribute(deal.status || "")}" placeholder="Active, blocked, qualified..." />
          </label>
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
          ${renderDealWorkflowDocumentButtons(deal, {
            className: "button button-ghost button-small",
            includeTask: true,
            includeEdit: true,
            editLabel: "Open Deal",
          })}
          <button type="submit" class="button button-secondary button-small">Save Follow-Up</button>
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
            ${renderCompanyProfileTrigger(
              item.deal,
              item.deal.deal || getCompanyProfileLabel(item.deal),
              item.deal.client || item.deal.market || "No client assigned",
              "entity-trigger entity-trigger-inline"
            )}
            <span>${escapeHtml(getDealVisibleStage(item.deal))}</span>
          </header>
          <p>${escapeHtml(item.reason)}</p>
          <div class="meta-row">
            <span><strong>Client:</strong> ${escapeHtml(item.deal.client || "N/A")}</span>
            <span><strong>Market:</strong> ${escapeHtml(item.deal.market || "N/A")}</span>
            <span><strong>Last Follow Up:</strong> ${formatDate(item.deal.lastFollowUp)}</span>
          </div>
          <div class="row-actions">
            ${renderDealWorkflowDocumentButtons(item.deal, {
              className: "icon-button",
              includeTask: true,
              includeEdit: true,
              editLabel: "Edit Deal",
            })}
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
  const items = VIEW_STAGE_ORDER.map((stage) => {
    const stageDeals = deals.filter((deal) => getDealVisibleStage(deal) === stage);
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
  renderPipelineOperatingGuide(deals);
  renderPipelineFollowUpNotifications(deals);
  renderPipelineBoard(deals);
  renderDealTable(deals);
}

function renderCompanyFinder(query = elements.companySearch?.value || "") {
  const normalizedQuery = cleanText(query);
  ui.companyFinder.suggestions = ui.companyFinder.isOpen ? buildCompanyFinderSuggestions(normalizedQuery) : [];
  elements.companySearch.value = normalizedQuery;
  const primarySuggestion = getCompanyFinderPrimarySuggestion(normalizedQuery);
  if (elements.openCompanyProfile) {
    elements.openCompanyProfile.disabled = !primarySuggestion;
    elements.openCompanyProfile.textContent = primarySuggestion ? "Open Profile" : "Open Profile";
    const primaryDeal = primarySuggestion ? state.deals.find((deal) => deal.id === primarySuggestion.dealId) : null;
    elements.openCompanyProfile.title = primaryDeal
      ? `Open ${getCompanyProfileLabel(primaryDeal)}`
      : "Search a company to open the profile";
  }
  if (elements.createCompanyAccount) {
    const canCreate = Boolean(normalizedQuery) && !primarySuggestion;
    elements.createCompanyAccount.disabled = !canCreate;
    elements.createCompanyAccount.title = canCreate
      ? `Create a new account prefilled with "${normalizedQuery}"`
      : "Type a company name that does not already exist in the workspace";
  }
  renderCompanySearchStatus(normalizedQuery);

  const showList = ui.companyFinder.isOpen && Boolean(normalizedQuery);
  elements.companySearch.setAttribute("aria-expanded", showList ? "true" : "false");

  if (!showList) {
    elements.companySearchSuggestions.hidden = true;
    elements.companySearchSuggestions.innerHTML = "";
    return;
  }

  if (ui.companyFinder.suggestions.length === 0) {
    elements.companySearchSuggestions.hidden = false;
    elements.companySearchSuggestions.innerHTML = `
      <div class="finder-empty finder-empty-stack">
        <strong>No company or contact matched that search.</strong>
        <span>Promote the account into the funnel and capture the first commercial record now.</span>
        <button type="button" class="button button-primary button-small finder-empty-action" data-company-create="${escapeAttribute(normalizedQuery)}">Create Account</button>
      </div>
    `;
    return;
  }

  elements.companySearchSuggestions.hidden = false;
  elements.companySearchSuggestions.innerHTML = ui.companyFinder.suggestions
    .map((suggestion, index) => {
      const isActive = index === ui.companyFinder.activeIndex;
      return `
        <button
          type="button"
          class="finder-suggestion ${isActive ? "is-active" : ""}"
          data-company-finder-index="${index}"
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

function renderCompanySearchStatus(query) {
  const normalizedQuery = cleanText(query);
  if (!normalizedQuery) {
    elements.companySearchStatus.textContent = "Search the full workspace by company name, operator, contact, website, or email.";
    return;
  }

  if (ui.companyFinder.selectedDealId) {
    const selectedDeal = state.deals.find((deal) => deal.id === ui.companyFinder.selectedDealId);
    if (selectedDeal) {
      const relatedDeals = getCompanyProfileDeals(selectedDeal);
      elements.companySearchStatus.textContent = `Company profile ready: ${getCompanyProfileLabel(selectedDeal)}. ${relatedDeals.length} related account${relatedDeals.length === 1 ? "" : "s"} found across the workspace.`;
      return;
    }
  }

  const suggestionCount = ui.companyFinder.suggestions.length;
  elements.companySearchStatus.textContent = suggestionCount
    ? `${suggestionCount} matching company profile${suggestionCount === 1 ? "" : "s"} found. Press Enter or use Open Profile to launch the best match.`
    : `No company matched "${normalizedQuery}" yet. Use Create Account to open a new deal workspace with this company prefilled.`;
}

function buildCompanyFinderSuggestions(query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return [];
  }

  rebuildDerivedState();
  return derived.companyProfiles
    .map((profile) => buildCompanyFinderSuggestion(profile, normalizedQuery))
    .filter(Boolean)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, 8);
}

function getCompanyFinderPrimarySuggestion(query = elements.companySearch?.value || "") {
  const normalizedQuery = cleanText(query);
  if (!normalizedQuery) {
    return null;
  }

  if (ui.companyFinder.suggestions.length) {
    return ui.companyFinder.suggestions[0];
  }

  return buildCompanyFinderSuggestions(normalizedQuery)[0] || null;
}

function buildCompanyFinderSuggestion(profile, normalizedQuery) {
  const deal = profile.primary || {};
  const matches = [
    scorePipelineFinderField("Company", profile.title, normalizedQuery, 6),
    scorePipelineFinderField("Client", deal.client, normalizedQuery, 5),
    scorePipelineFinderField("Operator", deal.operator, normalizedQuery, 5),
    scorePipelineFinderField("Deal", deal.deal, normalizedQuery, 4),
    scorePipelineFinderField("Primary Contact", deal.primaryContact, normalizedQuery, 4),
    scorePipelineFinderField("Decision Maker", deal.decisionMaker, normalizedQuery, 4),
    scorePipelineFinderField("DD Contact", deal.ddContactName, normalizedQuery, 4),
    scorePipelineFinderField("Legal Representative", deal.legalRepresentativeName || deal.companyLegalRepresentative, normalizedQuery, 4),
    scorePipelineFinderField("Invoice Email", deal.invoiceEmail, normalizedQuery, 4),
    scorePipelineFinderField("Support Email", deal.supportEmail, normalizedQuery, 4),
    scorePipelineFinderField("Management Email", deal.managementEmail, normalizedQuery, 4),
    scorePipelineFinderField("DD Email", deal.ddContactEmail, normalizedQuery, 4),
    scorePipelineFinderField("Integration Email", deal.integrationEmail, normalizedQuery, 4),
    scorePipelineFinderField("Website", deal.url, normalizedQuery, 3),
    scorePipelineFinderField("Market", deal.market, normalizedQuery, 2),
    profile.searchText.includes(normalizedQuery)
      ? {
          label: "Related Company Data",
          value: profile.title,
          score: 140,
        }
      : null,
  ].filter(Boolean);

  if (!matches.length) {
    return null;
  }

  const bestMatch = matches.sort((left, right) => right.score - left.score)[0];
  return {
    dealId: profile.dealId,
    title: profile.title,
    matchLabel: bestMatch.label,
    subtitle: buildPipelineFinderSubtitle(deal, bestMatch.value),
    meta: [
      profile.markets.slice(0, 2).join(" · ") || "No market",
      `${profile.deals.length} account${profile.deals.length === 1 ? "" : "s"}`,
      profile.stages.slice(0, 2).join(" · ") || "No stage",
    ].join(" · "),
    searchValue: profile.title,
    score: bestMatch.score,
  };
}

function handleCompanyFinderKeydown(event) {
  const { suggestions } = ui.companyFinder;
  if (!suggestions.length) {
    if (event.key === "Enter") {
      event.preventDefault();
      openCompanyFinderBestMatch();
      return;
    }
    if (event.key === "Escape") {
      ui.companyFinder.isOpen = false;
      renderCompanyFinder(elements.companySearch.value.trim());
    }
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    ui.companyFinder.isOpen = true;
    ui.companyFinder.activeIndex = (ui.companyFinder.activeIndex + 1 + suggestions.length) % suggestions.length;
    renderCompanyFinder(elements.companySearch.value.trim());
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    ui.companyFinder.isOpen = true;
    ui.companyFinder.activeIndex = (ui.companyFinder.activeIndex - 1 + suggestions.length) % suggestions.length;
    renderCompanyFinder(elements.companySearch.value.trim());
    return;
  }

  if (event.key === "Enter" && ui.companyFinder.activeIndex >= 0) {
    event.preventDefault();
    selectCompanyFinderSuggestion(ui.companyFinder.activeIndex);
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    selectCompanyFinderSuggestion(0);
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    ui.companyFinder.isOpen = false;
    ui.companyFinder.activeIndex = -1;
    renderCompanyFinder(elements.companySearch.value.trim());
  }
}

function selectCompanyFinderSuggestion(index) {
  const suggestion = ui.companyFinder.suggestions[index];
  if (!suggestion) {
    return;
  }

  ui.companyFinder.selectedDealId = suggestion.dealId;
  ui.companyFinder.activeIndex = -1;
  ui.companyFinder.isOpen = false;
  elements.companySearch.value = suggestion.searchValue;
  renderCompanyFinder(suggestion.searchValue);
  openCompanyProfileById(suggestion.dealId, { syncSearch: false });
}

function openCompanyFinderBestMatch() {
  const suggestion = getCompanyFinderPrimarySuggestion(elements.companySearch?.value || "");
  if (!suggestion) {
    createNewAccountFromCompanyQuery(elements.companySearch?.value || "");
    return;
  }

  ui.companyFinder.selectedDealId = suggestion.dealId;
  ui.companyFinder.activeIndex = -1;
  ui.companyFinder.isOpen = false;
  elements.companySearch.value = suggestion.searchValue;
  renderCompanyFinder(suggestion.searchValue);
  openCompanyProfileById(suggestion.dealId, { syncSearch: false });
}

function createNewAccountFromCompanyQuery(query) {
  const normalizedQuery = cleanText(query);
  if (!normalizedQuery) {
    setBanner("Type a company name first so Cube One can prefill a new account workspace.", "warn");
    return;
  }

  const existingMatch = getCompanyFinderPrimarySuggestion(normalizedQuery);
  if (existingMatch) {
    openCompanyProfileById(existingMatch.dealId, { syncSearch: false });
    setBanner(`Company already exists in the workspace. Opened ${existingMatch.title} instead of creating a duplicate account.`, "default");
    return;
  }

  const draft = normalizeDeal({
    ...createEmptyDeal(),
    deal: normalizedQuery,
    client: normalizedQuery,
    operator: normalizedQuery,
    companyName: normalizedQuery,
    documentClientName: normalizedQuery,
    source: "Company Finder",
    stage: "Lead",
    followUpOwner: getActiveUser()?.fullName || "",
  });

  ui.activeView = "pipeline";
  ui.editingDealId = null;
  fillDealForm(draft, { autoRestore: false });
  clearActiveDealAutosave(false);
  ui.companyAssistKey = "";
  renderViewState();
  elements.companySearch.value = normalizedQuery;
  ui.companyFinder.isOpen = false;
  ui.companyFinder.activeIndex = -1;
  ui.companyFinder.selectedDealId = null;
  renderCompanyFinder(normalizedQuery);
  window.scrollTo({ top: 0, behavior: "smooth" });
  setBanner(`New account workspace prepared for ${normalizedQuery}. Complete the deal form to create the company in Cube One.`, "success");
}

const COMPANY_PROFILE_EDIT_SECTIONS = [
  {
    title: "Identity & Legal",
    description: "Keep the company master data aligned for legal, proposal, and request workflows.",
    fields: [
      { name: "companyName", label: "Company Name" },
      { name: "documentClientName", label: "Document Client Name" },
      { name: "client", label: "Client Name" },
      { name: "operator", label: "Operator Name" },
      { name: "legalEntity", label: "Legal Entity" },
      { name: "groupName", label: "Group Name" },
      { name: "clientBased", label: "Client Based" },
      { name: "url", label: "Website URL", type: "url", placeholder: "https://example.com" },
      { name: "companyRegistrationNumber", label: "Registration Number" },
      { name: "companyLicense", label: "Company License / License Status" },
      { name: "companyRegisteredAddress", label: "Registered Address", textarea: true, rows: 3, fullSpan: true },
    ],
  },
  {
    title: "Contacts & Compliance",
    description: "These values feed the internal Legal, DD, and Legal Signoff requests.",
    fields: [
      { name: "primaryContact", label: "Primary Contact" },
      { name: "decisionMaker", label: "Decision Maker" },
      { name: "invoiceEmail", label: "Invoice Email", type: "email" },
      { name: "supportEmail", label: "Support Email", type: "email" },
      { name: "managementEmail", label: "Management Email", type: "email" },
      { name: "ddContactName", label: "DD Contact Name" },
      { name: "ddContactEmail", label: "DD Contact Email", type: "email" },
      { name: "companyLegalRepresentative", label: "Company Legal Representative" },
      { name: "legalRepresentativeName", label: "Legal Representative Full Name" },
      { name: "legalRepresentativeId", label: "Legal Representative ID" },
      { name: "legalRepresentativeEmail", label: "Legal Representative Email", type: "email" },
      { name: "legalRepresentativeAddress", label: "Legal Representative Address", textarea: true, rows: 3, fullSpan: true },
    ],
  },
  {
    title: "Delivery & Commercial Context",
    description: "Keep integration contacts and company context in one editable profile.",
    fields: [
      { name: "integrationEmail", label: "Integration Email", type: "email" },
      { name: "integrationTeam", label: "Integration Team" },
      { name: "teamsGroup", label: "Teams / Chat Group" },
      { name: "otherLiveSuppliers", label: "Other Live Suppliers" },
      { name: "currentCompetitors", label: "Current Competitors" },
      { name: "productsCurrent", label: "Current Products", textarea: true, rows: 3, fullSpan: true },
      { name: "productsPotential", label: "Potential Products", textarea: true, rows: 3, fullSpan: true },
    ],
  },
];

function getCompanyProfileMergedValue(deals, ...fieldNames) {
  for (const fieldName of fieldNames) {
    for (const deal of deals) {
      const value = cleanText(deal?.[fieldName]);
      if (value) {
        return value;
      }
    }
  }
  return "";
}

function buildCompanyProfileSource(primaryDeal, relatedDeals = []) {
  const uniqueDeals = Array.from(new Map([primaryDeal, ...relatedDeals].filter(Boolean).map((deal) => [deal.id, deal])).values());
  return {
    companyName: getCompanyProfileMergedValue(uniqueDeals, "companyName"),
    documentClientName: getCompanyProfileMergedValue(uniqueDeals, "documentClientName"),
    client: getCompanyProfileMergedValue(uniqueDeals, "client"),
    operator: getCompanyProfileMergedValue(uniqueDeals, "operator"),
    legalEntity: getCompanyProfileMergedValue(uniqueDeals, "legalEntity"),
    groupName: getCompanyProfileMergedValue(uniqueDeals, "groupName"),
    clientBased: getCompanyProfileMergedValue(uniqueDeals, "clientBased"),
    url: getCompanyProfileMergedValue(uniqueDeals, "url"),
    companyRegistrationNumber: getCompanyProfileMergedValue(uniqueDeals, "companyRegistrationNumber"),
    companyLicense: getCompanyProfileMergedValue(uniqueDeals, "companyLicense", "licenseStatus"),
    companyRegisteredAddress: getCompanyProfileMergedValue(uniqueDeals, "companyRegisteredAddress"),
    primaryContact: getCompanyProfileMergedValue(uniqueDeals, "primaryContact"),
    decisionMaker: getCompanyProfileMergedValue(uniqueDeals, "decisionMaker"),
    invoiceEmail: getCompanyProfileMergedValue(uniqueDeals, "invoiceEmail"),
    supportEmail: getCompanyProfileMergedValue(uniqueDeals, "supportEmail"),
    managementEmail: getCompanyProfileMergedValue(uniqueDeals, "managementEmail"),
    ddContactName: getCompanyProfileMergedValue(uniqueDeals, "ddContactName"),
    ddContactEmail: getCompanyProfileMergedValue(uniqueDeals, "ddContactEmail"),
    companyLegalRepresentative: getCompanyProfileMergedValue(uniqueDeals, "companyLegalRepresentative", "legalRepresentativeName"),
    legalRepresentativeName: getCompanyProfileMergedValue(uniqueDeals, "legalRepresentativeName", "companyLegalRepresentative"),
    legalRepresentativeId: getCompanyProfileMergedValue(uniqueDeals, "legalRepresentativeId"),
    legalRepresentativeEmail: getCompanyProfileMergedValue(uniqueDeals, "legalRepresentativeEmail"),
    legalRepresentativeAddress: getCompanyProfileMergedValue(uniqueDeals, "legalRepresentativeAddress"),
    integrationEmail: getCompanyProfileMergedValue(uniqueDeals, "integrationEmail"),
    integrationTeam: getCompanyProfileMergedValue(uniqueDeals, "integrationTeam"),
    teamsGroup: getCompanyProfileMergedValue(uniqueDeals, "teamsGroup"),
    otherLiveSuppliers: getCompanyProfileMergedValue(uniqueDeals, "otherLiveSuppliers"),
    currentCompetitors: getCompanyProfileMergedValue(uniqueDeals, "currentCompetitors"),
    productsCurrent: getCompanyProfileMergedValue(uniqueDeals, "productsCurrent"),
    productsPotential: getCompanyProfileMergedValue(uniqueDeals, "productsPotential"),
  };
}

function renderCompanyProfileSummaryActions(activeDeal) {
  if (ui.companyProfileEditMode) {
    return [
      '<button type="submit" form="company-profile-form" class="button button-primary button-small">Save Profile</button>',
      '<button type="button" class="button button-ghost button-small" data-company-profile-action="cancel-edit">Cancel Edit</button>',
      `<button type="button" class="button button-secondary button-small" data-action="edit-deal" data-id="${escapeAttribute(activeDeal.id)}">Open Deal Workspace</button>`,
    ].join("");
  }

  return [
    '<button type="button" class="button button-primary button-small" data-company-profile-action="edit-profile">Edit Profile</button>',
    renderDealWorkflowDocumentButtons(activeDeal, {
      className: "button button-secondary button-small",
      kinds: ["proposal", "legal", "dd", "integration", "signoff"],
      includeEdit: true,
      editLabel: "Open Deal Workspace",
    }),
  ].join("");
}

function renderCompanyProfileEditField(field, source) {
  const value = cleanText(source?.[field.name]);
  const className = field.fullSpan ? ' class="full-span"' : "";
  if (field.textarea) {
    return `
      <label${className}>
        ${escapeHtml(field.label)}
        <textarea name="${escapeAttribute(field.name)}" rows="${Number(field.rows) || 3}" placeholder="${escapeAttribute(field.placeholder || "")}">${escapeHtml(value)}</textarea>
      </label>
    `;
  }
  return `
    <label${className}>
      ${escapeHtml(field.label)}
      <input
        name="${escapeAttribute(field.name)}"
        type="${escapeAttribute(field.type || "text")}"
        value="${escapeAttribute(value)}"
        placeholder="${escapeAttribute(field.placeholder || "")}"
      />
    </label>
  `;
}

function renderCompanyProfileEditForm(source, relatedDeals) {
  const relatedCount = Array.isArray(relatedDeals) ? relatedDeals.length : 0;
  return `
    <form id="company-profile-form" class="company-profile-edit-form">
      <section class="company-profile-section company-profile-edit-shell">
        <div class="subpanel-head">
          <div>
            <h3>Edit Company Profile</h3>
            <p class="form-note">Changes will update the shared company profile across ${relatedCount || 1} related account${relatedCount === 1 ? "" : "s"}.</p>
          </div>
          <span class="chip">Profile sync</span>
        </div>
        <div class="company-profile-edit-stack">
          ${COMPANY_PROFILE_EDIT_SECTIONS.map(
            (section) => `
              <article class="company-profile-card company-profile-edit-card">
                <div class="subpanel-head">
                  <div>
                    <h3>${escapeHtml(section.title)}</h3>
                    <p class="form-note">${escapeHtml(section.description)}</p>
                  </div>
                </div>
                <div class="form-grid form-grid-2">
                  ${section.fields.map((field) => renderCompanyProfileEditField(field, source)).join("")}
                </div>
              </article>
            `
          ).join("")}
        </div>
      </section>
    </form>
  `;
}

async function saveCompanyProfileForm(form) {
  const anchorDeal = state.deals.find((item) => item.id === ui.companyProfileDealId);
  if (!anchorDeal) {
    return;
  }

  const relatedDeals = getCompanyProfileDeals(anchorDeal);
  const relatedIds = new Set((relatedDeals.length ? relatedDeals : [anchorDeal]).map((item) => item.id));
  const formData = new FormData(form);
  const patch = {};

  COMPANY_PROFILE_EDIT_SECTIONS.forEach((section) => {
    section.fields.forEach((field) => {
      patch[field.name] = formData.get(field.name) || "";
    });
  });

  if (!hasAnyText(patch.companyName, patch.documentClientName, patch.client, patch.operator)) {
    setBanner("Company Profile needs at least one company-facing name before it can be saved.", "danger");
    return;
  }

  state.deals = state.deals.map((deal) => (relatedIds.has(deal.id) ? normalizeDeal({ ...deal, ...patch }) : deal));
  ui.companyProfileEditMode = false;
  const saved = await persistState();
  renderAll();

  if (ui.editingDealId && relatedIds.has(ui.editingDealId)) {
    const openDeal = state.deals.find((deal) => deal.id === ui.editingDealId);
    if (openDeal) {
      fillDealForm(openDeal);
    }
  }

  openCompanyProfileById(anchorDeal.id, { scroll: false });
  setBanner(
    buildExcelBanner(saved ? `Company profile updated across ${relatedIds.size} related account${relatedIds.size === 1 ? "" : "s"}.` : "Company profile updated in browser storage only."),
    saved ? "success" : "warn"
  );
}

function renderCompanyProfileDrawer() {
  const deal = state.deals.find((item) => item.id === ui.companyProfileDealId);
  if (!deal) {
    hideCompanyProfilePanel();
    return;
  }

  try {
    const relatedDeals = getCompanyProfileDeals(deal);
    const activeDeal = relatedDeals[0] || deal;
    const source = buildCompanyProfileSource(activeDeal, relatedDeals);
    const contacts = collectCompanyContactRows(relatedDeals.length ? relatedDeals : [deal]);
    const websites = uniqueValues((relatedDeals.length ? relatedDeals : [deal]).map((item) => item.url));
    const markets = uniqueValues((relatedDeals.length ? relatedDeals : [deal]).map((item) => item.market));
    const owners = uniqueValues((relatedDeals.length ? relatedDeals : [deal]).map((item) => getDealOwner(item)));
    const liveCount = relatedDeals.filter((item) => isLiveAccountStage(item.stage)).length;
    const openCount = relatedDeals.filter((item) => !isInactiveDeal(item)).length;
    const forecastValue = sumValues(relatedDeals.map((item) => getForecastValue(item)));
    const companyInfoRows = [
      { label: "Company", value: source.companyName || source.documentClientName || getCompanyProfileLabel(activeDeal) },
      { label: "Legal Entity", value: source.legalEntity || source.companyName },
      { label: "Registration", value: source.companyRegistrationNumber },
      { label: "License", value: source.companyLicense },
      { label: "Primary Market", value: activeDeal.market },
      { label: "Segment", value: activeDeal.segment || activeDeal.type },
      { label: "Owner", value: owners.join(" · ") || getDealOwner(activeDeal) },
      { label: "Registered Address", value: source.companyRegisteredAddress },
    ].filter((row) => cleanText(row.value));

    showCompanyProfilePanel();
    if (elements.companyProfileTitle) {
      elements.companyProfileTitle.textContent = source.companyName || source.documentClientName || getCompanyProfileLabel(activeDeal);
    }
    elements.companyProfileBody.innerHTML = `
    <section class="company-profile-summary">
      <div class="company-profile-summary-copy">
        <span class="company-profile-kicker">${escapeHtml(markets.join(" · ") || "No market assigned")}</span>
        <strong>${escapeHtml(source.companyName || source.documentClientName || getCompanyProfileLabel(activeDeal))}</strong>
        <p>${escapeHtml(buildDealContextLine(activeDeal) || activeDeal.statusText || "No commercial summary is currently logged for this company.")}</p>
        <small class="company-profile-summary-note">This company profile is the shared reference used by internal requests, proposal exports, and related account views.</small>
      </div>
      <div class="company-profile-summary-actions">
        ${renderCompanyProfileSummaryActions(activeDeal)}
      </div>
    </section>

    <section class="company-profile-metrics">
      ${renderForecastMetric("Accounts", `${relatedDeals.length}`)}
      ${renderForecastMetric("Active", `${openCount}`)}
      ${renderForecastMetric("Live", `${liveCount}`)}
      ${renderForecastMetric("Forecast", formatCompactCurrency(forecastValue), formatCurrency(forecastValue))}
    </section>

    ${
      ui.companyProfileEditMode
        ? renderCompanyProfileEditForm(source, relatedDeals)
        : `
          <section class="company-profile-grid">
            <article class="company-profile-card">
              <div class="subpanel-head">
                <h3>Company Snapshot</h3>
                <span class="chip">${escapeHtml(`${markets.length || 1} market${markets.length === 1 ? "" : "s"}`)}</span>
              </div>
              <dl class="company-profile-list">
                ${companyInfoRows
                  .map(
                    (row) => `
                      <div>
                        <dt>${escapeHtml(row.label)}</dt>
                        <dd>${escapeHtml(row.value)}</dd>
                      </div>
                    `
                  )
                  .join("")}
              </dl>
              ${
                websites.length
                  ? `
                    <div class="company-profile-links">
                      ${websites
                        .map(
                          (url) => `
                            <a class="tracking-link" href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">
                              <span>Website</span>
                              <strong>${escapeHtml(url)}</strong>
                            </a>
                          `
                        )
                        .join("")}
                    </div>
                  `
                  : ""
              }
            </article>

            <article class="company-profile-card">
              <div class="subpanel-head">
                <h3>Contacts & Emails</h3>
                <span class="chip">${escapeHtml(`${contacts.length} contact${contacts.length === 1 ? "" : "s"}`)}</span>
              </div>
              ${
                contacts.length
                  ? `
                    <div class="company-contact-list">
                      ${contacts
                        .map(
                          (contact) => `
                            <article class="company-contact-card">
                              <span>${escapeHtml(contact.role)}</span>
                              <strong>${escapeHtml(contact.name)}</strong>
                              ${
                                contact.email
                                  ? `<a href="mailto:${escapeAttribute(contact.email)}">${escapeHtml(contact.email)}</a>`
                                  : `<small>${escapeHtml(contact.market || "Email not logged")}</small>`
                              }
                              ${contact.market ? `<small>${escapeHtml(contact.market)}</small>` : ""}
                            </article>
                          `
                        )
                        .join("")}
                    </div>
                  `
                  : '<div class="empty-state">No contacts or emails have been logged for this company yet.</div>'
              }
            </article>
          </section>
        `
    }

    <section class="company-profile-section">
      <div class="subpanel-head">
        <h3>Related Accounts</h3>
        <span class="chip">${escapeHtml(`${relatedDeals.length} visible account${relatedDeals.length === 1 ? "" : "s"}`)}</span>
      </div>
      <div class="company-profile-account-list">
        ${relatedDeals
          .map(
            (item) => `
              <article class="company-account-card">
                <div class="company-account-head">
                  ${renderCompanyProfileTrigger(item, item.deal || item.client || item.operator || "Unnamed account", buildDealContextLine(item), "entity-trigger entity-trigger-block")}
                  <span class="pill ${getDealHealth(item).pillClass}">${escapeHtml(item.stage || "No stage")}</span>
                </div>
                <div class="company-account-meta">
                  <span><strong>Market:</strong> ${escapeHtml(item.market || "N/A")}</span>
                  <span><strong>Owner:</strong> ${escapeHtml(getDealOwner(item) || "Unassigned")}</span>
                  <span><strong>Follow-Up:</strong> ${formatDate(item.lastFollowUp)}</span>
                  <span><strong>Value:</strong> ${escapeHtml(formatDealCommercialMetric(item))}</span>
                </div>
                <p>${escapeHtml(item.actionItems || item.statusText || "No next action defined for this account.")}</p>
                <div class="row-actions">
                  ${renderDealWorkflowDocumentButtons(item, {
                    className: "icon-button",
                    includeTask: true,
                    includeEdit: true,
                    editLabel: "Open Deal",
                  })}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    `;
  } catch (error) {
    console.error("Company profile render failed", error);
    showCompanyProfilePanel();
    if (elements.companyProfileTitle) {
      elements.companyProfileTitle.textContent = "Company Profile";
    }
    elements.companyProfileBody.innerHTML = `
      <section class="company-profile-section">
        <div class="empty-state">
          The company profile could not be rendered completely for this account. You can still close this panel and reopen the deal workspace.
        </div>
        <div class="row-actions">
          <button type="button" class="button button-secondary button-small" data-action="edit-deal" data-id="${escapeAttribute(deal.id)}">Open Deal Workspace</button>
          <button type="button" class="button button-ghost button-small" data-company-profile-close>Close Profile</button>
        </div>
      </section>
    `;
    setBanner("Company profile opened with fallback content because part of the profile could not be rendered.", "warn");
  }
}

function openCompanyProfileById(id, options = {}) {
  const deal = state.deals.find((item) => item.id === id);
  if (!deal) {
    return;
  }

  ui.companyProfileEditMode = false;
  ui.companyProfileDealId = id;
  ui.companyFinder.selectedDealId = id;
  if (options.syncSearch !== false) {
    elements.companySearch.value = getCompanyProfileLabel(deal);
  }
  renderCompanyFinder(elements.companySearch.value.trim());
  renderCompanyProfileDrawer();
  if (options.scroll !== false) {
    window.requestAnimationFrame(() => {
      elements.companyProfileShell?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }
}

function showCompanyProfilePanel() {
  if (!elements.companyProfileShell) {
    return;
  }
  elements.companyProfileShell.hidden = false;
  elements.companyProfileShell.setAttribute("aria-hidden", "false");
}

function hideCompanyProfilePanel() {
  if (!elements.companyProfileShell) {
    return;
  }
  elements.companyProfileShell.hidden = true;
  elements.companyProfileShell.setAttribute("aria-hidden", "true");
  if (elements.companyProfileTitle) {
    elements.companyProfileTitle.textContent = "Company Profile";
  }
  elements.companyProfileBody.innerHTML = "";
}

function closeCompanyProfile() {
  ui.companyProfileDealId = null;
  ui.companyProfileEditMode = false;
  ui.companyFinder.activeIndex = -1;
  ui.companyFinder.isOpen = false;
  hideCompanyProfilePanel();
  renderCompanyFinder(elements.companySearch?.value?.trim() || "");
}

function getCompanyProfileKey(deal) {
  const companyKey = normalizeSearchText(
    deal.companyName || deal.documentClientName || deal.client || deal.operator || deal.deal || deal.id
  );
  return companyKey || cleanText(deal.id);
}

function getCompanyProfileLabel(deal) {
  return cleanText(deal.companyName || deal.documentClientName || deal.client || deal.operator || deal.deal || "Unnamed Company");
}

function getCompanyProfileDeals(sourceDeal) {
  rebuildDerivedState();
  const key = getCompanyProfileKey(sourceDeal);
  return derived.companyDealsByKey.get(key) || [];
}

function collectCompanyContactRows(deals) {
  const contacts = [];
  const seen = new Set();

  const pushContact = (role, name, email, market = "") => {
    const safeName = cleanText(name || email);
    const safeEmail = cleanText(email);
    if (!safeName && !safeEmail) {
      return;
    }
    const key = [normalizeSearchText(role), normalizeSearchText(safeName), normalizeSearchText(safeEmail)].join("|");
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    contacts.push({
      role: cleanText(role),
      name: safeName || safeEmail,
      email: safeEmail,
      market: cleanText(market),
    });
  };

  deals.forEach((deal) => {
    const owner = getDealOwner(deal);
    const ownerUser = state.users.find((user) => cleanText(user.fullName) === owner);
    pushContact("Primary Contact", deal.primaryContact, "", deal.market);
    pushContact("Decision Maker", deal.decisionMaker, "", deal.market);
    pushContact("DD Contact", deal.ddContactName, deal.ddContactEmail, deal.market);
    pushContact("Legal Representative", deal.legalRepresentativeName || deal.companyLegalRepresentative, deal.legalRepresentativeEmail, deal.market);
    pushContact("Invoices", "Finance / Invoices", deal.invoiceEmail, deal.market);
    pushContact("Support", "Customer Support", deal.supportEmail, deal.market);
    pushContact("Management", "Management", deal.managementEmail, deal.market);
    pushContact("Integration", "Integration", deal.integrationEmail, deal.market);
    pushContact("Owner", owner, ownerUser?.email, deal.market);
  });

  return contacts;
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

  setSelectOptions(elements.filterStage, ["All", ...VIEW_STAGE_ORDER], ui.filters.stage);
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
  const columns = KANBAN_STAGE_ORDER.map((stage) => {
    const stageDeals = deals.filter((deal) => getKanbanStage(getDealVisibleStage(deal)) === stage);
    const totalValue = sumValues(stageDeals.map((deal) => deal.dealValue));
    return { stage, stageDeals, totalValue };
  });

  elements.pipelineBoard.innerHTML = `
    <div class="kanban-board">
      ${columns
        .map(({ stage, stageDeals, totalValue }) => {
          return `
            <section class="kanban-column" data-stage="${escapeAttribute(stage)}">
              <header class="kanban-column-header">
                <div>
                  <h3>${escapeHtml(stage)}</h3>
                  <p>${stageDeals.length} deals · ${escapeHtml(formatCurrency(totalValue))}</p>
                </div>
                <span class="kanban-stage-count">${stageDeals.length}</span>
              </header>
              <div class="kanban-dropzone" data-kanban-dropzone="${escapeAttribute(stage)}">
                ${
                  stageDeals.length
                    ? stageDeals.map((deal) => renderKanbanDealCard(deal)).join("")
                    : `<div class="kanban-empty">No deals in ${escapeHtml(stage)}.</div>`
                }
              </div>
            </section>
          `;
        })
        .join("")}
    </div>
  `;

  bindKanbanDragAndDrop();
}

function renderKanbanDealCard(deal) {
  const sla = getStageSlaState(deal);
  const owner = getDealOwner(deal) || "Unassigned";
  const nextAction = getDealNextAction(deal);
  const riskTone = sla.tone === "stuck" ? "stuck" : sla.tone === "at-risk" ? "risk" : "healthy";
  const operationalStage = getDealOperationalStage(deal) || "Lead";
  const currentStage = getVisibleStage(operationalStage) || "Lead";
  const weight = getForecastProbability(deal);
  const weightedValue = getForecastValue(deal);
  const nextStage = getNextVisibleStage(operationalStage);
  const nextStageButton = nextStage
    ? `<button type="button" class="kanban-stage-button" data-action="advance-deal-stage" data-id="${escapeAttribute(deal.id)}" data-next-stage="${escapeAttribute(
        nextStage
      )}">Move to ${escapeHtml(nextStage)}</button>`
    : `<span class="kanban-stage-complete">Final stage</span>`;

  return `
    <article
      class="kanban-card kanban-card-${riskTone}"
      draggable="true"
      data-deal-id="${escapeAttribute(deal.id)}"
      data-current-stage="${escapeAttribute(currentStage)}"
    >
      <div class="kanban-card-top">
        ${renderCompanyProfileTrigger(
          deal,
          getPrimaryOperatorName(deal),
          `${deal.market || "No market"} · ${owner}`,
          "entity-trigger entity-trigger-block entity-trigger-compact"
        )}
        <span class="kanban-risk-pill">${escapeHtml(getRiskDisplayLabel(riskTone))}</span>
      </div>

      <div class="kanban-card-value">${escapeHtml(formatDealCommercialMetric(deal))}</div>

      <div class="kanban-card-meta">
        <span>${escapeHtml(deal.market || "No market")}</span>
        <span>${escapeHtml(owner)}</span>
      </div>

      <div class="kanban-sla">
        ${renderSlaTimer(deal)}
      </div>

      <div class="kanban-next-action">
        <strong>Next:</strong> ${escapeHtml(nextAction || "No next action defined")}
      </div>

      <div class="kanban-card-footer">
        <span>Stage: ${escapeHtml(currentStage)}</span>
        <span>Weight ${escapeHtml(formatPercent(weight))}</span>
        <span>Weighted ${escapeHtml(weightedValue > 0 ? formatCompactCurrency(weightedValue) : "N/A")}</span>
        <span>DD: ${escapeHtml(deal.ddStatus || "N/A")}</span>
        <span>Int: ${escapeHtml(deal.integrationStatus || "N/A")}</span>
      </div>

      <div class="kanban-actions">
        ${nextStageButton}
        ${renderDealWorkflowDocumentButtons(deal, {
          className: "icon-button",
          includeTask: true,
          includeEdit: true,
          editLabel: "Open Deal",
        })}
      </div>
    </article>
  `;
}

function bindKanbanDragAndDrop() {
  const cards = elements.pipelineBoard.querySelectorAll(".kanban-card");
  const zones = elements.pipelineBoard.querySelectorAll(".kanban-dropzone");

  cards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.dealId);
      event.dataTransfer.effectAllowed = "move";
      card.classList.add("is-dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
    });
  });

  zones.forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("is-over");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("is-over");
    });

    zone.addEventListener("drop", async (event) => {
      event.preventDefault();
      zone.classList.remove("is-over");

      const dealId = event.dataTransfer.getData("text/plain");
      const newStage = cleanText(zone.dataset.kanbanDropzone);
      const deal = state.deals.find((item) => item.id === dealId);
      const currentStage = deal ? getDealVisibleStage(deal) : "";

      if (!deal || !newStage || getKanbanStage(currentStage) === newStage) {
        return;
      }
      const targetStage = getDropTargetStage(currentStage, newStage);
      await moveDealToStage(deal.id, targetStage);
    });
  });
}

function getKanbanStage(stage) {
  const normalized = normalizeDealStage(stage);
  if (normalized === "Qualified") {
    return "Lead";
  }
  if (normalized === "Legal Approval") {
    return "Go Live";
  }
  return KANBAN_STAGE_ORDER.includes(normalized) ? normalized : "Lead";
}

function getNextOperationalStage(stage) {
  const normalizedStage = normalizeDealStage(stage);
  const index = STAGE_ORDER.indexOf(normalizedStage);
  if (index < 0 || index >= STAGE_ORDER.length - 1) {
    return "";
  }
  return STAGE_ORDER[index + 1];
}

function getNextVisibleStage(stage) {
  const normalizedStage = normalizeDealStage(stage);
  const currentVisibleStage = getVisibleStage(normalizedStage);
  const index = STAGE_ORDER.indexOf(normalizedStage);
  if (index < 0) {
    return "";
  }

  for (let nextIndex = index + 1; nextIndex < STAGE_ORDER.length; nextIndex += 1) {
    const nextStage = getVisibleStage(STAGE_ORDER[nextIndex]);
    if (nextStage !== currentVisibleStage) {
      return nextStage;
    }
  }

  return "";
}

function getDropTargetStage(currentStage, dropColumn) {
  const normalizedCurrent = normalizeDealStage(currentStage);
  const normalizedColumn = cleanText(dropColumn);
  const currentIndex = STAGE_ORDER.indexOf(normalizedCurrent);

  if (normalizedColumn === "Go Live" && ["Integration", "Legal Approval"].includes(normalizedCurrent)) {
    return normalizedCurrent === "Integration" ? "Legal Approval" : "Go Live";
  }

  if (normalizedColumn === "Lead" && normalizedCurrent === "Lead") {
    return "Qualified";
  }

  const candidates = STAGE_ORDER.filter((stage) => getKanbanStage(stage) === normalizedColumn);
  const nextCandidate = candidates.find((stage) => STAGE_ORDER.indexOf(stage) > currentIndex);
  return nextCandidate || normalizedColumn;
}

async function moveDealToStage(dealId, targetStage, options = {}) {
  const deal = state.deals.find((item) => item.id === dealId);
  const normalizedTargetStage = normalizeDealStage(targetStage);
  if (!deal || !normalizedTargetStage || cleanText(deal.stage) === normalizedTargetStage) {
    return false;
  }

  const validation = validateStageMove(deal, normalizedTargetStage);
  if (!validation.ok) {
    setBanner(validation.message, "warn");
    return false;
  }

  const updatedDeal = normalizeDeal({
    ...deal,
    stage: normalizedTargetStage,
  });
  setStageEntryDateForMove(updatedDeal, normalizedTargetStage);
  state.deals = state.deals.map((item) => (item.id === updatedDeal.id ? updatedDeal : item));
  recordWorkspaceHistory("Stage moved", `${getPrimaryOperatorName(updatedDeal)} · ${deal.stage || "No stage"} -> ${normalizedTargetStage}`, {
    entityType: "deal",
    entityId: updatedDeal.id,
  });
  const saved = await persistState();
  renderAll();
  setBanner(
    buildExcelBanner(
      saved
        ? `${getPrimaryOperatorName(updatedDeal)} moved to ${normalizedTargetStage}.`
        : `${getPrimaryOperatorName(updatedDeal)} moved to ${normalizedTargetStage} in the current session.`
    ),
    saved ? "success" : "warn"
  );

  if (options.reopenEditor) {
    openDealEditorById(updatedDeal.id);
  }

  return true;
}

function validateStageMove(deal, newStage) {
  if (newStage === "DD") {
    if (!deal.dealValue) {
      return { ok: false, message: "Cannot move to DD: Deal Value is required." };
    }

    if (!deal.legalStatus || ["Not Started", "Blocked"].includes(deal.legalStatus)) {
      return { ok: false, message: "Cannot move to DD: Legal status must be active or approved." };
    }
  }

  if (newStage === "Integration") {
    if (!["Completed", "Approved"].includes(cleanText(deal.ddStatus))) {
      return { ok: false, message: "Cannot move to Integration: DD must be completed or approved." };
    }
  }

  if (newStage === "Go Live") {
    if (!["Completed", "Live"].includes(cleanText(deal.integrationStatus))) {
      return { ok: false, message: "Cannot move to Go Live: Integration must be completed." };
    }
  }

  if (newStage === "Handover") {
    if (!deal.liveDate && !deal.liveSince) {
      return { ok: false, message: "Cannot move to Handover: Live date is required." };
    }
  }

  return { ok: true };
}

function setStageEntryDateForMove(deal, newStage) {
  const field = STAGE_ENTRY_FIELDS[newStage];
  if (!field) {
    return;
  }

  if (!deal[field]) {
    deal[field] = new Date().toISOString().slice(0, 10);
  }
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
      const visibleStage = getDealVisibleStage(deal);

      return `
        <tr>
          <td>
            <div class="entity-title">
              ${renderCompanyProfileTrigger(
                deal,
                deal.deal || getCompanyProfileLabel(deal),
                buildDealContextLine(deal)
              )}
            </div>
          </td>
          <td>
            <div class="entity-title">
              <strong>${escapeHtml(deal.market || "N/A")}</strong>
              <small>${escapeHtml([deal.platform || "No platform", deal.jurisdiction].filter(Boolean).join(" · "))}</small>
            </div>
          </td>
          <td><span class="pill stage">${escapeHtml(visibleStage)}</span></td>
          <td>${escapeHtml(formatDealPeriod(deal))}</td>
          <td><span class="pill ${health.pillClass}">${escapeHtml(health.label)}</span></td>
          <td>${escapeHtml(formatDealCommercialMetric(deal))}</td>
          <td>${formatDate(deal.lastFollowUp)}</td>
          <td class="table-status">${renderStageStatusBlock(deal, "compact")}${renderRequestPackStatusBlock(deal, "compact")}</td>
          <td class="table-tracking">${renderTrackingLinks(deal, "compact")}</td>
          <td>
            <div class="row-actions">
              ${renderDealWorkflowDocumentButtons(deal, {
                className: "icon-button",
                includeTask: true,
                includeCampaign: true,
                includeEdit: true,
                editLabel: "Edit",
              })}
              <button class="icon-button danger" data-action="delete-deal" data-id="${escapeHtml(deal.id)}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderRequestsView() {
  if (!elements.requestsSummary || !elements.requestsKpiGrid || !elements.requestsActiveDeal || !elements.requestsFocusGrid || !elements.requestsBoard) {
    return;
  }

  const scopedDeals = getScopedDeals().filter((deal) => !isInactiveDeal(deal));
  const buckets = REQUEST_HUB_DEFINITIONS.map((definition) => ({
    ...definition,
    deals: getRequestHubDeals(scopedDeals, definition.key),
  }));
  const activeLaneCount = buckets.filter((bucket) => bucket.deals.length > 0).length;
  const focus = cleanText(ui.requestsFocus) || "all";
  const activeDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;

  elements.requestsSummary.textContent = `${activeLaneCount} active lanes`;
  elements.requestsFocusChip.textContent = `Focus: ${focus === "all" ? "All requests" : getRequestHubTitle(focus)}`;
  elements.requestsKpiGrid.innerHTML = buckets
    .map((bucket) => {
      return `
        <button type="button" class="forecast-card is-clickable ${focus === bucket.key ? "is-selected" : ""}" data-request-focus="${escapeAttribute(bucket.key)}">
          <span>${escapeHtml(bucket.title)}</span>
          <strong>${escapeHtml(String(bucket.deals.length))}</strong>
          <small>${escapeHtml(bucket.description)}</small>
        </button>
      `;
    })
    .join("");

  if (!activeDeal) {
    elements.requestsActiveDeal.innerHTML = `
      <article class="requests-active-card is-empty">
        <div class="requests-active-copy">
          <strong>No deal is currently open in the workspace.</strong>
          <p>Open any client from Funnel, Dashboard, Forecast, or Intelligence to launch Commercial, Legal, DD, Integration, Legal Signoff, Go Live, or Live follow-up from this hub.</p>
        </div>
      </article>
    `;
  } else {
    elements.requestsActiveDeal.innerHTML = `
      <article class="requests-active-card">
        <div class="requests-active-copy">
          <span class="operational-guide-kicker">Active deal</span>
          ${renderCompanyProfileTrigger(
            activeDeal,
            activeDeal.deal || activeDeal.client || activeDeal.operator || "Current deal",
            buildDealContextLine(activeDeal),
            "entity-trigger entity-trigger-block entity-trigger-compact"
          )}
        </div>
        <div class="row-actions">
          ${renderDealWorkflowDocumentButtons(activeDeal, {
            className: "button button-secondary button-small",
            kinds: ["proposal", "legal", "dd", "integration", "signoff"],
            includeTask: true,
            includeEdit: true,
            editLabel: "Open Deal",
          })}
        </div>
      </article>
    `;
  }

  elements.requestsFocusGrid.innerHTML = `
    <button type="button" class="request-focus-card ${focus === "all" ? "is-active" : ""}" data-request-focus="all">
      <span>All Requests</span>
      <strong>${escapeHtml(String(sumValues(buckets.map((bucket) => bucket.deals.length))))}</strong>
      <small>See the full worklist across proposal, legal, DD, integration, legal signoff, go live, and live account control.</small>
    </button>
    ${buckets
      .map((bucket) => {
        return `
          <button type="button" class="request-focus-card ${focus === bucket.key ? "is-active" : ""}" data-request-focus="${escapeAttribute(bucket.key)}">
            <span>${escapeHtml(bucket.title)}</span>
            <strong>${escapeHtml(String(bucket.deals.length))}</strong>
            <small>${escapeHtml(bucket.stageHint)}</small>
          </button>
        `;
      })
      .join("")}
  `;

  const visibleBuckets = focus === "all" ? buckets : buckets.filter((bucket) => bucket.key === focus);
  elements.requestsBoard.innerHTML = visibleBuckets.length
    ? visibleBuckets.map((bucket) => renderRequestHubLane(bucket, focus === "all" ? 6 : 24)).join("")
    : '<div class="empty-state">No request lane is currently selected.</div>';
}

function renderRequestHubLane(bucket, maxItems = 6) {
  const deals = bucket.deals.slice(0, maxItems);
  const hiddenCount = Math.max(bucket.deals.length - deals.length, 0);

  return `
    <section class="request-lane">
      <div class="subpanel-head">
        <div>
          <h3>${escapeHtml(bucket.title)}</h3>
          <small>${escapeHtml(bucket.description)}</small>
        </div>
        <div class="row-actions">
          <span class="chip">${escapeHtml(`${bucket.deals.length} accounts`)}</span>
          <button type="button" class="button button-ghost button-small" data-action="open-request-lane-pipeline" data-request-lane="${escapeAttribute(bucket.key)}">Open Accounts</button>
        </div>
      </div>
      ${
        deals.length
          ? `<div class="request-lane-grid">${deals.map((deal) => renderRequestHubDealCard(deal, bucket.key)).join("")}</div>`
          : `<div class="empty-state">${escapeHtml(bucket.emptyLabel)}</div>`
      }
      ${
        hiddenCount > 0
          ? `<div class="request-lane-foot">${escapeHtml(`${hiddenCount} more accounts match this lane in the current time window.`)}</div>`
          : ""
      }
    </section>
  `;
}

function renderRequestHubDealCard(deal, key) {
  const guide = buildDealOperationalGuide(deal);
  const health = getDealHealth(deal);
  const buttons = renderRequestLaneActionButtons(deal, key);

  return `
    <article class="request-hub-card ${health.cardClass}">
      <div class="request-hub-card-head">
        <div>
          ${renderCompanyProfileTrigger(
            deal,
            deal.deal || deal.client || deal.operator || "Untitled account",
            buildDealContextLine(deal),
            "entity-trigger entity-trigger-block entity-trigger-compact"
          )}
        </div>
        <span class="pill ${health.pillClass}">${escapeHtml(getDealVisibleStage(deal) || "No stage")}</span>
      </div>
      <div class="request-hub-meta">
        <span><strong>Market:</strong> ${escapeHtml(deal.market || "N/A")}</span>
        <span><strong>Owner:</strong> ${escapeHtml(getDealOwner(deal) || "Unassigned")}</span>
        <span><strong>Follow-up:</strong> ${escapeHtml(formatDate(deal.lastFollowUp))}</span>
        <span><strong>Status:</strong> ${escapeHtml(getRequestHubStatusText(deal, key))}</span>
      </div>
      <p>${escapeHtml(guide.recommendation)}</p>
      <div class="row-actions">${buttons}</div>
    </article>
  `;
}

function getRequestHubDeals(deals, key) {
  return deals.filter((deal) => matchesRequestHubLane(deal, key)).sort((left, right) => {
    const stageDiff = STAGE_ORDER.indexOf(getDealOperationalStage(left)) - STAGE_ORDER.indexOf(getDealOperationalStage(right));
    if (stageDiff !== 0) {
      return stageDiff;
    }
    return (daysSince(left.lastFollowUp) || 0) - (daysSince(right.lastFollowUp) || 0);
  });
}

function matchesRequestHubLane(deal, key) {
  const stage = getDealOperationalStage(deal);
  const legalStatus = cleanText(deal.legalStatus);
  const ddStatus = cleanText(deal.ddStatus);
  const integrationStatus = cleanText(deal.integrationStatus);
  const goLiveStatus = cleanText(deal.goLiveStatus);

  if (key === "proposal") {
    return ["Lead", "Qualified", "Proposal"].includes(stage) || hasAnyText(deal.proposalRequest, deal.commercialTerms, deal.commercialSchedule);
  }

  if (key === "legal") {
    return ["Proposal", "Legal"].includes(stage) || (legalStatus && legalStatus !== "Not Started") || hasAnyText(deal.companyName, deal.companyRegistrationNumber, deal.companyLicense);
  }

  if (key === "dd") {
    return ["Legal", "DD"].includes(stage) || (ddStatus && ddStatus !== "Not Started") || hasAnyText(deal.ddContactName, deal.ddContactEmail, deal.ddTicket);
  }

  if (key === "integration") {
    return ["DD", "Integration"].includes(stage) || (integrationStatus && integrationStatus !== "Not Started") || hasAnyText(deal.integrationRequest, deal.integrationEmail, deal.jira);
  }

  if (key === "signoff") {
    return stage === "Legal Approval" || goLiveStatus === "Legal Sign-Off" || hasAnyText(deal.legalSignoffRequest, deal.legalApprovalDate);
  }

  if (key === "go-live") {
    return ["Legal Approval", "Go Live"].includes(stage) || ["Legal Sign-Off", "Completed"].includes(goLiveStatus);
  }

  if (key === "live") {
    return ["Live", "Handover"].includes(stage) || goLiveStatus === "Live" || cleanText(deal.liveSince);
  }

  return false;
}

function renderRequestLaneActionButtons(deal, key) {
  if (["proposal", "legal", "dd", "integration", "signoff"].includes(key)) {
    return renderDealWorkflowDocumentButtons(deal, {
      className: "button button-secondary button-small",
      kinds: [key],
      includeTask: true,
      includeEdit: true,
      editLabel: "Open Deal",
    });
  }

  return renderDealWorkflowDocumentButtons(deal, {
    className: "button button-secondary button-small",
    includeTask: true,
    includeEdit: true,
    editLabel: "Open Deal",
    kinds: [],
  });
}

function getRequestHubStatusText(deal, key) {
  if (key === "proposal") {
    return deal.offerDate ? `Offer date ${formatDate(deal.offerDate)}` : deal.agreement || "Commercial scope pending";
  }
  if (key === "legal") {
    return deal.legalStatus || deal.agreement || "Legal pack pending";
  }
  if (key === "dd") {
    return deal.ddStatus || "DD pending";
  }
  if (key === "integration") {
    return deal.integrationStatus || "Integration pending";
  }
  if (key === "signoff") {
    return deal.legalApprovalDate
      ? `Signoff date ${formatDate(deal.legalApprovalDate)}`
      : deal.goLiveStatus || deal.legalStatus || "Legal signoff pending";
  }
  return deal.status || "Pending";
}

function getRequestHubTitle(key) {
  return REQUEST_HUB_DEFINITIONS.find((item) => item.key === key)?.title || "Requests";
}

function renderTargets() {
  const year = getActiveTargetYear();
  const annualTargets = state.targets.filter((target) => Number(target.year || 0) === year);
  elements.targetSummaryTitle.textContent = `Targets y ejecucion ${year}`;
  elements.targetCount.textContent = `${annualTargets.length} targets · ${year}`;
  renderTargetProgress(year);
  renderTargetTable();
}

function renderTargetProgress(year) {
  const targets = state.targets.filter((target) => Number(target.year || 0) === year);
  const targetMatchedDeals = getTargetMatchedDeals(targets, state.deals);
  const annualDeals = targetMatchedDeals.filter((deal) => !isInactiveDeal(deal) && resolveDealYear(deal) === year);
  const annualLiveDeals = targetMatchedDeals.filter((deal) => !isInactiveDeal(deal) && getGoLiveReferenceYear(deal) === year);
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
    ddPipeline: annualDeals.filter((deal) => ["DD", "Integration", "Legal Approval", "Go Live"].includes(cleanText(deal.stage)) || deal.ddStartedFlag).length,
    newGoLive: annualLiveDeals.filter((deal) => deal.newTraffic || String(deal.type || "").toLowerCase().includes("new")).length,
    totalGoLive: annualLiveDeals.filter((deal) => ["Go Live", "Live", "Handover"].includes(cleanText(deal.stage)) || deal.goLiveFlag).length,
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

function doesTargetMatchDeal(target, deal) {
  if (!target || !deal || isInactiveDeal(deal)) {
    return false;
  }

  if (Number(target.year || 0) && resolveDealYear(deal) !== Number(target.year || 0) && getGoLiveReferenceYear(deal) !== Number(target.year || 0)) {
    return false;
  }

  if (!isGlobalTarget(target)) {
    const targetMarket = cleanText(target.market);
    const targetType = cleanText(target.type);
    const targetPlatform = cleanText(target.platform);

    if (targetMarket && targetMarket !== "Global" && cleanText(deal.market) !== targetMarket) {
      return false;
    }

    if (targetType && targetType !== "All" && cleanText(deal.type) !== targetType) {
      return false;
    }

    if (targetPlatform && targetPlatform !== "All" && cleanText(deal.platform) !== targetPlatform) {
      return false;
    }

    if (target.newTraffic && !deal.newTraffic) {
      return false;
    }

    if (!target.newTraffic && deal.newTraffic) {
      return false;
    }
  }

  return true;
}

function getTargetMatchedDeals(targets = [], deals = state.deals) {
  if (!Array.isArray(targets) || targets.length === 0) {
    return deals.filter((deal) => !isInactiveDeal(deal));
  }

  const matched = new Map();
  deals.forEach((deal) => {
    if (targets.some((target) => doesTargetMatchDeal(target, deal))) {
      matched.set(deal.id, deal);
    }
  });
  return Array.from(matched.values());
}

function getGoLiveReferenceYear(deal) {
  return yearFromDate(deal.liveDate) || yearFromDate(deal.liveSince) || (deal.goLiveFlag ? resolveDealYear(deal) : null);
}

function getActionBuckets(tasks = getVisibleTasks()) {
  const activeTasks = tasks.filter((task) => task.status !== "Done");
  const buckets = {
    overdue: [],
    today: [],
    upcoming: [],
    blocked: [],
  };

  activeTasks.forEach((task) => {
    if (task.status === "Blocked") {
      buckets.blocked.push(task);
      return;
    }

    const dueDate = cleanText(task.dueDate);
    if (!dueDate) {
      buckets.upcoming.push(task);
      return;
    }

    const delta = daysUntil(dueDate);
    if (delta < 0) {
      buckets.overdue.push(task);
    } else if (delta === 0) {
      buckets.today.push(task);
    } else {
      buckets.upcoming.push(task);
    }
  });

  buckets.overdue = sortActionTasks(buckets.overdue);
  buckets.today = sortActionTasks(buckets.today);
  buckets.upcoming = sortActionTasks(buckets.upcoming);
  buckets.blocked = sortActionTasks(buckets.blocked);

  return buckets;
}

function getTaskRelatedDeal(task) {
  const directId = cleanText(task.dealId);
  if (directId) {
    const byId = state.deals.find((deal) => deal.id === directId || deal.dealNumber === directId);
    if (byId) {
      return byId;
    }
  }

  const candidates = [task.deal, task.client, task.operator].map((value) => cleanText(value).toLowerCase()).filter(Boolean);
  if (candidates.length === 0) {
    return null;
  }

  return state.deals.find((deal) => {
    const labels = [deal.deal, deal.client, deal.operator, getPrimaryOperatorName(deal), getCompanyProfileLabel(deal)]
      .map((value) => cleanText(value).toLowerCase())
      .filter(Boolean);
    return candidates.some((candidate) => labels.some((label) => label === candidate || label.includes(candidate) || candidate.includes(label)));
  }) || null;
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
  const buckets = getActionBuckets(visibleTasks);
  const todayCount = buckets.overdue.length + buckets.today.length;
  elements.taskSummary.textContent = ui.taskPreset ? `${visibleTasks.length} actions · ${ui.taskPreset.label}` : `${todayCount} require action today`;
  elements.taskOpenCount.textContent = `${openCount} open`;
  renderTaskBoard(visibleTasks);
  renderTaskTable(visibleTasks);
}

function renderTaskBoard(tasks = getVisibleTasks()) {
  const buckets = getActionBuckets(tasks);
  const groups = [
    { key: "overdue", title: "Overdue", tone: "danger", tasks: buckets.overdue },
    { key: "today", title: "Due Today", tone: "warn", tasks: buckets.today },
    { key: "upcoming", title: "Upcoming", tone: "success", tasks: buckets.upcoming },
    { key: "blocked", title: "Blocked", tone: "neutral", tasks: buckets.blocked },
  ];

  if (tasks.length === 0) {
    elements.taskBoard.innerHTML = '<div class="empty-state">No actions match the active filters. Create one from a deal, account, market, or target.</div>';
    return;
  }

  elements.taskBoard.innerHTML = groups
    .map((group) => {
      return `
        <section class="task-column action-column action-${group.tone}">
          <header>
            <strong>${escapeHtml(group.title)}</strong>
            <span>${group.tasks.length}</span>
          </header>
          <div class="task-column-list">
            ${
              group.tasks.length
                ? group.tasks.sort((left, right) => compareTasks(left, right)).map((task) => renderTaskCard(task)).join("")
                : '<div class="empty-state">Clear.</div>'
            }
          </div>
        </section>
      `;
    })
    .join("");
}

function renderTaskCard(task) {
  const deal = getTaskRelatedDeal(task);
  const operator = deal ? getPrimaryOperatorName(deal) : task.operator || task.client || task.deal || task.title || "Action";
  const market = deal?.market || task.market || "No market";
  const stage = deal?.stage || task.scopeType || "No stage";
  return `
    <article class="task-card ${taskStatusClass(task.status)}">
      <div class="task-card-head">
        <div>
          <span class="task-number">${escapeHtml(task.taskNumber || "Pending number")}</span>
          <strong>${escapeHtml(operator)}</strong>
          <small>${escapeHtml(`${market} · ${stage}`)}</small>
        </div>
        <span class="task-priority">${escapeHtml(task.priority)}</span>
      </div>
      <div class="pill-row">
        <span class="pill stage">${escapeHtml(stage)}</span>
        <span class="pill neutral">${escapeHtml(task.owner || "Unassigned")}</span>
        <span class="pill ${taskStatusPillClass(task.status)}">${escapeHtml(task.status)}</span>
      </div>
      <div class="task-card-meta">
        <span><strong>Due:</strong> ${formatDate(task.dueDate)}</span>
        <span><strong>Market:</strong> ${escapeHtml(market)}</span>
        <span><strong>Jira:</strong> ${escapeHtml(task.jiraTicket || deal?.jira || "N/A")}</span>
      </div>
      <p>${escapeHtml(task.nextStep || "Sin next step definido.")}</p>
      <small class="task-trace">${escapeHtml(getLatestTraceLine(task.traceLog) || "Sin trazabilidad registrada.")}</small>
      <div class="kanban-actions">
        <button class="icon-button success" data-action="mark-task-done" data-id="${escapeHtml(task.id)}">Mark Done</button>
        ${deal ? `<button class="icon-button" data-action="open-task-deal" data-id="${escapeHtml(task.id)}">Open Deal</button>` : ""}
        <button class="icon-button" data-action="edit-task" data-id="${escapeHtml(task.id)}">Edit</button>
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

function buildDealDraftFromForm(existingDeal) {
  const formData = new FormData(dealForm);
  return synchronizeDealIdentityFields(
    normalizeDeal({
      ...(existingDeal || {}),
      ...Object.fromEntries(formData.entries()),
      id: ui.editingDealId || existingDeal?.id || generateId("deal"),
      newTraffic: formData.has("newTraffic"),
      leadFlag: formData.has("leadFlag"),
      signedFlag: formData.has("signedFlag"),
      ddStartedFlag: formData.has("ddStartedFlag"),
      ddCompletedFlag: formData.has("ddCompletedFlag"),
      integrationStartedFlag: formData.has("integrationStartedFlag"),
      integrationCompletedFlag: formData.has("integrationCompletedFlag"),
      goLiveFlag: formData.has("goLiveFlag"),
      followUpNotificationsEnabled: formData.has("followUpNotificationsEnabled"),
    })
  );
}

function synchronizeDealIdentityFields(deal) {
  const draft = { ...deal };
  const primaryAccountName = cleanText(draft.client || draft.operator || draft.companyName || draft.documentClientName || draft.deal);
  const primaryLegalName = cleanText(draft.companyName || draft.legalEntity || primaryAccountName);
  const primaryDocumentName = cleanText(draft.documentClientName || primaryLegalName || primaryAccountName);

  if (!cleanText(draft.deal) && primaryAccountName) {
    draft.deal = primaryAccountName;
  }

  if (!cleanText(draft.client) && (primaryAccountName || cleanText(draft.deal))) {
    draft.client = primaryAccountName || cleanText(draft.deal);
  }

  if (!cleanText(draft.operator) && cleanText(draft.client)) {
    draft.operator = cleanText(draft.client);
  }

  if (!cleanText(draft.companyName) && primaryLegalName) {
    draft.companyName = primaryLegalName;
  }

  if (!cleanText(draft.documentClientName) && primaryDocumentName) {
    draft.documentClientName = primaryDocumentName;
  }

  return draft;
}

async function handleDealSubmit(event) {
  event.preventDefault();

  const isEditing = Boolean(ui.editingDealId);
  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const draft = buildDealDraftFromForm(existingDeal);
  const autosaveKey = getActiveDealAutosaveKey();

  if (!draft.deal.trim()) {
    setBanner("Add at least a deal or account name before saving.", "danger");
    return;
  }

  if (ui.editingDealId) {
    state.deals = state.deals.map((deal) => (deal.id === ui.editingDealId ? draft : deal));
  } else {
    state.deals = [draft, ...state.deals];
  }

  recordWorkspaceHistory(isEditing ? "Deal updated" : "Deal created", `${draft.deal} · ${draft.stage || "No stage"} · ${draft.market || "No market"}`, {
    entityType: "deal",
    entityId: draft.id,
  });
  const saved = await persistState();
  clearDealAutosaveEntry(autosaveKey);
  ui.dealAutosaveStatus = "idle";
  ui.dealAutosaveSavedAt = "";
  ui.dealAutosaveRestored = false;
  ui.editingDealId = null;
  closeDealModal();
  resetDealForm();
  renderAll();
  activateView("pipeline", { targetSelector: "#pipeline-board" });
  setBanner(buildExcelBanner(saved ? `Account saved to Excel: ${draft.deal}.` : `Account updated in memory: ${draft.deal}.`), saved ? "success" : "warn");
}

async function handleMarketIntelSubmit(event) {
  event.preventDefault();

  const formData = new FormData(marketIntelForm);
  const isEditing = Boolean(ui.editingMarketIntelId);
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

  recordWorkspaceHistory(isEditing ? "Market intelligence updated" : "Market intelligence created", `${draft.country} · ${draft.regulatoryStatus || "Status pending"}`, {
    entityType: "market-intel",
    entityId: draft.id,
  });
  const saved = await persistState();
  ui.editingMarketIntelId = null;
  resetMarketIntelForm();
  renderAll();
  activateView("crm", { targetSelector: "#market-intel-board" });
  setBanner(buildExcelBanner(saved ? `Market intelligence saved: ${draft.country}.` : `Market intelligence updated in memory: ${draft.country}.`), saved ? "success" : "warn");
}

async function handleTargetSubmit(event) {
  event.preventDefault();

  const formData = new FormData(targetForm);
  const isEditing = Boolean(ui.editingTargetId);
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

  recordWorkspaceHistory(isEditing ? "Target updated" : "Target created", `${draft.market} ${draft.year} · ${draft.newSigned || 0} signed target`, {
    entityType: "target",
    entityId: draft.id,
  });
  const saved = await persistState();
  ui.editingTargetId = null;
  resetTargetForm();
  renderAll();
  activateView("targets", { targetSelector: "#target-progress" });
  setBanner(
    buildExcelBanner(saved ? `Target guardado en Excel para ${draft.market}.` : `Target actualizado en memoria para ${draft.market}.`),
    saved ? "success" : "warn"
  );
}

async function handleTaskSubmit(event) {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const isEditing = Boolean(ui.editingTaskId);
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

  recordWorkspaceHistory(isEditing ? "Task updated" : "Task created", `${draft.title} · ${draft.status} · ${draft.owner || "Unassigned"}`, {
    entityType: "task",
    entityId: draft.id,
  });
  const saved = await persistState();
  ui.editingTaskId = null;
  resetTaskForm();
  renderAll();
  activateView("tasks", { targetSelector: "#task-board" });
  setBanner(buildExcelBanner(saved ? `Tarea guardada: ${draft.title}.` : `Tarea actualizada solo en memoria: ${draft.title}.`), saved ? "success" : "warn");
}

async function handleCampaignSubmit(event) {
  event.preventDefault();

  const formData = new FormData(campaignForm);
  const isEditing = Boolean(ui.editingCampaignId);
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

  recordWorkspaceHistory(isEditing ? "Campaign updated" : "Campaign created", `${draft.title} · ${draft.status} · ${draft.market || "No market"}`, {
    entityType: "campaign",
    entityId: draft.id,
  });
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

  recordWorkspaceHistory("Workspace settings updated", `${state.workspace.workspaceName} · ${state.workspace.organizationName}`, {
    entityType: "workspace",
    entityId: "workspace",
  });
  const saved = await persistState();
  renderAll();
  setBanner(buildExcelBanner(saved ? `Workspace updated: ${state.workspace.workspaceName}.` : `Workspace updated in memory only: ${state.workspace.workspaceName}.`), saved ? "success" : "warn");
}

async function handleUserSubmit(event) {
  event.preventDefault();

  const formData = new FormData(userForm);
  const isEditing = Boolean(ui.editingUserId);
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

  recordWorkspaceHistory(isEditing ? "User updated" : "User created", `${draft.fullName} · ${draft.role} · ${draft.status}`, {
    entityType: "user",
    entityId: draft.id,
  });
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
    renderAll();
    activateView("tasks", { targetSelector: "#task-board" });
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
    renderAll();
    activateView("campaigns", { targetSelector: "#campaign-board" });
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
  const matchedDeals = scopedDeals.filter((deal) => getDealVisibleStage(deal) === normalizedStage);
  if (matchedDeals.length === 0) {
    setBanner(`No deals are currently available in ${normalizedStage} for the active time window.`, "warn");
    return;
  }

  resetPipelineOperationalFilters();
  ui.pipelinePreset = null;
  ui.filters.stage = normalizedStage;
  renderAll();
  activateView("pipeline", { targetSelector: "#pipeline-board" });
  setBanner(`Pipeline filtered to ${normalizedStage}: ${matchedDeals.length} matching deals.`, "success");
}

function handleDealWorkflowGuideAction(event) {
  const documentButton = event.target.closest("[data-stage-doc-action]");
  if (documentButton) {
    void exportDealDocx(documentButton.dataset.stageDocAction);
    return;
  }

  const taskButton = event.target.closest("[data-stage-prefill-task]");
  if (!taskButton) {
    return;
  }

  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const draft = buildDealDraftFromForm(existingDeal);
  if (!hasAnyText(draft.deal, draft.client, draft.operator)) {
    setBanner("Name the deal, client, or operator before creating a follow-up task.", "warn");
    return;
  }

  prefillTaskFromDealSnapshot(draft);
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
    renderAll();
    activateView("tasks", { targetSelector: "#task-board" });
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
    renderAll();
    activateView("campaigns", { targetSelector: "#campaign-board" });
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

function openRequestLaneDrilldown(laneKey) {
  const key = cleanText(laneKey) || "all";
  const scopedDeals = getScopedDeals().filter((deal) => !isInactiveDeal(deal));
  const matchedDeals =
    key === "all"
      ? scopedDeals.filter((deal) => REQUEST_HUB_DEFINITIONS.some((definition) => matchesRequestHubLane(deal, definition.key)))
      : getRequestHubDeals(scopedDeals, key);
  const label = key === "all" ? "All Requests" : getRequestHubTitle(key);
  if (!matchedDeals.length) {
    setBanner(`No accounts are available for ${label} in the current review window.`, "warn");
    return;
  }
  const preset = createPipelinePreset("request-lane", label, { key });
  openPipelinePresetDrilldown(preset, matchedDeals, `Pipeline drilldown loaded for ${label}: ${matchedDeals.length} matching accounts.`);
}

function openPipelinePresetDrilldown(preset, matchedDeals, successMessage) {
  resetPipelineOperationalFilters();
  ui.pipelinePreset = preset;
  if (preset.applyMarketFilter && preset.market) {
    ui.filters.market = preset.market;
  }
  renderAll();
  activateView("pipeline", { targetSelector: "#pipeline-board" });
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

  if (preset.type === "request-lane") {
    const activeDeals = getForecastEligibleDeals(deals);
    if (preset.key === "all") {
      return activeDeals.filter((deal) => REQUEST_HUB_DEFINITIONS.some((definition) => matchesRequestHubLane(deal, definition.key)));
    }
    return getRequestHubDeals(activeDeals, preset.key);
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
  const annualTargets = state.targets.filter((target) => Number(target.year || 0) === activeYear);
  const matchedDeals = getTargetMatchedDeals(annualTargets, deals);
  const annualDeals = matchedDeals.filter((deal) => !isInactiveDeal(deal) && resolveDealYear(deal) === activeYear);
  const annualLiveDeals = matchedDeals.filter((deal) => !isInactiveDeal(deal) && getGoLiveReferenceYear(deal) === activeYear);

  if (drilldownKey === "new-signed") {
    return annualDeals.filter((deal) => deal.signedFlag);
  }

  if (drilldownKey === "integrations") {
    return annualDeals.filter((deal) => deal.stage === "Integration" || deal.integrationStartedFlag);
  }

  if (drilldownKey === "dd-pipeline") {
    return annualDeals.filter((deal) => ["DD", "Integration", "Legal Approval", "Go Live"].includes(cleanText(deal.stage)) || deal.ddStartedFlag);
  }

  if (drilldownKey === "new-go-live") {
    return annualLiveDeals.filter((deal) => deal.newTraffic || String(deal.type || "").toLowerCase().includes("new"));
  }

  if (drilldownKey === "total-go-live") {
    return annualLiveDeals.filter((deal) => ["Go Live", "Live", "Handover"].includes(cleanText(deal.stage)) || deal.goLiveFlag);
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
  openDealModal();
  renderViewState();
  window.scrollTo({ top: 0, behavior: "smooth" });
  setBanner(`Editing deal: ${deal.deal}.`, "default");
}

function openDealModal() {
  ui.dealModalOpen = true;
  renderViewState();
}

function closeDealModal() {
  ui.dealModalOpen = false;
  renderViewState();
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
  if (action === "create-legal-request-from-deal") {
    const sourceDeal = state.deals.find((item) => item.id === id);
    if (sourceDeal) {
      void exportDealDocx("legal", sourceDeal);
    }
    return;
  }
  if (action === "create-proposal-request-from-deal") {
    const sourceDeal = state.deals.find((item) => item.id === id);
    if (sourceDeal) {
      void exportDealDocx("proposal", sourceDeal);
    }
    return;
  }
  if (action === "create-dd-request-from-deal") {
    const sourceDeal = state.deals.find((item) => item.id === id);
    if (sourceDeal) {
      void exportDealDocx("dd", sourceDeal);
    }
    return;
  }
  if (action === "create-integration-request-from-deal") {
    const sourceDeal = state.deals.find((item) => item.id === id);
    if (sourceDeal) {
      void exportDealDocx("integration", sourceDeal);
    }
    return;
  }
  if (action === "create-signoff-request-from-deal") {
    const sourceDeal = state.deals.find((item) => item.id === id);
    if (sourceDeal) {
      void exportDealDocx("signoff", sourceDeal);
    }
    return;
  }
  if (action === "mark-followed-up-today-from-deal") {
    const sourceDeal = state.deals.find((item) => item.id === id);
    if (sourceDeal) {
      const today = new Date().toISOString().slice(0, 10);
      const updatedDeal = normalizeDeal({
        ...sourceDeal,
        lastFollowUp: today,
        nextFollowUpDate: addDaysToIsoDate(today, getFollowUpCadenceDays(resolveDealFollowUpCadence(sourceDeal))),
        followUpOwner: cleanText(sourceDeal.followUpOwner) || getDealOwner(sourceDeal) || getActiveUser()?.fullName || "",
        followUpNotificationsEnabled: sourceDeal.followUpNotificationsEnabled !== false,
        updates: appendTraceLog(sourceDeal.updates, "Follow-up completed"),
      });
      state.deals = state.deals.map((item) => (item.id === id ? updatedDeal : item));
      const saved = await persistState();
      renderAll();
      setBanner(buildExcelBanner(saved ? `Follow-up refreshed for ${updatedDeal.deal}.` : `Follow-up refreshed in browser storage for ${updatedDeal.deal}.`), saved ? "success" : "warn");
    }
    return;
  }
  if (action === "open-company-profile") {
    openCompanyProfileById(id);
    return;
  }

  const deal = state.deals.find((item) => item.id === id);
  if (!deal) {
    return;
  }

  if (action === "edit-deal") {
    openDealEditorById(id);
  }

  if (action === "advance-deal-stage") {
    await moveDealToStage(id, button.dataset.nextStage);
    return;
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
    ui.editingMarketIntelId = id;
    fillMarketIntelForm(record);
    activateView("crm", { targetSelector: "#market-intel-form", focusField: true, editMode: true });
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
    stage: formData.get("stage"),
    status: formData.get("status"),
    lastFollowUp: formData.get("lastFollowUp"),
    actionItems: formData.get("actionItems"),
    updates: formData.get("updates"),
  });

  state.deals = state.deals.map((deal) => (deal.id === leadId ? updatedLead : deal));
  recordWorkspaceHistory("Lead tracker updated", `${updatedLead.deal} · ${updatedLead.stage} · ${updatedLead.status || "No status"}`, {
    entityType: "deal",
    entityId: updatedLead.id,
  });
  const saved = await persistState();
  renderAll();
  setBanner(
    buildExcelBanner(saved ? `Seguimiento actualizado: ${updatedLead.deal}.` : `Seguimiento actualizado solo en memoria: ${updatedLead.deal}.`),
    saved ? "success" : "warn"
  );
}

function handleRequestsAction(event) {
  const focusButton = event.target.closest("[data-request-focus]");
  if (focusButton) {
    ui.requestsFocus = cleanText(focusButton.dataset.requestFocus) || "all";
    renderRequestsView();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    if (actionButton.dataset.action === "open-request-lane-pipeline") {
      openRequestLaneDrilldown(actionButton.dataset.requestLane);
      return;
    }
    void handleDealAction(event);
  }
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
    ui.editingTargetId = id;
    fillTargetForm(target);
    activateView("targets", { targetSelector: "#target-form", focusField: true, editMode: true });
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
    ui.editingTaskId = id;
    fillTaskForm(task);
    activateView("tasks", { targetSelector: "#task-form", focusField: true, editMode: true });
    setBanner(`Editando tarea: ${task.title}.`, "default");
  }

  if (action === "mark-task-done") {
    task.status = "Done";
    task.updatedAt = new Date().toISOString();
    const saved = await persistState();
    renderAll();
    setBanner(buildExcelBanner(saved ? `Action completed: ${task.title}.` : `Action completed in memory: ${task.title}.`), saved ? "success" : "warn");
  }

  if (action === "open-task-deal") {
    const deal = getTaskRelatedDeal(task);
    if (deal) {
      openCompanyProfileById(deal.id);
      setBanner(`Opened deal for action: ${task.title}.`, "default");
    }
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
    activateView("campaigns", { targetSelector: "#campaign-form", focusField: true, editMode: true });
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
    activateView("admin", { targetSelector: "#user-form", focusField: true, editMode: true });
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
  activateView(view);
}

function prefillTaskFromDeal(deal) {
  const draft = normalizeTask({
    ...buildTaskPrefillFromSnapshot(deal),
    title: `Follow-up ${deal.client || deal.deal}`,
    scopeType: "Client",
    dealId: deal.id,
    nextStep: deal.actionItems || buildDealOperationalGuide(deal).recommendation,
    notes: deal.statusText || deal.comments,
  });
  ui.editingTaskId = null;
  fillTaskForm(draft);
  activateView("tasks", { targetSelector: "#task-form", focusField: true, editMode: true });
  setBanner(`Nueva tarea prefijada desde ${deal.deal}.`, "default");
}

function prefillTaskFromDealSnapshot(deal) {
  const draft = buildTaskPrefillFromSnapshot(deal);
  ui.editingTaskId = null;
  fillTaskForm(draft);
  activateView("tasks", { targetSelector: "#task-form", focusField: true, editMode: true });
  setBanner(`Follow-up task prepared from ${deal.deal || deal.client || deal.operator || "current deal"}.`, "default");
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

function fillDealForm(deal, options = {}) {
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
    "followUpCadence",
    "nextFollowUpDate",
    "followUpOwner",
    "followUpNotes",
    "handover",
    "prospectDate",
    "offerDate",
    "ddDate",
    "integrationDate",
    "legalApprovalDate",
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
    "companyName",
    "companyRegistrationNumber",
    "companyRegisteredAddress",
    "companyLegalRepresentative",
    "companyLicense",
    "invoiceEmail",
    "supportEmail",
    "managementEmail",
    "ddContactName",
    "ddContactEmail",
    "legalRepresentativeName",
    "legalRepresentativeId",
    "legalRepresentativeAddress",
    "legalRepresentativeEmail",
    "clientBased",
    "otherLiveSuppliers",
    "integrationTeam",
    "teamsGroup",
    "integrationRequest",
    "legalSignoffRequest",
    "otherInfo",
    "documentClientName",
    "proposalValidityDays",
    "proposalValidUntil",
    "proposalRequest",
    "negotiatedProducts",
    "activationRequirements",
    "pricingBase",
    "deductionTerms",
    "commercialTerms",
    "commercialSchedule",
    "negotiationScope",
    "setupFeeStatus",
    "setupFeeAmount",
    "marketingCommitments",
    "liveGamesTopPosition",
    "slotsTopPosition",
    "deductionsAllowed",
    "bonusCap",
    "gamingTax",
    "withholdingTax",
    "advancePayment",
    "creditNotes",
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
    const element = dealForm.elements[field];
    if (element) {
      element.value = deal[field] ?? "";
    }
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
    "followUpNotificationsEnabled",
  ].forEach((field) => {
    const element = dealForm.elements[field];
    if (element) {
      element.checked = Boolean(deal[field]);
    }
  });

  elements.dealFormTitle.textContent = `Edit Account: ${deal.deal || deal.client || deal.operator || "Draft"}`;
  elements.dealSubmitButton.textContent = "Update Account";
  ui.companyAssistKey = getCompanyProfileKey(deal);
  resetCommercialBuilder();
  syncDealScoringPreview();
  refreshDealFieldHighlights();
  setDealAutosaveBaseline();
  if (options.autoRestore ?? Boolean(ui.editingDealId)) {
    maybeRestoreActiveDealAutosave();
  } else {
    renderDealAutosaveState();
  }
}

function resetDealForm() {
  const draft = createEmptyDeal();
  ui.editingDealId = null;
  dealForm.reset();
  fillDealForm(draft, { autoRestore: true });
  ui.companyAssistKey = "";
  elements.dealFormTitle.textContent = "New Account";
  elements.dealSubmitButton.textContent = "Save Account";
  resetCommercialBuilder();
  syncDealScoringPreview();
  refreshDealFieldHighlights();
}

function refreshDealFieldHighlights() {
  if (!dealForm) {
    return;
  }

  const pendingValues = new Set(["", "not started", "pending", "select cadence"]);
  const labels = Array.from(dealForm.querySelectorAll("label"));
  const missingFields = [];
  const pendingFields = [];

  labels.forEach((label) => {
    const field = label.querySelector("input, select, textarea");
    if (!field) {
      return;
    }

    label.classList.remove("field-empty", "field-pending");

    if (field.disabled || field.type === "hidden" || field.closest(".toggle-grid")) {
      return;
    }

    if (field.type === "checkbox") {
      return;
    }

    const isReadonly = field.hasAttribute("readonly");
    const value = cleanText(field.value).toLowerCase();
    const required = field.required;
    const labelText = getDealFieldLabelText(label);

    if (!isReadonly && ((required && !value) || isDealFieldPriorityEmpty(field.name, value))) {
      label.classList.add("field-empty");
      if (field.name && labelText) {
        missingFields.push({ name: field.name, label: labelText });
      }
      return;
    }

    if (!isReadonly && isDealFieldPending(field.name, value, pendingValues)) {
      label.classList.add("field-pending");
      if (field.name && labelText) {
        pendingFields.push({ name: field.name, label: labelText });
      }
    }
  });

  renderDealFieldSummary(missingFields, pendingFields);
}

function isDealFieldPriorityEmpty(fieldName, value) {
  const highPriorityFields = new Set([
    "deal",
    "client",
    "operator",
    "kam",
    "market",
    "stage",
    "dealValue",
    "actionItems",
    "legalStatus",
    "ddStatus",
    "integrationStatus",
  ]);

  return highPriorityFields.has(fieldName) && !value;
}

function isDealFieldPending(fieldName, value, pendingValues) {
  const pendingFields = new Set([
    "legalStatus",
    "ddStatus",
    "integrationStatus",
    "goLiveStatus",
    "agreement",
    "followUpCadence",
  ]);

  return pendingFields.has(fieldName) && pendingValues.has(value);
}

function renderDealFieldSummary(missingFields = [], pendingFields = []) {
  if (!elements.dealFieldSummary) {
    return;
  }

  if (!missingFields.length && !pendingFields.length) {
    elements.dealFieldSummary.innerHTML = `
      <div class="deal-field-summary-card is-complete">
        <strong>Deal editor status</strong>
        <p>Core fields are covered. Nothing critical is missing or pending right now.</p>
      </div>
    `;
    return;
  }

  elements.dealFieldSummary.innerHTML = `
    <div class="deal-field-summary-card">
      <div class="deal-field-summary-head">
        <strong>Missing or pending</strong>
        <span>${missingFields.length + pendingFields.length} fields</span>
      </div>
      ${missingFields.length ? `
        <div class="deal-field-summary-group">
          <span>Missing</span>
          <div class="deal-field-chip-row">
            ${missingFields.map((field) => `<button type="button" class="deal-field-chip is-missing" data-focus-deal-field="${escapeAttribute(field.name)}">${escapeHtml(field.label)}</button>`).join("")}
          </div>
        </div>
      ` : ""}
      ${pendingFields.length ? `
        <div class="deal-field-summary-group">
          <span>Pending</span>
          <div class="deal-field-chip-row">
            ${pendingFields.map((field) => `<button type="button" class="deal-field-chip is-pending" data-focus-deal-field="${escapeAttribute(field.name)}">${escapeHtml(field.label)}</button>`).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function getDealFieldLabelText(label) {
  const clone = label.cloneNode(true);
  clone.querySelectorAll("input, select, textarea").forEach((field) => field.remove());
  return cleanText(clone.textContent).replace(/\s+/g, " ").trim();
}

function focusDealField(fieldName) {
  if (!dealForm || !fieldName) {
    return;
  }

  const field = dealForm.elements[fieldName];
  if (!field) {
    return;
  }

  const label = field.closest("label");
  label?.scrollIntoView({ block: "center", behavior: "smooth" });
  window.setTimeout(() => {
    field.focus({ preventScroll: true });
    if (typeof field.select === "function" && ["text", "search", "url", "email", "tel", "number"].includes(field.type)) {
      field.select();
    }
  }, 160);
}

function buildDealSearchText(deal) {
  return normalizeSearchText(
    [
      deal.deal,
      deal.client,
      deal.operator,
      deal.casinoName,
      deal.groupName,
      deal.kam,
      deal.market,
      deal.platform,
      deal.legalEntity,
      deal.segment,
      deal.primaryContact,
      deal.decisionMaker,
      deal.licenseStatus,
      deal.currentCompetitors,
      deal.productsCurrent,
      deal.productsPotential,
      deal.targetPriority,
      deal.priorityClass,
      deal.statusText,
      deal.comments,
      deal.jira,
      deal.ddTicket,
      deal.url,
      deal.brands,
      deal.entityInfo,
      deal.skype,
      deal.integrationEmail,
      deal.siteStatus,
      deal.actionItems,
      deal.updates,
      deal.dd,
      deal.integration,
      deal.companyName,
      deal.documentClientName,
      deal.companyRegistrationNumber,
      deal.invoiceEmail,
      deal.supportEmail,
      deal.managementEmail,
      deal.ddContactName,
      deal.ddContactEmail,
      deal.legalRepresentativeName,
      deal.legalRepresentativeEmail,
    ].join(" ")
  );
}

function buildDealFormAssistOptions(companyProfiles = []) {
  const fields = new Map();
  const push = (key, value) => {
    const safeValue = cleanText(value);
    if (!safeValue) {
      return;
    }
    if (!fields.has(key)) {
      fields.set(key, new Set());
    }
    fields.get(key).add(safeValue);
  };

  companyProfiles.forEach((profile) => {
    const primary = profile.primary || {};
    push("deal-company-options", profile.title);
    push("deal-company-options", primary.companyName);
    push("deal-company-options", primary.documentClientName);
    push("deal-client-options", primary.client);
    push("deal-operator-options", primary.operator);
    push("deal-group-options", primary.groupName);
    push("deal-kam-options", primary.kam);
    profile.markets.forEach((market) => push("deal-market-options", market));
    push("deal-platform-options", primary.platform);
    push("deal-legal-entity-options", primary.legalEntity);
    push("deal-legal-entity-options", primary.companyName);
    profile.contacts.forEach((contact) => {
      push("deal-contact-options", contact.name);
      push("deal-dd-contact-options", contact.name);
      push("deal-email-options", contact.email);
      if (contact.role === "Legal Representative") {
        push("deal-legal-rep-options", contact.name);
      }
    });
    push("deal-legal-rep-options", primary.companyLegalRepresentative);
    push("deal-legal-rep-options", primary.legalRepresentativeName);
  });

  state.users.forEach((user) => {
    push("deal-kam-options", user.fullName);
    push("deal-email-options", user.email);
  });

  return new Map(
    Array.from(fields.entries()).map(([key, values]) => [
      key,
      Array.from(values).sort((left, right) => left.localeCompare(right, undefined, { sensitivity: "base" })),
    ])
  );
}

function ensureDatalistElement(id) {
  let datalist = document.getElementById(id);
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = id;
    document.body.appendChild(datalist);
  }
  return datalist;
}

function renderDealFormAssist() {
  if (!dealForm) {
    return;
  }
  rebuildDerivedState();
  Object.entries(DEAL_FORM_ASSIST_LISTS).forEach(([fieldName, listId]) => {
    const field = dealForm.elements[fieldName];
    if (!field || field.tagName !== "INPUT") {
      return;
    }
    field.setAttribute("list", listId);
    const datalist = ensureDatalistElement(listId);
    const options = derived.formOptions.get(listId) || [];
    datalist.innerHTML = options.map((value) => `<option value="${escapeAttribute(value)}"></option>`).join("");
  });
}

function findCompanyProfileMatchFromForm() {
  rebuildDerivedState();
  const candidateValues = [
    dealForm?.elements.companyName?.value,
    dealForm?.elements.documentClientName?.value,
    dealForm?.elements.client?.value,
    dealForm?.elements.operator?.value,
  ]
    .map((value) => normalizeSearchText(value))
    .filter(Boolean);

  for (const value of candidateValues) {
    const exactProfile = derived.companyProfilesByKey.get(value);
    if (exactProfile) {
      return exactProfile;
    }
    const titleMatch = derived.companyProfiles.find((profile) => normalizeSearchText(profile.title) === value);
    if (titleMatch) {
      return titleMatch;
    }
  }

  return null;
}

function maybeHydrateDealFormFromCompanyMatch() {
  if (!dealForm) {
    return;
  }

  const profile = findCompanyProfileMatchFromForm();
  if (!profile?.primary) {
    return;
  }

  const profileKey = cleanText(profile.key);
  if (!profileKey || ui.companyAssistKey === profileKey) {
    return;
  }

  const source = profile.primary;
  const fillableFields = [
    ["groupName", source.groupName],
    ["kam", source.kam],
    ["market", source.market],
    ["platform", source.platform],
    ["legalEntity", source.legalEntity],
    ["companyName", source.companyName || profile.title],
    ["documentClientName", source.documentClientName || profile.title],
    ["primaryContact", source.primaryContact],
    ["decisionMaker", source.decisionMaker],
    ["licenseStatus", source.licenseStatus || source.companyLicense],
    ["companyRegistrationNumber", source.companyRegistrationNumber],
    ["companyRegisteredAddress", source.companyRegisteredAddress],
    ["companyLegalRepresentative", source.companyLegalRepresentative || source.legalRepresentativeName],
    ["invoiceEmail", source.invoiceEmail],
    ["supportEmail", source.supportEmail],
    ["managementEmail", source.managementEmail],
    ["ddContactName", source.ddContactName],
    ["ddContactEmail", source.ddContactEmail],
    ["legalRepresentativeName", source.legalRepresentativeName || source.companyLegalRepresentative],
    ["legalRepresentativeEmail", source.legalRepresentativeEmail],
    ["url", source.url],
  ];

  let filledCount = 0;
  fillableFields.forEach(([fieldName, nextValue]) => {
    const field = dealForm.elements[fieldName];
    if (!field || cleanText(field.value) || !cleanText(nextValue)) {
      return;
    }
    field.value = cleanText(nextValue);
    filledCount += 1;
  });

  if (filledCount > 0) {
    ui.companyAssistKey = profileKey;
    syncDealScoringPreview();
    scheduleDealAutosave({ immediate: true });
    setBanner(`Company context loaded from ${profile.title}. ${filledCount} field${filledCount === 1 ? "" : "s"} prefilled.`, "success");
  }
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
  rebuildDerivedState();
  const scopedKey = [ui.filters.year, ui.filters.quarter, ui.filters.month, state.deals.length].join("|");
  if (derived.scopedDealsKey === scopedKey) {
    return derived.scopedDeals;
  }

  const scopedDeals = state.deals.filter((deal) => {
    const parts = derived.dealTimePartsById.get(deal.id) || getDealTimeParts(deal);

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

  derived.scopedDealsKey = scopedKey;
  derived.scopedDeals = scopedDeals;
  return scopedDeals;
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
  rebuildDerivedState();
  const searchTokens = tokenizeSearchQuery(ui.filters.search);

  return [...baseDeals]
    .filter((deal) => {
      if (ui.pipelineFinder.selectedDealId && deal.id !== ui.pipelineFinder.selectedDealId) {
        return false;
      }

      if (!searchTokens.length) {
        return true;
      }

      const haystack = derived.dealDocsById.get(deal.id)?.searchText || buildDealSearchText(deal);
      return searchTokens.every((token) => haystack.includes(token));
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
    if (ui.filters.stage !== "All" && getDealVisibleStage(deal) !== ui.filters.stage) {
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
    scorePipelineFinderField("Company", deal.companyName, normalizedQuery, 4),
    scorePipelineFinderField("Market", deal.market, normalizedQuery, 3),
    scorePipelineFinderField("Casino", deal.casinoName, normalizedQuery, 3),
    scorePipelineFinderField("Group", deal.groupName, normalizedQuery, 3),
    scorePipelineFinderField("Jira", deal.jira, normalizedQuery, 3),
    scorePipelineFinderField("DD Ticket", deal.ddTicket, normalizedQuery, 3),
    scorePipelineFinderField("Legal Representative", deal.legalRepresentativeName, normalizedQuery, 2),
    scorePipelineFinderField("Proposal", deal.proposalRequest, normalizedQuery, 2),
    scorePipelineFinderField("Integration Request", deal.integrationRequest, normalizedQuery, 2),
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
    meta: [deal.market || "No market", getDealVisibleStage(deal) || "No stage", formatDealCommercialMetric(deal)].join(" · "),
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

  const tokens = tokenizeSearchQuery(normalizedQuery);
  if (!tokens.length) {
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
  } else if (tokens.length > 1 && tokens.every((token) => normalizedValue.includes(token))) {
    score = weight * 100 + 80;
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

function getDefaultFollowUpCadence(stage) {
  const normalizedStage = getVisibleStage(stage);
  if (["DD", "Integration", "Legal Approval", "Go Live", "Live", "Handover"].includes(normalizedStage)) {
    return "Weekly";
  }
  if (["Lead", "Proposal", "Legal"].includes(normalizedStage)) {
    return "Biweekly";
  }
  return "Monthly";
}

function getFollowUpCadenceDays(cadence) {
  return FOLLOW_UP_CADENCE_DAYS[cleanText(cadence)] || 21;
}

function resolveDealFollowUpCadence(deal) {
  const explicit = cleanText(deal?.followUpCadence);
  return FOLLOW_UP_CADENCE_OPTIONS.includes(explicit) ? explicit : getDefaultFollowUpCadence(deal?.stage);
}

function getDealFollowUpState(deal) {
  const cadence = resolveDealFollowUpCadence(deal);
  const cadenceDays = getFollowUpCadenceDays(cadence);
  const today = new Date().toISOString().slice(0, 10);
  const lastFollowUp = normalizeDateInput(deal.lastFollowUp);
  const owner = cleanText(deal.followUpOwner || getDealOwner(deal) || getActiveUser()?.fullName);
  const explicitNext = normalizeDateInput(deal.nextFollowUpDate);
  const recommendedNext = addDaysToIsoDate(lastFollowUp || today, cadenceDays);
  const nextFollowUpDate = explicitNext || recommendedNext;
  const notificationsEnabled = deal.followUpNotificationsEnabled !== false;
  const daysToNext = nextFollowUpDate ? daysUntil(nextFollowUpDate) : Number.POSITIVE_INFINITY;
  const daysSinceLastTouch = lastFollowUp ? daysSince(lastFollowUp) : null;
  const hasAnchor = Boolean(lastFollowUp || explicitNext);

  let statusKey = "on-track";
  let toneClass = "is-ready";
  let severity = 0;
  let summary = `${cadence} cadence is active.`;

  if (isInactiveDeal(deal)) {
    statusKey = "inactive";
    toneClass = "is-muted";
    summary = "This account is inactive, so follow-up alerts are paused.";
  } else if (!hasAnchor) {
    statusKey = "missing";
    toneClass = "is-progress";
    severity = 2;
    summary = "No follow-up date has been anchored yet. Set the first touchpoint and cadence.";
  } else if (daysToNext < 0) {
    statusKey = "overdue";
    toneClass = "is-blocked";
    severity = 3;
    summary = `${cadence} follow-up is overdue by ${Math.abs(daysToNext)} day${Math.abs(daysToNext) === 1 ? "" : "s"}.`;
  } else if (daysToNext <= 3) {
    statusKey = "due-soon";
    toneClass = "is-progress";
    severity = 2;
    summary = `${cadence} follow-up is due in ${daysToNext} day${daysToNext === 1 ? "" : "s"}.`;
  } else if (daysSinceLastTouch !== null && daysSinceLastTouch > cadenceDays) {
    statusKey = "stale";
    toneClass = "is-progress";
    severity = 2;
    summary = `Last touchpoint is ${daysSinceLastTouch} days old and is already beyond the ${cadence.toLowerCase()} rhythm.`;
  }

  return {
    cadence,
    cadenceDays,
    owner: owner || "Unassigned",
    lastFollowUp,
    nextFollowUpDate,
    notificationsEnabled,
    daysToNext,
    daysSinceLastTouch,
    statusKey,
    toneClass,
    severity,
    summary,
    recommendation:
      statusKey === "missing"
        ? "Set the next follow-up date and assign the owner before the deal leaves this workspace."
        : statusKey === "overdue"
        ? "Open the account, log today’s touchpoint, and refresh the next follow-up date."
        : statusKey === "due-soon"
        ? "Keep the planned touchpoint and use Create Follow-Up Plan to sequence the next cycle."
        : "Cadence is healthy. Keep the next touchpoint visible and refresh it after every interaction.",
  };
}

function renderDealIntakeAssistantFromForm() {
  if (!dealForm || !elements.dealIntakeAssistant) {
    return;
  }

  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const draft = buildDealDraftFromForm(existingDeal);
  const followUp = getDealFollowUpState(draft);
  const steps = [
    {
      label: "Identity",
      note: "Name the deal, client or operator, and assign the market.",
      ready: hasAnyText(draft.deal) && hasAnyText(draft.client, draft.operator, draft.companyName) && hasAnyText(draft.market),
    },
    {
      label: "Ownership",
      note: "Account owner, stage, source, and commercial model should be visible.",
      ready: hasAnyText(getDealOwner(draft), draft.stage, draft.source, draft.type),
    },
    {
      label: "Scope",
      note: "Value, products, and request scope should explain what we are trying to close.",
      ready: hasAnyAmount(draft.dealValue, draft.revenuePotentialEur) && hasAnyText(draft.productsPotential, draft.negotiatedProducts, draft.proposalRequest),
    },
    {
      label: "Follow-Up",
      note: "Every active account should leave this form with cadence, owner, and next date.",
      ready: hasAnyText(followUp.cadence, followUp.owner) && hasAnyText(followUp.nextFollowUpDate),
    },
  ];
  const readyCount = steps.filter((step) => step.ready).length;

  elements.dealIntakeAssistant.innerHTML = `
    <div class="deal-intake-head">
      <div>
        <span class="operational-guide-kicker">Capture assistant</span>
        <strong>${escapeHtml(`${readyCount}/${steps.length} capture steps ready`)}</strong>
      </div>
      <span class="pill ${readyCount === steps.length ? "success" : readyCount >= 2 ? "info" : "neutral"}">${escapeHtml(followUp.cadence)}</span>
    </div>
    <div class="deal-intake-grid">
      ${steps
        .map(
          (step) => `
            <article class="deal-intake-card ${step.ready ? "is-ready" : "is-missing"}">
              <span>${escapeHtml(step.ready ? "Ready" : "Pending")}</span>
              <strong>${escapeHtml(step.label)}</strong>
              <small>${escapeHtml(step.note)}</small>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDealFollowUpGuideFromForm() {
  if (!dealForm || !elements.dealFollowUpGuide) {
    return;
  }

  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const draft = buildDealDraftFromForm(existingDeal);
  const followUp = getDealFollowUpState(draft);
  const openTasks = existingDeal ? countOpenTasksForDeal(existingDeal) : 0;
  const badgeTone = followUp.toneClass === "is-blocked" ? "blocked" : followUp.toneClass === "is-progress" ? "info" : "success";

  elements.dealFollowUpGuide.innerHTML = `
    <article class="follow-up-guide-card ${followUp.toneClass}">
      <div class="follow-up-guide-head">
        <div>
          <span class="operational-guide-kicker">Cadence status</span>
          <strong>${escapeHtml(followUp.summary)}</strong>
          <p>${escapeHtml(followUp.recommendation)}</p>
        </div>
        <span class="pill ${badgeTone}">${escapeHtml(followUp.notificationsEnabled ? "Alerts On" : "Alerts Off")}</span>
      </div>
      <div class="follow-up-guide-metrics">
        <article class="operational-guide-metric">
          <span>Cadence</span>
          <strong>${escapeHtml(followUp.cadence)}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Owner</span>
          <strong>${escapeHtml(followUp.owner)}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Last follow-up</span>
          <strong>${escapeHtml(formatDate(followUp.lastFollowUp))}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Next follow-up</span>
          <strong>${escapeHtml(formatDate(followUp.nextFollowUpDate))}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Open tasks</span>
          <strong>${escapeHtml(String(openTasks))}</strong>
        </article>
      </div>
    </article>
  `;
}

function buildFollowUpNotificationItems(deals) {
  return deals
    .filter((deal) => !isInactiveDeal(deal))
    .map((deal) => {
      const followUp = getDealFollowUpState(deal);
      if (!followUp.notificationsEnabled) {
        return null;
      }
      if (!["missing", "overdue", "due-soon", "stale"].includes(followUp.statusKey)) {
        return null;
      }
      return {
        deal,
        followUp,
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.followUp.severity - left.followUp.severity || compareNullableDates(left.followUp.nextFollowUpDate, right.followUp.nextFollowUpDate));
}

function renderPipelineFollowUpNotifications(deals) {
  if (!elements.pipelineFollowUpNotifications || !elements.pipelineFollowUpSummary) {
    return;
  }

  const items = buildFollowUpNotificationItems(deals).slice(0, 8);
  elements.pipelineFollowUpSummary.textContent = `${items.length} alert${items.length === 1 ? "" : "s"}`;

  if (!items.length) {
    elements.pipelineFollowUpNotifications.innerHTML = '<div class="empty-state">No follow-up alerts are active in the current funnel view. Cadence is on track for the visible accounts.</div>';
    return;
  }

  elements.pipelineFollowUpNotifications.innerHTML = items
    .map(({ deal, followUp }) => {
      const tone = followUp.toneClass === "is-blocked" ? "blocked" : followUp.toneClass === "is-progress" ? "info" : "success";
      return `
        <article class="notification-card ${followUp.toneClass}">
          <div class="notification-card-head">
            <div>
              <span>${escapeHtml(followUp.statusKey.replace(/-/g, " "))}</span>
              <strong>${escapeHtml(deal.deal || deal.client || deal.operator || "Unnamed account")}</strong>
            </div>
            <span class="pill ${tone}">${escapeHtml(followUp.cadence)}</span>
          </div>
          <p>${escapeHtml(followUp.summary)}</p>
          <div class="notification-card-meta">
            <span><strong>Owner:</strong> ${escapeHtml(followUp.owner)}</span>
            <span><strong>Market:</strong> ${escapeHtml(deal.market || "N/A")}</span>
            <span><strong>Next:</strong> ${escapeHtml(formatDate(followUp.nextFollowUpDate))}</span>
          </div>
          <div class="row-actions">
            <button class="icon-button" data-action="mark-followed-up-today-from-deal" data-id="${escapeAttribute(deal.id)}">Mark Today</button>
            <button class="icon-button" data-action="create-task-from-deal" data-id="${escapeAttribute(deal.id)}">Create Task</button>
            <button class="icon-button" data-action="edit-deal" data-id="${escapeAttribute(deal.id)}">Open Deal</button>
          </div>
        </article>
      `;
    })
    .join("");
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
        if (getDealOperationalStage(deal) === "DD") {
          reasons.push(`DD has gone ${followUpGap} days without follow-up.`);
        } else if (isLiveAccountStage(deal.stage)) {
          reasons.push(`Active client in ${getDealVisibleStage(deal)} has gone ${followUpGap} days without follow-up.`);
        } else {
          reasons.push(`${getDealVisibleStage(deal) || "Account"} has gone ${followUpGap} days without follow-up.`);
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

function buildExecutionAlerts(deals = getScopedDeals()) {
  const alerts = [];

  deals.forEach((deal) => {
    const sla = getStageSlaState(deal);
    if (sla.tone === "stuck" || sla.tone === "at-risk") {
      alerts.push({
        deal,
        tone: sla.tone,
        title: sla.tone === "stuck" ? `${sla.stage} SLA breached` : `${sla.stage} SLA nearing breach`,
        message: `${getPrimaryOperatorName(deal)} is at ${sla.days} / ${sla.limit} days.`,
        detail: `${deal.market || "No market"} · ${getDealOwner(deal) || "Unassigned"} · ${getDealVisibleStage(deal)}`,
        severity: sla.tone === "stuck" ? 4 : 2,
      });
    }

    if (!cleanText(deal.actionItems) && !cleanText(deal.followUpNotes) && !cleanText(deal.statusText)) {
      alerts.push({
        deal,
        tone: "at-risk",
        title: "Missing next action",
        message: `${getPrimaryOperatorName(deal)} has no clear next step.`,
        detail: `${deal.market || "No market"} · ${getDealVisibleStage(deal) || "No stage"}`,
        severity: 2,
      });
    }

    if (isBlockedDeal(deal)) {
      alerts.push({
        deal,
        tone: "stuck",
        title: "Blocked deal",
        message: `${getPrimaryOperatorName(deal)} has a blocked status in the execution path.`,
        detail: `${deal.legalStatus || deal.ddStatus || deal.integrationStatus || deal.goLiveStatus || deal.status}`,
        severity: 5,
      });
    }
  });

  return alerts.sort(compareExecutionAlerts);
}

function buildActionAlerts(tasks = []) {
  return tasks.map((task) => ({
    task,
    tone: "stuck",
    title: "Action overdue",
    message: `${task.title || "Untitled action"} is overdue.`,
    detail: `${task.owner || "Unassigned"} · Due ${formatDate(task.dueDate)} · ${buildTaskScopeLabel(task)}`,
    severity: 4,
  }));
}

function buildGoLiveMonthAlerts(deals = []) {
  return deals
    .filter((deal) => isGoLiveThisMonth(deal))
    .map((deal) => ({
      deal,
      tone: "healthy",
      title: "Go Live this month",
      message: `${getPrimaryOperatorName(deal)} is scheduled for launch this month.`,
      detail: `${deal.market || "No market"} · ${formatDate(deal.liveDate || deal.liveSince)} · ${getDealOwner(deal) || "Unassigned"}`,
      severity: 1,
    }));
}

function compareExecutionAlerts(left, right) {
  const leftRatio = left.deal ? getStageSlaState(left.deal).ratio || 0 : 0;
  const rightRatio = right.deal ? getStageSlaState(right.deal).ratio || 0 : 0;
  return right.severity - left.severity || rightRatio - leftRatio;
}

function getStageEntryDate(deal) {
  const field = STAGE_ENTRY_FIELDS[cleanText(deal.stage)];
  return cleanText(field ? deal[field] : "") || cleanText(deal.lastFollowUp || deal.signedEta || deal.signingEta);
}

function getStageSlaState(deal) {
  const stage = cleanText(deal.stage);
  const limit = STAGE_SLA_DAYS[stage] || null;
  const entryDate = getStageEntryDate(deal);
  const days = entryDate ? daysSince(entryDate) : null;

  if (!limit || days === null || days < 0) {
    return {
      stage,
      limit,
      days,
      ratio: 0,
      label: limit ? `No ${stage} start date` : "No SLA",
      tone: "neutral",
      pillClass: "neutral",
      cardClass: "health-open",
    };
  }

  const ratio = days / limit;
  if (ratio > 1 || isBlockedDeal(deal)) {
    return {
      stage,
      limit,
      days,
      ratio,
      label: `${stage}: ${days} / ${limit} days`,
      tone: "stuck",
      pillClass: "blocked",
      cardClass: "health-attention",
    };
  }

  if (ratio >= 0.7) {
    return {
      stage,
      limit,
      days,
      ratio,
      label: `${stage}: ${days} / ${limit} days`,
      tone: "at-risk",
      pillClass: "traffic",
      cardClass: "health-risk",
    };
  }

  return {
    stage,
    limit,
    days,
    ratio,
      label: `${stage}: ${days} / ${limit} days`,
      tone: "healthy",
    pillClass: "success",
    cardClass: "health-healthy",
  };
}

function getRiskDisplayLabel(value) {
  const normalized = cleanText(value).toLowerCase();
  if (["stuck", "attention", "blocked"].includes(normalized)) {
    return "Stuck";
  }
  if (["at-risk", "at risk", "risk", "warning"].includes(normalized)) {
    return "At Risk";
  }
  if (["healthy", "live", "go live", "handover", "success"].includes(normalized)) {
    return "Healthy";
  }
  return "Healthy";
}

function renderSlaTimer(deal) {
  const sla = getStageSlaState(deal);
  if (!sla.limit) {
    return `<div class="sla-timer is-neutral"><span>Stage SLA</span><strong>No active SLA</strong><small>${escapeHtml(getDealVisibleStage(deal) || "No stage")}</small></div>`;
  }
  const percentage = sla.days === null ? 0 : Math.min(140, Math.round(sla.ratio * 100));
  return `
    <div class="sla-timer is-${escapeAttribute(sla.tone)}">
      <span>${escapeHtml(sla.stage)} SLA</span>
      <strong>${escapeHtml(sla.days === null ? "No start date" : `${sla.days} / ${sla.limit} days`)}</strong>
      <div class="sla-track"><i style="width:${Math.min(100, percentage)}%"></i></div>
      <small>${escapeHtml(sla.tone === "stuck" ? "Over SLA" : sla.tone === "at-risk" ? "Near SLA" : sla.tone === "healthy" ? "On track" : "Stage date required")}</small>
    </div>
  `;
}

function getDealNextAction(deal) {
  return cleanText(deal.actionItems || deal.followUpNotes || deal.updates || deal.statusText || deal.comments || "Define next action");
}

function isDatePast(dateValue) {
  if (!cleanText(dateValue)) {
    return false;
  }
  return daysUntil(dateValue) < 0;
}

function getUpcomingGoLiveDeals(deals, windowDays = 60) {
  return deals
    .filter((deal) => ["Integration", "Legal Approval", "Go Live", "Live"].includes(cleanText(deal.stage)))
    .map((deal) => {
      const dateText = cleanText(deal.liveDate || deal.liveSince || deal.signedEta || deal.signingEta);
      return { deal, dateText, days: dateText ? daysUntil(dateText) : null };
    })
    .filter((item) => item.days !== null && item.days >= 0 && item.days <= windowDays)
    .sort((left, right) => left.days - right.days)
    .map((item) => item.deal);
}

function isGoLiveThisMonth(deal) {
  const dateText = cleanText(deal.liveDate || deal.liveSince);
  if (!dateText) {
    return false;
  }
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
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
  const sla = getStageSlaState(deal);
  if (sla.tone === "stuck") {
    return { label: "Stuck", pillClass: "blocked", cardClass: "health-attention" };
  }
  if (sla.tone === "at-risk") {
    return { label: "At Risk", pillClass: "traffic", cardClass: "health-risk" };
  }
  if (sla.tone === "healthy") {
    return { label: "Healthy", pillClass: "success", cardClass: "health-healthy" };
  }
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
      topStage: getDealVisibleStage(deal) || "Lead",
      stageRank: STAGE_ORDER.indexOf(getDealOperationalStage(deal)),
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
    if (STAGE_ORDER.indexOf(getDealOperationalStage(deal)) > entry.stageRank) {
      entry.topStage = getDealVisibleStage(deal);
      entry.stageRank = STAGE_ORDER.indexOf(getDealOperationalStage(deal));
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
  probability *= getForecastContextMultiplier(deal);
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

function getForecastContextMultiplier(deal) {
  const marketMultiplier = LATAM_MARKET_FORECAST_MULTIPLIERS[normalizeDealMarket(deal.market)] ?? 1;
  const operatorTypeMultiplier = getOperatorTypeForecastMultiplier(deal);
  return clampNumber(marketMultiplier * operatorTypeMultiplier, 0.82, 1.18);
}

function getOperatorTypeForecastMultiplier(deal) {
  const candidates = [
    cleanText(deal.segment),
    cleanText(deal.type),
    inferOperatorTypeFromPlatform(cleanText(deal.platform)),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeDealType(candidate);
    if (OPERATOR_TYPE_FORECAST_MULTIPLIERS[normalizedCandidate] !== undefined) {
      return OPERATOR_TYPE_FORECAST_MULTIPLIERS[normalizedCandidate];
    }
  }

  return 1;
}

function inferOperatorTypeFromPlatform(platform) {
  const normalized = cleanText(platform).toLowerCase();
  if (!normalized) {
    return "";
  }
  if (normalized.includes("retail")) {
    return "Retail";
  }
  if (normalized.includes("social")) {
    return "Social";
  }
  if (normalized.includes("b2b")) {
    return "B2B";
  }
  if (normalized.includes("b2c") || normalized.includes("casino") || normalized.includes("sportsbook")) {
    return "B2C";
  }
  return "";
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
  scheduleDealAutosave();
}

async function handleDealAssistAction(event) {
  const jumpButton = event.target.closest("[data-form-jump]");
  if (jumpButton) {
    const targetSection = document.getElementById(jumpButton.dataset.formJump || "");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  const fillButton = event.target.closest("[data-fill-field]");
  if (fillButton) {
    const fieldName = cleanText(fillButton.dataset.fillField);
    const fieldValue = cleanText(fillButton.dataset.fillValue);
    const field = dealForm.elements[fieldName];
    if (field) {
      field.value = fieldValue;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return;
  }

  const followUpPresetButton = event.target.closest("[data-follow-up-preset]");
  if (followUpPresetButton) {
    const cadence = cleanText(followUpPresetButton.dataset.followUpPreset);
    if (dealForm.elements.followUpCadence) {
      dealForm.elements.followUpCadence.value = cadence;
    }
    if (dealForm.elements.followUpOwner && !cleanText(dealForm.elements.followUpOwner.value)) {
      dealForm.elements.followUpOwner.value = getActiveUser()?.fullName || "";
    }
    if (dealForm.elements.followUpNotificationsEnabled) {
      dealForm.elements.followUpNotificationsEnabled.checked = true;
    }
    if (dealForm.elements.followUpCadence) {
      dealForm.elements.followUpCadence.dispatchEvent(new Event("input", { bubbles: true }));
      dealForm.elements.followUpCadence.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (!cleanText(dealForm.elements.nextFollowUpDate?.value)) {
      seedDealFollowUpDateFromForm();
    }
    scheduleDealAutosave({ immediate: true });
    return;
  }

  const followUpActionButton = event.target.closest("[data-follow-up-action]");
  if (followUpActionButton) {
    const action = cleanText(followUpActionButton.dataset.followUpAction);
    if (action === "seed-next-date") {
      seedDealFollowUpDateFromForm();
    }
    if (action === "mark-today") {
      markDealFollowedUpTodayInForm();
    }
    if (action === "create-plan") {
      await createFollowUpPlanForDeal();
    }
    scheduleDealAutosave({ immediate: true });
    return;
  }

  const presetButton = event.target.closest("[data-commercial-preset]");
  if (presetButton) {
    applyCommercialBuilderPreset(presetButton.dataset.commercialPreset);
    scheduleDealAutosave({ immediate: true });
    return;
  }

  const actionButton = event.target.closest("[data-commercial-action]");
  if (actionButton) {
    applyCommercialBuilderAction(actionButton.dataset.commercialAction);
    scheduleDealAutosave({ immediate: true });
  }
}

function getCommercialBuilderElements() {
  return {
    product: document.getElementById("commercial-builder-product"),
    model: document.getElementById("commercial-builder-model"),
    base: document.getElementById("commercial-builder-base"),
    structure: document.getElementById("commercial-builder-structure"),
    tierLevel: document.getElementById("commercial-builder-tier-level"),
    rate: document.getElementById("commercial-builder-rate"),
    fixedFee: document.getElementById("commercial-builder-fixed-fee"),
    volumeFrom: document.getElementById("commercial-builder-volume-from"),
    volumeTo: document.getElementById("commercial-builder-volume-to"),
    volumeUnit: document.getElementById("commercial-builder-volume-unit"),
    premiumRate: document.getElementById("commercial-builder-premium-rate"),
    setupFee: document.getElementById("commercial-builder-setup-fee"),
    deductions: document.getElementById("commercial-builder-deductions"),
    bonusCap: document.getElementById("commercial-builder-bonus-cap"),
    tax: document.getElementById("commercial-builder-tax"),
    withholding: document.getElementById("commercial-builder-withholding"),
    notes: document.getElementById("commercial-builder-notes"),
  };
}

function resetCommercialBuilder() {
  const builder = getCommercialBuilderElements();
  Object.values(builder).forEach((element) => {
    if (!element) {
      return;
    }
    if (element.tagName === "SELECT") {
      element.selectedIndex = 0;
    } else {
      element.value = "";
    }
  });
  syncCommercialBuilderUi();
}

function applyCommercialBuilderPreset(presetKey) {
  const preset = getCommercialBuilderPreset(cleanText(presetKey));
  if (!preset) {
    return;
  }

  resetCommercialBuilder();
  applyCommercialBuilderValues(preset);
  syncCommercialBuilderUi();
}

function getCommercialBuilderPreset(presetKey) {
  const presets = {
    "evolution-tiered": {
      product: "Evolution",
      model: "Revenue Share",
      base: "GGR",
      structure: "Tiered by Volume",
      tierLevel: "Tier 1",
      premiumRate: "1%-5%",
      notes: "Core live casino commercial",
    },
    "ezugi-tiered": {
      product: "Ezugi",
      model: "Revenue Share",
      base: "GGR",
      structure: "Tiered by Volume",
      tierLevel: "Tier 1",
      premiumRate: "1%-5%",
      notes: "Ezugi commercial",
    },
    "slots-tiered": {
      product: "Slots Bundle",
      model: "Revenue Share",
      base: "GGR",
      structure: "Tiered by Volume",
      tierLevel: "Tier 1",
      premiumRate: "1%-5%",
      notes: "NetEnt, RedTiger, NLC, BTG, Sneaky Slots, RedBaron",
    },
    "growth-tables": {
      product: "Growth Tables",
      model: "Fixed Fee",
      base: "Per Table",
      structure: "Single Rate",
      fixedFee: "0.15",
      notes: "EUR 0.15 per table",
    },
    "high-stake": {
      product: "High Stake Tables",
      model: "Fixed Fee",
      base: "Per Table",
      structure: "Single Rate",
      fixedFee: "0.55",
      notes: "EUR 0.55 per table",
    },
    "first-person": {
      product: "First Person",
      model: "Revenue Share",
      base: "GGR",
      structure: "Single Rate",
      rate: "11%",
      notes: "First Person commercial",
    },
    "premium-addon": {
      product: "Evolution Premium",
      model: "Premium Add-On",
      base: "GGR",
      structure: "Custom",
      premiumRate: "1%-5%",
      notes: "Premium add-on",
    },
  };

  const preset = presets[presetKey];
  if (!preset) {
    return null;
  }
  const next = { ...preset };
  if (next.tierLevel) {
    Object.assign(next, getCommercialTierDefinition(next.product, next.tierLevel, next.base));
  }
  return next;
}

function applyCommercialBuilderValues(values = {}) {
  const builder = getCommercialBuilderElements();
  const fieldMap = {
    product: builder.product,
    model: builder.model,
    base: builder.base,
    structure: builder.structure,
    tierLevel: builder.tierLevel,
    rate: builder.rate,
    fixedFee: builder.fixedFee,
    volumeFrom: builder.volumeFrom,
    volumeTo: builder.volumeTo,
    volumeUnit: builder.volumeUnit,
    premiumRate: builder.premiumRate,
    setupFee: builder.setupFee,
    deductions: builder.deductions,
    bonusCap: builder.bonusCap,
    tax: builder.tax,
    withholding: builder.withholding,
    notes: builder.notes,
  };

  Object.entries(values).forEach(([key, value]) => {
    const element = fieldMap[key];
    if (element) {
      element.value = value ?? "";
    }
  });
}

function normalizeCommercialTierLevel(value) {
  const normalized = cleanText(value).toLowerCase();
  if (normalized === "tier 1" || normalized === "1" || normalized === "t1") {
    return 1;
  }
  if (normalized === "tier 2" || normalized === "2" || normalized === "t2") {
    return 2;
  }
  if (normalized === "tier 3" || normalized === "3" || normalized === "t3") {
    return 3;
  }
  return 0;
}

function detectCommercialFamily(product) {
  const value = cleanText(product).toLowerCase();
  if (!value) {
    return "evolution";
  }
  if (value.includes("ezugi")) {
    return "ezugi";
  }
  if (
    value.includes("slot") ||
    value.includes("netent") ||
    value.includes("redtiger") ||
    value.includes("red tiger") ||
    value.includes("nlc") ||
    value.includes("btg") ||
    value.includes("sneaky") ||
    value.includes("redbaron") ||
    value.includes("red baron")
  ) {
    return "slots";
  }
  if (value.includes("growth")) {
    return "growth";
  }
  if (value.includes("high stake")) {
    return "high-stake";
  }
  if (value.includes("first person")) {
    return "first-person";
  }
  return "evolution";
}

function getCommercialTierDefinition(product, tierLabel, currentBase = "") {
  const family = detectCommercialFamily(product);
  const tier = normalizeCommercialTierLevel(tierLabel) || 1;
  const ranges = {
    1: { volumeFrom: "0", volumeTo: "1000000", volumeUnit: "EUR" },
    2: { volumeFrom: "1000001", volumeTo: "3000000", volumeUnit: "EUR" },
    3: { volumeFrom: "3000001", volumeTo: "", volumeUnit: "EUR" },
  };
  const rates = {
    evolution: { 1: "12%", 2: "11%", 3: "10%" },
    ezugi: { 1: "10%", 2: "9%", 3: "8%" },
    slots: { 1: "10%", 2: "9%", 3: "8%" },
  };

  if (family === "growth") {
    return {
      model: "Fixed Fee",
      base: "Per Table",
      structure: "Single Rate",
      tierLevel: "",
      rate: "",
      fixedFee: "0.15",
      volumeFrom: "",
      volumeTo: "",
      volumeUnit: "EUR",
      premiumRate: "",
      notes: "EUR 0.15 per table",
    };
  }

  if (family === "high-stake") {
    return {
      model: "Fixed Fee",
      base: "Per Table",
      structure: "Single Rate",
      tierLevel: "",
      rate: "",
      fixedFee: "0.55",
      volumeFrom: "",
      volumeTo: "",
      volumeUnit: "EUR",
      premiumRate: "",
      notes: "EUR 0.55 per table",
    };
  }

  if (family === "first-person") {
    return {
      model: "Revenue Share",
      base: "GGR",
      structure: "Single Rate",
      tierLevel: "",
      rate: "11%",
      fixedFee: "",
      volumeFrom: "",
      volumeTo: "",
      volumeUnit: "EUR",
      premiumRate: "",
      notes: "First Person commercial",
    };
  }

  return {
    model: "Revenue Share",
    base: cleanText(currentBase) || "GGR",
    structure: "Tiered by Volume",
    tierLevel: `Tier ${tier}`,
    rate: rates[family]?.[tier] || "12%",
    fixedFee: "",
    volumeFrom: ranges[tier].volumeFrom,
    volumeTo: ranges[tier].volumeTo,
    volumeUnit: ranges[tier].volumeUnit,
    premiumRate: "1%-5%",
  };
}

function getCommercialBuilderSnapshot() {
  const builder = getCommercialBuilderElements();
  return {
    product: cleanText(builder.product?.value),
    model: cleanText(builder.model?.value),
    base: cleanText(builder.base?.value),
    structure: cleanText(builder.structure?.value),
    tierLevel: cleanText(builder.tierLevel?.value),
    rate: cleanText(builder.rate?.value),
    fixedFee: cleanText(builder.fixedFee?.value),
    volumeFrom: cleanText(builder.volumeFrom?.value),
    volumeTo: cleanText(builder.volumeTo?.value),
    volumeUnit: cleanText(builder.volumeUnit?.value),
    premiumRate: cleanText(builder.premiumRate?.value),
    setupFee: cleanText(builder.setupFee?.value),
    deductions: cleanText(builder.deductions?.value),
    bonusCap: cleanText(builder.bonusCap?.value),
    tax: cleanText(builder.tax?.value),
    withholding: cleanText(builder.withholding?.value),
    notes: cleanText(builder.notes?.value),
  };
}

function syncCommercialBuilderUi() {
  const builder = getCommercialBuilderElements();
  const model = cleanText(builder.model?.value);
  const structure = cleanText(builder.structure?.value);
  const isFixedFee = model === "Fixed Fee";
  const isTiered = structure === "Tiered by Volume";

  if (builder.rate) {
    builder.rate.disabled = isFixedFee;
    builder.rate.placeholder = isFixedFee ? "Not required for fixed fee" : "12%";
  }
  if (builder.fixedFee) {
    builder.fixedFee.disabled = !isFixedFee;
    builder.fixedFee.placeholder = isFixedFee ? "0.00" : "Only for fixed fee";
  }
  if (builder.tierLevel) {
    builder.tierLevel.disabled = isFixedFee;
  }
  if (builder.volumeFrom) {
    builder.volumeFrom.disabled = isFixedFee;
    builder.volumeFrom.placeholder = isTiered ? "0" : "Optional";
  }
  if (builder.volumeTo) {
    builder.volumeTo.disabled = isFixedFee;
    builder.volumeTo.placeholder = isTiered ? "1000000 or open" : "Optional";
  }
  if (builder.volumeUnit) {
    builder.volumeUnit.disabled = isFixedFee;
  }
  if (builder.premiumRate) {
    builder.premiumRate.placeholder = isFixedFee ? "Optional premium uplift" : "1%-5%";
  }
}

function buildCommercialVolumeLabel(snapshot) {
  const unit = snapshot.volumeUnit || "EUR";
  const from = snapshot.volumeFrom;
  const to = snapshot.volumeTo;
  const hasRange = Boolean(from || to);
  if (!hasRange) {
    return snapshot.structure === "Tiered by Volume" ? `${unit} tier pending` : "All volume";
  }
  if (from && to) {
    return `${unit} ${from}-${to}`;
  }
  if (from && !to) {
    return `${unit} ${from}+`;
  }
  return `${unit} 0-${to}`;
}

function buildCommercialLabel(snapshot) {
  if (snapshot.model === "Fixed Fee" || snapshot.fixedFee) {
    return `EUR ${snapshot.fixedFee || "0"} fixed fee${snapshot.base ? ` (${snapshot.base})` : ""}`;
  }

  const rate = snapshot.rate || "TBC";
  const base = snapshot.base || "GGR";
  const premiumLabel = snapshot.premiumRate ? ` + Premium ${snapshot.premiumRate}` : "";
  if (snapshot.model === "Premium Add-On") {
    return `${snapshot.premiumRate || rate} premium add-on on ${base}`;
  }
  if (snapshot.model === "Hybrid") {
    return `${rate} hybrid on ${base}${premiumLabel}`;
  }
  return `${rate} of ${base}${premiumLabel}`;
}

function buildCommercialPackageNotes(snapshot) {
  return [
    snapshot.deductions ? `Deductions ${snapshot.deductions}` : "",
    snapshot.setupFee ? `Setup Fee EUR ${snapshot.setupFee}` : "",
    snapshot.bonusCap ? `Bonus Cap ${snapshot.bonusCap}` : "",
    snapshot.tax ? `Tax ${snapshot.tax}` : "",
    snapshot.withholding ? `Withholding ${snapshot.withholding}` : "",
    snapshot.notes,
  ]
    .filter(Boolean)
    .join(" · ");
}

function buildCommercialBuilderTerm(snapshot) {
  const product = snapshot.product || "Commercial Item";
  const modelLabel = snapshot.model || "Commercial";
  const volumeLabel = buildCommercialVolumeLabel(snapshot);
  const commercialLabel = buildCommercialLabel(snapshot);
  const extras = buildCommercialPackageNotes(snapshot);

  if (snapshot.model === "Fixed Fee" || snapshot.fixedFee) {
    return `${product}: ${commercialLabel}${extras ? ` · ${extras}` : ""}`;
  }

  if (snapshot.structure === "Tiered by Volume" || snapshot.volumeFrom || snapshot.volumeTo) {
    return `${product}: ${commercialLabel} for ${volumeLabel}${extras ? ` · ${extras}` : ""}`;
  }

  return `${product}: ${commercialLabel} across all volume${modelLabel !== "Revenue Share" ? ` · ${modelLabel}` : ""}${extras ? ` · ${extras}` : ""}`;
}

function buildCommercialBuilderScheduleRow(snapshot) {
  const product = snapshot.product || "Commercial Item";
  const tier = buildCommercialVolumeLabel(snapshot);
  const commercial = buildCommercialLabel(snapshot);
  const notes = [snapshot.model && snapshot.model !== "Revenue Share" ? snapshot.model : "", buildCommercialPackageNotes(snapshot)]
    .filter(Boolean)
    .join(" · ");
  return [product, tier, commercial, notes].join(" | ");
}

function appendUniqueValueToTextarea(fieldName, nextLine) {
  const field = dealForm.elements[fieldName];
  if (!field || !cleanText(nextLine)) {
    return;
  }
  const currentLines = cleanMultilineText(field.value)
    .split("\n")
    .map((line) => cleanText(line))
    .filter(Boolean);
  if (currentLines.some((line) => line.toLowerCase() === cleanText(nextLine).toLowerCase())) {
    return;
  }
  appendValueToTextarea(fieldName, nextLine);
}

function setDealFormFieldValue(fieldName, value) {
  const field = dealForm?.elements?.[fieldName];
  if (!field) {
    return;
  }
  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function applyCommercialPackageToForm(snapshot) {
  if (!dealForm) {
    return;
  }

  if (dealForm.elements.pricingBase && snapshot.base) {
    setDealFormFieldValue("pricingBase", snapshot.base);
  }
  if (dealForm.elements.deductionTerms && snapshot.deductions) {
    setDealFormFieldValue("deductionTerms", snapshot.deductions);
  }
  if (dealForm.elements.deductionsAllowed && snapshot.deductions) {
    setDealFormFieldValue("deductionsAllowed", snapshot.deductions);
  }
  if (dealForm.elements.setupFeeAmount && snapshot.setupFee) {
    setDealFormFieldValue("setupFeeAmount", snapshot.setupFee);
  }
  if (dealForm.elements.setupFeeStatus && snapshot.setupFee) {
    const numericSetupFee = toNullableNumber(snapshot.setupFee);
    setDealFormFieldValue("setupFeeStatus", numericSetupFee === 0 ? "Waived" : "Not Waived");
  }
  if (dealForm.elements.bonusCap && snapshot.bonusCap) {
    setDealFormFieldValue("bonusCap", snapshot.bonusCap);
  }
  if (dealForm.elements.gamingTax && snapshot.tax) {
    setDealFormFieldValue("gamingTax", snapshot.tax);
  }
  if (dealForm.elements.withholdingTax && snapshot.withholding) {
    setDealFormFieldValue("withholdingTax", snapshot.withholding);
  }
  if (snapshot.product) {
    appendUniqueValueToTextarea("negotiatedProducts", snapshot.product);
  }
}

function appendValueToTextarea(fieldName, nextLine) {
  const field = dealForm.elements[fieldName];
  if (!field || !cleanText(nextLine)) {
    return;
  }
  const current = cleanMultilineText(field.value);
  field.value = current ? `${current}\n${nextLine}` : nextLine;
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function applyCommercialBuilderAction(action) {
  const builder = getCommercialBuilderElements();
  if (action === "seed-tier-1" || action === "seed-tier-2" || action === "seed-tier-3") {
    const level = action.slice(-1);
    const baseSnapshot = getCommercialBuilderSnapshot();
    const tierValues = getCommercialTierDefinition(baseSnapshot.product || builder.product?.value, `Tier ${level}`, baseSnapshot.base);
    applyCommercialBuilderValues(tierValues);
    syncCommercialBuilderUi();
    setBanner(`Commercial Builder seeded for Tier ${level}.`, "success");
    return;
  }

  const snapshot = getCommercialBuilderSnapshot();
  if (action === "clear-builder") {
    resetCommercialBuilder();
    return;
  }

  if (!snapshot.product && !snapshot.rate && !snapshot.fixedFee && !snapshot.premiumRate) {
    setBanner("Define at least the brand/product and a commercial value before applying the package.", "warn");
    return;
  }

  if (snapshot.structure === "Tiered by Volume" && !snapshot.fixedFee && !snapshot.volumeFrom && !snapshot.volumeTo) {
    setBanner("For tiered commercials, define at least one volume boundary before adding the schedule row.", "warn");
    return;
  }

  if (action === "append-terms") {
    appendValueToTextarea("commercialTerms", buildCommercialBuilderTerm(snapshot));
    setBanner("Commercial terms updated from the Commercial Builder.", "success");
    return;
  }

  if (action === "append-schedule") {
    appendValueToTextarea("commercialSchedule", buildCommercialBuilderScheduleRow(snapshot));
    setBanner("Commercial schedule row added from the Commercial Builder.", "success");
    return;
  }

  if (action === "apply-package") {
    applyCommercialPackageToForm(snapshot);
    setBanner("Commercial package fields applied to proposal and agreement scope.", "success");
  }
}

function seedDealFollowUpDateFromForm() {
  if (!dealForm) {
    return;
  }
  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const draft = buildDealDraftFromForm(existingDeal);
  const followUp = getDealFollowUpState(draft);
  if (dealForm.elements.followUpCadence) {
    dealForm.elements.followUpCadence.value = followUp.cadence;
  }
  if (dealForm.elements.nextFollowUpDate) {
    dealForm.elements.nextFollowUpDate.value = followUp.nextFollowUpDate;
    dealForm.elements.nextFollowUpDate.dispatchEvent(new Event("input", { bubbles: true }));
  }
  if (dealForm.elements.followUpOwner && !cleanText(dealForm.elements.followUpOwner.value)) {
    dealForm.elements.followUpOwner.value = followUp.owner;
  }
  if (dealForm.elements.followUpNotificationsEnabled) {
    dealForm.elements.followUpNotificationsEnabled.checked = true;
  }
  setBanner(`Next follow-up seeded for ${formatDate(followUp.nextFollowUpDate)} using the ${followUp.cadence.toLowerCase()} cadence.`, "success");
}

function markDealFollowedUpTodayInForm() {
  if (!dealForm) {
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  if (dealForm.elements.lastFollowUp) {
    dealForm.elements.lastFollowUp.value = today;
  }
  if (!cleanText(dealForm.elements.followUpCadence?.value)) {
    dealForm.elements.followUpCadence.value = getDefaultFollowUpCadence(dealForm.elements.stage?.value);
  }
  seedDealFollowUpDateFromForm();
  setBanner("Last follow-up was marked as today and the next touchpoint was refreshed.", "success");
}

function buildFollowUpCadenceTaskDrafts(deal, count = 4) {
  const followUp = getDealFollowUpState(deal);
  const startDate = followUp.nextFollowUpDate || addDaysToIsoDate(new Date().toISOString().slice(0, 10), followUp.cadenceDays);
  const existingKeys = new Set(state.tasks.map((task) => [cleanText(task.dealId), cleanText(task.title), cleanText(task.dueDate)].join("|")));
  let nextSequence = toNullableNumber(state.workspace.taskSequence) || 0;
  const tasks = [];

  for (let index = 0; index < count; index += 1) {
    const dueDate = index === 0 ? startDate : addDaysToIsoDate(startDate, followUp.cadenceDays * index);
    const title = `${followUp.cadence} follow-up ${index + 1} · ${deal.client || deal.operator || deal.deal || "account"}`;
    const dedupeKey = [cleanText(deal.id), title, dueDate].join("|");
    if (existingKeys.has(dedupeKey)) {
      continue;
    }
    nextSequence += 1;
    tasks.push(
      normalizeTask({
        ...buildTaskPrefillFromSnapshot(deal),
        id: generateId("task"),
        taskNumber: buildTaskNumber(nextSequence, { targetYear: yearFromDate(dueDate) || state.workspace.fiscalYear }),
        title,
        scopeType: "Client",
        dealId: deal.id,
        deal: deal.deal,
        client: deal.client,
        operator: deal.operator,
        market: deal.market,
        owner: followUp.owner,
        dueDate,
        nextStep: deal.actionItems || buildDealOperationalGuide(deal).recommendation,
        notes: [deal.followUpNotes, deal.statusText || deal.comments].filter(Boolean).join(" · "),
        traceLog: appendTraceLog("", `${followUp.cadence} follow-up plan scheduled`),
      })
    );
  }

  state.workspace.taskSequence = nextSequence;
  return tasks;
}

async function createFollowUpPlanForDeal(sourceDeal = null) {
  const draft = buildDocumentDealDraft(sourceDeal);
  if (!draft) {
    return;
  }
  if (!cleanText(draft.deal)) {
    setBanner("Name the deal before creating a follow-up plan.", "danger");
    return;
  }

  const prepared = normalizeDeal({
    ...draft,
    followUpCadence: resolveDealFollowUpCadence(draft),
    followUpOwner: cleanText(draft.followUpOwner) || getDealOwner(draft) || getActiveUser()?.fullName || "",
    followUpNotificationsEnabled: draft.followUpNotificationsEnabled !== false,
    nextFollowUpDate: getDealFollowUpState(draft).nextFollowUpDate,
  });

  const exists = state.deals.some((deal) => deal.id === prepared.id);
  state.deals = exists ? state.deals.map((deal) => (deal.id === prepared.id ? prepared : deal)) : [prepared, ...state.deals];
  const newTasks = buildFollowUpCadenceTaskDrafts(prepared, resolveDealFollowUpCadence(prepared) === "Monthly" ? 3 : 4);
  if (newTasks.length) {
    state.tasks = [...newTasks, ...state.tasks];
  }

  const saved = await persistState();
  renderAll();
  if (!sourceDeal) {
    ui.editingDealId = prepared.id;
    fillDealForm(prepared);
  }
  setBanner(
    buildExcelBanner(
      saved
        ? `${newTasks.length} follow-up task${newTasks.length === 1 ? "" : "s"} created for ${prepared.deal}.`
        : `${newTasks.length} follow-up task${newTasks.length === 1 ? "" : "s"} created in browser storage for ${prepared.deal}.`
    ),
    saved ? "success" : "warn"
  );
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

  renderDealIntakeAssistantFromForm();
  renderDealFollowUpGuideFromForm();
  renderDealWorkflowGuideFromForm();
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

  const preferredId = ui.activeUserId;
  const activeUser = state.users.find((user) => user.id === preferredId) || state.users[0];
  ui.activeUserId = activeUser ? activeUser.id : "";
}

function getActiveUser() {
  return state.users.find((user) => user.id === ui.activeUserId) || state.users[0] || null;
}

function getStoredActiveUserId() {
  return ui.activeUserId || "";
}

function persistActiveUserSelection() {
  return;
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

function renderCompanyProfileTrigger(deal, primary, secondary = "", className = "entity-trigger entity-trigger-block") {
  const safePrimary = cleanText(primary) || getCompanyProfileLabel(deal);
  const safeSecondary = cleanText(secondary);
  return `
    <button
      type="button"
      class="${escapeAttribute(className)}"
      data-action="open-company-profile"
      data-id="${escapeAttribute(deal.id)}"
      title="${escapeAttribute(`Open company profile for ${getCompanyProfileLabel(deal)}`)}"
    >
      <div class="entity-trigger-copy">
        <strong>${escapeHtml(safePrimary)}</strong>
        ${safeSecondary ? `<small>${escapeHtml(safeSecondary)}</small>` : ""}
      </div>
      <small class="entity-trigger-hint">Profile</small>
    </button>
  `;
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

function getCurrentForecastPeriodBounds() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfYear = new Date(today.getFullYear(), 11, 31);
  endOfYear.setHours(0, 0, 0, 0);
  return {
    start: today,
    end: endOfYear,
    year: today.getFullYear(),
  };
}

function getForecastStartDate(deal) {
  const { start, end, year } = getCurrentForecastPeriodBounds();
  const startOfYear = new Date(year, 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const today = new Date(start);

  const liveDateText = cleanText(deal?.liveDate || deal?.liveSince);
  const liveDate = liveDateText ? new Date(`${liveDateText}T00:00:00`) : null;
  if (liveDate && !Number.isNaN(liveDate.getTime())) {
    liveDate.setHours(0, 0, 0, 0);
  }

  if (isLiveAccountStage(deal?.stage) && liveDate && liveDate >= startOfYear && liveDate <= end) {
    return liveDate;
  }

  const etaText = cleanText(deal?.liveDate);
  const etaDate = etaText ? new Date(`${etaText}T00:00:00`) : null;
  if (etaDate && !Number.isNaN(etaDate.getTime())) {
    etaDate.setHours(0, 0, 0, 0);
    if (etaDate > today) {
      return etaDate;
    }
  }

  return today;
}

function getForecastProrationFactor(deal) {
  const { start, end, year } = getCurrentForecastPeriodBounds();
  const projectionStart = getForecastStartDate(deal);

  if (projectionStart > end) {
    return 0;
  }

  const startOfYear = new Date(year, 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  const totalDaysInYear = Math.floor((end.getTime() - startOfYear.getTime()) / 86400000) + 1;
  const projectedDays = Math.floor((end.getTime() - projectionStart.getTime()) / 86400000) + 1;

  return clampNumber(projectedDays / totalDaysInYear, 0, 1);
}

function getForecastPeriodLabel() {
  const { start, end } = getCurrentForecastPeriodBounds();
  const startLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(start);
  const endLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(end);
  return `${startLabel} to ${endLabel}`;
}

function getForecastPeriodEndLabel() {
  const { end } = getCurrentForecastPeriodBounds();
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(end);
}

function getForecastValue(deal) {
  if (!deal || isInactiveDeal(deal)) {
    return 0;
  }
  return getDealValueAmount(deal) * getForecastProrationFactor(deal) * getForecastProbability(deal);
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

function renderRequestPackStatusBlock(deal, density = "default") {
  const items = getRequestPackStatusItems(deal);
  return `
    <div class="request-status-grid ${density === "compact" ? "is-compact" : ""}">
      ${items
        .map((item) => {
          return `
            <article class="request-status-item">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
              ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function getRequestPackStatusItems(deal) {
  return [
    buildRequestPackStatusItem("Legal Request", [
      { label: "Company", value: deal.companyName || deal.client || deal.legalEntity },
      { label: "Registration", value: deal.companyRegistrationNumber },
      { label: "Registered Address", value: deal.companyRegisteredAddress },
      { label: "License", value: deal.companyLicense || deal.licenseStatus },
      { label: "Invoice Email", value: deal.invoiceEmail },
      { label: "DD Contact", value: deal.ddContactName && deal.ddContactEmail ? `${deal.ddContactName} ${deal.ddContactEmail}` : deal.ddContactName || deal.ddContactEmail },
      { label: "Legal Representative", value: deal.legalRepresentativeName || deal.companyLegalRepresentative },
      { label: "Legal Rep Email", value: deal.legalRepresentativeEmail },
      { label: "Setup Fee", value: [deal.setupFeeStatus, deal.setupFeeAmount ? `EUR ${deal.setupFeeAmount}` : ""].filter(Boolean).join(" · ") },
      { label: "Deductions Allowed", value: deal.deductionsAllowed },
    ]),
    buildRequestPackStatusItem("Commercial Proposal", [
      { label: "Proposal Request", value: deal.proposalRequest },
      { label: "Products", value: deal.negotiatedProducts || deal.productsPotential || deal.productsCurrent },
      { label: "Commercial Terms", value: deal.commercialTerms },
      { label: "Commercial Schedule", value: deal.commercialSchedule },
      { label: "Pricing Base", value: deal.pricingBase },
      { label: "Deductions", value: deal.deductionTerms },
      { label: "Valid Through Date", value: buildProposalValidThroughDateLabel(deal) },
      { label: "Activation Requirements", value: deal.activationRequirements },
    ]),
    buildRequestPackStatusItem("DD Request", [
      { label: "DD Date", value: deal.ddDate },
      { label: "DD Status", value: deal.ddStatus },
      { label: "DD Contact", value: deal.ddContactName && deal.ddContactEmail ? `${deal.ddContactName} ${deal.ddContactEmail}` : deal.ddContactName || deal.ddContactEmail },
      { label: "DD Ticket", value: deal.ddTicket },
      { label: "License", value: deal.companyLicense || deal.licenseStatus },
      { label: "Deductions Allowed", value: deal.deductionsAllowed || deal.deductionTerms },
    ]),
    buildRequestPackStatusItem("Integration Request", [
      { label: "Client Based", value: deal.clientBased || deal.jurisdiction },
      { label: "URL", value: deal.url || deal.siteStatus },
      { label: "Live Suppliers", value: deal.otherLiveSuppliers },
      { label: "Integration Team", value: deal.integrationTeam },
      { label: "Products", value: deal.productsPotential || deal.productsCurrent },
      { label: "Integration Request", value: deal.integrationRequest },
    ]),
    buildRequestPackStatusItem("Legal Signoff", [
      { label: "Legal Approval Date", value: deal.legalApprovalDate },
      { label: "Signoff Request", value: deal.legalSignoffRequest },
      { label: "Legal Status", value: deal.legalStatus },
      { label: "DD Status", value: deal.ddStatus },
      { label: "Integration Status", value: deal.integrationStatus },
      { label: "Go Live Status", value: deal.goLiveStatus },
    ]),
  ];
}

function buildRequestPackStatusItem(label, fields) {
  const items = Array.isArray(fields) ? fields : [];
  const completedItems = items.filter((item) => cleanText(item.value));
  const missingItems = items.filter((item) => !cleanText(item.value)).map((item) => item.label);
  const totalCount = items.length;
  const completedCount = completedItems.length;
  const value = `${completedCount}/${totalCount} ready`;
  const note = missingItems.length ? `Missing: ${missingItems.slice(0, 2).join(", ")}${missingItems.length > 2 ? "..." : ""}` : "Ready for internal handoff";
  return { label, value, note };
}

function getStageOperationBlueprint(stage) {
  return STAGE_OPERATION_BLUEPRINT[cleanText(stage)] || STAGE_OPERATION_BLUEPRINT.Lead;
}

function getStageDocumentActionLabel(kind) {
  return (
    {
      legal: "Legal Request (Internal)",
      proposal: "Proposal Request (To Client)",
      dd: "DD Request (Internal)",
      integration: "Integration Request (Internal)",
      signoff: "Legal Signoff (Internal)",
    }[cleanText(kind)] || "Create Workflow Document"
  );
}

function getStageDocumentActionShortLabel(kind) {
  return (
    {
      legal: "Legal",
      proposal: "Proposal",
      dd: "DD",
      integration: "Integration",
      signoff: "Signoff",
    }[cleanText(kind)] || "Request"
  );
}

function getStageDocumentActionKinds() {
  return ["proposal", "legal", "dd", "integration", "signoff"];
}

function renderDealWorkflowDocumentButtons(deal, options = {}) {
  const className = cleanText(options.className) || "icon-button";
  const includeEdit = Boolean(options.includeEdit);
  const editLabel = cleanText(options.editLabel) || "Edit";
  const includeTask = Boolean(options.includeTask);
  const includeCampaign = Boolean(options.includeCampaign);
  const useCompactLabels = options.compactLabels !== undefined ? Boolean(options.compactLabels) : className.includes("icon-button");
  const kinds = Array.isArray(options.kinds)
    ? options.kinds.map((kind) => cleanText(kind)).filter(Boolean)
    : getStageDocumentActionKinds();

  const buttons = kinds.map((kind) => {
    return `<button class="${escapeAttribute(className)}" data-action="create-${escapeAttribute(kind)}-request-from-deal" data-id="${escapeAttribute(
      deal.id
    )}">${escapeHtml(useCompactLabels ? getStageDocumentActionShortLabel(kind) : getStageDocumentActionLabel(kind))}</button>`;
  });

  if (includeTask) {
    buttons.unshift(`<button class="${escapeAttribute(className)}" data-action="create-task-from-deal" data-id="${escapeAttribute(deal.id)}">Create Task</button>`);
  }

  if (includeCampaign) {
    buttons.push(
      `<button class="${escapeAttribute(className)}" data-action="create-campaign-from-deal" data-id="${escapeAttribute(deal.id)}">Create Campaign</button>`
    );
  }

  if (includeEdit) {
    buttons.push(`<button class="${escapeAttribute(className)}" data-action="edit-deal" data-id="${escapeAttribute(deal.id)}">${escapeHtml(editLabel)}</button>`);
  }

  return buttons.join("");
}

function buildOperationalRequirement(label, ready, note = "") {
  return {
    label,
    ready: Boolean(ready),
    note: cleanText(note),
  };
}

function hasAnyText(...values) {
  return values.some((value) => Boolean(cleanText(value)));
}

function hasAnyAmount(...values) {
  return values.some((value) => Number(value || 0) > 0);
}

function isSignedAgreement(deal) {
  return cleanText(deal.agreement) === "Signed";
}

function isGoLiveReadyStatus(status) {
  return ["Legal Sign-Off", "Completed", "Live"].includes(cleanText(status));
}

function buildStageOperationalChecklist(stage, deal) {
  const normalizedStage = cleanText(stage) || "Lead";
  switch (normalizedStage) {
    case "Lead":
      return [
        buildOperationalRequirement("Account identity", hasAnyText(deal.deal, deal.client, deal.operator), "Deal, client, or operator should be named."),
        buildOperationalRequirement("Market assigned", hasAnyText(deal.market), "Market should be visible before qualification starts."),
        buildOperationalRequirement("Owner assigned", hasAnyText(getDealOwner(deal)), "A clear owner is required."),
        buildOperationalRequirement("Lead source logged", hasAnyText(deal.source), "Capture inbound, outbound, partner, or referral source."),
        buildOperationalRequirement("Primary contact mapped", hasAnyText(deal.primaryContact, deal.decisionMaker), "At least one commercial contact should be known."),
      ];
    case "Qualified":
      return [
        buildOperationalRequirement("License status logged", hasAnyText(deal.licenseStatus, deal.companyLicense), "Regulatory or license context should be known."),
        buildOperationalRequirement("Decision maker mapped", hasAnyText(deal.decisionMaker), "Commercial decision maker should be identified."),
        buildOperationalRequirement("Product scope identified", hasAnyText(deal.productsPotential, deal.productsCurrent, deal.negotiatedProducts), "Products to sell should be clear."),
        buildOperationalRequirement("Revenue potential estimated", hasAnyAmount(deal.revenuePotentialEur, deal.dealValue, deal.dealValueAlt), "Estimate the opportunity size."),
        buildOperationalRequirement(
          "Opportunity score completed",
          Number(deal.opportunityScore || 0) > 0,
          Number(deal.opportunityScore || 0) > 0 ? `Current score: ${Math.round(Number(deal.opportunityScore || 0))}` : "Score the account before preparing an offer."
        ),
      ];
    case "Proposal":
      return [
        buildOperationalRequirement("Proposal request defined", hasAnyText(deal.proposalRequest), "Summarize what the client is asking for."),
        buildOperationalRequirement("Products negotiated", hasAnyText(deal.negotiatedProducts, deal.productsPotential, deal.productsCurrent), "Product scope must be explicit."),
        buildOperationalRequirement("Commercial schedule or terms", hasAnyText(deal.commercialSchedule, deal.commercialTerms), "Commercials must be ready to send."),
        buildOperationalRequirement("Pricing and deductions base", hasAnyText(deal.pricingBase, deal.deductionTerms), "Pricing logic should be documented."),
        buildOperationalRequirement("Proposal start date stamped", hasAnyText(deal.offerDate, deal.proposalValidUntil), "Use the proposal action to stamp the offer date and control validity."),
      ];
    case "Legal":
      return [
        buildOperationalRequirement(
          "Client legal profile complete",
          hasAnyText(deal.companyName) && hasAnyText(deal.companyRegistrationNumber) && hasAnyText(deal.companyRegisteredAddress),
          "Company name, registration number, and registered address are required."
        ),
        buildOperationalRequirement(
          "Representative and emails ready",
          hasAnyText(deal.legalRepresentativeName, deal.companyLegalRepresentative) &&
            hasAnyText(deal.invoiceEmail) &&
            hasAnyText(deal.supportEmail) &&
            hasAnyText(deal.managementEmail),
          "Representative plus invoice, support, and management emails should be captured."
        ),
        buildOperationalRequirement(
          "License and commercials attached",
          hasAnyText(deal.companyLicense, deal.licenseStatus) && hasAnyText(deal.commercialSchedule, deal.commercialTerms),
          "Legal should receive license context and agreed commercials."
        ),
        buildOperationalRequirement(
          "Setup fee and deductions defined",
          hasAnyText(deal.setupFeeStatus) && hasAnyText(deal.deductionsAllowed, deal.deductionTerms),
          "Setup fee treatment and deductions allowed should be explicit."
        ),
        buildOperationalRequirement(
          "Marketing or positioning commitments captured",
          hasAnyText(deal.marketingCommitments, deal.liveGamesTopPosition, deal.slotsTopPosition),
          "Commercial commitments should be reflected before contract drafting."
        ),
      ];
    case "DD":
      return [
        buildOperationalRequirement("DD kickoff date set", hasAnyText(deal.ddDate), "Stamp the DD start date when the request is created."),
        buildOperationalRequirement(
          "DD contact mapped",
          hasAnyText(deal.ddContactName) && hasAnyText(deal.ddContactEmail),
          "Name and email should exist for the compliance owner."
        ),
        buildOperationalRequirement(
          "License and company evidence ready",
          hasAnyText(deal.companyLicense, deal.licenseStatus) && hasAnyText(deal.companyRegistrationNumber),
          "License and company registration should be attached or logged."
        ),
        buildOperationalRequirement(
          "Representative identification available",
          hasAnyText(deal.legalRepresentativeId, deal.legalRepresentativeName, deal.companyLegalRepresentative),
          "Representative name or ID should be visible for DD."
        ),
        buildOperationalRequirement("DD trace captured", hasAnyText(deal.ddTicket, deal.dd, deal.comments), "Use DD ticket or notes to track the request."),
      ];
    case "Integration":
      return [
        buildOperationalRequirement("Integration request defined", hasAnyText(deal.integrationRequest), "Technical scope should be written for delivery."),
        buildOperationalRequirement("Jira ticket created", hasAnyText(deal.jira), "A Jira reference is expected when integration starts."),
        buildOperationalRequirement(
          "Technical contacts ready",
          hasAnyText(deal.integrationTeam, deal.integrationEmail, deal.skype),
          "Integration team, email, or chat should be available."
        ),
        buildOperationalRequirement("Website or environment mapped", hasAnyText(deal.url, deal.siteStatus), "Integration target URL should be visible."),
        buildOperationalRequirement(
          "Product scope locked",
          hasAnyText(deal.negotiatedProducts, deal.productsPotential, deal.productsCurrent),
          "Products and tables to activate should be explicit."
        ),
      ];
    case "Legal Approval":
      return [
        buildOperationalRequirement("Legal signoff request created", hasAnyText(deal.legalSignoffRequest, deal.legalApprovalDate), "Use the legal signoff action to stamp the request and summarize launch approval needs."),
        buildOperationalRequirement("Agreement signed", isSignedAgreement(deal), "Commercial agreement should be signed."),
        buildOperationalRequirement("Legal approved", cleanText(deal.legalStatus) === "Approved", "Legal status should be approved."),
        buildOperationalRequirement("DD completed", cleanText(deal.ddStatus) === "Completed", "DD should be marked completed."),
        buildOperationalRequirement("Integration completed", cleanText(deal.integrationStatus) === "Completed", "Integration should be completed."),
        buildOperationalRequirement(
          "Launch date visible",
          hasAnyText(deal.liveDate, deal.liveSince) || isGoLiveReadyStatus(deal.goLiveStatus),
          "Launch planning needs a date or sign-off status."
        ),
      ];
    case "Go Live":
      return [
        buildOperationalRequirement("Go live sign-off confirmed", isGoLiveReadyStatus(deal.goLiveStatus), "Go live status should move beyond Not Started."),
        buildOperationalRequirement("Live date recorded", hasAnyText(deal.liveDate, deal.liveSince), "Record launch date or live since."),
        buildOperationalRequirement("Integration completed", cleanText(deal.integrationStatus) === "Completed", "Technical execution should be closed."),
        buildOperationalRequirement(
          "Operational support contact ready",
          hasAnyText(deal.integrationEmail, deal.supportEmail, deal.managementEmail),
          "An operational or support contact should exist for launch."
        ),
        buildOperationalRequirement("Launch follow-up logged", hasAnyText(deal.actionItems, deal.updates), "Document the first post-launch step."),
      ];
    case "Live":
      return [
        buildOperationalRequirement("Live since recorded", hasAnyText(deal.liveSince, deal.liveDate), "The account should have a live date."),
        buildOperationalRequirement("Follow-up cadence active", hasAnyText(deal.lastFollowUp), "A recent follow-up date should exist."),
        buildOperationalRequirement("Growth owner assigned", hasAnyText(getDealOwner(deal)), "The live account still needs a visible owner."),
        buildOperationalRequirement("Growth next step logged", hasAnyText(deal.actionItems), "Capture the next growth move."),
        buildOperationalRequirement(
          "Growth plan or activation visible",
          countLiveCampaignsForDeal(deal) > 0 || hasAnyText(deal.comments, deal.updates, deal.marketingCommitments),
          "Use campaigns, notes, or commitments to frame the expansion plan."
        ),
      ];
    case "Handover":
      return [
        buildOperationalRequirement("Handover date set", hasAnyText(deal.handover), "Record when the account moved to handover."),
        buildOperationalRequirement("Live owner assigned", hasAnyText(getDealOwner(deal)), "Ownership should be explicit before transfer."),
        buildOperationalRequirement(
          "Account context documented",
          hasAnyText(deal.statusText, deal.otherInfo, deal.entityInfo),
          "Summarize the operating context for the receiving team."
        ),
        buildOperationalRequirement(
          "Key contacts documented",
          hasAnyText(deal.primaryContact, deal.decisionMaker, deal.supportEmail, deal.managementEmail),
          "The receiving team should inherit contact visibility."
        ),
        buildOperationalRequirement(
          "Future opportunities logged",
          hasAnyText(deal.productsPotential, deal.otherInfo, deal.comments),
          "Expansion notes should survive the transfer."
        ),
      ];
    default:
      return [];
  }
}

function buildStageOperationalRecommendation(stage, deal, checklist, blueprint) {
  const missing = checklist.filter((item) => !item.ready);
  if (cleanText(stage) === "Proposal" && !cleanText(deal.offerDate)) {
    return "Issue the client commercial proposal to stamp the proposal start date and activate the validity window.";
  }
  if (cleanText(stage) === "Legal" && cleanText(deal.legalStatus) === "Not Started") {
    return "Start the legal request so contract review begins with the agreed commercials and client profile already attached.";
  }
  if (cleanText(stage) === "DD" && !cleanText(deal.ddDate)) {
    return "Create the DD request to formally stamp DD start and route compliance ownership.";
  }
  if (cleanText(stage) === "Integration" && !cleanText(deal.integrationDate)) {
    return "Create the integration request to start delivery, stamp the date, and align Jira ownership.";
  }
  if (cleanText(stage) === "Legal Approval" && !hasAnyText(deal.legalSignoffRequest, deal.legalApprovalDate)) {
    return "Create the legal signoff request to start final internal approval before Go Live.";
  }
  if (cleanText(stage) === "Live" && hasStaleFollowUp(deal)) {
    return "Refresh live-account follow-up now so the active client does not drift without growth control.";
  }
  if (missing.length > 0) {
    const labels = missing.slice(0, 2).map((item) => item.label.toLowerCase());
    return `Complete ${labels.join(" and ")} before moving this account to ${blueprint.nextStage}.`;
  }
  if (cleanText(stage) === "Handover") {
    return "The account is ready for transfer closeout and future-growth visibility.";
  }
  return `This account is operationally ready to move from ${stage} to ${blueprint.nextStage}.`;
}

function buildDealOperationalGuide(deal) {
  const stage = getDealVisibleStage(deal) || "Lead";
  const blueprint = getStageOperationBlueprint(stage);
  const checklist = buildStageOperationalChecklist(stage, deal);
  const readyCount = checklist.filter((item) => item.ready).length;
  const missingItems = checklist.filter((item) => !item.ready);
  const readyToAdvance = checklist.length > 0 && missingItems.length === 0;
  const followUpGap = cleanText(deal.lastFollowUp) ? daysSince(deal.lastFollowUp) : null;
  const blocked = isBlockedDeal(deal);
  const toneClass = blocked ? "is-blocked" : readyToAdvance ? "is-ready" : "is-progress";
  return {
    deal,
    stage,
    blueprint,
    checklist,
    readyCount,
    totalCount: checklist.length,
    missingItems,
    readyToAdvance,
    followUpGap,
    taskCount: countOpenTasksForDeal(deal),
    liveCampaignCount: countLiveCampaignsForDeal(deal),
    toneClass,
    primaryActionKind: blueprint.primaryActionKind,
    primaryActionLabel: blueprint.primaryActionKind ? getStageDocumentActionLabel(blueprint.primaryActionKind) : "",
    recommendation: buildStageOperationalRecommendation(stage, deal, checklist, blueprint),
  };
}

function renderOperationalChecklistItems(items) {
  if (!items.length) {
    return '<div class="empty-state">No operational requirements are mapped for this stage yet.</div>';
  }

  return items
    .map((item) => {
      return `
        <article class="operational-check ${item.ready ? "is-ready" : "is-missing"}">
          <span>${escapeHtml(item.ready ? "Ready" : "Missing")}</span>
          <strong>${escapeHtml(item.label)}</strong>
          ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}
        </article>
      `;
    })
    .join("");
}

function renderDealWorkflowGuideFromForm() {
  if (!dealForm || !elements.dealWorkflowGuide || !elements.dealWorkflowStageBadge) {
    return;
  }

  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const draft = buildDealDraftFromForm(existingDeal);
  const guide = buildDealOperationalGuide(draft);
  const badgeTone = guide.toneClass === "is-ready" ? "success" : guide.toneClass === "is-blocked" ? "blocked" : "info";

  elements.dealWorkflowStageBadge.className = `pill ${badgeTone}`;
  elements.dealWorkflowStageBadge.textContent = `${guide.stage} Stage`;
  elements.dealWorkflowGuide.innerHTML = `
    <article class="operational-guide-card ${guide.toneClass}">
      <div class="operational-guide-head">
        <div class="operational-guide-copy">
          <span class="operational-guide-kicker">Stage objective</span>
          <strong>${escapeHtml(guide.blueprint.objective)}</strong>
          <p>${escapeHtml(guide.recommendation)}</p>
        </div>
        <span class="pill ${badgeTone}">${guide.readyCount}/${guide.totalCount} ready</span>
      </div>
      <div class="operational-guide-metrics">
        <article class="operational-guide-metric">
          <span>Current owner</span>
          <strong>${escapeHtml(getDealOwner(draft) || guide.blueprint.ownerHint)}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Next stage</span>
          <strong>${escapeHtml(guide.blueprint.nextStage)}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Open tasks</span>
          <strong>${escapeHtml(String(guide.taskCount))}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Follow-up gap</span>
          <strong>${guide.followUpGap === null ? "No date" : `${guide.followUpGap}d`}</strong>
        </article>
      </div>
      <div class="operational-checklist">
        ${renderOperationalChecklistItems(guide.checklist)}
      </div>
      <div class="operational-guide-actions">
        ${getStageDocumentActionKinds()
          .map((kind) => {
            const variant = kind === guide.primaryActionKind ? "button-primary" : "button-ghost";
            return `<button type="button" class="button ${variant} button-small" data-stage-doc-action="${escapeAttribute(kind)}">${escapeHtml(
              getStageDocumentActionLabel(kind)
            )}</button>`;
          })
          .join("")}
        <button type="button" class="button button-ghost button-small" data-stage-prefill-task="true">Create Follow-up Task</button>
      </div>
    </article>
  `;
}

function buildPipelineOperationalSummary(stage, deals) {
  const stageDeals = deals.filter((deal) => getDealVisibleStage(deal) === stage);
  const guides = stageDeals.map((deal) => buildDealOperationalGuide(deal));
  const readyCount = guides.filter((guide) => guide.readyToAdvance).length;
  const blockedCount = stageDeals.filter((deal) => isBlockedDeal(deal)).length;
  const staleCount = stageDeals.filter((deal) => hasStaleFollowUp(deal)).length;
  const openTasks = sumValues(stageDeals.map((deal) => countOpenTasksForDeal(deal)));
  const missingMap = new Map();

  guides.forEach((guide) => {
    guide.missingItems.forEach((item) => {
      missingMap.set(item.label, (missingMap.get(item.label) || 0) + 1);
    });
  });

  const commonGaps = Array.from(missingMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, 4);
  const blueprint = getStageOperationBlueprint(stage);
  const readinessRatio = stageDeals.length > 0 ? readyCount / stageDeals.length : 0;
  const toneClass = blockedCount > 0 ? "is-blocked" : readinessRatio >= 0.7 ? "is-ready" : "is-progress";
  const recommendation = commonGaps.length
    ? `Before pushing more deals to ${blueprint.nextStage}, clean ${commonGaps[0].label.toLowerCase()} across the visible ${stage} accounts.`
    : `Most visible ${stage} accounts are ready to move into ${blueprint.nextStage}.`;

  return {
    stage,
    blueprint,
    stageDeals,
    readyCount,
    blockedCount,
    staleCount,
    openTasks,
    commonGaps,
    toneClass,
    recommendation,
  };
}

function resolvePipelineOperationalFocusStage(deals) {
  if (cleanText(ui.filters.stage) && ui.filters.stage !== "All") {
    return ui.filters.stage;
  }

  if (ui.editingDealId) {
    const activeDeal = deals.find((deal) => deal.id === ui.editingDealId);
    if (activeDeal) {
      return getDealVisibleStage(activeDeal);
    }
  }

  const stageCounts = VIEW_STAGE_ORDER.map((stage) => ({
    stage,
    count: deals.filter((deal) => getDealVisibleStage(deal) === stage).length,
  })).filter((entry) => entry.count > 0);

  return stageCounts.sort((left, right) => right.count - left.count || getStageRank(left.stage) - getStageRank(right.stage))[0]?.stage || "Lead";
}

function renderPipelineOperatingGuide(deals) {
  if (!elements.pipelineOperatingGuide || !elements.pipelineOperatingStageChip) {
    return;
  }

  if (!deals.length) {
    elements.pipelineOperatingStageChip.textContent = "Focus: No stage";
    elements.pipelineOperatingGuide.innerHTML = '<div class="empty-state">No stage operating guidance is available because no deals match the current filters.</div>';
    return;
  }

  const focusStage = resolvePipelineOperationalFocusStage(deals);
  const summary = buildPipelineOperationalSummary(focusStage, deals);
  const badgeTone = summary.toneClass === "is-ready" ? "success" : summary.toneClass === "is-blocked" ? "blocked" : "info";

  elements.pipelineOperatingStageChip.textContent = `Focus: ${focusStage} · ${summary.stageDeals.length} accounts`;
  elements.pipelineOperatingGuide.innerHTML = `
    <article class="operational-guide-card ${summary.toneClass}">
      <div class="operational-guide-head">
        <div class="operational-guide-copy">
          <span class="operational-guide-kicker">Stage objective</span>
          <strong>${escapeHtml(summary.blueprint.objective)}</strong>
          <p>${escapeHtml(summary.recommendation)}</p>
        </div>
        <span class="pill ${badgeTone}">${summary.readyCount}/${summary.stageDeals.length} ready</span>
      </div>
      <div class="operational-guide-metrics">
        <article class="operational-guide-metric">
          <span>Accounts in stage</span>
          <strong>${escapeHtml(String(summary.stageDeals.length))}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Ready to advance</span>
          <strong>${escapeHtml(String(summary.readyCount))}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Stale follow-up</span>
          <strong>${escapeHtml(String(summary.staleCount))}</strong>
        </article>
        <article class="operational-guide-metric">
          <span>Open tasks</span>
          <strong>${escapeHtml(String(summary.openTasks))}</strong>
        </article>
      </div>
      <div class="operational-guide-list-grid">
        <section class="operational-guide-list">
          <span>Common gaps</span>
          ${
            summary.commonGaps.length
              ? `<ul>${summary.commonGaps
                  .map((item) => `<li>${escapeHtml(item.label)} · ${escapeHtml(String(item.count))}</li>`)
                  .join("")}</ul>`
              : "<p>Visible accounts are not showing common blockers at this stage.</p>"
          }
        </section>
        <section class="operational-guide-list">
          <span>Execution move</span>
          <p>${escapeHtml(summary.recommendation)}</p>
          <small>${escapeHtml(
            summary.blueprint.primaryActionKind
              ? `Primary document: ${getStageDocumentActionLabel(summary.blueprint.primaryActionKind)}`
              : `Next stage in the workflow: ${summary.blueprint.nextStage}`
          )}</small>
        </section>
      </div>
      <div class="operational-guide-actions">
        <button type="button" class="button button-primary button-small" data-action="open-stage-funnel" data-stage="${escapeAttribute(
          focusStage
        )}">Open ${escapeHtml(focusStage)} List</button>
      </div>
    </article>
  `;
}

function renderDealOperationalPulse(deal) {
  const guide = buildDealOperationalGuide(deal);
  const badgeTone = guide.toneClass === "is-ready" ? "success" : guide.toneClass === "is-blocked" ? "blocked" : "info";
  const missingPreview = guide.missingItems.slice(0, 2).map((item) => item.label).join(" · ");

  return `
    <div class="deal-operational-pulse ${guide.toneClass}">
      <div class="deal-operational-pulse-head">
        <span>Operational next move</span>
        <strong>${escapeHtml(guide.blueprint.nextStage)}</strong>
      </div>
      <p>${escapeHtml(guide.recommendation)}</p>
      <div class="pill-row is-compact">
        <span class="pill ${badgeTone}">${escapeHtml(`${guide.readyCount}/${guide.totalCount} ready`)}</span>
        ${
          guide.primaryActionKind
            ? `<span class="pill neutral">${escapeHtml(getStageDocumentActionLabel(guide.primaryActionKind))}</span>`
            : `<span class="pill neutral">${escapeHtml(`Next: ${guide.blueprint.nextStage}`)}</span>`
        }
      </div>
      <small>${escapeHtml(missingPreview ? `Missing: ${missingPreview}` : `Ready to move into ${guide.blueprint.nextStage}.`)}</small>
    </div>
  `;
}

function buildTaskPrefillFromSnapshot(deal) {
  const guide = buildDealOperationalGuide(deal);
  const existsInState = state.deals.some((item) => item.id === deal.id);
  return normalizeTask({
    ...createEmptyTask(),
    title: `${guide.stage} follow-up ${deal.client || deal.operator || deal.deal || "account"}`,
    scopeType: "Deal",
    dealId: existsInState ? deal.id : "",
    deal: deal.deal,
    client: deal.client,
    operator: deal.operator,
    market: deal.market,
    jiraTicket: deal.jira,
    owner: getDealOwner(deal),
    nextStep: guide.recommendation,
    notes: composeDealStateLabel(deal) || deal.statusText || deal.comments,
  });
}

function getLeadDeals(deals = getScopedDeals()) {
  return deals.filter((deal) => !isInactiveDeal(deal) && (deal.leadFlag || getDealVisibleStage(deal) === "Lead"));
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

function buildBriefValue(...values) {
  const resolved = values.map((value) => cleanText(value)).find(Boolean);
  return resolved || "TBC";
}

function buildNegotiatedProductsValue(deal) {
  return buildBriefValue(deal.negotiatedProducts, deal.productsPotential, deal.productsCurrent);
}

function buildDocumentClientName(deal) {
  return buildBriefValue(deal.documentClientName, deal.companyName, deal.client, deal.operator, deal.deal);
}

function buildProposalValidThroughDateLabel(deal) {
  const validUntil = getProposalValidUntil(deal);
  return validUntil ? formatDate(validUntil) : "TBC";
}

function buildProposalCommercialsSummary(deal) {
  return [
    `Pricing Base: ${buildBriefValue(deal.pricingBase)}`,
    `Commercial Terms: ${buildBriefValue(deal.commercialTerms)}`,
    `Commercial Schedule: ${buildBriefValue(deal.commercialSchedule)}`,
    `Setup Fee EUR: ${buildBriefValue(deal.setupFeeAmount)}`,
    `Deductions Allowed: ${buildBriefValue(deal.deductionsAllowed, deal.deductionTerms)}`,
    `Bonus Cap %: ${buildBriefValue(deal.bonusCap)}`,
    `Tax %: ${buildBriefValue(deal.gamingTax)}`,
    `Withholding %: ${buildBriefValue(deal.withholdingTax)}`,
  ].join("\n");
}

function buildProposalRequestTemplate(deal) {
  return [
    `Client Name: ${buildDocumentClientName(deal)}`,
    `Region / Territory / Country: ${buildBriefValue(deal.market, deal.jurisdiction, deal.clientBased)}`,
    `Valid Through Date: ${buildProposalValidThroughDateLabel(deal)}`,
    "",
    "Commercials:",
    buildProposalCommercialsSummary(deal),
  ].join("\n");
}

function getProposalValidityDays(deal) {
  const days = toNullableNumber(deal.proposalValidityDays);
  return days && days > 0 ? days : 30;
}

function addDaysToIsoDate(value, days) {
  const normalized = normalizeDateInput(value);
  if (!normalized) {
    return "";
  }
  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function getProposalIssueDate(deal) {
  return normalizeDateInput(deal.offerDate) || new Date().toISOString().slice(0, 10);
}

function getProposalValidUntil(deal) {
  return normalizeDateInput(deal.proposalValidUntil) || addDaysToIsoDate(getProposalIssueDate(deal), getProposalValidityDays(deal));
}

function buildProposalValidityText(deal) {
  const days = getProposalValidityDays(deal);
  const validUntil = getProposalValidUntil(deal);
  const monthHint = days >= 28 && days <= 31 ? " (1 month)" : "";
  return validUntil ? `${days} days${monthHint} · valid until ${formatDate(validUntil)}` : `${days} days${monthHint} from issue date`;
}

function seedProposalRequestFromTemplate() {
  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const draft = buildDealDraftFromForm(existingDeal);
  const proposalField = dealForm.elements.proposalRequest;
  if (!proposalField) {
    return;
  }

  proposalField.value = buildProposalRequestTemplate(draft);
  proposalField.dispatchEvent(new Event("input", { bubbles: true }));
  proposalField.dispatchEvent(new Event("change", { bubbles: true }));
  refreshDealFieldHighlights();
  setBanner("Proposal Request seeded from the commercial proposal template.", "success");
}

function parseCommercialScheduleRows(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => cleanText(part));
      if (parts.length >= 4) {
        return {
          product: parts[0],
          tier: parts[1],
          commercial: parts[2],
          notes: parts.slice(3).join(" | "),
        };
      }
      if (parts.length === 3) {
        return {
          product: parts[0],
          tier: parts[1],
          commercial: parts[2],
          notes: "",
        };
      }
      if (parts.length === 2) {
        return {
          product: parts[0],
          tier: "",
          commercial: parts[1],
          notes: "",
        };
      }
      return {
        product: parts[0] || "",
        tier: "",
        commercial: "",
        notes: "",
      };
    })
    .filter((row) => row.product || row.commercial || row.notes);
}

function buildCommercialScheduleBriefLines(deal) {
  const rows = parseCommercialScheduleRows(deal.commercialSchedule);
  if (!rows.length) {
    return [];
  }
  return rows.map((row) => {
    const parts = [row.product, row.tier, row.commercial, row.notes].filter(Boolean);
    return `- ${parts.join(" | ")}`;
  });
}

function buildLegalRequestBrief(deal) {
  const scheduleLines = buildCommercialScheduleBriefLines(deal);
  return [
    "Legal Request",
    "New Service Agreement Request",
    "",
    `Deal: ${buildBriefValue(deal.deal)}`,
    `Client / Company Name: ${buildDocumentClientName(deal)}`,
    `Market: ${buildBriefValue(deal.market)}`,
    `Type: ${buildBriefValue(deal.type)}`,
    `Legal Entity: ${buildBriefValue(deal.legalEntity)}`,
    `Company registration number: ${buildBriefValue(deal.companyRegistrationNumber)}`,
    `Company registered address: ${buildBriefValue(deal.companyRegisteredAddress)}`,
    `Company legal representative: ${buildBriefValue(deal.companyLegalRepresentative, deal.legalRepresentativeName, deal.decisionMaker)}`,
    `Company license: ${buildBriefValue(deal.companyLicense, deal.licenseStatus)}`,
    "",
    `Email address for invoices: ${buildBriefValue(deal.invoiceEmail)}`,
    `Email address for customer support: ${buildBriefValue(deal.supportEmail)}`,
    `Email address for management: ${buildBriefValue(deal.managementEmail)}`,
    "",
    `DD Contact Name: ${buildBriefValue(deal.ddContactName)}`,
    `DD Contact Email: ${buildBriefValue(deal.ddContactEmail)}`,
    "",
    "Legal Representative",
    `Full name: ${buildBriefValue(deal.legalRepresentativeName, deal.companyLegalRepresentative)}`,
    `ID: ${buildBriefValue(deal.legalRepresentativeId)}`,
    `Address: ${buildBriefValue(deal.legalRepresentativeAddress)}`,
    `Email: ${buildBriefValue(deal.legalRepresentativeEmail)}`,
    "",
    `Primary Contact: ${buildBriefValue(deal.primaryContact)}`,
    `Decision Maker: ${buildBriefValue(deal.decisionMaker)}`,
    `Website: ${buildBriefValue(deal.url, deal.siteStatus)}`,
    "",
    "Client Commercials Agreed",
    `Commercial terms: ${buildBriefValue(deal.commercialTerms)}`,
    `Pricing base: ${buildBriefValue(deal.pricingBase)}`,
    `Deduction terms: ${buildBriefValue(deal.deductionTerms)}`,
    `Setup fee status: ${buildBriefValue(deal.setupFeeStatus)}`,
    `Setup fee amount (EUR): ${buildBriefValue(deal.setupFeeAmount)}`,
    `Marketing commitments: ${buildBriefValue(deal.marketingCommitments)}`,
    `Live games top position: ${buildBriefValue(deal.liveGamesTopPosition)}`,
    `Slots top position: ${buildBriefValue(deal.slotsTopPosition)}`,
    `Bonus cap: ${buildBriefValue(deal.bonusCap)}`,
    `Gaming tax: ${buildBriefValue(deal.gamingTax)}`,
    `Withholding: ${buildBriefValue(deal.withholdingTax)}`,
    `Advance payment: ${buildBriefValue(deal.advancePayment)}`,
    `Credit notes: ${buildBriefValue(deal.creditNotes)}`,
    `Deductions allowed: ${buildBriefValue(deal.deductionsAllowed)}`,
    "",
    ...(scheduleLines.length ? ["Commercial schedule:", ...scheduleLines, ""] : []),
    `Commercial Summary: ${buildBriefValue(deal.statusText, deal.comments)}`,
  ].join("\n");
}

function buildIntegrationRequestBrief(deal) {
  return [
    `New Client ${buildDocumentClientName(deal)} Integration Request`,
    "",
    `Hello team, please start supporting a new integration client ${buildDocumentClientName(deal)}.`,
    "",
    "Client Background",
    `Client Type: ${buildBriefValue(deal.type)}`,
    `URL: ${buildBriefValue(deal.url, deal.siteStatus)}`,
    `Client based: ${buildBriefValue(deal.clientBased, deal.jurisdiction)}`,
    `Name: ${buildDocumentClientName(deal)}`,
    `Legal Entity: ${buildBriefValue(deal.legalEntity)}`,
    `Market: ${buildBriefValue(deal.market)}`,
    `Platform: ${buildBriefValue(deal.platform)}`,
    `Other live suppliers: ${buildBriefValue(deal.otherLiveSuppliers)}`,
    `Potential: ${buildBriefValue(deal.priorityClass, deal.targetPriority)}`,
    `Priority: ${buildBriefValue(deal.targetPriority)}`,
    `Owner: ${buildBriefValue(deal.kam)}`,
    `License: ${buildBriefValue(deal.companyLicense, deal.licenseStatus)}`,
    `Integration team: ${buildBriefValue(deal.integrationTeam)}`,
    `Products: ${buildNegotiatedProductsValue(deal)}`,
    `Teams group: ${buildBriefValue(deal.teamsGroup)}`,
    "",
    `Integration request: ${buildBriefValue(deal.integrationRequest)}`,
    `Integration email: ${buildBriefValue(deal.integrationEmail)}`,
    `Integration chat: ${buildBriefValue(deal.skype)}`,
    `Jira ticket: ${buildBriefValue(deal.jira)}`,
    "",
    `Other info: ${buildBriefValue(deal.otherInfo, deal.entityInfo, deal.comments)}`,
  ].join("\n");
}

function buildLegalSignoffBrief(deal) {
  return [
    "Legal Signoff Request",
    "",
    `Deal: ${buildBriefValue(deal.deal)}`,
    `Client / Operator: ${buildDocumentClientName(deal)}`,
    `Market: ${buildBriefValue(deal.market)}`,
    `Stage: ${buildBriefValue(deal.stage, "Legal Approval")}`,
    `Legal Signoff Initiated: ${buildBriefValue(deal.legalApprovalDate || new Date().toISOString().slice(0, 10))}`,
    "",
    "Launch Readiness Check",
    `Legal Status: ${buildBriefValue(deal.legalStatus)}`,
    `DD Status: ${buildBriefValue(deal.ddStatus)}`,
    `Integration Status: ${buildBriefValue(deal.integrationStatus)}`,
    `Go Live Status: ${buildBriefValue(deal.goLiveStatus, "Legal Sign-Off")}`,
    `Live Date: ${buildBriefValue(deal.liveDate, deal.liveSince)}`,
    "",
    "Commercial and Product Scope",
    `Products in scope: ${buildNegotiatedProductsValue(deal)}`,
    `Commercial terms: ${buildBriefValue(deal.commercialTerms)}`,
    `Proposal request: ${buildBriefValue(deal.proposalRequest)}`,
    `Integration request: ${buildBriefValue(deal.integrationRequest)}`,
    "",
    "Approval Summary",
    `Legal signoff request: ${buildBriefValue(deal.legalSignoffRequest, deal.statusText, deal.comments)}`,
    `Action items: ${buildBriefValue(deal.actionItems)}`,
    `Updates: ${buildBriefValue(deal.updates)}`,
    `Jira ticket: ${buildBriefValue(deal.jira)}`,
    `DD ticket: ${buildBriefValue(deal.ddTicket)}`,
  ].join("\n");
}

function buildDdRequestBrief(deal) {
  return [
    "Due Diligence Request",
    "",
    `Deal: ${buildBriefValue(deal.deal)}`,
    `Client / Company Name: ${buildDocumentClientName(deal)}`,
    `Market: ${buildBriefValue(deal.market)}`,
    `Stage: ${buildBriefValue(deal.stage)}`,
    `DD Initiated: ${buildBriefValue(deal.ddDate || new Date().toISOString().slice(0, 10))}`,
    "",
    "Corporate and Licensing",
    `Legal Entity: ${buildBriefValue(deal.legalEntity)}`,
    `Company Registration Number: ${buildBriefValue(deal.companyRegistrationNumber)}`,
    `Company Registered Address: ${buildBriefValue(deal.companyRegisteredAddress)}`,
    `Company License: ${buildBriefValue(deal.companyLicense, deal.licenseStatus)}`,
    "",
    "DD Contacts",
    `DD Contact Name: ${buildBriefValue(deal.ddContactName)}`,
    `DD Contact Email: ${buildBriefValue(deal.ddContactEmail)}`,
    `Legal Representative: ${buildBriefValue(deal.legalRepresentativeName, deal.companyLegalRepresentative)}`,
    `Legal Representative Email: ${buildBriefValue(deal.legalRepresentativeEmail)}`,
    "",
    "Commercial Context",
    `Products in scope: ${buildNegotiatedProductsValue(deal)}`,
    `Commercial terms: ${buildBriefValue(deal.commercialTerms)}`,
    `Deductions allowed: ${buildBriefValue(deal.deductionsAllowed, deal.deductionTerms)}`,
    `Notes: ${buildBriefValue(deal.statusText, deal.comments, deal.actionItems)}`,
  ].join("\n");
}

function buildProposalRequestBrief(deal) {
  const scheduleLines = buildCommercialScheduleBriefLines(deal);
  const proposalScope = cleanText(deal.proposalRequest) || buildProposalRequestTemplate(deal);
  return [
    "Commercial Proposal",
    "",
    "Executive Summary",
    buildBriefValue(
      proposalScope,
      deal.statusText,
      `This commercial proposal outlines the Evolution standard offering and commercial framework for ${buildDocumentClientName(deal)}.`
    ),
    "",
    "About the Evolution Group",
    "The Evolution Group is a leading provider of online gaming content, combining premium live casino, RNG, slots, and branded content under one commercial relationship.",
    "Evolution delivers a wide live casino portfolio, premium game shows, localized table options, and strong content breadth for operators scaling across LATAM and other regulated markets.",
    "",
    "About Our Brands",
    "Evolution: Core live casino, game shows, premium tables, and localized opportunities.",
    "Ezugi: Complementary live casino content and additional table depth across jurisdictions.",
    "NetEnt and Red Tiger: Premium slots, branded content, and strong promotional potential.",
    "Big Time Gaming and Nolimit City: Distinctive slots and high-engagement mechanics.",
    "",
    "Our Commercial Proposal",
    `Client Name: ${buildDocumentClientName(deal)}`,
    `Deal: ${buildBriefValue(deal.deal)}`,
    `Region / Territory / Country: ${buildBriefValue(deal.market, deal.jurisdiction, deal.clientBased)}`,
    `Segment: ${buildBriefValue(deal.segment, deal.type)}`,
    `Platform: ${buildBriefValue(deal.platform)}`,
    `Valid Through Date: ${buildProposalValidThroughDateLabel(deal)}`,
    `Requested products: ${buildNegotiatedProductsValue(deal)}`,
    `Strategic fit: ${buildBriefValue(deal.strategicFit)}`,
    `Revenue potential EUR: ${buildBriefValue(deal.revenuePotentialEur || deal.dealValue)}`,
    "",
    "Commercials",
    `Commercial terms: ${buildBriefValue(deal.commercialTerms)}`,
    `Pricing base: ${buildBriefValue(deal.pricingBase)}`,
    `Activation requirements: ${buildBriefValue(deal.activationRequirements)}`,
    `Marketing commitments: ${buildBriefValue(deal.marketingCommitments)}`,
    `Live games positioning: ${buildBriefValue(deal.liveGamesTopPosition)}`,
    `Slots positioning: ${buildBriefValue(deal.slotsTopPosition)}`,
    `Setup fee status: ${buildBriefValue(deal.setupFeeStatus)}`,
    `Setup fee amount: ${buildBriefValue(deal.setupFeeAmount)}`,
    `Deduction terms: ${buildBriefValue(deal.deductionTerms, deal.deductionsAllowed)}`,
    `Bonus cap: ${buildBriefValue(deal.bonusCap)}`,
    `Gaming tax: ${buildBriefValue(deal.gamingTax)}`,
    `Withholding: ${buildBriefValue(deal.withholdingTax)}`,
    "",
    ...(scheduleLines.length ? ["Commercial schedule:", ...scheduleLines, ""] : []),
    "Implementation Dependencies",
    `Integration request: ${buildBriefValue(deal.integrationRequest)}`,
    `Integration team: ${buildBriefValue(deal.integrationTeam)}`,
    `Jira: ${buildBriefValue(deal.jira)}`,
    `Next actions: ${buildBriefValue(deal.actionItems, deal.updates)}`,
    "",
    "Closing",
    "We trust this proposal aligns with the opportunity in scope and provides a strong commercial foundation to move the discussion forward.",
    "We remain committed to supporting the implementation process with the legal, technical, and commercial coordination required for a successful launch.",
  ].join("\n");
}

function buildNegotiationBrief(deal) {
  const scheduleLines = buildCommercialScheduleBriefLines(deal);
  return [
    "What Is Being Negotiated",
    "",
    `Client: ${buildDocumentClientName(deal)}`,
    `Products in scope: ${buildNegotiatedProductsValue(deal)}`,
    `Proposal scope: ${buildBriefValue(deal.proposalRequest)}`,
    `Commercial terms: ${buildBriefValue(deal.commercialTerms)}`,
    `Pricing base (GGR/NGR): ${buildBriefValue(deal.pricingBase)}`,
    `Deduction terms: ${buildBriefValue(deal.deductionTerms)}`,
    `Activation requirements: ${buildBriefValue(deal.activationRequirements)}`,
    `Negotiation scope: ${buildBriefValue(deal.negotiationScope)}`,
    "",
    ...(scheduleLines.length ? ["Commercial schedule:", ...scheduleLines, ""] : []),
    `Other live suppliers: ${buildBriefValue(deal.otherLiveSuppliers)}`,
    `Notes: ${buildBriefValue(deal.comments, deal.otherInfo, deal.updates)}`,
  ].join("\n");
}

function buildDealBriefFilename(deal, kind) {
  const safeDeal = normalizeSearchText(deal.deal || deal.documentClientName || deal.client || deal.companyName || "deal")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "deal";
  const suffixMap = {
    legal: "new-service-agreement-request",
    proposal: "commercial-proposal",
    dd: "dd-request",
    integration: "integration-request",
    signoff: "legal-signoff-request",
    negotiation: "negotiation-brief",
  };
  return `${safeDeal}-${suffixMap[kind] || `${kind}-brief`}.txt`;
}

function buildWordCompatibleFilename(deal, kind) {
  return buildDealBriefFilename(deal, kind).replace(/\.txt$/i, ".doc");
}

function isRtfHeadingLine(line, index) {
  const text = cleanText(line);
  if (!text) {
    return false;
  }
  if (index === 0) {
    return true;
  }
  if (text.length > 48 || text.includes(":") || text.includes(".")) {
    return false;
  }
  return /^[A-Z][A-Za-z0-9/&\- ]+$/.test(text);
}

function buildWordCompatibleHtml(kind, deal, template) {
  const title = cleanText(template?.exportLabel || getStageDocumentActionLabel(kind) || "Cube One Request");
  const subtitle = [buildDocumentClientName(deal), cleanText(deal.market), new Date().toLocaleDateString("en-US")].filter(Boolean).join(" · ");
  const lines = String(template?.content || "").split("\n");
  const blocks = [];

  lines.forEach((line, index) => {
    const trimmed = cleanText(line);
    if (!trimmed) {
      blocks.push('<div class="doc-spacer"></div>');
      return;
    }

    if (index === 0) {
      return;
    }

    if (isRtfHeadingLine(trimmed, index)) {
      blocks.push(`<h2>${escapeHtml(trimmed)}</h2>`);
      return;
    }

    const labelMatch = trimmed.match(/^([^:]{1,72}):\s*(.*)$/);
    if (labelMatch) {
      const [, label, value] = labelMatch;
      blocks.push(
        `<p><strong>${escapeHtml(`${cleanText(label)}:`)}</strong> ${escapeHtml(cleanText(value) || "Not provided")}</p>`
      );
      return;
    }

    blocks.push(`<p>${escapeHtml(trimmed)}</p>`);
  });

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8" />
    <meta name="ProgId" content="Word.Document" />
    <meta name="Generator" content="Cube One" />
    <meta name="Originator" content="Cube One" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page {
        size: A4;
        margin: 1in;
      }
      body {
        font-family: Calibri, Arial, sans-serif;
        color: #161a1f;
        line-height: 1.42;
        font-size: 11pt;
      }
      .doc-shell {
        max-width: 7.3in;
      }
      .doc-kicker {
        margin: 0 0 8pt;
        color: #4472c4;
        font-size: 9pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.4pt;
      }
      h1 {
        margin: 0 0 10pt;
        font-size: 24pt;
        line-height: 1.1;
      }
      .doc-subtitle {
        margin: 0 0 16pt;
        color: #5d6674;
        font-size: 10pt;
      }
      h2 {
        margin: 18pt 0 8pt;
        font-size: 14pt;
        color: #161a1f;
      }
      p {
        margin: 0 0 7pt;
      }
      strong {
        font-weight: 700;
      }
      .doc-spacer {
        height: 8pt;
      }
      .doc-footer {
        margin-top: 18pt;
        color: #7d8794;
        font-size: 9pt;
      }
    </style>
  </head>
  <body>
    <div class="doc-shell">
      <p class="doc-kicker">Cube One Request Export</p>
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="doc-subtitle">${escapeHtml(subtitle)}</p>` : ""}
      ${blocks.join("\n")}
      <p class="doc-footer">Generated from Cube One as a Word-compatible document.</p>
    </div>
  </body>
</html>`;
}

function downloadWordCompatibleRequest(kind, deal, template) {
  const html = buildWordCompatibleHtml(kind, deal, template);
  downloadBlob(buildWordCompatibleFilename(deal, kind), html, "application/msword;charset=utf-8");
}

function getDealBriefTemplate(kind, deal) {
  const templates = {
    legal: {
      label: "Legal request brief",
      exportLabel: "Legal Request",
      content: buildLegalRequestBrief(deal),
    },
    proposal: {
      label: "Proposal request brief",
      exportLabel: "Commercial Proposal",
      content: buildProposalRequestBrief(deal),
    },
    dd: {
      label: "DD request brief",
      exportLabel: "DD Request",
      content: buildDdRequestBrief(deal),
    },
    integration: {
      label: "Integration request brief",
      exportLabel: "Integration Request",
      content: buildIntegrationRequestBrief(deal),
    },
    signoff: {
      label: "Legal signoff brief",
      exportLabel: "Legal Signoff Request",
      content: buildLegalSignoffBrief(deal),
    },
    negotiation: {
      label: "Negotiation brief",
      exportLabel: "Negotiation Brief",
      content: buildNegotiationBrief(deal),
    },
  };
  return templates[kind] || null;
}

async function copyDealBrief(kind) {
  if (!dealForm) {
    return;
  }
  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const deal = buildDealDraftFromForm(existingDeal);
  const template = getDealBriefTemplate(kind, deal);
  if (!template) {
    return;
  }

  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error("Clipboard unavailable");
    }
    await navigator.clipboard.writeText(template.content);
    setBanner(`${template.label} copied for ${deal.deal || deal.client || "draft client"}.`, "success");
  } catch (error) {
    downloadBlob(buildDealBriefFilename(deal, kind), template.content, "text/plain;charset=utf-8");
    setBanner(`${template.label} downloaded because clipboard access was not available.`, "warn");
  }
}

function exportDealBrief(kind) {
  if (!dealForm) {
    return;
  }
  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  const deal = buildDealDraftFromForm(existingDeal);
  const template = getDealBriefTemplate(kind, deal);
  if (!template) {
    return;
  }
  downloadBlob(buildDealBriefFilename(deal, kind), template.content, "text/plain;charset=utf-8");
  setBanner(`${template.exportLabel} exported for ${deal.deal || deal.client || "draft client"}.`, "success");
}

function getStageRank(stage) {
  const index = STAGE_ORDER.indexOf(stage);
  return index >= 0 ? index : -1;
}

function shouldAdvanceStage(currentStage, targetStage) {
  return getStageRank(targetStage) > getStageRank(currentStage);
}

function applyDocumentStageAction(kind, draft) {
  const config = DOCUMENT_STAGE_ACTIONS[kind];
  if (!config) {
    return normalizeDeal(draft);
  }

  const today = new Date().toISOString().slice(0, 10);
  const nextDraft = { ...draft };

  if (shouldAdvanceStage(nextDraft.stage, config.targetStage)) {
    nextDraft.stage = config.targetStage;
  } else if (!cleanText(nextDraft.stage)) {
    nextDraft.stage = config.targetStage;
  }

  if (config.dateField && !cleanText(nextDraft[config.dateField])) {
    nextDraft[config.dateField] = today;
  }

  if (config.statusField) {
    const preserveValues = Array.isArray(config.preserveValues) ? config.preserveValues : ["Started", "In Progress", "Completed"];
    if (!preserveValues.includes(cleanText(nextDraft[config.statusField]))) {
      nextDraft[config.statusField] = config.statusValue;
    }
  }

  if (config.flagField) {
    nextDraft[config.flagField] = true;
  }

  if (kind === "proposal" && !cleanText(nextDraft.proposalValidUntil)) {
    nextDraft.proposalValidUntil = addDaysToIsoDate(nextDraft.offerDate || today, getProposalValidityDays(nextDraft));
  }

  nextDraft.lastFollowUp = normalizeDateInput(nextDraft.lastFollowUp) || today;
  nextDraft.updates = appendTraceLog(nextDraft.updates, `${config.actionLabel} created`);
  return normalizeDeal(nextDraft);
}

async function persistPreparedDeal(draft, actionLabel) {
  if (!draft.deal.trim()) {
    setBanner("El campo Deal es obligatorio.", "danger");
    return null;
  }

  const exists = state.deals.some((deal) => deal.id === draft.id);
  if (exists) {
    state.deals = state.deals.map((deal) => (deal.id === draft.id ? draft : deal));
  } else {
    state.deals = [draft, ...state.deals];
  }

  const saved = await persistState();
  ui.editingDealId = draft.id;
  renderAll();
  fillDealForm(draft);
  setBanner(buildExcelBanner(saved ? `${actionLabel} created and stage started for ${draft.deal}.` : `${actionLabel} created in memory for ${draft.deal}.`), saved ? "success" : "warn");
  return draft;
}

function buildDocumentDealDraft(sourceDeal = null) {
  if (sourceDeal) {
    return normalizeDeal(sourceDeal);
  }
  if (!dealForm) {
    return null;
  }
  const existingDeal = ui.editingDealId ? state.deals.find((deal) => deal.id === ui.editingDealId) : null;
  return buildDealDraftFromForm(existingDeal);
}

async function prepareDealForDocument(kind, sourceDeal = null) {
  const draft = buildDocumentDealDraft(sourceDeal);
  if (!draft) {
    return null;
  }

  const prepared = applyDocumentStageAction(kind, draft);
  const config = DOCUMENT_STAGE_ACTIONS[kind];
  return persistPreparedDeal(prepared, config?.actionLabel || getDealBriefTemplate(kind, prepared)?.exportLabel || "Document");
}

async function exportDealDocx(kind, sourceDeal = null) {
  const deal = (await prepareDealForDocument(kind, sourceDeal)) || null;
  if (!deal) {
    return;
  }
  const template = getDealBriefTemplate(kind, deal);
  if (!template) {
    return;
  }

  if (!serverMeta.ready) {
    downloadWordCompatibleRequest(kind, deal, template);
    setBanner("Stage saved and a Word request file was exported. Full DOCX with your template still requires the local Cube One server.", "success");
    return;
  }

  try {
    const response = await fetch(`${API_EXPORT_DOCX_URL}?kind=${encodeURIComponent(kind)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/json",
      },
      body: JSON.stringify({ deal }),
    });

    if (!response.ok) {
      const payload = await safeReadJson(response);
      throw new Error(payload?.error || `No pude generar el documento Word (${response.status}).`);
    }

    const blob = await response.blob();
    const filename = getDownloadFilename(response.headers.get("Content-Disposition")) || buildDealBriefFilename(deal, kind).replace(/\.txt$/i, ".docx");
    triggerBlobDownload(blob, filename);
    setBanner(`${template.exportLabel} exported in Word for ${deal.deal || deal.client || "draft client"}.`, "success");
  } catch (error) {
    downloadWordCompatibleRequest(kind, deal, template);
    setBanner(
      `No pude exportar el DOCX. ${error?.message || "Verifica que el servidor local siga activo y que la plantilla exista."} Se exportó un archivo Word como fallback.`,
      "warn"
    );
  }
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
  if (!elements.moduleFlowGrid || !elements.moduleFlowSummary) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    elements.moduleFlowSummary.textContent = "Workflow unavailable";
    elements.moduleFlowGrid.innerHTML = '<div class="empty-state">The guided journey could not be built from the current workspace data.</div>';
    return;
  }

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
          <button type="button" class="button button-ghost button-small" data-module-view="${escapeHtml(item.view)}">${escapeHtml(item.cta)}</button>
        </article>
      `;
    })
    .join("");
}

function buildModuleFlowItems() {
  const scopedDeals = getScopedDeals();
  const scopedTasks = getScopedTasks();
  const currentYear = getActiveTargetYear();
  const annualTargets = state.targets.filter((target) => Number(target.year || 0) === currentYear);
  const openTasks = scopedTasks.filter((task) => task.status !== "Done").length;
  const overdueTasks = scopedTasks.filter((task) => task.status !== "Done" && isDatePast(task.dueDate)).length;
  const activeAccounts = scopedDeals.length;
  const mappedMarkets = uniqueValues(state.marketIntel.map((item) => item.country || item.market || item.operatorCountry)).length;
  const activeUsers = state.users.filter((user) => user.status === "Active").length;
  const unassignedAccounts = scopedDeals.filter((deal) => !getDealOwner(deal)).length;
  const staleAccounts = scopedDeals.filter((deal) => hasStaleFollowUp(deal)).length;
  const requestLaneCount = REQUEST_HUB_DEFINITIONS.filter((item) => getRequestHubDeals(scopedDeals, item.key).length > 0).length;
  const launchAccounts = scopedDeals.filter((deal) => ["Go Live", "Live", "Handover"].includes(cleanText(deal.stage))).length;
  const liveCampaigns = getCampaignsForYear(currentYear).filter((campaign) => ["Ready", "Live"].includes(campaign.status)).length;
  const activeTargets = annualTargets.length;

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
      description: "Advance accounts through Lead, Proposal, Legal, DD, Integration, Legal Approval, Go Live, Live, and Handover.",
      metricLabel: "Active stages",
      metricValue: `${uniqueValues(scopedDeals.map((deal) => getDealVisibleStage(deal))).length}`,
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
      view: "requests",
      title: "Proposals & Requests",
      description: "Issue commercial proposals plus legal, DD, integration, and final legal signoff requests from one operating hub.",
      metricLabel: "Active request lanes",
      metricValue: `${requestLaneCount}`,
      nextAction:
        scopedDeals.length > 0
          ? "Use the hub to start the right request without hunting through the funnel for the correct document action."
          : "Load or create accounts first so request workflows can activate.",
      status: scopedDeals.length > 0 ? "Ready" : "Needs setup",
      pillClass: scopedDeals.length > 0 ? "success" : "blocked",
      tone: scopedDeals.length > 0 ? "is-good" : "is-danger",
      cta: "Open Requests",
    },
    {
      view: "tasks",
      title: "Execution, Jira & Blockers",
      description: "Convert each opportunity into concrete tasks, Jira actions, blocker tracking, deadlines, and traceability.",
      metricLabel: "Open tasks",
      metricValue: `${openTasks}`,
      nextAction:
        overdueTasks > 0
          ? `${overdueTasks} actions are overdue and should be resolved first.`
          : staleAccounts > 0
          ? `${staleAccounts} accounts show stale follow-up and should receive task assignments next.`
          : "Task coverage is healthy; keep trace logs and due dates disciplined.",
      status: openTasks > 0 ? (overdueTasks > 0 ? "In progress" : "Ready") : scopedDeals.length > 0 ? "In progress" : "Needs setup",
      pillClass: openTasks > 0 ? (overdueTasks > 0 ? "traffic" : "success") : scopedDeals.length > 0 ? "info" : "blocked",
      tone: openTasks > 0 ? (overdueTasks > 0 ? "is-warn" : "is-good") : scopedDeals.length > 0 ? "is-warn" : "is-danger",
      cta: "Open Tasks",
    },
    {
      view: "campaigns",
      title: "Growth, Live & Handover",
      description: "Track launch readiness, handover discipline, and growth initiatives for active and expanding client accounts.",
      metricLabel: "Launch / live",
      metricValue: `${launchAccounts}`,
      nextAction:
        launchAccounts > 0
          ? `${liveCampaigns} growth campaigns are running against active launch or live accounts.`
          : "Create your first growth activation once an account reaches execution readiness.",
      status: launchAccounts > 0 ? "Ready" : activeAccounts > 0 ? "In progress" : "Needs setup",
      pillClass: launchAccounts > 0 ? "success" : activeAccounts > 0 ? "info" : "blocked",
      tone: launchAccounts > 0 ? "is-good" : activeAccounts > 0 ? "is-neutral" : "is-danger",
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
          ? `Review plan vs actual for ${currentYear} and close the remaining coverage gaps.`
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
  setLoadingState(true, "Reloading reference workbook", "Refreshing Cube One from your Excel reference files.");
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
        throw new Error(`No fue posible leer la base publicada (${publishedResponse.status}).`);
      }

      applyStatePayload(await publishedResponse.json());
      synchronizeTaskSequence();
      ensureActiveUser();
      resetWorkspaceForm();
      resetUserForm();
      serverMeta.workbookPath = "GitHub published workspace baseline";
      serverMeta.workbookUrl = STATIC_WORKBOOK_URL;
      serverMeta.ready = false;
      serverMeta.storageMode = "static";
      renderAll();
      setBanner(buildExcelBanner("Published GitHub workspace baseline restored."), "success");
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
        throw new Error(`No fue posible descargar la base publicada (${response.status}).`);
      }

      const payload = await response.text();
      downloadBlob(buildExportFilename("salesrep-published-workspace", "json"), payload, "application/json;charset=utf-8");
      setBanner("Published workspace baseline downloaded from GitHub Pages.", "success");
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
    setBanner("Excel upload requires the local/server deployment. The published GitHub app works from the online workspace baseline and needs a workbook backend for persistent updates.", "warn");
    return;
  }

  const safeName = String(file.name || "uploaded-workbook.xlsx");
  const lowerName = safeName.toLowerCase();
  if (lowerName.endsWith(".xls") && !lowerName.endsWith(".xlsx")) {
    setBanner("This upload requires a modern Excel workbook (.xlsx or .xlsm). Please resave the file and try again.", "danger");
    return;
  }
  setLoadingState(true, "Importing Excel", `Loading ${safeName} into Cube One and rebuilding the local workbook.`);

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
  const sheetMatches = meta.sheetMatches && typeof meta.sheetMatches === "object" ? Object.values(meta.sheetMatches).filter(Boolean) : [];
  const warnings = Array.isArray(meta.warnings) ? meta.warnings.filter(Boolean) : [];
  const mappingNote = sheetMatches.length ? ` Auto-mapped sheets: ${sheetMatches.join(", ")}.` : "";
  const warningNote = warnings.length ? ` Review: ${warnings[0]}.` : "";

  if (mode === "salesrep-workbook") {
    return `Excel imported: ${filename}. Loaded ${deals} deals, ${targets} targets, and ${intel} market intelligence records.${warningNote}`;
  }

  if (mode === "opportunities-source") {
    return `Source workbook imported: ${filename}. Refreshed ${deals} deals and ${targets} targets while preserving tasks, campaigns, users, and workspace settings.${mappingNote}${warningNote}`;
  }

  return `Excel imported: ${filename}. Cube One data has been refreshed.`;
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
  if (serverMeta.storageMode === "session") {
    return `${message} Online workspace loaded. Changes stay in this session until a server-backed workbook is connected.`;
  }
  if (serverMeta.storageMode === "static") {
    return `${message} Published GitHub workspace baseline loaded from the online source of truth.`;
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

function cleanMultilineText(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter((line, index, lines) => line || (index > 0 && index < lines.length - 1))
    .join("\n")
    .trim();
}

function normalizeSearchText(value) {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenizeSearchQuery(value) {
  return normalizeSearchText(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
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

function getDealOperationalStage(deal = {}) {
  return inferDealStage({
    ...deal,
    agreement: normalizeContractStatus(deal.agreement || deal.legalStatus),
    ddStatus: normalizeProgressStatus(deal.ddStatus),
    integrationStatus: normalizeProgressStatus(deal.integrationStatus),
    goLiveStatus: normalizeGoLiveStatus(deal.goLiveStatus),
  });
}

function getVisibleStage(stage) {
  const normalizedStage = normalizeDealStage(stage) || "Lead";
  return normalizedStage === "Qualified" ? "Lead" : normalizedStage;
}

function getDealVisibleStage(deal = {}) {
  return getVisibleStage(getDealOperationalStage(deal));
}

function inferDealStage(input = {}) {
  const normalizedStage = normalizeDealStage(input.stage);
  const rawStage = cleanText(input.stage).toLowerCase();
  const rawStatus = cleanText(input.status).toLowerCase();
  const agreement = normalizeContractStatus(input.agreement || input.legalStatus);
  const ddStatus = normalizeProgressStatus(input.ddStatus);
  const integrationStatus = normalizeProgressStatus(input.integrationStatus);
  const goLiveStatus = normalizeGoLiveStatus(input.goLiveStatus);
  const normalizedStatusStage = normalizeDealStage(input.status);

  if (normalizedStage === "Handover" || normalizedStatusStage === "Handover" || rawStatus === "handover" || cleanText(input.handover)) {
    return "Handover";
  }
  if (normalizedStage === "Live" || normalizedStatusStage === "Live" || rawStatus === "live" || cleanText(input.liveSince) || goLiveStatus === "Live") {
    return "Live";
  }
  if (normalizedStage === "Go Live" || normalizedStatusStage === "Go Live" || rawStatus === "go live" || rawStatus === "go-live") {
    return "Go Live";
  }
  if (
    normalizedStage === "Legal Approval" ||
    normalizedStatusStage === "Legal Approval" ||
    ["approval", "legal approval", "signoff", "sign off"].includes(rawStatus) ||
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
    normalizedStatusStage === "Integration" ||
    ["Started", "In Progress"].includes(integrationStatus) ||
    input.integrationStartedFlag ||
    ["integration", "onboarding"].includes(rawStatus)
  ) {
    return "Integration";
  }
  if (
    normalizedStage === "DD" ||
    normalizedStatusStage === "DD" ||
    ["Started", "In Progress", "Completed"].includes(ddStatus) ||
    input.ddStartedFlag ||
    input.ddCompletedFlag ||
    rawStatus === "dd"
  ) {
    return "DD";
  }
  if (
    normalizedStage === "Legal" ||
    normalizedStatusStage === "Legal" ||
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
    normalizedStatusStage === "Proposal" ||
    ["offer", "proposal"].includes(rawStatus) ||
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
