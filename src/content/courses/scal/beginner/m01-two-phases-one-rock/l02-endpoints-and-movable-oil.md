# Endpoints and movable oil

The last lesson ended with oil stranded in pore centres and water held in films and corners. This lesson gives both ideas numbers, because the two of them together decide the most important quantity in waterflooding: how much of the oil is even in play.

## The two endpoints

**Connate water saturation**, written $S_{wc}$, is the water saturation below which the water cannot be pushed. It is the film and corner water that wettability distributed through the pore space; it is disconnected from any flowing path, and no achievable pressure gradient moves it. For the Ekene sand:

$$S_{wc} = 0.35$$

**Residual oil saturation**, written $S_{or}$, is the mirror image: the oil saturation left behind after water has swept a region as thoroughly as it ever will. It is the population of disconnected oil blobs cut off in pore centres, held by interfacial forces. For the Ekene sand:

$$S_{or} = 0.25$$

Both numbers are properties of the rock and fluid pair, measured on core in the laboratory. They are not opinions and they are not adjustable by operating strategy; injecting faster, longer, or from a different well pattern does not change either one. Between them they fence off the playing field.

## The mobile window

If water can never fall below 0.35 and oil can never fall below 0.25, then the water saturation anywhere in the flooded sand is confined to the window

$$S_{wc} \le S_w \le 1 - S_{or}$$

which for Ekene runs from 0.35 to 0.75. The width of that window is the movable saturation fraction:

$$1 - S_{wc} - S_{or} = 1 - 0.35 - 0.25 = 0.4$$

Forty percent of the pore volume is the entire arena. The other sixty percent is spoken for before the flood begins: thirty five points of immobile water, twenty five points of oil that will still be there when everything is over.

## Movable oil in barrels

The Ekene pore volume is a locked number from the geoscience ladder, 3563045.809312045 cubic metres, which converts at 6.2898 barrels per cubic metre to

$$PV = 22410845.5314109 \text{ bbl}$$

Multiply by the movable fraction:

$$\text{movable oil} = 22410845.5314109 \times 0.4 = 8964338.21256436 \text{ bbl}$$

Just under nine million barrels of pore volume can change hands between oil and water. That is the ceiling on what any waterflood of this sand can displace, no matter how it is designed, because the ceiling is set by the endpoints alone.

Be precise about what this number is: it is a reservoir volume of displaceable fluid, in reservoir barrels. Turning it into stock tank barrels of sales oil involves the formation volume factor, and turning it into a realistic forecast involves how much of the sand the water actually visits. Both refinements come later; the endpoint arithmetic comes first because everything else is a fraction of it.

## Where the initial condition sits

The Ekene oil column entered this course at $S_w = 0.35$, exactly the connate value. That is not a coincidence, and it is worth pausing on. The geoscience booking assumed the oil column was drained to connate water everywhere, so the oil saturation everywhere is $1 - 0.35 = 0.65$. Of that 0.65 of oil, 0.25 is destined to be residual and 0.4 is movable. The flood therefore starts with the water saturation at the very bottom of the mobile window and spends its whole life pushing it toward the top at 0.75.

The fraction of the oil in place that is movable is

$$\frac{1 - S_{wc} - S_{or}}{1 - S_{wc}} = \frac{0.4}{0.65}$$

Leave it as a fraction for now. Module 5 returns to this exact ratio, gives it a name, and grades you on it, because it is the ultimate efficiency of the displacement.

## The misconception to avoid

Learners subtract the connate water from one and call all of it recoverable: the sand is at $S_w = 0.35$, so 0.65 of the pore volume is oil, so 0.65 is there for the taking. The residual saturation says otherwise. A quarter of the pore volume is oil that the water will surround, disconnect, and abandon in place, in the best case, in the swept rock itself. The recoverable share by displacement is at most the movable 0.4, and every serious mistake in screening a flood traces back to forgetting which of those two numbers is the prize.

A related trap runs the other way: treating $S_{or}$ as a nuisance parameter that a determined operator can beat down with rate or pressure. Within this course's physics, and within the engine that grades it, $S_{or}$ is a rock and fluid constant. Changing it means changing the fluid system itself, which is a topic for a much later conversation than this tier.

## Exercise

A neighbouring sand has the same pore volume as Ekene, 22410845.5314109 bbl, but its core measurements give $S_{wc} = 0.25$ and $S_{or} = 0.30$. First, compute its movable saturation window and its movable oil in barrels, and state whether it beats Ekene's 8964338.21256436 bbl. Second, both sands start at their connate water saturation: compute for each the fraction of oil in place that is movable, and explain in a sentence why the sand with more oil in place per pore volume is not automatically the sand with the better displacement prize.
