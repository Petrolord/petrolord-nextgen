# Truncation and rounding

OSHA Table G-16a prints 0.063 h at 125 dBA, where the formula gives exactly 0.0625 h. HSE L108 Figure 26 prints 6:21 for 6 h 20.97 min and 2:00 for 2 h 0.57 min. NIOSH Table 1-1 truncates at its 124 and 127 dBA rows where it rounds elsewhere. None of these is an erratum. Each is a source printing its own formula by a rule that is not quite consistent, and each sets how tightly the golden can gate that source.

## Three habits of printed tables

Rounding half up. Table G-16a gives the reference duration in hours. At 125.000000 dBA the formula returns 0.062500 h and the table prints 0.063, a round-half-up of the fourth decimal. A gate at a tolerance of 0.000500 h, the one the golden uses for that row, admits it.

Rounding to the minute. Figure 26 prints durations in hours and minutes. It shows 6:21 where the value is 6 h 20.97 min, which is ordinary rounding, and 2:00 where it is 2 h 0.57 min, which is also rounding, downward. The golden gates the figure at one minute.

Truncating. NIOSH Table 1-1 prints durations in hours, minutes and seconds, and at most rows it rounds the seconds. At the 124 and 127 dBA rows it drops the fraction instead. So the golden gates that table at one printed unit, a second, which is 0.000278 h.

| source | row | formula value | printed | rule |
| --- | --- | --- | --- | --- |
| Table G-16a | 125 dBA | 0.062500 h | 0.063 h | round half up |
| Table 1-1 | 124 dBA | 0.000977 h | 0.000833 h | truncated |
| Table 1-1 | 127 dBA | 0.000488 h | 0.000278 h | truncated |

## The gate follows the source

A gate that demands every printed digit of a source that is not consistent with itself will fail on the source. So the tolerance of each golden row is set by what the source can actually be held to. For Table 1-1 that is one printed second, because the table's own rounding moves by up to that much. At 124 dBA the engine minus printed is 0.000143 h and at 127 dBA it is 0.000211 h, both inside 0.000278 h.

This is different from widening a tolerance to make a failure disappear. The tolerance comes from the source's printed precision and its known rounding habits, and it is set before any row is compared. An erratum is a row that misses even that tolerance, like the 99.000000 dBA row of Table 1-1 that the first lesson of this module described, which sits 5.071055 tolerances away.

## Reading a table as a reader

Within one printed unit of the formula, look for a rounding rule first. Several units off with agreeing neighbours is a slip. The line between the two is the tolerance, and the tolerance is a fact about the table.

## Why it is worth the trouble

A course that taught every printed digit as truth would teach 0.063 h and 0.0625 h as two different answers to one question. Ignoring printed values would lose the only independent check on the formulas. Gating each source at its own precision keeps the check and drops the clutter of its typography.

## Exercise

Take the three rows in the table and, for each, state the printed unit and whether the printed value is inside one printed unit of the formula. Then name the rule each row follows and say which of the three a naive gate demanding every printed digit would fail.
