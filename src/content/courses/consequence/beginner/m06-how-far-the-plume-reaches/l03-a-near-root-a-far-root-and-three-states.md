# A near root, a far root and three states

{{panel:cq-release}}

From a ground level release the centreline concentration only falls with distance, so a target is met once. From a stack it is different. At ground level the concentration starts near nothing beneath the plume, rises as the plume widens down to the ground, peaks, and then falls. A target below the peak is met twice: once on the way up and once on the way down. The engine returns both, as a near root and a far root.

## From a 25 m stack

UBIT from a stack of 25 m, receptor at ground level, class D:

| target mg/m3, stated | state | peak mg/m3 | peak distance m | near distance m | far distance m |
| --- | --- | --- | --- | --- | --- |
| 500 | NOT_REACHED | 153.887548 | 347.557177 | null | null |
| 100 | REACHED | 153.887548 | 347.557177 | 221.924194 | 656.636313 |
| 20 | REACHED | 153.887548 | 347.557177 | 150.672013 | 2151.227430 |
| 5000 | NOT_REACHED | 153.887548 | 347.557177 | null | null |

The peak is the same in every row, 153.887548 mg/m3 at 347.557177 m, because the peak is a property of the plume alone. For 100 mg/m3 the ground level concentration exceeds the target between 221.924194 m and 656.636313 m. Closer than the near root the plume is still overhead; beyond the far root it has diluted below the target.

## Reading the band

A near root and a far root describe a band on the ground. For a study the far root is usually the figure that matters, since it is the furthest point at ground level where the target is exceeded. The near root matters too. Ground close to the stack is below the target, and that is where people may be working. Both belong in the note.

A lower target widens the band on both sides: for 20 mg/m3 it runs from 150.672013 m to 2151.227430 m.

## When the target is not reached

For 500 mg/m3 the state is NOT_REACHED, and both distances are null. The peak of 153.887548 mg/m3 is below the target, so nowhere at ground level does the plume reach it. The engine still returns the peak and where it falls, so the reader can see by how much the target was missed. The same holds for 5000 mg/m3.

NOT_REACHED is a result. It says the stack keeps the ground level concentration below the target everywhere downwind, in this class and this wind. A different class or a lower wind might change that, and the study should check.

## Beyond the search

The third state appears when the plume is still above the target where the search stops. Class F to 20 mg/m3, with the search capped at 2000 m, returns BEYOND_SEARCH_RANGE with a far distance of null. The plume has not yet fallen to the target at the cap, and the engine says so instead of returning the cap as if it were the answer. For scale, the uncapped search from a ground level release in class F meets 20 mg/m3 at 9384.252298 m, far past such a cap.

## Exercise

On the plume view, set the release height to 25 m, the receptor height to 0 and class D, and set the target to 100 mg/m3. Read the state, the peak and both roots against the table. Then raise the target to 500 mg/m3 and read the state again. Write one sentence explaining why the second result returns a peak and no distances, and what a study should record for it.
