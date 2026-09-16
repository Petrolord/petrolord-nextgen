# Working the capstone

The assessment states a compression duty and asks for the figures an engineer would hand a vendor. Every one of them is reachable by running the chain in order and reading what the engine returns.

{{panel:fc-compressor-explorer}}

## What the prompt gives you

A rate, a suction pressure and temperature, a discharge pressure, a gas gravity, k, a polytropic efficiency and a mechanical efficiency, a maximum ratio per stage, a maximum discharge temperature, an intercooling approach, a driver heat rate and a fuel heating value.

Notice which of those are stated rather than defaulted. The ratio limit, the discharge limit and the approach are the three inputs that discriminate a stage count, and all three are given. Nothing you answer should depend on a default, and in particular nothing should depend on the held default discharge limit.

## Run the chain in order

The exponent comes first, out of k and the polytropic efficiency alone. Nothing else in the chain can be computed before it, because the discharge temperature, the head and the compressibility at discharge all follow from it.

The stage count comes next, and it needs the approach as well as the two pressures, because a count for more than one stage is tested from the hotter of the suction and the cooled temperature. The ratio per stage follows from the count and the overall ratio.

Only then is there a first stage. Its inlet is the suction, because stage one is never cooled. Its ratio is the ratio per stage. Its discharge temperature comes from the exponent applied at that ratio, its compressibility is taken at both ends and averaged, and its polytropic head and gas horsepower follow.

The driver is last, because it is sized on the whole train's brake horsepower and not on one stage.

## The traps in that order

Do not take the first stage at the overall ratio. It takes the ratio per stage, and the two are different numbers on any multi-stage duty.

Do not take the first stage's inlet from the intercooler approach. Stage one runs from the suction. Every later stage runs from the approach, which on a duty whose approach sits above the suction is a different temperature and a visibly different discharge.

Do not compute a stage count at the suction when the approach is warmer. That is the comparison this tier is built on.

Do not quote a head without saying which one it is. A polytropic head divided by an isentropic efficiency is a wrong answer that looks right.

## Precision and words

Gas work prints to four decimals for temperatures, heads, Btu per hr and acfm; exponents, small factors and MMscfd to nine; ratios and percentages to six; counts are whole numbers. Quote figures as the engine prints them.

Where an answer is a word rather than a number, give the word. "Governed by discharge temperature" is an answer, and it is the field that tells a reviewer which input to argue about.

## Exercise

Write the order of the chain from the exponent through to the driver fuel, saying what each step needs from the step before it. Then list the four traps in that order and say, for each one, which graded quantity it would spoil.
