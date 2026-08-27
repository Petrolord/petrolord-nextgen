# Field-level honesty

You can now produce a field number and defend its arithmetic. This lesson is about what the number means, which is a narrower thing than most people assume when they see it in a summary row.

Take the Ekene field total, 461709.132532792 stb. Written on a slide as "Ekene field EUR: 461709 stb" it looks like a property of the field. It is not. It is the sum of four independent single-well extrapolations, each made on its own window, with its own model family, under one particular assumption about when each well stops. Everything in that sentence is a choice, and none of the choices survives into the number.

## What the total does not contain

**It contains no field economics.** The 10 stb/d limit was applied per well, not to the field. That is an assumption with real consequences: a well is abandoned when it stops paying for its own lifting and its share of the fixed cost, and the fixed cost is a field-level number spread over however many wells are still on. In practice the last wells on a field carry more overhead each, so they abandon earlier than a fixed per-well limit implies, and the field abandons as a unit. A per-well limit rolled up is a convenient convention, not a field abandonment model. Valuation belongs to the Economics module; this course stops at the volume and labels the limit.

**It contains no flood.** These four scenarios are primary-depletion forecasts, fitted on pre-flood windows and extrapolated as if nothing changed. The Ekene waterflood started 2023-01-01 and changed the character of every producer. A primary roll-up is a legitimate object, and it is the right object for questions about what the field would have done without the flood, but it is not the field's reserves.

**It contains no reconciliation.** Nothing in a roll-up checks the total against the volume the reservoir is known to hold. Four declines can happily sum to more oil than there is. That check is material balance, and it is a different course; this course hands cumulative production to it.

**It contains no uncertainty.** Four point estimates add to a point estimate. Adding best guesses does not give you a field best guess with a range around it, and the width of a portfolio range is not the sum of the well ranges, because the wells do not miss independently: they share a fitting method, an analyst, a window convention and a reservoir. The Expert tier takes this up properly. What matters here is not to write a single number in a column headed with a probability word.

## What the total rests on

Compute each well's share of the closed-form total and the picture gets sharper:

| Well | Model | Closed-form EUR (stb) | Share of field |
|---|---|---|---|
| Ekene-1 | Exponential | 91666.6666666667 | 19.8537694422053 % |
| Ekene-3 | Hyperbolic, b 0.5 | 111270.166537926 | 24.0996243517066 % |
| Ekene-5 | Harmonic, b 1 | 153505.672866270 | 33.2472680417183 % |
| Ekene-6 | Hyperbolic, b 0.35 | 105266.626461929 | 22.7993381643698 % |

The largest single contributor, at 33.2472680417183 percent of the field, is Ekene-5. It is also the well with the lowest initial rate of the four, at 100 stb/d, and the one whose booking is least supported by data. Its primary window is 913 days long. Its forecast to the 10 stb/d limit runs 6000 days, about 16.4271047227926 years, ending 2036-11-04. A third of the field number is an extrapolation roughly six and a half times longer than the history behind it, and it is that long precisely because harmonic declines have the fattest tail of the three families.

That is not an argument for changing the number. It is an argument for knowing where to point when someone asks which part of the total is soft. The general habit: before you quote a portfolio figure, rank the contributors and look at the top one on its own terms. Portfolios are almost never evenly weighted, and the intuition that errors average out across a portfolio fails the moment one member carries a third of it.

Notice also what the table makes nonsense of. There is no field b, no field decline, no meaningful average of 0, 0.5, 1 and 0.35. Model parameters do not aggregate; only volumes do.

## Worked example: two ways to write the same number

Indefensible:

> Ekene field EUR: 461709 stb.

Defensible:

> Ekene field primary-depletion EUR, oil, 461709.132532792 stb. Sum of four independent closed-form Arps bookings (Ekene-1 exponential, Ekene-3 b 0.5, Ekene-5 harmonic, Ekene-6 b 0.35), each fitted on its own pre-flood primary window and extrapolated to a per-well economic limit of 10 stb/d. Excludes waterflood response from 2023-01-01. Not reconciled to material balance. Deterministic, no range. The engine's daily-sum roll-up of the same four scenarios gives 461475.535264973 stb, a difference of 0.0505940323374074 percent from forecast discretization. Largest contributor Ekene-5 at 33.2472680417183 percent, on a 913-day window and a 6000-day forecast.

The second version is longer and nobody will complain about that. Every clause in it is a question a reviewer would otherwise have to ask, and each answer is one you already have.

The named misconception this kills is **"the caveats live in the appendix"**. They do not. A field number without its stated limit, window convention and exclusion list is not a conservative version of the same information, it is a different and unfalsifiable claim.

## Exercise

1. The field total was built at a 10 stb/d per-well limit. At 5 stb/d the four closed forms total 535469.764892198 stb, and at 20 stb/d they total 372230.076701345 stb. That is a swing of 163239.688190854 stb, from 15.9755627866356 percent above the base booking to 19.3799623023684 percent below it, with not one parameter changed. Write the one sentence you would add to any field EUR line so that this swing can never be mistaken for a change in reservoir understanding.

2. A reviewer asks: "is 461709 the field's reserves?" Answer in three sentences, using the exclusion list above, and name the two other modules that would have to be involved before the word reserves is honest.

3. Rank the four wells by how much of the field total would move if their fitted b were wrong by 0.1. You do not have to compute it, and you should not guess a number; instead state which well you would examine first and why, using its share and its window-to-forecast ratio. Carry that reasoning into the next module, where the whole Professional booking gets written down and defended.
