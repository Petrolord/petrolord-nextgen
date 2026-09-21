# The maximum view factor

{{panel:cq-fire}}

A real target can face the fire at any angle. A person turns, a pipe is round, a vessel is curved. The engine does not guess the orientation; it returns the view factor of the orientation that sees the most, Fmax, and the heat flux of the solid flame uses that number. This lesson shows how Fmax is made and reads the published table the Yellow Book prints for it.

## The vector sum

The engine computes Fmax = sqrt(Fv^2 + Fh^2). The vertical and horizontal view factors behave like the two components of a vector pointing from the target toward the flame. A small surface turned to face along that vector, tipped partway between vertical and horizontal, receives the whole of it, and its view factor is the length of the vector. Fmax is therefore always at least as large as either component, and it describes the most exposed way a small target can face the fire.

## An upright flame, swept

The stated flame of radius 10 m and length 30 m, at a tilt of 0 degrees:

| distance from axis m, stated | Fv | Fh | Fmax |
| --- | --- | --- | --- |
| 15 | 0.332171054250 | 0.222949619043 | 0.400055173586 |
| 30 | 0.150735942534 | 0.071282105127 | 0.166740705537 |
| 50 | 0.069804515030 | 0.021824698965 | 0.073136774631 |
| 120 | 0.013574612722 | 0.001779114747 | 0.013690703409 |

Close to the flame Fmax sits well above Fv because Fh is large. Far away Fmax and Fv nearly coincide, because Fh has almost vanished.

## Why the heat flux uses Fmax

A consequence model asks what a person or a piece of plant could receive. Using Fmax makes the heat flux the largest the target could see whichever way it faces, and it removes an orientation the analyst would otherwise have to choose and defend. Every heat flux in this course, and every graded one, is made with Fmax, and the basis block says so.

## The table the Yellow Book prints

The Yellow Book's Table 6.A.1 prints Raj view factors for a vertical cylinder, times 1000, across a grid of X/R and L/R. The engine's validation record reproduced the table cell by cell: three hundred and three cells match to the last printed digit. Two Fmax cells do not follow from their own printed Fh and Fv:

| table | X/R | L/R | printed | computed x 1000 |
| --- | --- | --- | --- | --- |
| Fmax | 1.2 | 0.1 | 210 | 201.303914 |
| Fmax | 1.4 | 0.2 | 117 | 177.287465 |

These two cells are misprints in the published source. A reader who looks up Fmax in the printed table at those two points gets a wrong number; one who takes the vector sum of the printed Fh and Fv gets the right one.

## Twelve decimals

Fmax is a view factor, so the course quotes it at twelve decimals, as the engine prints it and as a capstone grades it. Rounding it early and then multiplying it into a heat flux can move the heat flux in the decimals a capstone reads.

## Exercise

Take the 50 m row of the upright table. Square Fv and Fh, add them and take the square root on your calculator, keeping every digit. Compare your result with the printed Fmax, 0.073136774631, and count the decimals that agree. Then do the same for the 15 m row, and state in which row Fmax sits further above Fv, and why.
