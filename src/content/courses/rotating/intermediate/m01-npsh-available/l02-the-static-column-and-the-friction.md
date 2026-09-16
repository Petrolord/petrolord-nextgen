# The static column and the suction friction

A pressure head is one of three parts. The other two are the height the liquid falls from and the friction it loses getting to the suction flange, and they carry opposite signs.

{{panel:fc-suction-explorer}}

## The three parts on one row

The OKONO suction survey states a source standing 6.000000 ft above the pump and 5.500000 ft of suction friction, on the drum at 24.500000 psia over a vapour pressure of 0.950000 psia at a gravity of 1.040000. The engine returns an NPSH available of 52.808173 ft, and the three parts sum to it:

52.308173 plus 6.000000 less 5.500000 gives 52.808173 ft.

The warning on that call is null, which is information in its own right.

## Why the signs are what they are

The static column is a height the liquid already has. A source above the pump arrives with that height in hand and it adds. A source below the pump has to be lifted first, and the same term then works against the suction, so its sign is a fact about the layout rather than an assumption about it.

The friction is spent before the liquid reaches the flange, so it is gone by the time the pump asks what is left. It subtracts on every suction.

## The figure the survey hands over

The 5.500000 ft is a stated condition. This package takes it as a number and does not compute it: what a suction line's length, bore, fittings and rate cost in feet of head is line-sizing work and belongs to the course that owns line losses. That seam matters when a suction is marginal, because the friction is then the term most likely to have been guessed, and a guessed friction becomes a guessed NPSH available with nothing to mark the join.

## Assembled, rather than typed

The Suction and Changes tab builds this figure from the survey, one part at a time, instead of taking a single available head typed into a box. That is what makes the static column and the friction movable at all. A suction that reads 52.808173 ft because a drum sits at 24.500000 psia and a source stands 6.000000 ft up can be argued with. One that reads 52.808173 ft because somebody wrote 52.808173 cannot.

## The mistakes

Adding the friction rather than subtracting it. The arithmetic then reads 52.308173 plus 6.000000 plus 5.500000, and it is wrong twice over, once for the term it gained and once for the term it lost.

Taking the static column as the height of the drum, or as the height of the liquid level inside it, when the survey states the height of the source above the pump. Those are three different elevations and one of them is the stated condition.

Losing the null warning. Null there says the engine found nothing to flag, and that is an answer worth quoting.

## Exercise

Write the three parts of the OKONO NPSH available with their signs, and their sum. Then say which of the three this package computes, which two it is handed, and what the null warning on the call establishes.
