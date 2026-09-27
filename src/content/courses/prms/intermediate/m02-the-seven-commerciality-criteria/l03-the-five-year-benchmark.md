# The five-year benchmark

{{panel:prms-reserves-calculator}}

Criterion three asks for a reasonable time-frame for development, and PRMS 2.1.2.3 with 2.1.3.6.4 gives a benchmark for it: development generally starts within five years, and a longer wait needs a stated justification. The benchmark is a recommendation of the standard. The engine holds it as one of the five figures it carries, each with its citation, and reads the criterion from two stated facts.

## The figure and its source

| constant | value | where it comes from |
| --- | --- | --- |
| `PRMS_FIGURES.reasonableTimeFrameYears` | 5 | PRMS 2.1.2.3 and 2.1.3.6.4 (a recommended benchmark) |

The facts are stated in `commerciality.timeFrame`: `startWithinYears`, the years within which development starts, and `longerJustified`, whether a longer time-frame is stated as justified. The engine meets the criterion when the start is within 5 years, or later when a longer time-frame is stated as justified.

## Three golden inputs

Each of these projects is otherwise commercial, so the time-frame alone decides the class:

| golden input | start within, years (stated) | longer justified (stated) | class (engine) |
| --- | --- | --- | --- |
| class-time-frame-5-met | 5 | false | Reserves |
| class-time-frame-6-contingent | 6 | false | Contingent Resources |
| class-time-frame-8-justified | 8 | true | Reserves |

The engine's time-frame reasons, verbatim:

> time-frame: development starts within 5 years against the 5-year benchmark: met (PRMS 2.1.2.3)

> time-frame: development starts within 6 years against the 5-year benchmark, a longer time-frame not stated as justified: not met (PRMS 2.1.2.3)

> time-frame: development starts within 8 years against the 5-year benchmark, a longer time-frame stated as justified: met (PRMS 2.1.2.3)

## Five years exactly: a reading

The standard gives a benchmark and leaves its edge to the estimator. The engine states its choice in its own reason: five years exactly is met. The alternative it names is that five years exactly is not met. Neither is the law, and no graded figure rests on the edge. A report that quotes a class resting on a five-year start names the reading.

## Justified is a stated fact

A longer time-frame can be justified: a gas project waiting on a contracted pipeline, or a development held back by a stated plan. The engine does not judge the justification. It records that you stated one and prints it in the reason, where a reviewer can ask for the evidence.

## The SEC's five years

US filers meet a related number in public text. Regulation S-K Item 1203 (the eCFR current at 2026-09-01, public domain) asks a registrant to explain proved undeveloped reserves that stay undeveloped for five years or more after disclosure:

> "(d) Explain the reasons why material amounts of proved undeveloped reserves in individual fields or countries remain undeveloped for five years or more after disclosure as proved undeveloped reserves." (17 CFR 229.1203(d))

That is a disclosure rule for filed reserves. The engine applies the PRMS benchmark and carries no SEC rule on the time-frame.

## Exercise

Work in the reserves calculator, in the view "Sub-classes and the commerciality criteria".

1. Start from "Development starting at five years" and read the time-frame line and the class.
2. Start from "Development starting at six years". Read the class and blockers, then set "A longer time-frame justified (stated)" to true. The project now meets every criterion; read the field the engine asks for next and say why a Reserves project needs it.
3. Start from "Eight years, a longer time-frame justified". Set the justification control to false and predict the class. Then read the refusal, and find the class named in its message.
4. On any start, set "Development starts within, years (stated)" to not stated and read the field the refusal names.
