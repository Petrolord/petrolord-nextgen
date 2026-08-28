# A model of a model

The geoscience courses booked Ekene at 12139208.107496763 stock tank barrels. This deck contains an amount of oil too. Those two numbers were computed from the same contact, the same porosity and the same saturation, by the same engine, and they are not the same number.

## Why there are two numbers at all

The booking came from a gridded surface, clipped at the contact, summed cell by cell. The deck's volume comes from a different gridded surface, on a different frame, clipped at the contact by a different rule, summed by the same engine.

Same field, same physics, two models. The deck is a model of the reservoir, and the booking is also a model of the reservoir, so the deck is a model of a model. Every difference between them is a difference in modelling choices rather than in the field.

{{panel:sim-structure-explorer}}

The tiles show the deck's volume against the booking. Leave the convention on cell centre for now; the next lesson explains the toggle.

## What the deck contains

Under Eclipse's own saturation rule:

| quantity | value |
|---|---|
| net rock | 17805189.204433776 m3 |
| pore volume | 3561037.840886752 m3 |
| hydrocarbon pore volume | 2314674.5965763894 m3 |
| STOIIP | 12132366.897955146 stb |

against the booked 12139208.107496763 stb. The gap is

$$-0.05635630826191784 \text{ percent}$$

Six hundredths of one percent, and the deck is the smaller.

## Why that is suspiciously good

It is. Two independently constructed models agreeing to six hundredths of a percent does not happen by accident, and a reader should immediately ask what made it happen.

The answer is that it was arranged. The deck's structure carries one free parameter, and that parameter was set so this number would come out. Lesson 3 is about what the parameter is and lesson 4 about what setting it cost.

That is not cheating. Matching a static model to a booked volume is a standard step with a standard name, and doing it deliberately and saying so is the honest version. The dishonest version is doing it and presenting the agreement as independent confirmation.

## The same engine, deliberately

The deck's volumes were computed with the same routine that produced the NG5 booking. That is a choice worth defending.

Using a different volumetric calculation would have added a second source of difference, and when two numbers disagree you want as few candidate causes as possible. With the engine held fixed, every difference between the deck and the booking is geometry or convention, and nothing else.

That is a general principle for reconciliations: hold constant everything you can, so the residual is attributable.

## What this module is for

Not to make the numbers agree. They already agree.

It is to be able to say WHY they agree, what would have made them disagree, and what the agreement cost elsewhere. A study that can produce a matching number and cannot explain it has not reconciled anything; it has tuned something.

## The misconception to avoid

"The model reproduces the booking, so the model is right." It reproduces one integral of the booking. Two models can contain the same total oil and put it in completely different places, and where the oil is decides where the wells should go and how it will be swept. Volume agreement is necessary and it is a long way from sufficient.

## Exercise

First, from the pore volume and the hydrocarbon pore volume above, compute the water saturation the deck used, and confirm it matches the booking's.

Second, write down two ways two models of the same field could contain identical oil volumes and forecast very differently.
