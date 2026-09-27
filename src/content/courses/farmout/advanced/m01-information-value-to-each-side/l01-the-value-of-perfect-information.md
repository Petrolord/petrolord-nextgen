# The value of perfect information

{{panel:farmout-valuation-calculator}}

The Expert tier asks what a deal is worth once the sides can learn more before they commit, what risk each side keeps, what a working interest is priced at, and what happens after the farm-in. This module starts with the first: what knowing the outcome in advance would be worth to the farmor and to the farminee.

## The method, and where it is taught

Decision trees and the value of information as methods belong to the decision analysis course. This course applies them to the two sides of a farm-out, and the engine says where its figures come from:

> evpi and evii from engines/economics/decisionTree.js (Bayes from the stated likelihoods, so the signal chances and posteriors are consistent by construction); the payoffs are the side's positions under the deal

The payoffs are the positions the deal calculator built at Professional: each side's success and dry-hole payoff under the stated terms, rolled back at the stated chance of success.

## The farminee with and without perfect information

On the Ekene Deep deal (synthetic), FIN's EMV for farming in is -1806224.721864, so its best action is to decline, worth 0.000000. Its EMV without information is therefore 0.000000. With perfect information FIN would farm in whenever the well is going to succeed and decline whenever it is going to be a dry hole. Its EMV then is the stated chance of success, 25.000000 percent, times its success payoff of 57575101.112542, which is 14393775.278136 (engine). The expected value of perfect information, EVPI, is the difference: 14393775.278136.

## The farmor with and without perfect information

EKO's best action without information is to farm out, with an EMV of 19833033.704181. With perfect information it would drill alone on a known success, where its 70.000000 percent pays 157675235.929265, and walk away from a known dry hole, worth 0.000000. That gives 39418808.982316 and an EVPI of 19585775.278136 (engine).

| golden case | side | EMV without information | EMV with perfect information | EVPI |
| --- | --- | --- | --- | --- |
| info-ekene-farminee | farminee | 0.000000 | 14393775.278136 | 14393775.278136 |
| info-ekene-farmor | farmor | 19833033.704181 | 39418808.982316 | 19585775.278136 |

EVPI is a ceiling. No survey tells a side the outcome for certain, so no real signal can be worth more to that side than its EVPI.

## The side is a stated input

The engine values one side per call and holds no default side. A call naming any other side is refused:

> side must be one of "farmor", "farminee"; got "partner"

Every EMV here is of a named position, quoted with its chance of success and payoffs. The two EVPIs differ because the two sides hold different actions and different payoffs on the same prospect.

## Exercise

Open the valuation calculator on the view "The value of information to one side" and start from "The Ekene survey to the farminee". Read the actions table and the tiles for the EMV without information, the EMV with perfect information and EVPI. Check that the EMV with perfect information is the chance of success times the farm in success payoff in the actions table. Then set the control "Side valued (stated)" to the farmor and read the same three tiles. Name the action the farmor takes on a known success and on a known dry hole. Finally, type another word for the side into the box and read the refusal the engine returns.
