# The instruction it ends on

The gas branch stops one step short of a decision and hands the last step to the reader, in a sentence that is the most honest thing in the screening and the easiest to skip.

{{panel:pd-channel-explorer}}

## The sentence

"Gas coning and gas channelling separate the same way water does, and the same rule applies: only the channelling case is worth squeezing. Run the diagnostic on the gas-oil ratio before deciding."

That is the second of the two reasons attached to a gas shutoff verdict of consider, and it is why consider is the ceiling: the branch knows it tested a ratio and not a mechanism, and says so.

## The instruction is not recorded anywhere

Nothing in the returned object marks it outstanding. On teaching well ELELENWO-4, a case this course built rather than a published one, the gas shutoff comes back consider with 2 reasons at a late fraction of 0.5, at 0.9, and with no diagnosis at all. The verdict is identical whether the instruction was followed or ignored, so the only trace that the second reading was run is the analyst writing it down.

Compare the water side, which puts its caveat into the reason list of the treatment it is recommending: "The reading is low confidence, so confirm it with a production log before committing to a squeeze."

## Why the instruction is reasonable

`chanDiagnosis` is the same function on either fluid, and its thresholds are log-log slopes, which carry no unit. A channelling boundary of 1.3, an ambiguous band of 0.25 and a coning slope of -0.1 describe the shape of a climb, not the size of a ratio, so they transfer from a water-oil ratio to a gas-oil ratio in scf/stb without rescaling.

## What transfers with it

The whole window problem. The instruction names no window fraction. The default is 0.5, it is clamped to the range 0.1 to 1.0, and on the teaching well the derivative slope moves by 0.370920348 across the range of that dial, from 1.229355999 to 1.600276347, with the mechanism changing on the way. The gas reading has to clear the same gates too: a minimum fit quality of 0.5 as a fraction on the derivative, a minimum span of 0.4 log cycles, and a minimum history, refused with "A Chan reading needs a history, not a handful of points. Six producing samples is the bare minimum and a useful reading wants far more."

## The mistake

Closing the screening on consider. The verdict was reached without any gas history at all, and the sentence beside it says the work has not been done. If the second reading comes back indeterminate, its note is the answer: "The history does not settle the question. That is an answer: it says do not spend money on a treatment chosen by guesswork." Nothing here is checked either way. `screenTreatments` and `chanDiagnosis` are asserted against no golden, so every verdict in this chain is the engine's own assertion.

## Exercise

Take a gas shutoff to consider in the panel, then run a ratio history through the diagnostic at three window fractions and record each mechanism.

Then write the one line you would add to the screening output so a reader can tell whether the instruction was carried out.
