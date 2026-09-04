# A refusal that names another limit

The sentence the guard prints describes a limit the guard does not enforce, and the gap between the two is where an overstatement lives.

{{panel:pd-candidate-explorer}}

## Two limits in one message

The refusal says "Real treatments reach about -3 to -5 on acid and -5 to -6 on a fracture; ask for less." The guard behind that sentence sits at the pole, which on the teaching geometry of ELELENWO-4 is a skin of -7.361728083308. Everything from -6 down to the pole is accepted with ok = true, no warning, no note and no flag.

Price the gap on the teaching sweep. At an after-skin of -5 the multiplier is 6.292734624 and at -6.800 it is 26.457156986, a factor of 4.204397383. Set the same overreach against the designed acid job on that well, 7.5 down to -2.2, and the factor is 9.189015534.

## The inverse refuses nothing at all

`skinFromPiRatio` is the natural way to audit a vendor's claim: a fold increase goes in, the skin that claim implies comes out. It has no ok flag, no warning list and no plausibility check of any kind. For bad geometry it returns a bare NaN, and so do `pssDenominator` and `minimumSkin`, while `skinPiMultiplier` returns an object with ok = false and a sentence. Two failure contracts in one module, and the bare one cannot be told from an answer without a finite check at the call site. On the published geometry it returns NaN for a wellbore radius larger than the drainage radius, for a negative claimed ratio, and for a claimed ratio of zero, saying nothing in any of the three.

## Auditing a claim on the teaching geometry

The floor is -7.361728083 on every row, and the module's own text puts the fracture limit at -6.

| Claimed uplift | Implied post-job skin |
| --- | --- |
| 2.000 | -3.680864042 |
| 4.000 | -5.521296062 |
| 6.000 | -6.134773403 |
| 8.500 | -6.495642426 |
| 12.000 | -6.748250743 |

Somewhere between a claimed doubling and a claimed sixfold the implied skin passes the deepest number the module calls achievable, and the same shape of answer comes back on both sides of that crossing. On the published geometry, floor -7.900724584041, a derived run puts a claimed uplift of 15.000 times at an implied skin of -7.374009612, which is 0.526714972 above the floor, returned with no flag, no warning and no note.

## The mistake

Auditing a claim by asking whether a number came back. It always comes back. The audit is a comparison the caller writes: implied skin against the floor for the arithmetic, and against -3 to -5 for acid or -5 to -6 for a fracture for the physics. A claim of 12.000 times passes the first and fails the second, and only the first is in the code.

## Exercise

Take a claimed uplift of 8.500 times on the teaching geometry. Write its implied post-job skin and the verdict the module's own refusal text implies. Then write the two checks a caller needs, and say which one the module already does.
