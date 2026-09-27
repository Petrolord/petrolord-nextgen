import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Expert m04, Carries and Back-ins After the Farm-in. Every key rests on
# the engine's developmentCarry or backInRight return on a golden input
# (devcarry-ekene, devcarry-ekene-simple-ot18360, devcarry-ekene-none-capped,
# devcarry-recovered-exactly, backin-ekene, backin-ekene-pia, the refusals) or
# on a line the digest prints. Simple against compound is keyed on the
# printed ledgers; the interest-first order of a simple uplift is keyed only as
# the engine's stated reading. scratch/bank-advanced/witness.mjs recomputes
# each figure. The Ekene Deep prospect and every party are synthetic.

K = [0, 2, 1, 3, 3, 0, 2, 1, 0, 3, 1, 2, 0, 3, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("After the Ekene farm-in EKO holds a 40.000000 percent participating interest, and FIN carries 50.000000 percent of EKO's cost share. What carried interest does the engine report?",
 "20.000000 points, half of EKO's 40.000000 percent",
 ["50.000000 points, the stated carriedPct itself",
  "30.000000 points, FIN's own vested interest after the farm-in",
  "35.000000 points, the whole interest earned across both wells"],
 "The engine reports a carried interest of 20.000000 points (engine): the carried share of the farmor's cost share, 50.000000 percent of 40.000000. carriedPct is the stated share of the cost share, FIN's 30.000000 percent is its own vested interest, and 35.000000 belongs to the drill-to-earn case, a different deal.")

# 2
x("The Ekene development spends 240000000 gross in 2029. Using the engine's rule, how much of it is carried for EKO that year?",
 "48000000.000000, cost x 40 x 50 / 10,000",
 ["144000000.000000, the carried cost of all three years",
  "120000000.000000, the half of the cost FIN pays in all",
  "72000000.000000, the gross cost times PA's 30 percent"],
 "The engine's rule: carried cost = cost x participating interest x carriedPct / 10,000. 240000000 x 40 x 50 / 10,000 = 48000000.000000, the 2029 carried cost added (engine). 144000000.000000 is the carried cost of 2029 to 2031 together; FIN pays 120000000 in 2029 in all, its own share plus the carry; PA pays its own 72000000.")

# 3
x("Under the compound uplift of 8.000000 percent a year, what does the engine add in 2031 on the Ekene development carry, and on what?",
 "9907200.000000, on the whole opening balance of 123840000.000000",
 ["9600000.000000, on the outstanding principal of 120000000.000000",
  "11520000.000000, on the principal of 144000000.000000 after the 2031 cost",
  "12619776.000000, on the 2032 opening balance"],
 "The compound basis: 8% a year on the opening balance, compounded yearly; a year's new cost earns none in its own year. 2031 opens at 123840000.000000, which carries the 2030 uplift, so it adds 9907200.000000 (engine). 9600000.000000 is the simple uplift of 2031 on principal alone; 11520000.000000 and 12619776.000000 are the 2032 simple and compound uplifts.")

# 4
x("At the same 8.000000 percent a year, how do the simple and the compound uplift compare over the life of the Ekene development carry?",
 "Simple adds 44438966.681600 and compound 46353141.996585; both recover in 2036",
 ["Both add 46353141.996585 and recover in 2036 alike",
  "Simple adds 46353141.996585 and compound 44438966.681600, compounding lagging a year",
  "Simple adds 44438966.681600 and recovers in 2035, a year before the compound ledger"],
 "The two printed ledgers (engine): the simple form adds 44438966.681600 in all, the compound form 46353141.996585, and both recover the carry in 2036. Compound charges the uplift on the whole opening balance, which carries earlier uplift, so it adds more; simple charges the principal alone.")

# 5
x("In 2036 the compound Ekene carry is due 7633141.996585 and 34073600.000000 is available. What does the engine record for the year?",
 "7633141.996585 recovered, closing 0.000000, and EKO receives 60514058.003415",
 ["34073600.000000 recovered, the full available share, and EKO receives 34073600.000000",
  "7633141.996585 recovered and EKO receives 34073600.000000, the available half only",
  "68147200.000000 recovered, EKO's whole share of the entitlement that year"],
 "Recovered = min(available, due, cap left): 7633141.996585 closes the balance. EKO receives its share of the entitlement less the recovery, 68147200.000000 - 7633141.996585 = 60514058.003415 (engine); the available half caps the recovery and does not limit what EKO keeps.")

# 6
x("What does available for recovery mean on the Ekene carry ledger in 2032, when EKO's share of the entitlement is 100000000.000000?",
 "50000000.000000, the stated 50.000000 percent of EKO's share that the carry may take",
 ["100000000.000000, EKO's whole share, since the balance due is larger than it",
  "170366976.000000, the balance due, which the engine recovers in full once production starts",
  "30000000.000000, FIN's 30.000000 percent of EKO's share of the entitlement"],
 "The rule: recovered = min(carried party's entitlement share x recoverFromPct / 100, due, cap left). With recoverFromPct 50.000000, 50000000.000000 of the 100000000.000000 is available, and all of it is recovered against 170366976.000000 due (engine).")

# 7
x("On devcarry-ekene-simple-ot18360, how does the engine split the 50000000.000000 recovered in 2032?",
 "24960000.000000 of accrued simple interest first, then 25040000.000000 of principal, as the engine's stated reading",
 ["25040000.000000 of principal first, then 24960000.000000 of accrued simple interest, as HMRC's manual prescribes",
  "50000000.000000 of principal, leaving 24960000.000000 of accrued simple interest to earn an uplift of its own",
  "An even split of the 50000000.000000, since HMRC's manual names no order of payment"],
 "The engine's reason: the 50000000 recovered pays the accrued interest 24960000 first, then 25040000 of principal. HMRC's manual says only that the recovery usually includes an addition representing simple interest and does not say which is paid first, so the order is a reading the engine states. Under its rule accrued simple interest earns none.")

# 8
x("devcarry-ekene-none-capped states no uplift and a cap of 100000000.000000 on the carry recovery. What does the engine return?",
 "100000000.000000 recovered and 44000000.000000 written off",
 ["144000000.000000 recovered, the whole carried cost, the cap covering an uplift only",
  "100000000.000000 recovered and 44000000.000000 carried forward past 2045",
  "A refusal of cap, since a cap below the carried cost would leave it unrecovered"],
 "The reason: 2033: the stated cap 100000000 is reached with 50000000 recovered this year; the rest, 44000000, is written off. The cap binds the recovery itself, the rest is written off with nothing carried forward, and a cap below the carried cost is a stated term the engine accepts.")

# 9
x("On devcarry-recovered-exactly the balance due in 2031 is 400.000000 and 400.000000 is available. Which reason does the engine give?",
 "the balance 400 is recovered exactly by the 400 available; the carried party receives 0 of its share 400",
 ["the balance 400 is recovered with 400 of the 400 available; 0 is carried to the next year",
  "400 recovered of 400 due; 0 carried to 2032, and the carry stays open for a further year",
  "the stated cap 400 is reached with 400 recovered this year; the rest, 0, is written off"],
 "The engine names the boundary in words: the balance 400 is recovered exactly by the 400 available; the carried party receives 0 of its share 400. The carry closes that year at 0.000000; the other lines are the shapes of an ordinary recovery, a year still open and a cap, none of which applies.")

# 10
x("A developmentCarry call states earnedPct 70 on the Ekene licence, where EKO holds 70 percent. What comes back?",
 "earnedPct must be below the farmor's interest 70 (the farmor keeps a carried interest); got 70",
 ["earnedPct must be at most the farmor's interest 70; got 80",
  "carriedPct must be a number above 0 and at most 100; got 0",
  "A ledger with a carried interest of 0.000000 points, nothing to recover, and EKO paying none of its development costs"],
 "A development carry needs a farmor that keeps a carried interest, so earning its whole 70 is refused in the engine's own words: earnedPct must be below the farmor's interest 70 (the farmor keeps a carried interest); got 70. The at-most-70 message is backInRight's refusal of 80; the carriedPct message answers a carry of 0.")

# 11
x("A developmentCarry call leaves the uplift out. Which message is the engine's?",
 "uplift must be an object { type } with type \"none\", \"simple\", \"compound\" or \"multiple\" (no default); got nothing",
 ["uplift must be an object { type, ratePct } with type \"simple\" when HMRC OT18360 applies; got nothing",
  "recoverFromPct must be a number above 0 and at most 100; got nothing",
  "A ledger with no uplift, since the cost alone is recovered when none is stated"],
 "The uplift is a required input with no default; the engine names the four forms it accepts, in its own words: uplift must be an object { type } with type \"none\", \"simple\", \"compound\" or \"multiple\" (no default); got nothing. HMRC's usual simple interest is described in the engine's note and imposed on no call; the recoverFromPct message answers a missing recovery share.")

# 12
x("On backin-ekene EKO backs in from 40.000000 to 45.000000 percent under the contract basis, with 480000000.000000 of refundable costs. What refund does EKO pay?",
 "24000000.000000, 5 percent of the refundable costs",
 ["46000000.000000, the exploration well the contract basis excludes",
  "12000000.000000, the part PA receives for the 2.500000 points it cedes",
  "144000000.000000, 30 percent of the refundable costs"],
 "The rule: refund = (target - current) / 100 x refundable costs: 5 percent of 480000000.000000 is 24000000.000000 (engine). The 46000000.000000 exploration well is excluded and is no refund; 12000000.000000 is one party's half of the refund; 144000000.000000 is the refund of PA's back-in from 30 to 60 on backin-ekene-pia.")

# 13
x("After EKO backs in to 45.000000 percent on backin-ekene, what participating interest does PA hold?",
 "27.500000 percent, its 30.000000 x 55 / 60",
 ["30.000000 percent, since the back-in party takes its gain from FIN alone",
  "25.000000 percent, since PA cedes the whole 5 points of EKO's gain",
  "22.857143 percent, the interest EKO keeps on the PIA back-in"],
 "The rule: new interest of another party = old x (100 - target) / (100 - current); the reason says the others keep 55 / 60 of their interests. PA's 30.000000 becomes 27.500000 and FIN's likewise, each ceding 2.500000 (engine). 22.857143 is EKO's interest after PA's back-in on backin-ekene-pia.")

# 14
x("Under basis pia-s85-4, why does the engine exclude the 46000000.000000 Ekene Deep-1 exploration well from the refundable costs?",
 "PIA s.85(4)(c) allows development and production costs only, and exploration is neither",
 ["The well was a dry hole, and the Act refunds only the cost of wells that found oil and were tested and suspended",
  "The contract basis lists exploration as refundable and the Act basis removes the list",
  "The exploration well was paid by FIN under the farm-in, so no party can claim it"],
 "The engine's reason: Ekene Deep-1 exploration well: 46000000 (exploration) is not refundable (PIA s.85(4)(c): development and production costs only, no bonuses, penalties, interest, premium or markups). The Ekene well cost 46000000.000000 as a success, and on backin-ekene the contract basis excludes it too.")

# 15
x("A backInRight call names EKO with a target of 35 percent while EKO holds 40 after the farm-in. What does the engine return?",
 "backIn.targetPct must be above the back-in party's current interest 40; got 35",
 ["backIn.party must be one of \"EKO\", \"PA\", \"FIN\"; got \"NOC\"",
  "A back-out in which EKO cedes 5 points to PA and FIN in proportion to their participating interests",
  "earnedPct must be at most the farmor's interest 70; got 80"],
 "A back-in raises the back-in party's participating interest, so a target at or below the current one is refused in the engine's own words: backIn.targetPct must be above the back-in party's current interest 40; got 35. The party message answers NOC, the earnedPct message answers 80, and the engine computes no back-out.")

emit(Q, '/root/cat-wip-farmout/banks/ec10a_m04.json', expect_n=15)
finish()
