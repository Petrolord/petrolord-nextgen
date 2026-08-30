# What this course will not certify

Four things this engine does not do, taught here and graded nowhere.

## Why state it

Because a course that teaches a topic implies it is worth learning, and a course that CERTIFIES a topic implies the learner can produce the answer and that the answer is worth producing. Those are different claims, and this series separates them deliberately.

The go-live migration for this course asserts the separation: it refuses to run if any graded field key names one of the topics below.

## Gyroscopic surveying

The engine implements the ISCWSA MWD magnetic error model. It does not implement the gyroscopic models.

Gyros matter: they are used inside casing where magnetometers cannot work, through the shallow congested section of every platform, at high latitude where magnetic azimuth is poor, and wherever a critical section needs better than magnetic accuracy.

Their error models exist, they are published by the same body, and they have different sources with different propagation. A gyro run's uncertainty cannot be obtained by scaling a magnetic one.

## Multi-station analysis and in-field referencing

Both are named repeatedly in this course as the mitigations that actually reduce the dominant sources, and neither is implemented.

What the engine has is the ability to run with a different parameter set. What it does not have is the ANALYSIS: taking a run of surveys and solving for the interference terms, or ingesting an in-field reference station's record and correcting against it.

So the course can say that these reduce the budget and by roughly how much, and it cannot ask a learner to perform one.

## Relief well ranging

The one case where the object is to intersect. Active and passive magnetic ranging measure the direction and distance to a target well directly, rather than inferring them from two surveys, and they are the technology a blowout relief well depends on.

Entirely absent here, and a different subject.

## Probabilistic collision risk

The separation factor is a screening statistic with agreed thresholds. It is not a probability of collision.

Converting one into the other requires assumptions about the distribution tails that the standard deliberately does not make, and there are published methods that do make them. None is implemented.

The honest position is that this course teaches the industry's screening statistic and its thresholds, and does not teach a collision probability, because the engine does not compute one and a number invented for a course would be worse than no number.

## What this leaves

Survey computation, trajectory design and compilation, the ISCWSA MWD Rev4 position uncertainty model reproduced against its own validation workbook, and anti-collision by the pedal-curve method reproduced against the standard example wells, with the geomagnetic reference underneath all of it checked against its publisher's test values.

That is a working competence in well positioning, and the four gaps above are named so that nobody mistakes it for the whole subject.

## The misconception to avoid

"If the software does not have it, it is not important." Three of the four above are what an operator actually does when a scan comes back at 1.2, and the fourth is what saves a field when a well is blowing out. Their absence from an engine is a statement about the engine.

## Exercise

For each of the four topics, write one sentence on when you would need it and one on what you would do given that this engine does not provide it.

Then say which of the four you would expect to encounter first in a shallow platform drilling campaign.
