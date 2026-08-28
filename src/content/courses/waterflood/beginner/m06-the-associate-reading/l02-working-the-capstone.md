# Working the capstone

The capstone asks for six numbers from the Ekene ledger. This lesson walks the mechanism for each one. It does not give you the answers; it makes sure that when your number disagrees with the grader, you know which step to check.

## What you are given

The flood record: 36 monthly periods of field volumes, or equivalently 216 per-well rows. The frozen factor set $B_o = 1.21584$, $B_w = 1.02$, $B_g = 0$, $R_s = 400$. An operator target band of 1.00 to 1.20. Everything else you compute.

## Field 1: cumulative VRR

Sum the produced voidage over all 36 periods, sum the injected voidage over all 36, divide. Not the average of the monthly ratios; the ratio of the sums. The tolerance is loose enough that a rounding in the fourth decimal will not hurt you and tight enough that using the wrong $B_o$ will.

The check that catches most errors: your answer should be a little above one, because the field ran below target for five months and above it for thirty one.

## Fields 2 and 3: produced and injected voidage

The two sums that fed field 1, in reservoir barrels. Reporting these separately is not busywork: if your ratio is wrong, these tell you which side of it went wrong. A produced voidage that is too small by about eighteen percent is the signature of $B_o$ defaulted to one.

Sanity scale: the field produced a few hundred thousand reservoir barrels over three years, on a rate of order five thousand a month.

## Field 4: fill-up month index

Compute the running cumulative VRR period by period and find the first index at which it reaches or exceeds 1.0. The index is zero-based, so the first period is index 0.

Two traps. First, use the cumulative series, not the instantaneous one; the instantaneous series crosses 1.0 much earlier and you will be seven months out. Second, the crossing must be at or above 1.0, not strictly above, and the crossing value is only barely above one, so do not round it away.

## Field 5: months under the target band

Flag each of the 36 periods against the band 1.00 to 1.20 using the INSTANTANEOUS VRR, and count the ones below the minimum. The count is small and the flagged months are consecutive at the start of the record.

The trap here is which series to flag. Flagging the cumulative series against the same band gives a different and larger answer, because the cumulative series takes eleven periods to reach 1.0 while the instantaneous series takes five.

## Field 6: the January 2023 produced voidage

One month, worked in full. $N_p = 4727.034315745669$ stb, $W_p = 0$, $G_p = 1890.8137262982677$ Mscf.

Compute the solution gas as $R_s N_p / 1000$ and confirm it equals $G_p$, so the free gas is zero. Then the produced voidage is the oil term alone.

This field exists to check that you applied the gas subtraction. If you added the produced gas as free gas at some nonzero $B_g$, you will be high by a large margin; if you used $B_g = 0$ as the fixture specifies, the gas term vanishes either way and you will be right for a slightly wrong reason. Do the subtraction and see it cancel.

## Using the panel

{{panel:wf-ledger-explorer}}

Set the rolling window to 3 and the band to 1.00 and 1.20, which are the capstone settings. Every one of the six fields is visible in the tiles at those settings. Read them, then compute them independently and check that you agree with the panel. If you disagree, the disagreement is the lesson: find which step differs before you submit.

## What the grader does

Each field is compared against an oracle value produced by running the engines on the committed fixture, within a stated tolerance. Nothing is graded on a rounded value, and nothing is graded on a number you cannot derive from the data you were given. If you believe your answer is right and it is marked wrong, the fault is almost always one of: the wrong series, the wrong band, a missing formation volume factor, or an off-by-one in the index.

## Exercise

First, before opening the panel, write down your predicted sign or rough magnitude for all six fields from the reasoning in this tier alone. Then compute them. The purpose is to notice which of your predictions were wrong and why.

Second, for each of the six fields, write one sentence naming the single most likely mistake and how you would detect it from the answer alone.
