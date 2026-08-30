# Yield, and sacks

Cement is bought by the sack and pumped by the cubic metre.

{{panel:cm-volume-explorer}}

## Yield

The volume of slurry one sack of dry cement makes, once mixed with its water and additives.

    sacks = slurry volume / yield

On this course's jobs the yield is 0.0382 cubic metres a sack, so

    25.123380942966243 / 0.0382 = 657.6801293970221 sacks

## Why yield and not density

Because the two are different properties of the same slurry and both are needed.

The DENSITY decides the hydrostatic pressure the column exerts, which is what the placement simulation reads.

The YIELD decides how much dry cement the volume represents, which is what the purchase order reads.

A neat class G slurry at 1900 kg/m3 has a yield near 0.0382 cubic metres a sack. An extended lead slurry at 1560 has a much higher yield, because most of the extra volume is water and extender rather than cement.

## What this engine does with the yield

One division, and only if a yield was supplied:

    if (slurryYieldM3PerSack > 0) out.sacks = slurryM3 / slurryYieldM3PerSack;

If no yield is given, no sacks are reported. The engine does not assume one, which is right: a yield is a laboratory measurement on a specific blend and there is no default worth having.

## The single yield problem

The engine divides the WHOLE slurry volume by ONE yield, even on a job with a lead and a tail.

That is wrong on a two-slurry job, and it is wrong in the expensive direction: the lead has a higher yield, so treating it at the tail's yield overstates the sacks of lead needed.

On this job the lead is 2.6713376091845076 of 25.123380942966243 cubic metres, about 11 percent, so the error is contained. On a job with a long lead section it would not be.

Knowing that is the point. The number is right for a neat job and approximate for a split one, and the engine does not say so.

## The bulk cement question the yield does not answer

Sacks are a volume of dry blend, and a rig has a finite number of bulk tanks. Converting sacks into tank capacity needs the bulk density of the dry blend, which is a different number again and is nowhere in this course.

## Exercise

Compute the sacks for the slurry volume at 30 percent excess, which is 27.950808676330283 cubic metres, at the published yield.

Then recompute the job at a lead yield of 0.0510 and a tail yield of 0.0382, applied to their own volumes, and say how many sacks the single-yield figure overstated by.
