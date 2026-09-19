# A blank lead time is missing

The storage sizing at Kano takes a lead time: the days between an order and a delivery. This lesson reads what `lpgStorageSizing` does when that box is left blank. The engine does not refuse the whole answer. It names the input missing and prints the rest of the result around it.

{{panel:gasvalue-rollout-explorer}}

## KANO with the lead time given

With every input given, KANO's vessel at a 0.85 liquid_volume fill limit returns a cover of 8.8840 days, a reorder level of 40.0000 t, an ullage at the reorder of 31.0685 t and a delivery verdict of true. The inputs are vessel 150 m3, demand 8 t/day, delivery 20 t, lead time 3 days and safety stock 2 days.

## KANO with the lead time blank

With the lead time left blank (''), the engine answers:

| field | with the lead time blank |
| --- | --- |
| missingInputs | lead time |
| reorderAtTonnes | null |
| deliveryFitsUllage | no verdict |
| coverDays | 8.8840 |

Read the four lines one at a time.

missingInputs names the lead time. The engine says which input is missing, by name.

reorderAtTonnes is null. With the lead time given it was 40.0000 t.

deliveryFitsUllage gives no verdict. With the lead time given it was true.

coverDays is 8.8840. The cover does not depend on the lead time and is still given.

## Blank is missing

A box left blank is missing, and the engine reports it that way: the lead time appears in missingInputs, the reorder level is null and the verdict is withheld. The course teaches the blank case only, because that is the case the engine was run on and printed. What the engine does with a lead time left out of the call is a separate question that this lesson leaves alone.

## Missing and refused are two answers

The vessel lessons have met several refusals: a blank fill limit, a fill limit of 1, an unknown basis, a liquid-full filling density and no liquid density. Each stops the answer with a sentence that begins REFUSED. A blank lead time returns an answer with a named gap in it.

Set the two side by side. A blank fill limit is refused: "REFUSED: A maximum fill ratio is required and is not defaulted. It is a code limit for the product and the vessel: LPG expands and a vessel filled liquid-full ruptures hydraulically." A blank lead time is named: missingInputs lead time, reorderAtTonnes null, deliveryFitsUllage no verdict, and coverDays 8.8840.

## Reading a null

The reorder level prints as null, and the verdict prints as no verdict. Neither is printed as a figure. A reader who writes 0 t for the reorder level, or true for the verdict, has written a figure the engine did not print on this input.

In practice, a planner who sees missingInputs on a result fills that box before acting on any figure beside it.

## In the explorer

Open KANO's vessel at 0.85 on liquid_volume. Clear the lead time and read missingInputs, reorderAtTonnes and deliveryFitsUllage. Confirm that the cover still reads 8.8840 days. Type 3 again and read the reorder level return to 40.0000 t and the verdict return to true.

## Exercise

Read KANO's result with the lead time left blank: missingInputs lead time, reorderAtTonnes null, deliveryFitsUllage no verdict, coverDays 8.8840. Say which of the four fields change from the result with the lead time given and which does not, say what the engine prints for the cover when the lead time is blank, and say what separates this answer from the engine's answer to a blank fill limit.
