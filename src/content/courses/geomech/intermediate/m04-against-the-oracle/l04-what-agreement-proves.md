# What agreement proves

Three kinds of check, and what each of them buys.

## The three checks this course carries

**The stress profile against its published columns.** Every Shmin and SHmax the engine computes matches the goldens exactly.

**Both wells' mud window walks against their published checkpoints.** Row counts, tightest points, and thirteen and twelve depth checkpoints respectively, all inside a relative tolerance of 1e-9.

**The vertical fixture against closed forms.** Exact.

## What the first two prove

That this implementation and the numpy one solve the same equations the same way.

That is verification and it is genuinely valuable. It catches sign errors in rotations, convention mismatches, and drift when the code changes.

## What the third proves

Something stronger and narrower: that on one case, the implementation agrees with the mathematics rather than with another implementation.

If both implementations shared a wrong equation, the first two checks would pass and the third would fail. That is exactly what a closed form is for.

## What none of them prove

That the model describes a real wellbore.

Every check here is internal. A linear elastic isotropic rock with no time dependence, no chemistry and no bedding is an idealisation, and no amount of agreement between implementations of that idealisation says whether it applies.

## What validation would need

**Caliper data.** Where did breakouts actually form, how wide, and at what mud weight? Compare against the predicted collapse gradient and the predicted breakout angle.

**Loss data.** Where were returns lost, and at what equivalent circulating density? Compare against the predicted fracture gradient, remembering that losses usually go into natural fractures below the intact initiation pressure.

**Stuck pipe and caving events.** Where did the hole give trouble, and does the model put the tight spot in the same place?

Those three, on a set of offset wells, are what turns a model into a calibrated model.

## The status of this course, stated

Verified against an independent implementation and against closed forms. Not validated against field data, because the fixture is synthetic and there is no field data in it.

The engine's own header says the same, and a course that claimed more would be claiming something the file cannot support.

## The habit to carry

For any geomechanics output you are handed, ask three questions in order.

Was it verified? Was it validated? And what was it calibrated against on THIS field?

The three answers are usually yes, no, and nothing, and knowing that is more useful than the number.

## Exercise

For each of the three checks in this course, name one specific error it would catch that the other two would not.

Then name an error that none of the three would catch.
