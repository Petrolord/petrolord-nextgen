# The gas, the plan area and the flux

Gas rate is the input everyone reaches for first on a flotation cell, and on its own it does not decide anything. What the model uses is the gas flux, which is the gas rate divided by the area it rises through.

{{panel:pw-device-explorer}}

## The gas rate, stated per cell

Gas here is fed as a ratio to the water flow, and it is fed to EACH cell. At a ratio of 0.25 on the KOKORI flow that is 0.034502451156 m3/s per cell, and with five cells in the bank, 0.172512255781 m3/s in all.

The return reports both figures. That matters because the two are different quantities and a reader comparing arrangements needs to know which one a menu setting moved. Four cells at a ratio use four times the gas of one cell at the same ratio.

## Turning a cell volume into an area

A cell is specified here by its volume, and bubbles rise through an AREA. The module gets one from the other with the cell depth, which is an input:

plan area is the cell volume divided by the cell depth.

At 12 m3 and a depth of 2.8 m that is 4.285714 m2. The superficial gas velocity is then the gas rate per cell over that plan area, 0.008050571936 m/s. That figure is the flux the rest of the chain runs on.

## Why the depth is an input rather than a detail

Depth does not appear in a residence time argument at all: residence is volume over flow and the shape of the box is irrelevant to it. It appears here because the shape of the box decides how concentrated the gas is:

| cell depth m | plan area m2 | superficial gas m/s | cut micron |
| --- | --- | --- | --- |
| 1.5 | 8.000000 | 0.004312806395 | 32.427302 |
| 2.8 | 4.285714 | 0.008050571936 | 23.734355 |
| 4 | 3.000000 | 0.011500817052 | 19.857586 |
| 6 | 2.000000 | 0.017251225578 | 16.213651 |

A DEEPER cell at the same volume is a NARROWER cell, so the same gas rises through less plan area, the gas flux is higher and the cut is finer. Nothing about that is obvious from a residence time, which is why the depth had to become an input of its own.

## The shape of the argument

Read those two steps together and the pattern is the one the whole tier is built on. A cut size is computed from the equipment's own geometry, and the geometry enters through a specific quantity the model can name. For a basin it was the plan area. For a liner it was a radial gap. Here it is the area the gas has to spread over, and a cell specified only by its volume has not said enough.

## Exercise

Take the 12 m3 cell and change its depth from 2.8 m to 6 m in the panel. Read the plan area, the superficial gas velocity and the cut at each.

Then say what stayed the same across that change, and why the residence time argument alone could not have predicted the result.
