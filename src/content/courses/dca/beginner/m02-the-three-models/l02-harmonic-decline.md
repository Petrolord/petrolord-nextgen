# Harmonic decline

The second Arps form sits at the opposite end of the family from the exponential. Where the exponential loses a constant fraction of its rate every day, the harmonic well's fractional loss shrinks as the rate shrinks. The well slows its own decline. Ekene-5, on stream 2020-06-01 at 100 stb/d with $D_i = 0.0015$ per day, is the field's exact harmonic example.

## The form

$$q(t) = \frac{q_i}{1 + D_i t}$$

No exponent, no power: just one division. For Ekene-5,

$$q(t) = \frac{100}{1 + 0.0015\,t}$$

with $t$ in days. The name comes from the harmonic series in mathematics, because the rate falls off like one over time once $D_i t$ dominates the 1.

## Work one point by hand

At one year, $t = 365$ days:

$$1 + D_i t = 1 + 0.0015 \times 365 = 1.5475$$

$$q(365) = \frac{100}{1.5475} = 64.6203554119548 \text{ stb/d}$$

One multiplication, one addition, one division. Do it now on a calculator; if you get 64.62 stb/d the structure is right. The committed table for Ekene-5 gives the checkpoints:

| t (days) | q (stb/d) |
|---|---|
| 0 | 100 |
| 182 | 78.5545954438334 |
| 365 | 64.6203554119548 |
| 730 | 47.7326968973747 |
| 1096 | 37.8214826021180 |

## The decline that declines

Here is the defining behaviour, and the contrast with Ekene-1 that the module is built around. Ask when the rate halves.

$$q = \frac{q_i}{2} \quad\text{when}\quad 1 + D_i t = 2 \quad\text{i.e.}\quad t = \frac{1}{D_i} = \frac{1}{0.0015} = 666.666666666667 \text{ days}$$

So Ekene-5 first halves, from 100 to 50 stb/d, at day 666.7. When does it halve again, to 25 stb/d? That needs $1 + D_i t = 4$, so $t = 3/D_i = 2000$ days: the second halving takes 1333.3 days, twice as long as the first. The third, to 12.5 stb/d, needs $1 + D_i t = 8$, at $t = 4666.7$ days: 2666.7 more days, twice as long again. Each halving takes twice the time of the one before.

Compare the exponential well, which halves every 577.6 days forever. The harmonic well starts declining briskly and then flattens into a long, stubborn tail that keeps producing meaningful rates for years after an equivalent exponential well would have faded. That tail is why the harmonic form books so much more ultimate recovery than the exponential form from similar early data, a fact with commercial consequences that the later modules take up properly.

Why does it happen? In the harmonic model the instantaneous fractional decline is not constant: it is proportional to the rate itself. Halve the rate and you halve the speed of decline. The well is always braking, and the braking weakens exactly as fast as the production does.

## See it in the panel

{{panel:dca-fit-explorer}}

Select Ekene-5 with the window on Primary. The fit returns Harmonic with qi 100, Di 0.0015 and b exactly 1, recovering the planted truth. Now compare shapes directly: flip between Ekene-1 and Ekene-5 on the linear axis. Both wells lose ground quickly at first, but by late in the primary window Ekene-5 is coming down gently while Ekene-1 is still shedding the same fraction every day. At the flood start Ekene-5 is doing 41.39 stb/d from a 100 stb/d start, while Ekene-1 is doing 32.21 stb/d from a 120 stb/d start. The harmonic well started lower and slower yet arrives higher.

## Where harmonic shows up in practice

The harmonic form is not exotic. Reservoir behaviour that progressively supports the rate, such as gravity drainage or an expanding effective drainage volume, pushes decline character toward harmonic. You do not need that physics at this tier; you need to recognise the shape and compute the numbers. But keep one caution: the same long tail that makes harmonic attractive also makes it easy to abuse, because assuming harmonic when the well is really exponential inflates every long-term number. Choosing between the forms honestly is the work of module 4 and, in a sharper form, of the Professional tier.

## Exercise

By hand, from $q_i = 100$ and $D_i = 0.0015$ per day: compute $q$ at $t = 1096$ days and check against 37.8214826021180 stb/d from the table. Then compute the day on which Ekene-5's rate first drops below 40 stb/d, and confirm your answer is consistent with the flood-start rate of 41.3907284768212 stb/d on 2023-01-01, which is day 944 of this well's life.
