# The workflow end to end

The pieces are all built. This module assembles them into the sequence you will run on the capstone and, with different inputs, on any kinetics question a basin hands you. This lesson is the sequence itself, stated once at full length.

## Step one: fix the question and the clock

Every kinetics question is answered by one of the two clocks, and naming the right one is the first act. How mature is the rock, or what will calibrate against measured reflectance: the vitrinite clock. How much of the potential has converted, or anything that will become a mass: the kerogen clock. If the question needs both, run both; they share the history and nothing else.

Writing the choice down matters because the clocks' parameter policies differ. Choosing the vitrinite clock commits you to the published constants exactly. Choosing the kerogen clock obliges you to state whose spectrum you are integrating, library type or measured data, since module 4 priced that choice at up to two orders of magnitude.

## Step two: fix the temperature history

The kinetics consume a temperature track. In this tier the track is given, a ramp or a constant; above this tier it comes from a burial history and a transient heat model, and module 5 priced what its errors do. Either way, the track must be explicit: start temperature, end temperature, and pace. For a ramp, the pace is the heating rate in degC per Ma, and if the rate is uncertain, bracket it, because module 3 showed the bracket propagates to about 13 degrees per factor of 3 on every boundary.

## Step three: integrate with the convention

Run the integrator with the fixture conventions: 0.01 Ma sub-steps at midpoint temperature on ramps, whole-Ma steps when temperature is constant, seconds and kelvin inside the exponent, one Ma at 3.1536e13 seconds. The conventions are not decoration; lesson 4 of module 5 diagnosed a 7 percent error to a wrong step rule alone.

## Step four: read out

From the vitrinite state, F, then $R_o = e^{-1.6+3.7F}$. From the kerogen state, TR as the reacted fraction of the initial potential sum. Quote reflectances with their heating assumption attached, and transformation ratios with their spectrum named. Both read-outs are single numbers, and both lessons in module 5 about what single numbers forget apply.

## Step five: check

Run the sanity list before the answer leaves your desk: anchors, monotone range, a rate landmark, a fixture crossing if the machinery is new, and the separation test if the software is. The list is five minutes; every failure mode it catches has cost someone more.

## The workflow on the capstone

The capstone is this sequence six times. The two anchors are step four with F fixed at its endpoints, no integration needed. The two ramp values are steps two through four with the golden rates 3 and 1 and a read at 150 degC. The two TR values are the kerogen clock at a constant 100 degC, read at 10 and 50 Ma, Type II spectrum. Nothing on it requires a decision this lesson has not named.

## Worked example

Phrase a field task as the workflow. Task: "estimate whether the Miocene source at 3.5 km is generating, given a present gradient of 28 degC per km and rapid recent subsidence of about 8 degC per Ma at the source." Step one: the question is generation, so the kerogen clock, and the interval is marine, Type II library spectrum, stated. Step two: track from the subsidence history, roughly a ramp at 8 degC per Ma reaching 113 degC today, bracketed 5 to 10. Step three: integrate with conventions. Step four: TR at today's end point, with the bracket carried. Step five: anchors and a crossing check. The deliverable sentence would read: Type II library kinetics on an 8 degC per Ma ramp to 113 degC give early conversion, of order a few percent, bracket such-and-such from the rate uncertainty.

## Exercise

Write the five steps from memory in one line each, and mark which steps the capstone's anchor values skip. Then answer in one sentence: why does step one precede fixing the temperature history?

As a self check: name the clock, fix the track, integrate by convention, read out with assumptions attached, run the checks; the anchors skip steps two and three because their F values are endpoints known without integration. The clock comes first because it decides what parameters the rest of the workflow is obliged to hold fixed and what it is obliged to state, and a history is only worth fixing once you know which state will consume it.
