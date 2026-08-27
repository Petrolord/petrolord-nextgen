# The workflow

The Professional workflow had eight steps and one governing idea: every step the Associate was handed as a fact is a decision you make and defend. That workflow is not repealed here and you should keep running it.

What the Expert tier adds is not more steps. It is a change in who the defence is addressed to. Professional defends its choices to a reviewer who wants to understand them. Expert defends them to a reserves auditor, a partner with a different view of the asset, and a published standard of practice, none of whom are obliged to be persuaded. That changes four things, and one thing gets added at the front.

## Step 0: Validate the tool before you trust its output

Nothing downstream is worth anything if the arithmetic is wrong, and a field has no answer key. The profession's substitute is the worked example with printed inputs and printed answers: Weaver's exponential, harmonic and hyperbolic cases, the SPEE REP #6 parameter definitions table, Ahmed's gas-well examples including the Ikoku hyperbolic fit.

Module 1 works these. The output is not a skill, it is a citable sentence: this engine reproduces the published result on page such-and-such to this many digits. Write it once, keep it with the tool, repeat it after any version change. An auditor's first question about an unfamiliar tool is what it was checked against, and "it agreed with the last software we used" is not an answer.

## Step 1: Log the regimes and the streams

The Professional regime log recorded every date the well or field changed physically. Add a second column: what stream each regime is measured on, and what drives it.

For Ekene-6 the log now reads first oil 2020-09-01, waterflood 2023-01-01, ramp complete 2023-10-01, water breakthrough 2024-03-01. The last is not a change in the reservoir at all. It is a change in what the meter is measuring. Module 5 showed what happens when a boundary of that kind is missed: a decline constant 3.79 times the reservoir's, at a quality tier of Good.

## Step 2: Prove the window by stability, never by threshold

Choose the regime, write the sentence, then run the test. Move the start one month later and refit. If $D_i$ moves, the window straddles a boundary. If $D_i$ holds and only $q_i$ moves, the window is inside one regime.

Do not substitute a fit statistic for that test. Module 5 has four wells carrying one contaminated row each, at R2 values of 0.0957, 0.7299, 0.9638 and 0.9887, and the two that clear the Excellent band are the two whose declines are wrong by 7.06 and 3.66 percent. The detector has to be independent of the thing it is detecting.

## Step 3: Treat b as a claim under governance

At Professional, b was a parameter to interrogate. At Expert it is a governed quantity, because of what it does to volume. Holding $q_i$, $D_i$ and the limit fixed and moving b alone changes booked EUR by a large multiple, all of it in the tail, none of it in data anyone has seen. Module 2 puts a number on that multiple and works the SPEE guidance that exists because of it.

The operational form is a question you must answer in one sentence: what constrains b in my data, and how much does the booking move if b is one grid step higher. If the answer to the first half is "not much", the second half belongs in the submission.

## Step 4: Decide what to book, not just what to fit

These are different decisions and the Professional workflow ran them together. Module 5 separated them. Fit the stream the reservoir controls, because that is the one Arps describes. Book the stream with revenue attached. When those differ, the conversion between them is a forecast in its own right, and it belongs in the model as a visible line rather than hidden inside a decline constant.

## Step 5: Report a distribution, not a point

Every number in the two lower tiers was single-valued. Reserves are not, because a single value carries no information about how wrong it might be. Modules 3 and 4 supply the two halves: what a parameter interval measures, which is scatter and not truth, and how to build and read a distribution over an outcome, using closed forms where they exist. Sampling that cannot be reproduced cannot be audited.

## Step 6: Write it down so it can be re-derived

Not summarised. Re-derived. The test of an Expert booking is whether a stranger with your memo, the data and the tool lands on your number rather than near it. Lesson 3 is the structure of that memo.

## Step 7: Hand the cumulative on

The volume you booked is a rate extrapolation and carries no information about oil in place. Deliver the cumulative history so somebody can run the volume-based check, and say which cumulative convention it uses. Module 5 lesson 4 is that hand-off.

## Worked example: Ekene-5 after the flood, end to end

**Validation.** Engine reproduces the Weaver and Ahmed worked examples to the digits recorded in module 1, with the tool version.

**Regime and stream log.** First oil 2020-06-01. Waterflood 2023-01-01. Response lag 9 months, so the ramp runs 2023-10-01 to 2024-04-01. No breakthrough and wcMax 0, so the oil and gross liquid streams are the same series throughout. That last clause is why this well is the clean case, and it is evidence from the `flood_response` block, not an assumption.

**Window.** Oil stream, post-response flood regime, 2024-05-01 through 2025-12-01, twenty rows. Defended by stability: starts of 2024-04-01, 2024-05-01 and 2024-06-01 give $D_i$ 0.0003500000000000004, 0.00035000000000000043 and 0.0003500000000000004. A start of 2024-03-01 gives 0.00033718949081430467 at R2 0.988676698925396, so the boundary is real and it is where the ramp ends.

**Fit.** Exponential, $q_i$ 47.10215945583964 stb/d, $D_i$ 0.00035000000000000043 per day, R2 1.00000000000000. b is not fitted, so no b governance applies and the tail carries no hyperbolic inflation.

**Corroboration.** The same constant comes independently from Ekene-1, Ekene-3 and Ekene-6 on their own clean windows: a field parameter measured four times.

**Booking.** At a 10 stb/d limit, EUR 106006.16987382741 stb over 4427.8107294189585 days, about 12.12 years from 2024-05-01. Tangent effective annual decline 11.992663001286052 percent. Closed-form convention, stated.

**What would change it.** A breakthrough at this well, which the flood's geometry makes late rather than impossible; a change in injection rate or pattern; and the economic limit, which is an assumption.

**Hand-off.** Cumulative to 2023-01-01 of 58807.5520048379 stb, exact integral convention, delivered with the other three producers.

Compare that with the Professional worked example on Ekene-6. Same shape, same arithmetic. What is new is a validation line, a stream ruling, a boundary defended by an experiment rather than a statistic, corroboration from other wells, and a list of what would move the answer.

## Exercise

Run all eight steps on Ekene-6's post-flood oil, the hard case, and stop each time you cannot produce the evidence a step asks for. At least two entries will be statements of what you do not know. Then answer this: Ekene-6 and Ekene-5 sit in the same tank under the same flood, and step 2 gives them the same decline constant while step 4 gives them completely different bookings. Write the one sentence you would put in front of a reviewer to explain that, using the words "stream" and "reservoir" exactly once each.
