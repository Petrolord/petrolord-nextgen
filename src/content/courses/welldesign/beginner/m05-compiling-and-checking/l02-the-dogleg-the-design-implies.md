# The dogleg the design implies

The rate you asked for, and the severity you got.

## They are not the same

A design says "build at 3 degrees per 30 m". A compiled station list has a dogleg severity at every station.

For a pure build with no azimuth change, they agree: the dogleg is the build rate. For anything else they do not, and the difference is the sine of the inclination from module 3.

## Why the compiler reports it

Because the design is written in the quantities a driller controls, and the constraint is written in the quantity the pipe feels.

A plan that builds at 3 degrees per 30 m while turning at 4 degrees per 30 m at 70 degrees of inclination has a dogleg severity of about 4.9 degrees per 30 m. Nothing in the design says 4.9. The compiler computes it and reports the worst one in the whole well.

## The QA report

The compiler returns a small report:

**The worst dogleg severity** anywhere in the compiled well, in the convention matching the depth unit.

**Whether a stated limit was exceeded**, if a limit was given.

**A physical bound check**: no interval may gain more true vertical depth than its measured length. That is a sanity check on the mathematics rather than on the design, and it catches sign errors and frame errors immediately.

**An overall ok flag**, which is the conjunction of the two.

## What a dogleg limit is for

Four separate constraints, usually collapsed into one number:

**Drill string fatigue.** Every revolution cycles the pipe through the bend. Fatigue life falls very steeply with severity.

**Casing running.** A casing string has to bend through the dogleg elastically, and the stress from doing so adds to everything else it carries.

**Completion and tool passage.** Packers, pumps and logging tools have length, and a long stiff tool cannot pass a tight bend at all.

**Casing wear.** The drill string presses against the casing wall in a dogleg, and the contact force is proportional to tension times curvature. That is the torque and drag course's subject, and doglegs are its main input.

Typical limits are 3 degrees per 30 m for a section that will carry a long completion and 5 to 6 for a build section that will only ever see drill pipe.

## The honest check

The compiler does not decide whether a design is drillable. It reports the worst severity and whether the stated limit was exceeded, and leaves the decision where it belongs.

That is deliberate. A tool that quietly smoothed a design to meet a limit would be changing the well without saying so, and the changed well would no longer reach the target.

## What it cannot check

Whether the assembly can actually achieve the planned rate. Whether the formation will let it. Whether the string will lock up. Whether the hole will clean.

All of those come from the other courses in this module, and the compiler's silence about them is not an endorsement.

## The misconception to avoid

"If every segment is within the build-rate limit, the well is within the dogleg limit." Only for a planar well. Add any turn and the severity exceeds the build rate, by more the higher the inclination, and a plan can satisfy every segment's rate and violate the severity limit in the middle of a build-turn.

## Exercise

A design builds at 2 degrees per 30 m and turns at 5 degrees per 30 m through a section that runs from 55 to 65 degrees of inclination.

Estimate the dogleg severity at the start and at the end of that section. State whether either exceeds a 5 degrees per 30 m limit, and say what the designer should change.
