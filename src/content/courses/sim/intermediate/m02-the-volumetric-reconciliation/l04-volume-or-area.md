# Volume or area

The deck reproduces the booked volume. It does not reproduce the booked area, and it could not do both. This is the central result of the module.

## The two numbers

| quantity | booking | deck |
|---|---|---|
| STOIIP (stb) | 12139208.107496763 | 12132366.897955146 |
| oil cells | 169 | 266 |

The volume matches to six hundredths of a percent. The cell count is 57 percent higher.

{{panel:sim-structure-explorer}}

The map makes it visible: the oil region in the deck is a broad area of mostly thin columns, where the booking was a compact area of full-thickness ones.

## Why both cannot be matched

Because the two models put the oil in different shapes.

The booking clips the AREA at the contact and gives every cell inside it the full net thickness. So its oil is 169 cells each carrying about 34.6 ft.

The deck clips by cell centre. A column whose top is only a few feet above the contact contributes one or two layers rather than five. So its oil is spread over 266 cells, most of them partial.

Matching the total means the deck's larger area has to compensate for its thinner average column. That is one equation and one free parameter, so one of the two can be matched and the other follows.

## Which to match

Volume, and it is not close.

A forecast is a fraction of the oil in place. If the model contains ten percent less oil than the field, every rate and every cumulative is ten percent low from the first timestep, and no amount of history matching fixes it because the error is in the denominator.

Area, by contrast, affects where the oil is rather than how much, and the wells are where they are regardless. An oil region that is too broad and too thin puts some oil in cells that will not be swept, which biases the recovery factor, and that is a smaller and slower error than getting the volume wrong.

## What the area mismatch costs

Three things worth naming.

**Some oil is in places the flood will not reach.** The extra 97 cells are around the edges, far from the wells, in thin columns. Oil there is real in the model and largely immobile in practice.

**The oil region has a longer perimeter.** More contact with the water leg means more of the model's oil is adjacent to water, which can make water break through earlier than the booking's compact geometry would suggest.

**The recovery factor is not comparable.** A recovery factor computed on this model is a fraction of a volume distributed differently from the booking's, so comparing it against a volumetric recovery factor estimate is comparing two different denominators arranged to be equal.

## What to say in a report

The sentence that covers it: the model reproduces the booked hydrocarbon volume to within a tenth of a percent over a larger oil area with a thinner average column, because the model clips saturation at cell centres and the booking clips area at the contact.

That is one sentence and it forecloses every version of the argument that follows from somebody discovering the cell count later.

## The misconception to avoid

"The model has more oil cells, so it is more optimistic." It has the same oil. More cells at less thickness each is the same integral. Optimism would be more VOLUME, and the volume is matched. Cell count is a statement about distribution, and reading it as a statement about magnitude is the error this whole lesson exists to prevent.

## Exercise

First, the deck has 266 oil cells and the booking 169, with matched volume. Compute the ratio of average oil column thickness between the two, and state which is thinner.

Second, write the one-sentence reconciliation statement you would put in a study report, and say which two numbers it must contain.
