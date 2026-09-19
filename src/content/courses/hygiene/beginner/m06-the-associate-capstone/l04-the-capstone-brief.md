# The capstone brief

{{panel:hy-noise-dosimeter}}

The Associate capstone hands you one dosimeter record and asks for six numbers. Every one of them is arithmetic this tier has taught, and every one has a worked twin on the OBEN day: 27.748183 percent, 80.752126 dBA, 72.054478 percent, 265.610944 percent, 89.242460 dBA and 173.404361 minutes.

## The six fields

| field | the OBEN twin |
| --- | --- |
| the OSHA PEL noise dose, percent | 27.748183 |
| the OSHA PEL TWA, dBA | 80.752126 |
| the OSHA action level noise dose, percent | 72.054478 |
| the NIOSH noise REL noise dose, percent | 265.610944 |
| the NIOSH noise REL TWA, dBA | 89.242460 |
| the minutes left at a stated level on the OSHA PEL | 173.404361 |

Each field names its criterion. That is the whole lesson of this tier written into the answer sheet: the same record gives different answers under different criteria, and a field that did not say which would have no single right answer.

## How the capstone record is set

The capstone states its record in the same terms as the OBEN table, and it names the criterion for every field. No capstone input sits exactly on a threshold, so judgement J2 never decides a graded answer. You still need the rule for real records, and you still need to check each period against each threshold before you integrate it.

The TWAs are graded on the coefficient each source prints: 16.61 on OSHA, as the mandatory Appendix A text writes it, and 10.0 on NIOSH. A TWA worked with the exact coefficient will disagree with that answer, and on NIOSH the disagreement can reach the second decimal. That is judgement J1, and the module on the printed coefficients is the place to revisit if your hand check disagrees with the engine.

This course prints noise doses, TWAs and durations to six decimals. Carry full precision through each step and round only at the end, because a rounded reference duration carried into a sum moves the last printed digit.

## Practising on the OBEN day

Before you open the capstone, reproduce all six OBEN figures from the period table alone. Find each reference duration with T = 8 / 2^((L - 90)/5) for OSHA and T = 480 / 2^((L - 85)/3) minutes for NIOSH. Drop the periods below each threshold, divide hours by reference duration, add, and restate as a TWA with the printed coefficient. For the minutes left, take the remaining share of the PEL allowance and multiply by the reference duration at the stated level, then convert to minutes.

If you reach all six, you are doing exactly what the capstone asks. If one disagrees, the contributions table in the reading module will show you which period you handled differently.

## Exercise

Starting from the OBEN period table only, compute the NIOSH noise REL noise dose and TWA without looking at the engine's contributions. Compare your answers with 265.610944 percent and 89.242460 dBA. Then compute the NIOSH TWA a second time with the exact coefficient of 9.965784284662, and say how far it lands from 89.242460 dBA and why that difference would matter in a graded answer.
