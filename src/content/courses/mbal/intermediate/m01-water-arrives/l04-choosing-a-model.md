# Choosing a model

You have read the ratio column and concluded that water is arriving. Now you must say something about the aquifer delivering it, because $W_e$ is the one term no instrument produces. Whatever you write down is a model, and the choice deserves to be made deliberately and stated out loud.

The engine offers four settings. Its aquifer model type is the union `'none' | 'pot' | 'fetkovich' | 'carter_tracy'`, and what follows is what each commits you to.

## none

No water crosses the boundary, $W_e = 0$ at every survey, and the balance is the closed tank the Associate tier worked.

This is a model like any other, not the absence of one. Choosing it asserts that the reservoir has no aquifer in effective pressure communication over the period surveyed. Ekene passes on every available test. Most fields do not.

## pot

A tank of water sitting against the reservoir, at the same pressure, depressurising with it. When the reservoir pressure falls by $\Delta p$ the aquifer water expands and its pore space compacts, and the volume that frees up crosses the boundary immediately.

There is no time in that description anywhere. The influx at a given pressure is the same whether the reservoir reached it in six months or in six years. That is the pot aquifer's defining simplification, its greatest convenience and its fatal limitation, and module 2 is entirely about it.

What it costs: one parameter, the aquifer water in place $W$, the engine's `initial_aquifer_water_in_place_rb`. On an oil tank you need not even supply it, because the regression solves for it alongside the oil in place. That is a convenience with a price tag, and module 2 lesson 4 reads the invoice.

## fetkovich

A finite aquifer of stated size that empties as it delivers, coupled to the reservoir through a productivity index, a measure of how readily it can move water across the boundary for a given pressure difference. Because the aquifer depletes, its own average pressure falls as it works. Because the flow is rate limited, elapsed time between surveys enters the calculation.

That makes it the simplest model here that can represent an aquifer which lags, the behaviour lesson 3 taught you to recognise. Module 3 builds it and works it against a published example; none of its mechanics belongs here.

What it costs: two parameters, the engine's `initial_aquifer_water_in_place_rb` and `aquifer_pi_rb_d_psi`, plus a dated production history.

## carter_tracy

A superposition of a transient flow solution, which tracks how a pressure disturbance spreads through the aquifer rock rather than treating the aquifer as one well mixed pot. It is parameterised by geometry and rock properties rather than a lumped index: the engine's history match definitions name `aquifer_radius_ft` and `aquifer_permeability_md`, and the input block also carries thickness, porosity, encroachment angle, total compressibility and water viscosity.

It is the most faithful of the four and the hungriest for information, and the Expert tier owns it.

## The gate that decides two of these for you

Fetkovich and Carter-Tracy march forward in time, so they need to know how much time passed between surveys. The engine gets that from a helper that turns observation dates into day counts, and it refuses to guess. Leave a date out and it stops, naming the offending row:

> Timestep 3 is missing observation_date. Fetkovich and Carter-Tracy aquifer models require a date column in the production data ($\Delta t$ is needed for the time-marching scheme). Add observation_date to every row in the Data tab, or switch to the Pot aquifer model (time-independent).

Put the dates out of order and it stops again, saying that the offending timestep's date is not after its predecessor's and that dates must be strictly increasing.

The pot path never calls that helper, and neither does the no aquifer path. Verify it: strip a date out of a history, run it with the pot model, and the run completes and returns an oil in place. Run the same history with Fetkovich and it throws.

Read that as a design statement rather than a quirk. A model that does not need your dates is a model that cannot use your dates, and cannot therefore represent anything about the rate at which water arrives.

## How to choose, in order

**Read the ratio column before you open the model menu.** No drift and a level consistent with an independent booking means `none`. A drift or a level that does not reconcile means something has to be modelled.

**Flat column, level too high.** The influx is tracking the pressure drop closely, which is the pot aquifer's shape. Use `pot` as a screening model.

**Rising column.** Time dependence is not optional. A pot aquifer applied to a lagging aquifer does not merely lose accuracy, it fails in the specific way module 2 lesson 3 demonstrates. Go to `fetkovich`, and to `carter_tracy` when the aquifer geometry is known well enough to be worth using.

**A forecast is wanted.** Any statement about future influx is a statement about a rate, so the time independent model is out of scope however well it fits history.

Underneath all four is one principle. Every model beyond `none` adds at least one free parameter, and a regression spends every freedom it is given. Choose the least elaborate model the diagnostic demands, say in the report which one you chose and why, and name the observation that would change your mind.

## Worked example

An operator sends six annual surveys. The apparent oil in place runs 41.2, 44.8, 49.9, 56.6, 64.7 and 74.1 million stb against a volumetric booking of 40 million stb. Three of the six rows have no date, because the spreadsheet lost the column.

The column drifts upward by 79.9 percent and the increments grow every step, so this is influx and it lags. That rules out `none`, and it rules out `pot`, because a pot aquifer cannot produce a rising column from a falling pressure. The right model is `fetkovich` or better.

And you cannot run either, because the engine stops on the first row with no date. The correct next action is not a modelling decision at all. It is a phone call to recover the survey dates, and be clear with the operator why: the missing column is not metadata, it is the input the only admissible models consume.

If the dates cannot be recovered, say so in the report, run the pot model as a screening exercise, and label its output as a screening number carrying a known bias rather than an estimate of oil in place. What that bias looks like is module 2's subject.

## Exercise

For each of the four settings, write in one line the physical claim you make about the aquifer when you select it, and in a second line the single piece of data whose absence would stop you.

Then suppose the worked example's dates are recovered and the drift is unchanged. Write the two sentences you would put in a report to justify choosing `fetkovich` over `carter_tracy` on a field where nobody has mapped the water leg, and say what would have to become available before Carter-Tracy was the better choice.
