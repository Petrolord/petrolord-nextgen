# The story so far

One chain, from a pump schedule to a number a reservoir engineer can use, and every link in it loses something.

## The chain

This tier is not five topics. It is one calculation with five stages, and you can say it in a sentence. Fluid goes into the ground on a schedule, some of it stays, the proppant it carried settles into a pack, the pack has a conductivity, and the conductivity becomes a skin.

Written out, with the published case at every stage:

| stage | what goes in | what comes out |
|---|---|---|
| material balance | 209.09714590747427 m3 injected | 36.143836842230584 m3 in the fracture |
| the schedule | that efficiency, 0.1728566723633056 | a pad fraction of 0.7052381992848291 |
| the ramp | 8 stages to 800 kg per m3 | 28915.069473784468 kg placed |
| the pack | that mass over the fracture area | a propped width of 0.0015115434001821517 m |
| conductivity | the pack at 38131950.890444934 Pa closure | 9.84433461550515e-14 m3 of retained kfw |
| the skin | a conductivity of 0.6649847808507611 | a pseudo-skin of -5.3116380662677045 |

Everything in the right-hand column is smaller than the thing above it deserved. That is the tier.

## Every link loses something

**The pad loses to leakoff.** Of 209.09714590747427 m3 injected, 172.95330906524367 m3 goes into the formation and never comes back as fracture volume. The efficiency is 0.1728566723633056, so most of the job is spent buying a fracture that will still be open when the proppant arrives.

And the pad fraction is not what most people write down. One minus efficiency gives 0.8271433276366944. The correct form gives 0.7052381992848291. The gap of 0.12190512835186529 is fluid you thought was pad and is not.

**The pack loses to porosity and to damage.** The average created width on the PKN model is 0.004015981871358954 m. The propped width is 0.0015115434001821517 m. The fracture closes onto a pack that is 0.35 porosity, so most of the width you opened is not there afterwards. Then the damage factor of 0.5 halves the permeability of what remains, before a single barrel has moved.

**The length loses to thinning.** At fixed proppant, every metre of extra half-length is paid for out of width. That is why the design has an optimum at all, and why the searched conductivity of 1.6363280590574483 sits where the published constant 1.6 says it should.

## What survives

One number, and it is worth having.

The well was drilled at 0.108 m. After the chain has taken its cuts, it behaves like a well of radius 21.889652014700083 m producing into the same drainage area. The pseudo-skin is -5.3116380662677045.

That is the point of the whole exercise. Everything upstream is bookkeeping about how much of the job you actually got, and it matters only because the last number is what a reservoir engineer will put in a model and never question.

## The habit to carry out of this tier

When someone hands you a fracture skin, ask which link it came through and what that link lost. A skin of -5.3116380662677045 is not a measurement. It is the end of a chain with a leakoff coefficient at the top of it, a pad fraction that is easy to get wrong, a pack porosity, a stress-dependent permeability and a damage factor, and each of those is a judgement somebody made.

Read the chain, not the last number.

## Exercise

First, write the six stages of the chain from memory, in order, with the quantity each one produces.

Second, for each stage name the one input that, if wrong, would move the final pseudo-skin most, and say in which direction.
