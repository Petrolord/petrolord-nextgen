# The hydrate question this engine hands on

Cooling a wet gas is the classic way to make a hydrate. So the obvious question to ask a dew point skid is whether the cold spot is inside the hydrate region, and this engine will not answer it.

{{panel:fc-coldend-explorer}}

## The refusal is deliberate

There is no hydrate boundary in this engine. That is an absence rather than a held item: no correlation is coded and disabled, and no figure is recorded and unchecked. The subject simply belongs somewhere else.

It belongs to the Production module Flow Assurance engine, which owns subcooling, the depression correlations and the inhibitor dose. That engine computes no hydrate boundary of its own either, which is worth knowing before you go looking for one. The boundary arrives from outside both engines, and what the platform computes is the margin against it.

## What this engine hands over

Two things, and they are exactly the two a hydrate question consumes.

The first is where the cold spot is. On AGBADA the gas arrives at 59.683516566 degF at 640.000000 psia, having cooled 36.316483434 degF from an inlet at 1180.000000 psia and 96.000000 degF.

The second is how much free water arrives there. The gas carries 33.801656743 lb per MMscf at the inlet and can hold 18.762820770 lb per MMscf at the cold spot, so 15.038835973 lb per MMscf comes out as liquid.

A subcooling question needs a state and a water condition. This engine produces both and then stops.

## Why stopping is the right behaviour

A module that guessed a hydrate boundary from a gravity correlation would be offering an answer its inputs cannot support, in the one place where being wrong is expensive. The guess would also compete with a course that owns the subject properly, and two answers to one question with no stated precedence teaches a learner to trust whichever screen they opened.

## Where the seam sits in practice

Take the arrival temperature and the pressure it was reached at. Take the free water figure and the rate it is to be multiplied by. Carry those to the Flow Assurance work with the gravity and the heat capacity that produced them, because a state without the conditions that generated it cannot be checked by the engine receiving it.

Then ask the hydrate question there, where the correlations live.

One practical warning goes with the hand-over. The cold spot this engine reports is the state at the separator, and it is not necessarily the coldest point in the system. A choke, an exposed line or a second let-down downstream can be colder, and the margin has to be taken at whichever point is worst. This engine knows about the one let-down it was given.

## Exercise

Record the cold spot pressure and temperature, the cooling that reached it, and the three water figures for AGBADA. Say which two of those a hydrate margin calculation actually consumes. Then name what this engine holds as a limit here and what it simply does not contain, and say which of the two the hydrate boundary is.
