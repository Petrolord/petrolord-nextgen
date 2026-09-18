# Two bundle rows that are identical

A bundle diameter comes from a fitted geometry form: the tube outside diameter times the tube count over a constant, raised to the reciprocal of an exponent. The constant and the exponent depend on the layout angle and the pass count, and this module carries 3 layouts across 4 pass counts. Two of those layouts carry the same numbers.

{{panel:fc-coefficient-explorer}}

## One area, every layout and pass count

| layout, degrees | passes | bundle diameter, inches | shell diameter, inches |
| --- | --- | --- | --- |
| 30 | 1 | 18.669077 | 21.169077 |
| 30 | 2 | 19.000124 | 21.500124 |
| 30 | 4 | 19.854977 | 22.354977 |
| 30 | 6 | 21.130390 | 23.630390 |
| 45 | 2 | 20.698071 | 23.198071 |
| 45 | 6 | 22.986286 | 25.486286 |
| 90 | 2 | 20.698071 | 23.198071 |
| 90 | 6 | 22.986286 | 25.486286 |

Every figure is taken at one area of 980.000000 ft2 and a tube count of 312. Read the last four rows against each other. The two layouts agree exactly, and they agree in all four pass counts rather than in the two shown here.

## Measured, and reported

The engine does not leave that for a reader to notice. It compares the two constant rows as data and reports them as equal, and it attaches a note to any answer at either layout: "the 45 and 90 degree constants carried here are identical, so the layout choice changes nothing between those two. 30 degrees does move the bundle."

An input that does nothing is worse than an absent one when it looks live, because a reviewer reads a filled box as a decision. The gate on this engine asserts the equality, so the two rows cannot drift apart and quietly start looking meaningful.

Notice which way that assertion points. It does not claim the two layouts ought to be the same in reality. It claims the module carries the same numbers for them, which is a fact about this file, and it forces anyone who obtains a real source for either layout to break a test on the way in.

## The other pair is live

The first layout against the second does move the answer. At the same area and pass count the bundle runs 19.000124 against 20.698071 inches, a ratio of 1.089365 taking the second over the first. So the input is not decorative in general, and the note names the pair it is inert between rather than dismissing the box.

## The shell, and the clearance added once

The shell diameter is the bundle plus a clearance, and the clearance is an input because it depends on the head type. At the studio clearance of 2.500000 inches the shell is 21.500124 inches, and at no clearance it is 19.000124, which is the bundle itself. The difference is 2.500000 inches, which is the clearance, once.

## Where the published column comes from

The eight layout and pass pairs are held for literature, with no established source. What the published bundle figures give instead is route independence: the oracle bisects on the diameter until the geometry form balances rather than raising a ratio to a reciprocal power. Inverting an exponent is one of the easiest errors to make in this expression and one of the hardest to see in an answer, and a bisection cannot make it.

## Exercise

Record the eight rows above with the area and tube count they share. State what the engine reports about the two identical layouts and quote the note it attaches. Then record the live pair with its ratio, and say what the clearance figures show about how many times the clearance is added.
