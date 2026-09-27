# A back-in after the farm-in

{{panel:farmout-valuation-calculator}}

A back-in lets a party raise its participating interest after an event, usually a discovery or a development decision, by taking a share from the others and refunding part of their costs. After a farm-in, the parties that face a back-in are the new ones as well as the old. The engine computes what a stated back-in does to the interests after the farm-in.

## The engine underneath

Back-ins belong to the joint ventures course, which teaches the instrument and its terms. The farm-out engine builds the interests after the farm-in and hands them to backIn of the joint venture engine:

> backIn from engines/economics/jointVenture.js on the post-deal interests
> new interest of another party = old x (100 - target) / (100 - current); refund = (target - current) / 100 x refundable costs, received in proportion to the interest given up

Every other party gives up the same proportion of its participating interest.

## The Ekene back-in

On the Ekene fixture (synthetic), after the farm-in EKO holds 40.000000, PA 30.000000 and FIN 30.000000. EKO backs in to 45.000000 percent under the contract's stated terms, refund form "upfront" (engine):

| golden case | party | before (after the farm-in) | after the back-in | ceded |
| --- | --- | --- | --- | --- |
| backin-ekene | EKO | 40.000000 | 45.000000 | 0.000000 |
| backin-ekene | PA | 30.000000 | 27.500000 | 2.500000 |
| backin-ekene | FIN | 30.000000 | 27.500000 | 2.500000 |

The engine's reasons, verbatim:

> after the farm-in: EKO 40%, PA 30%, FIN 30%
> EKO backs in from 40% to 45%: the others keep 55 / 60 of their interests; refund 5% x refundable costs 480000000 = 24000000 (46000000 excluded)

PA and FIN each keep 55 / 60 of their interests. Each held 30.000000, so each ends at 27.500000 and cedes 2.500000. FIN earned its 30.000000 percent by paying a promote on the exploration well, and a back-in by the farmor takes part of it back.

## When the back-in happens

The engine does not decide when a back-in is triggered. The trigger is a contract event, and the caller reports that it has happened by stating the target. The engine computes the result as of that event.

## What the engine refuses

A back-in raises a participating interest, so a target at or below the party's current interest is refused:

> backIn.targetPct must be above the back-in party's current interest 40; got 35

The back-in party must be one of the parties after the farm-in, the farminee included:

> backIn.party must be one of "EKO", "PA", "FIN"; got "NOC"

And the farm-in cannot earn more than the farmor held:

> earnedPct must be at most the farmor's interest 70; got 80

## Reading a back-in into a farm-in

A farminee weighing a farm-in into a licence with a back-in right on it is earning a participating interest that may shrink. Its value to the farminee depends on when the back-in can be exercised and what is refunded, and the next lesson reads the refund.

## Exercise

Open the valuation calculator on the view "A back-in after the farm-in" and start from "The Ekene back-in, contract, upfront". Read the table of interests before and after the back-in and the ceded column. Change "Back-in to, percent (stated)" to a higher target and check that PA and FIN each keep the same proportion of their interests. Set the target below EKO's current interest and read the refusal. Then change "Back-in party (stated)" to FIN, set a target above FIN's interest, and read who cedes what.
