# Why a matrix

The Associate tier ended on one fact: a field-level voidage ledger is blind to geometry. This tier fixes that, and the fix begins with an object that is not a measurement. An allocation matrix is a set of numbers somebody decided. Understanding what kind of object it is comes before using it.

## The question it answers

An injector puts water into the reservoir. That water goes somewhere. Some of it supports one producer, some supports another, and some leaves the pattern entirely, into a different fault block or down out of zone or into a part of the sand nobody is producing.

An allocation matrix records that split as fractions:

$$\text{allocation}[\text{injector}][\text{producer}] = \text{fraction}$$

with each injector's row summing to at most one. What is left over is the fraction that goes nowhere useful.

## Where the fractions come from

Three methods, in increasing order of cost and confidence.

**Geometric.** Weight by distance, or by the angle each producer subtends, or by drawing a pattern on a map and counting. Cheap, transparent, and available on day one before any dynamic data exists. It uses only well locations, which are the best-known numbers in the whole field.

**Streamline.** Run a flow simulation and count the streamlines that leave each injector and arrive at each producer. Uses the geological model and the actual rates, so it responds to permeability trends and to well shut-ins. Costs a simulation model, and is only as good as the model.

**Capacitance resistance modelling.** Fit a linear dynamic model of producer rates as a response to injector rates, and read the connectivity coefficients out of the fit. Uses only rate data, which is the great attraction: no geological model required. It needs long records with genuine rate variation to identify the coefficients, and it is fragile when injectors move together.

That last caveat matters for Ekene and module 5 will make it exact.

## What kind of object this is

It is a hypothesis. Every allocation matrix is a claim about subsurface connectivity that could be wrong, and the analyses built on it inherit that uncertainty entirely.

That has a practical consequence. Any conclusion that depends on the allocation should be stated with the allocation attached: "on the current allocation, the North element is over-injected" rather than "the North element is over-injected". If someone disagrees with your conclusion, the first question is whether they disagree with your analysis or with your matrix, and those need different conversations.

It also means the sensitivity of a conclusion to the matrix is worth testing. If moving a fraction from 0.45 to 0.40 flips your recommendation, you do not have a recommendation; you have a restatement of your assumption.

## Why not just measure it

Because you cannot, at reasonable cost. Tracers come closest: inject a chemical or radioactive tag into one injector and watch which producers return it. That gives real connectivity information and it is the strongest evidence available. It also takes months to years for a return, costs real money, gives you arrival rather than volume fractions, and tells you about the path the tracer took rather than the path the bulk of the water takes.

So allocation matrices persist as judgement informed by evidence, and the honest framing is that they are the best available answer rather than the right one.

## What the engine does with it

Three things, and it is worth noting what it refuses to do.

It **validates** the matrix: rows summing above one are errors, negative fractions are errors, rows summing below one produce a warning naming the shortfall.

It **allocates** injected volumes, producing a per-producer total and an out-of-zone remainder that together conserve the input exactly.

It **builds pattern periods**, summing production over a pattern's producers and injection over the allocation-weighted share of every injector.

What it refuses to do is invent a matrix. A pattern with no allocation routed to it gets no analysis at all, and the returned object says so with a reason. Not an even split, not a distance-weighted guess. Nothing, with an explanation. Lesson 5 is about why that refusal is the right design.

## The misconception to avoid

"The allocation matrix is a detail; the physics is in the voidage calculation." The voidage calculation at pattern level is arithmetically identical to the one you already know. All of the new information, and all of the new uncertainty, is in the matrix. It is not a detail; it is the entire content of the analysis.

## Exercise

First, for each of the three allocation methods above, name one field situation in which it would be clearly the wrong choice, and say what you would use instead.

Second, an injector's row reads 0.5, 0.3, and 0.1 across three producers. State what the remaining 0.1 represents physically, and list two distinct subsurface explanations for it.
