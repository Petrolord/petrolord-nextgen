import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Professional m04, What Another Barrel Is Worth.
# Every figure is from digest SECTION 14 (the stream values, the two workings,
# the values under the five changes and the reformer sweep), with the product
# table and limit lists of SECTIONS 9 and 12 that the m04 lessons quote beside
# them. Nothing reaches into the Expert tier's sections.

q(2, "What does ABUA's plan mean by a stream's marginal value?",
 "The value of one more barrel of that stream arriving from outside, in dollars a barrel.",
 ["The revenue the stream earned this month, divided by the barrels of it made.",
  "The price of the product the stream goes into, read across from the product table.",
  "The cost of the crude barrels that must be run to make one more barrel of it."],
 "marginalValue is the plan's value of one more barrel of a stream arriving from outside, in US dollars a barrel. It prices the next barrel, and the crude course teaches the dual it comes from.")

q(0, "Which stream prints a marginal value that is the same figure as its only product's price, in the plan as typed?",
 "Kero, 105.5000, beside Jet A-1 at 105.5000.",
 ["Naphtha, 91.4500, beside Naphtha export at 72.5000.",
  "Gasoil, 94.1016, beside Gasoil export at 89.5000.",
  "Offgas, 0.0000, beside a product priced at 0.0000."],
 "Kero has one home, Jet A-1, no unit and no surplus, so the next barrel is sold as Jet A-1 at 105.5000. Naphtha and gasoil feed units, and offgas has no product at all.")

q(3, "Reformate is worth 111.0000, Gasoline's price. Which reading of the plan lets one more barrel of reformate be sold as Gasoline?",
 "Gasoline reads false for at its ceiling, so the plan can sell one more barrel.",
 ["Gasoline's floor of 0.00 obliges the plan to sell every barrel of reformate made.",
  "The reformer runs at 97.07 percent, so it can make one more barrel of reformate.",
  "Reformate carries a surplus of 103638.71 bbl waiting to be placed in Gasoline."],
 "A stream is worth its product's price while that product can take another barrel. Gasoline is below its ceiling. The surplus of 103638.71 bbl belongs to offgas, and reformate's surplus is 0.00.")

q(1, "The plan values naphtha at 91.4500. Which working does the digest print for that figure?",
 "What the reformer makes from a barrel at the stream values, less its 2.9000 operating cost.",
 ["Naphtha export's price of 72.5000, with the reformer's 2.9000 a barrel added on top.",
  "Gasoline's price of 111.0000, less the crude unit's 1.2500 a barrel of distillation.",
  "A barrel of Bonny Light (illustrative) at 82.5500, shared over its naphtha yield of 0.2300."],
 "0.8500 x 111.0000 + 0.1000 x 0.0000 - 2.9000 = 91.4500. The reformer runs at 97.07 percent, below its capacity, so one more barrel of naphtha goes through it.")

q(2, "The Diesel hydrotreater is at capacity. Through which crude does the digest's working value gasoil at 94.1016?",
 "Bonny Light (illustrative), which the plan runs only in part.",
 ["Forcados (illustrative), the crude the plan runs at its full availability.",
  "Brass River (illustrative), also run at its full availability in the plan.",
  "None: once the hydrotreater is full, the next barrel of gasoil is valued at Gasoil export's 89.5000."],
 "One more barrel of gasoil lets the plan run less of the crude it only partly runs. At break-even a barrel of Bonny Light (illustrative), 82.5500 with the crude unit's 1.2500, equals what its streams are worth, and that gives 94.1016.")

q(3, "Why is the step from 400000.00 to 420000.00 bbl of reformer capacity priced at only 2.9773 a barrel?",
 "The reformer fills partway through the step and reads 97.07 percent at 420000.00 bbl.",
 ["The reformer's operating cost of 2.9000 a barrel is taken off each barrel of room.",
  "The step is the first one the digest prints, so it carries no change in margin.",
  "Gasoline reaches its ceiling inside that step and holds the reformer back."],
 "The gain is the change in margin, 59545.39, over the change in capacity, 20000.00 bbl. Part of that room is used and part is not, so the figure averages the two stretches.")

q(0, "Why does the plan value offgas at 0.0000?",
 "No product or unit takes it, so a barrel more only adds to the surplus.",
 ["Its only product, Fuel oil, is sold up to its ceiling for the month.",
  "The reformer burns it as fuel, and its cost and value cancel out exactly.",
  "Its yields of 0.0300 and 0.0200 are too small for the plan to put a price on."],
 "Offgas has no product and no unit, and 103638.71 bbl of it is left as surplus. A barrel added to surplus changes nothing in the month's margin, so its value is 0.0000.")

q(1, "A planner knows offgas is burned in the plant's heaters. What does ABUA's value of 0.0000 say about that use?",
 "Nothing, since the configuration gives offgas no product and no unit to see it through.",
 ["That burning offgas is worth nothing to the refinery in any month it runs.",
  "That the heaters are already paid for inside the crude unit's 1.2500 a barrel.",
  "That the fuel use is priced at Fuel oil's 59.0000 somewhere else in the plan."],
 "A zero marginal value is a statement about this configuration. To see a use for offgas, the configuration needs a product for it with a price, or a use that saves a cost.")

q(2, "Under a jet floor of 300000 and a fuel oil floor of 700000, residue reads 79.6607 while Fuel oil sells at 59.0000. Which reading accounts for it?",
 "The fuel oil floor is met exactly, and residue is valued at Bonny Light's break-even.",
 ["Fuel oil reaches its ceiling under the two floors, so residue is sent to a dearer home instead.",
  "The floors lift Fuel oil's price inside the plan to 79.6607 a barrel for the month.",
  "Residue becomes a feed of the Diesel hydrotreater under the two floors."],
 "The plan sells Fuel oil 700000.00 and the floor is met exactly: true. Bonny Light (illustrative) is the crude only partly run, at 567857.14 bbl, and residue is valued at its break-even, 79.6607.")

q(0, "What do naphtha and gasoil read under the jet floor of 300000 and fuel oil floor of 700000?",
 "72.5000 and 89.5000, the same figures as their export prices.",
 ["91.4500 and 94.1016, the same figures as in the plan as typed.",
  "83.6941 and 99.8560, as with the hydrotreater capacity left blank.",
  "91.4500 and 87.8029, as with the hydrotreater typed as shut."],
 "A stream that feeds a unit is valued at its export price only when the export is where the plan would send the next barrel, and under the floors it is.")

q(3, "With the diesel hydrotreater typed as shut, which stream value moves, and to what?",
 "Gasoil, to 87.8029.",
 ["Naphtha, to 83.6941.",
  "Gasoil, to 89.5000.",
  "Residue, to 79.6607."],
 "The shut row prints gasoil at 87.8029 and every other stream at its value as typed. That figure is neither the value as typed, 94.1016, nor Gasoil export's price, 89.5000.")

q(1, "Leaving the hydrotreater capacity blank moves the value of a stream the hydrotreater never takes as feed. Which stream, and to what?",
 "Naphtha, from 91.4500 to 83.6941.",
 ["Gasoil, from 94.1016 to 99.8560.",
  "Residue, from 59.0000 to 79.6607.",
  "Reformate, from 111.0000 to 105.5000."],
 "The blank row prints naphtha at 83.6941, the reformer's feed. Gasoil also moves, to 99.8560, and gasoil is the hydrotreater's own feed. A stream's value is a property of the whole plan.")

q(2, "Across all six rows of the digest's stream values under each change, which streams print one value in every row?",
 "Reformate, kero, ulsd and offgas.",
 ["Reformate, kero, ulsd and residue.",
  "Naphtha, reformate, kero and ulsd.",
  "Kero, ulsd, residue and offgas."],
 "Reformate prints 111.0000, kero 105.5000, ulsd 104.8000 and offgas 0.0000 in every row. Residue reads 79.6607 under the floors, and naphtha and gasoil move in several rows.")

q(0, "The reformer is stepped from its typed 420000.00 bbl to 440000.00 bbl. What margin gain per extra barrel of capacity is printed?",
 "0.0000, with the reformer at 92.65 percent.",
 ["2.9773, with the reformer at 97.07 percent.",
  "7.7559, with the reformer at 100.00 percent.",
  "59545.39, with the reformer at 92.65 percent."],
 "The margin reads 7077935.48 at 440000.00 bbl, a change of 0.00, so the gain per extra barrel is 0.0000. The reformer has room it does not use, and the plan's units at capacity list names only the Diesel hydrotreater.")

q(1, "Between 380000.00 and 400000.00 bbl of reformer capacity, the gain per extra barrel is 7.7559. What do the reformer's utilisation readings show at both capacities?",
 "100.00 percent at both, so each extra barrel of room is used.",
 ["97.07 percent at both, so part of the room is left empty.",
  "92.65 percent at 400000.00 bbl, so only part of the room is used.",
  "No utilisation is printed for these steps, only the margins."],
 "The reformer is full at both capacities, and the margin moves from 6863271.83 to 7018390.09, a change of 155118.26 over 20000.00 bbl. Here the reformer is a bottleneck in the plain sense.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/intermediate/rfi_m04.json', label='rfi_m04', expect_n=15)
finish()
