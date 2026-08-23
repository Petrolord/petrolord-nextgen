# Lines that stop short

Not every correlation line reaches every well. On the Ekene section, three of the four tops are picked in all four wells, but TOP_B is picked in Ekene-1, Ekene-2 and Ekene-3 only. Ekene-4 has no TOP_B at all.

The engine's behaviour here is one line of logic and no ceremony. `correlationPolyline` walks the wells in section order, looks the top up in each, and when the lookup returns null it simply skips that well. No placeholder point is created. No gap is filled. The TOP_B line therefore reaches **3 wells and not 4**, and that count of 3 is one of the six numbers the capstone asks you to reproduce.

## Why skipping is the honest behaviour

There are two tempting alternatives, and both are wrong.

The first is to draw through, extending the line across Ekene-4 to whatever comes next. On this section there is nothing after Ekene-4, but on a longer section there would be, and a line drawn through a well would be a visual assertion that TOP_B was picked there. It was not. Drawing through asserts a pick nobody made.

The second is to interpolate, placing a point in Ekene-4 at some depth estimated from the neighbours. This looks more scientific and is arguably worse, because it produces a specific number that can be read off, quoted, and eventually used. You can do the estimate yourself: TOP_B sits 60 m below BASE_SAND in Ekene-1, since 1640 minus 1580 is 60, 61 m below in Ekene-2, since 1662 minus 1601 is 61, and 58 m below in Ekene-3, since 1628 minus 1570 is 58. Add about 60 to Ekene-4's BASE_SAND at 1615 and you get about 1675. That is a reasonable geological expectation and it is not a pick. Typing it into the tops table converts an expectation into data, and by next week nobody will remember which it was.

Skipping keeps the two categories apart. What was observed is on the section. What was inferred stays in the report, labelled as inference.

## How to report a partial line

The reporting rule is short: quote the well count alongside any statistic derived from a partial line.

TOP_B relief across the Ekene section is 34 m, from 1662 in Ekene-2 down to 1628 in Ekene-3, since 1662 minus 1628 is 34. But that 34 m is a **three-well** number. It describes the relief among the wells that have the top, and it says nothing about what TOP_B does under Ekene-4. Compare it with TOP_SAND relief, which is a four-well number, and the two are not the same kind of quantity even though they share the same units.

So write it as "TOP_B relief 34 m over 3 wells", not "TOP_B relief 34 m". The extra two words carry the entire caveat. Anybody who then wants to know about Ekene-4 knows immediately that they have to go and look rather than assume it was covered.

The same caution applies to statistics computed off a flattened section. In the capstone view TOP_B displays at 1592, 1597 and 1587, and the difference between the extremes there is 10 m, not 34. That is not a contradiction. Relief is a structural quantity and must be quoted from the structural view, exactly as the previous lessons argued. The flattened spread of 10 m describes relative geometry with respect to TOP_SAND, and it is a three-well number too.

## Why a line stops

There are at least four reasons a top can be missing, and they have very different geological meanings.

* **The well is too shallow.** The hole reached total depth above the surface, so the surface was never drilled. Ekene-4 is this case. Its deepest pick is BASE_SAND at 1615, and TOP_B is expected well below that.
* **The section is faulted out.** A fault has cut out the interval containing the top, so the surface exists nearby but not in this wellbore.
* **The section is eroded.** The surface was deposited and then removed before the overlying section arrived, or never deposited at all in this location.
* **It has simply not been picked yet.** The data is there, the interpreter has not got to it, and the gap is bookkeeping rather than geology.

Only the first of these is knowable from this section alone. If a well's logs end above the depth where the top should be, the absence is explained by the well, and you can say so with confidence. The other three require evidence the section does not carry: a fault interpretation, a seismic or biostratigraphic control, or a look at the interpreter's work list. Absence of a top is never by itself evidence of a fault or an unconformity. It is evidence that the top is absent, and the reason is a separate question.

For Ekene-4 the answer is available and it is the dull one. The well ended above TOP_B. Nothing structural or stratigraphic needs to be invoked, and invoking something would be a mistake.

## The rule to carry forward

A line that stops short is information. It tells you which wells constrain a surface and which do not, and that distinction propagates into every map, every thickness and every volume built downstream. The gap is doing useful work exactly by being visible.

Closing it by hand is the most common way beginners fabricate geology. It happens with good intentions, usually to make a figure look finished, and the fabricated point is indistinguishable from a real one within a day of being entered. Leave the line short. Say how many wells it reaches. Let the gap be part of the answer.

## Exercise

Ekene-4 has no TOP_B, and its deepest pick is BASE_SAND at 1615. State how many wells the TOP_B correlation line reaches, write the TOP_B relief in a form that a reviewer could not misread, and say which of the four reasons for a missing top is supported by this section and why the other three are not.

Self-check: the line reaches 3 wells. The relief should be quoted as 34 m over 3 wells, computed as 1662 minus 1628. The supported reason is that the well is too shallow, because its logs and picks end above the depth where TOP_B would be expected. Faulting, erosion and simply not yet picked would each need evidence from outside this section, so none of them can be claimed from the section alone.
