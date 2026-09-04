# Hawkins

One line of algebra from 1956, still the standard way to turn a description of damage into a number.

{{panel:st-acid-explorer}}

## The formula

Hawkins models the damage as a clean cylindrical ring around the wellbore. Inside the ring the permeability is degraded and uniform. Outside it the rock is untouched. The skin that arrangement produces is

    s = (k / ks - 1) ln(rs / rw)

and that is the entire model.

## The two factors

The first factor is the **contrast**, k over ks, the ratio of undamaged permeability to damaged permeability. It measures how bad the damage is. The published case uses 5, meaning the damaged rock passes fluid five times less readily than the rock beyond it.

Subtracting 1 is what makes the formula behave. If the ring is not damaged at all the contrast is 1, the first factor is 0, and the skin is 0 no matter how thick the ring is. That is the first row of the sweep, and it is a sanity check you should run in your head every time.

The second factor is the **extent**, the logarithm of the damaged radius divided by the wellbore radius. It measures how far the damage reaches. The published case uses a damaged radius of 0.9 m against a wellbore radius of 0.108 m.

Multiply the two and the published case gives 8.481054145.

## The thing everybody misses

Hawkins needs no absolute permeability. Not the undamaged value, not the damaged value, only their ratio.

That has a real consequence. The same skin of 8.481054145 arises in a 1 mD rock and in a 1000 mD rock, provided the contrast and the radii match. Damage skin says nothing about how good the reservoir is. It says only how much worse the near wellbore rock is than the rest.

This is also why the engine refuses a contrast below 1. A ratio under 1 would describe near wellbore rock better than the reservoir, which is a stimulated well and not a damaged one, and Hawkins is not the right model for it.

## Exercise

Set the contrast to 1 in the panel and confirm the skin is 0. Explain why in one sentence.

Say what happens to the skin if you keep both radii and halve the damaged permeability.

Then state whether you could infer reservoir quality from a Hawkins skin, and justify your answer.
