# The mechanical seal

{{panel:materials-spares-calculator}}

This lesson works the Ekene register's lead-time risk case end to end: the item, its stated inputs, what the sampler returns and how a planner should read it. The register is synthetic, written for this platform, and every figure below is sampled on the stated seed and draws.

## The item

The register lists it as "Mechanical seal, export pump P-301". The lower tiers placed it twice. Its weighted score under the Ekene criticality policy is exactly 70.000000, the class V minimum, so it is class V; by annual usage value it ranks eighth, at 53400.000000, in class B. Its usage is 6 a year, and the register holds 2 on hand. A seal that fails stops the export pump, and its supply is slow and uneven.

## The stated inputs

| input | stated |
| --- | --- |
| demand a day | triangle 0.01, 0.016, 0.03 |
| lead time, days | triangle 70, 90, 160 |
| reorder point | 3 |
| cycle service level for a reorder point | 0.95 |
| draws | 20000 |
| seed | 20270301 |

## What the sampler returns

On seed 20270301 and 20000 draws: a stockout probability a cycle of 0.058600, a cycle service level of 0.941400, expected units short a cycle of 0.020797, and a reorder point for the cycle service level of 3.062282. The engine's reason, verbatim:

> 1172 of 20000 draws have a lead-time demand above the reorder point 3: a stockout probability of 0.0586 a cycle

The mean lead-time demand is 1.986608 seals, the P10 is 2.780743 and the maximum is 4.409134. A reorder point of 3 sits well above the mean, and still a few cycles in a hundred run out on this sample, because the slow deliveries and the busy spells pile up in the right tails of the two triangles.

## Reading it as a planner

The estimate says the stated reorder point falls a little short of a cycle service level of 0.95 on this sample. It says nothing about which week a seal will fail. It is quoted with its seed and draws, and a decision taken on it records both.

The course replayed the draws by hand from mulberry32 and the triangular inverse, a uniform for the lead time then one for the demand in each draw, and found the same 1172 draws above the reorder point that the engine counts. The figure is the canonical sampler's, reproduced.

## Two tools, one item

The seal could also be stocked by the Professional tier's safety stock for normal demand, given a mean and a standard deviation of demand and of lead time. The Monte Carlo reads the stated triangles directly and keeps their skew, which a normal curve would lose. Each tool answers from its own stated inputs, and a policy names the one it used.

## Exercise

Open the spares calculator on the view "Lead-time risk by Monte Carlo (ungraded)" and start from "The mechanical seal on the Ekene register". Check every stated input against the table above, using the shape and term controls. Reproduce the four sampled tiles and write each with its seed and draws. Now set "Reorder point (stated)" to 4, predict whether the stockout count rises or falls, and record the new count and probability with the seed and draws. Restore 3.
