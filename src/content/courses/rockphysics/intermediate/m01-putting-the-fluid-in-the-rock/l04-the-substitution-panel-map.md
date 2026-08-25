# The substitution panel map

The substitution explorer is the instrument for this tier. It has three controls and twelve readings, and knowing which of the three is a measurement and which two are assumptions is half of what the panel is for.

{{panel:rp-substitution-explorer}}

## The three controls

**Water saturation** sets what fills the pores. At 1.00 the pores hold the logged brine and the panel returns the log itself. At 0.00 they hold gas alone. In between, the two are mixed with Wood's equation from the tier below, which is the correct mixing rule for fluids that share a pore space at seismic frequencies.

**Porosity** is an assumption. It is not on the log in the way that velocity and density are; it is derived from them by a petrophysical model, and it carries the uncertainty of that model. The panel exposes it because module two shows it is the most leveraged number in the tier.

**Mineral modulus** is also an assumption, and a weaker one. It comes from a mineral mixture that was itself estimated from a lithology model.

The saturation control asks a question. The other two controls set the terms on which the question is answered.

## The chart

The curve is the compressional velocity against water saturation, drawn with fully brine saturated at the left and fully gas saturated at the right. The white dot marks the saturation currently selected.

The shape of that curve is the most important single thing on the panel, and module four is about it. Look at it now without reading ahead: it drops almost vertically at the left, flattens, and then turns back up before reaching the right hand edge.

## The tiles

The first row is the moduli. The shear modulus and the saturated modulus as logged are the two values from the last lesson. The dry frame is what inverse Gassmann recovered. The mineral frame is the Associate tier's Voigt Reuss Hill value, printed alongside so the two are never confused.

The second row is the pore fluid at the chosen saturation, in modulus and density, which is what the tier below computed.

The third row is the substituted log: compressional velocity, shear velocity and bulk density, each printed with the logged value beside it so the change is visible without arithmetic.

The last row is the derived readings. Vp over Vs and acoustic impedance are the two quantities a seismic interpreter actually works with. The round trip tile is the quality control: it substitutes the brine back into the answer and prints what comes out, which must be the original log.

## What to notice first

Set the saturation to 0.00 and read across.

The shear modulus is 7.29 GPa and the dry frame is 7.3503 GPa. Those two being nearly equal is a coincidence of this rock rather than a rule, and it is worth not reading anything into it.

The dry frame at 7.35 GPa sits against a mineral frame at 30.88 GPa. The rock is four times softer than the mineral it is made of, which is what 25 percent porosity and grain contacts do.

The velocity has fallen from 3200 to 2905.6972 and the shear velocity has risen from 1800 to 1890.9759.

The round trip tile reads 3200.0000 and 1800.0000. Exactly the log, to every digit printed.

## Worked example

Here is a two minute exercise that previews the rest of the tier.

Leave the saturation at 0.00 and step the porosity through 0.20, 0.25 and 0.30. The velocity reads 2709.6399, 2905.6972 and 3033.8186. A range of 324 m/s from an assumption.

Now put the porosity back to 0.25 and step the mineral modulus from 35 to 40 GPa. The velocity reads 2931.3769 down to 2871.7164. A range of 60 m/s.

The porosity is worth more than five times the mineral modulus, and neither of them is the measurement you started from. Any effort spent on this substitution belongs on the porosity.

## Exercise

Set the saturation to 0.95 and record the velocity, then to 0.00 and record it again. State how much of the change from the fully brine case each step represents.

Self check: at Sw 0.95 the velocity is 2915.2645 and at Sw 0.00 it is 2905.6972, against 3200 for the fully brine case. So five percent of gas delivers 284.7 m/s of the drop while the remaining 95 percent of the gas delivers only a further 9.6 m/s, and the velocity actually dips below 2905.6972 in between. That non-monotonic shape is the subject of module four.
