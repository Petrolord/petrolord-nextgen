# The workflow end to end

Five modules have produced a set of results. This lesson puts them in the order you would run them on a project, with the reason each step sits where it does.

## The eight steps

**1. Confirm both picks exist in every well you intend to use.** A well with a top and no base contributes to one surface and not the other, which shrinks the isochore's mask without touching the depth map. This is first because it changes which wells are in the control set and therefore everything after it.

**2. Sanity-check the well thicknesses before gridding.** Subtract each well's own picks and look at the six numbers. A negative thickness is a swapped pick. A thickness far outside the others is a mis-pick or a genuinely interesting well, and you want to know which before it drives a map.

**3. Derive the frame once, from the union of the control, and reuse it.** Not one frame per surface. The construction that cannot disagree with itself beats the check that can pass by luck.

**4. Grid both surfaces with identical settings.** Same method, same cell size, same extrapolation limit. Any difference between the two runs shows up in the isochore as structure that is not there.

**5. Subtract deep minus shallow.** Base minus top, so thickness comes out positive. Confirm the sign on one well before trusting the map.

**6. Check control honouring.** Sample the isochore at each well and compare against the measured thickness. Expect exact agreement at wells that land on nodes, and expect blanks at wells on the mask boundary. Both are results; a mismatch that is neither is a problem.

**7. Read the statistics with their conditions.** Minimum, maximum, mean, live node count, and the well mean beside the map mean. Every one of them travels with the cell size and the mask setting.

**8. Report the two means separately and use the map mean only where area multiplies it.**

## Where each result from this tier lands

Step 2 is where module 1's table of six thicknesses is built.

Steps 3 and 4 are module 1's frame discipline and module 2's mask interaction.

Step 5 is module 2's arithmetic, and the equivalence with direct gridding is available there as a cross-check if two people have produced two maps.

Step 6 is module 2's honouring check, including the Ekene-2 blank.

Step 7 is module 3, and step 8 is module 4.

## What the order protects against

Step 1 protects against an isochore that silently covers less ground than the depth map above it.

Step 2 protects against a mis-pick reaching a map, which is the cheapest error to catch and the most expensive to leave.

Step 3 protects against subtracting misaligned grids, which produces a plausible map of nothing.

Step 5 protects against a thickness map of negative numbers, which contours perfectly well.

Step 8 protects the volume calculation downstream.

## The order that is tempting and wrong

Gridding the two surfaces separately, at whatever settings each one seemed to need, and subtracting afterwards.

It is tempting because each surface can be tuned to look right on its own: a wider mask on the base because its picks are sparser, a smaller cell on the top because it has more structure. Every one of those choices is defensible in isolation, and together they make the two grids incomparable, so the isochore is a map of the difference between two sets of settings as much as of the rock.

The rule is that surfaces destined to be combined are gridded as a **set**, with one decision about settings applied to all of them.

## Worked example

A project has TOP_SAND in eight wells and BASE_SAND in six of the eight. Run the first four steps.

Step 1 finds the two wells with no base pick and forces the decision: either accept that the isochore covers less ground than the depth map, and say so, or exclude those two wells from both surfaces so that the two maps share a mask.

Neither answer is automatically right. Excluding them makes the maps comparable and throws away real depth control. Keeping them makes the depth map better and the isochore's coverage smaller. What matters is that the choice is made deliberately and recorded, because a reader cannot recover it from the maps.

Steps 2 to 4 then proceed on whichever control set was chosen, with one frame and one set of settings.

## Exercise

List the eight steps in order and state which one you would run before any gridding at all. Then explain in two sentences why surfaces that will be combined must be gridded with identical settings.

As a self-check: confirm both picks exist, sanity-check the well thicknesses, derive one frame, grid both with identical settings, subtract deep minus shallow, check control honouring, read the statistics with their conditions, and report the two means separately. The thickness check runs before any gridding, because it costs nothing and catches swapped or mis-picked tops while they are still cheap to fix. Identical settings are required because any difference between the two runs, in cell size, method or mask, appears in the difference of the two grids as apparent thickness structure, and nothing in the resulting map distinguishes that artefact from real geology.
