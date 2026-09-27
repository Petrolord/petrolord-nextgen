import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Expert final exam, forty-two questions across the six modules, seven
# each, asked from angles the module banks do not take. Every key rests on the
# engine's return on a golden input or a stated probe the digest prints, or on
# a line the digest prints; scratch/bank-advanced/witness.mjs recomputes each
# engine figure and re-raises each quoted message. No key is a Monte Carlo
# figure stated as exact, no reading is keyed as the law, and concept-only
# items are keyed only as not computed. The Ekene Deep prospect and every
# party are synthetic. No capstone figure appears here.

K = [2, 0, 3, 1, 3, 2, 0, 1, 2, 3, 0, 1, 1, 3, 2, 0, 3, 0, 2, 1, 3,
     1, 0, 2, 0, 3, 1, 2, 1, 0, 3, 2, 3, 1, 0, 0, 2, 3, 1, 2, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# ===== information value (m01) =====
# 1
x("EKO values the Ekene seismic survey, which costs 1500000.000000, as farmor. What is its EVII less the cost?",
 "5392331.458602, and the engine says the information is worth buying",
 ["5245331.458602, and the engine says the information is worth buying",
  "6892331.458602, and the engine says the information is worth buying",
  "-2254668.541398, and the engine says it costs more than it is worth"],
 "info-ekene-farmor: EVII 6892331.458602, less the cost 1500000.000000, is 5392331.458602 (engine). 5245331.458602 is FIN's net figure on the same survey; 6892331.458602 is EKO's EVII before the cost; -2254668.541398 is FIN's net figure at a cost of 9000000.000000.")

# 2
x("EKO's EMV with the survey is 26725365.162782. Which weighting of its best actions produces it?",
 "Bright's chance 0.375000 on 64837617.964633 and dim's 0.625000 on 3858013.481672",
 ["0.375000 x 17987550.556271 after bright plus 0.625000 x 0.000000 after dim, FIN's best actions",
  "19833033.704181 plus the survey's EVII of 6745331.458602 read from FIN's side of the deal",
  "0.500000 x 64837617.964633 plus 0.500000 x 3858013.481672 at even signal odds for EKO"],
 "Each signal's best EMV for EKO (drill alone after bright, farm out after dim) weighted by the chance of that signal: 26725365.162782 (engine). The first distractor is FIN's calculation; adding FIN's EVII mixes two sides; even odds ignore the stated likelihoods, which give 0.375000 and 0.625000.")

# 3
x("Which amplitude signal changes neither side's action on the Ekene deal?",
 "The dim signal: FIN still declines and EKO still farms out",
 ["The bright signal: both sides keep the actions they took before the survey",
  "Neither signal: each side takes its prior action whatever the survey reads",
  "Both signals: each side switches action whichever way the survey comes back"],
 "Without the survey FIN declines and EKO farms out. After a dim signal (posterior 10.000000 percent) FIN declines and EKO farms out, as before; after a bright one (50.000000 percent) FIN farms in and EKO drills alone (engine). So the bright signal turns both decisions and the dim one turns neither.")

# 4
x("The first signal of a survey is typed with only its likelihood given success, [75]. How does the engine answer?",
 "information.signals[0].likelihoodsPct must be an array [P(signal / success), P(signal / dry hole)] in per cent; got [75]",
 ["information.signals must have likelihoodsPct[0] summing to 100 over the signals (P(signal / success)); got a sum of 75",
  "information.signals[0].likelihoodsPct must be a number from 0 to 100; got [75]",
  "information.signals must be an array of at least 2 signals; got [75]"],
 "Each signal states two likelihoods in per cent, one given success and one given a dry hole, so the engine refuses the shape by the signal's path, in its own words: information.signals[0].likelihoodsPct must be an array [P(signal / success), P(signal / dry hole)] in per cent; got [75]. The other three misname the rule or the field.")

# 5
x("An information call lists 11 signals. What does the engine do with it?",
 "Refuses information.signals by name, citing the cap of 10 and the count of 11",
 ["Values the first 10 signals and reports the eleventh as unread in a reason",
  "Merges the two least likely signals so that the call fits inside the cap",
  "Refuses side, since the side is checked before any signal is read"],
 "DEFAULTS.MAX_SIGNALS is 10, and the engine refuses more by name, with the cap and the count it was given (information.signals must have at most 10 entries; got 11). It truncates and merges nothing, and a stated side of farmor or farminee passes its own check.")

# 6
x("Take the uninformative golden survey, where each signal is as likely under a discovery as under a dry hole. What signal chance and posterior does each signal get?",
 "A chance of 0.500000 and a chance of success after it of 25.000000 percent",
 ["A chance of 0.750000 and a chance of success after it of 50.000000 percent",
  "A chance of 0.500000 and a chance of success after it of 50.000000 percent",
  "A chance of 0.375000 and a chance of success after it of 10.000000 percent"],
 "Equal likelihoods under both outcomes make each signal equally likely, 0.500000, and leave the chance of success where it was, 25.000000 percent (engine). A signal that moves nothing turns no decision, and EVII is 0.000000. 0.375000 and 10.000000 belong to the Ekene survey's two signals.")

# 7
x("FIN's EVII on the Ekene survey, 6745331.458602, sits below its EVPI of 14393775.278136. Why?",
 "The survey is imperfect: bright still leaves a dry-hole chance of 50.000000 percent, and dim hides a 10.000000 percent chance of success",
 ["The survey's stated cost of 1500000.000000 is taken off EVII before it is compared with EVPI",
  "EVPI is computed at the posterior chance and EVII at the prior chance of 25.000000 percent",
  "EVII is a Monte Carlo estimate over the signals, and EVPI is the exact closed-form ceiling"],
 "EVPI assumes the outcome is known; the survey only shifts the chance of success, to 50.000000 after bright and 10.000000 after dim, so FIN still farms in on some dry holes and walks away from some successes. EVII is before the cost (the net figure is 5245331.458602), and informationValue draws nothing.")

# ===== risk sharing (m02) =====
# 8
x("On risk-ekene (seed 20271111, 20000 draws) the farm-out lifts EKO's P90. Which drawn figure moves the other way for EKO?",
 "Its high case, estimated at 157675235.929265 alone and 99708134.816723 after",
 ["Its EMV, which falls from 19833033.704181 alone to 18418808.982316 after",
  "Its standard deviation, which rises from 46115911.128875 to 80399735.584206",
  "Its chance of a loss, estimated at 0.747650 alone and 0.752450 after the deal"],
 "The draws put EKO's high case at 157675235.929265 alone and 99708134.816723 after the farm-out (engine, seed 20271111, 20000 draws). The EMV rises (18418808.982316 to 19833033.704181), the standard deviation falls, and the two loss-chance estimates in the distractor are swapped.")

# 9
x("On risk-spread-four, four independent prospects at 25 percent each, why does the low case stay at -40000000.000000 while the spread halves?",
 "The chance that all four wells fail together is still above 10 percent",
 ["The engine takes the low case from the dry-hole payoff in closed form, with no draws",
  "Spreading the bet lowers only the high case, and the low case is fixed at the fail cost",
  "The correlation of 0.500000 keeps the four wells failing together at the P90"],
 "The ninetieth percentile of exceedance still falls where every well fails: with a dry-hole chance of 0.750000 for each of four independent wells, all four fail together far more often than 10 percent of the time. The low case is a drawn percentile, the call states a correlation of 0.000000 (0.500000 is risk-correlated), and nothing fixes a low case in advance.")

# 10
x("On risk-psu, seed 7 and 50000 draws, the engine prints a chance of a loss of 0.651800 for drilling yourself, where the Penn State page states a dry-hole chance of 65.000000 percent. How should the two be read?",
 "A sample of 50000 seeded draws landing near the 65.000000 percent the page states",
 ["0.651800 is the exact chance of a loss, and the page's chance is a rounded version of it",
  "The two disagree, so the engine's reading of the page's chances must be at fault somewhere",
  "0.651800 is the page's figure less the chance that the farm out position also loses money"],
 "Drilling yourself loses on every dry hole and on nothing else, and the draws estimate 0.651800 of the dry-hole chance the page states, 65.000000 percent. The farm out never loses (its chance of a loss is 0.000000), and a draw is an estimate, so no disagreement follows.")

# 11
x("risk-spread-four prints a chance of a loss of 0.341480 for four independent prospects (50000 draws, seed 11) and risk-correlated prints 0.480300 for four correlated ones (20000 draws, seed 11). What must a reader check before comparing them?",
 "The draw counts, which differ, so the two estimates carry different sampling error",
 ["The EMVs, which differ, so the two chances of a loss rest on different values of the bet",
  "The seeds, which differ, so the two calls draw from unrelated streams of random numbers",
  "Nothing: estimates at the same seed compare directly whatever the draw count"],
 "The course: read the draw counts before comparing estimates; the two rows state 50000 and 20000 draws. Both EMVs are 20000000.000000 and both seeds are 11. The standard deviations are closed form and compare directly.")

# 12
x("A riskSharing call asks for 200001 draws. What does the engine do?",
 "Refuses iterations, naming 200000 as the most draws one call accepts",
 ["Draws 200000 and reports the cap in a reason beside the estimates",
  "Refuses iterations, naming 166666 as the most three holdings allow",
  "Refuses seed, since the draw count is read only after the seed"],
 "DEFAULTS.MAX_ITERATIONS is 200000, and a count above it is refused by name before the draw-work rule is read (iterations must be an integer from 1 to 200000 (stated; no default); got 200001). The engine caps nothing silently; 166666 is the draw-work limit for three holdings, a different rule; a stated seed passes its own check.")

# 13
x("A holding in a risk call states a fail cost of -1. What comes back?",
 "positions[0].holdings[0].failCost must be a finite number at or above 0; got -1",
 ["positions[0].holdings[0].successStdDev must be a finite number at or above 0; got nothing",
  "A result that reads -1 as a gain of 1 on failure, the sign reversed",
  "positions[0].holdings[0].failCost must be a finite number below 0; got -1"],
 "A fail cost is a cost, stated at or above 0, and the engine refuses a negative one in its own words: positions[0].holdings[0].failCost must be a finite number at or above 0; got -1. The successStdDev message answers a missing standard deviation.")

# 14
x("On risk-ekene, which holdings make up EKO's position after the farm-out?",
 "Ekene Deep 40% at 25.000000 percent (success 94500134.816723, fail cost 12000000.000000) and cash of 5208000.000000 at 100",
 ["Ekene Deep 70% at 25.000000 percent (success 157675235.929265, fail cost 28000000.000000) less the cash",
  "Ekene Deep 40% at 25.000000 percent (success 99708134.816723, fail cost 6792000.000000) alone",
  "Ekene Deep 30% at 25.000000 percent and the consideration of 10000000.000000 at 100"],
 "The golden input: Ekene Deep 40% with success value 94500134.816723 and fail cost 12000000.000000, plus the certain cash 5208000.000000 at a chance of 100 and standard deviation 0. The 70% holding is the drill-alone position; 99708134.816723 and -6792000.000000 are the deal view's payoffs, which already include the cash.")

# ===== pricing an interest (m03) =====
# 15
x("How does the engine reach the Ekene Deep 100 percent risked EMV of 26312584.260452?",
 "25.000000 percent of 225250337.041807 plus 75 percent of -40000000.000000",
 ["25.000000 percent of 271250337.041807 less the dry-hole cost of 40000000.000000",
  "25.000000 percent of 225250337.041807, the dry hole weighed at 0.000000",
  "The mean of 225250337.041807 and -40000000.000000 at even chances"],
 "The rule: the risked figure is the EMV of the 100% position, rolled back at the stated chance: success 225250337.041807, dry hole -40000000.000000, at 25.000000 percent (engine). The other paths drop the success well cost, drop the dry hole or ignore the stated chance.")

# 16
x("Scaled from 30.000000 percent to the whole licence, what does the stated Ekene price of 16000000.000000 come to in the engine's price view?",
 "53333333.333333",
 ["16000000.000000",
  "26312584.260452",
  "48000000.000000"],
 "The price per percent is 533333.333333, and scaled to the whole licence it is 53333333.333333 (engine), a ratio of stated inputs reported only. 16000000.000000 is the stated price, 26312584.260452 the computed 100 percent risked EMV, and 48000000.000000 appears in no price output.")

# 17
x("A prospect whose risked EMV at 100 percent is -30000000.000000 (interest-negative-emv) is priced per percent. What success-case figure sits beside the negative risked one?",
 "1600000.000000 a percent, reported beside the risked figure on every call",
 ["None, since the engine prints no success-case figure when the risked one is at or below 0",
  "-300000.000000 a percent, since the two bases share one EMV rollback",
  "40000.000000 a percent, the stated price per percent on that basis"],
 "Both per-percent figures are computed on every call: risked -300000.000000 and success case 1600000.000000 (engine). The success case is the success-case value less the success well cost, over 100, with no chance weighting. 40000.000000 is the stated price per percent, and the missing figure on this call is the price-to-value ratio alone.")

# 18
x("interest-production-metric states a price of 18000000.000000 for 20.000000 percent with 1000.000000 boe/d net to the working interest. What price per flowing unit and ratio does the engine print?",
 "18000.000000 per boe/d, and 1.125000 times the success-case value per percent",
 ["800000.000000 per boe/d, the value per percent over the stated rate of flow",
  "18000.000000 per boe/d, and 2.026914 times the risked value per percent of the field",
  "900000.000000 per boe/d, the price per percent over the stated rate net to the interest"],
 "The engine divides the price by the rate net to the working interest: 18000000.000000 over 1000.000000 is 18000.000000, and 900000.000000 a percent over 800000.000000 is 1.125000 (engine). 2.026914 is the Ekene risked ratio; 900000.000000 is the price per percent and 800000.000000 the value per percent on either basis, neither of them per flowing unit.")

# 19
x("A price call states reserves with a category and volume but leaves the volume unit out. Which message does the engine give?",
 "transaction.volumeUnit must be a non-empty string; got nothing",
 ["transaction.volumeUnit must be left out when no reserves are stated; got \"boe\"",
  "transaction.reserves must have at most 10 entries; got 11",
  "transaction.price must be a finite number above 0; got nothing"],
 "Here the category and volume arrive and the unit is missing, and the engine names the unit field: transaction.volumeUnit must be a non-empty string; got nothing. The reverse case gets its own left-out message; eleven reserve categories break the cap of 10; and no price message of that shape exists.")

# 20
x("The same Ekene price reads 2.026914 on the risked basis and 0.236774 on the success-case basis. What follows for a report?",
 "It names the basis with the ratio, since a reader not told it cannot tell which is meant",
 ["It quotes the risked ratio, since the success-case figure assumes the risk away",
  "It quotes the average of the two ratios as a single figure for the price of the working interest",
  "It quotes the lower ratio, the safer figure for a buyer to rely on"],
 "The course: a reader who is not told the basis cannot tell which one they are reading, and a report that quotes a value per percent or a ratio names its basis every time. The engine prints both per-percent figures; neither is the correct one in general, and the average is no engine figure.")

# 21
x("HMRC's manual says the consideration for the disposal of an interest in a producing field is generally in the form of cash or shares (HMRC Oil Taxation Manual OT30023). What does the engine do with a consideration paid in shares?",
 "Nothing: it values no shares, so a ratio would need their value from outside",
 ["Counts the shares at their stated price in the value of the transaction",
  "It prices the shares per percent of working interest on the risked basis",
  "It treats the shares as cash consideration, as OT30081 does for a reimbursement"],
 "The course: a consideration in shares, or in a royalty or net profit interest, would need its own value before any ratio could be taken, and the engine values none of those. OT30081 treats a reimbursement of earlier costs as cash consideration, which says nothing about shares.")

# ===== carries and back-ins (m04) =====
# 22
x("In 2033 the compound Ekene ledger opens at 120366976.000000. At 8.000000 percent a year, what is added before any recovery?",
 "9629358.080000, which the reason prints to the cent as 9629358.08",
 ["9516800.000000, the simple ledger's figure for the same year",
  "12619776.000000, the figure charged on the 2032 opening balance",
  "129996334.080000, the balance due once the year's addition is in"],
 "8 percent of 120366976.000000 is 9629358.080000 (engine), and the course reasons with that field. 9516800.000000 is the simple ledger's 2033 line on its own principal; 12619776.000000 belongs to 2032; 129996334.080000 is the 2033 balance due, opening plus uplift.")

# 23
x("Over the life of the compound Ekene development carry, what does the engine recover in all?",
 "190353141.996585: the carried cost 144000000.000000 plus uplift 46353141.996585",
 ["144000000.000000 plus the simple uplift of 44438966.681600, recovered by 2036",
  "144000000.000000: the carried cost alone, the uplift written off in 2036",
  "100000000.000000: the recovery up to the stated cap, 44000000.000000 written off"],
 "devcarry-ekene recovers 190353141.996585 by 2036, with nothing written off (engine). the simple uplift of 44438966.681600 belongs to the other ledger; 100000000.000000 with 44000000.000000 written off is devcarry-ekene-none-capped, a different stated carry with no uplift and a cap.")

# 24
x("The Ekene simple carry is restated with dayBasis \"actual/365\" (a stated probe). What uplift does the engine add in 2032, and why does it differ from 11520000.000000?",
 "11551561.643836, since 2032 has 366 days counted over 365",
 ["11520000.000000, since actual/365 and annual-period agree in every year",
  "11551561.643836, since actual/365 compounds the accrued simple interest",
  "12619776.000000, since actual/365 charges the uplift on the whole opening balance of the year"],
 "Under actual/365 each ledger year counts its calendar days over 365; 2032 has 366, so the uplift on the principal of 144000000.000000 is 11551561.643836 against 11520000.000000 under annual-period (engine). The day basis compounds nothing; 12619776.000000 is the compound ledger's 2032 uplift, a different carry.")

# 25
x("On backin-ekene EKO backs in from 40.000000 to 45.000000 percent. What refund does PA receive, and why that amount?",
 "12000000.000000, in proportion to the 2.500000 points it cedes",
 ["24000000.000000, the whole refund, since PA is the larger other party",
  "A share of the 24000000.000000 in proportion to its 30.000000 percent participating interest before the back-in",
  "0.000000, since a back-in refund is paid to the Government alone"],
 "The refund of 24000000.000000 is received in proportion to the interest given up; PA and FIN each cede 2.500000 points, so each receives 12000000.000000 (engine). A refund split by the pre-back-in interests is not the rule, and the contract basis names no Government.")

# 26
x("On backin-ekene-pia the refund of 144000000.000000 is recovered from future entitlement. In which year is it recovered, and what is carried into that year?",
 "2034, with 24000000.000000 carried after 120000000.000000 is recovered in 2033",
 ["2033, with the whole 144000000.000000 recovered from the year's available share",
  "2036, as on the Ekene development carry, whose ledger the back-in joins",
  "2034, with 120000000.000000 carried after 24000000.000000 is recovered in 2033"],
 "The reasons: 2033: 120000000 recovered of 144000000 due; 24000000 carried to 2034; and in 2034 the balance 24000000 is recovered (engine). The back-in keeps its own ledger, separate from the development carry, and the available share of 120000000.000000 caps 2033.")

# 27
x("On devcarry-ekene, with a discount rate of 0.100000 to 2027, what NPV does the engine return for EKO?",
 "115507461.937032",
 ["81375101.112542",
  "74367773.992233",
  "271250337.041807"],
 "The development carry ledger feeds each party's cash flow, and at 0.100000 to 2027 the engine returns EKO 115507461.937032, PA 81375101.112542 and FIN 74367773.992233 (engine). 271250337.041807 is the success-case value at 100 percent in the deal view.")

# 28
x("A back-in is stated for NOC, a party that holds no participating interest in the Ekene licence after the farm-in. How does backInRight answer?",
 "backIn.party must be one of \"EKO\", \"PA\", \"FIN\"; got \"NOC\"",
 ["backIn.targetPct must be above the back-in party's current interest 0; got 45",
  "A back-in in which NOC takes its target from the three parties in proportion",
  "farminee.id must be an id no licence party has (EKO, PA); got \"NOC\""],
 "The back-in party must be one of the parties after the farm-in, and the engine names them in its own words: backIn.party must be one of \"EKO\", \"PA\", \"FIN\"; got \"NOC\". It computes no back-in for an outsider; the target check applies only to a named party, and the farminee.id message belongs to earningObligation.")

# ===== readings and source quirks (m05) =====
# 29
x("On fee-day-121 the payment comes 121 days after the notification. What does the engine charge?",
 "1 surcharge day, 39.200000, a total paid of 392039.200000",
 ["No surcharge, since day 121 is the last day of the further 30 days",
  "31 surcharge days, counted from the end of the first 90 days",
  "1 surcharge day, 39.200000 on top of the value of the transaction"],
 "Day 121 is the first day after the 90 + 30 days: 0.01% of 392000 x 1 day = 39.2, a total paid of 392039.200000 (engine). Day 120 is the last grace day; the surcharge runs only after the grace and is charged on the fee alone.")

# 30
x("On fee-day-211, what does consentFee return?",
 "A result: status consent-deemed-withdrawn and no total paid",
 ["A refusal naming payment.paidOn, since the date is past day 210",
  "A result: 91 surcharge days at 39.200000 each, added to the fee",
  "A refusal naming basis, since a withdrawn consent leaves nothing to charge"],
 "The reason: paid 211 days after the notification: more than 90 surcharge days after the 90 + 30 days; the consent is deemed withdrawn (reg. 19(9)). A consent deemed withdrawn is a result returned with a reason; no field is refused, and the surcharge stops at 90 days.")

# 31
x("Reg. 19(6) says consent is not granted until the application and processing fees are paid in full, while reg. 19(7) gives 90 days from the notification of the grant. How does the engine handle the two?",
 "It applies the timing of reg. 19(7) to (9) to the whole seven per cent and computes no application fee",
 ["It charges the processing fee before consent and the premium within 90 days of the grant",
  "It refuses any payment date, since the two provisions cannot both apply",
  "It applies reg. 19(6) alone and treats any later payment as a withdrawal"],
 "The digest: the engine applies the timing of reg. 19(7) to (9) to the whole seven per cent and computes no application fee (reg. 19(1) leaves it to other regulations). The texts print both provisions, and the course shows the quirk as they print it.")

# 32
x("HMRC's manual separates a farm in, assigned before the work, from an earn-in, where the work is completed before the assignment (OT30021). Which engine terms answer those two orders?",
 "The vesting rules per-event and all-events",
 ["The overrun rules post-deal-interests and farmor-side",
  "The value bases risked and success-case",
  "The uplift types simple and compound"],
 "The engine's two vesting rules are those two orders: each completed event vests its stated interest (a farm in: assignment with the work, HMRC OT30021), and nothing vests until every event is completed (an earn in: the work before the assignment, HMRC OT30021). The overrun rules, value bases and uplift types answer other questions.")

# 33
x("Run as a deal on deal-psu-eme801, the Penn State problem gives the incoming party a break-even share and a break-even chance. Which does the page itself print?",
 "Neither; the engine finds 98.000000 percent of the well and 35.714286 percent",
 ["Both, 98.000000 and 35.714286, beside its EMVs of 12500.000000 and 17500.000000",
  "The break-even chance alone, 35.000000 percent, the producer chance it states",
  "The break-even share alone, 93.333333 percent, the interest it assigns"],
 "The page prints its payoffs, chances and the EMVs 12500.000000 and 17500.000000; the engine finds the incoming party breaks even paying 98.000000 percent of the well for 93.333333 percent and at a chance of 35.714286 percent, and the page prints neither figure. 93.333333 is the golden input's earned share, since the page states no interest.")

# 34
x("On earn-cap-gross-exactly the gross cost of 40000000.000000 equals the gross-cost cap. What does the engine return?",
 "Cap state exactly, excess 0.000000, the promote on all of the cost",
 ["Cap state exceeded, since a cost at the cap is treated as over it",
  "Cap state below, with the overrun rule applied to 0.000000 of excess",
  "A refusal of cap.amount, since a cap must lie above the gross cost"],
 "The boundary table: a gross cost equal to the cap is its own state, exactly, with excess 0.000000 and the promote on all of it, splitting the cost as a cap not reached would. Each rule has its own boundary, and the engine refuses no cap equal to the cost.")

# 35
x("Where in the Petroleum Industry Act 2021 does the definition of a farm-out sit, and what does the engine take from that?",
 "In s.94(8), the marginal field section; the engine's arithmetic applies to any farm-out a caller states",
 ["In s.95(14), the change of control provision; the engine applies it only above 50 percent",
  "In s.233(10), the decommissioning provision; the engine applies it to every farm-out",
  "In s.94(8), the marginal field section; the engine refuses a farm-out outside a marginal field"],
 "Section 94(8) opens For the purpose of this section, and s.94 is the marginal field section; the Act uses the word again in s.233(10) and the tax sections without a second definition. The engine's arithmetic applies to any farm-out a caller states, and it refuses nothing by field type.")

# ===== what the engine does not compute (m06) =====
# 36
x("A PEL assignment is priced on fee-pel-stated under basis stated, with 1.500000 percent processing and 0.000000 percent premium on 1000000.000000. What does the engine return?",
 "A fee of 15000.000000 at the stated rates, which are no gazetted figure",
 ["A refusal, since a PEL is refused under every fee basis the engine accepts, stated or gazetted",
  "A fee at the gazetted seven per cent on 1000000.000000, the stated rates set aside",
  "A fee at the intra group two per cent on the same 1000000.000000 value of the transaction"],
 "Reg. 19(2) sets the fee for the Minister's consent, and a PEL's consent is the Commission's, so the engine refuses a PEL under basis nuprc-2024-r19 and prices it under basis stated at the rates the caller gives: 15000.000000 (engine). The Commission's own PEL fee is not computed.")

# 37
x("A risk call puts 51 holdings in one position. Which message does the engine return?",
 "positions[0].holdings must have at most 50 entries; got 51",
 ["positions must have at most 10 entries; got 51",
  "iterations must be at most 166666 for 51 holdings in all; got 20000",
  "A result that draws the first 50 holdings and reports the rest"],
 "DEFAULTS.MAX_HOLDINGS is 50 in one position, and the engine names the cap and the count: positions[0].holdings must have at most 50 entries; got 51. It drops no holding; the positions cap is 10 positions, and the draw-work message is invented for this call.")

# 38
x("A call to earningObligation carries the key carryCap, which the function does not read. What does the engine do with it?",
 "Refuses it: carryCap is not an accepted key, with the accepted keys at the top level listed",
 ["Reads it as the cap of the first event, since the name says what it means",
  "Ignores it and returns the obligation without a cap on any event",
  "Refuses the first event's cap, since a cap may be stated only once"],
 "The engine's words: carryCap is not an accepted key; the accepted keys at the top level are parties, farmor, farminee, events, vesting, eventsCompleted, cashBonus, pastCosts. A key a function does not read is refused at whatever level it sits; it never silently drops a term or guesses at one.")

# 39
x("The farm-out report names every figure with its terms. What does it name about the readings?",
 "Each reading the figures rest on",
 ["Only the readings that the law prescribes",
  "None, since no graded figure rests on one",
  "The reading of the reader's own choosing"],
 "The report's list ends with each reading the figures rest on, and a report quoting a figure names the reading it rests on. No reading is prescribed by the texts: each is the engine's stated choice where a text leaves one open. That no capstone field depends on one does not excuse a report.")

# 40
x("At the break-even promote exactly (deal-promote-exactly-break-even), FIN's EMV is 0.000000. What does the engine report about the farminee's best action?",
 "A tie, with farm in and decline both named",
 ["Decline, since an EMV of 0 is no gain to FIN",
  "Farm in, since an EMV of 0 is no loss to FIN",
  "A refusal of the share asked, 50 percent of it"],
 "The convention: ties are reported, every tied action named (engines/economics/decisionTree.js). At the break-even share the engine reports a tie between farm in and decline, and the farmor's two actions tie as well. It breaks no tie and refuses nothing.")

# 41
x("The Ekene well costs 46000000.000000 on a success. What does the engine compute for that cost discounted to the date it is spent?",
 "Nothing: every cost sits at the valuation date, undiscounted",
 ["A present value at 0.100000 to 2027, by the canonical npv",
  "Discounted at the rate of the success-case cash flows",
  "Its present value at a rate the call states for the well costs alone"],
 "The list of what is not computed includes well costs discounted to their own dates; in their place the engine puts every cost at the valuation date, undiscounted, the reading it states. The call has no rate for costs, and the canonical npv values only the success-case cash flows.")

# 42
x("What does every graded number of this course have in common?",
 "Each is a return value of the engine on fixed inputs",
 ["Each is quoted in the digest beside its own capstone",
  "Each is a seeded draw that repeats the same on any machine",
  "Each rests on one of the four stated readings"],
 "The course: every graded number is a return value of this engine on fixed inputs; the capstones run their own synthetic deals, which the digest never prints; no graded figure is a Monte Carlo draw; and none depends on a reading.")

emit(Q, '/root/cat-wip-farmout/banks/ec10a_exam.json', expect_n=42)
finish()
