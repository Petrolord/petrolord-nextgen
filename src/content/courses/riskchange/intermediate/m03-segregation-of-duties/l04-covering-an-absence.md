# Covering an absence

The rules in this module are strict. An approval is decided only by its assignee, never by the originator, and only once. So what happens when the assignee is away? The owner's answer is to reassign the approval, and the engine's refusal names that route.

## The owner decision

Decision D1, taken on 2026-09-18 under AS15, is recorded in the course as: an approval is decided only by the member it is assigned to, never by the change originator, and an absence is covered by reassigning the approval. The database enforces the same rule.

Covering an absence is part of the decision, the answer to the objection that strict assignment would leave changes stuck whenever somebody is on leave.

## The sentence that points there

The refusal a user meets when they try to decide somebody else's approval ends with the instruction:

- REFUSED, u-halima deciding an approval assigned to u-emeka: Only the person this approval is assigned to can decide it. If they are unavailable, reassign it.

The engine refuses the shortcut and names the correct route in the same breath.

## Where the engine checks, and where it does not

The reassignment itself is a step in the app and the database. What the engine holds is the check at the decision. On ES-01, raised by u-chika:

- ALLOWED, u-emeka deciding the approval assigned to u-emeka.
- REFUSED, the originator deciding an approval somebody assigned to them: The originator of a change cannot approve it.

The second probe is the one that matters for an absence. However the approval reached the originator, the engine refuses the originator at the decision, even as the assignee. Decision D1 says an approval is decided only by the member it is assigned to, never by the change originator, so a cover arranged by handing the approval to u-chika cannot be signed.

{{panel:rc-change-explorer}}

## A "Delegated" row does not sign

The approval statuses include "Delegated". Module two read what the engine does with it: a "Delegated" row is not an "Approved" row, so its level stays outstanding. A delegated row with nothing else at its level reads levels 1, outstanding 1, complete no.

Recording a delegation does not cover the absence by itself. Deciding a Delegated row is refused too:

- REFUSED, u-emeka deciding an approval whose status is Delegated: This approval is already delegated.

"Delegated" is a status a row can carry and nothing more. Until somebody who holds an approval at that level approves it, the level is unsigned and the gate into "Implementation" stays shut.

## What the engine does not model

Measured by searching its 34 exports, the functions whose name mentions reassigning or delegating number 0. How an approval moves to another person, and whether a decided one can be reopened, is the app's and the database's business (the AS15 reassignment), and this engine holds no rule for either.

## Exercise

For the level 2 approval on ES-01, assigned to u-emeka, write down the route the engine names when u-emeka is unavailable. Record the engine's answer when u-emeka decides it and when the originator decides an approval assigned to them. Record who holds the rule for moving the approval. Then record what a lone "Delegated" row does to its level, and say which rule produced that answer.
