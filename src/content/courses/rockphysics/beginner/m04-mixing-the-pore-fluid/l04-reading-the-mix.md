# Reading the mix

You now have the formula, the arithmetic and the saturation table. This lesson turns them into three statements you can apply to any mixed pore fluid you meet, and then draws the conclusion that the rest of your rock physics career will lean on.

## Rule one: the mix is always nearer the soft phase

A harmonic average is pulled toward its smallest input. Whichever fluid has the lowest bulk modulus sets the character of the mixture, and it does so at saturations far below half.

The capstone mix makes the point. Brine at 2697.8113 MPa and gas at 55.7187 MPa, mixed at 80 percent brine, give 257.3340919366766 MPa. Four fifths of the pore volume is the stiff phase and the answer still sits down among the soft phase.

This has an immediate practical use. Before you calculate anything, look at your phases, find the softest one, and expect the answer near it. If your calculation comes back near the stiff phase instead, you have made an error, most often by averaging the moduli arithmetically or by mixing a GPa value into an MPa sum.

## Rule two: it is never an average of the two inputs

The word average is the trap. People say Wood's equation averages the fluids, then reach for the intuition that goes with an arithmetic mean, which is that the answer lands somewhere sensible between the inputs in proportion to the amounts.

That intuition is right for density and wrong for modulus. The density of the capstone mix is 848.7933489234579 kg/m3, four fifths of the way from gas to brine, exactly where the saturations put it. The modulus is 257.3340919366766 MPa, which is not four fifths of the way from anything to anything.

The honest description is that Wood's equation averages compliances, and compliance is the reciprocal of modulus. Reciprocals invert the sense of large and small, so the phase that is least important by volume becomes the most important in the sum. If you can hold that one sentence, the whole of the saturation table follows from it.

## Rule three: a small gas fraction is a large seismic effect

The first one percent of gas took the fluid modulus from 2697.8113 to 1830.0363 MPa. That is a saturation change no log can resolve producing a modulus change any seismic dataset can see.

There is no threshold below which gas is negligible. The effect is largest, in proportion, exactly where the gas saturation is smallest, because that is where the compliance sum is changing fastest. Every intuition built on trace amounts of a component being a trace effect fails here.

## What follows: detector, not meter

Put the three rules together and you have the central limitation of seismic hydrocarbon detection.

Seismic is an excellent gas detector. The transition from no gas to a little gas is a large, robust change in fluid modulus, which becomes a large change in velocity and impedance, which becomes an amplitude anomaly you can map across a survey. That is a real signal with real physics behind it, and it is why amplitude-supported prospects get drilled.

Seismic is a poor gas meter. Once the gas is present, the curve flattens. The fluid modulus at 20 percent gas is 257.3341 MPa and at 80 percent gas it is 69.2905 MPa, and both of those are so far below the brine value of 2697.8113 MPa that the resulting amplitudes are hard to tell apart in the presence of ordinary uncertainty in porosity, net to gross and frame stiffness. The amplitude that tells you gas is there does not tell you how much.

This is why a bright amplitude is a reason to acquire more data rather than a reason to book a volume, and why saturation almost always has to come from a well.

## The assumption underneath all of it

Everything above assumes uniform saturation: gas and brine mixed intimately, at a scale far below the seismic wavelength, with pressure equalising within a wave cycle. That assumption is what makes the Reuss average the physical answer rather than a lower bound.

Real reservoirs are not always like that. Gas can sit in patches metres across, and within a patch the pressure cannot equalise with the surrounding brine during the passage of a wave. Each patch then responds with its own fluid, and the rock behaves as a mixture of gas-saturated and brine-saturated rock rather than as rock saturated with a mixed fluid. That patchy case is stiffer than Wood's equation predicts, sometimes much stiffer, and it climbs toward the upper bound rather than the lower one.

So Wood's equation is the soft end of a range of possible saturation distributions. For the same saturation, the seismic response can be anywhere between the uniform and the patchy case, depending on a distribution you cannot observe. That is a second, independent reason why amplitude cannot be inverted to a saturation, and it should be quoted alongside the first whenever someone asks for a number.

## Where this goes next

The mixed fluid is not the end of the calculation. It is an input. The Intermediate tier takes this fluid, the frame from the previous module and the porosity of the sand, and puts them through Gassmann's equation to get the modulus of the saturated rock, which is what a velocity actually depends on. Fluid substitution, the operation of swapping one pore fluid for another and predicting the new velocity, is that calculation run twice.

Everything you have learned about the mixed fluid survives into that work unchanged. The softest phase still dominates, the answer is still nowhere near an average, and the saturation is still the thing you cannot recover from the amplitude.

The panel below lets you set the water saturation and read the fluids, the frame and the Wood mix together, which is the whole of the Beginner workflow in one view.

{{panel:rp-fluid-explorer}}

## Exercise

Two prospects have the same rock, the same porosity and the same frame. One is at a water saturation of 0.99 and the other at 0.90. Give the mixed fluid modulus for each, say whether both would appear as gas on a seismic amplitude, and say what that means for a decision to drill.

Self check: the mixed fluid moduli are 1830.0363 MPa at Sw 0.99 and 469.8509 MPa at Sw 0.90, both well below the brine value of 2697.8113 MPa, so both prospects would soften the sand and both could produce an amplitude anomaly. One of them holds one percent gas and the other holds ten percent, and neither is necessarily commercial. The decision cannot rest on the amplitude alone, which is the practical meaning of calling seismic a saturation detector rather than a saturation meter.
