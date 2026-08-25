# Greenberg-Castagna

The lithology aware estimator fits a separate curve to each rock type and then mixes them. It is the method the capstone uses, and its mixing rule is unusual enough to be worth doing by hand.

## The per lithology curves

Greenberg and Castagna fitted a quadratic in compressional velocity for each of four lithologies, with velocities in kilometres per second:

$$v_s = a_2 v_p^2 + a_1 v_p + a_0$$

| lithology | $a_2$ | $a_1$ | $a_0$ |
| --- | --- | --- | --- |
| sandstone | 0 | 0.80416 | -0.85588 |
| limestone | -0.05508 | 1.01677 | -1.03049 |
| dolomite | 0 | 0.58321 | -0.07775 |
| shale | 0 | 0.76969 | -0.86735 |

Three of the four are straight lines. Only limestone carries a quadratic term.

At the Ekene target of 3000 m/s, which is 3.0 km/s:

$$v_s^{sand} = (0.80416 \times 3.0 - 0.85588) \times 1000 = 1556.6 \ \mathrm{m/s}$$

$$v_s^{shale} = (0.76969 \times 3.0 - 0.86735) \times 1000 = 1441.72 \ \mathrm{m/s}$$

The sand is 115 m/s stiffer in shear than the shale at the same compressional velocity, which is the lithology effect the mudrock line averages away.

## The mixing rule

This is the part worth attention. The composite is not a simple volume weighted average. It is the mean of the arithmetic and harmonic means of the per lithology estimates.

For the 70/30 frame:

$$\text{arithmetic} = 0.7 \times 1556.6 + 0.3 \times 1441.72 = 1522.136 \ \mathrm{m/s}$$

$$\text{harmonic} = \left(\frac{0.7}{1556.6} + \frac{0.3}{1441.72}\right)^{-1} = 1520.2585531342977 \ \mathrm{m/s}$$

$$v_s = \tfrac{1}{2}(1522.136 + 1520.2585531342977) = 1521.197276567149 \ \mathrm{m/s}$$

which is the sixth capstone value, reachable with a calculator in four lines.

## Why that mixing rule

It is the same idea as the Voigt Reuss Hill average from the Associate tier, applied to velocities instead of moduli.

An arithmetic mean is the stiffest plausible mixture, corresponding to the components acting in parallel. A harmonic mean is the softest, corresponding to them acting in series. The truth is between, and averaging the two is a defensible way of splitting the difference when the actual geometry of the mixture is unknown.

Here the two means are only 1.88 m/s apart, so the choice barely matters. That is because the two lithologies have similar shear velocities at this compressional velocity. The bound spread would be much wider for a mixture of quartz and a genuinely soft component, and then the mixing rule would matter more.

That echoes what the Associate tier found for the mineral frame: the bulk modulus bounds were tight and the shear modulus bounds were wide, because quartz and clay differ far more in shear than in bulk.

## Against the mudrock line

At 3000 m/s the two estimators give 1521.197276567149 and 1413.8999999999996, a difference of 107.29727656714931 m/s.

Seven percent in shear velocity is a large error to carry into a substitution. It propagates into the shear modulus as roughly twice that, since $\mu$ goes as the square, and from there into every quantity in the tier.

So lithology matters, and the value of the Greenberg-Castagna method is that it lets you say so.

## Worked example

Show how sensitive the composite is to the lithology split, which is itself an estimate.

At 3000 m/s the pure sand estimate is 1556.6 and the pure shale estimate is 1441.72. The 70/30 mixture gives 1521.20.

A 60/40 split would give an arithmetic mean of $0.6 \times 1556.6 + 0.4 \times 1441.72 = 1510.65$, and the composite would land near 1509.6.

So ten percent of clay volume is worth about 11.6 m/s in the estimate. Compare that with the 107 m/s that using the mudrock line instead costs, and the ranking is clear: choosing a lithology aware method matters about ten times more than getting the split exactly right.

## Exercise

Estimate the shear velocity for a clean sandstone at 4000 m/s using the sandstone curve, and say what its velocity ratio would be.

Self check: $v_s = (0.80416 \times 4.0 - 0.85588) \times 1000 = 2360.76$ m/s, giving a velocity ratio of $4000/2360.76 = 1.694$. That is a plausible ratio for a consolidated brine sand and it is lower than the Ekene sand's 1.778, which is consistent with a faster, better cemented rock.
