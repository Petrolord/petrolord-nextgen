# The oil case

The capstone substitutes gas, because gas is the extreme. Oil is the more common case and it behaves very differently, in a way that decides whether a survey can see it at all.

## The three fluids

From the Associate tier, at the Ekene conditions:

| fluid | bulk modulus | density (kg/m3) |
| --- | --- | --- |
| brine | 2697.8113 MPa | 1017.8249875 |
| live oil | 1142.7946 MPa | 777.0630099023522 |
| gas | 55.7187 MPa | 172.66679461728904 |

The oil is softer than brine by a factor of 2.4 and lighter by a quarter. The gas is softer than brine by a factor of 48 and lighter by a factor of 6.

Oil is a fluid. Gas is barely one, as far as the rock is concerned.

## What each does to the rock

Substituting each into the same frame:

| case | $v_p$ (m/s) | $v_s$ (m/s) | $\rho$ (kg/m3) | $K_{sat}$ (GPa) |
| --- | --- | --- | --- | --- |
| brine | 3200 | 1800 | 2250 | 13.32 |
| oil | 3008.378760376558 | 1824.570277381294 | 2189.809505600588 | 10.098526617678047 |
| gas | 2905.6972280296195 | 1890.9758806113214 | 2038.7104517793223 | 7.492988063073051 |

## Oil sits nearer brine than gas

The velocity drop from brine to oil is 191.6 m/s. The further drop from oil to gas is 102.7 m/s.

So oil covers about two thirds of the total drop, which sounds encouraging until you notice what that means: an oil sand and a gas sand differ by only a hundred metres per second, while an oil sand and a brine sand differ by nearly two hundred.

The same in impedance: brine 7.200e6, oil 6.587e6, gas 5.924e6. Oil is 8.5 percent below brine and gas is a further 10.1 percent below oil.

## What that means for interpretation

Two consequences, and the second is the one that costs money.

Distinguishing hydrocarbon from brine is comparatively easy here. An 8.5 percent impedance drop for oil is well above the noise on a decent survey.

Distinguishing oil from gas is much harder, and the two have wildly different values. A 10 percent impedance separation between an oil case and a gas case, on top of all the uncertainty in porosity and frame that this tier has already measured, is not a safe basis for a fluid call. Recall that a porosity uncertainty of plus or minus 0.05 moved the gas velocity by more than 300 m/s, which is three times the entire oil to gas separation.

So a bright amplitude says hydrocarbon, and it does not say which. Saying which needs something else: a fluid contact visible on the seismic, pressure data, or a well.

## Why oil is so much stiffer than gas

Because oil is a liquid and gas is not. A liquid's molecules are already close-packed, so compressing it means pushing molecules against their repulsive cores, which is hard. A gas at 25 MPa is dense but still compressible, because there is space between the molecules to remove.

Live oil sits between the two, and the amount of dissolved gas is what moves it. The Associate tier measured that: raising the gas to oil ratio softens the oil substantially. An oil with a high gas to oil ratio starts to behave more like gas, which blurs the distinction further.

## Worked example

Estimate how much gas it takes to make an oil sand look like a gas sand, using the tier's own machinery.

The oil case velocity is 3008.4 m/s. From the saturation curve, a brine and gas mixture reaches that velocity at a water saturation somewhere near 0.99, because one percent of gas already drops the velocity to 3078.9 and two percent takes it lower still.

So a sand holding oil looks, to a compressional velocity, roughly like a sand holding brine with one to two percent of its pore space as free gas.

That is an uncomfortable equivalence and it is real. It is the reason a bright spot can be produced by a commercially worthless amount of residual gas, and why the phrase fizz gas exists. The next module is about exactly this.

## Exercise

A prospect is expected to hold either oil or gas, and the interpreter proposes to tell them apart from the amplitude. State the objection, using numbers from this lesson.

Self check: the oil and gas cases differ by about 10 percent in impedance, while the porosity uncertainty alone moves the predicted velocity by over 300 m/s, which is three times the oil to gas velocity separation of 103 m/s. The amplitude therefore cannot distinguish the two cases, although it can distinguish either of them from brine, which is an 8.5 percent step for oil and 17.7 percent for gas.
