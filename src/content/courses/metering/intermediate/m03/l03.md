# The specific heat ratio factor

Everything in the gas equation so far has treated the gas as one substance with one behaviour. It is not. How far a gas expands for a given pressure drop depends on its specific heat ratio, and the correction that carries that is the specific heat ratio factor, written Fk.

## The factor across the gases in this course

The engine returns Fk for a specific heat ratio of 1.100000 as 0.785714, for 1.200000 as 0.857143, for 1.300000 as 0.928571, for 1.400000 as 1.000000 and for 1.660000 as 1.185714.

The row at 1.400000 is the anchor. Air at ordinary conditions sits at a specific heat ratio close to that value, and the factor returns exactly 1.000000 there, which tells you what the factor is for: it scales a valve's terminal behaviour, which is quoted on air, onto the gas actually being handled.

## Reading the two ends

A specific heat ratio of 1.100000 covers the heavier hydrocarbon gases and the richer process streams. A specific heat ratio of 1.660000 covers the monatomic gases, which in a plant means helium and argon service. The factor takes a different value at each of those ends, so a valve sized on air behaviour and then put on one of them is being sized on the wrong terminal ratio.

The BELEMA gas case carries a specific heat ratio factor of 0.907143 at its crossing, alongside a terminal pressure drop ratio of 0.680357 and a coefficient of 151.964887.

## Why this is a small lesson with a large consequence

Fk works in two places. It multiplies xT to set the terminal ratio, so it moves the choking boundary. It also sits inside the expansion factor on every row, where Y is one less x over three times Fk times xT, so it moves the coefficient at any operating point as well. Near the boundary the first effect decides which side of it the service sits on. A relief bypass on a light gas, a fuel gas letdown station and a nitrogen blanket valve are all services where the inlet pressure changes through the day and the boundary is somewhere in the operating range.

So the practical instruction is simple. Take the specific heat ratio off the actual stream composition at the actual flowing temperature, and treat a valve quoted on air as a valve quoted for a gas you are probably not handling.

One more habit goes with it. Where a stream composition changes with plant mode, take the specific heat ratio at each mode and check the crossing at each one, because the factor and therefore the boundary move with it.

## Exercise

Write down the specific heat ratio factor the engine returns at specific heat ratios of 1.100000 and 1.660000, and say which of the five listed ratios returns a factor of exactly 1.000000. Then say whether Fk changes the coefficient at an operating point well away from the boundary, the position of the boundary itself, or both, and name the place in the gas equation each effect comes from.
