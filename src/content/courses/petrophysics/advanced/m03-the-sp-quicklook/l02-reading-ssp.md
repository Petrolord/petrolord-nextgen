# Reading SSP

The equation in lesson 4 does not take just any SP reading. It takes the SSP, the static spontaneous potential: the full deflection the tool WOULD record in a thick, clean, water-bearing bed with no borehole effects. The measured curve only approaches that ideal under the right conditions, so reading SSP correctly is an interpretation step, not a lookup.

## Baseline, clean line, difference

The procedure has three parts. First, establish the shale baseline: the steady value the curve holds against thick shales above and below the zone of interest. Drift happens, so draw the baseline through the shales bracketing your sand rather than borrowing one from far up the hole. Second, find the maximum deflection the curve reaches against the cleanest, thickest water sand available, and draw a parallel clean-sand line through it. Third, read the difference between the two lines, in millivolts, with its sign. That difference is your SSP estimate.

On the typewell brief the reading is $SSP = -93$ mV, taken in a thick, clean, water-bearing sand, with the mud filtrate's equivalent resistivity given as $R_{mfe} = 0.62$ ohm.m at formation temperature. Both numbers ride into the quicklook equation as read; everything that follows in this module is only as good as they are.

## What degrades the reading

Four effects routinely pull the measured deflection short of the true SSP, and all four push in the same direction: they make the deflection SMALLER than it should be, which biases the derived $R_{we}$ high.

Thin beds. The SP needs vertical room to develop. In a bed only a few times the borehole diameter thick, the curve peaks without ever flattening, and the peak underestimates SSP. Bed-thickness correction charts exist for exactly this case; the honest alternative is to read a thicker bed.

Shaliness. Dispersed clay inside the sand short-circuits part of the membrane potential, so a shaly sand deflects less than a clean one at the same water salinity. Read the cleanest interval you can find, and treat any reading from a visibly shaly sand as a lower bound on the true deflection.

Hydrocarbons. Oil and gas in the pores reduce the ionic exchange that drives the electrochemical components, suppressing the deflection. This is why the brief specifies a WATER-BEARING sand: for Rw work, always pick your reading interval below the fluid contact when one is available. The typewell's water leg serves exactly this purpose.

Baseline drift. Electrode polarisation and telluric currents can tilt the whole curve slowly with depth. Because only differences matter, a drifting baseline is survivable if you draw it locally, but it ruins any attempt to compare absolute values across long intervals.

## The sign convention

Keep the geometry straight, because a sign error in SSP is a factor-of-many error in $R_{we}$ later. With filtrate fresher than formation water, $R_{mfe} > R_{we}$, the deflection is negative, and the equation of lesson 4 will divide a negative SSP by a positive K to produce a fraction less than one: $R_{we}$ comes out SMALLER than $R_{mfe}$, as it must. The typewell's $-93$ mV against $R_{mfe} = 0.62$ ohm.m follows exactly this pattern, and the result will be an $R_{we}$ near 0.05 ohm.m, about twelve times saltier than the filtrate in resistivity terms. If you ever compute an $R_{we}$ LARGER than $R_{mfe}$ from a negative SSP, you have dropped a sign.

A positive SSP is not an error in itself. It simply means the formation water is fresher than the filtrate, and the same equation handles it. What should stop you is a positive SSP in a basin where every other well shows salty formation water: that is a misread baseline until proven otherwise.

## Worked example

Practise the read on numbers. The shale baseline sits at $+12$ mV on the log's absolute scale, and against the thick water sand the curve flattens at $-81$ mV. The SSP is the difference, clean line minus baseline:

$$SSP = -81 - (+12) = -93\ \text{mV}$$

Note that neither absolute value means anything alone; a different tool or logging run could shift both by tens of millivolts, but their difference is the physics.

## Exercise

A log shows the shale baseline at $-5$ mV. Sand P (18 m thick, clean, water bearing) flattens at $-85$ mV. Sand Q (1.2 m thick, clean) peaks at $-47$ mV without flattening. Compute the SSP you would book for Rw work, and state why you reject the other reading. As a self-check: book $SSP = -85 - (-5) = -80$ mV from sand P. Sand Q's $-42$ mV is a thin-bed reading that never developed fully; using it would bias $R_{we}$ high. If sand P were oil bearing instead of water bearing, its reading would also be suspect, and you would look for a water leg.
