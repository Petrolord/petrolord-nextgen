# A well against a boundary

One well, one flowline, one separator. Two nodes, one unknown pressure, and everything else in the case was typed in by somebody.

{{panel:pd-trunk-explorer}}

## What is supplied and what is found

The separator sits at 265 psia, and it is the boundary every solo run is solved against. Each well carries a Vogel inflow, written as a qmax at a reservoir pressure, and each flowline carries a conductance.

| Well | qmax, lb/d | Reservoir, psia | Flowline, lb/d per root psi |
| --- | --- | --- | --- |
| t1, AGBADA-2 | 8100 | 2750 | 275 |
| t2, AGBADA-6 | 3300 | 1650 | 365 |
| t3, AGBADA-9 | 5750 | 2350 | 198 |
| t4, AGBADA-12 | 2100 | 1450 | 126 |

No wellhead pressure appears there, and no rate. Both are found.

## One equation in one pressure

The well node is the only row in the index, because the separator's pressure was supplied. That row says the mass the reservoir pushes into the node equals the mass the line carries out, and both sides move when the wellhead pressure moves.

Solve each of them alone and t1 lands at 892.889543025 psia making 6890.874160167 lb/d, t2 at 335.147329090 psia making 3057.021085629 lb/d, and t3 at 840.553310094 psia making 4750.157046765 lb/d.

AGBADA-12 is not like the others. It is held to an allocation of 985 lb/d on a flowline capped at 640 lb/d, and it comes back at 303.714448989 psia with a reported rate of 985.000000000 lb/d and `pinned: t4`.

## What each answer was checked against

| Well | Iterations | Reported residual, lb/d | Conservation gap, lb/d |
| --- | --- | --- | --- |
| t1 | 7 | 9.0949e-13 | 9.094947e-13 |
| t2 | 7 | 4.5475e-13 | -4.547474e-13 |
| t3 | 7 | 0.0000e+0 | 0.000000e+0 |
| t4 | 4 | 0.0000e+0 | 3.450000e+2 |

All four report `converged: true`. Three balance to the last bits. The fourth reports a residual of zero and a gap of 3.450000e+2 lb/d, relative 3.502538e-1, so its solo answer is already wrong and the flag does not say so.

## What the boundary has to be

A boundary is refused if it is missing: `A network needs a delivery point: a node with a pressure the system is flowing against.` It is refused if it is silent: `The delivery point "Sep" needs a pressure.` And no node anywhere is allowed below `MIN_PRESSURE_PSIA = 14.7 psia`.

A sink accepts whatever arrives at a fixed pressure, and a separator that chokes back, swings or fills is not in this module.

## The mistake

Typing a wellhead pressure and calling the result a solve. With the wellhead supplied there is no unknown left, and the rate that comes back is the rate at the pressure you assumed.

## Exercise

For t1, t2 and t3 write the supplied quantities and the found ones in two columns.

Then say why t4's residual of 0.0000e+0 lb/d and its conservation gap of 3.450000e+2 lb/d are not in contradiction.
