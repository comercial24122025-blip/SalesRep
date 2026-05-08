# Revenue Execution System - Airtable Build

This is the implementation blueprint for building the commercial revenue operating system in Airtable. It is structured for a real team workflow: pipeline control, daily actions, SLA pressure, DD/integration gates, and post-go-live revenue management.

## Base Name

`Revenue Execution System`

## Operating Model

The system has five connected layers:

- Workflow: Deals move through controlled revenue stages.
- Action system: Every open item has an owner, due date, priority, and status.
- Notifications: SLA alerts and task reminders create urgency.
- Interface: Leaders get command-center visibility; users get daily work queues.
- Revenue layer: Pipeline, forecast, accounts, growth, and product penetration are tracked together.

## 1. Tables

### Deals

Primary pipeline table. One record per commercial opportunity or operator onboarding.

| Field | Type | Options / Formula |
| --- | --- | --- |
| Deal ID | Autonumber | Prefix display as `DEAL-0000` in interfaces if desired |
| Deal Name | Single line text | Recommended primary field |
| Operator Name | Single line text |  |
| Market | Single select | Peru, Mexico, Venezuela, Brazil, Colombia, Chile, Argentina, Other |
| Stage | Single select | Lead, Proposal, Legal, DD, Integration, Go Live, Live, Handover |
| Deal Value USD | Currency | 0 decimals |
| Estimated Monthly Revenue | Currency | 0 decimals |
| Product Mix | Multiple select | Live, RNG, Slots |
| Owner BD | Collaborator |  |
| Owner KAM | Collaborator |  |
| Tech Owner | Collaborator |  |
| Stage Entry Date | Date | Required for SLA reporting |
| Days in Stage | Formula | `DATETIME_DIFF(TODAY(), {Stage Entry Date}, 'days')` |
| Next Action | Single line text | Current next step summary |
| Action Owner | Collaborator | Mirrors active owner for the next action |
| Action Due Date | Date | Used for urgency badges |
| Risk Level | Single select | Healthy, At Risk, Stuck |
| Contract Uploaded | Checkbox | Required before Legal to DD |
| API Ready | Checkbox | Required before Integration to Go Live |
| DD Status Rollup | Rollup from DD | Latest DD status |
| Open Actions | Count linked Actions | Filter status is not Done |
| Close Probability | Formula | Uses stage, value, market, and aging |
| Weighted Forecast | Formula | `{Deal Value USD} * {Close Probability}` |
| Gate Status | Formula | Shows whether the current stage can advance |

#### Close Probability Formula

```airtable
MIN(
  1,
  SWITCH(
    {Stage},
    'Lead', 0.12,
    'Proposal', 0.35,
    'Legal', 0.52,
    'DD', 0.68,
    'Integration', 0.82,
    'Go Live', 0.95,
    'Live', 1,
    'Handover', 1,
    0.1
  )
  + IF({Market} = 'Mexico', 0.04, 0)
  + IF({Market} = 'Brazil', 0.04, 0)
  + IF({Deal Value USD} >= 100000, 0.03, 0)
  - IF({Days in Stage} > 45, 0.12, 0)
  - IF({Risk Level} = 'Stuck', 0.18, 0)
)
```

#### Gate Status Formula

```airtable
SWITCH(
  {Stage},
  'Legal',
    IF(AND({Deal Value USD}, {Contract Uploaded}), 'Ready for DD', 'Missing deal value or contract'),
  'DD',
    IF({DD Status Rollup} = 'Approved', 'Ready for Integration', 'DD approval required'),
  'Integration',
    IF({API Ready}, 'Ready for Go Live', 'API readiness required'),
  'Ready'
)
```

### Actions

Task engine for daily execution.

| Field | Type | Options / Formula |
| --- | --- | --- |
| Action ID | Autonumber |  |
| Deal | Link to Deals | One action can belong to one deal |
| Description | Long text |  |
| Owner | Collaborator |  |
| Due Date | Date |  |
| Status | Single select | Open, Done |
| Priority | Single select | High, Medium, Low |
| Days Overdue | Formula | `IF(AND({Status} != 'Done', {Due Date} < TODAY()), DATETIME_DIFF(TODAY(), {Due Date}, 'days'), 0)` |
| Urgency | Formula | Overdue, Due Today, Upcoming, Done |

#### Urgency Formula

```airtable
IF(
  {Status} = 'Done',
  'Done',
  IF(
    {Due Date} < TODAY(),
    'Overdue',
    IF({Due Date} = TODAY(), 'Due Today', 'Upcoming')
  )
)
```

### DD

Due diligence control table.

| Field | Type | Options / Formula |
| --- | --- | --- |
| Deal | Link to Deals |  |
| Financial Check | Checkbox |  |
| License Verified | Checkbox |  |
| Risk Score | Single select | Low, Medium, High |
| DD Status | Single select | Pending, Approved, Rejected |
| DD Start Date | Date |  |
| DD End Date | Date |  |
| DD Days Open | Formula | `IF({DD End Date}, DATETIME_DIFF({DD End Date}, {DD Start Date}, 'days'), DATETIME_DIFF(TODAY(), {DD Start Date}, 'days'))` |
| DD Gate Ready | Formula | Requires checks, risk score, and approval |

### Integrations

Technical delivery and launch-readiness tracker.

| Field | Type | Options / Formula |
| --- | --- | --- |
| Deal | Link to Deals |  |
| Operator | Lookup from Deals | Operator Name |
| Tech Contact | Single line text |  |
| API Ready | Checkbox |  |
| Integration Status | Single select | Not Started, In Progress, Testing, Completed |
| Integration Start Date | Date |  |
| Days in Integration | Formula | `DATETIME_DIFF(TODAY(), {Integration Start Date}, 'days')` |
| Weekly Status Update | Long text |  |
| Risk Level | Single select | Healthy, At Risk, Stuck |
| Launch Gate | Formula | Requires API Ready and Completed status |

### Accounts

Post-go-live revenue table.

| Field | Type | Options / Formula |
| --- | --- | --- |
| Operator Name | Single line text |  |
| Market | Single select | Same market options as Deals |
| Go Live Date | Date |  |
| Linked Deal | Link to Deals |  |
| Monthly Revenue | Currency | 0 decimals |
| Revenue Last Month | Currency | 0 decimals |
| Growth % | Formula | `IF({Revenue Last Month} = 0, BLANK(), ({Monthly Revenue} - {Revenue Last Month}) / {Revenue Last Month})` |
| Active Products | Multiple select | Live, RNG, Slots |
| Product Penetration % | Percent | Manual or formula against target product count |
| KAM Owner | Collaborator |  |

## 2. Views

### Deals Views

- `Command Center - All Deals`: Grid sorted by Risk Level, Stage, Days in Stage.
- `Pipeline Kanban`: Kanban grouped by Stage; show Deal Name, Deal Value USD, Days in Stage, Risk Level, Next Action.
- `At Risk Deals`: Filter Risk Level is At Risk or Stuck.
- `Legal SLA Watch`: Stage is Legal and Days in Stage greater than 20.
- `DD SLA Watch`: Stage is DD and Days in Stage greater than 35.
- `Go Lives This Month`: Stage is Go Live or Live, filtered to current month.

### Actions Views

- `My Tasks`: Owner is current user, Status is not Done.
- `Overdue`: Status is not Done and Due Date is before today.
- `Due Today`: Status is not Done and Due Date is today.
- `Upcoming`: Status is not Done and Due Date is after today.

### Integrations Views

- `Integration Tracker`: Sorted by Days in Integration descending.
- `Integration SLA Watch`: Days in Integration greater than 45 and status is not Completed.
- `Testing Queue`: Integration Status is Testing.

### Accounts Views

- `Account Performance`: Grid sorted by Monthly Revenue descending.
- `Growth Watch`: Growth % below 0 or Product Penetration % below 50%.

## 3. Automations

### SLA Alerts

Create three Airtable automations with a scheduled trigger or record-matches-condition trigger.

| Automation | Trigger | Action |
| --- | --- | --- |
| Legal SLA Alert | Deals where Stage = Legal and Days in Stage > 20 | Send Slack/email to Owner BD and Sales Ops |
| DD SLA Alert | Deals where Stage = DD and Days in Stage > 35 | Send Slack/email to Owner BD and DD owner |
| Integration SLA Alert | Integrations where Days in Integration > 45 and Integration Status is not Completed | Send Slack/email to Tech Owner and RevOps |

### Daily Action Reminder

Trigger: Every weekday at 9:00 AM.

Find records:

- Actions where Status is not Done and Due Date is before today.
- Actions where Status is not Done and Due Date is today.

Send one digest to each owner with:

- Overdue actions first.
- Due today second.
- Linked deal.
- Direct Airtable record link.

### Stage Control

Airtable cannot truly block every manual field update unless you use permissions or an automation that reverts invalid movement. Use the `Gate Status` formula and a locked interface workflow:

- Legal to DD requires Deal Value USD and Contract Uploaded.
- DD to Integration requires DD Status Rollup = Approved.
- Integration to Go Live requires API Ready = checked.

Recommended enforcement:

- Limit direct grid editing for sales users.
- Move stage changes through an Interface button or automation.
- Use the included stage-control script as the validation logic.

## 4. Interfaces

### Command Center

Executive revenue cockpit.

Widgets:

- KPI: Deals in Legal.
- KPI: DD Completed.
- KPI: Integrations Active.
- KPI: Go Lives this month.
- KPI: Weighted Forecast.
- Chart: Pipeline value per stage.
- Chart: Close probability by market.
- List: Deals at risk.
- List: SLA alerts.

### Pipeline

Kanban grouped by Stage.

Card fields:

- Deal Name.
- Deal Value USD.
- Estimated Monthly Revenue.
- Days in Stage.
- Risk Level.
- Next Action.
- Action Due Date.

### My Tasks

Personal execution queue.

Sections:

- Overdue.
- Due Today.
- Upcoming.

Primary actions:

- Mark Done.
- Update due date.
- Open linked deal.
- Add next action.

### Integration Tracker

Delivery control view.

Sort:

- Days in Integration descending.

Show:

- Operator.
- Tech Contact.
- API Ready.
- Integration Status.
- Weekly Status Update.
- Risk Level.

### Account Performance

Post-live revenue management.

Charts:

- Revenue per account.
- Growth trend.
- Product penetration.
- KAM-owned book of business.

## 5. Daily Usage Flow

### BD

- Open My Tasks.
- Clear overdue and due-today actions.
- Update next action on every active deal.
- Move pipeline only when the gate status is ready.

### Tech

- Open Integration Tracker.
- Update weekly status on active integrations.
- Mark API readiness.
- Escalate integrations over 45 days.

### KAM

- Open Account Performance.
- Monitor monthly revenue and growth.
- Add upsell actions where product penetration is low.
- Own Handover and Live follow-up actions.

### RevOps

- Own SLA alerts.
- Review Command Center daily.
- Audit missing owners, missing dates, and stuck deals weekly.

## 6. Build Order

1. Create the five tables and field types.
2. Import the CSV templates from `airtable/templates`.
3. Add formulas and linked-record fields.
4. Create views.
5. Build interfaces in this order: Command Center, Pipeline, My Tasks, Integration Tracker, Account Performance.
6. Add automations.
7. Lock down editing permissions.
8. Run the first weekly RevOps audit.

## 7. Outcome

This base becomes the operating layer for revenue execution:

- Pipeline control.
- Action accountability.
- SLA enforcement.
- Revenue tracking.
- Forecast visibility.
- Post-live account growth.

It is no longer a tracker. It is a revenue execution system.
