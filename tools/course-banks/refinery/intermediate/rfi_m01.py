import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Professional m01, The Configuration.
# Every figure and refusal is from digest SECTIONS 9, 10 and 13 (the ABUA
# configuration, its refusals and the hydrotreater rows), as the m01 lessons
# quote them. Nothing reaches into the Expert tier's sections.

q(1, "In ABUA's unit table, which unit is the crude unit, and what in the configuration marks it?",
 "Crude distillation: it is the one unit whose feed column names no stream.",
 ["Naphtha reformer: naphtha is the first stream in every crude's yield row.",
  "Diesel hydrotreater: it is the unit the plan fills to 650000.00 bbl.",
  "None is marked: the plan treats every unit carrying a capacity as a crude unit."],
 "A unit with no feed is the crude unit. Crude distillation has no feed stream, so it takes crude and its yields are the crude yields.")

q(3, "The Naphtha reformer runs one barrel. What does it consume, and what does it make?",
 "One barrel of naphtha, making reformate 0.8500 and offgas 0.1000.",
 ["One barrel of crude, split by that crude's own naphtha yield of 0.2300.",
  "0.8500 of a barrel of naphtha for each barrel of reformate made.",
  "One barrel of reformate feed, making naphtha 0.8500 and offgas 0.1000 from it."],
 "A unit's throughput consumes one barrel of its feed stream for each barrel it runs. The reformer's feed is naphtha, and its yields are reformate 0.8500 and offgas 0.1000.")

q(0, "Which two of ABUA's streams does no crude yield at all?",
 "Reformate and ulsd.",
 ["Offgas and residue, which only units make from their feeds.",
  "Naphtha and gasoil, which the reformer and hydrotreater make.",
  "Kero and offgas, since the crude yields table marks both with a dash."],
 "The crude yield table prints a dash under reformate and ulsd for every crude. Those streams exist only because the reformer and the hydrotreater make them.")

q(2, "The Diesel hydrotreater's capacity is typed as 0. Which readings does the plan print for that entry?",
 "Hydrotreater throughput 0.00, crude run 735294.12 bbl, margin 424264.71.",
 ["Hydrotreater throughput 666608.70, crude run 2082608.70 bbl, margin 7173508.35.",
  "Hydrotreater throughput 650000.00, crude run 2029032.26 bbl, margin 7077935.48.",
  "No readings: the plan is refused, because a capacity of zero reads as a missing entry."],
 "A limit typed as 0 is a limit of zero, so the unit runs nothing and the refinery replans around it. The 666608.70 row is the blank entry and the 650000.00 row is the plan as typed.")

q(1, "The hydrotreater's capacity is left blank. What capacity does the plan report for it?",
 "No limit, which the plan reports as the number Infinity.",
 ["0.00, as for a capacity typed as 0.",
  "Null, since a blank box carries no figure.",
  "650000.00, the capacity the unit carried before the box was emptied."],
 "A limit left blank is no limit. The plan reports the capacity of a blank unit as the number Infinity, which is what no limit means to the solver.")

q(2, "What utilisation does the plan report for the hydrotreater typed as 0, and for the hydrotreater left blank?",
 "Null for both.",
 ["0.00 percent for the typed zero, null for the blank.",
  "100.00 percent for the blank, since it runs all it wants, and null for the zero.",
  "0.00 percent for both, because neither has a finite capacity to fill."],
 "A utilisation needs a finite capacity above zero. A blank is no limit and a zero cannot be divided into, so the plan prints null in both cases.")

q(0, "How far does the month's margin move from the plan as typed when the hydrotreater is shut, and when its box is emptied?",
 "-6653670.77 for the typed zero, and 95572.87 for the blank.",
 ["95572.87 for the typed zero, and -6653670.77 for the blank.",
  "-6653670.77 for the typed zero, and -230175.48 for the blank.",
  "-3047230.44 for the typed zero, and 95572.87 for the blank."],
 "The same box, emptied or zeroed, moves the month's margin in opposite directions. -230175.48 belongs to the crude unit at 1900000 barrels and -3047230.44 to the Forcados cargo cancelled.")

q(3, "A planner forgets to fill in what a barrel of Forcados (illustrative) costs. What status does ABUA's plan come back with?",
 "Status invalid, with a sentence that names the Forcados cost as the missing input.",
 ["Status optimal, running all 1100000.00 bbl of Forcados as if it were free.",
  "Status unbounded, because the empty cost box is read as having no limit.",
  "Status optimal, with Forcados dropped and Bonny Light and Brass River run alone."],
 "The rule for limits does not extend to money. The engine refuses with status invalid and the sentence \"Missing the cost of Forcados (illustrative). Enter 0 where the value really is zero.\"")

q(1, "What happens to ABUA's plan when a planner enters -1 in the Naphtha reformer's capacity box?",
 "It refuses: \"Naphtha reformer capacity must be zero or more; leave it blank for no limit.\"",
 ["A plan with the reformer shut, since any capacity at or below 0 means no throughput.",
  "A plan with no limit on the reformer, since a negative capacity is read as blank.",
  "The status infeasible, because no throughput can sit below a capacity of -1."],
 "A capacity below zero means nothing, so the input is invalid and refused. The sentence tells the planner to leave the box blank if no limit is meant.")

q(2, "Which entries does planRefinery's missing list carry when the Naphtha reformer's operating cost and Jet A-1's price are empty together?",
 "Both of them, in one list: the operating cost of Naphtha reformer and the price of Jet A-1.",
 ["One entry, the operating cost of Naphtha reformer, as the first empty box it meets.",
  "No entries: Jet A-1 is priced at 0 and reforming costs nothing, status optimal.",
  "One entry, the price of Jet A-1, since a product without a price makes the plan infeasible."],
 "The refusal reads \"Missing the operating cost of Naphtha reformer, the price of Jet A-1. Enter 0 where the value really is zero.\" and the engine returns the missing list with both entries.")

q(0, "Read ABUA's recipes and unit feeds. Where can a barrel of naphtha go?",
 "Into Naphtha export at 72.5000, or into the Naphtha reformer as its feed.",
 ["Into Gasoline at 111.0000, or into the reformer as feed.",
  "Into Naphtha export only; no ABUA unit takes naphtha as feed.",
  "Into the Diesel hydrotreater as its feed, or out as Naphtha export at 72.5000."],
 "Naphtha export's recipe is naphtha 1.0000, and the reformer's feed is naphtha. Gasoline's recipe is reformate, which only the reformer makes.")

q(3, "Which of ABUA's streams has neither a product recipe nor a unit to feed?",
 "Offgas.",
 ["Residue, which no unit takes as its feed stream.",
  "Reformate, which is made by the reformer alone.",
  "Kero, whose only product is sold as Jet A-1 fuel."],
 "Offgas goes into no product and no unit consumes it, so it can only be surplus. Residue goes into Fuel oil, reformate into Gasoline and kero into Jet A-1.")

q(1, "Every ABUA product carries a floor of 0.00. What does that floor mean for the month?",
 "No product has to be made at all.",
 ["Every product is capped at zero.",
  "The floors count as blank, so the ceilings are lifted too.",
  "The plan must sell at least one barrel of each product."],
 "The floor is the least the month must sell and the ceiling the most it can. A floor of 0.00 obliges nothing, and each ceiling still limits the sale.")

q(2, "A crude cargo is cancelled for the month. Which entry tells the plan so?",
 "Its availability typed as 0.",
 ["Its availability left blank, since the cargo now has no figure at all.",
  "Its cost typed as 0.",
  "Its cost left blank, so the engine drops the crude from the plan."],
 "A limit typed as 0 is a limit of zero. A blank availability is no limit, and a blank cost is refused by name. The Forcados cargo cancelled is entered the same way, availability typed 0.")

q(3, "Bonny Light (illustrative) carries a gasoil yield of 0.3100. What kind of figure is that yield?",
 "A volume fraction: each barrel of Bonny Light run makes 0.3100 of a barrel of gasoil.",
 ["A mass fraction: 0.3100 of the weight of every barrel of Bonny Light comes out as gasoil.",
  "The share of the Diesel hydrotreater's gasoil feed that Bonny Light supplies in the month.",
  "The fraction of each barrel of gasoil that the Diesel hydrotreater turns into ulsd."],
 "Yields are volume fractions, and Bonny Light (illustrative)'s row prints gasoil 0.3100 beside naphtha 0.2300, kero 0.1500, residue 0.2800 and offgas 0.0300. The hydrotreater's own yield on its gasoil feed is ulsd 0.9700.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/intermediate/rfi_m01.json', label='rfi_m01', expect_n=15)
finish()
