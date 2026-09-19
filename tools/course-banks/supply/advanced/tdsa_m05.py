import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Expert m05, What Breaks the Price. Digest SECTION 22. 15 questions.
# The exchange rates swept, the cap and every rate behind the chain are the
# course's invented BADAGRY figures.

q(1, "Against the course's invented cap of 1150.0000 naira a litre, where does solveCrossing find the BADAGRY breakeven, with every exchange rate swept invented?",
 "At 1641.7105 naira to the dollar, after 18 bisection steps.",
 ["At 1650.0000 naira to the dollar, the first swept row whose verdict reads false.",
  "At 1500.0000 naira to the dollar, the last swept row whose verdict reads true.",
  "At 1520.4000 naira to the dollar, the invented rate the landed cost was built on."],
 "The crossing lies between the rows at 1500.0000 and 1650.0000, and bisection finds it at 1641.7105. A sweep reports prices only at the values it was given.")

q(3, "Which bracket does priceSensitivity hand solveCrossing for the invented BADAGRY sweep?",
 "1200.0000 to 2100.0000 naira to the dollar, the lowest to the highest value swept.",
 ["1500.0000 to 1650.0000 naira to the dollar, the two rows either side of the turn.",
  "1300 to 1500 naira to the dollar, the range the course uses for the bracket test.",
  "1350.0000 to 1950.0000 naira to the dollar, the swept rows inside the two ends."],
 "The bracket the engine halves is the whole swept range. The rows at 1500.0000 and 1650.0000 show where the crossing lies; they are not the bracket.")

q(0, "solveCrossing is run against the invented cap over a bracket from 1300 to 1500 naira to the dollar. What does it return?",
 "found false; REFUSED: No crossing in the range searched. The outcome has the same sign at both ends.",
 ["found true at 1500, the end of the bracket nearer the crossing, after 18 bisection steps.",
  "REFUSED: The search bracket is not a valid interval, since the crossing lies above it.",
  "found true at 1641.7105, since the engine widens the bracket until the sign changes."],
 "Both end shortfalls, -211.7551 and -87.8167 naira a litre, are negative. The engine does not search outside the bracket it was handed and returns no value.")

# audit-advanced: explanation flourish ("goes back to the person who typed it") unprinted
q(2, "solveCrossing is handed the invented exchange rate bracket written backwards, 2100 to 1200. Which answer does it give?",
 "REFUSED: The search bracket is not a valid interval.",
 ["It swaps the ends and finds 1641.7105.",
  "REFUSED: No crossing in the range searched. The outcome has the same sign at both ends.",
  "It halves from the high end and reports none."],
 "The digest prints the bracket written backwards, 2100 to 1200, as that refusal, with no breakeven. The same-sign refusal belongs to a valid bracket that holds no crossing, such as 1300 to 1500.")

q(2, "The breakeven search is run on the invented BADAGRY chain with no cap. What does the engine report?",
 "breakeven none",
 ["breakeven 1500.0000",
  "breakeven 1641.7105",
  "breakeven 2100.0000"],
 "With no cap there is nothing to cross. The engine does not invent a cap to search against, and a breakeven of none is a different answer from a figure of zero.")

# audit-advanced: key asserted the -87.8167 IS the sweep row; the digest prints only that the two agree
q(1, "The search over the invented rates 1300 to 1500 prints end shortfalls of -211.7551 and -87.8167 naira a litre. Where does each come from?",
 "The -87.8167 matches the sweep row at 1500.0000; 1300 has no sweep row, so the -211.7551 is printed only here.",
 ["Both are sweep rows, at 1300 and at 1500, printed again beside the refusal for comparison.",
  "The -211.7551 is the sweep row at 1200.0000; the -87.8167 is the midpoint of the bracket.",
  "Both are the search's own evaluations, since no sweep row falls inside the 1300 to 1500 bracket."],
 "The sweep holds a row at 1500.0000 with a shortfall of -87.8167 and a verdict of true. The swept values run 1200.0000, 1350.0000, 1500.0000 and on, so 1300 has no row, and its shortfall appears only beside the refusal.")

# audit-advanced: key gave an interpretive reason ("printing it would be false"); now keyed on lines 647 and 673
q(3, "Why does solveCrossing return no value for the invented 1300 to 1500 bracket?",
 "Both ends read a negative shortfall, so the price does not meet the cap inside the bracket.",
 ["At 1500 the shortfall is positive, so the crossing lies below the bracket and out of reach.",
  "Values are returned only for brackets that start at the lowest swept rate.",
  "A bracket must span 18 bisection steps to report a crossing."],
 "If the price does not cross the cap inside the range searched, the engine says so and returns no value. A negative shortfall means the cap sits above the price, and it does at 1300 and at 1500.")

# audit-advanced: "Government share" named a naira figure; the digest's share is a fraction
q(0, "Moving the invented exchange rate from 1200.0000 to 2100.0000, which printed figure moves with it besides the landed cost?",
 "The Government figure, which reads 97.1210 naira a litre at 2100.0000.",
 ["The invented levies, which are charged as a share of the landed cost at the gate.",
  "The invented dealer margin, which is quoted per dollar of cargo.",
  "No other figure; margins and levies are per litre."],
 "The per-litre margins and levies add their amounts on every row. The tax is a percent of the running total, which holds the landed cost, so the Government figure moves from 74.4281 at 1500.0000 to 97.1210 naira a litre at 2100.0000.")

# audit-advanced: REPLACED: "why rebuild instead of scaling" keyed an unprinted reason
q(0, "What does priceSensitivity do at each invented exchange rate it sweeps on BADAGRY?",
 "It re-prices the whole chain at that rate.",
 ["It scales the base price of 1074.8249 by the rate.",
  "It moves the landed cost and holds every other amount.",
  "It solves for the cap at that rate."],
 "priceSensitivity re-prices the whole chain at each value of one driver. The element table shows the landed cost and the Government figure both moving, 872.8052 and 74.4281 naira a litre at 1500.0000 against 1221.9272 and 97.1210 at 2100.0000, and the cap stays at 1150.0000.")

# audit-advanced: REPLACED: "why the engine bisects" keyed an unprinted design reason
q(3, "Which pump price and verdict does the invented sweep print at 1500.0000 naira to the dollar, against the cap of 1150.0000?",
 "At 1062.1833 naira a litre, the cap covers it.",
 ["At 1074.8249 naira a litre, as at the base rate, the cap covers it.",
  "At 1155.1370, the cap does not cover it.",
  "At 1062.1833 naira a litre, the cap does not cover it."],
 "The row at 1500.0000 prints 1062.1833 naira a litre, a shortfall of -87.8167 and a verdict of true. 1074.8249 is the price at the invented base rate of 1520.4000, and 1155.1370 the row at 1650.0000.")

q(1, "In the invented sweep, what are the shortfalls at 1650.0000 and at 2100.0000 naira to the dollar?",
 "5.1370 and 283.9982 naira a litre",
 ["-87.8167 and 191.0445 naira a litre",
  "98.0908 and 1433.9982 naira a litre",
  "-75.1751 and 283.9982 naira a litre"],
 "The shortfall is the price less the invented cap. 1155.1370 at 1650.0000 and 1433.9982 at 2100.0000 sit above the cap by those figures, and both verdicts read false.")

q(2, "What landed cost a litre does the chain carry at an invented 1650.0000 naira to the dollar?",
 "960.0857 naira a litre",
 ["872.8052 naira a litre",
  "884.6753 naira a litre",
  "1221.9272 naira a litre"],
 "The element table prints 960.0857 at 1650.0000. 872.8052 is the row at 1500.0000, 1221.9272 the row at 2100.0000, and 884.6753 the landed cost at the invented base rate of 1520.4000.")

q(3, "What does the invented exchange rate sensitivity table say about the ocean loss and the exchange rate moving together?",
 "Nothing; it moves one input and holds every other at its BADAGRY value.",
 ["That the two effects add, so the ocean loss sweep can be stacked on each row.",
  "That the exchange rate dominates, since it multiplies every dollar in the chain.",
  "That the breakeven falls by the loss percent."],
 "Each sweep is a separate single-driver table. Neither says what happens when two inputs move at once, and neither assigns a likelihood to any row.")

# audit-advanced: REPLACED: an edited dealer margin is never re-solved in the digest; key rested on inference
q(0, "solveCrossing is handed the invented BADAGRY chain and the cap. Which value does it search for?",
 "The exchange rate at which the pump price meets the cap.",
 ["The cap at which the pump price meets the base exchange rate.",
  "The pump price at the invented base rate of 1520.4000.",
  "The landed cost at which the Government figure meets the cap."],
 "priceSensitivity re-prices the chain at each value of one driver, here the exchange rate, and solveCrossing bisects for the value at which the price meets the cap. On BADAGRY it finds 1641.7105 naira to the dollar against 1150.0000.")

q(2, "What does the invented sensitivity table leave out, which a reader might be tempted to take from it?",
 "Any likelihood for a row, such as how probable a move to 1800.0000 is.",
 ["The shortfall at each rate, which it reports only for the rows that fail.",
  "The verdict at each rate, which it leaves to be read from the breakeven.",
  "The pump price at each rate, since it carries only the landed cost."],
 "The table is a set of re-pricings at stated values, read row by row. A probability over the exchange rate, or a valuation of the chain, is outside this course.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/advanced/tdsa_m05.json', expect_n=15)
finish()
