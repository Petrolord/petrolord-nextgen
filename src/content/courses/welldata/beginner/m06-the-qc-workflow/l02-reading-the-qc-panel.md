# Reading the QC panel

The app turns the checklist from the previous lesson into a single screen. Open Well Data Manager in Learning Mode and you are looking at the QC panel: one file loaded through the real parser, its whole health summary laid out in four regions. This lesson is a guided tour of those regions, because the skill this course grades is exactly this: load the right file, read the right cell.

## The file selector

Across the top sit six buttons, one per teaching file. Clicking one runs the parser on that file and rebuilds everything below it. Under the buttons a one-line hint reminds you what each file is for. Two habits matter here. First, always confirm which file is selected before you read anything; a correct reading from the wrong file is still a wrong answer. Second, when a question names a file, switch to it first and let the panel refresh, then read.

## The four framing tiles

Directly below the selector sit four tiles that answer the framing questions in one glance.

* **LAS version / wrap** tells you the structural story: 2 / NO for the five modern files, 1.2 / YES for wrapped_12.
* **Depth range** shows the first and last depth in the file's NATIVE unit, with that unit named in the tile heading. For feet_20 this reads 4900.0 to 5200.0 in F; the tile does not silently convert.
* **Step (native / metres)** shows the step twice: once in the native unit and once converted. This is the tile where feet_20 shows 2.0000 F / 0.6096 m, and that second number is a capstone reading.
* **Samples / NULL flag** shows how many depth samples the file carries and which null value it declares. basic_20 reads 301 / -999.25 here; wrapped_12 reads 161 / -999.25; nullheavy_20 shows its unusual -9999.

## The per-curve table

The table below the tiles has one row per curve and seven columns: mnemonic, unit, samples, nulls, first finite, last finite, and mean over finite samples. This is where completeness and plausibility live.

Read basic_20's GR row and you find 301 samples, 8 nulls, and a finite mean of 64.9272 GAPI. Both the null count and the mean are capstone readings, and they sit side by side in one row. The first and last finite columns tell you where real data begins and ends, which exposes curves that only cover part of the well.

A dead curve announces itself in red. Switch to nullheavy_20 and the NPHI row turns red: 201 samples, 201 nulls, no first finite, no last finite, no mean. That 201 in the nulls column is another capstone reading, and the colour means you cannot miss it.

## The header table

At the bottom, the header table lists the well section entries worth reading: WELL, COMP, FLD, LOC, SRVC, DATE, then STRT, STOP, STEP and NULL with their units. This is the identity check and the trust-but-verify check in one place. On quirks_20 you will see how much sparser a real-world header can be, and how the well name survived its internal colon because the parser splits on the last colon, not the first.

## Where each capstone reading lives

Putting the tour together, here is the map you will use in the capstone walkthrough next lesson:

* basic_20 depth samples: the Samples / NULL tile, with basic_20 selected, reads 301.
* basic_20 GR nulls and finite mean: the GR row of the curve table, 8 and 64.9272.
* feet_20 step in metres: the Step tile, second value, with feet_20 selected, reads 0.6096.
* nullheavy_20 NPHI nulls: the red NPHI row, nulls column, reads 201.
* wrapped_12 depth samples: the Samples / NULL tile, with wrapped_12 selected, reads 161.

Every one of these is a real parser output recomputed on the spot, not a stored answer. If the engine changed, the panel would change with it.

## Exercise

Without the app in front of you, write down which region of the panel answers each question, then verify in the app: (a) whether irregular_20 has a constant step; (b) how many nulls RHOB carries in wrapped_12; (c) what NULL value nullheavy_20 declares; (d) the native depth unit of feet_20. Self-checks: (a) the step question is a framing question, and for irregular_20 the recomputed step of 0.5 m is an average over an uneven column, which the header hints at by declaring STEP 0; (b) the RHOB row of the curve table shows 9 nulls; (c) the Samples / NULL tile shows -9999; (d) the depth range tile names F.
