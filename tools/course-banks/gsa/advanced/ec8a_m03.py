import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Expert m03, The Stated Readings. Each reading is keyed only as the
# engine's stated reading, where the engine states it and where it acts, on
# the golden days and years the digest prints. No key presents a reading as
# the law; the alternative is keyed only in the words the engine's basis uses.

K = [3, 1, 0, 2, 2, 0, 3, 1, 0, 3, 1, 2, 0, 3, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Which function states the reading \"seller shortfall measured against the quantity the seller made available\", and in which field?",
 "dailyBalance, in basis.reading",
 ["takeOrPay, in its basis.reading beside the make-up right and the last contract year",
  "gsaCashFlows, in basis.royalty with the rate",
  "contractQuantities, in the basis.source it cites for the ACQ and MaxDCQ definitions"],
 "The first reading is stated in the dailyBalance basis.reading, the function that books each day's seller shortfall. takeOrPay's basis.reading carries readings two and three, gsaCashFlows's basis.royalty carries reading four, and contractQuantities states no reading.")

# 2
x("On a golden day with a DCQ of 100.000000 and no delivery tolerance, the seller offers the whole properly nominated 100.000000, and the buyer takes only 60.000000. How does the engine split the gap?",
 "Seller shortfall 0.000000, buyer shortfall 40.000000",
 ["Seller shortfall 40.000000, buyer shortfall 0.000000",
  "Seller shortfall 40.000000 and buyer shortfall 40.000000, each side charged with the same gap",
  "Zero for both, a nomination excusing the day"],
 "The engine measures a seller shortfall against the quantity made available, and the seller made all 100.000000 available, so its seller shortfall is 0.000000; the buyer took 60.000000 of an adjusted DCQ of 100.000000, a buyer shortfall of 40.000000. Charging the seller would follow the printed formula's letter; charging both counts one gap twice; and a nomination excuses no one.")

# 3
x("The Commonwealth model agreement (2025, CC BY 4.0) prints the Shortfall Quantity as SFQ = (PNQ − DTQ ) − DAQ. Read to the letter, what does the engine's basis say that formula would do?",
 "Count gas made available and not taken against the seller",
 ["Excuse the seller on every day the buyer nominates above MaxDCQ, however much gas it made available",
  "Leave every seller shortfall as the engine books it, the Daily Actual Quantity always equalling the gas made available",
  "Double the buyer shortfall on days of force majeure"],
 "The engine's basis, verbatim: \"the model formula subtracts the Daily Actual Quantity, which would count gas made available and not taken against the seller\". The formula has nothing to do with MaxDCQ or force majeure, and the quantity taken can fall short of the quantity made available, which is exactly the day the two readings part.")

# 4
x("On the golden capped carry-forward case, 2029 has a deficiency of 100.000000, a carry-forward credit of 50.000000 and a deficiency paid of 50.000000. What make-up is available in 2030 under the engine's stated reading?",
 "50.000000, the deficiency actually paid",
 ["100.000000, the deficiency before the credit, which is what the model agreement's aggregate sums",
  "150.000000, the deficiency paid together with the credit carried into the year after",
  "0.000000, since a year that draws a carry-forward credit opens no make-up right of its own"],
 "The engine's reading is that the make-up right equals the deficiency actually paid after any carry-forward credit, so 2030 has 50.000000 available. The model agreement's Make-Up Aggregate sums the deficiency quantities before any credit, which is the alternative the engine names; the credit is no make-up; and a year that draws a credit still opens a right for what was paid.")

# 5
x("The export feed's 2029 deficiency is 6438500.000000, and its carry-forward credit at the 50 percent cap is 3219250.000000. What make-up right does the engine's reason open?",
 "3219250.000000, usable through 2034",
 ["6438500.000000, usable through 2034, the whole deficiency before the credit",
  "3219250.000000 through 2032",
  "6438500.000000, usable through 2031 as the carry-forward period"],
 "The reason reads that the buyer may make up 3219250 in the 5 contract years after 2029, to the end of 2034: the deficiency paid after the credit, for the stated make-up period of 5 years. The whole deficiency would count gas the credit already settled; 2032 would be a 3-year period, the length of the carry-forward period, which governs surpluses and not make-up.")

# 6
x("A golden case with a refund end of term finishes in 2029, with a deficiency of 100.000000 paid at 4 and make-up of 150.000000 still open from 2027. What does the engine's reason say the seller refunds?",
 "600.000000, the 150.000000 from 2027 at 4; the year's own payment of 400 stays with the seller",
 ["1000.000000, the open 150.000000 and the year's own 100.000000, both refunded at the price of 4",
  "400.000000, the last year's deficiency payment handed back",
  "0.000000, since a refund applies only when the last contract year has no deficiency of its own"],
 "The reading states that a last-contract-year deficiency creates no make-up right, and the refund applies to earlier years' make-up only; the reason reads \"the seller refunds 150 x 4 = 600\". Adding the last year's 100.000000 would refund gas that opened no right; handing back the 400 would undo the year's own payment; and the refund of earlier entries does not depend on the last year meeting its take-or-pay quantity.")

# 7
x("A one-year golden case leaves a deficiency of 400.000000, paid at 3. Why does the engine's reason say that no make-up right arises?",
 "The delivery period ends with that year, and a last-contract-year deficiency opens no make-up right",
 ["The make-up was drawn in full in the same year, under the order first, before the year's own gas",
  "The deficiency is below the take-or-pay quantity of 900.000000, the threshold at which a right opens",
  "Taking more than half of the take-or-pay quantity extinguishes the buyer's make-up right"],
 "The reason reads \"the delivery period ends with this year, so no make-up right arises\": in a one-year case every year is the last. Make-up can only be drawn from an earlier year's entry; every deficiency is by definition below the take-or-pay quantity; and no text or engine rule ties a right to half the quantity.")

# 8
x("In 2028 the Ekene power plant's buyer pays a deficiency payment of 1501584.000000 (on the fixture's held price, a stated planning assumption). On what does gsaCashFlows charge that year's royalty of 297570.000000?",
 "On the delivered value of 11902800.000000, at 0.025000",
 ["On the seller revenue of 13404384.000000, deficiency payment included",
  "On the deficiency payment alone",
  "On the 2028 ACQ of 7686000.000000 valued at the take-or-pay price of that contract year"],
 "The engine's fourth stated reading: royalty is charged on delivered gas value and not on deficiency payments, so 0.025000 x 11902800.000000 = 297570.000000. The seller revenue carries the deficiency payment the reading keeps out; the deficiency payment alone is gas never delivered; and the ACQ is no quantity delivered.")

# 9
x("Which of these is a required contract input with no default, and so no reading the engine states?",
 "The recovery order of make-up",
 ["Seller shortfall measured against the quantity the seller made available on each day",
  "Royalty charged on the value of gas delivered, with none on a deficiency payment",
  "No make-up right from a deficiency in the last contract year of the delivery period"],
 "The course is explicit that the recovery order is not a reading: it is a required input with no default, and the engine names the reference text's order. The other three are the engine's stated readings one, four and three.")

# 10
x("How does the course grade the four readings the engine states?",
 "It grades none: every capstone field is the same under each reading and under the alternative the engine names",
 ["It grades each one as the law, since the engine cites the text that every one of the readings reads",
  "It grades only the first two, the readings that change a quantity in the ledger",
  "Each is graded once, in the tier that teaches it"],
 "No graded figure depends on a reading the engine states: every capstone field is proved the same under each reading and under the alternative it names. A reading is the engine's stated choice where a text is open or odd, taught beside the text, and never keyed as the law.")

# 11
x("On 2027-01-30 of the power plant's January, 21000.000000 is properly nominated and 12600.000000 is made available and taken, the cause being on the buyer's side. What does the engine book?",
 "No seller shortfall, and a buyer shortfall of 8400.000000",
 ["A seller shortfall of 8400.000000, since the seller did not make the nominated gas available that day",
  "A seller shortfall of 8400.000000 excused as force majeure, and no buyer shortfall for the day",
  "Nothing either way for the day"],
 "The engine's reasons read that 8400 of the properly nominated quantity was not made available for a cause on the buyer's side, so it is not a seller shortfall, and that taken 12600 is below the adjusted DCQ 21000: buyer shortfall 8400. A buyer-caused gap books no seller shortfall; no force majeure is stated that day; and the day stays in the month.")

# 12
x("Readings two and three are stated in which field of which function?",
 "takeOrPay basis.reading, one string that also says the Make-Up Aggregate sums prior contract years only",
 ["dailyBalance basis.reading, next to the seller shortfall reading",
  "gsaCashFlows basis.royalty, next to the royalty rate",
  "priceSeries basis, where the take-or-pay price alternatives of Article 15.2.6 are named"],
 "Both sit in one takeOrPay basis.reading string: the make-up right equals the deficiency actually paid, a last-contract-year deficiency creates no make-up right, and the Make-Up Aggregate sums prior contract years only. dailyBalance carries reading one, gsaCashFlows carries reading four, and priceSeries states no reading.")

# 13
x("Why does the course teach the seller shortfall reading as the engine's stated choice?",
 "The model's definition opens with gas the seller did not make available, while its formula subtracts the gas taken",
 ["The Petroleum Industry Act 2021 sets the rule in s.110, and the engine repeats the Act",
  "The AIPN model agreement prints it, and the course may not quote a licensed text",
  "ESMAP para 6.52 defines daily availability that way for every contract"],
 "The definition's opening supports the engine's reading and the formula's letter supports the other, so the engine takes a reading and states it. S.110 is the Domestic Gas Delivery Obligation, the AIPN text is taught by concept only and is no source of this reading, and ESMAP's para 6.52 is cited for daily availability in contract quantities and says nothing of this reading.")

# 14
x("On a stated day with a DCQ of 100.000000 and no delivery tolerance, 100.000000 is properly nominated and 40.000000 made available and taken, with force majeure of 30.000000 and maintenance of 10.000000. What does dailyBalance return?",
 "Seller shortfall 20.000000, adjusted DCQ 40.000000",
 ["Seller shortfall 60.000000 and an adjusted DCQ of 100.000000, the stated causes being reported only",
  "Seller shortfall 0.000000, since the stated causes excuse the whole gap between nomination and supply",
  "Seller shortfall 20.000000 and buyer shortfall 20.000000"],
 "Of the 60.000000 not made available, 40 is excused by the force majeure and maintenance stated for the day, leaving a seller shortfall of 20.000000; the adjusted DCQ is 100.000000 - 30.000000 - 10.000000 - 20.000000 = 40.000000, and the buyer took all 40.000000, so no buyer shortfall. The causes reduce the seller shortfall, and they excuse only 40.000000 of the 60.000000.")

# 15
x("In 2029 the power plant's buyer takes 210000.000000 of make-up. How does the engine's royalty reading treat that gas?",
 "It sits in the delivered value of 17167500.000000, so it pays royalty in the year it is made up",
 ["It pays no royalty, its royalty having been charged with the 2028 deficiency payment in the deficiency year",
  "It pays royalty at 10 percent of the contract price, the export feed's make-up rate",
  "Left out of the delivered value, it is taxed only if forfeited at the end of the term"],
 "Delivered value is all gas taken at the contract price, make-up included: 7875000.000000 at the fixture's held price (a stated planning assumption) gives 17167500.000000, and the 2029 royalty of 429187.500000 is 0.025000 of it. No royalty was charged on the 2028 deficiency payment; the export feed's make-up price has no bearing here; and gas never taken is never in delivered value.")

emit(Q, '/root/cat-wip-gsa/banks/ec8a_m03.json', expect_n=15)
finish()
