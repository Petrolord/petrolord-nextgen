# The rate is a trade

One knob, two constraints, and they pull in opposite directions.

{{panel:cm-placement-explorer}}

## The two constraints

**Do not free fall.** The U-tube must stay non-negative through the job. Friction is what holds the column up, and friction rises with the rate. So this constraint wants the rate HIGH.

**Do not fracture the shallowest exposed formation.** The circulating density at the previous shoe must stay under the leak-off value. Friction raises it. So this constraint wants the rate LOW.

The same friction term appears in both, with opposite signs on what it does for you.

## The sweep, on the horizontal well's neat programme

| rate (m3/s) | steps in free fall | worst U-tube (Pa) | peak ECD at the previous shoe |
|---|---|---|---|
| 0.005 | 22 | -2998255.4846425466 | 1599.449060587902 |
| 0.01 | 14 | -1951841.0570193082 | 1641.6681196736095 |
| 0.02 | 1 | -104394.27505085245 | 1715.156233904509 |
| 0.03 | 0 | 3380287.148406647 | 1834.0257221622903 |
| 0.04 | 0 | 9113878.402926479 | 2028.7066304862465 |
| 0.05 | 0 | 15880239.079266366 | 2269.223212000192 |

Both columns move monotonically, in opposite senses.

## The two edges

Rather than reading them off a sweep, bisect for them.

**The smallest rate with no free fall.** On this well and programme, 0.02059793163869393 cubic metres a second.

**The largest rate whose peak ECD stays at or below a stated limit.** At 1700 kg/m3, 0.017832442077937685.

Both are bisected to the precision of the double, so they are numbers a reader can check rather than intervals.

## Why bisect rather than sweep

Because the answer is going to be quoted, and a sweep gives an interval whose width is the step size.

A finding of "free fall stops somewhere between 0.02 and 0.03" and one of "free fall stops at 0.02059793163869393" are different kinds of statement, and only the second can be checked by somebody else or compared against another programme.

## The width between them

    window = maximum rate under the limit - minimum rate with no free fall

On this well and programme at 1700 kg/m3 that is minus 0.0027654895607562464.

Negative. The next lesson is about what a negative window means.

## The same trade on the slant well

| programme | min rate, no free fall | max rate at 1700 | window |
|---|---|---|---|
| lead and tail | 0.01693390800228161 | 0.02417969900227423 | 0.0072457909999926184 |
| neat | 0.018151176264086934 | 0.018345671909057764 | 0.0001944956449708296 |

Both open, and the neat one is only just: a window 0.0002 cubic metres a second wide is not a window a driller can hold.

## Exercise

Using the sweep table, estimate by eye where the peak ECD crosses 1750 kg/m3 on the horizontal well's neat programme.

Then compare your estimate with the bisected answer of 0.02391261505118921, and say how wide your interval was.
