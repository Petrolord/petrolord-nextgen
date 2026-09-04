# The inflow curve

The inflow is a callback the consumer supplies. This module has no reservoir in it, cannot tell you a qmax, and will not check the curve you hand it.

{{panel:pd-trunk-explorer}}

## A qmax is not a rate

A Vogel inflow is written as a qmax at a reservoir pressure, and the qmax belongs to a flowing pressure of nothing. No well on a line sees it. AGBADA-2 carries a qmax of 8100 lb/d at 2750 psia and on its own flowline it makes 6890.874160167 lb/d, because 1857.110457 psi of its reservoir pressure is spent getting the fluid to the wellhead at all.

| Well | qmax, lb/d | Reservoir, psia | Wellhead, psia | Drawdown, psi | Rate, lb/d |
| --- | --- | --- | --- | --- | --- |
| t1, AGBADA-2 | 8100 | 2750 | 892.889543025 | 1857.110457 | 6890.874160167 |
| t2, AGBADA-6 | 3300 | 1650 | 335.147329090 | 1314.852671 | 3057.021085629 |
| t3, AGBADA-9 | 5750 | 2350 | 840.553310094 | 1509.446690 | 4750.157046765 |
| t4, AGBADA-12 | 2100 | 1450 | 303.714448989 | 1146.285551 | 985.000000000 |

## The curve has to fall

The module header asks one property of it: the inflow has to be monotone decreasing in pressure. Push the wellhead up and the well makes strictly less. A falling inflow against a rising line loss crosses exactly once, which is what makes the answer unique.

For three of the four the curve is the whole story. Read the Vogel relation at the wellhead the solve found and it returns the rate the solve reported, 6890.874160167 lb/d for t1, 3057.021085629 lb/d for t2 and 4750.157046765 lb/d for t3.

## Where the curve stops being the curve

AGBADA-12 is held to an allocation of 985 lb/d. Its Vogel relation at 303.714448989 psia would give 1938.321311203 lb/d, and what the solve reports is 985.000000000 lb/d, because the allocation caps it.

A well held to a facility allocation, a choke limit or a compressor slot is not monotone decreasing. It is monotone non-increasing, with a flat top: over a whole band of pressures the rate does not move. That flat top is a legal inflow to hand in and it is exactly what makes a node pinnable.

The solve reports `converged: true` in 4 iterations with a residual of 0.0000e+0 lb/d and `pinned: t4`, while `checkConservation` on the same answer gives a gap of 3.450000e+2 lb/d, relative 3.502538e-1. The flat top and the gap are one fact seen twice.

## The mistake

Quoting qmax as deliverability. On AGBADA-2 that offers 8100 lb/d against the 6890.874160167 lb/d it makes, and the difference is a pressure the well has to spend.

The other mistake is handing in an allocated inflow and reading its returned rate as production. The rate came back because it was typed in, not because the line could pass it.

## Exercise

Write the four drawdowns and rank the wells by them, then say whether the ranking matches the ranking by rate.

Then say which two numbers in AGBADA-12's result would move if its allocation were lifted.
