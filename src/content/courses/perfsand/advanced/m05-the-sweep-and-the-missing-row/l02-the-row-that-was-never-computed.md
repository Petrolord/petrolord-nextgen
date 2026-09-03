# The row that was never computed

A real defect, found while writing this course, in the sweep this module teaches.

{{panel:ps-sand-explorer}}

## What it did

The sweep walked from the top of the interval in whole steps, with a loop that continued while the depth was at or above the bottom.

If the step divided the interval evenly, the last whole step landed exactly on the bottom and everything was fine. If it did not, the loop exited one step before the bottom and the deepest part of the interval was never evaluated.

An interval from two thousand four hundred and fifty to two thousand five hundred and fifty metres, at a thirty metre step, produced rows at 2450, 2480, 2510 and 2540. The bottom ten metres were not screened.

## The code that was supposed to prevent it

Two lines. The station depth was clamped to the interval bottom, and the loop broke as soon as the clamped depth reached it. Both were written precisely to catch the ragged last step.

Neither could ever run, because the loop condition exited first. They were dead in every case except the one where the step divided evenly, and in that case they were unnecessary.

## Why it matters

Because an interval is screened for sanding when its base is suspect, and the base of a perforated interval is very often the weakest rock in it.

On a profile whose strength tapers towards the base, the truncated sweep reports a governing margin of about plus zero point six five megapascals at 2540 metres. The true governing row, at the interval bottom, is about minus one point two five.

The sign flips. The screening says there is drawdown available on an interval whose base fails at any drawdown at all.

## Where a user meets it

The Suite's Perforation and Sand Control Designer exposes the step as a free numeric field on its Sanding tab. Any step that does not divide the interval hits this, and there is nothing in the output that says the sweep stopped early.

## The fix

Let the clamp and the break terminate the loop, which is what they were written to do. The step size is validated positive above, so the loop terminates.

## Exercise

State the defect in one sentence and say which step sizes trigger it.

Explain why the two lines intended to prevent it could never run.

Then say why the base of an interval is the worst place to drop a row, and quantify what it did on the weakened profile.
