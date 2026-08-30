# Overpull, and the running case

The load case with no pressure in it at all.

{{panel:ct-loadcase-explorer}}

## The story

The string is being run in the hole. It is full of mud and surrounded by mud, so there is no pressure differential anywhere: inside and outside are the same column.

What there is, is weight. And if the string sticks and has to be pulled on, there is more than weight.

## Overpull

An extra tension applied at surface, on top of the hanging weight, and it is felt all the way down the string because a tension applied at one end of a bar is carried by the whole bar.

    axial(z) = buoyed hanging weight below z + overpull

The published run uses 445000 N, which is about 100000 pounds force, a routine figure to pull to before deciding the string is stuck.

## The engine applies it to this case only

    overpullN: kind === 'runningAxial' ? overpull : 0

Deliberately. The other six cases describe a string that is landed and cemented, and there is nothing to pull on.

That is a modelling choice worth seeing written down, because it means the overpull in the environment object does not affect six of the seven answers, and a reader who changes it and sees five cases unmoved has not found a bug.

## What it costs

| section | tension SF without overpull | tension SF on the running case |
|---|---|---|
| 1 | 4.450849431147698 | 3.4283670928548284 |
| 2 | 7.879089408631784 | 4.513673929186337 |

Section 1 loses about 23 percent of its tension margin and section 2 about 43 percent.

Section 2 loses more, which looks odd until you notice why: it has less weight hanging below it, so the fixed 445000 N is a larger fraction of its total load.

An overpull hurts the BOTTOM of a string proportionally more than the top, even though the top carries more force.

## The tension design factor

1.6, the largest of the four. That is not because tension is more uncertain than the others; it is because the consequence of parting a string is qualitatively worse than yielding one, and because a real running operation adds shock loading, drag and slip crushing that none of this captures.

## Exercise

Section 2's joint strength is 4702486.244765741 N, which is the L-80 body yield times the long thread efficiency.

Work back from its running-case tension safety factor of 4.513673929186337 to the axial force at the top of that section, and check that the difference from the no-overpull case is 445000 N.
