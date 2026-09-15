# What the hurdle hides

A hurdle turns a rate into a yes or a no, and in doing so it throws away every other number on the row. What survives the comparison is one bit, and the money is not in it.

{{panel:ec-value-explorer}}

## One test, four different projects

Take a screening hurdle of 15 percent and run the EGINA scenarios past it.

| scenario | concept | capex | NPV | IRR | verdict at 15 percent |
| --- | --- | --- | --- | --- | --- |
| High price | FPSO development | 2250.0000 | 3667.1870 | 43.8693 | pass |
| Tie-back base | Subsea tie-back | 730.0000 | 1048.6281 | 40.4321 | pass |
| Base | FPSO development | 2250.0000 | 2047.5653 | 29.5998 | pass |
| Low price | FPSO development | 2250.0000 | 427.9436 | 14.4152 | fail |

The Low price case returns 14.4152 percent and fails. It is also worth 427.9436 million USD at a discount rate of 10.0000 percent, which is money the field would otherwise not have. The hurdle rejected a positive NPV, and it did so correctly by its own rule, because 14.4152 is less than 15.

## The ordering the hurdle imposes

Among the three that pass, the hurdle has nothing further to say, so the natural next step is to sort by how far each cleared it. That puts 40.4321 percent above 29.5998 percent, which puts 1048.6281 million USD above 2047.5653 million USD. A screening process built entirely on a rate against a threshold will reach for the tie-back and never surface that the FPSO was worth more. The two are not even the same commitment: 730.0000 million USD of capex against 2250.0000, and the hurdle divides that scale out before it tests anything.

## Two thresholds are already in play

The screening case is discounted at 10.0000 percent, and that rate is already a test: it is the rate at which future money is charged before the NPV is struck. A separate hurdle of 15 percent applied to the IRR afterwards is a second, stricter test, and the two are not the same test twice. The Low price case passes the first, since 427.9436 is positive, and fails the second. Which of those is the decision depends on what the 15 is for, and that is a policy somebody set rather than anything the engine derived.

## What a pass does not certify

A rate clearing a hurdle says nothing about whether the inputs behind it were sound. The Base rate of 29.5998 percent rests on one price of 70.0000 USD a barrel, one screening shape, a capex of 2250.0000 million USD and default terms of royalty 12.5000 percent and tax 30.0000 percent. Change the price to 48.0000 and the same concept, on the same capex, fails the same hurdle at 14.4152 percent. The hurdle did not detect anything about the project. It detected the price deck it was handed.

## The mistake

The mistake is a green tick with no NPV beside it. A reader who sees only the verdict cannot tell 427.9436 million USD of rejected value from a case that was genuinely worthless, and cannot tell a pass on 2047.5653 from a pass on 1048.6281. Report the rate, the NPV, the capex and the payback together, and let the hurdle filter rather than decide.

## Exercise

Apply a 15 percent hurdle to all four scenarios and record each verdict. Then state the NPV of the case that fails, and explain what a reader who sees only the verdicts cannot learn about the two passing FPSO cases.
