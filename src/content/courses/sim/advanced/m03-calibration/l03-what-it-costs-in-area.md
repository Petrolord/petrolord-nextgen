# What it costs in area

The volume matches. Something else had to give, and this lesson is about what.

## The two counts

| quantity | booking | deck |
|---|---|---|
| STOIIP (stb) | 12139208.107496763 | 12132366.897955146 |
| oil cells | 169 | 266 |

Volume within a tenth of a percent. Cell count 57 percent higher.

{{panel:sim-build-explorer}}

## Why they cannot both match

Because the two models put the oil in different shapes.

The booking clips the AREA at the contact and gives every cell inside it the full net thickness. Its oil is 169 cells of about 34.6 ft each.

The deck clips by cell CENTRE. A column whose top sits a few feet above the contact contributes one or two layers rather than five. Its oil is 266 cells, most of them partial.

Matching the total means the larger area compensates for the thinner average column. One equation, one unknown: fix the volume and the area follows.

## The arithmetic of the trade

If the booking's 169 cells carry a full 34.6 ft and the deck's 266 carry the same total volume, the deck's average oil column is

$$34.6 \times \frac{169}{266} \approx 22 \text{ ft}$$

So the deck's oil is spread over 57 percent more area at roughly two thirds the average thickness.

## What that costs

**Some oil sits where the flood will not reach it.** The extra 97 cells are the thin fringe around the edge of the accumulation, far from the wells. Oil there is real in the model and largely immobile in practice, so the model's recovery factor will be lower than the booking's geometry would imply for reasons that are geometric rather than physical.

**More of the oil touches water.** A broader, thinner accumulation has a longer perimeter against the water leg, which can bring water breakthrough forward relative to a compact one.

**Recovery factors are not comparable.** A recovery factor from this model is a fraction of a differently distributed volume. Comparing it against a volumetric estimate compares two denominators that were arranged to be equal and are not the same shape.

## Could the area have been matched instead

Yes, by calibrating on cell count rather than volume. The regional mean that gives exactly 169 oil cells exists and the same bisection finds it.

The result would be a model whose oil area matched the booking and whose volume was roughly half of it, because most of those 169 cells would be partial columns rather than full ones. Every forecast from that model would be low by a factor of two.

That is a decisive argument for matching volume. A forecast is a fraction of the oil in place, so an error in the oil in place scales everything.

## The reporting consequence

The area mismatch must be in the report, because a reader who finds it later will reasonably wonder what else was not mentioned.

One sentence covers it: the model reproduces the booked volume to within a tenth of a percent over a larger oil area with a thinner average column, because the model clips saturation at cell centres and the booking clips area at the contact.

## The misconception to avoid

"More oil cells means an optimistic model." It has the same oil. More cells at less thickness each is the same integral. Optimism would be more VOLUME, and the volume is matched. Cell count describes distribution, not magnitude.

## Exercise

First, compute the deck's average oil column thickness from the two cell counts and the booking's isochore, and confirm it is about two thirds.

Second, explain in two sentences why calibrating on area rather than volume would produce a model whose every forecast is wrong by roughly a factor of two.
