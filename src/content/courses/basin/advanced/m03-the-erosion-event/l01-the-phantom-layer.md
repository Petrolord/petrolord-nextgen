# The phantom layer

An erosion event says that section which once existed is gone. A forward model that marches from the past has to create that section before it can remove it. This engine's mechanism is the phantom layer, and this lesson teaches it exactly, because every number in this module comes out of its bookkeeping.

## The mechanism

The event is specified as two numbers: age 10 Ma, amount 600 m. From them the engine builds a hidden layer. Its lithology is shale. Its deposited thickness is the amount, converted to solid thickness at the surface: 600 m of fresh shale holds 274.3599416810648 m of grain, by the Associate tier's integral. Its deposition age is the youngest ageEnd among layers older than the event, which is the Upper Shale's 20 Ma: the model's reading is that the eroded section accumulated immediately after the youngest preserved deposition ended. It exists from 20 Ma until the event age, and at 10 Ma it is removed from the stack.

While it exists it is a real layer in every mechanical respect: it takes the top of the stack, deepens everything beneath, compacts on the shale curve, conducts and stores heat, and pushes the thermal grid deeper. Two things it never does: it is excluded from reporting, so no output series carries it, and it runs no kinetics that anyone reads.

## What it does to the source

The decade 20 to 11 Ma is the fixture's hot chapter, and the phantom is its cause. The source's bottom moves from 3200 to 3519.372263771036 m; its thickness compresses from 400 to 390.577400265013 m; its centre temperature climbs from 154.21241437947037 at 21 Ma to a basin-lifetime maximum of 168.51433459340572 degC at 18 Ma, holding near that through 11 Ma, 167.24573484238402. At 10 Ma the phantom vanishes, the stack rebounds, and temperature drops 13.4 degrees in one step, 153.84048634909556, then eases to the graded 149.76037539670858 by present day.

Ten million years at around 167 degrees, in a rock whose ladder was already drained to Ro 1.6: module 4 of the Professional tier says exactly what that buys, a modest further drain of high bins, and the next lessons make it the graded signature.

## The convention inside the mechanism

Notice the phantom's deposition age is inferred, not specified. The event's two numbers say nothing about when the vanished section accumulated, so the engine adopts the simplest consistent reading: deposition began when preserved deposition ended, at 20 Ma. Alternative conventions exist, and real basins might spread the vanished section's accumulation differently, which would spread the heating pulse differently in time. The graded values are defined on this convention; the sensitivity habit from module 2 applies unchanged.

A second convention hides in the lithology: the phantom is always shale, whatever was actually eroded. In this fixture that is also the natural choice, since it caps a shale, and shale's insulating conductivity makes the phantom decade's warmth slightly stronger than a sandy phantom would.

## Worked example

Verify the phantom's solid thickness and its effect on the source's top depth at 15 Ma. Solid: $600 + (0.63/0.00051)(e^{-0.00051 \times 600} - 1) = 600 - 325.640 = 274.360$ m, the engine's 274.3599416810648. Source top at 15 Ma: the phantom deepens the overburden; the engine's stack gives 3128.7948635060234 m, against 2800 without it, a deepening of 328.79 m. The deepening exceeds nothing like 600, and is more than 274, because what sits above the source is the phantom's compacted-at-depth thickness plus the extra compaction of the layers between, all recomputed by module 2's stacking.

## Exercise

State the phantom's four defining properties: lithology, solid thickness, existence window, and reporting status. Then answer in one sentence: why must the model create the eroded section rather than simply warming the basin for a decade?

As a self check: shale; 274.3599416810648 m of grain from 600 m deposited at surface; exists from 20 Ma, the youngest pre-event ageEnd, until removal at 10 Ma; mechanically real but excluded from all reported series. The section must be created because its effects are mechanical, not just thermal: it deepens, compacts and thins every layer beneath, moves layer centres, changes the conductivity stack and the retention caps, and a bare temperature nudge would reproduce none of that bookkeeping.
