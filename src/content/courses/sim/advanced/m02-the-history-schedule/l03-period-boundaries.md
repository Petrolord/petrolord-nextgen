# Period boundaries

Thirty six rate blocks and thirty six dates, interleaved. Getting the interleaving right is what makes the volumes land in the right months.

## The pattern

    WCONHIST   (January rates)
    WCONINJH   (January injection)
    DATES      1 FEB 2023
    WCONHIST   (February rates)
    WCONINJH   (February injection)
    DATES      1 MAR 2023
    ...

Rates first, then the date that closes the period they apply to.

That ordering is the thing to internalise. A rate block applies from the current time to the NEXT date, so the DATES that follows a rate block is what defines the period the rates cover.

## The two off-by-one errors

**Rates after the date.** Write the DATES first and the January rates apply to February. The whole history shifts by one month, every volume lands in the wrong period, and the model's cumulative production is right while its timing is wrong by a month.

That error is nearly invisible on a cumulative plot and obvious on a rate plot, which is one reason to always plot rates.

**A missing final date.** The last rate block needs a date to close it. Ekene's history runs 2023-01 through 2025-12 and its final DATES advances to 2026-01-01, which is one month past the last period.

Leave that off and the last month's rates are open-ended, applying until whatever comes next, which is the prediction tail. The final month of history then runs for five years.

## The first period

The validator enforces one rule here explicitly: the first history period's date must equal the deck's start date.

Ekene's start date is 2023-01-01 and its first period is 2023-01-01, so it passes. Set the first period to 2024-01-01 and the validator refuses with

> The first history period (2024-01-01) must start on the deck start date (2023-01-01).

That rule exists because a mismatch is silent otherwise: the simulator would run from the start date with no wells until the first period, which is a year of a shut-in field that nobody asked for.

## Counting

Thirty six periods, thirty six WCONHIST blocks, thirty six WCONINJH blocks, thirty six DATES blocks. The counts must match, and a mismatch is the fastest thing to check on any history schedule.

A deck with 36 rate blocks and 35 dates has an unclosed period. One with 36 dates and 35 rate blocks has a month where the previous month's rates persist, which is the Eclipse keyword persistence rule doing something you did not intend.

## Keyword persistence

Worth stating because it causes the subtlest version of these errors.

A well control set in one period PERSISTS until it is changed. So a well omitted from February's WCONHIST keeps January's rates through February, silently.

That is convenient when a well genuinely does not change and dangerous when a row is missing from the source data. A history built from a database with gaps will carry the last known rate across the gap rather than producing nothing.

The defence is to write every well in every period, even when the rate is unchanged, so a missing row is a missing row rather than a repeated one.

## The misconception to avoid

"The date at the top of a rate block is the period it applies to." The date that FOLLOWS a rate block closes it. Reading the schedule the other way round produces the one-month shift, and because the arithmetic is otherwise correct the error is hard to see in any total.

## Exercise

First, the history has 36 periods ending 2025-12 and a final DATES of 2026-01-01. Explain in one sentence what would happen if that final date were omitted.

Second, describe keyword persistence and say why writing every well in every period is the safer convention.
