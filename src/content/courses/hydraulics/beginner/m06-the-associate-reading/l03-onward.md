# Onward

From the pump to the formation.

## What the Professional tier adds

This tier computed three pressures and said that only one of them reaches the rock. The next tier is about that one.

## What you will find there

**Equivalent circulating density.** The annulus loss divided by the true vertical depth and added to the mud weight. It is the number the formation actually feels, and it is a PROFILE rather than a single value: it grows from the mud weight at surface to its maximum at total depth.

**The cuttings.** How fast they actually travel, which is not how fast the mud travels. The slip velocity, the transport ratio, and the concentration of cuttings the annulus is carrying at any moment.

**Where the cleaning is worst.** Not at total depth. The largest annulus has the lowest velocity, and the largest annulus is in the shallowest cased section.

**The flow rate decision.** Cleaning wants more and the formation wants less, and this is where the two are settled against each other. The tier solves for the flow rate that reaches a stated transport ratio and reports what it costs at the pump and at the formation.

**A limitation worth knowing.** The transport model in this engine has no inclination term. It gives the same transport ratio for the horizontal well as for the slant one, and cuttings beds at angle are the single largest hole cleaning problem in real drilling. The tier states that clearly rather than working around it.

## Before you go

Two habits from this tier.

**Say which pressure you mean.** Pump, bit, annulus and equivalent circulating density are four different numbers with four different audiences, and the word pressure on its own has named none of them.

**Check the sum.** Three losses plus a surface loss equal the pump pressure, exactly. It is a free check on every hydraulics run and it catches a surprising number of setup errors.

## The one sentence

You can now compute what the pump will read. The next tier is what the rock will feel.
