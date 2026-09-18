# The planting battery, and what a green suite means

A golden file and a green suite are not the same thing as a validated engine. The only way to know what a gate can catch is to break the engine on purpose and watch.

## The battery

The suite this course is built beside carries 79 tests, counted off the vendored file. Beside it sits a battery of deliberately planted defects, each one introduced alone, the suite run against it, and the result recorded.

Thirty five defects, twenty seven of them planted in the engine alone and eight planted in the engine and the oracle together, were run one at a time. Twenty four more were added, with one self-test of the runner itself, and none of the sixty leaves the suite green.

Read the arrangement rather than the total. A battery run one defect at a time measures the suite's ability to catch each defect separately, which is what you want to know. A battery of many defects at once measures nothing useful, because one catch hides all the rest.

## The eight that are the interesting half

Planting a defect in the engine and the oracle at the same time is the hard case, because a golden regenerated from a bent oracle agrees with a bent engine perfectly. Every comparison in the file lines up, and the suite has nothing to complain about.

What catches those now is a mixture of three things: a route with no place to type the constant, the identities that need no source, and an explicit PIN with the value typed by hand in the test file. Notice that none of those three is a comparison between the engine and its golden. They are the checks that step outside the pair.

## Negative controls

Every family in the suite also carries a NEGATIVE CONTROL that is asserted to fire and to name a case. That is the answer to the oldest failure mode in testing, which is a suite that examines nothing and reports it as a pass.

One control records a fact about its own subject rather than a round number. The cyclone control fails on four of five rows and not five, because a turndown of exactly one is the one case a wrong field exponent cannot move. A control asserted to fail on all five would have been quietly wrong about the physics, and the honest number is the one that matches what the exponent can actually reach.

## What green means

A green suite is a measurement of the suite until somebody plants a defect and watches. After the watching, and only then, green means something specific: these particular defects, introduced this way, would each have been caught.

That is a much smaller claim than validated, and it is a claim you can actually defend.

## Exercise

Choose one number this module computes and write down the smallest change to it that you believe the suite would miss.

Then work out which existing check would catch it, and if you cannot find one, describe the case you would add.
