# The workflow end to end

Five modules have produced a set of results. This lesson assembles them into the sequence you would actually run on a project, in the order the steps have to happen, with the reason each one is where it is.

## The seven steps

**1. Get the reflection pair from the logs, not from the seismic.** Compute the impedance of the rock above the bed, of the bed, and of the rock below it, then form both coefficients. This step decides whether the tier's results apply at all, because a same signed pair notches where an opposite pair peaks. It comes first because everything after it is conditional on the answer.

**2. Get the frequency from the data at the target level.** Not from the processing report and not from the acquisition design. The Professional tier's wavelet work is the way to obtain it, and the number that matters is the one at the depth of the target, since higher frequencies are lost with depth.

**3. Build the wedge with those inputs.** The actual coefficients, the actual frequency, the actual sample rate. A wedge built on round numbers is a teaching exercise; a wedge built on the project's numbers is a measurement.

**4. Check the model against theory.** Compare the modelled tuning thickness with $\sqrt{6}/(2\pi f)$ and confirm the residual is no larger than the grid can explain. Confirm the thick end returns the top coefficient and the zero thickness trace returns zero. Three checks, three unrelated properties, and no interpretation until all three pass.

**5. Read the two limits.** The tuning thickness, converted to metres with the interval velocity, is the resolution limit. The apparent thickness floor, $1.0493/(\pi f)$, is the point below which a peak to trough measurement stops responding. Write both down with the velocity attached.

**6. Classify the target.** Compare the expected bed thickness with the tuning thickness. Above it, amplitude is weakly informative and apparent thickness is the measurement. Below it, apparent thickness is dead and amplitude is the measurement. Near it, both are close to their least sensitive point and the honest answer is that neither resolves the bed well.

**7. Report with the conditions attached.** Every number from this workflow is conditional on a reflection pair, a frequency, a sample rate and a velocity. A number reported without them cannot be checked by anyone and cannot be reused when any of the four changes.

## What each step protects against

Step 1 protects against reading an amplitude map upside down.

Step 2 protects against a resolution claim built on a bandwidth that never reached the target.

Step 4 protects against building an interpretation on a model with a sign error or a search window problem, which are the two failures that produce plausible looking wrong curves.

Step 6 protects against the most common error of all, which is using amplitude and apparent thickness as though both worked everywhere.

Step 7 protects the next person.

## The order matters

Two orderings are tempting and both are wrong.

Reading the amplitude map first and building the wedge afterwards to explain what was seen turns the model into a rationalisation. The wedge will always produce a thickness consistent with any amplitude inside its range, because that is what the curve is for.

Choosing the frequency to make the model agree with a known well is the same error in a more sophisticated form. The frequency is a measurement, not a fitting parameter, and a wedge tuned to reproduce one well has lost the independence that made it worth building.

## Worked example

A prospect has a type well giving shale impedance 5,875,000 and sand impedance 6,600,000, with the same shale below. Processing measures 28 Hz at the target and the interval velocity is 2900 m/s. The mapped amplitude over the prospect is 0.050. Run the workflow.

Step 1: the pair is $+0.058116$ at the top and $-0.058116$ at the base. Opposite signed, so the standard tuning behaviour applies.

Step 3 and 4: at 28 Hz the theoretical tuning thickness is $389.8484/28 = 13.92$ ms; a 2 ms grid model would report 14 ms, a residual of 0.08 ms, which is well inside one sample.

Step 5: the resolution limit is $13.92 \times 10^{-3} \times 2900/2 = 20.2$ m of bed. The apparent thickness floor is $1.0493/(\pi \times 28) = 11.93$ ms, which is 17.3 m of bed.

Step 6: the isolated amplitude for this pair is 0.058116 and the modelled tuning amplitude at 14 ms is 0.084048. The mapped 0.050 is **below** the isolated level, so it sits on the unambiguous part of the rising limb. The model gives 0.038296 at 4 ms and 0.053313 at 6 ms, so an amplitude of 0.050 puts the bed at roughly 5.6 ms, or 8.1 m of sand.

Step 7: report it as roughly 8 m of sand, conditional on a $\pm 0.058$ pair from the type well, 28 Hz at target, and 2900 m/s, with the note that this is well below both the resolution limit and the apparent thickness floor so the estimate rests on amplitude alone.

## Exercise

In the worked example, state what the answer would become if the mapped amplitude were 0.082 instead of 0.050, and why that single change makes the report substantially weaker.

As a self-check: 0.082 is above the isolated level of 0.058116 and below the modelled tuning amplitude of 0.084048, so it falls in the ambiguous band and supports two thicknesses, roughly 12.2 ms on the rising side and roughly 15.9 ms on the falling side, either side of the 14 ms tuning thickness. The report becomes substantially weaker because a single amplitude can no longer be inverted, and the answer has to be given as a pair of candidates with the observation that would separate them rather than as a thickness.
