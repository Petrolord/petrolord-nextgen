# The investment decision and the sub-class

{{panel:prms-reserves-calculator}}

The final investment decision is the fact that separates a justified project from an approved one. It is also the fact the engine checks hardest, because two other stated facts lean on it: whether the project is on production, and its reserves status. This lesson follows the decision through the engine's checks, and shows the three refusals a project status can draw.

## A producing project has taken its decision

A project cannot sell petroleum before anyone has decided to build it. The engine therefore refuses a project stated as on production with the investment decision stated as not taken, and names the field it refuses, verbatim:

> projectStatus.finalInvestmentDecision must be true for a project on production (a producing project has passed its investment decision); got false

The refusal is about the facts, and it names the fact to fix: the decision, because a producing project settles that question.

## The reserves status follows production

For Reserves you also state a reserves status (PRMS 2.1.3.6, Table 2): developed-producing, developed-non-producing or undeveloped. A developed producing status describes wells that flow to sales today, so it needs a project on production. Stated on one that is not, it is refused, verbatim:

> reservesStatus must be "developed-non-producing" or "undeveloped" for a project that is not on production (developed producing reserves come from completion intervals open and producing, Table 2); got "developed-producing"

| id | project (fixture) | sub-class (engine) | reserves status (stated) |
| --- | --- | --- | --- |
| EKN-1 | Ekene Main waterflood (synthetic) | on-production | developed-producing |
| EKN-2 | Ekene infill wells (synthetic) | approved-for-development | undeveloped |

EKN-2 has its decision and no production yet, so it is undeveloped. When its wells come on stream the facts change, the sub-class becomes on-production, and a developed status becomes open to it.

## Contingent Resources carry no project status

The investment decision belongs to a commercial project. A project the engine finds not commercial is Contingent Resources, and for it the project status is left out. Stating one is refused, verbatim:

> projectStatus must be left out for Contingent Resources (the project status that sets a Reserves sub-class, PRMS 2.1.3.5); got {"finalInvestmentDecision":false,"onProduction":false}

The engine works in a fixed order. It decides the class from the commerciality criteria first, and only then reads the facts that set a sub-class of that class. A project status is read for Reserves alone.

## Why the checks matter

A sub-class is a claim about maturity that a reader of a reserves report will rely on. Tying it to stated facts means the claim can be traced: the reasons print each fact and each decision with its section, and a contradiction is stopped at the input.

## Exercise

Work in the reserves calculator, in the view "Sub-classes and the commerciality criteria".

1. Start from "EKN-1 on production". Set "Final investment decision taken (stated, Reserves)" to false and read the refusal. Compare it with the one above, then set the control back to true.
2. Start from "EKN-2 Ekene infill wells (approved)". Set "Reserves status (stated, Reserves)" to developed-producing and read the refusal. Then set "On production (stated, Reserves)" to true, and read which field the engine names next.
3. Start from "EKN-4 development pending". Set "Final investment decision taken (stated, Reserves)" to false and read the field the refusal names.
4. Write two sentences on the order in which the engine reads class, project status and reserves status.
