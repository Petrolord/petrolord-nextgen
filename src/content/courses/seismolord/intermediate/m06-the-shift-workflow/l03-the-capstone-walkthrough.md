# The capstone walkthrough

> **Open book, in part.** Some of the figures this capstone grades can be read in this tier's lessons or on a panel as it opens, so for now those check that you can find, read and report them correctly. A later update takes them out of the lessons and panels.

The Professional capstone for this course is called Bulk shift and tuning on the basic_20 tie. It runs on the teaching well you have used throughout. Its observed seismic is the 25 Hz synthetic arriving late by a lag the brief does not state, and it grades six numbers. This lesson walks the six in capstone order, gives the unit and tolerance of each, and works each kind of reading on the teaching trace, the same synthetic arriving 6 ms late, and on wavelets the capstone does not use.

## The six graded fields

| Field | Unit | Tolerance |
| --- | --- | --- |
| Suggested bulk shift | ms | 0.5 |
| Correlation at zero lag, before any shift | - | 0.0005 |
| Strongest synthetic amplitude at 15 Hz | - | 0.002 |
| Strongest synthetic amplitude at 40 Hz | - | 0.001 |
| TWT of the 15 Hz peak | ms | 2 |
| TWT of the 40 Hz peak | ms | 2 |

**1. Suggested bulk shift, in ms, tolerance 0.5.** The shift explorer opens on the teaching trace, where the scan returns 6 ms. For the capstone, select "The brief's trace" in the Observed trace box and read the suggested shift the scan reports there. Do not read it off the picture of the two traces. The scan tests 41 lags from minus 40 ms to plus 40 ms in one-sample steps at the 2 ms sample rate, so the only candidate answers are even numbers of milliseconds, and a tolerance of 0.5 ms makes this field effectively exact.

**2. Correlation at zero lag, before any shift, dimensionless, tolerance 0.0005.** Read it from the same scan on the brief's trace: it is the point on the curve at a lag of 0 ms, and the panel prints it to six decimals. On the teaching trace it is 0.771383. The correlation at the winning lag is not graded, because it is exactly 1 by construction: the observed trace is the 25 Hz synthetic copied forward, so at the right lag the two series are identical over their overlap. A real tie never returns 1. Report the zero lag score to at least four decimals; two decimals can miss by more than the tolerance.

**3 and 5. Strongest synthetic amplitude and its TWT at 15 Hz.** Set the wavelet to 15 Hz and read the strongest synthetic amplitude and the time beside it from the same panel state. The frequency is part of the field name, which is the habit this tier has been building.

**4 and 6. Strongest synthetic amplitude and its TWT at 40 Hz.** The same two readings with the wavelet at 40 Hz. The two amplitude fields carry different tolerances, 0.002 at 15 Hz and 0.001 at 40 Hz: the tighter absolute window sits on the smaller number. Both time fields are graded to 2 ms, one sample on the grid, so there is no room for a peak read off the wrong lobe or the wrong run.

Six readings, three panel states. Do the scan on the brief's trace first, then set 15 Hz and take fields 3 and 5 together, then set 40 Hz and take fields 4 and 6 together.

## Worked on wavelets the capstone does not use

On the teaching well the strongest synthetic amplitude is 0.102586 at 1640 ms at 20 Hz, 0.073005 at 1642 ms at 25 Hz, and 0.027585 at 1646 ms at 50 Hz. The amplitude falls as the frequency rises and the time moves, while the strongest reflection coefficient stays at 1582 ms. Your two readings should follow the same pattern.

## Where marks are actually lost

None of the six is hard to find. The losses come from crossing runs, from the wrong trace, and from rounding.

Reading the scan on the teaching trace is the new trap. The panel opens on it, and its 6 ms and 0.771383 are real numbers on the panel that answer a different question. Check the Observed trace box before you record fields 1 and 2.

Crossing runs is the old one. The 25 Hz values you have used throughout the course are not graded anywhere in this capstone, and 1642 ms TWT is a plausible looking wrong answer for either time field. Take each amplitude and its time from the same panel state, in the same pair, rather than assembling four numbers from notes.

Rounding is the last. Two decimal places can fail both amplitude fields. When in doubt, hand in what the panel shows.

## Getting to the capstone at all

The platform enforces the usual order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules, pass the final exam at 70 percent, and the capstone unlocks. Passing it grants the Professional certification in Seismolord.

{{panel:sl-shift-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each, and say which panel state you would read each from. As a self-check: the suggested bulk shift in ms at tolerance 0.5 and the correlation at zero lag at tolerance 0.0005 come from the scan with the brief's trace selected; the 15 Hz amplitude at tolerance 0.002 and its TWT at 2 ms come from the 15 Hz state; the 40 Hz amplitude at tolerance 0.001 and its TWT at 2 ms from the 40 Hz state. Then explain in two sentences why the correlation at the winning lag is exactly 1 here, why that makes it a poor thing to grade, and why you should not expect it on a real tie.
