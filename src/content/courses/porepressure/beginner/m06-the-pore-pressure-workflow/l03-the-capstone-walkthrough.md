# The capstone walkthrough

The Associate capstone for this course is called The pressure frame of the synthetic well, and it is short. It fixes the golden well at 4000 m below mudline in 100 m of water, with seawater at 1025 kg/m3 and pore fluid at 1030 kg/m3, and it grades six numbers. There is no essay, no free interpretation and no hidden dataset. Every one of the six is read off the frame panel, and if you have worked the five previous modules all six are already familiar.

This lesson walks them in the order the capstone asks for them, says where each is read, and points out where marks are lost.

## The six graded fields

| Field | Unit | Value | Tolerance |
| --- | --- | --- | --- |
| Hydrostatic pressure at TD | MPa | 41.408579625 | 0.01 |
| Overburden stress at TD | MPa | 91.12306695073282 | 0.01 |
| Gardner density at 1600 m/s | kg/m3 | 1960.612149304395 | 0.5 |
| NCT transit time at 2500 m | us/m | 317.2847498247154 | 0.5 |
| Fitted NCT mudline transit time | us/m | 650.0000000000014 | 0.5 |
| Fitted compaction constant | 1/km | 0.7000000000000015 | 0.005 |

**Hydrostatic pressure at TD, 41.408579625 MPa, tolerance 0.01.** The two part fluid column at 4000 m below mudline, seawater to the mudline plus pore fluid below it. Set the panel's depth to 4000 m and read the hydrostatic figure.

**Overburden stress at TD, 91.12306695073282 MPa, tolerance 0.01.** The integrated sediment density plus the same seawater column, at the same 4000 m below mudline. Read it from the overburden figure with the depth still at 4000 m.

**Gardner density at 1600 m/s, 1960.612149304395 kg/m3, tolerance 0.5.** This one comes from the velocity input rather than the depth. Set the panel's sonic velocity to 1600 m/s and read the Gardner density it returns. The depth setting does not enter this field.

**NCT transit time at 2500 m, 317.2847498247154 us/m, tolerance 0.5.** The normal compaction trend on the well's own parameters, a mudline transit time of 656 us/m, a matrix of 220 us/m and a compaction constant of 0.0006 per m. Set the depth to 2500 m and read the well trend column, not the fitted trend column and not the log.

**Fitted NCT mudline transit time, 650.0000000000014 us/m, tolerance 0.5.** The mudline value the least squares fit recovers from the twelve shale picks. Set the depth to 0 and read the fitted trend, which returns 650.000000 us/m there.

**Fitted compaction constant, 0.7000000000000015 per km, tolerance 0.005.** The decay rate the same fit recovers, reported with the fitted trend. The field's unit label is 1/km, which is per km.

## The two tightest fields

The two pressure fields carry the tightest tolerances on the paper, both at 0.01 MPa. That is a narrow window on numbers in the tens of MPa, and it is narrow for a reason: both are deterministic column calculations with no interpretation in them, so there is nothing to be generous about.

Two habits protect them. Take gravity as 9.80665 m/s2 and not a rounded value, because both common roundings fail this field on their own. At 4000 m below mudline a g of 9.81 gives 41.422725000 MPa and a g of 9.8 gives 41.380500000 MPa, against the graded 41.408579625 MPa inside a 0.01 window. And read the values in MPa rather than converting from pascals in your head, because the engine holds 41408579.625 Pa and a conversion done at speed is where the digit gets dropped.

Three decimal places clears both windows comfortably. The long values above are what the engine holds, not a demand for how you type them.

## The compaction constant is graded in per km

The sixth field is the one people lose without noticing. It is graded in per km with a tolerance of 0.005, so the expected entry is 0.7000000000000015 and anything near 0.7 passes.

The trap is that the same constant is a thousand times smaller when written per m, and the well's own parameters are quoted that way throughout the course as 0.0006 per m. A per m entry in a per km field is not a near miss. It is off by three orders of magnitude and scores nothing.

Read the unit label on the field before you type into it, every time, including on a retake.

## The fitted mudline value is not the well's 656

The fifth field asks for the fitted mudline transit time, 650.0000000000014 us/m, and the well's own header says 656 us/m. Those are different numbers and the difference is larger than the 0.5 tolerance, so entering 656 fails the field.

This is deliberate, and it is the point module four spent a whole lesson on. The twelve picks were drawn on a different trend from the one in the well header. The fit reports what the picks say, and what the picks say is 650.0000000000014 us/m with a constant of 0.7000000000000015 per km. Neither the fit nor the label is wrong. The field asks specifically for the fitted value, so give it the fitted value and keep the header parameters for the fourth field, which is the only one that wants them.

Watch the direction of that mistake too. The fourth field wants the well trend at 2500 m and the fifth wants the fitted trend at the mudline. Both are trends, both are in us/m, and they sit next to each other on the panel.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks.

Try it yourself: set the panel below to 4000 m and locate the first two values, then work back up the list.

{{panel:pp-frame-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each. Then answer in one sentence: which two fields share the tightest tolerance, and which single field would you fail by entering the well's own header value?

As a self check: hydrostatic pressure at TD in MPa, tolerance 0.01; overburden stress at TD in MPa, tolerance 0.01; Gardner density at 1600 m/s in kg/m3, tolerance 0.5; NCT transit time at 2500 m in us/m, tolerance 0.5; fitted NCT mudline transit time in us/m, tolerance 0.5; and fitted compaction constant in per km, tolerance 0.005. The two pressures share the tightest window at 0.01 MPa. The field you would fail with a header value is the fitted mudline transit time, where the answer is 650.0000000000014 us/m and the header's 656 us/m misses by more than the 0.5 allowed.
