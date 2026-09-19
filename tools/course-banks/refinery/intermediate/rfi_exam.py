import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Professional exam, the whole tier.
# Every figure, date and refusal is from digest SECTIONS 9 to 17 (the ABUA
# configuration, its refusals, the crude unit, the plan and its five changes,
# the stream values and the reformer sweep, the schedule and its time zone
# runs, and the end to end reading), as the tier's lessons quote them. Written
# after the six module banks, and kept apart from them question by question.

# m01, the configuration (SECTIONS 9, 10 and 13)
q(1, "Which of ABUA's units takes gasoil as its feed, and what does a barrel of it make?",
 "Diesel hydrotreater, making ulsd 0.9700 and offgas 0.0200.",
 ["Naphtha reformer, making reformate 0.8500 and offgas 0.1000.",
  "Crude distillation, making each crude's own yields of streams.",
  "No unit; gasoil goes only to Gasoil export at 89.5000."],
 "The unit table gives the Diesel hydrotreater a feed of gasoil and yields of ulsd 0.9700 and offgas 0.0200, at an operating cost of 1.8000 a barrel.")

q(3, "Which ABUA product carries the recipe residue 1.0000, and at what price?",
 "Fuel oil, at 59.0000.",
 ["Gasoil export, at 89.5000.",
  "Naphtha export, at 72.5000.",
  "Diesel (ULSD), at 104.8000."],
 "The product table prints Fuel oil at 59.0000 a barrel with a ceiling of 1000000.00 bbl and the recipe residue 1.0000.")

q(0, "What kero yield and cost does ABUA's configuration give Brass River (illustrative)?",
 "Kero 0.1600, at 80.4000 a barrel.",
 ["Kero 0.1500, at 81.3000 a barrel.",
  "Kero 0.1300, at 77.6000 a barrel.",
  "Kero 0.2600, at 80.4000 a barrel."],
 "Brass River (illustrative) costs 80.4000 and yields kero 0.1600. 0.1500 and 81.3000 are Bonny Light's, 0.1300 and 77.6000 Forcados', and 0.2600 is Brass River's naphtha yield.")

q(2, "What gross margin per barrel of crude does the plan print with the hydrotreater typed as shut for a turnaround?",
 "0.5770",
 ["3.4445",
  "2.3061",
  "3.6041"],
 "The shut hydrotreater row prints 0.5770, a change of -2.9113 from the plan as typed. 3.4445 is the blank row, 2.3061 the Forcados cargo cancelled and 3.6041 the crude unit at 1900000 barrels.")

q(3, "A planner means the reformer to have no limit this month. What should its capacity box hold?",
 "Nothing, since a blank capacity is no limit.",
 ["0, which the plan reads as the absence of a limit.",
  "-1, which the engine takes as an unlimited unit.",
  "Its typed 420000.00, which the plan reads as no limit."],
 "A limit left blank is no limit, and a limit typed as 0 is a limit of zero. A negative capacity is refused with the status invalid, the typed 420000.00 is reported as a capacity of 420000.00, and a blank capacity is reported as the number Infinity.")

q(1, "Which change to ABUA's configuration returns the status unbounded?",
 "Every crude availability, unit capacity and demand ceiling left blank.",
 ["The reformer capacity typed as -1 in place of a blank.",
  "A jet floor of 1000000 with its ceiling raised to 1200000.",
  "The cost of Forcados (illustrative) left blank."],
 "With nothing limiting crude and nothing limiting sales there is no best month. The -1 capacity and the blank cost are invalid, and the jet floor of 1000000 is infeasible.")

q(2, "Which margin belongs to the row where the Forcados availability is typed 0?",
 "4030705.04",
 ["5929846.43",
  "6847760.00",
  "424264.71"],
 "The cancelled cargo prints a margin of 4030705.04, a change of -3047230.44. 5929846.43 is the jet and fuel oil floors, 6847760.00 the crude unit at 1900000 barrels and 424264.71 the hydrotreater shut.")

# m02, the crude unit (SECTION 11)
q(0, "What throughput does ABUA's Naphtha reformer run, against what capacity?",
 "407677.42 bbl of 420000.00 bbl, 97.07 percent.",
 ["650000.00 bbl of 650000.00 bbl, 100.00 percent.",
  "2029032.26 bbl of 2600000.00 bbl, 78.04 percent.",
  "346525.81 bbl of 450000.00 bbl, below its ceiling."],
 "The unit table prints the reformer at 407677.42 of 420000.00 bbl, 97.07 percent, with an operating cost of 1182264.52. 346525.81 bbl is the Gasoline sold, against Gasoline's ceiling.")

q(3, "What margin difference does the digest print between the configuration as typed and the one where distillation is no longer feedless?",
 "2536290.33",
 ["95572.87",
  "-230175.48",
  "9614225.81"],
 "The fed configuration prints a margin of 9614225.81 against 7077935.48, and the digest prints the difference as 2536290.33. The crude unit runs 0.00 bbl and charges 0.00 for distillation.")

q(1, "When distillation is given a feed, which utilisation is printed for it?",
 "0.00 percent",
 ["null",
  "78.04 percent",
  "100.00 percent"],
 "The digest prints the crude unit utilisation in that configuration as 0.00 percent, with the unit running 0.00 bbl. A null utilisation belongs to a unit whose capacity is blank or typed as 0.")

q(2, "What crude cost does ABUA's plan print for Brass River (illustrative), on what volume?",
 "48240000.00 on 600000.00 bbl.",
 ["85360000.00 on 1100000.00 bbl.",
  "26750322.58 on 329032.26 bbl.",
  "24120000.00 on 300000.00 bbl."],
 "The crude table prints Brass River (illustrative) at 600000.00 bbl, its whole availability, costing 48240000.00. 24120000.00 on 300000.00 bbl is one of its two receipts in the schedule.")

q(0, "Which total crude and crude unit utilisation does the plan print once the jet and fuel oil floors are added?",
 "2267857.14 bbl, at 87.23 percent.",
 ["1900000.00 bbl, at 100.00 percent.",
  "2082608.70 bbl, at 80.10 percent.",
  "1747826.09 bbl, at 67.22 percent."],
 "The floors row prints total crude 2267857.14 bbl and crude unit utilisation 87.23 percent. The crude unit runs every barrel of crude, so its throughput is the total crude.")

q(3, "Which of ABUA's units carries an operating cost of 1182264.52 for the month?",
 "Naphtha reformer, 407677.42 bbl at 2.9000.",
 ["Diesel hydrotreater, 650000.00 bbl at 1.8000.",
  "Crude distillation, 2029032.26 bbl at 1.2500.",
  "Naphtha reformer, 420000.00 bbl at 2.9000."],
 "The unit table prints the reformer's operating cost as 1182264.52 on its throughput of 407677.42 bbl. 420000.00 bbl is its capacity, which the plan does not fill.")

# m03, reading the plan (SECTIONS 10, 12 and 13)
q(1, "How much Jet A-1 does ABUA's plan sell, against what ceiling?",
 "288354.84 of 380000.00 bbl, at its ceiling false.",
 ["380000.00 of 380000.00 bbl, at its ceiling true.",
  "324178.57 of 380000.00 bbl, at its ceiling false.",
  "288354.84 of 450000.00 bbl, at its ceiling false."],
 "The product table prints Jet A-1 at 288354.84 bbl against its ceiling of 380000.00, earning 30421435.48. 324178.57 bbl is the Jet A-1 sold under the jet and fuel oil floors.")

q(2, "What revenue does Fuel oil earn in ABUA's plan, on what volume?",
 "37354612.90 on 633129.03 bbl.",
 ["38464364.52 on 346525.81 bbl.",
  "66076400.00 on 630500.00 bbl.",
  "30421435.48 on 288354.84 bbl."],
 "Fuel oil sells 633129.03 bbl for 37354612.90. The other three rows are Gasoline, Diesel (ULSD) and Jet A-1.")

q(3, "Once made, consumed and placed barrels are netted, what is recorded as surplus?",
 "Stream nobody found a home for, what is made less consumed less placed.",
 ["Stream held in tank at the month's end for the next month's plan.",
  "Stream the plan chose to sell at export prices outside the recipes.",
  "Stream the units consumed beyond their capacity, printed as over."],
 "The balance takes each stream's make, subtracts what units consume and what products place, and keeps the remainder at zero or above. Offgas alone carries one here, 103638.71 bbl.")

q(1, "Which of ABUA's products sells 0.00 bbl in the plan as typed?",
 "Gasoil export",
 ["Fuel oil",
  "Jet A-1",
  "Gasoline"],
 "The product table prints Gasoil export and Naphtha export at 0.00 bbl, and the stream balance shows gasoil and naphtha consumed in full by the hydrotreater and the reformer.")

q(2, "Which status does each of the five changes in the digest's change table return?",
 "optimal",
 ["infeasible",
  "invalid",
  "unbounded"],
 "The hydrotreater shut, the hydrotreater left blank, the crude unit at 1900000 barrels, the Forcados cargo cancelled and the jet and fuel oil floors each return optimal, with a margin and a gross margin per barrel.")

q(0, "The gross margin per barrel's change from the plan as typed prints -1.1822 on one row. Which row?",
 "The Forcados cargo cancelled.",
 ["The diesel hydrotreater typed as shut.",
  "The jet and fuel oil floors together.",
  "The crude unit held at 1900000 barrels."],
 "Losing the Forcados cargo moves the ratio from 3.4883 to 2.3061. Of the other rows, the turnaround reads -2.9113, the floors -0.8736 and the capped crude unit 0.1158.")

q(3, "Once the two floors are added, how many barrels of Fuel oil does the month sell?",
 "700000.00 bbl, the floor met exactly.",
 ["633129.03 bbl, as in the plan as typed.",
  "1000000.00 bbl, its ceiling.",
  "324178.57 bbl, the Jet A-1 figure."],
 "The digest prints Fuel oil 700000.00 under the floors, and the fuel oil floor is met exactly: true. 633129.03 bbl is Fuel oil's volume as typed and 1000000.00 bbl its ceiling.")

# m04, what another barrel is worth (SECTION 14)
q(1, "How many dollars is one more barrel of ulsd worth to ABUA's month?",
 "104.8000, the same figure as Diesel (ULSD)'s price.",
 ["105.5000, the same figure as Jet A-1's price.",
  "94.1016, the figure the plan gives gasoil.",
  "111.0000, the same figure as Gasoline's price."],
 "The stream table prints ulsd at 104.8000 beside its one product, Diesel (ULSD) at 104.8000, with no unit and no surplus. 105.5000 is kero's value, 94.1016 gasoil's and 111.0000 reformate's.")

q(2, "With the crude unit at 1900000 barrels, what do naphtha and gasoil read?",
 "91.4500 and 99.8560.",
 ["83.6941 and 99.8560.",
  "91.4500 and 94.1016.",
  "72.5000 and 89.5000."],
 "The crude unit row prints naphtha 91.4500, as typed, and gasoil 99.8560. 83.6941 and 99.8560 are the blank hydrotreater and the cancelled cargo, and 72.5000 and 89.5000 the floors.")

q(0, "In the digest's gasoil working, which yield divides the break-even?",
 "Bonny Light's gasoil yield, 0.3100.",
 ["Bonny Light's residue yield, 0.2800.",
  "The hydrotreater's ulsd yield, 0.9700.",
  "Forcados' gasoil yield, 0.3400."],
 "(82.5500 - 0.2300 x 91.4500 - 0.1500 x 105.5000 - 0.2800 x 59.0000 - 0.0300 x 0.0000) / 0.3100 = 94.1016. Under the floors the residue yield, 0.2800, is the divisor in residue's working.")

q(3, "Under the jet and fuel oil floors, which crude is only partly run, and how much of it?",
 "Bonny Light (illustrative), run at 567857.14 bbl under the floors.",
 ["Forcados (illustrative), run at 1100000.00 bbl under the floors.",
  "Brass River (illustrative), run at 600000.00 bbl under the floors.",
  "Bonny Light (illustrative), run at 329032.26 bbl as typed."],
 "Under the floors the plan runs Bonny Light (illustrative) 567857.14, Forcados (illustrative) 1100000.00 and Brass River (illustrative) 600000.00. 329032.26 bbl is Bonny Light's run in the plan as typed.")

q(1, "What margin does the digest print with the reformer's capacity at 400000.00 bbl?",
 "7018390.09",
 ["6863271.83",
  "7077935.48",
  "6847760.00"],
 "The sweep prints 6863271.83 at 380000.00 bbl, 7018390.09 at 400000.00 and 7077935.48 at 420000.00 and above. 6847760.00 is the crude unit at 1900000 barrels.")

q(2, "Inside the solved plan, which row's dual gives each stream value, and with what sign?",
 "The negated dual of the stream's balance row.",
 ["An average of the prices of the products it enters.",
  "The crude cost divided by the stream's yield.",
  "A unit's operating cost added to its product price."],
 "marginalValue is the negated dual of the stream's balance row. The crude course teaches what a dual is. This course reads the stream values the plan prints.")

q(0, "How much Gasoil export leaves the refinery when jet and fuel oil floors are set?",
 "74035.71 bbl",
 ["0.00 bbl",
  "250000.00 bbl",
  "42607.14 bbl"],
 "The floors row sells Gasoil export 74035.71 and Naphtha export 42607.14. As typed, both sell 0.00, and 250000.00 bbl is Gasoil export's ceiling.")

# m05, the schedule (SECTIONS 15 and 16)
q(3, "On what date does ABUA's second Brass River cargo arrive, from period start 2027-03-01?",
 "2027-03-16, as rcpt-6.",
 ["2027-03-11, as rcpt-3.",
  "2027-03-21, as rcpt-4.",
  "2027-03-15, as run-9."],
 "Brass River arrives in two parts of 300000.00 bbl, rcpt-5 on 2027-03-01 and rcpt-6 on 2027-03-16, 15 days apart. rcpt-3 and rcpt-4 are Forcados receipts, and run-9 is a cdu run.")

q(1, "What quantity does each reformer run event carry?",
 "81535.48 bbl",
 ["130000.00 bbl",
  "405806.45 bbl",
  "69305.16 bbl"],
 "Each of the five reformer events, run-12 to run-16, prints 81535.48 bbl. 130000.00 bbl is each dht run, 405806.45 bbl each cdu run and 69305.16 bbl each gasoline lift.")

q(2, "What value does each diesel lift carry?",
 "13215280.00",
 ["7470922.58",
  "6084287.10",
  "7692872.90"],
 "Each diesel lift moves 126100.00 bbl and carries 13215280.00, its share of the Diesel (ULSD) revenue. The others are the fuel_oil, jet and gasoline lifts.")

q(0, "At a cargo size of 150000 bbl, what is the last Forcados receipt date the digest prints?",
 "2027-03-22, after seven earlier Forcados dates.",
 ["2027-03-21, as at the 400000.00 bbl cargo size.",
  "2027-03-19, the last of eight Forcados dates.",
  "2027-03-31, the last day of the 31 day period."],
 "At 150000 bbl the Forcados dates run 2027-03-01, 2027-03-04, 2027-03-07, 2027-03-10, 2027-03-13, 2027-03-16, 2027-03-19 and 2027-03-22. 2027-03-21 is the last Forcados receipt at 400000.00 bbl.")

q(3, "How many days apart are the Brass River cargoes at a cargo size of 400000.00 bbl?",
 "15",
 ["10",
  "31",
  "5"],
 "Brass River's run over the cargo size prints 1.5000, so 2 cargoes, and the 31 days divided by 2 rounds down to 15. Forcados' cargoes are 10 days apart and Bonny Light's single cargo prints 31.")

q(1, "With the string period start, what last event date does the schedule print in Pacific/Pago_Pago?",
 "2027-03-31, as in every other zone.",
 ["2027-03-29, the date of the last runs.",
  "2027-03-28, the fourth week's lifts.",
  "2027-02-28, a day into February."],
 "With the string form, UTC, Africa/Lagos, Pacific/Kiritimati, Europe/London, America/New_York, America/Los_Angeles and Pacific/Pago_Pago all end on 2027-03-31. 2027-02-28 appears only with the Date form.")

q(2, "In the engine's note, what is ABUA's schedule for?",
 "\"the shape of the month to read actuals against\"",
 ["a berth plan for the terminal's jetty desk",
  "a tank by tank inventory plan for the month",
  "a turnaround calendar for each of the units"],
 "The engine names tank capacity, jetty windows and turnarounds as not modelled, so none of the three plans in the other options can be read from it. What it is for, in its own words, is reading actuals against the month's shape.")

q(0, "What does the engine read from a Date object passed as the period start?",
 "Its UTC calendar day.",
 ["The calendar day where it runs.",
  "The machine clock's current day.",
  "The first day of its UTC month."],
 "The engine reads a Date's UTC calendar day, so the answer depends on the zone: built at local midnight, Africa/Lagos and Pacific/Kiritimati start on 2027-02-28.")

# m06, the end to end reading (SECTION 17 with 9 to 16)
q(3, "What first receipt date does ABUA's end to end table print?",
 "2027-03-01, the period start.",
 ["2027-03-11, a Forcados cargo.",
  "2027-03-07, the first lifts.",
  "2027-02-28, a Lagos Date run."],
 "The first receipt date is the period start, 2027-03-01, where Bonny Light, Forcados and Brass River each land a cargo. 2027-03-07 is the first lift and 2027-02-28 the Date form's first date in Africa/Lagos.")

q(1, "The hydrotreater's runs are run-17 to run-21. What value does the totals table give them for the month?",
 "1170000.00, the same as its plan value.",
 ["1182264.52, the value of the reformer runs.",
  "234000.00, the value of a single dht run.",
  "4888554.84, all three units' operating cost."],
 "The dht row prints 650000.00 bbl and 1170000.00 in both columns, the hydrotreater's operating cost for the month. 1182264.52 is the reformer row, 234000.00 one dht run event and 4888554.84 the plan's unit operating cost.")

q(2, "Which schedule events carry ABUA's revenue?",
 "The product lifts.",
 ["The crude receipts.",
  "The unit runs.",
  "Receipts and runs."],
 "A lift's value is its share of that product's revenue: 7692872.90 on each gasoline lift and 7470922.58 on each fuel_oil lift, for example.")

q(0, "What do the schedule's totals table print for diesel?",
 "630500.00 bbl and 66076400.00, in both columns.",
 ["630500.00 bbl scheduled against 750000.00 bbl planned.",
  "126100.00 bbl and 13215280.00, in both columns.",
  "650000.00 bbl and 1170000.00, in both columns."],
 "The diesel row reads 630500.00 bbl and 66076400.00 scheduled and planned. 126100.00 bbl and 13215280.00 are one lift, and 650000.00 bbl and 1170000.00 the dht's month.")

q(3, "Forcados (illustrative) is offered to the plan at which price a barrel?",
 "77.6000",
 ["81.3000",
  "80.4000",
  "72.5000"],
 "The crude table prices Forcados (illustrative) at 77.6000 a barrel with 1100000.00 bbl available. 81.3000 is Bonny Light's cost, 80.4000 Brass River's and 72.5000 the price of Naphtha export.")

q(2, "What naphtha yield does Forcados (illustrative) carry?",
 "0.1600",
 ["0.2300",
  "0.2600",
  "0.1300"],
 "Forcados (illustrative) yields naphtha 0.1600 and kero 0.1300 in the crude yield table, so 0.1300 is the kero column. Bonny Light yields 0.2300 naphtha and Brass River 0.2600.")

q(0, "How many unit run events does ABUA's schedule make?",
 "15, five weekly runs for each of the three units.",
 ["5, one a week for the crude unit alone.",
  "20, five weekly runs for each of four units.",
  "6, one run for each crude cargo received."],
 "With weeks in the period 5, each of the cdu, the reformer and the dht runs in five equal events, unit runs 15. The 20 is the product lifts and the 6 the crude receipts.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/intermediate/rfi_exam.json', label='rfi_exam', expect_n=42)
finish()
