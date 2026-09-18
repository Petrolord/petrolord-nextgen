# Damage begins long before the flow chokes

Choking is the boundary the sizing equation cares about. It is rarely the boundary that destroys the valve. Bubbles form in the vena contracta and collapse again downstream of it a long way before the flow stops responding to pressure drop, and the collapse is what removes metal.

## The index that measures the margin

The engine returns a cavitation index on every liquid sizing, and the index is a measure of how much margin there is before damage. It reads 4.651599 at an outlet pressure of 200.000000 psia, where the regime word is `stable`. It reads 2.885714 at 171.300000 psia and 2.040786 at 140.000000 psia, where the regime word is `incipient cavitation`. It reads 1.593572 at 110.000000 psia and 1.307130 at 80.000000 psia, where the regime word is `cavitating`.

Look at where those regime words sit against the choking boundary at an outlet pressure of 67.679968 psia. The engine is already returning `incipient cavitation` at an outlet of 171.300000 psia and `cavitating` at 110.000000 psia. On both of those rows the choked flag is false and the sizing equation is behaving perfectly. The coefficient is moving as it should, the drop used follows the stated drop, and nothing in the sizing result on its own suggests a problem.

## Why that gap is the dangerous part of the range

A valve chosen for a service in that range passes every check a sizing calculation makes. It delivers the required flow at the required drop, and it will go on doing so for a while. What it is also doing is carrying continuous bubble collapse against its plug, its seat and the pipe wall just downstream of it, and the failure that follows shows up as a leaking valve and a thinned pipe rather than as a control problem.

This is the reason the regime word and the choked flag are separate returns. A tool that reported only the choked flag would call every row above the crossing acceptable, which covers five of the nine rows of this march, four of which the engine itself labels with a cavitation word.

## What to do with a cavitation word

Treat it as a trim and material question rather than as a sizing question. The coefficient does not need changing on those rows, because the sizing equation is still valid there. What needs changing is what the valve is made of and how the pressure is let down inside it. That is the same remedy the engine names on the choked rows, arrived at from the other side of the boundary.

## Exercise

Take the row of the march at an outlet pressure of 110.000000 psia. Write down the cavitation index and the regime word the engine returns there, and write down whether it returns choked true on that row. Then say in one sentence what a review that read only the choked flag would have concluded about that operating point.
