# The floor no interval reaches

{{panel:lp-proof-test}}

Shortening a proof test interval is the cheapest lever an operating site has, and imperfect coverage is the reason that lever runs out. The covered share of the undetected failures does get better as the interval shortens. The uncovered share does not move at all, because those failures are waiting for the overhaul and the proof test never touches them. Drive the interval toward zero and the PFDavg does not go to zero: it goes to a floor. The floor is the property of a partially tested subsystem that decides whether a target is reachable.

## OBAGI's floor at five coverages

The floor is the PFDavg as the interval goes to zero, with everything else held. Beside it is the longest interval that still meets a target of 0.02 on the same subsystem.

| coverage, stated | floor PFDavg | longest T1 hours at the target | longest T1 years |
| --- | --- | --- | --- |
| 1 | 0.000021600000 | 44396.444444 | 5.068087 |
| 0.95 | 0.001992600000 | 42122.573099 | 4.808513 |
| 0.9 | 0.003963600000 | 39596.049383 | 4.520097 |
| 0.8 | 0.007905600000 | 33595.555556 | 3.835109 |
| 0.7 | 0.011847600000 | 25880.634921 | 2.954410 |

At a perfect test the floor is 0.000021600000, which is only the MRT after each test. Take five percent of the failures out of the test and the floor jumps to 0.001992600000, which is nearly a hundred times higher. That single step is the whole lesson: a small hole in the test procedure buys a large floor, because the failures behind it are waiting half a lifetime.

## Where the floor comes from

For OBAGI at coverage 0.7 the floor can be built from the stated inputs. The undetected rate times the uncovered fraction times half the lifetime plus the MRT, plus the undetected rate times the covered fraction times the MRT, comes to 0.011847600000, which is the engine's floor to the digit. Nothing about the proof test interval appears in that expression, which is exactly why no interval reaches below it.

## A target below the floor is UNACHIEVABLE

Ask `maxProofTestInterval` for a target below the floor and it returns no interval and the state UNACHIEVABLE, with the floor beside it. That is a design finding, and no amount of scheduling answers it. Only a better test or a shorter lifetime moves the floor. More frequent testing of the same procedure moves nothing, and a plan built on more frequent testing will not close the gap however far it is pushed.

## The engine's declared choice, and the alternative

The engine could have treated the uncovered failures as revealed at the next proof test like every other failure, which would have made coverage a small correction and removed the floor entirely. It does not. Its refusal says what it holds instead: the uncovered failures stay until the item is restored as new. That is why a coverage below one has to arrive with a lifetime, and why the lifetime enters the answer as strongly as the interval does. The conservative reading is the one the engine takes, and it takes it explicitly.

## Exercise

Take the floor at coverage 0.95, 0.001992600000, and the floor at coverage 0.9, 0.003963600000. Work out how much the floor grew for that second five point step and compare it with the step from coverage 1 to coverage 0.95. Then decide which of the five rows could still support a required PFDavg of 0.005 at some finite interval, and write one sentence saying what you would ask the maintenance team to change first.
