# The refusal, and the liner count it names

Past the envelope the cut size gets worse and the module keeps answering. Push further and it stops answering, and how it stops is worth studying on its own.

{{panel:pw-device-explorer}}

## Where it stops

Past 2 times design the module stops answering, because the pressure drop and the shear decide the answer there and this model does not carry them. It refuses in its own words, and the refusal names the input it was given:

these 115 liners each carry 1.200e-3 m3/s, 2.00 times their 0.0006 m3/s design flow: this module holds a liner bank to 2 times design, because past it the pressure drop and the inlet shear decide the answer and this model does not carry them. 231 liners would run this flow at its design point

Read what is in that sentence. The liner count it was given. The flow each one is carrying. The turndown that produces. The declared design flow it was judged against. The reason the limit exists. And then the useful part: the bank that WOULD run this flow at its design point, 231 liners.

## A refusal that hands back a design

A one line bank on the same flow refuses the same way and names the same 231 liners, because that count is a property of the flow rather than of the bad input. A user who typed a number far too small gets told what a sensible number would have been.

That is the difference between a refusal and a bare error. This one says what was wrong, what it was judged against, why the limit is there, and what to type instead.

## The other end of the envelope

A starved bank is a different case, and the module treats it differently on purpose. At 0.328595 of design it still ANSWERS, with a cut of 8.289060 micron and a warning:

these liners run at 0.33 of their design flow: below about 0.5 the centrifugal field collapses with the square of the flow and the cut size degrades fast, so shut liners in rather than running them all starved

## Two warnings that say different things

The starved warning and the overload warning are different statements, and reading them as one thing loses most of their value.

STARVED is advice about how to run the bank you have. The cut is honest, the equipment is oversized for today's flow, and the fix is operational.

OVERLOADED is a statement that the number beside it is getting worse and that the bank is too small. The cut has been penalised, and the fix is capital.

A reader who can tell those apart can tell an operating decision from a purchase order.

## Exercise

Write out each separate fact the 115 liner refusal puts in one sentence, and say which of them a user would need to act on it.

Then say why a starved bank gets a warning and a cut size while an overrun bank past twice design gets neither.
