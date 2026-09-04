# What shaft power is

Head is a requirement. Horsepower is what it costs to make that head, and the only thing standing between them is an efficiency the stage curve supplies.

{{panel:pd-power-explorer}}

## Two divisions and one constant

Hydraulic power is rate times head times specific gravity divided by HP_HEAD_DIVISOR, 135635.80083124. Brake power at the shaft is that divided by the efficiency read at the duty rate. No motor and no cable appears in either step.

| Case | Hydraulic, hp | Efficiency | Shaft, hp |
| --- | --- | --- | --- |
| Published gassyOffshore | 87.10569922 | 0.6929775821 | 125.69771587 |
| Published highWaterCut | 116.39870723 | 0.6745418519 | 172.55965200 |
| Teaching well QUA-IBOE-4 | 63.99471291 | 0.6706901367 | 95.41621294 |
| Teaching well IBENO-2 | 21.41688298 | 0.7193080800 | 29.77428389 |

The duty behind the first row is 2750.400000 bbl/d against 4978.341767 ft of head at a specific gravity of 0.8628600064.

## Gravity moves power and moves nothing else

The published vendor curve at 2500 bbl/d and 60 Hz reads 27.914286 ft of head and an efficiency of 0.73657143. Brake power per stage on a 1.00 specific gravity fluid is 0.69851755 hp. On a 0.90 fluid the same duty reads the same 27.914286 ft and the same 0.73657143, and the brake power falls to 0.62866580 hp.

Density is a load term. It does not touch the hydraulic shape.

## The pressure form of the same sentence

Written in pressure rather than head, the statement is horsepower equals rate times pressure difference over 58824. HP_HEAD_DIVISOR times 62.4 over 144 is 58775.513694, which stands 0.0008242606 away in relative terms from that familiar rounded 58824. Same physics, different rounding, and the engine carries the first form.

## What it refuses

It refuses to invent an efficiency. Brake power at zero efficiency is NaN. A stage curve fitted with no efficiency points returns ok true with a warning, then behaves exactly as the warning says: head at 2500 bbl/d still reads 27.914286 ft, the best efficiency rate is NaN and brake power per stage is NaN. The head half of the curve keeps working while the power half is absent.

It also refuses two points: the fit returns ok false, saying a stage curve needs at least three points from the vendor curve, and no head fit comes back.

## The mistake

Quoting hydraulic power as the motor duty. It is the smaller number every time: 87.10569922 hp against 125.69771587 hp on the published gassyOffshore design, 21.41688298 hp against 29.77428389 hp on the teaching well IBENO-2. A motor sized on the first of those pairs is short by the whole efficiency term, and nothing downstream notices, because every step after this one takes the number it is handed.

## Exercise

Read the hydraulic power and the efficiency for the published highWaterCut design in the panel and produce the shaft horsepower from them.

Then read the published vendor curve at 2500 bbl/d on both fluids and write down which of head, efficiency and brake power per stage moved.
