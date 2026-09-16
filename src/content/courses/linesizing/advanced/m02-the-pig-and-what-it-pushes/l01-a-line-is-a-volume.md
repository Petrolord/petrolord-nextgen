# A line is a volume

Every question so far has treated a pipe as a resistance. Pigging treats it as a container, and the container is the one thing about a line that no pressure drop reveals.

{{panel:fc-wall-pig-explorer}}

## Bore and length, nothing else

The OGBIA line is 7.981000 in of bore over 26400.000000 ft, and the engine holds it at 1633.5349 bbl. No fluid property enters that number. A line full of crude, a line full of gas and a line full of seawater are the same volume, because volume is geometry.

The published cases make the same point at three sizes.

| bore in | length ft | line volume bbl |
| --- | --- | --- |
| 2.067000 | 8000.000000 | 33.2033 |
| 6.065000 | 30000.000000 | 1071.9949 |
| 10.020000 | 52800.000000 | 5149.6679 |

## Where the barrel constant comes from

A volume in cubic feet becomes a volume in barrels through one constant, and the package now measures that constant out of the engine rather than typing it in. Ask lineHydraulics for the flow area times the length over its own line volume and it returns 5.6145833333333 cubic feet per barrel.

That figure is exact by definition rather than by measurement: forty-two gallons of two hundred and thirty-one cubic inches each, over the seventeen hundred and twenty-eight cubic inches in a cubic foot.

## What the volume is not

The line volume is the whole bore. It is not the liquid standing in the line, and on a wet gas line the two are very different quantities. The liquid is the line volume times a holdup, which is the subject of the next lesson and is the weakest link in the whole pigging chain.

So a line volume is a hard number and a liquid inventory is not, even though one is a multiple of the other.

## Where it declines to answer

The volume call is one of two places in this engine that hands back a bare number with nowhere to attach a message, the Reynolds number being the other. Asked for the volume of a line with no bore it returns NaN rather than an error object, and the functions wrapping it are what refuse in words. It is one of three returns that sit outside the refusal contract, and all three are taken apart properly in module 4.

## The mistake

The mistake is quoting a line volume as the slug a receiving facility must handle. The line holds 1633.5349 bbl and a pig run delivers a fraction of that, so sizing a catcher on the line volume oversizes it by whatever the holdup was never going to be.

The second mistake is recomputing barrels with a rounded constant. The engine's own figure is available and exact, and a hand conversion introduces a difference that then has to be explained.

## Exercise

Give the OGBIA line volume with the bore and length it comes from, and say which fluid properties entered it. Then state the cubic feet per barrel the package measures out of the engine, say why that constant is exact, and explain the difference between a line volume and the liquid standing in the line.
