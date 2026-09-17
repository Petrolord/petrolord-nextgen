# A verdict over checks that did not run is not a verdict

A pass verdict is a claim about everything that was checked. If one of the checks never ran, a pass is a claim about work that was not done, and this engine declines to make it.

## What it withholds and how often

The engine withheld its pass verdict on 2 of the travel cases, counted over the 5 cases asked of the travel check, with a case counting when the engine returns a pass of null, which it does whenever a check could not run.

The two cases are the ones with a missing flow. Both carry 0 warnings, which is worth noticing on its own. A warning is a finding, and there is no finding here. What there is instead is an accounting statement about coverage, carried in the verdict rather than in the warning list.

## The two messages

Where no minimum flow was given:

> `no verdict: 2 of the 3 checks ran. Not run: the near-seat rangeability check: no minimum flow was given, so whether the valve can control at turndown is not known`

Where no maximum flow was given:

> `no verdict: 2 of the 3 checks ran. Not run: the maximum flow case: no maximum flow was given, so whether the valve can pass its design case is not known`

Both messages do the same three things. They give the coverage as a count of checks that ran out of checks there are. They name the check that did not run. And they say what is therefore unknown, in terms of the engineering question rather than in terms of the software.

## Why this matters more than it looks

Consider what the alternative would have produced. The two checks that did run were clean on both cases. A tool that reported a verdict over the checks it happened to run would have returned a pass on both, and a pass on a valve whose turndown behaviour has not been examined is worse than no answer at all, because it closes the item.

This is the same principle the whole course rests on. An answer that is refused by name leaves a reader with something to do. An answer that is quietly produced from incomplete work leaves them with nothing to do and no reason to look again.

## Exercise

Write down how many of the 5 travel cases the engine withheld its pass verdict on, and the rule by which a case counts. Then take the case with no minimum flow given and write down how many checks ran, which check did not, and what the engine says is therefore unknown. Say why a pass over the two checks that did run would have been the more dangerous answer.
