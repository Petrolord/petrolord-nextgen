# The story so far

An equation of state opened, run, and tuned, on a fluid somebody measured.

## The equation

A cubic, because the cubic FORM produces the phase behaviour rather than having it attached: one real root means one phase, three means two, and the largest and smallest are the vapour and liquid volumes.

Peng-Robinson 1978, whose kappa takes a cubic branch above an acentric factor of 0.49. Good Oil's C7+ pseudo-component has an acentric factor of 0.6690835265426222, so it takes that branch, which makes the 1978 modification structural rather than optional for every heavy fraction in every reservoir fluid.

Mixing by van der Waals one-fluid rules, with a binary interaction parameter on every pair. The C1 to C7+ parameter comes from a modified Chueh-Prausnitz correlation, because the pseudo-component has no published pair data, and the engine records that a different published choice was investigated and could not be verified in any accessible source.

Equilibrium is equal fugacity, component by component. K values follow from the fugacity coefficients rather than being an input to them. Volume translation shifts the densities and provably cancels in the equilibrium, which is why it is free.

## The machinery

**Stability first, flash second.** A flash can converge on a trivial solution, so the number of phases is decided by a Michelsen stability test run from both the vapour and the liquid side, and its trial composition seeds the flash.

**Rachford-Rice for the split**, because subtracting the two sum-to-one constraints gives a strictly monotonic function with exactly one root. Negative flash is allowed deliberately, because an excursion outside zero to one carries information about how far into the single-phase region the mixture is.

**Saturation pressure by search**, a logarithmic scan followed by a bisection to 0.05 psia, then classified as a bubble or a dew point by probing just inside the two-phase region.

## The tuning

Four bounded knobs on the C7+ pseudo-component and nothing else, because those are the constructed quantities and everything else was measured.

| knob | tuned |
|---|---|
| fTc | 0.9963403431519178 |
| fPc | 0.9827953945642255 |
| kC1 | 0.050325447877585576 |
| sPlus | 0.12266364195926757 |

The criticals barely move, which says the Kesler-Lee characterization was close. The volume shift moves by about a fifth, which says the Jhaveri-Youngren correlation was not, and that is exactly what the Professional tier predicted from the mechanism.

No knob hits a bound.

## The gotcha that made it work

The saturation pressure is computed by a bisection with a tolerance of 0.05 psia, so it is quantized. A default finite-difference step of one part in a million moved it by less than one quantum, the derivative came back zero, and the solver concluded that three of the four knobs did nothing.

The regression converged, reported success, and left them almost untouched. Nothing errored.

The fix was an explicit absolute Jacobian step of one part in a thousand, which required a backward-compatible per-parameter option on the shared Levenberg-Marquardt kernel. A quantized objective is a general trap and its symptom is always a parameter the solver decides has no effect.

## The ledger

| target | untuned error | tuned error |
|---|---|---|
| saturation pressure | +5.938198064045652 pct | -0.0762087201093226 pct |
| total GOR | +3.3599319244332757 pct | -0.8168881525621193 pct |
| stock tank gravity | -8.894358353620603 API | -1.9449606261937475 API |
| formation volume factor | -0.30851008490921433 pct | -1.131878883488105 pct |

Residual down by a factor of 23.157104602764026.

Three targets improved and one got worse, and the one that got worse was the best-matched target before tuning. Total gas-oil ratio, stock tank gravity and formation volume factor all divide by the same stock-tank volume, so no setting of four knobs makes all four exact. That frontier is physical rather than numerical, and running the solver longer does not move it.

## What grades nothing

The module on `screening` quantities: LBC viscosity, interfacial tension, and the black-oil separator's gas partition.

All three are taught with their mechanisms and their limits, and no capstone field touches them. Teaching a number and certifying somebody can produce it are different acts, and the second implies the number is worth producing.

## What the three tiers say together

The Associate tier ran correlations on a designed fluid. The Professional tier read a real study and measured an untuned model against it. This tier opened the model, tuned it, and reported what the tuning cost.

Nobody measured anything in any of the three. What changed is how much was known about where each number came from.

## Exercise

First, write the one-paragraph technical summary of this tuned model a reservoir engineer joining the study should read first, containing one number from each tier and one caveat.

Second, of everything above, name the two decisions you would most want reviewed by somebody else before using this model for a forecast, and say why.
