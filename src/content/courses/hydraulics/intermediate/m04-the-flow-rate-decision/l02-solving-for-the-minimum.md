# Solving for the minimum

The inverse problem, and how the engine does it.

{{panel:hy-cleaning-explorer}}

## The question

Not "what transport ratio does this flow rate give" but "what flow rate gives this transport ratio".

That is the question a drilling engineer actually asks, and it is the inverse of what the model computes directly.

## The method

Bisection, over the flow rate, on the transport ratio.

    if the ratio at the maximum rate is still below target, return null
    otherwise bisect 60 times between a tiny rate and the maximum

Sixty halvings from a bracket of 0.2 m3/s takes the interval below 2e-19 m3/s, which is far beyond any precision the answer means.

## Why bisection works here

Because the transport ratio is monotone in the flow rate: more flow always cleans better, on this model, with no exceptions.

Monotone is the only property bisection needs, and the transport ratio has it by construction.

## The answers

Slant well, kcl_polymer:

| target transport ratio | flow rate needed |
|---|---|
| 0.5 | 0.006503185020103212 m3/s |
| 0.9 | 0.04677230885801645 m3/s |
| 0.95 | 0.10157350580465507 m3/s |

Slant well, light_wbm:

| target | flow rate needed |
|---|---|
| 0.5 | 0.009734653319842667 m3/s |
| 0.9 | 0.06520377325712001 m3/s |
| 0.95 | 0.14135478340656146 m3/s |

## Read the last row of each

To go from a transport ratio of 0.9 to 0.95, the flow rate has to more than double.

That is the diminishing return in its starkest form: the last five percentage points of transport cost more than the first ninety.

## And the mud comparison

The light mud needs 40 to 50 percent more flow rate to reach the same transport ratio, at every target.

That is a very large penalty, and it is why mud rheology is a hole cleaning decision rather than only a pressure one.

## When it returns nothing

If the target cannot be reached at any rate up to the search maximum, the function returns null rather than a number.

That is a real outcome. A target transport ratio of 0.99 on a wide annulus may simply not be achievable, and returning null is more honest than returning the maximum rate.

## Exercise

From the two tables, compute the ratio of the light mud's required flow rate to the heavy mud's at each of the three targets.

Say whether the penalty is constant across targets, and what that implies about whether the mud change can be described by a single number.
