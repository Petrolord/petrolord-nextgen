# A date to come back out

A temporary change is meant to come back out, such as a bypass fitted for a turnaround. The engine asks for one thing before such a change goes in: a date by which it is meant to end.

## The rule at the gate

The types that must carry an expiry date are "Temporary" and "Emergency". At the gate into "Implementation", a change of either type needs a readable expiry date. The engine prints three Temporary probes, each also replayed through the module's independent oracle:

- REFUSED, a Temporary change whose expiry reads "after the turnaround": A temporary change needs an expiry date before it is implemented. Without one it is a permanent change nobody decided to make.
- REFUSED, a Temporary change with no expiry date: A temporary change needs an expiry date before it is implemented. Without one it is a permanent change nobody decided to make.
- ALLOWED, a Temporary change with a readable expiry and every level signed.

## A permanent change nobody decided to make

The second half of the refusal is the reason for the rule. A temporary change with no end date stays on the facility until somebody remembers it, and ends up permanent without anyone deciding that it should be.

## Readable means a date

"After the turnaround" is a real answer on a real site, and it carries no date. The engine treats the phrase exactly as it treats a blank.

The same reading shows up after the gate: a Temporary change already in "Implementation" whose expiry reads "after the turnaround" reads "No expiry". That is why the gate insists on a readable date before the change goes in: once it is on the facility, an unreadable expiry can never read "Expired".

## Readable is all the gate asks

The gate asks only that the expiry date can be read; it does not ask that it lies ahead. A Temporary change in "Approval" whose expiry, 2026-09-30, has already passed, asked to go into "Implementation" with every level signed, is ALLOWED. Once in "Implementation" the same change reads "Expired" on 2026-10-01. That is what the engine does today, so the reviewer at the gate checks that the date lies ahead.

{{panel:rc-change-explorer}}

## What the date feeds

A readable expiry is what every later expiry verdict is computed from. In the ESANMI register, read on 2026-10-01, ES-02 carries the expiry 2026-10-14 and reads "Expiring soon", and ES-03 carries the expiry 2026-09-28 and reads "Expired". Neither state could be given without a date.

## A permanent change needs none

A "Permanent" change carries no expiry, and the engine reads its expiry state as "Permanent change". The expiry condition at the gate does not apply to it. ES-01 in the ESANMI register is permanent, and its expiry column reads null.

## Exercise

Record the engine's answer at the gate into "Implementation" for a Temporary change whose expiry reads "after the turnaround", for one with no expiry date, and for one with a readable expiry and every level signed. Quote the refusal. Then record the expiry state of a Temporary change in "Implementation" whose expiry reads "after the turnaround", and say which rule produced it. Record the gate's answer for a Temporary change whose readable expiry has already passed.
