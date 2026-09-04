# The placed mass

Everything the treatment leaves behind is one number, and the schedule already told you what it is.

{{panel:st-pack-explorer}}

## Where the mass comes from

The placed mass is the whole of the ramp integrated once:

    M = c_EOJ qi (ti - t_pad) / (1 + eps)

The end of job concentration sets the scale, the injection rate and the ramp time set how much slurry passes, and the division by one plus eps accounts for the ramp starting at zero rather than at the final concentration.

On this case that gives 28915.069473784468 kg from an end of job concentration of 800 kg/m3, a rate of 0.053 m3/s and a ramp of 1162.9028538130178 s.

## What is not in it

The pad contributes nothing. It is 147.46329465538435 m3 of clean fluid and it carries no solid, so it appears in this calculation only through what it took away from the ramp.

The carrier fluid contributes nothing either. Of the 209.09714590747427 m3 injected, 172.95330906524367 m3 has already leaked into the formation by the end of pumping and the remaining 36.143836842230584 m3 is in the fracture, but it will be produced back or left behind as damage. None of it holds the fracture open.

## Why it is the number that survives

When the pumps stop, the net pressure that held the fracture open bleeds away. The closure stress of 38131950.890444934 Pa presses the two faces together, and they come to rest on whatever solid is between them.

The width, the length, the treating pressure and the efficiency were all properties of a fracture that no longer exists. The mass is a property of the pack, and the pack is permanent.

So the whole of this module works forwards from one number. Spread that mass over the fracture face and you have an areal concentration. Divide by the density of the settled pack and you have a propped width. Multiply by the pack permeability and you have conductivity. Every step downstream inherits whatever error you made here.

## What moves it

Three levers move the mass and nothing else does: the end of job concentration, the injection rate, and the ramp time. The ramp time is not yours to set directly. It is the pump time minus the pad, and the pad came from the efficiency.

That is why the pad fraction matters so much. It does not merely reshape the schedule, it sets how much of the job is available to carry solid at all.

## Exercise

Raise the end of job concentration in the panel and confirm the placed mass moves in proportion. Say what physical limit stops you doing that indefinitely.

Then set the leakoff coefficient to 0.0002 and read the mass. Account for the change in terms of the ramp time alone.
