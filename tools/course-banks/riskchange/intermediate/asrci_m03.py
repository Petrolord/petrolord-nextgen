import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Professional m03, segregation of duties.
# Every person, probe, refusal sentence and count is from digest Section 9.
# ES-01 was raised by u-chika; its level 2 approval is assigned to u-emeka.

q(3, "ES-01 was raised by u-chika. Somebody tries to assign u-chika as one of its approvers. What does the engine answer?",
 "It refuses: The originator of a change cannot approve it. Choose somebody independent of the change.",
 ["It allows it, provided u-chika is assigned at a level above the first.",
  "It allows the assignment and refuses only when u-chika tries to decide.",
  "It refuses: Only the person this approval is assigned to can decide it."],
 "Independence is checked at assignment first. The second half of the sentence names the way forward: choose somebody independent of the change.")

q(1, "An approval on ES-01 is assigned to nobody. What does the engine answer?",
 "It refuses: Choose the approver.",
 ["It allows it, and anyone independent may then decide the approval.",
  "It allows it and reads the row as \"Delegated\".",
  "It refuses: No approvers have been assigned, so there is nothing to approve."],
 "An approval assigned to nobody would have no one who could decide it, so the assignment is refused with the shortest sentence in the module.")

q(0, "Why is u-halima allowed as an approver on ES-01?",
 "u-halima did not raise ES-01, so u-halima is independent of the change.",
 ["u-halima is the level 2 assignee on ES-01, and only an assignee may be added as an approver.",
  "u-halima is senior to u-chika.",
  "u-halima raised ES-01 and knows it."],
 "The refusal names one person to keep off the change: its originator. u-chika raised ES-01; u-halima did not, and the engine allows u-halima as an independent approver.")

q(2, "ES-01's level 2 approval is assigned to u-emeka. u-halima, who is independent of the change, tries to decide it. What does the engine answer?",
 "It refuses: Only the person this approval is assigned to can decide it. If they are unavailable, reassign it.",
 ["It allows it, because u-halima is independent of ES-01 and could have been assigned.",
  "It refuses: The originator of a change cannot approve it. Choose somebody independent of the change.",
  "It allows it and records the row as \"Delegated\" from u-emeka to u-halima."],
 "Independence decides who may be assigned. Assignment decides who may decide. An approval belongs to the person it is assigned to.")

q(3, "Nobody is signed in when a decision is attempted on ES-01's level 2 approval, which is assigned to u-emeka. Which other attempt meets the same refusal sentence word for word?",
 "u-halima trying to decide that same approval.",
 ["Assigning nobody as the approver on ES-01.",
  "u-chika, the originator, deciding an approval somebody assigned to u-chika.",
  "Moving a change with no approval rows at all into \"Implementation\"."],
 "Both are refused with: Only the person this approval is assigned to can decide it. If they are unavailable, reassign it. Neither nobody nor u-halima is u-emeka. Assigning nobody meets \"Choose the approver.\" and the originator meets \"The originator of a change cannot approve it.\"")

q(0, "A record arrives with the originator already assigned to decide an approval on their own change. The originator decides it. What does the engine answer?",
 "Refused: an originator never decides, even as assignee.",
 ["It allows it, because the originator is the assignee on that row and only the assignee decides an approval.",
  "It refuses: Only the person this approval is assigned to can decide it. If they are unavailable, reassign it.",
  "It allows it once a second approver signs."],
 "The originator rule is checked at the decision as well as at the assignment, so the originator is refused as an approver and as a decider, even when assigned.")

q(1, "Why does the engine check independence at the decision as well as at the assignment?",
 "So that a row assigned some other way still cannot be signed by the wrong person.",
 ["So the originator may sign a level once an independent approver has signed the level first.",
  "So an absent approver's row can be decided by the originator.",
  "So a Delegated row can be signed off."],
 "Holding the rule at both moments means an assignment made outside the engine's own check still meets the originator refusal when somebody tries to decide it.")

q(2, "Somebody tries a second decision on a row that already reads \"Approved\". Which refusal follows?",
 "It refuses: This approval is already approved.",
 ["It allows it, and the second decision replaces the first one on the row.",
  "It allows it when the assignee is the person deciding.",
  "It refuses: Choose the approver."],
 "A decision is made once, by anyone, the assignee included. \"Approved\" and \"Rejected\" are decisions, and a decision stands.")

q(3, "Why does it matter that an approval already \"Rejected\" cannot be decided again?",
 "The rejection would otherwise be overwritten.",
 ["Because the Rejected stage is final, and the row takes the stage's rule from it.",
  "Because a second decision on a row always has to be taken by the originator.",
  "Because a rejected row is removed from the set once it has been decided."],
 "The engine refuses with \"This approval is already rejected.\" If a second decision were allowed, the rejected row would become approved, the set would read complete, and the record would lose the objection.")

q(1, "u-emeka tries to decide an approval whose status is \"Delegated\". What does the engine answer?",
 "Refused as already decided: This approval is already delegated.",
 ["It allows it, because u-emeka is the assignee on the row.",
  "It allows it and the level reads signed.",
  "It refuses: Choose the approver, because a Delegated row has no assignee left on it."],
 "\"Delegated\" is a status a row can carry and nothing more. It signs nothing, its level stays outstanding, and deciding it is refused as already decided.")

q(0, "What is decision D1, and when was it taken?",
 "Owner policy under AS15, decided on 2026-09-18: an approval is decided only by its assignee, never by the change originator, and an absence is covered by reassigning it.",
 ["Owner policy under AS15, decided on 2026-09-18: an absent approver's level may be signed by any member independent of the change.",
  "An engine default decided on 2026-10-01: the originator signs level 1 and independent members sign the rest.",
  "Owner policy under AS15: a Delegated row signs its level."],
 "Covering an absence is part of the decision itself, the answer to the worry that strict assignment would leave changes stuck while somebody is away.")

q(2, "u-emeka, the level 2 assignee on ES-01, is unavailable. What route does the engine's refusal name?",
 "Reassign the approval.",
 ["Let u-halima decide it, since u-halima is independent of the change.",
  "Record the row as \"Delegated\", which signs the level.",
  "Let u-chika decide it, as the person who knows the change best."],
 "The assignee refusal ends: If they are unavailable, reassign it. A \"Delegated\" row signs nothing, and u-chika is the originator.")

q(3, "The app moves ES-01's level 2 approval away from u-emeka. On which new assignee does the engine still refuse the decision?",
 "u-chika, who raised ES-01.",
 ["u-halima, because the approval was first assigned to u-emeka and stays with them.",
  "u-halima, because a person who was not on the original set can never decide.",
  "Any member at all, because the engine holds no rule for moving an approval."],
 "The engine checks the decision as well as the assignment. The originator deciding an approval somebody assigned to them is refused: The originator of a change cannot approve it.")

q(1, "Searching the engine's 34 exports, how many functions have a name that mentions reassigning or delegating?",
 "0. How an approval moves to somebody else is the app's and the database's business.",
 ["34, one for each export, because every function in the engine can hand an approval to another member.",
  "1, the function that reads a Delegated row as signed.",
  "0, so reassignment is refused by the engine as illegal."],
 "The engine holds no rule for moving an approval. It still refuses the originator at the decision, even when somebody assigned the approval to them.")

q(2, "A report says: \"The engine lets a decided approval be reopened by the assignee.\" What does the digest support?",
 "None of it. The engine holds no rule for reopening, and a decided approval is refused as already decided.",
 ["The report is right for Rejected rows, which the assignee can reopen once to answer the objection that was raised.",
  "The report is right, because only the assignee decides.",
  "The report is right while the change is still in \"Approval\", since a reopened row goes back to Pending there."],
 "Searching for reopening, revisiting, undoing, revoking or withdrawing a decision finds 0 functions. A decided approval is refused as already approved or already rejected.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/intermediate/asrci_m03.json', label='asrci_m03', expect_n=15)
finish()
