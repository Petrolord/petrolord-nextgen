import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Expert m03, Ocean Loss and the Litre Sold. Digest SECTION 19 (and
# H1). 15 questions. Every rate, the ocean loss and the exchange rate are the
# course's invented BADAGRY figures.

q(0, "The course sweeps the invented ocean loss on BADAGRY from 0 to 0.45 percent, insurance on CIF. Which printed figure does not move?",
 "The landed total, 26513943.86 USD",
 ["The outturn, 45772751.75 litres",
  "The USD per litre sold, 0.579252",
  "The naira a litre sold, 880.6943"],
 "Every charge is levied on the bill-of-lading quantity or on a value formed from it. So the landed total prints 26513943.86 USD on every row while the outturn falls to 45566774.37 litres.")

q(2, "At the invented ocean loss of 0.45 percent, what outturn does the engine report for the BADAGRY cargo?",
 "45566774.37 litres",
 ["45681206.25 litres",
  "45315024.23 litres",
  "45772751.75 litres"],
 "outturn = bill-of-lading x (1 - ocean loss / 100). 45681206.25 litres is the row at 0.2 percent, 45315024.23 the row at 1 percent and 45772751.75 the bill of lading itself.")

q(3, "How does the engine form the cost of a litre sold on BADAGRY, with every rate invented for the course?",
 "The landed total divided by the outturn litres.",
 ["The landed total divided by the bill-of-lading litres, then raised by the ocean loss percent.",
  "The landed total with the lost litres priced as a charge, over the bill-of-lading litres.",
  "The FOB value divided by the outturn litres, with the landed lines added per litre after."],
 "The importer pays the landed total and sells the outturn. At the invented 0.45 percent that is 26513943.86 USD over 45566774.37 litres, printed as 0.581870 USD a litre sold.")

# audit-advanced: stem called a digest statement "the engine's own sentence"; explanation unprinted ("nobody is paid")
q(1, "The course's rule for the ocean loss reads \"The loss divides the cost.\" Which reading of BADAGRY does that statement rule out?",
 "Adding the loss to the build-up as a charge in dollars.",
 ["Spreading the total over the litres that arrived.",
  "Holding the landed total the same on every row of the sweep.",
  "Charging port on the 34000 bill-of-lading tonnes."],
 "The importer pays for the bill-of-lading quantity and sells the outturn. The loss divides the cost: the landed total stays at 26513943.86 USD and the litres it is spread over fall, so the loss is never a charge in the build-up.")

q(0, "The invented ocean loss on BADAGRY is raised from 0.45 to 1 percent. Which pair of printed figures moves?",
 "The outturn and the cost a litre sold: 45566774.37 to 45315024.23 litres, and 0.581870 to 0.585103 USD.",
 ["CIF and the landed total, since the invented duty reads CIF and a lost litre carries its share of duty.",
  "The jetty and storage lines, since the discharge charges are levied on the volume that crosses the jetty.",
  "The regulatory line and the landed total, since the per-litre charge is levied on each litre received."],
 "The loss moves only the litres the landed total is spread over. Every charge, including the per-litre regulatory line, is levied on the bill-of-lading quantity.")

# audit-advanced: explanation claimed shore tanks measure the loss, unprinted
q(2, "Where does the ocean loss sit among the inputs to the invented BADAGRY build-up?",
 "It is an input of its own, with no row in IMPORT_TEMPLATE.",
 ["It is a landed line of IMPORT_TEMPLATE with the basis per_cargo.",
  "It is estimated by the engine from the voyage and the product density.",
  "It is folded into the invented insurance rate."],
 "The template's 9 lines are charges, each on a base, and none of them is the loss. The ocean loss is stated with the cargo, beside the FOB price and the exchange rate, and outturn = bill-of-lading x (1 - ocean loss / 100).")

# audit-advanced: explanation gave an unprinted reason
q(3, "How does the invented exchange rate of 1520.4000 naira to the dollar enter the BADAGRY landed cost?",
 "Once, at the end: naira per litre sold = USD per litre sold x 1520.4000.",
 ["On every line of the walk, so each landed charge prints in naira before the total is formed.",
  "On FOB alone, since the cargo is bought in dollars and every later charge is billed locally.",
  "On the landed total, which is converted to naira before it is divided by the outturn litres."],
 "Every line of the walk is in dollars, and the exchange rate enters once, at the end: 0.581870 USD a litre sold becomes 884.6753 naira.")

# audit-advanced: explanation gave an unprinted reason
q(1, "The invented exchange rate is left out of the BADAGRY call. What does the engine report?",
 "The dollar cost a litre sold, with the local figure reported as none.",
 ["A refusal of the whole landed cost.",
  "The naira figure at 1520.4000, carried over as the last rate the record used.",
  "Both figures in dollars, the naira column copied from the dollar one."],
 "The dollar cost a litre sold needs no exchange rate. The naira figure is the dollar figure x the exchange rate, and with no exchange rate the engine returns the local figure as none.")

q(2, "Which figure does the pump price build-up of the next module start from, on the course's invented BADAGRY record?",
 "884.6753 naira a litre, the row at the invented 0.45 percent loss",
 ["880.6943 naira a litre, the row at a loss of 0",
  "889.5902 naira a litre, the row at a loss of 1 percent",
  "882.4592 naira a litre, the row at a loss of 0.2 percent"],
 "BADAGRY's invented ocean loss is 0.45 percent, so its landed cost at the depot gate is 0.581870 USD a litre sold converted once, 884.6753 naira a litre.")

# audit-advanced: TWO DEFENSIBLE ANSWERS: distractor "The outturn, 45566.774 m3" is the key's quantity in m3
q(0, "The walk prints FOB at 0.513357 USD per outturn litre on BADAGRY, every rate invented. Which quantity is that line spread over?",
 "The outturn, 45566774.37 litres",
 ["The bill of lading, 45772751.75 litres",
  "The bill of lading, 45772.752 m3",
  "The outturn at a loss of 1 percent, 45315024.23 litres"],
 "The priced case carries the invented 0.45 percent loss, and its column in USD per outturn litre spreads every line over that outturn. The other options are the outturn at 1 percent and the bill of lading in two units.")

q(3, "The invented jetty line prints 54927.30 USD on BADAGRY. Which two quantities does held finding H1 set side by side?",
 "45772.752 m3 on the bill of lading, which the line is levied on, and the outturn of 45566.774 m3.",
 ["45772.752 m3 on the bill of lading, and the 45772.700 m3 the cargo reads when typed as a volume.",
  "The outturn of 45566.774 m3, which the line is levied on, and 45772.752 m3 on the bill of lading.",
  "45772751.75 litres on the bill of lading, and the 45772700.00 litres typed from a rounded quote."],
 "The engine levies the jetty and storage lines on the bill-of-lading volume. The volume discharged is the outturn, and which one a terminal bills on is a contract term.")

# audit-advanced: key gave an inferred reason; now keyed on line 679-680; distractor "rates too small" unrefutable
q(1, "Why is H1 taught as a limit and never graded?",
 "It is held in the engines repository's findings: the billing quantity is a contract term the engine does not know.",
 ["The engine bills the discharge lines on the outturn, and the course prints no outturn figure.",
  "The jetty and storage lines are left out of the BADAGRY landed total until the basis is settled.",
  "The engine refuses the jetty and storage lines until the contract basis is typed."],
 "The course lists H1 among the items held by the engines repository in FINDINGS-supply, taught as limits and never graded. Whether a terminal bills on the bill of lading or on the outturn is a contract term the engine does not know, and the engine answers every per-quantity line on the bill of lading.")

q(2, "H1 names the jetty and storage lines. Which other invented BADAGRY lines does the same contract question reach?",
 "Every per-quantity line: regulatory 109854.60 USD on 45772751.75 litres and port 103700.00 USD on 34000.0000 tonnes.",
 ["The percentage lines: the invented duty and financing, since both are charged on CIF.",
  "No other line, since only a discharge charge is levied where the cargo comes ashore.",
  "The freight line alone, since it is the per-tonne line formed before the cargo lands."],
 "The engine charges each line quoted per quantity on the bill-of-lading quantity. The percentage lines are charged on values, and the landed total is divided by the outturn whatever the basis.")

q(3, "At an invented ocean loss of 0, what is the cost a litre sold on BADAGRY, and why?",
 "0.579252 USD, because the outturn equals the 45772751.75 bill-of-lading litres.",
 ["0.513357 USD, because with no loss the landed lines are spread over the litres unchanged.",
  "0.581870 USD, because the loss is fixed in the build-up and the sweep moves only naira.",
  "0.585103 USD, because a loss of 0 is read as the highest row the sweep carries."],
 "With no loss the landed total of 26513943.86 USD is spread over the full bill of lading. 0.513357 USD is the FOB line alone per outturn litre at the invented 0.45 percent.")

# audit-advanced: REPLACED: key said the shore tanks measure the loss, unprinted; duplicated Q6's axis
q(0, "The course sweeps the invented ocean loss on BADAGRY from 0 to 1 percent at 1520.4000 naira to the dollar. What does the naira cost a litre sold read at the two ends?",
 "880.6943 naira at 0 and 889.5902 naira at 1 percent.",
 ["884.6753 naira at both ends, since the landed total does not move.",
  "880.6943 naira at both ends, since the exchange rate does not move.",
  "889.5902 naira at 0 and 880.6943 naira at 1 percent."],
 "The sweep prints 880.6943 naira a litre sold at a loss of 0 and 889.5902 at 1 percent. The landed total stays at 26513943.86 USD, and the outturn it is spread over falls from 45772751.75 to 45315024.23 litres.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/advanced/tdsa_m03.json', expect_n=15)
finish()
