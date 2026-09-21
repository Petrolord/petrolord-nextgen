import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Expert m04, Targets and the path. Digest SECTION 22
# (carbonAbatement.decarbonisationPath on the invented AGBOR records: the
# straight-line target, the year rows, the unabated gap and its note, the
# partial inventory, the unscheduled measure and the refusals). Every figure is
# invented for this course, on IPCC AR6 GWP100, fossil methane. 15 questions.

q(1, "On the invented AGBOR path, which year is firstShortfallYear, and what gap does the path print in it?",
 "2027, with a gap of 494.298 t",
 ["2028, with a gap of 798.595 t",
  "2033, the end year, with a gap of 1370.083 t",
  "2029, when the Heat integration project starts"],
 "The path returns firstShortfallYear: 2027, and the 2027 row prints an unabated gap of 494.298 t. 2028 prints 798.595 t, 2033 prints 1370.083 t, and 2029 prints 0.000.")

q(2, "The Agbor electricity factor is left blank and the path is built on that inventory. What does it print for finalGapTonnes?",
 "0.000 t, on a baseline of 45112.276 tCO2e that is reportable false",
 ["1370.083 t, the same final gap the path prints on the full inventory",
  "3220.083 t, with purchased electricity named as unscheduled",
  "A refusal: the baseline must be a positive tonnage"],
 "The path ON A PARTIAL INVENTORY: with the electricity factor blank the inventory totals 45112.276 tCO2e and is reportable false; the path on it prints finalGapTonnes 0.000. 1370.083 t is the full inventory's final gap and 3220.083 t the path with a measure unscheduled.")

q(0, "Built on the partial Agbor inventory instead of the full one, which path figure moves from 39270.193 t to 31578.593 t?",
 "The target in the end year",
 ["finalGapTonnes, the gap in 2033",
  "The emissions the path prints in 2033",
  "The tonnes abated in the end year"],
 "The path prints the target in the end year as 39270.193 t on the full inventory and 31578.593 t on the partial one. finalGapTonnes moves from 1370.083 to 0.000, and the measures are the same six.")

q(3, "How does decarbonisationPath report the Agbor gap of 1370.083 t in the end year?",
 "As unabated, with no measure identified",
 ["As a wedge of future measures that closes it by 2033",
  "As a cost, at the curve's weighted average of 18.7868 USD a tonne",
  "As a refusal until a measure is named to close it"],
 "The gap note: \"The gap is reported as unabated with no measure identified. A wedge is drawn only for an identified measure, because a plan needs a named measure behind every wedge.\" The path prints finalGapTonnes 1370.083 and no refusal.")

q(3, "In 2029 the Agbor path prints emissions of 48690.276 t against a target of 48887.383 t. What does the unabated gap column print?",
 "0.000 t, by the rule in every row",
 ["494.298 t, carried on from 2027",
  "798.595 t, carried on from 2028",
  "815.785 t, the gap before 2033"],
 "On the path, in every row the unabated gap is emissions less the target where that is positive, else 0.000. The 2029 row prints 0.000. Each row is read on its own emissions and target: 494.298 t is the 2027 row and 798.595 t the 2028 row, and 815.785 t is the 2032 row of the unscheduled path.")

q(1, "Vapour recovery on the storage tanks is given no start year. What does the path do with it?",
 "Names it in unscheduledMeasures and leaves it off; finalGapTonnes 3220.083",
 ["Starts it in 2026, the baseline year, so finalGapTonnes stays 1370.083",
  "Refuses the whole path until a start year is entered for the measure",
  "Starts it in 2033, the end year, and prints finalGapTonnes 1850.000"],
 "On the path, a measure with no start year is named and left off the path: unscheduledMeasures Vapour recovery on the storage tanks (no start year); finalGapTonnes 3220.083. The course lists the rule: a measure with no start year is named.")

q(0, "The course prints the unscheduled path's final gap less the scheduled one as 1850.000 t. Which figure does it say that matches?",
 "The tonnes a year of the measure left unscheduled",
 ["The gap the unscheduled path prints in 2032",
  "The full baseline less the partial baseline",
  "Repair failed steam traps' tonnes a year"],
 "On the path, that gap less the scheduled plan's 1370.083 is 1850.000 t (computed here), the vapour recovery measure's tonnes a year. The unscheduled 2032 gap is 815.785 t, the full baseline less the partial is 10988.000 tCO2e, and Repair failed steam traps abates 1150.000 t.")

q(2, "The same six Agbor measures are run against an invented baseline of 12000 t. What comes back?",
 "A refusal naming 2030, when the measures abate 13610 t",
 ["A path whose emissions reach 0.000 t in 2030 and stay",
  "A path with finalGapTonnes 0.000 and no shortfall year",
  "A refusal naming 2031, when the measures abate 15460.000 t"],
 "The engine returns REFUSED: In 2030 the scheduled measures abate 13610 t against a baseline of 12000 t. Emissions cannot fall below zero, so check the measures for double counting or a source outside the baseline. overAbatedYear 2030.")

q(0, "An inventory that computed nothing is handed to decarbonisationPath as a baseline of 0. What does the engine say?",
 "It refuses: the baseline must be a positive tonnage.",
 ["It draws the path from 0 and prints every gap as 0.000.",
  "It builds the path on the partial total of 45112.276 tCO2e.",
  "It names the inventory in unscheduledMeasures and goes on."],
 "REFUSED: The baseline must be a positive tonnage. An inventory that computed nothing leaves the baseline unknown. It is a rule in force: a baseline that is not positive is refused. 45112.276 tCO2e is the partial inventory with the electricity factor blank.")

q(3, "Which invented Agbor measure joins the path in 2028?",
 "Solar for purchased power",
 ["Heat integration project",
  "Vapour recovery on the storage tanks",
  "Flare gas recovery"],
 "The start-year table gives Solar for purchased power 2028, and the 2028 row adds it to the two measures live since 2027. The other three start in 2029, 2030 and 2031.")

q(1, "Which invented Agbor measure is the last to go live on the path?",
 "Vapour recovery on the storage tanks, in 2031",
 ["Flare gas recovery, in 2030, as order 6",
  "Solar for purchased power, in 2028",
  "Heat integration project, in 2029, as order 3"],
 "The path's start years run from 2027 to 2031, and Vapour recovery on the storage tanks carries 2031; its row joins the measures live from 2031. Flare gas recovery starts in 2030, Solar for purchased power in 2028 and the Heat integration project in 2029.")

q(2, "How does the Carbon Studio draw the target on the Agbor path?",
 "In a straight line from 56100.276 t in 2026 to 39270.193 t in 2033",
 ["In steps, falling each time one of the measures goes live",
  "Flat at 16830.083 t, which is 30 percent of the Agbor inventory total",
  "In a straight line from 56100.276 t in 2026 to 16830.083 t in 2033"],
 "On the path, the target falls in a straight line from the baseline in 2026 to 30 percent below it in 2033, as the Carbon Studio draws it: 56100.276 t in 2026 and 39270.193 t in 2033. 16830.083 tCO2e is the curve's target, and each measure counts in full from its start year.")

q(3, "From 2031 to 2033 the Agbor target falls from 44078.788 to 39270.193 t. Which column holds one value across those years?",
 "Emissions, at 40640.276 t",
 ["Unabated gap, at 0.000 t",
  "Abated tonnes, at 13610.000 t",
  "Unabated gap, at 1370.083 t in each"],
 "The path prints emissions of 40640.276 t and abated tonnes of 15460.000 t in 2031, 2032 and 2033. The gap prints 0.000 in 2031 and 2032 and 1370.083 t in 2033, and 13610.000 t is the abated column of the unscheduled path.")

q(0, "One path summary figure agrees between the partial inventory and the full one. Which?",
 "firstShortfallYear, 2027",
 ["finalGapTonnes, 1370.083",
  "The end-year target, 39270.193",
  "The baseline, 56100.276 tCO2e"],
 "The path prints firstShortfallYear 2027 on both baselines. On the partial inventory the end-year target is 31578.593 t, finalGapTonnes 0.000 and the baseline 45112.276 tCO2e.")

q(2, "Take the unscheduled variant of the path. Which 2032 row does the course print for it?",
 "815.785 t of gap on 13610.000 t abated",
 ["0.000 t of gap on 15460.000 t abated",
  "3220.083 t of gap on 13610.000 t abated",
  "815.785 t of gap on 15460.000 t abated"],
 "The path with the measure unscheduled: 2032, abated 13610.000 t, emissions 42490.276 t, target 41674.491 t, gap 815.785 t. 3220.083 t is its 2033 gap, and 15460.000 t is the scheduled path's abated column.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/advanced/cefa_m04.json', expect_n=15)
finish()
