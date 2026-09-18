# The period a filing belongs to

A recurring obligation is due again and again, and each filing discharges one period. So the question the engine has to answer about a filing is which period it belongs to. Owner decision AS15 Q2 sets the rule: evidence counts towards Compliant only for the current period. This lesson shows where the current period starts.

## One frequency back from the next due date

The current period ends on the next due date and starts one frequency before it. The engine's periodStart computes that start, pulling it back to the last day of the month when that month is shorter. For a due date of 2026-10-31, read at the as-of date of 2026-10-15:

| frequency | periodStart | days until the period start |
| --- | --- | --- |
| One-off | none | none |
| Monthly | 2026-09-30 | -15 |
| Quarterly | 2026-07-31 | -76 |
| Semi-annual | 2026-04-30 | -168 |
| Annual | 2025-10-31 | -349 |
| Biennial | 2024-10-31 | -714 |
| Other | none | none |

{{panel:compliance-register-explorer}}

A monthly obligation due 2026-10-31 has a current period starting 2026-09-30, and a quarterly one starting 2026-07-31. Two of those starts show the month end rule at work. September and April have no thirty-first, so the monthly start lands on 2026-09-30 and the semi-annual start on 2026-04-30.

One-off and Other have no period. A One-off is due once, so there is nothing to step back by. Other names no fixed interval, and periodStart gives none for it. Module four returns to both.

## Five IKORO filings read against their periods

Each row is an IKORO obligation as recorded, with its period start and its last filing:

| code | frequency | due | periodStart | last filed | status |
| --- | --- | --- | --- | --- | --- |
| REG-2026-003 | Quarterly | 2026-10-31 | 2026-07-31 | 2026-07-28 | On track |
| REG-2026-004 | Annual | 2027-03-31 | 2026-03-31 | 2026-03-30 | On track |
| REG-2026-008 | Semi-annual | 2027-01-31 | 2026-07-31 | 2026-08-05 | Compliant |
| REG-2026-012 | Annual | 2026-11-09 | 2025-11-09 | 2025-11-03 | Due soon |
| REG-2026-002 | Monthly | 2026-10-10 | 2026-09-10 | 2026-09-09 | Overdue |

Only one of the five has a filing that counts. The host community development report, REG-2026-008, was filed on 2026-08-05 in a period that starts on 2026-07-31. The filing is inside the period, and the obligation reads Compliant.

For the other four, the last filing falls before the period start, which puts it in the period that came earlier. The quarterly flare return was filed on 2026-07-28 and its period starts on 2026-07-31. The monthly water quality return was filed on 2026-09-09 and its period starts on 2026-09-10. Each of those filings discharged the previous period, and none of them counts for this one. The status each obligation carries is then read from its dates as if nothing had been filed: On track for the two with time left and outside their windows, Due soon for the rental inside its window, and Overdue for the water quality return whose due date has passed.

## Why the period matters

A register that counted any filing ever made would read Compliant for every obligation filed even once. The annual concession rental was paid on 2025-11-03. That payment covered last year's rental. This year's is due 2026-11-09, and the register says Due soon because nothing has been paid for it yet. Tying a filing to the period it falls in is what lets the register say that.

The period start is a date the engine derives from the due date and the frequency. Nobody types it. When the due date rolls forward the period moves with it, and a filing that counted for one period stops counting once the next period opens.

## Exercise

For REG-2026-008 and REG-2026-003, read the period start and the last filed date. Say which filing falls inside its current period and which falls before it, and quote the status each obligation carries. Then read REG-2026-012's last filed date, period start and status, and say what the register is telling the reader about this year's rental.
