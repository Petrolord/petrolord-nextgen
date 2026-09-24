# The seed and the shuffle

{{panel:ml-fit-explorer}}

A group split is repeatable because every step is stated. The engine sorts the well names, shuffles them with one seeded random stream, and holds out the first few of the shuffled order. Change nothing and you get the same wells anywhere. Here is the whole path for the nine sonic wells at the seed 5.

| i | u | j = floor(u x (i + 1)) | swap |
| --- | --- | --- | --- |
| 8 | 0.689775 | 6 | EKENE-9 with EKENE-7 |
| 7 | 0.772743 | 6 | EKENE-8 with EKENE-9 |
| 6 | 0.219763 | 1 | EKENE-8 with EKENE-10 |
| 5 | 0.623179 | 3 | EKENE-5 with EKENE-3 |
| 4 | 0.085137 | 0 | EKENE-4 with EKENE-1 |
| 3 | 0.592165 | 2 | EKENE-5 with EKENE-2 |
| 2 | 0.720102 | 2 | EKENE-5 with EKENE-5 |
| 1 | 0.458104 | 0 | EKENE-8 with EKENE-4 |

## First, the names are sorted

Before any shuffle the engine sorts the names. Names that are strings sort by UTF-16 code unit, character by character, so the nine sonic wells sort as EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-7, EKENE-8, EKENE-9. EKENE-10 comes before EKENE-2 because the character 1 comes before the character 2. The engine does not read the number inside a name. Every list of wells it returns follows the same order, which is why this course writes EKENE-10 second.

Names that are all numbers sort ascending. A mix of the two is refused:

> groups[1] must be the same type as groups[0]: all strings or all numbers

## Then, one shuffle from the end

The shuffle is Fisher-Yates from the end, with one mulberry32 stream seeded by `seed`. For i from 8 down to 1, it draws u, takes j = floor(u x (i + 1)), and swaps the names at positions i and j. The table above is every draw for the seed 5. At i = 2 the draw lands on j = 2, and a name swaps with itself.

The result is the shuffled order EKENE-8, EKENE-4, EKENE-5, EKENE-2, EKENE-1, EKENE-3, EKENE-10, EKENE-9, EKENE-7, which the engine returns as `order`. The first three are the test wells of the teaching split.

## The seed

The seed must be a whole number, and the engine refuses one outside its range:

> seed must be a whole number from 0 to 4294967295

A seed fixes the draws, and the draws fix the order. Change the seed and the whole order changes, so a split is quoted with its seed and its fraction every time.

## The test size, and a whole-number rule

The test size is ceil(testFraction x count), here ceil(0.3 x 9) = 3 wells. Float arithmetic can land a hair off a whole number. In float, 0.28 x 25 comes out as 7 plus 8.88e-16, and a plain ceiling would then hold out 8. So the engine takes a product within 1.00e-9 of a whole number as that number before the ceiling, and holds out 7. Its basis states the rule:

> ceil(testFraction x count), a product within 1e-9 of a whole number taken as that number

The same rule serves the random-row split, which counts rows where this one counts wells.

## Exercise

Open the fit explorer on the split view at the test fraction 0.3 and the seed 5. Copy the shuffled order it prints and check it against the order above. Then, on paper, start from the sorted list and apply the eight swaps of the table in order, from i = 8 down to 1; confirm you arrive at the same order. Finally set the seed to 6, read the new shuffled order, and check that its first three wells match the test wells the split view names.
