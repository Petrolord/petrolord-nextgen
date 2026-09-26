import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Expert m02, Whole-Contract Cash Flows. Keys rest on gsaCashFlows rows
# for the two Ekene agreements (cf-power, cf-export), the royalty rates the
# canonical deriveGasRoyaltyRate returns, the canonical npv results with their
# rate and base year, the zero-rate check and the refusals of a whole-contract
# call. Power plant money rests on the fixture's held price, a stated planning
# assumption, and every question that quotes it says so.

K = [1, 3, 0, 2, 0, 1, 3, 2, 1, 0, 3, 2, 3, 1, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("In 2027 the Ekene power plant (synthetic, at the fixture's held price, a stated planning assumption) has a regular line of 15794100.000000 and shortfall damages of -7875.000000. What seller revenue does gsaCashFlows return?",
 "15786225.000000, the lines summed with the damages negative",
 ["15794100.000000, since shortfall damages sit beside the revenue lines and stay out of the sum",
  "15391372.500000, the figure the engine reports after royalty",
  "The regular line plus 7875.000000, the damages being paid to the seller by the buyer"],
 "Seller revenue is the sum of the five lines, and shortfall damages enter as a negative line because the seller pays them to the buyer: 15794100.000000 - 7875.000000 = 15786225.000000. Leaving the damages out gives the regular line alone; 15391372.500000 is the net after royalty, a separate column; and the damages flow from seller to buyer, so adding them has the direction backwards.")

# 2
x("Both Ekene agreements are onshore. Why does the export feed (synthetic) carry a gas royalty rate of 0.050000 where the power plant carries 0.025000?",
 "Its gas is exported, 0 percent utilised in-country, and the canonical rate is 0.050000 on exported gas",
 ["The export price is oil-indexed, and the Seventh Schedule adds a surcharge to gas priced against oil",
  "Carry-forward raises the royalty base",
  "The rate follows terrain, and the export feed is deep offshore while the power plant lies onshore"],
 "deriveGasRoyaltyRate in cashflow.ts returns 0.050000 on exported onshore gas and 0.025000 on gas utilised in-country (PIA Seventh Schedule para 10(6)); the export fixture states 0 percent in-country and the power fixture 100 percent. The rate does not depend on the price formula or on carry-forward, and both fixtures state the onshore terrain.")

# 3
x("Where does gsaCashFlows take its gas royalty rate from?",
 "From deriveGasRoyaltyRate in engines/economics/cashflow.ts, which it imports",
 ["From a royalty table held inside gasContract.js, kept in step with the Seventh Schedule by hand",
  "From the caller, who types the rate beside the terrain",
  "From the domestic base price, as a share of it"],
 "The engine's one import is cashflow.ts, for npv, deriveGasRoyaltyRate and calendarDays; it carries no royalty code of its own. The royalty block states only the terrain and the in-country share, and the rate comes back from the canonical function. The domestic base price has nothing to do with the royalty rate.")

# 4
x("On the Ekene export feed (synthetic) in 2029, the train outage year, delivered value is 139839071.650000 and seller revenue 171414924.312500. What accounts for the gap?",
 "The deficiency payment of 31575852.662500, money with no gas delivered",
 ["Make-up gas taken at 10 percent of the price, which is revenue and never delivered value",
  "The carry-forward credit of 3219250.000000",
  "The royalty, added back to revenue"],
 "In 2029 the only lines are regular, 139839071.650000, and the deficiency payment, 31575852.662500, which sum to 171414924.312500. Delivered value is the gas taken at the contract price, so the deficiency payment is in revenue and out of delivered value. The export feed takes no make-up in 2029, a carry-forward credit is a quantity that reduces the deficiency, and royalty is charged on delivered value and is no part of revenue.")

# 5
x("In 2030 the export feed's delivered value, 227645463.500000, is above its seller revenue, 210175257.635000. Why?",
 "Make-up gas counts at the full contract price in delivered value and at 10 percent of it in the make-up line",
 ["The buyer force majeure of 1260000.000000 is valued in delivered value and excused from revenue",
  "Delivered value includes royalty, which revenue excludes",
  "A refund in 2030 is subtracted from revenue and left in the delivered value"],
 "Delivered value is all gas taken at the contract price, 21385000.000000 x 10.645100. Seller revenue splits it: 19561500.000000 counted at the contract price, and 1823500.000000 of make-up at the make-up price of 1.064510, a tenth of it. Force majeure gas is gas not taken, so it is in neither figure; royalty is charged on delivered value and not inside it; and the export refund falls only in 2036.")

# 6
x("gsaCashFlows runs the Ekene power plant (at the fixture's held price, a stated planning assumption) at 0.1 to 2026 and returns two present values. Which is the NPV of the seller revenue?",
 "81993119.091889",
 ["79963756.225663",
  "122801553.000000",
  "1,157,367,784.116539"],
 "The power plant's NPV of the seller revenue is 81993119.091889 and the NPV of the net after royalty 79963756.225663, lower because royalty comes off each year. 122801553.000000 is the undiscounted total net to the seller from the ledger, and 1,157,367,784.116539 is the export feed's NPV of the seller revenue.")

# 7
x("The export feed's NPV of the seller revenue is 1,157,367,784.116539. Which terms must a report quote beside it?",
 "A discount rate of 0.1 and the base year 2026, flows taken at year end",
 ["The royalty rate of 0.050000 and the terrain, since this NPV is stated after the gas royalty is paid",
  "The 2027-01 price alone",
  "Only the discount rate, the base year always being the first contract year of the agreement"],
 "An NPV depends on the discount rate and base year stated, so both are quoted beside it: the engine's basis reads year-end flows discounted to 2026 at 0.1. This NPV is of the seller revenue, before royalty (the net after royalty has its own NPV, 1,099,781,259.486489). No single month's price sets it, and the base year is a stated input: 2026 here, before the first contract year of 2027.")

# 8
x("The golden small case (deep offshore, 40 percent utilised in-country) is run at a discount rate of zero. What does the course use it to show?",
 "Its NPV of the seller revenue, 8400.000000, is the plain sum of the rows",
 ["A royalty rate that falls to zero with the discount rate",
  "A refusal of the rate, zero lying outside the accepted range",
  "That the NPV equals the last year's row, since at zero only the final year-end flow counts"],
 "At a rate of zero every discount factor is one, so the NPV of the seller revenue is the plain sum of the rows: 8400.000000 both ways. The royalty rate is set by terrain and share, 0.040000 here, whatever the discount rate; the engine refuses only rates at or below -1; and every year's flow counts at zero.")

# 9
x("A gsaCashFlows call leaves out the royalty block. What does the engine do?",
 "It refuses by name: royalty must be an object of terrain and inCountrySharePct, with no default terrain",
 ["Runs it onshore at 100 percent in-country",
  "Runs with a royalty rate of zero and a note that no royalty was stated in the call",
  "Uses 0.050000, the exported onshore rate, as the most cautious default"],
 "The engine's message, verbatim, is \"royalty must be an object { terrain, inCountrySharePct } (no default terrain); got nothing\". The royalty terrain is one of the contract terms with no default, and a missing one is refused when it is missing. The engine assumes no terrain, no share and no rate.")

# 10
x("gsaCashFlows is given a discountRate of -1. What comes back?",
 "The refusal \"discountRate must be a finite number above -1; got -1\"",
 ["An NPV equal to the plain sum of the rows, the engine flooring the rate at zero",
  "An NPV of 0.000000",
  "A present value computed at -1, with every discount factor reported as unbounded"],
 "The rate must be a finite number above -1, and -1 is refused by name before anything is discounted. The engine floors no rate at zero, returns no NPV for a refused call, and computes nothing on a rate that cannot be true.")

# 11
x("A learner states royalty.terrain as marginal_field. What does the engine return?",
 "A refusal listing onshore, shallow_water, deep_offshore and frontier",
 ["The onshore rate, the canonical function treating a marginal field as onshore for gas",
  "A rate of zero, with a reason that marginal fields pay no gas royalty under the Act",
  "The deep offshore rate, the terrain the engine reads as the closest match to a marginal field"],
 "The engine's message, verbatim, is \"royalty.terrain must be one of \"onshore\", \"shallow_water\", \"deep_offshore\", \"frontier\"; got \"marginal_field\"\". A terrain outside the accepted list is refused; the engine maps no unknown terrain onto a known one and invents no rate.")

# 12
x("On the export feed (synthetic) in 2036, how does the end-of-term refund enter gsaCashFlows?",
 "As a negative line of -3700831.335000, leaving seller revenue of 164562986.859000",
 ["As a positive line, the refund being money the buyer pays for the make-up it never took",
  "Outside the revenue lines, in a note",
  "As a cut in delivered value, which falls by 3700831.335000 and so carries less royalty"],
 "The refund is paid by the seller to the buyer, so like shortfall damages it is a negative line, and seller revenue for 2036 is 164562986.859000. The seller pays it (the buyer receives it); it is one of the five revenue lines and enters the NPV; and delivered value, the gas taken at the contract price, is 173295397.200000 whatever the refund.")

# 13
x("The export feed's totals print regular revenue 1,837,552,860.055000, make-up revenue 4242052.824500, deficiency payment 45129551.627500 and refund 3700831.335000. How is its net to the seller of 1,883,223,633.172000 built?",
 "Regular plus make-up plus deficiency payment, less the refund",
 ["Regular plus deficiency payment, with the make-up revenue left out as gas already paid for in an earlier year",
  "Regular plus make-up plus deficiency payment plus the refund, each counted as positive money to the seller",
  "Regular less the royalty, plus deficiency payment, less make-up revenue"],
 "Net to the seller is the regular revenue plus the make-up revenue plus the deficiency payments, less the refund: 1,837,552,860.055000 + 4242052.824500 + 45129551.627500 - 3700831.335000 = 1,883,223,633.172000. The export feed prices make-up at 10 percent of the contract price, so it is revenue; the refund is paid by the seller; and royalty is no part of the ledger's net to the seller.")

# 14
x("What gas royalty does gsaCashFlows charge the export feed in 2029, its train outage year?",
 "6991953.582500, which is 0.050000 of the 139839071.650000 delivered",
 ["8435951.965000, the 2028 royalty carried into the outage year",
  "Nothing, as a year with a deficiency pays no royalty",
  "0.050000 of the seller revenue of 171414924.312500, with the deficiency payment inside it"],
 "The engine charges the rate on the value of gas delivered: 0.050000 x 139839071.650000 = 6991953.582500. 8435951.965000 is the 2028 royalty, owed on 2028's gas. A deficiency year still delivers gas and pays royalty on it, and the engine's stated reading keeps the deficiency payment out of the royalty base.")

# 15
x("The make-up line is 0.000000 in every year of the Ekene power plant (synthetic), even in 2029 when its buyer takes 210000.000000 of make-up. Why?",
 "The fixture states a make-up price of 0.000000: that gas was paid for in 2028",
 ["Make-up is netted against the same year's deficiency payment, so the line always cancels to zero",
  "All make-up is forfeited at the end of the term, so the engine books none",
  "Make-up gas is valued in the delivered value only, and the engine suppresses its revenue line"],
 "The power fixture states a make-up price of 0.000000 in every year, so make-up taken earns nothing more: it was paid for with the 2028 deficiency payment. 2029 has no deficiency to net against; only the 252000.000000 still open at the end of the term is forfeited, and 210000.000000 was taken in 2029; the make-up line is printed, at the stated price, which here is zero.")

emit(Q, '/root/cat-wip-gsa/banks/ec8a_m02.json', expect_n=15)
finish()
