# The surface loading, and the depth that stays out of it

This lesson is about which dimension of a basin buys a better cut size and which one does not, because the answer surprises people and it is the whole design content of the device.

## The depth does not enter the cut size

Take the UZERE basin and change nothing but the water depth:

| water depth m | cut micron | horizontal velocity m/s | residence s | warning |
| --- | --- | --- | --- | --- |
| 1.4 | 165.003927 | 0.014154851756 | 706.471546 | none |
| 0.9 | 165.003927 | 0.022018658288 | 454.160279 | the horizontal velocity above its limit |

The cut size is the same number on both rows. That is the cancellation from the last lesson made visible: a deeper basin gives a droplet further to travel and exactly proportionally longer to travel it, so the size of droplet that just gets out does not move.

## The plan area is what does buy a cut size

Now change the footprint instead:

| length m | width m | plan area m2 | surface loading m/s | cut micron | cut micron per root loading |
| --- | --- | --- | --- | --- | --- |
| 6 | 2 | 12.000000 | 0.004293638366 | 242.879204 | 3706.616030 |
| 10 | 2.6 | 26.000000 | 0.001981679246 | 165.003927 | 3706.616030 |
| 14 | 3 | 42.000000 | 0.001226753819 | 129.824395 | 3706.616030 |
| 20 | 4 | 80.000000 | 0.000644045755 | 94.066711 | 3706.616030 |

More floor, slower loading, finer cut. That much is intuition, and it is worth being precise about which input is doing the work. The plan area is the length times the width, so a basin made longer and a basin made wider by the same factor give the same cut size. Nothing in this device cares about the shape of the footprint. The last column is the interesting one.

## A constant column is a law

The last column is each cut size divided by the square root of the surface loading on its own row, and it prints the same figure on all four rows. A column that holds constant across a sweep is a statement about the form of the relationship: the cut size goes as the square root of the surface loading exactly, with nothing else hiding in it. If the engine carried an extra term in the flow, or a hidden dependence on the dimensions, that column would drift and the drift would be visible without anybody having to read the source. Building a sweep so that a column ought to hold still, and then looking at it, is one of the cheapest checks available on any model.

That has a blunt consequence for a designer. Halving the cut size costs four times the basin. Gravity separation runs into economics very quickly for exactly this reason, and it is why the rest of this course is about devices that get their driving force from somewhere other than a larger footprint.

## What the depth is for

The depth has not become useless. It dropped out of the cut size and it is doing work in the two columns beside it, and the next lesson is about those. A dimension that does not appear in the headline answer can still be the dimension that sizes the vessel, and reading a cut size as the whole answer is how a basin ends up too shallow to work.

{{panel:pw-water-explorer}}

## Exercise

Explain why a deeper basin does not cut finer. Then use the constant last column to say what a designer has to spend to halve the cut size, and describe in one sentence what a column that holds still across a sweep is telling you.
