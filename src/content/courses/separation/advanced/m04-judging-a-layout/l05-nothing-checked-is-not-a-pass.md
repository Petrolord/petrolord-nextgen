# Nothing checked is not a pass

When no comparison was made there is no result to report, so `pass` comes back null and `passStatus` reads nothing-checked. The retired rule reported pass true on exactly those plans.

{{panel:fc-layout-explorer}}

## Two plans with nothing to say

s3AllUnplacedNothingChecked has two items and neither has usable coordinates: skipped `[{"id":"w1","reason":"bad-coordinates"},{"id":"s1","reason":"bad-coordinates"}]`. Checked is 0, complete is false, pass is null.

s3ZeroRequirementPairOnly has one pair that the table scores at zero. Checked is 0, zeroRequirementPairs is 1, and nothing was skipped or unknown, so complete is true. Pass is still null, because a layout can be fully judged and have had nothing in it to judge.

| case | checked | skipped | complete | pass | passStatus |
| --- | --- | --- | --- | --- | --- |
| s3AllUnplacedNothingChecked | 0 | 2 | false | null | nothing-checked |
| s3ZeroRequirementPairOnly | 0 | 0 | true | null | nothing-checked |

## What the retired rule did

The retired rule reported pass true on both. On s3AllUnplacedNothingChecked it also reported checked 0, so the plan said zero comparisons and a pass in the same breath. On s3ZeroRequirementPairOnly it reported checked 1, counting a zero-requirement pair as a check, and passed on it.

Both are the classic fail-open shape: an absence of violations read as a presence of compliance. A plan where every item lost its coordinates in an import would have come back green.

## Why null rather than true

Pass is a claim about comparisons. True says every comparison cleared, false says at least one did not, and with no comparisons there is no set to quantify over. The honest third answer is that the question does not apply, which is what null with a status of nothing-checked says.

That is why `passStatus` exists beside `pass`. A caller rendering a boolean has somewhere to put the third case instead of collapsing it into one of the other two.

## The refusals underneath

A layout check needs something to check. Hand it a value that is not a list and it comes back with an object carrying an `error` string, "a list of placed items is needed". Ask for a distance with one coordinate pair and it returns "two coordinate pairs are needed". Neither invents an empty result that would then report nothing-checked, because a caller mistake and an empty plan are different findings.

## The mistake

The mistake is rendering a null pass as a tick. A dashboard that shows green for true and grey for false will show green for null unless somebody thought about it, and the plan that produces null is the plan that was never examined.

The second mistake is reading complete true on s3ZeroRequirementPairOnly as reassurance. Complete says nothing stopped the judgement. It does not say a judgement happened, and on that plan the two fields have to be read together to see that nothing did.

## Exercise

Give the two cases that report `pass` null and say why complete differs between them. Then state what the retired rule reported on each, explain why null is the honest answer where true is not, and name the two error strings the layout and distance calls return when they are given nothing to work with.
