# Most of it is one curve

Take the 272 apart. The file has 4 value curves, the campaign counted flagged samples across all of them, and the only way to see what the total is made of is to ask each curve separately. This is the lesson the tier exists for, and the table below is the whole of it.

## The breakdown

nullheavy_20.las, 201 depth samples, null flag -9999 as declared in the file's own header.

| curve | unit | nulls | of samples |
|---|---|---|---|
| GR | GAPI | 71 | 201 |
| RHOB | G/C3 | 0 | 201 |
| NPHI | V/V | 201 | 201 |
| DT | US/M | 0 | 201 |

Add the null column: 71 plus 0 plus 201 plus 0 is 272. The parts reconcile to the graded total exactly, as they must, because the total was formed by adding them.

Now read the table rather than the sum, and three facts arrive that the total could not carry.

Two of the four curves are complete. RHOB has 0 nulls of 201 and DT has 0 nulls of 201. Half of this file's value curves are fully populated from top to bottom, and the file with the campaign's worst null count contains no missing data at all in its density and sonic columns. Nobody reading 272 would guess that.

One curve is entirely absent. NPHI has 201 nulls of 201, so every cell in its column holds -9999 and not one sample is a measurement. That is the campaign's single dead curve, the one the previous module counted without naming. It contributes 201 of the 272.

One curve is gapped but working. GR has 71 nulls of 201, so most of its column carries real gamma ray readings in GAPI and the rest is flagged. It contributes 71 of the 272.

## The sentence worth memorising

201 of the 272 are one curve that is entirely absent, and only 71 are scattered nulls inside a curve that does have data.

Say it that way round, with the larger part first, because the larger part is the part that changes what you do. The single number 272 invited you to picture a file riddled with holes. The breakdown shows a file with one column that was never filled and one column with gaps in it, sitting next to two columns that are perfect.

Those two components are not the same kind of thing, and the next lesson is entirely about why. For now, notice only that the aggregate is dominated by one of them. If somebody fixed every one of GR's 71 nulls of 201 tomorrow, the file's total would fall from 272 to 201 and the largest problem in it would be untouched. If instead the missing neutron curve arrived, the total would fall from 272 to 71 and what remained would be an ordinary data quality note. Same total, two components, two completely different consequences from acting on each.

## Why the total could never have told you

It is worth being precise about the failure, because it is not a failure of accuracy.

272 is correct. It was computed over the right population, using the file's declared null flag rather than an assumed one, with the depth index excluded. Every check you would run on it passes. The number is not wrong in any respect.

What it lacks is composition. Addition is not reversible. Once four numbers become one, no amount of care with the one recovers the four, and 272 is consistent with a file where every curve is a quarter empty, a file where one curve is dead and another is gapped, and a file where one interval is missing across all four curves. Those are different deliveries with different causes and different remedies, and they produce the same integer.

So the total tells you that this file deserves attention, which is genuinely useful, and it tells you nothing about what kind of attention. It gets you as far as the door of the file and no further. Everything past the door needs the breakdown.

## Worked example

Verify the composition yourself rather than trusting the table, because the reconciliation is the skill.

Take each of the four value curves and count its flagged samples against its 201 depth samples. GR gives 71 of 201. RHOB gives 0 of 201. NPHI gives 201 of 201. DT gives 0 of 201. Write each one with its denominator attached, every time, so that a count and a proportion never get confused when the row is copied somewhere else.

Add them: 71 plus 0 is 71, plus 201 is 272, plus 0 is 272. That matches the graded field, so your breakdown accounts for the whole aggregate with nothing left over and nothing counted twice.

Then apply the deadness test from the previous module to each row, since you now have the numbers in front of you. A curve is dead when it has no finite samples at all. RHOB and DT have no nulls, so they are alive. GR has 71 of 201 flagged and the remainder finite, so it is alive and gapped. NPHI has 201 flagged of 201, so it has no finite samples and it is dead. One dead curve, which is exactly what the campaign's dead curve field reported for this file.

Open the panel below on nullheavy_20 and read the per-curve breakdown behind the total.

{{panel:wd-campaign-explorer}}

## Exercise

Write out the four curve rows with their units and their null counts, each with its denominator, then show the addition that reconciles them to the graded total. Then answer in two sentences: which single row accounts for most of the total, and what would the file's null total become if that row were resolved and nothing else changed.

Self-check: the rows are GR in GAPI with 71 nulls of 201, RHOB in G/C3 with 0 nulls of 201, NPHI in V/V with 201 nulls of 201, and DT in US/M with 0 nulls of 201, and 71 plus 0 plus 201 plus 0 is 272, which is the graded value with a tolerance of zero. NPHI accounts for most of the total, contributing 201 of the 272 because every one of its 201 samples holds the file's declared null flag of -9999. If that curve were delivered populated and nothing else changed, the file's null total would be 71, which is GR's contribution, and that remaining number would describe an ordinary gapped curve rather than an absent one.
