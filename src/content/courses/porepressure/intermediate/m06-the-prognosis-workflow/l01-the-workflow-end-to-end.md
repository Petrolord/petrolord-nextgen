# The workflow end to end

Five modules built pieces. This lesson runs the whole prognosis in order, once, as a checklist you could follow on any well, with this well's numbers as the worked instance beside each step. This is the shape the capstone expects you to have in your hands, and the shape module 6 of every course in this ladder gives its tier.

{{panel:pp-eaton-explorer}}

## Step 1: fix the frame

Inputs: water depth, fluid densities, gravity, the density log. Outputs: hydrostatic and overburden at every sample.

On this well: 100 m of water, 1025 and 1030 kg/m3, 9.80665, and the density column integrating to 91.12306695073282 MPa at TD over a hydrostatic of 41.408579625. The Associate tier's checks apply unchanged: curves meet at the mudline at 1.005182 MPa, overburden leads everywhere below, both increase monotonically.

Nothing downstream can repair a frame error; module 2's worked lesson showed a wrong overburden passing silently through to a wrong pressure. Frame first, checked first.

## Step 2: choose and defend the trend

Inputs: shale picks or a header trend, and the arguments of module 4's checklist. Output: $\Delta t_n(z)$ with a defence in writing.

On this well: the well's own 656/220/0.6 per km, defended by construction and by the shallow section's quietness; the fitted 650/0.7 documented as the rejected alternative, with its consequences, onset at 120 m, double the TD overpressure, stated as the reason for rejection.

## Step 3: screen the samples

Inputs: caliper, lithology, the sonic itself. Output: the set of samples the ratio may be computed at.

On this well: all 401 pass, because the well is synthetic and built clean. State that explicitly rather than skipping the step; a prognosis that does not name its screening is not reproducible, and on any real well this step removes data.

## Step 4: run the inversion

Inputs: everything above plus the exponent. Output: pore pressure at every passed sample.

On this well: $n = 3$, ratio to the third power against the budget, giving hydrostatic above 2500 m and the ramp below, 33.307730125 MPa at 3000 m, 47.408579625 at TD. The exponent's provenance is stated: encoded by construction here, calibrated against measured pressures anywhere real.

## Step 5: detect and report the onset

Inputs: the prognosis and a stated detection rule. Output: an onset depth with its rule.

On this well: first sample more than 0.05 MPa over hydrostatic, on the 10 m grid, at $n = 3$: 2520 m. Reported as such, with the rule, since module 3 showed the number moves with threshold and exponent while the mechanism stays at 2500 m.

## Step 6: attach the fracture pressure

Inputs: the prognosis, the overburden, and $K$ with its provenance. Output: the green curve.

On this well: $K = \nu/(1-\nu)$ at $\nu = 0.4$, exactly two thirds, by capstone specification; on a real well, back-calculated from leak-off tests with its depth trend. TD value 76.55157117548856 MPa, and the mixture check, two thirds of 91.123 plus one third of 47.409, audits it in one line.

## Step 7: close whatever loop the well affords

On this well: the encoded ramp, recovered to $2.24 \times 10^{-8}$ Pa at the worst sample, closing the loop completely. On a real well: measured pressures, drilling events, connection gas, and the next tier's Bowers cross-check, each closing a partial loop. The step is never skippable; only its strength varies. A prognosis with no closure attempt at all is a hypothesis formatted as a conclusion.

## The order is the content

Notice what the ordering encodes. Frame before trend, because the trend's quietness check needs the hydrostatic. Trend before screening, because screening is judged against the trend. Screening before inversion, because the inversion amplifies whatever survives. Inversion before onset, because the onset is read off the prognosis. Everything before fracture pressure, because the ceiling stands on the floor. Rearranging the steps is not a style choice; each consumes the previous one's output.

## Worked example

Compress the whole run into the four-line summary a report would carry. Frame: hydrostatic 41.409, overburden 91.123 MPa at TD, standard checks passed. Trend: header 656/220/0.6 per km, fitted alternative rejected on shallow-section evidence. Prognosis: Eaton n 3, onset 2520 m by the 0.05 MPa rule, PP 33.308 MPa at 3000 m and 47.409 at TD, overpressure 6.000. Ceiling: K 2/3 from nu 0.4, FP 76.552 MPa at TD; ramp recovered to machine precision. Four lines, every number defensible, every choice named.

## Exercise

Write the same four-line summary for the WRONG run, the fitted-trend prognosis, as its author would honestly have to write it, and note which line now fails inspection.

Self check: Frame: identical, 41.409 and 91.123, passes. Trend: fitted 650/0.7 per km from the twelve picks, fit residuals zero. Prognosis: Eaton n 3, onset 120 m, PP 39.558 at 3000 m and 53.838 at TD, overpressure 12.429. Ceiling: K 2/3, FP 78.695 at TD. The third line fails on its face: an onset of 120 m in a section that drilled quiet is not survivable in review, and the honest author would have caught it at step 2's quietness check before ever writing the summary.
