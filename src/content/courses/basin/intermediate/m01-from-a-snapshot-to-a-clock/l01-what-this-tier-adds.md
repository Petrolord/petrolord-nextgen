# What this tier adds

The Associate tier left you with a deliberately incomplete machine. You can build a burial history that conserves grain, and you can solve a heat column that is exactly $T = T_s + Qz/k$ layer by layer. Both of those are snapshots. The final lesson of that tier told you plainly what was missing: there is no clock anywhere in the pipeline, and without a clock there is no maturity.

This tier adds the clock. Everything in it is one idea worked thoroughly: turning kerogen into hydrocarbon is a chemical reaction, a reaction has a rate, the rate depends on temperature, and the amount of reaction is the rate collected over time. The machinery that does the collecting is a pair of kinetic integrators, and by the end of the tier you will have run both of them on the golden fixtures and reproduced every graded value from first principles.

## The two questions this tier answers

The first question is: how mature is this rock? The answer is a vitrinite reflectance, written Ro and measured in percent. The Professional capstone grades your Ro at zero reaction, at full reaction, and at 150 degC reached along two different heating ramps. The scheme that produces it is Easy%Ro, published by Sweeney and Burnham in 1990, and the tier teaches it bin by bin rather than as a black box.

The second question is: how much of the kerogen has reacted? The answer is a transformation ratio, written TR, a fraction between 0 and 1. The capstone grades your TR for a Type II kerogen held at 100 degC for 10 and for 50 million years. TR is the quantity that later becomes a mass of hydrocarbon, and the tier above this one does exactly that with it.

Those two questions sound alike and are computed alike, but they are answered by two different bookkeeping states, and keeping them separate is one of the tier's deliberate lessons. Reflectance is a property of vitrinite, a specific organic component with published kinetics that nobody edits. Transformation is a property of the kerogen type in your source rock, with parameters that come from a library and can legitimately differ from basin to basin.

## Where the numbers come from

The fixtures are the same golden family the Associate tier used, extended one stage up the pipeline. There is a set of heating ramps, from 20 to 200 degC at 1, 3 and 10 degC per Ma, with the reflectance tabulated at every whole degree. There is an isothermal fixture, a Type II kerogen held at a constant 100 degC. Behind them sits the same independent Python oracle, agreeing with the engine to around 1e-9, and the same rule follows from that agreement: if your answer is outside tolerance, the cause is your arithmetic and never the fixture.

The Associate tier forward-quoted one result from this tier, and you should recognise it when it arrives in module 3. Compared at the same 150 degC, a rock heated at 1 degC per Ma is more mature than a rock heated at 3 degC per Ma, because it took three times as long to get there. That tier could only assert it. This tier computes both numbers, and the gap between them, 1.1129254516555198 against 0.9871413464062039, is a pair of graded values on your capstone.

## What this tier does not do

The boundary above is as sharp as the one below. Nothing in this tier produces a mass. A transformation ratio of 0.05 says that five percent of the kerogen's potential has reacted, and stops there. Turning that fraction into kilograms of hydrocarbon per square metre needs the source rock's richness and thickness, and deciding how much of that mass ever left the rock needs an expulsion rule. Both belong to the Expert tier, which runs the full reference basin forward through 150 million years of history.

There is also no burial history here. Every fixture in this tier hands you the temperature track directly, either as a ramp or as a constant, so that the kinetics can be studied in isolation. The Expert tier is where the track itself comes out of a model. That separation is the same teaching decision the Associate tier made with its steady column: learn each stage where it can be checked by hand, then chain them.

## How the modules run

Module 1 sets up the machinery: the two states, the Arrhenius rate, and the panel you will use throughout. Module 2 works through Easy%Ro itself: the twenty bins, the weights, the map from reacted fraction to reflectance, and the two closed-form endpoints that anchor everything. Module 3 puts the scheme on the heating ramps and delivers the capstone's ramp values. Module 4 switches to the kerogen clock and the isothermal fixture. Module 5 steps back and asks what a maturity does and does not tell you. Module 6 is the workflow: end to end, quality control, the capstone walkthrough, and the hand-off upward.

## Exercise

Write down the two graded questions of this tier in your own words, and beside each one the name of the state that answers it. Then write one sentence on why the tier hands you temperature tracks instead of computing them.

As a self check: the tier answers how mature the rock is, using the vitrinite state and Easy%Ro to produce a reflectance, and how much of the kerogen has reacted, using the kerogen-type state to produce a transformation ratio. Temperature tracks are given, not computed, so that every kinetic result can be checked against a fixture without a burial model standing between you and the answer.
