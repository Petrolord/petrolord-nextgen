# The API sixty seven percent

Where the number comes from, and what it is and is not.

{{panel:cm-standoff-explorer}}

## The number

    API_TARGET_STANDOFF = 0.67

Two thirds. It is exported as a named constant rather than written into the checks, and it appears in three places: the checklist item, the default target for the required-spacing search, and the deflection at which a bow spring's restoring force is quoted.

## What it is

A convention, from API Specification 10D and the recommended practice around it, that 67 percent standoff is the point beyond which mud removal becomes achievable with reasonable fluid design.

It is a threshold on a continuous quantity, chosen because a threshold is useful, and it is not a cliff. A job at 65 percent is not qualitatively different from one at 69.

## What it is not

**Not a guarantee.** Sixty seven percent standoff with the casing stationary and a badly designed spacer will still channel.

**Not a physical transition.** Nothing changes at two thirds. The displacement efficiency falls off smoothly as the standoff falls, and steeply below about half.

**Not universal.** Some operators specify 70 or 80 in critical intervals, particularly across the reservoir and immediately above a shoe.

## The third place it appears, which is the subtle one

A bow spring's RESTORING FORCE is quoted at a stated standoff, conventionally 67 percent. So the manufacturer's figure of, say, 8900 N means: this spring pushes with 8900 N when it has been deflected far enough to leave 67 percent standoff.

That is a point on a curve, and the engine turns it into a linear spring:

    k = restoring force / ((1 - 0.67) x clearance)

Module 2 is about that conversion and about the assumption inside it.

So the 0.67 in the spring rate and the 0.67 in the acceptance criterion are the SAME NUMBER used for two unrelated purposes, and they could be decoupled. The engine exposes `standoffAtRestoringForce` separately from the target for exactly that reason.

## The checklist item

    Minimum standoff 60% vs the API 67% target.

Reported as a percentage against the target, with the target named. Not a pass mark, a comparison.

## The two wells

The slant well reaches 0.742357202445576 at 12 m spacing, which passes.

The horizontal well reaches 0.599178961025609 at the same spacing, which does not.

Same casing, same hole sizes, same centralizer, same mud. The difference is the inclination.

## Exercise

Express both wells' minimum standoff as an eccentricity.

Then say how far off centre, in millimetres, the pipe is at the worst point of each, given a clearance of 0.019049999999999997 m.
