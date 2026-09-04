# A dome is a thermometer

A nitrogen charge dialled at 60 degF is a different pressure at every depth in the string, and the correction is a real gas ratio rather than a chart factor.

{{panel:pd-valve-explorer}}

## Fixed volume, real gas

The dome is sealed, so pressure over z times absolute temperature is constant between the test rack and the valve. The engine solves that on nitrogen z and reports Ct as the charge divided by the dome pressure at temperature.

| Charge at 60 degF, psia | Valve temperature, degF | Dome at temperature, psia | Ct |
| --- | --- | --- | --- |
| 600.0 | 120.0 | 675.573876944 | 0.888133808 |
| 800.0 | 180.0 | 1007.243405139 | 0.794246948 |
| 1000.0 | 220.0 | 1355.233465958 | 0.737880244 |
| 1200.0 | 250.0 | 1720.461713076 | 0.697487187 |

The z values are doing real work across that range: 0.979414628 at the rack against 0.988632778 at 120.0 degF on the first row, and 0.972338202 against 1.020827392 on the last, where nitrogen is above unity. Inverting the correction returns the charge to 1.467e-11 psi on the first row, so the pair is a genuine round trip and not two independent approximations.

## The linear rule of thumb changes sign

The older manuals correct with one over one plus 0.00215 times the temperature rise above 60 degF. It reads 0.885739593 at 120.0 degF against a real 0.888133808, an error of -0.2696 percent, and it predicts 677.400000 psia against 675.573877 psia, a miss of 1.826123 psi. By 180.0 degF the error has crossed to 0.0838 percent and the miss to -0.843405 psi. At 220.0 degF it is 0.8358 percent and -11.233466 psi, and at 250.0 degF it is 1.7904 percent and -30.261713 psi.

A correction that is nearly exact at one temperature, wrong in one direction below it and wrong in the other above it is not a conservative approximation. There is no margin to be had from it, only a temperature at which it happens to be right.

## The mistake

Assuming a fixed charge means a fixed valve. At a constant 60 degF charge the pressure the valve actually feels rises with depth, because the valve gets hotter, and the rule of thumb drifts further the hotter and the deeper the valve is. Deep valves are where a linear correction is worst and where a wrong dome matters most. Ct falls from 0.888133808 to 0.697487187 across those four rows, so a shop that dials the same number for a shallow valve and a hot deep one has set two different valves.

## What it refuses

The dome z uses Dranchuk and Abou Kassem with nitrogen criticals, which is an extrapolation off the natural gas basis that correlation was fitted to. The engine header says so and pins the window it is defensible in, Tpr 2.3 to 3.1 and Ppr 1 to 5. It asserts no agreement with data this repository has not verified, so the correction is defensible rather than measured.

## Exercise

Take the 1200.0 psia charge at 250.0 degF and record the dome at temperature, Ct, and what the linear rule predicts.

Then say at which of the four temperatures the linear rule is closest, and why that is not a reason to use it.
