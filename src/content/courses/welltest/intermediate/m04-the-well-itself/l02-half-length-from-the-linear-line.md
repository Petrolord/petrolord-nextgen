# Half-length from the linear line

A Cartesian plot against the square root of time, and a window that has to be chosen.

{{panel:wt-diagnostic-explorer}}

## The analysis

During linear flow into a fracture of half-length xf,

    dp = 4.064 q B sqrt( mu / (k phi ct) ) sqrt(t) / (h xf)

So a Cartesian plot of pressure change against the square root of time, in hours, is a straight line through the origin, and its slope gives xf provided you know k.

The engine's `sqrtTimeAnalysis` fits exactly that line and returns its slope, intercept and r squared. Turning the slope into a half-length is left to the caller, because it needs a permeability that the linear-flow data do not contain.

## The permeability problem

Read the equation again. The slope contains the PRODUCT of xf and the square root of k, and nothing separates them.

    slope proportional to 1 / (xf sqrt(k))

So linear flow measures xf times the square root of k, and no amount of linear-flow data will split it. Halve the permeability and double the half-length appropriately and the response is identical.

On this fixture the split is available because the test eventually reaches radial flow, and the radial plateau gives k independently. On a well that never reaches radial flow, which is the normal case in tight rock, it is not, and the reported half-length is only as good as the permeability assumed for it.

The Expert tier meets the same product again in rate transient analysis, where it is called xf sqrt(k) and treated as the measurement rather than as a nuisance.

## The window

The linear-flow line has to be fitted over the interval where linear flow is actually happening, and the interval has the same two-ended problem as every other window in this course.

Start too early and you include storage. Start too late, or run past the end, and you include the transition to radial flow, which is flatter, so the fitted slope comes out too LOW, which makes the half-length come out too HIGH.

That is the direction of the error on this fixture. Fitting from 0.1 to 10 hours includes the beginning of the transition, and the half-length it gives is about fourteen percent above the planted 250 ft.

Fitting all 45 points is much worse: the slope falls from the linear-flow value to a value dominated by the whole curve, r squared falls from 0.997 to 0.973, and the half-length that results is meaningless.

## Checking against the derivative

The right window is the one the derivative says is linear flow, and the derivative is the arbiter.

The classifier reports linear flow from 0.001 to about 1.78 hours on this fixture. A sqrt-time fit confined to that interval gives a half-length considerably closer to the planted value than one running to 10 hours does.

That is worth doing as an exercise, because it makes the point concrete: the window from the derivative gives a better answer than a window chosen for convenience, on the same data with the same software.

## What xf means physically

The half-length from a pressure transient is an EFFECTIVE half-length: the length of an idealised, infinite-conductivity, planar fracture that would give the same response.

A real fracture is not planar, not uniform, and not infinitely conductive. Its propped length is usually longer than its effective length, sometimes much longer, because the far tips carry little conductivity and contribute little flow.

So the number to compare against a fracture design model is not the design's propped length. It is the design's effective length, and the gap between those two is one of the standing arguments between reservoir and completion engineers.

## The misconception to avoid

"A longer fracture is always better, so a disappointing half-length means the job failed." An effective half-length below design can mean a short fracture, or a conductive one that has been damaged by gel residue, or a fracture into a bounded interval, or simply a permeability assumption that was too low in the conversion. Before blaming the job, check what k was used, because the half-length scales with its square root.

## Exercise

Open the panel on the fractured-well fixture and read the sqrt-time slope and the half-length it reports over the default window.

Then compute what half-length the same slope would give if the permeability were 3 mD or 8 mD instead of 5. State the three half-lengths and say which of the three uncertainties, the window or the permeability, matters more here.
