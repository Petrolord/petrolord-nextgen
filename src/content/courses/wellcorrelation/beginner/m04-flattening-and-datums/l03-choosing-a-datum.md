# Choosing a datum

The arithmetic of flattening has no opinions. Give it any top and any depth and it will produce shifts. Choosing which top to flatten on is where the geology comes back in, and it is a genuine interpretation decision with consequences for what the panel can and cannot tell you.

Three criteria matter, in this order.

**Present in all, or nearly all, of the wells.** A datum top that half the section lacks flattens half the section. The wells that carry it line up; the rest do not, and you are reading a panel that is partly flattened and partly not.

**Reliably picked.** The datum pick is the anchor for everything else in that well. A pick you are unsure of by 10 m will move every other surface in that well by 10 m on the display. Prefer a top with a crisp, unambiguous log signature over one you argued with yourself about.

**Geologically meaningful for the question asked.** Flattening on a surface is a statement that this surface was, near enough, a level reference at some moment in time, and that you want to see the section as it stood relative to that moment. A marine flooding surface or a widespread shale is a defensible reference. A pick chosen only because it was easy to see is not.

## The two settings this course uses

**Flatten on TOP_SAND at 1500 m** is the capstone view. Its question is: how do the reservoir and the surfaces below it behave once the sand is levelled. Levelling the top of the sand puts all four sand bodies on a common line so the sand itself, and the TOP_B interval beneath it, can be compared without structural depth in the way. The shifts, from lesson two, are $-48$, $-65$, $-41$ and $-90$, and the displayed section spans 1440 to 1597 m.

**Flatten on TOP_A at 1450 m** is the growth view used at the Professional tier. Its question is about the interval between TOP_A and the sand: does it thicken systematically across the section, which is the classic signature of sediment filling accommodation as it was created. The four TOP_A picks are 1500, 1512, 1495 and 1530 m in wells 1 through 4, so:

* Ekene-1: $1450 - 1500 = -50$
* Ekene-2: $1450 - 1512 = -62$
* Ekene-3: $1450 - 1495 = -45$
* Ekene-4: $1450 - 1530 = -80$

Apply each to that well's TOP_SAND and the sand tops display at 1498, 1503, 1496 and 1510 m. Read those four numbers as a group. TOP_SAND is no longer flat, and it should not be: the datum is now above it, so what you see below the datum line is the thickness of the TOP_A to sand interval, which runs 48, 53, 46 and 60 m across the section. Ekene-4 carries the thickest interval and its sand top hangs 14 m lower on the panel than Ekene-3's, which is precisely the difference between 60 and 46. The displayed section spans 1450 to 1600 m.

Same wells, same picks, same engine. Two datums, two different questions answered.

## When a well lacks the datum top

This is the hard case, and the engine's behaviour is worth knowing exactly. A well that has no pick for the datum top cannot be flattened on it, because there is no $md(top)$ to subtract from the datum. The engine does not guess, does not interpolate from the neighbours, and does not quietly drop the well. It returns a null shift for that well, marks it as lacking the datum top, and draws it at true measured depth with a flag on the panel.

That is the right behaviour and it puts the decision back on you. A well hung at true depth beside three flattened neighbours is not comparable to them, and the flag exists so nobody mistakes it for one. Your options are to pick the missing top if the logs support it, to choose a different datum that all the wells carry, or to keep the well on the panel and read it as the exception it is.

On the Ekene section all four wells carry TOP_A, TOP_SAND and BASE_SAND, so any of those three makes a clean datum with no flagged wells. TOP_B does not qualify, because Ekene-4 has no TOP_B pick. Flatten on TOP_B and Ekene-4 sits at true depth, flagged, while the other three line up around it. That is not a broken section, but it is a section with an asterisk on one well, and you would need to say so out loud every time you showed it.

## Exercise

Suppose you wanted to compare the BASE_SAND to TOP_B interval across the Ekene section and chose to flatten on BASE_SAND at 1550 m. Compute the four shifts, then say which wells the comparison can actually cover.

Self-check: the BASE_SAND picks are 1580, 1601, 1570 and 1615 m, so the shifts are $1550 - 1580 = -30$, $1550 - 1601 = -51$, $1550 - 1570 = -20$ and $1550 - 1615 = -65$. All four wells flatten cleanly, since every well has BASE_SAND. The interval comparison itself covers only Ekene-1, Ekene-2 and Ekene-3, because Ekene-4 has no TOP_B to measure down to.
