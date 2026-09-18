# Course by course, bottom to top

A shell is built in courses, and a course is a ring of plate. The engine walks them from the bottom up and returns a row for each one, and reading that table properly is most of what shell design asks of an engineer.

## The five courses of this tank

| course | bottom, ft | top, ft | head, ft | t design, in | t test, in | required, in | governed by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.000000 | 8.000000 | 34.600000 | 0.214385 | 0.218926 | 0.218926 | hydrostatic test |
| 2 | 8.000000 | 16.000000 | 26.600000 | 0.163341 | 0.166801 | 0.187500 | minimum plate thickness |
| 3 | 16.000000 | 24.000000 | 18.600000 | 0.112297 | 0.114676 | 0.187500 | minimum plate thickness |
| 4 | 24.000000 | 32.000000 | 10.600000 | 0.061253 | 0.062550 | 0.187500 | minimum plate thickness |
| 5 | 32.000000 | 36.000000 | 2.600000 | 0.010209 | 0.010425 | 0.187500 | minimum plate thickness |

The engine returns five courses on this tank. Its rule for that count is one course per whole or part course height inside the shell height, taken as the ceiling of the shell height divided by the course height, which is why the top course is shorter than the four below it and still counts as a course.

Of those five, one is governed by the hydrostatic test and four are governed by the stated minimum plate thickness. The thickest course is course 1, at a required thickness of 0.218926 in, governed by the hydrostatic test. The last course the water test governs is course 1 and the first course the minimum plate governs is course 2, so the changeover on this tank happens once and never comes back.

## The head column is the engine of the table

Every other column follows the head. The head on course 1 is 34.600000 ft and on course 5 it is 2.600000 ft, and both thickness columns fall as it falls. The heads are not the course heights: they are measured from the design liquid level down to a point in the course, which is why the bottom course carries a head of 34.600000 ft while its own top is at 8.000000 ft.

## Reading the table as a build sequence

The table is also a materials list. Each row is a ring of plate somebody has to order, roll and weld, and the required column is the one that gets ordered. On this tank that means one course at 0.218926 in and four at 0.187500 in, which is a far simpler order than the design column alone would suggest.

The computed thicknesses on the upper courses are real numbers with no purchasing consequence. Course 5 needs 0.010209 in at the design condition, and nobody builds a tank out of plate that thin.

## The bottom course is always the thickest

The engine returns that as a property of the method rather than as a result, and it sets its own flag to true for it. The argument is short. The head falls as the courses go up, both thickness relations are linear in the head, and the stated minimum is a floor, so the required thickness cannot increase upward.

That is worth more than it looks. A property the engine asserts about its own method is checkable in a way a single result is not. A course table with a thicker plate above a thinner one is a broken calculation rather than a debatable one.

## Exercise

Read the course table in digest SECTION 26 and say which course is the first one whose required thickness is above both of its own computed thicknesses. Say what that tells you about which candidate governs from there upward.
