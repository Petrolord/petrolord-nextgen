# The window at TD

Floor and ceiling are built; subtract. The third graded field is the window at total depth, and this lesson does more than the subtraction: it establishes what the number means, how it decomposes, and how to read any window value against the two facts that generate it.

{{panel:pp-window-explorer}}

## The graded value

$$1903.9238599165737 - 1179.1048116553065 = 724.8190482612672 \ \mathrm{kg/m^3}$$

Tolerance 0.5. Nearly 725 kg/m3 of room at total depth: this is a comfortable well. For scale, mud programs routinely operate inside windows of 60 to 120 kg/m3, and wells become undrillable without extra casing when the window at some depth approaches the sum of the margins, of order 50 to 100 kg/m3. This well's problem is not squeeze; that makes it the right well to learn the machinery on, and the wrong well to calibrate your sense of danger on. Both halves of that sentence matter.

## The window in pressure units, reconciled

The Professional tier measured the same gap in MPa: $76.55157117548856 - 47.408579625 = 29.14299155048856$ MPa. Divide by the TD column factor, 40207.265 Pa per kg/m3: $29142991.55048856 / 40207.265 = 724.8190482612673$ kg/m3. Same number, one floating-point digit adrift, because floor, ceiling and window all divide by the same column at one depth. Subtraction and conversion commute; you may do them in either order, and checking a window both ways is a free transcription audit.

## The window's algebra, converted

From the coefficient form, the window is $K$ times the effective stress: $FP - PP = \tfrac{2}{3}(S - PP)$. In mud units at TD: $\tfrac{2}{3} \times (2266.333384047207 - 1179.1048116553065) = \tfrac{2}{3} \times 1087.2285723919005 = 724.8190482612669$ kg/m3. A third route to the same value.

This is the reading with predictive power: the window at any depth is two thirds of the gap between the overburden EMW and the floor. Every force that narrows windows acts through that gap. Overpressure raises the floor toward the overburden: gap shrinks, window shrinks. Depth raises both, but mud-unit compression means the overburden EMW flattens with depth while an overpressured floor can keep climbing: deep overpressured wells pinch. On this well the gap at TD is a spacious 1087 kg/m3, and two thirds of spacious is spacious.

## What eats the window operationally

The static 724.82 is the geologist's window. The driller's is smaller, and it is worth itemising the bites once, with typical sizes, so the number is never mistaken for usable room. A kick margin, the deliberate overbalance carried above the floor, commonly 30 to 60 kg/m3. A trip margin against swab, similar. On the ceiling side, the equivalent circulating density while pumping, tens of kg/m3 at high rates in slim holes, and a surge allowance for running pipe. Sum on a tight well: often 100 plus kg/m3 of the window gone before any uncertainty in the walls themselves is counted. Subtracting typical bites from 724.82 leaves an enormous operating envelope here, which is the quantitative sense in which this well is benign.

Then subtract the uncertainties this course HAS priced: the exponent moves the floor by 87.22 kg/m3 (module 3), K by about 54 per five points, the trend by far more if undefended. On a 725 window these fit; on a 100 window they do not, and the drilling engineer's real question, can this section be drilled with one mud, is answered by exactly this ledger.

## Reading any window in three numbers

The habit this lesson wants to leave: never quote a window alone. Quote floor, ceiling, window, since the window conceals which wall moved. A 500 kg/m3 window with a 1500 floor is a deep overpressured squeeze; the same 500 with a 1050 floor is a weak-rock shallow problem. The pair locates the problem, the difference only sizes it. The capstone grades all three fields for exactly this reason.

## Worked example

The window at 3000 m, all three routes. Direct: $1830.7745332550903 - 1095.6268524501886 = 735.1476808049017$ kg/m3. Pressure-first: the MPa window there is $55.65667173729269 - 33.307730125 = 22.34894161229269$; divide by $9.80665 \times 3100 = 30400.615$: $22348941.61229269 / 30400.615 = 735.1476808049017$. Algebra: overburden EMW $66831142.54343904 / 30400.615 = 2198.348373657541$, minus the floor 1095.6268524501886 is 1102.7215212073524, times two thirds is 735.1476808049015. Three routes, one value, the worst pair differing in the thirteenth digit. The commuting of subtraction, mixture and conversion at a single depth is what makes window arithmetic auditable from any starting point you happen to trust.

## Exercise

Without the engine: the n 1.2 floor at TD is 1091.881030400315 kg/m3. Using the window algebra, predict the n 1.2 window at TD and check against the panel's 782.968235764595.

Self check: $\tfrac{2}{3} \times (2266.333384047207 - 1091.881030400315) = \tfrac{2}{3} \times 1174.452353646892 = 782.968235764595$ kg/m3, matching the panel exactly. The algebra route needs only the floor and the fixed overburden EMW, which is why it is the fastest way to propagate any floor scenario into a window, and why the next module can price the exponent decision in one line.
