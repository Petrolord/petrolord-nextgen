# The report the solve leaves behind

The duty return carries more than a flow and a head. It carries evidence about the search that produced them, and that evidence is as much a part of the answer as the answer is.

{{panel:fc-pump-explorer}}

## The method

The engine bisects on the head difference. It holds a flow where the pump makes more head than the system demands and a flow where it makes less, takes the midpoint, works out which side of zero the difference falls on, and replaces whichever end has the same sign. The bracket halves every time round.

## What the OKONO solve reports

- halvings taken: 55, out of a cap of 200
- the bracket it stopped on: 2.2737367544323206e-13 gpm
- the head difference at the flow it returned: 0 ft
- converged: true, with a warning of null

Read the bracket. It is a width in gallons per minute so small that a flow of this magnitude cannot be told apart from its neighbours inside it. The search did not stop because it ran out of patience. It stopped because the midpoint stopped moving.

## A flag made of two things

The converged flag is built from the residual as well as from the bracket, and it has to be.

On a bracketed sign change, bisection always collapses. The bracket halves every iteration whatever the function is doing inside it, so a bracket width of nothing is guaranteed rather than earned. A flag made only of the bracket could never come back false. It would report true on every call, including the calls that are wrong, and a check that cannot fail validates nothing at all.

The residual is the half that can fail, because it asks a different question: at the flow you finally returned, do the two curves actually agree. Here they do, to 0 ft.

## Stopping when the answer stops moving

The cap of 200 is a guard rather than a plan. It is worth knowing what the guard costs, so compare the engine against a blind loop that takes a fixed 200 halvings with no stopping test at all on the same pair of curves.

The blind loop gives 1234.452969 gpm. The engine gives 1234.452969 gpm. The difference is 0 gpm.

Nothing moved when the report was added. The loop now breaks exactly where the blind one was already standing still, so the reporting costs no accuracy and buys a flag, a bracket and a residual that a caller can inspect.

## The mistake

Taking a converged flag on trust without asking what would make it false. That question has an answer here, and the next lesson is the case that produces it.

## Exercise

Give the number of halvings the OKONO solve took, the bracket it stopped on and the residual at the flow it returned. Then explain why a convergence flag built from the bracket width alone would be worthless on a bracketed bisection.
