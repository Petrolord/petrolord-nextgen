# The capstone walkthrough

> **Open book, in part.** Some of the figures this capstone grades can be read in this tier's lessons or on a panel as it opens, so for now those check that you can find, read and report them correctly. A later update takes them out of the lessons and panels.

The Professional capstone for this course is called Bulk shift and tuning on the basic_20 tie. It runs on the teaching well you have used throughout, the observed seismic is the 25 Hz synthetic arriving 8 ms late, and it grades six numbers. This lesson walks the six in capstone order, gives the unit and tolerance of each exactly as the assessment defines them, and says where each one is read.

## The six graded fields

| Field | Unit | Tolerance |
| --- | --- | --- |
| Suggested bulk shift | ms | 0.5 |
| Correlation at zero lag, before any shift | - | 0.0005 |
| Strongest synthetic amplitude at 15 Hz | - | 0.002 |
| Strongest synthetic amplitude at 40 Hz | - | 0.001 |
| TWT of the 15 Hz peak | ms | 2 |
| TWT of the 40 Hz peak | ms | 2 |

**1. Suggested bulk shift, in ms, tolerance 0.5.** The value is 8 ms. Run the bulk-shift scan and read the suggested shift the panel reports. Do not read it off the picture of the two traces, and do not round a visual impression into it. The scan tests 41 lags from minus 40 ms to plus 40 ms in one-sample steps at the 2 ms sample rate, so the only candidate answers are even numbers of milliseconds. With a tolerance of 0.5 ms, the neighbouring lags of 6 ms and 10 ms are nowhere near passing. This field is effectively exact.

**2. Correlation at zero lag, before any shift, dimensionless, tolerance 0.0005.** Read it from the scan: it is the point on the curve at a lag of 0 ms, and the panel prints it to six decimals. It is the score the tie earns if you never apply a shift. The correlation at the winning lag is not graded, because it is exactly 1 by construction: the observed trace is the 25 Hz synthetic copied forward, so at the right lag the two series are identical over their overlap. A real tie never returns 1. The zero lag score is the useful number, because it shows how respectable an unshifted tie can look while it is wrong. Report it to at least four decimals; two decimals can miss by more than the tolerance.

**3. Strongest synthetic amplitude at 15 Hz, dimensionless, tolerance 0.002.** The value is 0.1573149710893631. Set the wavelet to 15 Hz and read the strongest synthetic amplitude from the panel. It is dimensionless, so no unit is expected with it, but the frequency is part of the field name, which is the habit this tier has been building.

**4. Strongest synthetic amplitude at 40 Hz, dimensionless, tolerance 0.001.** The value is 0.0362229160964489, read the same way with the wavelet set to 40 Hz. Note that the two amplitude fields have different tolerances: 0.002 at 15 Hz and 0.001 at 40 Hz. The tighter absolute window sits on the smaller number, which is what you would expect, since a fixed absolute window on a peak roughly four times smaller would otherwise be four times more forgiving. In relative terms the 15 Hz field is still the tighter of the two, at about 1.3 percent of its value against about 2.8 percent for the 40 Hz field.

**5. TWT of the 15 Hz peak, in ms, tolerance 2.** The value is 1580 ms TWT, read from the time beside the strongest amplitude with the wavelet at 15 Hz.

**6. TWT of the 40 Hz peak, in ms, tolerance 2.** The value is 1646 ms TWT, read the same way at 40 Hz. Both time fields are graded to 2 ms, which is one sample on the 2 ms grid. There is no room in that window for a peak read off the wrong lobe or off the wrong run.

Six readings, three panel states. Do the scan first, then set 15 Hz and take fields 3 and 5 together, then set 40 Hz and take fields 4 and 6 together.

## Where marks are actually lost

None of the six is hard to find. The losses come from crossing runs and from rounding.

Crossing runs is the main one. The 25 Hz values you have used throughout the course, an amplitude of 0.07300488650798798 at 1642 ms TWT, are not graded anywhere in this capstone, and 1642 ms TWT is a plausible looking wrong answer for either time field. Take each amplitude and its time from the same panel state, in the same pair, rather than assembling four numbers from notes.

Rounding is the other. Three decimal places clears both amplitude fields comfortably, since 0.157 sits well inside 0.002 of the 15 Hz value and 0.036 sits well inside 0.001 of the 40 Hz value. Two decimal places fails both, because 0.16 is 0.0027 away from the 15 Hz value and 0.04 is 0.0038 away from the 40 Hz value. When in doubt, hand in what the panel shows.

## Getting to the capstone at all

The platform enforces the usual order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules, pass the final exam at 70 percent, and the capstone unlocks. Passing it grants the Professional certification in Seismolord.

Open the panel and locate all six values in capstone order before you submit anything.

{{panel:sl-shift-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each, and say which panel state you would read each from. As a self-check: suggested bulk shift in ms at tolerance 0.5, which is 8; correlation at zero lag, dimensionless at tolerance 0.0005, read from the scan at a lag of 0 ms; strongest synthetic amplitude at 15 Hz, dimensionless at tolerance 0.002, which is 0.1573149710893631; strongest synthetic amplitude at 40 Hz, dimensionless at tolerance 0.001, which is 0.0362229160964489; TWT of the 15 Hz peak at tolerance 2 ms, which is 1580 ms TWT; and TWT of the 40 Hz peak at tolerance 2 ms, which is 1646 ms TWT. Then explain in two sentences why the correlation at the winning lag is exactly 1 here, why that makes it a poor thing to grade, and why you should not expect it on a real tie.
