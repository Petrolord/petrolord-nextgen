# The smallest one that will do

{{panel:fc-sizing-explorer}}

The selection rule is one sentence long. Return the smallest listed orifice whose area is at or above the required area. Everything interesting about it happens at the boundaries, where at or above has to be distinguished from strictly above.

## Walked across the ladder

| required area in2 (stated) | orifice | orifice area in2 | margin | note |
| --- | --- | --- | --- | --- |
| 0.050000 | D | 0.110000 | 2.200000 |  |
| 0.110000 | D | 0.110000 | 1.000000 | exactly a listed area |
| 0.110001 | E | 0.196000 | 1.781802 |  |
| 0.500000 | G | 0.503000 | 1.006000 |  |
| 1.287000 | J | 1.287000 | 1.000000 | exactly a listed area |
| 2.000000 | L | 2.853000 | 1.426500 |  |
| 6.380000 | P | 6.380000 | 1.000000 | exactly a listed area |
| 25.999999 | T | 26.000000 | 1.000000 |  |
| 26.000000 | T | 26.000000 | 1.000000 | exactly a listed area |

## The rows that decide the rule

Look at the pair at 0.110000 and 0.110001 in2. The first lands exactly on the smallest listed area and takes that orifice, with a margin of exactly 1.000000. The second is larger by a millionth of a square inch and moves up a rung to E. Those two rows together are the whole proof that the comparison is at or above rather than strictly above, and no other kind of evidence would settle it. A boundary case is the only case that can distinguish two rules which agree everywhere else.

The rows marked as exactly a listed area all come back with a margin of 1.000000, which is the same statement read a second way.

## What a required area below the smallest rung does

The first row asks for 0.050000 in2, which is below the smallest listed orifice. The engine does not refuse it and does not scale anything down. It returns D, the smallest rung, with a margin of 2.200000, because the smallest listed orifice is still the smallest one at or above the requirement. A very small required area therefore buys a lot of spare capacity, and that is a property of the published ladder rather than a choice this engine made.

## Two near misses worth studying

The row at 0.500000 in2 takes G at 0.503000 in2 with a margin of 1.006000. That is a case where the required area came within a whisker of the rung below being too small, and the chosen valve has almost no spare area over the requirement. Nothing is wrong with it. The engine answered the question it was asked, and the answer is the honest one.

The row at 25.999999 in2 is the same situation at the top of the ladder. It takes T, the largest listed orifice, with a margin of 1.000000 at the precision this course prints margins. One more millionth of a square inch and there is no orifice left, which is the subject of the last lesson in this module.

## Reading the boundary honestly

Two cautions come out of this table. The first is that a required area computed to six decimals and then compared against a published area to three is a comparison whose outcome can hinge on rounding, so the figure being compared should be the one the engine returned rather than a figure transcribed off a screen. The second is that a case landing exactly on a listed area is a case with no spare capacity at all, and there is a difference between a valve that just passes and a valve that passes.

## Exercise

Write down the two rows either side of 0.110000 in2 and say what they prove about the comparison the engine makes. Then say what the engine returns for a required area smaller than the smallest listed orifice, and what margin that leaves.
