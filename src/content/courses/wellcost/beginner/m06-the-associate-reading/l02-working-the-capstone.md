# Working the capstone

A method, in four steps, that turns any activity list into a schedule you can defend.

{{panel:wc-time-explorer}}

## Step one: classify every activity

Read the programme once and label each line with one of the four kinds. Nothing else matters yet.

The label follows what the line is given, not what it is called. A from depth, a to depth and a rate is a drill activity. One depth and a speed is a trip. One depth, a speed and a flat term is a casing run. A duration and nothing else is flat.

If a line fits none of the four, do not force it. Carry it as a flat activity with a stated duration, or inside the allowance.

## Step two: apply the right closed form

Each kind has exactly one formula, and each returns productive hours.

| Kind | Productive hours |
| --- | --- |
| drill | interval divided by rate |
| trip | twice the depth divided by speed |
| casing | depth divided by run speed, plus the flat term |
| flat | the stated duration |

Two errors are worth naming. Forgetting the factor of two on a trip halves it. Forgetting the flat term on a casing run can lose most of the activity, because at typical running speeds the flat term is the larger part.

Sum them for the programme's productive hours.

## Step three: apply the allowance as a stretch

Multiply by one plus the fraction. Not by one over one minus the fraction, and not by anything else.

The fraction is a proportion of productive time, so it adds that proportion on top. The non-productive share of the elapsed clock is therefore always smaller than the fraction you entered, and equals the fraction divided by one plus the fraction.

If you are handed an allowance expressed as a share of elapsed time, convert it first: divide that share by one minus itself.

## Step four: roll up

Divide elapsed hours by 24 for days. Add the intervals of the drill activities only for drilled metres. Carry both as decimals.

## The two checks

**Productive hours must not move when the allowance changes.** Compute the schedule at your allowance, then at zero, then at double. If the productive total is not identical in all three, you have applied the stretch to the wrong quantity.

**The non-productive share of elapsed must come out below the allowance fraction.** Strictly below, never equal. If it equals the fraction you entered, you have divided the non-productive hours by the productive hours instead of by the elapsed hours.

Both checks take seconds and both catch the same misunderstanding from opposite directions.

## Exercise

Take a programme in the panel, classify its activities, and compute the productive hours by hand from the four forms before reading them.

Apply the allowance by hand and run both checks on your own arithmetic.

Then compare with the panel. Any disagreement is in a classification or in the stretch, and it is worth finding before it becomes a day count somebody quotes.
