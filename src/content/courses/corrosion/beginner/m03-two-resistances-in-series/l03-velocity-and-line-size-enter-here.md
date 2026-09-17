# Velocity and line size enter here

{{panel:fc-rate-explorer}}

The chemistry side of this model never sees the pipe. Velocity and line inside diameter reach the rate through the transport term alone, which is where a flow decision becomes a corrosion decision. The term is a power law: it rises with velocity, falls with diameter, and is exactly linear in the carbon dioxide fugacity.

The powers are properties you can measure from the outside, and the engine's own sweep does exactly that. At a line inside diameter of 0.050800 m the transport term is 6.669367 mm/yr at 1 m/s, 11.612042 mm/yr at 2 m/s and 20.217739 mm/yr at 4 m/s. Both doublings give the same ratio, 1.741101126592. At a diameter of 0.101600 m the term is 5.806021 mm/yr, 10.108870 mm/yr and 17.600564 mm/yr for the same three velocities, and the doubling ratio is 1.741101126592 again. At 0.203200 m and at 0.406400 m it is the same number once more.

## A constant ratio down a column is the claim

A ratio that stays put while the other inputs move is what a power law means, and it is scale free. It tests the form of the term rather than the size of its constants, so it is one of the few things here you can check without a source. The measured velocity exponent is 0.800000000000 and the measured diameter exponent is 0.200000000000, with the diameter entering the other way round.

Both exponents and the coefficient in front of them are held for literature. They are measured out of the engine's behaviour and pinned against a literal in a third file, which says the module uses what it declares. It says nothing about whether those powers are the published ones.

Of the two inputs, velocity is usually the one a corrosion engineer can still influence once a line is in the ground, through the throughput or through how many lines are in service. The diameter is fixed by hydraulics long before this screen is opened.

## What it means on a real line

Because the transport term is the smaller of the two on many streams, a velocity change moves the printed rate directly. The shipped case is one of those: the transport term of 11.701938 mm/yr sits below the reaction term of 44.225132 mm/yr, so velocity and line size move this answer and the chemistry does not.

There is a second and larger reason to watch velocity, and this module treats it separately. The wall shear the flow produces decides whether a corrosion inhibitor film survives, and that verdict acts on the rate as well. Note carefully what this is not. The module holds no erosional velocity criterion, so nothing here is a statement about erosional wall loss from solids or impingement. The Casing & Tubing Design course owns that criterion.

## Exercise

Using the panel, set the line inside diameter to 0.050800 m and record the transport term at 1 m/s, 2 m/s and 4 m/s against the 6.669367 mm/yr, 11.612042 mm/yr and 20.217739 mm/yr above. Form both doubling ratios yourself and compare them with 1.741101126592. Then double the diameter at a fixed velocity, record the new term, and say which of the two exponents your result is consistent with.
