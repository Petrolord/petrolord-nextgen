# The superheat factor the engine types

{{panel:fc-sizing-explorer}}

Two corrections sit on the steam route and they could not be less alike. One is a closed form the engine evaluates. The other is a published table that somebody reads and types in, written KSH, and this lesson is about telling them apart.

## The same case, two superheat factors

TEBIDABA is a saturated case, so its stated factor is 1.000000 and it changes nothing. Run the same case as a superheated service instead, with a factor of 0.830000 typed in, and the required area becomes 1.144559 in2 against the 0.949984 in2 the saturated case needed.

A factor below one makes the required area larger. Superheated steam at the same pressure is less dense than saturated steam, so the same hole passes less mass, and the valve has to grow. That direction is worth holding onto, because the factor arrives as a number with no explanation attached to it and a typed number is easy to enter the wrong way round.

Do not divide the two areas. The digest prints no ratio between them, so the size of the effect is not a figure this course carries.

## The published set makes the same point twice

Two of the published steam rows are the same flow at the same relieving pressure, differing only in the typed factor.

| golden flow lb/hr | golden p1 psia | golden KSH | published area in2 | engine area in2 | relative difference |
| --- | --- | --- | --- | --- | --- |
| 60000.0000 | 314.700000 | 1.000000 | 3.796612 | 3.797018 | 1.071e-4 |
| 60000.0000 | 314.700000 | 0.830000 | 4.574231 | 4.574721 | 1.071e-4 |

Both rows sit below the Napier threshold, so the other correction is exactly 1.000000 on both, and the only thing moving between them is the typed factor. That is a well built pair of published cases, because it isolates one input and leaves everything else alone. A pair that moved two things at once could confirm an answer without testing either of them.

## Typed, and what that costs

KSH is a published table. This package cannot derive a single entry in it, and the validation oracle cannot check it, because there is nothing in the package to check it against. It is a typed input with its reference named, and that is the whole of its provenance in this course.

So the honest statement about a superheated steam case is in two parts. The area is computed from a published equation whose leading constant and whose Napier fit are both checked against independent statements of the same method. The superheat factor in front of that area was copied off a table by a person. If the area is wrong, those are two quite different investigations.

Nothing graded in this course rests on the value of KSH. It appears here as a stated limit of the method, which is the same treatment the other charted factors get: Kb on the gas route, Kw on the liquid route and the orifice table in the next module.

## Exercise

Name the two corrections on the steam route and say which one the engine computes. Then write down the two published rows above and state, in one sentence, what those two rows together prove and what they cannot prove.
