# The verdict flips

One line, one U, one seabed, one laboratory boundary. Safe or hydrating depends on whether a damping factor was applied.

{{panel:pd-hydrate-explorer}}

## The boundary is somebody else's number

Neither engine computes where hydrates form. The `flowlineThermal` header says hydrate and wax boundaries "are fluid properties, they come from a lab or a compositional flash, and the consumer supplies them". Every verdict here is a comparison against an input.

TEACHING LINE AKASO SPUR is a construct this course designed for itself, not a published case. Its boundary is a teaching input: 71.00 degF flowing, 78.00 degF once the line packs up.

## Three arrivals, one line

Same U of 0.452972856617 Btu/(hr ft2 degF), same 60000.0 ft, same 45.00 degF seabed, measured against the 71.00 degF flowing boundary.

| Arrival | degF | Margin, degF | Verdict |
| --- | --- | --- | --- |
| Heat loss only | 89.316029952695 | 18.3160299527 | outside |
| Heat loss plus the damped term | 74.754339158867 | 3.7543391589 | outside |
| What the engine returns | 64.116029952695 | -6.8839700473 | inside |

All three profiles return `ok` true, with no note and no error. The whole distance between a line that is safe and a line that is hydrating is the 10.6383092062 degF the engine applies in excess of the correctly damped Joule-Thomson term.

The inverse agrees with the first row. To land exactly on the 71.00 degF boundary this line would need a U of 0.651078288819 Btu/(hr ft2 degF), and it has 0.452972856617, a ratio of 1.43734504.

## The margin that survives is thin

The damped arrival clears the boundary by 3.7543391589 degF. That is a real margin and it is not a comfortable one, which is the honest reading: the engine is wrong about the verdict, and the line is not far from being genuinely at risk. Reporting the correct answer here means reporting a small margin, not a clean pass.

## Two functions, opposite positions

That engine arrival is where the line sits when it stops, and the packed-up boundary of 78.00 degF is above it. Asked for the time to fall from 64.1160299527 degF to 78.00 degF against a 45.0 degF seabed, `cooldownTime` returns `ok` true, hours of -4.6959175559, no note and no error, and 25 stations that run backwards in time and warm up by 24.2422513458 degF.

Put to `uForArrivalTemp` in the same module, that pair is refused: "The fluid already enters below the target, so insulation is not the problem."

## The mistake

Reporting a verdict without reporting which way the modelling error pushes it. Every one of the three arrivals carries `ok` true, and the one the shipped engine returns is the only one of the three that fails the line.

## Exercise

Record the three arrivals and their margins against the 71.00 degF boundary.

Then say which verdict you would take into a design review, and how much margin you would be claiming when you did.
