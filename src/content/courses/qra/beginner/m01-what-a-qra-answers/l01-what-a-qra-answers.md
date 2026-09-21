# What a quantitative risk assessment answers

{{panel:qr-event-tree}}

A quantitative risk assessment, a QRA, answers a narrow set of questions with arithmetic. How often does each outcome of a release happen? What individual risk does one place carry? What individual risk does one person carry over a year? The engine behind this course does the bookkeeping of those answers. It takes scenario frequencies and probabilities of death as inputs and returns outcome frequencies, location-specific individual risk (LSIR) and individual risk per annum (IRPA). This tier teaches exactly those three answers.

## Three questions, three functions

| what you ask | function | what EREMOR returns |
| --- | --- | --- |
| how often does the release explode? | `flammableReleaseEventTree` | 0.000054000000 per year |
| what individual risk does the process deck carry? | `locationIndividualRisk` | LSIR 0.000148150000 per year |
| what individual risk does the operator carry? | `individualRiskPerAnnum` | IRPA 0.000017541379 per year |

EREMOR is the teaching facility for this tier. Its gas release starts at 5e-4 per year, as stated. An event tree splits that frequency into four outcomes, and the explosion is one of them. Each outcome then meets a probability of death at each place, and the sum at one place is its LSIR. Finally the operator's hours at each place turn three LSIRs into one person's IRPA.

Every figure above is per year. Every one of them is carried to twelve decimals, because that is how the engine's answers are compared.

## Nothing is invented

The engine's first declared choice is that it invents no number. Every scenario frequency, every branch probability, every probability of death and every occupancy is an input. When an input is missing or impossible, the engine returns an object with `error` and `field`, and the `field` names the offending input. When the inputs are sound, it returns a result carrying a `basis` block that says what model was applied and which source it came from.

This matters for how you read a QRA. The engine is honest arithmetic on what the analyst supplied. If a frequency is wrong, the answer is wrong in exactly that proportion, and the engine has no way to know. The analyst owns the inputs and the engine owns the sums.

## What comes later in the course

The same engine goes further. The Professional tier asks how many people die at once, using potential loss of life, the fatal accident rate and the F-N curve. The Expert tier asks whether a further measure is reasonably practicable. Those answers are built on the individual risk figures you learn here, and this tier quotes none of them.

## How the tier is built

You start with frequencies and probabilities and the refusals that protect them. Then come event trees, the flammable release tree, LSIR at a place, IRPA for a person, and finally one person worked end to end.

## Exercise

The process deck LSIR is 0.000148150000 per year and the operator IRPA is 0.000017541379 per year. Write down which is larger. Then name the input, supplied by the analyst for the operator, that makes the person's figure smaller than the figure for the place they work in, and say in one sentence why a person who spends only part of the year on the deck should carry less than the deck itself.
