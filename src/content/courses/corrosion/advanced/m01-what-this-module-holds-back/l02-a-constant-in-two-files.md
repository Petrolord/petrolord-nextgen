# A constant that lives in two files

A validation suite compares two things and reports whether they agree. The quiet assumption underneath that is that the two were built independently, and a constant defeats it the moment it appears in both. If the engine holds a coefficient and the oracle holds the same coefficient, moving it in both places moves both answers together and the comparison still reports agreement. The suite is doing what it was written to do, and it is telling you nothing about the number.

State the arithmetic flatly, because it is easy to nod at and hard to act on. A constant that lives in two files cannot be validated by comparing those two files. No tolerance saves it, because tolerance measures the gap between two answers and that gap is genuinely zero. A tighter comparison makes a shared constant more invisible.

## The answer here

This engine and its oracle are checked against a third location and a fourth. Thirty constants are pinned. Each one is measured out of the engine's behaviour by asking a question whose answer is that constant and nothing else, and the measurement is then compared against a literal typed in the course's build script, which is a file neither the engine nor the oracle reads. The golden then carries its own `heldConstants` block, which is a fourth copy, and 28 of the golden's 28 held constants are re-measured against the engine on every rebuild. Any two of the four agreeing is no longer enough to pass.

A paired battery is what settled the design. Fifteen of seventeen constants moved in the engine and in the oracle at once leave a suite that compares only those two entirely green. With the pins in place, moving a constant in both files fails the pin before any measurement has run.

## Measured, never copied

Look at how the constants are reached. The pH reference of 4.000000000000 is found by bisecting the pH at which the engine stops returning a factor and starts refusing. The friction branch switch at Reynolds 4000.000000 is bisected on the branch name the engine returns. The film stripping threshold of 100.000000000000 Pa is the shear read at the bisected velocity where the risk word turns high. The bar to psia factor of 14.503773800722 is the psia value the engine reports for a partial pressure of exactly 1 bar. None of these is read out of a source line. Each is a question put to the running code.

That is why the scale constant A comes out at 2399.999999999998 against a typed 2400.000000000000. The gap is floating point arithmetic on a slope taken between two temperatures, and it is reported rather than rounded away, because a measurement tidied into agreement with its own expectation has stopped being a measurement.

A pin is not a validation. It is a comparison against a third copy, and it proves only that nobody moved the number quietly. Where the number came from is still held.

## Exercise

Take three held constants from the pin table and write down, for each, the question the course asked the engine and why the answer is that constant alone. Then record the measured value and the typed literal side by side and say what a disagreement between those two columns would mean, against what their agreement proves.
