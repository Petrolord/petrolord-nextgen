# After breakthrough

Water reaches the producer having swept 65.7 percent of the pattern. The flood does not stop. Injection continues, the swept area keeps growing, and the question is how fast, and at what cost.

## The growth law

The engine uses the Dyes, Caudle and Erickson correlation in its five-spot form:

$$E_A = \min\left(1,\ E_{Abt} + 0.2749 \ln \frac{W_i}{W_{i,bt}}\right)$$

The swept area grows with the LOGARITHM of the injected volume ratio. That functional form carries most of the economics of a mature waterflood, so it is worth reading carefully.

## What a logarithm means here

Doubling the injected water past breakthrough adds

$$0.2749 \times \ln 2 = 0.19053 \text{ of areal sweep}$$

Doubling it again adds the same 0.19053. Every doubling buys the same increment, so the incremental cost per unit of swept area doubles each time.

Start from Ekene's $E_{Abt} = 0.6573574366303985$ and inject twice the breakthrough volume:

$$E_A = 0.6573574366303985 + 0.2749 \ln 2 = 0.8479035965663274$$

Four times gives

$$E_A = 0.6573574366303985 + 0.2749 \ln 4 = 1$$

capped. Solving exactly for where the cap is reached:

$$\frac{W_i}{W_{i,bt}} = \exp\left(\frac{1 - 0.6573574366303985}{0.2749}\right) = 3.477891445202633$$

So on this correlation the whole pattern area is swept once you have injected about three and a half times the breakthrough volume. That is not a large multiple, and it is why areal sweep is usually not the limiting efficiency in a mature flood: vertical conformance and displacement efficiency are.

## The cost side

The correlation says nothing about what you produce while doing it. That comes from the displacement solution: after breakthrough the producing water cut rises toward one, so the extra 2.5 breakthrough volumes of water bring progressively less oil.

The forecast in module 4 combines the two and stops at a water oil ratio limit, and that limit almost always bites before the areal sweep reaches 1. On the Ekene design case the run stops at a water oil ratio of 31.119000015950355 with the areal sweep already at 1, so this is one of the cases where the cap is reached first.

## The provenance again

Dyes, Caudle and Erickson published in 1954. The coefficient 0.2749 is specific to the five-spot geometry, and other patterns have different coefficients. Like the breakthrough correlation, this is a regression through model data, not a derivation.

The logarithm is not arbitrary though. Streamline geometry gives a naturally logarithmic sweep growth: the additional area reached by injecting more water lies further and further out along slower and slower streamlines, and the streamline transit times in a doublet grow roughly exponentially with distance from the direct line.

## The cap is a discontinuity

At $E_A = 1$ the correlation stops. In the forecast engine that has a visible consequence: once the swept area saturates, further injection adds no new rock, the oil rate collapses to whatever the displacement solution still yields from the fully-swept region, and the water oil ratio climbs very steeply.

On the Ekene design case that produces an artefact worth knowing: the water oil ratio crosses both a limit of 10 and a limit of 25 within a single monthly time step, so the two runs stop at the same time with the same final water oil ratio of 31.119000015950355. Module 4 takes that up.

## The misconception to avoid

"Areal sweep of 1 means all the oil is recovered." Areal sweep of 1 means the water has contacted the whole pattern area. Within that area, the displacement efficiency decides how much oil left the rock, and the vertical sweep decides how much of the column was contacted at all. Three efficiencies, all less than one, and only one of them has reached its ceiling.

## Exercise

First, compute the injected volume ratio at which the areal sweep reaches 0.9 on the Ekene numbers, and compare it with the 3.477891445202633 that reaches 1. State how much of the last 0.1 of sweep costs relative to the first 0.24.

Second, a different pattern has a growth coefficient of 0.15 rather than 0.2749, with the same $E_{Abt}$. Compute where its areal sweep reaches 1 and comment on what that means for the pattern choice.
