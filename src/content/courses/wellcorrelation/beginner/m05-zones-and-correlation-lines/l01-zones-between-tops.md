# Zones between tops

A top on its own is a single depth. Two correlated tops together define something you can measure, fill with colour, map, and eventually book: a zone. A zone is the interval between two correlated tops, and it takes its identity from the two surfaces that bound it. There is no separate zone object hiding in the data. Delete one of the bounding tops and the zone stops existing.

This is why naming discipline from the previous modules pays off here. If TOP_SAND means the same surface in every well, then the interval below it means the same thing in every well too, and the numbers you extract from that interval are comparable. If the top names drift, the zone drifts with them and every thickness you quote is quietly wrong.

## The zone of interest in this course

The Ekene section carries four correlated tops: TOP_A, TOP_SAND, BASE_SAND and TOP_B. The zone this course cares about is the one between TOP_SAND and BASE_SAND. Everything from here to the capstone refers to it as the SAND zone, meaning the interval from TOP_SAND down to BASE_SAND in whichever well you are looking at.

Notice the convention in the names. BASE_SAND is a top in the data model, in the sense that it is a named picked surface with a measured depth, even though geologically it marks the bottom of a unit rather than the beginning of one. Software treats every picked surface the same way. It is the interpreter who decides which pairs bound a zone.

## How the engine reports a zone

The Well Correlation engine exposes a zone through `zoneSpan`, which takes one well, that well's flattening shift, the name of the upper bounding top and the name of the lower one. What comes back is one of two things.

Either it returns a span, an object with a `top` and a `base`, both expressed in **displayed** depth for the current view. Or it returns `null`, which happens whenever either bounding top is missing in that well. There is no third case, no partial zone, no zone that has a top but trails off without a base. The rule is simple and worth memorising: two tops or nothing.

The `null` case matters more than it sounds. A well that has TOP_SAND but not BASE_SAND contributes no SAND zone at all. Its column on the section shows no fill and no thickness. That is the honest answer, because a zone with one end unknown has no measurable extent. You will meet the same principle in the last lesson of this module, where a correlation line that cannot reach a well simply stops.

## Ordering is guaranteed

The span always comes back with `top` above `base`, meaning the smaller displayed depth is in `top` and the larger is in `base`. The engine enforces this rather than trusting the order the tops were entered in.

The practical consequence is that a zone fill can never come back inverted. A well whose picks were entered upside down, with BASE_SAND shallower than TOP_SAND, does not produce a negative fill or a shape drawn backwards on screen. It produces a span that looks ordinary, which means the mistake shows up as a quality control problem rather than as a drawing artefact. You catch it by looking at the thickness alongside its neighbours and asking why one well disagrees, not by spotting a graphical glitch.

That is a deliberate design choice, and it is the right one. Display code should not be the place where data errors surface. Ordering guarantees keep the picture sane so that the numbers can carry the argument.

## Worked example: the SAND zone in two views

Take the capstone flattened view, where TOP_SAND is hung on a datum of 1500. In that view the SAND span for Ekene-1 comes back as top 1500, base 1532. For Ekene-4 it comes back as top 1500, base 1525. Both wells start their sand at exactly 1500 because that is what flattening on TOP_SAND does.

Now switch the same section to the structural view, where every shift is zero and displayed depth equals measured depth. The same two zones report as 1548 to 1580 for Ekene-1 and 1590 to 1615 for Ekene-4. Nothing about the wells changed. Only the view did.

Compare the pairs and one thing stands out. In the flattened view the two zones share a top. In the structural view they are 42 m apart at the top, since 1590 minus 1548 is 42. But run the subtraction within each well and the answer is the same in both views. Ekene-1 gives 1532 minus 1500 in the flattened view and 1580 minus 1548 in the structural view, and both come to 32. Ekene-4 gives 1525 minus 1500 and 1615 minus 1590, and both come to 25.

The span moves with the view. The thickness does not. That single sentence is the bridge into the next lesson, where thickness gets treated as the quantity it is, a property of the rock rather than a property of the picture.

## Exercise

Using the structural depths for Ekene-2, TOP_SAND at 1565 and BASE_SAND at 1601, write down the SAND span the engine would return in the structural view, then write down what it would return in the capstone flattened view where Ekene-2 carries a shift of -65. Then state what the engine returns for a hypothetical well that has TOP_SAND picked but no BASE_SAND.

Self-check: structural span is top 1565, base 1601. Flattened span is top 1500, base 1536, since 1565 minus 65 is 1500 and 1601 minus 65 is 1536. For the well missing BASE_SAND the engine returns null, and that well shows no SAND fill at all.
