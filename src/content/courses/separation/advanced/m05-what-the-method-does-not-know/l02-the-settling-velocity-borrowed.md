# The settling velocity borrowed

A horizontal vessel needs a droplet settling velocity to work out how long the gas must stay in the drum, and this engine borrows the Souders-Brown velocity at the horizontal K for that duty. The packaging has not been checked against API 12J or against Arnold and Stewart.

{{panel:fc-slug-explorer}}

## What is borrowed

Souders-Brown was written to give the velocity a gas stream may carry without lifting liquid out of the vessel. The gas length requirement needs something different: the speed at which a liquid droplet falls through the gas space. This engine uses the first figure for the second job.

The two are related and they are not the same quantity. Until the published method is read, the gas length and everything drawn from it are held.

## The consequence the engine pins

The gas length is the gas velocity over the settling velocity, times the gas height. The capacity rule caps that ratio at 1, because a vessel carrying its gas has a gas velocity below the settling velocity. So the gas length can never exceed the gas height.

A gate in the engine holds that statement, and it has a sharp corollary. Gas can control a horizontal vessel only where the vessel is gas overloaded or shorter than its own diameter. Every published case where gas controls is a case where `gasCapacityOk` is false.

## The case that shows it

| figure | gasOverloaded6ftGasControls | ABANA-2 at 8.000000 ft |
| --- | --- | --- |
| gas velocity ft per s | 2.829421 | 1.173387 |
| settling velocity ft per s | 0.500000 | 1.958255 |
| margin | 0.176715 | 1.668891 |
| gasCapacityOk | false | true |
| gas length ft | 16.976527 | 2.396801 |

The overloaded case runs a gas velocity nearly six times its settling velocity, and its gas length of 16.976527 ft stands against a gas height of 3.000000 ft. The healthy case runs below its settling velocity and its gas length of 2.396801 ft is a small number that never comes near controlling the vessel of 23.270539 ft.

## What would change if the literature moves

If the published method sizes the gas length from a droplet diameter instead of from a Souders-Brown velocity, three things move together. The gas length itself, the claim that it cannot exceed the gas height, and the observation that gas only controls a failing vessel. None of the three can be quoted as a finding while the packaging is unchecked.

So the honest reading of a gas-controlled horizontal vessel today is that the vessel is gas overloaded. That is a real result from the capacity margin, which does not depend on the borrowed velocity in the same way.

## The mistake

The mistake is deriving a design rule from a held quantity. Writing down that gas never controls a healthy horizontal vessel as a fact about separation, rather than as a consequence of one packaging choice inside one engine, is a conclusion resting on an unchecked premise.

The second mistake is the opposite, ignoring the gas length because it is held. It still decides the `controlling` field on every case, so a reader who skips it will not understand why a gas-overloaded vessel came back far longer than its liquid retention asked for.

## Exercise

Say what quantity Souders-Brown was written for and what job the gas length requirement borrows it for. Then state the consequence the engine gate pins, give the gas velocity, settling velocity, gas length and gas height on gasOverloaded6ftGasControls, and name what would have to be re-read if the literature check moves the packaging.
