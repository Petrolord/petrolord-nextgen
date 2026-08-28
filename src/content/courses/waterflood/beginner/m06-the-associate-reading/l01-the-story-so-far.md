# The story so far

Five modules, one field, one question: is this flood replacing what it takes? This lesson collects the answer and the reasoning that supports it, in the order you would present it to someone who has not read the course.

## The field

Ekene, a single sand with 12139208.107496763 stock tank barrels of oil in place, six wells, and an oil water contact at 1560 m. Two of the six wells found the sand wet and were converted to water injection at the start of 2023. The record covers 36 monthly periods to the end of 2025.

At the flood start the reservoir had produced 261475.03999967827 stb and had fallen from 3200 to 2096.0082626669955 psia, leaving 96 psi of margin above the 2000 psia bubble point.

## The measurement

Voidage is counted in reservoir barrels. Produced voidage is $N_p B_o + W_p B_w + G_{\text{free}} B_g$, with free gas being what is left after subtracting the solution gas $R_s N_p / 1000$. Injected voidage is $W_i B_w + G_i B_g$. Their ratio is the voidage replacement ratio.

Ekene's conventions: factors frozen at 2100 psia giving $B_o = 1.21584$ and $B_w = 1.02$; $B_g = 0$ because the reservoir never went below its bubble point and so has no free gas at all; $R_s = 400$ scf/stb, which makes the solution gas subtraction exactly cancel the produced gas.

Getting this wrong is expensive and quiet. Reading the same rows with the formation volume factors defaulted to one inflates the cumulative VRR by a factor of 1.185218598407499, with no error raised.

## The numbers

$$\text{cumulative VRR} = 1.034899536109$$
$$\text{produced voidage} = 221736.43680913927 \text{ rb}$$
$$\text{injected voidage} = 229474.93559224083 \text{ rb}$$
$$\text{latest instantaneous VRR} = 1.05$$
$$\text{fill-up} = \text{2023-12, period index } 11$$

The field followed a designed target profile: 0.85 in the first month rising by 0.04 a month to 1.05 in month five, then 1.05 held. Against an operator band of 1.00 to 1.20, four months are flagged under, all of them the start-up ramp, and none is flagged over.

## The pressure check

The tank inversion with injection as a negative withdrawal,

$$\Delta p = \frac{N_p + (W_p - W_i)B_w/B_{oi}}{N(c_o + c_{efw}) - N_p c_o}$$

reproduces the Material Balance course's flood-start pressure exactly and then continues through the flood. Pressure falls to a trough of 2088.9530115439275 psia at 2023-04, then recovers 34.4931292839633 psi to finish at 2123.4461408278908 psia.

The trough sits where it does because break-even is at $B_{oi}/B_o = 0.9869719699960521$, not at 1.0. The last month below break-even is the last month that loses ground.

## The three honest caveats

**The surveys cannot see the trough.** Six-monthly surveys put the apparent minimum at 2023-07 rather than 2023-04, and 2.427063793101752 psi too high. That is a resolution limit, not an arithmetic one, and no better interpolation fixes it.

**The convention is cheap here and might not be elsewhere.** Recomputing on a tracked $B_o$ moves the cumulative VRR by 0.004486031110162436 percent. That is a result about a narrow undersaturated pressure range, not a general result.

**The field number hides its own halves.** Everything above is a field average, and a field average of a flood is an average over geometry. That is where the next tier starts.

## How to present this

The shape that works is: the measurement and its conventions, then the number, then the pressure check, then the caveats. Present the number first and you will spend the rest of the meeting defending conventions. Present the conventions first and the number arrives already trusted.

## Exercise

First, write a five-sentence summary of the Ekene flood's first three years suitable for the front page of a technical note. It must contain the cumulative VRR, the pressure behaviour, one convention, and one caveat.

Second, identify which single number from this tier you would most want a second, independent measurement of, and say what measurement you would ask for.
