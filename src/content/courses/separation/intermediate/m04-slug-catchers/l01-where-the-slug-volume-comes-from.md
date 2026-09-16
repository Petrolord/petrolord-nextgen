# Where the slug volume comes from

The slug volume is an input to this engine and never an output of it. ABANA takes a 350.000000 bbl slug, and that figure arrives from the line rather than from any calculation in the separator studio.

{{panel:fc-slug-explorer}}

## Somebody else computes it

A slug is made in the pipeline. Terrain, liquid holdup, flow regime and pigging decide how much liquid arrives in one piece, and the pigging tab of the line sizing studio is where that is worked out. The slug catcher tab takes the answer as a number somebody else stands behind.

That division is deliberate. Sizing a vessel to hold a volume is a different problem from predicting the volume, and an engine that guessed the second in order to answer the first would hide the weaker of the two numbers inside the stronger.

## No slug, no answer

Ask for a slug catcher with no slug volume and the engine returns a state rather than a size: { error: "a slug volume is needed (the line sizing studio computes it)" }.

The message names where the missing number lives. That is the difference between a refusal and an obstacle: the reader is told which studio to open, rather than being left to invent a figure that will then be sized to six decimals.

## The volumes on the published cases

| case | slug bbl |
| --- | --- |
| vessel200bblSlugLd4 | 200.000000 |
| vessel1200bblSlugLd5 | 1200.000000 |
| finger1500bbl6x24in | 1500.000000 |
| finger500bbl4x16in | 500.000000 |

The spread across those four cases is a factor of seven and a half, and every dimension the engine returns for them follows from it. A slug catcher is one of the few vessels on a plant whose whole size is set by a single upstream number, so the quality of the design can never be better than the quality of that number.

## The mistake

The mistake is treating the slug volume as a rounded convenience. A figure of 350.000000 bbl typed because it looked about right sizes a drum of 10.527155 ft by 42.108619 ft with complete conviction, and nothing on the output says the input was a guess.

The second mistake is assuming the slug volume covers everything the vessel has to hold. It does not. The slug is what arrives in one piece, and the normal production that keeps arriving while the vessel is draining is counted separately.

## Exercise

State where the slug volume of 350.000000 bbl comes from and what the engine returns when it is missing. Then give the slug volumes of the four published cases, and explain why the engine refuses to compute the slug itself rather than estimating it.
