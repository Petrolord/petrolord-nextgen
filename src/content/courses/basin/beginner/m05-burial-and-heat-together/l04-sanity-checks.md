# Sanity checks

## Six checks you can run without a reference answer

Every result in this course came out of a fixture with a known answer, which is a luxury you will not have again. On real data the model runs, produces numbers, and offers no opinion about whether they are right.

These six checks close that gap. Each one tests an internal property that must hold whatever the data is, so each one can be run on a result you have never seen before. Five of them catch a specific class of error. The sixth is about how the result is written down.

## Check 1: porosity lies between zero and phi0, and falls with depth

Porosity is a fraction of bulk volume, so it cannot be negative and it cannot exceed the surface value the curve started from. On the Sclater-Christie curve, $\phi(z) = \phi_0 e^{-cz}$, that is automatic, which makes any violation a sign that something outside the curve went wrong.

Shale runs 0.63 at 0 m, 0.48819739371548104 at 500 m, 0.37831221465172754 at 1000 m, 0.22717481230903933 at 2000 m, 0.13641747040908445 at 3000 m and 0.08191808785340832 at 4000 m. Monotonic downward, always below the surface value of 0.63, and never reaching zero.

A porosity above phi0 usually means the wrong lithology was applied or a depth was signed the wrong way. A porosity above 1 means a percentage was fed into a fraction, and a negative value means a linear model was used past its range.

## Check 2: restored thickness is always greater than present thickness

Decompaction adds pore space back, so a restored layer is thicker than the layer you started with. There is no configuration in which a layer restores to less than it measures today.

The 100 m shale from 1000 m restores to 159.79553483785466 m, and the pattern holds at every depth: 134.010303 m from 500 m, 159.795535 m from 1000 m, 194.513330 m from 2000 m and 214.973300 m from 3000 m. The deeper the layer is found, the more it grows, because more of it had been squeezed away.

A restored thickness smaller than the present thickness means the two depths were swapped, so the routine was asked to bury the layer rather than restore it.

## Check 3: grain is conserved through a restoration

This is the strongest check available, because it is an identity rather than a trend. Decompaction moves thickness around and conserves grain.

The 100 m shale at 1000 m has a solid thickness of 63.11728183077296 m. Compute the solid thickness of its restored 159.79553483785466 m at the surface and the answer is 63.117281830772924 m, the same grain to within 1e-13. That residual is arithmetic in the last digits and nothing else.

Run this check both ways on any restoration you perform. If grain is not conserved, the restoration is wrong, and no other check will tell you that so plainly.

## Check 4: temperature increases monotonically downward

In a conductive column with heat entering at the base, temperature rises with depth at every step. The golden column runs 10 degC at 0 m, 11.666666666666671 degC at 50 m, 41.66666666666673 degC at 950 m, 44.190476190476254 degC at 1050 m and 59.619047619047684 degC at 1950 m, rising at every cell in between.

A reversal anywhere is a defect. The usual causes are a conductivity entered as its reciprocal, a heat flow with the wrong sign, or cell depths that are not in order.

## Check 5: the gradient changes only where conductivity changes

Here is the check that separates people who have understood the heat module from people who have memorised it. The gradient is $Q/k$, so within a layer of constant conductivity it is constant, and it can only change where $k$ changes.

The golden column has one conductivity break, at 1000 m. The gradient above it is 33.333333333333336 degC per km and below it is 17.142857142857142 degC per km, nearly a factor of two apart, with the same 60 mW/m2 flowing through both. Two segments, one break, and the break sits exactly where the lithology does.

If a gradient shifts in the middle of a uniform layer, either the conductivity is not what the model was told or heat is entering or leaving somewhere it should not be.

The cost of getting this wrong is worth quoting. Carry the shallow 33.333333333333336 degC per km below 1000 m, which is what extrapolating a measured gradient into another formation amounts to, and the column predicts exactly 75 degC at 1950 m. That is an overprediction of 15.38095238095238 degC against the true value above, and at source rock depth an error of that size moves a rock from outside the oil window to well inside it.

## Check 6: every value is quoted with its depth

The last check is about the report. A porosity of 0.22717481230903933 is not a fact until it is a porosity at 2000 m. A temperature of 41.66666666666673 degC is not a fact until it is a temperature at 950 m. A gradient of 33.333333333333336 degC per km is meaningless without the interval it applies to, since the same column also has one of 17.142857142857142 degC per km.

The rule extends to units. Porosity is a fraction in v/v, thickness is in m, temperature is in degC, gradient is in degC per km, and heat flow is 0.06 W/m2 or 60 mW/m2 with the unit stated. A number handed on without its depth and its unit will be reused at the wrong depth by somebody who had no way of knowing.

Run the first five checks against the panel below, reading the compaction curve, the thicknesses and the heat column from the same view.

{{panel:bs-burial-heat-explorer}}

## Exercise

Run the six checks on the golden fixtures and write one line for each saying what passed. Then answer in one sentence: which check would catch a decompaction routine that had been handed its two depths in the wrong order, and which would catch a conductivity entered as its reciprocal?

As a self check: shale porosity falls from 0.63 at 0 m to 0.08191808785340832 at 4000 m, always positive and always below phi0; the 100 m shale from 1000 m restores to 159.79553483785466 m, larger than its present thickness, as at every other depth; its solid thickness of 63.11728183077296 m returns as 63.117281830772924 m from the restored layer, conserved to within 1e-13; the column rises from 10 degC at 0 m to 59.619047619047684 degC at 1950 m without a reversal; the gradient takes one step, from 33.333333333333336 to 17.142857142857142 degC per km at the single conductivity break at 1000 m; and every value above is quoted with its depth. Check 2 catches the swapped depths, because the layer would come back thinner than it is today, and check 5 catches the reciprocal conductivity, because the gradient in that layer would be wrong by a large factor while the break stayed where the lithology is.
