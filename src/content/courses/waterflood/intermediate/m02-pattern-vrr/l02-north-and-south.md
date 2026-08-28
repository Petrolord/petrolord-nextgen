# North and South

This is the lesson the tier exists for. One field, one record, one voidage equation, and two answers that would lead to opposite decisions.

## The three numbers

| | field | North (Ekene-1, Ekene-6) | South (Ekene-3, Ekene-5) |
|---|---|---|---|
| cumulative VRR | 1.034899536109 | 1.2024353717815623 | 0.6097477559533482 |
| latest instantaneous | 1.05 | 1.2425079040670826 | 0.6072854843711397 |
| rolling 3 | 1.05 | 1.240523853264427 | 0.6082528252875008 |
| produced voidage (rb) | 221736.43680913927 | 112596.66438357021 | 109139.77242556904 |
| injected voidage (rb) | 229474.93559224083 | 135390.21199942206 | 66547.73132174983 |

The field looks healthy. The North element is twenty percent over-injected. The South element is replacing barely three fifths of what it takes.

## Where the asymmetry comes from

Look at the produced voidage column. The two elements are almost identical: 112596.66438357021 against 109139.77242556904, a difference of three percent. The two halves of the field are producing at nearly the same rate.

Now look at injection: 135390.21199942206 against 66547.73132174983. The North element receives more than twice the water.

That is not a subtle effect of the matrix. It is the direct consequence of where the injectors sit. Both are on the east side, both are nearer the northern producers, and the allocation follows the distances. Ekene-2 sends 0.75 of its water north and 0.15 south; Ekene-4 splits 0.35 north and 0.50 south. Combined with the 0.6 / 0.4 injection split, the North element takes 0.59 of the field's injection and the South takes 0.29, with 0.12 out of zone.

Fifty nine percent of the water to half the production, and twenty nine percent to the other half.

## Why the field average is not a compromise

A tempting reading is that 1.03 is somewhere between 1.20 and 0.61, so the field number is a reasonable summary of both. It is not, in a specific and important sense: it is a voidage-weighted average, so it happens to land near the middle here only because the two elements produce similar voidage. Change the production balance and the field number will sit near whichever element produces more, regardless of which one has the problem.

The deeper point is that no single number can summarise the pair, because the two elements need OPPOSITE actions. North should inject less; South should inject more. An average of "less" and "more" is "leave it alone", which is the one action that is wrong for both.

{{panel:wf-pattern-explorer}}

Switch between the two patterns and watch the lime line jump from well above the pink field line to well below it. That gap is not noise and it is not a modelling artefact. It is the field's real geometry showing up in the bookkeeping.

## What each element is probably experiencing

**North** is taking a lot of water. Some of that water is holding pressure, and some of it is likely cycling: arriving at Ekene-6 and Ekene-1 without displacing much on the way. Ekene-6 is the nearest producer to both injectors and the first to see water, in March 2024, fourteen months in. Module 5's water arrival diagnostics have something to say about whether that arrival was orderly.

**South** is starved. Ekene-5, in the far west, receives 8999.01708204866 barrels over the whole record, against Ekene-6's 92239.92509099872. It has never produced water at all. If the matrix is broadly right, Ekene-5 is not being flooded in any meaningful sense, and expecting a flood response there is expecting something nobody paid for.

Both of those readings are conditional on the allocation. Both are also robust to the details of it, because they follow from the injectors both being in the east.

## The decision this changes

Before the split, the natural conclusion from a field VRR of 1.03 is that the flood is on plan and needs no action. After the split, there are two candidate actions: reduce injection in the north, and increase it in the south. The next module builds the arithmetic for both.

Note that "reduce north, increase south" is not automatically right either. Reducing north risks losing pressure support at the wells that are actually producing the field's oil. Increasing south may just push more water out of zone if the reason South is starved is that its injector cannot reach it. Pattern VRR tells you the imbalance exists; it does not tell you the imbalance is fixable.

## The misconception to avoid

"The field number was wrong." It was correct and it answered the question it was asked. The mistake is in the question: "is the field replacing its voidage" has an answer, and "is every part of the field replacing its voidage" is a different question that requires different inputs. Nothing in the Associate tier was defective. It was complete for its scope.

## Exercise

First, compute each element's share of the field's produced voidage and of its injected voidage, and express the imbalance as a single ratio. Then state what that ratio would have to become for both elements to sit at the field average.

Second, using the produced voidage figures, calculate how much extra injection the South element would need over the whole record to reach a cumulative VRR of 1.0, in reservoir barrels and then in barrels of water at $B_w = 1.02$.
