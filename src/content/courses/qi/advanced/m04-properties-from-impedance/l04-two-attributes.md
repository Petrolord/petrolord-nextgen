# Two attributes, impedance and Vp/Vs

On AI (acoustic impedance, Vp x density) alone the oil sand and the brine sand overlap. The Associate tier showed why a second attribute should help: taking the Ekene-1 oil leg to brine raised both its mean AI and its mean Vp/Vs, so the fluid moves both, and a second attribute gives the model a second direction in which the sands can differ. A two-attribute facies model fits one Gaussian density per facies in the plane of AI and Vp/Vs, from the same labelled samples and the same stated rules as the previous lesson.

## What the second attribute buys

| model | share correct on its own samples |
| --- | --- |
| AI alone | 0.934872 |
| AI and Vp/Vs | 0.973443 |

| AI | Vp/Vs | P(shale) | P(oil sand) | P(brine sand) |
| --- | --- | --- | --- | --- |
| 6600000.000000 | 1.750000 | 0.000000 | 0.997373 | 0.002627 |
| 6600000.000000 | 2.000000 | 0.000000 | 0.000000 | 1.000000 |

At AI 6600000 the one-attribute model called brine sand with 0.557911 and oil sand 0.442088, close to a coin toss. With Vp/Vs added, the same AI is oil sand at 0.997373 when Vp/Vs is 1.750000 and brine sand at 1.000000 when it is 2.000000. The second attribute decides a point the first could not, almost to certainty, which is a reason to ask how well Vp/Vs is known where the model is applied.

The share correct rises from 0.934872 to 0.973443. That rise looks modest because shale, which AI already separates, makes up most of the samples; the next lesson reads the confusion matrices row by row, where the change for the oil sand is large.

## Where Vp/Vs comes from on a map

These posteriors are at log scale, on measured Vp, Vs and density. On a map, Vp/Vs comes from the simultaneous inversion, and the blind wells of the simultaneous inversion module scored it per parameter:

| well | blind AI correlation | blind Vp/Vs correlation | blind Vp/Vs error percent |
| --- | --- | --- | --- |
| Ekene-1 | 0.863789 | 0.470296 | 10.707173 |
| Ekene-2 | 0.854299 | -0.287516 | 15.482932 |
| Ekene-3 | 0.847660 | 0.360220 | 12.979404 |
| Ekene-4 | 0.780557 | -0.132709 | 12.786564 |

AI correlates well at every well; Vp/Vs does not, and it correlates negatively at two wells. The separation the two-attribute model shows on logs depends on a Vp/Vs that the inversion recovers poorly on the Ekene pack. The course prints no seismic-scale test of the facies model, so a study that classifies inverted attributes says plainly that its posteriors and its share correct were measured on logs at the wells, and quotes the blind Vp/Vs figures beside any facies map built on them.

## The choices stay stated

The cut-off, the contact, the labels, the priors and the attributes are inputs, each stated in the report beside the model it built. A second attribute changes the model's shape: each facies now has a mean and a spread in two dimensions, and a correlation between them. More attributes give the model more to separate with, and more figures to fit from the same 179 oil-sand samples.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, set View to "Bayesian facies and the confusion matrix" and Data to "Ekene teaching pack", with "Net sand Vsh cut-off (stated)" at 0.350000, "Priors (stated)" at the samples' proportions and "Density per facies (stated)" at Gaussian. Read the Share classified correctly tile with "Attributes (stated)" at AI, then at AI and Vp/Vs. Set "AI to classify at, kg/(m2 s) (stated)" to 6600000 and "Vp/Vs to classify at (stated)" to 1.750000, then 2.000000, and read the posteriors; step Vp/Vs between them and record where the most likely class changes. Write one sentence on what a blind Vp/Vs correlation near zero would do to that boundary on a map.
