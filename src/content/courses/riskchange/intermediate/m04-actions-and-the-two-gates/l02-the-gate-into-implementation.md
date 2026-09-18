# The gate into implementation

Only "Approval" leads to "Implementation", and the move is not automatic. The engine holds a gate at that door, and a change passes only when every condition is met. This lesson reads the conditions and the refusal each one produces.

## The conditions

Into "Implementation", the engine requires:

1. every approval level signed with no rejection, except that an Emergency change needs only its first level;
2. no Pre-implementation action unfinished;
3. for a Temporary or Emergency change, a readable expiry date.

Each condition has its own refusal sentence. Every probe below was also replayed through the module's independent Python oracle.

## ES-01 walked through the gate

ES-01 is a permanent change in "Approval" in the ESANMI register. The engine answers three probes against it:

- REFUSED, ES-01 into Implementation as it stands, levels 2 and 3 unsigned: Approval levels 2 and 3 have not signed yet.
- REFUSED, ES-01 into Implementation with every level signed and one Pre-implementation action still Open: 1 pre-implementation action still open. They exist to be done before the change goes in.
- ALLOWED, ES-01 into Implementation with every level signed and its actions finished.

The first probe fails condition 1. The second clears condition 1 and fails condition 2. The third clears both.

ES-01 carries two Pre-implementation actions in the register: AC-01, "Open", and AC-02, "Complete". The second probe is the gate reading the one that is still open.

## The approval refusals

Condition 1 has two more refusals, which module two read: "An approver has rejected this change. It cannot be implemented." for a rejection anywhere, and "No approvers have been assigned, so there is nothing to approve. Add the approval levels this change needs." for a change with no rows.

## The expiry condition

A Temporary or Emergency change must carry a readable expiry date before it goes in. A Temporary change whose expiry reads "after the turnaround" is refused: A temporary change needs an expiry date before it is implemented. Without one it is a permanent change nobody decided to make. The condition asks only that the date can be read. An expiry of 2026-09-30, already passed, is ALLOWED through with every level signed, and lesson four reads what that change says on 2026-10-01.

{{panel:rc-change-explorer}}

## The emergency exception

Condition 1 carries one exception, and it is owner policy (AS15, Q9, decided on 2026-09-18): an Emergency change needs only its first level signed to go in. The rest of its levels sign afterwards, inside a ratification window. Module five reads that route and its window. The exception is narrow. It changes how many levels must sign. It does not lift the rejection rule, the Pre-implementation rule or the expiry rule.

## Reading a refusal at the gate

When the gate refuses, read the sentence for which condition failed: levels are condition 1, pre-implementation actions condition 2, an expiry date condition 3. The sentence tells you what to fix.

## Exercise

For ES-01, record the engine's answer at the gate into "Implementation" in three states: as it stands, with every level signed and one Pre-implementation action "Open", and with every level signed and its actions finished. Quote each refusal. Then name the condition each refusal came from, and record the answer for a Temporary change whose expiry reads "after the turnaround".
