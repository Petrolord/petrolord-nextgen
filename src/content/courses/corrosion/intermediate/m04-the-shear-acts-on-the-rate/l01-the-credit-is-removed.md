# The credit is removed

{{panel:fc-inhibitor-integrity-explorer}}

When the wall shear says the corrosion inhibitor film is gone, this module
computes the rate with the credit removed. It does not warn beside a rate that
still carries the credit. The number and the sentence next to it agree, and
that agreement is the design decision at the centre of the engine as it ships.

No new correlation was written to do it. The credit is simply not taken, so the
rate that comes out is the uninhibited rate for those conditions.

| stream | film stripped | rate mm/yr | rate with the credit kept mm/yr | life yr | life with the credit kept yr |
| --- | --- | --- | --- | --- | --- |
| Etelebou | false | 1.676428 | 1.676428 | 1.655305 | 1.655305 |
| Kanbi | false | 0.361255 | 0.361255 | 7.681561 | 7.681561 |
| Tunu | true | 17.138674 | 3.647110 | 0.161915 | 0.760876 |
| Opukushi | false | 0.076842 | 0.076842 | 36.112878 | 36.112878 |
| Angiama | false | 0.014444 | 0.014444 | 192.123424 | 192.123424 |

## One of those streams behaves differently

Four of the streams in that table have a film that survives, and on each of them
the two rate columns carry the same figure and the two life columns carry the
same figure. The Tunu stream is the exception. Its rate is 17.138674 mm/yr and its
rate with the credit kept is 3.647110 mm/yr, and its remaining life is 0.161915
yr against 0.760876 yr with the credit kept.

That is the cost of the shear verdict, stated in years on the same row as the
verdict itself.

## What the alternative would have looked like

A module can compute a rate that takes the corrosion inhibitor credit in full
and then print a warning underneath saying the film is probably gone. The rate
and the warning then disagree, and the reader has to resolve the disagreement
themselves, usually by trusting the number because a number looks like a result
and a paragraph looks like advice. This engine takes the other route and lets
the arithmetic carry the verdict.

## The engine's own warning

> the inhibitor credit has been removed: the wall shear at these conditions
> strips the film, so the 82 percent on the datasheet is not what this line
> sees and the rate above is the uninhibited rate

Two things in that sentence are worth noticing. It names the datasheet figure
the reader has been working with, so the reader can see which number stopped
applying. And it says the rate above is the uninhibited rate, which tells you what
the headline figure now is rather than leaving you to work it out from the
warning.

## The summary agrees as well

On the Tunu stream the binding constraint the screening reports is wall shear on
the corrosion inhibitor film, and its own words are:

> wall shear 370 Pa is above the 100 Pa at which this module takes the film to
> be stripped, so the inhibitor credit is removed and the rate is 4.70 times
> what the datasheet efficiency would give. Slowing the line changes this answer
> before anything else does.

So the rate, the warning and the summary all say the same thing on that case.
The last sentence is the useful one operationally, because it names the input to
move first.

## Exercise

Record the rate, the rate with the credit kept and both life figures for the
Tunu stream and for one stream whose film survives. State which pair of columns
differs on which stream, and write down what the binding constraint says the
reader should change first on the stripped case.
