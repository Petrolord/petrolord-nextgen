# Spacer ahead and behind

Two spacer volumes, and they are deliberately unequal. The inequality is not a fudge, it is the only way to make them the same height.

{{panel:wi-pa-explorer}}

## Why there is spacer on both sides

Spacer ahead goes down first and ends up in the annulus, above the cement, keeping mud off the leading edge of the slurry. Spacer behind is pumped after the cement and stays inside the string, keeping displacement fluid off the trailing edge.

Those two spacer columns sit on opposite sides of the shoe, one in the annulus and one in the bore, exactly as the two slurry columns do. If they stand at different heights they create the head difference the balance was designed to remove. So the requirement is the same: equal heights.

## Equal heights, unequal volumes

The two columns stand in different geometries. A metre of annulus holds more than a metre of stinger bore, so matching the heights means the behind volume has to be smaller than the ahead volume, in exactly the ratio of the two capacities.

That is the closed form the engine uses: the spacer behind is the spacer ahead times the inside capacity divided by the annulus capacity. On the published fixture that ratio comes out at 0.386345 m3 behind for every 1 m3 ahead, and it is a pure geometry number. It does not depend on the plug, the excess or the depth.

| Spacer ahead, m3 | Spacer behind, m3 | Height of each column, m |
| --- | --- | --- |
| 0.5 | 0.193173 | 20.854 |
| 1 | 0.386345 | 41.709 |
| 2 | 0.772690 | 83.417 |
| 4 | 1.545381 | 166.835 |

Read the last column. Whatever you pump, the two heights land on the same value, which is the test that the ratio is doing its job.

## The trap at large spacer volumes

The spacer behind is not free. It occupies the top of the stinger bore, and the displacement volume is what is left of that bore after the spacer behind is taken out of it. Pump enough spacer behind and there is nothing left, at which point the engine warns that the displacement has gone negative rather than quietly reporting a volume you cannot pump.

A negative spacer ahead is refused outright. There is no such fluid.

## Exercise

Set the spacer ahead to 2 m3 and predict the behind volume before you read it, using the capacity ratio alone.

Then raise the spacer ahead until the engine warns. Note the volume where that happens and explain, in terms of the stinger bore, why the warning appears when it does.
