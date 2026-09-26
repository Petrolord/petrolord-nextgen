import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Professional m03, Carry-Forward and Seller Shortfall.
# Every figure is quoted from digest.txt (the engine's returns on the golden
# inputs and on the Ekene export feed and power plant fixtures). The make-up
# right after a carry-forward credit is keyed only as the engine's stated
# reading, in its own words.

q(3, "A golden contract states no carry-forward right. The buyer counts 1100.000000 in 2027 and 1050.000000 in 2028 against an Adjusted ACQ of 1000.000000, then falls 100.000000 short of its take-or-pay quantity in 2029. What does the engine charge for 2029?",
 "The full 100.000000, paid at 300.000000",
 ["A credit of 100.000000 from the 2027 excess, which leaves nothing to pay",
  "A credit of 50.000000 from 2028, at the half cap the engine applies when no cap is stated",
  "Nothing, because the excess takes of the two earlier years stand in as make-up for 2029"],
 "Carry-forward is off unless the contract states it; the engine's basis for this case reports carry-forward off with no right stated, and its reason for 2029 reads \"the deficiency payment is 100 x 3 = 300\". No credit is drawn from the earlier excess, and the engine holds no default cap to apply. Excess takes are never make-up, which is gas paid for in a deficiency year and taken later.")

q(1, "Two golden cases state carry-forward for 2 contract years with a cap of 100 percent, one above the Adjusted ACQ of 1000.000000 and one above the take-or-pay quantity of 800.000000. The buyer counts 1100.000000 in 2027. What surplus does each record?",
 "Surplus of 100.000000 against 1000.000000, and of 300.000000 against 800.000000",
 ["The same 100.000000 in both cases",
  "300.000000 above the Adjusted ACQ and 100.000000 above the take-or-pay quantity, the larger base giving the larger surplus",
  "1100.000000 in both, since the whole take of an over-taking year becomes the surplus"],
 "The surplus is the quantity counted above the stated base: 1100.000000 less 1000.000000 is 100.000000 on the Adjusted ACQ, and 1100.000000 less 800.000000 is 300.000000 on the take-or-pay quantity, as the engine's reasons print. The base is a stated term, so the two cases differ. A higher base leaves a smaller surplus. Only the part above the base is credited; the rest of the take has already met the year's own obligation.")

q(0, "Under a base set at the take-or-pay quantity, surpluses of 300.000000 (2027) and 250.000000 (2028) are carried for 2 contract years. When 2029 counts 700.000000 against 800.000000, what does the ledger show?",
 "A credit of 100.000000 from 2027 leaves nothing to pay, and the other 200.000000 from 2027 expires unused at the end of 2029",
 ["A credit of 100.000000 from 2028, the newer surplus",
  "A credit of 300.000000, the whole 2027 surplus",
  "A deficiency payment of 300.000000, credits waiting for 2030"],
 "Credits are drawn first in first out, so the 2029 deficiency of 100.000000 is met from 2027, and a 2027 surplus carried for 2 contract years lasts to the end of 2029: the engine's reasons read \"a carry-forward credit of 100 (at most 100% of the deficiency, first in first out: 100 from 2027) leaves 0\" and \"carry-forward of 200 from 2027 expired unused at the end of 2029\". Drawing 2028 first reverses the order. A credit is never larger than the deficiency it meets. Credits apply in the year of the deficiency.")

q(2, "Suppose the credit is capped at half of any deficiency. Carrying 100.000000 of excess from 2027, the buyer comes up 100.000000 below its take-or-pay quantity in 2029, priced at 3. What credit and payment result?",
 "A credit of 50.000000 and a deficiency payment of 150.000000",
 ["A credit of 100.000000 and a deficiency payment of 0.000000, since the carried surplus covers the whole deficiency",
  "A credit of 50.000000 and a deficiency payment of 300.000000, because a capped credit reduces make-up and leaves the payment whole",
  "No credit at all, since a cap of 50 percent only lets the buyer draw on surplus older than two years"],
 "The cap is a percentage of the year's deficiency, so at 50 percent the credit is 50.000000 and the payment is 50 x 3 = 150, as the engine's reason prints. Crediting the whole 100.000000 ignores the cap, which is what binds here. The credit comes off the deficiency before it is priced, so the payment falls to 150.000000. The cap limits the size of the credit, and says nothing about the age of the surplus.")

q(0, "On the Ekene export feed ledger (synthetic), 2029 counts 14257000.000000 against a take-or-pay quantity of 20695500.000000, with 3913300.000000 of carry-forward available and a cap of 50 percent. What credit does the engine apply?",
 "3219250.000000, half the deficiency of 6438500.000000",
 ["3913300.000000, the whole carry-forward available",
  "2299500.000000, the 2027 surplus alone",
  "6438500.000000, which wipes out the deficiency for the year"],
 "The deficiency is 20695500.000000 less 14257000.000000, 6438500.000000, and the cap allows at most 50 percent of it, 3219250.000000, drawn first in first out, which the engine's reason prints as \"2299500 from 2027, 919750 from 2028\". The 3913300.000000 available is more than the cap lets the year use. The 2027 surplus alone is less than the credit, so the draw continues into 2028. A credit equal to the whole deficiency is what a cap of 100 percent would allow.")

q(3, "The export feed's 2029 take-or-pay price is 9.808450, the annual average of the monthly contract prices (the model agreement's Article 15.2.6 Alternative 1). After the carry-forward credit, what deficiency payment does the engine return?",
 "31575852.662500",
 ["45129551.627500, which is the deficiency payment the engine returns for the whole ten-year term of the agreement",
  "171414924.312500, the export feed's net to the seller for 2029 with the gas taken and the payment added together",
  "9081070.425000, the payment of 2035"],
 "The engine prices only the deficiency left after the credit: 3219250.000000 at 9.808450, and its reason reads \"the deficiency payment is 3219250 x 9.80845 = 31575852.6625\", quoted as the field 31575852.662500. 45129551.627500 is the deficiency payment summed over the whole term, of which 2029 is one year. 171414924.312500 is the year's net to the seller, which adds the gas taken at the contract price. 9081070.425000 is the payment for the 2035 deficiency, after that year's own credit.")

q(1, "What make-up right does the engine open from the export feed's 2029 deficiency, and on what basis does it say so?",
 "3219250.000000, on the engine's stated reading that the make-up right equals the deficiency actually paid after any carry-forward credit",
 ["6438500.000000, the whole deficiency, since the model agreement's Make-Up Aggregate sums the deficiency before a credit",
  "3219250.000000, which is the law under the model agreement",
  "None, because a year that draws a credit opens no make-up"],
 "The engine states its reading in its own words: \"make-up right equals the deficiency actually paid after any carry-forward credit\", and its 2029 reason reads \"the buyer may make up 3219250 in the 5 contract years after 2029, to the end of 2034\". The model agreement's Make-Up Aggregate sums the deficiency quantities before any credit, which is why the course teaches this figure as the engine's stated choice and keys it only as that. Calling it the law of the model agreement misstates it. A year with a credit still pays for part of its deficiency, and that part opens make-up.")

q(2, "Excess of 100.000000 from 2027 may be credited for 2 contract years. The buyer meets its take-or-pay quantity in 2028 and 2029 and first misses it, by 100.000000, in 2030, the final year. How does the engine treat 2030?",
 "Its credit lapsed when 2029 closed, leaving the full 100.000000 to pay in 2030",
 ["A credit of 100.000000 in 2030, since a surplus waits for the first deficiency whenever it comes in the term",
  "A credit of 50.000000 in 2030",
  "No payment in 2030, since a last-year deficiency is settled by the end-of-term rule"],
 "A surplus carried for 2 contract years from 2027 lasts to the end of 2029, and the engine's reason reads \"carry-forward of 100 from 2027 expired unused at the end of 2029\"; its 2030 reason reads \"the deficiency payment is 100 x 3 = 300\". A surplus has a stated period and does not wait. The case's cap is 100 percent, so no half credit applies. The end-of-term rule acts on make-up already open; the year's own deficiency is still paid.")

q(1, "On the export feed ledger, carry-forward is stated for 3 contract years. In 2031 the engine reports that 694050.000000 of carry-forward expired unused. Which year's surplus was it?",
 "2028's, whose period of 3 contract years ends in 2031",
 ["2027's, the oldest surplus",
  "2030's",
  "2029's, the outage year"],
 "A surplus from 2028 carried for 3 contract years runs to the end of 2031, and the engine's reason reads \"carry-forward of 694050 from 2028 expired unused at the end of 2031\". The 2027 surplus of 2299500.000000 was drawn in full in 2029. 2029 and 2030 record no surplus at all. A credit drawn does not create a surplus; only takes above the base do.")

q(3, "In 2027 the Ekene power plant's seller made 6300.000000 fewer MMBtu available than was properly nominated, and the fixture states liquidated damages of 1.25 US$ per MMBtu not made available (a synthetic contract term). What does the engine return for that seller shortfall?",
 "7875.000000, paid to the buyer and taken off the seller's net",
 ["7875.000000, added to the seller's net as a charge on the buyer for gas it could not take",
  "Nothing, because the seller shortfall already reduces the Adjusted ACQ, which is the buyer's whole remedy for it",
  "6300.000000 of make-up for the buyer"],
 "The engine's reason reads \"seller shortfall 6300 reduces the Adjusted ACQ and is paid to the buyer at 1.25: 7875\". The damages run from seller to buyer, so they reduce the net to the seller. The reduction of the Adjusted ACQ and the damages are two separate consequences, and the fixture states both. Make-up is the buyer's right after a deficiency it paid; a seller shortfall creates none.")

q(0, "A learner states a seller shortfall of 5 in a contract year and leaves the seller shortfall price out. What does the engine return?",
 "A refusal: years[0].shortfallPrice must be stated, since the engine holds no default rate",
 ["Damages at US$3.50 per MMBtu",
  "Damages at the year's take-or-pay price",
  "No damages, with the seller shortfall still taken off the Adjusted ACQ for the year as the contract states"],
 "The engine's message reads \"years[0].shortfallPrice must be stated when sellerShortfall is above 0 (5); the engine holds no default rate; got nothing\". US$3.50 per MMBtu is the Act's Domestic Gas Delivery Obligation penalty, a different rule on a different party. The take-or-pay price is no stand-in either. The engine does not run the year without the rate, since the net to the seller depends on it.")

q(2, "In a golden year with an ACQ of 1000.000000, reductions of 200.000000 including a seller shortfall of 50.000000, 600.000000 counted, take-or-pay at 80 percent, prices of 3 and a seller shortfall price of 1.5, what net to the seller does the engine return?",
 "1845.000000, after the damages of 75.000000",
 ["2400.000000, the take-or-pay quantity of a year with nothing reduced, priced at 3",
  "120.000000, the deficiency payment alone",
  "The gas taken plus the deficiency payment, with the damages of 75.000000 added on top as a charge to the buyer"],
 "The engine builds the net as the gas counted at the contract price plus the deficiency payment less the seller shortfall damages: 600 x 3 plus 40 x 3, less 50 x 1.5, which is 1845.000000, and its reason reads \"seller shortfall 50 reduces the Adjusted ACQ and is paid to the buyer at 1.5: 75\". The deficiency payment of 120.000000 is only one term of the net. 2400.000000 is what the same prices give when nothing reduces the Adjusted ACQ and the take-or-pay quantity is exactly met. The damages run to the buyer, so they come off the net.")

q(3, "The export feed's term ends in 2036 with 457950.000000 of make-up unrecovered, refunded at that year's take-or-pay price. The engine's reason prints the refund as the full double it holds, with a long tail of digits after the third decimal. Which figure does the course quote and reason with?",
 "3700831.335000, the numeric field",
 ["The longer figure in the engine's reason, since the reason carries the double the engine holds",
  "The refund rounded to cents, since it is paid in money",
  "3700831.335000 plus the 2069500.000000 of carry-forward still outstanding, which the refund also pays out"],
 "The course quotes the numeric field at six decimals, 3700831.335000, and quotes the reason only verbatim as the engine's words, where the figure is the shortest round-trip decimal of the double. Rounding to cents is not how the course prints a figure. Carry-forward outstanding at the end of the term is not refunded: it is a credit against deficiencies, and with no year left it simply lapses.")

q(0, "In the engine's basis for the export feed ledger, what is the carry-forward cap a percentage of?",
 "The year's deficiency",
 ["The annual quantity",
  "The surplus carried",
  "The take-or-pay quantity of the year the surplus arose in, which fixes the size of every later credit"],
 "The engine's basis reads \"surplus above the take-or-pay quantity is credited against later deficiencies, at most 50% of a year's deficiency\", which is how the 2029 credit comes to 3219250.000000 on a deficiency of 6438500.000000. ESMAP (1993, para 6.62) describes a cap stated as a percentage of the annual quantity, a different base. A cap on the surplus would limit what is carried; this cap limits what a year may use. The take-or-pay quantity is not the base of the cap.")

q(1, "A learner states carryForward.capPct as 120, hoping to let one year's credit exceed its deficiency. What does the engine return, in its own words?",
 "carryForward.capPct must be a number from 0 to 100; got 120",
 ["A ledger with the cap held at 100 percent, the most a credit can ever be worth against a year's deficiency",
  "A ledger whose credit exceeds the deficiency, paying the difference to the buyer",
  "carryForward.cap is not an accepted key"],
 "The engine refuses the cap by name: \"carryForward.capPct must be a number from 0 to 100; got 120\". It never clamps a stated term to a limit of its own, and a credit is never paid out beyond the deficiency it meets. The message about carryForward.cap is the engine's refusal of a misspelt key, which is a different input.")

emit(Q, '/root/cat-wip-gsa/banks/ec8i_m03.json', expect_n=15)
finish()
