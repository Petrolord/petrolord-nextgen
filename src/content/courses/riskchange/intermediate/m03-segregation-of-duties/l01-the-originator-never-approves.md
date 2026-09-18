# The originator never approves

Module two read what a signed approval set looks like. This module reads who may sign. The rule is segregation of duties: the person who raised a change is never the person who approves it, and an approval is decided only by the person it is assigned to.

## The rule is owner policy

The rule is owner policy, decided on 2026-09-18 under AS15 as decision D1: an approval is decided only by the member it is assigned to, never by the change originator, and an absence is covered by reassigning the approval. The engine holds the rule, and the database enforces the same rule.

## The change this module reads

ES-01, "Replace the dry gas seals on compressor K-201", is a permanent change in the ESANMI register. It was raised by u-chika, so u-chika is its originator. Its level 2 approval is assigned to u-emeka.

The assignment and deciding probes in this module are read against that change, and every engine answer was also replayed through the module's independent Python oracle.

## Assigning an approver

Assignment is the first place the rule bites. The engine answers three assignment probes:

- REFUSED, assigning the originator as an approver: The originator of a change cannot approve it. Choose somebody independent of the change.
- REFUSED, assigning nobody: Choose the approver.
- ALLOWED, assigning u-halima, who is independent of the change.

The first refusal is the rule itself. u-chika raised ES-01, so u-chika cannot be put on its approval rows. The sentence names the way forward in its second half: choose somebody independent of the change.

The second refusal is the absence case again: an approval assigned to nobody would have no one who could decide it.

The allowance shows what "independent" means in the engine's terms. u-halima did not raise ES-01, so u-halima may be assigned.

## Why the originator is kept off

The person who proposes a change believes in it. That is why they raised it, and it is also why their signature adds nothing as a check. An approval is worth something because somebody who did not write the proposal has read it and agreed that it is safe to put onto the facility. If the originator could sign their own level, the approval set would record a check that nobody performed.

The printed rule names the originator: an approval is decided only by the member it is assigned to, never by the change originator. u-chika raised ES-01 and is refused; u-halima did not raise it and is ALLOWED.

{{panel:rc-change-explorer}}

## Two checks, at two moments

The engine checks independence twice. The first check, read in this lesson, is at assignment: the originator cannot be put on the approval. The second, read in the next lesson, is at decision: even if a record arrives with the originator already assigned, the originator's decision is refused with "The originator of a change cannot approve it." Holding the rule at both moments means a row assigned some other way still cannot be signed by the wrong person.

## Exercise

For ES-01, record its originator and the person its level 2 approval is assigned to. Then record the engine's answer to three assignment probes: the originator, nobody, and u-halima. Quote each refusal exactly, and say which part of decision D1 produced each answer.
