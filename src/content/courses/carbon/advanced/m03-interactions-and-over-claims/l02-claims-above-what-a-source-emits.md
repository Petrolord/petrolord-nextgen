# Claims above what a source emits

A measure's tonnes are a claim. The lab prints what happens when a claim is larger than what its source emits. It reads the invented AGBOR inventory, passes each source's emission to the curve, and checks every claim against it. Every figure here is invented for this course; money is in US dollars.

{{panel:carbon-abatement-explorer}}

## The Agbor inventory

The inventory is computed on the course's set, IPCC AR6 GWP100, fossil methane, so its methane line is in tCO2e at that set:

| line | scope | tCO2e |
| --- | --- | --- |
| Fired heaters (CO2) | 1 | 34927.743 |
| Flaring (CO2) | 1 | 6189.848 |
| Flaring (unburned CH4) | 1 | 1372.285 |
| Vented and fugitive methane | 1 | 2622.400 |
| Purchased electricity | 2 | 10988.000 |
| Total, Scope 1 and Scope 2 |  | 56100.276 |

## What the curve is given

The course says how a source reaches the curve: each source's emission is its CO2 plus its methane in CO2e, as the Carbon Studio passes it.

| source id | emission passed to the curve tCO2e |
| --- | --- |
| heaters | 34927.743 |
| flare | 7562.133 |

The flare's 7562.133 tCO2e is its CO2 line and its unburned methane line together, the methane on IPCC AR6 GWP100, fossil methane. The heaters' 34927.743 tCO2e is the fired heaters' CO2 line.

## A claim of 9400 t against the flare

The six measures as costed claim 6200 t a year from the flare through Flare gas recovery. The lab prints a second curve in which Flare gas recovery claims 9400 t a year instead:

| curve | total abatement t | target t | meetsTarget | targetBasis | over-claims |
| --- | --- | --- | --- | --- | --- |
| flare gas recovery claiming 9400 t | 18660.000 | 16830.083 | none | not assessed: claims exceed what a source emits | flare: claimed 9400.000 against 7562.133 emitted |

The over-claims column names the source, the claim and the emission: 9400.000 t claimed against 7562.133 tCO2e emitted. The curve's total rises to 18660.000 t with the larger claim in it. The target of 16830.083 tCO2e is 30 percent of the inventory total, computed by the lab as the Carbon Studio computes it.

## Why the verdict is none

The course states it: "Where a claim exceeds what its source emits, the curve adds up tonnes that do not exist, and the verdict is none." The total of 18660.000 t carries the whole 9400.000 t claim, including the part of it beyond the 7562.133 tCO2e the flare emits. The total and the target, 16830.083 t, are both printed, and the engine gives no verdict between them. It prints meetsTarget none, and targetBasis says why: "not assessed: claims exceed what a source emits".

The course lists this among the rules in force: a curve with a claim above what its source emits returns meetsTarget none and says why.

## Reading an over-claim on a page

The over-claim names three things a reader can act on: which source, how much was claimed, and how much it emits. The engine resolves none of them and gives no verdict while the claim stands. In practice the claim or the recorded emission is corrected and the curve is run again.

## The cost per tonne falls

The course also prints the 9400 t claim costed: Flare gas recovery at a net annual cost of 484221.51 USD and a cost per tonne of 51.5129 USD. At 6200 t a year, the lab prints the same net annual cost, 484221.51 USD, and 78.1002 USD a tonne. The course's reading: "The cost per tonne falls as the claimed tonnes rise; the over-claim makes the measure look cheaper as well as larger."

## Two checks the curve runs

The curve carries two checks on its tonnes, and they print in different places. Interaction, two measures on one source, prints with the curve as additive false and labels a verdict an upper bound when every claim is checked. An over-claim, one claim beyond its source's emission, prints in the lab's over-claims column and leaves the verdict none.

## Exercise

Read the flare's emission passed to the curve, the flare's two inventory lines it is built from, and the over-claims entry on the 9400 t curve with its meetsTarget and targetBasis. Say what the claim and the emission, read together, show about why the curve gives no verdict.
