# Job time

Total pumped over pump rate, and what it is used for.

{{panel:cm-volume-explorer}}

## The arithmetic

    job time = total pumped / pump rate

On the slant well:

    86.48058691428402 / 0.02 = 4324.029345714201 seconds

which is 72 minutes and 4 seconds.

On the horizontal well, 82.60510002433011 over the same rate, which is 4130.255001216506 seconds, about 69 minutes.

## What it is for

**The thickening time.** A cement slurry is designed in a laboratory to stay pumpable for a stated time at a stated temperature and pressure. The job time has to fit inside it with a margin, conventionally an hour or more.

That comparison is the single most important use of this number, and this engine cannot make it, because it has no thickening time and no temperature.

**Rig time.** At a day rate, an hour is money.

**Exposure.** The longer the job, the longer the formation is exposed to the circulating density the job produces.

## What the number leaves out

It is the PUMPING time at a constant rate, and a real job is not that.

**Mixing.** On a batch-mixed job the slurry is made up before pumping starts. On a continuous job the mix rate can be the constraint rather than the pump rate.

**Rate changes.** Real jobs change rate: slow to displace the plugs, slow at the end for the bump, sometimes slow through a weak zone.

**Stops.** Changing over from cement to displacement, dropping the top plug, dealing with anything unexpected.

So the reported job time is a lower bound, and the real one is commonly half again as long.

## The rate the number assumes

0.02 cubic metres a second on both wells, which is 1.2 cubic metres a minute, about 7.5 barrels a minute. That is a normal cementing rate for a 7 inch string.

The Professional tier shows that this rate is not free to choose: too slow and the column free falls, too fast and the circulating density at the shoe above goes past its limit.

## Reported only when asked

    if (pumpRateM3s > 0) out.jobTimeS = out.totalPumpedM3 / pumpRateM3s;

Same discipline as the sacks. No rate, no time, and no invented default.

## Exercise

Compute the job time for the slant well at 0.015 cubic metres a second and at 0.03.

Then say which of the two you would rather be pumping if the slurry's laboratory thickening time were 150 minutes, and what else you would want to know before answering.
