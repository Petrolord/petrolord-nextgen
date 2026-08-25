# What adds and what does not

The first check on any partition is that the parts reproduce the whole. This lesson runs that check properly, at full precision, and finds that it passes for some rows of the chain and fails for others. Understanding why is worth more than the check itself.

## The check at full precision

Take the west and east figures at the capstone settings and add them, keeping every digit the machine holds rather than the six the tiles print.

| Row | West plus east | Field total | Difference |
| --- | --- | --- | --- |
| Cells | 169 | 169 | 0 |
| Gross rock volume | 22.26903564453125 | 22.26903564453125 | 0 |
| Net volume | 17.81522878109259 | 17.81522878109259 | 0 |
| Pore volume | 3.563045809312041 | 3.563045809312045 | -4.4e-15 |
| HCPV | 2.315979797290234 | 2.3159797972902343 | -4.4e-16 |
| STOIIP | 12.139208107496758 | 12.139208107496763 | -5.3e-15 |

The first three rows agree bit for bit. The last three do not.

## Why the field total is not the sum of the blocks

The reason lives in how the engine accumulates. As it walks the nodes it adds each node's contribution twice: once into the register for that node's block, and once into a separate register called the total.

So the field total is a sum of 169 numbers added in node order. The blocks are a sum of 117 numbers and a sum of 52 numbers, added in node order within each block and then added to each other.

Floating point addition is not associative. Adding the same numbers in a different order can give a different answer in the last bits, because each intermediate sum is rounded to the nearest representable value. The two routes are doing exactly that: same numbers, different grouping, different rounding history.

## Why the first three rows survive it

The cells are integers, and integer addition in this range is exact regardless of order.

The gross rock volume and net volume happen to survive because of what the numbers are. Each node contributes its thickness times the cell area, and the thicknesses come from a float32 grid, so they carry relatively few significant bits. Multiplying by 10,000 and by 0.8 keeps the results in a range where the running sums stay exactly representable, so no rounding occurs anywhere along either route and both give the same answer.

At the pore step the chain multiplies by 0.20 stored as a float32, which is not exactly one fifth. From there the partial sums stop being exactly representable, rounding begins, and the grouping starts to matter.

## How large is the disagreement

The STOIIP difference is 5.3 parts in $10^{15}$. Expressed in barrels, on a booking of 12.139208 million stock tank barrels, it is about five millionths of one barrel.

There is no engineering content in that number whatsoever. The point of measuring it is the opposite: to know its size so that you can recognise a real discrepancy when you see one.

That is the practical rule. A partition check should agree to about fifteen significant figures. If it agrees to only six, something is genuinely wrong: a cell counted twice, a cell counted in no block, a contact applied inconsistently, or a label array that does not cover the frame. Those errors are thousands of times larger than this one and they are easy to spot once you know what clean looks like.

## Reading it off the panel

The panel prints two tiles for exactly this check, labelled blocks added and field total, both to six decimals.

{{panel:rc-block-explorer}}

At every fault position and every pair of equal contacts those two tiles read the same, because the disagreement is far below the sixth decimal. Step the fault across the whole range and watch them stay locked together while both block tiles move.

That is what a healthy partition looks like. If you ever see those two tiles differ in a digit the panel prints, the partition is broken, not imprecise.

## Worked example

Suppose a colleague's three compartment model reports blocks of 5.20, 3.15 and 2.60 MMstb against a field total of 11.00 MMstb.

The blocks add to 10.95, which is 0.05 MMstb short of the field. That is a discrepancy of about one part in 220, which is roughly $10^{13}$ times larger than the accumulation noise measured above.

So this is not floating point. Something structural is wrong, and the size gives a hint: 0.05 MMstb at typical Ekene properties is a few hundred thousand cubic metres of rock, which is a handful of cells. The most likely cause is cells that carry oil but fall in no block, which happens when the label array does not cover the frame or when a boundary test leaves a gap.

## Exercise

State the two things that a partition check comparing blocks against a field total can detect, and the one important thing it cannot.

Self check: it detects cells assigned to no block and cells assigned to more than one, since either breaks the sum. It cannot detect cells assigned to the wrong block, because moving a cell from one block to another leaves the total unchanged. That failure has to be caught by looking at the map, which is why the panel draws the fault trace through the boundary the labels actually use.
