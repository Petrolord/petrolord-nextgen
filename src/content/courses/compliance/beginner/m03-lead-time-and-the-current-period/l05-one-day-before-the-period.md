# One day before the period

The current period has a first day, and a filing either lands on it or it does not. The digest prints the case where one day decides the answer, and it is worth reading slowly, because it is the case a person checking a register by eye will get wrong.

## The monitoring report as recorded

REG-2026-004 is the IKORO annual environmental monitoring report. It is due 2027-03-31, 167 days after the as-of date of 2026-10-15. It is Annual, so its current period starts one year back from the due date, on 2026-03-31. Its last filing is dated 2026-03-30.

| code | frequency | due | periodStart | last filed | status |
| --- | --- | --- | --- | --- | --- |
| REG-2026-004 | Annual | 2027-03-31 | 2026-03-31 | 2026-03-30 | On track |

The report reads On track, and explainStatus says why: "Due in 167 days. The last filing (2026-03-30) was for an earlier period, so nothing has been filed for this one yet."

{{panel:compliance-register-explorer}}

## The same report filed one day later

The digest then moves the filing by one day, to 2026-03-31, the first day of the period, and changes nothing else:

status Compliant; Last filed 2026-03-31, next due in 167 days.

One day on the filing date turns On track into Compliant. Dated 2026-03-30, the filing belongs to an earlier period, as the reason says. Dated 2026-03-31, it belongs to the period that starts that day. The first day of the period is inside the period.

## Why a person gets this wrong

Look at the two dates a reviewer sees: a report filed at the end of March, and a due date at the end of March. The natural reading is that the report was filed on time for this year and the obligation is Compliant. The engine reads the dates exactly. A filing dated the day before the period starts discharged last year's report, and this year's report has not been filed. On track is the engine telling the reviewer that there is work to do and time to do it.

The same shape turns up twice more in the register:

| code | frequency | due | periodStart | last filed | status |
| --- | --- | --- | --- | --- | --- |
| REG-2026-002 | Monthly | 2026-10-10 | 2026-09-10 | 2026-09-09 | Overdue |
| REG-2026-012 | Annual | 2026-11-09 | 2025-11-09 | 2025-11-03 | Due soon |

The monthly water quality return was filed on 2026-09-09, and its period starts on 2026-09-10. That filing belongs to the period before, and the return for the current period is late: it reads Overdue, and its reason says "The due date passed 5 days ago." The concession rental was filed on 2025-11-03, before a period that starts on 2025-11-09, and it reads Due soon.

## The period start comes from the due date

Note where the period start comes from. It is computed from the next due date and the frequency, and it is never typed. If the due date on REG-2026-004 were wrong, the period start would be wrong with it, and so would the status. The status is only as good as the due date it is read from, which is why the next module, on how the due date rolls forward, matters as much as this one.

## Exercise

Read REG-2026-004's period start, its last filed date and its status as recorded, then the status and reason the digest prints when the filing is dated 2026-03-31. Say what one day on the filing date changes, and which period each of the two filing dates belongs to. Then read REG-2026-002's last filed date and period start and say whether that filing counts for the current period, and what status the return carries as a result.
