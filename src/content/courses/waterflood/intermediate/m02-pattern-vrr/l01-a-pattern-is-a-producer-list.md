# A pattern is a producer list

A flood pattern in a textbook is a geometric object: a five-spot, a nine-spot, a line drive, drawn on a map with the injectors at the corners. In this engine a pattern is something much plainer, and the plainness is deliberate.

## The definition

$$\text{pattern} = \{\text{name}, \text{producers}\}$$

A name and a list of producer wells. That is all. There is no geometry, no area, no injector list.

The injectors are not named because they do not need to be. The allocation matrix already says what fraction of each injector's water reaches each producer, so the pattern's injection follows from the producer list plus the matrix. Naming injectors in the pattern too would let the two definitions disagree.

## How the periods are built

For each month:

**Production** is summed over the pattern's producers. Oil, water and gas from those wells, nothing else.

**Injection** is the allocation-weighted share of EVERY injector. For each injector, add up the fractions it sends to producers in this pattern, and take that share of its volume:

$$W_{i,\text{pattern}} = \sum_{\text{injectors}} W_i \times \sum_{p \in \text{pattern}} \text{allocation}[i][p]$$

For Ekene's North element, holding Ekene-1 and Ekene-6, that inner sum is $0.30 + 0.45 = 0.75$ for Ekene-2 and $0.35$ for Ekene-4. So the North element receives three quarters of Ekene-2's water and a bit over a third of Ekene-4's, every month.

The result has exactly the same shape as a field period: a label and five volumes. So the voidage engine you already know consumes it unchanged. Nothing about the physics is new at pattern level; only the inputs are.

## Worked: the North element in January 2023

The pattern period for 2023-01 comes out as

$$N_p = 2322.1683044997553, \quad W_p = 0, \quad W_i = 2825.7643895409715$$

Check the injection against the field. The field injected 4789.431168713511 barrels that month, split 0.6 to Ekene-2 and 0.4 to Ekene-4, so Ekene-2 injected 2873.6587012281067 and Ekene-4 injected 1915.7724674854045. The North element receives

$$0.75 \times 2873.6587012281067 + 0.35 \times 1915.7724674854045 = 2825.7643895409715$$

which is the pattern period's $W_i$ exactly. The arithmetic is worth doing once by hand so that the pattern injection stops being a black box.

{{panel:wf-pattern-explorer}}

Select each pattern in turn and watch the lime line move while the pink field line stays put. The field line is the same series in both cases, because the field does not care how you group it.

## Patterns can overlap, and here they do not

Nothing in the definition prevents two patterns from sharing a producer. Sometimes that is what you want: a well between two elements genuinely belongs to both, and analysing it in each gives you two views.

Ekene's two patterns are disjoint. Every producer is in exactly one, and together they hold all four. That is a choice made for clarity, and it has a useful consequence that the next lessons exploit: because the producer lists partition the field, the two patterns' production sums to the field production exactly.

The injection does not, because twelve percent of it is out of zone. That asymmetry, production partitioning cleanly and injection not, is the whole reason the two elements can be at 1.20 and 0.61 while the field sits at 1.03.

## Naming is not claiming

The patterns are called "North (Ekene-2 element)" and "South (Ekene-4 element)". Those names are labels for humans. They do not assert that Ekene-2 feeds only the north, and it does not: it sends 0.15 to Ekene-3, which is in the south. Both injectors feed both elements.

That is normal. Real floods are not neatly separable, and an engine that required each pattern to have its own dedicated injector would not be able to represent most fields. The naming convention exists so people can talk about the elements; the arithmetic ignores the names entirely.

## The misconception to avoid

"A pattern must be a geometric shape with the injector in the middle." That is a design convention from greenfield flood planning, where you drill the wells on a grid on purpose. Brownfield surveillance works with the wells that exist, and a pattern there is best understood as a bookkeeping grouping, not a shape. Making a producer list the definition is what lets the same tool handle both.

## Exercise

First, compute the pattern injection for the South element in January 2023 from the field injection, the 0.6 / 0.4 split, and the allocation matrix. Check that your answer plus the North element's 2825.7643895409715 plus the out-of-zone share equals the field's 4789.431168713511.

Second, define a third pattern holding only Ekene-6 and write out the inner allocation sums for both injectors. State what fraction of the field's injection that single-well pattern would receive.
