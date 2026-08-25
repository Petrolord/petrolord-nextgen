# The arithmetic well mean

The first of the three means is the simplest and the most often misused. It is worth understanding what it is a good estimate of, because it is a good estimate of something.

## The number

$$\bar{\phi}_{\text{wells}} = \frac{0.22 + 0.19 + 0.23 + 0.17 + 0.21 + 0.22}{6} = 0.206667$$

This is also exactly what the constant population method produces at every node, because that method takes the weighted mean of the control values and equal weights give the arithmetic mean.

## What it estimates

It estimates the porosity of the rock at the six places somebody drilled, averaged with equal weight per well.

That is a real quantity and it is the right answer to a specific question: if I pick one of these six wells at random, what porosity should I expect? Nothing more.

Whether it estimates anything about the field depends on whether the wells are representative of the field, and there are two reasons they usually are not.

## Reason one: wells are not sampled at random

Wells are drilled where somebody expects oil, which usually means structurally high, which often means better rock. Appraisal wells are then drilled to test the edges, which pulls the other way. Neither process resembles random sampling.

At Ekene the effect is visible in the map. Four of the six wells sit in the western two thirds of the field where the plane says the rock is better. The two eastern wells carry the two lowest values. So the well set over samples the good rock relative to the field area and under samples it relative to the oil, and those two biases run in opposite directions.

## Reason two: equal weight per well is a choice

Each well gets a weight of one sixth regardless of how much rock it represents. Ekene-4 speaks for the far eastern flank, most of which holds no oil. Ekene-6 speaks for a small area near the fault that carries tall columns.

Weighting by area, or by rock, gives a different answer, and that is precisely what the other two means do.

The engine's constant method does accept per point weights, so a weighted mean is available if you have a defensible weighting. Area weighting by a Voronoi partition of the wells is the usual choice. Nobody has supplied weights here, so all six count equally.

## When it is the right number

Two cases, and both are common.

When there is no spatial model, because the wells are too few or show no pattern you believe, the arithmetic mean is the honest summary and a constant booking is the honest booking.

When you need a check on a spatial model. Any property model whose volume weighted mean is far from the well mean is claiming something strong about the correlation between the property and the rock volume, and that claim should be examined. At Ekene the gap is 2 percent, which is modest and explicable. A gap of 15 percent would be a reason to go looking for a mistake.

## Reading it off the panel

The first mean tile shows the arithmetic well mean, and it does not move when you change the method.

{{panel:rc-property-explorer}}

That immobility is the point. It is the only one of the three numbers on that row that is a property of the data rather than of a model, which makes it the natural reference against which the other two are read.

Set the method to constant and note that the booking becomes 12.543848 MMstb. That is the honest volume for somebody who has six porosity values and declines to model their spatial variation, and it is 0.404640 MMstb above the Associate tier's booking with the handed out 0.20.

## Worked example

Compute how much of the field's uplift comes from the well mean alone, before any spatial modelling.

The Associate tier booked with a porosity of 0.20. The wells average 0.206667, which is 3.33 percent higher. Since the chain scales linearly in porosity,

$$12.139208 \times \frac{0.206667}{0.20} = 12.543848 \ \mathrm{MMstb}$$

That is 0.404640 MMstb above the Associate booking, and it required no property model at all. It required only noticing that the constant handed out was below the average of the measurements.

Hold that number. It is 62 percent of everything the Expert tier's property model is credited with, and module four is largely about it.

## Exercise

A field has eight wells with porosities averaging 0.18, and a property model whose volume weighted mean over the oil comes out at 0.23. State what that gap implies and what you would check.

Self check: a gap of 28 percent implies a very strong positive correlation between porosity and oil bearing rock volume, so the oil would have to sit almost entirely on the best rock. That is possible but extreme, so check whether one high porosity well is dominating the model, whether the oil cells cluster around that well, and whether the extrapolation is pushing modelled values above anything measured.
