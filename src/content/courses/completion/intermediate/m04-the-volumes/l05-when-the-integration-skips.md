# When the integration skips

The one place in this course where the engine returns a number and a warning rather than a refusal.

{{panel:cd-clearance-explorer}}

## The situation

The volume integration walks the depth range and, at each interval, needs a casing bore. If the profile does not cover an interval, there is no bore to use.

The engine skips that interval and adds a warning naming the depths it skipped.

## Why not refuse

Because a partial volume with a named hole is useful and a partial one presented as complete is not, and those are the two options.

Refusing outright would deny the reader the ninety percent of the well that is described. Guessing a bore would produce a complete looking number that is wrong by an unknown amount. Skipping and naming gives a number that is definitely low, by an amount the reader can bound from the named interval.

## Why the clearance check refuses instead

The clearance check, faced with the same gap, returns nothing rather than a verdict. The two behaviours are different on purpose.

A volume is additive: leaving out an interval leaves out its contribution and the rest is still correct. A verdict is not additive: a pass over the intervals we know about is not a partial pass, it is a wrong answer, because the missing interval could contain the restriction that fails.

So the same missing data is recoverable for one calculation and fatal for the other.

## Reading the warning

The warning names the depth interval. That is enough to go back to the casing program and find what is missing, which is nearly always a section that was not entered rather than a well with a genuinely uncased interval.

If the warning list is empty, the profile covered everything, and the volume is complete. Checking that the list is empty is a one line habit worth having.

## What it does not warn about

It does not warn if the profile covers everything but the program is wrong. A complete casing program with a typo in a bore produces a complete profile, no warnings and a wrong volume.

Warnings catch missing data. They do not catch incorrect data, and nothing here does.

## Exercise

Explain why a volume can be reported with a gap and a clearance verdict cannot.

Then say what the warning tells you and what you would do with it.

Finally, describe an error in a casing program that would produce no warning and a wrong answer, and say how you would catch it.
