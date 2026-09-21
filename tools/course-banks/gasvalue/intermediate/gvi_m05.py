import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Professional m05, Credits and the Bid.
# Draws on m05's five lessons only: digest SECTION 22 (creditSensitivity: the
# breakeven in closed form, the lowest tested price that clears, the first price
# in the order typed, the verdicts, the refusals and the answers with no
# verdict) and SECTION 23 (compareRoutes: the bid table, its fields and the
# ranking note). Credit prices and the hurdle are case inputs, invented and
# illustrative. No question keys a credit price as right, and none keys a
# discounted figure.

q(2, "How does creditSensitivity form breakevenCreditPrice?",
 "(hurdle minus margin) over net tonnes",
 ["(hurdle minus margin) over the gross flare tonnes",
  "the lowest typed price that clears",
  "(hurdle plus margin) over the net tonnes abated"],
 "The field's own label: breakevenCreditPrice ((hurdle minus margin) over net tonnes), 16.0152 on EGBEMA's CNG route against diesel. The breakeven is the price at which the route just clears its hurdle, in closed form. The lowest typed price that clears is lowestTestedClearingPrice, a separate field.")

q(0, "Credit prices are typed in the order 40, 8, 20, 12. What does lowestTestedClearingPrice read?",
 "20",
 ["40",
  "16.0152",
  "12"],
 "Of the prices typed, 40 and 20 print clearsHurdle true and 8 and 12 false, and the course prints lowestTestedClearingPrice 20. 40 is the first price in the order typed that clears, and 16.0152 is the breakeven.")

q(3, "Beside the breakeven and lowestTestedClearingPrice, a third price is printed: the first price in the order typed that clears. What does it read, and how does it relate to the other two?",
 "40, and it is neither of the other two",
 ["20, and it equals the lowest tested price",
  "16.0152, and it equals the breakeven price",
  "40, and it is lowestTestedClearingPrice"],
 "The course prints the first price in the order typed that clears as 40 and says it \"is a third figure again, and it is neither\". The breakeven is 16.0152 and lowestTestedClearingPrice is 20.")

q(1, "What is printed as the breakeven's numerator, the hurdle minus the margin, on EGBEMA's CNG route?",
 "3491850.00 a year",
 ["24500000 a year",
  "8721314.60 a year",
  "21008150.00 a year"],
 "The course states: \"The breakeven's numerator, the hurdle minus the margin: 3491850.00 a year, over 218032.865 t/yr.\" 24500000 is the hurdle, 21008150.00 the gross margin and 8721314.60 the credit revenue at a price of 40.")

q(0, "At a typed credit price of 12, which row does creditSensitivity print?",
 "creditRevenuePerYear 2616394.38, totalMarginPerYear 23624544.38, clearsHurdle false",
 ["creditRevenuePerYear 4360657.30, totalMarginPerYear 25368807.30, clearsHurdle true",
  "creditRevenuePerYear 2616394.38, totalMarginPerYear 23624544.38, clearsHurdle true",
  "creditRevenuePerYear 1744262.92, totalMarginPerYear 22752412.92, clearsHurdle false"],
 "The row for 12 prints 2616394.38, 23624544.38 and false: a point clears when its total margin reaches the hurdle of 24500000. The 4360657.30 row is the price of 20 and the 1744262.92 row the price of 8.")

q(2, "How does creditSensitivity form creditRevenuePerYear at each typed price?",
 "The credit price times the net abatement in tonnes.",
 ["The credit price times the gross flare CO2e in tonnes.",
  "The credit price times the avoided flare CO2e in tonnes.",
  "The credit price times the net tonnes, less the margin."],
 "The course states: \"creditRevenuePerYear is the credit price times the net abatement in tonnes; totalMarginPerYear is the route's gross margin plus that\". At a price of 20 on 218032.865 t/yr it prints 4360657.30.")

q(3, "Against a hurdle of 24500000, what verdict does creditSensitivity give EGBEMA's CNG route?",
 "\"Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price.\"",
 ["\"Needs a credit price of 20 per tonne to clear the hurdle. This is a bet on the credit price.\"",
  "\"Clears the hurdle on its own. Credits are upside; the case stands without them.\"",
  "\"Needs a credit price of 40 per tonne to clear the hurdle. Credits are upside.\""],
 "The course prints standsAloneWithoutCredits false and the verdict \"Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price.\" The field breakevenCreditPrice prints the same price as 16.0152. The stands alone verdict belongs to the hurdle of 20000000.")

q(0, "Lower the hurdle margin to 20000000 with the same margin and net. Which two fields follow?",
 "standsAloneWithoutCredits true, breakevenCreditPrice 0.0000",
 ["standsAloneWithoutCredits true, breakevenCreditPrice 20",
  "standsAloneWithoutCredits true, breakevenCreditPrice null",
  "standsAloneWithoutCredits false, breakevenCreditPrice 0.0000"],
 "The course states: \"At a hurdle of 20000000 the route stands alone: standsAloneWithoutCredits true, breakevenCreditPrice 0.0000, verdict Clears the hurdle on its own. Credits are upside; the case stands without them.\" A null breakeven is what the probes with no margin or no hurdle print, and 20 is lowestTestedClearingPrice at the hurdle of 24500000.")

q(1, "creditSensitivity is run on the gas to power counterfactual, whose net abatement is -2010.348 t/yr. What does it answer?",
 "REFUSED: The net abatement is -2010.348 tCO2e a year: the project does not abate, so there are no credits to sell.",
 ["REFUSED: No net abatement to sell. Declare the counterfactual first.",
  "A breakeven of 0.0000, as a negative net needs no credit price.",
  "No verdict: breakevenCreditPrice null, with the net named."],
 "The course's probe table prints that refusal for \"the gas-to-power counterfactual, which adds emissions\". The \"No net abatement to sell\" refusal is the one for a counterfactual left undeclared.")

q(3, "creditSensitivity is run with the counterfactual undeclared, so there is no net abatement. What does it answer?",
 "REFUSED: No net abatement to sell.",
 ["It prices credits on the gross flare of 215946.438 t/yr.",
  "It answers with no verdict and a null breakeven.",
  "REFUSED: The hurdle margin must be a number."],
 "The course states: REFUSED: No net abatement to sell. Declare the counterfactual first: a credit computed from a gross flare figure is a credit that cannot be issued. The hurdle refusal is for a hurdle typed as 'x'.")

q(2, "The hurdle margin is typed as 'x'. What does creditSensitivity answer?",
 "REFUSED: The hurdle margin must be a number.",
 ["No verdict: breakevenCreditPrice null; \"No hurdle margin, so whether it needs credits cannot be said.\"",
  "It takes the hurdle as zero, and the route stands alone.",
  "REFUSED: No net abatement to sell."],
 "The probe \"a hurdle that is not a number ('x')\" prints REFUSED: The hurdle margin must be a number. The answer with no verdict and the no hurdle sentence belong to the hurdle left blank ('').")

q(0, "A study leaves the hurdle box empty (''). Which answer comes back from the credit test?",
 "No verdict: breakevenCreditPrice null, with \"No hurdle margin, so whether it needs credits cannot be said.\"",
 ["REFUSED: The hurdle margin must be a number, as a blank is not a figure.",
  "standsAloneWithoutCredits true, with the hurdle taken as zero.",
  "No verdict: breakevenCreditPrice null, with \"Supply its price and costs.\""],
 "The course's probe \"hurdle left blank ('')\" answers with no verdict: breakevenCreditPrice null; \"No hurdle margin, so whether it needs credits cannot be said.\" The other answer with no verdict belongs to a route whose price is missing.")

q(1, "On EGBEMA with the study's limits, what do compareRoutes' fields read?",
 "bestByValuePerMscf cng; screenedOut Mini LNG; notFullyScreened gas to power",
 ["bestByValuePerMscf null; leaderNotFullyScreened cng; screenedOut Mini LNG",
  "bestByValuePerMscf cng; screenedOut gas to power; notFullyScreened Mini LNG",
  "bestByValuePerMscf lpg_extraction; screenedOut Mini LNG; notFullyScreened none"],
 "The course prints bestByValuePerMscf cng, leaderNotFullyScreened null, screenedOut Mini LNG and notFullyScreened Gas to power or gas to wire. The null best with cng as leader not fully screened is the studio's opening case, with every limit unset.")

q(3, "With every limit unset, as the studio opens, what do bestByValuePerMscf and leaderNotFullyScreened read?",
 "null and cng",
 ["cng and null",
  "cng and cng",
  "null and null"],
 "The studio's opening case prints bestByValuePerMscf null and leaderNotFullyScreened cng. With the study's limits typed, the two read cng and null.")

q(2, "The bid table's rankingNote opens with one sentence. Which?",
 "\"Ranked on gross margin per Mscf, which ignores the capital.\"",
 ["\"Ranked on net abatement against the counterfactual, which ignores the capital.\"",
  "\"Ranked on capital, which is handed on undiscounted.\"",
  "\"Ranked on gross margin per Mscf, with the capital netted out of it.\""],
 "The rankingNote reads: \"Ranked on gross margin per Mscf, which ignores the capital. Compare that against the capital column before concluding, and value the shortlist in the sanctioned economics engine.\"")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/intermediate/gvi_m05.json', label='gvi_m05', expect_n=15)
finish()
