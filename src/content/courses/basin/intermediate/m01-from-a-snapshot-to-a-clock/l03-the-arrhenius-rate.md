# The Arrhenius rate

Everything this tier computes reduces to one formula evaluated many times. This lesson takes it apart, puts real numbers through it, and establishes the two facts about it that explain nearly every result in the modules ahead: the rate rises much faster with temperature than intuition expects, and the twenty bins spread that rise across an enormous range.

## The formula

The rate constant of a first-order reaction at absolute temperature $T$ is

$$k = A \, e^{-E_a / RT}$$

with $A$ the frequency factor in reciprocal seconds, $E_a$ the activation energy, and $R = 8.314$ J/(mol K). The scheme quotes activation energies in kcal/mol, so the engine converts with 4184 J per kcal before dividing. For Easy%Ro, $A = 10^{13}$ per second for every bin, and the bins ladder $E_a$ from 34 to 72 kcal/mol in steps of 2.

Over a time step $\Delta t$ at constant temperature, a bin holding unreacted fraction $x$ decays to $x \, e^{-k \Delta t}$, with $\Delta t$ in seconds: one Ma is $3.1536 \times 10^{13}$ s in this engine's spec.

## How fast the rate rises

Take the 46 kcal/mol bin, one of the first bins with real weight in the Type II spectrum. At 100 degC its rate constant is $1.1411620329306917 \times 10^{-14}$ per second. At 110 degC it is $5.761498200490052 \times 10^{-14}$. Ten degrees multiplied the rate by 5.048799411678268.

Carry on to 150 degC and the rate is $1.7415225556963263 \times 10^{-11}$, which is 1526.0957738173342 times the 100 degC value. Fifty degrees bought three orders of magnitude.

You may have met the rule of thumb that reaction rates double every 10 degC. For this bin at these temperatures the truth is a factor of five, not two. The doubling rule comes from biology near 25 degC with activation energies around 15 kcal/mol; kerogen cracking runs at three times that energy, so its temperature sensitivity is correspondingly steeper. Keep the factor-of-five figure, because it is why a few hundred metres of extra burial can transform a source rock, and why module 3's heating-rate effects are as large as they are.

## How wide the ladder is

Now compare bins at one temperature. At 100 degC the 34 kcal bin's rate is $1.2186118753820952 \times 10^{-7}$ per second while the 72 kcal bin's is $6.743594503797703 \times 10^{-30}$. The ratio is $1.807 \times 10^{22}$.

That number is the design of the whole scheme in one line. At any given temperature, some bins react on timescales of years, some on timescales of millions of years, and some effectively never. As temperature rises, the boundary between "fast", "geological" and "never" sweeps up the ladder. A single first-order reaction cannot reproduce the smooth, drawn-out maturation that real organic matter shows across 100 degC of burial; twenty reactions with staggered energies can, and do.

This is also why module 4's isothermal fixture stalls. Hold the temperature fixed and the boundary stops sweeping: the bins below it burn out, the bins above it sit essentially inert, and no amount of waiting moves the high-energy mass. You will see that as hard numbers there.

## Worked example

How long does the 46 kcal bin take to lose half its contents at 100 degC?

The half-life of a first-order decay is $\ln 2 / k$. With $k = 1.1411620329306917 \times 10^{-14}$ per second, that is $6.0740 \times 10^{13}$ s, and dividing by $3.1536 \times 10^{13}$ s/Ma gives 1.926 Ma. The same bin at 150 degC, where the rate is 1526 times higher, has a half-life of about 1300 years. And the 72 kcal bin at 100 degC would need around $3 \times 10^{15}$ Ma, which is ten thousand times the age of the universe. All three regimes coexist in one rock at one moment, two bins apart on the same ladder.

## Exercise

Compute the rate-constant ratio for the 46 kcal bin between 110 and 100 degC using the numbers above, and state it to three figures. Then answer in a sentence each: why does the doubling-per-10-degC rule underestimate kerogen kinetics, and what feature of the scheme lets one rock contain reactions on wildly different timescales?

As a self check: the ratio is $5.761498200490052 / 1.1411620329306917 = 5.05$. The doubling rule assumes activation energies far below the 34 to 72 kcal/mol of kerogen cracking, and sensitivity grows with $E_a$. The staggered activation-energy ladder gives every bin its own timescale at a given temperature, from years to never, which is what lets the ensemble mature smoothly over a wide temperature range.
