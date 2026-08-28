# The target profile

The Ekene flood does not aim at a voidage replacement ratio of one. It aims at 0.85 in its first month, ramps by 0.04 a month for five months, and then holds 1.05 for the rest of the record. Both halves of that profile are deliberate, and understanding why is more useful than any single VRR number.

## The ramp

$$\text{target}(m) = \begin{cases} 0.85 + 0.04m & m < 6 \\ 1.05 & m \ge 6\end{cases}$$

giving 0.85, 0.89, 0.93, 0.97, 1.01, and then 1.05 from the sixth month onward.

Deliberate under-injection at start-up is standard practice and it has three separate justifications.

**Facilities are commissioning.** A new water plant does not reach its design rate on day one. Pumps are being proved, filters are being sized against the actual water quality, and the injection system is being pressure-tested against real formation response. Writing a target of 1.0 into a plan that the facility cannot yet deliver produces a report full of red flags describing normal commissioning.

**Injectivity is unknown.** Until you have injected into a well you do not know what it will take. Ekene's design assumes an injectivity index of 0.5 barrels per day per psi; that number was an estimate until the first month of data existed. Ramping gives you the measurement before you commit to the rate.

**The reservoir does not need it yet.** Ekene at the flood start sat at 2096.0082626669955 psia, still 96 psi above its 2000 psia bubble point. There was margin. Spending capital to inject at full rate into a reservoir that is not yet in trouble buys nothing that a few months of ramping does not buy more cheaply.

## The hold at 1.05

After the ramp, the target sits five percent above replacement, permanently. That is not a rounding of 1.0; it is a decision to repressurize slowly.

The arithmetic of what that buys is in module 4, but the direction is easy to state. Injecting more voidage than you remove means the tank's net withdrawal is falling, and a tank with falling net withdrawal has rising pressure. Over the 36 months of the record the field ends with a net surplus of 7738.498783101561 reservoir barrels, and the pressure ends 34.4931292839633 psi above its trough.

Thirty five psi is modest. It is also thirty five psi of extra margin between the reservoir and the bubble point, bought without drilling anything, on a field whose whole primary depletion only had 1200 psi of margin to spend.

## Why not aim higher

An obvious question: if 1.05 buys margin, why not 1.5?

Three reasons, and they are the standard three.

**Water costs money.** Sourcing, treating, pumping and disposing of injection water is a real operating cost, and above replacement you are buying pressure rather than displacing oil.

**Fracture pressure is a ceiling.** Pushing harder raises injection pressure, and above the formation parting pressure the water opens fractures instead of entering the matrix. A fractured injector can flood a thief zone with astonishing efficiency and recover nothing.

**Over-injection can be worse than useless.** Water that arrives at a producer without displacing anything on the way is water you paid to inject and will now pay to lift, treat and dispose of. The Professional tier meets a pattern at a cumulative VRR of about 1.20, and the question there is not whether that is a big number but whether the water is doing anything.

## Reading a target profile you inherit

When you take over a flood, ask for the target profile before you look at the performance. A field running at a VRR of 0.9 is failing if its target is 1.05 and comfortably on plan if its target is 0.9. The Petrolord ledger keeps the two separate on purpose: the interpretation bands built into `classifyVRR` (below 0.9 under-injection, above 1.1 over-injection) are generic reservoir engineering, while the operator's target band is a field-specific input you supply. Confusing the two produces a dashboard that flags the plan as a problem.

## The misconception to avoid

"A VRR target of 1.0 is the neutral, assumption-free choice." It is a choice, and usually not the right one. A field still above its bubble point with margin to spare may rationally run below 1.0 and save the water. A field that has fallen below and needs pressure back must run above 1.0 for years. The neutral-sounding target is the one nobody defended.

## Exercise

First, write out the target profile for the first eight months and confirm it reaches 1.05 at month five, using zero-based month indexing as the formula does. State what the target would be in month 5 if the ramp increment were 0.03 instead of 0.04, and how many months the ramp would then take.

Second, the field carries a net surplus of 7738.498783101561 rb after 36 months. Using the last month's produced voidage of 5445.272709028624 rb as a typical month, compute how many months of running at exactly 1.00 instead of 1.05 it would take to give that surplus back.
