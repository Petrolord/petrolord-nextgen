import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Professional m05, The Schedule.
# Every figure and date is from digest SECTIONS 15 and 16 (ABUA's schedule
# cascaded from period start 2027-03-01, the cargo rule, the engine's note and
# the seven time zone runs), with the SECTION 1 line naming the argument that
# stops cascadeToSchedule reading the clock, as the m05 lessons quote it.

q(1, "How does ABUA's schedule decide how many cargoes a crude arrives in?",
 "The crude run divided by the cargo size, rounded up to a whole cargo, at least one.",
 ["The crude run divided by the cargo size, rounded down, with any part cargo dropped.",
  "One cargo for each week in the period, so five cargoes whatever the crude run.",
  "The crude's availability divided by the cargo size, rounded up to a whole cargo."],
 "The digest prints the rule: cargoes = the crude run divided by the cargo size, rounded UP to a whole cargo (at least one). The days between cargoes are the 31 days divided by the cargoes, rounded DOWN.")

q(3, "Forcados (illustrative) runs 1100000.00 bbl at a cargo size of 400000.00 bbl, from period start 2027-03-01. What receipts does the schedule make?",
 "Three cargoes, 10 days apart, on 2027-03-01, 2027-03-11 and 2027-03-21.",
 ["Two cargoes, 15 days apart, on 2027-03-01 and 2027-03-16.",
  "Three cargoes, one a week, on 2027-03-07, 2027-03-14 and 2027-03-21.",
  "One cargo of 1100000.00 bbl on 2027-03-01, part 1 of 1."],
 "Forcados' crude run over the cargo size prints 2.7500, which rounds up to 3 cargoes, and 31 days over 3 cargoes rounds down to 10 days between them. Each part carries 366666.67 bbl.")

q(0, "Bonny Light (illustrative) prints a crude run over the cargo size of 0.8226. What receipts does the schedule make for it?",
 "One cargo of 329032.26 bbl on 2027-03-01, part 1 of 1.",
 ["No receipt, because its run is short of one whole cargo.",
  "One cargo of 400000.00 bbl on 2027-03-01, the full cargo size.",
  "One cargo of 329032.26 bbl on 2027-03-31, the period's last day."],
 "The cargo rule rounds up to a whole cargo, at least one, so Bonny Light arrives as rcpt-1: 329032.26 bbl on 2027-03-01, part 1 of 1, with 31 days between cargoes.")

q(2, "What value does each of the three Forcados receipts carry?",
 "28453333.33, its share of the Forcados crude cost.",
 ["24120000.00, the figure on each Brass River receipt.",
  "26750322.58, the figure on the Bonny Light receipt.",
  "85360000.00, the whole Forcados crude cost on each part."],
 "The value of a receipt is its share of that crude's cost. The plan's Forcados crude cost is 85360000.00, and each of the three parts, rcpt-2, rcpt-3 and rcpt-4, carries 28453333.33.")

q(1, "The same plan is cascaded again at a cargo size of 150000 bbl. What does the digest show changing?",
 "The crude receipts become 15, and the plan's volumes and margin stay as they were.",
 ["The crude receipts stay at 6, and each carries a smaller share of its crude.",
  "The plan runs less Forcados, since each smaller cargo holds less of the crude.",
  "The crude receipts become 15, and the margin is solved again for the extra cargoes."],
 "The cargo size changes the schedule and leaves the plan alone. At 150000 bbl Forcados arrives on eight dates from 2027-03-01 to 2027-03-22, and the plan's crude volumes, costs and margin do not change.")

q(3, "What does the value on a cdu run event, 507258.06, stand for?",
 "Its share of the crude unit's operating cost, money the refinery spends.",
 ["Its share of the crude cost of the barrels that week's run distils.",
  "Its share of the revenue from the products that week's run makes.",
  "The margin earned on the 405806.45 bbl that the run distils."],
 "Receipts carry the crude cost, runs carry the unit operating cost and lifts carry the revenue. The scheduled cdu total is 2536290.32, the crude unit's operating cost for the month.")

q(0, "Where in each week does ABUA's schedule date a unit run, and where a product lift?",
 "Runs on the first day of each week, lifts on the last, the fifth lift on 2027-03-31.",
 ["Both on the first day of each week, from 2027-03-01 through to 2027-03-29.",
  "Runs on the last day of each week, and lifts on the first day of the next.",
  "Runs on every day of the period, lifts once at the period's end, 2027-03-31."],
 "Runs fall on 2027-03-01, 2027-03-08, 2027-03-15, 2027-03-22 and 2027-03-29. Lifts fall on 2027-03-07, 2027-03-14, 2027-03-21, 2027-03-28 and 2027-03-31, the fifth week cut short by the end of the period.")

q(2, "What does ABUA's event table carry for Naphtha export and Gasoil export?",
 "No lift at all; the table lifts gasoline, jet, diesel and fuel_oil.",
 ["Five lifts each of 0.00 bbl, dated with the other products.",
  "One lift each, on 2027-03-31, the last day of the period.",
  "Five lifts each, valued at 72.5000 and 89.5000 a barrel."],
 "The product lifts, lift-22 to lift-41, are five each for gasoline, jet, diesel and fuel_oil, product lifts 20. Both exports sell 0.00 bbl in the plan and appear in neither the event table nor the totals table.")

q(1, "The cdu run dated 2027-03-29 falls in a week cut short by the end of March. What quantity does it carry?",
 "405806.45 bbl, the same as each of the four runs before it.",
 ["None: the short week's run is folded into the run of 2027-03-22.",
  "2029032.26 bbl, the whole month's crude in one final run.",
  "130000.00 bbl, the short week's share of the crude unit's month."],
 "The schedule's events are equal whatever the length of the week they fall in. It does not weight a short week lightly, and 130000.00 bbl is each dht run.")

q(3, "What does cascadeToSchedule do when it is called with periodStart left out?",
 "It reads the machine clock and dates the schedule from that day.",
 ["It refuses and names the missing period start, as a blank cost is refused.",
  "It dates the schedule from 2027-03-01, the default period start it carries.",
  "It returns a schedule of 0 events."],
 "The digest names the argument: cascadeToSchedule reads it when periodStart is left out. The same plan cascaded on two different days would then give two different schedules.")

q(0, "ABUA's schedule is built in seven time zones with the period start passed as the string \"2027-03-01\". What does the digest print?",
 "Every zone's 41 dates match the UTC run, from 2027-03-01 to 2027-03-31.",
 ["Africa/Lagos and Pacific/Kiritimati start one day early, on 2027-02-28, and the rest match.",
  "The zones west of Greenwich start one day early, on 2027-02-28.",
  "Only UTC and Europe/London match; the other five shift by a day."],
 "A period start given as a YYYY-MM-DD string is the same calendar day in every zone. That is how the Suite page passes it and how this digest passes it.")

q(2, "The period start is handed over as new Date(2027, 2, 1), a Date built at local midnight. In which zones does the schedule start on 2027-02-28?",
 "Africa/Lagos and Pacific/Kiritimati.",
 ["America/New_York and America/Los_Angeles.",
  "Pacific/Pago_Pago and Pacific/Kiritimati.",
  "Every zone the digest tried except UTC."],
 "Built at local midnight, the Date gives 2027-02-28 as the first date in Africa/Lagos and Pacific/Kiritimati, and every date matches UTC reads false there. The two American zones and Pago Pago keep 2027-03-01.")

q(1, "With the Date built at local midnight, America/New_York starts on 2027-03-01. What does that reading show about the Date form?",
 "It holds in New York and fails in Lagos, so one zone's reading proves nothing.",
 ["It is safe everywhere, since New York already crosses the spring clock change inside the period.",
  "It fails only in zones whose clocks change during the 31 day period.",
  "The engine reads the Date's local calendar day in every zone it runs in."],
 "With the Date form, America/New_York reads 2027-03-01 and matches UTC, while Africa/Lagos and Pacific/Kiritimati read 2027-02-28. New York and Los Angeles cross the spring clock change inside the period and still match, and the engine reads the Date's UTC calendar day.")

q(2, "An infeasible plan is cascaded to a schedule. What comes back?",
 "0 events, with the note \"No optimal plan to cascade.\"",
 ["41 events dated from 2027-03-01, each carrying a value of 0.00.",
  "The plan's refusal, repeated on every event.",
  "The last optimal schedule, unchanged until the plan is fixed."],
 "When the plan has no answer there is nothing to spread. A schedule of 0 events says there is no month to read actuals against until the plan is fixed.")

q(3, "Which three things does the engine's note on ABUA's schedule name as not modelled?",
 "Tank capacity, jetty windows and turnarounds.",
 ["Cargo sizes, unit runs and lifts.",
  "Crude costs, product prices and unit operating costs.",
  "Time zones, the clock change and the period start."],
 "The note reads \"Tank capacity, jetty windows and turnarounds are not modelled: this is the shape of the month to read actuals against, not a berth-level schedule.\" A turnaround is entered in the plan, as a unit typed as shut.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/intermediate/rfi_m05.json', label='rfi_m05', expect_n=15)
finish()
