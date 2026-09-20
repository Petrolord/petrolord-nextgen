import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Expert m06, The Expert Reading. Digest section 24, read with 19 to 23
# as one month and one expansion, as the four lessons of m06 teach it: the
# ODIOMA month end to end, the expansion end to end, what is held and what the
# oracles check, and where the course hands over. H1, H2 and H3 are asked as
# limits only; materialBalance is never computed. 15 questions.

q(0, "What do the engines state about inventory from one period to the next?",
 "One period at a time, with no inventory between periods.",
 ["Closing stock from one month opens the next month's plan.",
  "Inventory is carried into the next period at the plan unit value.",
  "Only crude is carried over, at the cost it was bought for."],
 "The engines state that a plan covers one period at a time, with no inventory between periods. Nothing is carried over into the next month, at a plan unit value or at cost.")

q(2, "Held item H3 concerns materialBalance. Why can that function not close a refinery tank?",
 "A unit run moves nothing, and crude leaves its tank through the crude unit.",
 ["It counts burns, flares and vents in, beside the receipts.",
  "It counts receipts out and deliveries in, the reverse of a refinery tank.",
  "It counts a unit run as a delivery out of the tank."],
 "materialBalance counts receipts in and deliveries, burns, flares, vents and losses out, and a unit run moves nothing. A refinery's crude leaves through the crude unit and its products arrive from units, so the function serves a tank whose movements are receipts and deliveries. This course prints no material balance.")

q(3, "No unit in a configuration is left without a feed. What crude-unit row does the plan then write?",
 "No crude-unit row.",
 ["A crude-unit row for the first unit in the list.",
  "A refusal that names the missing crude unit.",
  "A crude-unit row with a capacity of 0.00 bbl."],
 "Of the three owner decisions in force, this is the one about the plan. With no feedless unit there is no unit to carry the crude, and the plan writes no crude-unit row.")

q(1, "Which golden file holds the cases that check the volume, price and unexplained split?",
 "refineryplanning_cases.json, with its 3 variance lines",
 ["modularrefinery_cases.json, with its 8 feasibility cases",
  "refineryplanning_cases.json, with its 1 schedule",
  "modularrefinery_cases.json, with its 5 scale points"],
 "refineryplanning_cases.json holds 6 plans, 3 variance lines and 1 schedule, written by the plan oracle. modularrefinery_cases.json holds 8 feasibility cases and 5 scale points, written by the feasibility oracle.")

q(2, "What is it that neither oracle checks?",
 "A refusal's wording.",
 ["A stream's value.",
  "A schedule's dates.",
  "The tax-loss pool."],
 "The plan oracle values a stream by re-solving with a small extra supply of it and dates the schedule by datetime.date, and the feasibility oracle keeps a dated tax-loss ledger. Neither checks a refusal's wording, so every refusal sentence is the engine's own and is quoted.")

q(0, "How does the plan oracle accept a plan and value a stream?",
 "Exact rational simplex with a duality certificate; a stream by re-solving with a small extra supply of it.",
 ["Floating point simplex checked against the engine to four decimals; a stream by its price in the configuration.",
  "Annual accounts and a dated tax-loss ledger used oldest first; a stream by its share of the plan's margin.",
  "A second run of the engine at a doubled capacity; a stream by the dual printed in the engine's own output."],
 "The plan oracle solves each plan in exact rational arithmetic and accepts it only with a duality certificate, and values a stream by exact re-solve. Annual accounts and a dated tax-loss ledger are the feasibility oracle's method.")

q(3, "Which of these is a limit the engines state about themselves?",
 "Quality is not carried through the plan.",
 ["Loss carry-forward is switched off for a refinery.",
  "Yields change with the crude unit's throughput.",
  "The schedule models each jetty window."],
 "The engines state: yields are fixed vectors; quality is not carried through the plan; one period at a time with no inventory between periods; the schedule models no tank capacity, jetty window or turnaround.")

q(1, "A unit loses part of the month to a turnaround and runs below plan. How does that appear in the units against plan table?",
 "Only as a shortfall against plan.",
 ["As a turnaround flag on the unit's row.",
  "As an unmatched movement in the actual ledger.",
  "As unexplained money on the unit_run line."],
 "The schedule models no tank capacity, jetty window or turnaround, and the app reports the gap and does not say why it happened. A unit held down for any of those reasons shows only as a difference from plan.")

q(2, "Which of these ODIOMA figures is in millions of US dollars?",
 "10.9559, the first year's tax with the loss carried forward",
 ["4776300.00, the plan margin reconcilePeriod reads",
  "80.2000, the actual unit value on the escravos line",
  "-5452450.00, the variance lines' total on margin"],
 "Barrels and US dollars print to two decimals, US dollars a barrel to four, and the screening engine's millions to four. The first year with tax to pay prints tax 10.9559 MM. 4776300.00 and -5452450.00 are US dollars, and 80.2000 is US dollars a barrel.")

q(0, "What actual margin does the ODIOMA month close with, against a plan margin of 4776300.00?",
 "-235150.00",
 ["-5011450.00", "-5452450.00", "-44233150.00"],
 "Over the month the actual ledger's deliveries brought in less than its receipts and unit runs cost, which leaves -235150.00. The other three are variances: -5011450.00 across the ledgers, -5452450.00 on margin over the matched lines, and -44233150.00 every line's total as recorded.")

q(3, "Which two settings of the ODIOMA screen are owner decisions in force for a refinery?",
 "A royalty rate of 0, and the loss carried forward.",
 ["Mid-year discounting, and a 12 percent rate.",
  "Firm supply, and a plant of 12000 bpd.",
  "A taxRate of 30, and the fiscalType TaxRoyalty."],
 "The owner decisions in force: no royalty on a refinery, so feasibilityEconomics passes a royalty rate of 0; and loss carry-forward, off by default for every other caller, which the refinery switches on. The third decision, the feedless unit as the crude unit, is about the plan. The other pairs are the expansion's own inputs.")

q(1, "Held item H2 deducts capital in the year it is spent. What makes that an acceptable screen for a refinery?",
 "The refinery's loss carry-forward, switched on.",
 ["The royalty rate of 0 set for every refinery case.",
  "The feedless unit taken as the crude unit of the plan.",
  "The mid-year convention on the NPV."],
 "The held item says carrying the loss forward covers the refinery case. The loss made in 2027 and 2028 is carried and used from 2029 to 2032, and the first tax falls in year 5. The royalty rate of 0 and the feedless unit are owner decisions on other matters.")

q(2, "A learner wants to know why a stream is worth what the plan says. Which course takes that question?",
 "crude, Crude Assay & Blending",
 ["supply, Terminals, Depots & Fuel Supply",
  "The Economics courses",
  "The Professional tier of this course"],
 "Stream values belong to the plan, and what lies behind them is taught in the crude course. This course reads each value as the plan prints it.")

q(0, "What part does the NPV of 88.6345 million play in this course?",
 "It is read as the feasibility screen's answer.",
 ["It is graded in this course, to four decimals.",
  "It moves with the start year, so each run is dated.",
  "It is the lifetime tax with the loss carried forward."],
 "The Economics courses teach and grade the NPV; this course reads it as the feasibility screen's answer. With start year 2031 the NPV reads 88.6345, as it does with 2027, and 196.1780 MM is the total tax over the life with the loss carried forward.")

q(3, "What does the engine do to each variance line before it adds the lines into the headline total?",
 "It signs each line's total by what the line did to margin.",
 ["It adds every total as recorded, then signs the sum.",
  "It folds money with no barrels into the nearest volume variance.",
  "It drops the lines that read an unexplained figure."],
 "On margin the fuel_oil total of -6092800.00 counts as it is and the Forcados total of -30508000.00 reads 30508000.00. Only then are the lines added, to the headline of -5452450.00, which carries the Forcados unexplained as -212000.00.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/advanced/rfa_m06.json', expect_n=15)
finish()
