# Applied undamped

The whole Joule-Thomson drop lands at the far end of the line. In the balance the line is solving, a little over half of it should.

{{panel:pd-hydrate-explorer}}

## What the code subtracts

At every station the engine takes the ambient, adds the inlet excess decayed by exp(-x/Lc), and subtracts the coefficient times the pressure drop times x over L. At the arrival x over L is one, so the full product of the two pressure inputs comes off with no exponential anywhere near it.

On TEACHING LINE AKASO SPUR, a construct this course designed for itself rather than a published case, that product is 0.0280 degF/psi against a 900.0 psi drop: a Joule-Thomson term of 25.2000000000 degF, applied whole.

## What the balance would take off

Cooling generated at distance x has L less x of line still to travel, and over that distance it decays exactly as the inlet excess does. Weighting a source spread evenly along the line by that decay gives the whole drop multiplied by (1 - exp(-ntu))/ntu, which is below one for every positive ntu.

The teaching line runs 60000.0 ft at a relaxation length of 49209.01299043 ft, so ntu is 1.219288832549 and exp(-ntu) is 0.295440199685. The correct damping factor ntu/(1 - exp(-ntu)) is 1.730568266886.

| Joule-Thomson term | degF |
| --- | --- |
| Applied by the engine | 25.2000000000 |
| Correctly damped | 14.5616907938 |
| Applied in excess | 10.6383092062 |

The term is not mis-signed and it is not mis-scaled by a unit. It is applied at full strength where the balance applies a fraction of it, and on this line that fraction is the reciprocal of 1.730568266886.

## Where it matters and where it does not

As ntu tends to zero the damping factor tends to one, so on a line much shorter than its relaxation length the undamped term is very nearly right. The factor grows with ntu, and it is already 1.730568266886 at an ntu of 1.219288832549, which is where an insulated subsea line is designed to sit.

## What it is worth on the answer

Same line, same U of 0.452972856617 Btu/(hr ft2 degF), same heat loss.

| Case | Arrival, degF |
| --- | --- |
| No pressures passed | 89.316029952695 |
| Heat loss plus the damped term | 74.754339158867 |
| What the engine returns | 64.116029952695 |

The engine arrival is 10.6383092062 degF below the correctly damped one, which is the excess term itself, because the exponential has already been applied to everything else.

## The mistake

Auditing the term by its units. degF per psi against psi is degF, both inputs are the caller's own, and the arithmetic is unimpeachable. A reviewer checking dimensions finds nothing, because a missing weighting on a correct product has no units to give it away.

## What it refuses

Nothing. All three of those profiles return `ok` true, with no note and no error, a full station table, an ntu and a relaxation length.

## Exercise

Record ntu, exp(-ntu) and the damping factor on the teaching line, then the arrival with and without pressures.

Then say how much of the 25.2000000000 degF term should have reached the far end, and why the answer is always less than all of it.
