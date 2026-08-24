# Two layers two gradients

This is the central lesson of the course. Everything before it is preparation and everything after it is consequence.

## The same heat, two different gradients

Stay with the golden fixture. Surface temperature 10 degC, basal heat flow 0.06 W/m2 which is 60 mW/m2, an upper layer 1000 m thick with conductivity 1.8 W/m/K, and a lower layer 1000 m thick with conductivity 3.5 W/m/K.

The column is in steady state and produces no heat of its own, so the same 60 mW/m2 crosses every level of it. Not roughly the same. Exactly the same, by conservation of energy: whatever enters the base has nowhere to go except upward and out.

Now compute the gradient in each layer from $dT/dz = Q/k$.

| layer | k (W/m/K) | heat flow | gradient |
|---|---|---|---|
| upper | 1.8 | 60 mW/m2 | 33.333333333333336 degC per km |
| lower | 3.5 | 60 mW/m2 | 17.142857142857142 degC per km |

The two gradients differ by nearly a factor of two. The heat flow does not differ at all.

Sit with that for a moment, because it contradicts the way geothermal gradient is usually spoken about. Nothing changed about the earth between the two layers. The same energy is passing through both of them at the same rate. What changed is the rock's ability to conduct that energy, and the temperature profile adjusted itself to whatever slope was needed.

## The gradient is a ratio, not a property

Here is the statement to carry out of this course.

**The geothermal gradient is not a property of the earth. It is the ratio of heat flow to thermal conductivity, $Q/k$, at the point where you measured it.**

Heat flow is the thing the earth delivers. It belongs to the basin, to the crust beneath it and to the tectonic history that set it. Conductivity is the thing the rock does with it. It belongs to the lithology and the porosity of the interval you happen to be looking at. The gradient is the quotient of the two, and it is therefore a local number that inherits the identity of the rock it was measured in.

This is why the low conductivity layer has the steep gradient. Shale-like rock at 1.8 W/m/K is a poor conductor, so it needs a large temperature difference across itself to push 60 mW/m2 through, and it builds 33.333333333333336 degC of that difference per kilometre. The lower layer at 3.5 W/m/K conducts almost twice as well, so it moves the same heat with a slope of 17.142857142857142 degC per km. The insulator is steep and the conductor is gentle.

## Why extrapolating a gradient goes wrong

Now for the consequence, which is a mistake made constantly and reported in good faith.

You have a well with temperature measurements over the top kilometre. You fit a gradient, get 33.333333333333336 degC per km, and you want to know the temperature of a prospective interval at 2000 m. The obvious move is to extend the line: multiply the gradient by the depth, add the surface temperature and quote the answer.

Do that on this column and the cost is measurable. Carrying 33.333333333333336 degC per km down from the surface to 1950 m gives exactly 75 degC. The true temperature at 1950 m is 59.61904761904762 degC. The extrapolation overpredicts by **15.38095238095238 degC**, because below 1000 m the rock conducts better and the profile bends toward a gentler slope while the extrapolated line keeps climbing at the shallow rate.

That is the most consequential number in this course. Fifteen degrees is not a rounding difference at source-rock depth. It is the difference between a source rock that never entered the oil window and one that is well inside it, and the whole of it comes from treating a gradient as a property of the earth rather than as the ratio $Q/k$ in the rock where it was measured. No heat flow was misjudged and no measurement was wrong. One assumption about which rock the gradient belonged to produced it.

Reverse the situation and you get the opposite error. Measure a gradient in the high conductivity section and project it upward or into a shalier interval, and you predict temperatures that are too low, because the shale needs a steeper slope than the one you measured.

That gives you a rule you can apply without any arithmetic at all: extrapolating a gradient from a high conductivity rock into a low conductivity rock underpredicts the temperature, and extrapolating from a low conductivity rock into a high conductivity one overpredicts it. You cannot always compute the size of the error in the field, and you can always work out its direction, which is often enough to know whether a prediction is safe.

## What to do instead

Two habits follow.

The first is to think in heat flow rather than in gradients. A heat flow is a property of the location, so it can be carried from a well where it was estimated to a nearby prospect, applied to whatever conductivity column the prospect actually has, and turned into a temperature. A gradient cannot travel that way, because it is tied to a lithology. When you are handed a basin temperature model, ask what heat flow it uses. If the only number anyone can quote is a gradient, ask which interval and which formation it came from.

The second is to treat any gradient as a labelled quantity. Write it as a gradient over a stated depth interval in a stated lithology, and never as the gradient of the basin. On this fixture there is no single gradient for the column. There are two, and quoting either one alone as though it described the whole 2000 m would misstate the temperature at almost every depth in it.

Use the panel to see both gradients at once. It draws the golden column and reports the slope in each layer alongside the heat flow that is common to both.

{{panel:bs-burial-heat-explorer}}

## Exercise

A colleague has a well with good temperature control through a thick shale section down to about 1200 m, from which they have fitted a gradient. They want the temperature of a carbonate reservoir at 2600 m, and they propose to extrapolate their gradient down to it. State whether their answer will be too high or too low, and give the one sentence of physics that decides it.

Self check: the answer will be too high. Carbonate conducts heat better than shale, so below the shale section the gradient falls to a gentler value, while the extrapolated straight line continues at the steep shale slope all the way to 2600 m. The physics is that the gradient is $Q/k$ with the same $Q$ passing through both rocks, so the better conductor develops the smaller temperature difference per kilometre and the prediction that ignores the conductivity change overstates the temperature at the reservoir.
