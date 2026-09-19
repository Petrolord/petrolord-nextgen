# Four questions an assay answers

A crude assay is a record of what a crude oil is. It carries the gravity, the sulfur, the acid number, the nitrogen, the metals, the viscosity, the SARA split into saturates, aromatics, resins and asphaltenes, and a true boiling point curve that says how much of the crude has distilled by each temperature.

Every crude, every price and every specification in this course is invented and illustrative. The streams carry the names of real places in Rivers State, Delta State and Lagos. The records are not real assays, and no figure here is a market price or a regulation for any real grade.

## What the studio asks of an assay

The Crude Assay & Blending Studio answers four questions, and each has its own function in the engine.

| question | function |
| --- | --- |
| what does this barrel turn into | cutYields, on a crude's curve or on blendDistillationCurves |
| what happens to the properties when two crudes mix | blendCrudes |
| will the mixture drop asphaltenes in the tank | screenBlendStability (inside blendCrudes) |
| what is it worth against the crude already bought | netbackValue, with its marker differential |

The first question is about products. A barrel of crude is sold to a refinery as a set of cuts: light ends, naphtha, kerosene, diesel, vacuum gasoil and residue. The curve decides how much of each the barrel holds.

The second question is about mixing. Crudes are blended at export terminals so that one cargo meets a buyer's limits on gravity and sulfur. Each property of the mixture has its own rule, and the rule is the heart of this tier.

The third question is about the tank. Some mixtures of a heavy crude and a light one drop asphaltenes as a sludge, and a screen catches it before commingling.

The fourth question is about value, and it belongs to the Professional tier.

## The question the optimizer asks

A second app, the Product Blending Optimizer, asks one question: the least-cost recipe that meets every specification. It returns which specifications bind, what each binding one is costing, and the quality handed over on the rest. That is linear programming, and the Expert tier teaches it.

## How this tier reads an assay

This tier owns the assay and the blend. You will learn which basis each property blends on, why the wrong basis gives a plausible number, what a blank field means, how a curve is read between and outside its measured points, and how the stability screen answers. Each engine answer carries the basis the engine names, and every lesson quotes that basis in the engine's own words.

A blank field deserves a word now, because it runs through the whole tier. When an assay does not carry a property, the engine treats it as absent. It does not fill the gap with a zero, and it names the crude that lacks the value.

## Exercise

Read the four questions and their functions in the table above. For each one, name the part of the assay record it depends on: the gravity, the per-mass properties, the SARA split or the true boiling point curve. Then say which of the four questions blendCrudes answers on its own, and which one it answers only by calling another function inside it.
