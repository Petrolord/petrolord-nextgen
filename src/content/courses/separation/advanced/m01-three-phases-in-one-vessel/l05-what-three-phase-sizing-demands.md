# What three-phase sizing demands

Three-phase sizing names every input it needs and refuses by name when one is missing. There is no default rate, no assumed gravity and no stand-in droplet size anywhere in the call.

{{panel:fc-slug-explorer}}

## The refusals, in the engine's own words

| missing or wrong input | message |
| --- | --- |
| qOilBpd | "qOilBpd is required: the oil rate in bpd (a vessel with no oil to separate is a two-phase vessel) (got undefined)" |
| qWaterBpd | "qWaterBpd is required: the water rate in bpd (a vessel with no water to separate is a two-phase vessel) (got undefined)" |
| oilRetentionMin | "oilRetentionMin is required: the oil retention time in minutes (got undefined)" |
| sgOil | "sgOil is required: the oil specific gravity (got undefined)" |
| sgWater | "sgWater (1) must exceed sgOil (1.1) for the water to settle" |
| muOilCp | "muOilCp is required: the oil viscosity in cP (got undefined)" |
| waterDropletMicron | "waterDropletMicron is required: the size in microns of the water drops to remove from the oil (got undefined)" |
| oilDropletMicron | "oilDropletMicron is required: the size in microns of the oil drops to remove from the water (got undefined)" |
| waterFracOfLiquid | "waterFracOfLiquid must lie strictly between 0 and 1 when it is given (got 0)" |

Each one is a SeparatorInputError whose `input` property names the field, so a caller can put the message next to the box the user left empty.

## Two kinds of refusal

A missing or out of domain input throws. A state where the inputs are valid and the method has no answer comes back as an object with an `error` string instead: "the heavy phase must be denser than the light phase" when the two gravities are the wrong way round inside a droplet calculation, and "settling needs a droplet size and viscosity" when a droplet has nothing to fall through.

The distinction is worth keeping. A throw says the caller made a mistake. An error object says the caller asked a fair question that this method cannot answer, which is a different conversation with the user.

## An argument that was retired

Two-phase habits brought a single droplet size to a three-phase call, and the engine now refuses it by name: SeparatorInputError on `dropletMicron`, "dropletMicron was retired: give waterDropletMicron (water drops falling out of the oil) and oilDropletMicron (oil drops rising out of the water)".

One droplet size cannot cover both checks. A water drop falls through oil and an oil drop rises through water, so the two have different sizes, different directions and different layers to cross. The message names the replacement rather than saying the argument is unknown.

## Why sgOil is not optional

The oil gravity sets the oil density, and the oil density appears in both droplet calculations as part of the density difference that drives them. Before FC1-0 a missing oil gravity did not refuse. The two droplet checks read NaN and came back false, so a vessel that carried water over reported no carryover, and the vessel passed a check it had never been given the inputs to perform.

## The mistake

The mistake is filling a refusal in to make the call succeed. A retention time nobody chose, a viscosity nobody measured, or a droplet size copied from another job all produce a vessel and a verdict, and neither carries the confidence the numbers appear to have. The refusal is a work instruction: go and get the figure, or say in the report that the vessel was sized without it.

## Exercise

List the inputs three-phase sizing refuses to guess and give the engine's message for two of them. Then explain why one droplet size cannot serve both verdicts, and say what a missing oil gravity did before FC1-0 and why that behaviour was worse than an outright refusal.
