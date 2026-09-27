import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Expert m06, What the Engine Does Not Compute. Every concept-only item
# is keyed only as not computed, with where it would come from, as the
# digest's list prints it; the caps, refusal order, conventions and constants
# rest on the engine's messages and exports (DEFAULTS, NIGERIA_ASSIGNMENT,
# ACCEPTED_KEYS) as the digest prints them. scratch/bank-advanced/witness.mjs
# re-raises each quoted message through the vendored engine.

K = [3, 0, 2, 1, 0, 2, 3, 1, 2, 0, 3, 1, 3, 0, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A farm-out pays EKO a carry, a cash bonus and a reimbursement. Which of them counts in the value of the transaction on which the consent fee is charged, according to the engine?",
 "The engine does not decide; the caller states the amount and its source",
 ["All three, since the consideration is the value the Regulations charge",
  "The cash alone, the bonus and the reimbursement, 5600000.000000 on Ekene",
  "The carry alone, since reg. 19(3) names work paid for the assignor"],
 "The engine's own words: the value of the transaction is a stated input ... the engine does not decide which consideration of a farm-out counts. The Ekene fixture happens to state 5600000.000000, the bonus plus the reimbursement; a deal counting the carry would state a larger value and the engine would charge seven per cent of it. Which part counts comes from reg. 19(3) and reg. 24 and the Commission, outside the call.")

# 2
x("What does the engine do with the Commission's metrics for good and valuable consideration under reg. 19(3)(b)?",
 "Nothing beyond taking a Commission-determined amount as a stated input",
 ["It applies them to the success-case value to set a Commission-determined amount",
  "It applies them through the risked value per percent of the interest assigned",
  "It refuses a commission-determined source, since the metrics are unpublished"],
 "The digest's list: the Commission's metrics are not computed, and the engine takes a Commission-determined amount as a stated input (valueSource \"commission-determined\" is accepted). It derives no amount from any value it computes and refuses no such source.")

# 3
x("Which fee of an assignment does the engine leave uncomputed although reg. 19(6) says consent is not granted until it is paid?",
 "The application fee, which reg. 19(1) leaves to other regulations of the Commission",
 ["The processing fee, which reg. 19(2) sets at two per cent of the stated value",
  "The premium, which reg. 19(2) sets at five per cent of the stated value",
  "The surcharge, which reg. 19(9) sets at 0.01 percent of the fee a day for up to 90 days after the grace"],
 "The digest's list: the application fee, AOI 2024 reg. 19(1), set by other regulations of the Commission; the engine computes nothing for it. The processing fee, the premium and the surcharge are the gazetted figures it does apply, each cited to reg. 19(2) or 19(9).")

# 4
x("PIA s.233(10) requires a farm-out agreement to provide for a decommissioning and abandonment plan funded in whole or in part by the incoming parties. What does the engine compute for it?",
 "Nothing; it is taught as a concept only",
 ["The farminee's share, at its vested interest times the dry-hole cost",
  "A reserve in the farmor's position, at the stated assignor fees",
  "The incoming parties' share, at the stated share paid of each well"],
 "The digest's list: a decommissioning and abandonment plan funded by the incoming parties, PIA s.233(10); the engine does nothing, concept only. A deal team values a farminee's share of a future abandonment cost outside the call and states it beside the engine's figures.")

# 5
x("What does the engine report about tax on a farm-out deal?",
 "Only that the consent fee is not tax deductible; the tax on the deal is not computed",
 ["The hydrocarbon tax on the farmor's consideration, by PIA s.264(f) on the stated value",
  "Capital gains on the cash bonus at the rate HMRC's manual prints for farm-outs",
  "Companies income tax on the carry, at the rate of PIA s.302(12)(c) on the consideration"],
 "The engine's basis says the fee is not tax deductible (reg. 19(5); PIA s.95(12)) and that fees paid for assigning rights to another party are not deductible (PIA s.264(f) and s.302(12)(c)). Those sections deny a deduction and set no rate on a deal; HMRC's manual is United Kingdom guidance quoted for concepts, and the course applies none of its tax rules.")

# 6
x("A farm-out grants the farmor a net profit interest as part of its consideration. How does the engine value it?",
 "It does not; a subordinated interest is valued outside the call",
 ["As cash consideration, added to the carry, bonus and reimbursement",
  "As a carried interest, through carryRecovery of the joint venture engine",
  "As a back-in, through backIn with the net profit share as the target"],
 "The digest's list: royalty, net profit and other subordinated interests granted as consideration (HMRC OT18320 and OT30131); the engine does nothing, and a subordinated interest is valued outside. The consideration the engine counts is carry, cash bonus and reimbursement only, and its carry and back-in functions model neither.")

# 7
x("Which figure does the engine give as the market value of the 30.000000 percent Ekene working interest?",
 "None; it reports value per percent of stated figures and ratios of stated prices",
 ["16000000.000000, the price the fixture states for the interest",
  "7893775.278136, the risked value of the working interest priced",
  "53333333.333333, the stated price scaled up to 100 percent"],
 "The digest's list: a market value for an interest comes from a transaction market; the engine computes value per percent of stated figures and ratios of stated prices. 16000000.000000 is a stated input, 7893775.278136 a value on stated terms and 53333333.333333 a price ratio, and none is asserted as market value.")

# 8
x("When is a back-in triggered on the Ekene licence, according to backInRight?",
 "At a contract event the caller reports, with the target stated; the engine fixes no trigger",
 ["When the development carry is recovered, in 2036 on the compound Ekene ledger",
  "When the farminee's vested interest reaches 30.000000 percent on completion",
  "When the PIA s.85(4) basis is stated, from the first year of production after the refund falls due"],
 "The digest: a back-in's trigger is a contract event the caller reports; the engine does not decide when it happens. The carry payout year, the vesting of the farm-in and the basis named for the refund are all separate facts, and none of them fires a back-in.")

# 9
x("An assignment is made without consent, or a beneficial ownership notice is late. What does the engine compute for the administrative fines of AOI 2024 reg. 21?",
 "Nothing",
 ["The surcharge of reg. 19(9)",
  "Seven per cent of the value",
  "The premium of five per cent"],
 "The digest's list: the administrative fines for an assignment without consent or a late beneficial ownership notice, AOI 2024 reg. 21; the engine does nothing. The surcharge runs only on a late fee payment, and the seven per cent is the consent fee itself.")

# 10
x("An earningObligation call lists 21 licence parties. In the engine's words, what comes back?",
 "parties must have at most 20 entries; got 21",
 ["events must have at most 20 entries; got 21",
  "parties must have participatingPct summing to 100; got a sum of 90",
  "positions must have at most 10 entries; got 11"],
 "DEFAULTS.MAX_PARTIES is 20, and the refusal names the cap and the count it was given: parties must have at most 20 entries; got 21. The events message answers 21 events, the sum message answers interests summing to 90, and the positions cap belongs to riskSharing.")

# 11
x("A box carries an unknown key vest and lacks the vesting rule. Which refusal does the engine return first?",
 "vest is not an accepted key; the accepted keys at the top level are parties, farmor, farminee, events, vesting, eventsCompleted, cashBonus, pastCosts",
 ["vesting must be one of \"per-event\", \"all-events\"; got nothing",
  "vesting must be one of \"per-event\", \"all-events\"; got \"vest\"",
  "Both refusals in one message, the missing vesting rule listed first and then the unknown key vest with the full list of the accepted keys"],
 "Every function checks its accepted keys before it reads a term, so the unknown key is refused first, with the path and the full list of accepted keys (the digest prints this probe verbatim). A misspelt optional key is refused and never silently dropped; the engine returns one refusal at a time and never reads vest as vesting.")

# 12
x("The 2033 uplift of the Ekene development carry reads 9629358.08 in the engine's reason. Which figure should a report reason with?",
 "The field, 9629358.080000, since a reason rounds money to the cent",
 ["The reason's 9629358.08, since the reason is the engine's own words",
  "9516800.000000, the simple uplift of the same year",
  "12619776.000000, the 2032 uplift carried into the 2033 balance"],
 "The convention: money in a reason is rounded to the cent, half away from zero, trailing zeros dropped, while every numeric field keeps full precision. The course therefore quotes the field, 9629358.080000, and uses a reason only verbatim. 12619776.000000 is a different year's uplift, and 9516800.000000 is 2033 on the simple ledger, a different carry.")

# 13
x("Which statement about the engine's own code matches its declared imports?",
 "It carries no NPV, decision tree or Monte Carlo code of its own; riskSharing alone samples, through portfolio.js",
 ["It carries its own seeded Monte Carlo for riskSharing and imports the canonical npv for the success case",
  "It re-implements rollback for the break-even promote and imports evpi and evii for information",
  "It imports carryRecovery for both the farm-in split and the development carry after it"],
 "The digest: its five imports are cashflow.ts, decisionTree.js, portfolio.js, afe.js and jointVenture.js; it carries no NPV, decision tree or Monte Carlo code of its own, and the one function that samples is riskSharing, through the seeded portfolio Monte Carlo. The other parties' shares of the farm-in come from calculatePartnerCosts of afe.js.")

# 14
x("Beside its size caps and its sum tolerance, which figures does the engine hold as its own constants?",
 "Only the gazetted NIGERIA_ASSIGNMENT figures, each cited to reg. 19 or PIA s.95(14)",
 ["The Ekene deal terms of the fixture, which fill in any term a call happens to leave out",
  "A chance of success of 25 percent and a discount rate of 0.1 for every success case",
  "An uplift of 8 percent a year for any carry stated without one"],
 "The digest: every deal term is an input with no default, and a call without one is refused by name; the only figures it holds are the gazetted ones in NIGERIA_ASSIGNMENT (2 and 5 per cent, 90 and 30 days, 0.01 per cent a day for 90 days, 50 percent for a change of control). The Ekene figures are fixture terms, stated in each golden input.")

# 15
x("FIN's EMV on the Ekene deal is -1806224.721864. What does the course say such a computed figure does not say?",
 "It is no forecast of what a partner will pay and no statement of market value",
 ["It is no EMV of a named position, since the chance of success is stated by the caller",
  "It carries no weight until the survey is shot, since information may change the chance",
  "It is no figure on fixed terms, being drawn at a seed"],
 "The digest: an EMV is what the stated chance and payoffs produce; none of the computed figures is a forecast of what a partner will pay or a statement of market value, and each is quoted with its terms. It is the EMV of FIN's farm-in position, it is a return value on fixed terms, and nothing in dealValue is drawn.")

emit(Q, '/root/cat-wip-farmout/banks/ec10a_m06.json', expect_n=15)
finish()
