# The Refutas index

The engine's viscosity index is the Refutas form, computed by viscosityBlendIndex: VBI = A x ln(ln(nu + 0.8)) + B, with nu in cSt. The index is averaged across the blend, and viscosityFromBlendIndex turns the averaged index back into a viscosity.

{{panel:crude-assay-explorer}}

## The two constants, read from the engine

The constants are not typed into this lesson from a handbook. They are read back from viscosityBlendIndex itself, at the two points where the double log takes a simple value. Where ln(nu + 0.8) is e, the double log is 1. Where ln(nu + 0.8) is 1, the double log is 0.

| constant | how the engine gives it | value |
| --- | --- | --- |
| B | viscosityBlendIndex(e - 0.8) | 10.9750 |
| A | viscosityBlendIndex(e^e - 0.8) minus B | 14.5340 |
| the offset inside the double log | 1 minus viscosityFromBlendIndex of a very negative index | 0.8000 |

So the index is 14.5340 times the double log of the viscosity plus 0.8000, plus 10.9750. Asking the engine for its own constants means the lesson quotes the figures its blends are built on, read from the function that builds them.

## The index of each crude

| crude | viscosity cSt | Refutas index (viscosityBlendIndex) | viscosityFromBlendIndex of that index |
| --- | --- | --- | --- |
| Obigbo Light | 4.6 | 18.5704 | 4.6000 |
| Egbema Medium | 22 | 27.5437 | 22.0000 |
| Asarama Heavy | 610 | 37.9879 | 610.0000 |
| Ubie Condensate | 1.1 | 4.5307 | 1.1000 |

The last column is a round trip. Each viscosity goes into the index and comes back out unchanged at four decimals, for all four crudes.

## The index beside the viscosity

Read the index column beside the viscosity column. Asarama Heavy is 610 cSt and its index is 37.9879. Ubie Condensate is 1.1 cSt and its index is 4.5307. A set of probes from 1 to 1000 cSt reads the index at four more viscosities.

| viscosity cSt | viscosityBlendIndex returns |
| --- | --- |
| 1 | 3.2518 |
| 10 | 23.5747 |
| 100 | 33.1962 |
| 1000 | 39.0657 |

Each probe multiplies the typed viscosity by ten, and the index reads 3.2518 at 1 cSt, 23.5747 at 10, 33.1962 at 100 and 39.0657 at 1000 cSt. These index values, and not the cSt figures, are what a blend weights. The engine then inverts the weighted index, and the round-trip column above shows the inversion returning each crude's own viscosity.

## How a blend uses it

The engine converts each crude's viscosity into its index, takes a weighted average of the indices, and inverts that average back to a viscosity. For the export blend of Obigbo Light and Egbema Medium at 65 and 35 by volume, that route gives 7.4743 cSt. The weights in the average are a choice the engine makes and names, and the next lesson is about that choice.

## Where the index comes from

This course names one other member of the family: "ASTM D7152 blends the same family of index on VOLUME; the two disagree, and which basis to use is a HELD decision." So two forms of the same double-log index can differ in the fraction the index is averaged on, and the next lesson's table prints both for the same blends. This course teaches the engine's form exactly as the engine computes it. When you meet a viscosity index in another tool, check its constants against the three printed above before comparing any figure it gives with this engine's.

## Exercise

Read the index of Obigbo Light and the index of Egbema Medium. Quote each crude's viscosity, its index and its round trip value. Say what the round trip column shows about viscosityBlendIndex and viscosityFromBlendIndex. Then read the four probe rows and say what the index values show about how the index treats a tenfold change in viscosity.
