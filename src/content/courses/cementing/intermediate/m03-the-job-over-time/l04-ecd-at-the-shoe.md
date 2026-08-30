# ECD at the shoe

The second circulating density, and on one of these wells it is enormous.

{{panel:cm-placement-explorer}}

## The definition

    ECD at the shoe = (whole annulus head + whole annulus friction) / (g x TVD of the casing shoe)

The whole annulus this time, not the part above the previous shoe, and divided by the deeper true vertical depth.

## The two wells could not be more different

| well | ECD at the shoe, start | ECD at the shoe, end |
|---|---|---|
| slant | 1646.773401667299 | 1985.3321268859695 |
| horizontal | 1837.9218199066345 | 2093.523359620153 |

The horizontal well starts nearly 200 kg/m3 higher and finishes over 100 higher, on the SAME fluids at the SAME rate.

## Why

Look at the denominator. The slant well's shoe is at 2507.9196993011733 m of true vertical depth and the horizontal well's at 1214.859173174059.

Both wells have the same annular LENGTH, so both have essentially the same annular FRICTION. But the horizontal well divides that friction by less than half the vertical depth.

Friction converted to an equivalent density is friction divided by g times TVD. On a well with a long lateral, the friction is generated over the lateral and the TVD is not.

## The general result

**Equivalent circulating density is a bad unit on a horizontal well.** It divides a quantity generated along the hole by a quantity measured vertically, and the two stop being proportional the moment the hole turns.

That is worth carrying, because ECD is quoted everywhere and the intuition attached to it comes from vertical wells.

## Which of the two matters

The one at the PREVIOUS shoe, almost always, because that is where the exposed formation is weakest.

The one at the casing shoe is a diagnostic rather than a limit: the formation at the casing shoe is about to be cased off, and if it fractures during the cement job the cement goes into it, which is a lost-returns problem rather than an underground blowout.

## Why the engine reports both

Because a reader who sees only the shoe value on a horizontal well will conclude the job is impossible, and a reader who sees only the previous-shoe value on a vertical well is missing nothing.

Reporting both, with their depths, lets the reader choose the comparison.

## The null case

If there is no cased section above the casing shoe, there is no previous shoe and `ecdPrevShoeKgM3` is null for the whole run, along with `maxEcdPrevShoeKgM3`. That is a conductor or surface string, and there is no shallower shoe to protect.

## Exercise

Compute the horizontal well's ECD at the shoe at the start of the job from a head plus friction you work out yourself, given that the answer is 1837.9218199066345 kg/m3 and the true vertical depth is 1214.859173174059 m.

Then say how much of that number would remain if the well were vertical to the same measured depth.
