# Invented detail

The Associate tier warned that a property map adds realism and invented detail together, and that a property map is not more true than a constant but more specific. This lesson closes the tier on that point, with the numbers this tier produced.

## The count

Six measurements became 500 modelled values, of which 169 reach the booking.

That is a ratio of about 28 to 1 for the booked cells. Every modelled value except six is an inference, and even those six are inferences in the sense established two lessons ago, since the model overrides four of them.

## What specificity buys and costs

A constant makes one claim: the field has a porosity of 0.206667. It is obviously an average and nobody reading it will mistake it for local knowledge.

A property map makes 500 claims. Each one has a location, a value to six decimals, and a colour on a map. Presented that way, the model looks like knowledge about places, and the places it appears to know about are mostly places nobody has been.

The cost is not in the volume. The decomposition showed the spatial part of the model is worth 0.252229 MMstb, which is modest. The cost is in what the map is then used for.

A porosity map informs well placement. Somebody choosing between two locations 500 m apart will look at the porosity map, and the map will give them a confident answer that is a plane evaluated at two points. At Ekene the plane's gradient is 0.020437 per kilometre, so two locations 500 m apart differ by 0.010 in the model, and that difference is entirely a consequence of a fit to six wells, four of which the plane misses by more than that.

The map cannot distinguish those two locations. It will nonetheless appear to.

## The three defences

**Report the residuals with the map.** A property model shown without its misfit at the control points is a model presented as data. At Ekene the residuals run to 0.019309, which is larger than the difference the map claims between locations a kilometre apart. That single comparison tells a reader everything about how much local detail to believe.

**Report the method and its parameters.** Constant, trend or krige, and for kriging the variogram. The three methods book 12.543848, 12.796077 and 13.337665 MMstb from the same six numbers, so the method is not a technicality.

**Report the decomposition.** Separating the better constant from the spatial part tells the reader which part of the uplift survives if they disbelieve the map entirely. At Ekene, 0.404640 MMstb survives and 0.252229 MMstb does not.

## What the model is genuinely good for

It would be a mistake to end on scepticism alone.

The trend model states a testable claim about the field: porosity improves westward at about two porosity units per kilometre. That claim can be checked against the depositional model, and it will be confirmed or refuted by the next well. A constant makes no claim and cannot be wrong, which also means it cannot be tested or improved.

The model also weights the booking correctly. Even if the plane's local detail is untrustworthy, the fact that the oil sits on rock the model rates above the field average is a real feature of the data and the structure together, and booking with a plain constant ignores it.

And the model makes the field's spatial structure visible. Reading that the porosity data spans 0.17 to 0.23 with the low values in the east is more useful for planning than a single averaged number, whatever the map's local resolution.

## The rule to carry

Use the model for what it can support and not for what it displays.

It can support a booking, because the booking depends on the model only through one weighted average. It can support a claim about a regional gradient, because that is what was fitted. It cannot support a choice between two locations closer together than the well spacing, because there is no information in the model at that scale.

## Worked example

Put a number on the smallest distance the Ekene model can resolve.

The wells are roughly 800 m to 1.5 km apart. The plane's gradient is 0.020437 per kilometre, so across a typical well spacing of 1 km the model predicts a porosity change of about 0.020.

The residuals at the wells run up to 0.019309, which is essentially the same size.

So the model's predicted change over one well spacing is no larger than its known misfit at the wells. The signal to noise ratio of the map at the well spacing scale is about one. Below that scale it is less than one, and the map is displaying differences smaller than its own demonstrated error.

That comparison, gradient times distance against the largest residual, is a cheap resolution test worth applying to any property map.

## Exercise

Apply the resolution test to a property map with a fitted gradient of 0.05 per kilometre, wells 2 km apart, and a largest residual of 0.01. State the smallest distance over which the map's predictions exceed its own misfit.

Self check: the map predicts a change of 0.01 over $0.01 / 0.05 = 0.2$ km, so beyond about 200 m its predicted differences exceed the largest residual, and over the 2 km well spacing it predicts 0.10 against a misfit of 0.01, a signal to noise ratio of ten. That map carries genuine resolution at the well spacing scale, unlike the Ekene one.
