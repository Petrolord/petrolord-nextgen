# The isochore panel map

The panel below grids both Ekene surfaces on one frame, subtracts them, and reports everything this tier measures. This lesson is a map of it.

{{panel:mp-isochore-explorer}}

## The two controls

**Surface** switches what is displayed and what the tiles describe. Three choices: TOP_SAND, BASE_SAND and the isochore. The first is the Associate tier's map, unchanged, and it is there so that the three can be compared without leaving the page.

**Cell size** offers 50, 100 and 200 m. The capstone uses 100 m. The other two are there because module 3 needs them, and because a reading that changes when the cell size changes is a reading about the settings rather than about the rock.

Both controls affect everything below them. Change either and re-read every tile before recording anything.

## The map

Grid nodes shaded by value, contours at an interval the panel chooses, the six wells posted with their own measured values, and prospect P-1 marked at (1600, 1600).

Two features are worth looking for immediately.

The **blank margin**. Nodes further than 800 m from any control are not coloured, because they are dead. That margin is identical on all three surfaces, which is not a coincidence and is the subject of module 2.

The **well postings**. On the depth surfaces the posted number is the pick. On the isochore it is the well's measured thickness, base minus top, computed from its own two picks with no gridding involved. Comparing the posting against the shading around it is the fastest quality check available on a thickness map.

## The tiles

Twelve readings.

The first four describe the **frame and the mask**, and change only with the cell size.

- **Surface** and **cell size**, repeated so a screenshot carries its own conditions.
- **Frame**, as $n_x \times n_y$ and the total node count.
- **Live nodes**, the count that survived the 800 m mask. At the capstone cell this is 201 on all three surfaces.

The next five are the **map statistics** of whatever surface is displayed.

- **Minimum** and **maximum**. On the isochore these are the thinnest and thickest mapped values, 25 m and 35.897705078125 m at the capstone settings. Both are capstone fields.
- **Map mean**, the average over the live nodes. On the isochore, 32.25429068038713 m, another capstone field.
- **Value at P-1**, sampled by bilinear interpolation at (1600, 1600). On the isochore, 34.050048828125 m, another capstone field.
- **Contour interval**, chosen by the panel to give roughly ten intervals across the range. It is 10 m on TOP_SAND and 2 m on the isochore, and the reason it differs is not that the isochore is more precise.

The last three exist for **module 4**, and they are the ones most learners walk past.

- **Mean of the six well values**, computed from the wells alone with no map involved. On the isochore, 31.166666666666668 m, the sixth capstone field.
- **Map mean minus well mean**, which on the isochore reads $+1.0876$ m.
- **Live nodes above the well mean**, which reads 146 of 201.

Those three together are the whole of module 4, and the fact that the last one is not close to half of 201 is the reason the module exists.

## A first pass to run now

Set the cell size to 100 m and step the surface control through all three.

On TOP_SAND, confirm the crest of 1539.72 m and the depth at P-1 of 1542.62 m against the Associate tier. On BASE_SAND, note that its range is 1570 to 1615 m, a spread of 45 m against the top's 50 m. Then switch to the isochore and read the six capstone fields.

Finally, look at the live node count on all three. It is 201 every time.

## Exercise

With the cell size at 100 m, record the minimum, maximum and mean of all three surfaces. Then check whether the isochore's minimum equals the base minimum minus the top minimum, and explain the result.

As a self-check: TOP_SAND runs 1539.7181 to 1590 with a mean of 1550.2668, BASE_SAND runs 1570 to 1615 with a mean of 1582.5211, and the isochore runs 25 to 35.8977 with a mean of 32.2543. The isochore minimum is not the difference of the two minima, which would be $1570 - 1539.7181 = 30.28$ m, because the base minimum and the top minimum occur at different nodes; the thinnest point of the isochore is wherever the two surfaces are closest together, which is Ekene-4's node in the northeast, not wherever either surface happens to be shallowest. The means do subtract exactly, $1582.5211 - 1550.2668 = 32.2543$, because a mean is a linear operation over the same set of live nodes.
