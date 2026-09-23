# The capstone brief

{{panel:dq-checks-explorer}}

The Associate capstone hands you a well's data and asks for six numbers. Every one of them answers this tier's question, whether the data are fit to use, and every one is a value the engine returns. None of them asks which values stand apart, and none needs a chart. Each field has a worked twin in this tier, computed on the Ekene data with the same rule.

| the kind of field | the rule it tests | a worked twin in this tier |
| --- | --- | --- |
| the completeness of a density channel | present over n, with missing meaning null, undefined or NaN | EKENE-7 RHOB, 0.950000 |
| the coverage of a neutron channel over a stated interval | steps between present samples no longer than a stated maxStep | EKENE-7 NPHI at a half-foot maxStep, 0.965217 |
| the expected step of a time index | the median of the steps in the stated direction | EKENE-7 depth index, 0.500000 |
| the liquid-basis water cut on a named day | water / (oil + water) from the rates | EKENE-3 day 10, 0.183105 |
| the drop in a cumulative | against the last present value before it | EKENE-3 day 70, 7496.700000 |
| the allowed difference in a phase sum on a named day | relTolerance times the total | EKENE-3 day 40, 8.870000 |

## What each field asks of you

The completeness field asks you to apply the definition of missing exactly. A sentinel in the data is a present number until someone converts it, and the capstone grades the engine's answer on the data as given.

The coverage field asks for a length over a length. Use the interval and the `maxStep` the brief states. Missing samples matter because they lengthen the step between the present samples either side of them, and a count of present samples is a different quantity.

The expected step field asks for the engine's inferred step. It is the median of the steps that run in the stated direction, so a step that runs backward is left out, and a mean of the steps is a different number.

The water cut field asks for the computed cut on a liquid basis, from the day's oil and water rates, as a fraction. The reported value in the sheet, the water-oil ratio and the oil cut are all different numbers.

The cumulative field asks for the drop the engine reports, from the `drop` field, measured against the last present value before the flagged day. Read the brief for a missing day in between.

The phase sum field asks for the allowed difference, which is taken on the total, at the relative tolerance the brief states.

## How to work it

Before you open the capstone, reproduce every twin in the table in the checks explorer, and check each against the figure here to the last printed digit. The rule you apply to the twins is the rule the capstone grades. Then, for each capstone field, write down the rule, the setting and the entry or day before you read any result. At this tier the likeliest wrong answers come from the wrong convention: a sentinel counted as missing, the wrong basis, the wrong comparison day. All of those are visible on paper first.

## What the capstone will not ask

It will not ask which values stand apart from the rest. That is the Professional tier's question. It will not ask whether the process that makes the data has changed. That is the Expert tier's. An answer that brings a measure of standing apart, or a chart, into this capstone has answered a question nobody asked.

## Exercise

Reproduce all six worked twins from the table without reading the answers first: EKENE-7's density completeness, its neutron coverage at a half-foot maxStep, the depth index's expected step, EKENE-3's day 10 water cut, the day 70 cumulative drop and the day 40 allowed difference. Check each against the table, and for each one write down the rule and the setting you used.
