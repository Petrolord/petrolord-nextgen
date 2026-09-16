import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Professional m05, distances on a site. Digest Section 11 only: the table,
# the haversine distances, the computed flare and pool setbacks, the published
# cases and the held items. Metres throughout, radiation in kW/m2.

q(3, "On the ERHA plot the flare carries a table requirement of 90.000000 m and a computed radiation setback of 64.6458 m. What separates those two figures?",
 "The table figure is a recorded value that stays where it is, and the setback moves with the relief rate and the allowable it was solved for.",
 ["The table figure covers a flare against a control room and the setback covers a flare against a tank, so the two belong to different pairs on the plan.",
  "The table figure already carries the allowable of 4.730000 kW/m2 inside it, and the setback re-derives the same requirement from the duty as a check on it.",
  "Both are computed, and the difference between them is the transmissivity."],
 "The flare releases 828000.0000 kW, and a change in the duty moves 64.6458 m. Nothing a flare does moves 90.000000 m.")

q(1, "What may a course say about the spacing figure of 90.000000 m?",
 "That it is a customary figure this engine records with no source checked, waiting to be replaced by a site standard, so no conclusion may be built on the number itself.",
 ["That it is the API 521 requirement for a control room at an allowable of 1.580000 kW/m2, which is why a flare is held further off from a control room than from a tank at 60.000000 m.",
  "That it came out of the same point source model that gives 64.6458 m, at a stricter allowable.",
  "That it is the distance below which a layout fails whatever the duty."],
 "The table figures and the API 521 labels are both HELD FOR LITERATURE. A course may teach what a table is and how a lookup behaves.")

q(2, "The lookup returns 0.000000 m for a separator against its own dump valve and null for a tank against a skid. What is the difference between those two answers?",
 "A zero is a requirement of nothing that the check counts on its own, and a null means the table carries no figure for that pair at all, so nothing was judged.",
 ["A zero is a pair the check passes and a null is a pair it fails, since an unknown requirement is treated as the strictest figure the table carries anywhere on the plan.",
  "A zero comes out of the table and a null comes from two items sharing a set of coordinates.",
  "There is none: both are read as no requirement."],
 "On ERHA 21 pairs carry no requirement against 69 comparisons that do. Reading a null as a zero counts a pair that was never checked as a pair that passed.")

q(0, "What does a separator against a tank return, and what does a tank against a separator return?",
 "15.000000 m both ways, because the lookup is symmetric.",
 ["15.000000 m in the first direction and 30.000000 m in the second, since the table is written from the item with the larger inventory towards the smaller one.",
  "15.000000 m in the first direction and null in the second, since a pair is recorded once and the reverse order has to be entered separately.",
  "It depends on which of the two carries a radiation source, because a computed setback replaces the table figure."],
 "A pair the table does not carry comes back as null rather than a guess, and that holds in either direction.")

q(1, "Why does the engine measure the ERHA plot on a sphere rather than on a flat grid?",
 "Degrees of longitude shrink as the latitude rises, so a plan that reads a difference in degrees as a fixed number of metres is wrong by an amount that depends on where the site sits.",
 ["The datum at 4.741200 north and 7.183600 east is quoted in degrees and the engine carries no projection, so it works on the sphere those coordinates were written on and accepts whatever error follows from that.",
  "A spacing table is written edge to edge while a plan measures centre to centre, and only a spherical measurement can carry the correction for the size of each item on the plot.",
  "The published cases were solved with Vincenty, and a flat grid would disagree with them at 1111.9508 m."],
 "The engine uses the haversine formula. Over a few hundred metres the choice between a sphere and an ellipsoid does not matter and the choice between a sphere and a grid does.")

q(3, "The published distance cases agree to the figure printed across haversine, Vincenty and the straight chord, including 55.5975 m at high latitude. What does that agreement show?",
 "At the scale of a plot plan the earth model makes no difference to the answer, which is what lets one spherical formula serve the whole site.",
 ["That the three are one formula written three different ways, so the published cases are checking the coordinate handling rather than any of the geometry behind it.",
  "That a flat grid would agree with them as well, since every method converges below 1111.9508 m and the equator case is the longest distance published.",
  "That the engine checks its distances against an ellipsoid while it runs."],
 "Vincenty solves on an ellipsoid and the chord cuts straight through the earth. Agreement at 89.4099 m and at 489.2584 m is what makes a sphere defensible here.")

q(0, "Every distance on the plot runs from one item's icon to another's. What does that leave out when a requirement is written edge to edge?",
 "Half of each item, which is negligible on a small one and is 9.0000 m on a tank inside an 18.000000 m bund, and the omission always makes the plot look more generous than it is.",
 ["Nothing, since a table figure such as 15.000000 m is written centre to centre for exactly this reason.",
  "The bund itself, which is not on the plan and carries no coordinates.",
  "Half of the larger item only, the smaller one being inside the tolerance."],
 "It is not a rounding error and it always points the same way. The pool fire result reports a radius from the centre and a setback from the edge for that reason.")

q(2, "The ERHA flare relieves 18.000000 kg/s of gas at 46000.000000 kJ/kg. What is the first figure in the chain, and what is done to it?",
 "828000.0000 kW of heat release, of which 0.300000 is radiated and then spread over a sphere down to the allowable.",
 ["The radiated fraction of 0.300000 applied to the mass rate first, which gives the part of the 18.000000 kg/s burning as radiation before the heat of combustion is applied to it.",
  "The allowable of 4.730000 kW/m2 times the area of a sphere at the table distance of 90.000000 m, which is the power the setback is then solved against.",
  "The flame height, which the Thomas correlation gives before any radiation is worked out."],
 "Mass rate times heat of combustion gives 828000.0000 kW. A fraction of that is radiated, and the point source model asks where the intensity falls to 4.730000 kW/m2.")

q(3, "The published flare at 920000.0000 kW is checked by reading the intensity back at its own setback of 68.1427 m. What does that check establish?",
 "That the distance solves to the allowable it was given, since the intensity there reads 4.7300 kW/m2.",
 ["That the point source model has been validated against a measured flare, since a reading of 4.7300 kW/m2 could only come from an instrument standing at that distance.",
  "That the transmissivity of 1.000000 on that case is right, since any loss in the air would leave the intensity under the allowable at 68.1427 m.",
  "That 68.1427 m is conservative, the intensity there being under the allowable."],
 "The arithmetic is checked by walking it backwards. The published cases are synthetic, so agreement is a check on the arithmetic rather than on the physics.")

q(0, "The 215000.0000 kW published flare needs 49.3602 m while the 920000.0000 kW one needs 68.1427 m. Why is the smaller duty not a proportionally smaller distance?",
 "Radiation spreads over a sphere, so distance follows the square root of the power, and the smaller case also carries a stricter allowable of 1.580000 kW/m2 with a transmissivity of 0.900000.",
 ["The smaller case radiates 0.250000 of its heat against 0.300000, and a setback is proportional to the radiated fraction rather than to the heat release behind it.",
  "The setback is bounded below by the flame height, which is what holds 49.3602 m up.",
  "The smaller flare was solved from a different datum."],
 "The inputs differ in three places: the duty, the allowable and the transmissivity. None of the three moves a setback in proportion.")

q(2, "The ERHA bund is 18.000000 m across. What does the engine work out from that, and in what order?",
 "A pool area of 254.4690 m2, a mass burning rate of 13.9958 kg/s at 0.055000 kg/m2/s, a heat release of 601819.1967 kW, a flame of 23.7996 m by Thomas, and a radius of 59.5294 m.",
 ["A flame height of 23.7996 m first, then the heat release of 601819.1967 kW that implies, then the pool area of 254.4690 m2 the flame is standing on.",
  "A radius of 59.5294 m out of the table, then the heat release that radius implies at 4.730000 kW/m2.",
  "A setback of 50.5294 m, then the radius standing 9.0000 m outside it."],
 "Each step is arithmetic on the step before it, and every one of them is driven by the size of the bund.")

q(1, "The pool result reports a radius of 59.5294 m and a setback of 50.5294 m. Which figure does a centre-to-centre layout check need?",
 "The radius of 59.5294 m, because the tank icon sits at the centre of its bund.",
 ["The setback of 50.5294 m, because a setback is the distance a neighbouring item has to stand at while the radius is an intermediate figure inside the calculation.",
  "Either of them, since the two differ by 9.0000 m and the check applies its own tolerance to a radiation comparison.",
  "The setback of 50.5294 m, with the half bund of 9.0000 m added to the measured distance instead of to the requirement."],
 "Passing the edge figure into a centre-to-centre check leaves every comparison short by half the bund. That is the defect that failed open.")

q(0, "A pool fire run at an allowable of 4000.000000 kW/m2 returns a radius of 2.2745 m, an edge setback of 0.0000 m and setbackStatus within-pool-edge. What is the engine saying?",
 "The radius lies inside the pool edge at 10.0000 m from the centre and well inside the flame height of 25.6078 m, so the answer is a lower bound rather than a distance to build to.",
 ["The calculation failed and the zero is a placeholder, which is why a status is attached in the place of a distance somebody could act on.",
  "The pool is too small to radiate at that allowable, so the setback is reported as zero and the reader is expected to fall back on the spacing table for the pair.",
  "A neighbouring item may stand against the bund wall, the setback from the edge being 0.0000 m."],
 "The engine reports 0.0000 m rather than a negative distance and says why. It instructs a designer to use a solid-flame view factor model for design.")

q(2, "What does the pool fire model leave out?",
 "A view factor and a solid-flame surface emissive power, which is why it under-predicts close to the fire where the flame is not small.",
 ["The flame height, which is why the Thomas correlation has to be run as a separate step before a radius such as 59.5294 m can be reported for a bund at all.",
  "The atmospheric transmissivity, which has to be applied to the reported radius by hand once an allowable has been chosen for the target.",
  "The burning rate of 0.055000 kg/m2/s."],
 "It spreads the radiated fraction over a sphere, which is a good approximation at a distance. Inside the flame height it under-predicts, and the status says so.")

q(1, "The flare stands 46.1777 m from the control room, against a table figure of 90.000000 m and a computed setback of 64.6458 m. What has the plot been told?",
 "Two separate findings: the spacing breaks a convention somebody recorded, and this flare at this duty puts more than 4.730000 kW/m2 on that building.",
 ["One finding recorded twice, since the radiation setback is the calculation that lies behind the table figure and the shorter of the two is the one that governs the plot.",
  "That the table figure is superseded, a computed setback being the requirement wherever both exist.",
  "That the plot passes on radiation and fails on spacing."],
 "The pair fails both. A table cannot know a relief rate, so a flare well inside a 90.000000 m rule can still exceed its allowable.")

emit(Q, '/root/fc-wip-separation/banks/fc1i_m05.json', expect_n=15)
finish()
