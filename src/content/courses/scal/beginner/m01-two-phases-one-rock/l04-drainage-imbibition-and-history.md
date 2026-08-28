# Drainage, imbibition, and history

Rock and fluid pairs remember. The saturation a sand sits at today is not enough to say how its curves look; it also matters which direction the saturation has been moving. This lesson names the two directions, tells the Ekene story in terms of them, and explains which one this course's curve set describes.

## Two directions with two names

The vocabulary is fixed by which fluid is the wetting phase. For the water-wet Ekene sand, water is the wetting phase, so:

**Drainage** is the wetting phase decreasing. Water is displaced by a non-wetting fluid, and the water saturation falls. The defining event in any oil field's life is a drainage process: oil migrating from a source rock into a water-filled trap, forcing water down and out over geological time until the column reaches the connate saturation.

**Imbibition** is the wetting phase increasing. Water returns and the water saturation rises. A waterflood is an imbibition process, and so is an aquifer pushing into an oil column as pressure declines.

The names attach to the direction of the WETTING phase, not to which fluid you happen to be injecting. That convention trips people up exactly once; after that it is automatic.

## The Ekene story in these words

Put the field's whole life on one axis of water saturation:

1. Deposition: the sand is laid down full of water, $S_w = 1$.
2. Charge (drainage): oil migrates in over geological time, water saturation falls from 1.0 toward the connate value 0.35. The finest pores and grain surfaces keep their water; the oil takes the pore centres. When the earlier courses booked the oil column at $S_{wi} = 0.35$, they were booking the endpoint of this drainage journey.
3. Production start: pressures change, but above the bubble point with no aquifer the saturations in the oil column barely move. The material balance course lived here.
4. The flood (imbibition): from 2023-01-01 the converted injectors push water back into the sand, and the water saturation climbs from 0.35 toward its ceiling at $1 - S_{or} = 0.75$. This course lives here.

So the sand has been down the saturation axis once, waited, and is now on its way back up. The curves that describe the way down and the curves that describe the way back up are not the same curves.

## Hysteresis, and what this course does about it

The dependence of the curves on direction is called hysteresis. Its physical root is the trapping you met in lesson 1: on the way down, oil entering pore centres is a connected invading filament; on the way back up, water surrounds oil and snaps it into disconnected blobs that stop moving. The same rock at the same saturation can therefore show different relative permeabilities depending on its history, and the residual oil saturation is intrinsically an imbibition concept, because it is the end state of the way back up.

The Ekene curve set you saw in the last lesson, endpoints 0.35 and 0.25 with its two exponents, is an imbibition set: it describes water displacing oil, which is the only direction this tier computes. The engine behind this course models exactly one curve set per rock and does not model hysteresis at all. That is a deliberate design lock, not an oversight: the thin, honest version of SCAL keeps one well-understood model per physical question and refuses the half-modelled extras. When a lesson or a panel in this course draws a relative permeability curve, it is the waterflood direction, full stop.

What you give up with that lock is the ability to model processes that reverse direction, such as a flood that is stopped while the water drains back. What you gain is that every number in the tier is traceable to six parameters you can hold in your head.

## Where the other direction lives

The drainage direction has its own laboratory measurement and its own workhorse curve: capillary pressure against saturation, measured as the non-wetting phase is forced in step by step. That curve carries the answers to a different family of questions, about how saturations arrange themselves with height above the water contact, and it is the entire subject of the Professional tier of this course. Nothing in this tier needs it. If you have met transition zones in your own work and wonder where they went, that is where: one tier up.

## Worked example

Classify each event as drainage or imbibition for a water-wet rock, before reading the answers. One, oil charging a trap. Two, a waterflood of an oil column. Three, water encroaching from an aquifer into gas-filled sand. Four, gas injected into a water-filled aquifer for storage.

Answers: one is drainage, the founding example. Two is imbibition, the wetting phase rising. Three is imbibition, water rising into a non-wetting gas. Four is drainage, gas forcing the wetting water down. Note that three and four involve no oil at all; the vocabulary cares only about the wetting phase's direction.

## The misconception to avoid

Learners assume one curve serves both directions, because one curve is what most textbooks draw and most simulators default to. For screening a one-direction process that assumption is harmless, and it is exactly the position this course takes: the flood only ever moves the saturation one way, so one imbibition set suffices. The mistake is forgetting the assumption when the process reverses. If your problem involves saturations that go up and then down, a single curve set is no longer an approximation, it is the wrong physics, and you need tools beyond this course's deliberate locks.

## Exercise

The Ekene sand spent its history going from $S_w = 1$ down to 0.35, and the flood will take it from 0.35 up to at most 0.75. First, state which named process each leg is, and give the physical reason the endpoint of the second leg, $S_{or} = 0.25$, does not appear anywhere in the story of the first leg. Second, a colleague proposes using this course's curve set to model the original oil charge of the trap. Write two sentences explaining what is wrong with that, using the words imbibition, drainage, and history.
