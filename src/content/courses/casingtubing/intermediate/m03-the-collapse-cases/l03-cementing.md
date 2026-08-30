# Cementing

The collapse case that lasts a few hours, and is not the mildest one.

{{panel:ct-loadcase-explorer}}

## The story

The cement has been pumped down the inside of the casing and up the annulus. At the end of displacement the casing is full of displacement water and surrounded by wet cement, which is much heavier.

## The columns

    inside(z)  = seawater gradient x z
    outside(z) = cement gradient x z

Seawater at 1030 kg/m3 giving 10100.8495 Pa per metre, cement at 1900 kg/m3 giving 18632.635.

The differential is the difference of the two, 8531.7855 Pa per metre, growing with depth. At the shoe that is 21397032.925660625 Pa.

## Where it sits in the suite

| section | full evacuation | cementing |
|---|---|---|
| 1 | 1.7576249995635107 | 2.909172413070639 |
| 2 | 1.2882443095792595 | 2.1322664434415337 |

Milder than full evacuation on both, by about the ratio of the two differential gradients.

## So why keep it

Three reasons.

**It is real and it is certain.** Full evacuation is a hypothesis. The cement job definitely happens, and every joint in the string definitely experiences it.

**The densities can be worse.** A 2100 kg/m3 lead slurry against a light spacer inside changes the answer substantially, and heavy cements are common on deep strings.

**It happens before anything else.** A joint damaged during cementing carries that damage through every later case, and nothing in a later check will know.

## What the model leaves out

The engine treats the cement as a static column at its slurry density. During the job it is not static: there are friction pressures, surge and swab from pipe movement, and the cement is being pumped rather than sitting.

It also treats the annulus as full of cement to surface, which is often untrue: a partial cement column with mud above it gives a different and usually milder profile.

And it ignores the gelation window entirely, where the slurry stops transmitting full hydrostatic and the pressure it delivers falls.

## The honest position

This is a screening version of the cementing collapse case. The Cementing course computes the real one, with the placement, the friction and the density profile that this case flattens into one number.

## Exercise

Compute the cementing collapse differential at 1454.59342559458 m from the two gradients.

Then divide the section 1 collapse rating, which you can get by multiplying the differential by the reported safety factor, and check that it matches the value the full evacuation case implies at the same depth.
