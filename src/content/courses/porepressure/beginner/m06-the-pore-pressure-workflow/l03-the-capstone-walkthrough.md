# The capstone walkthrough

The Associate capstone for this course is called The pressure frame of the synthetic well, and it is short. It keeps the golden well's logs and states a setting of its own: a water depth, a pore-fluid density, a Gardner velocity, a trend depth and a fit matrix that differ from the teaching case the modules worked. You type that setting into the frame panel and read six numbers. There is no essay, no free interpretation and no hidden dataset.

This lesson walks the six fields in the order the capstone asks for them, on the teaching case (100 m of water, pore fluid 1030 kg/m3, Gardner at 1600 m/s, the trend at 2500 m, a fit matrix of 220 us/m), says where each is read, and points out where marks are lost. The capstone does not grade these teaching values.

## The six fields, worked on the teaching case

| Field | Unit | Teaching case | Tolerance |
| --- | --- | --- | --- |
| Hydrostatic pressure at TD | MPa | 41.408579625 | 0.01 |
| Overburden stress at TD | MPa | 91.12306695073282 | 0.01 |
| Gardner density (teaching case at 1600 m/s) | kg/m3 | 1960.612149304395 | 0.5 |
| NCT transit time (teaching case at 2500 m) | us/m | 317.2847498247154 | 0.5 |
| Fitted NCT mudline transit time | us/m | 650.0000000000014 | 0.5 |
| Fitted compaction constant | 1/km | 0.7000000000000015 | 0.005 |

**Hydrostatic pressure at TD, tolerance 0.01.** The two part fluid column at 4000 m below mudline, seawater to the mudline plus pore fluid below it: 41.408579625 MPa on the teaching case. Type the water depth and pore fluid density, set the panel's depth to 4000 m and read the hydrostatic figure.

**Overburden stress at TD, tolerance 0.01.** The integrated sediment density plus the seawater column (91.12306695073282 MPa on the teaching case), at the same 4000 m below mudline. Read it from the overburden figure with the depth still at 4000 m.

**Gardner density, tolerance 0.5.** This one comes from the velocity input rather than the depth. Type the velocity the brief states and read the Gardner density it returns: at 1600 m/s it is 1960.612149304395 kg/m3. The depth setting does not enter this field.

**NCT transit time at the stated depth, tolerance 0.5.** The normal compaction trend on the well's own parameters, a mudline transit time of 656 us/m, a matrix of 220 us/m and a compaction constant of 0.0006 per m. Set the depth the brief states (at 2500 m the trend reads 317.2847498247154 us/m) and read the well trend column, not the fitted trend column and not the log.

**Fitted NCT mudline transit time, tolerance 0.5.** The mudline value the least squares fit recovers from the twelve shale picks at the matrix transit time you type. Read it from the fitted trend tile; with the teaching matrix of 220 us/m it is 650.0000000000014 us/m.

**Fitted compaction constant, tolerance 0.005.** The decay rate the same fit recovers (0.7000000000000015 per km on the teaching case), reported with the fitted trend. The field's unit label is 1/km, which is per km.

## The two tightest fields

The two pressure fields carry the tightest tolerances on the paper, both at 0.01 MPa. That is a narrow window on numbers in the tens of MPa, and it is narrow for a reason: both are deterministic column calculations with no interpretation in them, so there is nothing to be generous about.

Two habits protect them. Take gravity as 9.80665 m/s2 and not a rounded value, because both common roundings fail this field on their own. On the teaching case at 4000 m below mudline a g of 9.81 gives 41.422725000 MPa and a g of 9.8 gives 41.380500000 MPa, against the engine's 41.408579625 MPa and a 0.01 window. And read the values in MPa rather than converting from pascals in your head, because the engine holds 41408579.625 Pa and a conversion done at speed is where the digit gets dropped.

Three decimal places clears both windows comfortably. The long values above are what the engine holds, not a demand for how you type them.

## The compaction constant is graded in per km

The sixth field is the one people lose without noticing. It is graded in per km with a tolerance of 0.005. On the teaching case the entry would be 0.7000000000000015.

The trap is that the same constant is a thousand times smaller when written per m, and the well's own parameters are quoted that way throughout the course as 0.0006 per m. A per m entry in a per km field is not a near miss. It is off by three orders of magnitude and scores nothing.

Read the unit label on the field before you type into it, every time, including on a retake.

## The fitted mudline value is not the well's 656

The fifth field asks for the fitted mudline transit time, and the well's own header says 656 us/m. On the teaching case the fit returns 650.0000000000014 us/m. Those are different numbers and the difference is larger than the 0.5 tolerance, so entering 656 fails the field.

This is deliberate, and it is the point module four spent a whole lesson on. The twelve picks were drawn on a different trend from the one in the well header. The fit reports what the picks say at the matrix you give it, and at 220 us/m what the picks say is 650.0000000000014 us/m with a constant of 0.7000000000000015 per km. Neither the fit nor the label is wrong. The field asks specifically for the fitted value, so give it the fitted value and keep the header parameters for the fourth field, which is the only one that wants them.

Watch the direction of that mistake too. The fourth field wants the well trend at the stated depth and the fifth wants the fitted trend at the mudline. Both are trends, both are in us/m, and they sit next to each other on the panel.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks.

Try it yourself: the panel below opens on the teaching case. Locate the six values there first. Then type a different water depth, pore fluid density and fit matrix and watch which tiles move: the column pressures follow the setting, the log and the well trend do not.

{{panel:pp-frame-explorer}}

## Exercise

Without opening the panel, list the six fields in capstone order with the unit and tolerance of each. Then answer in one sentence: which two fields share the tightest tolerance, and which single field would you fail by entering the well's own header value?

As a self check: hydrostatic pressure at TD in MPa, tolerance 0.01; overburden stress at TD in MPa, tolerance 0.01; Gardner density in kg/m3, tolerance 0.5; NCT transit time at the stated depth in us/m, tolerance 0.5; fitted NCT mudline transit time in us/m, tolerance 0.5; and fitted compaction constant in per km, tolerance 0.005. The two pressures share the tightest window at 0.01 MPa. The field you would fail with a header value is the fitted mudline transit time, where the teaching case gives 650.0000000000014 us/m and the header's 656 us/m misses by more than the 0.5 allowed.
