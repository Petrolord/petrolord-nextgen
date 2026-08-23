# The capstone walkthrough

The Expert capstone is the graded practical that closes the petrophysics ladder. Like the two capstones before it, it asks for numbers the app computes live from the typewell dataset, grades them server-side within stated tolerances, and certifies you when all of them land. This lesson walks the brief so that nothing in it surprises you.

## The brief

A laboratory measured the formation water sample at 0.114 ohm.m at 75 degF; formation temperature is 180 degF. The SP quicklook reads SSP = -93 mV with $R_{mfe}$ = 0.62 ohm.m at formation temperature. Your job: correct the sample with Arps, convert the SSP, confirm both against the Pickett fit from the Professional tier, validate in the water leg, and then book SAND_A twice, once with the corrected $R_w$ and once with the raw sample value.

## The six graded numbers

1. **Sample $R_w$ at formation temperature (Arps): 0.0499 ohm.m**, tolerance 0.0005. The temperature correction from module 2.
2. **$R_{we}$ from the SP quicklook: 0.0498 ohm.m**, tolerance 0.0005. The SSP conversion from module 3.
3. **Water-leg mean $S_w$ with the Arps $R_w$: 0.9991**, tolerance 0.005. The validation check from module 4.
4. **SAND_A net pay with the Arps $R_w$: 18.0 m**, tolerance 0.01. The corrected booking from module 5.
5. **SAND_A pay-average $S_w$ with the Arps $R_w$: 0.3609**, tolerance 0.005. Same booking, the saturation the pay flags average to.
6. **SAND_A net pay with the raw sample value: 16.5 m**, tolerance 0.01. The uncorrected booking, your sensitivity demonstration.

Notice the shape: two parameter routes, one validation, one booking pair plus its saturation. The capstone is the whole course in six numbers.

## Producing them in Learning Mode

Open the Petrophysics app in Learning Mode on the Expert tier. The Expert panel presents the brief's givens and runs the engine live:

* The Arps card takes the sample value and both temperatures and reports the corrected $R_w$. You can verify it by hand in seconds: $0.114 \times (75 + 6.77)/(180 + 6.77)$.
* The SP card takes SSP and $R_{mfe}$, computes $K$ at formation temperature, and reports $R_{we}$. Hand check: $0.62 \times 10^{-93/84.94}$.
* The water-leg card evaluates Archie with the corrected $R_w$ across 2075-2078 m and reports the mean.
* The booking cards run the SAND_A zone summary twice, with the corrected and the raw $R_w$, using the same cutoffs you have carried since the Associate tier.

Read each value from the panel into the corresponding capstone field. The tolerances are wide enough that engine-computed values pass exactly and hand-computed values pass if you carry four significant figures. What the tolerances will not forgive is a wrong route: an uncorrected $R_w$ in field 1, or a booking with the wrong value, misses by far more than the band.

## The order of the gates

On the deep path the capstone is the last door, and it stays locked until the course is complete. The order is fixed and enforced server-side: read every lesson of a module to unlock its quiz; pass each module quiz at 75 percent (three failed attempts trigger a 24 hour cooldown, so read before you guess); pass the final exam at 70 percent once every module quiz is passed; and only then does the capstone accept a submission. If you are reading this lesson in sequence, you have one quiz and one exam between you and the brief.

## What passing earns

Passing the Expert capstone issues your Expert certification in Petrophysics, the top of this course's ladder, valid for twelve months like every academy certificate and verifiable by anyone through the public verification page. It also carries a commercial rider unique to the Expert tier: the certification automatically issues a personal, single-use 50 percent discount code for the corresponding Petrolord Suite module, valid for the certificate's twelve-month window. The academy's position is simple: someone who has earned the Expert tier on this workflow is exactly who the professional software is for.

## Exercise

Without opening the app, write down the calculation chain for each of the six fields as one line each, naming the module that taught it. Self-check: field 1 is Arps from module 2; field 2 is the $K$ coefficient and SSP conversion from module 3; field 3 is the water-leg validation from module 4; fields 4 and 5 are the corrected SAND_A booking from module 5; field 6 is the uncorrected booking from the same module. If any line is hazy, that module's summary lesson is the one to re-read before the final exam.
