# The uplift is one ratio

The whole property model reduces to a single multiplier on the booking. This lesson establishes it precisely and uses it as a check.

## The ratio

$$R = \frac{12.796077}{12.139208} = 1.0541113$$

The trend model books 5.41 percent more than the constant.

## The same ratio from the porosities

The effective porosity of the trend model is 0.21082226, and the constant was 0.20. Their ratio is

$$\frac{0.21082226}{0.20} = 1.0541113$$

The two agree to eight significant figures. Written out, the STOIIP ratio is 1.0541113058 and the porosity ratio is 1.0541113215.

## Why they agree, and why not exactly

They agree because the chain is linear in porosity and nothing else changed. The effective porosity is defined as the pore volume over the net volume, and the pore volume is the only thing the model touched, so the ratio of the bookings has to be the ratio of the effective porosities.

They do not agree exactly because of how the constant is stored. The chain fills its constant property grid with 32 bit floats, so the constant booking used 0.20000000298023224 rather than 0.20 while the trend grid holds full precision values. Dividing by the exact 0.20 rather than by the value the engine actually used leaves a discrepancy of about 1.5 parts in $10^{8}$.

That is worth knowing precisely so it does not become a mystery. It is a storage artefact, it is fifteen thousand times smaller than a single barrel on this booking, and it is not evidence of anything about the model.

## Using the ratio as a check

The ratio gives the fastest available audit of a property model, and it needs only the four numbers any report should contain.

Take the net and pore volumes from each of the two runs. Form each effective porosity. Their ratio must equal the ratio of the two STOIIPs to within the storage noise.

If it does not, the two runs differ by more than the property model, and whatever else changed is not being reported.

## What the ratio does not tell you

It does not tell you whether the model is good. A ratio of 1.054 is equally consistent with a well founded trend fitted to abundant control and with an arbitrary plane fitted to three wells.

It also gives no sense of scale on its own. Whether 5.41 percent matters depends on what else in the study moves the answer by more, which is the subject of the last lesson in this module.

And it hides everything about where the uplift came from, which is the subject of the next one. Two models with the same ratio can arrive at it for entirely different reasons, and the reasons carry very different amounts of confidence.

## Reading it off the panel

The last tile gives the difference against the constant 0.20 booking directly.

{{panel:rc-property-explorer}}

Under trend it reads plus 0.6569 MMstb. Divide by the constant booking of 12.1392 to recover the ratio, or read the STOIIP tile of 12.7961 and divide.

Under krige it reads plus 1.1985, a ratio of 1.0987, so the kriged model is worth nearly twice the trend. Under constant it reads plus 0.4046, a ratio of 1.0333, which is the uplift with no spatial variation at all.

Those three ratios, 1.0333, 1.0541 and 1.0987, are the three answers this field gives depending on how the same six numbers are turned into a grid.

## Worked example

Reconstruct all three bookings from the constant booking and the three effective porosities, without the engine.

The Associate booking is 12.139208 MMstb at 0.20. The effective porosities are 0.206667 for the constant method, 0.210822 for the trend and 0.219745 for the krige.

$$12.139208 \times \frac{0.206667}{0.20} = 12.543848$$
$$12.139208 \times \frac{0.210822}{0.20} = 12.796076$$
$$12.139208 \times \frac{0.219745}{0.20} = 13.337661$$

All three match the engine to five decimal places, the residue being the constant storage discussed above.

One division per model. That is the entire arithmetic content of property modelling as far as a volume is concerned, and everything difficult about it lives in choosing the porosity rather than in applying it.

## Exercise

A report compares two porosity models and gives STOIIPs of 20.0 and 21.6 MMstb, and net and pore volumes of 30.0 and 6.0, and 30.0 and 6.5 million cubic metres. State whether the numbers are consistent.

Self check: the effective porosities are $6.0/30.0 = 0.20$ and $6.5/30.0 = 0.216667$, a ratio of 1.083333. The STOIIP ratio is $21.6/20.0 = 1.08$. Those differ by 0.3 percent, far more than storage noise, so something besides the porosity model changed between the runs, or one of the figures has been rounded or transcribed wrongly.
