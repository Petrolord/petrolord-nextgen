# Frequencies per year and probabilities

{{panel:qr-event-tree}}

A QRA multiplies two kinds of number, and most beginner mistakes come from mixing them up. A frequency counts events per year and may be any size at all, including above one. A probability lies from zero to one and has no unit. The engine keeps the two apart by carrying the unit in every input name, so `initiatingFrequencyPerYr` is a frequency and `fatalityProbability` is a probability.

## The units the engine takes

| quantity | unit | allowed range |
| --- | --- | --- |
| initiating or scenario frequency | per year | above 0 for an event tree root; 0 or more for a scenario |
| branch probability | probability | 0 to 1, and every branch set sums to 1 |
| probability of death | probability | 0 to 1 |
| occupancy | fraction of the year, or hours per year | 0 to 1, or 0 to 8760 hours |
| individual risk | per year | 0 or more |

Read the table as a set of promises. An event tree root must happen at some rate, so its frequency must be above zero. A single scenario may have a frequency of zero and still be listed. A probability of death can never exceed one, whatever the fire.

## A frequency is a rate

A frequency of 1e-4 per year is one event in ten thousand years on average. It says nothing about which year. It is a rate, never a probability, and that is why the engine will never accept a frequency in a probability field or the other way round. The two live in different inputs.

When you multiply a frequency by a probability you get a frequency back. EREMOR's gas release happens at 5e-4 per year, as stated, and ignites immediately with a stated probability of 0.1. The immediate fire therefore happens at 0.000050000000 per year. The unit stays per year all the way through a tree, and an individual risk is also a frequency per year: the frequency with which one person at one place is killed.

## Hours become fractions of the year

Occupancy can be typed as a fraction of the year or as hours per year. The engine converts hours at 8760 hours a year, the same hours in a year the LOPA course engine uses, which belongs to the LOPA course and is borrowed here unchanged. So 8760 hours at one place is an occupancy of 1.000000, the whole year. A person present all year at a place whose individual risk is 1e-5 per year, as stated, carries an IRPA of 0.000010000000 per year.

## Precision

Frequencies, individual risks and probabilities are printed to twelve decimals. Stated inputs are written as typed, so 5e-4 stays 5e-4. Keep the full figure through a calculation and round only at the end, because a figure cut short early cannot be recovered later.

## Exercise

EREMOR's release is stated at 5e-4 per year with an immediate ignition probability of 0.1. Multiply the two, write the result to twelve decimals, and check it against the 0.000050000000 per year quoted above. Then say which of the two inputs is the frequency, which is the probability, and what unit your answer carries.
