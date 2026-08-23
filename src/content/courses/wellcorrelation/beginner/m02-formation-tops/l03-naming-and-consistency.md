# Naming and consistency

A correlation only works when the same surface carries the same name in every well. That sentence sounds like clerical advice. It is actually the load-bearing rule of the whole subject, because the name is the only thing tying one well's pick to another's.

## Names are the correlation

Recall the data shape: each well holds a list of name-and-depth entries, and nothing in that list says anything about other wells. There is no field for "this is the same as the pick in Ekene-2". The only link is that both entries spell the name identically.

So when you write `TOP_SAND` into a fourth well, you are not labelling a pick. You are asserting a correlation, and the software will act on that assertion without questioning it. Naming is the act of correlating. It deserves the same care as the pick itself.

## What drift does to a section

Suppose an interpreter picks `TOP_SAND` in Ekene-1, Ekene-2 and Ekene-3, then comes back after a week, opens Ekene-4, and types `SAND_TOP`. Same rock, same surface, same intention, two characters transposed.

The result is not an error message. It is two surfaces.

The section now believes there is a surface called `TOP_SAND` present in three wells and a separate surface called `SAND_TOP` present in one. Neither is complete. Both draw as correlation lines, both appear in the pick list, and the section shows five surfaces where the geology has four. Worse, the picture is internally consistent: the `TOP_SAND` line reaches three wells and stops, which looks exactly like a surface that genuinely pinches out or is faulted away, and the lone `SAND_TOP` looks like a local marker nobody else picked.

This is the failure mode to fear, because it is quiet. A typo does not produce nonsense. It produces a plausible alternative geology.

Related drift is just as damaging and harder to spot: trailing spaces, case changes such as `Top_Sand` against `TOP_SAND`, and version suffixes such as `TOP_SAND_v2` appearing in some wells and not others. Matching is exact. Anything that is not character-for-character identical is a different surface.

## The engine's view

The section engine makes this visible almost immediately, which is the one mercy here.

Before it can draw anything, the engine gathers the distinct top names present across the whole section, in the order it first meets them, and offers that list as the set of correlatable surfaces. Every name in the list becomes a candidate for a correlation line, a datum, or a zone boundary. Nothing filters it; the list is simply whatever names exist in the data.

That means a typo becomes a phantom surface the moment it enters the data. You do not discover it three steps later when a thickness comes out wrong. You see it in the surface list, usually sitting right beside the real one in first-seen order because it came from the same interval. Reading that list before you start interpreting is one of the cheapest quality-control habits in the workflow. Count the names. If there are more names than surfaces you believe in, you have a naming problem, not a geology discovery.

## The Ekene set is deliberately clean

The teaching data has exactly four distinct top names: `TOP_A`, `TOP_SAND`, `BASE_SAND` and `TOP_B`. Every well uses them identically, spelled the same way, meaning the same surface. There is no drift to find.

That is a teaching choice, not a claim about the world. You get to learn what a healthy tops table looks like before you have to diagnose a sick one. Fix the healthy picture in your mind now: four surfaces in the geology, four names in the data, and a surface list of length four when the engine gathers them. Any real dataset that departs from that pattern is telling you something, and it is usually telling you about the database rather than about the rocks.

## The ordering convention

Names carry one more piece of meaning beyond identity: relative position. In this dataset `TOP_SAND` is above `BASE_SAND` in every well, and that ordering holds by convention across the whole section, not merely by accident in one or two wells.

Check it in the numbers. Depth increases downward, so above means a smaller measured depth. Ekene-1 has `TOP_SAND` at 1548 and `BASE_SAND` at 1580. Ekene-2 has 1565 and 1601. Ekene-3 has 1541 and 1570. Ekene-4 has 1590 and 1615. In all four, the top pick is shallower than the base pick, and subtracting gives a positive gross thickness: 32, 36, 29 and 25 m.

Now imagine a well where the two were entered the wrong way round, base above top. Subtract in the same order and you get a negative thickness. There is no rock with negative thickness. A negative number there is a quality-control signal, telling you that the two entries have been swapped, or mislabelled, or that one of them was picked on the wrong event entirely. It is a message about the data, never about the geology.

Software will not always shout about it. Some routines quietly sort the pair so the shallower one is treated as the top, which produces a positive number and hides the mistake. The defence is yours: scan your zone thicknesses, and treat any negative or absurd value as a data fault to be traced back to the tops table before anything else is believed.

## Exercise

Write out the four top names in the Ekene section, then compute the gross sand thickness in each of the four wells and confirm all four are positive.

Self-check: the names are `TOP_A`, `TOP_SAND`, `BASE_SAND` and `TOP_B`, four in total. The thicknesses are 1580 minus 1548 equals 32 m in Ekene-1, 1601 minus 1565 equals 36 m in Ekene-2, 1570 minus 1541 equals 29 m in Ekene-3, and 1615 minus 1590 equals 25 m in Ekene-4. All positive, which confirms the ordering convention holds in every well.

Second self-check: if one well had `SAND_TOP` instead of `TOP_SAND`, how many surfaces would the engine offer? Five, because it gathers distinct names and has no way to know two of them mean the same rock.
