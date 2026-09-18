# Live and not live

A register holds every risk anybody has written down, including ones still being drafted and ones the organisation has stopped carrying. Before counting anything, the engine's rules divide those risks into two groups by status, and the division decides which risks carry a review obligation.

{{panel:rc-risk-explorer}}

## The six statuses

| group | statuses |
| --- | --- |
| live | "Open", "Under Review", "Mitigated", "Realized" |
| not live | "Draft", "Closed" |

Live statuses are the risks an organisation still carries. A "Draft" risk is not yet a carried risk: it is still being written. A "Closed" risk is one the organisation has stopped carrying. Here "Closed" is a status of a risk, the meaning it has throughout this tier.

## Mitigated is still live

The status most often misread is "Mitigated". It sounds finished. It is not: a Mitigated risk is still carried, because mitigation lowers the residual without removing the risk. The hazard is still on the facility, the controls are what keeps it at its residual level, and those controls need reviewing like any other.

"Realized" is live for a similar reason. The event has happened, and the organisation is living with its consequences. That is not a risk anybody can stop carrying by changing its status.

## The OBODO register by status

The register holds 12 risks and 10 of them are live.

| risk | status | live |
| --- | --- | --- |
| OB-01 | "Open" | yes |
| OB-02 | "Open" | yes |
| OB-03 | "Under Review" | yes |
| OB-04 | "Mitigated" | yes |
| OB-05 | "Open" | yes |
| OB-06 | "Open" | yes |
| OB-07 | "Realized" | yes |
| OB-08 | "Open" | yes |
| OB-09 | "Draft" | no |
| OB-10 | "Closed" | no |
| OB-11 | "Open" | yes |
| OB-12 | "Open" | yes |

The two that are not live are OB-09, "Draft", and OB-10, "Closed". 12 risks minus those 2 leaves the 10 live ones.

## What being live changes

A risk review can only be overdue on a live risk. OB-10 is "Closed" with a review date 181 days after 2026-10-01, and OB-09 is "Draft" with no review date. Neither can read overdue whatever its date, because the test asks the status first.

Being live does not change a risk's score. OB-10 still has an inherent score of 20, "Critical", and a residual of 5, "Medium", and the engine still derives both. What changes is whether the risk is part of the population a report means when it talks about risks the organisation carries.

## The mistake

The mistake is to read "Mitigated" as done and drop it from a list of carried risks. A Mitigated risk is still live, still carries a review date and can still become review-overdue. The only statuses that leave the live group are "Draft" and "Closed".

## Exercise

Record the four live statuses and the two that are not live. Record how many risks the OBODO register holds and how many are live, and name the ones that are not. State the rule that keeps "Mitigated" in the live group, and what being live decides about a risk review on 2026-10-01.
