import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Expert m06, The Expert Reading. Digest SECTIONS 18 to 24. 15 questions.
# Every BADAGRY rate, the ocean loss, the exchange rate and the cap are the
# course's invented figures.

# audit-advanced: distractor "8 of 9" resolved only against a SECTION 1 count row
q(2, "Held finding H2 is stated as counts on the two templates. Which counts are they?",
 "IMPORT_TEMPLATE ships 9 of 9 rates as none, and PUMP_TEMPLATE 7 of 7.",
 ["IMPORT_TEMPLATE ships 7 of 9 rates as none, keeping the freight and insurance rates, and PUMP_TEMPLATE 7 of 7.",
  "IMPORT_TEMPLATE ships 9 of 9 rates as none, and PUMP_TEMPLATE ships its value added tax rate alone of 7.",
  "IMPORT_TEMPLATE ships its demurrage figure alone and every other rate as none, and PUMP_TEMPLATE 7 of 7."],
 "H2: the volume correction coefficient tables and every published rate stay unshipped. That is why every rate in this tier is invented for the course and says so.")

q(0, "H1 is a held finding on the invented BADAGRY walk. What is it?",
 "The discharge charges are billed on the bill-of-lading quantity, and which quantity a terminal bills on is a contract term the engine does not know.",
 ["The discharge charges are billed on the outturn, and the engine cannot say what the bill of lading held once the ocean loss is typed in.",
  "The invented jetty and storage rates are unverified, and the engine refuses both lines until a published rate is confirmed against them.",
  "The ocean loss is an input, and the engine cannot estimate it from the voyage, so every outturn in the course is held back from grading."],
 "On BADAGRY the jetty and storage lines, 54927.30 and 121297.79 USD, rest on the 45772.752 m3 invoiced while 45566.774 m3 came ashore. H1 records that the engine cannot choose between them.")

# audit-advanced: explanation inference ("would have to be reproduced") unprinted
q(3, "For insurance quoted on CIF, how do the engine and its independent oracle each reach CIF?",
 "The engine uses a closed form; the oracle iterates the fixed point.",
 ["The engine iterates the fixed point; the oracle uses the closed form.",
  "Both iterate the fixed point, from a first guess of C&F.",
  "Both use the closed form, the oracle in rational arithmetic."],
 "The fuelpricing oracle's method column lists insurance on CIF by fixed-point iteration, where the engine uses a closed form. A golden figure beside an engine figure is two methods agreeing.")

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

# audit-advanced: key and explanation characterised the checking ("nobody here checks", "honest shape"); now printed
q(3, "The published source column reads none on both golden file rows. What does that tell a reader about the course's figures?",
 "No rate or coefficient is a published figure, and each golden figure is an independent method agreeing with the engine.",
 ["Every figure is unvalidated, since an oracle without a published source can only restate the engine's own figures in its own words.",
  "Every rate has been checked against the regulation in force, and the column records that no other published source was needed.",
  "The oracles and the engine share one source file, so a golden figure is the engine's figure saved at the time of the last release."],
 "The terminal row reads none because no coefficient table is shipped, and the pricing row because every rate is synthetic. Each golden file is written by an independent stdlib Python oracle, and the volume correction form is pinned by tests.")

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

# audit-advanced: key 1.00 against tdsi_exam Q10 (5078.400 m3); now asks for the rule behind the printed pair, and "0.000 m3" reached back to SECTION 3
q(1, "Among the rules the engines keep, IB-T1 and IB-T2 together hold 5453.100 m3 over a combined heel of 420.000 m3, and their pumpable stock prints as 5078.400 m3. Which rule gives that figure?",
 "Pumpable stock is counted tank by tank, each tank's stock above its own heel.",
 ["The pair's stock less the pair's heel, taken as one pool.",
  "Pumpable stock is corrected to standard volume, while the stock is gross observed.",
  "A reserve above the heel is held back on every tank before it counts as pumpable."],
 "The rule reads: pumpable stock is counted tank by tank, and the course measures it on IB-T1 and IB-T2 as 5078.400 m3 of pumpable stock. Each tank's pumpable stock is its stock above its own heel and never below zero, and no pump lends one tank's volume to another's heel.")

# audit-advanced: key 0.89 against tdsi_m01 Q2 (same refusal asked the same way); now asks which rule the sentence enforces
q(2, "Among the rules the engines keep, which one does the sentence \"Arrival rate and load time are both needed.\" enforce?",
 "A load time of zero minutes is refused.",
 ["Bays are a whole number, one or more.",
  "throughputEconomics needs the throughput and the fee.",
  "A day is not closed without its opening stock."],
 "The course lists the rule \"a load time of zero minutes is refused\" with that sentence. The bays rule prints \"The number of bays must be a whole number, one or more.\", the money rule \"Throughput and the throughput fee are both needed for the money answer.\" and the opening stock rule \"No opening stock, so the day cannot be closed.\"")

q(3, "throughputEconomics takes a blank cost as zero and names it in assumedZero. How does landedCost treat a blank rate?",
 "It leaves the line out, names it as missing and labels the total a floor.",
 ["It takes the rate as zero and names it in assumedZero, as the depot ledger does.",
  "It refuses the whole walk until every one of the 9 rates is typed.",
  "It fills the rate from the template, which ships each rate as none."],
 "Both engines name what they did not get. The depot ledger reports its margin with assumedZero; the walk reports complete false and a total the engine calls a floor.")

# audit-advanced: distractor "0.000 m3" reached back to SECTION 7; explanation quoted the course thesis, not the digest
q(0, "The AKODO demonstration takes an opening stock from the day's own closing dip. Why is that rule in the list the engines keep?",
 "It balances every day and so measures nothing, which is why the opening stock is an input.",
 ["It closes the day at the dipped standard volume, the one figure the reconciliation is built to check.",
  "It is the method the engine uses when the opening stock is left blank on a reconciliation.",
  "It shows the tolerance is set too wide, since every row sits within it with nothing unaccounted."],
 "An opening stock derived from the day's own closing dip balances every day and measures nothing: every row of the demonstration balances, so none of them measured anything. A day is not closed without its opening stock.")

# audit-advanced: REPLACED: the crude/refinery seam is LESSON_TASK, printed nowhere in the digest (a VCF refusal replacement scored 0.67 against tdsb_m01 Q10)
q(3, "Which two things does the engines repository keep unshipped under held finding H2?",
 "The volume correction coefficient tables and every published rate.",
 ["The strapping tables of the AKODO tanks and the dips read against them.",
  "The diesel emission factor and the typical product densities.",
  "The golden files and the independent oracles that write them."],
 "H2: the volume correction coefficient tables and every published rate stay unshipped. PRODUCT_REFERENCE ships typical densities, and the two golden files and their oracles are listed in the oracle table.")

# audit-advanced: REPLACED: "a period's margin, never a valuation" is LESSON_TASK, and 4988.00/7.80 reached back to SECTIONS 2 and 13
q(0, "Among the rules the engines keep, what does throughputEconomics report for a loss when no product density is supplied?",
 "No loss weight and no emissions, with a carbon note that says why.",
 ["The loss weighed at the typical density PRODUCT_REFERENCE lists.",
  "A refusal of the whole money answer until the density is typed.",
  "Emissions of zero kg CO2e, with the loss weight reported as none."],
 "The rule reads: a loss with no density has no weight and no emissions, and the carbon note says why. The money answer needs only the throughput and the fee, and PRODUCT_REFERENCE is read only when a caller passes a density in.")

q(2, "Reading the invented BADAGRY chain end to end, where do the ocean loss and the exchange rate each enter?",
 "The loss divides the landed total over the outturn; the exchange rate converts the dollar cost a litre sold once.",
 ["The loss is added to the landed total as a charge; the exchange rate converts each landed line to naira.",
  "The loss reduces the per-quantity charges to the outturn; the exchange rate converts the FOB value first.",
  "Both enter at the pump, where the loss is a margin and the rate is applied to the running total."],
 "The landed total of 26513943.86 USD is spread over 45566774.37 litres, 0.581870 USD a litre sold, then converted once at the invented 1520.4000 to 884.6753 naira a litre.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/advanced/tdsa_m06.json', expect_n=15)
finish()
