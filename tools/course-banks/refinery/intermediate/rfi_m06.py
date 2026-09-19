import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Professional m06, The Professional Reading.
# Every figure is from digest SECTION 17 (ABUA's plan and schedule end to end),
# read with SECTIONS 9 to 16 as one plan and one schedule, as the m06 lessons
# quote them. Nothing reaches into the Expert tier's sections.

q(2, "In ABUA's end to end table, which reading is the figure the course says a refinery is judged on?",
 "Gross margin per barrel of crude, 3.4883.",
 ["Crude unit utilisation, 78.04 percent.",
  "Revenue for the month, 172316812.90.",
  "The marginal value of gasoil, 94.1016."],
 "A refinery is judged on its margin per barrel of crude. The plan's margin, 7077935.48, divided by total crude, 2029032.26 bbl, gives the gross margin per barrel of crude, 3.4883.")

q(0, "A plan is handed over to be read end to end. What does the lesson check before reading any figure?",
 "The configuration: every limit typed, every cost and price present, status optimal.",
 ["The margin, since every other reading on the page hangs from that one figure.",
  "The schedule's first receipt date, which must read 2027-03-01 before any other figure is read.",
  "The stream values, starting with offgas, since a zero shows a lost home."],
 "Step one is the configuration and its blanks. Every limit ABUA carries is typed, every cost and price is present or the plan would be refused by name, and the status is optimal.")

q(3, "Had ABUA's status read infeasible, where would the end to end reading stop?",
 "At the status, with the engine's sentence, since there is no plan to read.",
 ["At the stream values, which would each print 0.0000 for the month.",
  "At the schedule, which would still carry 41 events with no quantities.",
  "Nowhere, since the margin is printed and read in the usual way."],
 "Had the status read infeasible or unbounded, the reading would stop at step one, with the engine's sentence, because there would be no plan to read. An infeasible plan also cascades to 0 events.")

q(1, "What does the end to end reading name as holding ABUA's month where it is?",
 "The full hydrotreater, since more Bonny Light makes gasoil it has no room for.",
 ["The crude unit, since it runs 2029032.26 of its 2600000.00 bbl capacity.",
  "The product ceilings, led by Diesel (ULSD) with its 750000.00 bbl limit.",
  "Bonny Light's own availability, with 1500000.00 bbl on offer."],
 "Units at capacity: Diesel hydrotreater. The crude unit has room, no product is at its ceiling and Bonny Light has barrels. The gasoil more crude would make has no room in the hydrotreater and earns too little as Gasoil export.")

q(1, "Which three readings in ABUA's end to end table belong to the schedule?",
 "Schedule events 41, crude receipts 6, first receipt date 2027-03-01.",
 ["Schedule events 41, unit runs 15 and product lifts 20.",
  "Crude receipts 6, weeks in the period 5, last lift date 2027-03-31.",
  "Total crude 2029032.26, crude receipts 6 and schedule events 41."],
 "The end to end table carries three schedule readings: schedule events 41, crude receipts 6 and first receipt date 2027-03-01. The breakdown into unit runs and product lifts is printed with the schedule itself.")

q(3, "Why does ABUA's schedule carry product lifts 20?",
 "Four products sell, and each is lifted in 5 weekly events.",
 ["Six products, each lifted in weekly events, less the two exports' first lifts.",
  "Five weeks, each with a lift for every one of the crudes received that week.",
  "Twenty cargoes of product, one for each 400000.00 bbl the refinery makes."],
 "Gasoline, Jet A-1, Diesel (ULSD) and Fuel oil sell, each lifted in five weekly events with weeks in the period 5. Naphtha export and Gasoil export sell 0.00 bbl and have no lifts.")

q(0, "At a cargo size of 400000.00 bbl, how do ABUA's three crudes make crude receipts 6?",
 "Bonny Light 1, Forcados 3 and Brass River 2.",
 ["Bonny Light 2, Forcados 3 and Brass River 1.",
  "Two cargoes each for all three of the crudes.",
  "Forcados 3 and Brass River 3, Bonny Light none."],
 "Bonny Light's 329032.26 bbl arrives as one cargo, Forcados' 1100000.00 bbl as three and Brass River's 600000.00 bbl as two, each count rounded up to a whole cargo.")

q(2, "A schedule's event counts do not match the reasons the plan gives for them. What is that the first sign of?",
 "A schedule built from some other plan or cargo size.",
 ["A period start passed as a Date built at local midnight east of Greenwich.",
  "A crude unit given a feed stream that none of the three crudes makes.",
  "A product floor typed above its own ceiling."],
 "Each count has a reason from the plan: the crude cargoes, five weekly runs for each unit and five weekly lifts for each product that sells. A count that does not match points to a different plan or cargo size.")

q(2, "In step two of the end to end reading, what would make the reader stop to fix the feed column?",
 "The crude unit column reading false on every row of the unit table.",
 ["The crude unit reading 78.04 percent, short of its 2600000.00 bbl capacity.",
  "Total crude and crude unit throughput agreeing to the barrel, printed as true.",
  "The crude unit charging 1.2500 a barrel on every barrel of crude."],
 "If no row reads crude unit true, every figure after that step describes a refinery whose distillation is free. ABUA's Crude distillation row reads true, and the two totals agree: true.")

q(3, "Where does the end to end reading point a planner who wants ABUA's month to earn more?",
 "The hydrotreater, which left blank prints a margin change of 95572.87.",
 ["The reformer, since another 20000.00 bbl of it earns 2.9773 a barrel.",
  "The crude unit, which at 1900000 barrels prints a change of -230175.48.",
  "More Bonny Light, which runs 329032.26 of 1500000.00 bbl on offer."],
 "The reformer sweep prices another 20000.00 bbl of reformer capacity beyond 420000.00 bbl at 0.0000 a barrel as typed. The 2.9773 belongs to the step up to 420000.00. The hydrotreater is the unit at capacity.")

q(0, "Does the Professional tier decide whether a hydrotreater expansion is worth building?",
 "No. That needs capital valued over many months, which the Expert tier does.",
 ["Yes. The margin change of 95572.87 with the hydrotreater left blank is the value of the expansion.",
  "Yes. The gain per extra barrel of capacity from the sweep is the expansion's return on capital.",
  "No. Expansions are valued in the Associate tier's modular screen only."],
 "The plan prices one month. Whether an expansion is worth building needs its capital, its life and many months, and the Expert tier values an expansion's streams through the screening engine.")

q(1, "Which two objects from ABUA's month does the Expert tier set actuals against?",
 "The plan and the schedule it cascades into.",
 ["The feasibility screen and its licensing sequence.",
  "The stream values and the reformer sweep.",
  "The seven time zone runs of the schedule."],
 "The plan is what the month should do, and the schedule is its shape across the dates. The engine's note calls the schedule \"the shape of the month to read actuals against\".")

q(3, "Which habit about the period start does this tier ask a planner to carry into the next?",
 "Pass it as a YYYY-MM-DD string, so no clock or zone can move it.",
 ["Leave it out, so the schedule is dated from the day it is built.",
  "Pass it as a Date at local midnight, as the Suite page does.",
  "Set it to the first cargo date of the crude run in the most parts."],
 "A schedule that moves with the clock or the time zone cannot be read against anything. The Suite page and the digest both pass the period start as a string, 2027-03-01 for ABUA.")

q(0, "In step five of the end to end reading, which stream is valued through a unit that has room?",
 "Naphtha, 91.4500, through the reformer at 97.07 percent.",
 ["Gasoil, 94.1016, through the hydrotreater at 100.00 percent.",
  "Residue, 59.0000, through Fuel oil at its price.",
  "Offgas, 0.0000, leaving 103638.71 bbl of surplus."],
 "Naphtha is valued through a reformer with room. Gasoil is valued through the full hydrotreater by what the plan can rearrange, residue has one home in Fuel oil, and offgas has no home at all.")

q(2, "Which ABUA figure does the schedule's totals table print identically in its scheduled and plan columns?",
 "The cdu's 2029032.26 bbl and 2536290.32.",
 ["The margin, 7077935.48, dated 2027-03-31.",
  "The crude unit capacity, 2600000.00 bbl.",
  "The offgas surplus of 103638.71 bbl, lifted weekly."],
 "The digest sets the schedule's totals beside the plan's for all ten materials, and every row agrees. The cdu row reads 2029032.26 bbl and 2536290.32 in both, so the schedule adds no barrels and loses none.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/intermediate/rfi_m06.json', label='rfi_m06', expect_n=15)
finish()
