# Four answers and one refusal

{{panel:fc-chemistry-explorer}}

The regime door answers in four words and it also says whether its own rate
model still applies. The four words are carbonate, mixed, sulphide and unknown.

| CO2 mol fraction | H2S mol fraction | ratio | regime | does the CO2 rate model apply | is the rate an upper bound |
| --- | --- | --- | --- | --- | --- |
| 0.020000 | 0.000010 | 0.000500000000 | carbonate | true | false |
| 0.020000 | 0.000200 | 0.010000000000 | mixed | true | true |
| 0.020000 | 0.000800 | 0.040000000000 | mixed | true | true |
| 0.020000 | 0.001200 | 0.060000000000 | sulphide | false | false |
| 0.020000 | 0.020000 | 1.000000000000 | sulphide | false | false |
| 0.000000 | 0.001000 | none | unknown | null | false |

The two boundaries, measured by bisecting the regime word the engine returns,
are 0.002000000000 and 0.050000000000. Both are held for literature. No source
for either exists in this repository, so a case near a boundary is near a line
of unknown position.

## The middle regime stays graded and is marked

In the mixed regime the rate is still issued and a flag marks it as an upper
bound, with a note of the engine's own:

> mixed sulphide and carbonate films: the CO2 rate is an upper bound and the
> real rate depends on which film persists

A mixed film is a reason to read the number as a ceiling. The studio's shipped
case is in this regime, at a ratio of 0.033333333333.

## The sulphide regime withholds

Above the higher boundary the engine says a CO2-only rate model no longer
describes the surface. It then does something worth studying: it keeps the rate
as a stated upper bound and withholds the category and the life.

Take the shipped case and raise the H2S from 0.1 to 1 mol percent. The ratio
becomes 0.333333333333, the regime becomes sulphide, and the rate is UNCHANGED
at 0.754524 mm/yr. That is the lesson in one line. H2S is not in the CO2 rate
correlation at all, so it cannot move the rate. What changes is that the
category and the remaining life are now WITHHELD and the rate is retained only
as a stated upper bound.

> the H2S to CO2 ratio puts this stream in the sulphide regime, where a
> CO2-only rate model no longer describes the surface. The rate above is
> retained only as an upper bound.

## Three different treatments of one rate

Read the three regimes as three positions on the same question. In the
carbonate regime the CO2 rate model applies and the rate is issued plainly. In
the mixed regime the model still applies and the rate is issued with a flag
saying it is a ceiling. In the sulphide regime the model no longer applies, and
the rate is issued as a stated upper bound while the two fields a reader would
summarise by are withheld.

The sulphide position is the interesting one, because two easier routes were
available. Refusing the rate outright throws away a usable ceiling, and carrying
on regardless is what a bare correlation does. This engine issues the number and
tells you what kind of number it now is.

## The fourth answer

With no CO2 partial pressure there is no ratio to form, so the regime is unknown
and the engine carries a note saying which film governs is not known there.
Both unknown branches carry a note, so a panel printing one always has something
to print.

## Exercise

Record the regime word, the ratio and whether the rate is an upper bound for the
shipped case and for the same case at 1 mol percent H2S. State what the rate did
between those two screens and why. Then record the two boundary ratios and say
what held for literature means about them.
