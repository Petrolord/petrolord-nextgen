# Rates from volumes

The ledger holds volumes. The schedule wants rates. This lesson is that conversion done properly, and the check that proves it.

## The conversion

$$\text{rate} = \frac{\text{volume in the period}}{\text{days the period spans}}$$

with the days taken from the actual calendar, not from an average.

Ekene-1 produced 998.5247575266284 stb in January 2023, which has 31 days:

$$\frac{998.5247575266284}{31} = 32.210476049246076 \text{ stb/d}$$

Do that for every well, every phase and every month.

{{panel:sim-build-explorer}}

## The round trip check

Multiply back and compare against the ledger. Over the whole 36-month history the deck's oil totals

$$176923.83644033302 \text{ stb}$$

against the ledger's 176923.83644033293. The two agree to the last few bits of a double, which is what an exact conversion looks like.

That check is worth running on every history you build, because it catches every divisor mistake at once and it costs one line.

## Why the last digits differ at all

Because the two sums are accumulated in different orders. The ledger sums per well per month; the deck's total sums rate times days per period. Floating-point addition is not associative, so two orderings of the same values differ in the last bit or two.

A difference at the fifteenth significant figure is arithmetic. A difference at the fourth is a bug. Knowing which you are looking at is the skill, and it is the same distinction the Professional tier drew about Ekene-2's depth.

## The mean-month trap

Divide by 30.4375 instead of the real month and the deck's rate for January comes out 1.8 percent high. The simulator then applies that rate over the 31 days the DATES block spans and produces 1.8 percent too much oil.

The errors do not cancel over a year. Every 31-day month is over-produced and every 30-day month under-produced, and February is over-produced by nearly ten percent. The annual total drifts and the monthly pattern acquires a spurious seasonality that follows the calendar.

That is a distinctive symptom: a history match whose residuals correlate with month length has this bug and nothing else.

## Where the days come from

From the DATES block that closes the period, not from the date that opens it. A period starting 1 January and closed by a DATES advancing to 1 February spans 31 days; the same period closed by a DATES advancing to 1 March spans 59.

So the rate and the period boundary have to be built together. Compute a rate against one assumption and write a boundary against another and the volume is wrong even though both halves look right.

## Gas units

The ledger holds gas in Mscf and the deck wants Mscf/d, so the conversion is the same division. That is the easy case.

The trap is a ledger in scf, which converts to a rate a thousand times too large, and a simulator will accept it. The check is a gas-oil ratio: Ekene's is 400 scf/stb, so a well making 32 stb/d of oil should make about 12.9 Mscf/d of gas. A number near 12900 is a unit error.

## The misconception to avoid

"The conversion is trivial so it does not need checking." It is trivial and it is where production histories most often go wrong, because the mistake produces plausible rates and a deck that runs. The round trip check takes one line and it is the only thing that catches it.

## Exercise

First, take Ekene-1's January rate and confirm it reproduces the ledger volume over 31 days. Then compute the volume a mean-month divisor would have produced and the percentage error.

Second, describe the symptom of a mean-month divisor in a history match's residuals, and say why it is distinctive.
