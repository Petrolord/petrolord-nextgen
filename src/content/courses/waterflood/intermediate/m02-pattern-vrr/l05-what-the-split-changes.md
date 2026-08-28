# What the split changes

Two numbers replaced one. This lesson is about what actually changes as a result, which is less than the drama of 1.20 against 0.61 suggests and more than nothing.

## What does not change

**The field's pressure story.** The Associate tier's pressure track was built from field cumulative volumes and it is untouched by how you group them. The reservoir still went to a trough at 2088.9530115439275 psia in April 2023 and recovered 34.4931292839633 psi. Splitting the ledger does not create a second pressure history.

**The total.** Whatever you conclude about the elements, the field injected 229474.93559224083 rb against 221736.43680913927 rb produced. Moving water from one element to the other does not change the total, and a recommendation that only rebalances is budget-neutral.

**The physics.** Pattern VRR uses the same voidage equation with the same conventions. Nothing new is being measured; the same measurement is being partitioned.

## What does change

**The available actions.** With one number, the only lever is total injection rate. With two, the levers are total rate and split, and the split is usually the cheaper one to move: rebalancing costs a valve setting, while increasing total injection costs water, power and disposal.

**The diagnosis when something is wrong.** A field at a VRR of 1.03 whose pressure is falling is a puzzle. The same field with one element at 1.20 and one at 0.61 has an obvious first hypothesis, and it can be tested by asking which wells' pressures are falling.

**Where you look for problems.** The North element is over-injected, so the question there is whether the extra water is doing anything, which is a sweep and channelling question. The South element is under-injected, so the question there is whether more water can be delivered, which is an injectivity and connectivity question. Two elements, two entirely different investigations, and module 4 and module 5 supply the tools for each.

## What it does not license

**"Reduce north, increase south" is not a conclusion yet.** Three things could each make it wrong.

The North element's producers are the ones actually making the field's oil. Ekene-6 is the nearest producer to both injectors, and it responds first and strongest. Cutting its pressure support to feed a distant well that has never seen water may trade a good barrel for a speculative one.

The South element may not be reachable. Ekene-5's allocation is a token 0.10 from an injector 2088 m away. If that connection is weak in the rock rather than merely weak in the matrix, doubling Ekene-4's injection sends most of the increment out of zone rather than to Ekene-5.

The imbalance may be an allocation artefact. The whole split rests on eight fractions rounded to 0.05. Testing that is the sensitivity work the exercise asks for.

**The twelve percent out of zone is not automatically recoverable.** It is a booked quantity, not a found one. Reducing it requires knowing where it goes, which nobody does.

{{panel:wf-pattern-explorer}}

Set the target VRR to 1.0 and read the advice tiles for each element in turn. The engine will tell you the scale factor and the per-injector change. Notice that it does this arithmetic without any opinion about whether the change is a good idea, which is the correct division of labour.

## The honest summary line

If you have to compress this tier's finding into one sentence for a report, it is:

> On the current allocation, the field's balanced cumulative VRR of 1.03 comprises a North element at 1.20 and a South element at 0.61, and the two require opposite corrections.

Note the first four words. Every conclusion in this tier is conditional on a matrix, and a sentence that does not say so is claiming more than the analysis supports.

## The misconception to avoid

"Now that we have the split, the field number is obsolete." The field number is the only one that requires no judgement, and it is the number that connects to the pressure history. Keep reporting it. The split is an additional view, not a replacement, and a report that shows only the elements has quietly discarded the objective foundation the elements were computed from.

## Exercise

First, build a sensitivity test: move 0.05 of allocation from Ekene-6 to Ekene-3 in Ekene-2's row, keeping the row sum at 0.90, and estimate qualitatively which direction each element's cumulative VRR moves and by roughly how much. State whether the conclusion survives.

Second, write the three questions you would ask before agreeing to reduce Ekene-2's injection rate, and say which of them can be answered with data already in this course.
