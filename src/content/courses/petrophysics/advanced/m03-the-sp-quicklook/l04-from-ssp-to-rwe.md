# From SSP to Rwe

Everything in this module now converges. You have a defensible SSP reading, a mud filtrate resistivity at formation temperature, and the K coefficient evaluated where the potential is generated. One rearrangement turns them into a water resistivity.

## The rearranged equation

Start from the quicklook SP equation and solve for the water term:

$$SSP = -K \log_{10}\!\left(\frac{R_{mfe}}{R_{we}}\right)
\quad\Rightarrow\quad
R_{we} = R_{mfe}\,10^{\,SSP/K}$$

The signs take care of themselves. A negative SSP makes the exponent negative, the power of ten becomes a fraction below one, and $R_{we}$ comes out smaller than $R_{mfe}$: salty formation water, fresh filtrate, exactly the geometry the deflection encoded.

## Worked example

Run the typewell numbers, which are the capstone's second graded value. Givens: $SSP = -93$ mV, $R_{mfe} = 0.62$ ohm.m at formation temperature, $K = 84.94$ at 180 degF.

1. Exponent: $SSP/K = -93 / 84.94 = -1.094891$.
2. Power of ten: $10^{-1.094891} = 0.080373$.
3. Scale by the filtrate: $R_{we} = 0.62 \times 0.080373 = 0.049831$ ohm.m.

So the SP quicklook delivers $R_{we} = 0.0498$ ohm.m. The capstone grades this number with a tolerance of 0.0005 ohm.m, so carry at least four decimals through the arithmetic and round only at the end.

Sanity-check it against lesson 3's decade logic: $-93$ mV is $93/84.94 = 1.095$ decades, a little more than one, so the answer had to sit a little below $0.62/10 = 0.062$. It does.

## Two routes, one water

Module 2 produced the same property by a completely different physical path: a laboratory measurement of a produced water sample, corrected to formation temperature with Arps, giving $R_w = 0.049910$ ohm.m. The SP route just gave 0.049831 ohm.m. The two agree within 0.0001 ohm.m, a spread of about 0.2 percent, and they share no data: one rests on a bottle of water and a thermometer, the other on millivolts read from a log and the mud report. When two independent routes land on the same value, the value stops being an assumption and becomes evidence. The Pickett fit from your Professional tier adds a third route at 0.0500 ohm.m, and module 4 assembles the full triangulation.

## Sensitivity: read SSP like it matters

Before trusting any quicklook, know how hard it leans on its inputs. The exponent makes $R_{we}$ exponentially sensitive to SSP. Repeat the arithmetic with a misread deflection of $-60$ mV instead of $-93$ mV, everything else unchanged:

1. Exponent: $-60 / 84.94 = -0.706381$.
2. Power of ten: $10^{-0.706381} = 0.196621$.
3. Scale: $R_{we} = 0.62 \times 0.196621 = 0.1219$ ohm.m.

A 33 mV misread moved $R_{we}$ from 0.0498 to 0.1219 ohm.m, a factor of 2.4. Carried into Archie, where $S_w$ scales as $\sqrt{R_w}$, that alone would inflate every water saturation by more than 50 percent and could erase real pay. Baseline drift, a thin bed, or hydrocarbon suppression can each shave tens of millivolts off a deflection, which is why lesson 2 insisted on the thick, clean, water-bearing read and why lesson 5 will refuse to let the SP stand alone.

The other input is gentler: $R_{we}$ is only linear in $R_{mfe}$. A 10 percent error in the mud report becomes a 10 percent error in $R_{we}$. Still worth care, but the millivolts dominate the error budget.

Try it yourself: the panel below runs the same engine on the typewell.

{{panel:petro-rw-triangulator}}

## Exercise

A well at 180 degF ($K = 84.94$) has $R_{mfe} = 0.45$ ohm.m and a carefully read $SSP = -85$ mV. Compute $R_{we}$, then recompute with a sloppy reading of $-70$ mV and report the ratio of the two answers. As a self-check: $-85/84.94 = -1.000706$, $10^{-1.000706} = 0.09984$, so $R_{we} = 0.45 \times 0.09984 = 0.0449$ ohm.m; the sloppy read gives $-70/84.94 = -0.824111$, $10^{-0.824111} = 0.14993$, so $R_{we} = 0.0675$ ohm.m; the ratio is 1.50. Fifteen missing millivolts inflated the answer by half.
