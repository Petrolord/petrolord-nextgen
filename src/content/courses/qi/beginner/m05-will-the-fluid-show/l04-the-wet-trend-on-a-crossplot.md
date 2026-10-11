# The wet trend on a crossplot

A fluid effect means something only against a background. On a crossplot of AVO intercept A against gradient B, brine-filled rock boundaries fall along a line through the origin. The wet trend is that line fitted to the well's own boundaries after every oil-bearing sample has been taken to brine, so a hydrocarbon interface can be judged by how far it falls off it.

{{video:qi-b6}}

## The method

The panel draws the wet trend the same way QI Studio and Rock Physics Studio do:

- every sample of the window with oil in it (Sw below 1) is taken to brine by the substitution of the previous lessons;
- the logs are blocked into blocks of the stated length, each block carrying its mean Vp, Vs and density (`blockLogs`);
- every boundary between two blocks gives an intercept A and a gradient B by Shuey (1985) (`interfacePoints`);
- the fluid line through the origin is fitted by total least squares, the principal axis of the points about the origin (`fitFluidLine`).

Total least squares treats neither A nor B as free of error, which suits two quantities computed from the same blocks. The Rock Physics course derives Shuey's intercept and gradient.

## Ekene-1, block length 16 ft

The whole pack window holds 800 samples, 79 of them substituted. Blocks of 16 ft (32 samples of 0.500000 ft) give 25 blocks and 24 interfaces. The fitted line has slope B / A of -2.257963, an angle of -66.112544 degrees, and a root mean square distance of the points from it of 0.006806. The first eight points:

| depth of the lower block ft | A | B |
| --- | --- | --- |
| 4947.500000 | -0.002222 | -0.000052 |
| 4963.500000 | -0.001288 | 0.000016 |
| 4979.500000 | -0.001060 | -0.000212 |
| 4995.500000 | 0.000405 | -0.005313 |
| 5011.500000 | -0.001565 | 0.005908 |
| 5027.500000 | -0.001460 | -0.000371 |
| 5043.500000 | 0.003238 | 0.002240 |
| 5059.500000 | 0.000627 | -0.001871 |

Most boundaries inside the shale give small A and B near the origin. The line is set by the stronger contrasts, and the rms distance says how tightly the boundaries cluster about it.

## The published line

Castagna, Swan and Foster (1998) give a background slope for a constant Vs/Vp and a Gardner density exponent g: B / A = (1 - 4 (Vs/Vp)^2 (g + 2)) / (1 + g). With g 0.25 and the blocks' mean Vs/Vp of 0.408987, `backgroundSlope` returns -0.404345. The published line is far shallower than the fitted one. It assumes one Vs/Vp for every boundary; the fitted line reads the Ekene boundaries as they are. A lesson names which line it means.

## The block length is a stated choice

| block length ft | samples a block | interfaces | fitted slope | rms distance |
| --- | --- | --- | --- | --- |
| 8 | 16 | 49 | -2.565814 | 0.006424 |
| 16 | 32 | 24 | -2.257963 | 0.006806 |
| 24 | 48 | 16 | -2.254272 | 0.005925 |

Shorter blocks give more boundaries and a steeper line; longer blocks fewer boundaries and a slope that settles. Every distance read from the trend inherits this choice.

## Refusals

> A fluid line needs at least three interfaces.

> Vs/Vp must be between 0 and 1.

The first came from `fitFluidLine` given two interfaces, the second from `backgroundSlope` given a Vs/Vp of 1.2.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Wet trend and distance" and Data to "Ekene pack: Ekene-1". Check the sample, substituted, block and interface tiles and the fitted slope against this lesson. Set "Block length, ft (stated)" to 8, then 24, and confirm the table above. Try a block length long enough to leave fewer than three interfaces and read the refusal. Restore 16, then switch Data to Ekene-3 and compare its fitted slope and its published slope with Ekene-1's.
