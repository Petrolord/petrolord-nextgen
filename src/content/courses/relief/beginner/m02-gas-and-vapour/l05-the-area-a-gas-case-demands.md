# The area a gas case demands

{{panel:fc-sizing-explorer}}

Everything in this module now assembles into one answer. ORUBIRI is a gas relief case, and this is the whole of it from stated inputs to a letter.

## ORUBIRI, end to end

Stated: 68000.000000 lb/hr, set 420.000000 psig, 10.000000 percent overpressure, back pressure at the valve outlet 35.000000 psig, 185.000000 degF, molecular weight 20.500000, compressibility 0.870000, isentropic exponent 1.270000, Kd 0.975000, Kb 1.000000, Kc 1.000000.

Worked through: relieving pressure 476.700000 psia, back pressure 49.700000 psia, branch critical, critical ratio 0.551208. Required area 2.223779 in2. Orifice L at 2.853000 in2, with a margin of 1.282951.

No warning fires. The back pressure ratio is 0.104258, which is below the 0.300000 at which the chart Kb warning appears, and the case is choked, so no subcritical factor is involved at all.

## The published cases

Five gas rows are published for this route, and every one was re-run through the engine at the golden inputs, so the published case and the live engine sit side by side.

| golden flow lb/hr | golden p1 psia | golden p2 psia | golden Kd | golden Kb | golden Kc | published area in2 | engine area in2 | relative difference | branch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50000.0000 | 314.700000 | 14.700000 | 0.975000 | 1.000000 | 1.000000 | 2.562519 | 2.559800 | 1.061e-3 | critical |
| 12000.0000 | 114.700000 | 14.700000 | 0.975000 | 1.000000 | 1.000000 | 1.114288 | 1.113106 | 1.061e-3 | critical |
| 80000.0000 | 514.700000 | 300.000000 | 0.975000 | 1.000000 | 1.000000 | 2.334502 | 2.333266 | 5.295e-4 | subcritical |
| 80000.0000 | 514.700000 | 400.000000 | 0.975000 | 1.000000 | 1.000000 | 2.693414 | 2.691988 | 5.295e-4 | subcritical |
| 25000.0000 | 214.700000 | 30.000000 | 0.900000 | 0.880000 | 0.900000 | 2.030426 | 2.028271 | 1.061e-3 | critical |

The relative difference column is a comparison the digest computes, so it is one of the very few two figure relationships in this course that a lesson may quote. Every row agrees to better than two parts in a thousand. Of the two values printed in that column the subcritical rows carry the smaller one, and that is as much as the column supports saying.

## The load was handed over

Look again at the first line of the stated inputs. The 68000.000000 lb/hr did not come from anywhere in this module. Somebody decided that a blocked outlet, or a control valve failure, or a loss of cooling puts that much gas through this valve, and the engine sized for it without comment.

Change that figure and every number after it changes, including the letter. That is the thesis of the course standing in front of you in a worked example: the area is the size that one chosen case demands, and choosing the case is the part no engine did.

## What the published set can and cannot prove

Read the three coefficient columns. Exactly one of the five rows carries coefficients away from the engine's own defaults, the last one, at a Kd of 0.900000, a Kb of 0.880000 and a Kc of 0.900000. That single row is the only one in the set that can check the coefficients divide rather than multiply, because a case run at coefficients of one cannot tell the two arrangements apart: one divided by one and one multiplied by one are the same number.

That is a thin margin for an important property.

Two rows share a flow, a relieving pressure and every gas property, differing only in the outlet pressure. That pair proves the subcritical branch responds to the outlet pressure. Both are subcritical, so neither tests the branch decision itself.

## Exercise

Work the ORUBIRI chain on paper from the stated set pressure to the orifice letter, writing down the relieving pressure, the back pressure ratio, the branch, the required area and the letter. Then say which of the five published rows could detect a coefficient that multiplied where it should divide, and why the others could not.
