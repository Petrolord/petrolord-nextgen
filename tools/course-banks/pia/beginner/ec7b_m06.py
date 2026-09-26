import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Associate m06, The Associate Reading.
# Sources: what is graded and where the practicals run; the worked example's
# year end to end; Ekene Alpha's royalty lines and whole-life figures by
# provision; the working interest; the provision map; the vocabulary. Nothing
# here names or reproduces the capstone: the method is taught on the digest's
# own Ekene cases. Every keyed figure is re-run through computeCashFlow in
# /root/cat-wip-pia/scratch/bank-beginner/witness.mjs.

q(0, "What is every graded number in this course?",
 "A return value of the engine on fixed terms and rows written down in advance.",
 ["A figure the lesson prints, rounded by the grader to two decimals before it is compared.",
  "A figure the Commission publishes for the year of the case.",
  "A value from the stdlib oracle's golden file."],
 "Every capstone field, question key and panel figure is read from computeCashFlow or one of its rate functions on terms and rows fixed in advance, so the same inputs give the same number on any machine and there is exactly one right answer. The oracle's golden expected figures are provenance, the Commission publishes nothing the engine reads, and a lesson sentence is never the source of a key.")

q(2, "A lease is run under each open reading in turn. What happens to its graded fields?",
 "They are identical under every reading of all three.",
 ["It is graded on the Act base.",
  "Graded twice, once under each stated reading of the base year.",
  "It is graded on the learner's reading."],
 "The course proves each graded field identical whichever answer a run gives to the base year, the new-lease rate onshore or in shallow water, or the deep offshore rate under the Nigeria Tax Act 2025, so the grade decides none of those questions. Grading one reading, grading twice or grading the learner's own choice would each turn an open question into a scored answer.")

q(1, "The worked example carries 18250000 barrels of oil in 2025 in shallow water. Which daily rate and liquids royalty rate does the engine return?",
 "50000.000000 bopd and 0.112500, the course's 11.250000 percent.",
 ["50000.000000 bopd and 12.5 percent, the shallow water terrain rate, charged on every barrel.",
  "50000.000000 bopd and 0.132500, the weighted rate of the onshore scale.",
  "50000.000000 bopd and 0.062500, the edge rate."],
 "2025 has 365 calendar days, so 18250000 barrels give 50000.000000 bopd, and at that rate in shallow water the weighted rate is 0.112500, which the course writes as 11.250000 percent. The terrain rate reaches only the barrels above 10,000 bopd, 0.132500 is the onshore rate, and 0.062500 is the rate at exactly 10,000 bopd.")

q(3, "What 2025 liquids production royalty does the engine return on the worked example?",
 "164250000.000000 USD.",
 ["199158351.810791 USD, which is the total royalty with the royalty by price included.",
  "34908351.810791 USD, which is the royalty by price for the year on the Regulations base.",
  "182500000 USD, which is the year's opex from the same case rows."],
 "The liquids production royalty is 164250000.000000 USD. 199158351.810791 USD is the total royalty, which adds the royalty by price of 34908351.810791 USD read on the Regulations base, and 182500000 USD is the opex row of the case.")

q(2, "The worked example sells oil at 80 in 2025 and states no base year. What oil rate does its price royalty line use?",
 "0.023910, read on the Regulations base.",
 ["0.022464, read on the Regulations base, the engine default.",
  "0.023910, read on the Act base.",
  "0.025000, the rate of the Act's example."],
 "The worked example states no base, so it runs on the Regulations base, the engine default, and returns 0.023910 at 80 USD/bbl in 2025. The Act base returns 0.022464 at the same price, a different stated reading, and 0.025000 is the Act's example at 75 USD/bbl in 2020.")

q(0, "Ekene Alpha's 2026 total royalty is 18012822.226867 USD. Which lines make it up?",
 "Liquids production royalty plus gas royalty plus royalty by price.",
 ["The liquids production royalty and the royalty by price.",
  "The production royalties, HCDT and the NDDC levy.",
  "Only the liquids royalty, as gas is outside it."],
 "Royalty in this course means the production royalty on liquids and gas plus the royalty by price, the engine's total royalty. In 2026 its parts are the liquids royalty of 13625099.038462 USD, the gas royalty of 350400.000000 USD and the royalty by price of 4037323.188406 USD on the Regulations base. Gas is outside the hydrocarbon tax, but it is inside royalty, and HCDT and the NDDC levy are contributions.")

q(3, "In the royalty calculator's first royalty table, what does the production royalty column hold?",
 "The royalties on liquids and gas added together.",
 ["The liquids royalty, the gas royalty and the royalty by price, which is the engine's total royalty line.",
  "The royalty on crude oil alone, with condensate and gas shown in two other columns.",
  "The royalty by price, which is the production royalty's price-linked part."],
 "The production royalty is the royalty on liquids plus the royalty on gas; the royalty by price has a column of its own beside it. Adding the royalty by price gives the total royalty; condensate is rated with crude oil; and the royalty by price is a separate royalty on crude oil and condensate.")

q(1, "Ekene Alpha's first royalty table prints a 2027 gas royalty of 308352.000000 USD. Which gas rate produced it, and why?",
 "0.050000, as the case states no in-country gas share.",
 ["0.037500, with half of Alpha's associated gas used in-country, as on the gas field case.",
  "0.057927, the 2027 liquids royalty rate applied to the associated gas as well.",
  "0.025000, the in-country rate."],
 "Alpha states no pia_gas_in_country_share_pct, so the default share of 0 applies and its gas pays 0.050000 in every year. 0.037500 belongs to the gas field case, which states a 50 percent share; the liquids tranche rate never reaches gas, which pays under para 10(6); and 0.025000 is the rate only at a 100 percent in-country share.")

q(1, "Before copying a figure off the panel for a stated year, what should a learner check?",
 "That the row is the year named and its framework is the expected one.",
 ["That the figure is rounded to two decimals.",
  "That the take tile is above 50 percent.",
  "That the panel printed no notes at all, since a note means the figure is only an approximation of the true value."],
 "The capstone brief says to check that a figure's row is the year the card names and that the year's framework is the one expected. Every value is reported to six decimals, the take is whatever the engine returns, and a note in kpis.pia_notes accompanies a result without making it any less the engine's return value.")

q(3, "A capstone asks for a money value on a lease at a stated working interest. On what footing is that value reported?",
 "At the working interest share.",
 ["At 100 percent field level, whatever working interest the case states for the lease.",
  "At half the field figure, as the Ekene practice case at 50 percent is the standard case.",
  "At the government's share of the profit."],
 "Every money figure is at the working interest share: the engine runs the tranches, the caps and every rate at field level, then scales every money line to the stated share. Rates are read at field level, the 50 percent case is one practice case among several, and the government's share of value is what the take measures.")

q(0, "On the worked example, what is the 2025 total tax, and which lines does it add?",
 "617004738.359202 USD, from the hydrocarbon tax, the income tax and the education tax.",
 ["617004738.359202 USD: every royalty plus the hydrocarbon tax and companies income tax.",
  "285784994.456763 USD: the hydrocarbon tax alone.",
  "299472494.456763 USD: companies income tax alone."],
 "The engine's total tax for 2025 is 617004738.359202 USD, the hydrocarbon tax plus companies income tax plus the tertiary education tax (checked). Royalties sit on their own line outside total tax, and 285784994.456763 USD and 299472494.456763 USD are the hydrocarbon tax and companies income tax on their own.")

q(2, "For 2027 the practice run prints 7321.600000 in the bopd column. What sits beside it in the liquids rate column?",
 "0.057927, weighted between the two tranches.",
 ["0.059976, Alpha's 2026 rate, held for the life of the lease.",
  "0.055546, the rate the engine returns for 2028.",
  "5 percent, the rate of the first tranche."],
 "Each year reads its own daily rate: 7321.600000 bopd sits between 5,000 and 10,000 bopd, so 2027 pays a weighted 0.057927. 0.059976 and 0.055546 are the 2026 and 2028 rates, and exactly 5 percent applies only at or below 5,000 bopd.")

q(3, "Which of these can appear in an Associate question only as a text to read and not as a number to compute?",
 "The terms of a lease that does not convert.",
 ["The gas rate at a stated share.",
  "The royalty by price at a stated price.",
  "A marginal field's liquids royalty rate."],
 "The terms of a lease that does not convert are concept-only: the engine models converted and new-acreage terms only, so they are taught from their text and never graded on a number. The gas rate, the royalty by price and a marginal field's royalty are all computed by the engine's rate functions and ledger.")

q(1, "Over its life Ekene Alpha pays a development levy of 35714217.371697 USD and a tertiary education tax of 0.000000. What explains the split?",
 "Every Alpha year, 2026 to 2032, is a year under the Nigeria Tax Act 2025.",
 ["Alpha is a shallow water lease, and the tertiary education tax is charged only onshore under the Act.",
  "Alpha states no prior-year opex, so the tertiary education tax has no base.",
  "The tertiary education tax is folded into companies income tax."],
 "A year under the Nigeria Tax Act 2025 carries the development levy and no tertiary education tax, because NTA s.197(5) deletes that tax's charging sections, and every Alpha year falls in 2026 or later. The education charge draws no line by terrain, the prior-year opex feeds HCDT, and the tertiary education tax is its own line in a year under the Act alone.")

q(2, "What does the fiscalPrice note on every PIA ledger tell the reader?",
 "The realised prices stand in for the Commission's fiscal prices.",
 ["The fiscal price is the middle benchmark.",
  "The additional tax at the fiscal price is computed.",
  "The case's fiscal price replaces the realised price."],
 "The note reads: \"The realised oil and condensate prices stand in for the Commission's fiscal prices (PIA Seventh Schedule para 8), so the additional tax at the fiscal price (PIA s.268; NTA s.73) is not computed.\" The fiscal oil price is concept-only; it is not a benchmark, the additional tax is not computed, and the case carries no fiscal price.")

emit(Q, '/root/cat-wip-pia/banks/ec7b_m06.json', expect_n=15)
finish()
