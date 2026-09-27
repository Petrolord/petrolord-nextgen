# The SEC summation rule

{{panel:prms-aggregation-calculator}}

The engine's aggregation basis cites two texts side by side: SPE-PRMS 2018, by section, and a United States federal rule. The federal rule is public domain, so this course can quote it word for word. It is 17 CFR 229.1202, Regulation S-K Item 1202, in the eCFR version current at 2026-09-01, read on 2026-09-27.

## What the rule says

The course's paraphrase first: for SEC reporting, total reserves are simple arithmetic sums of the property or field estimates, category by category.

> "(3) Reported total reserves shall be simple arithmetic sums of all estimates for individual properties or fields within each reserves category." (17 CFR 229.1202(a)(3))

Probabilistic aggregation stops at the field or property level:

> "When probabilistic methods are used, reserves should not be aggregated probabilistically beyond the field or property level;" (17 CFR 229.1202(a)(3))

Above that level the estimates are added arithmetically:

> "they should be aggregated by simple arithmetic summation." (17 CFR 229.1202(a)(3))

## How it meets PRMS

PRMS 4.2.5.4 draws the same line at the field level; the SEC rule makes it binding for a registrant. The engine cites both in one reason, printed whenever the level is "above-field", verbatim:

> above the field level report the arithmetic sums, with the caution that the aggregate 1P may be very conservative and the aggregate 3P very optimistic (PRMS 4.2.5.4; 17 CFR 229.1202(a)(3) (Regulation S-K Item 1202)); the statistical figures serve portfolio analysis (PRMS 4.2.5.5)

The SEC's definitions carry a probability as well. The course's paraphrase: with probabilistic methods, reasonable certainty means at least a 90 percent chance of meeting or exceeding the estimate.

> "If probabilistic methods are used, there should be at least a 90% probability that the quantities actually recovered will equal or exceed the estimate." (17 CFR 210.4-10(a)(24))

That is the P90 as the low estimate, the same convention lib/conventions/percentile.js gives the engine. Rule 4-10 of Regulation S-X is read in the same eCFR version.

## A published total the engine adds

The golden case "agg-ekene-reserves-above-field" runs the SEC rule on the Ekene Reserves. The arithmetic 1P is 15.809794 at either level, and the sampled P90 is 17.300834 on seed 20271112 and 20000 draws at either level. Only the reportable value moves, from "arithmetic-or-statistical" to "arithmetic". A registrant reporting above the field level would quote 15.809794 and the other arithmetic sums; the sampled figure is an estimate and the rule gives it no place in the total.

## What this course does not claim

The SEC rules bind companies that file with the SEC. This course quotes them because they are public and precise, and because the engine cites them. It states no Nigerian booking rule: no gazetted NUPRC reserves reporting regulation was found on the Commission's list read on 2026-09-27. Where a lesson reaches Nigerian reporting, it says so plainly.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves above the field level". Find the reason that cites 17 CFR 229.1202(a)(3) and the Source line under the tables. Write the three figures a registrant would report for these projects, each with its class, unit and level. Then find the sampled P90 in the Monte Carlo table, read its seed and draws, and write one sentence saying why the rule leaves it out of the total.
