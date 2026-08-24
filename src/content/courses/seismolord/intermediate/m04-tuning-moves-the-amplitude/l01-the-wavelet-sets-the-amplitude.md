# The wavelet sets the amplitude

Modules 1 to 3 moved the synthetic in time. This module leaves it where it is and changes the wavelet instead, then watches what happens to the trace. The result is one of the least intuitive things in seismic interpretation, and it is worth building up to carefully.

Start with the question the module answers: when you look at an amplitude on a seismic section, whose property are you looking at?

## Two ingredients, and only one of them is rock

A synthetic seismogram has exactly two inputs.

The first is the **reflectivity series**. You built it at the Associate tier from the sonic and the density: velocity times density gives acoustic impedance, and the contrast between impedance above an interface and impedance below it gives the reflection coefficient at that interface. Every step in that chain is a measurement of the formation. The reflectivity is the earth's own answer to the question of where the contrasts are and how large they are.

The second is the **wavelet**. You chose it. Its shape came from the Ricker formula and its length came from the dominant frequency you typed in. Nothing about it was measured in this well. It is a stand in for what the seismic acquisition and processing delivered, and on real data it is estimated, argued over, and revised.

The synthetic is the convolution of the two. The Associate tier derived that operation and you do not need it derived again. What matters here is the one structural fact it hands you, and it is this. Every sample of the synthetic is a sum of contributions from more than one reflection coefficient. A wavelet has length, so each coefficient smears its scaled copy across a span of time, and wherever those spans overlap the values add.

## What that structure means for amplitude

Follow the consequence through slowly.

The reflectivity fixes **which** contributions exist and **how large** each one is on its own. It fixes the sign of each, and where in time each sits. Change the rock and all of that changes.

The wavelet fixes **how far** each contribution reaches and therefore **which** of them land on the same sample. Change the wavelet and none of the coefficients move, none of them change size, and none of them change sign. What changes is the company each one keeps.

The amplitude you finally read off the trace is a sum, so it depends on both. It is not a property of the reflectivity alone, because a different wavelet would gather a different set of neighbours into the sum. It is not a property of the wavelet alone either, because the wavelet contributes no energy of its own and only scales what the reflectivity gives it.

The honest statement is that an amplitude is a property of the **pair**. Reflectivity and wavelet together produce it, and quoting an amplitude without saying which wavelet produced it is quoting half a result.

## Why interpreters forget this

The forgetting has a cause worth naming.

On a real seismic volume you never see the wavelet. You see the section. The wavelet was fixed long before the volume reached you, in acquisition and processing, and it is the same wavelet everywhere on the display. Because it never varies across the picture, it becomes invisible, and everything that varies across the picture looks as though it must be geology.

Within a single volume that habit is defensible. If the wavelet really is constant, then bright against dim on that volume does carry information about the reflectivity. The habit breaks the moment the wavelet is not constant: across a merge of two surveys, across a reprocessing, between a legacy line and a modern one, or between a synthetic you built and the seismic you built it to match.

And it breaks in a way that leaves no trace on the display. The amplitudes still look like amplitudes. There is no annotation on a bright event saying that it is bright because of the wavelet rather than because of the rock.

## What this module does about it

The rest of the module runs a controlled experiment on the teaching well. The reflectivity is held completely fixed, since it comes from one well with one sonic and one density curve and nothing about them is touched. Only the dominant frequency of the Ricker wavelet changes, across three runs at 15 Hz, 25 Hz and 40 Hz.

Any difference in the resulting traces is therefore caused by the wavelet, with no ambiguity at all. That is the value of the experiment: it isolates one variable in a way that no real dataset ever lets you do.

Lesson 2 puts the three peak amplitudes side by side and reads what the experiment produced. Lesson 3 explains why the direction of the effect is the opposite of what most people predict. Lesson 4 draws the conclusion the tier is built around.

Before you go on, commit to a prediction, because a prediction you have written down is harder to revise quietly afterwards. Three synthetics, one well, wavelets at 15 Hz, 25 Hz and 40 Hz. Which one shows the largest peak amplitude anywhere on the trace?

## Exercise

Write down, in your own words and without looking ahead, what changes and what stays the same between the 15 Hz run and the 40 Hz run on this well. Be specific about the reflection coefficients: their number, their sizes, their signs and their times. Then commit in writing to which of the three frequencies you expect to give the largest peak amplitude, with one sentence of reasoning.

As a self-check: between the two runs the reflection coefficients are identical in every respect, since they come from the same sonic and density curves through the same impedance and contrast arithmetic, so their count, sizes, signs and times are all unchanged. The only thing that changes is the wavelet, which at 15 Hz is longer in time and at 40 Hz is shorter. Because the wavelet has length, each coefficient contributes to a span of samples rather than to one, so changing the length changes which coefficients contribute to the same sample and therefore what the sum comes to. Your prediction does not need to be right at this stage; it needs to be written down, so that lesson 2 either confirms it or gives you something to explain.
