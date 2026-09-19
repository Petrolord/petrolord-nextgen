import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Expert m06, The Expert Reading. Digest section 24, read with 19 to 23
# as one month and one expansion, as the four lessons of m06 teach it: the
# ODIOMA month end to end, the expansion end to end, what is held and what the
# oracles check, and where the course hands over. H1, H2 and H3 are asked as
# limits only; materialBalance is never computed. 15 questions.

q(0, "What does held item H1 say about the scaling exponents 0.6 and 0.9?",
 "They are defaults for a vendor's own figures to replace.",
 ["They are published constants that the engine may not change.",
  "They are fitted to the ODIOMA expansion capital and to nothing else.",
  "They set the tax and discount rates of the screen."],
 "H1: the scaling exponents 0.6 and 0.9 are defaults for a vendor's own figures to replace, and no published source for them is in the engines repository. A vendor quotation for the actual plant replaces the exponent.")

q(2, "Held item H3 concerns materialBalance. Why can that function not close a refinery tank?",
 "A unit run moves nothing, and crude leaves its tank through the crude unit.",
 ["It refuses any ledger that holds more than one crude receipt in a period.",
  "It counts receipts out and deliveries in, the reverse of a refinery tank.",
  "It needs the tank capacity, which the schedule does not model."],
 "materialBalance counts receipts in and deliveries, burns, flares, vents and losses out, and a unit run moves nothing. A refinery's crude leaves through the crude unit and its products arrive from units, so the function serves a tank whose movements are receipts and deliveries. This course prints no material balance.")

q(3, "A plan configuration lists no feedless unit. What does the plan write for the crude unit?",
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
 ["A plan's margin.",
  "A schedule's dates.",
  "The tax-loss pool."],
 "The oracles check answers: a figure, a status, a date. Neither checks a refusal's wording, so every refusal sentence in the course is the engine's own and is quoted as printed.")

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
  "The plan carries inventory from one period to the next."],
 "The engines state: yields are fixed vectors; quality is not carried through the plan; one period at a time with no inventory between periods; the schedule models no tank capacity, jetty window or turnaround.")

q(1, "A unit is held down by a turnaround during the month. How does that appear in the units against plan table?",
 "Only as a shortfall against plan.",
 ["As a turnaround flag on the unit's row.",
  "As an unmatched movement in the actual ledger.",
  "As unexplained money on the unit_run line."],
 "The schedule models no tank capacity, jetty window or turnaround, and the app reports the gap and does not say why it happened. A unit held down for any of those reasons shows only as a difference from plan.")

q(2, "The Forcados receipt reads 0.00 bbl, and the escravos receipt and the crude unit's run both read 735000.00 bbl. Which reading do the figures support?",
 "One crude did not arrive, and the unit ran the one that did.",
 ["The crude unit was down, so the Forcados cargo was turned away.",
  "The Forcados barrels were received under the escravos line.",
  "Both crudes arrived, and the unit ran below its capacity."],
 "Read in order, the figures describe a month in which one of the two crudes did not arrive, and the crude unit ran the one crude that did. That points at crude supply. It is a reading of the evidence, and the engine does not draw it.")

q(0, "What actual margin does the ODIOMA month close with, against a plan margin of 4776300.00?",
 "-235150.00",
 ["-5011450.00", "-5452450.00", "-44233150.00"],
 "Over the month the actual ledger's deliveries brought in less than its receipts and unit runs cost, which leaves -235150.00. The other three are variances: -5011450.00 across the ledgers, -5452450.00 on margin over the matched lines, and -44233150.00 every line's total as recorded.")

q(3, "Which three settings of the ODIOMA expansion make it a refinery case in the screening engine?",
 "Revenue as revenue, a royalty rate of 0, and the loss carried forward.",
 ["Mid-year discounting, a 12 percent rate, and a 22 year project life.",
  "Firm supply, 340 on-stream days, and a plant of 12000 bpd.",
  "A taxRate of 30, start year 2027, and the fiscalType TaxRoyalty."],
 "Revenue goes in as barrels at the slate's value with the crude bill inside opexFixed, the royalty rate is 0 because a refinery buys its crude, and lossCarryForward is true. The other settings are inputs any screen could carry.")

q(1, "Held item H2 deducts capital in the year it is spent. What makes that an acceptable screen for a refinery?",
 "The refinery's loss carry-forward, switched on.",
 ["The royalty rate of 0 set for every refinery case.",
  "The feedless unit taken as the crude unit of the plan.",
  "The mid-year convention on the NPV."],
 "The two settings work as a pair. Expensing capital when spent makes the loss early, in 2027 and 2028, and carrying it forward lets 2029 to 2032 use it. The royalty and feedless unit rulings answer other questions, and the NPV convention moves no deduction.")

q(2, "A learner wants to know why a stream is worth what the plan says. Which course takes that question?",
 "crude, Crude Assay & Blending",
 ["supply, Terminals, Depots & Fuel Supply",
  "The Economics courses",
  "The Professional tier of this course"],
 "The crude course owns linear programming and every crudeAssay and productBlending output, so what a shadow price means belongs there. This course uses the plan and its stream values.")

q(0, "Where does the course send the stock reconciliation of a tank, and the IRR a project returns?",
 "Stock reconciliation to supply; the IRR to the Economics courses.",
 ["Both to the Economics courses, as questions of value.",
  "Stock reconciliation to crude; the IRR to this tier.",
  "Both to supply, as questions of measured barrels."],
 "The supply course owns strapping, the VCF, stock reconciliation, the Erlang C queue, landed cost and pump price. The Economics courses own NPV, IRR, Monte Carlo and decision trees. This course graded neither the NPV nor the IRR.")

q(3, "Which habit does this tier carry forward from the month's variance lines?",
 "Sign a figure by what it does to the result before adding it.",
 ["Add every total as recorded, then sign the sum by its largest line.",
  "Fold money with no barrels into the nearest volume variance.",
  "Read a held item as a result to grade."],
 "The engine signs each line on margin before it adds, which is why -5452450.00 stands as the headline and -44233150.00 does not. The other two habits keep money with no barrels and movements with no plan in view, and read a held item as a limit of the tool.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/advanced/rfa_m06.json', expect_n=15)
finish()
