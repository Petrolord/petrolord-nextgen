# The residual

The well is drilled, the pick is in, and the comparison can be made. This lesson reports it and says exactly what it establishes.

## The comparison

$$\text{residual} = \text{predicted} - \text{actual} = 1543.3271484375 - 1549 = -5.6728515625\ \mathrm{m}$$

Negative, so the six-well map put the horizon **too shallow**. The real horizon at Ekene-7 is 5.67 m deeper than the map said.

The capstone grades this field to 0.1 m.

## What it establishes

**The six-well map, at an interior location 500 m from its nearest control, was wrong by 5.67 m.**

Read that sentence carefully, because every qualifier in it is doing work.

It is the **six-well map**, the one actually in use, not a reduced one. There is no pessimistic bias here of the kind leave-one-out carries.

It is an **interior** location, inside the control hull, so this is interpolation and not extrapolation.

It is **500 m from the nearest control**, which is closer than the leave-one-out test at Ekene-6 and closer than most of the map's interior.

And it is **5.67 m**, on a field whose entire structural relief is 49 m.

## The comparison with the other residual

| Test | Location | Nearest control | Residual |
| --- | --- | --- | --- |
| Leave-one-out | Ekene-6 (1900, 1800) | 707.1 m | $+9.84$ m |
| Blind | Ekene-7 (1500, 1500) | 500.0 m | $-5.67$ m |

The blind residual is smaller, which fits the expectation set in the previous lesson: Ekene-7 is closer to control than Ekene-6 was after its neighbour was removed, and the six-well map is better constrained than a five-well one.

It is smaller and it is not small. Two thirds the size of the other, at a location a third closer to control, on a map built from a sixth more data.

## Where the error came from

The prediction of 1543.33 m was shallower than Ekene-6 at 1546 m and Ekene-1 at 1548 m, both within 710 m. The actual pick of 1549 m is deeper than both.

So the spline overshot shallow at this location, and the real surface is not only below the fitted one but below the local well control as well. The most likely reading is again short-wavelength structure: the surface between Ekene-3's high at 1541 m and the ground to the south is not the smooth ramp a minimum-bending fit produces.

That is the same finding as at Ekene-6, in the opposite direction. The field has relief the well spacing does not resolve, and the interpolator smooths across it.

## What it does not establish

**It is not a bias.** One negative residual and one positive one do not establish a direction.

**It is not an error bar for the whole map.** It is one location. The map's error elsewhere could be larger, particularly further from control.

**It is not a verdict on the method.** A thin-plate spline through six wells behaved as such a spline does. Nothing here suggests a different interpolator would have done better, and module 2 gave the reason: no interpolator recovers a feature no control point sampled.

## The honest sentence

> The six-well map predicted 1543.33 m at Ekene-7 and the well found 1549 m, a blind residual of $-5.67$ m at a location 500 m from the nearest control. With the leave-one-out residual of $+9.84$ m at Ekene-6, two interior tests have produced errors of five and ten metres with opposite signs on a field with 49 m of structural relief.

## Worked example

A prospect is being ranked on a mapped closure of 8 m. What does this residual say about that ranking?

That the closure is within the demonstrated error of the map at a single interior point. A map that was wrong by 5.67 m where it could be checked cannot distinguish an 8 m closure from no closure with any confidence.

That does not condemn the prospect. It says the mapped closure is not by itself sufficient evidence, and that either more control or an independent constraint such as seismic is needed before the closure carries a decision.

## Exercise

Compute the blind residual from the prediction and the pick, state its sign and meaning, and compare it with the leave-one-out residual in both magnitude and sign.

As a self-check: $1543.3271484375 - 1549 = -5.6728515625$ m, negative, meaning the six-well map placed the horizon 5.67 m too shallow and the real horizon is deeper than mapped. It is smaller in magnitude than the leave-one-out residual of $+9.84$ m, which fits a location closer to control and a map with more of it, and it has the opposite sign, so the two together show local errors in different directions rather than a systematic bias.
