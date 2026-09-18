import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Professional m04, actions and the two gates.
# Gate conditions and refusals are from digest Section 10 and the expiry probes
# m04 l04 quotes from Section 11. The action log, openActions, overdueActions
# and the edge probes are the Section 12 rows m04 l05 reads. Every dated answer
# is true on the as-of date 2026-10-01.

q(2, "Which two action statuses does the engine count as finished?",
 "\"Complete\" and \"Cancelled\".",
 ["\"Complete\" alone, since a cancelled action is work nobody did.",
  "\"Complete\" and \"In progress\".",
  "\"Cancelled\" alone."],
 "The statuses are \"Open\", \"In progress\", \"Complete\" and \"Cancelled\". An action decided to be unnecessary is no longer work anyone owes, and work that has started has not ended.")

q(0, "An unfinished action blocks one gate or the other according to its type. Which gate does an unfinished \"Pre-implementation\" action block?",
 "Only the first gate, the move from \"Approval\" onto the facility.",
 ["The gate into the Closed stage, along with the other two action types.",
  "Both gates.",
  "Neither gate."],
 "Pre-implementation actions block the gate into \"Implementation\"; Implementation and Post-implementation actions block the gate into the Closed stage. Each gate reads the action types it names.")

q(3, "ES-01 has every level signed and one Pre-implementation action still \"Open\". What does the gate into \"Implementation\" answer?",
 "It refuses: 1 pre-implementation action still open. They exist to be done before the change goes in.",
 ["It allows it, because the action can be finished once the change is on the facility.",
  "It refuses: Approval levels 2 and 3 have not signed yet.",
  "It refuses: 1 implementation or post-implementation action still open."],
 "Condition 1, the approvals, is cleared. Condition 2 fails on the one open Pre-implementation action; ES-01 also carries AC-02, which is \"Complete\" and blocks nothing.")

q(1, "ES-02 is in \"Implementation\" with its Post-implementation action AC-03 \"In progress\". What does the gate into the Closed stage answer?",
 "It refuses: 1 implementation or post-implementation action still open.",
 ["It allows it, because an action in progress has already been started.",
  "It refuses: 1 pre-implementation action still open.",
  "It allows it: that work is done after closing."],
 "\"In progress\" is unfinished. Once AC-03 reads \"Complete\" the engine allows ES-02 into the Closed stage.")

q(2, "Withdrawal instead: ES-02 is moved to \"Cancelled\" while AC-03 is unfinished. What is the verdict?",
 "It allows it: no action blocks a cancellation.",
 ["It refuses: 1 implementation or post-implementation action still open.",
  "It refuses, because a change in Implementation can only move to Closed.",
  "It allows it once AC-03 is \"Cancelled\" too."],
 "The action gate guards the Closed stage, which claims the work is done. Cancelling makes no such claim, and blocking it would trap a change nobody wants in \"Implementation\".")

q(0, "A Temporary change's expiry field reads \"after the turnaround\". It is asked to move into \"Implementation\" with every level signed. What does the engine answer?",
 "It refuses: A temporary change needs an expiry date before it is implemented. Without one it is a permanent change nobody decided to make.",
 ["It allows it, because the phrase names a real event on the site that everyone can see.",
  "It allows it and reads the expiry state as \"Within expiry\".",
  "It refuses: Approval level 1 has not signed yet."],
 "The engine treats an unreadable expiry exactly as it treats a blank. The same refusal is given for a Temporary change with no expiry date at all.")

q(3, "A Temporary change in \"Approval\" carries a readable expiry of 2026-09-30. With every level signed, it is asked into \"Implementation\" on 2026-10-01. What does the gate answer?",
 "It allows it.",
 ["It refuses, because an expiry date that has already passed cannot be implemented.",
  "It refuses, because a Temporary change needs an Emergency approval once its date is past.",
  "It allows it and reads the change as \"Closed out\" on 2026-10-01."],
 "The gate asks only that the expiry can be read; it does not ask that it lies ahead. Once in \"Implementation\" the same change reads \"Expired\" on 2026-10-01.")

q(1, "A Temporary change is already in \"Implementation\" with an expiry that reads \"after the turnaround\". What is its expiry state?",
 "\"No expiry\", since the date cannot be read.",
 ["\"Expired\", because no date can be shown to lie ahead.",
  "\"Within expiry\", until the turnaround ends.",
  "\"Expiring soon\"."],
 "An unreadable expiry is no expiry, so such a change can never read \"Expired\". That is why the gate insists on a readable date before the change goes in.")

q(2, "An Emergency change in \"Implementation\" still has level 2 unsigned. It is asked to move into the Closed stage. What does the engine answer?",
 "It refuses: Approval level 2 has not ratified this emergency change. It cannot close until every level has signed.",
 ["It allows it, because an Emergency change went in on its first level and needs nothing more.",
  "It refuses: Approval level 2 has not signed yet.",
  "It allows it if its implementation date is within the last 7 days."],
 "Into the Closed stage an Emergency change needs every level signed, however long ago it went in. The later signatures ratify a decision already acted on.")

q(0, "The ESANMI summary reads openActions 4 on 2026-10-01. Which four actions are they?",
 "AC-01, AC-03, AC-05 and AC-09.",
 ["AC-01, AC-03, AC-05 and AC-06.",
  "AC-01, AC-03, AC-06 and AC-07, the actions still marked Open or In progress, whatever their change.",
  "AC-03, AC-05, AC-07 and AC-09."],
 "Finished statuses leave the count, and so do actions on finished changes: AC-06 on ES-06, which is Closed, and AC-07 on ES-09, which is \"Cancelled\". AC-09, whose change is unknown, stays in.")

q(3, "AC-06 is \"Open\" and was due on 2026-09-01. Why is it in neither openActions nor overdueActions on 2026-10-01?",
 "Its change, ES-06, is in the Closed stage, so it is finished and locked.",
 ["Its due date has aged out of both counts.",
  "Post-implementation actions are left out of the open count until their change has closed.",
  "An \"Open\" action counts once it is \"In progress\"."],
 "The engine reads the action's change as well as the action. The same holds for AC-07 on ES-09, which is \"Cancelled\", and for an Open action on the \"Rejected\" ES-11, which reads openActions 0.")

q(1, "AC-09 names change ES-99, which is not in the ESANMI register. How does the summary treat it?",
 "It counts it, in openActions and in overdueActions.",
 ["It skips it: its change is unknown, so the work cannot be placed.",
  "It counts it in openActions and leaves it out of overdueActions.",
  "It refuses to summarise the register until ES-99 is supplied."],
 "Not knowing the parent is no reason to hide the work. AC-09 is due 2026-09-30, -1 days on 2026-10-01, so it is also overdue.")

q(2, "One open action is due on the as-of date itself, 2026-10-01. What do the counts read on that date?",
 "openActions 1, overdueActions 0.",
 ["openActions 1, overdueActions 1, since the day has arrived.",
  "openActions 0, overdueActions 1, since the action has fallen due.",
  "openActions 0, overdueActions 0, until the day itself has passed."],
 "An action is overdue when its due date has PASSED, days until below zero. Due the day before, 2026-09-30, reads openActions 1, overdueActions 1.")

q(0, "Two actions in the ESANMI log are overdue on 2026-10-01. Name them with their days until.",
 "AC-01 at -3 days and AC-09 at -1 days.",
 ["AC-01 at -3 days and AC-06 at -30 days.",
  "AC-06 and AC-07, the two furthest behind.",
  "AC-03 and AC-05."],
 "AC-01 is due 2026-09-28 and AC-09 2026-09-30. AC-03 and AC-05 fall due after the as-of date, and AC-06 and AC-07 sit on finished changes.")

q(1, "Where does late work on a change already in \"Implementation\" show up on 2026-10-01?",
 "As overdue actions.",
 ["As the change's own overdue flag, read against its target date.",
  "As \"Ratification overdue\" on every type.",
  "As \"Expired\"."],
 "A change's own overdue flag is read only before it is on the facility. ESANMI holds 5 changes in \"Implementation\", 5 past their target, and none reads overdue.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/intermediate/asrci_m04.json', label='asrci_m04', expect_n=15)
finish()
