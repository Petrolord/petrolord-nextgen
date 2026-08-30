# The schedule between them

A straight line, and what makes it one.

{{panel:wc-killsheet-explorer}}

## The line

From the ICP at zero strokes to the FCP at the strokes to the bit, linearly.

    pressure(s) = ICP + (FCP - ICP) x s / strokesToBit

## Why linear

Because the kill mud goes down the string at a constant rate, so the height of kill mud in the string grows linearly with strokes, so the hydrostatic head inside the string grows linearly, so the surface pressure needed falls linearly.

Every step in that chain is a proportionality, and there is nothing in the string's geometry that breaks it as long as the pump rate is constant.

## Where it would NOT be linear

If the string's capacity per metre changed a great deal down the hole and the schedule were written against DEPTH rather than strokes.

Against strokes it stays linear regardless, because strokes measure volume and volume is what displaces. That is a real advantage of writing the schedule in strokes, and it is why kill sheets are written that way.

## The step count

The engine produces eleven points by default: zero to the strokes to the bit in ten equal steps.

That is presentation. The relationship is a line and any number of points describes it. A real sheet uses a spacing the choke operator can work with, often every hundred strokes or every quarter of the total.

## The horizontal well's moderate scenario

From 6500000 Pa at zero strokes to 5024606.182497741 Pa at 2019.2214924632256 strokes.

That is a fall of 1475393.8175022593 Pa over the string displacement, which is 730.6745807773881 Pa per stroke.

## How it is followed

The choke operator watches the drill pipe gauge and the stroke counter. At each scheduled stroke count the gauge should read the scheduled pressure; if it is high, open the choke slightly, and if it is low, close it.

The adjustments are small and continuous, and the operator is chasing a line rather than a set of steps.

## What the line assumes

**A constant pump rate.** If the rate changes, the friction changes, and the whole schedule shifts. Rate changes during a kill are made deliberately and slowly, holding the casing pressure constant while the rate moves.

**No gas in the string.** The string has mud in it, going in. That is true unless the influx entered the string, which happens only if it came in through the bit while the pumps were off and the float failed.

## Exercise

Compute the drill pipe pressure at 500, 1000 and 1500 strokes for the horizontal well's moderate scenario.

Check them against the panel's schedule and confirm that the differences between consecutive values are equal.
