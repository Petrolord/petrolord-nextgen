import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Expert m01, The tank and the geometry three questions share.
# Digest SECTION 25 only. 15 questions.

q(1, "A designer changes the diameter of a fixed-roof tank and re-runs the shell calculation on its own. What does the opening lesson of this tier have against that?",
 "The capacity, the venting and the fire case are all read off the same geometry, so the venting has been moved without being looked at.",
 ["Nothing, provided the design liquid level was held, because the venting here is keyed to that level rather than to the capacity.",
  "Nothing, because the engine returns the venting totals in the same result whenever a shell geometry is submitted to it.",
  "The shell is the only answer a diameter moves, because the fire case is taken from the effective wetted height."],
 "The nominal capacity of 19608.4845 bbl is what the thermal rate is carried per barrel of, and the shell a fire wets is the same shell, so one geometry change moves three answers.")

q(3, "The engine returns a nominal capacity of 110093.4703 ft3 and 19608.4845 bbl for this tank. How does a reader confirm the second from the first without trusting the engine?",
 "Divide the returned cubic feet by the returned cubic feet in a barrel, which the result hands back as 5.614583333333333.",
 ["Divide the returned cubic feet by the barrels per foot of shell of 544.6801, which is the figure the result carries for turning a height into an inventory in barrels.",
  "Multiply the returned cubic feet by the cross section of 3058.1520 ft2, since the cross section is what carries a volume in feet across into a volume in barrels.",
  "There is no way to confirm it, because the conversion used is module private."],
 "The conversion is exact by definition and tankCapacity returns it as ft3PerBbl, so the barrels can be audited in one division rather than assumed.")

q(0, "Why does the tank result hand back the cubic feet in a barrel at all, when every engineer using it already knows the conversion?",
 "A conversion a package holds privately is one a reader is trusting on somebody else's word, and a returned one can be audited in a second.",
 ["Because the conversion in force changes with the temperature base the volumes are reported at.",
  "Because the conversion is a stated input the caller supplies, as the minimum plate thickness is.",
  "Because the API MPMS correction tables are not carried, so the factor has to travel with the barrel."],
 "It is exact by definition and returned as ft3PerBbl, which is why a reader can divide 110093.4703 ft3 by it and see whether the barrels agree.")

q(2, "A venting question and a custody transfer question are asked about the same tank. Which capacity does each one take?",
 "Venting takes the nominal capacity of 19608.4845 bbl, and the inventory question takes the working capacity of 18845.9323 bbl.",
 ["Both take the working capacity of 18845.9323 bbl, because nobody fills a fixed-roof tank to the top of the shell and a vent sized on a volume the tank never holds is oversized.",
  "Venting takes the working capacity of 18845.9323 bbl and the inventory question the nominal of 19608.4845 bbl.",
  "Both take the nominal capacity of 19608.4845 bbl, since the design liquid level is an operating limit."],
 "The thermal rate in this package is carried per barrel of capacity, and the inbreathing the engine returns for this tank is 19608.4845 scfh, which is the nominal capacity keyed straight through.")

q(0, "What makes the choice between the two capacities such a quiet mistake to make?",
 "Both are volumes in barrels for the right tank, so a result built on the wrong one still looks like a tank.",
 ["The engine returns only one of them on any given call, so a reader who needs the other has to call again with a different flag and may forget which one the first call gave.",
  "The two are close enough that no downstream check can separate them, since every tolerance in this course is set at half a unit in the last place of the class printed.",
  "The working capacity is returned in barrels and the nominal in cubic feet, so a mix-up shows up as a units error rather than as a wrong volume."],
 "The engine returns 19608.4845 bbl and 18845.9323 bbl side by side and both are honest answers to different questions, which is why the result carries a name against each.")

q(3, "The digest prints a relation between the two capacities of this tank. What does it actually give a writer permission to say?",
 "That the difference is 762.5522 bbl and the ratio is 1.040462, because the relation line carries both values, their difference and their ratio.",
 ["That the working capacity is the larger of the two by 762.5522 bbl, which is the difference printed as the first value less the second.",
  "That the ratio of 1.040462 is the working capacity over the nominal, so the working figure is what the line divides by.",
  "That the gap is small enough to ignore in a screening calculation, which is the judgement the line supports."],
 "The relation names the nominal at 19608.4845 bbl first and the working at 18845.9323 bbl second, so the difference of 762.5522 and the ratio of 1.040462 both run in that order.")

q(1, "Where does the gap between the nominal and the working capacity of this tank come from?",
 "The shell stands 36.000000 ft and the design liquid level is 34.600000 ft, so the working volume stops below the top of the shell.",
 ["The working capacity is taken over a smaller cross section than the nominal one, because the engine works the design case off the inside of the shell plate and the nominal case off the full circle.",
  "The nominal capacity is taken to the top of the roof and the working capacity to the top of the shell.",
  "The working capacity is reduced by the volume of the plate the shell is built from."],
 "Both capacities are the same cross section of 3058.1520 ft2 taken over different heights, and the design liquid level of 34.600000 ft is what stops the working figure.")

q(2, "Barrels per foot of shell comes back as 544.6801 on this tank. What is an operator actually doing with it?",
 "Turning a gauge reading, which is a height, into an inventory, which is a volume.",
 ["Converting the nominal capacity into the working one, since multiplying it by the difference between the two heights is how a design liquid level is applied to a volume.",
  "Checking the shell course table, because a course of shell one foot high holds that many barrels and the course heights are what the shell calculation is banded on.",
  "Reading off how much the tank can take in an hour, since a filling rate in barrels an hour becomes a rate of level rise once the figure is known."],
 "On a vertical cylinder the cross section of 3058.1520 ft2 does not change with height, so the figure is constant and one multiplication turns a level into barrels.")

q(0, "The design liquid level on this tank is moved and the diameter and the shell height are left alone. Which returned figure in the capacity block moves with it?",
 "The working capacity, which is the volume to the design liquid level and is returned as 18845.9323 bbl at the stated level.",
 ["The barrels per foot of shell, currently 544.6801, because the figure is the working capacity spread over the height the tank is actually filled to.",
  "The nominal capacity, currently 19608.4845 bbl, because a design level is the level a nominal volume is taken to.",
  "The cross section, currently 3058.1520 ft2, because the area the engine uses is the area available below the design liquid level rather than the full circle."],
 "The nominal capacity is taken to the top of the shell at 36.000000 ft and the cross section comes from the diameter, so neither of them knows anything about the design level.")

q(1, "Ask the tank capacity function for a fill height below zero. What comes back?",
 "The message `a fill height cannot be negative: a tank does not hold less than nothing`.",
 ["A capacity of zero barrels with a flag saying the fill height was clamped, which is the pattern the engine uses wherever an input falls outside a range it can still work in.",
  "A negative capacity in barrels, because the cross section and the conversion carry any height straight through, and a note advising that the sign be checked before use.",
  "An empty capacity field with no reason beside it, in the shape the fire venting result uses for a quantity the package will not compute."],
 "The guard sits at the input rather than in the screen that calls it, so the caller gets a reason and never a number that would sum and average downstream.")

q(3, "Why does a relation as simple as a cross section times a height need a guard at all?",
 "Multiplication has no opinion about physics, so a negative height returns a negative volume without complaint.",
 ["Because the cross section of 3058.1520 ft2 is itself derived from a squared diameter, so a sign error in the geometry survives into the area and cannot be seen in it.",
  "Because the conversion of 5.614583333333333 cubic feet in a barrel would otherwise be applied twice to a height below zero, which is where the sign is actually lost.",
  "Because a fill height below zero is the only tank input the engine cannot detect."],
 "A negative inventory sums, averages and plots like any other number, and it can cancel a real volume somewhere else in a total, which is why the refusal belongs in the engine.")

q(2, "A zero, a blank and a reason all appear in the same field on a screen. What is the lesson's point about the three?",
 "A zero says the tank holds nothing, a blank says the tool broke, and a reason says the question was malformed and names the part that was.",
 ["They are three renderings of one behaviour, so a caller can configure which of them the package returns.",
  "A blank and a reason mean the same thing to a downstream report, because neither of them carries a number.",
  "A zero is the safest of the three in a datasheet, because a reader who sees it goes back to the source."],
 "The tank capacity refusal returns the reason, and its message names the impossible input rather than leaving the caller with a value that looks like an answer.")

q(0, "Why is the design of this tier built on three answers coming out of one short list of geometry?",
 "Because a diameter, a shell height and a design liquid level are what the shell, the venting and the losses are all read from.",
 ["Because the three tank functions are one call in the engine, so a caller who asks for a capacity is handed the venting totals and the loss figures in the same result.",
  "Because the standard behind each of the three answers is the same document.",
  "Because the three answers share a governing predicate the engine forms once."],
 "From a diameter of 62.400000 ft and a shell height of 36.000000 ft the engine returns a cross section of 3058.1520 ft2 and a capacity of 19608.4845 bbl, and every later answer in the tier stands on those.")

q(1, "This course prints volumes in barrels to four decimals. What happens to a reader who rounds 18845.9323 bbl further before quoting it?",
 "They can fall outside the tolerance, because every tolerance here is at least half a unit in the last place the course prints.",
 ["Nothing at all, because a volume in the thousands carries no information in its later places and the tolerances in this course are set on relative terms instead.",
  "They land inside the tolerance anyway, since a rounding is smaller than half a unit in the last place.",
  "The figure stops being quotable, because the course grades a rendering rather than a value."],
 "Quote at the precision the source prints. A reader who reads the right row and copies it as printed is inside every tolerance this course sets.")

q(2, "Which figure in the capacity block is the one this tier keeps calling back to when it talks about breathing?",
 "The nominal capacity of 19608.4845 bbl, because the thermal rate in this package is carried per barrel of capacity.",
 ["The barrels per foot of shell at 544.6801, because the breathing terms are driven by how fast the level moves and that figure turns a level rate into a volume rate.",
  "The cross section of 3058.1520 ft2, because the vapour space above the liquid is the volume that breathes and the area is what sets it on a vertical cylinder.",
  "The working capacity of 18845.9323 bbl, because that is the volume the tank is designed to hold."],
 "Barrels per foot belongs to a gauge and the cross section to an area, and neither of them is what a rate per barrel of capacity is applied to.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/advanced/fc8a_m01.json', expect_n=15)
finish()
