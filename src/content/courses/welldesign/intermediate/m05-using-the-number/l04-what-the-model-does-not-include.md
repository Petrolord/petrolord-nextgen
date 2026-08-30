# What the model does not include

Four categories of error the covariance says nothing about.

## Gross errors

A station recorded at the wrong depth. A survey from the wrong well. A tool run with the wrong parameters. A sign convention applied twice.

None of these is in the model, and each of them has happened. The standard's own documentation says so explicitly: the model describes the spread of CORRECT measurements.

The defence is quality control on the survey itself, not a bigger ellipse.

## Surface position

The model starts at the tie-on and accumulates. It says nothing about where the tie-on is.

For a well from a surveyed wellhead, that position has its own uncertainty, typically a few tenths of a metre for a modern satellite fix and considerably more for an older one.

The anti-collision calculation in the Expert tier adds a surface position term explicitly, as a separate parameter, precisely because the survey model does not carry it. Its default in the standard clearance examples is half a metre.

For a shallow anti-collision problem, that half metre can be the dominant term, and it is not in any of the twenty-seven sources.

## The wellbore radius

The model gives the uncertainty of the CENTRELINE. A hole has a diameter, and a hole that has been reamed or washed out has a larger one.

Clearance calculations add a radius for each well as a separate input. The standard examples use 0.4572 m and 0.3048 m, which are 18 and 12 inch holes.

## Model error

The parameter magnitudes are consensus estimates. The weighting functions are derived under assumptions about sensor behaviour. The propagation modes are a simplification of how errors really correlate.

The model has been revised several times as field experience accumulated, and each revision changed numbers. The current revision is not the truth; it is the current best agreement.

## What this means in practice

The ellipse is a lower bound on the uncertainty, not an upper one.

That is the opposite of how it is usually read. People treat the ellipse as a worst case and drill to its edge. It is a description of the well-behaved part of the error distribution, with the tails, the blunders and the unmodelled terms excluded.

Which is why the anti-collision thresholds in the Expert tier are set well above 1: a separation factor of 1 means the ellipses just touch at the chosen confidence, and the industry no-go threshold is there because touching at 3.5 sigma is not comfortable when the model excludes the things most likely to hurt you.

## What to do about it

**Quality-control the survey.** Most gross errors are visible: a dogleg spike, a depth that does not fit the tally, an azimuth that jumps.

**Include the surface position term.** It is a separate input and it is the dominant one shallow.

**Include the hole radius.** Also separate, also easy to forget.

**Do not drill to the edge of the ellipse.** The thresholds exist for the errors that are not in it.

## The misconception to avoid

"The ellipse is the worst case." It is a contour of the modelled distribution. Blunders, surface position, hole size and model error are all outside it, and every one of them has put a well somewhere the ellipse said it could not be.

## Exercise

List the four excluded categories and, for each, name the mechanism by which it is handled elsewhere in the workflow.

Then say which of the four you would expect to dominate for two wells being drilled from adjacent slots on a platform, at 200 m below the mudline.
