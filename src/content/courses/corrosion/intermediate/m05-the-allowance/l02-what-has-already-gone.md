# What has already gone

{{panel:fc-inhibitor-integrity-explorer}}

The consumed depth is an easy input to skim past and it changes two fields in
different ways. On the studio's shipped default case it is 0.000000
mm, so the corrosion allowance of 3.175000 mm and the remaining allowance of
3.175000 mm are the same figure, and a reader can go a long way without
noticing that they are two separate quantities.

Put a consumed depth into the box and they separate. The digest carries the
shipped case with 1.270000 mm typed into that box, which is 0.05 in against the
studio's own 0.125 in allowance, and nothing else changed:

| field | at the shipped defaults | with 0.05 in consumed | did it move |
| --- | --- | --- | --- |
| remaining allowance mm | 3.175000 | 1.905000 | yes |
| remaining life yr | 4.207953 | 2.524772 | yes |
| allowance the design life demands mm | 15.090473 | 15.090473 | no |
| shortfall mm | 11.915473 | 13.185473 | yes |

Three moved and one did not, and which one did not is the lesson. The shortfall
rose by exactly the consumed depth, and the rate did not move at all.

## The field that does not move

The allowance a design life demands is the rate multiplied by the design life.
It is the allowance a new line would need in order to reach the end of that
design life at this rate. It takes no account of what has already been consumed,
because it is not a statement about this line's history. On the shipped case it
is 15.090473 mm against a corrosion allowance of 3.175000 mm.

So the consumed depth moves the remaining allowance and the remaining life, and
leaves the required allowance where it was at 15.090473 mm on both readings. Two fields that both sound like
allowances answer two different questions, and only one of them is affected by
the history of the wall.

## The shortfall sits between them

The shortfall compares the required allowance against what is LEFT. On the
shipped case that is 11.915473 mm. Because one side of that comparison includes
the consumed depth and the other does not, the shortfall is neither a pure
statement about a new line nor a pure statement about this one. It is the gap a
reader has to close, measured from where the wall is now.

This is the sort of distinction that reads as pedantry until somebody uses the
required allowance as a specification for a replacement line. It is close to
right and it is short by the consumed depth, and the gap is invisible unless you
know which of the two fields carries the history.

## What to write down

When you record a case, record all four: the corrosion allowance as typed, the
consumed depth as typed, the remaining allowance and the remaining life. The
first two are inputs and the second two are results. Keeping that boundary
visible in your own notes is the habit that stops a derived figure being quoted
back later as a measurement.

And record the rate beside them, because both results are hostage to it. A
remaining life is only as good as the rate it divided by, and in this module the
rate is a screening argument built on constants this repository cannot source.

## Exercise

On the shipped case, record the corrosion allowance, the consumed depth, the
remaining allowance, the remaining life, the allowance the design life demands
and the shortfall. Then state which of those six figures would be unchanged if
the consumed depth were larger, and explain in one sentence what that field is
asking.
