# Two modules and a kernel

Two apps in the Suite read crude and blend data, and behind them sit two engine modules and one solver. Knowing which module answers which question tells you where each figure in this course comes from.

## The three pieces

| module | exported functions | exported constants and tables |
| --- | --- | --- |
| crudeAssay | 18 | 1 (CII_BANDS) |
| productBlending | 5 (optimiseBlend, propertyOfBlend, rvpFromIndex, rvpIndex, valueGiveaway) | 4 (BINDING_TOLERANCE, BLEND_BASIS, RVP_INDEX_EXPONENT, SPEC_TEMPLATES) |
| lib/lp/simplex | 1 (solveLP) | 1 (LP_STATUS) |

The counts are measured from the modules themselves.

The Crude Assay & Blending Studio calls crudeAssay. Its 18 functions cover gravity, the three blending bases, the viscosity index, the boiling point curve, cut yields, the stability screen and netback. The one exported table, CII_BANDS, holds the bands of the colloidal instability index you meet in module five.

The Product Blending Optimizer calls productBlending. Its 5 functions build and solve a least-cost recipe for a finished product and report what the answer means. It calls the kernel solveLP in lib/lp/simplex to do the solving.

## One rule in one place

productBlending imports the gravity and viscosity rules from crudeAssay rather than restating them. Those are the digest's words, and they say where each rule lives: in crudeAssay, once. The optimizer does not carry a second copy of either rule. It takes the one the studio uses.

The same idea runs through this whole tier. Every property has one rule, the rule names its basis, and the engine prints that basis beside the answer so that nobody has to guess how a figure was formed.

## What each app is for

The digest lists four questions the studio answers, each with the function that answers it:

| question | function |
| --- | --- |
| what does this barrel turn into | cutYields, on a crude's curve or on blendDistillationCurves |
| what happens to the properties when two crudes mix | blendCrudes |
| will the mixture drop asphaltenes in the tank | screenBlendStability (inside blendCrudes) |
| what is it worth against the crude already bought | netbackValue, with its marker differential |

In each of the four, the crudes and their shares are something you supply, and the function reports what follows from them.

The optimizer answers one question: the least-cost recipe that meets every specification (optimiseBlend), with which specifications bind, what each binding one is costing, and the quality handed over on the rest. There the shares are the answer. You type the components and the specifications, and the recipe comes back.

## Where the kernel goes next

solveLP is the kernel that productBlending calls to do the solving. The Expert tier of this course teaches linear programming from the ground up, starting from solveLP's own statement of what it minimises. Refinery planning is the subject of the Refinery Feasibility & Planning course.

## What this tier uses

The Associate tier works through the studio's questions: gravity, the blending bases, viscosity, the curve and its cuts, and the stability screen. The optimizer's question and its kernel wait for the Expert tier.

## Exercise

Read the three rows of the module table. Quote the count of exported functions in each module and the constants each one exports. Then say what the fact that productBlending imports its gravity and viscosity rules from crudeAssay shows about how the two apps treat the same blend.
