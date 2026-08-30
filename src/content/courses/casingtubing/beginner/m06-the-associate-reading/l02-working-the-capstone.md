# Working the capstone

Six numbers on a pipe and a grade this course has not run.

{{panel:ct-rating-explorer}}

## What you are given

A 13-3/8 inch 68 lb/ft casing joint at grade C-90, on a SHORT THREAD connection.

Three of those five facts are not ones the lessons used. C-90 is not one of the three grades the goldens publish. The short thread connection is not one of the two the string in the next tier uses. And the derating fraction you are asked for is 0.55, not the 0.4 every table in module 4 was built on.

## The six

1. The **burst rating**, in pascals.
2. The **pipe body yield**, in newtons.
3. The **joint strength**, in newtons, on that short thread connection.
4. The **collapse rating** with no axial load, in pascals.
5. The **collapse rating at 55 percent of yield in tension**, in pascals.
6. The **plastic-to-transition D over t boundary** at that grade, dimensionless.

## The order to do them in

Field 6 first, even though it is last on the list. Once you have the three boundaries at C-90 and the ratio of this pipe, you know which regime it is in, and that tells you in advance roughly how much fields 4 and 5 should differ by.

Then fields 1, 2 and 3, which are the easy ones and share a single yield lookup.

Then 4 and 5.

## The traps

**Field 1 is not Barlow.** It is 0.875 times Barlow. Leave the factor out and you are 14.3 percent high.

**Field 3 is not the pipe body yield.** Short thread is 0.75, not 0.85 and not 1.0. Reading the wrong row of the connection table costs you the field with no other symptom.

**Fields 4 and 5 are in PASCALS.** The collapse formulas work internally in psi, and a number that came out of the polynomial without being converted back will be about 6895 times too small. That is not a tolerance error, it is a different quantity, but it is the single easiest mistake to make here.

**Field 6 is dimensionless.** It is a ratio of two lengths, so it is a number around twenty, not a pressure and not a percentage.

## Free checks

Field 2 divided by field 1 should be the steel area divided by the geometry factor, and it should not depend on the grade at all. Compute it at L-80 as well and confirm you get the same ratio.

Field 3 is exactly three quarters of field 2. If it is not, you used the wrong connection.

Field 5 is smaller than field 4. If they are equal, check the regime: on this pipe, at this grade, they should NOT be equal, and equality would mean you had reached the elastic regime, which this pipe does not.

## A last check on the size of things

This pipe is thicker relative to its diameter than the 20 inch rows and thinner than the 9-5/8 inch ones, so its collapse rating should land between those two families. If it comes out above the 9-5/8 inch numbers or below the 20 inch ones, something is wrong before the tolerance is even considered.

## Exercise

Do the six in the panel. Then change nothing except the grade, run L-80, and write down how much of each of the six moved.

Two of them will have moved in exact proportion, one will not have moved at all, and three will have moved by amounts you should be able to explain.
