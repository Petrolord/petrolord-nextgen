# What a digit of agreement means

{{panel:ml-diagnose-explorer}}

Every comparison with a NIST certified value in this module is quoted as an LRE, the log relative error. This lesson defines it, shows how to read it, and reads the rest of the reference table, where the float-design limit tells you how many digits were ever on offer.

| dataset | smallest coefficient LRE | R-squared LRE | float-design limit |
| --- | --- | --- | --- |
| Norris | 14.06 | 15.48 | 14.07 |
| Pontius | 13.51 | 15.95 | 13.51 |
| Longley | 14.62 | 15.48 | 14.62 |
| Wampler2 | 13.20 | 16.00 | 13.2 |
| Wampler5 | 16.00 | 13.73 | 16 |
| Filip, maxCondition 1.00e+10 | 7.66 | 10.37 | 7.66 |

## The definition

LRE = -log10(|estimate - certified| / |certified|). Inside the logarithm is the relative error of the engine's figure against the certified one. Taking minus its base ten logarithm turns it into a count of digits: a relative error of one part in a hundred trillion gives an LRE of 14, and an LRE of 14 means the first fourteen significant digits agree. When the engine's figure and the certified string are identical in float, the relative error is zero and its logarithm is undefined, so the LRE is capped at 16.

An LRE need not be a whole number, and its fraction carries information: Norris's smallest coefficient LRE is 14.06, a little past fourteen digits. The table quotes the smallest LRE over a problem's coefficients, which is the worst coefficient, because a fit is only as trustworthy as its least accurate number.

## Coefficients and R-squared are different digits

The coefficient LRE and the R-squared LRE of one problem need not be alike. Wampler5 matches every certified coefficient at the cap, 16.00, and its R-squared LRE is 13.73. Filip's R-squared reaches 10.37 digits while its worst coefficient reaches 7.66. Quote the LRE of the figure you are using.

## The float-design limit

The float-design limit is how many certified digits the float64 inputs themselves allow: the exact solution of the design as rounded to float64. It is the ceiling set by the data before any method runs. Read each LRE against it. Wampler2's worst coefficient LRE is 13.20 against a limit of 13.2, and Pontius reads 13.51 against 13.51. The two figures in each of those rows print alike, and printed alike is not equal: they agree at the precision shown, and nothing finer is claimed.

Norris shows why the distinction matters: its worst coefficient LRE is 14.06 against a limit of 14.07. They print differently, and the engine's figure is the lower of the two.

## What a digit claim is worth

A digit of agreement is a statement about arithmetic on known inputs. It says nothing about whether the model is right for the rows. For a well, the digits that decide anything are the leading ones: the Ekene test RMSE on the teaching split is 4.282693 us/ft, and the course prints it to six decimals. What the reference problems buy is confidence that when an Ekene coefficient is printed to six decimals, those six decimals are the ones least squares gives, and that when a design would make them unreliable, the engine refuses before printing.

## Exercise

Take one certified value and one estimate of your own, for example a coefficient read in the panel's condition view and the same coefficient typed with its last two digits changed. Compute the LRE by hand from the definition above. Then change a digit further to the left and compute it again, and write down how many digits the LRE moved by.
