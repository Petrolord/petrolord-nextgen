# What a flare knockout drum is for

{{panel:fc-fire-drum-explorer}}

What a knockout drum is, as a vessel, belongs to the Gas Conditioning and Sweetening course. Its first vessel lesson defines one and this course does not redefine it. What is new here is the duty: keeping liquid out of a flare header, where a slug of liquid reaching the tip becomes burning rain.

## The criterion, in one sentence

A horizontal knockout drum works if the vapour takes longer to cross the drum than a droplet takes to fall out of it. That is the whole of it. Two times are compared: a transit time along the length, and a fall time down through the vapour space. At a candidate diameter the engine returns the length that comparison demands.

## The convention the holdup input carries

The holdup input is the liquid level as a fraction of the diameter, which is what a level instrument reads. Everything else follows from it. The vapour cross-section is the exact circular segment above that level, and the distance a droplet has to fall is the vapour depth.

That convention is visible rather than inferred, because the route returns it. Along with the vapour velocity, the required length and the L over D, every call hands back the liquid depth, the segment area fraction, the vapour area and the fall distance, and a note when it has one. Eight fields, four of which exist so you can see what the fraction you typed was taken to mean.

## A level fraction and an area fraction are different numbers

| depth fraction | liquid area fraction | vapour area fraction |
| --- | --- | --- |
| 0.000000 | 0.000000 | 1.000000 |
| 0.100000 | 0.052044 | 0.947956 |
| 0.250000 | 0.195501 | 0.804499 |
| 0.500000 | 0.500000 | 0.500000 |
| 0.750000 | 0.804499 | 0.195501 |
| 0.900000 | 0.947956 | 0.052044 |
| 0.990000 | 0.998307 | 0.001693 |

At half depth the area fraction is 0.500000000000, and that is the only depth where the two agree. Read the row at 0.100000 and the row at 0.750000 to see how far apart they get. A drum sized by typing an area fraction into a level fraction field is a drum sized for the wrong vapour space, and the answer comes back looking entirely normal.

## Where this drum sits in the chain

The fire case and the drum are the two halves of a flare system and they share no number. The valve is sized on the load a fire puts on a vessel. The drum is sized on the vapour the header carries and the droplet the flare tip will not accept. A reader who expects the relief load to appear in the drum calculation has the chain wrong: what the drum takes is a rate at drum conditions, and this engine is handed that rate rather than deriving it from a relief case.

## Exercise

State the criterion a horizontal knockout drum has to satisfy. Then name the four fields the route returns that make the holdup convention visible, and give the one depth fraction at which the depth fraction and the area fraction agree.
