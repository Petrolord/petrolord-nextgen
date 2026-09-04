# The category table

Sixteen states, four colours, and one green.

{{panel:wi-envelope-explorer}}

## The whole cross product

Four envelope verdicts on the primary, four on the secondary, so sixteen states for a well that can flow. Here they all are, straight from the digest.

| primary | secondary | category |
| --- | --- | --- |
| intact | intact | green |
| intact | degraded | yellow |
| intact | failed | orange |
| intact | empty | orange |
| degraded | intact | yellow |
| degraded | degraded | yellow |
| degraded | failed | red |
| degraded | empty | orange |
| failed | intact | orange |
| failed | degraded | red |
| failed | failed | red |
| failed | empty | red |
| empty | intact | orange |
| empty | degraded | orange |
| empty | failed | red |
| empty | empty | orange |

Count the colours and you get five red, seven orange, three yellow and one green.

## What that shape is telling you

**Green is a single state.** Both envelopes intact, nothing else. One degraded element anywhere in either envelope, including one element that is merely not verified, and the well is no longer green. There is no near miss and no rounding up.

**Orange is the largest class, and it covers two different situations.** One envelope has failed while the other is intact, or the well is down to a single envelope when two are required. Both leave you with exactly one thing between the reservoir and the surface, which is why they share a colour even though they read nothing alike on a barrier schematic.

**Red always needs a failure plus a partner that is not intact.** A failed envelope on its own is orange. Add a partner that is degraded, failed or missing and it turns red, because now there is no envelope you can still stand behind.

**The table is symmetric.** Swap the primary and secondary verdicts in any row and the colour is unchanged. The engine does not ask which envelope failed, only how many qualified envelopes are left. That is worth knowing because it is the opposite of the no flow case, where the primary decides everything and the secondary is not read at all.

## The one to look at twice

Empty against empty is orange, not red. A well with no barrier envelope recorded at all sits in the same class as a well with one good envelope, because the rule that fires is the missing second envelope rather than a failure. Nothing has been demonstrated to have failed, and the scheme categorises what is known.

## Exercise

Cover the table. Predict the colour for degraded against empty, and for failed against intact, then check.

Then find every state that would improve if you verified one not verified element, and say why the rest would not move.
