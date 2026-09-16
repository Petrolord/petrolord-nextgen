# Uphill, where the ceiling falls

On a climb the ceiling sits below the inlet. Take the SOKU trunk up 3000.000000 ft and the bracket ends at 784.964657 psia, which is 65.035343 psi under the 850.000000 psia the gas entered at. This is the commoner case of the two, because most lines that are not flat are being pushed up something.

{{panel:fc-gasline-explorer}}

## A climb, worked

Asked for 20000000.0000 scfd up that hill, the trunk delivers at 766.523922 psia, a drop of 83.476078 psi. Set that beside the ceiling of 784.964657 psia and the geometry of the problem is visible: the delivered pressure sits just under the ceiling, and the ceiling is as close to the inlet as any rate can bring the outlet. Reduce the rate towards nothing and the outlet rises towards 784.964657 psia and stops there. It never reaches 850.000000 psia, at any rate, because the gas has to lift itself 3000.000000 ft before it delivers anything at all.

## What lies between the ceiling and the inlet

That band from 784.964657 psia up to 850.000000 psia is the part of a climbing line's arithmetic that has no physical content. The driving group has already vanished at the ceiling, so there is no rate to be found above it. A bracket whose upper end is the inlet spends that entire band searching a region where the form has no answer to give, and the search still terminates and still returns a value.

This is the opposite failure from the descent. On a descent an inlet-capped bracket is too short and cannot reach the answer. On a climb it is too long and reaches past the point where answers stop existing. Both failures return numbers.

## A climb the inlet cannot pay for at all

Some climbs are not expensive, they are impossible. Put the same 3000.000000 ft hill under a near-atmospheric inlet of 15.500000 psia and the engine returns { error: "the static gas column alone spends the inlet pressure: this line delivers nothing at any rate" }.

Read the wording. It is about the column alone, before any rate has been considered and before any friction has been spent. The ceiling in that case has fallen to or below the floor of the bracket, so there is no interval left to search. The refusal is the engine reporting that the range itself has closed, which is a different finding from the line being unable to carry a particular rate.

## Why this case matters most

A descent that returns the inlet with no drop is conspicuous, because a reviewer knows a line spends something. A climb is quieter. The answer an inlet-capped bracket produces on a climb is a plausible pressure below the inlet, in the right general region, on the commonest profile there is. A wrong answer in the right region is the hardest kind to find, because nothing about it invites a second look.

## The mistake

The mistake is assuming a climbing line is the safe case because its outlet is obviously below its inlet. The outlet being below the inlet is exactly why the error hides.

## Exercise

Give the ceiling on the 3000.000000 ft climb and its distance below the inlet. Give the outlet and the drop at 20000000.0000 scfd. Then state what the engine returns for that hill at an inlet of 15.500000 psia, and explain how that refusal differs from a rate the line cannot carry.
