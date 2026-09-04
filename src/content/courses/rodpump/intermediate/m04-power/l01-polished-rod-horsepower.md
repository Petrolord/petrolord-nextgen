# Polished rod horsepower

The polished rod does a loop of work once a stroke. Multiply that loop by how often it happens and you have a power.

{{panel:pd-card-explorer}}

## One area, one speed, one constant

Polished rod horsepower is the card area times the pumping speed, divided by 12 in per ft to turn in-lb into ft-lb and by 33000 ft-lb per minute per horsepower. The two divisions collapse into one number, so the whole calculation is the card area times the speed over 396000.

The teaching well ODUMA-4 carries a card area of 750654.615621 in-lb per cycle at 10 spm, and that area at that speed over 396000 returns 18.955924637 hp. Nothing else enters it. Not the rod weight, not the fluid load, not the depth, and not the plunger size, except through the card those things already produced.

## The speed is in the answer twice

| Speed, spm | Card area, in-lb per cycle | Horsepower, hp |
| --- | --- | --- |
| 6.0 | 580229.370988 | 8.791354106 |
| 8.0 | 658118.165307 | 13.295316471 |
| 10.0 | 750654.615621 | 18.955924637 |
| 12.0 | 814331.476024 | 24.676711395 |

That is a contiguous teaching sweep on ODUMA-4, one input moved. Both columns climb, because raising the speed makes the loop bigger as well as more frequent: the loop grows from 580229.370988 to 814331.476024 in-lb per cycle over that range.

## The mistake

Scaling horsepower with the speed. Doubling 6.0 spm to 12.0 spm does not double 8.791354106 hp. It gives 24.676711395 hp, because the card grew underneath the multiplication, and a designer who prorated the low figure would size the surface equipment for a machine that does not exist.

The same arithmetic on the two published predictive cases gives 3.371490954 hp from an area of 267022.083549 in-lb per cycle at 5 spm and 7.350498339 hp from 323421.926937 in-lb per cycle at 9 spm, on the same string with the same 5000 lb fluid load over the same 64 in surface stroke.

## What it refuses

It refuses to be more exact than the card it was handed. The area comes off the card the function returns, which keeps 186 of the 6110 steps the march computed on ODUMA-4 at its shipped defaults, and that card's area is 9148.2107 in-lb per cycle below the area over every marched step, which is 1.204024 percent. The horsepower moves with it.

And it refuses to say the design is sound. A horsepower is a rate of work, not a verdict, and 24.676711395 hp at 12.0 spm is a perfectly ordinary looking number for a design that may be failing three other checks.

## Exercise

Read the card area and the horsepower at 6.0, 8.0, 10.0 and 12.0 spm in the panel, then recover each horsepower from its own area and speed over 396000.

Then say in one sentence why the rise from 8.791354106 to 24.676711395 hp cannot be split into a speed part and a card part on this engine.
