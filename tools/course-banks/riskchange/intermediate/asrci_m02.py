import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Professional m02, approval levels.
# Every approval set, count and refusal is from digest Section 8, with the gate
# refusals the m02 lessons quote from Section 10. The emergency question draws
# only on the condition m02 l03 states; its window belongs to m05.

q(1, "Where does the engine get the approval levels a change needs?",
 "From the approval rows themselves: whatever distinct levels appear on the rows attached to the change.",
 ["From a setting on the change type that fixes how many levels each type needs.",
  "From the risk level the change carries, one level for each band above \"Low\".",
  "From a fixed ladder of three levels that every change passes."],
 "The engine keeps no separate list of levels. Every distinct level present must carry at least one Approved row, and no row at any level may be Rejected.")

q(3, "An approval set carries rows at levels 1 and 3 and nothing at level 2; only level 1 has signed. How does the engine read it?",
 "Levels 1, 3; outstanding 3; complete no.",
 ["Levels 1, 2, 3; outstanding 2, 3.",
  "Levels 1, 3; complete yes.",
  "Refused as a malformed set, because a level 2 row has to sit between them."],
 "A missing level is not invented. The levels are whatever the rows say, so a change that needs a level 2 signature needs a level 2 row somebody has added.")

q(0, "An approval row carries no level at all. How is it read?",
 "It counts as level 1.",
 ["It is left out when the levels are read, like a row that is not on the set.",
  "It forms a separate unnamed level, which is outstanding until it signs.",
  "It counts as the highest level present anywhere on the same set."],
 "A row with no level counts as level 1. A set holding one such row, signed, reads levels 1, outstanding none, complete yes.")

q(2, "Two people are asked to approve at level 2, and one of them has signed. Level 1 has signed too. What does the set read?",
 "Levels 1, 2; outstanding none; complete yes.",
 ["Levels 1, 2; outstanding 2; complete no, until both rows at level 2 read Approved.",
  "Levels 1, 2; outstanding none; complete no, because a Pending row is left.",
  "Levels 1, 2, 2; outstanding 2; complete no."],
 "One Approved row signs a level. The engine does not read a level as a vote that needs every row, so a Pending second signer leaves the level signed.")

q(2, "A set holds one row, and its status is \"Delegated\". How does the engine read it?",
 "Level 1 stays outstanding, so complete no.",
 ["Levels 1; outstanding none; complete yes, because delegating hands the signature on.",
  "Levels none; outstanding none; complete no, since a Delegated row is no row at all.",
  "Levels 1; outstanding none."],
 "A \"Delegated\" row is not an \"Approved\" row, so its level stays outstanding. Only \"Approved\" signs a level.")

q(0, "Every level on a set has an Approved row, and one other row on it reads \"Rejected\". What does the engine read?",
 "Outstanding none; rejected rows 1; complete no, because a rejection anywhere makes the set incomplete.",
 ["Outstanding none; rejected rows 1; complete yes, because every level has signed.",
  "Outstanding 2; rejected rows 1; complete no.",
  "Outstanding none; rejected rows 0; complete yes."],
 "The rule has two halves: every level signed, and no row at any level Rejected. The empty outstanding list satisfies the first half only.")

q(1, "A change whose set has every level signed and one rejection is asked to move into \"Implementation\". Which sentence refuses it?",
 "An approver has rejected this change. It cannot be implemented.",
 ["Approval level 2 has not signed yet.",
  "A rejected change is final.",
  "No approvers have been assigned, so there is nothing to approve. Add the approval levels this change needs."],
 "This refusal names a decision already made, and no further signature clears it while the rejected row sits on the set. \"A rejected change is final.\" is about the Rejected stage.")

q(3, "A change carries no approval rows at all. Is its approval set complete?",
 "No. An empty set is incomplete.",
 ["Yes, nothing is outstanding.",
  "Yes, for a Permanent change, which needs no levels unless rows are added.",
  "It cannot be read, so the engine returns no answer for the set at all."],
 "The empty set reads levels none, outstanding none, rejected rows 0, complete no. A check that only asks whether anything is outstanding or rejected would let it through.")

q(1, "What does the engine say when a change with no approval rows is asked to move into \"Implementation\"?",
 "No approvers have been assigned, so there is nothing to approve. Add the approval levels this change needs.",
 ["Approval level 1 has not signed yet.",
  "Choose the approver.",
  "The approval set on this change is complete, and it is allowed into Implementation with nothing to sign."],
 "Because the engine reads levels from the rows, it cannot know how many a change should have. It can know that a change with no rows has not been through approval, and it refuses to treat that as approved.")

q(0, "ES-01 is in \"Approval\" with levels 2 and 3 unsigned. What does the gate into \"Implementation\" answer?",
 "It refuses: Approval levels 2 and 3 have not signed yet.",
 ["It refuses: Approval level 1 has not signed yet.",
  "It allows it on level 1, the way the gate treats a change once its first level has signed.",
  "It refuses: No approvers have been assigned."],
 "The sentence is built from the outstanding list, so it tells the user which levels to chase. ES-01 is Permanent, so every level must sign.")

q(2, "Of the four approval statuses, which ones sign a level?",
 "\"Approved\" alone.",
 ["\"Approved\" and \"Delegated\", since a delegation passes the signature to a colleague.",
  "\"Approved\" and \"Pending\", once the row has been assigned to a named approver.",
  "Any status other than \"Rejected\"."],
 "The statuses are \"Pending\", \"Approved\", \"Rejected\" and \"Delegated\", and only one of them signs. \"Pending\" and \"Delegated\" rows leave their level outstanding.")

q(3, "An organisation wants two named people to sign before a change goes in. How must the rows be built for the engine to require both?",
 "Put them at two different levels.",
 ["Put both at the same level; one level with two rows needs both to read Approved.",
  "Put both at the same level and mark one \"Delegated\" to the other.",
  "Put one at level 1 and leave the other row's level blank so it counts separately."],
 "Two rows at one level mean either of these may sign for it. Two rows at different levels mean both levels must sign. A blank level lands on level 1.")

q(1, "An Emergency change has level 1 signed and a Rejected row at level 2. Can it go into \"Implementation\" on the emergency route?",
 "No. The route needs level 1 signed and nobody having rejected it.",
 ["Yes. The route asks for level 1 alone, and level 2 is left to ratify later.",
  "Yes, and the Rejected row reads as awaiting ratification once it is in.",
  "No, because an Emergency change needs every level signed."],
 "The emergency route shortens the wait for signatures. It does not step over a rejection, which stops the gate for every type.")

q(0, "A set reports outstanding none and rejected rows 0. What must you still check before calling it complete?",
 "That there are rows at all, since a set with no approval rows reports the same two answers and reads complete no.",
 ["That every row has a level, since a blank level makes the set incomplete.",
  "That the change is Permanent, since other types are read differently.",
  "Nothing: those two answers are the whole rule."],
 "Look at the row count before the outstanding list. An empty outstanding list is good news only when there are rows to be outstanding.")

q(3, "The word \"Rejected\" names both an approval status and a stage. What does a Rejected approval row do to a live change?",
 "It stops the gate into \"Implementation\".",
 ["It moves the change to \"Rejected\".",
  "It makes the change final.",
  "It cancels every other row on the set, signed ones included."],
 "A rejected row is a status on one row and stops the gate. \"Rejected\" as a stage is terminal and answers \"A rejected change is final.\" Name which one you mean.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/intermediate/asrci_m02.json', label='asrci_m02', expect_n=15)
finish()
