# What steady state assumes

The steady state answer has no clock in it, no pressure in it, and one U and one ambient for the whole run. Each of those is a decision somebody made for you.

{{panel:pd-line-explorer}}

## No clock

Nothing in `steadyStateProfile` advances time. The arrival is a closed form, and the station count is a resolution setting and nothing else. Running the published 105600.0 ft case at 2, 3, 5, 11, 21, 51, 101 and 501 stations returns the same arrival of 43.35769344274401 degF on every one of those eight derived rows, a difference from the 21 station answer of 0.0000e+0 degF at each. Refining a profile buys detail in the middle of the line and buys nothing at the end of it.

## No pressure, in every published case

The published profile returns `ok = true` with 21 stations and a pressure column that reads n/a in all 21 of them, because no pressures are set anywhere in the goldens. The Joule-Thomson term is therefore exactly zero in every published number this course quotes. A line that expands across a pressure drop is a different problem, and no published case is it.

## One U, one ambient, one direction

The profile is a monotone exponential and nothing else, so the coldest point is the far end and only the far end. On the published case at 105600.0 ft the fluid drops 23.8220561287 degF across the first 5280.0000 ft station interval and 0.6884883567 degF across the last one, a ratio of 34.60052142. That holds because the seabed is one temperature everywhere and the wall is one U everywhere. A real route with a changing depth honours neither.

## What it refuses and what it will not question

A zero length and a zero U are both refused with one message: the profile needs a length, a mass rate, a heat capacity and a heat transfer coefficient. That is the whole list. It does not ask which diameter the U was referred to, because it takes a bare bore and cannot see a reference. It does not ask whether the ambient it was handed is the seabed at the far end or the seabed at the near end.

## The careful mistake

Reading `ok = true` as an endorsement. It says four inputs were present and positive. An inlet 20.0 degF below the 40.0 degF ambient returns `ok = true` and an arrival of 39.5203295082 degF, which is right. A U built against the wrong reference diameter returns `ok = true` as well, and is not. The flag distinguishes the two not at all.

## Exercise

Run the published 105600.0 ft case at 5 stations and then at 501 and record both arrivals.

Then say what the extra stations bought, and name one assumption in the run that the returned object gives you no way to check.
