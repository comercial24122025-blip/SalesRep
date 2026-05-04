# Sales Execution System - UI Wireframe

This wireframe redesigns the system as a daily revenue execution cockpit for BD, KAM, Tech, RevOps, and leadership. The UI is intentionally operational: every screen should drive a decision, an action, or a stage movement.

## 1. Product Positioning

### System Purpose

This is not a passive CRM. It is a Revenue Execution Platform designed to:

- Control pipeline velocity.
- Enforce stage discipline.
- Make SLA risk visible.
- Align BD, KAM, Tech, Legal, DD, and RevOps.
- Track revenue after Go Live.
- Prevent deals from silently stalling.

### Primary User Jobs

| User | Daily Job |
| --- | --- |
| BD | Move active opportunities forward and clear next actions |
| Tech | Keep integrations updated and unblock launch readiness |
| KAM | Grow live accounts and manage post-Go-Live revenue |
| RevOps | Monitor SLA breaches, data quality, and execution hygiene |
| Leadership | Review pipeline value, forecast, risk, and go-live progress |

## 2. Global Layout

```text
+--------------------------------------------------------------------------------+
| Top Nav: Dashboard | Pipeline | Deals | Accounts | Integrations | Analytics | Admin |
+----------------------+---------------------------------------------------------+
| Filters              | Main Workspace                                          |
|                      |                                                         |
| Market               | Screen-specific command header                          |
| Stage                | KPI / action / chart / table surface                    |
| Owner                |                                                         |
| Product              |                                                         |
| Risk Level           |                                                         |
| Due Window           |                                                         |
+----------------------+---------------------------------------------------------+
```

### Top Navigation

- Dashboard
- Pipeline
- Deals
- Accounts
- Integrations
- Analytics
- Admin

### Persistent Sidebar Filters

- Market: Peru, Mexico, Venezuela, Brazil, Colombia, Chile, Argentina, Other.
- Stage: Lead, Proposal, Legal, DD, Integration, Go Live, Live, Handover.
- Owner: BD, KAM, Tech Owner.
- Product: Live, RNG, Slots.
- Risk Level: Healthy, At Risk, Stuck.
- Due Window: Overdue, Due Today, This Week, This Month.

### Global Header Behavior

Every main screen should show:

- Page title.
- Current filtered scope.
- Primary action button.
- Export or share action where relevant.
- Last sync timestamp.

## 3. Dashboard - Command Center

### Purpose

Leadership and RevOps use this screen to understand the execution picture in less than one minute.

```text
+--------------------------------------------------------------------------------+
| Dashboard                                                         Last synced   |
| Revenue command center                          [Create Deal] [Export Snapshot] |
+--------------------------------------------------------------------------------+
| New Deals           | DD Completed       | Integrations Active | Go Lives Qtr   |
| 12 / 15 target      | 8                  | 6                   | 4              |
+--------------------------------------------------------------------------------+
| Pipeline Value by Stage                         | Execution Alerts             |
| [bar chart]                                     | Red: Legal > 20d             |
| Lead       $$$                                  | Yellow: DD > 30d             |
| Proposal   $$$$                                 | Red: Integration > 45d       |
| Legal      $$$                                  |                               |
| DD         $$$$$                                | [Open Risk Queue]            |
+--------------------------------------------------------------------------------+
| Upcoming Go Lives                              | Deals At Risk                 |
| [30-60 day timeline]                           | Operator | Stage | Owner | SLA |
+--------------------------------------------------------------------------------+
```

### Top KPI Cards

- New Deals: actual vs target.
- DD Completed.
- Integrations Active.
- Go Lives This Quarter.

### Alerts Panel

Grouped by severity:

- Stuck Deals: Legal > 20 days, DD > 35 days, Integration > 45 days.
- Upcoming Breaches: within five days of SLA.
- Missing Data: no owner, no next action, no stage entry date.

### Bottom Blocks

- Pipeline Value by Stage: horizontal bar chart.
- Upcoming Go Lives: 30 to 60 day timeline.
- Deals at Risk: compact table with owner and next action.
- Revenue Watch: live accounts with negative growth or low product penetration.

### Primary Actions

- Create Deal.
- Open Risk Queue.
- Send Weekly Summary.
- Export Snapshot.

## 4. Pipeline - Kanban

### Purpose

BD and RevOps use this screen to control movement through the commercial funnel.

```text
+--------------------------------------------------------------------------------+
| Pipeline                                     [New Deal] [Bulk Update] [Export]  |
| 74 deals | $4.2M pipeline | 11 at risk | 6 overdue actions                     |
+--------------------------------------------------------------------------------+
| Lead      | Proposal  | Legal     | DD        | Integration | Go Live | Live    |
|-----------|-----------|-----------|-----------|-------------|---------|---------|
| Card      | Card      | Card      | Card      | Card        | Card    | Card    |
| Card      | Card      | Card      | Card      | Card        | Card    | Card    |
+--------------------------------------------------------------------------------+
```

### Columns

- Lead
- Proposal
- Legal
- DD
- Integration
- Go Live
- Live
- Handover

### Deal Card

Each card should show only execution-critical information:

```text
+--------------------------------+
| Operator Name                  |
| Peru | $120k | Legal           |
| 18d in stage        At Risk    |
| Next: Upload signed contract   |
| Owner: Maria      Due: May 6   |
+--------------------------------+
```

### Card Fields

- Operator Name.
- Market.
- Deal Value.
- Stage.
- Days in Stage.
- Risk Level.
- Next Action.
- Action Due Date.
- Owner.

### Interactions

- Drag card to next stage.
- Click card to open deal detail drawer.
- Stage movement checks mandatory gate fields.
- Invalid moves show a blocking message with missing requirements.
- Quick action menu: Add Action, Change Owner, Mark Risk, Open Deal.

### Stage Gate Rules

| Move | Required Before Move |
| --- | --- |
| Legal to DD | Deal Value, Contract Uploaded |
| DD to Integration | DD Status = Approved, Risk Score completed |
| Integration to Go Live | API Ready, Integration Status = Completed |
| Go Live to Live | Launch Date, Products Enabled |
| Live to Handover | KAM Owner assigned, handover notes completed |

## 5. Deal Detail

### Purpose

Single source of truth for a deal, combining commercial status, stage gates, execution actions, and post-live revenue.

```text
+--------------------------------------------------------------------------------+
| AndesBet                         Peru | $120k | Legal | Owner: Maria           |
| Risk: At Risk                    18 days in stage        [Advance Stage]        |
+--------------------------------------------------------------------------------+
| Tabs: Overview | Legal | DD | Integration | Go Live | Revenue | Activity       |
+--------------------------------------------------------------------------------+
| Selected tab content                                                              |
+--------------------------------------------------------------------------------+
```

### Header

- Operator Name.
- Market.
- Deal Value.
- Current Stage.
- Owner BD.
- Owner KAM.
- Tech Owner.
- Risk Level.
- Days in Stage.
- Advance Stage button.

### Overview Tab

- Stage progression timeline.
- Current gate status.
- Next action.
- Open actions.
- Key contacts.
- Notes.
- Recent activity.

### Legal Tab

- Contract status.
- Contract uploaded.
- Legal owner.
- Legal start date.
- SLA timer: 20 days.
- Missing requirements checklist.
- Documents list.

### DD Tab

- Financial check.
- License verification.
- Risk score.
- DD status.
- DD start date.
- DD end date.
- SLA timer: 35 days.
- Approval notes.

### Integration Tab

- Tech contact.
- Tech owner.
- API readiness.
- Integration status.
- Integration start date.
- Days in integration.
- SLA timer: 45 days.
- Weekly status update.
- Technical blockers.

### Go Live Tab

- Launch date.
- Products enabled.
- Launch checklist.
- Go-live owner.
- Post-launch QA status.
- Move to Live button.

### Revenue Tab

- Monthly revenue.
- Revenue last month.
- Growth percentage.
- Active products.
- Product penetration.
- Upsell opportunities.
- Linked account.

### Activity Tab

- Actions created.
- Stage changes.
- Owner changes.
- Notes.
- Automation alerts.

## 6. Deals - List View

### Purpose

Fast search, bulk edits, and operational cleanup.

```text
+--------------------------------------------------------------------------------+
| Deals                                           [Create Deal] [Import] [Export] |
+--------------------------------------------------------------------------------+
| Search operator, market, owner, contact, ticket                                  |
+--------------------------------------------------------------------------------+
| Operator | Market | Stage | Value | Owner | Risk | Days | Next Action | Due     |
+--------------------------------------------------------------------------------+
```

### Required Views

- All Active Deals.
- Missing Owner.
- Missing Next Action.
- Stuck Deals.
- Legal Queue.
- DD Queue.
- Integration Queue.
- Go Lives This Month.

## 7. Integrations

### Purpose

Tech and RevOps use this screen to keep launch execution moving.

```text
+--------------------------------------------------------------------------------+
| Integration Tracker                              [Add Update] [Export]          |
| 6 active | 2 delayed | Avg 31 days                                            |
+--------------------------------------------------------------------------------+
| Operator | Market | Stage | Tech Owner | Days | Risk | Weekly Update | API     |
+--------------------------------------------------------------------------------+
```

### Table Columns

- Operator.
- Market.
- Integration Stage.
- Tech Owner.
- Days in Integration.
- Risk Level.
- API Ready.
- Weekly Status Update.
- Last Updated.

### Required Behavior

- Weekly Status Update is mandatory for active integrations.
- Rows older than seven days without update are flagged.
- Integrations over 45 days are marked delayed.
- Testing and blocked rows appear at the top.

### Primary Actions

- Add weekly update.
- Mark API ready.
- Escalate blocker.
- Move to Go Live.

## 8. Accounts - KAM View

### Purpose

KAMs use this screen to manage live revenue, product penetration, and growth actions.

```text
+--------------------------------------------------------------------------------+
| Accounts                                        [Create Upsell Action] [Export] |
| $420k monthly revenue | 8 accounts declining | 14 upsell opportunities          |
+--------------------------------------------------------------------------------+
| Account cards / table                                                               |
+--------------------------------------------------------------------------------+
```

### Account Card

```text
+--------------------------------+
| Operator Name                  |
| Mexico | Live since Apr 2026   |
| Monthly Revenue: $42k          |
| Growth: +11%                   |
| Products: Live, Slots          |
| Penetration: 67%               |
+--------------------------------+
```

### Account Detail

KPIs:

- Monthly revenue.
- Revenue trend.
- Growth percentage.
- Product penetration.
- Player activity.
- Active products.

Actions:

- Create upsell action.
- Create cross-sell action.
- Schedule KAM review.
- Add revenue note.

Required Views:

- All Live Accounts.
- Negative Growth.
- Low Product Penetration.
- Upsell Queue.
- KAM Book.

## 9. Analytics

### Purpose

RevOps and leadership use this screen to inspect performance patterns, not individual deals.

```text
+--------------------------------------------------------------------------------+
| Analytics                                      [Month] [Quarter] [Market]       |
+--------------------------------------------------------------------------------+
| Pipeline Coverage | Stage Conversion | Avg Days vs SLA | Revenue Growth         |
+--------------------------------------------------------------------------------+
| Chart grid                                                                      |
+--------------------------------------------------------------------------------+
```

### Metric Groups

Pipeline Metrics:

- Coverage ratio.
- Pipeline value by stage.
- Conversion rate per stage.
- Weighted forecast.

Time Metrics:

- Average days per stage.
- SLA breach count.
- Legal aging.
- DD aging.
- Integration aging.

Revenue Metrics:

- Revenue per account.
- Growth rate.
- Revenue by market.
- Product penetration.

Operational Metrics:

- Integration delays.
- Go Live success rate.
- Overdue actions.
- Deals without next action.

## 10. Admin

### Purpose

RevOps configures system controls, users, SLAs, markets, and required fields.

### Sections

- Users and roles.
- Markets.
- Products.
- Stage definitions.
- SLA settings.
- Required fields by stage.
- Automation recipients.
- Data quality rules.

### Roles

| Role | Access |
| --- | --- |
| Leadership | Read all dashboards and analytics |
| RevOps | Full operational admin |
| BD | Create and update deals, actions, pipeline fields |
| Tech | Update integrations and technical fields |
| KAM | Update accounts, revenue, and post-live actions |
| Viewer | Read-only |

## 11. Notification Center

### Purpose

Centralized urgency queue for the whole system.

### Alert Types

- SLA breached.
- SLA nearing breach.
- Action overdue.
- Action due today.
- Missing owner.
- Missing next action.
- Integration update missing.
- Revenue decline.

### Alert Card

```text
+-----------------------------------------------+
| Legal SLA breached                             |
| AndesBet | Legal | 24d | Owner: Maria          |
| Missing: Contract Uploaded                     |
| [Open Deal] [Create Action] [Snooze]           |
+-----------------------------------------------+
```

## 12. Mobile Behavior

Mobile should focus on quick checks and updates, not heavy analysis.

### Mobile Navigation

- Dashboard.
- My Tasks.
- Pipeline.
- Alerts.
- Search.

### Mobile Priority Actions

- Mark task done.
- Add note.
- Update next action.
- Change risk level.
- Add weekly integration update.
- Open account.

## 13. UX Rules

- Key actions should be reachable in three clicks or fewer.
- Every active deal must show a next action.
- Risk color must be consistent across the product.
- Tables should prioritize action fields, not archival data.
- Dashboards should show exceptions first.
- Stage movement should feel fast when requirements are met and clear when blocked.
- Detail pages should separate commercial, legal, DD, integration, launch, and revenue context.
- Mobile should avoid dense charts and prioritize queues.

## 14. Future Enhancements

- AI deal scoring.
- AI-generated weekly deal summaries.
- Revenue forecasting model.
- Automated follow-up suggestions.
- Provider integration status sync.
- Slack and email notification digest.
- Forecast scenario planning.
- Account health scoring.

## Final Product Shape

The final product should feel like an operating cockpit:

- Dashboard tells leadership what needs attention.
- Pipeline tells BD what must move.
- Deal detail tells teams what is blocking progress.
- Integrations tells Tech what must be updated.
- Accounts tells KAM where revenue is growing or leaking.
- Analytics tells RevOps where the system is slowing down.

The goal is simple: make revenue execution visible, controlled, and actionable every day.
