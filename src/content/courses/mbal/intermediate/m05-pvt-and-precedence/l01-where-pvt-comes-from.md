# Where PVT comes from

Every term in the material balance is built out of fluid properties. The withdrawal is a cumulative volume multiplied by an oil formation volume factor. The oil expansion is a difference of two of those factors. The rock and water term carries the initial one as a scale. Change $B_o$ and every number in the reading moves.

The Associate tier handed you $B_o$ on every Ekene survey and asked you not to worry about it. That was a teaching convenience, and it is also, occasionally, real life: some datasets do arrive with fluid properties attached to every row. Most do not. This module is about what happens then, and it starts with the only question that matters about any fluid property you did not measure yourself.

Where did this number come from?

There are exactly three answers, and the material balance engine implements all three.

## A laboratory report

Somebody captured a sample of the reservoir fluid, brought it back to reservoir temperature and pressure in a cell, and then stepped the pressure down, recording the oil volume, the gas that came out of solution and the properties of both at each step. What arrives on your desk is a table: a column of pressures and, beside it, columns of measured properties.

In the engine that table is `pvt_lab_table`, an array of rows. Each row must carry `pressure_psia`. Everything else is optional: `bo_rb_stb`, `rs_scf_stb`, `bg_rb_mscf`, `z_factor`, `bw_rb_stb`, `oil_viscosity_cp`, `gas_viscosity_cp`. The engine interpolates only the fields that are present at both of the two rows bracketing the pressure it is asking about, so a table with $B_o$ at every pressure and $R_s$ at only half of them will serve $B_o$ and fall through for $R_s$.

A lab report is the strongest provenance you can have, and it is still not the reservoir. It is one sample, from one well, at one date, depleted by one laboratory procedure. It is evidence about your fluid rather than about fluids in general, which is exactly what makes it worth paying for.

## A correlation

A correlation is a published curve fit. Somebody gathered a few hundred fluid samples, measured them, and fitted an expression that predicts a property from things you are more likely to know: oil gravity, gas gravity, temperature, pressure. When you have no lab report, that expression is what stands in.

The engine carries a roster of them and lets the case choose, through `pvt_correlations`. For bubble point, solution gas and oil formation volume factor the choices are Standing, Vasquez-Beggs and Glaso. For the gas deviation factor, Hall-Yarborough or Dranchuk-Abou-Kassem. Water formation volume factor comes from McCain. Oil viscosity offers Beggs-Robinson, Beal-Standing and Beal-Cook-Spillman, and gas viscosity uses Lee-Gonzalez-Eakin.

Each of those was fitted over a documented range of conditions, and the engine knows what those ranges are. Before it reports, it compares your reservoir's pressure, temperature, gravity and gas gravity against the range each selected correlation was trained on, and where you fall outside it says so in a warning. The wording is worth reading once, because it is the right posture: it tells you the engine continues to compute and that you should treat the result as an extrapolation beyond the correlation author's intended scope. It does not refuse, and it does not pretend.

## A value someone typed

The third source is a number sitting directly on a production row. `ProductionDataPoint` accepts `bo_rb_stb`, `rs_scf_stb`, `bg_rb_mscf` or `bg_rb_scf`, `bw_rb_stb` and `z_factor`, and when they are present the engine uses them.

This is the strongest instruction you can give the engine and the weakest provenance you can give a reviewer. A per-row $B_o$ might be a lab value read off the report at that pressure. It might be a spreadsheet interpolation someone did last year. It might be a correlation someone ran elsewhere and pasted in. The engine cannot tell, and neither can the result. The traceability has to live in your documentation, because it does not live in the file.

The Ekene fixture supplies per-row $B_o$ and $R_s$ on all seven rows, and also carries a six row lab table. Both are in the file. Knowing which one the engine actually used is the subject of the next lesson.

## Worked example: what a correlation does not know

Strip the per-row fluid properties off the Ekene surveys and the engine has to find an initial solution gas ratio for itself. It calls the selected correlation, Standing's, at the bubble point of 2000 psia with the case's oil gravity of 32 API, gas gravity of 0.75 and reservoir temperature of 180 F, and gets

$$R_{si} = 421.939227522706 \ \text{scf/stb}$$

The fixture says 400. The gap is 21.9392275227060 scf/stb, which is 5.48480688067650 percent.

Nobody made an arithmetic mistake. The correlation answered the question it was built to answer, which is what a fluid of that gravity, that gas gravity and that temperature would typically dissolve at that pressure. Ekene's fluid is not typical. It is Ekene's. The 5.48480688067650 percent is the distance between a general answer and a specific one, and it is the price of not having a sample.

Notice also what the gap is not. It is not noise, and it will not average out over the six surveys. A correlation biased high stays biased high at every pressure, so the error walks into every term you build and stays there.

## Exercise

Take any material balance dataset you can reach, your own or the Ekene fixture, and build a three column table: property, value, provenance. Fill the provenance column with exactly one of "lab report", "correlation" and "supplied per row, source unknown" for every fluid property the case uses, including the initial ones.

Then answer two questions in writing. First, for each row you marked "supplied per row, source unknown", what document would you have to find to upgrade it to "lab report", and who in your organisation would hold it? Second, if you could commission one laboratory measurement and only one, which property would you buy, and what is your argument that it moves the oil in place more than any other?

Hold on to that table. Lesson 4 of this module asks you to attach it to a result, and module 6 asks you to defend it.
