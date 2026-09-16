# Lean, rich, and the swing between them

Loading is how much acid gas a mole of amine is carrying. It has two values in a working loop, one at each end, and the difference between them is what does all the work.

## The swing

Amine leaves the regenerator lean and comes back from the contactor rich. On UBIE the rich end is 0.480000 and the lean end is 0.050000, so each mole of amine carries 0.430000000 mol of acid gas per mol of amine between the two.

That difference is the swing, and it is the only loading figure the circulation actually depends on. Two loops whose loadings sit at quite different absolute values will move the same number of gallons if the difference between their two ends is the same.

Both ends are inputs. The engine offers each amine's customary rich limit as a default and takes a lean loading from the caller, and it computes neither. That is the module's doctrine showing through again: a loading is an operating choice and a piece of solvent chemistry, so it is typed in with its customary value named rather than invented by the arithmetic.

{{panel:fc-absorber-explorer}}

## Moving the rich end

| rich loading | swing | circulation, gpm | regenerator, MMBtu/hr | warning |
| --- | --- | --- | --- | --- |
| 0.300000 | 0.250000000 | 904.535983 | 43.417727 | no |
| 0.380000 | 0.330000000 | 685.254532 | 32.892218 | no |
| 0.440000 | 0.390000000 | 579.830758 | 27.831876 | no |
| 0.480000 | 0.430000000 | 525.893013 | 25.242865 | no |
| 0.500000 | 0.450000000 | 502.519990 | 24.120960 | no |
| 0.550000 | 0.500000000 | 452.267991 | 21.708864 | yes |

The lean end is held at 0.050000 down that table, so the swing column is the rich column with the lean subtracted, and the circulation and duty follow the swing.

The final column is a warning rather than a refusal. The engine answers on that row and hands back a circulation and a duty alongside the note, because a loading above a customary limit is a decision somebody may have taken deliberately. The next module is about what that warning is for.

## Moving the lean end

| lean loading | swing | circulation, gpm | regenerator, MMBtu/hr |
| --- | --- | --- | --- |
| 0.010000 | 0.470000000 | 481.136161 | 23.094536 |
| 0.030000 | 0.450000000 | 502.519990 | 24.120960 |
| 0.050000 | 0.430000000 | 525.893013 | 25.242865 |
| 0.080000 | 0.400000000 | 565.334989 | 27.136079 |
| 0.120000 | 0.360000000 | 628.149988 | 30.151199 |

Read that duty column carefully, because it is easy to misread. In this module the regenerator duty is a stated number of Btu on every gallon circulated, so it moves with the gallons and with nothing else. Stripping the amine down to a leaner lean is real work in a real still, and that work is not what this column measures. What the table shows is the loop that a leaner lean allows, which is a smaller one.

## Two tables, one lever

Read the two tables together and something useful appears. The row at a rich loading of 0.500000 and the row at a lean loading of 0.030000 both carry a swing of 0.450000000, and both report 502.519990 gpm and 24.120960 MMBtu an hour. The engine is not tracking where the swing came from. It is tracking the swing.

That is why the swing is the whole lever. Two quite different pieces of plant work, one in the contactor and one in the still, arrive in the balance as the same subtraction, and the engine will not tell you which of them is the cheaper place to find it.

## Exercise

Record the rich loading, the lean loading and the swing on UBIE, with the circulation and regenerator duty they give. Then find the row in each table that carries a swing of 0.450000000 and say what the engine reports for both.
