# Dual porosity and the dip

Two porosities, two timescales, and a derivative that goes down before it comes up.

{{panel:wt-diagnostic-explorer}}

## The model

Warren and Root's idealisation: a reservoir made of two systems occupying the same space.

**The fissures** conduct almost all the flow and hold very little fluid. They are the fractures, the vugs, the high-permeability streaks.

**The matrix** holds almost all the fluid and conducts almost none of it. It is the rock between the fissures.

Two parameters describe the pair. The storativity ratio omega is the fraction of the total storage that lives in the fissures. The interporosity flow coefficient lambda measures how readily the matrix gives fluid up to the fissures, and it carries the matrix block size and the permeability ratio in it.

The fixture has omega 0.08 and lambda 5e-7, with a fissure-system permeability of 85 mD, skin plus 2.

## The three-part response

**Early: the fissures alone.** Immediately after the rate change, only the fissures have responded. The well sees a reservoir with the fissure permeability and only 8 percent of the storage, so the pressure falls fast. The derivative reaches a plateau at the fissure system's level.

**The dip: the matrix wakes up.** As the fissure pressure falls, the matrix starts to feed it. That extra supply slows the pressure decline, and a slowing decline is a FALLING derivative. The derivative dips, and the depth of the dip is related to omega: the smaller the fissure storage relative to the total, the deeper the dip.

**Late: the total system.** Eventually the matrix and fissures are in equilibrium at every point and the reservoir behaves as one medium with the fissure permeability and the total storage. The derivative returns to a plateau at the SAME level as the early one, because the permeability has not changed.

Two plateaus at the same height with a dip between them. That is the signature, and nothing else in well testing looks like it.

## The numbers on this fixture

The early plateau, over 0.003 to 0.02 hours, averages 16.237254431611145 psi.

The derivative then falls to its minimum at 4.714866363457395 hours, a bit over a quarter of the height it recovers to. The panel gives you both numbers; the ratio between them is a graded capstone field, so it is left for you to read rather than printed here.

The late plateau, over 300 hours and later, sits close to the 9.344117647058821 psi that 85 mD implies, which is the fissure system's permeability.

Notice that the early plateau is HIGHER than the late one, which the clean textbook picture says should not happen: both are supposed to sit at the fissure permeability's level.

The reason is that the early plateau on this fixture is not a clean fissure plateau. Wellbore storage is still dying at those times and the derivative there is a mixture. This is the ordinary situation on real dual-porosity tests: the early plateau is usually the first casualty of storage, and the dip and the late plateau are what you actually get.

## What the classifier makes of it

Wellbore storage, then a transition from 0.12 to 2.68 hours, then radial from 79 hours on.

The middle segment is the dip. Its slope lands in the recharge band, exactly as the storage transition's does, and the ordering rule is what stops it being reported as a boundary: the derivative RECOVERS to a plateau afterwards, and recharge does not recover. Physically the confusion is more forgivable than usual, because a dip and a recharge boundary both mean "something started supplying fluid". The difference is that the matrix stops supplying once equilibrium is reached, whereas a constant-pressure boundary keeps supplying and the derivative keeps falling.

Which is the same argument the rule makes, and it is worth noticing that the rule can only make it once the recovery is IN THE RECORD. On a test stopped inside the dip, the last segment is a steep fall with nothing after it, and both the classifier and you would have to call it a possible boundary.

Which means the way to tell them apart is to wait. A dip recovers; recharge does not.

## Why it matters

A dual-porosity reservoir behaves very differently from a single-porosity one with the same average properties.

It produces well at first, from the fissures, and then depends on the matrix to resupply them. If lambda is small the matrix resupplies slowly and the well declines faster than a single-porosity forecast predicts. Water injection into a fissured system can channel through the fissures and leave the matrix oil behind.

So the diagnosis changes the development plan, and the two parameters feed a simulation model directly.

## The misconception to avoid

"A dip in the derivative means dual porosity." It means something started supplying fluid partway through the test. Layered reservoirs with crossflow do it. A nearby injector starting up does it. A gauge drifting does it. Dual porosity is distinguished by the derivative RETURNING to the same plateau it left, and confirming that needs the test to run long enough to see the return.

## Exercise

Open the panel on the dual-porosity fixture and record the derivative at 0.01, 0.1, 1, 10, 100 and 1000 hours.

Sketch the shape. Then say what you would conclude if the test had been stopped at 10 hours, and what you would conclude if it had been stopped at 100.
