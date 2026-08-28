# Dead oil

The first link in the chain: what the oil would be like with no gas in it at all.

## What dead oil means

Oil with no dissolved gas, at reservoir temperature. It is what is left in the stock tank, warmed back up.

Nobody produces dead oil from a reservoir. It is an intermediate quantity: the viscosity correlations are built in stages, and the first stage asks what the oil alone would do before any gas is put back into it.

## Beal's correlation

The engine uses Beal (1946), which needs two numbers, oil gravity and temperature:

$$\mu_{od} = \left(0.32 + \frac{1.8 \times 10^7}{\text{API}^{4.53}}\right)\left(\frac{360}{T + 200}\right)^{a}, \quad a = 10^{\left(0.43 + \frac{8.33}{\text{API}}\right)}$$

The API term is the striking part. It enters raised to 4.53 in a denominator, so viscosity falls extremely steeply with gravity. A 20 API oil and a 40 API oil at the same temperature differ by more than an order of magnitude.

## Ekene's dead oil

At 32 API and 180 F:

$$\mu_{od} = 2.3437444714709295 \text{ cp}$$

Hold that against the designed live oil viscosity of 1.8 cp. The dead oil is thicker, which is correct: the gas that will be dissolved into it has not been added yet, and dissolved gas thins oil.

## Temperature is doing most of the work

Run Beal at 32 API and 100 F instead of 180 F and the answer roughly doubles. Temperature dependence of liquid viscosity is strong and roughly exponential, which is why every viscosity number must carry its temperature.

A dead oil viscosity quoted without a temperature is not a number. It is a number and a missing argument.

## How well it does

Less well than the volume correlations. Beal's data set was 655 measurements on 492 oils, which is broad, and the scatter around the fit is substantial: viscosity depends on molecular structure that API gravity and temperature do not capture. Two oils with the same gravity at the same temperature can differ by a factor of two.

The engine flags this by attaching a validity range and warning outside it. Inside the range you should still expect a dead oil viscosity from a correlation to be the weakest number in your black-oil description.

## Why it matters more than it looks

Viscosity enters the mobility ratio, which drives areal sweep, and it enters the fractional flow function, which drives everything about a displacement. It also sets well productivity through the inflow relationship.

So the weakest number in the description is one of the most consequential. That combination is worth knowing about: if a study's conclusion turns on the mobility ratio, the viscosity is where to spend the measurement money.

## The misconception to avoid

"Dead oil viscosity is what you would measure on a stock tank sample." It is what you would measure on a stock tank sample AT RESERVOIR TEMPERATURE, which is not what a tank sample is at. Measuring a tank sample at ambient and using it as the dead oil viscosity gives a number that is far too high, and the error propagates through the whole chain.

## Exercise

First, compute Beal's dead oil viscosity for Ekene at 32 API and 180 F, and compare it against the designed live oil viscosity of 1.8 cp. Say which is larger and why that is the right way round.

Second, explain in two sentences why the API exponent of 4.53 means viscosity correlations are more sensitive to a gravity error than volume correlations are.
