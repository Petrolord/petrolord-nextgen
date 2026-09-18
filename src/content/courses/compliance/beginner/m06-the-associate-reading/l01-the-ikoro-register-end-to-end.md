# The Ikoro register end to end

This lesson reads the whole IKORO obligation register at once, as a compliance lead would at the start of a working day, using everything the tier has taught. Every figure is the engine's, at the as-of date of 2026-10-15.

## The register, worst first

| order | code | obligation | status | next action date | days until |
| --- | --- | --- | --- | --- | --- |
| 1 | REG-2026-005 | Radioactive source licence | Expired | 2026-09-30 | -15 |
| 2 | REG-2026-007 | Oil spill contingency plan notification | Overdue | 2026-09-01 | -44 |
| 3 | REG-2026-002 | Monthly produced water quality return | Overdue | 2026-10-10 | -5 |
| 4 | REG-2026-012 | Annual concession rental | Due soon | 2026-11-09 | 25 |
| 5 | REG-2026-001 | Produced water discharge permit | Due soon | 2026-11-20 | 36 |
| 6 | REG-2026-003 | Quarterly flare and venting return | On track | 2026-10-31 | 16 |
| 7 | REG-2026-004 | Annual environmental monitoring report | On track | 2027-03-31 | 167 |
| 8 | REG-2026-006 | Pipeline right of way consent | Compliant | 2026-08-14 | -62 |
| 9 | REG-2026-008 | Host community development report | Compliant | 2027-01-31 | 108 |
| 10 | REG-2026-013 | Waste consignment register | No date set | none | none |
| 11 | REG-2026-010 | Safety case resubmission | Draft | 2027-06-30 | 258 |
| 12 | REG-2026-009 | Original environmental impact approval | Superseded | 2025-01-06 | -647 |
| 13 | REG-2026-011 | Night noise permit | Not applicable | 2026-05-01 | -167 |

{{panel:compliance-register-explorer}}

## The top five: attention

summarise counts Expired 1, Overdue 2 and Due soon 2, and prints an attention count of 5. Those five rows are the day's work.

The radioactive source licence is first. Its expiry, 2026-09-30, has passed, and explainStatus says "The permit expired 15 days ago." Its due date of 2026-12-31 is still ahead and does not rescue it. The expiry drives the status, and Expired heads the severity list.

The contingency plan notification and the water quality return are both Overdue. The notification is a One-off with nothing filed, 44 days past due. The return was last filed on 2026-09-09, and its current period starts on 2026-09-10, so that filing counts for the period before. The return for this period is late, and its reason says "The due date passed 5 days ago." The notification sits above the return because its next action date is the nearer one.

The concession rental is Due soon at 25 days. Its lead time is null, so the default of 30 days applies, and the reason names that 30. The discharge permit is Due soon at 36 days, inside the 60 day lead time set for it, and its next action date is its expiry, 2026-11-20. Its due date, 2027-03-31, reads 167 days away on another row. A reader who counted to the due date would miss the permit lapsing.

## The middle: in hand

The flare return and the monitoring report are On track. Each has a filing on the record, and each filing belongs to an earlier period, so the work for the current period is still to do. The monitoring report's filing is dated 2026-03-30, one day before its period starts on 2026-03-31.

The right of way consent and the community development report are Compliant. The consent is a filed One-off, and its reason says nothing further is due. The community report has a filing, 2026-08-05, inside its current period.

## The bottom: nothing to count down

The waste consignment register has no due date and no expiry, and reads No date set: somebody has to find out when it is due. The safety case resubmission is Draft, the original approval Superseded and the night noise permit Not applicable. Their days until are printed, and their lifecycle keeps them out of the countdown.

## By regime

countBy regime counts the obligations by regime: Environmental 5, Reporting 3, Health & Safety 2, Licensing 1, Operational 1 and Financial 1. The digest prints these counts without saying which obligation carries which regime, so this lesson does not assign them. Read them as the shape of the register: the areas of the operation its obligations come from, and the spread of work the compliance lead answers for.

## Exercise

From the sorted register, read the attention count summarise prints and name the five obligations behind it. For the discharge permit, read the next action date, its days until and the due date, and say which of the two dates drives its status. Then read the two On track rows and say what their last filings have in common.
