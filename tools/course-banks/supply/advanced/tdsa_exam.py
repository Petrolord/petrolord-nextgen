import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Expert tier exam, 42 questions over all six modules (digest SECTIONS
# 17 to 24 and the templates of SECTION 1). Written last. Every rate, the FOB
# price, the ocean loss, the exchange rates and the caps are the course's
# invented BADAGRY figures and each stem that uses one says so.

# 1 m01+m02
q(3, "A wrong density certificate is typed for BADAGRY, whose FOB price of 688.00 USD a tonne is invented. Which printed line of the walk is safe from the mistake?",
 "The FOB cargo value, 23392000.00 USD, since it is a price per tonne on 34000 tonnes.",
 ["The regulatory line, 109854.60 USD, since the per-litre charge is fixed in the template.",
  "The storage line, 121297.79 USD, since storage is billed on the tank the cargo fills.",
  "The jetty line, 54927.30 USD, since the jetty is paid per call and never per volume."],
 "FOB is 688.00 USD a tonne times 34000 tonnes, and no density enters it. The volume lines would all be re-formed from the corrected certificate.")

# 2 m01+m03
q(0, "cargoQuantities returns 45772751.75 litres for BADAGRY. What role does that litre figure play later in the tier?",
 "It is the bill-of-lading quantity the per-litre line is levied on and the invented ocean loss is taken from.",
 ["It is the outturn, the litres the importer sells after the invented ocean loss has been taken off the cargo.",
  "It is the quantity the landed total is divided by to give the cost of each litre that reaches the pump.",
  "It is the rounded figure typed from a quote, which is why it returns 33999.9616 tonnes when entered."],
 "The landed total is spread over what arrives, 45566774.37 litres at the invented 0.45 percent loss. The litres returned by cargoQuantities are what was loaded and paid for.")

# 3 m02
# audit-advanced: key 1.00 against m02 Q1 (the same refusal re-asked in the exam); now asks which other entry meets the same sentence
q(3, "Ocean freight typed as a percent of C&F is refused on the invented BADAGRY walk. Which other entry does the course show refused with the same sentence?",
 "Ocean freight typed as a percent of CIF.",
 ["A charge with the stage \"customs\".",
  "Insurance on CIF at 100 percent.",
  "Import duty typed as a percent of CIF."],
 "Freight on C&F and freight on CIF both read \"Ocean freight is a percentage of a value that is not formed until after freight.\" A customs stage and CIF insurance at 100 percent have sentences of their own, and duty on CIF is the rate BADAGRY prices at 5.75 percent.")

# 4 m02
q(3, "With the invented marine insurance quoted on C&F in place of CIF, what landed total does BADAGRY print?",
 "26513877.12 USD",
 ["26513943.86 USD",
  "25114857.82 USD",
  "24774210.79 USD"],
 "Moving the premium onto C&F lowers it to 38868.80 USD, which lowers CIF and so the duty that reads CIF. The build with the invented premium on CIF closes at 26513943.86 USD.")

# 5 m02+m04
# audit-advanced: "in two places" unprinted count (the digest also calls the trucking figure a floor)
q(1, "The engine labels an incomplete build-up a floor. On the invented BADAGRY pump price, which figure carries that label?",
 "1031.3197 naira a litre, with the dealer margin and levies blank.",
 ["1066.7292 naira a litre, with the tax typed on the landed cost.",
  "24774210.79 USD, with the duty and financing blank.",
  "1074.8249 naira a litre, with every invented element supplied."],
 "The pump sentence is \"A FLOOR: 2 rate(s) not supplied, so the full price is at least this.\" The walk's floor of 24774210.79 is in US dollars for the cargo, and 1066.7292 is complete true.")

# 6 m03+m04
# audit-advanced: REPLACED: hypothetical build from the 1 percent row, key rested on inference
q(1, "Every invented rate in the BADAGRY import template is supplied. How does landedCost label the build-up?",
 "complete true; All supplied rates applied.",
 ["complete true, labelled a floor until a cap is set.",
  "complete false, since the ocean loss has no row in the template.",
  "complete true, with the ocean loss named in assumedZero."],
 "The full walk prints landed total 26513943.86 USD, complete true and \"All supplied rates applied.\" The ocean loss is stated with the cargo and is not a template rate, and a floor is the label for a build-up with rates missing.")

# 7 m03+m05
# audit-advanced: "Government share" named a naira figure
q(0, "The invented exchange rate moves while the BADAGRY cargo and every invented import rate stay the same. Which figure is unchanged?",
 "The landed total in dollars, 26513943.86 USD.",
 ["The landed cost at the depot gate in naira a litre.",
  "The Government row of the pump price in naira.",
  "The shortfall against the invented cap of 1150.0000."],
 "Every line of the walk is in dollars, and the exchange rate enters once, at the end. So the naira landed cost, the tax built on it and the shortfall all move with the rate.")

# 8 m04+m05
# audit-advanced: "Government share" named a naira figure; explanation now cites the per-litre rule
q(1, "Across the invented exchange rate sweep the Government figure moves with the rate, reaching 97.1210 naira a litre at 2100.0000. Why does the dealer margin stay at its invented 31.2500?",
 "The dealer margin is per litre, while the tax in the Government row reads a running total that holds the landed cost.",
 ["The dealer margin is quoted in naira while the levies are quoted in dollars, so only the levies move with the rate.",
  "The dealer is paid after the tax, so the running total the dealer reads is fixed before the landed cost is added.",
  "The dealer margin is a share of the price, and a share of the price is held fixed when the price is re-priced."],
 "A per-litre element adds its amount, and a percent of the running total adds that percent of everything above it. The invented levies are per litre too; the tax element is what moves the Government row, since its base contains the landed cost.")

# 9 m05
q(2, "How many bisection steps does the engine report for the invented BADAGRY breakeven?",
 "18",
 ["9",
  "24",
  "12"],
 "breakeven: found true, at 1641.7105 naira to the dollar, after 18 bisection steps.")

# 10 m06
q(3, "Which landed cost cases does fuelpricing_cases.json carry?",
 "3: floor, full and insurance on CIF.",
 ["2: full and floor, with insurance on C&F.",
  "4: one for each insurance and duty basis.",
  "1: the full BADAGRY build-up alone."],
 "The pricing golden file carries 3 landed cost cases (floor, full, insuranceOnCif), 1 truck lane, 1 fleet, 1 pump build-up with its breakeven exchange rate, and 1 station.")

# 11 m01
q(3, "What does the fuelPricing constant LITRES_PER_M3 hold, and where is it used?",
 "1000, to turn the cargo's m3 into litres.",
 ["742.8, to turn tonnes into m3 at the BADAGRY density.",
  "0.158987294928, to turn m3 into barrels of cargo.",
  "745, to turn tonnes into m3 when no density is typed."],
 "litres = m3 x 1000. 0.158987294928 is M3_PER_BBL, and 742.8 and 745 are densities, one typed and one from PRODUCT_REFERENCE.")

# 12 m01
q(2, "Why does the course run the same 34000 tonnes through every density in PRODUCT_REFERENCE, 35416.667 m3 at 960 kg/m3 among them?",
 "To show what a wrong density moves in the volume, which is why the certificate figure is typed.",
 ["To show which product the BADAGRY cargo is, since the volume identifies the product.",
  "To give the default the engine applies when the density is left out of a call, as the PMS row does.",
  "To show that the barrel figure is independent of the density typed."],
 "Nothing in the module reads those densities unless a caller passes one in. The same tonnes read 45637.584 m3 at 745 and 35416.667 m3 at 960 kg/m3.")

# 13 m02
q(2, "Quoted on CIF, the course's invented 0.16 percent premium comes to which dollar amount on BADAGRY?",
 "38931.09 USD",
 ["38868.80 USD",
  "52500.00 USD",
  "54927.30 USD"],
 "On CIF the premium is part of the value it is charged on and prints 38931.09 USD. 38868.80 USD is the same invented rate on C&F.")

# 14 m02
q(0, "The invented port and harbour rate is 3.05. Which quantity does it read to print 103700.00 USD?",
 "34000 tonnes",
 ["45772.752 m3",
  "45772751.75 litres",
  "287901.9470 barrels"],
 "103700.00 USD over 34000 tonnes is the invented 3.05 a tonne. A density would reach this line only if it were quoted by volume.")

# 15 m02
q(3, "The invented financing and letter of credit rate of 1.4 prints 340647.04 USD. On which basis is it charged?",
 "percent_of_cif",
 ["percent_of_fob",
  "percent_of_cf",
  "per_m3"],
 "Financing is quoted on CIF, the value frozen at the end of the insurance stage, 24331931.09 USD. It sees no landed line.")

# 16 m03
q(3, "Which naira figure a litre sold goes with the 0.2 percent row of the invented ocean loss sweep?",
 "882.4592",
 ["880.6943",
  "884.6753",
  "889.5902"],
 "The rows run 880.6943 at 0, 882.4592 at 0.2, 884.6753 at 0.45 and 889.5902 at 1 percent, each at the invented 1520.4000 naira to the dollar.")

# 17 m03+m06
q(1, "Why do the invented duty and financing lines sit outside the contract question H1 raises?",
 "They are charged on a value, CIF, and H1 is a question about which quantity a per-quantity line is billed on.",
 ["They are charged before the cargo is discharged, and H1 covers only what happens once the cargo is ashore.",
  "They are paid to the government, and H1 covers only what the importer pays to the terminal it discharges into.",
  "They are refused when the outturn is typed, so the engine never has to pick between the two quantities for them."],
 "H1 asks which quantity a line quoted per tonne, per m3 or per litre is billed on. Duty at the invented 5.75 percent and financing at the invented 1.4 percent read CIF, 24331931.09 USD, and hold no quantity to choose.")

# 18 m04
q(2, "What is the running total on the invented BADAGRY waterfall once the statutory levies are added?",
 "1009.2253 naira a litre",
 ["999.6253 naira a litre",
  "1074.8249 naira a litre",
  "968.3753 naira a litre"],
 "The invented levies of 9.6 add 9.6000 to 999.6253. The tax then reads 1009.2253 and the price is 1074.8249.")

# 19 m04
q(3, "What share of the invented BADAGRY price is the landed cost at the depot gate?",
 "0.823088",
 ["0.069965",
  "0.061033",
  "0.029075"],
 "884.6753 naira a litre is grouped as Product (landed) with a share of 0.823088. 0.069965 is Government, 0.061033 the tax row and 0.029075 the dealer.")

# 20 m04
q(2, "Which recipient does the invented transport to station element of 19.8 naira a litre pay?",
 "Transporter",
 ["Chain",
  "Marketer",
  "Terminal"],
 "PUMP_TEMPLATE gives transport the recipient Transporter. Chain receives the bridging element, Marketer the marketer margin and Terminal the depot margin.")

# 21 m05
q(3, "On the invented sweep against the cap of 1150.0000, on which rows does the verdict read true?",
 "The three rows from 1200.0000 to 1500.0000 naira to the dollar.",
 ["The four rows from 1650.0000 to 2100.0000 naira to the dollar.",
  "Every row, since the price at the invented base rate is below the cap.",
  "No row, since the cap is below the price at every swept exchange rate."],
 "The shortfall is negative at 1200.0000, 1350.0000 and 1500.0000 and positive from 1650.0000, where it is 5.1370 naira a litre.")

# 22 m02+m06
q(1, "The engine's CIF of 24331931.09 USD on BADAGRY, with the invented insurance on CIF, is checked how?",
 "An oracle reaches it by iterating the fixed point, a different road from the engine's closed form.",
 ["An oracle reads it off a published marine insurance table and compares the two to the cent.",
  "The engine solves it twice, once on C&F and once on CIF, and checks that the two agree.",
  "It is not checked, since insurance on CIF is circular and no second method can reach it."],
 "Insurance on CIF by fixed-point iteration is in the fuelpricing oracle's method column. The published source column for that file reads none: every rate is synthetic.")

# 23 m01+m06
# audit-advanced: explanation claim ("quoting authority it cannot keep current") unprinted
q(1, "RATE_DISCLAIMER and held finding H2 describe one decision. What is it?",
 "The engine ships no rate, so every rate is a required input and each one in this course is invented.",
 ["The engine ships one market's regulated rates and asks the user to confirm them before use.",
  "The engine ships typical rates as a starting point, as PRODUCT_REFERENCE does for densities.",
  "The engine ships rates for the import walk and leaves the pump elements for the user to type."],
 "RATE_DISCLAIMER says every rate is a required input, since duties, levies and regulated margins are set by regulation, differ by market and change. H2: every template rate is absent, 9 of 9 on IMPORT_TEMPLATE and 7 of 7 on PUMP_TEMPLATE, and every rate in this course is invented.")

# 24 m02
# audit-advanced: REPLACED: order independence of the walk is never printed; key and explanation rested on inference
q(0, "What C&F does landedCost print for the invented BADAGRY cargo?",
 "24293000.00 USD",
 ["23392000.00 USD",
  "24331931.09 USD",
  "26513943.86 USD"],
 "The walk runs FOB, then freight (C&F): 23392000.00 USD of cargo and 901000.00 USD of the invented freight. 24331931.09 USD is CIF, formed after insurance, and 26513943.86 USD the landed total.")

# 25 m03
q(1, "The BADAGRY cost a litre sold prints to six decimals in dollars and to four in naira. Which pair is it at the invented 0.45 percent loss?",
 "0.581870 USD and 884.6753 naira",
 ["0.579252 USD and 880.6943 naira",
  "0.585103 USD and 889.5902 naira",
  "0.513357 USD and 884.6753 naira"],
 "0.581870 USD a litre sold x the invented 1520.4000 is 884.6753 naira. 0.513357 USD is the FOB line alone per outturn litre.")

# 26 m04
q(2, "What share of the invented BADAGRY pump price does the value added tax row carry?",
 "0.061033",
 ["0.069965",
  "0.019538",
  "0.008932"],
 "The share column divides the row's amount by 1074.8249 naira a litre. 0.069965 is the Government row, levies and tax together, and 0.008932 the levies row.")

# 27 m05
q(3, "Over the course's 1300 to 1500 bracket, what do the two negative end shortfalls say about the invented cap?",
 "It covers the chain at both ends, so the price does not meet it anywhere searched.",
 ["It fails the chain at both ends, so the crossing must lie below 1300 and the bracket must move down.",
  "It covers the chain at one end and fails it at the other end.",
  "It sits exactly on the price at 1500, which is the breakeven."],
 "A negative shortfall means the cap sits above the price. -211.7551 and -87.8167 have the same sign, so there is nothing to halve towards.")

# 28 m06
# audit-advanced: REPLACED: key 1.00 against tdsi_m04 Q3 (the same refusal asked the same way); a SECTION 23 tank farm rule scored 0.55 against tdsi_m03 Q7, so an Expert-native SECTION 21 question
q(0, "Which pair of elements makes up the Government recipient on the invented BADAGRY waterfall?",
 "Statutory levies at the pump and Value added tax.",
 ["Value added tax alone.",
  "Statutory levies at the pump alone.",
  "Statutory levies at the pump, Value added tax and Bridging or equalisation."],
 "The Government row reads 75.1996 naira a litre with the elements Statutory levies at the pump and Value added tax. Bridging or equalisation is paid to Chain, and removing its recipient sends it to Unattributed.")

# 29 m01+m02
# audit-advanced: key claimed "the nearest known label is never put in its place", beyond the two printed refusals; explanation reasons unprinted
q(1, "cargoQuantities refuses the unit \"kg\" and landedCost refuses the stage \"customs\". What do the two refusals share?",
 "Each names a label the engine does not know and refuses the call.",
 ["Both are forward references to a value the walk has not formed, so both carry the same sentence.",
  "Both are density errors, since kilograms and customs charges are each formed from a volume.",
  "Both are read as zero and named, so the answer is labelled a floor until the label is fixed."],
 "The engine returns REFUSED: Unknown quantity unit \"kg\". for cargoQuantities and REFUSED: Customs processing has an unknown stage \"customs\". for landedCost. Neither returns a figure, and neither is a forward reference or a floor.")

# 30 m03
# audit-advanced: CIF and duty distractors were refuted only by inference (neither is printed across the loss sweep)
q(0, "Which invented BADAGRY figure changes when the ocean loss changes: the landed total, the bill-of-lading litres, the regulatory line or the outturn?",
 "The outturn",
 ["The landed total",
  "The bill-of-lading litres",
  "The regulatory line"],
 "The landed total reads 26513943.86 USD on every row of the sweep and the bill of lading 45772751.75 litres, and the regulatory line, 109854.60 USD, is charged on those bill-of-lading litres. The outturn is the one figure of the four that falls as the loss rises.")

# 31 m04
q(0, "What is the running total after the invented marketer margin of 18.4 naira a litre?",
 "968.3753 naira a litre",
 ["949.9753 naira a litre",
  "999.6253 naira a litre",
  "930.1753 naira a litre"],
 "The marketer margin takes the running total from 949.9753 to 968.3753. 999.6253 is after the dealer and 930.1753 after bridging.")

# 32 m05
q(2, "What shortfall does the invented sweep print at 1950.0000 naira to the dollar?",
 "191.0445 naira a litre",
 ["98.0908 naira a litre",
  "283.9982 naira a litre",
  "1341.0445 naira a litre"],
 "The price at 1950.0000 is 1341.0445 naira a litre, which is 191.0445 above the invented cap. 98.0908 is the row at 1800.0000 and 283.9982 the row at 2100.0000.")

# 33 m01+m04
q(1, "percent_of_running appears in which of the module's basis lists, and on which invented BADAGRY line?",
 "PRICE_ELEMENT_BASIS alone, on the value added tax.",
 ["CHARGE_BASIS alone, on the import duty.",
  "Both lists, on the duty and the tax, since each is a percentage line.",
  "PRICE_ELEMENT_BASIS alone, on the levies."],
 "The pump template's one percentage line is the tax, on percent_of_running. The levies are per_litre, and the duty is a CHARGE_BASIS line on percent_of_cif.")

# 34 m03+m04
q(1, "884.6753 naira a litre appears in two modules on the invented BADAGRY record. Which two roles does it play?",
 "The naira cost a litre sold, and the landed cost the pump waterfall starts from.",
 ["The pump price before tax, and the base the invented value added tax reads.",
  "The landed total per bill-of-lading litre, and the cap the waterfall is checked on.",
  "The naira cost a litre at zero loss, and the landed cost at the swept 1500.0000."],
 "The walk ends at 0.581870 USD a litre sold, converted once to 884.6753 naira. buildPumpPrice starts from that figure, whose share of the price is 0.823088.")

# 35 m02+m03
q(0, "The invented regulatory line prints 109854.60 USD and 0.002411 USD per outturn litre. Which litres is it levied on, and which is it spread over?",
 "Levied on the 45772751.75 bill-of-lading litres, spread over the 45566774.37 outturn litres.",
 ["Levied on the 45566774.37 outturn litres, spread over the 45772751.75 bill-of-lading litres.",
  "Levied and spread over the 45772751.75 bill-of-lading litres, the one quantity the walk uses.",
  "Levied and spread over the 45566774.37 outturn litres, since the charge applies to litres sold."],
 "Every per-quantity line is charged on the bill of lading. The column in USD per outturn litre spreads every line over the outturn.")

# 36 m05
q(2, "On the final row of the invented element table, 2100.0000 naira to the dollar, which pair of figures is printed?",
 "1221.9272 and 97.1210 naira a litre",
 ["1433.9982 and 97.1210 naira a litre",
  "1221.9272 and 75.1996 naira a litre",
  "698.2441 and 97.1210 naira a litre"],
 "The last row of the element table carries 1221.9272 landed and 97.1210 Government beside a price of 1433.9982. 698.2441 is the first row's landed cost, and 75.1996 the Government row at the invented base rate.")

# 37 m06
q(3, "What do both golden file rows print in their published source column?",
 "none",
 ["the published volume correction tables",
  "the regulation in force",
  "the engines repository's findings file"],
 "No coefficient table is shipped and every rate is synthetic, so no figure is checked against a published source. The terminal row adds that its tanks are geometric or the Suite sample.")

# 38 m02
q(2, "With only the invented duty typed 0 and every other invented rate supplied, what does landedCost report for BADAGRY?",
 "complete true, total 25114857.82 USD",
 ["complete false, total 25114857.82 USD",
  "complete true, total 26513943.86 USD",
  "complete false, total 24774210.79 USD"],
 "A rate typed 0 is a rate. The blank duty prints the same total with complete false and Import duty missing.")

# 39 m04
q(0, "Which recipient does the invented bridging or equalisation element pay in PUMP_TEMPLATE?",
 "Chain",
 ["Government",
  "Terminal",
  "Unattributed"],
 "Bridging's recipient is Chain, and the grouping reports 24.5000 naira a litre against it. Unattributed appears only when the course removes that recipient.")

# 40 m06
# audit-advanced: REPLACED: the refinery/course seam is LESSON_TASK, printed nowhere in the digest
q(2, "34000 tonnes read 40476.190 m3 through cargoQuantities. Which PRODUCT_REFERENCE density was used?",
 "840 kg/m3, the AGO row",
 ["745 kg/m3, the PMS row",
  "800 kg/m3, the DPK row",
  "960 kg/m3, the HFO row"],
 "The density sweep prints 40476.190 m3 at 840 kg/m3, AGO. PMS at 745 reads 45637.584 m3, DPK at 800 reads 42500.000 m3 and HFO at 960 reads 35416.667 m3.")

# 41 m01+m03
# audit-advanced: REPLACED: hypothetical barrel entry, key rested on inference (and left FOB out)
q(1, "Which method does the terminal oracle, oracle_terminaldepot.py, list for the loading queue?",
 "Erlang C by the exact factorial form and Little's law.",
 ["An integer fleet search, one truck at a time.",
  "Insurance on CIF by fixed-point iteration.",
  "A closed-form FX breakeven."],
 "The terminal oracle lists strapping from tank geometry, Erlang C by the exact factorial form and Little's law, and a day ledger. The integer fleet search, the fixed-point insurance and the closed-form FX breakeven are the fuel pricing oracle's methods.")

# 42 m05+m06
# audit-advanced: explanation inference ("means finding the breakeven again") unprinted
q(1, "The breakeven of 1641.7105 naira to the dollar, an invented exchange rate on an invented record, is reached by the engine and by an oracle. Which statement about it holds?",
 "It is a property of the invented record, found by bisection and matched by a closed form.",
 ["It is the rate at which the invented cap stops covering any chain priced by this engine.",
  "It is graded as the exchange rate the course expects the naira to reach against the cap.",
  "It is found by closed form in the engine, and the oracle confirms it by bisection."],
 "The engine bisects and the oracle solves in closed form, and every rate behind the figure is invented for the course.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/advanced/tdsa_exam.json', expect_n=42)
finish()
