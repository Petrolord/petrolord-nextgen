# A hundred metres, or fifty

There are only two numbers in the plug length rule, and the whole check turns on which one the engine picks before it measures anything.

{{panel:wi-pa-explorer}}

## The two numbers

`plugRuleCheck` opens by choosing a required length. For a cement plug set in open hole or on nothing in particular, the requirement is **100 m MD**. For a plug set on a verified foundation, it is **50 m MD**.

The choice happens first, from the plug description alone. Only then does the engine compute the actual length as `bottomMdM - topMdM` and compare. So the same 60 m of cement is a failure in one well and a pass in another, and nothing about the cement has changed.

## Where these numbers come from

They are not physical law. The engine header says what they are: the commonly cited **NORSOK D-010 rev 4** permanent barrier conventions, carried as `D010_DEFAULT_RULES` so a user can override them. There is an armed literature gate on the module, and the standard document governs. Your regulator or your own well programme may set different figures, and the engine will use them if you pass them in.

## The sweep

Ten lengths run against both requirements:

| Length, m MD | Open hole, needs 100 m | On a verified foundation, needs 50 m |
| --- | --- | --- |
| 30 | fail | fail |
| 45 | fail | fail |
| 48 | fail | fail |
| 50 | fail | pass |
| 60 | fail | pass |
| 80 | fail | pass |
| 98 | fail | pass |
| 100 | pass | pass |
| 120 | pass | pass |
| 150 | pass | pass |

Two things to read off it. The comparison is `>=`, so 50 m on a foundation passes with a margin of exactly 0, and 100 m in open hole does the same. And 98 m in open hole fails by 2 m, which is well inside the depth uncertainty of most tags. A plug designed to the number is a plug designed to fail half the time.

## What the engine refuses

If the length is not positive the engine throws rather than answering. `Plug needs bottom below top.` There is no zero length plug and no plug with its base above its top, so there is no verdict to give.

## Exercise

1. In the panel, set a plug 98 m long with no foundation and read the margin. Then add 2 m and read it again.
2. Override `plugMinLengthM` to a figure from your own abandonment guidelines and re-run the sweep.
3. List the swept lengths that answer the same under both requirements, and say why those are the uninteresting cases.
