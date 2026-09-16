# Where the number comes from

The module derives its coefficient in its own header, and the derivation admits no alternative once the equation of state is fixed. Walking it tells you which property of the gas the answer is sensitive to, and which ones never enter at all.

{{panel:fc-coldend-explorer}}

## The identity

Start from the thermodynamic definition, with the molar volume written as a compressibility times the ideal volume.

    mu = (1/Cp) [ T (dV/dT)_P - V ],  with V = z R T / P
    T (dV/dT)_P = (R/P)( T z + T^2 (dz/dT)_P ) = V + (R T^2 / P)(dz/dT)_P
    mu = (R T^2 / (Cp P)) (dz/dT)_P

The molar volume appears twice in the bracket and cancels. What is left is a temperature squared, a pressure, a heat capacity and one derivative.

## The derivative is where the answer lives

The temperature derivative of the compressibility is the only term in that expression that carries any real-gas behaviour at all. Everything else is a state variable or a caller input. It is also the term the module differentiates rather than assumes, using the same validated compressibility correlation the contactor sizing uses.

On AGBADA at 1180.000000 psia and 96.000000 degF with a gravity of 0.680000, the compressibility is 0.834003433 at a reduced pressure of 1.771625 and a reduced temperature of 1.491161, its temperature derivative is 0.001161871583 per degR, and the coefficient that follows is 0.061607962 degF per psi.

Nothing about the gas beyond its gravity enters that chain. The gravity sets the pseudo-criticals, the pseudo-criticals set the reduced pair, and the reduced pair sets the compressibility and its slope. That is the method's reach and its limit in one line.

## What the identity refuses to need

Read the final form again and notice what is absent. There is no composition and no enthalpy departure table. A method built on a gravity correlation cannot ask for any of them. That is why a rich condensate and a lean dry gas of the same gravity get the same compressibility surface here, and therefore the same slope.

## The heat capacity enters once

The heat capacity is a caller input, and the identity says it divides the whole answer. The module can be asked to prove that from outside, by holding the state fixed and moving only the heat capacity.

| Cp, Btu/lbmol.degF | mu, degF/100 psi | Cp times mu |
| --- | --- | --- |
| 8.500000 | 7.103036 | 0.603758030 |
| 9.500000 | 6.355348 | 0.603758030 |
| 10.500000 | 5.750076 | 0.603758030 |
| 12.000000 | 5.031317 | 0.603758030 |

The last column is the two figures on each row multiplied. It does not move down the table, and that is what says the heat capacity enters exactly once and as a divisor. Everything else the gas contributes sits in the other factor, untouched by which heat capacity was typed.

That matters at the seam. A caller who changes only the heat capacity changes the coefficient by a clean reciprocal. A caller who changes the gravity or the state changes it in a way no arithmetic on this page predicts.

## Exercise

Write the final form of the identity and name the four quantities left in it. Record the compressibility, the reduced pressure, the reduced temperature, the temperature derivative and the coefficient at the AGBADA inlet. Then record the four heat capacities in the table with their coefficients and their products, and say what the product column being flat tells you about where the heat capacity acts.
