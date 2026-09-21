# A published case that cannot discriminate

A published case is only worth what it can tell apart. That sounds like a platitude until you meet a case that can tell nothing apart, and this engine has two, declared in the open.

{{panel:fc-blowdown-explorer}}

## The test that separates a validation from a pin

A route whose oracle is an INDEPENDENT DERIVATION goes red when the engine moves, because two derivations disagree. A route whose oracle is a TRANSCRIPTION of the engine cannot go red, because there is only one derivation in the room and both sides of the comparison are reading it.

| route | the oracle route | independent |
| --- | --- | --- |
| gas, critical | the isentropic nozzle mass flux from R, M, T and P in absolute SI | yes |
| the critical ratio | the argmax of that flux over the throat ratio, by golden-section search | yes |
| liquid area | the published SI form of the same equation | yes |
| the Kv fit | nothing: SHARED with the engine on purpose | NO, and it is named as held |
| wetted area, both orientations | polyline summation round the real circle with Richardson extrapolation | yes |
| the drag correlation | nothing: SHARED with the engine on purpose | NO, and it is named as held |
| the knockout drum | Simpson quadrature of the segment integral, and a transit time against a fall time, in SI | yes |
| the blowdown march | the same march solved IN CLOSED FORM in SI | yes |

## The two, and the sentence they get

The Kv viscosity fit and the sphere-drag correlation are shared between the engine and its oracle on purpose, because no route in this package can derive either. Move one of them in both files and every published case still passes.

Read that again, because it is the whole lesson. Every case green is the reported result, and the green IS the finding rather than a reassurance. A gate that stays green while the thing it guards has changed is not a gate, and the only honest response is to say so where a reader will look. The course says it in plain words and calls it the honest statement of the limit.

Nothing graded in this course rests on either of them. That is the practical half of the same decision: a figure nothing can check is a figure nobody should be marked right or wrong about, and the way to respect that is to teach it as a stated limit and then keep it out of every answer key.

## What such a case can still do

It is a tripwire. Two copies have to change together, so an accidental edit to one goes red. It cannot catch a deliberate change to both, or a value that was wrong when first written down.

It can also discriminate ENGINE-SIDE DRIFT even when it cannot discriminate the constant. The published set places a liquid case at a Reynolds number of 92.428866, where the inverse-three-halves term of the Kv fit is still worth something, so a change in how the engine uses the fit shows up there even though a change to the fit itself would not.

## The other kind of empty case

A case can also be present and unable to discriminate its own constant, which is a different fault from a missing case. The test is arithmetic: move the constant by a realistic amount and ask whether the answer moves by more than the tolerance the case is checked at.

This set answers that deliberately. The Napier fit is placed at 2014.700000 and 3100.000000 and 1550.000000 psia. The march is placed at its hardest geometries. The drum holdup is swept at six distinct holdups on one drum. The published set carries 49 rows across 11 blocks.

## Exercise

State the difference between an oracle that is an independent derivation and one that is a transcription. Name the two shared routes and write out what happens when their constant is moved in both files, and say why that outcome is the finding. Then record the Reynolds number the published set places its liquid case at, say what that case can still catch, and name the three Napier pressures.
