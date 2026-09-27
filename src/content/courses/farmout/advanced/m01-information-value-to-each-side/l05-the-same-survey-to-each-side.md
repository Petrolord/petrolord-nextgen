# The same survey to each side

{{panel:farmout-valuation-calculator}}

A survey returns the same signals whoever pays for it. What it is worth depends on the side, because each side holds different actions and different payoffs. On the Ekene Deep deal (synthetic) the farmor and the farminee value the same seismic survey differently.

## The farmor's three actions after each signal

EKO has three actions: drill alone with its 70.000000 percent, farm out on the stated terms, or walk away. Without the survey its best action is to farm out, with an EMV of 19833033.704181. After each signal the engine rolls the three back at the new chance of success (engine):

| golden case | signal | chance of success after it | best action | EMV |
| --- | --- | --- | --- | --- |
| info-ekene-farmor | bright amplitude | 50.000000 | drill alone | 64837617.964633 |
| info-ekene-farmor | dim amplitude | 10.000000 | farm out | 3858013.481672 |

The engine's reasons, verbatim:

> signal "bright amplitude" (probability 0.375): chance of success 50%, best action drill alone, EMV 64837617.96
> signal "dim amplitude" (probability 0.625): chance of success 10%, best action farm out, EMV 3858013.48

## The two sides side by side

| golden case | side | EMV without information | EMV with the signal | EVII | EVII less the cost |
| --- | --- | --- | --- | --- | --- |
| info-ekene-farminee | farminee | 0.000000 | 6745331.458602 | 6745331.458602 | 5245331.458602 |
| info-ekene-farmor | farmor | 19833033.704181 | 26725365.162782 | 6892331.458602 | 5392331.458602 |

The survey is worth 6892331.458602 to EKO and 6745331.458602 to FIN (engine), each before the stated cost of 1500000.000000. For FIN the bright signal is the one that turns the decision, from decline to farm in. For EKO the bright signal turns it too, from farm out to drill alone. The dim signal changes neither side's action.

## Reading the two answers together

Each call values one side on that side's own positions under the stated deal. The engine does not play the two decisions against each other, and the two answers point in opposite directions on a bright signal: FIN would want to farm in and EKO would want to keep the whole prospect. Both cannot happen on the same terms. The figures say what the survey is worth to each side if its own action were free to follow the signal. A deal struck after a bright signal would be struck on new terms, and the deal calculator values any such terms as a new call.

This is why the timing of information is a negotiating point in a farm-out. A farmor with a survey that may come back bright has a reason to shoot it before offering the prospect. A farminee has a reason to ask for terms agreed before the survey is read. The engine prices each position; which one the parties choose is theirs to state.

## Quoting the figures

An EVII is quoted with its side, its likelihoods, the chance of success and the deal terms beneath the positions. Two EVIIs from different sides are two figures about two positions and are never added together.

## Exercise

Open the valuation calculator on the view "The value of information to one side" and start from "The same survey to the farmor". Read the actions table: three actions for the farmor. Read the per-signal table and the EVII tile. Then set "Side valued (stated)" to the farminee without changing anything else in the box, and read the actions table and the per-signal table again. Write two sentences for a deal team: which signal turns each side's decision, and why the farmor may prefer to shoot the survey before it offers the prospect.
