# Correlation lines

A correlation line joins the same top across the wells that carry it, in section order, at each well's displayed depth. That is the whole definition, and it is exactly what the engine's `correlationPolyline` builds: for one named top, it walks the wells left to right, looks the top up in each one, and returns a list of points carrying the well index, the well id, and the displayed depth. Wells that do not have the top are skipped, which is the subject of the next lesson.

The line is not decoration. It is the interpreter's assertion, drawn in public, that these picks are the same surface. Every line on a section is a claim someone is accountable for. When a reviewer disagrees with a correlation, what they are disagreeing with is a line.

## What the line is drawn on

Two details in the definition do the work.

The first is **section order**. The polyline connects well 1 to well 2 to well 3 to well 4 in whatever order the section lays them out, not in order of depth and not in order of name. Reordering the wells reshapes every line on the section without changing a single pick.

The second is **displayed depth**, not measured depth. The point for each well sits at that well's measured depth plus that well's shift. In the structural view every shift is zero, so displayed equals measured. Under flattening the shifts differ from well to well, so the same set of picks produces a completely different line. Same data, same assertion, different picture.

## The structural view: the line is the structure

In the structural view, TOP_SAND runs 1548, 1565, 1541, 1590 across wells 1 to 4. Plot those and the shape you see is the structure itself, because nothing has been added to or removed from the true depths.

Read it left to right. TOP_SAND drops 17 m from Ekene-1 to Ekene-2, since 1565 minus 1548 is 17. It then rises 24 m into Ekene-3, since 1565 minus 1541 is 24, making Ekene-3 the structurally highest well on this top. It drops 49 m into Ekene-4, since 1590 minus 1541 is 49, making Ekene-4 the lowest. The full relief on TOP_SAND across the section is 1590 minus 1541, which is 49 m.

That is the reading that matters for trapping and fluid contacts. In the structural view the line's shape **is** the structure, so any structural statement you want to make should be made from this view and no other.

## The flattened view: the datum line goes flat

Now hang the section on TOP_SAND at a datum of 1500, which is the capstone view. The TOP_SAND correlation line becomes dead flat, every well at exactly 1500, because that is precisely what the shifts were computed to achieve. It carries no information at all. A flat datum line is a construction, never an observation, and reading structure off it is the single most common misuse of a flattened section.

The other lines are where the value is. They no longer show structure. They show geometry relative to the datum surface, which is close to what the layers looked like when the datum was deposited.

TOP_A in the flattened view sits at 1452, 1447, 1454 and 1440 across wells 1 to 4. Every one of these is 1500 minus the well's TOP_A to TOP_SAND interval, which is 48, 53, 46 and 60 m respectively. So the flattened TOP_A line is a direct picture of how thick the section above the sand is in each well: the deeper the flattened line sits, the thinner that interval. Ekene-3 sits deepest at 1454 and has the thinnest interval at 46 m. Ekene-4 sits shallowest at 1440 and has the thickest at 60 m. The spread is 1454 minus 1440, which is 14 m.

## BASE_SAND flattened: the thickness story made visual

The most useful line in the capstone view is BASE_SAND. Flattened, it sits at 1532, 1536, 1529 and 1525 across wells 1 to 4.

Because TOP_SAND is pinned at 1500 everywhere, each of those numbers minus 1500 is exactly that well's gross SAND thickness: 32, 36, 29 and 25 m. The line is the thickness plot. You do not need to compute anything to read the trend, you only need to look at which way the line bends.

It sits lowest under Ekene-2, at 1536, and Ekene-2 has the thickest sand at 36 m. It sits highest under Ekene-4, at 1525, and Ekene-4 has the thinnest sand at 25 m. Between them the line descends from Ekene-3 at 1529 through Ekene-1 at 1532 to the low point at Ekene-2, then climbs sharply to Ekene-4.

That is the same story the arithmetic told in the previous lesson, thickening toward Ekene-2 and thinning into Ekene-4, but now it is a shape you can point at in a meeting. This is the reason flattening exists. Structure hides thickness variation inside a set of depths that all differ for a different reason. Flattening removes the structural component and leaves the thickness variation as the only thing the line can be describing.

Try it yourself: the panel below draws the Ekene section from the same engine, with the datum under your control.

{{panel:wc-section-explorer}}

## Exercise

Using the flattened BASE_SAND depths of 1532, 1536, 1529 and 1525, and the fact that TOP_SAND is flat at 1500, recover the gross SAND thickness for each of the four wells without looking at the structural depths. Then say which view you would use to argue that Ekene-4 is the structurally lowest well on TOP_SAND, and why the other view cannot support that argument.

Self-check: 1532 - 1500 = 32, 1536 - 1500 = 36, 1529 - 1500 = 29, 1525 - 1500 = 25, matching the structural results exactly. The structural view supports the structural argument, because TOP_SAND there reads 1548, 1565, 1541, 1590 and Ekene-4 is deepest. The flattened view cannot, because its TOP_SAND line was forced flat at 1500 by construction and carries no structural information.
