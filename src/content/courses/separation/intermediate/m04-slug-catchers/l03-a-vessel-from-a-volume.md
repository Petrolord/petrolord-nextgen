# A vessel from a volume

A volume on its own does not describe a drum. ABANA's 3665.075231 ft3 becomes a vessel 10.527155 ft across and 42.108619 ft long once a slenderness of 4.000000 has been stated.

{{panel:fc-slug-explorer}}

## The ratio splits the volume

A cylinder's volume fixes the product of its bore and its length, and nothing more. One number can be traded for the other without changing the volume at all, so a second statement is needed before there is a vessel. That statement is the length-to-diameter ratio, and it is an input.

Given the volume and the ratio there is exactly one answer. ABANA's 3665.075231 ft3 at a ratio of 4.000000 gives 10.527155 ft of diameter and 42.108619 ft of length, and the length is the diameter times the ratio.

## Three vessels from three volumes

| case | volume ft3 | L/D | diameter ft | length ft |
| --- | --- | --- | --- | --- |
| ABANA | 3665.075231 | 4.000000 | 10.527155 | 42.108619 |
| vessel200bblSlugLd4 | 2033.986786 | 4.000000 | 8.650995 | 34.603982 |
| vessel1200bblSlugLd5 | 10739.004630 | 5.000000 | 13.984106 | 69.920531 |

The first two share a ratio, so their shapes are the same and only the scale differs: a volume a little under twice as large gives a diameter of 10.527155 ft against 8.650995 ft. The third holds more than five times the volume of the second and is not five times any single dimension, because volume grows with the square of the bore and the length together.

## Checking the pair against the ratio

The two dimensions are worth checking against each other before they leave the page, because the relationship between them is the input that was typed. A diameter of 13.984106 ft at a ratio of 5.000000 gives the length of 69.920531 ft that the case reports, and a diameter of 8.650995 ft at a ratio of 4.000000 gives 34.603982 ft. A pair that fails that check has picked up a dimension from a different run, which is easy to do when a sweep prints several vessels one under the other.

## The ratio is somebody's preference

A slug catcher at a ratio of 4.000000 and the same catcher at 5.000000 hold the same liquid. The choice is about plot space, transport, supports and the cost of heads against shell, and it belongs to the project rather than to the physics. A ratio of zero or below is refused by name: SeparatorInputError on ldRatio, "ldRatio must be a positive length-to-diameter ratio (got 0)".

That refusal exists because a ratio of zero is not a flat vessel. It is a request with no answer in it, and clamping it to something plausible would return a drum nobody asked for.

## The mistake

The mistake is quoting a slug catcher by one dimension. A 42.108619 ft vessel means nothing without the 10.527155 ft that goes with it, and a plot plan drawn from the length alone will be wrong by whatever ratio the next reader assumes.

The second mistake is comparing two catchers by diameter when their ratios differ. The 13.984106 ft vessel is wider than the 10.527155 ft one and it is also proportionally longer, at a ratio of 5.000000 against 4.000000, so the difference in capacity between them is larger than the diameters suggest.

## Exercise

Give the diameter and the length for ABANA's 3665.075231 ft3 at a ratio of 4.000000, and say why the volume alone could not have produced them. Then give both dimensions for the two published vessel cases, and state the refusal the engine returns for a ratio of zero.
