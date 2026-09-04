# The spring rule

Take the surface stroke, subtract the static stretch under the fluid load, and call what is left the plunger stroke. It is closed form, and it is a limit.

{{panel:pd-card-explorer}}

## The whole rule

`S - Fo Er`. Three quantities, one multiplication, one subtraction.

On the published taper, S is 64.000000 in, Fo is 5000.000000 lb and Er is 3.744037060e-3 in/lb. The static stretch is 18.720185299 in, so the rule returns 45.279814701 in.

On ODUMA-4, S is 106.687716837 in, Fo is 4690.299657039 lb and Er is 3.312268708e-3 in/lb. The stretch is 15.535532787 in and the rule returns 91.152184050 in.

Read what is not in that expression. No time. No mass. No damping. No speed. The rule returns 45.279814701 in for the published taper at half a stroke a minute and 45.279814701 in at fifteen, and it is right to, because there is nothing in it that could change.

## The fluid load is the only lever

Walk the fluid load on the published taper and the rule moves in a straight line, 3.744037060 in of plunger stroke lost per 1000 lb hung on the pump.

| Fluid load, lb | Spring rule, in |
| --- | --- |
| 1000.0 | 60.255962940 |
| 2000.0 | 56.511925880 |
| 3000.0 | 52.767888820 |
| 4000.0 | 49.023851761 |
| 5000.0 | 45.279814701 |

A heavier fluid column, a larger plunger or a deeper fluid level all arrive through the same term, and nothing else in the expression notices.

## Where the rule is exactly right

At half a stroke a minute the published taper marches to 45.286791250 in against the rule's 45.279814701 in. The gap is 0.006976549 in, which is 0.015408 percent. The engine's own test suite gates that speed and requires the marched answer to land within one percent of the rule.

That is the honest description of the spring rule: it is the static limit of the marched answer, and near the static limit the two are the same number to four figures.

## What it refuses to know

At 0.5 spm the wave crosses the published taper 195.465131814 times in one stroke, which is why the string behaves as a spring there. At 9 spm it crosses 10.859173990 times, at 0.168658954 of the string's own fundamental, and the string is no longer a spring. The rule cannot tell the difference, because it never asked what speed the unit runs at.

It also refuses to be wrong in a way that shows. It always returns a number, always a plausible one, always shorter than the surface stroke. Nothing about the output flags that it was applied outside the conditions where it holds.

## Exercise

Compute `S - Fo Er` for the published taper and for ODUMA-4, and write the static stretch that each subtraction removes.

Then read the marched plunger stroke of the published taper at 0.5 spm in the panel and state the gap in inches and in percent.
