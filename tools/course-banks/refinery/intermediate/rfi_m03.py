import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Professional m03, Reading the Plan.
# Every figure and refusal is from digest SECTIONS 10, 12 and 13 (refusals and
# statuses, the margin, the product table, the stream balance, the limit lists
# and the five changes), as the m03 lessons quote them.

q(1, "Which three terms make up ABUA's margin of 7077935.48?",
 "Revenue 172316812.90, less crude cost 160350322.58, less unit operating cost 4888554.84.",
 ["Revenue 172316812.90, less crude cost 160350322.58 and nothing else.",
  "Revenue 172316812.90, less crude cost, unit operating cost, staff and insurance.",
  "Revenue less unit operating cost 4888554.84, with crude cost charged in the schedule and the fixed costs of the month."],
 "The digest's definition is margin = product revenue - crude cost - unit operating cost. Fixed costs, capital, tax and financing are not terms in it.")

q(3, "What is the denominator of ABUA's gross margin per barrel of crude, 3.4883?",
 "The total crude, 2029032.26 bbl.",
 ["The product volume sold.",
  "The crude unit's capacity, 2600000.00 bbl.",
  "The throughputs of all three units, added together."],
 "gross margin per barrel = margin / total crude. The denominator is crude and only crude, so the figure speaks for the barrel the refinery bought.")

q(0, "Leaving the hydrotreater's capacity blank changes ABUA's margin by 95572.87. What change in gross margin per barrel is printed for that row?",
 "-0.0438.",
 ["0.1158, the row where the crude unit is held at 1900000 barrels.",
  "-2.9113, the row where the hydrotreater is typed as shut.",
  "-0.8736, the row with the jet and fuel oil floors."],
 "The margin rises by 95572.87 while the gross margin per barrel moves by -0.0438. The extra barrels are the ones the plan valued last, so the total rises as the average falls.")

q(2, "Which change lowers ABUA's margin while raising its gross margin per barrel?",
 "The crude unit at 1900000 barrels for the month: margin change -230175.48, gross margin per barrel change 0.1158.",
 ["The hydrotreater capacity left blank: margin change 95572.87, gross margin per barrel change -0.0438.",
  "The Forcados cargo cancelled: margin change -3047230.44, gross margin per barrel change -1.1822.",
  "The jet and fuel oil floors: margin change -1148089.05, gross margin per barrel change -0.8736."],
 "Made to run less crude, the plan keeps the barrels it values most, so the average rises while the total falls. The blank hydrotreater is the opposite case.")

q(1, "Within one month's plan, which figure does the plan maximise?",
 "The margin.",
 ["The gross margin per barrel.",
  "The crude unit's utilisation.",
  "The product revenue."],
 "The plan is solved for the largest margin its moves allow. A higher gross margin per barrel bought by running less crude is a smaller month, so the ratio is for comparison.")

q(0, "What does the offgas row of ABUA's stream balance read?",
 "Made 103638.71, consumed 0.00, placed 0.00, surplus 103638.71.",
 ["Made 103638.71, consumed 103638.71 by the reformer as fuel, surplus 0.00.",
  "Made 103638.71, placed 103638.71 in Fuel oil, surplus 0.00.",
  "Made 103638.71, surplus 0.00, never below zero."],
 "made - consumed by units - placed in products = surplus. Offgas has no recipe and no unit, so its whole make is the stream nobody found a home for.")

q(3, "Naphtha export and Gasoil export both sell 0.00 bbl. What does the stream balance show about why?",
 "Naphtha 407677.42 and gasoil 650000.00 are made and consumed in full by their units.",
 ["Their ceilings of 200000.00 and 250000.00 bbl are reached.",
  "Their floors of 0.00 forbid any sale.",
  "Neither product has a recipe naming a stream."],
 "Naphtha made 407677.42 bbl and the reformer consumed 407677.42 bbl; gasoil made 650000.00 bbl and the hydrotreater consumed 650000.00 bbl. Nothing is left to place in the export products.")

q(2, "How many of ABUA's six products does the plan show at their ceiling?",
 "None: every row reads false.",
 ["One, Diesel (ULSD).",
  "One, Gasoline.",
  "Two, Jet A-1 and Fuel oil."],
 "The product table's at its ceiling column reads false on all six rows. Diesel (ULSD) sells 630500.00 of 750000.00 bbl and Gasoline 346525.81 of 450000.00 bbl, so no market holds the month back.")

q(2, "Bonny Light (illustrative) runs 329032.26 of 1500000.00 bbl. Which limit named in the plan's lists holds the crude run there?",
 "The Diesel hydrotreater, at capacity.",
 ["The crude unit's capacity of 2600000.00 bbl.",
  "Bonny Light's own availability.",
  "The Jet A-1 ceiling of 380000.00 bbl, reached first."],
 "Only the hydrotreater is on the units at capacity list, and no product reads true at its ceiling. More Bonny Light makes gasoil the full hydrotreater cannot take, and Gasoil export at 89.5000 does not pay for it.")

q(0, "A jet floor of 1000000 is set with its ceiling raised to 1200000. What status does the plan return?",
 "infeasible",
 ["invalid, for a floor above its ceiling",
  "unbounded, since the raised ceiling opens the month",
  "optimal, with Jet A-1 held at 380000.00 bbl"],
 "Each number is sound on its own, but the crudes and units cannot make that much kero. The engine returns \"No plan satisfies these constraints. A product floor is probably beyond what the crudes and units can make.\"")

q(1, "A gasoline floor of 500000 is typed above its ceiling of 450000. Why is this refused before any plan is attempted?",
 "The two numbers alone can never both be met.",
 ["No crude mix makes 500000 bbl of reformate, which planning finds out.",
  "Its ceiling is reset to 500000 first.",
  "A floor is read only when its ceiling is blank, so the floor is dropped."],
 "The engine sees the conflict from the two numbers, so the status is invalid: \"Gasoline has a minimum demand above its maximum.\" The jet case needs the plan to find there is no answer.")

q(3, "Every crude availability, unit capacity and demand ceiling is left blank. Which sentence does the engine return?",
 "\"The plan is unbounded: a product has a price and no demand ceiling, or a crude has no availability limit and no cost.\"",
 ["\"No plan satisfies these constraints. A product floor is probably beyond what the crudes and units can make.\"",
  "\"Naphtha reformer capacity must be zero or more; leave it blank for no limit.\"",
  "\"The plan needs at least one crude.\""],
 "A blank limit is no limit. With nothing limiting crude and nothing limiting sales, every profitable barrel invites another and there is no best month, so the status is unbounded.")

q(0, "The configuration carries no product at all. What does the engine return?",
 "Status invalid: \"The plan needs at least one product to sell.\"",
 ["Status optimal, with a margin made of crude cost and unit operating cost alone.",
  "Status unbounded, since no demand ceiling limits the month.",
  "Status invalid: \"The plan needs at least one crude.\""],
 "The engine names what it cannot trust. No product at all and no crude at all are each refused with their own sentence, before any plan is attempted.")

q(2, "Which product earns ABUA's largest revenue line?",
 "Diesel (ULSD), 66076400.00.",
 ["Gasoline, 38464364.52, the highest price.",
  "Fuel oil, 37354612.90.",
  "Jet A-1, 30421435.48, sold at 105.5000 a barrel."],
 "The product table prints Diesel (ULSD) at 630500.00 bbl and 66076400.00. Gasoline carries the highest price, 111.0000, on a smaller volume.")

q(1, "Which of these is a term in ABUA's margin of 7077935.48?",
 "The unit operating cost.",
 ["Staff, insurance and overheads the month pays whatever it runs.",
  "The capital the refinery cost to build.",
  "Tax and financing on the month's earnings."],
 "The margin is revenue less crude cost less unit operating cost. It carries no fixed cost, no capital and no tax or financing, so it is a month's contribution. It is not a profit.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/intermediate/rfi_m03.json', label='rfi_m03', expect_n=15)
finish()
