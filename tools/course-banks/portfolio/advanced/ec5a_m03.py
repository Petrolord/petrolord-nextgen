import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, advanced tier, Joint Venture Shares. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(3,
 "On OFON-1, Ofon Energy's working interest of 40.0000 percent gives a share of 10820000 USD. What is that figure?",
 "Its share of the budget of 27050000, an authorisation, which is not what Ofon Energy owes today.",
 ["Its share of the actuals to date, the amount the AFE bills Ofon Energy for the work invoiced so far.",
  "Its share of the EAC of 27600000, the partner's forecast final exposure once every line is complete.",
  "Its share of the well's value, the part of the project's worth that the working interest entitles it to."],
 "27050000 x 40.0000 / 100 = 10820000. Split across the actuals to date of 15090000 the same interest bills 6036000; the interest does not change, only the total does.")

q(1,
 "Can Ofon Energy be given a larger share of OFON-1's completion line CMP-05 than of the drilling line DRL-01?",
 "No: the engine is handed one total and one list of interests, so the 40.0000 percent applies to every line and no line is split on its own.",
 ["Yes, by entering a forecast on CMP-05 as CMT-03 carries one, since the split reads each line's entered forecast before the total.",
  "Yes, through the commitments column, since each line's commitment is split by its own interest when orders are placed.",
  "Only after payout, when the engine switches from the cost interests to the revenue interests the partners agreed for that phase."],
 "The split never looks at a forecast or a commitment. It has no carried interest, no non-consent and no change of interest before and after payout.")

q(2,
 "Where does OFON-1's operator share of 25.0000 percent come from?",
 "It is computed as 100 less the partnerTotal of 75.0000, never typed in, so the four percents add to 100 by construction.",
 ["It is typed in as the operator's interest in the agreement, and the engine checks it against the partners' total before splitting.",
  "It is the largest partner's interest less the others, 40.0000 less 22.5000 and 12.5000 plus the operator's own carried cost.",
  "It is a default the engine assigns to every operator, and partners are scaled to fill the remaining 75.0000 percent of cost."],
 "Against the budget of 27050000 the residual is 6762500 and against the actuals to date of 15090000 it is 3772500. The operator absorbs every gap and every excess in the partner list.")

q(0,
 "Suppose Mfem Resources, at 12.5000 percent, were never entered on OFON-1. What does the split report?",
 "valid true with no note, and the operator's residual silently absorbs Mfem's 12.5000 percent of every bill.",
 ["valid false with a note that the partner interests total less than the whole, so the shortfall is caught before billing.",
  "A refusal with an error, because the partner interests and the operator share must be typed to total 100 before any split.",
  "An operator share still at 25.0000, with 12.5000 percent of each bill left unallocated so the bills fall short of the cost."],
 "valid true means only that the residual and every interest are not negative. The check is outside the engine: compare the operator's residual with its own interest in the agreement, 25.0000 on OFON-1.")

q(2,
 "The published 10 percent shortfall case splits 1000.00 with one partner at 10 percent, leaving the operator 90.0000 percent or 900.00, and returns valid true. What does valid true establish?",
 "Only that no share is negative; it cannot tell an operator who really holds 90.0000 percent from a partner nobody entered.",
 ["That the split matches the joint operating agreement, since the engine compares the residual with the operator's recorded interest.",
  "That the partner list is complete, since a list summing to less than the whole would have been flagged with a note of its own.",
  "That the operator share is plausible, since the engine warns when the operator outweighs every partner."],
 "There is no field for the operator's own interest, so the engine has nothing to compare the residual against; the residual is arithmetic and the judgement belongs to the reader.")

q(3,
 "On the published case at 70 and 45 percent, the amounts 700.00, 450.00 and -150.00 add back to the cost of 1000.00. A reconciler approves the bills because the sum matches. What was missed?",
 "The split is valid false: the partners are billed for 115.00 percent of the work and the operator is shown receiving 150.00, so valid and the note must be read before any amount.",
 ["Nothing, because a split whose bills sum to the cost is balanced, and the negative operator amount is simply the operator's credit for running the operation.",
  "The rounding, because two decimal places on each partner amount can hide a remainder that the sum check absorbs silently into the operator line.",
  "The commitments, because a sum check on the cost leaves out orders already placed, and each partner must also be billed its share of those."],
 "The operator share is 100 less 115.00, which is -15.0000 percent. The fix is in the partner list, since the operator share is computed and has no figure of its own to edit.")

q(1,
 "How does the AFE engine treat a partner list totalling 115.00 percent, compared with a negative capex in the portfolio engine?",
 "The partner list returns the full allocation with valid false and a note, while the negative capex is refused with an error and no result.",
 ["Both are refused with an error naming the bad entry, since neither input can produce a figure that is safe to show anyone.",
  "The partner list is rescaled to 100 percent before the split and flagged, while the negative capex is clamped to 0 and funded.",
  "The operator share is clamped to 0.0000 and valid turns false, while the negative capex is read as a capex of 0 and weighs one cell."],
 "Negative progress on a cost line is also refused. A flagged split keeps the numbers visible so the list can be traced, which puts the stop in the reader's hands.")

q(0,
 "The published negative interest case splits 1000.00 between partners at 30 and -20 percent. What does the engine return?",
 "Partner amounts 300.00 and -200.00, an operator share of 90.0000 percent or 900.00, and valid false with a note naming Partner \"B\".",
 ["The same allocation with valid true, because the total of 10 percent is under the whole and the operator share is not negative.",
  "A refusal with an error and no allocation, because a negative working interest is rejected before any amount is computed.",
  "The negative interest set to zero, an operator share of 70 percent, and valid false with a note that the interest was corrected."],
 "The allocation is returned unchanged; the engine does not zero the interest, rescale the list or throw. Its note reads: Partner \"B\" has a negative working interest (-20.00 percent). Correct the interests before billing.")

q(0,
 "On that case at 30 and -20 percent, what has the negative entry done to the operator?",
 "Moved its magnitude onto the operator, who carries 90.0000 percent where it would carry 70 without the entry, while the partner bills itself a credit of 200.00.",
 ["Nothing, since the operator share depends only on whether the partner total reaches 100, and a total of 10 percent leaves the operator at the same residual it would carry anyway.",
  "Reduced the operator's load by 20 percent, since a partner's negative interest is a contribution the operator deducts from its own share of cost.",
  "Split the credit between the operator and the positive partner, in proportion to their interests of 90.0000 and 30 percent of the cost."],
 "Before EC5-0 this split passed as valid, because the only test was whether the operator share went below zero; a check that the total is at most 100 also passes it.")

q(2,
 "The published case at 130 and -10 percent carries both errors. What does the note say, and in what order?",
 "Both sentences, the negative interest first, then the partner total of 120.00 percent being more than the whole.",
 ["Only the sentence about the total of 120.00 percent, since a list over the whole takes precedence over any single entry.",
  "Both sentences, the total first, since the engine tests the partner total before it looks at any single partner's entry.",
  "Only the sentence about Partner \"B\", since the engine stops at the first error it finds."],
 "The operator share is -20.0000 and the operator amount -200.00, valid false; the note names Partner \"B\" at -10.00 percent and then the total over the whole.")

q(3,
 "A biller enters a partner at -20 percent to record a credit owed from an earlier phase. What does the split do with it?",
 "It models nothing of the kind: the operator share is inflated by the same magnitude, the partner's bill pays the partner, and valid turns false.",
 ["It treats the negative interest as a carried interest, charging the operator for that phase and recovering the credit from the partner once the well reaches payout.",
  "It nets the credit against the partner's next bill, since the split keeps a record of what each partner has already paid on the AFE.",
  "It converts the credit into a non-consent election, so the partner pays nothing toward the operation and the others take up its share."],
 "The split has no field for a carry, a credit or a correction. Record the credit where credits belong and keep every working interest between 0 and 100.")

q(1,
 "What does OFON-1 bill Ofon Energy, at 40.0000 percent, for the work to date?",
 "6036000 USD, 40.0000 percent of the actuals to date of 15090000.",
 ["10820000 USD, its share of the budget of 27050000 that the partners approved when the AFE was authorised.",
  "Its 40.0000 percent of the actuals plus the commitments of 5000000, since orders placed are costs the operator is already bound to.",
  "Its 40.0000 percent of the EAC of 27600000, since a partner is billed on the forecast that every screen shares after EC5-0."],
 "Partners are billed on actuals, not the budget or the EAC. The four bills, 6036000 + 3395250 + 1886250 + 3772500, sum to 15090000.")

q(3,
 "Applied to OFON-1's EAC of 27600000, what does a partner's working interest give?",
 "A forecast of that partner's final exposure, useful for its own planning and wrong on an invoice.",
 ["The amount to bill once the as-of date passes the end of the window, when the forecast becomes the actual cost of the well.",
  "The cash call for the next month, since the split issues advance billing against the forecast before any invoice arrives.",
  "The partner's share of the variance at completion, billed when a line overruns."],
 "The EAC is a forecast and the budget of 27050000 an authorisation; the split has no cash call and no advance billing against a forecast.")

q(0,
 "OFON-1 records actuals of 15090000 on its cost lines and an invoice total of 15090000. What should a partner bill say about that?",
 "Which total it split, because the two agree by construction on OFON-1 and need not agree on a real AFE.",
 ["Nothing, because the engine reconciles invoices with cost lines and refuses a split that disagrees.",
  "That it split the larger of the two, since the rule every screen shares after EC5-0 takes the larger of any two recorded actuals.",
  "That it split the invoices, since the cost lines hold commitments and not money spent."],
 "The metrics read actuals from the cost lines and the S-curve reads them from invoices. The split applies one set of interests to whatever total it is handed and converts nothing.")

q(2,
 "Before EC5-0, what did the AFE summary PDF bill for an AFE whose saved partners were Ofon Energy, Enang Petroleum and Mfem Resources?",
 "Two invented partners, Partner A at 30 percent and Partner B at 10 percent, whatever partners had been saved.",
 ["The three saved partners on the budget of 27050000, because the PDF read the approved total rather than the actuals.",
  "The three saved partners with the operator left out, so the operator's 25.0000 percent was missing from the printed split.",
  "The three saved partners with no note, so an invalid split printed without its warning."],
 "The repaired PDF bills the AFE's saved partners and prints the engine note whenever the split is invalid; a screen that hides valid and the note bills an error quietly.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/advanced/ec5a_m03.json', expect_n=15)
finish()
