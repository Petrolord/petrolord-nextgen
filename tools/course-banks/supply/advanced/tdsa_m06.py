import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Expert m06, The Expert Reading. Digest SECTIONS 18 to 24. 15 questions.
# Every BADAGRY rate, the ocean loss, the exchange rate and the cap are the
# course's invented figures.

q(2, "Held finding H2 is stated as counts on the two templates. Which counts are they?",
 "IMPORT_TEMPLATE ships 9 of 9 rates as none, and PUMP_TEMPLATE 7 of 7.",
 ["IMPORT_TEMPLATE ships 7 of 9 rates as none, keeping the freight and insurance rates, and PUMP_TEMPLATE 7 of 7.",
  "IMPORT_TEMPLATE ships 9 of 9 rates as none, and PUMP_TEMPLATE ships its value added tax rate alone of 7.",
  "IMPORT_TEMPLATE ships 8 of 9 rates as none, keeping the per_cargo demurrage figure, and PUMP_TEMPLATE 7 of 7."],
 "H2: the volume correction coefficient tables and every published rate stay unshipped. That is why every rate in this tier is invented for the course and says so.")

q(0, "H1 is a held finding on the invented BADAGRY walk. What is it?",
 "The discharge charges are billed on the bill-of-lading quantity, and which quantity a terminal bills on is a contract term the engine does not know.",
 ["The discharge charges are billed on the outturn, and the engine cannot say what the bill of lading held once the ocean loss is typed in.",
  "The invented jetty and storage rates are unverified, and the engine refuses both lines until a published rate is confirmed against them.",
  "The ocean loss is an input, and the engine cannot estimate it from the voyage, so every outturn in the course is held back from grading."],
 "On BADAGRY the jetty and storage lines, 54927.30 and 121297.79 USD, rest on the 45772.752 m3 invoiced while 45566.774 m3 came ashore. H1 records that the engine cannot choose between them.")

q(3, "For insurance quoted on CIF, how do the engine and its independent oracle each reach CIF?",
 "The engine uses a closed form; the oracle iterates the fixed point.",
 ["The engine iterates the fixed point; the oracle uses the closed form.",
  "Both iterate the fixed point, from a first guess of C&F.",
  "Both use the closed form, the oracle in rational arithmetic."],
 "A golden figure beside an engine figure is two methods agreeing. A mistake in one method would have to be reproduced by a quite different method to go unnoticed.")

q(1, "For the invented BADAGRY exchange rate breakeven, which way does the pairing between engine and oracle run?",
 "The engine bisects; the oracle solves the breakeven in closed form.",
 ["The engine solves in closed form; the oracle bisects inside the swept bracket.",
  "Both bisect, the oracle with a tighter tolerance on the sign change.",
  "The engine bisects; the oracle re-runs the sweep at finer steps."],
 "The pair runs the opposite way to the insurance pair, where the engine is the closed form. The fuelpricing oracle's method column lists a closed-form FX breakeven.")

q(1, "What do the oracles never check in this course?",
 "The wording of a refusal.",
 ["The verdicts, such as whether a cap covers the chain.",
  "The engine's figures on the landed cost walk.",
  "The Erlang C by the exact factorial form."],
 "The oracles check figures and verdicts. Every refusal sentence the course quotes is the engine's own and is quoted rather than checked, which is why it is quoted verbatim.")

q(3, "The published source column reads none on both golden file rows. What does that tell a reader about the course's figures?",
 "Rates and coefficients are data nobody here checks against a published figure; arithmetic and queueing are checked by independent methods.",
 ["Every figure is unvalidated, since an oracle without a published source can only restate the engine's own figures in its own words.",
  "Every rate has been checked against the regulation in force, and the column records that no other published source was needed.",
  "The oracles and the engine share one source file, so a golden figure is the engine's figure saved at the time of the last release."],
 "Every rate is synthetic, and the volume correction form is pinned by tests. The checking has an honest shape: methods agree on the arithmetic, and data carries no check.")

q(0, "No coefficient table is shipped, so how is the volume correction form pinned?",
 "By tests asserting the form and two invariants: a VCF of exactly 1 at 15 C and below 1 above it.",
 ["By comparing the synthetic row against a published commodity group row to six decimals at each temperature swept.",
  "By the terminal oracle, rebuilding the VCF from tank geometry.",
  "By the typed AKODO VCFs, read as the reference."],
 "The invariants need no coefficient. On the course's synthetic row, the VCF at 15 C is 1.000000, exactly one: true.")

q(2, "What does the terminal golden file, terminaldepot_cases.json, carry?",
 "4 dips, 4 refusals, 4 queues, 3 reconciled days and 1 tank farm.",
 ["3 landed cost cases, 1 truck lane, 1 fleet and 1 station.",
  "4 dips, 3 refusals, 4 queues, 4 reconciled days and 1 station.",
  "1 pump build-up with its breakeven, and 4 queues."],
 "The landed cost cases (floor, full and insurance on CIF), the lane, the fleet, the pump build-up and the station are carried by fuelpricing_cases.json.")

q(1, "IB-T1 and IB-T2 together hold 5453.100 m3 over a combined heel of 420.000 m3. What pumpable stock does the engine report for the pair?",
 "5078.400 m3",
 ["5453.100 m3",
  "420.000 m3",
  "0.000 m3"],
 "Pumpable stock is counted tank by tank, each tank's stock above its own heel and never below zero. No pump lends one tank's volume to another's heel.")

q(2, "The rules the engines keep include \"A load time of zero minutes is refused.\" Which sentence does the course print for it?",
 "\"Arrival rate and load time are both needed.\"",
 ["\"The number of bays must be a whole number, one or more.\"",
  "\"Throughput and the throughput fee are both needed for the money answer.\"",
  "\"No opening stock, so the day cannot be closed.\""],
 "A zero load time is refused with the same sentence as a missing arrival rate. The other three are the engine's sentences for bays, for the money answer and for the day.")

q(3, "throughputEconomics takes a blank cost as zero and names it in assumedZero. How does landedCost treat a blank rate?",
 "It leaves the line out, names it as missing and labels the total a floor.",
 ["It takes the rate as zero and names it in assumedZero, as the depot ledger does.",
  "It refuses the whole walk until every one of the 9 rates is typed.",
  "It fills the rate from the template, which ships each rate as none."],
 "Both engines name what they did not get. The depot ledger reports its margin with assumedZero; the walk reports complete false and a total the engine calls a floor.")

q(0, "The AKODO demonstration takes an opening stock from the day's own closing dip. Why is that rule in the list the engines keep?",
 "It balances every day and so measures nothing, which is why the opening stock is an input.",
 ["It closes the day at the dipped standard volume, the one figure the reconciliation is built to check.",
  "It is the method the engine uses when the opening stock is left blank on a reconciliation.",
  "It shows the tolerance is set too wide, since every row sits within it at 0.000 m3."],
 "An opening stock derived from the closing dip balances every day. A figure built so that it cannot come out wrong proves nothing, so the engine requires the opening stock.")

q(3, "Which course owns the question of where the BADAGRY density of 742.8 kg/m3 comes from?",
 "crude, which owns assays and blending",
 ["refinery, which owns the plan",
  "supply, which owns the measurement chain",
  "the Economics courses, which own valuation"],
 "This course takes the density as an input read off a certificate. Where a cargo's quality comes from belongs to Crude Assay & Blending.")

q(0, "The IBAFO throughput margin is 4988.00 USD for the period, on an invented fee of 7.80 USD a cubic metre. How does the final module classify it?",
 "A period's margin, never a valuation; nothing in this course discounts it.",
 ["A valuation of the depot, once it is discounted over the years the depot runs.",
  "A net present value, since revenue less costs is the first year of a cash flow.",
  "A figure owned by refinery, since the depot's margin is a refinery margin."],
 "No course here computes a net present value, an internal rate of return, a Monte Carlo simulation or a decision tree. Those belong to the Economics courses.")

q(2, "Reading the invented BADAGRY chain end to end, where do the ocean loss and the exchange rate each enter?",
 "The loss divides the landed total over the outturn; the exchange rate converts the dollar cost a litre sold once.",
 ["The loss is added to the landed total as a charge; the exchange rate converts each landed line to naira.",
  "The loss reduces the per-quantity charges to the outturn; the exchange rate converts the FOB value first.",
  "Both enter at the pump, where the loss is a margin and the rate is applied to the running total."],
 "The landed total of 26513943.86 USD is spread over 45566774.37 litres, 0.581870 USD a litre sold, then converted once at the invented 1520.4000 to 884.6753 naira a litre.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/advanced/tdsa_m06.json', expect_n=15)
finish()
