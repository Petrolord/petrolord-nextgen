# Milk runs and dedicated voyages

{{panel:marine-voyage-calculator}}

A vessel can serve several installations in two ways. It can call at each of them in turn on one sailing, or it can make a separate sailing to each. The engine reads these as two route modes, and every voyage plan must state which one it uses. This lesson compares them on the Ekene cluster.

## Two route modes

A milk run ("milk-run") is one voyage from the base through every installation once, in a stated order, and back. It states its stops and one leg distance more than there are stops: base to the first stop, stop to stop, and the last stop back to the base.

A dedicated route ("dedicated") is one voyage per installation, out and back, each at the installation's own stated distance from the base.

In this course a voyage is always one sailing from the base and back. A milk run is one voyage through every stop; a dedicated voyage serves one installation.

## The Ekene PSV both ways

| voyage | stops | NM | days |
| --- | --- | --- | --- |
| milk-run | EKA, EKJ, EKB, EKF | 206.000000 | 2.586364 |
| EKA | EKA | 124.000000 | 1.363636 |
| EKJ | EKJ | 136.000000 | 1.518182 |
| EKB | EKB | 148.000000 | 1.372727 |
| EKF | EKF | 190.000000 | 1.613636 |

The milk run takes 2.586364 days for one voyage; the four dedicated voyages take 5.868182 days in all. The milk run saves sailing because the installations sit close to one another: the leg from EKA to EKJ is 9 NM, while a dedicated voyage to EKJ sails 68.000000 NM out and the same back. It also pays the port time once where four dedicated voyages pay it four times.

## Which is right for a cluster

The engine takes no view. A milk run puts every installation's cargo on one deck at once, so it can overload a vessel that would carry each installation's cargo alone with room to spare. Dedicated voyages keep each cargo small but repeat the sailing and the port time. A plan compares the two and states its choice.

## Each mode reads its own distances

A milk run takes its distances from its legs, and a dedicated route from the installations. A distance given to the mode that does not read it is refused by name. A distance from the base stated on a milk run:

> installations[0].distanceFromBaseNm is read only when route.mode is "dedicated"; a milk run takes its distances from route.legsNm

And legs stated on a dedicated route:

> route.legsNm is read only when route.mode is "milk-run"; a dedicated voyage uses each installation's distanceFromBaseNm out and back

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV, dedicated voyages". Read the four voyages in the voyage table and check them against the table above; add their days and compare with the Total days tile. Then set Start from to "Ekene PSV milk run, rainy season", and in the JSON box add "distanceFromBaseNm": 62 to EKA. Read the refusal and remove the key. Finally, set the "Route (stated)" control to a dedicated voyage to each installation and read what the engine asks for next.
