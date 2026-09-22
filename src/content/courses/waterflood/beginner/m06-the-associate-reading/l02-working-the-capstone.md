# Working the capstone

The capstone asks for six numbers from the Ekene ledger, read on a factor set, a band and a month its brief states. This lesson walks the mechanism for each one on the teaching case, the one the ledger explorer opens on. It does not give you the answers; it makes sure that when your number disagrees with the grader, you know which step to check.

## What you are given

The flood record: 36 monthly periods of field volumes, or equivalently 216 per-well rows. A frozen factor set and an operator target band, which the brief states; the teaching case uses $B_o = 1.21584$, $B_w = 1.02$, $B_g = 0$, $R_s = 400$ and a band of 1.00 to 1.20. Everything else you compute.

## Field 1: cumulative VRR

Sum the produced voidage over all 36 periods, sum the injected voidage over all 36, divide. Not the average of the monthly ratios; the ratio of the sums. The tolerance is loose enough that a rounding in the fourth decimal will not hurt you and tight enough that using the wrong $B_o$ will.

The check that catches most errors on the teaching case: the answer is a little above one, because the field ran below target for five months and above it for thirty one. A different factor set moves it, and the check becomes the direction: a smaller $B_o$ makes the produced side smaller and the ratio larger.

## Fields 2 and 3: produced and injected voidage

The two sums that fed field 1, in reservoir barrels. Reporting these separately is not busywork: if your ratio is wrong, these tell you which side of it went wrong. A produced voidage that is too small by about eighteen percent is the signature of $B_o$ defaulted to one.

Sanity scale: the field produced a few hundred thousand reservoir barrels over three years, on a rate of order five thousand a month.

## Field 4: fill-up month index

Compute the running cumulative VRR period by period and find the first index at which it reaches or exceeds 1.0. The index is zero-based, so the first period is index 0.

Two traps. First, use the cumulative series, not the instantaneous one; the instantaneous series crosses 1.0 much earlier and you will be seven months out. Second, the crossing must be at or above 1.0, not strictly above, and the crossing value is only barely above one, so do not round it away.

## Field 5: months under the target band

Flag each of the 36 periods against the band using the INSTANTANEOUS VRR, and count the ones below the minimum. The count is small and the flagged months are consecutive at the start of the record.

The trap here is which series to flag. Flagging the cumulative series against the same band gives a different and larger answer, because on the teaching case the cumulative series takes eleven periods to reach 1.0 while the instantaneous series takes five.

## Field 6: one month's produced voidage

One month, worked in full; the brief names the month. On the teaching case, January 2023: $N_p = 4727.034315745669$ stb, $W_p = 0$, $G_p = 1890.8137262982677$ Mscf.

Compute the solution gas as $R_s N_p / 1000$ and compare it with $G_p$. At the teaching $R_s$ of 400 they are equal, so the free gas is zero and the produced voidage is the oil term alone. At another $R_s$ they are not, and the difference is the free gas.

This field exists to check that you applied the gas subtraction. If you added the produced gas as free gas at some nonzero $B_g$, you will be high by a large margin; with $B_g = 0$ the gas term vanishes either way and you will be right for a slightly wrong reason. Do the subtraction and see what is left.

## Using the panel

{{panel:wf-ledger-explorer}}

The panel opens on the teaching case: window 3, the band 1.00 and 1.20, the teaching factor set. Every one of the six quantities is visible in the tiles there. For the capstone, type the brief's factor set, band and month into the boxes under the sliders. Read the tiles, then compute them independently and check that you agree with the panel. If you disagree, the disagreement is the lesson: find which step differs before you submit.

## What the grader does

Each field is compared against an oracle value produced by running the engines on the committed fixture, within a stated tolerance. Nothing is graded on a rounded value, and nothing is graded on a number you cannot derive from the data you were given. If you believe your answer is right and it is marked wrong, the fault is almost always one of: the wrong series, the wrong band, a missing formation volume factor, or an off-by-one in the index.

## Exercise

First, before opening the panel, write down your predicted sign or rough magnitude for all six fields from the reasoning in this tier alone. Then compute them. The purpose is to notice which of your predictions were wrong and why.

Second, for each of the six fields, write one sentence naming the single most likely mistake and how you would detect it from the answer alone.
