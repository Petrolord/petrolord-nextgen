# What the hurdle hides

A hurdle turns a rate into a yes or a no, and in doing so it throws away every other number on the row. On this plan it throws away more than that, because not one of the five scenarios carries a rate for a hurdle to test.

{{panel:ec-value-explorer}}

## One test, and nothing to test it on

The scenario card colours an internal rate of return of 15 percent or more green and anything below it amber, and that is the only hurdle rate anywhere in the studio.

| scenario | concept | capex | NPV | rate of return |
| --- | --- | --- | --- | --- |
| High price | FPSO development | 2250.0000 | 3638.0233 | none, multiple-roots |
| Base | FPSO development | 2250.0000 | 2015.4123 | none, multiple-roots |
| Tie-back base | Subsea tie-back | 730.0000 | 1013.7182 | none, multiple-roots |
| Low price | FPSO development | 2250.0000 | 392.8013 | none, multiple-roots |
| Stress | FPSO development | 2250.0000 | -1834.1220 | none, no-root |

Each of those five carries a value and none of them carries a rate, because the plan pays 260.0000 million USD to abandon the field in production year 20 and every flow changes sign twice. A rule written against the rate returns nothing on every row, on the row worth 3638.0233 million USD and on the row worth -1834.1220 alike.

## What the colour was hiding while it still worked

Run the Base case with no end-of-life cost and it reports 29.5998 percent on a value of 2047.5653 million USD, comfortably inside the green. That colour was never a statement about how much money a case carried. A rate divides the size out before it reports, so a commitment of 730.0000 million USD of capex and one of 2250.0000 can clear the same threshold and leave very different amounts behind: 1013.7182 million USD against 2015.4123 at the same price.

## Two thresholds, and only one of them still works

The screening case is discounted at 10.0000 percent, and that rate is already a test, since future money is charged at it before the value is struck. A hurdle of 15 percent applied to the rate afterwards is a second and stricter test, and it is the one that now has no input. The first still reads on every case: 392.8013 million USD at 48.0000 USD a barrel is positive, and -1834.1220 at 18.0000 is not.

## What a verdict never certified

A rate clearing a hurdle said nothing about whether the inputs behind it were sound. The Base figures rest on one price of 70.0000 USD a barrel, one screening shape, a capex of 2250.0000 million USD and default terms of royalty 12.5000 percent and tax 30.0000 percent. Change the price to 48.0000 and the same concept on the same capex is worth 392.8013. A threshold detects the price deck it was handed.

## The mistake

Reading a missing rate as a failed one. A card that leads with a rate has nothing to print on any of these five cases, and a reader who treats the empty cell as a low score ranks 3638.0233 million USD below nothing at all. Report the value, the status, the capex and the payback together, and let a hurdle filter what it can still measure.

## Exercise

State what each of the five EGINA scenarios reports for its rate of return and the status beside it. Then give the value at 92.0000 USD a barrel and the value at 18.0000, and say what a hurdle of 15 percent can tell a reader about either of them.
