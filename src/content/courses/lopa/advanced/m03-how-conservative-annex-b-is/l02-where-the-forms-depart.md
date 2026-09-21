# Where the forms depart

{{panel:lp-proof-test}}

Knowing that Annex B sits above the time dependent route is useful. Knowing where the gap comes from is more useful, because it tells you which cases will be conservative and by roughly how much before you compute anything. There are four places the published forms depart from the exact average, and each one is a modelling convention chosen for tractability. Every one of them pushes the answer in the same direction.

## The four departures

FIRST, the linearised 1oo1 omits a term of the order of the failure rate times the interval, squared. That term is subtracted in the exact average and dropped in the published form, so the published form is high, and it is higher the larger the failure rate times the interval becomes.

SECOND, the equivalent down time convention charges detected failures and the MRT more than the exact average does. The convention replaces a time varying unavailability with one representative down time per channel, and the representative time is generous.

THIRD, the coverage cross term is charged at two thirds of the interval times the lifetime, where the exact average charges half the interval times the lifetime plus one sixth of the interval squared. That is lower whenever the lifetime is at least the interval, which the engine requires it to be, so the coverage cases are conservative by construction.

FOURTH, a 2oo2 takes no credit for common cause. Annex B carries no beta factor term for a 2oo2, so a common cause failure of both channels is counted as though the two channels had failed independently.

## The departures show up in the measurements

| golden case | engine PFDavg | route B, golden | engine over route B minus one, derived |
| --- | --- | --- | --- |
| dolan-pt-2oo3 | 0.000235764375 | 0.000235575925 | 8.000e-4 |
| dolan-pt-2oo3-ptc90 | 0.000676060358 | 0.000669710253 | 9.482e-3 |
| dolan-valve-1oo2 | 0.001048767640 | 0.001043789195 | 4.770e-3 |
| dolan-valve-1oo2-ptc85 | 0.002713783083 | 0.002638288099 | 2.862e-2 |
| tr84-2oo2 | 0.017520000000 | 0.017317146501 | 1.171e-2 |

Compare each pressure transmitter row with the coverage version of itself. The 2oo3 with a perfect test departs by 8.000e-4; the same subsystem at a coverage of 0.9 departs by 9.482e-3. The valve goes from 4.770e-3 to 2.862e-2 when its coverage drops. The third departure is doing that.

## What to do with this knowledge

Nothing in a calculation. The engine implements the published forms and a site is assessed against the published forms, so the conservative answer is the answer. What the knowledge buys is interpretation. A safety instrumented function that misses its required PFDavg by a fraction of a percent, on a case with partial coverage, is a candidate for a more exact model before it is a candidate for more hardware, and the note can say so with a figure behind it. A function that misses by a factor is a design problem that no modelling refinement will rescue. The time dependent values behind these comparisons are provenance and are never graded.

## Exercise

Take the two valve rows, 0.001048767640 with a perfect test and 0.002713783083 at the reduced coverage, and their departures of 4.770e-3 and 2.862e-2. Work out how many times larger the second departure is than the first. Then write one sentence naming which of the four departures explains the growth, and one sentence saying what you would tell a project that wanted to claim the difference back.
