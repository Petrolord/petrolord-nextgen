# Ekene goes on production

If you took the Geoscience courses, you have met Ekene before: six wells, a mapped TOP_SAND surface, and a volumetric booking built cell by cell. That work ended with a number. This course begins with what happened next: the field was developed, and the number went on production.

## What the geoscientists handed over

The volumetric study booked a STOIIP of **12.139208 MMstb** (12,139,208 stb in full), oil held above an oil-water contact at **1560 m** TVD across **169** mapped cells of the TOP_SAND structure. The sand's porosity, net-to-gross and saturations behind that number are the geoscience courses' story; here it is the endowment the development has to work with.

Twelve million barrels is a small accumulation. Hold that scale in mind whenever a rate or a cumulative appears in this course: a field this size produces hundreds of barrels per day, not tens of thousands, and its whole primary life books well under half a million barrels. Small numbers are not toy numbers; they are the honest scale of this field.

## Six wells, two surprises

Development drilling confirmed the structure but delivered the classic mixed result. Four wells found the sand oil bearing and were completed as producers. Two did not:

- **Ekene-2** penetrated TOP_SAND at 1565 m, five metres BELOW the 1560 m contact. Wet sand.
- **Ekene-4** penetrated TOP_SAND at 1590 m, thirty metres below the contact. Wet sand.

Both wells sit on the eastern flank, downdip of the accumulation. Dry holes are expensive, but these two are not wasted: from 2023-01-01 they are converted to water injectors, pushing water in from the flank below the oil. Keep them in mind; they are silent through the whole primary period and then change everything.

A note for those who took the ReservoirCalc Professional tier: the sealing-fault scenario you studied there was a what-if exercise. The base development case, the one this course's data lives in, treats Ekene as one connected tank with one contact at 1560 m, which is exactly why Ekene-2's wet sand at 1565 m and Ekene-6's oil at 1546 m are consistent with the same contact.

## The producers come on in sequence

Fields are not switched on all at once. Drilling and hook-up take time, so the four producers start months apart:

| Well | First production | Initial rate |
|---|---|---|
| Ekene-1 | 2020-01-01 | 120 stb/d |
| Ekene-3 | 2020-03-01 | 150 stb/d |
| Ekene-5 | 2020-06-01 | 100 stb/d |
| Ekene-6 | 2020-09-01 | 90 stb/d |

Each well begins its decline the day IT starts, not the day the field starts. That sounds obvious written down, but it is the single most common bookkeeping error in multi-well decline work, so do the arithmetic once by hand now.

Count the days from the field start (2020-01-01) to each later start. To 2020-03-01: January has 31 days and February 2020, a leap year, has 29, so $31 + 29 = 60$ days. To 2020-06-01: add March (31), April (30) and May (31), so $60 + 92 = 152$ days. To 2020-09-01: add June (30), July (31) and August (31), so $152 + 92 = 244$ days.

Stop and do that count yourself before reading on. If you got 59 for the first gap you forgot the leap day; 2020 has one, and this course's day counts are exact.

## One clean example of everything

Here is the design of the teaching field, stated openly. Each producer follows one member of the Arps family, exactly, with no noise:

- **Ekene-1** declines exponentially.
- **Ekene-3** declines hyperbolically with a moderate exponent.
- **Ekene-5** declines harmonically, the slow-fading end of the family.
- **Ekene-6** declines hyperbolically with a smaller exponent, closer to exponential.

You will learn what those words mean in module 2. The point for now is that the field gives you one specimen of each shape, side by side, on the same timeline, and that because the data is noise free, every fit you make later recovers the planted truth as exactly as arithmetic allows.

## The misconception to retire today

It is tempting to add the four initial rates, $120 + 150 + 100 + 90 = 460$ stb/d, and call that the field's starting rate. It never was. On 2020-01-01 only Ekene-1 flowed, at 120 stb/d. By the time Ekene-6 came on in September, Ekene-1 had already declined for 244 days. Rates may only be added at a common calendar date, with each well evaluated on its own clock. Every multi-well number in this course is built that way.

## Exercise

Using the start table above, work out how many days each producer had been flowing on 2021-01-01 (the field's first anniversary is 366 days after 2020-01-01, leap year again). You should get four different numbers, and the answer for Ekene-1 should be exactly 366. Keep the habit: in decline work, "when" always means "how many days on this well's own clock."
