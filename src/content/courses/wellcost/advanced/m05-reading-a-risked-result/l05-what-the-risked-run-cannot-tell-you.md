# What the risked run cannot tell you

A Monte Carlo result is confident by construction. Confidence is not the same as accuracy, and the run has no way of telling the difference.

## The one thing it never checks

A sampled run answers exactly one question. Given these distributions, this correlation structure and this engine, what does the spread of outcomes look like.

It does not ask whether the distributions were right. Nothing in the calculation ever compares an assumed range against anything real, so a badly chosen range produces a beautifully converged answer to the wrong question.

Put a triangular from 10 to 22 m/hr on a section that will actually deliver 6, and the run reports percentiles to the dollar, all of them wrong, with no warning of any kind. Garbage ranges give a confident wrong answer, and the confidence is the dangerous part.

## The spread is only as honest as the inputs

Three habits narrow a distribution without anybody intending to.

Ranges get drawn from the plan rather than from outcomes. If the minimum and the maximum both come from what the team hopes, the spread describes the hope.

Correlation gets left out. Independent draws let a bad intermediate section sit beside a good production section, cancelling in a way real bad days do not. Dropping correlation leaves every mean untouched and quietly shrinks the tails.

Only the modelled quantities vary. The engine stretches every activity by one NPT fraction, so non-productive time enters as a smooth allowance. A stuck pipe event, a well control incident, a rig going off contract: none of these are sampled variables, and the run cannot invent them.

## Numbers that describe the assumption, not the world

The linear fixture reports a standard deviation of 63868.354187866 USD on a mean of 1,530,000, a coefficient of variation of 0.041744022345010456.

That is a property of four triangular distributions somebody chose, not a measurement of how variable a well is. Narrow the ranges and the coefficient shrinks while nothing about the well has changed. Treat every spread figure that way.

## What to do instead

Test the ranges against something outside the model: offset wells, the last campaign in the field, the rates this crew actually delivered. Where you have nothing, say so beside the number rather than letting the decimal places imply otherwise.

Then run it with the ranges you would defend and again with the ranges you fear. If the decision holds, the uncertainty was never the issue. If it flips, you have found the assumption that deserves the argument.

## Exercise

Take one uncertainty in the golden case and write down where its minimum, mode and maximum would have to come from for you to defend them.

Then list two cost events that could occur on this well and are nowhere in the sampled variables.
