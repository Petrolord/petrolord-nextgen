# The clamp to zero

The engine will not hand you a negative pressure to work with, and it will not pretend the negative did not happen either.

{{panel:wi-annulus-explorer}}

## What the code does

Two lines at the end of the row builder decide this. The reported MAASP is the larger of zero and the governing row's allowable. The negative flag is true when the governing row's allowable is below zero.

So the case from the last lesson, whose governing row came back at -104271.45154356956 Pa, is reported as a MAASP of 0 Pa with the flag set.

Notice which row the flag is asked about. It is the governing row, the minimum over all rows, and not any row that happens to be negative. That follows from module 2. If the smallest allowable is above zero then every element has room, and if the smallest is below zero then the annulus has none, whatever the other rows say.

## Why not just report the negative

Because a MAASP is consumed as an operating limit. It goes onto a chart, into a permit, into an alarm setpoint. Everything downstream of it treats it as the answer to "how much can I put on this annulus".

Feed a negative number into that chain and it does not read as a warning. The likely thing a reader or a piece of software does with it is take its magnitude, or treat it as a rounding artefact near zero, or drop the sign. Each of those recovers a positive allowance from a well that has none. That is why reporting the negative as if it were a pressure would be worse than useless. It is not merely uninformative, it is available for misreading in exactly the unsafe direction.

Zero is the honest operating limit. It is also true. There is no surface pressure this annulus can carry.

## Why the raw number survives

The clamp applies to the headline value only. Each row keeps its own allowable exactly as computed, sign and all, and the flag tells you to go and look.

That split is deliberate. The operating number is safe to act on, and the diagnostic number is still there for the engineer who needs to know whether the row missed by 104271.45154356956 Pa or by several MPa. One of those is a fluid change. The other is not.

## Exercise

Produce the clamped case in the panel and record three things: the reported MAASP, the flag, and the governing row's raw allowable.

Change the far side density so the row clears zero by a small margin, and watch the flag drop while the reported value starts tracking the row again.

Then write down one downstream use of MAASP in your own operation, and say what it would have done with a negative.
