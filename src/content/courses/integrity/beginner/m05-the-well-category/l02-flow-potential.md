# Flow potential

One flag, and it changes the answer in nine of the sixteen states. Not the one you would expect.

{{panel:wi-envelope-explorer}}

## What the flag means

Flow potential asks whether this well, left alone, can deliver fluid to surface. A live producer can. A well whose reservoir is depleted below the head of the column standing in it cannot, and neither can a well with no permeable source behind casing.

The two barrier rule exists because a flowing well needs a spare. Take the flow away and one qualified barrier is enough, so the requirement drops from two envelopes to one.

## Where you would expect it to bite

The obvious reading is that the flag only matters when you are short of an envelope. With two present the requirement is met either way, so the colour should be the same, and the flag should only rescue the single envelope wells.

Work the cross product against the engine and that reading does not survive. Of the sixteen combinations of the two envelope verdicts, seven give the same colour with the flag on and off. Nine change, and most of them are wells with two envelopes present.

## What the engine actually does

With no flow potential the engine does not weigh the secondary envelope against the primary. It stops consulting the secondary at all. The colour becomes a function of the primary alone: intact reads green, degraded reads yellow, failed reads orange, and empty reads orange.

| primary | secondary | can flow | cannot flow |
| --- | --- | --- | --- |
| intact | degraded | yellow | green |
| intact | failed | orange | green |
| intact | empty | orange | green |
| degraded | failed | red | yellow |
| failed | failed | red | orange |
| empty | failed | red | orange |

Both envelopes are present and populated in the first four rows. A failed secondary on an intact primary is an orange well while it can flow and a green one once it cannot, because once one envelope suffices, the state of the other stops being part of the question.

## The consequence, and it is yours

Two things follow. A failure that never reaches the colour is still a failure, and the element level checks keep reporting it. And the relaxation has a floor: an empty primary is orange whether the well can flow or not, because one qualified envelope is not none. That floor was not always there. The branch used to test for failed and degraded and fall through to green for everything else, so a well with nothing recorded in it came back clean and the reason named a qualified barrier that did not exist. This course found it and the engine now refuses.

That makes the flag the most load bearing input in the module. The engine takes your word for it and computes the rest honestly. Deciding that a well cannot flow is an engineering judgement about reservoir pressure, and it is yours to defend.

## Exercise

Pick any state where the secondary is worse than the primary. Predict both colours, then check them in the panel.

Then write down what evidence you would need on file before setting the flag to false on a real well.
