# Cuttings concentration

How much rock is in the annulus right now.

{{panel:hy-cleaning-explorer}}

## The expression

At steady state, the cuttings are being fed in at the bit and carried out at the top. The concentration is the feed rate divided by the rate at which the annulus is carrying material:

    concentration = feed rate / (annular area x cuttings velocity)

with the cuttings velocity being the annular velocity times the transport ratio.

## The feed

    feed = ROP x (pi/4) x bit diameter^2

At the engine's default rate of penetration of 0.005 m/s, which is 18 m per hour, and the deepest hole size, the feed is 0.0001830480768239711 m3/s.

That is 0.18 litres of rock per second, against a mud rate of 25 litres per second. Under one percent by volume before any slip is considered.

## The numbers

Slant well, kcl_polymer:

| flow rate | worst cuttings concentration |
|---|---|
| 0.015 m3/s | 1.6526398414724626 percent |
| 0.025 m3/s | 0.8837762314894323 percent |
| 0.035 m3/s | 0.6002533054348534 percent |

## The threshold

A common rule is that concentrations above about 4 or 5 percent by volume are a problem: the annulus starts to behave differently, the equivalent circulating density rises, and the risk of packing off around the assembly grows.

None of the cases here reaches that. At the lowest rate the slant well is at 1.65 percent, which is elevated and not alarming.

## Why it falls faster than the transport ratio rises

Because the concentration has the annular velocity in the denominator TWICE: once directly, and once through the transport ratio.

So doubling the flow rate more than halves the concentration, which is why raising the rate is such an effective response to a dirty hole.

## Where the worst is

The same place the worst transport ratio is: the shallowest, widest annulus.

Cuttings accumulate where they travel slowest, exactly as traffic does.

## The two numbers together

The transport ratio says how well the annulus is working. The concentration says how much is in it.

A low transport ratio with a low rate of penetration gives a low concentration and a slow hole. A high transport ratio with a very high rate of penetration can still give a high concentration.

Reporting one without the other tells half the story, and the concentration is the one that predicts a pack-off.

## Exercise

At the feed rate above, compute what rate of penetration would be needed to reach a 4 percent concentration on the slant well at 0.025 m3/s.

Then say whether that rate of penetration is achievable, and what that implies about which of the two constraints binds first on this well.
