# Nine statuses, worst first

An obligation in the Regulatory Compliance app carries one status at a time, and that status comes from a fixed list of nine words. The list is ordered. Its first word is the worst thing an obligation can be and its last is the least urgent, and that order is how the register decides what you see first.

## The list

complianceStatus.STATUS_SEVERITY holds the nine words worst first. Beside each one is the number of IKORO obligations carrying it at the as-of date, 2026-10-15, from the engine's summarise over all 13 of them:

| position | status | IKORO obligations |
| --- | --- | --- |
| first | Expired | 1 |
| second | Overdue | 2 |
| third | Due soon | 2 |
| fourth | On track | 2 |
| fifth | Compliant | 2 |
| sixth | No date set | 1 |
| seventh | Draft | 1 |
| eighth | Superseded | 1 |
| ninth | Not applicable | 1 |

Every one of the nine words is carried by at least one IKORO obligation at 2026-10-15, so this one register shows every status the app can show. The counts are the engine's own, read from the records and never typed.

{{panel:compliance-register-explorer}}

## Three words need attention

The first three words are special. complianceStatus.ATTENTION_STATUSES holds Expired, Overdue and Due soon, and the engine's summarise counts them together. For IKORO at 2026-10-15 that attention count is 5. Those are the obligations somebody has to act on now: a permit that has lapsed, obligations whose due dates have passed, and obligations inside their warning window.

The next two words describe obligations that are in hand. On track means a due date is ahead and outside the warning window. Compliant means the obligation has been met for the period it is in. The two are different words for different situations, and module two's last lesson is given to the difference.

The last four words describe obligations the register is not counting down. No date set is an obligation with nothing to count to. Draft, Superseded and Not applicable come from the obligation's lifecycle, and the next lesson explains them.

## Sorted worst first

The register's own list is sorted by byUrgency. It puts the worst status first, then, among obligations with the same status, the nearest next action date first, and undated rows last. At the as-of date the first five rows of the IKORO register read:

| order | code | status | next action date |
| --- | --- | --- | --- |
| 1 | REG-2026-005 | Expired | 2026-09-30 |
| 2 | REG-2026-007 | Overdue | 2026-09-01 |
| 3 | REG-2026-002 | Overdue | 2026-10-10 |
| 4 | REG-2026-012 | Due soon | 2026-11-09 |
| 5 | REG-2026-001 | Due soon | 2026-11-20 |

Look at the second and third rows. Both are Overdue, and REG-2026-007 comes first because its next action date is the nearer of the two. Now look at the first row. REG-2026-005 is Expired, and it sits above both Overdue rows whatever their dates, because the status decides the order before the date does.

## Why a fixed order

A register with thirteen rows can be read by eye. A register with hundreds cannot, and a person scanning it will act on whatever is at the top. Putting the order in the engine means every screen, export and report that sorts the register sorts it the same way, and the worst obligation is never lost in the middle of a list sorted by code or by name.

## Exercise

From the summarise table, read the counts for Expired, Overdue and Due soon and the attention count the engine prints. Then read the first three rows of the sorted register and say why REG-2026-005 sits first, and why REG-2026-007 sits above REG-2026-002 when both are Overdue.
