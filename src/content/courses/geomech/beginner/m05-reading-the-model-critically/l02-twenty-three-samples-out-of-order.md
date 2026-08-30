# Twenty-three samples out of order

Which ones, and what is wrong with them.

{{panel:gm-stress-explorer}}

## The finding

At the published parameters, 23 of this profile's 52 samples break the normal faulting stress ordering.

They are the 23 SHALLOWEST samples: every depth from 50 m to 1150 m inclusive, and none below that.

## What exactly is violated

One thing, in all 23: **the overburden is below SHmax.**

Not SHmax below Shmin, and not pore pressure above Shmin. Just the one condition, and it is the one that defines the faulting regime.

## What the numbers look like

| depth | overburden EMW | SHmax EMW |
|---|---|---|
| 50 m | 2300 | 5163.327145190827 |
| 300 m | 2300 | 4548.220828421227 |
| 550 m | 2300 | 3173.5244922701645 |
| 800 m | 2300 | 2658.013366213516 |
| 1050 m | 2300 | 2387.983728755272 |
| 1150 m | 2300 | 2312.84504702776 |
| 1200 m | 2300 | 2279.9718737719736 |

The excess shrinks with depth and disappears between 1150 m and 1200 m.

## What it means physically

A stress state in which a horizontal stress exceeds the vertical one is not a normal faulting regime. It is a strike-slip or reverse faulting regime, depending on where the second horizontal stress sits.

So the model has been told the field is normal faulting and has produced, over the top 1150 m, a stress state that is not.

## Why that is worse than it looks

Because the faulting regime is not decoration. It decides which frictional bound applies, which stress is the maximum principal one, and how a hole is loaded.

A calculation that assumes one regime and computes a stress state in another is internally inconsistent, and every output above 1150 m inherits the inconsistency.

## What the engine does about it

It reports the violation through the quality score and it computes anyway.

That is defensible: refusing to run would leave the user with nothing, and computing with a loud warning leaves them with a number and a reason to distrust it. It does mean the warning has to actually be read.

## What it does not do

It does not fix it. There is no automatic reconciliation, no switching regimes partway down the profile, and no suppression of the shallow output.

## Where the fault lies

Not with the clamping. Only 4 of the 23 depths are clamped at all, so 19 of them reached this state through the estimate alone.

The next lesson is which term did it.

## Exercise

Using the panel, find the exact depth interval over which the violation persists at the published settings.

Then say what would happen to that interval if the overburden gradient were 2500 kg/m3 rather than 2300, and check.
