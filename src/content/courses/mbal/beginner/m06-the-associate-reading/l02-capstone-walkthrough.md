# The capstone walkthrough

The Associate capstone asks you to close the Ekene tank. You run material balance on the six survey history and report six numbers, each graded server-side within a stated tolerance.

| Field | Unit | Tolerance | Where it is derived |
|---|---|---|---|
| Underground withdrawal $F$ at the last survey | rb | 50 | module 2 lesson 1 |
| Total expansion $E_t$ at the last survey | rb/stb | 0.00005 | module 2 lesson 5 |
| Oil originally in place from the slope | stb | 20000 | module 3 lesson 3 |
| Rock and water share of $E_t$ at the last survey | percent | 0.2 | module 2 lesson 4 |
| Depletion drive index at the last survey | none | 0.005 | module 4 lesson 2 |
| R-squared of the straight line | none | 0.001 | module 3 lesson 2 |

This lesson does not hand you six answers to copy. It walks two of them all the way through the panel and by hand, and points you at the lesson that owns each of the rest. If you worked modules 1 through 5 there is nothing new here. The capstone is the course, asked back.

Read the tolerances as a promise: any honest route to each number lands well inside them. The tolerance on the oil in place is 20000 stb on an answer near twelve million, so nobody is grading your decimal places. They are grading whether you used the right method.

## Set the panel up correctly

Open the tank explorer.

{{panel:mb-tank-explorer}}

There is exactly one control, the aquifer model given to the engine, and it must be left on "None (the truth)". That is the Ekene tank as it actually is: a closed, undersaturated, depletion drive tank with no water support, which is why the water drive index tile reads zero and the aquifer strength tile reads none.

The other option puts an aquifer term into a tank that does not have one, and it exists so the Professional tier can show what an unnecessary model does to an answer. Select it if you are curious, watch the oil in place tile move, then put it back. Every graded number here comes from the "None" setting, and numbers read with the selector on will fail several fields at once while the fit statistic stays high enough to reassure you.

## Walkthrough one: underground withdrawal, from the panel and by hand

Underground withdrawal is the volume that left the tank, measured at reservoir conditions. The capstone wants it at the last survey, the row dated 2023-01-01.

Find that row in the panel's survey table and read the column headed "F rb". It reads 317926.842484584 rb, displayed to one decimal, which against a tolerance of 50 rb is more precision than you need.

Now earn it by hand, because a number you cannot reproduce is a number you cannot defend. Ekene is undersaturated throughout, so its solution gas ratio never falls below its initial 400 scf/stb, and neither free gas nor water is produced. Every term in the general withdrawal expression collapses except the first, and

$$F = N_p B_o$$

Read the two ingredients from the same row: cumulative oil 261475.039999678 stb and, from the fixture's per-row fluid properties, an oil formation volume factor of 1.21589748101760 rb/stb at 2096.00826266700 psia. Multiply:

$$F = 261475.039999678 \times 1.21589748101760 = 317926.842484584 \text{ rb}$$

Do that multiplication on a calculator now. Two things to notice. Stock tank barrels went in and reservoir barrels came out, which is the unit conversion the whole tank model turns on. And the answer exceeds the naive product of 261475.039999678 and the initial 1.2, which is 313770.047999614 rb, by 4156.79448497016 rb, because the oil swelled as pressure fell towards the bubble point. That difference is not rounding. It is the physics the capstone is testing.

## Walkthrough two: the rock and water share, from the tile and by hand

The fourth field asks what fraction of the total expansion at the last survey came from rock compaction and connate water expansion rather than from the oil. The panel has a tile for it, labelled "Efw share of Et at the last survey", and it reads 39.2996108949418 percent.

By hand, take the last row of the survey table, divide the cell in the "Efw rb" column by the cell in the "Et rb" column, and multiply by 100. The rock and water term at that survey is 0.0102925998895969 rb/stb, and the tolerance is 0.2 percentage points.

Take the result seriously, because it is the most surprising number in this tier. Nearly two fifths of everything that pushed oil out of the Ekene tank came from rock compaction and connate water expansion, not from the oil. Students routinely expect this term to be negligible and drop it. The next lesson shows what dropping it does.

## Where the other four come from

**Total expansion at the last survey.** Module 2 lesson 5, and the "Et rb" column. Check it rather than copy it: add the "Eo rb/stb" cell to the "Efw rb" cell of that row and confirm you get the "Et rb" cell exactly.

**Oil originally in place.** Module 3 lesson 3, and the "OOIP from the slope" tile. Confirm it without the regression by dividing the "F rb" cell of any row by the "Et rb" cell of the same row, which is what the "F/Et" column already does. Every row gives the same answer, and that is the point of module 3.

**Depletion drive index.** Module 4 lesson 2, and its own tile. The hand route is the oil expansion divided by the total expansion in the last row, because the withdrawal cancels: the index is $N E_o / F$ and $F$ is $N E_t$. That gives you a free check: on a tank with no water influx and no gas cap, the depletion drive index and the rock and water share must add to exactly 1.

**R-squared.** Module 3 lesson 2, and its tile. It is a statement about how tightly six points sit on a line, and nothing more. The next lesson explains why a superb value here is not evidence that your model is correct.

## Submitting

The capstone form sits on the Learning Mode page under the course. Enter the six numbers at whatever precision you carried and submit. Grading is server-side against the engine truth within the tolerances in the table, and you will see which fields passed.

If a field fails, do not add decimal places. Every tolerance here is far wider than any rounding you could plausibly commit, so a miss means a method error, and the fix is the lesson named in the table.

## Exercise

Before you submit, predict the effect of each of these four mistakes on each of the six fields: reporting cumulative oil where the withdrawal was wanted; leaving the aquifer selector on the pot setting; grouping the compressibilities as $S_{wi}(c_w + c_f)$; and reading the slope from a plot with the axes swapped.

For each, write down which fields would fail and in which direction, then check two of your predictions in the panel. The next lesson works all four out in full.
