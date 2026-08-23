# Picking tops on logs

The previous lesson said a top is an interpreter's belief about where a surface is penetrated. This lesson is about how that belief is formed. Tops are picked off wireline logs, and the craft comes down to three habits: reading log character, choosing markers that are worth following, and picking the same feature the same way in every well.

## Log character

A log curve is a depth-ordered trace of some rock property. Where the rock changes, the trace changes, and those changes are what you pick on. Three signals to recognise immediately:

* **A gamma ray drop.** Gamma ray responds mostly to clay content. A sharp fall from high values to low values as you go down the hole says you have left a shale and entered a clean sand. The reverse, a sharp rise, says the sand has ended.
* **A density shift.** Bulk density steps at lithology boundaries, and it will often mark a surface that gamma ray sees only weakly, a tight streak or a carbonate stringer for example.
* **A resistivity shift.** Resistivity responds to what is in the pore space as well as to the rock, so it can mark a fluid contact as well as a rock boundary. That dual sensitivity makes it powerful and makes it ambiguous.

Good picking uses more than one curve. A boundary that shows on gamma ray, density and resistivity at the same depth is a boundary you can defend. A boundary that shows on one curve only is a hypothesis.

## The marker-bed idea

Not every boundary is worth naming. The ones that earn a name are marker beds: intervals with a distinctive, widespread, easily recognised log character.

Each of those three words is doing work.

**Distinctive** means the character is unusual enough that you will not confuse it with the other similar-looking events in the same interval. A thin bed inside a stack of near-identical thin beds is a poor marker even if it is beautifully sharp, because you cannot be sure which one you are looking at in the next well.

**Widespread** means the bed is present across the area you want to correlate. A local channel sand is real geology but a bad marker, because it disappears three wells over and takes your correlation with it.

**Easily recognised** means you can find it quickly and consistently, including on a bad day with a noisy log. Given a choice between a bold event you can pick in ten seconds and a subtle one that needs careful argument each time, the bold one gives you a more reliable framework, and you can hang the subtle work off it afterwards. A weak marker followed diligently produces a confident-looking section built on nothing.

## Consistency of the pick position

Suppose you have agreed that the top of the clean sand is your marker. There is still a decision left: where exactly on the transition do you put the number?

Real boundaries are rarely knife-edge on a log. There is usually a shoulder, a few metres over which the gamma ray falls from shale values to sand values, partly because the geology is gradational and partly because the tool averages over its own vertical resolution. You could pick the first departure from the shale baseline, the midpoint of the shoulder, or the depth where the curve finally settles at clean sand values. Any of those is a valid convention. Mixing them is not.

If you pick the top of the clean sand in one well and halfway down the shoulder in the next, you have introduced an artificial depth difference of a metre or two that has nothing to do with structure. Do that across a section and you manufacture relief that is not there, or cancel out relief that is. State your convention, then apply it everywhere, including on the well where the shoulder is unusually thick and the convention feels awkward. Consistency is what makes the differences between wells mean something.

## Reading the Ekene sand

On the Ekene section the sand is the obvious pick, and it was built that way on purpose. The gamma ray character is low between `TOP_SAND` and `BASE_SAND` and high outside that interval, in every one of the four wells. There is one clean sand, it is present everywhere, and its boundaries are unmistakable. That is a textbook marker.

Work through two wells. In Ekene-1 the clean interval runs from 1548 m down to 1580 m, so 1580 minus 1548 is 32 m of gross sand. In Ekene-3 the same interval runs from 1541 m to 1570 m, which is 29 m gross.

Two things to notice. First, both wells have the same sand and the same log character, but at different depths, which is structure. Second, the thicknesses are not equal, 32 m against 29 m, which is a real change in how much sand was deposited or preserved. Distinguishing those two effects is most of what the rest of this course is about. For now, note that the comparison is only possible because both picks used the same convention, the top and base of the clean interval, in both wells.

## The honest limitation

In this course the picks are given to you. `TOP_SAND` in Ekene-1 is 1548 m because the teaching fixture says so, and you will not be asked to move it. That separates the arithmetic of sections from the judgement of picking, which is the right way to learn the mechanics.

Real work is not like that. There, the tops table starts empty, or worse, starts full of someone else's picks, and you have to defend every number in it. You will be asked why you put the top at that depth and not two metres deeper, and what you would have to see to change your mind. Read given picks as what a defensible answer looks like, not as a substitute for having one.

## Exercise

Compute the gross sand thickness in Ekene-1 and Ekene-3 from the tops, then say in one sentence why the two numbers can be compared at all.

Self-check: Ekene-1 is 1580 minus 1548, which is 32 m. Ekene-3 is 1570 minus 1541, which is 29 m. They can be compared because the same convention was used for the top and base pick in both wells, so the difference reflects the rock and not the picking.

Second self-check: name the three properties of a good marker bed. Distinctive, widespread, and easily recognised.
