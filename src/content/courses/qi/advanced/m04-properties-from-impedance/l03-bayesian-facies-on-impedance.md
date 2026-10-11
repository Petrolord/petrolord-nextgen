# Bayesian facies on impedance

A transform predicts a number; a facies model predicts a class with a probability. `fitFaciesModel` fits a Gaussian density per facies in attribute space from labelled samples, takes the priors from the samples' proportions unless they are stated, and `faciesPosterior` returns the posterior probability of each facies at a point with the most likely one (Avseth and others 2005, chapter 4). The Facies course teaches Bayesian classification as a subject; this lesson applies it to AI (acoustic impedance, Vp x density) at the Ekene wells.

## The labels are stated

Oil sand is net sand of the Ekene Sand above the oil-water contact, at 5118.110236 ft; brine sand is net sand at or below it; shale is any sample with Vsh above the cut-off of 0.350000 anywhere in the window. Net sand outside the Ekene Sand is left out. Change the cut-off or the contact and every count, mean and posterior below moves.

## The split is heavily shale

| facies | samples | prior | mean AI | standard deviation of AI |
| --- | --- | --- | --- | --- |
| shale | 2519 | 0.796396 | 4909101.931291 | 286846.678563 |
| oil sand | 179 | 0.056592 | 6861912.039477 | 531684.159516 |
| brine sand | 465 | 0.147012 | 7275309.641738 | 504572.278546 |

The pack's logs cover the Ekene Sand and the shale above it, so shale dominates the labelled samples and its prior is 0.796396. The oil-sand prior, 0.056592, is the smallest of the three. These priors describe the logged window at four wells; they say nothing about how much of a prospect is oil sand, and a study that keeps them states where they came from.

Shale sits far below both sands in AI, with a narrow spread, so shale and sand separate cleanly on AI alone. The two sands do not. The oil-sand mean is below the brine-sand mean, as substitution predicts, but the gap between them is smaller than either standard deviation: the two Gaussians overlap over most of their range.

## The posteriors

| AI | P(shale) | P(oil sand) | P(brine sand) | most likely |
| --- | --- | --- | --- | --- |
| 6000000.000000 | 0.047185 | 0.672121 | 0.280694 | oil sand |
| 6600000.000000 | 0.000000 | 0.442088 | 0.557911 | brine sand |
| 7200000.000000 | 0.000000 | 0.231827 | 0.768173 | brine sand |
| 7800000.000000 | 0.000000 | 0.116827 | 0.883173 | brine sand |

Only the softest point in the table is called oil sand, and even there brine sand keeps 0.280694. From 6600000 upwards brine sand is the most likely class, by a narrow margin at first.

## The prior moves the answer

With equal priors at AI 6600000 the posteriors are P(shale) 0.000000, P(oil sand) 0.673039 and P(brine sand) 0.326961: the most likely class flips from brine sand to oil sand. Nothing about the rock changed; only the stated prior did. Where two densities overlap, the prior decides the call, so a facies map is quoted with its priors, and a map made with sample-proportion priors inherits the heavily shale, brine-rich split of the logged window.

A posterior is a probability under the model: Gaussian densities, these labels and these priors.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, set View to "Bayesian facies and the confusion matrix" and Data to "Ekene teaching pack" (the contact is the pack's, 5118.110236 ft). Keep "Net sand Vsh cut-off (stated)" at 0.350000, "Attributes (stated)" at AI, "Priors (stated)" at the samples' proportions and "Density per facies (stated)" at Gaussian, and check the samples, priors, means and standard deviations against the first table. Enter the four AI values of the second table in "AI to classify at, kg/(m2 s) (stated)" and read the posteriors. Then set "Priors (stated)" to equal, read the posteriors at 6600000 again, and write one sentence on which stated choice decided the class there.
