# Accuracy on span is not accuracy on reading

A differential transmitter is sold with an accuracy figure. That figure is
quoted on its span, which is the full range it has been set up to measure. Your
flow calculation needs the uncertainty of the reading in front of you. Those are
two different quantities, and the difference between them is the single most
misunderstood thing in gas measurement.

## What span means

The transmitter used through this module has a span of 200.000000 in H2O and an
accuracy of 0.075000 percent of span, which is the engine's own default
accuracy. Read that as a band around the reading whose width is fixed. It was
fixed when somebody chose the span, and it does not get narrower when the flow
falls.

The reading, on the other hand, does fall. So the same fixed band is a larger
and larger share of a smaller and smaller number. That is the whole mechanism,
and everything in this module follows from it.

## At the top and at the bottom

   at a reading of 200.000000 in H2O, percent of reading             0.075000
   at a reading of 2.000000 in H2O, percent of reading             7.500000
   difference (first less second)                     -7.425000
   ratio (first over second)                           0.010000

At the top of the span the percent of reading and the percent of span are the
same number, because the reading is the span. Everywhere below it they differ.

## Why this catches people

Three reasons, and all three are about the shape of the working day.

The first is that the accuracy figure appears on the datasheet, on the purchase
order and in the meter station specification, always quoted on span. It is the
number everybody has seen, so it is the number that gets repeated in a meeting.

The second is that the flow calculation is done at design conditions, where the
reading is near the top of the span and the two figures are close enough that
nobody notices they are different quantities.

The third is that production falls. A well that made design rate in its first
year makes less later, the reading walks down the span, and nothing on the
screen announces that the uncertainty of the measurement has changed. The
instrument is behaving exactly as specified. The measurement is getting worse.

## What follows

The next lesson walks down the span reading by reading, so the shape of it is in
front of you. After that comes the turndown question, which is how far down the
span a meter may be run before the answer stops being worth having, and then the
warning the engine returns when you have gone past that point.

In module six the same transmitter figure arrives inside the uncertainty budget,
where it sits beside five other terms and competes with them, and the term that
dominates the budget changes name as the reading falls.

## Exercise

A colleague says the meter is accurate to a fixed small percentage because that
is what the datasheet says. Using the two figures printed above, write the one
question you would ask before agreeing.
