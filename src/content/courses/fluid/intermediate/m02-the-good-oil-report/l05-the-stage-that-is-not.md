# The stage that is not

The stock tank is a flash stage and the report does not list it. Forgetting it is the commonest way to reproduce a separator test wrongly.

## What the report says and what it means

The report lists a separator at 100 psig and 75 F. That is one stage.

The physical process has two: the separator at 114.65 psia, and then the stock tank at 14.65 psia and 75 F. Liquid arriving in a tank at atmospheric pressure from a vessel at 114.65 psia releases gas, and it releases a lot of it.

The report's total gas-oil ratio of 768 scf/stb includes that tank gas. The report simply does not call the tank a separator, because it is not equipment anybody specified.

## What the engine does about it

The fixture stores the reported stage: 75 F at 114.65 psia. When the engine reproduces the study it appends the stock tank stage at 75 F and 14.65 psia explicitly.

That appended stage is not in the report. It is the modelling step that turns a reported test into a reproducible calculation, and it has to be written down somewhere or the calculation is not reproducible.

## What happens if you leave it out

Run the separator train with one stage only, from the bubble point to 114.65 psia, and call the liquid the stock tank oil.

**The gas-oil ratio is too low**, because the tank gas is missing.

**The stock tank volume is too large**, because the liquid still contains the components that would have flashed off.

**The formation volume factor is too small**, because it divides by that inflated volume.

**The stock tank gravity is too low**, meaning too heavy, because the liquid retains material that should have gone to gas... except that this one is less obvious than it looks, since the retained components are intermediates and their effect on density is not trivially signed.

Three of those four errors point in a consistent direction and none of them makes the calculation fail. The model runs, produces a full set of numbers, and every one of them is wrong.

## Why this is the classic error

Because it is a reading error rather than a physics error. Everything about the model can be correct and the input is one stage short.

It is also invisible in isolation. A total gas-oil ratio of 700 scf/stb on a 40 API oil is entirely plausible. It only shows up when the answer is compared against a measurement, which is exactly why the comparison is worth making.

## The general shape

This is the same lesson the simulation course found with a keyword that persists when a well is missing from a period: the model does something reasonable with incomplete input rather than refusing.

The defence is the same too. Know what the answer should be before you compute it. A separator test whose reported total gas-oil ratio is 768 and whose model gives 700 has a missing stage, and you can only see that if you were holding the 768 in advance.

## The check

Reproduce the report's own numbers before using the model for anything else. If a model cannot return 768 scf/stb and 40.7 API within a stated tolerance for a study whose conditions it has been given exactly, it is not ready to be asked about anything the study did not measure.

That is the whole idea of an armed literature gate, and it is why the engine has one for this fluid.

## The misconception to avoid

"The tank is at atmospheric pressure so nothing happens there." A great deal happens there. The pressure drops by a factor of eight from the separator and the light and intermediate components come out. Tank vapour recovery exists as an industry precisely because that stream is worth catching.

## Exercise

First, state the two flash stages needed to reproduce Good Oil's optimum separator test, with pressures and temperatures, and say which one the report lists.

Second, list what happens to the total gas-oil ratio, the stock tank volume and the formation volume factor if the stock tank stage is omitted, and say why none of those errors makes the calculation fail.
