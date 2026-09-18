# Covering an absence

The rules in this module are strict. An approval is decided only by its assignee, never by the originator, and only once. So what happens when the assignee is away? The owner's answer is to reassign the approval, and the engine's refusal names that route.

## The owner decision

Decision D1, taken on 2026-09-18 under AS15, is recorded in the digest as: an approval is decided only by the member it is assigned to, never by the change originator, and an absence is covered by reassigning the approval. The database enforces the same rule.

Covering an absence is part of the decision, the answer to the objection that strict assignment would leave changes stuck whenever somebody is on leave.

## The sentence that points there

The refusal a user meets when they try to decide somebody else's approval ends with the instruction:

- REFUSED, u-halima deciding an approval assigned to u-emeka: Only the person this approval is assigned to can decide it. If they are unavailable, reassign it.

The engine refuses the shortcut and names the correct route in the same breath.

## What a reassignment must respect

A reassignment is an assignment, so the assignment rules from lesson one apply to it. On ES-01, raised by u-chika:

- ALLOWED, assigning u-halima, who is independent of the change.
- REFUSED, assigning the originator as an approver: The originator of a change cannot approve it. Choose somebody independent of the change.
- REFUSED, assigning nobody: Choose the approver.

So an absence cannot be covered by handing the approval to the originator, and it cannot be covered by leaving the row with no assignee. Once the approval is reassigned to u-halima, u-halima is the assignee, and the rule in lesson two now lets u-halima decide it. Every answer here was replayed through the module's independent oracle.

{{panel:rc-change-explorer}}

## A "Delegated" row does not sign

The approval statuses include "Delegated". Module two read what the engine does with it: a "Delegated" row is not an "Approved" row, so its level stays outstanding. A delegated row with nothing else at its level reads levels 1, outstanding 1, complete no.

Recording a delegation does not cover the absence by itself. Deciding a Delegated row is refused too:

- REFUSED, u-emeka deciding an approval whose status is Delegated: This approval is already delegated.

"Delegated" is a status a row can carry and nothing more. Until somebody who holds an approval at that level approves it, the level is unsigned and the gate into "Implementation" stays shut.

## What the engine does not model

The engine does not move an approval to somebody else. Measured by searching its 34 exports, the functions whose name mentions reassigning or delegating number 0. How an approval moves to another person is the app's and the database's business (the AS15 reassignment), and this engine holds no rule for it. What the engine does hold is the check on the result: whoever ends up assigned must pass the assignment rules above.

## Exercise

For the level 2 approval on ES-01, assigned to u-emeka, write down the route the engine names when u-emeka is unavailable. Record the engine's answer to reassigning the approval to u-halima, to u-chika and to nobody. Then record what a lone "Delegated" row does to its level, and say which rule produced that answer.
