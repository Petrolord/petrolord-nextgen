# The professional report

An interpretation that lives only in the app is not finished work. The deliverable of a professional evaluation is a report that another petrophysicist can pick up cold, rerun from scratch, and land on the same numbers. This lesson sets out what that report contains, section by section, as a checklist you can reuse on any well. None of it is bureaucracy; every item exists because its absence has burned someone.

## Input curves and their QC state

Open with the data inventory: which curves were used (on the typewell: DEPT, GR, RHOB, NPHI, DT, RT), their depth range and sample rate, and the quality-control state of each. Quality control here means the checks you performed, stated honestly: was the density pad in contact, were there washout intervals, were the curves depth-matched, were any samples nulled. A curve you did not QC is a curve your reader cannot trust, and saying "used as delivered" is itself a QC statement, because it tells the reader where to look first if something is wrong.

## Parameters with provenance

Every parameter gets three things: its value, its units, and where it came from. Provenance falls into three categories, and labelling them is the heart of a defensible report:

* Given: supplied with the dataset or by the client. On the typewell: $GR_{clean}$ 20 and $GR_{clay}$ 120 API, $\rho_{ma}$ 2.65 and $\rho_{fl}$ 1.0 g/cc, $\Delta t_{ma}$ 182 and $\Delta t_{fl}$ 656 microseconds per metre, $R_{sh}$ 2.0 ohm.m.
* Fitted: derived from this well's own data, with the fit described. The flagship example is the Pickett fit: $aR_w$ of 0.0500 ohm.m and $m$ of 2.000, from the 6-point fit over the water leg at 2075 to 2078 m. Quote the window, the point count and the fitted values; a reader who distrusts the fit can then reproduce it exactly.
* Assumed: taken from experience or analogue, with the assumption named. The saturation exponent $n = 2$ is the classic assumption when no core measurement exists.

A parameter table with a provenance column is worth more than pages of prose. When a result is later questioned, the argument almost always ends at one row of that table.

## Methods with one-line justifications

List each method choice and give it one line: linear $V_{sh}$ because the shaly-sand equations expect a conservative clay volume; $\phi_{ND}$ primary because the neutron-density pair cancels opposing errors; Wyllie sonic retained as bad-hole backup; Simandoux and Indonesia run alongside the Archie baseline because SAND_A carries shaly edges. One line each is the discipline: if a choice needs a paragraph to defend, that paragraph belongs in an appendix, but if it cannot be summarised in a line you probably do not understand your own choice yet.

## Zone tables

The core numerical product: one row per zone, with gross, net, NTG and the zone means. For the typewell, SAND_A books mean $\phi_{ND}$ 0.1762 and mean Simandoux $S_w$ 0.4335, with SAND_B alongside at mean $\phi_{ND}$ 0.1220 and mean Simandoux $S_w$ 0.7504. Always report both zones even when one is clearly the prize; the poorer zone documents the contrast that makes the better one credible.

## Sensitivities

Attach the sensitivity table from the previous lesson: net pay for SAND_A of 19.0 m under Archie against 20.0 m under either shaly-sand model, with the cutoff mechanism explained in a sentence. A report that presents a single net number with no range is asserting a precision the workflow does not possess. The range is the honest product; the base case is just the row of it you recommend.

## Reproducibility

The closing test, and the one that makes everything above cohere: could another professional, given only this report and the same dataset, rerun the workflow and land on the same six capstone numbers? Walk it mentally before issuing: curves are named, every parameter has value and provenance, every method is identified, the fit window is quoted. If any step would force the reader to guess, the report fails, whatever its polish. This standard is also the exact one the capstone grader applies to you: it recomputes the six numbers from the same inputs and checks yours against them within tolerance.

## Worked example

Write the parameter table rows for the saturation calculation, with provenance:

1. $aR_w$ = 0.0500 ohm.m, fitted, Pickett over 2075 to 2078 m, 6 points.
2. $m$ = 2.000, fitted, same Pickett line, slope.
3. $n$ = 2, assumed, no core data.
4. $R_{sh}$ = 2.0 ohm.m, given, read from the bounding shale.

Four rows, and the entire saturation model is auditable.

## Exercise

Draft the one-line justification you would write for booking $\phi_{ND}$ over $\phi_D$ in SAND_A, quoting both zone means (0.1762 and 0.2022). Then state, in one sentence, which single section of the report a reviewer would consult first if your booked $S_w$ were challenged, and why that section settles the argument faster than the zone table itself.
