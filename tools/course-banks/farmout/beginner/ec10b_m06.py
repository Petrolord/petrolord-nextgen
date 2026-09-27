import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Associate m06, Interests After the Deal.
# Sources: the vesting rules in the engine's bases; the interests after the
# deal on the Ekene single well, the full carry and a third for a quarter; an
# event not completed; the vesting and events-completed refusals; the
# checklist for reading a farm-out; what is graded. No capstone term or figure.
# Every key rests on a digest-printed line or an engine return re-run in
# /root/cat-wip-farmout/scratch/bank-beginner/witness.mjs.

q(0, "Ekene Deep, completed: FIN earns 30 percent from EKO under \"per-event\" vesting (EKO 70 and PA 30 before the deal). Which shares does the engine report afterwards?",
 "EKO 40.000000, PA 30.000000, FIN 30.000000.",
 ["EKO 70.000000, PA 30.000000, FIN 0.000000, since the payments leave the licence shares unchanged.",
  "EKO 40.000000, PA 20.000000, FIN 40.000000, with FIN's 40 percent share paid vesting in full.",
  "EKO 70.000000, PA 0.000000, FIN 30.000000, with PA's share passing to the farminee."],
 "The farminee's participating interest comes out of the farmor's alone: EKO falls from 70.000000 to 40.000000, FIN rises from 0.000000 to 30.000000 and PA keeps its 30.000000 (engine). The share paid sets what FIN pays for the well; the interest earned sets what vests. A completed event under \"per-event\" moves the stated interest.")

q(2, "EKO holds the whole licence. FIN earns 25 percent by paying 33.333333 percent of a 12000000.000000 well with no cap; the event is completed under \"per-event\" vesting. What participating interests after the deal does the engine return?",
 "EKO 75.000000 and FIN 25.000000: the interest earned moves from the farmor.",
 ["EKO 100.000000 and FIN 25.000000, since a sole holder keeps its whole licence and FIN's share is new.",
  "EKO 75.000000 and FIN 33.333333, the share of the well FIN paid.",
  "EKO 70.000000 and FIN 30.000000, as on the Ekene licence."],
 "On earn-third-for-a-quarter the engine returns EKO 75.000000 and FIN 25.000000. The rule is the same with no other party: the participating interest earned moves from the farmor to the farminee, and the shares still sum to 100. 33.333333 is the share of the well FIN pays, and 70 and 30 are the Ekene deal's figures.")

q(3, "Case earn-full-carry: FIN funds 70 percent of an uncapped 40000000.000000 well, earning 30 percent from EKO's 70 (PA holds 30); the well is drilled. Which licence shares result?",
 "The Ekene table again: EKO 40.000000 with PA and FIN at 30.000000 each.",
 ["EKO 0.000000, PA 30.000000, FIN 70.000000, since FIN paid EKO's whole pre-deal share of the well.",
  "EKO 40.000000, PA 20.000000, FIN 40.000000, the promote taking ten points of PA's share.",
  "Unchanged: EKO 70.000000, PA 30.000000, FIN 0.000000."],
 "The interests after do not depend on the price: FIN earns 30 percent, so the engine returns EKO 40.000000, PA 30.000000 and FIN 30.000000, the same table as the Ekene deal. The share paid of 70 sets FIN's payment and the carry of 16000000.000000. PA is outside the trade, and a completed event moves the interest earned.")

q(1, "Nothing is drilled yet (0 events completed, rule \"per-event\") on a deal that would move 30 percent from EKO to FIN, PA holding 30. What table of participating interests does the engine print?",
 "EKO 70.000000, PA 30.000000 and FIN 0.000000: nothing vests until the event is completed.",
 ["EKO 40.000000, PA 30.000000, FIN 30.000000, vesting on signing.",
  "None, since the engine refuses an event that has not been completed yet.",
  "EKO 70.000000, PA 30.000000, FIN 30.000000, pending."],
 "On earn-none-completed the engine returns EKO 70.000000, PA 30.000000 and FIN 0.000000, and its reason reports 0 of 1 event completed with 0% vesting. Under \"per-event\" each completed event vests its stated interest, so nothing moves before completion. An uncompleted event is a result with a reason. Shares that sum to more than 100 cannot be a licence.")

q(2, "Which basis line does the engine print for the vesting rule \"per-event\"?",
 "each completed event vests its stated interest (a farm in: assignment with the work, HMRC OT30021)",
 ["nothing vests until every event is completed (an earn in: the work before the assignment, HMRC OT30021)",
  "each event vests its stated interest on signing, before any work is done (a farm in, HMRC OT30020)",
  "each completed event vests the share paid, in points (HMRC OT30048)"],
 "The engine's basis for \"per-event\" reads \"each completed event vests its stated interest (a farm in: assignment with the work, HMRC OT30021)\". The line beginning \"nothing vests\" is the basis of \"all-events\", the other rule. No rule vests on signing, and what vests is the interest earned: the share paid sets the payment.")

q(0, "A box states the vesting rule as \"on-signing\". What does the engine return?",
 "A refusal on vesting: it must be one of \"per-event\", \"all-events\".",
 ["A result in which the interest vests at signing, the order HMRC calls a Farm in on page OT30021.",
  "A result read as \"per-event\", since one event is stated.",
  "A refusal on eventsCompleted, which must be 0 at signing."],
 "The engine's words: vesting must be one of \"per-event\", \"all-events\"; got \"on-signing\". The vesting rule is a stated term with no default, and a rule the engine does not know is refused by name. HMRC's farm in is assigned before the work, yet the engine's \"per-event\" rule still vests an event on completion, as its basis says.")

q(1, "A deal has a single earning event, and the box states eventsCompleted as 2. What does the engine return?",
 "A refusal: at most 1, the number of events.",
 ["A result counting the event twice, so FIN vests 60 percent of the licence.",
  "A result read as 1 completed event, with a reason noting the extra count.",
  "A refusal on vesting, since two completions need the rule \"all-events\"."],
 "The engine's words: \"eventsCompleted must be at most 1, the number of events; got 2\". The events completed is a stated count from 0 up to the number of events, and the engine neither doubles nor trims it. The vesting rule is a separate term, checked on its own.")

q(3, "Reading the Ekene participating interests after the farm-in, which two checks does the course make?",
 "They still sum to 100, and FIN's 30 percent came out of EKO's share alone while PA kept its 30.",
 ["They sum to more than 100, since FIN's participating interest is added on top of the licence.",
  "PA's share fell by the carry, and EKO's by the promote.",
  "FIN's share equals the 40 percent it paid, and EKO holds the rest."],
 "EKO 40.000000, PA 30.000000 and FIN 30.000000 sum to 100, and only the farmor's share moved (engine). A farminee joins inside the licence, so the shares stay whole. The carry and the promote set money, and PA is outside the trade. FIN holds the 30 percent it earned; the 40 percent it paid sets its payment.")

q(0, "An event not yet completed comes back with a vested participating interest tile of 0.000000. Is that a refusal?",
 "No: it is a result, with the obligation split and a reason saying nothing has vested.",
 ["Yes: the engine refuses a deal whose events are not all completed, naming eventsCompleted as the field.",
  "Yes: a tile of 0.000000 marks a refused term.",
  "No: it is a warning, and the engine drops the uncompleted event from every table of the result."],
 "The course's rule: a result returned with a reason (an event not completed) is a result, and no refusal. The engine returns the split of the obligation, with FIN's 16000000.000000 on earn-none-completed, and a reason saying 0% vests. A refusal returns no figures, and the event stays in the row as the obligation.")

q(2, "In the course's checklist for reading a farm-out, which line does the earning calculator leave to the texts?",
 "The consent needed and the fee basis, read from the Act and the 2024 Regulations.",
 ["The consideration and the equivalent working interest, read from the Act before the tiles are checked.",
  "The participating interests after the deal, from the table.",
  "The vesting rule and the events completed, from the box."],
 "The checklist's line 8, the consent needed and the fee basis, is read from the texts, since the earning calculator computes no consent; the Professional tier computes the fee. The consideration, the equivalent working interest and the interests after are results the engine returns, and the vesting rule and the events completed are stated inputs.")

q(3, "Which lines of the course's checklist are inputs, read off the deal before any result is looked at?",
 "The parties, the roles, the events, the vesting and the cash.",
 ["The consideration, the equivalent working interest and the interests after the deal.",
  "Every line, since each figure the calculator prints is a stated input of the deal.",
  "Only the licence parties, since the engine computes every other line from them."],
 "Lines 1 to 5 (the licence and its parties, the farmor and the farminee, each event's terms, the vesting rule and the events completed, the cash bonus and past costs) are inputs, read off the deal and checked against the box. The consideration, the equivalent working interest and the interests after are results. The engine computes nothing a deal does not state.")

q(1, "Before copying a payment from the earning calculator, which check does the course advise on an event's payments?",
 "Add the farminee's, the farmor's and the other parties' payments, and check they make up the gross cost.",
 ["Check that the farminee's payment equals the share paid times the dry-hole cost of the well.",
  "Check that the farmor's payment equals the consideration it receives from the deal.",
  "Confirm that each payment ends in whole millions."],
 "On the Ekene well, 18200000.000000 + 14000000.000000 + 13800000.000000 = 46000000.000000 (derived), the gross cost; if the payments do not make up the well, a term has been misread. The dry-hole cost is no term of the earning event, the farmor's payment is what it pays for the well, and the consideration is what it receives.")

q(0, "Why do the full carry case and the Ekene deal end with the same participating interests after the deal?",
 "Both earn 30 percent from EKO, and the interest earned alone decides the table.",
 ["Both pay the same promote of 10 points, which fixes each party's share after the deal.",
  "Both carry a cash bonus of 2000000.000000 paid on signing.",
  "Both have a cap on the gross cost of the well."],
 "The promote, the carry and the cash decide what the participating interest costs; the interest earned decides the table (engine: EKO 40.000000, PA 30.000000, FIN 30.000000 on both). The full carry's promote is 40 points against Ekene's 10, it states no bonus, and it has no cap.")

q(3, "The refusal for FIN earning 71 from EKO's 70 names \"the farmor's interest 70 less 0 already earned\". What does the 0 already earned count?",
 "What earlier events of the same deal earned, none here.",
 ["The cash bonus already paid to the farmor, stated as 0 in the box.",
  "Promote points already taken on the well.",
  "The share of the gross cost already paid by PA, the other party."],
 "The interest earned comes out of the farmor's alone, so the limit is the farmor's interest less what earlier events already earned. With one event that is nothing; the count belongs to deals with more than one earning event, which the Professional tier works. Cash, the promote and PA's payments play no part in the limit.")

q(2, "The Associate capstone grades figures that the earning calculator returns. Where does its deal come from?",
 "Its own synthetic deal, printed nowhere in the lessons.",
 ["The Ekene Deep deal, with the figures the lessons print, so that a learner can copy them across.",
  "A real Nigerian farm-out from the regulator's register, with the parties' names replaced.",
  "The Penn State drill or farm out problem, rescaled to the Ekene licence and its parties."],
 "Each capstone runs its own synthetic deal, which the course never prints, and every graded figure is a return value of the engine on its fixed terms, with exactly one right answer. The Ekene deal is for rehearsal. The course uses no real deal, and the Penn State page is cited for its numbers only.")

emit(Q, '/root/cat-wip-farmout/banks/ec10b_m06.json', expect_n=15)
finish()
