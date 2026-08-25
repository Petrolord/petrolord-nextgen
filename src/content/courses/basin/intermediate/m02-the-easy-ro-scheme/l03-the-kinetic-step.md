# The kinetic step

Between the twenty-bin state and the graded reflectance sits one function that does all the work. The engine calls it kineticStep, and it advances every bin one time interval at one temperature. This lesson works it by hand, because the ramp results of module 3 and the stall of module 4 both become obvious once you have executed the step yourself.

## The step

Over an interval $\Delta t$ at absolute temperature $T$, each bin decays independently:

$$x_i \leftarrow x_i \, e^{-k_i \Delta t}, \qquad k_i = A \, e^{-E_i \cdot 4184 / (8.314\,T)}$$

with $E_i$ in kcal/mol and $\Delta t$ in seconds, one Ma being $3.1536 \times 10^{13}$ s. Nothing couples the bins; the ensemble behaviour comes entirely from their different $E_i$.

The step is exact for a constant temperature, not an approximation. The only approximation anywhere in this tier is representing a continuously changing temperature as a staircase of short constant-temperature steps, and the ramp convention in module 3 controls that error by making the steps 0.01 Ma and evaluating each at its midpoint temperature.

## A step by hand

Take the 46 kcal bin at 100 degC, so $T = 373.15$ K and, from module 1, $k = 1.1411620329306917 \times 10^{-14}$ per second. Advance one Ma: $k \Delta t = 1.1411620329306917 \times 10^{-14} \times 3.1536 \times 10^{13} = 0.35988$. The survival factor is $e^{-0.35988} = 0.69777$, so the bin loses about thirty percent of whatever it holds, every million years, for as long as the temperature stays at 100 degC.

Now do its neighbours at the same temperature. The 48 kcal bin's rate is lower by the factor $e^{2 \times 4184 / (8.314 \times 373.15)} = e^{2.6973} = 14.84$, so its survival factor is $e^{-0.35988/14.84} = e^{-0.024251} = 0.97604$, losing about 2.4 percent per Ma. The 50 kcal bin loses about 0.16 percent per Ma. Three bins, one temperature: fast, slow, barely moving. The factor between adjacent bins, 14.84 at 100 degC, is the ladder's rung spacing, and it is why the reacting front is always narrow, a couple of bins wide, with burnt-out bins below it and untouched bins above.

## Sequences of steps compose

Two consecutive steps at the same temperature multiply the survival factors: $e^{-k\Delta t} \cdot e^{-k\Delta t} = e^{-2k\Delta t}$. So at constant temperature the state after 50 Ma is identical whether you take fifty 1 Ma steps or five thousand 0.01 Ma steps. Step size is irrelevant when the temperature is truly constant, which is why the isothermal fixture of module 4 can use whole-Ma steps without loss.

On a ramp, temperature differs from step to step and the factors no longer merge, because each carries its own $k(T)$. Then step size matters, and the convention has to say what it is. That is the entire content of the next module's first lesson.

## Order does not matter, path does

One more property, and it explains a subtlety. Survival factors commute, so applying the steps of a history in reverse order gives the same final state. What changes the outcome is not the order of the multiplications but which temperatures appear and for how long. A history that visits 150 degC for 1 Ma drains the low ladder in a way that no reordering of cooler steps can undo or imitate. Keep this in mind when module 5 discusses why maturity records the hottest chapter of a rock's history so disproportionately.

## Worked example

The 46 kcal bin starts at the Type II potential of 0.01. How much remains after 10 Ma at 100 degC, taking ten 1 Ma steps?

Each step multiplies by 0.69777, so ten steps multiply by $0.69777^{10} = e^{-3.5988} = 0.027357$. Remaining: $0.01 \times 0.027357 = 0.00027357$; reacted: 0.0097264. This single bin, at 97 percent drained, will turn out to supply nearly half of the isothermal fixture's 10 Ma transformation ratio in module 4, and you have just computed its state on paper.

## Exercise

Using survival factor 0.97604 per Ma for the 48 kcal bin at 100 degC, compute the fraction of that bin remaining after 50 Ma, and the reacted weight it contributes given its Type II potential of 0.05. One sentence: why does step size not matter at constant temperature?

As a self check: $0.97604^{50} = e^{-50 \times 0.024251} = e^{-1.21255} = 0.29765$, so 29.8 percent remains and the bin contributes $0.05 \times (1 - 0.29765) = 0.035118$ of reacted weight, within rounding of the engine's 0.035128 for the same bin. Step size is irrelevant at constant temperature because exponential survival factors at the same rate compose into a single exponential of the total time.
