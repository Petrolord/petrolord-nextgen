# The critical pressure ratio

{{panel:cq-release}}

The critical pressure ratio is the one number that decides whether a gas release is choked. It is the ratio of ambient to upstream pressure at which the gas in the hole just reaches the speed of sound. At or below it the flow is choked; above it the flow is subsonic. The engine does not restate the formula. It imports `criticalPressureRatio` from the facilities relief engine, so the same function decides choking wherever the academy needs it.

## It depends on gamma alone

The critical ratio is (2/(gamma+1))^(gamma/(gamma-1)), where gamma is the heat capacity ratio Cp/Cv. Pressure, temperature, molar mass and hole size play no part. On the AMENAM gas line the engine returns, with everything else held:

| heat capacity ratio, stated | critical pressure ratio | upstream pressure to choke at 101325 Pa, derived |
| --- | --- | --- |
| 1.1 | 0.584679 | 173300.135461 |
| 1.2 | 0.564474 | 179503.418325 |
| 1.31 | 0.543927 | 186284.176006 |
| 1.4 | 0.528282 | 191801.047009 |
| 1.67 | 0.486669 | 208201.258009 |

The critical ratio falls as the heat capacity ratio rises. A gas with a larger ratio therefore needs a higher upstream pressure to choke into the atmosphere. The right hand column turns each ratio into that pressure by dividing ambient by the critical ratio. For the methane line, at 1.31, the answer is 186284.176006 Pa absolute.

## Reading the heat capacity ratio as an input

The heat capacity ratio is a property of the gas at its conditions, and it is always stated. The table shows why it deserves care: it moves the choking pressure, and in the subsonic band it moves psi and the mass rate as well. Once the flow is choked, it still enters the choked mass rate through the gas properties, so it never becomes irrelevant.

The engine refuses a ratio of one, where the formula has no meaning:

> heatCapacityRatio: gamma = Cp/Cv must be above 1

## A published case that needed an inferred ratio

The Yellow Book works a hydrogen release: 50 bar, 288.15 K, a hole of 0.1 m, a coefficient of 0.62, printed as 15.31 kg/s at time zero. The example does not print its heat capacity ratio. Running both candidates through the engine:

| heat capacity ratio | engine mass rate kg/s | printed |
| --- | --- | --- |
| 1.405, inferred | 15.311760 | 15.31 |
| 1.4 | 15.292930 | 15.31 |

A ratio of 1.405 reproduces the printed 15.31 kg/s to its two decimals, and 1.4 does not. The golden test behind the engine records the ratio as INFERRED, which is the honest description: the book's own result is the only evidence for it. When a published worked case leaves out an input, reproducing it means stating what you assumed and showing that the assumption returns the printed figure.

## Why the boundary sits where it does

At the critical ratio the gas in the narrowest part of the jet reaches the local speed of sound. A pressure disturbance cannot travel upstream faster than sound, so lowering the ambient pressure further sends no signal back into the hole. That is the physical meaning of choking, and it is why the ambient pressure disappears from the choked rate.

## Exercise

On the outflow view, keep the AMENAM gas line and set the heat capacity ratio to 1.67. Read the critical pressure ratio against the table. Then, with the ratio still at 1.67, set the upstream pressure to 200000 Pa and read the regime. Explain in one sentence why the same pressure would give a different regime at a heat capacity ratio of 1.1, using the right hand column of the table.
