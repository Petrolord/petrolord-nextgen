import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Associate m04, The Daily Balance.
# Sources: the dailyBalance rule and identity in the engine's basis; the power
# plant's January 2027 table, totals and reasons; the single golden days and
# their reasons; the reading the section rests on, taught as the engine's
# stated choice; the dailyBalance refusals. Every key rests on a digest-printed
# line or an engine return re-run in
# /root/cat-wip-gsa/scratch/bank-beginner/witness.mjs.

q(0, "Over the 31 days of January 2027, what total buyer shortfall does the engine return for the Ekene power plant?",
 "31270.000000, summed over the days on which one arose.",
 ["24740.000000, the month's buyer shortfall once the over-take of 6530.000000 is netted off it.",
  "6300.000000, the gap on 2027-01-20.",
  "8400.000000, from the buyer-caused day."],
 "The January 2027 totals print a buyer shortfall of 31270.000000 and an over-take of 6530.000000, each summed separately. 24740.000000 is the difference between the two, one side of the reconciliation identity and no total the engine labels buyer shortfall. 6300.000000 is the month's seller shortfall, all of it on 2027-01-20, and 8400.000000 is the buyer shortfall of the one buyer-caused day, 2027-01-30.")

q(2, "The engine's identity for January 2027 sets the sum of buyer shortfall less over-take against the Adjusted ACQ for the days less taken. What does it find?",
 "Both sides equal 24740.000000, checked exactly.",
 ["31270.000000 on one side and 24740.000000 on the other, the gap being the month's over-take.",
  "The two sides agree to six decimals, which the course reads as equal whatever the engine holds.",
  "Both are 592200.000000."],
 "The identity, in the engine's basis: sum of buyer shortfall - sum of over-take = Adjusted ACQ - taken. Buyer shortfall less over-take is 31270.000000 less 6530.000000; the Adjusted ACQ for the days less taken is 592200.000000 less 567460.000000. Both are 24740.000000, and the course checks them equal exactly. Agreement at six decimals alone would prove nothing: printed alike is not equal.")

q(3, "On 2027-01-20 the power plant's buyer properly nominated 22050 and the seller made 15750 available, with no tolerance, force majeure or maintenance. What seller shortfall does the engine return?",
 "6300.000000.",
 ["0.000000, because the buyer took every unit of the gas the seller made available.",
  "1050.000000, the part of the day's take that ran above the adjusted DCQ.",
  "22050.000000, the whole of the quantity properly nominated for the day."],
 "The engine's reason, verbatim: \"2027-01-20: the seller made 15750 available against a properly nominated 22050: seller shortfall 6300\". The shortfall is the properly nominated quantity less what was made available. Taking all that was offered clears the buyer's side, and 1050.000000 is that day's over-take.")

q(1, "The 6300 seller shortfall of 2027-01-20 changes the buyer's yardstick for that day. To what?",
 "14700.000000, the DCQ of 21000 less the day's seller shortfall.",
 ["21000.000000, the DCQ.",
  "15750.000000, the gas made available.",
  "22050.000000, the nomination."],
 "The engine's rule: adjusted DCQ = DCQ - force majeure - maintenance - seller shortfall. With no force majeure or maintenance that day, 21000 less 6300 is 14700.000000. The buyer took the 15750.000000 made available, so it has no buyer shortfall and the 1050.000000 above the adjusted DCQ is over-take. Neither the gas offered nor the nomination is the yardstick.")

q(0, "A golden day states a DCQ of 100, a delivery tolerance of 5, a properly nominated 100, and 95 made available and taken. What does the engine return?",
 "The tolerance covers the gap; the buyer's side is 5.000000 short.",
 ["A seller shortfall of 5.000000.",
  "Both sides short by 5.000000, the same gap counted once as a seller shortfall and once as a buyer shortfall.",
  "A seller shortfall of 1.000000 and an adjusted DCQ of 99.000000, the tolerance taken first."],
 "The seller shortfall is (PNQ - tolerance) - available: (100 - 5) - 95 is 0, so the tolerance covers the gap. The adjusted DCQ stays 100.000000, and taken 95 leaves a buyer shortfall of 5.000000; the engine's reason: \"2027-03-01: taken 95 is below the adjusted DCQ 100: buyer shortfall 5\". A seller shortfall of 1.000000 with an adjusted DCQ of 99.000000 is the day with 94 made available.")

q(3, "Move the seller one unit past its tolerance of 5: 94 offered and taken against 100 properly nominated. Which adjusted DCQ comes back?",
 "99.000000, the DCQ less the seller shortfall of 1.",
 ["94.000000, the gas made available and taken.",
  "95.000000, the DCQ less the tolerance.",
  "100.000000, the DCQ, left whole because a delivery tolerance day never reduces the buyer's yardstick."],
 "The engine's reasons, verbatim: \"2027-03-01: the seller made 94 available against a properly nominated 100 less the tolerance 5: seller shortfall 1\" and \"2027-03-01: taken 94 is below the adjusted DCQ 99: buyer shortfall 5\". The seller shortfall of 1 comes off the DCQ, so the adjusted DCQ is 99.000000. The tolerance itself is not subtracted from the DCQ, and neither is the gas made available.")

q(2, "The buyer nominates 150 against a MaxDCQ of 120 (a DCQ of 100) and the seller makes nothing available. What seller shortfall does the engine return?",
 "120.000000.",
 ["150.000000, the whole nomination that the seller failed to meet on the day.",
  "100.000000, since a seller shortfall is measured against the DCQ of the day.",
  "30.000000, the part of the nomination that ran above the ceiling of MaxDCQ."],
 "The engine's reasons, verbatim: \"2027-03-01: nominated 150 is above the MaxDCQ 120; 30 is not properly nominated\" and \"2027-03-01: the seller made 0 available against a properly nominated 120: seller shortfall 120\". The 30 above MaxDCQ carries no obligation, and the yardstick is the properly nominated quantity, which here is above the DCQ.")

q(1, "A golden day has a properly nominated 100, only 40 made available, and force majeure of 30 with maintenance of 10. How much of the 60 not made available is a seller shortfall?",
 "20.000000, as force majeure and maintenance excuse 40 of the 60.",
 ["60.000000, all of it.",
  "0.000000, all excused.",
  "40.000000, the rest."],
 "The engine's reasons, verbatim: \"2027-03-01: 40 not made available is excused by the force majeure and maintenance quantities stated for the day\" and \"2027-03-01: the seller made 40 available against a properly nominated 100: seller shortfall 20\". The adjusted DCQ is 100 - 30 - 10 - 20 = 40.000000, and the buyer took all 40, so it has no buyer shortfall.")

q(1, "On 2027-01-12 the power plant states force majeure of 21000, the whole DCQ. What does the engine print for the day?",
 "\"force majeure and maintenance cover the whole DCQ; no quantity is owed either way for the day\"",
 ["A buyer shortfall of 21000.000000, the same figure the zero nomination of 2027-01-05 returns for its day.",
  "A seller shortfall of 21000.000000, paid at the stated damages rate.",
  "Refused: force majeure may not cover the whole DCQ."],
 "That is the engine's reason for 2027-01-12, and 2027-01-13 carries the same. Force majeure and maintenance lift the gap off both sides: the adjusted DCQ is 0.000000 and neither shortfall arises. The buyer shortfall of 21000 on 2027-01-05 is a zero NOMINATION on an ordinary day. Force majeure up to the DCQ is accepted; only force majeure and maintenance ABOVE the DCQ are refused.")

q(0, "On a golden day the seller makes 100 available against a properly nominated 100 and the buyer takes 60. What does the engine return, under the reading it states in its basis?",
 "A seller shortfall of 0.000000 and a buyer shortfall of 40.000000.",
 ["A seller shortfall of 40.000000 and no buyer shortfall, as the model agreement's formula subtracts the gas taken.",
  "A seller shortfall of 40.000000 and a buyer shortfall of 40.000000, the gap counted once on each side.",
  "No shortfall on either side, settled as over-take."],
 "The engine's basis states the reading: \"seller shortfall measured against the quantity the seller made available\". The model agreement's printed formula, SFQ = (PNQ − DTQ ) − DAQ, subtracts the Daily Actual Quantity, which would put the 40 on the seller. The key is what the engine returns under its own stated choice, set beside the text it reads; the reading is the engine's, and no capstone figure depends on it. Over-take is gas taken above the adjusted DCQ, which this day has none of.")

q(2, "The power plant's 2027-01-30 is flagged buyerCaused: 21000 properly nominated, 12600 made available and taken. What does the engine return for the day?",
 "A buyer shortfall of 8400.000000.",
 ["A seller shortfall of 8400.000000, since the seller made only 12600 available.",
  "A seller shortfall and a buyer shortfall that split the 8400 between the two sides.",
  "No shortfall at all, as a buyer-caused gap is excused like force majeure."],
 "The engine's reasons, verbatim: \"2027-01-30: 8400 of the properly nominated quantity was not made available for a cause on the buyer's side, so it is not a seller shortfall\" and \"2027-01-30: taken 12600 is below the adjusted DCQ 21000: buyer shortfall 8400\". The flag puts the gap on the buyer; the adjusted DCQ stays 21000.000000, and force majeure is a different excuse that lifts the gap off both sides.")

q(3, "Nothing at all is nominated on 2027-01-05, an ordinary day. How does the daily balance treat it?",
 "A buyer shortfall of the whole adjusted DCQ, 21000.000000, and no seller shortfall.",
 ["A refusal, as a nomination of zero is no nomination.",
  "Nothing owed either way, as for force majeure.",
  "A seller shortfall of 21000.000000."],
 "The engine's reason, verbatim: \"2027-01-05: zero nomination; the whole adjusted DCQ 21000 is a buyer shortfall for the day\". A zero nomination is lawful and leaves the seller owing nothing, since nothing was properly nominated. The day is ordinary, so the adjusted DCQ is the full DCQ, and the buyer's gap is carried to the year's reconciliation.")

q(0, "Force majeure of 80 plus maintenance of 30 are entered against a daily contract quantity of 100. Outcome?",
 "A refusal: together they sit above the DCQ.",
 ["A seller shortfall of 0 and an adjusted DCQ clamped at zero, with a reason for the excess.",
  "A negative adjusted DCQ, which the engine carries into the month's totals.",
  "A trimmed force majeure result."],
 "The engine's own words: \"days[0].forceMajeure must be a quantity that with maintenance 30 is at or below the DCQ 100; got 80\". A quantity that cannot be true is refused before anything is computed. The engine neither clamps, trims nor carries a negative adjusted DCQ for this case.")

q(3, "A learner types \"yes\" for buyerCaused on one day. What does the engine return?",
 "A refusal: buyerCaused must be true or false.",
 ["Yes read as true.",
  "The flag ignored, as usual.",
  "A refusal naming days[0].buyercaused as an unknown key."],
 "The engine's own words: \"days[0].buyerCaused must be true or false when given; got \"yes\"\". The flag takes only true or false, and the engine guesses nothing. The key itself is spelt correctly, so the refusal is about its value and names days[0].buyerCaused.")

q(2, "Scheduled maintenance of 10500 sits on 2027-01-28, and the buyer nominates and takes exactly 10500. How does the engine settle that day?",
 "The maintenance leaves 10500.000000 to take, and all of it was taken.",
 ["A buyer shortfall of 10500.000000, the part of the DCQ left untaken on the day.",
  "A seller shortfall of 10500.000000.",
  "An adjusted DCQ of 21000.000000 with 10500 excused from the buyer's side at the year's end."],
 "The adjusted DCQ is the DCQ less force majeure, maintenance and seller shortfall: 21000 less 10500 is 10500.000000. The buyer took all 10500, so its buyer shortfall is 0.000000. Maintenance excuses the seller, so no seller shortfall arises either; the month's maintenance total is 10500.000000, this one day.")

emit(Q, '/root/cat-wip-gsa/banks/ec8b_m04.json', expect_n=15)
finish()
