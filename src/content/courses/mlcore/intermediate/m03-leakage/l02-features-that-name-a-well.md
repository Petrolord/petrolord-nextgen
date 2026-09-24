# Features that name a well

{{panel:ml-validate-explorer}}

Every Ekene well carries four well-level attributes: easting, northing, kb and mudWeight. Each is constant down the well, the same value on all 30 of its rows. Taken together they do one thing very well: they identify the well. No two Ekene wells share all four values, so a model that is given them can tell which well a row came from.

## A path from the well to the prediction

Each Ekene well has its own sonic offset, a block shift of every DT sample in that well. The logs cannot see it: it is not written in the gamma ray, the density or the neutron. A model given the attributes can learn it anyway, because a combination of four numbers that is constant down a well is enough to give each training well its own level.

That is harmless only if the test well's offset was never in training. Under a random-row split it always was. At test fraction 0.3 and seed 5 the random-row split puts rows of all 9 wells on both sides. The model learns each well's offset from that well's training rows, through the attributes, and meets the same offset again in the test rows.

## The Ekene demonstration

`leakageDemo` fits the same least squares model twice, with the same test fraction and seed: once under `randomRowSplit` and once under `groupSplit`. At seed 5, test RMSE in us/ft:

| features | random-row test RMSE | group test RMSE |
| --- | --- | --- |
| the logs alone | 6.030242 | 4.282693 |
| the logs and the four attributes | 5.311723 | 16.999672 |

With the attributes, the random-row split reports 5.311723 us/ft. Scored on three wells it has never seen, the same model reads 16.999672. The random-row figure was measuring how well the model recalls offsets it had already seen.

## Every seed agrees

One seed could be an accident, so the engine runs seeds 1 to 12. Over those 12 seeds, adding the attributes lowers the random-row test RMSE on 12 and raises the group test RMSE on 12. The attributes help on rows of wells the model has seen and hurt on wells it has not, every time.

## Why the attributes extrapolate

Under a group split the test wells' offsets are absent from the training rows. The attribute coefficients were fitted to six training wells and carry those six wells' offsets. The ridge module showed the same thing from the other side: the penalty shrank the attribute coefficients hardest, and the test RMSE on the held-out wells fell from 16.999672 at lambda 0 to 5.759287 at lambda 100.

## What to do with such a feature

A feature constant down a well is not always leakage. A real well attribute can carry real information. The test is whether it survives a whole-well score: cross-validation by wells in the previous module put the logs with the attributes above the logs alone at every lambda up to 100. On these wells the attributes carry identity and nothing more that the folds could find.

## Exercise

Open the random-row against well split view with the seven default features, test fraction 0.3, seed 5, and confirm 5.311723 and 16.999672. Then remove easting, northing, kb and mudWeight and run it again. Step the seed from 1 to 4 with and without the attributes, and write down for each seed which split reads lower.
