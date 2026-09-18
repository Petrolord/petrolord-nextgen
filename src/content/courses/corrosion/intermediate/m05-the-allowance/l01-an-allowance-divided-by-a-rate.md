# An allowance divided by a rate

{{panel:fc-inhibitor-integrity-explorer}}

The remaining life in this module is one arithmetic. Take the corrosion
allowance, subtract what has already gone, divide by a rate, and stop. That is
the whole of it, and the word integrity in the name of this studio means exactly
that division and nothing more.

On the studio's shipped default case the corrosion allowance is 3.175000 mm, the
consumed depth is 0.000000 mm, the remaining allowance is therefore 3.175000 mm,
the rate is 0.754524 mm/yr, and the remaining life is 4.207953 yr. The design
life on that case is 20.000000 yr and the screening reports that it is not met.

## Three more fields come with it

Alongside the years, the door returns the allowance a stated design life would
demand and the shortfall between that and what is left. On the shipped case the
allowance the design life demands is 15.090473 mm and the shortfall is
11.915473 mm.

Those two fields answer a different question from the remaining life. The
remaining life asks how long this line has. The required allowance asks what a
line at this rate would have needed to be built with in order to last the stated
design life. They are related and they are not the same question, and the next
lesson in this module is about the difference.

## The summary names this as the binding constraint

> at 0.755 mm/yr the allowance runs out in 4.2 years against a 20 year design
> life, short by 11.92 mm of allowance.

That sentence is the engine's own, and on the shipped case the binding
constraint is the corrosion allowance against the design life. Of everything on
that screen, this is the limit that governs the answer.

## The allowance is typed in

Both quantities on the top of that division arrive from the reader, and the
module holds no wall thickness of its own against which to check either.

## What this division is not

It is not an inspection interval. It is not a minimum thickness or a retirement
thickness. It is not a fitness-for-service assessment. All four are listed by
the engine as not provided, which is a stronger statement than held: they are
absent by decision rather than pending a source, and producing any of them would
mean adopting a standard this module does not carry.

So a remaining life of 4.207953 yr does not say when to inspect and it does not
say what thickness to retire at. It says how long the typed allowance lasts at
the computed rate. A reader who treats the years as an inspection
date has read a division as a programme.

## Exercise

Record the corrosion allowance, the consumed depth, the rate and the remaining
life on the shipped case, and confirm the division for yourself. Then record the
allowance the design life demands and the shortfall, and state which of the
three figures you recorded second would change if the consumed depth were larger.
