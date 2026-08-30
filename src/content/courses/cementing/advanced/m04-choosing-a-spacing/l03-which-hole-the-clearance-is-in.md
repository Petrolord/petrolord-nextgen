# Which hole the clearance is in

The volume side and the standoff side use different diameters for the same hole.

{{panel:cm-standoff-explorer}}

## The two calls

The volume calculation:

    annulusRows({ holeSections, casing, excessOpenHolePct })

The standoff calculation:

    annulusRows({ holeSections, casing, excessOpenHolePct: 0 })

The second one passes zero, explicitly, in the function body. The standoff never sees the excess.

## What that means on this well

| | bore | clearance |
|---|---|---|
| volume side, 15 percent excess | 0.22104932820526735 | 0.021624664102633667 |
| standoff side, nominal | 0.2159 | 0.019049999999999997 |

Two and a half millimetres of difference on a nineteen millimetre clearance, which is thirteen percent.

## Is passing zero right

There is a real argument for it, and a real argument against.

**For.** A centralizer is sized to the BIT, because that is what you know when you order it. And a bow spring's restoring force is quoted at a stated standoff in a stated hole size, which is also the nominal one. Computing the spring rate against a washed-out clearance would be applying the manufacturer's number outside the geometry it was quoted in.

**Against.** The pipe is in the hole the hole actually is. If the hole washed out to 0.221 m, the pipe can move further off centre than the nominal calculation allows, and the true standoff is worse than reported.

## Which way the error goes

Optimistic. A washed-out hole has more room for the pipe to move, so the real standoff is LOWER than the nominal calculation reports.

Run the horizontal well's numbers at the washed-out clearance and the sag, which is a fixed length in metres, becomes a smaller FRACTION of a larger clearance, which helps; but the deflection at the centralizer becomes larger, because the spring rate falls with the clearance, and that hurts more.

## And it is worse for a rigid centralizer

Much worse. A rigid blade's standoff is a pure ratio of diameters, so a bigger hole reduces it directly and there is no spring to take up the slack.

The 0.206 m blade that gives 0.7401574803149601 at the nominal bore gives 0.6520332493064135 at the washed-out one. Nine points, straight off.

## What to do about it

Notice it. The engine's choice is defensible and it is not documented in the function signature, so a reader who assumes the excess flows through everything will be wrong.

And if the hole is known to be badly washed out, run the standoff at a larger nominal bore deliberately, rather than trusting the excess to do it.

## The general habit

Any engine with an uncertainty factor in it has a decision about which calculations the factor flows into, and the decision is rarely written down. Finding out is worth the ten minutes.

## Exercise

Compute the clearance at 30 percent excess on this well's open hole, given an effective bore of 0.22608140348113553 m.

Then compute the spring rate a 8900 N centralizer would have in that clearance, and compare it against the nominal 1415732.124393542 N per metre.
