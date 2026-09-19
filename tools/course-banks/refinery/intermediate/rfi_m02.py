import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Professional m02, The Crude Unit Carries Every Barrel.
# Every figure is from digest SECTION 11 (ABUA's crude runs, unit table and the
# configuration with a fed crude unit), with the crude unit rows of SECTION 13
# and the utilisation rule of SECTION 9, as the m02 lessons quote them.

q(2, "Once the plan finds a feedless unit, what constraint does it write for it?",
 "An equality row: crude run = crude unit throughput.",
 ["A ceiling row: crude run below the reformer's feed.",
  "A floor row: throughput at least the crude run.",
  "Nothing extra; it is planned like any other unit."],
 "Every barrel of crude runs through the feedless unit, by an equality row. Crude that is bought is crude that is distilled, no more and no less.")

q(0, "ABUA's plan prints its total crude beside the crude unit throughput. What do the two read?",
 "2029032.26 bbl and 2029032.26 bbl, agreeing to the barrel: true.",
 ["2029032.26 bbl of crude against 2600000.00 bbl, the unit's capacity.",
  "2082608.70 bbl of crude against 2029032.26 bbl through the unit.",
  "2029032.26 bbl of crude beside 0.00 bbl through the unit."],
 "Crude run and crude unit throughput are one number printed twice, from the crude table and the unit table. 2600000.00 is the capacity, and the 0.00 reading belongs to a configuration whose crude unit has a feed.")

q(3, "Which change makes the crude unit's own capacity the crude run?",
 "The crude unit at 1900000 barrels for the month: total crude 1900000.00, utilisation 100.00.",
 ["The Forcados cargo cancelled: total crude 1747826.09, utilisation 67.22.",
  "A jet floor of 300000 and a fuel oil floor of 700000: total crude 2267857.14, utilisation 87.23.",
  "The hydrotreater capacity left blank: total crude 2082608.70, utilisation 80.10."],
 "With the crude unit's capacity set at 1900000 barrels, the total crude reads 1900000.00 and the crude unit reads 100.00 percent. A limit on the crude unit is a limit on crude.")

q(1, "What is the crude unit's utilisation in ABUA's plan as typed?",
 "78.04 percent.",
 ["97.07 percent, the reading printed on the reformer's row.",
  "100.00 percent, the reading printed for the hydrotreater row.",
  "80.10 percent, the reading with the hydrotreater left blank."],
 "The unit table prints Crude distillation at 2029032.26 bbl of 2600000.00 bbl, 78.04 percent. The crude unit is not full, and the plan does not list it as at capacity.")

q(2, "What does the crude unit charge for ABUA's month, and on which barrels?",
 "2536290.32, at 1.2500 a barrel on every barrel of crude.",
 ["1182264.52, at 2.9000 a barrel on naphtha fed.",
  "4888554.84, at 1.2500 on every product barrel.",
  "1170000.00, on the gasoil it sends onward."],
 "The plan prints the crude unit operating cost for the month as 2536290.32, 1.2500 a barrel on every barrel of crude. 1182264.52 is the reformer's charge and 4888554.84 all three units together.")

q(0, "ABUA's crude unit is given a feed stream that no crude makes. What does the plan print?",
 "Crude unit throughput 0.00 beside a crude run of 2029032.26 bbl, and a margin of 9614225.81.",
 ["A crude run of 0.00 bbl and a margin of 0.00, since no unit is left to distil the crude.",
  "The status infeasible, because the crude unit's feed stream is never made by any crude.",
  "A refusal naming the crude unit's feed, since no unit in the configuration is feedless."],
 "The row is written only when some unit has no feed. The crude run still reads 2029032.26 bbl while the crude unit runs 0.00 bbl and costs 0.00, and the plan prints a margin of 9614225.81.")

q(3, "The fed-crude-unit configuration prints a margin of 9614225.81. Which printed margin belongs to the same configuration as typed, with its crude unit feedless?",
 "7077935.48, the margin as typed.",
 ["9614225.81 again, the fed unit with its capacity typed as 0.",
  "7173508.35, the hydrotreater left blank.",
  "6847760.00, the crude unit capped."],
 "The digest prints the fed configuration's margin, 9614225.81, against 7077935.48 for the configuration as typed. 9614225.81 is also the fed configuration with that unit's capacity typed as 0, and 7173508.35 and 6847760.00 are the hydrotreater left blank and the crude unit at 1900000 barrels.")

q(1, "In the configuration whose crude unit has a feed, that unit's capacity is then typed as 0. What happens to the margin?",
 "It stays at 9614225.81.",
 ["It falls to 424264.71, as when a unit is shut for a turnaround.",
  "It falls to 0.00, since a crude unit of zero capacity runs no crude.",
  "Nothing is returned, because a crude unit cannot be typed as 0."],
 "The plan prints the same margin: true. A configuration whose crude unit is not feedless has no crude unit in the plan, and its capacity and operating cost bind nothing, so shutting it changes nothing.")

q(2, "Which crude does ABUA's plan run short of its availability?",
 "Bonny Light (illustrative), 329032.26 of 1500000.00 bbl.",
 ["Forcados (illustrative), at 77.6000 the lowest-cost crude on offer.",
  "Brass River (illustrative), the smallest availability.",
  "Bonny Light and Brass River together, both below their availability."],
 "The plan lists crudes at their availability: Forcados (illustrative) and Brass River (illustrative). Bonny Light runs 329032.26 bbl against 1500000.00 bbl available.")

q(0, "Two changes touch only the diesel hydrotreater. What does the crude unit's utilisation read in each?",
 "28.28 percent with it shut, 80.10 percent with it left blank.",
 ["80.10 percent with it shut, 28.28 percent with it left blank.",
  "78.04 percent in both, since neither change touches the crude unit.",
  "67.22 percent with it shut, 87.23 percent with it left blank."],
 "The crude unit's utilisation is set by the whole plan. A downstream unit reaches back through the streams to the crude the month can use, and the crude unit runs exactly that.")

q(3, "The Forcados cargo is cancelled, availability typed 0. What do the total crude and the crude unit utilisation read?",
 "1747826.09 bbl and 67.22 percent.",
 ["735294.12 bbl and 28.28 percent.",
  "1900000.00 bbl and 100.00 percent, the crude unit's own limit.",
  "2029032.26 bbl and 78.04 percent, with Bonny Light filling in."],
 "Forcados, which ran at its full availability, is typed 0, and the plan's total crude reads 1747826.09 bbl with the crude unit at 67.22 percent. 735294.12 and 28.28 belong to the hydrotreater shut, and 1900000.00 and 100.00 to the crude unit at 1900000 barrels.")

q(1, "A dashboard shows the hydrotreater typed as 0 at 0.00 percent utilisation. What does the plan itself report?",
 "Null.",
 ["0.00 percent, the same reading.",
  "28.28 percent, the utilisation of the crude unit in that change.",
  "100.00 percent, since the unit runs all that its capacity allows."],
 "The plan divides throughput by capacity only when the capacity is finite and above zero. Typed as 0 there is nothing to divide by, so the plan prints null, and a page showing 0.00 percent shows something the plan did not say.")

q(2, "Which unit does ABUA's plan list as at capacity?",
 "Diesel hydrotreater, at 100.00 percent.",
 ["Naphtha reformer, at 97.07 percent of its capacity.",
  "Crude distillation, at 78.04 percent.",
  "The reformer and the hydrotreater, both near full."],
 "Units at capacity: Diesel hydrotreater, throughput 650000.00 bbl of 650000.00 bbl. The reformer at 97.07 percent and the crude unit at 78.04 percent are not on the list.")

q(0, "Why can no barrel of ABUA's crude escape the crude unit's 1.2500 a barrel?",
 "The equality row sends every barrel of crude through the crude unit.",
 ["The crude cost column already carries the 1.2500 in each price.",
  "Each product's price has 1.2500 taken off before revenue.",
  "The crude unit's capacity of 2600000.00 bbl exceeds the crude run."],
 "Crude run equals crude unit throughput, so the crude unit's operating cost falls on every barrel of crude. The crude cost column is each volume at its crude's own cost and carries no unit charge.")

q(1, "Read the crude unit column down ABUA's three unit rows. What does it print?",
 "True on Crude distillation, false on the reformer and the hydrotreater.",
 ["True on all three rows, since every unit runs streams made from crude.",
  "True on Crude distillation and the reformer, the two running below capacity.",
  "False on all three, since the crude unit is written as a row of its own."],
 "The unit table prints crude unit true on Crude distillation, the unit with no feed, and false on the Naphtha reformer and the Diesel hydrotreater, whose feeds are naphtha and gasoil.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/intermediate/rfi_m02.json', label='rfi_m02', expect_n=15)
finish()
