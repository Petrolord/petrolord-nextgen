# What J cannot do

A tool you trust is a tool whose limits you can recite. The J-function has carried this whole tier, so before the capstone certifies you on it, spend one lesson on what it cannot do, what the engine deliberately refuses to model, and what an honest report says about both.

## The locks, by name

The engine behind SCAL Studio is thin by design, and the owner's lock on it names four exclusions.

**No Thomeer, no Brooks-Corey machinery.** The only parametric form the engine fits is the power law $J = a \, S_w^{*\,-b}$. Real rocks sometimes refuse it. The Leverett figure itself, from module 4, is the standing example: a plateau-shaped curve that the power law represents only to within the figure's own read tolerance, with a fit quality far below the collapse-clean Ekene plugs. When your data will not power-law, the engine's answer is not a fancier model, it is the tabulated spec: carry the measured J rows themselves and interpolate. A table is humbler than a model and never lies about curvature.

**No hysteresis.** A capillary pressure curve depends on the direction the saturation is moving. Everything this tier measured and scaled was a drainage branch: water displaced by the non-wetting fluid, the history that charged the reservoir. The imbibition branch, water pushing back in, sits below the drainage branch and rejoins it at the endpoints. The engine carries one branch and does not pretend otherwise.

**No three-phase model.** Gas, oil and water together are outside the lock. The gas-oil Corey set exists for gas-oil systems at connate water, and that is as far as the engine goes.

**Contact angle taken as given.** J scaling divides by $\sigma \cos\theta$, and the engine will accept whatever angle you type. Wettability alteration, mixed-wet ageing, angle hysteresis: all outside. Module 2's last lesson said when to distrust a contact angle; the engine cannot say it for you.

## The drainage honesty

The most important limit is the one that connects the two halves of this course. The J curve you built describes charging: it answers where the fluids settled as oil migrated in over geological time. The waterflood you studied at the Associate tier is imbibition: water advancing into oil over years. A saturation-height model from drainage data tells you the initial state, and it is the right tool for volumes in place, for the free water level, for the crest saturation. It does not tell you what saturations a flood will leave behind. That is the displacement half's job, with its own residuals and its own curves. Using a drainage $S_{wirr}$ of 0.25 as if it were a flood-out saturation would be a category error, and the Ekene fixture is built so the two numbers cannot be confused: the kr set's connate water is 0.35, and the capillary asymptote is 0.25, deliberately different, each true in its own experiment.

## What an honest report says

A Professional deliverable built on this tier's chain should state, in the same paragraph as its headline numbers: which branch the lab data measured, which samples were averaged and with what shared $S_{wirr}$, whether the reservoir spec is a fitted power law or a tabulated curve, and which fluid-pair properties were assumed rather than measured. None of that is decoration. Every one of those items is a place where two competent engineers can legitimately land on different numbers, and naming them is what lets a reviewer check you instead of re-doing you.

## The misconception to avoid

The misconception is that a thin engine is a weak engine. The locks are not missing features, they are refusals to guess. A tool that fits only one parametric form, carries only one branch, and models only two phases is a tool whose every output you can trace by hand, which is exactly what this course has done with it. The moment you need Thomeer or hysteresis, the answer is a richer study with richer data, not a quiet extrapolation from this one.

## Exercise

First, list the four locks from memory and, against each, one field situation that would violate it. For each situation, say what data you would need before a richer model would be justified.

Second, take the Ekene pair of saturations, the kr connate at 0.35 and the capillary $S_{wirr}$ at 0.25, and write three sentences for a non-specialist explaining why both can be true at once. If your explanation works, you understand the drainage honesty; if it does not, re-read module 5 before the capstone.
