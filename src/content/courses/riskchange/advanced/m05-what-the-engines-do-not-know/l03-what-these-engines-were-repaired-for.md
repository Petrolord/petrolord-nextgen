# What these engines were repaired for

This lesson is repair history, and says so first. It sets what these engines used to do beside the rule each holds today, drawn from the one course record whose subject is repair history.

## Repair history, and how each defect was found

Each repair marker in the golden files is a defect an independent oracle, written from the stated rule, found and pinned as failing, then repaired and kept as a case that fails if the defect returns. The course lists them for all five modules. The two this tier owns:

- peerReview: CAL-1, PR-1, PR-2, RC-4a, RC-4b, RC-9.
- lessonsLearned: AS15-Q10, ASC0-12, CAL-1, LL-1, RC-9.

## Repair history from AS12 to AS15

A risk review due today used to read overdue west of Greenwich, because the date was parsed as UTC midnight. Today a date is read at local midnight, and a review due on the as-of date, 2026-10-01 in this course, is not overdue.

A blank residual axis used to zero the whole residual; today it falls back to the inherent level on that axis alone. An impossible date such as 30 February used to roll over into a real one; today it parses to no date at all.

An unreadable expiry used to read "Expiring soon" and pass the implementation gate. Today it reads "No expiry" and the gate refuses it.

A comment with no severity used to sort above Critical; today IK-01's unrated C-09 sorts after its rated unresolved comments. Actions on finished changes used to count as open work for ever (AS14); today openActions skips them.

Emergency changes used to need every level signed before implementation, and a lesson author used to be able to validate their own lesson by typing a name (both AS15). Today an emergency change goes in on its first level, and the validating actor is the signed-in person whatever name is typed.

## Repair history from ASC-0

ASC-0 is engines PR #212. A closed risk used to read review-overdue, and an as-of date given as text used to be read as a UTC instant. Today only a live risk can be review-overdue.

A change already in Implementation used to read overdue against its target date; today a change is overdue only before it is on the facility. Peer review used to hold no rule on who reviews, and its summary used to count comments on cancelled reviews as blocking for ever. Today the engine refuses the author of the work as a reviewer and in every reviewer move, and the summary keeps comments on a finished review out of the open and blocking counts.

Several refusals used to read "A archived", "level 2 and 3 has" and "1 critical comment still need". Today the refusal copy agrees: "An archived lesson is final.", "Approval levels 2 and 3 have not signed yet." and "1 critical and 2 major comments still need resolving."

## Exercise

Choose two repairs from the AS12 to AS15 history and two from ASC-0. For each, record what the engine used to do, the rule the engine holds today and the engine figure or sentence that shows it. Then record the repair markers in the peerReview golden file, and say which kind of check found every defect in this lesson.
