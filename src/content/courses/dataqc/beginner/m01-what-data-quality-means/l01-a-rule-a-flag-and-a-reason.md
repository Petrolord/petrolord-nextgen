# A rule, a flag and a reason

{{panel:dq-checks-explorer}}

Hand the engine a two-entry series of daily oil rates whose second entry is -3 and it returns one flag. The flag does not say the rate is wrong. It says which rule fired, where, and why, in a form a person and a program can both read. Every check in this course works that way: a stated rule, applied to the data, and one flag for each place the rule fires.

| key | value |
| --- | --- |
| `index` | 1 |
| `rule` | negative-rate |
| `reason` | rate -3 is negative |
| `value` | -3 |

## Two shapes of answer

Every function in the engine takes plain arrays and objects and returns one of two shapes. A call it can answer returns a result object, and that object carries a `basis` block naming the convention the check used. A call it cannot answer returns an object with an `error` and a `field`, where the field names the input it refused. There is no third shape. A result never arrives without its basis, and a refusal never arrives as a number.

## What a flag is

A flag is a rule that fired, with its reason. The engine does not decide whether a flagged value is wrong. It does not fill, repair or delete a value. It does not convert units. It carries no plausibility range for any basin or tool. Each of those is a decision a person makes after reading the flag.

So a flag is a question about a value. A negative oil rate might be a keying slip, an allocation correction booked on the wrong line, or a sign convention the file never declared. The engine cannot tell those apart.

## Fields and the reason sentence

The flag above carries its figure twice: as the numeric field `value`, and inside the `reason` sentence. When you reason with a number, take it from the field. The reason is the engine's own words, written for a person scanning a list, and it is quoted as a sentence.

Notice also that `index` is 1 for the second entry. The engine counts entries from 0. On a daily production sheet the course writes days from 1, so day 1 is entry 0. Every time you quote a position, say which count you mean.

## The teaching data

Every series in the course comes from one generator on stated seeds, so the same inputs give the same file anywhere. It builds the Ekene field: EKENE-7's log of 240 entries, EKENE-3's production sheet of 90 days, a list of 13 well names and more. Then it plants documented defects. 22 defects are planted, and each is found by a named check. The Associate tier works through the ones that ask whether the data are fit to use.

## Exercise

Open the checks explorer and choose the view for range limits and rate rules. The values box holds a stretch of EKENE-7's neutron log. Read the flags table and, for each row, write down the rule that fired and copy its reason. Find the row whose reason reads "value 23.3 is above the maximum 1". Then look at the daily rates box below it, which holds a stretch of EKENE-3's oil rates with their hours on. Confirm there is one negative-rate flag for the rate -18.500000 and one rate-while-shut-in flag, and say which count the entry numbers in the table use.
