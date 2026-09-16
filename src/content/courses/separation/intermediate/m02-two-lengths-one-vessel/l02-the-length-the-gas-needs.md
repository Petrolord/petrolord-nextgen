# The length the gas needs

The gas requirement asks a different question from the liquid requirement: how much length does a droplet need to fall out of the gas before the gas carries it past the outlet. On ABANA-2 at 8.000000 ft the answer is 2.396801 ft.

{{panel:fc-slug-explorer}}

## A fall, a speed and a ride

A droplet entering the gas space has to cross the gas height before it reaches the liquid. It crosses at the settling velocity while the gas carries it along the drum at the gas velocity, so the length it needs is the gas height multiplied by the ratio of those two speeds.

On ABANA-2 at a level of 0.500000 the gas height is 4.000000 ft, the gas runs at 1.173387 ft/s and the settling velocity is 1.958255 ft/s. The gas is slower than the droplet falls, so the droplet lands in less than the gas height, and the requirement comes out at 2.396801 ft.

## The gas requirement across the family

| diameter ft | gas area ft2 | gas length ft |
| --- | --- | --- |
| 5.000000 | 9.817477 | 3.834882 |
| 6.000000 | 14.137167 | 3.195735 |
| 7.000000 | 19.242255 | 2.739202 |
| 8.000000 | 25.132741 | 2.396801 |
| 9.000000 | 31.808626 | 2.130490 |
| 10.000000 | 39.269908 | 1.917441 |

The range is narrow. Across a doubling of the diameter the gas requirement moves only from 3.834882 ft to 1.917441 ft, because widening the drum raises the gas height and lowers the gas velocity at the same time, and the two effects work against each other inside the same product.

## Where the settling velocity comes from

The settling velocity used here is the Souders-Brown velocity at the horizontal K, 1.958255 ft/s for this stream at a K of 0.400000 with a liquid of 55.919504 lb/ft3 and a gas of 2.239712 lb/ft3.

That is HELD FOR LITERATURE. Using the Souders-Brown velocity as the droplet settling velocity in a horizontal gas length is a packaging this module records, and it has not been checked against API 12J or against Arnold and Stewart. If the published method sizes the gas length from a stated droplet diameter instead, the gas length and every conclusion that rests on it change. Treat the figures here as the engine's own answer with its provenance unverified, and do not build a design case on the derating of this number.

## Two published cases

A 6.000000 ft drum at a level of 0.500000 taking 10.000000 ft3/s of gas needs 2.496548 ft for its gas, at a gas velocity of 0.707355 ft/s. An 8.000000 ft drum at a level of 0.400000 taking 30.000000 ft3/s needs 4.157188 ft, at a gas velocity of 0.952689 ft/s. Three times the gas rate bought less than twice the gas length, because the larger drum at a lower level gave the gas more area to cross.

## The mistake

The mistake is reporting the gas length as the vessel length. On ABANA-2 that would specify a drum of 2.396801 ft against a real requirement of 23.270539 ft, which is the most expensive single error available in horizontal sizing. The gas requirement is one of two candidates and it is usually the smaller of them.

## Exercise

Give the gas length for the 5.000000 ft, 8.000000 ft and 10.000000 ft drums, and explain why widening the drum moves that requirement so little. Then state which quantity in this calculation is held for the literature, what is unchecked about it, and what a reader should therefore refuse to conclude from 2.396801 ft.
