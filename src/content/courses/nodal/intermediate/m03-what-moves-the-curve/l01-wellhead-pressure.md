# Wellhead pressure

The only lever in this tier whose effect can be written down before anything is computed. It moves everything and it changes nothing.

{{panel:pd-vlp-explorer}}

## Additive, and blind to rate

The demand is the wellhead pressure plus a gravity term plus a friction term, and only the last two know what rate the well is making. A change at the wellhead therefore lifts the whole curve by exactly that amount at every rate. That is a fact about the form, with no regime where it breaks down.

The dead column shows it cleanest: BONNY-7's runs 2430, 2500, 2570 and 2640 psia across wellhead pressures of 280, 350, 420 and 490 psia. Each step at the wellhead is a step at the bottom of a dead well.

## The bottom moves vertically and not horizontally

| BONNY-7 wellhead pressure, psia | Minimum rate, stb/d | Minimum bhp, psia |
| --- | --- | --- |
| 280 | 627.069742 | 1336.243252 |
| 350 | 627.069742 | 1406.243252 |
| 420 | 627.069742 | 1476.243252 |
| 490 | 627.069742 | 1546.243252 |

One rate, four times. FORCADOS-3 gives 1843.619418 stb/d at all four of its wellhead pressures, with minimum pressures of 2248.191408, 2348.191408, 2448.191408 and 2548.191408 psia.

A rigid vertical shift cannot move the horizontal location of a bottom. What was added has zero slope, so the slope at every rate is untouched and the rate where it crosses zero is untouched with it.

## The operational consequence

Raising the wellhead pressure does not move the loading rate. Choking a well back does push it towards trouble, but not by relocating the bottom. Nothing else in the shape moves either: friction still overtakes gravity on BONNY-7 at 968.379388 stb/d whatever the separator is doing, and the gravity share is still 0.12887773 at 1924.38 stb/d.

## What it refuses

It cannot fix a heavy column on its own. FORCADOS-3's dead column of 4310 psia stands 590 psi above its 3720 psia reservoir pressure, and dropping the wellhead to 860 psia takes it to 4210 psia, still above. The dead column moves one for one and no faster.

It cannot be read off a gauge. Every pressure here is psia and the module does not convert. Because the term is additive, a gauge reading typed as psia is wrong by the same amount at every rate. That error never shrinks and never cancels, so the curve looks reasonable while being uniformly wrong.

## The mistake

Confusing the pressures that all get called the wellhead pressure. The number in this curve is the pressure at the TOP OF THE STRING. A separator pressure sits downstream of a choke and a flowline, whose losses are nowhere in this curve, so using one where a tubing head pressure belongs understates the demand at every rate, silently.

The second is reporting a wellhead sensitivity as though it were a rate change. The curve moves rigidly. The well does not, because the reservoir's statement has not moved and it slopes.

## Exercise

In the panel, sweep BONNY-7's wellhead pressure across 280, 350, 420 and 490 psia, recording the minimum rate and the minimum pressure at each.

Then state why the four minimum rates are identical, and name what you would change instead to put that well's bottom at a lower rate.
