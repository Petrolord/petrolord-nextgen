# The gate into closed

A change in "Implementation" has two legal next stages: the Closed stage and "Cancelled". Moving to the Closed stage means the change is finished and part of the facility. The engine holds a second gate at that door.

## The conditions

Into the Closed stage, the engine requires:

1. no Implementation or Post-implementation action unfinished;
2. for an Emergency change, every approval level signed.

Pre-implementation actions do not appear here; they are the first gate's business.

## ES-02 at the gate

ES-02 is a temporary change in "Implementation" in the ESANMI register. It carries one action, AC-03, a Post-implementation action "In progress". The engine answers three probes:

- REFUSED, ES-02 into Closed with its Post-implementation action In progress: 1 implementation or post-implementation action still open.
- ALLOWED, ES-02 into Closed once that action is Complete.
- ALLOWED, ES-02 into Cancelled, which no action blocks.

Every one of these answers was also replayed through the module's independent oracle.

The first probe shows that "In progress" is unfinished. Work that has started is still owed, and the change cannot be called finished while it is. The second probe shows the same change passing the moment the action reads "Complete".

## Cancelled is not gated by actions

The third probe matters as much as the first two. ES-02 can move to "Cancelled" with AC-03 still "In progress". The action gate guards the Closed stage, which is a claim that the work is done. Cancelling makes no such claim; it withdraws the change. Blocking a cancellation on unfinished work would trap a change nobody wants in "Implementation" until its actions were closed out.

That difference is why the two terminal stages reachable from "Implementation" answer differently. The Closed stage says the work is done and the change is part of the facility. "Cancelled" withdraws the change.

## The emergency condition

An Emergency change went in on its first level alone. Before it can close, every other level must have signed. The engine prints the refusal:

- REFUSED, an Emergency change in Implementation into Closed with level 2 still unsigned: Approval level 2 has not ratified this emergency change. It cannot close until every level has signed.

The sentence uses the word "ratified", because on the emergency route the later signatures ratify a decision already acted on. Module five reads the window in which they are due. At this gate the rule is simple: however long ago the change went in, it cannot reach the Closed stage until every level has signed.

{{panel:rc-change-explorer}}

## Two gates, two sets of actions

| gate | actions that block it | approval condition |
| --- | --- | --- |
| into "Implementation" | Pre-implementation | every level, or level 1 on the emergency route |
| into the Closed stage | Implementation and Post-implementation | every level, on an Emergency change |

Read each gate by its own row. An action type that blocks one gate is not checked at the other.

## Exercise

For ES-02, record the engine's answer at the gate into the Closed stage with AC-03 "In progress", and again once AC-03 is "Complete". Record the answer for ES-02 into "Cancelled". Then record the refusal for an Emergency change with level 2 unsigned, and say which condition of the gate produced it.
