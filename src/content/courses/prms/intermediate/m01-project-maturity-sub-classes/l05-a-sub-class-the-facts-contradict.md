# A sub-class the facts contradict

{{panel:prms-reserves-calculator}}

The module so far has shown the engine deriving a Reserves sub-class and checking a stated Contingent or Prospective one. This lesson looks at the refusals where the two meet: a sub-class stated on one side of the class line when the facts put the project on the other, or a Reserves sub-class that the project status does not support. Each refusal names the sub-class the facts give, so the message is also the fix.

## Refusals that name the answer

| golden input | the engine's message, verbatim |
| --- | --- |
| class-refuse-subclass-approved-stated-justified | subClass must be "approved-for-development" for this project (final investment decision taken; production yet to start: PRMS 2.1.3.5.5, Table 1); got "justified-for-development" |
| class-refuse-subclass-reserves-stated-pending | subClass must be "approved-for-development" for this project (final investment decision taken; production yet to start: PRMS 2.1.3.5.5, Table 1); got "development-pending" |
| class-refuse-subclass-contingent-stated-approved | subClass must be one of "development-pending", "development-on-hold", "development-unclarified", "development-not-viable" for Contingent Resources (not commercial: financialAppropriations, timeFrame, economicStatus, market, facilities, firmIntention); got "approved-for-development" |
| class-refuse-producing-without-fid | projectStatus.finalInvestmentDecision must be true for a project on production (a producing project has passed its investment decision); got false |

Read them in pairs. The first two are Reserves projects with the decision taken and no production: whatever else is stated, the facts give approved-for-development, and the message says so. The third is a project that fails six criteria, so it is Contingent Resources; a Reserves sub-class cannot apply, and the message lists the four that can, with the blockers that made the project Contingent. The fourth is a contradiction inside the facts themselves.

## Two kinds of contradiction

A stated sub-class can contradict the class. Stating approved-for-development does not make a project commercial; the criteria do. The engine decides the class first, then refuses a sub-class from the wrong side of the line and prints why the class is what it is.

A stated sub-class can also contradict the maturity facts inside Reserves. Justified-for-development on a project whose decision is taken is one step behind the facts, and the engine refuses it by naming the step the facts reach.

## The message is part of the result

Each refusal is an object with `error` and `field`. The field is the input to fix, and the message starts with its name. A panel shows the message as the engine returns it and writes no refusal text of its own.

A box that carries an unknown key is refused on that key before any fact is read, because every function checks its accepted keys first. A misspelt `subclass` is therefore refused as an unknown key, and the sub-class check never runs until the spelling is fixed.

## When a refusal is the useful answer

A reserves engineer handed a project described as on production with no investment decision has found a real question for the operator. The refusal records the question in the engine's own words, and the classification waits until the facts agree.

## Exercise

Work in the reserves calculator, in the view "Sub-classes and the commerciality criteria".

1. Start from "EKN-2 Ekene infill wells (approved)". Set "Sub-class (stated)" to justified-for-development and read the refusal; then set it to development-pending and read it again. Compare both with the table.
2. Start from "EKN-3 development on hold" and set "Sub-class (stated)" to approved-for-development. Read the blockers the message lists.
3. Start from "EKN-1 on production" and set "Sub-class (stated)" to approved-for-development. Read the sub-class the message asks for.
4. In the box, change the key `subClass` to `subclass` and read which refusal comes first.
