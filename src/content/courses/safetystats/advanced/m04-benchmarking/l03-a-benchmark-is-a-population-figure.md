# A benchmark is a population figure

{{panel:ss-intervals-explorer}}

Run UGHELLI against the IOGP 2024 total as if IOGP were a second workforce, and the engine returns a rate ratio of 4.796684 with a 95 percent interval of 2.191251 to 9.117590 and a central p-value of 0.000301. The expected proportion, UGHELLI's hours over all the hours, is a derived 0.000611. The IOGP total rests on 3071 events and UGHELLI on 9.

| what | value |
| --- | --- |
| rate ratio, UGHELLI over IOGP 2024 | 4.796684 |
| 95 percent interval | 2.191251 to 9.117590 |
| central p-value | 0.000301 |
| expectedProportion, derived | 0.000611 |

## Whose uncertainty the interval carries

The interval is almost all UGHELLI's. The IOGP rate rests on 3071 events, so on the conditional exact test it behaves nearly like a known constant. UGHELLI's rate rests on 9, and an interval on 9 events is wide. The Professional tier's ladder showed the same thing: at 10 events on a fixed observed rate, the upper limit of the interval was 3.835008 times the lower. Here the upper limit of 9.117590 over the lower of 2.191251 is of the same order, because the uncertainty is UGHELLI's count.

Narrowing that interval takes more UGHELLI exposure. More IOGP hours would change almost nothing.

## What the test assumes

The test the engine runs was built for two groups, each with one true rate. Handed the IOGP total, it treats that total as one workforce under one rate. It is many workforces under many rates. The IOGP figure pools companies with different work, different reporting systems and different definitions of a recordable. The engine does not know which companies are in it, and a benchmark comparison inherits every one of those differences.

That changes how the p-value reads. A p-value of 0.000301 says that if UGHELLI and the pooled membership shared one rate, a split this uneven would be rare. But nobody expects a single site to share the pooled rate exactly, even a typical one, because sites differ. So the small p-value answers a question that was never in doubt. It is the ratio and its interval that carry information here, and they carry it about UGHELLI.

## What the comparison can support

Two statements are safe on these numbers. UGHELLI's rate on the IOGP base, 3.881586, is well above IOGP's published 0.81 for 2024, and the lower limit of the ratio, 2.191251, is above 1, so the gap is larger than UGHELLI's own count uncertainty. Both statements rest on the base and definition checks from the previous lesson holding.

What the numbers cannot support is a ranking. A site placed in a percentile of the industry needs the distribution of company rates, and IOGP's pooled figure does not carry it. The engine carries no benchmark rates at all, so nothing it returns can place a site in a distribution.

## The benchmark as a reference line

Treat the IOGP figure as a reference line on the chart of your own rate, drawn on the same base with the same definition. A site well above it has a question to answer. The answer comes from the site's own records.

## Exercise

Divide the upper limit of 9.117590 by the lower limit of 2.191251. Compare that ratio with the Professional tier's ladder, where 10 events gave 3.835008 and 5 events gave 7.187207, and say which row UGHELLI's interval most resembles and why. Then, in the panel, double UGHELLI's hours and count and record how the interval narrows.
