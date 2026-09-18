# The author never reviews the work

A peer review is worth something because somebody other than the author looked at the work. The peerReview engine holds that as a rule of segregation of duties, in two places: who may be put on the review, and who may take a reviewer's move on a comment.

{{panel:rc-review-explorer}}

## Putting people on the review

IK-01, Water injection pump selection, is the work of u-efe. The engine knows two reviewer roles, "Lead Reviewer" and "Reviewer", and the author is refused as a Reviewer, as the Lead Reviewer and with no role given, each time in the same words:

- REFUSED, the author of the work, as a Reviewer: The author of the work under review cannot review it. Choose somebody independent of the work.

The engine allows the author as an Observer, u-kemi, independent of the work, as the Lead Reviewer, and an external reviewer named only by display name. Naming nobody at all is refused with "Choose the reviewer."

Leaving the role blank is no way round the rule. Watching the review judges nothing, so an Observer is allowed.

## Taking a reviewer's move

The rule reaches the comment loop too. The moves TRANSITION_ACTOR gives to the reviewer, "Verified", "Rejected" and "Withdrawn", are never taken by the author:

- REFUSED, the author verifying C-03, a Responded comment on their own work: The author of the work under review cannot verify a comment on it. A reviewer independent of the work decides it.
- REFUSED, the author withdrawing C-01, an Open comment: The author of the work under review cannot withdraw a comment on it. A reviewer independent of the work decides it.

Rejecting C-03 is refused in the same form, "cannot reject a comment on it". u-kemi, independent of the work, verifying C-03 is allowed.

An author who could withdraw a "Critical" comment would clear a blocker without answering it, and the review would close on a clean-looking record.

## What the author may still do

The author's own move, "Responded", and the coordinator's, "Closed", are not restricted by it.

The engine allows the author responding to C-01, and the author closing out C-02, a Verified comment, which is administrative once the reviewer has accepted the response. A move with nobody signed in is refused for another reason: "Sign in to act on this comment."

## Where the rule is held

This is the owner decision D1 of 2026-09-18, segregation of duties, the same rule that keeps a change's originator from approving it, applied to peer review at ASC-0 in the engine. The engine enforces it now. The app and the database follow it with the Suite pull request that ships ASC-0, so this lesson teaches the engine's rule.

The rule has a stated limit. A reviewer named by display name only cannot be matched to the author, so the rule allows one, and a review with no author recorded cannot be checked either. The digest lists both among the held items.

## Exercise

For IK-01, record the engine's sentence when u-efe is put on as a Reviewer and when u-efe verifies C-03. Record which of these the engine allows: u-efe as an Observer, u-efe responding to C-01, u-efe closing out C-02, u-kemi verifying C-03. Say which moves the rule restricts, and why a display name alone escapes it.
