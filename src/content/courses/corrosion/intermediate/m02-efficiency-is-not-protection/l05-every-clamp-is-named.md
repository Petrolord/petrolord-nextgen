# Every clamp is named

{{panel:fc-inhibitor-integrity-explorer}}

An input a program silently moves is an input the reader no longer controls.
This module moves three of them and says so in each case, and the saying is as
much of the design as the moving.

| clamped input | what the engine did | the clamp it named |
| --- | --- | --- |
| efficiency -5.000000, availability 90.000000 | effective protection 0.000000 percent | the inhibitor efficiency was clamped from -5 to 0 percent |
| efficiency 120.000000, availability 90.000000 | effective protection 90.000000 percent | the inhibitor efficiency was clamped from 120 to 100 percent |
| efficiency 90.000000, availability 130.000000 | effective protection 90.000000 percent | the inhibitor availability was clamped from 130 to 100 percent |

## Read the first row carefully

A corrosion inhibitor efficiency of -5.000000 percent is moved to zero, and the
effective protection comes out as 0.000000 percent. The engine could have taken
a negative efficiency to mean the chemical makes things worse and returned a
rate above the uninhibited one. It does not, because nothing in this module
models an accelerant, and inventing that behaviour from a typing mistake would
be a claim with nothing behind it. Zero is the nearest value the model can
stand behind and the move is stated.

## The second and third rows land on the same number

At 120.000000 percent efficiency and 90.000000 percent availability the
effective protection is 90.000000 percent. At 90.000000 percent efficiency and
130.000000 percent availability it is also 90.000000 percent. The two cases
reach the same figure by clamping different inputs, and the only way a reader
can tell them apart is the clamp message. Without it, two different mistakes
produce one identical screen.

## A clamp is not a refusal

The module refuses elsewhere. A water cut outside nought to one refuses. A
wetting regime it cannot recognise refuses. A negative H2S partial pressure
refuses. Here it clamps instead, and that is a deliberate difference: a
percentage slightly outside its range is almost always a typing slip on a
quantity whose intent is obvious, and the nearest valid value carries that
intent. The declaration is what stops the convenience becoming a silent
assumption.

## The warning that fires alongside

Separately from the clamps, the corrosion inhibitor warning fires on the
effective shortfall at any efficiency. The trigger, measured by bisecting the
availability at which the warning first appears, is 0.100000 percentage points
of shortfall. That is low enough that essentially any real programme carries the
warning, which is the intended behaviour: the shortfall is the point of the
module and it should not be possible to run a realistic case without being told
about it.

## Where to look for the clamps

The clamps come back on the screening result in their own field rather than
being buried in a paragraph, and the field is empty on a case where nothing was
moved. On the studio's shipped default case that field reports no clamps at
all, which tells the reader that every percentage on the page is the one they
typed. Checking that field before reading the protection figure takes a second
and it removes a whole class of confusion.

## Exercise

Record the effective protection the engine returns for each of the three
clamped cases, and copy out the clamp message that came with each. Then state
which two of the three cases return the same effective protection, and say what
a reader would have to look at to tell those two cases apart.
