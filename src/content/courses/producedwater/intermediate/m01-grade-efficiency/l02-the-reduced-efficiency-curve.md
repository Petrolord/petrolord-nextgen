# The reduced efficiency curve

A cut size fixes one point on a device's grade curve, the point where half the volume of that droplet size is removed. The curve either side of it has to come from somewhere, and in this module it comes from one family with one shape parameter.

{{panel:pw-water-explorer}}

## One curve in the reduced size

The grade efficiency here is written in the REDUCED size, which is the droplet diameter divided by the device's own cut size. Call that ratio r. The efficiency is r raised to the sharpness m, over one plus r raised to the same power.

Writing it that way has one immediate consequence worth stating before any arithmetic. At r of one the expression is one over one plus one, so the efficiency at the cut size is exactly one half at every sharpness the module can be given. That is not a tuned result. It is what a cut size MEANS, and the module returns 0.500000000000 there.

## The two sharpnesses side by side

This module uses two values of m. Here is what each does to the curve:

| droplet over cut | efficiency at m 2 | efficiency at m 3 |
| --- | --- | --- |
| 0.25 | 0.058823529412 | 0.015384615385 |
| 0.5 | 0.200000000000 | 0.111111111111 |
| 0.75 | 0.360000000000 | 0.296703296703 |
| 1 | 0.500000000000 | 0.500000000000 |
| 1.5 | 0.692307692308 | 0.771428571429 |
| 2 | 0.800000000000 | 0.888888888889 |
| 4 | 0.941176470588 | 0.984615384615 |

Both curves pass through one half at a ratio of one, which is the definition and is the row a reader should check first. Away from that row they separate. The sharper curve is better on both sides at once: at four times the cut size it removes 98.461538 percent against 94.117647, and at a quarter of the cut size it removes 1.538462 percent against 5.882353.

## Sharper means more decisive rather than better

It is tempting to read the m of 3 column as the good one. It is the DECISIVE one. A sharp device makes a cleaner distinction between droplets it catches and droplets it passes, so it takes more of the coarse oil and less of the fine oil than a blunt device with the same cut size does. Which of those two is worth more depends on the distribution in front of it, which is the subject of the next lesson but one.

What the sharpness is never allowed to do is move the cut size. The half point is nailed at r of one, so the two columns above describe two devices with identical cut sizes and different selectivity.

## Where each value comes from

One of these two numbers is a choice the module declares and the other falls out of the physics of the device. Telling them apart is the next lesson, and it is the most useful habit this course builds.

## Exercise

Read the table above at a ratio of 0.5 and at a ratio of 2, and say in one sentence what the sharper curve did at each.

Then state, without looking, what the efficiency is at a ratio of one for any sharpness this module accepts, and why.
