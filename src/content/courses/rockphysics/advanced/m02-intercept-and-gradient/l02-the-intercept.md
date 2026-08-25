# The intercept

The intercept is the reflection at zero offset. It is the number a stacked section is closest to showing, and at Ekene it is where the fluid substitution changes the sign.

## The two values

$$A_{brine} = 0.03434399848203321, \qquad A_{gas} = -0.06282494068620303$$

Positive to negative, and nearly twice the magnitude.

## The two halves

$$A = \frac{1}{2}\left(\frac{\Delta v_p}{\bar{v}_p} + \frac{\Delta \rho}{\bar{\rho}}\right)$$

For the gas case those halves are

$$\frac{1}{2}\frac{\Delta v_p}{\bar{v}_p} = +0.028802610843132695, \qquad \frac{1}{2}\frac{\Delta \rho}{\bar{\rho}} = -0.09162755152933573$$

The velocity half is positive because the gas sand is faster than the shale. The density half is negative and more than three times larger.

For the brine case the two halves are $+0.076897$ and $-0.042553$: the velocity half is larger and positive, so the intercept is positive.

So the substitution changed the sign of the intercept by changing the balance between two terms, neither of which changed sign itself.

## What that tells you about gas anomalies

The intercept is a density observation more than a velocity one, for this rock.

That runs against the usual mental model, in which gas is thought of as making rock slow. It does, but at this interface not slow enough to beat the shale, and the visible effect is that gas makes the rock light.

The general version is worth carrying: a bright negative reflection at the top of a gas sand is usually an impedance contrast in which the density is doing at least half the work, and sometimes all of it.

That has a practical consequence. Anything that would change the density prediction, chiefly the porosity and the gas density at reservoir conditions, moves the intercept directly. The Associate tier's conditions discipline shows up here: a gas density computed at the wrong pressure moves the intercept.

## Intercept against normal incidence

The intercept is not exactly the normal incidence reflection coefficient. It is the linearised version of it.

| case | Shuey intercept | exact at zero degrees | difference |
| --- | --- | --- | --- |
| brine | 0.03434399848203321 | 0.034457 | -0.000113 |
| gas | -0.06282494068620303 | -0.0629911815139045 | 0.000166 |

Both differences are in the fourth decimal, and both are small relative to the values themselves. They are not zero, and a reader who expects the intercept to be the normal incidence coefficient exactly will be puzzled by a mismatch that is really just linearisation.

## Reading it off the panel

The two intercept tiles carry these values, and the chart shows them as the left hand ends of the curves.

{{panel:rp-avo-explorer}}

Look at where each curve meets the left hand axis. The blue brine curve starts just above the zero line and the amber gas curve well below it, and the gas curve starts about twice as far from zero.

Note that the solid and dashed lines are already slightly apart at zero degrees. That separation is the table above, drawn.

## Worked example

Work out how much of the intercept change is density and how much is velocity, by substituting one at a time.

Start from the brine case at 0.03434399848203321.

Change only the density to the gas value, holding the velocities at their brine values. The velocity half stays at $+0.076897$ and the density half becomes $\tfrac{1}{2}(2038.7105 - 2450)/2244.3552 = -0.091628$. The intercept would be $-0.014730$.

Now also change the velocity to the gas value. The velocity half falls to $+0.02880$ and the intercept reaches $-0.06282$.

So the density change alone flips the sign, taking the intercept from $+0.034344$ to $-0.014730$, and the velocity change then more than quadruples the negative value. Density does the qualitative work and velocity does the quantitative work.

## Exercise

A gas sand shows a strong negative intercept and the interpreter attributes it entirely to the gas making the rock slow. State the objection using the Ekene numbers.

Self check: at Ekene the gas sand is 162.70 m/s faster than the shale above it, so the velocity contrast is positive and works against a negative reflection. The negative intercept comes from the density, which falls by 411.29 kg/m3 across the interface and contributes more than three times as much to the intercept as the velocity does. Attributing the anomaly to velocity alone would predict the wrong sign.
