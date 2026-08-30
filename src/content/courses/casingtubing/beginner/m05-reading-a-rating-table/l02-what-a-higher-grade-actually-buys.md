# What a higher grade actually buys

Three things, and on some pipes the third is the only one left.

{{panel:ct-rating-explorer}}

## The three

**Burst,** in exact proportion. Always.

**Tension,** in exact proportion. Always.

**Collapse,** somewhere between exact proportion and nothing, depending entirely on which regime the pipe is in.

## And a fourth, on the elastic rows

There is one more thing a higher grade buys on a pipe that collapses elastically, and it is easy to miss because it does not show up in the rating at all.

It buys IMMUNITY TO TENSION.

## The numbers

On the 20 inch 94 lb/ft row, the axial fraction at which the pipe finally leaves the elastic regime and starts losing collapse:

| grade | immune up to |
|---|---|
| H-40 | 0.27247562830514716 |
| K-55 | 0.5465081838176975 |
| M-65 | 0.6383064958147591 |
| L-80 | 0.7233783452013174 |
| C-90 | 0.7612064730739536 |
| T-95 | 0.7765595714367073 |
| P-110 | 0.8128496099533391 |
| Q-125 | 0.8391402077199053 |

Every one of those pipes has the same collapse rating at zero tension. They stop having the same collapse rating at very different amounts of tension.

## Why

Because the boundary that matters is computed from the ADJUSTED yield, and a higher starting yield takes more derating to bring down to the same effective value.

H-40 only has to lose about a quarter of its yield before the elastic boundary climbs past 45.662100456621005. Q-125 has to lose most of it.

## The honest summary for a surface string

At the shoe, where there is no tension, the grade buys nothing in collapse.

At the wellhead, where the tension is greatest, the grade buys the ability to keep buying nothing, which sounds like a joke and is a real design property: it keeps the collapse rating flat rather than letting it start to fall.

## How to decide

Work out the axial stress as a fraction of yield at the top of the string, look up the immunity fraction for the grade, and see which is bigger. If the axial fraction is comfortably below it, the collapse rating along the whole string is a single number and the design is simpler than it looked.

## Exercise

At forty percent of yield in tension, which grades in the table above are still fully immune, and which have started to lose collapse?

Then say what the answer would be at seventy percent.
