# The gas-oil ratio gate

The gas shutoff squeeze is decided by one comparison, it never looks at a gas history, and the best answer it can reach is consider.

{{panel:pd-channel-explorer}}

## The sweep

A derived sweep on teaching well ELELENWO-4, a case this course built rather than a published one. Its expected gas-oil ratio is held at 950 scf/stb and only the measured ratio moves.

| Gas-oil ratio, scf/stb | Ratio to expected | Verdict | Reasons |
| --- | --- | --- | --- |
| 900 | 0.947368421 | no | 1 |
| 1500 | 1.578947368 | no | 1 |
| 1899 | 1.998947368 | no | 1 |
| 1900 | 2.000000000 | consider | 2 |
| 1901 | 2.001052632 | consider | 2 |
| 2152 | 2.265263158 | consider | 2 |
| 3000 | 3.157894737 | consider | 2 |
| 5000 | 5.263157895 | consider | 2 |

Eight contiguous rows and one threshold in them. The gate is a factor of two on the expected ratio and nothing else: 1899 scf/stb is refused, 1900 scf/stb passes, and one scf/stb is the whole difference between a verdict with 1 reason and a verdict with 2.

## The verdict has a ceiling

Two values appear in that column and no others. At 5000 scf/stb, more than five times the expectation, the answer is still consider, the same word the well gets at 1900 scf/stb. A gas shutoff never comes back a candidate at any ratio, and the reason count moves once.

## Nothing about the gas is diagnosed

The measured ratio and the expected ratio are two fields on the well row. No gas history is read, no slope is fitted, no mechanism is established. The same row screened at a late fraction of 0.5, at 0.9 and with no diagnosis at all returns consider with 2 reasons every time, because the gas branch never touches the diagnosis. The gate is arithmetic on two typed numbers.

## What the two reasons say

The first prints both fields back: "The gas-oil ratio is 2152 against an expected 950, so most of the gas is not coming out of the oil." The second is the branch admitting it has not finished: "Gas coning and gas channelling separate the same way water does, and the same rule applies: only the channelling case is worth squeezing. Run the diagnostic on the gas-oil ratio before deciding."

## The mistake

Reading consider as an escalation and no as an all clear. At 1500 scf/stb, more than half again the expectation, the verdict is a bare no with 1 reason, and nothing in the screening looked at whether that gas is climbing. Both answers come from one division, and neither is checked against anything: `screenTreatments` is asserted against no golden, so no expected verdict exists for it anywhere.

## Exercise

Walk the measured gas-oil ratio in the panel from 900 scf/stb to 5000 scf/stb against an expectation of 950 scf/stb and record where the verdict and the reason count change.

Then say what a gas shutoff verdict of consider entitles you to spend.
