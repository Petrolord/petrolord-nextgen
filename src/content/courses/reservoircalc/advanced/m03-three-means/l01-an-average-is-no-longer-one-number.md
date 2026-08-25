# An average is no longer one number

While porosity was a constant, its average was itself. The moment it varies, the word average stops picking out one quantity, and at Ekene it picks out three that differ by two percent of each other.

## The three

**The arithmetic mean of the wells.** Add the six measured values and divide by six: 0.206667. This is a property of the data.

**The node mean over the oil.** Add the modelled porosity at each of the 169 oil bearing cells and divide by 169: 0.209368. This is a property of the model and the contact.

**The volume weighted mean.** Weight each cell's porosity by the rock that cell contributes before averaging: 0.210822. This is a property of the model, the contact and the structure together.

They are in increasing order and the spread from the lowest to the highest is 2.01 percent.

## Why they differ

Each is an average over a different population with a different weighting.

The arithmetic well mean averages six locations, chosen by where somebody drilled. Drilling locations are not a random sample of a field; they are chosen to find oil, and at Ekene two of the six found none.

The node mean averages 169 locations, chosen by where the model says oil is. That population excludes the eastern flank entirely, which is where the plane predicts the poorest rock. Removing the low end of a distribution raises its mean, which is the first step up.

The volume weighted mean averages the same 169 locations but counts each in proportion to the rock it carries. The cells with the tallest columns count most, and at Ekene those cells are in the west where the plane predicts the best rock. Weighting toward the thick cells raises the mean again, which is the second step up.

## Why this is not pedantry

Because they book different volumes, and the gap is comparable to what the whole property model is worth.

Booking the field with each of the three as a constant gives 12.543848, 12.707784 and 12.796077 MMstb. The spread between the first and the last is 0.252229 MMstb.

Recall that the whole property model is worth 0.657 MMstb against the tier below. So choosing the wrong average throws away nearly 40 percent of the effect you went to the trouble of modelling.

There is a sharper way to say it. Somebody who fits a property model and then reports its average porosity as the plain mean of their well values has done the modelling and then discarded most of its result.

## Which one the engine uses

None of them, in the sense that the engine never forms an average at all.

It multiplies each cell's net rock by that cell's own porosity and sums the products. The volume weighted mean is not an input; it is a quantity you can recover afterwards by dividing the pore volume by the net volume.

That is the cleanest way to think about it. The correct average is not chosen. It is implied by doing the arithmetic in the right order, and any average you can quote is a summary of an answer already computed.

## Reading it off the panel

The three means sit as the first three tiles.

{{panel:rc-property-explorer}}

With the method on trend they read 0.206667, 0.209368 and 0.210822. Switch to krige and the first stays put while the other two move, because the first is a property of the data and the other two are properties of the model.

Now switch to constant. All three collapse to 0.206667, because averaging a constant any way you like returns the constant. That collapse is the whole reason the tiers below could speak of the porosity without qualification.

## Worked example

Build a two cell field by hand and watch the three means separate.

Two cells. Cell A has a 20 m column and a porosity of 0.24. Cell B has a 5 m column and a porosity of 0.16. Suppose both were drilled, so the well values are 0.24 and 0.16.

The arithmetic well mean is 0.20. The node mean over the two cells is also 0.20, since there are two cells and two wells here.

The volume weighted mean weights by rock:

$$\frac{20 \times 0.24 + 5 \times 0.16}{20 + 5} = \frac{4.8 + 0.8}{25} = 0.224$$

The pore volume is 12 percent larger than the plain average suggests, from a field of two cells. The larger the correlation between column and porosity, the larger the gap, and at Ekene that correlation is positive.

## Exercise

State which of the three means would change if the contact were moved from 1560 m to 1550 m, and which would not.

Self check: the arithmetic well mean would not change, since it depends only on the six measured values. The node mean over the oil would change, because the set of oil bearing cells changes. The volume weighted mean would change for the same reason and also because every surviving cell's column changes, which alters the weights.
