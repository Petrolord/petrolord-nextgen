# The coefficient across beta and across Reynolds number

{{panel:fc-meterrun-explorer}}

Here is the sweep itself. The Reader-Harris/Gallagher equation for a
flange-tapped orifice, evaluated across nine betas and across four decades of
Reynolds number on the ABOH pipe bore. Read it as a map of where the coefficient
lives.

| beta | Re 5e+3 | Re 5e+4 | Re 5e+5 | Re 5e+6 | Re 5e+7 |
| --- | --- | --- | --- | --- | --- |
| 0.050000 | 0.598718 | 0.596626 | 0.596209 | 0.596125 | 0.596108 |
| 0.100000 | 0.600481 | 0.597067 | 0.596382 | 0.596243 | 0.596214 |
| 0.200000 | 0.604059 | 0.598299 | 0.597110 | 0.596849 | 0.596784 |
| 0.350000 | 0.612008 | 0.601810 | 0.599531 | 0.598908 | 0.598697 |
| 0.500000 | 0.626708 | 0.608174 | 0.603746 | 0.602287 | 0.601691 |
| 0.600000 | 0.641608 | 0.613342 | 0.606466 | 0.604015 | 0.602950 |
| 0.670000 | 0.653961 | 0.615976 | 0.606719 | 0.603296 | 0.601766 |
| 0.750000 | 0.668050 | 0.615280 | 0.602488 | 0.597614 | 0.595385 |
| 0.800000 | 0.675240 | 0.611016 | 0.595531 | 0.589541 | 0.586772 |

## How to read a surface rather than a line

Two things move here and they move independently. Walk down a column and you are
changing the plate, which is what a designer does. Walk along a row and you are
changing the flow rate, the density or the viscosity, which is what the process
does to you between Monday and Thursday. The coefficient is a value on a
surface, and quoting it without saying which point on the surface you were at is
quoting half a number.

## Which cells count as published

Not every cell in the table is inside the correlation's published band of beta.
The digest counts the ones that are, over the cross product of the nine betas
and the five Reynolds numbers, with the rule that a cell counts when the engine
returns `betaInPublishedRange` true for it:

   cells in the table above that sit inside the published beta range: 35

The remaining cells are still printed, because the engine still returns a
coefficient outside the published band and tells you what it has done. The next
lesson but one is about that flag and the sentence that comes with it.

## The span, and what it licenses you to say

   largest, at beta 0.750000 and Reynolds 5e+3                0.668050
   smallest, at beta 0.750000 and Reynolds 5e+7               0.595385
   difference (first less second)                      0.072666
   ratio (first over second)                           1.122048

That is the span across the cells inside the published range, and it is the only
comparison on this page you may make. Notice what it does not say. It does not
name the steepest direction, it does not say which of beta or Reynolds number
moves the coefficient further, and it does not rank the rows, because none of
those was computed. If you want a claim like that you go back to the engine and
produce the figure, and then it can be quoted.

## Where the run you know sits on this map

The ABOH run came back with a beta of 0.482523 and a pipe Reynolds number of
2117151.4444, so it sits between two of the rows and between two of the columns
above. That is the ordinary case. A real meter almost never lands on a gridline,
which is another reason the coefficient is evaluated rather than looked up. Its
returned coefficient of 0.602223 belongs to that point and to no other.

## The one honest generalisation

A coefficient is an engine output. When somebody hands you a flow computed with
a coefficient they did not obtain from the geometry and the Reynolds number of
that run, the table above is how you show them what they have done.

## Exercise

Pick the row at beta 0.500000 and the row at beta 0.750000. Without asserting
anything the digest has not printed, describe what you would have to compute
before you could tell a colleague which of the two plates has a coefficient more
sensitive to a change in throughput.
