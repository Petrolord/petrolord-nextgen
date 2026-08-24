# What this tier adds

Two tiers have built maps. The Associate tier gridded six TOP_SAND picks into a surface and read a crest of 1539.72 m and a depth of 1542.62 m at prospect P-1. The Professional tier gridded a second surface, subtracted the two, and read a thickness of 34.05 m at the same prospect.

Every one of those numbers is a property of an interpolation, and nothing in either tier asked whether the interpolation is any good.

## The question

A map through six wells honours all six exactly. That is guaranteed by the method and it proves nothing, because a surface that passes through its own control is not thereby a good predictor anywhere else.

The question that matters is the one the map is actually used for: **at a location with no well, how far wrong is it likely to be?**

Prospect P-1 has no well. The 1542.62 m depth and the 34.05 m thickness read there are predictions. This tier measures how much a prediction from this control set is worth, and by the end it produces a number that can be written next to the prospect depth with a plus and a minus sign in front of it.

## The two instruments

**Leave-one-out cross validation.** Remove one well from the control set, grid the remaining five, and ask that surface for a depth at the location of the well you removed. The residual, predicted minus actual, measures predictive skill at a place where the truth is known but was withheld.

**The blind test.** A new appraisal well, Ekene-7, is drilled at (1500, 1500) and finds TOP_SAND at 1549 m. The six-well map already carried a prediction there, made before the well existed. Compare them.

The first is cheap and repeatable and has an honest limitation this geometry exposes immediately. The second is unambiguous and only available once.

## What you will read

Six numbers, all from the validation panel.

- The number of wells that can honestly be **cross validated**, which is 1, and understanding why it is not 6 is the whole of module 2.
- The **leave-one-out residual at Ekene-6**, $+9.8438720703125$ m.
- The **six-well prediction at Ekene-7**, 1543.3271484375 m.
- The **blind residual at Ekene-7**, $-5.6728515625$ m.
- The **crest with Ekene-7 included**, 1540.70556640625 m.
- The **live node count with Ekene-7 included**, 201, which is graded exactly.

Two of the six are graded with no tolerance at all: the cross-validatable count and the live node count. Both are counts, and a count is either right or wrong.

## Three results to carry

**A map cannot validate itself.** Honouring the control is a property of the method. Predictive skill has to be measured by withholding data.

**The honest cross-validatable count is usually small.** On this field it is one of six, and the reason is geometric rather than a failure of technique. Reporting six residuals when five of them were quietly extrapolated is worse than reporting one.

**The residuals are large compared with what the map is being asked to resolve.** The two available residuals are $+9.84$ m and $-5.67$ m against a total structural relief of 49 m across the field. That ratio is the headline of this tier.

## What this tier does not do

It does not improve the map. Nothing here changes the gridding method, the cell size or the mask, and no smoothing or trend fitting is introduced. Validation measures; it does not repair.

It does not produce a statistical model. Two residuals are not a distribution, and this tier is careful about what can and cannot be said with them.

And it does not revisit the isochore. The Professional tier's thickness work stands, and validation here is run on the depth surface where the blind test has a pick to compare against.

## Exercise

State in one sentence why honouring all six wells is not evidence that a map predicts well, then name the two instruments this tier uses and say which of them is repeatable.

As a self-check: honouring the control is guaranteed by the interpolation method rather than earned by it, so a surface that passes exactly through its six wells says nothing about its accuracy at the locations between them, which is where every prediction is actually made. The two instruments are leave-one-out cross validation and the blind test at a new well; the first is repeatable, since it can be run for any well the geometry allows and costs only computation, while the blind test happens once, when the well is drilled.
