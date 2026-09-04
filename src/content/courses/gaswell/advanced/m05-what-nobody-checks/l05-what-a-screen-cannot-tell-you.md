# What a screen cannot tell you

A screen is a filter, not a design. Reading its output as a recommendation is the most expensive mistake available in this module.

{{panel:pd-remedy-explorer}}

## The balance is static

The plunger force balance carries no friction unless friction is handed in, no velocity, no gas slippage past the plunger and no fallback of the slug during the rise. Friction is measured rather than modelled: the published case runs at 0.0000000000 psi, and putting 40.0 psi into it gives 265.8581556122 psia against 225.8581556122 psia, exactly 40.0000000000 psi more. It is the easiest term in the balance to check by hand and the only one that behaves that simply.

The cycle terms are inputs too. The rise at 750.0 ft/min, the fall at 1000.0 ft/min in gas and 172.0 ft/min in liquid, the afterflow and the shut-in are operating inputs with stated typical bands, neither computed nor optimised.

## There is no inflow anywhere

None of these modules contains an inflow performance relation. The gas rate is an input, so a loading verdict is a verdict at a rate somebody supplied and not a prediction of what the well will do next. The traverse is passed in as stations carrying their own pressure, temperature, compressibility and diameter, and `loadingProfile` does not solve multiphase flow and does not invent a gradient.

## The rule of thumb decides nothing

The 400 scf per bbl per 1000 ft screening rule is carried for comparison only and never used to decide feasibility. On the teaching well OGUTA-2 it asks 3280.00000000 scf/bbl where the balance asks 9561.17363265 scf/bbl, so the physics is 2.91499196 times as demanding and `ruleOfThumbAgrees` reads false. On the published case the rule asks 2400.00000000 scf/bbl against a computed 4710.35929989 scf/bbl, 1.96264971 times. Which side a well sits on is reported through that one flag and used for nothing.

## The three the module admits to

`gasPerCycleScf` does not check that the expansion runs the right way, a known defect and not a thing to design on. `maxSlugLengthFt` clamps rather than refuses at both ends of its range. `screenPlungerLift` never compares `liquidPerDayBbl` to anything. Those are stated limits, which is different from unknown ones, and a study quoting the screen without quoting them has misrepresented it.

## What the screen is for

It tells you whether one slug size at one casing pressure clears one balance and one ratio. That is a genuine filter and it is cheap. It cannot tell you whether the well stays unloaded, what it makes next month, whether the liquid keeps up, or what a plunger does on the way down.

## Exercise

List the operating inputs the module takes as typical values rather than computing, with the numbers it ships.

Then write the three limits it states about itself, and say for each what a reader would have to compute independently to cover it.
