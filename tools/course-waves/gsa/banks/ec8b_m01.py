import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Associate m01, What a Gas Sales Agreement Fixes.
# Sources: the engine's function table, its stated constants and what it
# declines to compute; the texts with their editions and read dates; the
# Ekene agreements and their planted situations; the refusals of this tier;
# what is graded and where the practicals run; the vocabulary. Every key rests
# on a digest-printed line or an engine return re-run in
# /root/cat-wip-gsa/scratch/bank-beginner/witness.mjs.

q(2, "The Commonwealth model gas sales agreement (2025), Article 12.6, states the buyer's side of the bargain. What does it oblige the buyer to do in each contract year?",
 "Take and pay for, or pay for if not taken, at least the take-or-pay quantity.",
 ["Take every unit the seller makes available up to MaxDCQ on each day of the year.",
  "Pay the domestic base price for the whole ACQ whether or not any gas is delivered.",
  "Nominate the DCQ daily, settling any gap on the day at the contract price."],
 "Article 12.6 reads: \"In each Contract Year Buyer shall be obligated to take and pay for, or to pay for if not taken, a quantity of Gas at least equal to the Take or Pay Quantity.\" The obligation is annual and runs to the take-or-pay quantity only. MaxDCQ is a ceiling on a day's proper nomination, and no clause obliges the buyer to take up to it. The domestic base price is a Nigerian sector price quoted only as reported, and it has nothing to do with the model clause. The obligation is reconciled by contract year, and the clause prices no daily gap at the contract price.")

q(0, "Which four of the engine's nine functions does the Associate tier work with?",
 "toEnergy, contractQuantities, dailyBalance and takeOrPay.",
 ["toEnergy, contractQuantities, priceSeries and domesticPrice, for the domestic sector.",
  "dailyBalance, takeOrPay, gsaCashFlows and energyParitySlope, for money and parity.",
  "contractQuantities, domesticGasObligation, takeOrPay and priceSeries, for the Act."],
 "The Associate question is the quantities and one contract year, so it uses volume to energy (toEnergy), the contract quantities (contractQuantities), the daily balance (dailyBalance) and one take-or-pay year (takeOrPay). Contract prices (priceSeries), the Nigerian domestic prices (domesticPrice) and the Domestic Gas Delivery Obligation (domesticGasObligation) are Professional work; energy parity (energyParitySlope) and the whole contract in money (gsaCashFlows) are Expert work.")

q(3, "The engine holds some figures as stated constants and refuses to guess others. Which of these is a stated constant it holds?",
 "The joules in one International Table Btu, 1055.05585262.",
 ["The take-or-pay percentage, which it sets to the model agreement's printed figure.",
  "The make-up period, which it takes from ESMAP's report.",
  "The seller shortfall damages rate, which it reads from the Commonwealth model."],
 "UNITS.BTU_IT_J is 1055.05585262, the International Table Btu from NIST Special Publication 811 (2008 edition), Appendix B, exact by definition. The take-or-pay percentage, the make-up period, the recovery order, the end-of-term rule, every price, the seller shortfall rate and the domestic base price are inputs with no default, and a call without one is refused by name. The model agreement leaves its percentages as [## INSERT] for the parties, so there is no printed figure to take.")

q(1, "Which set of terms belongs to the Ekene power plant agreement?",
 "Take-or-pay 80 percent of the Adjusted ACQ, with make-up for 3 contract years forfeited at the end.",
 ["Take-or-pay 90 percent of the Adjusted ACQ, with make-up for 5 contract years refunded at the end.",
  "Take-or-pay 80 percent of the full ACQ, with no make-up and a carry-forward capped at 50 percent.",
  "Take-or-pay 90 percent of the full ACQ, with make-up for 3 contract years refunded at the end of term."],
 "The power plant fixture states a DCQ of 21000 MMBtu per day, MaxDCQ 110 percent, take-or-pay 80 percent of the Adjusted ACQ, make-up for 3 contract years with the end of term forfeit, and no carry-forward. Take-or-pay 90 percent with make-up for 5 contract years refunded at the end, and a carry-forward capped at 50 percent, are the export feed agreement's terms. Neither agreement applies its percentage to the full ACQ: the take-or-pay quantity is a percentage of the Adjusted ACQ.")

q(0, "The Ekene power plant fixture holds a price of 2.18 US$ per MMBtu in every year from 2027 to 2034. What is that figure?",
 "The domestic base price reported for 2026, held flat as a stated planning assumption.",
 ["A price the engine derives each year from the Third Schedule principles.",
  "The domestic base price the Authority set for every year of the term, read from its circular.",
  "The Fourth Schedule's National Reference Price, as the power price."],
 "The fixture's price note reads that the reported 2026 domestic base price (effective 1 April 2026) is held flat as a planning assumption, and that the Authority re-determines it each year (PIA s.167(1)). The engine derives no domestic base price: it is a required input with no default. The regulator's circular was not read, so no figure is read from it, and the Authority sets it one year at a time. The National Reference Price is the gas based industries' US$1 per MMBtu, a different term.")

q(2, "Why may this course quote the Commonwealth model gas sales agreement word for word while it teaches the AIPN model agreement by concept only?",
 "The Commonwealth text is published under Creative Commons Attribution 4.0; the AIPN text is licensed.",
 ["The AIPN text is older than 2021, so the Petroleum Industry Act replaced its clauses in Nigeria.",
  "The Commonwealth text was gazetted in Nigeria, so it has the force of law in every domestic contract.",
  "The AIPN text states no take-or-pay clause, so it has nothing about quantities to quote at all."],
 "The Commonwealth model agreement's front matter reads \"This work is licensed under Creative Commons Attribution 4.0 International.\", so it may be quoted with attribution. The AIPN model gas sales agreement is a licensed text, and licensed texts are taught by concept only and never quoted. Neither model agreement is law: a model contract is a template the parties adapt, and nothing in the course says the Act replaced one or that the Commonwealth text was gazetted.")

q(3, "How does the course name the Domestic Gas Delivery Obligation Regulations 2022 when it cites them?",
 "S.I. No. 74 of 2022, Official Gazette No. 206, Vol. 109, 23 November 2022.",
 ["S.I. No. 206 of 2022, Official Gazette No. 74, Vol. 108, 27 August 2021, read the same day.",
  "Official Gazette No. 142, Vol. 108, 27 August 2021, as a schedule of the Act.",
  "S.I. No. 74 of 2022, from the regulator's page, unnumbered and undated."],
 "The sources table names the Regulations as S.I. No. 74 of 2022, Official Gazette No. 206, Vol. 109, Lagos, 23 November 2022, made and commenced 18 November 2022, and read on 2026-09-26. Official Gazette No. 142, Vol. 108, 27 August 2021 is the Petroleum Industry Act 2021 itself. The copy described as unnumbered and undated is the NUPRC flaring Regulations of 2023, which is why flaring is taught as a concept only.")

q(1, "On what date was every text this course cites read?",
 "2026-09-26, for every text in the sources table.",
 ["27 August 2021, the date the Act was gazetted, for the statute and its Regulations.",
  "The date of each text's own edition, so the Commonwealth model agreement is read as of 2025.",
  "18 November 2022, when the Regulations commenced, for every Nigerian text in the table."],
 "The course names each text with its edition or gazette date AND the date it was read, and every text in the sources table was read on 2026-09-26. The gazette date of the Act (27 August 2021), the commencement of the Regulations (18 November 2022) and the model agreement's 2025 edition are editions, which the course records beside the read date.")

q(0, "A learner types heatingvalue in place of heatingValue in a toEnergy call. What does the engine return?",
 "A refusal naming heatingvalue as a key it does not accept, with the list of accepted keys.",
 ["A result computed with a default heating value of 1050 Btu/scf, as held in the power plant fixture.",
  "A result in MMBtu, because key names are matched without regard to capitals.",
  "The same energy as before, with a reason line warning about the key."],
 "The engine's own words: \"heatingvalue is not an accepted key; the accepted keys at the top level are quantity, quantityUnit, heatingValue, heatingValueUnit, heatingValueBasis, referenceConditions\". Every call refuses an input key the function does not read, so a misspelt key never silently drops a term. The engine holds no default heating value (1050 Btu/scf is a term the fixture states), and it does not fold capital letters.")

q(3, "Which of these comes back from the engine as a result, with a reason printed beside it?",
 "A deficiency that carries no make-up right.",
 ["A take-or-pay year with the makeUp object left out, which the engine completes with forfeit.",
  "A volume stated in bcf, which the engine converts to MMscf and notes in the reason line.",
  "A day on which the gas taken is above the gas made available, which the engine trims to match."],
 "A result returned with a reason is a result: a deficiency with no make-up right, a nomination trimmed to MaxDCQ, a day excused by force majeure. The other three are refusals and return no figures at all. The engine's words for them: \"makeUp must be an object { periodYears, order, endOfTerm } (no default); got nothing\", \"quantityUnit must be one of \"scf\", \"Mscf\", \"MMscf\", \"Sm3\", \"MSm3\", \"MMSm3\"; got \"bcf\"\" and \"days[0].taken must be at or below the quantity made available 50; got 60\".")

q(2, "Where does a learner of this course run the practicals?",
 "In the course's own quantity calculator panel, which calls the same vendored engine the lessons quote.",
 ["In a spreadsheet the course provides, whose formulas copy the engine's rules line by line for study.",
  "On paper only, because the engine is kept for grading and no panel calls it during the lessons.",
  "In a regulator's online calculator, which the course links to for every Nigerian quantity."],
 "This is an engine course with no Suite app. Each tier has a calculator panel that calls the same vendored engine: the quantity calculator at Associate, the ledger calculator at Professional and the contract calculator at Expert. The learner types or pastes contract terms and the panel prints what the engine returns, every refusal in the engine's own words and the reasons beside each figure. No spreadsheet, paper-only route or regulator tool is part of the course.")

q(1, "Why does every graded number in this course have exactly one right answer?",
 "It is a return value of the engine on fixed inputs, and nothing in the engine samples or searches.",
 ["It is rounded to four decimals under the model agreement's Article 15.4 before it is graded.",
  "The grader accepts whatever figure a learner's own spreadsheet returns, within a stated band.",
  "Each graded figure is copied from a published textbook example, which fixes the answer."],
 "A capstone field, a question key and a panel figure are each computed by an engine function on contract terms written down in advance. Nothing in the engine samples or searches, so the same terms give the same number on any machine. Graded figures are quoted to six decimals as the panel prints them; the Article 15.4 four-decimal rule belongs to contract prices, which are Professional work.")

q(0, "Gas sold as LPG or CNG, and turning flared gas into value, come up while reading a gas sales agreement. Where does this course send them?",
 "To the gas value course, in one sentence, without re-teaching them.",
 ["To the Petroleum Industry Act course, which owns every use of gas in Nigeria and its fiscal terms.",
  "To this course's Expert tier, which prices LPG and CNG beside the oil-indexed export feed.",
  "To the cash flow course, which values each gas product by its NPV."],
 "The scope seams are recorded: flare to value, LPG and CNG belong to the gas value course; the cash flow ledger, discounting and NPV as a subject belong to the cash flow course; the Nigerian fiscal system belongs to the Petroleum Industry Act course. This course names each seam in one sentence and stays with the contract.")

q(3, "What does this course print as the fine for flaring gas in Nigeria?",
 "No rate: flaring is taught as a concept only.",
 ["A fine per unit of gas flared, which section 104 of the Act prints in its own text.",
  "A rate per thousand standard cubic feet read from the NUPRC Regulations of 2023.",
  "The domestic base price per MMBtu flared, as the Act ties the fine to that price."],
 "PIA s.104(1) makes flaring outside the listed exceptions an offence \"liable to a fine as prescribed by the Commission in regulations under this Act\", so the Act prints no rate, and the NUPRC Regulations copy read is unnumbered and undated. No flare rate appears anywhere in this course, and no text the course read ties a flaring fine to the domestic base price.")

q(1, "The course legislates its vocabulary. How must it write about a gap between gas wanted and gas that came?",
 "As a seller shortfall or a buyer shortfall, with the side always named.",
 ["As a shortfall, since the model agreement's Shortfall Quantity covers both sides of the delivery point.",
  "As a deficiency, whichever side caused it, measured daily.",
  "As make-up, whenever the buyer may take the gas later."],
 "The vocabulary rule: \"shortfall\" is always qualified. A seller shortfall is gas the seller did not make available against a properly nominated quantity; a buyer shortfall is the adjusted DCQ the buyer did not take. A deficiency is the take-or-pay quantity less the quantity counted over a year, and make-up is gas paid for in a deficiency year and taken later. The model agreement's Shortfall Quantity is the seller's side only.")

emit(Q, '/root/cat-wip-gsa/banks/ec8b_m01.json', expect_n=15)
finish()
