# What the engine assumes

Every number this course graded came out of the classic one-dimensional Buckley-Leverett displacement, and that model earns its clean answers by assuming things. None of the assumptions is a scandal. Each one is a deliberate simplification with a known cost, a known direction of error, and a named place where the correction lives. An Associate who can list them, and say what each one hides, is worth more than one who can only transcribe the six capstone numbers.

## The list

**One dimension.** The model is a line from injector to producer. Water enters one end, oil leaves the other, and every point on the line sees the same total flux. There is no areal geometry, no well pattern, no layering, and therefore no concept of rock the water misses. What the assumption hides is sweep: in a real pattern some of the reservoir is never contacted at all, and the oil there is lost at saturation $1 - S_{wc}$, not at $S_{or}$. That is why the ceiling $E_{Dmax} = 0.6153846153846154$ is a displacement ceiling, not a recovery forecast. Pattern geometry, layered sweep, and the bookkeeping that combines them with displacement belong to the Waterflood course, which imports this one rather than repeating it.

**Immiscible fluids.** Water and oil do not mix, dissolve, or exchange components. Each barrel keeps its identity, which is exactly what lets saturation act as bookkeeping. The cost is that nothing here describes solvent or gas injection, where the fluids do mix and the front chemistry changes the physics entirely.

**Incompressible flow.** A barrel injected is a barrel produced, instantly, everywhere on the line. This is what makes pore volumes the natural clock and lets module 5 convert them to days with one multiplication. The hidden cost is pressure: the model has no opinion about what pressure the flood needs, whether the injector can take 8000 barrels per day, or what happens to voidage when it cannot. Those questions live with injectivity and voidage accounting in the Waterflood course.

**Capillary pressure neglected in the flux.** The fractional flow function used viscosities and relative permeabilities only. Dropping the capillary term is precisely what makes the front a sharp discontinuity: the tangent construction exists because the neglected physics would otherwise smear the shock over a finite distance. In the field, the front is a zone, not a plane, and breakthrough is a ramp in water cut rather than a step. The capillary half of SCAL, including what that smearing zone looks like standing still, is the heart of the Professional tier.

**No gravity in the flux.** Ekene was flooded flat. The engine itself carries a dip term for inclined displacement, and the Expert tier turns it on, prices it against rate, and shows when it can be ignored. At this tier you only need to know the term exists and was zero in everything you computed.

**Homogeneous rock.** One Corey curve set, one porosity, everywhere. Real sands are layered, and layers breach in order of their speed, so real breakthrough comes earlier than the homogeneous number and the water cut climbs in steps. The one-dimensional answer is best read as the behavior of one layer; stacking layers is, again, Waterflood material.

**Noise-free inputs.** The Ekene curve set is a designed plant: the engine's analysis recovers its parameters exactly, which is what makes every graded number reproducible to machine precision. A laboratory curve set never cooperates like that, and the craft of fitting models to real lab data, with residuals and confidence intervals, is where the Expert tier begins.

## Why the assumptions are a feature

It is tempting to read the list as a confession. Read it instead as the reason the model is usable. Because the model is one-dimensional and incompressible, its answer depends on exactly six rock and fluid properties, every one of which a laboratory can measure. Because the front is sharp, breakthrough is a single number you can put in a plan. A model with all the physics in it would need inputs nobody has and would return answers nobody can check by hand. The skill you have just built, walking a small model honestly and knowing its edges, is the same skill every larger model demands. The larger models just have more edges.

## The misconception to avoid

The wrong lesson to take from this page is that the six capstone numbers are fragile. They are not: within its stated frame, the Buckley-Leverett answer is exact, and the engine reproduces it to fifteen figures. The fragility enters only when a number is quoted outside the frame, an $E_{Dmax}$ sold as field recovery, a breakthrough date quoted for a layered sand. The assumptions do not weaken the numbers. Quoting the numbers without the assumptions does.

## Exercise

First, pick the three assumptions you judge most consequential for Ekene specifically, given what you know of the field: four producers, two injectors that found the sand wet, a mapped contact. For each, write one sentence on how you would detect its failure in production data.

Second, for each of the six capstone numbers, name the single assumption whose failure would move it most, and the direction it would move. Keep the list; the Waterflood course opens by breaking two of these assumptions on this exact field.
