# Only the assignee decides

Assigning an approver is one move. Deciding the approval is another. This lesson reads the second: once an approval is assigned to somebody, that person and only that person may approve or reject it.

## The deciding probes on ES-01

ES-01 was raised by u-chika, and its level 2 approval is assigned to u-emeka. The engine answers four deciding probes:

- ALLOWED, u-emeka deciding the approval assigned to u-emeka.
- REFUSED, u-halima deciding an approval assigned to u-emeka: Only the person this approval is assigned to can decide it. If they are unavailable, reassign it.
- REFUSED, nobody signed in: Only the person this approval is assigned to can decide it. If they are unavailable, reassign it.
- REFUSED, the originator deciding an approval somebody assigned to them: The originator of a change cannot approve it.

Every one of these answers was also replayed through the module's independent oracle.

## Independent is not enough

The second probe is the one to study. u-halima is independent of ES-01; the last lesson showed the engine allows u-halima to be assigned as an approver. Here u-halima is refused anyway, because this particular approval is assigned to u-emeka.

Independence decides who may be assigned. Assignment decides who may decide. A person who would have been a perfectly good approver still cannot sign an approval somebody else holds. The approval belongs to the person it is assigned to.

If anyone independent could sign any open approval, the named approver would be a suggestion, and the record would not show whether the person chosen was the one who agreed.

## Nobody signed in

The third probe has no actor at all, and the engine gives it the same sentence as u-halima. From the engine's side the question is identical: is the person deciding the person this approval is assigned to? Nobody is not u-emeka, so the answer is no.

## The originator, even when assigned

The fourth probe covers a record where the originator has been assigned to decide an approval on their own change. The last lesson showed that assignment is refused at the moment it is attempted. This probe asks what happens if such a row exists anyway.

The engine refuses the decision with "The originator of a change cannot approve it." Being the assignee does not help. The originator rule is checked at the decision as well as at the assignment, so an originator is refused as an approver and as a decider, even when assigned.

{{panel:rc-change-explorer}}

## The way forward in the sentence

Read the second half of the assignee refusal: "If they are unavailable, reassign it." The sentence anticipates the reason somebody else is trying to decide, an assigned approver who is unavailable, and tells the user what to do about it: change the record. Lesson four of this module reads it.

## Two refusals, two rules

Keep the two refusal sentences apart when you report them:

| who tries to decide | the rule that refuses | the sentence begins |
| --- | --- | --- |
| somebody other than the assignee | only the assignee decides | Only the person this approval is assigned to |
| the originator | the originator never approves | The originator of a change cannot approve it |

They answer different questions and point to different fixes.

## Exercise

For the level 2 approval on ES-01, record the engine's answer when u-emeka decides it, when u-halima decides it, when nobody is signed in, and when an originator decides an approval assigned to them. Quote each refusal. Then say which of the two rules produced each one.
