# The ledger

Four targets, before and after. The table is the tier's central object.

{{panel:fluid-tuning-explorer}}

## The numbers

| target | measured | untuned | tuned | error before | error after |
|---|---|---|---|---|---|
| saturation pressure (psia) | 2634.65 | 2791.100735294379 | 2632.64216695564 | +5.938198064045652 pct | -0.0762087201093226 pct |
| total GOR (scf/stb) | 768 | 793.8042771796476 | 761.7262989883229 | +3.3599319244332757 pct | -0.8168881525621193 pct |
| stock tank gravity (API) | 40.7 | 31.8056416463794 | 38.755039373806255 | -8.894358353620603 | -1.9449606261937475 |
| formation volume factor (rb/stb) | 1.474 | 1.4694525613484382 | 1.4573161052573853 | -0.30851008490921433 pct | -1.131878883488105 pct |

Sum of squared residuals falls from 0.007631032308112891 to 0.00032953309314853003, a factor of

$$23.157104602764026$$

No knob hits a bound.

## Read the columns before the rows

**Saturation pressure** went from six percent out to under a tenth of a percent. That is the target the tuning was most able to fix, because three of the four knobs act on the phase equilibrium.

**Stock tank gravity** went from nine API out to under two. The volume shift knob did that almost single-handedly, and it is the largest absolute improvement in the table.

**Total gas-oil ratio** went from three percent out to under one. A real improvement.

**Formation volume factor** went from 0.31 percent out to 1.13 percent out. It got WORSE.

## The one that got worse

That is the row this module exists for.

Bo was the best-matched target before tuning. It was the only one of the four that an untuned model got right to within half a percent, and the regression gave it up in order to improve the other three.

Nothing went wrong. The solver minimised the total squared residual and it found a point where the sum is twenty three times smaller, and reaching that point required moving Bo from 0.31 percent to 1.13 percent. Traded, deliberately, by an algorithm doing exactly what it was asked.

## Why the trade exists

Total gas-oil ratio and stock tank gravity share the stock-tank volume.

Both are computed from the same separator train. GOR is gas divided by stock tank liquid volume; API gravity is the density of that same liquid. Change the volume shift to make the liquid lighter and its VOLUME changes too, which moves the GOR denominator.

So the knob that fixes the gravity necessarily disturbs the gas-oil ratio, and the formation volume factor, which is reservoir volume divided by that same stock tank volume, moves with it.

Three of the four targets are coupled through one quantity. There is no setting of four knobs that makes all four exact.

## What the ledger is for

Reporting.

A tuned model quoted as "matched to the laboratory data" is a claim with no content. The ledger says exactly what was matched, how well, and what was given up, and it fits in one table.

It also tells a reader which of the model's outputs to trust for their question. Somebody who needs a formation volume factor should know that this fit made that target worse and that the untuned model was closer on it.

## The misconception to avoid

"A twenty-three-fold reduction in the residual means the model is twenty-three times better." It means the sum of squared relative errors is twenty three times smaller, which is dominated by the two targets that were worst. A single aggregate number hides that one target degraded, which is why the ledger is per target and the aggregate is a footnote.

## Exercise

First, reproduce the ledger with the four targets, and mark the one that got worse.

Second, explain in two sentences why total gas-oil ratio, stock tank gravity and formation volume factor cannot be independently fitted.
