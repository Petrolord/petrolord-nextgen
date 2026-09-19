# The eight-hour normaliser

{{panel:hy-noise-dosimeter}}

The EVWRENI crew was surveyed on an eight-hour day and again on a longer day of 10.500000 hours. The eight-hour day reads LEX,8h 86.646970 dBA. The long day reads 87.207845 dBA. Divide the long day's energy by its own hours instead and it averages to 86.026852 dBA, a derived figure and a different quantity.

| task | LAeq, dBA | hours, 8 hour day | hours, long day |
| --- | --- | --- | --- |
| 1 | 87.200000 | 2.200000 | 2.900000 |
| 2 | 80.900000 | 3.400000 | 4.400000 |
| 3 | 95.400000 | 0.600000 | 0.600000 |
| 4 | 73.800000 | 1.800000 | 2.600000 |

## The divisor is always eight

The formula divides each task's hours by 8 whatever the day's length. The engine measures that reference duration, T0, as 8.000000000000 hours by asking for the LEX of four hours at 90 dBA. So a longer day at the same sound levels carries more energy over the same fixed denominator, and its LEX,8h rises. That is the intended behaviour: LEX,8h is the eight-hour level that would carry the same energy as the whole day, and a longer day is a larger noise exposure.

## The LAeq over the day is a different number

Divide the long day's energy by its own 10.500000 hours and you get 86.026852 dBA. That figure is the equivalent continuous sound level over the day as worked, the LAeq. It is lower than the eight-hour day's LEX even though the crew worked longer in the same places. A report that puts the LAeq in the LEX,8h column hides the extra hours, which is exactly the noise exposure the longer day added.

The small cases show the same property in its plainest form. Eight hours at 85.000000 dBA gives LEX,8h 85.000000 dBA and 100.000000 points. Ten hours at 85.000000 dBA gives 85.969100 dBA and 125.000000 points. The sound level never changed; only the time did.

## Reading a long day correctly

When a record covers more than eight hours, keep LEX,8h as the figure you compare with the action values, and if you quote the LAeq beside it, label it as the average over the hours worked. The two answer different questions. LEX,8h asks how much noise exposure the person received, expressed as an eight-hour day. The LAeq asks what the average sound level was while they were there.

The same normaliser returns in the chemical module of this tier, where the eight-hour TWA of 1910.1000(d)(1) divides by 8 whether the record covers more or less. Hold this lesson in mind when you reach it.

## The limit on the record

A record that totals more than a day is refused. The engine's own words, on field `periods`:

> the periods total 25 h: a daily exposure covers at most 24 hours

## Exercise

Open the dosimeter panel's LEX view and find the EVWRENI survey. Record the LEX,8h for the eight-hour day and for the long day, and the long day's hours. State which of 87.207845 dBA and 86.026852 dBA you would put against the action values, and say in one sentence what the other one measures.
