# What a flare knockout drum is for

{{panel:fc-fire-drum-explorer}}

What a knockout drum is, as a vessel, belongs to the Gas Conditioning and Sweetening course, whose first vessel lesson defines one. What is new here is the duty: keeping liquid out of a flare header, where a slug reaching the tip becomes burning rain.

## The criterion, in one sentence

A horizontal knockout drum works if the vapour takes longer to cross it than a droplet takes to fall out of it. That is the whole of it: a transit time along the length against a fall time down through the vapour space. At a candidate diameter the engine returns the length that comparison demands.

## The convention the holdup input carries

The holdup input is the liquid level as a fraction of the diameter, which is what a level instrument reads, and everything else follows. The vapour cross-section is the exact circular segment above that level, and a droplet falls the vapour depth.

That convention is visible rather than inferred, because the route returns it. Along with the vapour velocity, the required length and the L over D, every call hands back the liquid depth, the segment area fraction, the vapour area and the fall distance, and a note when it has one. Four of those eight fields exist so you can see what the fraction you typed was taken to mean.

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

At half depth the area fraction is 0.500000000000. Read the rows at 0.100000 and 0.750000 to see how far apart the two get. A drum sized by typing an area fraction into a level fraction field is sized for the wrong vapour space, and the answer comes back looking entirely normal.

Be careful how you state where the two agree, because the obvious statement is wrong and the table refutes it on its own first row. Swept across the whole range they agree at exactly 3 depths: 0.000000000000, 0.500000000000 and 1.000000000000. An empty circle holds no liquid area and a full one is all liquid area, so both ends agree trivially. Half depth is the only agreement strictly between them.

Either side of half depth they disagree in opposite directions: below it the area fraction is smaller than the depth fraction, above it larger. That is one crossing of the diagonal with a touch at each end, and the rows at 0.100000 and 0.750000 are one of each.

## Where this drum sits in the chain

The fire case and the drum are the two halves of a flare system and they share no number. The valve is sized on the load a fire puts on a vessel. The drum is sized on the vapour the header carries and the droplet the flare tip will not accept. A reader expecting the relief load in the drum calculation has the chain wrong: the drum takes a rate at drum conditions, and this engine is handed that rate rather than deriving it.

## Exercise

State the criterion a horizontal knockout drum has to satisfy, and name the four fields that make the holdup convention visible. Finish by giving every depth fraction at which the two agree, which one lies strictly between empty and full, and which way they disagree on each side of it.
