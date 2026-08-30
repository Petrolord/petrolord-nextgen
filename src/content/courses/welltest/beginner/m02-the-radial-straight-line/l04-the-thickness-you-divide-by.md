# The thickness you divide by

The most consequential number in a well test report is one the test did not measure.

## Where h comes from

The thickness in the slope equation is net pay: the vertical extent of rock that is actually contributing flow to the well. It comes from a petrophysical interpretation, filtered through cut-offs on shale volume, porosity and water saturation, and it is a judgement.

Two petrophysicists working the same logs with different cut-offs will hand you net pays that differ by ten or twenty percent without either of them being careless. The well test then divides by whichever one it was given.

## The error propagates exactly

There is no subtlety in how the error travels. Permeability is inversely proportional to h, so a net pay 20 percent too high gives a permeability about 17 percent too low, and a net pay 20 percent too low gives a permeability 25 percent too high.

That is comparable to the difference between the drawdown and buildup analyses of this same well, and considerably larger than the precision most reports quote.

The flow capacity kh is untouched, because it never involved h. This is why experienced test reports lead with kh.

## Which thickness is the right one

Three different thicknesses turn up in well testing and confusing them is common.

**Gross interval** is top to base of the formation. It is almost never right, because it includes rock that does not flow.

**Net pay** is the part that flows, by whatever cut-off the interpretation used. This is the one the slope equation wants.

**Completed interval** is the part of the well that is open to the reservoir. It is what matters for skin and for a horizontal well's geometry, and it is not what the slope equation wants. A well completed over 20 ft of a 45 ft sand still drains the whole 45 ft once radial flow is established; the restricted entry shows up as an additional positive skin, not as a reduced h.

That last distinction is worth being firm about. Using the completed interval instead of the net pay in the slope equation inflates the permeability and simultaneously hides a real skin, and the two errors both point the same way: the well looks like it is in better rock and less damaged than it is.

## Anisotropy, briefly

The permeability the semilog line reports is horizontal permeability, because radial flow is horizontal. Vertical permeability does not enter it at all.

That is fine for a vertical well fully completed across the interval. It stops being fine for a partially penetrating well, for a horizontal well, and for any situation where flow has to cross bedding to reach the well. The Professional tier's horizontal well fixture has a vertical permeability a tenth of its horizontal one, and the response is shaped by that ratio in a way no semilog slope can express.

## What to write down

A defensible report of a permeability carries four things: the flow capacity in millidarcy feet, the thickness used, its source, and the permeability that division gives.

Anything less and the number cannot be revised when the petrophysics is revised, which it will be.

## The misconception to avoid

"The thickness is a detail." It is the largest single lever on the reported permeability that the test itself has no say in, and it is routinely changed after the test report is written and never propagated back. When a field's mapped permeability and its test permeabilities disagree systematically, a change of net pay definition somewhere between them is one of the first things to check.

## Exercise

A test on this well reports a flow capacity of 3712 mD ft.

Compute the permeability for net pays of 36, 45 and 54 ft. Then write the single sentence you would put in the report so that a reader six months later, holding a revised net pay, can correct your permeability without rerunning anything.
