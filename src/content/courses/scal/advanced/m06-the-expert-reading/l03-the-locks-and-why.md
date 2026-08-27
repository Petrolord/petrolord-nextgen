# The locks, and why

Every model in this course has edges, and the edges are not accidents. The engine behind SCAL Studio was built under an explicit set of owner locks, written into the source before the first course lesson existed: no LET curves, no hysteresis, no Thomeer capillary model, no three-phase relative permeability. This lesson is about what each lock excludes, where the excluded physics would live if it were ever unlocked, and why a deliberately thin tool is a professional asset rather than a limitation to apologize for.

## The dependency lock

Before the physics locks, there is a structural one. The Corey primitives, the kr function, the table validators, the whole displacement construction, are defined exactly once, in the fractional-flow module, and the SCAL module IMPORTS them from there, never the reverse. One definition means one behaviour: the curves the Welge tangent is drawn on are byte-for-byte the curves the fitting module fits and the curves the J-function work sits beside. When two implementations of the same primitive coexist, they drift, and you spent module three of this tier learning what silent drift does to a workflow that looks exact. The dependency lock is the same lesson applied to code.

The same discipline governs what happens downstream: the Waterflood course's engine imports this course's displacement analysis as its one sanctioned cross-domain import. It does not re-implement fractional flow. There is one Buckley-Leverett in the whole platform, and everything that needs one calls it.

## No LET curves

The LET family generalizes Corey with three shape parameters per curve instead of one. It fits stubborn lab data better, because six knobs fit almost anything better than two. That is precisely the argument against it here: this course spent an entire module showing you that even the two-knob fit is exactly determined by clean data, and that confidence intervals are the honest currency of a fit. Six correlated parameters on noisy data produce beautiful curves and meaningless intervals. If LET ever arrives, it belongs beside fitCoreyToKrTable as an alternative model with the same residual and interval machinery, and its acceptance test is written the same way: plant, recover, report.

## No hysteresis

Relative permeability and capillary pressure both depend on the direction of saturation change. The kr set you used is an imbibition set, water displacing oil, which is the waterflood direction. The J curve you built is a drainage curve, oil displacing water, which is the charging direction. The Professional tier reconciled the two conventions honestly, connate at 0.35 against the capillary asymptote at 0.25, and then this tier fitted and averaged within one branch at a time. A hysteresis model would connect the branches with scanning curves. Until it exists, the honest statement is the one you have been making all course: name the branch, and do not use a drainage curve to predict a flood.

## No Thomeer, no three-phase

The Thomeer lock is the capillary version of the LET lock: a richer parametric family for Pc curves that buys fit quality with parameter count. The engine's answer for data that will not power-law is deliberately humbler, a tabulated J spec that interpolates what was measured and claims nothing beyond it.

Three-phase kr is the deepest exclusion. The moment gas joins water and oil, relative permeability stops being two curves and becomes a surface, and every published three-phase model is an interpolation scheme between two-phase measurements with known failure modes. The engine holds a gas-oil Corey set alongside the oil-water one and refuses to blend them. A screening tool that silently interpolated to three phases would be claiming laboratory knowledge nobody has for this field.

## Why thin is a feature

Notice the pattern in all four locks. Each excluded feature would make the tool AGREE WITH MORE DATA while making its answers HARDER TO AUDIT. The course's engine chooses the opposite corner: fewer parameters, exact reproducibility, and edges you can state in one sentence each. That is what let this course plant parameters and recover them to machine precision, grade capstones at tolerances of five parts in ten thousand, and teach you the difference between a biased workflow and a wrong one. None of that pedagogy, and none of the audit trail it trains, survives contact with a six-knob curve family fitted to noise.

Professionally, the locks are also a statement about where judgment lives. The tool computes what is computable from stated inputs. Wettability drift, scanning behaviour, three-phase zones, polymer chemistry: those are decisions an engineer takes in front of the data, on the record, not defaults a library resolves silently. A thin tool keeps the judgment visible and attributable, which is exactly what module three taught you to demand of a workflow.

## The misconception to avoid

The misconception is reading a lock as a verdict that the excluded physics does not matter. Hysteresis matters enormously; that is WHY the branch discipline is enforced rather than modelled away. A lock says: this effect is real, this tool does not model it, and therefore this tool's answers carry a stated proviso. The dangerous tool is the one with no locks, because its answers carry the same provisos unstated.

## Exercise

First, for each of the four physics locks, write the one-sentence proviso an honest report must carry because of it, in the form: this analysis assumes X, which fails when Y.

Second, pick the lock you would unlock first if the owner asked, and write the acceptance test its implementation would have to pass before a course could teach it, in the plant-and-recover style this tier used on the Corey fit. Be specific about what golden data you would plant and what recovery tolerance you would demand.
