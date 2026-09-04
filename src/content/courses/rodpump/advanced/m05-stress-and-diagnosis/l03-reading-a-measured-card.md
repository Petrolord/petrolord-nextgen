# Reading a measured card

A prediction assumes a fluid load and computes a card. A diagnosis is given a card and computes the load. Different problems, different mathematics, no shared code.

{{panel:pd-balance-explorer}}

## What is known and what is asked

A dynamometer measures both the polished rod position and the polished rod load through a cycle, so at the surface everything is known. The question is what the pump at the bottom of the string is doing. `diagnoseCard` takes each Fourier harmonic of the measured card and propagates it down the string in closed form, then sums the harmonics at the pump. There is no march and no time step. This is the Gibbs 1963 problem and it is solved analytically, one harmonic at a time.

## The published case

The published taper, a 120 sample synthetic measured card at 9 spm, a damping ratio of 0.1 and 24 harmonics. The card is a smooth closed loop running from 0.000000 to 64.000000 in of position and 8606.367967 to 13741.147957 lb of load.

It returns a plunger stroke of 79.499400953 in, a maximum pump load of 4235.608307819 lb and a minimum of 395.090372522 lb. The engine reproduces the independent oracle to 1.421e-14 in on the stroke, -2.728e-12 lb on the maximum load and -2.274e-13 lb on the minimum. The damping enters as kappa = 1.023453037 per s.

## The stroke at the pump is the longer one

A surface stroke of 64.000000 in implies 79.499401 in at the plunger, a ratio of 1.242178140. Reading a surface stroke as a pump stroke is not a small error on this card, and the direction is the one people expect least: the plunger travels further than the polished rod, because the string is still moving when the surface reverses.

## The harmonic count is a choice, and here it buys nothing

The count is the diagnostic's own resolution knob, capped at floor(N/2) - 1, which is 59 for a 120 point card. Swept contiguously from 2 requested to 58, every row returns a plunger stroke of 79.499400953 in, a maximum pump load of 4235.608308 lb and a minimum of 395.090373 lb. Two harmonics reproduce fifty eight to every figure printed.

That is a property of this card rather than a licence to use two. A smooth closed loop carries almost nothing above its lowest harmonics. A measured card with a sharp valve transfer in it does, and the count decides how much of that transfer survives.

## What it refuses

A card it cannot read. Fewer than sixteen samples returns ok = false with the message that a dynamometer card needs at least sixteen samples to be read, rather than a stroke computed from too little.

It will not supply a damping ratio either. Kappa is built from the number the caller typed, and no part of the measured card is used to check it.

## Exercise

Write the plunger stroke, the maximum pump load and the minimum pump load for the published card, and the ratio of pump stroke to surface stroke.

Then say what the harmonic sweep on that card does and does not prove about choosing a harmonic count.
