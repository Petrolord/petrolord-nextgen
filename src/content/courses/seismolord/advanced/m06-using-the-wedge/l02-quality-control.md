# Quality control

A wedge model is easy to build and easy to build wrongly, and a wrong one looks entirely convincing because the output is always a smooth curve with a maximum somewhere. This lesson lists the checks that catch the failures, in the order they are cheapest to run.

{{panel:sl-wedge-explorer}}

## The three structural checks

These take seconds and they pin the model at three independent points.

**Zero thickness returns exactly zero.** The equal and opposite coefficients land on one sample and cancel. If the model returns anything but zero there, the pair is not equal and opposite, or the two spikes are not landing on the same sample at zero separation.

**The thick end returns the top coefficient.** At 60 ms the 25 Hz model returns 0.07999999821186066, which is 0.08 in 32 bit floating point. If it returns something noticeably different, the wavelet is not normalised to a peak of 1.0, or the panel is not long enough for the two reflections to separate.

**The modelled tuning thickness agrees with theory to within the grid.** Compare against $\sqrt{6}/(2\pi f)$ and require the residual to be smaller than one sample interval. This is the check that catches sign errors, window errors and frequency errors.

Run all three before reading anything else. Two out of three passing is not a pass.

## The four reading checks

These catch mistakes in what is done with a correct model.

**Is the frequency recorded with every number?** A tuning thickness without a frequency is meaningless, and a tuning amplitude without one is misleading, because on this model the value moves slightly with the grid fit at each frequency.

**Is the velocity recorded with every thickness in metres?** Sixteen milliseconds is 16 m at 2000 m/s and 32 m at 4000 m/s.

**Has the modelled value been confused with the theoretical one?** At 25 Hz they are 16 and 15.5939, and both appear on the panel. The modelled value is the reading; the theoretical value is the check.

**Has the tuning amplitude been confused with the isolated amplitude?** At 25 Hz they are 0.1156 and 0.0800. They are different capstone fields and the ratio between them, 1.4449, is the result that matters.

## The three interpretation checks

These catch a correct model used on the wrong problem.

**Is the reflection pair really opposite signed?** If the rock below the bed differs from the rock above, it may not be, and then the tuning peak becomes a notch. Check it from the logs.

**Is the mapped amplitude inside what the model allows?** Nothing can exceed $R_{top} \times 1.4463$. An amplitude above that ceiling means the coefficients, the frequency, or the identification of the event is wrong. This is the single most useful check in the list because it can only fail for real reasons.

**Is the apparent thickness sitting on its floor?** If peak to trough separations across a map cluster near $1.0493/(\pi f)$, they are reporting the wavelet. A uniform apparent thickness over a wide area is a warning sign rather than a comforting result.

## What a failed check means

None of these checks are advisory. A model that fails a structural check produces curves that are wrong in ways that do not announce themselves: the tuning thickness moves, the brightening ratio changes, and the resulting resolution claim is confidently incorrect.

The temptation when a check fails is to adjust an input until it passes. That converts a broken model into a fitted one, which is worse, because a fitted model agrees with the thing it was fitted to and with nothing else. Find the cause instead.

## Worked example

A wedge built for a project reports a tuning thickness of 16 ms at 25 Hz, a tuning amplitude of 0.1156, a thick end amplitude of 0.0400 and zero at zero thickness. Which check fails and what does it imply?

The thick end should return the top coefficient. If the pair was entered as $\pm 0.08$ then 0.0400 is half of it, which points at a wavelet whose peak is 0.5 rather than 1.0, or at coefficients of $\pm 0.04$ having been entered by mistake.

The tuning thickness and the zero both still pass, because neither depends on the overall scale. That is the value of having three unrelated checks: a scale error passes two of them and fails the third, and any single check on its own would have missed it. Note also that the tuning amplitude of 0.1156 is inconsistent with a thick end of 0.0400, since the ratio should be 1.4449 and here it is 2.89.

## Exercise

A colleague reports a wedge at 30 Hz with a tuning thickness of 20 ms and states that the model was built on a 2 ms grid with a pair of plus and minus 0.06. Run the structural check that applies and say what you would ask them to verify.

As a self-check: theory gives $389.8484/30 = 12.99$ ms, so the reported 20 ms is 7 ms out, which is three and a half sample intervals and far more than the grid can explain. The check fails, and the things to verify are the frequency actually passed to the model, the sign of the base coefficient, and the width of the peak search window, since a window that is too narrow at 30 Hz can move the argmax onto the wrong sample.
