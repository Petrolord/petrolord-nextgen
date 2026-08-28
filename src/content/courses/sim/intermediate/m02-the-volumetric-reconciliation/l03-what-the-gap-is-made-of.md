# What the gap is made of

The deck matches the booking to six hundredths of a percent. That number is small enough to look like agreement and it is worth taking apart, because it is a sum of several differences that happen to nearly cancel.

## The differences that are present

**A different surface.** The booking used the geoscience courses' own gridded top; the deck uses simple kriging on a 30 by 30 lattice with a stated range and regional mean. Two surfaces through the same six points.

**A different frame.** The booking's grid and the deck's grid are not the same size, do not have the same origin, and do not have the same cell count over the accumulation.

**A different clipping rule.** The booking clips area and gives every oil cell a full isochore; the deck clips by cell centre. The previous lesson measured that at about 0.8 percent between the deck's own two options, and the booking's rule is a third one.

**A different vertical description.** The booking used a single net thickness over the oil area; the deck has five layers with the contact cutting between them.

## What is NOT different

Porosity, 0.2 in both. Water saturation, 0.35 in both. Oil formation volume factor, 1.2 in both. The contact depth, 1560 m in both. And the volumetric engine itself.

Holding those five fixed is what makes the comparison meaningful. Every remaining difference is geometry or convention.

## Why it comes out so small

Because one parameter of the deck's structure was set so that it would.

The regional mean of the kriging, which is the depth the surface reverts to far from the wells, is not measured. It controls how tightly the structure closes, and therefore how much of the field lies above the contact. Move it shallower and the deck contains more oil; move it deeper and it contains less.

It was set so the deck's cell-centre volume lands on the booking. The Expert tier does that tuning and treats it as a decision to be reported; this tier's job is to know that it happened.

## Why that is legitimate

Because the booked volume is the better-constrained number of the two.

It came from a mapping workflow built for volumetrics, on a frame chosen for it, with the isochore mapped explicitly. The deck's structure is a means to an end: it exists so a simulator can flow fluid through it, and its far-field shape is unconstrained by anything.

Tuning the unconstrained parameter so that the constrained quantity is honoured is not fitting the data twice. It is putting the uncertainty where the uncertainty is.

## What would make it illegitimate

Two things.

Tuning it and not saying so, which turns an arranged agreement into apparent independent confirmation.

Or tuning a parameter that IS constrained. If the deck's porosity had been adjusted to make the volume match, that would be overriding a measurement with a preference, and the resulting model would be wrong in a way that shows up the moment anything depends on porosity.

## The residual six hundredths

Even after tuning, the match is not exact. The parameter was set to a fixed number of decimal places and the volume is a step function of it, because the oil cell count changes in jumps as the surface moves. You cannot land exactly on a target that moves in steps.

So the residual is a discretisation artifact of the tuning itself, and reporting the match as "within a tenth of a percent" rather than as an exact figure is the honest phrasing.

## The misconception to avoid

"The gap is the error." The gap is the residual of a deliberate match, so it measures how precisely the tuning could be done, not how accurate either model is. The real uncertainty in Ekene's oil in place is dominated by the contact and the mapped area, and it is far larger than a tenth of a percent.

## Exercise

First, list the four differences between the deck and the booking and the five quantities held fixed, and say why holding those five fixed matters.

Second, explain in two sentences why tuning the regional mean is defensible and tuning the porosity would not be.
