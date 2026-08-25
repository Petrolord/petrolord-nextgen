# A method that honours the data

Kriging is the third population method, and it differs from the trend in the property that matters most for this tier: at a data location it returns the measured value.

## What it does

Kriging estimates the value at a location as a weighted average of the data, with weights derived from a variogram, which is a model of how quickly the property decorrelates with distance.

The weights fall off with distance, so nearby wells count more, and the form used here has the exactness property: at a well, the weight on that well goes to one and the weights on the others go to zero, so the estimate is the measured value.

That is a genuinely different promise from the trend, which fits through the data rather than to it.

## The Ekene comparison

| Well | Measured | Trend | Krige |
| --- | --- | --- | --- |
| Ekene-1 | 0.22 | 0.219865 | 0.220000 |
| Ekene-2 | 0.19 | 0.195226 | 0.191177 |
| Ekene-3 | 0.23 | 0.210691 | 0.230000 |
| Ekene-4 | 0.17 | 0.186013 | 0.170000 |
| Ekene-5 | 0.21 | 0.227348 | 0.210000 |
| Ekene-6 | 0.22 | 0.200857 | 0.220000 |

Five of the six kriged values are exact. Ekene-2 is not, and the reason has nothing to do with kriging; the next lesson is about it.

## What honouring the data costs

The kriged model books 13.337665 MMstb against the trend's 12.796077, a difference of 0.541588 MMstb. Against the constant booking it is worth 1.198457 MMstb, nearly twice the trend.

Its effective porosity is 0.219745, against the trend's 0.210822 and the well average of 0.206667. It has pulled a long way above the data average.

Why? Because kriging honours the high values as well as the low ones, and the high values sit where the oil is. Ekene-3 at 0.23 and Ekene-6 at 0.22 are both reproduced exactly and both lie over oil bearing ground, while Ekene-4 at 0.17 is reproduced exactly over ground that holds no oil at all.

The trend, by smoothing, pulled Ekene-3 down to 0.2107 and Ekene-6 down to 0.2009, which is precisely why it books less.

## Which is right

Nothing in the data decides it, and that is the honest answer.

Kriging is right if the well values are accurate and the property really does return to them locally. Then smoothing them away discards information.

The trend is right if a good part of the spread between wells is measurement uncertainty and local detail below the resolution of six wells. Then honouring every value exactly is fitting noise, and the exactness is spurious precision.

The difference between those two positions is worth 0.541588 MMstb here, which is more than the entire spatial part of the trend model. Neither position can be tested against six wells, because kriging's residuals are zero by construction and cannot be examined.

One thing does argue for caution with the kriged number. The variogram used here was supplied rather than fitted, since six points cannot support a fitted variogram. So the kriged map's structure comes from a range and a model somebody chose, and a different choice would give a different booking.

## Reading it off the panel

Switch between trend and krige and watch the well rings.

{{panel:rc-property-explorer}}

Under trend all six rings are red. Under krige five turn green and Ekene-2 stays red.

Look at the maps too. The trend map is a smooth gradient with no local features. The kriged map has closed highs around Ekene-3 and Ekene-6 and a low around Ekene-4. Same six numbers, and the second map claims to know things about the neighbourhoods of individual wells that the first declines to claim.

## Worked example

Attribute the difference between the two bookings to specific wells.

The kriged effective porosity is 0.219745 and the trend's is 0.210822, a gap of 0.008923, which is 4.2 percent of the value.

The wells over oil bearing ground are Ekene-1, Ekene-3, Ekene-5 and Ekene-6, whose measured values average 0.22. The trend places all four below their measured values except Ekene-5, at 0.219865, 0.210691, 0.227348 and 0.200857, averaging 0.214690.

Kriging restores them to 0.22, and since these are the wells sitting where the volume is, the effective porosity moves toward 0.22. The two dry wells with the low values, at 0.19 and 0.17, are honoured too, but over ground that contributes no barrels.

So the whole difference is that kriging honours high values over the oil and low values over the dry ground, while the trend averages the two together. Stated that way, the choice is a question about whether the wells over the oil really are better rock or whether the field average is the safer estimate.

## Exercise

State why kriging's residuals cannot be used to assess the kriged model, and give one thing you could examine instead.

Self check: the residuals are zero at every data location by construction, so they measure only that the exactness property is working. Instead you can cross validate by removing one well, rekriging from the rest and comparing the prediction at the withheld location against its measurement, which is the leave one out procedure the mapping tier used on the structural grid.
