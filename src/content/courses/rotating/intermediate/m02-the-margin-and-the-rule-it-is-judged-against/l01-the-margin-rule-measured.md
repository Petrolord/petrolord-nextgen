# The margin rule, measured

A margin check needs two numbers and a rule. The two numbers are an available head and a required head, and the rule is the part worth knowing exactly, because both halves of it can be measured out of the engine rather than taken on trust.

{{panel:fc-suction-explorer}}

## The rule is a maximum of two halves

The required margin this package applies is the larger of a fixed floor in feet and a fixed fraction of the vendor's required NPSH. Neither half has to be read out of the source code to be known. Each can be measured by asking the engine for a required margin at a required NPSH where only one of the two halves can possibly bind.

Ask at a required NPSH small enough that the percentage cannot reach the floor, and the required margin that comes back is the floor: 3.000000000 ft.

Ask at a required NPSH large enough that the floor cannot reach the percentage, and the required margin that comes back, divided by that required NPSH, is the fraction: 0.350000000.

## The rule at work on a real suction

Against a vendor's stated required NPSH of 16.000000 ft, across the OKONO padding sweep:

| suction psia | NPSH available ft | margin ft | required margin ft | ratio | pass | severity |
| --- | --- | --- | --- | --- | --- | --- |
| 14.700000 | 31.040865 | 15.040865 | 5.600000 | 1.940054 | true | adequate |
| 18.000000 | 38.370673 | 22.370673 | 5.600000 | 2.398167 | true | adequate |
| 21.000000 | 45.034135 | 29.034135 | 5.600000 | 2.814633 | true | adequate |
| 24.500000 | 52.808173 | 36.808173 | 5.600000 | 3.300511 | true | adequate |
| 30.000000 | 65.024519 | 49.024519 | 5.600000 | 4.064032 | true | adequate |
| 40.000000 | 87.236058 | 71.236058 | 5.600000 | 5.452254 | true | adequate |
| 60.000000 | 131.659135 | 115.659135 | 5.600000 | 8.228696 | true | adequate |

The required margin holds at 5.600000 ft on every row because the required NPSH of 16.000000 ft did not change, and on that required NPSH it is the fraction that binds. The margin, the ratio and nothing else move with the drum.

## Five things come back, and they answer different questions

The margin is a subtraction in feet. The required margin is what the rule asks for at this required NPSH. The ratio is the available head over the required head. The pass flag is a boolean, and the severity is a label. Quoting one of them as though it were another is the error this check invites.

## Held for the literature

The rule itself is customary. Both halves of it are measurable, and measuring them is worth doing, but no publication in this repository states either one. So the course teaches the rule as a limit and grades nothing that depends on it. No required margin, no pass flag and no severity is a graded answer anywhere in this course.

What this does not mean is that the rule should be ignored. It is the best rule available here, it is the one the engine applies, and a reader should know its two halves to three decimal places and know equally well that neither has a source behind it.

## Exercise

State the two halves of the required margin rule as the engine reports them, and describe the call that isolates each one. Then give the margin, the required margin and the ratio at a drum pressure of 14.700000 psia against a required NPSH of 16.000000 ft, and say why the required margin column does not move across the sweep.
