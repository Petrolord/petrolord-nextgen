# A blank is not a zero

A property blends only when every crude in the blend carries it. When one crude has no value, the engine does not guess, and it does not put a zero in the gap. The property comes back as no value, and the crude without it is named.

{{panel:crude-assay-explorer}}

## What a blank does

Take the export blend and leave Egbema Medium's sulfur blank.

| blend | sulfur wt% returned | missing (named by the engine) | basis the engine names |
| --- | --- | --- | --- |
| Obigbo export blend, both sulfurs given | 0.2642 | nothing | mass |
| Obigbo export blend, Egbema Medium's sulfur left blank | not blended | Egbema Medium | not blended: no value for Egbema Medium |

The basis cell does the reporting. With both sulfurs given it reads "mass". With one blank it reads "not blended: no value for Egbema Medium". A reader of the result knows which property is missing and which crude to go back to.

A blank says the value was not measured or not entered, and that is all it says. It says nothing about how much sulfur the crude holds. The remedy is a measured value from the laboratory, entered against the crude the engine names, and until that arrives the honest answer for the blend's sulfur is no answer.

## Why a zero would be dangerous

A sulfur TYPED as 0 is a real zero, and the engine blends it like any other figure. Only the blank property is not blended; every other property of the same blend is formed as usual:

| blend | SG | API | sulfur wt% | TAN mg KOH/g | vanadium ppm | viscosity cSt |
| --- | --- | --- | --- | --- | --- | --- |
| Obigbo export blend, both sulfurs given | 0.8611 | 32.8173 | 0.2642 | 0.3915 | 4.0673 | 7.4743 |
| Egbema Medium's sulfur left blank | 0.8611 | 32.8173 | not blended | 0.3915 | 4.0673 | 7.4743 |
| Egbema Medium's sulfur typed as 0 | 0.8611 | 32.8173 | 0.0888 | 0.3915 | 4.0673 | 7.4743 |

With the sulfur blank, API 32.8173, TAN 0.3915 and viscosity 7.4743 still blend. With the sulfur typed as 0, the blend sulfur is 0.0888 on mass and nothing is named missing. The digest puts it plainly: "a sulfur TYPED as 0 is a real zero, blended like any other figure." So 0.0888 is the blend of a typed figure. It is not the engine's reading of a blank, because a blank is never read as zero: the blank row prints not blended and names Egbema Medium as the crude without the figure.

The same rule holds for the other properties. A blank viscosity leaves the blend without one. With Egbema Medium's viscosity blank, the engine returns viscosity not blended and names the basis "not blended: a component viscosity is missing or outside the index domain". Module three explains the second half of that sentence.

## What the engine refuses

Some inputs cannot form a blend at all, and blendCrudes refuses them, each in its own words.

| what was asked | what the engine returned |
| --- | --- |
| an empty list | REFUSED: No components to blend. |
| Egbema Medium with no API and no specific gravity | REFUSED: No API or specific gravity for Egbema Medium. Every property here is weighted by density. |
| one crude by volume, the other by mass | REFUSED: Give every crude a volume share, or give every crude a mass share. The two cannot be mixed. |
| one crude with a share, the other with none | REFUSED: Give every crude a volume share or a mass share. |
| a share of -10 | REFUSED: A blend share must be a number of zero or more. |
| shares of 0 and 0 | REFUSED: The blend shares add up to zero. |

A missing sulfur spoils one property, so it is reported as not blended. A missing gravity spoils every property, because every property is weighted by density, so it is refused. That is the difference between the two answers. The not blended answer still returns everything else the blend can support, so a partial assay can be blended and read for the properties every crude carries. The refusal returns nothing, because there is nothing it could return that would be true.

## Shares need not add to 100

The shares are normalised, so they can be typed in any unit.

| shares typed | blend API | blend sulfur wt% |
| --- | --- | --- |
| 65 and 35 | 32.8173 | 0.2642 |
| 13 and 7 | 32.8173 | 0.2642 |
| 650000 and 350000 | 32.8173 | 0.2642 |

Percentages, a ratio or a count of barrels on a nomination all make the same blend. What the engine refuses is a set of shares that cannot be normalised, a negative share or a total of zero.

## Exercise

Read the two sulfur rows at the top of this lesson. Quote the sulfur returned and the basis the engine names in each. Then read the refusal for Egbema Medium with no gravity. Quote the sulfur of the typed-0 row beside them. Say what the difference between the not blended answer and the refusal shows about which missing values spoil one property and which spoil the whole blend.
