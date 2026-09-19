# Tolerance on what moved

{{panel:supply-tank-explorer}}

## Why the band is set on throughput

Every measurement in the day carries some uncertainty: the tapes, the thermometers, the interpolated tables and the meters on receipts and deliveries. Product that moves is product measured on the way in or out, so a busy day leaves more room for honest error than a still one.

So reconcileStock sets its tolerance on throughput, defined as receipts plus deliveries, and states it as a percent of that throughput. AKODO's stated tolerance is 0.2 percent of throughput, a figure chosen for this course. On the AKODO day, with receipts of 2870.000 m3 and deliveries of 3312.500 m3, it comes to 12.365 m3.

The unaccounted figure is judged against that band on both sides. A gap of -8.648 m3 on the day reads within tolerance: true. The engine also states the gap as a share of throughput: -0.1399 percent. Keep the units apart: the tolerance percent is the stated band, and the unaccounted percent is the day's result on the same base.

## The band swept

The same day, with only the tolerance percent changing:

| tolerance percent of throughput | tolerance m3 | within tolerance |
| --- | --- | --- |
| 0.05 | 3.091 | false |
| 0.1 | 6.183 | false |
| 0.2 | 12.365 | true |
| 0.3 | 18.547 | true |
| 0.5 | 30.913 | true |

Nothing about the tanks changes down this table. The unaccounted figure stays -8.648 m3 in every row. What changes is the band it is held to. At 0.05 percent the band is 3.091 m3 and the day is outside it; at 0.1 percent the band is 6.183 m3 and the day is still outside; from 0.2 percent upward it is within.

Whether a day passes depends on a percent somebody chose. The percent should come from the terminal's own measurement procedures and the uncertainty of its instruments, and it should be fixed before the day is closed. A tolerance tuned after the fact until the day passes is the same trap as the reconciliation that cannot fail, in a softer form.

## A day with nothing moving

The band has an edge case that shows what it is built on. A day with no receipts and no deliveries has no throughput, and so no tolerance:

opening 4953.700 m3 dipped at 4954.200 m3 reads unaccounted 0.500 m3, tolerance 0.000 m3, within tolerance false, direction gain.

No product moved, so the rule allows no gap at all, and any gap reads outside tolerance. When a still tank's reading moves, something other than a transfer has happened. The engine does not invent a band for the still day. It reports the gap and lets someone look.

In the panel, sweep the tolerance percent on the AKODO day and watch the within tolerance verdict change while the unaccounted figure stays put. Then set receipts and deliveries both to zero.

## Exercise

Read the tolerance sweep at 0.1 percent and at 0.2 percent: the tolerance in m3 and the verdict at each. Say what changed between the two rows, what did not, and what that shows about where a day's verdict comes from.

Self check: the band went from 6.183 m3 to 12.365 m3 and the verdict from false to true. The unaccounted figure stayed -8.648 m3. The verdict depends on the stated percent as well as on the tanks, so the percent has to be set before the day is closed.
