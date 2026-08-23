# Acoustic impedance

Velocity and density each describe the rock. Neither, by itself, tells you whether a seismic wave will reflect. The property that does is acoustic impedance, and it is simply the product of the two.

$$Z = \rho v$$

where $\rho$ is bulk density and $v$ is compressional velocity. Everything in the rest of this course, and a large part of quantitative seismic interpretation generally, rests on that one line.

## What impedance means physically

Impedance measures how strongly a material resists being moved by a passing wave. Think of it as the rock's reluctance to particle motion. A heavy, stiff rock resists strongly and has high impedance. A light, compliant rock gives way more easily and has low impedance.

Both factors contribute for the same reason. Velocity is high when the rock is stiff, because stiffness is what makes a disturbance propagate quickly. Density is high when there is more mass to be moved per unit volume. Stiff and heavy together means hard to disturb, which is what high impedance describes.

The consequence follows immediately. A wave travelling through a single material of uniform impedance carries on undisturbed, because there is nothing for it to reflect from. Only when the wave arrives at a boundary where impedance CHANGES is part of its energy turned back. Reflections are produced by contrast in impedance, not by the absolute value of impedance.

It is worth stating twice, because it is the most common conceptual gap in early seismic work. A very high impedance layer sitting inside an equally high impedance section produces no reflection at all. A modest impedance layer sitting inside a very different section produces a strong one. The seismic trace is blind to absolute impedance and sensitive only to the steps between neighbouring values. Module 4 turns that idea into a formula.

## Units in this course

The multiplication needs units, and here the course makes a working choice and states it openly. Velocity is carried in metres per second and density in grams per cubic centimetre, so impedance comes out in (m/s) times (g/cc).

That is not an SI unit. Strict SI would use kilograms per cubic metre for density, giving impedance in kg per square metre per second, and the numbers would be a thousand times larger. Packages and textbooks differ, and a number quoted without its convention is not a number you can check.

The course states the convention plainly because the capstone grades an impedance value, and a value graded in the wrong units is simply wrong. Confirm which convention any other tool uses before comparing. The engine works in (m/s) times (g/cc) throughout, as recorded in the synthetics module header.

## Worked examples

Take three anchor depths from the previous two lessons and carry each one all the way to impedance. Each computation is two steps: convert slowness to velocity, then multiply by density.

**At 1500 m**, DT is 399.737 us/m and RHOB is 2.1893 g/cc.

1. $v = 1000000 / 399.737 = 2501.65$ m/s
2. $Z = v \times 2.1893 = 5476.85$

**At 1580 m**, DT is 305.142 us/m and RHOB is 2.4349 g/cc.

1. $v = 1000000 / 305.142 = 3277.17$ m/s
2. $Z = v \times 2.4349 = 7979.58$

**At 1650 m**, DT is 277.473 us/m and RHOB is 2.2724 g/cc.

1. $v = 1000000 / 277.473 = 3603.96$ m/s
2. $Z = v \times 2.2724 = 8189.64$

A note on precision before you check these on a calculator. The velocities are quoted to two decimal places for readability, while the engine carries the full value through to the multiplication. Round the velocity first and the last digit of the impedance can shift by a hundredth. That is rounding noise, and it explains any small disagreement between your calculator and the printed value.

## Reading the three results together

Impedance climbs from 5476.85 at 1500 m to 7979.58 at 1580 m to 8189.64 at 1650 m. Ask which factor drove the climb.

Between 1500 m and 1580 m both factors rose. Velocity went from 2501.65 to 3277.17, a gain of about thirty one percent, while density went from 2.1893 to 2.4349, a gain of about eleven percent. They pushed in the same direction and the impedance rose steeply, by roughly forty six percent. This is the ordinary compaction case, and it is why velocity and density are so often correlated in clastics.

Between 1580 m and 1650 m the two factors disagree. Velocity kept rising, from 3277.17 to 3603.96, but density fell back from 2.4349 to 2.2724. The two effects partly cancelled, and impedance rose only modestly, from 7979.58 to 8189.64. Had the density fallen a little further, impedance would have been flat or lower despite the faster rock, and the boundary would have gone quiet on the seismic.

That is the argument of the previous lesson made concrete. Velocity alone would predict a strong contrast at 1650 m. Impedance, which knows about both curves, predicts a weak one.

## Exercise

Compute the impedance at 1582 m, where DT is 313.949 us/m and RHOB is 2.4181 g/cc, and at 1600 m, where DT is 383.856 us/m and RHOB is 2.2593 g/cc. Then state which of the two depths a wave would find harder to disturb, and roughly how large the contrast between them is.

Self-check: at 1582 m, $v = 1000000 / 313.949 = 3185.23$ m/s and $Z = 3185.23 \times 2.4181 = 7702.20$. At 1600 m, $v = 1000000 / 383.856 = 2605.15$ m/s and $Z = 2605.15 \times 2.2593 = 5885.81$. The rock at 1582 m is harder to disturb, and the two differ by about 1816 in course units, which is a contrast of roughly a quarter relative to the higher value. Eighteen metres apart, that step is a real reflector.
