# The shift arithmetic

Flattening sounds like a graphics operation. It is not. It is two lines of arithmetic, and if you can do them on paper you can predict every pixel the section engine will draw.

## The two formulas

First, one shift per well:

$$shift = datum - md(top)$$

where $md(top)$ is that well's measured depth for the datum top, and $datum$ is the depth you chose for the datum line. Second, any depth in that well then displays at:

$$displayed = md + shift$$

That is the entire mechanism. The engine computes the shift once per well when you set the datum, then adds it to every measured depth at drawing time: tops, log range ends, zone boundaries, correlation-line nodes. In the structural view the same code runs with every shift set to zero, which is why the structural section is just the flattened section with a null shift.

## Worked for the capstone setting

The capstone view flattens the Ekene section on TOP_SAND at a 1500 m datum. The four sand picks are 1548, 1565, 1541 and 1590 m. Subtract each from 1500:

* Ekene-1: $shift = 1500 - 1548 = -48$
* Ekene-2: $shift = 1500 - 1565 = -65$
* Ekene-3: $shift = 1500 - 1541 = -41$
* Ekene-4: $shift = 1500 - 1590 = -90$

That Ekene-2 value of $-65$ m is one of the six numbers the capstone grades, so make sure you can reproduce it cold. It is not 65, and it is not $1565 - 1500$. The datum comes first in the subtraction.

Every shift here is negative because the datum, 1500 m, is shallower than all four sand picks. Nothing forces that. Set the datum at 1600 m instead and Ekene-1 would take $1600 - 1548 = +52$, sliding down the display. The sign follows entirely from where you put the datum line relative to the picks.

## Applying a shift to another depth

Once a well has its shift, every other depth in that well uses the same number. Ekene-4's BASE_SAND is picked at a true 1615 m and the well's shift is $-90$, so:

$$displayed = 1615 + (-90) = 1525$$

BASE_SAND draws at 1525 m on the flattened panel. That 1525 is the second capstone number in this lesson, and it is worth pausing on what it is not. It is not a depth in Ekene-4. Nothing in that wellbore is at 1525 m. It is a position on a picture whose vertical axis has been redefined, and lesson four is about keeping those two ideas apart.

Two more, for practice with the same shift. Ekene-4's TOP_A is truly at 1530, so it displays at $1530 - 90 = 1440$. Ekene-4's TOP_SAND is truly at 1590, so it displays at $1590 - 90 = 1500$, which is the datum, as it must be.

## Three sanity checks worth teaching

**A negative shift means the column moved up the display.** Depth increases downward, so adding a negative number moves a surface to a shallower displayed depth, which is higher on the panel. Ekene-4 has the largest negative shift of the four, $-90$, so it travels furthest up. That is exactly right: it was the deepest well at the sand, so it had the furthest to come to reach the datum line. If your deepest well moves down instead of up, you have flipped the subtraction.

**The datum top displays at exactly the datum in every well, by construction.** Substitute the first formula into the second for the datum top itself:

$$displayed = md + (datum - md) = datum$$

The measured depth cancels. This is not an approximation and it does not depend on the numbers; it is algebra. So the first thing to check on any flattened panel is that all the datum picks sit on one perfectly flat line at the datum depth. On the capstone view, all four TOP_SAND picks display at 1500, whatever their true depths were.

**Thickness is unchanged, because both ends of an interval shift by the same amount.** Ekene-2's sand is $1601 - 1565 = 36$ m true. Flattened, its top displays at $1565 - 65 = 1500$ and its base at $1601 - 65 = 1536$, so the displayed thickness is $1536 - 1500 = 36$ m. Same answer. The shift appears once with a plus and once with a minus and cancels itself out. Any interval, any well, any datum: the arithmetic is the same and the conclusion is the same.

Those three checks catch nearly every mistake a beginner makes with flattening, and two of them can be done by eye on the panel before you compute anything.

Try it yourself: the panel below draws the Ekene section from the same engine, with the datum under your control.

{{panel:wc-section-explorer}}

## Exercise

Using the capstone datum, TOP_SAND at 1500 m, compute Ekene-3's shift, then use it to find the displayed depths of that well's TOP_A (true 1495 m) and TOP_B (true 1628 m). Then confirm the displayed TOP_A to TOP_SAND interval matches the true one.

Self-check: $shift = 1500 - 1541 = -41$. TOP_A displays at $1495 - 41 = 1454$, TOP_B at $1628 - 41 = 1587$. The displayed interval is $1500 - 1454 = 46$ m and the true interval is $1541 - 1495 = 46$ m, as expected.
