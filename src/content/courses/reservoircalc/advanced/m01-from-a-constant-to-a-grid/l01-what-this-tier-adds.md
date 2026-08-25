# What this tier adds

Two tiers of this course have booked volumes with four constants. Net to gross 0.8, porosity 0.20, water saturation 0.35, formation volume factor 1.2. The Associate tier said in as many words that real rock does not work that way and that this tier is where the constant porosity goes.

So you already know the headline. Replacing the constant with a fitted trend moves the Ekene booking from 12.139208 to 12.796077 MMstb, a rise of 0.656868 MMstb. That number was quoted to you two tiers ago as a forward pointer.

This tier is not about producing that number. It is about what is inside it, and the inside is more interesting than the outside.

## Three claims to hold lightly

Here are three things that sound obviously true about property models. All three are wrong in ways this tier will measure.

The first is that a model fitted to the well porosities reproduces the well porosities. It does not. The trend used here misses five of the six wells, one of them by 8 percent of its measured value.

The second is that the uplift measures the value of spatial modelling. It does not. Most of the 0.656868 MMstb comes from something much simpler, and this tier separates the two parts.

The third is that once porosity varies, its average is still a number you can quote. It is not. There are three defensible averages of the same modelled porosity at Ekene, they differ, and only one of them belongs in a booking.

## What stays the same

As at the tier below, almost nothing moves.

The same six wells, the same two surfaces, the same 25 by 20 frame with 100 m cells, the same 201 live nodes. The same contact at 1560 m and the same 169 oil bearing cells. Net to gross stays at 0.8, water saturation at 0.35, the formation volume factor at 1.2.

The fault is gone. This tier books the field as a whole, as the Associate tier did, so that the property model is the only thing that has changed. Partitioning and property modelling are independent and combining them would confuse both.

## What changes

One input. Where the chain previously received a single porosity, it now receives a grid: one value per node, populated from the porosity measured at each of the six wells.

The engine needs no modification, which the Associate tier already explained. It was always summing node by node and had always been receiving arrays; the arrays simply held the same number at every node.

## What you will be able to do

You will be able to take a set of well property values, populate a grid from them by an appropriate method, rerun a volumetric chain and say precisely what the change was worth and where it came from.

More importantly you will be able to say what it did not come from, and to defend an average against somebody quoting a different one.

The five things this tier spends its modules on are: what the trend method actually computes and how far it is from an interpolator; how badly the model misses the data it was fitted to; the three averages and the argument between them; the decomposition of the uplift into a part that is only a better constant and a part that is genuinely spatial; and the limits, including the two properties that are still constants and probably should not be.

## Worked example

One arithmetic fact to fix the scale before the tier begins.

The chain multiplies gross rock volume by four constants. Change only the porosity and every downstream number scales by the same ratio, because nothing else in the chain has moved. So

$$\frac{12.796077}{12.139208} = 1.05411$$

and the effective porosity behind the trend booking must be $0.20 \times 1.05411 = 0.210822$.

The whole property model, all 169 nodes of it, is equivalent to booking with a single porosity of 0.210822 instead of 0.20. That is worth knowing at the start, because it tells you the model's total effect is one number, and it raises the question this tier turns on: where does 0.210822 come from, given that the six wells average 0.206667?

## Exercise

Before reading further, predict which is larger: the arithmetic mean of the six well porosities, or the effective porosity implied by the trend booking. Give a reason for your prediction.

Self check: the effective porosity is larger, 0.210822 against 0.206667. The reason is that the effective porosity is weighted by the rock each node carries, and at Ekene the porosity is higher where the oil column is taller, so the cells contributing most volume carry above average porosity. The Associate tier predicted this sign in words; this tier measures it.
