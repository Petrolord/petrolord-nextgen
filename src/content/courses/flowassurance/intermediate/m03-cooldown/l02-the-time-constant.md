# The time constant

One number carries everything the pipe contributes to a cooldown, and it does not know what temperature the line started at or what temperature you are worried about.

{{panel:pd-line-explorer}}

## Heat capacity over conductance

tau = M Cp / (U A). On the published cooldown case the conductance is 2.119538792399 Btu/(hr ft degF) per foot of pipe, the heat capacity is 7.606369304989 Btu/(ft degF) per foot, and the quotient is 3.588690771912 hr. The oracle reaches 3.588690908413 hr working in SI seconds, a relative difference of 3.803658e-8.

Both terms are per foot and the foot cancels. A time constant is a property of a cross section, so a longer line of the same construction cools at exactly the same rate.

## What one time constant is worth

At one time constant the excess over ambient has fallen to exp(-1) = 0.367879441171 of what it was, so 63.21205588 percent of it is gone. That is the same exponential the flowing profile runs, with time in place of distance and tau in place of the relaxation length.

The time to reach a particular target is tau multiplied by a logarithm: ln((150.0 - 40.0)/(70.0 - 40.0)) = 1.299282984130, and 3.588690771912 hr times that is 4.662724855250 hr. The published no-touch time is 1.299282984130 time constants and nothing more.

## The half that survives when the answer does not

tau is computed before the log term and does not depend on the start or the target, which is visible in the cases where the hours are useless. Asked for a target below ambient on a teaching line, `cooldownTime` returns hours as Infinity and a time constant of 8.6008917110 hr. Asked for a target above the start on the same line, it returns -4.6959175559 hr and the same time constant of 8.6008917110 hr. Both are TEACHING LINE runs, not published cases. The time constant is right in both and the hours are not, which is a good reason to read it first.

## What moves it and what does not

Only two things move tau. Raise the heat capacity of what is cooling and it grows in proportion. Raise U and it shrinks in proportion. Rebuilding the published cooldown around a stagnant bore takes U from 1.334879072040 to 1.0580538200 Btu/(hr ft2 degF) and tau from 3.588690771912 hr to 4.5276225695 hr. The start temperature, the target and the ambient move the log term instead, and the two are independent.

## The careful mistake

Quoting tau as the cooldown time. It is 3.588690771912 hr on the published case and the answer to the question actually asked is 4.662724855250 hr, because the log term is 1.299282984130 rather than one. They coincide only when the excess has to fall by exactly a factor of e, which no laboratory boundary is going to arrange for you.

## Exercise

Compute tau for the published cooldown from its M Cp of 7.606369304989 and its U A of 2.119538792399.

Then say what the answer would be for a line of the same construction that is twice as long, and why.
