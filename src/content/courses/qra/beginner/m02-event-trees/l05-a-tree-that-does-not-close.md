# A tree that does not close

{{panel:qr-event-tree}}

A tree closes when every branch set in it sums to one, at every depth. When one set fails, part of the initiating frequency either leaks out of the tree or is created from nothing, and every leaf below is suspect. The engine checks every set before it multiplies anything, and when one fails it refuses the whole tree and names the failing set by its path. This lesson reads those refusals as directions to the fault.

## The top set, and a lower set

When the top branch set fails, the field is the tree's own list:

> tree.branches: the branch probabilities sum to 0.8999999999999999, not 1 (tolerance 1e-9): every branch set must be exhaustive and exclusive

When a lower set fails, the field walks down to it:

> tree.branches[0].next.branches: the branch probabilities sum to 0.5, not 1 (tolerance 1e-9): every branch set must be exhaustive and exclusive

Read the second field from left to right. `tree.branches[0]` is the first branch of the top set. `.next` is the branch set beneath it. `.branches` is that set's list. So the fault is one level down, under the first top branch, and that set covers only half of what can happen there.

## A deep path in a named tree

The flammable release tree is built by the engine from a few inputs, and one of those inputs, the split between flash fire and explosion, becomes a branch set deep in the tree. When a stated split does not close, the refusal carries both the input name and the path:

> vapourCloudSplit: tree.branches[1].next.branches[0].next.branches: the branch probabilities sum to 0.8999999999999999, not 1 (tolerance 1e-9): every branch set must be exhaustive and exclusive

The field is `vapourCloudSplit`, the input you typed. The path after it shows where that input landed: under the second top branch, no immediate ignition, then under the first branch beneath it, delayed ignition. That is exactly where a vapour cloud forms and then either burns or explodes.

## What the engine will refuse

| what fails | field named |
| --- | --- |
| the top branch set | `tree.branches` |
| a set under the first top branch | `tree.branches[0].next.branches` |
| the vapour cloud split | `vapourCloudSplit` |
| an empty branch set | `tree.branches` |

Each refusal is total. No leaf comes back from a tree with one open set, because a leaf frequency computed under a set that leaks would be a wrong number that looks right.

## What the engine cannot refuse

A closing tree is valid arithmetic whatever it means. If an analyst hangs a branch under the wrong parent, or swaps two probabilities within a set, every set still sums to one and the engine runs the tree without complaint. The engine cannot know that a branch belongs somewhere else; the analyst draws the tree. The next module shows what that costs on a flammable release, where each wrong build is a real tree and moves the answer.

## Exercise

A refusal reports that the set at `tree.branches[0].next.branches` sums to 0.5. Draw the top of the tree and mark which set the field points to. Then say how much probability is missing from that set, and write one line describing the kind of branch the analyst most probably forgot to draw.
