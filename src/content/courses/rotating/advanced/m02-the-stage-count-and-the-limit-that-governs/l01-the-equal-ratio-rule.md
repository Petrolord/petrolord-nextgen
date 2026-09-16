# The equal-ratio rule

A duty states a suction pressure and a discharge pressure. How many machines stand between them is a decision, and the first of the two rules that make it is arithmetic.

{{panel:fc-compressor-explorer}}

## The overall ratio, and the ratio each stage takes

SOKU as a whole duty is 26.000000 MMscfd from 92.000000 psia to 985.000000 psia at 104.0000 degF, with a per-stage ratio limit of 4.000000 and a discharge limit of 300.0000 degF. The overall ratio is 10.706521739.

Split that across equal stages and each stage takes the root of the overall ratio. At the count the engine settles on, the ratio per stage is 2.204023061. The stages the ratio rule on its own demands is 2, which is the fewest machines whose equal ratios stay inside the stated limit of 4.000000.

## Why equal ratios

Equal ratios are the split this engine applies. The equal-ratio rule gives the thermodynamic minimum number of stages for a given per-stage ratio, and that is the whole of what the rule is for here.

It is also why the ratio per stage is a single figure on the return rather than a list. The engine is not choosing a split. It is applying the equal-ratio rule and reporting the one number it produces, and the train of module 3 then runs on that one figure at every stage.

## The rule alone does not finish the job

The ratio rule on SOKU demands 2 stages. The temperature limit demands 3, and the count the engine returns is 3, governed by discharge temperature. The ratio rule set a floor and something else set the answer.

That is the ordinary case rather than the exception. A ratio limit is about what a single casing takes in one bite. A discharge temperature limit is about what the valves and the lube oil survive. They are different physics and they bind at different places.

The 4.000000 per stage on this duty was typed by the caller. It is a machine choice rather than a property of the gas, and moving it moves the floor the ratio rule sets without touching the temperature side.

## The mistake

The mistake is dividing the overall ratio by a stage count somebody picked from memory, then reporting the result as a design. The count is an output of two rules and the ratio per stage follows from the count. Working the other way round produces a number that is arithmetically correct and has been checked against nothing.

The second mistake is treating the ratio rule as the answer because it is easy to do by hand. On this duty it is short by a whole machine.

## Exercise

Give the SOKU duty, its overall ratio and the ratio per stage the engine returns, and say how many stages the ratio rule alone demands. Then say what the engine reports as the ratio per stage and why that comes back as one number rather than a list, and what the ratio limit and the discharge temperature limit are each about.
