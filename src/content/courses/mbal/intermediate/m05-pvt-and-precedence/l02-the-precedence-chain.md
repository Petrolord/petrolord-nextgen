# The precedence chain

A case can offer the engine more than one source for the same property. Ekene does: it carries a per-row oil formation volume factor on every survey and a six row laboratory table, and both are sitting in the same file. When that happens the engine does not average them, warn about the conflict, or pick the one it likes. It follows a fixed order of precedence, and the order is the same at every timestep.

**Per-row values in the production data first. Then interpolation in the laboratory table at that row's pressure. Then a correlation.**

Three levels, most specific to most general. The engine's own comment on the dispatchers states it in those words, and the code implements it in that order. Nothing else in this module matters more, because the precedence chain decides which of the three provenances from lesson 1 your answer actually rests on.

## The rule, level by level

**Level one, the row.** For an oil case the engine takes the per-row path only when the row carries both `rs_scf_stb` and `bo_rb_stb`. Both. A row with $B_o$ and no $R_s$ does not qualify, and the engine drops through to the next level for that row as though the $B_o$ were not there at all.

That catches people. It is easy to supply the one property you have and assume the engine will use it, and on an oil timestep it will not. There is one exception, at the initial row, where the engine reads the initial solution gas ratio and the initial oil formation volume factor independently of each other, so a first row carrying only $B_o$ does set $B_{oi}$. Assume the strict rule everywhere else.

**Level two, the table.** If the row does not qualify, the engine looks for the pressure in `pvt_lab_table`. It finds the two rows bracketing that pressure and interpolates linearly between them. If the pressure falls outside the range the table spans, or if the property is missing at either bracketing row, the lookup returns nothing and the engine drops through.

**Level three, the correlation.** Whichever correlation the case selected, evaluated at that row's pressure and the case's gravities and temperature.

The fall-through from level two to level three is the quiet one. It is not an error. The run completes, the plot is drawn, the slope is reported, and part of your answer is now a published curve fit rather than your laboratory's measurement. The engine does flag it, and lesson 4 is about reading that flag.

## Precedence is per property and per row

Two more details that follow from the code and that people get wrong.

Precedence is resolved separately for each property. A case can take $B_o$ from a row, $B_w$ from the lab table and the gas deviation factor from a correlation, all inside the same timestep. There is no single "PVT source" for a run, whatever the case metadata says.

Precedence is also resolved separately at each pressure. A lab table that spans 2000 to 3400 psia serves every survey inside that window and silently hands the rest to a correlation. A history that starts inside the table and depletes out of the bottom of it therefore changes provenance halfway down, and the change is invisible in the result.

## Worked example: the same tank on three chains

Run the Ekene surveys three ways and read the slope.

**With the per-row values, as committed.** The engine takes level one on every row. The oil formation volume factor at the last survey is 1.21589748101760 rb/stb and the slope is

$$N = 12139208.1074968 \ \text{stb}$$

**With the per-row values deleted and the lab table left exactly as the fixture stores it.** The engine reaches level two and the lookup fails, for a reason lesson 4 unpacks, so every row falls through to the correlation. The oil formation volume factor at the last survey becomes 1.25041043403039 rb/stb, which is 2.83847557475905 percent high, and the slope becomes

$$N = 13296089.9738372 \ \text{stb}$$

That is 1156881.86634040 stb more oil than the tank contains, an error of 9.53012631545501 percent, from a dataset in which not one pressure and not one produced volume was changed.

**With the per-row values deleted and the lab table sorted so that the lookup works.** The oil formation volume factor at the last survey lands at 1.21611131062021 rb/stb, within 0.0175861539277053 percent of the per-row value. The lab table is doing its job.

And the slope comes back at 13296089.9738367 stb.

Read that again. The lab table recovered $B_o$ to within two hundredths of a percent and the oil in place did not move: it agrees with the correlation run to fourteen significant figures. Something other than the level of $B_o$ is setting this answer, and lesson 3 identifies it. For now, take the shape of the result rather than its cause: **getting a fluid property close is not the same as getting the answer right**, and the precedence chain is where you find out which one you got.

## The one comparison that settles it

If you ever want to know whether a lab table is actually being used, there is a test that costs one run. Delete the table entirely and run again with the correlations alone.

Do that on Ekene with the per-row values already removed and the slope comes back at 13296089.9738372 stb, digit for digit the same as the run that still had the table in the file. A table that changes nothing when you remove it was never being read.

## Exercise

Sketch the precedence chain as a three box flowchart with the fall-through conditions written on the arrows, from memory, then check it against this lesson. Get the "both $R_s$ and $B_o$" condition on the first arrow.

Then work this case on paper. A tank has surveys at 4100, 3600, 3100, 2600 and 2100 psia. The laboratory table runs from 2500 to 4000 psia. The production rows carry $B_o$ but no $R_s$. There is a selected correlation.

For each of the five surveys, name the level that supplies $B_o$, and write one sentence on what you would tell a reviewer who asks whether this reading is based on laboratory data. Then say which single edit to the input file would move the largest number of rows up the chain.
