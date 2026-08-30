# Reading a pump pressure curve

Sixty one points, and the shape is the same on every cement job ever pumped.

{{panel:cm-placement-explorer}}

## What the series holds

    { pumpedM3, pumpPressurePa, uTubePa, freeFall, ecdPrevShoeKgM3, ecdAtShoeKgM3 }

Sixty one rows, evenly spaced in pumped volume from zero to the total.

## The shape, on the slant well's two-slurry job

| pumped (m3) | pump pressure (Pa) |
|---|---|
| 0 | 5517762.999844827 |
| 14.413431152 | 3503168.075851262 |
| 28.826862304761338 | 589724.8510166854 |
| 43.24029345714201 | 1296026.123524323 |
| 57.65372461 | 1485615.302855141 |
| 72.067155762 | 5923331.832541376 |
| 86.48058691428402 | 13712451.13169735 |

Down by a factor of nine, then up by a factor of twenty three.

## The three phases

**Phase one, the cement goes down the inside.** The heavy slurry displaces mud from the casing bore, so the INSIDE head grows while the annulus is unchanged. The U-tube term goes down and the pump pressure falls with it.

**Phase two, the cement turns the corner.** The first cement reaches the shoe and starts up the annulus. Now every additional cubic metre adds to the ANNULUS head and removes from the inside, so the pressure turns and starts climbing.

**Phase three, the displacement pushes it up.** The inside fills with light displacement fluid while the annulus fills with heavy cement. Both terms now work against the pumps, and the pressure rises steeply to the bump.

## Where the turn is

The minimum on this job is at 28.826862304761338 cubic metres, which is 33 percent of the way through.

That is not where the cement reaches the shoe. The inside volume is 58.13230334930856 cubic metres, so the leading spacer front only reaches the shoe at 58.13 pumped.

The turn is earlier because the pressure responds to the whole column, not to one front. The minimum occurs where the marginal effect of the next cubic metre changes sign, and that happens while the cement is still going down.

## The maximum is at the end

Always, on a normal job. The last step has the maximum annular cement column and the minimum inside head, and both terms are at their worst simultaneously.

Which means the highest pressure of the job is at the plug bump, when everybody is watching for it.

## Reading a real chart against this one

A real chart is pressure against TIME, and at constant rate the two axes are the same thing scaled. Deviations from this shape are what a cementer watches for: a pressure that does not fall in phase one means the cement is not going where it should, and a pressure that falls in phase three means losses.

## Exercise

Read the pump pressure at zero and at the minimum from the table above.

Then compute the ratio, and say which of the three terms in the U-tube expression changed by that much over those 28.8 cubic metres.
