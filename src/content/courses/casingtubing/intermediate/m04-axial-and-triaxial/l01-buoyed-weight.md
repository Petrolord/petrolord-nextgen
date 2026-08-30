# Buoyed weight

What is actually hanging, and the one factor that reduces it.

{{panel:ct-loadcase-explorer}}

## The profile

    axial(z) = weight per metre x buoyancy factor x (shoe depth - z) + overpull

Linear in depth, largest at surface, zero at the shoe unless there is an overpull.

## The buoyancy factor

    bf = 1 - mud density / steel density

with steel at 7850 kg/m3. At a mud weight of 1440 that is 0.8165605095541402.

So about 18 percent of the string's air weight is carried by the fluid it is immersed in, and the hook feels the rest.

## Why that form

Archimedes. A body immersed in a fluid loses weight equal to the weight of the fluid it displaces. For a pipe the displaced volume is the STEEL volume, so the fraction lost is the ratio of the two densities exactly.

That is only true for a pipe that is open and full of the same fluid inside and out, which is the running condition this profile is written for. A pipe with a float shoe, or with a different fluid inside, has a different buoyancy and the simple factor is wrong.

## The numbers on this string

Weight 74.296582707 kg per metre, which is 728.6005828036015 N per metre in air.

Buoyed, that is about 595 N per metre, and over 2507.919699301 m of hanging string the total at surface is 1492077.9549772663 N.

## Where it is used

Twice. In the tension check, against the joint strength. And inside the collapse check, as the axial stress that derates the collapse rating.

It is NOT used in burst or in the pressure profiles, which are set by fluid columns and have nothing to do with what the steel weighs.

## The one weight for the whole string

The engine takes a single weight per metre for the axial profile, not one per section. On a tapered string that is an approximation, and on this string, where the two sections differ by 6.5 lb/ft, it is worth about nine percent of the section weights.

The published run uses 74.296582707 kg/m, which is between the two section weights of 69.9437033 and 79.61676865, so the approximation is a length-weighted average rather than either extreme.

## Exercise

Compute the buoyancy factor for a mud weight of 1900 kg/m3 and for one of 1030.

Then say by how much the surface hook load on this string would change between those two mud weights, and whether the tension safety factor improves or worsens with heavier mud.
