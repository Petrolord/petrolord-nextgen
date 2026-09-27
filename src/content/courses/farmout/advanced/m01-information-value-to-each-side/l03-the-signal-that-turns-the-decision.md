# The signal that turns the decision

{{panel:farmout-valuation-calculator}}

Information has value to a side only if some signal would change what that side does. This lesson follows the Ekene survey through FIN's decision and shows where its value comes from.

## FIN's decision on each signal

Without the survey FIN declines: farming in at 40.000000 percent of the well for 30.000000 percent has an EMV of -1806224.721864, so declining, worth 0.000000, is its best action. The survey changes the chance of success FIN acts on. After each signal the engine rolls FIN's two actions back again at the new chance (engine):

| golden case | signal | chance of the signal | chance of success after it | best action | EMV |
| --- | --- | --- | --- | --- | --- |
| info-ekene-farminee | bright amplitude | 0.375000 | 50.000000 | farm in | 17987550.556271 |
| info-ekene-farminee | dim amplitude | 0.625000 | 10.000000 | decline | 0.000000 |

The engine's reasons, verbatim:

> signal "bright amplitude" (probability 0.375): chance of success 50%, best action farm in, EMV 17987550.56
> signal "dim amplitude" (probability 0.625): chance of success 10%, best action decline, EMV 0

A reason rounds money to the cent. The figure to reason with is the field, 17987550.556271.

## Why bright turns it and dim does not

The Professional tier computed FIN's break-even chance of success on these terms: 27.281304 percent. Below it FIN's EMV for farming in is negative; above it, positive. The stated 25.000000 percent sits just below, which is why FIN declines without the survey. A bright signal lifts the chance to 50.000000 percent, well above the break-even, so FIN farms in. A dim signal drops it to 10.000000 percent, further below, so FIN declines as it would have anyway.

Only the bright signal changes the action, and only the bright signal adds value.

## From the signals to EVII

The EMV with the signal weights each signal's best EMV by the chance of that signal. For FIN that is 0.375000 times 17987550.556271 plus 0.625000 times 0.000000: 6745331.458602 (engine). The expected value of imperfect information, EVII, is that figure less the EMV without information, 0.000000, so it is also 6745331.458602.

> farminee: EMV without information 0; with perfect information 14393775.28; EVPI 14393775.28

EVII of 6745331.458602 is below the EVPI of 14393775.278136. The survey is imperfect: a bright signal still leaves a 50.000000 percent chance of a dry hole, and a dim one still hides a 10.000000 percent chance of success FIN walks away from.

## What this tells a negotiator

On the stated terms FIN would decline the deal as offered. With the survey in hand it would accept on a bright signal. A farminee that can buy or ask for the survey before committing is choosing a different position from one that must decide now, and the difference is worth 6745331.458602 in expectation before the survey's cost. The engine computes the figure; whether the survey is shot before the deal is signed is a term the parties state.

## Exercise

Open the valuation calculator on the view "The value of information to one side" and start from "The Ekene survey to the farminee". Read the per-signal table and the EVII tile, and check EVII against the chance-weighted EMVs of the two signals. Then use the deal controls under the view: raise "Chance of success, percent (stated)" above FIN's break-even chance and read the EMV without information and the per-signal table again. Say which signal now turns FIN's decision, and in which direction. Explain in two sentences why a survey that turns no decision is worth nothing to the side that buys it.
