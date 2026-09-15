# No clock in the answer

Nothing the schedule reports is read from the machine's clock. Every date comes from the plan, and where the plan carries no date the answer is a refusal rather than today.

{{panel:ec-schedule-explorer}}

## Dated from the concept

| concept | sanction | first oil | months |
| --- | --- | --- | --- |
| FPSO | 2027-04-01 | 2030-04-01 | 36 |
| Platform | 2027-04-01 | 2029-04-01 | 24 |
| FPSO | 2028-02-29 | 2031-03-01 | 36 |

Each first oil date is the concept's own start date carried forward by the months that concept takes. Change the start date and every date in the schedule moves with it. Change nothing and the same answer comes back next month, next year and on any machine.

## The refusal

A concept with no start date, run with no today supplied, is refused: "the concept has no start date: enter one, or pass today to date the schedule from".

The message carries both ways out and the engine takes neither. Enter a start date and the schedule is dated from the plan. Pass today explicitly and it is dated from a day the caller chose and can state. What is not available is a schedule dated from whatever moment the code happened to run at.

## Why a clock is not allowed into an answer

A figure read from a clock changes tomorrow. Run the same plan twice a week apart and the second run disagrees with the first, with nothing in the plan altered. A number that behaves that way cannot be reviewed, cannot be reproduced and cannot be argued with, because there is no version of it to argue about.

Every date in EGINA is stated somewhere. The concepts carry 2027-04-01. The activities carry the dates somebody typed, and the calendar span of 933 days is a count between two of them. The network duration of 870 days holds no date at all, which is why it is the one figure in the schedule that cannot go stale.

Reproducibility is not a nicety. A plan is reviewed and revisited, and the only way to tell a changed answer from a changed input is that nothing else was free to move.

## The mistake

Letting a default fill the gap. A first oil computed from today is correct on the day it was computed and wrong on every other day, and nothing about it looks wrong: it is a plausible date in a date column with no mark on it saying where it came from.

A concept refused for having no start date is a plan with an empty field somebody has to fill. A concept quietly dated from the clock is a plan with a full field that nobody typed.

## Exercise

Give first oil and the month count for a FPSO and for a Platform both sanctioned on 2027-04-01. Then write the engine's message for a concept with no start date and no today supplied, name the two ways out it offers, and say why neither can be chosen by the engine.
