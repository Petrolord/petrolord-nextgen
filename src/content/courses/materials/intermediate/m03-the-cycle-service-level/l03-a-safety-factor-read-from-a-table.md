# A safety factor read from a table

{{panel:materials-stock-calculator}}

A planner once looked k up in a printed table of the normal curve, usually to two decimals, and many published examples still do. The engine reproduces that reading only when told to: how k is read is a stated input.

## Two readings of k

The reading takes one of two forms:

* none: the engine uses the exact k from the inverse normal;
* read from a table to a stated number of decimals: the engine rounds the exact k to that many decimals, as a table would, and uses the rounded figure.

The reason shows both figures when a table reading is stated. On the lead-time spread case, whose k is read to whole numbers, verbatim:

> a cycle service level of 0.9 gives k = Phi^-1(0.9) = 1.281552, read as 1; safety stock 30 over a demand of 100 with sigma 30 gives the reorder point s 130, held as 130 (up to a multiple of 5)

The exact k of 1.281552 is read as 1, so the safety stock is exactly sigma.

## Why a reading matters

On a published check the reading decides whether the printed answer is reproduced at all. The next lesson shows four printed safety stocks that the engine reproduces only when k is read to two decimals, as the source read it. Neither figure is wrong: each answers a differently stated question, so the course states which reading a figure uses.

On the choke bean set the difference is small. Read to two decimals, k becomes 1.64, the safety stock falls a little, and the reorder point is still held as 14.000000 after rounding up to a whole set.

## Readings the engine refuses

The reading has to be stated, and stated whole. Leave it out:

> safetyFactorRounding must be { rule: 'none' } or { rule: 'nearest', decimals } (a table read to that many decimals)

Ask for more decimals than the engine reads a factor to (its cap is six):

> safetyFactorRounding.decimals must be a whole number from 0 to 6; got 7

Or give decimals with the rule none, which reads no table:

> safetyFactorRounding.decimals must be left out when the rule is 'none'

## A reading is part of the policy

The safety factor reading, like the rounding of the level, is written into the stock policy beside the cycle service level or fill rate. A reorder point quoted without its reading can be reproduced only by guessing.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "Lead-time spread alone". Read k exact, 1.281552, and k as used, 1. Set the control "Safety factor decimals (stated)" to 2 and read how k as used, the safety stock and the held level change. Set it to 7 and read the refusal.

Next set the control "Safety factor reading (stated)" to none and confirm that k as used now equals k exact. Then set it to not stated and read the refusal.

Finally start from "The choke bean set, cycle service level", set the reading to a table with 2 decimals, and confirm that k as used is 1.64 and the held level stays at 14.000000.
