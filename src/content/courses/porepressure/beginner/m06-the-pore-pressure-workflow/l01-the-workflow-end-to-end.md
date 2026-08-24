# The workflow end to end

Five modules have taken the Beginner pore pressure problem apart one piece at a time. This lesson puts the pieces back in working order, because they are not independent. Each step consumes what the step before it produced, and a depth reference chosen wrongly in step one is still wrong at the end without ever announcing itself.

The order is: references, hydrostatic, overburden, Gardner where needed, the trend, the fit, the reading, hand on.

## Step 1: state the references

Nothing can be computed until the references are on the page. For the golden well they are 4000 m of section below the mudline in 100 m of water, seawater at 1025 kg/m3, pore fluid at 1030 kg/m3, gravity at 9.80665 m/s2, and a sonic sampled every 10 m from 0 to 4000 m, giving 401 samples.

This step produces no number of its own and it controls every number that follows. Every depth in the course is metres below mudline because of it.

## Step 2: the hydrostatic column

Two parts, added. Seawater to the mudline gives 1005181.625 Pa. Pore fluid below it gives 40403398 Pa. Together they give 41408579.625 Pa, which is 41.408579625 MPa at 4000 m below mudline.

This is the reference line the rest of the discipline argues against. It is not a measurement of anything, and it depends on no rock property at all.

## Step 3: the overburden

Integrate the sediment density from the mudline downward and add the seawater column underneath it. The density runs from 1900 kg/m3 at the mudline to 2505.265301734371 kg/m3 at 4000 m, and the integral reaches 91.12306695073282 MPa at 4000 m below mudline.

Because the density grows with depth, the curve bends. Because the seawater term is included, it starts at the same 1.005182 MPa as the hydrostatic. Those two facts are what make it checkable.

## Step 4: Gardner where the density log is missing

Density logs stop, wash out, or were never run in the shallow section. Where they are absent, Gardner's relation supplies a density from velocity, $\rho = 310 v^{0.25}$.

At 1600 m/s it returns 1960.612149304395 kg/m3. At 2000 m/s it returns 2073.094945426908 kg/m3, at 2500 m/s 2192.0310216782973 kg/m3, and at 3000 m/s 2294.256693926084 kg/m3. Those feed step 3 in the intervals where the log cannot.

## Step 5: the normal compaction trend

The trend says what a shale transit time should be at a given depth if nothing but ordinary compaction is happening.

$$dt(z) = dt_{ma} + (dt_{ml} - dt_{ma})\,e^{-cz}$$

On the well's own parameters, a mudline transit time of 656 us/m, a matrix of 220 us/m and a compaction constant of 0.0006 per m, the trend at 2500 m below mudline is 317.2847498247154 us/m.

## Step 6: fit the trend to the picks

In a real well nobody hands you the parameters, so you pick shale points and fit. Twelve picks between 200 m and 3500 m, with the matrix transit time fixed at 220 us/m, return a mudline transit time of 650.0000000000014 us/m and a compaction constant of 0.7000000000000015 per km.

The well's own label says 656 us/m and 0.6 per km. The fit is not wrong and the label is not wrong. The picks were drawn on a different trend from the one in the header, and the fit reports what the picks actually say. That is the central lesson of the course, and step 6 is where it lands.

## Step 7: read the frame

With all four curves on one depth axis you can finally look. Above 2500 m the log transit time sits on the trend, and at 2500 m the two are the same 317.2847498247154 us/m. Below it the log stands above the trend, 297.76677602422825 against 292.070315 us/m at 3000 m, and the gap widens with depth.

That departure is the undercompaction signature, and identifying it is the last thing the Beginner tier does.

## Step 8: hand it on

The Beginner tier stops here, with a hydrostatic reference, an overburden ceiling, a trend, a fit and a stated departure depth. Those are exactly the ingredients a pore pressure prognosis needs, and the Professional tier is where they are turned into MPa at every sample.

## Where each course fits

Laid out this way, the geoscience path stops looking like separate applications.

The Well Data course is the formal prerequisite for this one, and it earns that place. It is where the sonic is despiked, the washed out intervals are flagged and the depth reference is settled, which is step 1 of this workflow arriving already done. The Petrophysics course produces the shale volume that decides which points are shale and therefore eligible as picks in step 6, and a shale flag that is wrong there produces a confident trend fitted to the wrong lithology here. The Well Correlation course puts the interval in a named zone, so that a departure at 2500 m can be described as belonging to something rather than floating at a depth.

Downstream, this course hands its pore pressure at depth to the Rock Physics course as an in situ condition, because fluid properties are computed at a pressure and that pressure has to come from somewhere when no direct measurement exists. It also hands velocity trends to the seismic interpretation work, where the same compaction behaviour is read laterally across a survey rather than vertically down one well.

Each course inherits the previous one's weaknesses. A depth reference left ambiguous in the well data work becomes an overburden integrated over the wrong interval here, and every pressure downstream carries the shift quietly.

That is the whole Beginner path. Four references in, two pressure curves, one Gardner fallback, one trend, one fit, one departure depth, and a frame a prognosis can stand on.

## Exercise

Write the eight steps in order from memory and put beside each the single golden well number it produces. Then answer in one sentence: which step produces no number of its own and yet controls every number in the list?

As a self check: the references are 4000 m below mudline in 100 m of water with seawater 1025 kg/m3, pore fluid 1030 kg/m3 and g of 9.80665 m/s2; the hydrostatic at 4000 m is 41.408579625 MPa; the overburden at 4000 m is 91.12306695073282 MPa; Gardner at 1600 m/s gives 1960.612149304395 kg/m3; the well trend at 2500 m gives 317.2847498247154 us/m; the fit through the twelve picks gives 650.0000000000014 us/m and 0.7000000000000015 per km; reading the frame puts the departure at 2500 m, where the log and the trend last agree; and step 8 hands all of that to the prognosis. The step that produces nothing and controls everything is step 1, because every depth, both pressure curves and the whole integration are referenced to it, and no later step can detect that it was stated wrongly.
