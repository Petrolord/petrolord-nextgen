# The story so far

This tier is one habit applied twice: read the margin under a verdict, and check a residual against something that did not produce it.

## A stage is a comparison, not an event

Unloading is a sequence, and each stage compares the casing pressure at that stage with the closing pressure of every valve above the one taking over. The published `midDecrementKnifeEdge` string is 7 valves to 9000.000000000 ft, stop reason `targetDepth`, spaced on 26.75 psi per valve, and it raises four warnings, all multipointing, at stages 2, 3, 4 and 5.

The warning is a boolean. The comparison behind it is a number, and only the number is worth reporting.

## The most consequential boolean sits on fractions of a psi

The stage 5 verdict on valve 4 rests on a surface margin of 0.124769727 psi computed by the engine, and on 0.149791635 psi at valve depth by the published closing rule. The system runs at 1164.7 psia at surface and 1279.335785 psia at valve 4.

Walk the decrement and the flip appears between 26.80 and 26.90 psi per valve. Under a tenth of a psi per valve changes whether the string injects at one depth or two.

## Sensitivity comes in two shapes

Continuous axes move the margin smoothly: 0.77 in2 of bellows gives 0.124769727 psi and 0.90 in2 gives -3.758264661 psi, with the verdict following the sign.

Stepped axes do nothing and then everything. The design gas rate reaches the verdict only through port selection, so it holds 0.124769727 psi at 400, 600, 800, 1000, 1200 and 1400 Mscf/d and reads 15.249903355 psi at 1600 Mscf/d with an extra multipointing stage. A sweep has to be resolved against the mechanism, not against the axis.

## A residual can be a witness or an echo

`deepestInjectionPoint` finds its crossing by chord and reads its injection pressure by chord, so both sides of the residual come off the same two straight lines. On the published case it reports 4.67696e-3 psi where the true residual is 1.58211e-1 psi, 33.83 times larger. On a coarse tabulation of a curved teaching traverse, a teaching construct rather than a published case, it reports 1.5907e-2 psi against a true 1.0789e+1 psi, 678.26 times larger, with the depth 60.420814470 ft shallow.

A small residual proves the two chords agree with each other. Nothing else.

## Decisions and artefacts

The decrement is a decision. The transfer differential is a decision. A depth of 7739.815725361 ft on a traverse tabulated at 1000.0 ft is partly an artefact of the row spacing, and a clean warning list is an artefact of a comparison nobody printed.

Telling the two apart is the whole skill.

## Exercise

Write the two numbers this tier says must be reported beside every gas lift verdict, and say where each comes from.

Then name one output of a design run that is a decision and one that is an artefact, and give the number that distinguishes them.
