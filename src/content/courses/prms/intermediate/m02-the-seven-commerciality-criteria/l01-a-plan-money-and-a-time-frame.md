# A plan, money and a time-frame

{{panel:prms-reserves-calculator}}

A discovered project with a recovery project becomes Reserves only when it is commercial, and PRMS 2.1.2.1 sets out seven criteria for that, with the entity's commitment to proceed beside them. At Associate you read the verdict. This module takes the criteria one group at a time, starting with the first three: a plan, the money and a reasonable time-frame.

## The first three criteria

The engine names each criterion in its reasons. Its wording, with the section it cites:

| criterion key | the engine's wording | section |
| --- | --- | --- |
| developmentPlan | (1) a technically mature, feasible development plan | PRMS 2.1.2.1(1) |
| financialAppropriations | (2) financial appropriations in place or highly likely to be secured | PRMS 2.1.2.1(2), 2.1.2.4 |
| timeFrame | (3) a reasonable time-frame for development | PRMS 2.1.2.1(3), 2.1.2.3 |

A plan is the engineering: wells, facilities and a schedule that a competent team judges will work. Money is the funding: approved budgets, or financing so near to agreed that no reasonable reader doubts it. The time-frame asks when development starts.

## Stated true or false, with one exception

The plan and the money are each a stated true or false. The engine holds no view of whether a plan is mature; it records what you state and prints it in the reasons.

The time-frame is the exception. You state two facts in `commerciality.timeFrame`: the years within which development starts, and whether a longer time-frame is justified. The engine reads the criterion from them against the five-year benchmark, which the lesson after next takes apart. A negative start is refused, verbatim:

> commerciality.timeFrame.startWithinYears must be a finite number at or above 0; got -1

## One failure is enough

A project needs every criterion. Ekene North appraisal (EKN-4, synthetic) has positive economics and a start inside the benchmark, and it still fails the plan and the money, with approvals and the commitment. Its class decision reads, verbatim:

> Contingent Resources: not commercial (developmentPlan, financialAppropriations, approvals, firmIntention)

Ekene East gas (EKN-3, synthetic) has a plan and fails the money and the time-frame among six blockers. The list tells an operator what has to change before the project can move to Reserves, and in what order the work might go.

## What the criteria do not measure

None of the three is a number the engine computes from data. A plan's maturity, a budget's approval and a start date are facts about the company and the project, and the engine takes them as stated. The reasons print each one met or not met, so a reader can challenge the fact in the place it enters.

## Exercise

Work in the reserves calculator, in the view "Sub-classes and the commerciality criteria".

1. Start from "EKN-4 development pending". Read the criteria table and the blockers the engine names.
2. Set "(1) a technically mature, feasible development plan (stated)" and "(2) financial appropriations in place or highly likely (stated)" to true. Read the blockers again and count how many remain.
3. Set "Development starts within, years (stated)" to 6 and read the time-frame line in the reasons.
4. Start from "EKN-3 development on hold" and list its blockers in the order you would expect an operator to clear them.
