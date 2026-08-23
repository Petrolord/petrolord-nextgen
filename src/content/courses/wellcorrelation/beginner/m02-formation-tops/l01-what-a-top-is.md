# What a top is

A formation top is a named depth in one well marking where an interpreter believes a particular surface is penetrated. Everything else in this course, the correlation lines, the zones, the flattened sections, is built out of tops. So it is worth being precise about what one actually is before we start drawing lines between them.

## The three things a top always carries

Strip a top down and only three pieces of information survive.

* **A name.** Something like `TOP_SAND`. The name is the claim that this depth in this well is the same surface as the depth carrying the same name elsewhere.
* **A well.** A top belongs to exactly one well. There is no such thing as a top floating free of a borehole; that is a horizon or a mapped surface, which is a different object built later from many tops.
* **A measured depth.** A single number, in metres along hole in this course, telling you where in that well the surface was penetrated.

Take one row from the Ekene section: Ekene-1 carries `TOP_SAND` at 1548 m. Name, well, depth. That is a complete top. Nothing about thickness, nothing about what the rock is, nothing about how confident the picker was. Those things live elsewhere, or nowhere.

## A top is an interpretation, not a measurement

This is the point beginners most often skip, and it matters more than anything else in this lesson.

A gamma ray reading of 42 API at 1549 m is a measurement. An instrument produced it, and if you ran the same tool down the same hole tomorrow you would get very nearly the same number. A top is not like that. When someone writes `TOP_SAND` at 1548 m in Ekene-1, they are stating a belief: that the log character at that depth marks the entry into a particular sand body, and that the boundary sits at 1548 rather than 1547 or 1551.

Two competent interpreters looking at the same logs can pick the same surface a metre or two apart, and both can be defensible. A third might decide the sand is a stacked pair and pick two tops where the others picked one. None of them is reading a number off a dial. They are each making an argument about geology and recording it as a depth.

The practical consequences follow directly. Tops are versioned, because they change as understanding changes. Tops are attributable, because it matters who picked them and when. And tops are challengeable, because a correlation that rests on a weak pick is a weak correlation, no matter how confidently the line is drawn on the section.

## A name is not automatically a correlation

Here is the second trap. Two wells both carry a top called `TOP_SAND`. Are they the same surface?

Not necessarily. The name asserts it. The name does not prove it. Somebody, at some point, has to have looked at both wells and decided that the sand at 1548 m in Ekene-1 and the sand at 1565 m in Ekene-2 are the same body of rock, deposited at the same time, now sitting at different depths because of structure. That decision is the correlation. The shared name is just how the decision is recorded.

When you inherit a tops database from a previous study, you are inheriting someone else's correlations, expressed as names. If they were careless, the names will tie together surfaces that have no business being tied together, and every section built on that will carry the error forward silently. The section will still look tidy. Tidiness is not evidence.

In the Ekene set the correlations are already made and made carefully. `TOP_SAND` in all four wells genuinely is one surface, deliberately arranged so you can learn the mechanics without fighting the geology at the same time.

## The data shape in this course

Now the concrete part. In this course a well holds a list of top entries, and each entry has exactly two fields: a name and a measured depth in metres. In the teaching fixture that looks like a list of `{ name, md_m }` records hanging off each well, alongside the well's id and display name.

That shape is not an illustration invented for the lesson. It is exactly what the section engine reads. When the engine needs the depth of a top in a well, it walks that well's list, finds the first entry whose name matches, and returns its `md_m`. If no entry matches, it returns nothing at all, which is a case we will come back to in the fourth lesson of this module.

So the whole apparatus of correlation, every line, every zone fill, every flattening shift, is driven by name matching over a flat list of name-and-depth pairs, one list per well. Understanding that keeps you honest about what the software can and cannot know. It knows the name and the number you gave it. It does not know whether you were right.

## Exercise

Without looking back at the tops table, write down the three pieces of information a formation top must carry, then state in one sentence why a top is an interpretation rather than a measurement.

Self-check: the three are a name, a well, and a measured depth. A top is an interpretation because it records an interpreter's belief about where a surface is penetrated; two competent interpreters can pick the same surface at different depths from the same logs, whereas a log measurement is reproduced by the tool.

Second self-check: given that Ekene-1 carries `TOP_SAND` at 1548 m and Ekene-2 carries `TOP_SAND` at 1565 m, what makes those two the same surface? The answer is not the shared name. It is that an interpreter correlated them and recorded the decision by giving them the same name.
