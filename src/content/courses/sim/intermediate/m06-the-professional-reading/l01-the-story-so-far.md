# The story so far

The Associate tier read the deck. This tier asked where each number came from, and got four answers worth carrying forward.

## The structure is six measurements and an assumption

Nine hundred column depths, six of them anchored to wells. The surface between and beyond them comes from simple kriging with a spherical model, a range of 1200 m and a regional mean that nobody measured.

Zero nugget makes it exact at the data, and it is: five of the six wells come back to the last figure. The sixth, Ekene-2, sits half a cell off the 100 m lattice at a northing of 1150 m, so the deck samples the surface 50 m away and gives it

$$1564.3183173003902 \text{ m}$$

against a mapped 1565 m. That is a gridding loss rather than an interpolation loss, and no better interpolator fixes it.

## The volume matches because it was made to

| quantity | value |
|---|---|
| deck STOIIP | 12132366.897955146 stb |
| booked STOIIP | 12139208.107496763 stb |
| gap | -0.05635630826191784 percent |
| deck oil cells | 266 |
| booked oil cells | 169 |

The two were computed by the same volumetric engine on the same contact, porosity and saturation, so every difference between them is geometry or convention.

The agreement was arranged. The kriging's regional mean is the structure's one free parameter and it was set so the deck would land on the booking. That is standard static-model calibration and it is legitimate because the booked volume is the better constrained of the two numbers and the regional mean is constrained by nothing.

What it cost is the second row of that table. The deck matches the booked VOLUME over 266 cells where the booking used 169, so the model's oil is spread over a larger area at a thinner average column. You can match volume or area, not both.

## The fluid is designed, and the correlation disagrees

The deck carries the Material Balance course's designed oil: Boi 1.2 at 3200 psia, 400 scf/stb at a bubble point of 2000, viscosity 1.8 cp.

The standard correlation stack on the same 32 API and 0.75 gas gravity at 180 F says something else:

| quantity | designed | correlated |
|---|---|---|
| Bo at 3200 psia | 1.2 | 1.2292846175634324 |
| Rs at pb | 400 | 421.93922752270595 scf/stb, a gap of 5.484806880676496 percent |

Both are defensible. The deck must carry the one the rest of the study used, because the tank model, the flood ledger and the sweep analysis all used it, and swapping it would move the oil in place, every voidage ratio and the mobility ratio at once.

The gas is correlated rather than designed, because no earlier course built a gas description and inventing one would have been worse than falling back on the field's own gas gravity.

## The rock curves are one fit applied everywhere

Twenty two SWOF rows from a six-parameter Corey model, applied to all 4500 cells across five layers whose permeability spans a factor of six. One saturation region, no hysteresis, no capillary pressure.

The gas-oil table came from nowhere at all: the field never went below its bubble point, so no measurement constrains it, and the three parameters behind SGOF are this deck's own design constants. Nothing in this course is graded on them.

## The three honest caveats

**The structure is calibrated, not validated.** It was tuned to reproduce the booking, so the agreement tests nothing. There is no spare well and no independent survey to check it against.

**The precision is not accuracy.** The deck carries fifteen digits and the underlying history is an allocation good to a few percent.

**One region, one curve.** The rock curves assert that a 607 md layer and a 102 md layer flow alike, which is convenient and is not what rock does.

## Exercise

First, write the four-line provenance note you would put at the top of this deck: one line each for the structure, the volume, the oil and the rock curves.

Second, of the three caveats above, name the one you would most want resolved before using this model for a forecast, and say what it would take.
