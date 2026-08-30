# Working the capstone

Six placement numbers for the intermediate string, on a job that cannot be pumped.

{{panel:cm-placement-explorer}}

## What you are given

The Associate capstone's job, simulated. The 9-5/8 inch intermediate string on the slant well: shoe at 1400 m, float collar at 1352, cased to 350 m behind 13-3/8 inch, 12-1/4 inch open hole below that, top of cement at 250 m, 30 percent excess, lead and tail split at 350 m.

**The fluids.** Mud in the hole at 1400 kg/m3. Then 6 cubic metres of spacer at 1520, the lead at 1580, the tail at 1920, and displacement at 1400. Every one of those densities is different from the lessons'.

**The rheologies.** Four new Fann sets, none of them the lessons'. Mud 72 and 44 with 8 and 7 at the low speeds; spacer 46 and 28 with 5 and 4; lead 90 and 56 with 12 and 9; tail 124 and 78 with 17 and 14.

**The rate.** 0.028 cubic metres a second.

**The limit.** The previous shoe at 350 m has been leak-off tested to 1600 kg/m3 equivalent.

## The six

1. The **end pump pressure**, in pascals.
2. The **float differential**, in pascals.
3. The **peak ECD at the previous shoe**, in kg/m3.
4. The **smallest pump rate at which the job does not free fall**, in cubic metres a second.
5. The **largest pump rate whose peak ECD stays at or below 1600**, in cubic metres a second.
6. The **rate window width**, which is field 5 less field 4.

## The order to do them in

The volumes first, from the Associate capstone. Nothing here can be computed without them.

Then the placement at the design rate, which gives fields 1, 2 and 3 in one run.

Then bisect for 4 and 5, separately, each over the whole rate range. Then subtract for 6.

## The traps

**Field 3 is at the PREVIOUS shoe, 350 m, not at the casing shoe at 1400.** The two are very different numbers and the engine reports both.

**Field 4 is a bisection, not a sweep.** Sweep at any reasonable step and you will be a whole step wide of the answer.

**Field 6 is NEGATIVE.** This job's window is closed. If you get a positive number, one of the two edges is wrong, and it is probably field 4.

**Field 4 is much larger than the design rate.** By a factor of about five. That is not an error: this job free falls at every rate anybody could actually pump, which is what large-diameter casing in a wide annulus does.

**The rheologies matter.** Four different Fann sets feed four different Herschel-Bulkley fits, and the friction is what both edges are made of. Reusing the lessons' rheologies will move both of them.

## Free checks

Field 5 less field 4 is field 6, exactly.

Field 3 must be BELOW 1600, because the design rate is inside the ECD constraint even though it is outside the free-fall one. So field 5 must be LARGER than 0.028 and field 4 must be larger still.

Field 1 must exceed field 2, because the end pump pressure is the float differential plus the friction at the last step, and the friction is positive.

## The qualitative question

The window is closed. Say which of the four remedies from module 4 you would reach for on this job, and note that raising the rate is not one of them.

## Exercise

Do the six in the panel. Then re-run the job at half the design rate and write down what happens to fields 1, 2 and 3.

One of the three will not move at all. Say which, and why.
