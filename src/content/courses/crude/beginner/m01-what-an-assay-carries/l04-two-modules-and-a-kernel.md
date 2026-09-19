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

productBlending imports the gravity and viscosity rules from crudeAssay rather than restating them. That is a design choice with a practical point. If the rule for turning a blended specific gravity into API lived in two places, the two apps could quietly disagree about the same blend. With one copy, the studio and the optimizer compute gravity and viscosity the same way, and a correction to the rule reaches both.

The same idea runs through this whole tier. Every property has one rule, the rule names its basis, and the engine prints that basis beside the answer so that nobody has to guess how a figure was formed.

## What each app is for

The studio is a reading tool. You give it crudes and shares, and it tells you what the blend is: its gravity, its sulfur and the other per-mass properties, its viscosity, what the barrel turns into, and whether the mixture is likely to stay stable. It does not choose the shares for you.

The optimizer is a choosing tool. You give it components with a cost and a quality each, and a set of specifications, and it chooses the shares. It answers the least-cost recipe that meets every specification, with which specifications bind, what each binding one is costing, and the quality handed over on the rest.

## Where the kernel goes next

solveLP is a general linear programme solver. This course owns linear programming for the whole module, and the Expert tier teaches it from the ground up. The same kernel plans a refinery, and the Refinery Feasibility & Planning course takes that up.

## What this tier uses

Everything in the Associate tier comes from crudeAssay. The optimizer and its kernel wait for the Expert tier.

## Exercise

Read the three rows of the module table. Quote the count of exported functions in each module and the constants each one exports. Then say what the fact that productBlending imports its gravity and viscosity rules from crudeAssay shows about how the two apps treat the same blend.
