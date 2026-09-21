# Flame length against the wind

{{panel:cq-fire}}

The last lesson of this module puts the flame length and the wind side by side and asks what the curve means for a target. A shorter flame sounds like good news for anyone standing nearby. It is only half the story, because the same wind that shortens the flame also tilts it, and the next module shows the tilt can matter more.

## The whole sweep for ERHA

ERHA is the stated heptane bund fire, 20 m across, burning at 0.101000 kg/(m2 s):

| wind at 10 m, m/s, stated | scaled wind speed u* | L/D | flame length m |
| --- | --- | --- | --- |
| 0 | 1.000000 | 1.787319 | 35.746382 |
| 2 | 1.000000 | 1.787319 | 35.746382 |
| 4 | 1.570953 | 1.625578 | 32.511563 |
| 8 | 3.141905 | 1.405373 | 28.107457 |
| 12 | 4.712858 | 1.290662 | 25.813232 |

## The shape of the curve

The curve is flat up to uc, 2.546226 m/s, and falls after it. The fall slows as the wind grows, because the length follows u* to the power minus 0.21. From 4 to 8 m/s the length loses more than from 8 to 12 m/s, although both steps add the same wind. A flame never shortens to nothing in this form; strong winds simply lay it over. The L/D column tells the same story without the diameter: it falls from 1.787319 to 1.290662 across the whole sweep, so even at 12 m/s ERHA's flame stays longer than the pool is wide.

## Two correlations for the same calm

The still air form gives ERHA 37.101102 m, an L/D of 1.855055. The wind form at no wind gives 35.746382 m, an L/D of 1.787319. The two correlations differ, and the difference is the fits themselves: different constants, 42 against 55, and different exponents, 0.61 against 0.67. The engine names the method in every call because the two are not interchangeable, and it never quietly falls back from one to the other when the wind drops.

## Which one a graded answer uses

Thomas with wind stands behind a published number, the Yellow Book pool fire, so it is the form this course grades. Thomas in still air rests on its transcription alone and is taught without a graded answer. When a capstone gives you a wind, it expects the wind form, with its scaled wind speed held at one below uc.

## A shorter flame is not the whole story

The wind that shortens ERHA from 35.746382 to 32.511563 m at 4 m/s also tilts it by 49.174202 degrees from the vertical. For a target downwind, a tilted flame leans closer and fills more of the view. The view factor module will show that tilting toward a target raises its view factor, and that can outweigh the shorter length. Carry the flame length forward as one input among several, and read the heat flux only at the end of the chain.

## Exercise

Work the fire panel on ERHA with the wind form at 4, 8 and 12 m/s and record each flame length. Compute by hand how much length is lost from 4 to 8 m/s and from 8 to 12 m/s, and state which step loses more. Then write one sentence explaining the difference from the exponent on the scaled wind speed.
