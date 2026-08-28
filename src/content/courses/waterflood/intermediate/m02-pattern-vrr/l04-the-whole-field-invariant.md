# The whole-field invariant

Before trusting a pattern analysis, it is worth checking that it degrades correctly. If you define one pattern containing every producer, and an allocation in which every injector's row sums to exactly one, the pattern periods should be the field periods. Not approximately: identically.

## The claim

$$\text{one pattern with all producers} + \text{rows summing to 1} \implies \text{pattern periods} = \text{field periods}$$

and therefore the pattern cumulative VRR equals the field cumulative VRR, 1.034899536109.

The engine's own test suite pins this. It is worth understanding why it is true rather than just that it passes.

## Why it holds

Take the pattern period construction. Production is summed over the pattern's producers; if the pattern holds all of them, that is the field production, term by term.

Injection is $\sum_{\text{injectors}} W_i \times \sum_{p \in \text{pattern}} \text{allocation}[i][p]$. If the pattern holds every producer, the inner sum is the whole row, which is 1 by assumption, so each injector contributes its full $W_i$. That is the field injection.

Both sides of the voidage equation reduce to the field's, so the ratio does.

## Why it is worth testing

Because it is a check that catches a large class of bugs with one assertion. Any error in the pattern machinery that loses or duplicates volume will break it: a producer dropped from the sum, an injector's fraction applied twice, a month key mismatch between the production path and the injection path, a filter applied on one side only.

It is the pattern-level analogue of the conservation audit, and it is stronger in one respect: conservation holds for any matrix including a wrong one, whereas this invariant pins the pattern code against an independently computed field answer.

## Where Ekene's real matrix stands relative to it

Ekene's actual matrix does not satisfy the precondition. Its rows sum to 0.90 and 0.85, so twelve percent of the injection never reaches any pattern. Sum the two elements' injected voidage:

$$135390.21199942206 + 66547.73132174983 = 201937.9433211719 \text{ rb}$$

against the field's 229474.93559224083 rb. The difference, 27536.992271068943 rb, is the out-of-zone twelve percent expressed in reservoir barrels: the allocation audit booked 26997.051246145966 barrels out of zone, which at $B_w = 1.02$ is 27536.992271068884 rb. The two agree to the twelfth digit, which is the addition order and nothing else.

Production, by contrast, does partition exactly:

$$112596.66438357021 + 109139.77242556904 = 221736.43680913927 \text{ rb}$$

against a field total of 221736.43680913927 rb. Identical, every digit.

So the two elements together account for all of the production and 88 percent of the injection. That is a useful cross-check to run on any real pattern set: production should partition exactly if your patterns are disjoint and complete, and any shortfall there is a producer you forgot.

## The two checks to run on a real pattern set

**Do the producers partition the field?** Sum the pattern productions and compare with the field. A mismatch means a producer is in no pattern, or in two.

**Does the injection shortfall equal the out-of-zone total?** Sum the pattern injections, subtract from the field, and compare with what the allocation audit booked as out of zone. They must agree, because they are the same quantity computed two ways.

Both are cheap, both are objective, and both catch bugs that leave the individual pattern numbers looking entirely reasonable.

## A degenerate case worth knowing

If you define patterns that overlap, production no longer partitions and the first check will show a surplus rather than a shortfall. That is not necessarily an error; overlapping patterns are legitimate. But it means the sum of pattern productions is no longer comparable with the field total, and any report that adds pattern numbers together is double counting. Know which regime you are in.

## The misconception to avoid

"The invariant is a unit test detail, not something an engineer needs." It is the one place where a pattern analysis can be checked against a number computed by a completely different code path. Everything else in this tier depends on a matrix nobody can verify. Take the objective checks where you can get them.

## Exercise

First, verify both checks on the Ekene numbers above: confirm the production partition and confirm that the injection shortfall equals the out-of-zone total expressed in reservoir barrels.

Second, describe what the first check would report if Ekene-5 had been accidentally omitted from both patterns, and state roughly how large the discrepancy would be given that Ekene-5 is the field's smallest producer.
