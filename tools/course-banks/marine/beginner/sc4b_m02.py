import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Associate m02, Routes and Voyage Time.
# Sources: the two route modes, legs and sailing hours, port and field time,
# the voyage in days, a leg of zero, and the route refusals. Every keyed figure
# and message was re-run through the vendored engine (marine_engine.mjs) on the
# Ekene PSV milk run and dedicated voyages and the golden inputs.

q(1, "A milk run is stated through four installations. How many leg distances must it state?",
 "Five: base to the first stop, three from stop to stop, and the last stop back to the base.",
 ["Four, one for each installation, each measured from the base as a dedicated route measures it.",
  "Eight, an outward leg and a return leg for every installation the vessel calls at.",
  "Three, the stop-to-stop legs alone, since the engine works out the two base legs itself."],
 "A milk run states one leg more than it has stops, in the order sailed: base to the first stop, stop to stop, and the last stop back to the base. Distances measured from the base belong to a dedicated route, a milk run does not sail out and back to each stop, and the engine works out no distance it is not given.")

q(3, "On a dedicated route, where does the engine take each voyage's distance from?",
 "From each installation's stated distanceFromBaseNm, sailed out and back.",
 ["From the route's legsNm, read in the order the installations are listed in the box.",
  "From the longest leg of the milk run, which the engine applies to every installation.",
  "From a distance the engine measures between the base and each installation's stated position."],
 "A dedicated voyage sails from the base to one installation and back at that installation's stated distance, so the Ekene EKJ voyage sails 136.000000 NM for a distance of 68.000000 NM. Legs are read only on a milk run, and a legsNm stated on a dedicated route is refused. The engine borrows no leg and computes no distance from positions.")

q(0, "The Ekene milk run states legs of 62, 9, 12, 28 and 95 NM. What distance does the engine return for the voyage?",
 "206.000000 NM, the five legs added in the order sailed.",
 ["124.000000 NM, a dedicated voyage to EKA and back.",
  "190.000000 NM, twice the 95 NM from EKF.",
  "148.000000 NM, the distance of the dedicated voyage to EKB, the middle of the cluster."],
 "A milk run's NM is the sum of its legs: 62 + 9 + 12 + 28 + 95 is 206.000000 NM. The other three figures are the NM of the dedicated voyages to EKA, EKF and EKB, each out and back at its own distance from the base, and none of them is the milk run.")

q(2, "The Ekene PSV sails the milk run's 206.000000 NM at 11 knots with a weather factor of 1 on every activity. What sailing hours does the engine return?",
 "18.727273, the NM over the speed with no allowance on it.",
 ["22.472727, the sailing hours once the rainy-season factor of 1.2 is applied to them.",
  "23.000000, the field hours of the four stops.",
  "53.727273, the voyage's total hours, which include port and field time too."],
 "Sailing hours are the NM over the speed: 206 over 11 is 18.727273 hours in calm weather. The factor of 1.2 on sailing lifts them to 22.472727, but this call states a factor of 1. 23.000000 is the field hours and 53.727273 the whole calm voyage.")

q(0, "With a weather factor of 1, the Ekene installations EKA, EKJ, EKB and EKF state 6, 8, 4 and 5 field hours. What field hours does the engine return for one milk run through all four?",
 "23.000000, the stated field hours of the four installations added up.",
 ["27.600000, the four installations' field hours after a factor of 1.2 is applied to them.",
  "8.000000, the jack-up's field hours alone.",
  "6.000000, the first stop's field hours, since a milk run works cargo at only one stop."],
 "Field hours are the sum of the stated field hours of the installations the voyage serves, so the milk run carries 6 + 8 + 4 + 5 = 23.000000 hours in calm weather. 27.600000 is the rainy-season figure with the factor on field time, and a milk run works cargo at every stop, so neither the longest call nor the first one is the answer.")

q(1, "How often does the engine count a voyage plan's stated port hours?",
 "Once a voyage, at the base: a milk run pays them once and four dedicated voyages pay them four times.",
 ["Once at every installation the voyage calls at, so a milk run through four stops pays them four times.",
  "Once a week, spread evenly across all the voyages the vessel sails in that week.",
  "Only on the return leg of a voyage, and only when the weather factor names port time."],
 "Port hours are the stated hours at the base, counted once a voyage: the Ekene milk run carries 12.000000 port hours, and so does each of the four dedicated voyages. Time alongside an installation is field time, stated per installation. The engine has no week at this tier, and the weather choice changes how long port time is and leaves the count alone.")

q(3, "On the Ekene PSV's dedicated route (11 knots, 12 port hours, a factor of 1.2 on sailing and field time), EKJ is 68.000000 NM from the base with 8 field hours. What total hours does the engine return for the EKJ voyage?",
 "36.436364, its sailing, port and field hours added after the factor.",
 ["32.727273, the total hours of the dedicated voyage to EKA, the nearest installation to the base.",
  "38.727273, the total hours of the dedicated voyage to EKF, the farthest installation on the route.",
  "14.836364, the EKJ sailing hours alone."],
 "The EKJ voyage sails 136.000000 NM for 14.836364 hours after the factor, spends 12.000000 port hours at the base and 9.600000 field hours alongside the jack-up, for 36.436364 hours in all. 32.727273 and 38.727273 are the EKA and EKF voyages, and 14.836364 leaves out port and field time.")

q(2, "What goes into the days the engine returns for a voyage?",
 "Every hour the voyage spends, sailing, port and field, after the weather factor, divided by 24 with no rounding.",
 ["Sailing hours alone divided by 24, since port and field time are reported as separate standby days.",
  "The total hours divided by 24 and rounded up to whole days, so every voyage fits a daily schedule.",
  "The total hours divided by 12, since a working day alongside an installation is taken as 12 hours."],
 "A voyage's days are its total hours over 24, after the weather factor: the milk run's 62.072727 hours are 2.586364 days. The engine counts every activity, rounds nothing into whole days and uses no working day for a voyage. A day here is a planning measure of 24 hours, with no clock behind it.")

q(1, "The four Ekene dedicated voyages take 1.363636, 1.518182, 1.372727 and 1.613636 days. What total does the engine return, and how does it compare with the milk run?",
 "5.868182 days in all, against 2.586364 days for one milk run voyage through the same four installations.",
 ["1.613636 days, the longest of the four, since the four voyages are taken to sail at the same time.",
  "2.586364 days, the same as the milk run, since both routes serve exactly the same four installations.",
  "5.868182 days for the milk run and 2.586364 for the dedicated route, as the milk run sails further."],
 "When a route has several voyages the engine adds them, so the dedicated total is 5.868182 days, and the milk run is a single voyage of 2.586364 days. One vessel sails the dedicated voyages one after another, so the longest alone is not the total, and the milk run is the shorter of the two routes here.")

q(0, "Why does one Ekene milk run take fewer days than the four dedicated voyages together, with the same vessel, speed, field hours and weather?",
 "It sails fewer NM in all, because the installations sit close together, and it pays the 12 port hours once.",
 ["It sails at a higher speed, since the engine states every milk run at the AHTS's 12 knots.",
  "It carries a lower weather factor, since the factor is named only on the dedicated voyages.",
  "It leaves out the field hours at the installations the vessel passes, since it only stops at one."],
 "The milk run sails 206.000000 NM, where the four dedicated voyages sail 124, 136, 148 and 190 NM, and it pays the port time once where the dedicated route pays it four times. The comparison holds the vessel, the speed, the field hours and the weather the same on both sides, so none of those can explain the gap, and a milk run stops at every installation.")

q(3, "Two installations sit at one location. A milk run through them states legs of 30, 0 and 30 NM at 10 knots. What does the engine do with the leg of 0?",
 "It accepts it, and returns 6.000000 sailing hours and 12.000000 hours in all.",
 ["It refuses the leg, since every leg distance must be a finite number above 0 NM.",
  "It merges the two stops and asks for two legs.",
  "It replaces the 0 with the smallest positive leg of the route so no leg takes no time."],
 "A leg may be 0 NM: the rule is a finite number at or above 0, so the leg is accepted and the voyage sails 60 NM at 10 knots, 6.000000 hours, for 12.000000 hours in all. Only a negative leg is refused. The engine merges no stops and replaces no stated figure.")

q(2, "The Ekene milk run's stops are stated as EKA, EKJ, EKB, with EKF left out. What does the engine return?",
 "A refusal, in its own words: route.stops must be an array naming each of the 4 installations once, in the order sailed; got [\"EKA\",\"EKJ\",\"EKB\"]",
 ["A voyage plan through the three stops named, with EKF left off the route and its cargo left at the base.",
  "A refusal, in its own words: route.stops[3] must be an installation id (EKA, EKJ, EKB, EKF); got \"EKX\"",
  "A refusal, in its own words: route.legsNm must be an array of 5 leg distances in nautical miles (base to the first stop, stop to stop, the last stop back to the base); got [62,9,12,28]"],
 "A milk run must name every installation of the call once, so a missing stop is refused on route.stops and the message prints the three stops it got. The engine plans no partial route. The message about route.stops[3] answers an unknown id, EKX, and the legsNm message answers four legs stated for four stops.")

q(0, "A milk run's stops are typed as EKA, EKJ, EKA, EKF. Which field does the engine's refusal name?",
 "route.stops[2], the third entry, where EKA is named for the second time.",
 ["route.stops[0], the first entry, where EKA is named for the first time on the route.",
  "route.legsNm, since a repeated stop leaves one leg of the route with no destination.",
  "installations[0].id, the first installation listed."],
 "The engine's own words are: route.stops[2] repeats \"EKA\"; a milk run visits each installation once. The first naming of EKA is valid, and the repeat is where the fault sits. The legs and the installation list are not at fault, and the message starts with the field it refuses, so the panel points at the third stop.")

q(1, "A milk run box also states distanceFromBaseNm of 62 for EKA, the first installation in the call. What does the engine return?",
 "A refusal, in its own words: installations[0].distanceFromBaseNm is read only when route.mode is \"dedicated\"; a milk run takes its distances from route.legsNm",
 ["A voyage plan that sails 62 NM out to EKA first and then sails the stated legs from there, adding the distance as an extra leg at the start of the milk run.",
  "A voyage plan that sails the stated legs and quietly drops the distance from the base, since a milk run has no use for it, with no word about it in the reasons.",
  "A voyage plan on a dedicated route, since a distance from the base switches the route mode over from a milk run to dedicated voyages for every installation."],
 "Each route mode reads its own distances, and a distance given to the mode that does not read it is refused by name. The engine drops no input silently, adds no leg of its own and switches no mode: the route mode is a required input the call states.")

q(3, "A milk run through four stops states only four legs, 62, 9, 12 and 28 NM. Which input is refused, and why?",
 "route.legsNm, since four stops need 5 legs, and the last one, back to the base, is missing.",
 ["route.stops, since four legs can serve only three stops, so the engine asks for a stop to be removed.",
  "Nothing: the engine closes the route by sailing the first leg in reverse, 62 NM back to the base.",
  "vessel.speedKnots, since the voyage's sailing hours cannot be found until every leg is stated."],
 "The engine's own words are: route.legsNm must be an array of 5 leg distances in nautical miles (base to the first stop, stop to stop, the last stop back to the base); got [62,9,12,28]. The stops are valid, the engine invents no return leg, and the speed is stated, which clears it.")

emit(Q, '/root/cat-wip-marine/banks/sc4b_m02.json', expect_n=15)
finish()
