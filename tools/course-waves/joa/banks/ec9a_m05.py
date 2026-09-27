import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Expert m05, What the Engine Does Not Compute. Every concept-only item
# (the compensation on an assignment, cover in kind, interest on cash
# balances, the expert determination, the haircut, a sliding scale of profit
# shares, sole risk development, indexation, the NNPC joint venture cash call
# debts) is keyed only as "not computed", with the engine's own basis where it
# says so. Figures rest on default-ekene-uncured, backin-ekene-pia,
# psc-fari-table-12 and the refusals, recomputed by
# scratch/bank-advanced/witness.mjs. No capstone figure appears here.

K = [1, 0, 3, 2, 0, 3, 1, 2, 3, 0, 2, 1, 0, 3, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("On default-ekene-uncured PB's default is still open past the forfeiture trigger of 2027-06-10. What does the engine report about an assignment of PB's interest?",
 "The interests after it, EKO 47.058824, PA 29.411765, NOC 23.529412, and that the compensation is not computed",
 ["Nothing beyond a note that the default is open, since an assignment has to be agreed first",
  "A compensation of 0.000000, since the Kenya model vests a forfeited share with no payment at all to the defaulter",
  "The book value less PB's unpaid contributions, which it computes as the ceiling Art. 9.3 sets on payment"],
 "The engine's reason ends: \"if the assignment of PB is demanded, the interest is apportioned pro rata: EKO 47.05882352941177%, PA 29.41176470588235%, NOC 23.529411764705884%; the compensation (at most the book value less unpaid contributions) is not computed\". It computes no book value and no payment under either text.")

# 2
x("Norway JOA Art. 9.3 lets the compensation on an assignment be agreed up to the book value of the party's share of the investment; Kenya Model PSC 2015 Art. 6.10 vests a forfeited share without payment of compensation. Where does the engine's work stop under either text?",
 "At the interests after the forfeiture; the money that changes hands is not computed",
 ["At the Norwegian ceiling, which it computes from the stated costs of the joint account",
  "At the Kenya rule, which it applies to every call as the only rule a model prints",
  "At the notice of default, since a forfeiture is agreed between the parties in full"],
 "The engine reports forfeiture as available with the pro rata interests, and its basis says the compensation on an assignment is reported only. It computes no ceiling, applies neither text's payment rule, and does report the interests after the forfeiture, so its work runs past the notice.")

# 3
x("Norway JOA Art. 9.1 also contemplates covering a default by acquiring the defaulting party's share of petroleum. What does the engine do?",
 "It covers in cash, pro rata, and reports cover in kind only: that option is not computed",
 ["It takes PB's share of petroleum at the stated price until the whole unpaid amount is covered",
  "It offers both covers and returns the one with the smaller default interest to report",
  "Nothing at all: a default with no stated kind of cover is left uncovered"],
 "The engine's basis says the cover by acquiring the defaulting party's share of petroleum, and the compensation on an assignment, are reported only. It advances PB's unpaid 2000000.000000 in cash, EKO 1230769.230769 and PA 769230.769231, and it neither prices petroleum nor asks for a kind of cover.")

# 4
x("The cash call ledger on cc-ekene-2027 closes with EKO holding a balance with the operator of -48000.000000. Norway Accounting Agreement Art. 1.2.3 deals with interest on cash the operator holds. What does the engine compute on that balance?",
 "Nothing: interest on cash balances held by the operator is not computed",
 ["Default interest at the stated rate, as the balance is an amount EKO owes",
  "Interest at a reference rate plus three points, as Art. 1.2.2 prints it",
  "A credit carried to the next call with interest for each month it is held"],
 "The course's list of what the engine does not compute includes interest on cash balances held by the operator (Norway Accounting Agreement Art. 1.2.3), and the engine does nothing in its place. Default interest belongs to a defaulted cash call, and the ledger carries balances with no interest on them.")

# 5
x("PIA s.85(4)(e) settles \"the nature, the validity and quantum of the unrecovered costs to be refunded\" by an agreed expert determination procedure. How does the engine's back-in treat that?",
 "The determination is not computed: the unrecovered cost figures are stated inputs",
 ["A reproduction of the procedure, excluding any cost line the parties dispute",
  "It verifies each cost line against the Act's refundable kinds and prices it at a stated rate",
  "It applies the minimum 55% haircut of s.311 to every cost line first"],
 "The engine's back-in basis says it leaves out the expert determination of the unrecovered costs (s.85(4)(e)); the unrecovered cost figures are stated inputs. It sorts stated lines by kind under s.85(4)(c) and prices none; the haircut belongs to a renegotiated PSC under s.311 and is not computed either.")

# 6
x("PIA s.311(2)(a)(iii) says a renegotiated production sharing contract \"shall feature a cost oil limit of not more than 60% of the total oil production, a minimum of 55% haircut on disputed amount\". What does the engine compute of the haircut?",
 "Nothing: the haircut is not computed, and the opening pool a call states is taken as given",
 ["55% of the opening pool, removed before the first year's cost recovery under the PSC",
  "The disputed amount, which it reads from the cost lines the call marks as disputed",
  "A haircut on any year whose cost recovered exceeds 60% of the total oil production"],
 "The course lists the haircut on disputed amounts (PIA s.311(2)(a)(iii)) among what the engine does not compute, and the engine does nothing in its place. The pool is a required input, `openingCostPool`, and no call marks a cost as disputed; the 60 percent ceiling in the same sentence is reported in the basis only.")

# 7
x("psc-fari-table-12 states a cost oil ceiling of 80.000000 percent of revenue after royalty. What does the engine do with the Act's 60 percent ceiling for a renegotiated PSC?",
 "Reports it in its basis only and applies the contract's stated 80.000000",
 ["Refuses the call, as 80.000000 exceeds the ceiling the Act allows a renegotiated PSC",
  "Caps the ceiling at 60.000000 in every year and notes in a reason the change it made",
  "Applies 60.000000 to the first two years, while the pool of 250 is carried forward, and 80.000000 after"],
 "The engine's basis reads: PIA s.311(2)(a)(iii): a renegotiated production sharing contract features a cost oil limit of not more than 60% of the total oil production; the limit here is the contract's stated figure. `PIA_JV.renegotiatedPscCostOilLimitPct` of 60.000000 is reported in the basis only, and the IMF case reproduces its ceilings on the stated 80.000000.")

# 8
x("On psc-fari-table-12 the call states a contractor share of 60 for 2003, 56 for 2004 and 42 for 2005. What sets those shares?",
 "The call states each year's share, read from Table 13; the daily-rate scale is worked outside the engine",
 ["The engine's own DROP scale of IMF FARI Table 11, which it computes from each year's stated daily rate of production",
  "An R-factor the engine computes from the contractor's receipts and costs of the earlier years",
  "The contract share of 60 applied to every year, with the lower years read as a rounding of Table 13's printed shares"],
 "The engine's basis reads contractorProfitSharePct applies to every year that does not state its own (a year's own figure carries a sliding scale, e.g. by daily rate or R-factor, computed outside). A daily-rate or R-factor scale of profit shares is not computed; each year's stated share is used as given.")

# 9
x("A learner adds a contractor share of 120 to the first year of a pscCostRecovery call. What does the engine answer?",
 "It refuses by the year's own path, as a stated share must lie from 0 to 100",
 ["A capped share of 100, so that the government takes no profit oil at all in that year",
  "It reads 120 as a sliding scale result and accepts it, since the scale is worked outside",
  "It refuses naming contractorProfitSharePct at the top level, as the year cannot hold one"],
 "The engine checks that a stated share is a percentage and refuses by the year's path: years[0].contractorProfitSharePct must be a number from 0 to 100; got 120. It never trims a stated figure, and a year may state its own share, which is how a scale worked outside reaches the engine.")

# 10
x("A learner adds a date to the `operation` block of the Ekene-4 sidetrack call, to model a later sole risk development under Norway JOA Art. 19. What does the engine answer?",
 "A refusal of the unknown key operation.date, listing name and cost as its accepted keys",
 ["Premium recovery that starts its ledger in the year of the stated date",
  "A bar on later entry, computed from the date under the terms of Art. 19",
  "A buy-in payment indexed from the stated date to the year of the entry"],
 "The engine computes sole risk operations only: one operation, one cost and the years of its net value. Sole risk development and the bar on later entry (Norway JOA Art. 19) are not computed, and the unknown key is refused in the engine's own words: operation.date is not an accepted key; the accepted keys of operation are name, cost.")

# 11
x("Norway Accounting Agreement Art. 2.2.2 adjusts its overhead bands each year on the consumer price index as published by Statistics Norway per 15 July of the current year. What does the engine's overhead function do about that?",
 "No adjustment: the index is not computed, and each year's bands are stated inputs",
 ["Every stated band indexed from 15 July before the marginal scale is applied",
  "It holds the Norwegian bands in NOK million and indexes them afresh on every call it receives",
  "It refuses a scale whose bands are not stated with the index year printed beside each band"],
 "The course lists the consumer price index adjustment of the overhead bands among what the engine does not compute: the bands are stated inputs. The engine holds no Norwegian band, reads no index, and its overhead keys are costs, excluded and scale.")

# 12
x("The Petroleum Industry Act 2021 deals with the cash call debts of NNPC joint ventures and incorporated joint venture companies in s.54(8) and s.65. What does the engine compute for them?",
 "Nothing: the course reads them as concepts only",
 ["A cash call ledger per NNPC joint venture with its debt carried to the next call",
  "Default interest on each debt at the Act's rate from the date the debt arose",
  "A back-in refund of each debt from NNPC's future entitlement under s.85(4)(f)"],
 "The course lists the cash call debts of NNPC joint ventures and incorporated joint venture companies (PIA s.54(8) and s.65) as nothing the engine computes, concept only. The engine keeps no ledger, charges no default interest and computes no refund for them; s.85(4)(f) governs a back-in refund.")

# 13
x("Which of these does the engine compute?",
 "The back-in refund on stated cost lines, with bonuses, interest and markups excluded",
 ["The haircut of at least 55% on amounts disputed in a renegotiated PSC",
  "The expert determination of which unrecovered costs are proven",
  "The compensation owed to a party whose interest is assigned"],
 "On backin-ekene-pia the engine returns a refund of 98000000.000000 with 156000000.000000 excluded under s.85(4)(c). The haircut, the expert determination and the compensation on an assignment are each listed as not computed.")

# 14
x("On backin-ekene-pia NOC backs in from 20 to 40 percent and the engine returns refundable costs of 490000000.000000, 156000000.000000 excluded and a refund of 98000000.000000. What do those figures rest on?",
 "Stated cost lines, whose nature, validity and quantum the Act leaves to an expert determination",
 ["Cost lines the engine has verified as proven against the operator's joint account records for each year",
  "A haircut of 55% applied by the engine to the disputed part of the unrecovered costs",
  "The contract's refundable kinds, which the call states in full under basis \"pia-s85-4\" as the Act asks"],
 "The engine's basis says it leaves out the expert determination of the unrecovered costs (s.85(4)(e)); the unrecovered cost figures are stated inputs. It verifies nothing and applies no haircut, and under basis \"pia-s85-4\" the refundable kinds must be left out: the Act fixes development and production.")

# 15
x("How does the course use the Tanzania Model Production Sharing Agreement 2013 (TPDC), read from the Wayback capture of 23 May 2024?",
 "Concept only: a cost recovery limit net of royalty, a contractor loan of an unpaid amount and an overhead cap",
 ["As a quoted source of the premium multiple for a sole risk operation recovered from the declining party's production",
  "One of the three published worked examples of PSC cost recovery that the engine reproduces",
  "As the licensed model agreement behind the engine's convention on reversion inside the payout period of a premium"],
 "The sources table lists the Tanzania model for concept only: a cost recovery limit on production net of royalty, a contractor loan of an unpaid amount recovered from cost oil, an overhead cap before the development licence. The three PSC checks are the World Bank note and IMF FARI Figure 5 and Tables 12 and 13; reversion inside the period is the engine's own convention.")

emit(Q, '/root/cat-wip-joa/banks/ec9a_m05.json', expect_n=15)
finish()
