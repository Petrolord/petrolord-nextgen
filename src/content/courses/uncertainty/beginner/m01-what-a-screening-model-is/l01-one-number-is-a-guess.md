# One number is a guess

A screening model returns one net present value for one set of inputs. For the teaching field ISIALA that value is 81.0464 million USD, and every input behind it is a single belief about years nobody has seen yet.

## One case, one answer

ISIALA is a field of 4400 bopd declining 12 percent a year, oil at 70 USD per bbl, capex of 180 million USD, royalty of 15 percent and tax of 35 percent, discounted at 12 percent from 2027. The screening engine turns those inputs into a ledger and reports four headline numbers.

| metric | ISIALA |
| --- | --- |
| npv, million USD | 81.0464 |
| irr, percent | 53.7148 |
| payback, years | 3.2746 |
| maxExposure, million USD | -44.6035 |

Each figure is printed to four decimals and none of them is certain. The decimals describe the arithmetic, not the knowledge.

## The same field, moved a little

Scale the oil price by 0.7 and the NPV is -17.3893 million USD. Scale it by 1.3 and the NPV is 175.8952. The engine's Low scenario, with price, production and variable opex times 0.8 and capex and fixed opex times 1.2, returns -57.8151. The mirror High scenario returns 226.0140. The single number 81.0464 sits inside a spread that runs from a project that destroys value to one worth far more.

Sampling price, capex and reserves up to 20 percent either side of the base, over 1000 iterations at seed 20260829, gives a distribution instead of a point. Its Low case P90 is 15.6063, its Best case P50 is 78.5315, its High case P10 is 152.0653, and its mean, the emv, is 80.9836.

## The mistake

The careful mistake is to read 81.0464 as what the project will probably earn. It is not a mean and not a Best case P50 of anything. It is the value at the inputs that were typed. On ISIALA the emv and the Best case P50 land close to it, and nothing in the engine promises they will on the next field.

The second mistake is to treat every low number as the same kind of low. The Low scenario of -57.8151 moves every input the wrong way at once and carries no probability. The Low case P90 of 15.6063 is a value the sampled NPV meets or exceeds with a 90 percent probability. Both belong to ISIALA, and they answer different questions.

## What one number refuses

A deterministic NPV refuses to say how likely it is. The quick inputs carry no range, so the engine cannot warn that a price 0.7 times the assumption turns ISIALA negative. The range has to be asked for, by a sweep, a scenario or a sample, and stated beside the number.

## Exercise

State ISIALA's deterministic NPV, its Low and High scenario NPVs, and its Low case P90 and High case P10 from the sampled run. Then explain why -57.8151 and 15.6063 are both called low and are not the same kind of number.
