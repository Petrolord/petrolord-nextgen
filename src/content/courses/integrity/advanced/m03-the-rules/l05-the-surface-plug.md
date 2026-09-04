# The surface plug

One length check, no source, and a foundation that buys nothing.

{{panel:wi-pa-explorer}}

## A different rule set

Set `isSurfacePlug` on a plug and `plugRuleCheck` behaves differently in two ways at once.

The required length becomes `surfacePlugMinLengthM`, which defaults to **50 m MD**. And the source checks are skipped entirely. The engine returns one check, the length check, and nothing else. Pass a source top in alongside the flag and it is ignored, because the flag is tested first.

## Why there is no source

Because a surface plug is not isolating an inflow. By the time you set it, every zone with flow potential should already have its own pair of permanent barriers deeper in the well, each covering its own source and each extending above it.

The surface plug is doing a different job. It closes the top of the wellbore itself, so that the bore is not a conduit and the site can be left. It is the last thing in the phased programme, set after the casing cutting phase and before the wellhead comes off. In the published programme the surface plug is step 5 of 6.

Asking whether a surface plug covers a source at 2500 m MD would be asking the wrong question of the wrong barrier.

## The foundation does nothing here

Look at the order of the choice in the engine. The surface plug branch is taken first, and only if the plug is not a surface plug does the foundation matter. So a surface plug set on a bridge plug still needs 50 m MD, the same as one set on a cement base or on nothing.

It happens that the surface figure and the foundation figure are both 50 m by default, which hides the point. Override one of them and the two columns separate. This is worth knowing before you override anything.

## The published case

S1 surface plug runs 0 to 60 m MD, a length of 60 m against a requirement of 50 m. One check, passing.

Note the top at 0 m MD. A surface plug is written from surface down, and the regulatory question of how deep the casings are then cut below surface or mudline is handled by the programme step, not by this rule.

## Exercise

1. Build a 45 m surface plug and read the single check it returns.
2. Give that plug a mechanical foundation and confirm the requirement does not move.
3. Override `surfacePlugMinLengthM` to the figure your own regulator uses and re-run both.
