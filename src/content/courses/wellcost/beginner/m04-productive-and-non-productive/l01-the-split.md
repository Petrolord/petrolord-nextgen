# The split

Every hour in a well estimate is one of two things, and the rig is paid for both of them.

{{panel:wc-time-explorer}}

## Two buckets on one clock

Module 3 gave you three closed forms and a stated duration for flat work. Add those up across the programme and you have the productive hours: the time the job takes when nothing goes wrong.

Nothing ever goes entirely right, so the engine carries a second bucket. Non-productive time is the trouble allowance, and in this engine it is a single number applied to the whole programme rather than a list of incidents.

The engine keeps the two apart explicitly. It sums the closed forms into `productiveHr`, it runs the clock to get `totalHr`, and it reports `nptHr` as the difference between them. Nothing else in the model touches that subtraction.

## The golden case

The published programme is ten activities to 3,000 m with an allowance of 0.125.

| Quantity | Value |
| --- | --- |
| Productive hours | 384 |
| Non-productive hours | 48 |
| Elapsed hours | 432 |
| Elapsed days | 18 |

Read those four numbers in order. The work itself is 384 hours. The allowance adds 48. The rig is on location for 432 hours, which is 18 days.

## Both buckets are real hours

The temptation is to treat the 48 hours as a padding figure, something added at the end to be safe. It is not. It is 48 hours during which a rig sits on a wellhead, a crew is on shift, and a services spread is on hire.

The programme that finishes is the 432 hour one, not the 384 hour one. If you plan a rig slot, order a boat, or promise a completion date on 384 hours, you are two days short before you begin.

This is why the distinction is worth teaching as a split rather than as an adjustment. Productive and non-productive are two answers to the question of where the hours went. They are not an estimate and a correction to it.

## Exercise

Open the panel on the golden programme and read `productiveHr`, `nptHr` and `totalHr`. Confirm by hand that the first two add to the third.

Set the allowance to zero. Note the elapsed hours you get, and say in one line what that 384 hour schedule assumes about the well.

Write down which of these belong in which bucket: drilling ahead at the planned rate, waiting for a weather window, running casing, and pulling out of hole to change a bit that failed early.
