# Field and well vectors

The naming scheme is systematic, and once you can decode a name you can read a results file you have never seen.

## The scheme

First letter is the scope. F for field, W for well, G for group, R for region, B for a single block.

Then the quantity. OPR oil production rate, OPT oil production total, WPR water production rate, WCT water cut, GOR gas-oil ratio, BHP bottom-hole pressure, PR pressure, WIR water injection rate, WIT water injection total.

A trailing H means the observed value rather than the simulated one.

So FOPT is field oil production total, WBHP is well bottom-hole pressure, and FWCTH is the observed field water cut.

## What Ekene's deck requests

At field level: FOPR, FOPT, FWPR, FWCT, FGPR, FGOR, FPR, FWIR, FGIR, FWIT, FGIT.

Per well: WOPR, WWPR, WGPR, WBHP, WWCT, WWIR, WGIR.

Plus the observed counterparts at both levels, because the deck carries a history.

## What each is good for

**FOPT and FOPR** are the headline. Cumulative oil is what the study exists to forecast and the rate is how it gets there.

**FPR** is average field pressure. It is the single best indicator of whether the material balance is behaving, and comparing it against the tank model's pressure track is one of the strongest cross-checks available on this field, because the Material Balance course produced exactly that series independently.

**FWCT** is field water cut, which is the economic limit in a waterflood. A forecast that does not show water cut is not showing the constraint that will end the field's life.

**WBHP** is the one people forget and need most. It tells you whether a well was on rate control or on its pressure limit, and without it a well that fell short of target is unexplained.

**WWCT per well** is where a flood's problems appear first. A field water cut is an average over wells that are behaving very differently, which is precisely the lesson the waterflood course built its whole Professional tier on.

## Reading a rate against a total

Both are requested for oil at field level, and having both is a free consistency check.

Difference FOPT between two steps, divide by the interval, and compare against FOPR. They should agree closely. A systematic disagreement means the rates are being read as instantaneous or the step lengths are being taken from the wrong place.

## What a region vector would add

Ekene's deck does not request any, and on a bigger study they are the most useful vectors in the file.

A region is a set of cells, and region vectors give oil in place, pressure and production by region. That is how you answer "where did the oil come from" and "which compartment is depleting", which no field-level vector can.

Defining regions is a GRID-section job and it is cheap. A study that expects to ask that question should define them before the first run rather than after.

## The misconception to avoid

"Field vectors summarise the well vectors." They aggregate them, which is not the same. A field water cut of 30 percent can be four wells at 30 or two wells at 5 and two at 55, and those are entirely different floods with entirely different remedies. Aggregate vectors hide exactly the variation that decides what to do.

## Exercise

First, decode these without a table: FGIT, WWCT, FPR, WOPRH.

Second, a producer fell short of its target for six months. Name the two vectors you would plot together and describe the pattern that would confirm pressure limitation.
