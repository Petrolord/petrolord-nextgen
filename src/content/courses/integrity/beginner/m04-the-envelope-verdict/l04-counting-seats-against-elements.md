# Counting seats against elements

Add the two envelope counts together and you have counted seats, not elements. The difference is the honest measure of independence.

{{panel:wi-envelope-explorer}}

## Two different numbers

The engine reports a count for each envelope: how many elements sit in the primary list, and how many sit in the secondary list. A shared element sits in both lists, so it is counted twice.

That makes the sum of the two counts a count of **seats**, meaning positions filled across the two chains. It is not a count of physical hardware. The roster length is the count of hardware, because each real element appears in the roster once however many envelopes it serves.

## The identity

Seats minus elements equals the number of shared elements. Always.

Every element contributes one seat if it serves one envelope and two seats if it serves both. So the excess of seats over elements is exactly the number of elements serving both, which is the length of the shared list the engine returns.

## On the published roster

| Quantity | Value |
| --- | --- |
| Primary count | 5 |
| Secondary count | 5 |
| Seats, the two added | 10 |
| Elements in the roster | 10 |
| Shared list | empty |

Seats and elements agree, so the gap is zero, so nothing is shared. The two envelopes on this well are two independent chains, and you can establish that from three numbers without reading a single element name.

## Why it is the honest measure

Because a barrier table always looks like two envelopes. It has a primary column and a secondary column and both have entries in. The layout asserts independence whether or not the well has any.

The seat gap ignores the layout. It asks how many distinct things the well contains, and so how much of your apparent redundancy is one object listed twice.

A gap of zero means every seat has its own hardware. Any positive gap means that many barriers are shared, and each can take both envelopes down together.

## The first thing to compute

Do this before you read statuses. Statuses tell you the condition of what you have. The seat gap tells you what you have. If the gap is not zero, the status work that follows has to be read knowing that some rows move in lockstep.

## Exercise

1. Confirm the three numbers above in the panel: primary count, secondary count, roster length.
2. Change one element to serve both envelopes. Recompute the seats, compare to the roster length, and check the gap against the shared list.
3. Take a real barrier table from your own work and compute its seat gap.
