# Spacing against force

Two ways to spend money on centralization, and one of them is much better.

{{panel:cm-standoff-explorer}}

## The two levers

**More centralizers.** Reduce the spacing. Costs one device per position plus the running risk of more drag.

**Better centralizers.** A higher restoring force at the same spacing. Costs more per device and no extra positions.

## What each buys on the horizontal well

Starting at 12 m with an 8900 N bow spring, minimum standoff 0.599178961025609.

**Force sweep at 12 m:**

| restoring force (N) | minimum standoff |
|---|---|
| 4450 | 0.445400446 |
| 6675 | 0.547919456 |
| 8900 | 0.599178961 |
| 13350 | 0.650438466 |
| 17800 | 0.676068219 |
| 26700 | 0.701697971 |

**Spacing sweep at 8900 N:**

| spacing (m) | minimum standoff |
|---|---|
| 12 | 0.599178961 |
| 10 | 0.752714218 |
| 9 | 0.806500315 |
| 8 | 0.848682467 |
| 6 | 0.907670585 |

## The comparison

TRIPLING the restoring force, from 8900 to 26700, buys 10.3 points and only just reaches the API target.

Going from 12 m to 10 m, which is one extra centralizer every five, buys 15.4 points and clears the target comfortably.

Going to 9 m buys 20.7.

## Why

Because the force lever only acts on the centralizer deflection term, and that term is not what binds. The sag is untouched by the spring, at any force, for ever.

The spacing lever acts on BOTH terms, and it acts on the sag as a fourth power.

## The diminishing return on force

Look at the force column again. 4450 to 8900 buys 15.4 points. 8900 to 17800 buys 7.7. 17800 to 26700 buys 2.6.

The centralizer deflection is being driven toward zero and the sag is what remains. Past about 18000 N the whole standoff is sag and the spring has stopped mattering.

There is a ceiling, and it is the sag-only standoff:

    1 - sag / clearance = 1 - 0.004706160075469288 / 0.019049999999999997 = 0.7529574763533182

No bow spring at 12 m spacing on this well can ever exceed 0.7529574763533182, whatever it costs.

## The rule

Compute the sag-only ceiling first. If it is below your target, no centralizer will do and the spacing has to come down. If it is above, then and only then is the choice of device worth having.

On the horizontal well at 12 m the ceiling is 0.7529574763533182, which is above 0.67, so a strong enough centralizer would work: 26700 N gets to 0.7017. It is just an expensive way to get there.

## Exercise

Compute the sag-only ceiling at 15 m spacing on the horizontal well, given that the sag scales as the fourth power of the spacing.

Then say whether any centralizer at all could reach the API target at that spacing.
