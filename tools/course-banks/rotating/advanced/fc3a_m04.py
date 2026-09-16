import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Expert m04, The Machine, the Driver and the Fuel. Digest section 14.

q(2, "Hold the rate, the gas and the temperature and move only the suction pressure. The inlet volume runs 9555.2490 acfm at 30.000000 psia and 204.9510 acfm at 1200.000000 psia. What is the same on every row?",
 "The molar flow, which is what a rate in MMscfd actually is.",
 ["The mass flow in lb per hr, which the volume is derived from by dividing by a density.",
  "The compressibility, since z is evaluated once at the standard base rather than at each suction.",
  "The brake horsepower, because the screen is asked at a fixed power and only the casing size moves."],
 "A rate in MMscfd is a molar quantity dressed as a volume, measured at a standard pressure and temperature no part of the plant is at. Raise the pressure and the same moles occupy less space.")

q(0, "What three quantities does the actual inlet volume at a suction state depend on?",
 "The absolute pressure, the absolute temperature and the compressibility at that state.",
 ["The absolute pressure, the specific gravity and the overall ratio the duty asks for.",
  "The absolute temperature, the compressibility and the polytropic efficiency of the machine.",
  "The absolute pressure, the mass flow and the molecular weight of the gas being moved."],
 "At the SOKU suction of 92.000000 psia the volume is 3090.0016 acfm. The engine evaluates z at the suction rather than assuming it, which is why a bad suction state is refused before a volume is produced.")

q(1, "A small high-pressure gathering duty at 14.6564 acfm, an overall ratio of 3.000000 and 180.0000 brake hp is screened. What comes back, and on what first reason?",
 "Reciprocating, on the reason that only 14.7 acfm at suction is too small for a centrifugal wheel to be efficient.",
 ["Reciprocating, on the reason that an overall ratio of 3.000000 is more than a wheel takes in one bite.",
  "Either, on the reason that at 180.0000 brake hp both machine types are viable and other criteria decide.",
  "Centrifugal, on the reason that a duty this small is a packaged machine and a wheel is the cheaper package."],
 "The branch is decided on the inlet volume first and on the ratio second. A second reason follows, that under 200 bhp a packaged gas-engine recip is the usual answer.")

q(3, "Two of the four screened duties reach the same word. The deep booster sits at 2015.0151 acfm and takes a ratio of 11.500000, and it is also called reciprocating. Which road did it take there?",
 "It is chosen on ratio rather than on size, because recips take ratio far more happily than centrifugals.",
 ["It is chosen on brake power, because 2100.0000 brake hp is inside the band where a recip is the usual package.",
  "It is chosen on size as well, since 2015.0151 acfm is below the volume where a wheel becomes efficient.",
  "It is chosen on the compressibility at its suction, which the screen reads before it reads the volume."],
 "That is the argument for reading the reason line. A recip chosen for size becomes a wheel if the duty grows, and a recip chosen for ratio does not.")

q(0, "Four duties are put through the screen. What do their returns show about recommendations and reasons?",
 "There are 4 distinct first reasons and fewer distinct recommendations, because two duties reach reciprocating by different roads.",
 ["There are 4 distinct recommendations and 4 distinct first reasons, one of each per duty.",
  "There are 4 distinct recommendations and 2 distinct first reasons, since the reasons pair up by machine type.",
  "There are 2 distinct first reasons and 4 distinct recommendations, since the reason line repeats where the verdict does not."],
 "A recommendation on its own does not say what would change it. The reason line is the only thing that says which road a duty took to the branch it reached.")

q(2, "The fourth branch of the screen is the word \"either\", and 7962.6965 acfm at 5000.0000 brake hp is what reaches it. What is such a return worth?",
 "It is a real answer, and its reason line hands the decision back with the criteria attached.",
 ["It is a placeholder for a branch the screen has not been given thresholds for yet.",
  "It is a refusal in a softer shape, and a caller should treat it as a recommendation that is missing.",
  "It is the branch the screen falls back to whenever the inlet volume sits between two of its thresholds."],
 "The reason line says the decision goes on availability, footprint, maintenance philosophy and driver. A screen that always named a machine would be pretending to a resolution it does not have.")

q(3, "The thresholds the screen turns on are 500 and 5000 and 20000 acfm, ratios of 4 and 6, and 200 and 10000 brake hp. What is their standing in this course?",
 "They are held for literature, so no graded value anywhere in the course is a recommendation.",
 ["They are measured out of the engine by bisection, so they are treated as derived constants.",
  "They are published thresholds this repository carries, so a recommendation can be graded against them.",
  "They are defaults a caller may override, so they are graded only where the caller states them."],
 "They are customary and unsourced here. Each held item is used, each is printed, and none of them decides a graded answer.")

q(1, "The screen asks for the compressibility at the suction before it asks for the volume. Why is a finiteness test on the volume not enough?",
 "A negative number is finite, and a suction below absolute zero produces a negative volume.",
 ["A finiteness test would accept an Infinity, which is what a suction at exactly absolute zero returns.",
  "The volume is computed from the compressibility, so a finiteness test on it can only repeat the z check.",
  "A finiteness test cannot see the ratio, and the branch is decided on the ratio before the volume."],
 "A screen that only asked whether the answer was finite would take that negative volume, find it below about 500 acfm and recommend a reciprocating machine on it.")

q(1, "Three suction states are refused at the screen. Which refusal names a reduced pressure?",
 "The one at 24000.000000 psia and 100.0000 degF, where Ppr 35.814 sits above the DAK validity limit of 30.",
 ["The one at 1000.000000 psia and -150.0000 degF, where Tpr 0.848 sits below the validity range.",
  "The one at 200 psia and -600 F, where the z-factor needs a temperature above absolute zero.",
  "All three, since the screen reports both reduced coordinates on every refusal it makes."],
 "The colder probe is refused on Tpr 0.848 against 1.0, and the state below absolute zero is refused before any reduced coordinate can be formed at all.")

q(3, "The SOKU driver runs at a heat rate of 8100.000000 Btu per hp hr on a fuel gas of 985.000000 Btu per scf. What does it burn, and at what thermal efficiency?",
 "36296606.9250 Btu per hr, which is 0.884384331 MMscfd, at 31.412760 percent.",
 ["36296606.9250 Btu per hr, which is 3.401478 MMscfd, at 31.412760 percent.",
  "8550254.4381 Btu per hr, or 0.884384331 MMscfd, at 41.039251 percent.",
  "36296606.9250 Btu per hr, or 0.884384331 MMscfd, at a thermal efficiency of 23.131214 percent."],
 "Btu per hour is what the driver needs and MMscfd is what the field loses. The second figure is the one a commercial reader can act on.")

q(0, "The SOKU station compresses 26.000000 MMscfd and its driver burns 0.884384331 MMscfd. What is that as a share, and how is it derived?",
 "3.401478 percent, the fuel over the throughput times 100.",
 ["3.401478 percent, the fuel over the brake horsepower of 4481.0626 times 100.",
  "0.884384331 percent, which is the fuel figure read directly as a percentage of the stream.",
  "31.412760 percent, which is the thermal efficiency and is the same quantity stated differently."],
 "Part of what arrives is consumed making the rest of it move, and that part is gas the field does not sell. On a field where the gas has a contract price it is directly a revenue number.")

q(2, "Walk the driver heat rate from 6200.000000 to 11000.000000 Btu per hp hr. What happens to the fuel, the thermal efficiency and the share of throughput?",
 "The fuel and the share rise while the efficiency falls, taking the share from 2.603601 to 4.619291 percent.",
 ["All three of them rise, with the share going from 2.603601 to 4.619291 percent as the efficiency climbs with it.",
  "The fuel rises and both the efficiency and the share fall, since a worse driver moves less of the stream than a good one.",
  "The fuel and the efficiency both fall while only the share rises, from 2.603601 to 4.619291 percent."],
 "At 6200.000000 Btu per hp hr the fuel is 0.676936155 MMscfd at 41.039251 percent, and at 11000.000000 it is 1.201015758 MMscfd at 23.131214 percent.")

q(3, "The driver calculation refuses a heat rate of 2000 Btu per hp hr. What sets that boundary, and how was it confirmed?",
 "It is the 2544.433577644024 Btu that one horsepower-hour is, read out of the thermal efficiency and again by halving until the refusal turns on, with the two routes differing by 0.",
 ["It is a threshold with a safety factor on it, chosen so a plausible datasheet is never rejected by accident.",
  "It is the quotient of the fuel heating value of 985.000000 Btu per scf and the heat rate, checked against the published golden cases.",
  "It is the 33000.000000 ft lbf per minute that a horsepower is, converted to Btu per hour inside the units module."],
 "A driver delivering one horsepower-hour of shaft work on less fuel heat than that would be creating energy. The refusal boundary IS the constant rather than a policy laid over it.")

q(1, "The universal gas constant measured out of the polytropic head is 1545.350400 ft lbf per lbmol degR, and the gas properties module exports the same value once multiplied by 144. What do the two figures do?",
 "They give a quotient of 1.000000000000000 and a difference of 2.2737367544323206e-13.",
 ["They give a quotient of 1.324503311, which is the factor the polytropic efficiency contributes.",
  "They differ by 144, which is the square inches per square foot the export has to be scaled by.",
  "They cannot be compared, because the head route reports in ft lbf per lbm and the export in psia ft3."],
 "One value of one constant, in two modules where one imports from the other. A package holding two opinions could not say which of them any answer carries, however small the gap.")

q(0, "The mass-flow route in this module gives 379.483571856287 standard cubic feet per lbmol and the inlet-volume route reveals a standard pressure over temperature of 0.028279485058 psia per degR. What is shown by putting them together?",
 "That the two routes reach the same quotient with a difference of 0, so the module has one standard base.",
 ["That the volume route uses a base 144 times the mass route's, which is the square inches per square foot.",
  "That the two bases differ by 2.2737367544323206e-13, which is the same residual the gas constant shows.",
  "That the standard pressure and the standard temperature can each be recovered separately from the volume route."],
 "That quotient is all the volume route reveals about its base from outside, and the two figures cannot be separated from it. The same MMscfd is one molar quantity whether it becomes a mass flow or an inlet volume.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/advanced/fc3a_m04.json', expect_n=15)
finish()
