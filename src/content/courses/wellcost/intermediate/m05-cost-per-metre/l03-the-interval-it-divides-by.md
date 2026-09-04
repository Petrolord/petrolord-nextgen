# The interval it divides by

The denominator is what the section made, not where the section ended.

{{panel:wc-afe-explorer}}

## Interval and depth are different numbers

Every section but the first starts somewhere other than surface. The golden well has three.

| section | section TD, m | interval, m |
|---|---|---|
| 26in surface | 500 | 500 |
| 17-1/2in intermediate | 2,000 | 1,500 |
| 12-1/4in production | 3,000 | 1,000 |

The engine takes `intervalM`. Feed it the section TD instead and the production hole's cost is divided by three times the length it actually drilled, and the section is reported at a third of its true rate. Nothing errors. The number simply comes out flattering, and it comes out most flattering on the deepest and most expensive section, which is the one you are usually trying to defend.

That is the single most common way this formula is misused, and it is invisible in the output.

## Why the trap is quiet on this well

On the golden programme the total depth is 3,000 m and the metres drilled are 3,000 m, because the well starts at surface and every metre of the hole was made by this programme.

So at well level the two denominators agree and the error hides. Put a sidetrack, a re-entry or a tie-back in front of the same programme and they part company at once, and every whole-well rate you quote depends on which one you divided by.

## Whole well against section

Two whole-well rates are worth having in your head, and neither of them is a section rate.

| metric | USD/m |
|---|---|
| AFE base over metres drilled | 1793.3333333333333 |
| AFE total over metres drilled | 1972.6666666666667 |

Now compare those with what the three section calculations add up to. The section totals are 206,000, 722,000 and 746,000 USD, which is 1,674,000 USD, and that is 0.31115241635687735 of the 5,380,000 USD base.

So the sections, priced on bits and rig hours, account for under a third of the well. The other two thirds are casing, cement, the wellhead, logging, mud, completion, the rig move and every hour the bit was not on bottom. Both denominators are metres. The numerators are not remotely the same quantity.

## The rule

State the denominator every time. A cost per metre without the interval it used is not a number anybody can check, and the two candidate intervals differ by a factor that can be large.

## Exercise

Compute the intermediate section rate twice, once against 1,500 m and once against 2,000 m, and say which one a service company would prefer to quote.

Then take the ratio of the three section totals to the AFE base and say, line by line from the AFE, where the missing money went.
