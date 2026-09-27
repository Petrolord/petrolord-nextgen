# Halves upward

{{panel:materials-register-calculator}}

The rule nearest has one case the plain word does not settle: an EOQ that sits exactly halfway between two multiples. Neither multiple is nearer. Some rule has to decide, and the engine states the one it uses: the nearest multiple takes halves upward.

## The exact half

On a stated case with an order cost of 25, a demand of 50 a year and a holding cost of 1 a unit a year, the EOQ is exactly 50.000000. Round it to the nearest multiple of 100 and it sits exactly between 0 and 100. The engine takes it upward, to 100.000000, and its reason says so in brackets, verbatim:

> EOQ = sqrt(2 x 25 x 50 / 1) = 50; ordered as 100 (the nearest multiple of 100 (halves upward)), a relevant cost of 62.5 a year against 50 at the EOQ

Every reason for the rule nearest carries the words "halves upward", so a reader never has to guess what happened at a tie.

## A stated choice, with its alternative

Halves upward is the engine's reading where the texts leave room. The alternative a policy might prefer is halves downward, which would round the same exact half to 0 and, in this case, order nothing. The engine names its choice in every reason. No graded figure in this course depends on it: every capstone field is the same number under halves upward and under halves downward.

The half case is also where the engine's tie convention shows. It reads the quotient of the quantity over the multiple at 12 significant digits, so a quotient that should be exactly one half but carries a trace of binary noise is still read as one half.

## Nearest, when it is no tie

Most EOQs are nowhere near a half. On a stated case whose EOQ is 15.811388, the nearest multiple of 10 is 20.000000, and that is what the engine orders. On another, an EOQ of exactly 20.000000 rounded up to a multiple of 4 stays at 20.000000, because it is already a multiple: up means the next multiple at or above.

| stated case | EOQ | rule | quantity ordered |
| --- | --- | --- | --- |
| an EOQ exactly half a multiple | 50.000000 | nearest, multiple 100 | 100.000000 |
| an EOQ nearer the upper multiple | 15.811388 | nearest, multiple 10 | 20.000000 |
| an EOQ already a multiple | 20.000000 | up, multiple 4 | 20.000000 |

## A rounding that orders nothing

Round the same EOQ of 50 down to a multiple of 100 and the quantity ordered would be 0: a policy that never orders. The engine refuses it by name, before any cost is computed. On a stated case with an EOQ of 400, the message reads, verbatim:

> rounding gives an order quantity of 0 from the EOQ 400; state a smaller multiple or another rule

The refusal tells you what to do: pick a multiple the EOQ can reach, or a rule that rounds up.

## Exercise

Open the register calculator in "The economic order quantity" and start from "An EOQ exactly halfway between two multiples". Copy the reason and find the words that name the tie rule. Change the Rounding rule control to down and copy the refusal. Then return to "Baryte on the Ekene register", set the rule to nearest, and find a Rounding multiple that puts baryte's EOQ closer to the higher multiple than the lower one, and another that puts it closer to the lower.
