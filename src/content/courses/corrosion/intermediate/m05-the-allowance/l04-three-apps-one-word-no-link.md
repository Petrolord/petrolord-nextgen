# Three apps, one word, no link

{{panel:fc-inhibitor-integrity-explorer}}

Three studios in this suite take a corrosion allowance and none of them knows
about the other two. This one CONSUMES an allowance to give a life. The Pipeline
and Line Sizing studio ADDS one to a pressure-containing wall. The Storage Tank
studio ADDS one to a shell course. One word, three apps, and no link between
them anywhere.

## What that means in practice

The wall this studio is eating is not the wall either of the other two sized.
Nothing carries a thickness from one app to another, nothing reconciles the
allowance the line was designed with against the allowance typed into this
screen, and no minimum thickness exists anywhere in this module to anchor
either end. If somebody sizes a line in one studio and then screens it in this
one, the two allowances agree only because a person made them agree.

That is a recorded fact about the suite rather than a defect nobody noticed. It
is stated in this studio's own help, and it is deliberately not wired up,
because a link between three apps is a design decision rather than a bug fix.

## What this studio cannot say

It cannot say what the allowance is being taken off. The Barlow thin-wall
relation with a design factor, which is the calculation that would answer that,
is owned by the Pipeline Network course at its Associate tier. This module has
no minimum thickness, so it cannot tell you how much wall is left underneath the
allowance once the allowance is gone.

It cannot take wall loss to a derated burst pressure either. That belongs to the
Torque and Drag course at its Expert tier. This module consumes an allowance and
never computes a pressure, so the comparison between the two is a pivot from one
course to another rather than a derivation you can run here.

## Where this course sits in the catalogue

One live course points at this one. The Well Integrity and P and A course in the
Drilling module explicitly refuses corrosion, wall loss and remaining life in
its own scope statement, and this course fills that refusal. Do not borrow its
vocabulary in the other direction: a barrier envelope is not a corrosion
allowance, and neither word can be substituted for the other.

## The habit to take away

When one word appears in several apps, check what each app DOES with it before
assuming the number travels. Here two apps add an allowance to a thickness they
are computing, and one divides an allowance by a rate. Those are different
operations on a quantity with the same name, and the fact that they never meet
is the thing to know about.

## Exercise

Write down, for each of the three studios named above, whether it adds a
corrosion allowance or consumes one, and what it produces from it. Then record
the corrosion allowance and the remaining life on this studio's shipped case,
and state what this module would need in order to say how much wall sits
underneath that allowance.
