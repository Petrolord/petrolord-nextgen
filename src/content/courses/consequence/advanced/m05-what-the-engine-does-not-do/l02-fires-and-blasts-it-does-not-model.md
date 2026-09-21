# Fires and blasts it does not model

The fire and blast sections of the engine are narrow on purpose. They carry a pool fire by the solid flame model and a free air TNT burst by Kinney and Graham, and very little else. This lesson names what is missing from those two sections, why each is missing, and where an analyst goes instead. None of these is computed in this course.

## Three absences, and one that lives elsewhere

| not in the engine | why, from the engine header and its validation record | what the analyst does instead |
| --- | --- | --- |
| a jet fire | the only worked example read carries internal inconsistencies, so a golden could not tell a right engine from a wrong one | uses a jet fire model elsewhere |
| the Kingery-Bulmash fits | the coefficients were not obtained; the sources read print curves | uses Kinney and Graham within its range |
| the TNO multi-energy method | the blast charts are graphical and no published curve fit was found | treats congestion with a method outside this engine |
| point source heat radiation and setbacks | they live in the facilities engines and the Facilities courses grade them | uses the solid flame model here |

## The jet fire

A pressurised gas release that ignites at the hole burns as a jet fire. The engine does not model it, and its solid flame, a cylinder of radius D/2 standing on a pool, is the wrong shape to stand in for one. The reason it is absent is instructive: the one worked example its authors read was internally inconsistent, so a golden built from it could not distinguish a correct engine from an incorrect one. A test that cannot fail validates nothing, so the model was left out. Where a jet fire matters, the note says so and names the tool that modelled it.

## Two blast methods

Kingery-Bulmash is another compilation of blast curves, and its range lends Kinney and Graham the span of Z this engine uses. Its coefficients were not obtained, so only the borrowed range is here. The TNO multi-energy method treats a vapour cloud explosion by its congestion, which is exactly the thing a TNT equivalence cannot represent except through its yield factor. Its blast charts are graphical and no published curve fit was found. Inside this engine, then, the yield factor is the whole of the answer to congestion. An analyst who needs congestion to drive the answer uses that method outside this engine and records the fact.

## The seam with the Facilities courses

The facilities engines carry a point source model of heat radiation, in which the flame is treated as a point radiating a fraction of its heat release equally in every direction, and the flare and pool fire setbacks it implies. The Facilities courses on relief and flare systems and on layout teach and grade them. This engine does not re-expose them, and its validation record carries a test that asserts it exports none of them. This course adds the solid flame model, which the facilities pool fire setback states it does not provide, and grades only the solid flame. A setback distance is never computed or graded here, and no heat radiation level from those courses appears in this one.

## Exercise

Take a high pressure gas line that could leak, ignite at the hole, or form a cloud in a congested pipe rack. Write a short consequence note section that lists each fire or blast outcome, says whether this engine models it, and for each one it does not, names what the table above says the analyst does instead. Close with one sentence stating which course grades a flare setback.
