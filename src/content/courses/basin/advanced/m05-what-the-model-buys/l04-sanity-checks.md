# Sanity checks

The forward model composes every stage of three tiers, so its checklist inherits all of theirs and adds the compositions. This lesson is the Expert tier's check discipline: what to verify before trusting a run, ordered from free to expensive.

## The closed forms

Free checks first, as always. The potential: $2720 \times 345.33834344581027 \times 0.04 \times 0.5 = 18786.405883452077$, four inputs and a calculator, catching wrong lithology constants, wrong stack, wrong richness. The generation identity: final mass equals potential times final TR exactly, $18786.405883452077 \times 0.7423743797385286 = 13946.54641524398$. The expulsion identity: final expelled equals the 11 Ma generation minus the squeezed cap, $13907.011498614682 - 3858.026119789524 = 10048.985378825158$. Three multiplications and a subtraction verify half the graded surface.

## The inherited anchors

The Professional tier's checks run unchanged inside this tier. The two reflectance anchors bound every Ro the model ever reports: nothing below 0.20189651799465538, nothing above 4.687971627022019, and the fixture's 1.6718288798752388 sits properly between. Monotonicity: every layer's Ro series never decreases, every TR series never decreases, expelled mass never decreases. The Associate tier's checks bound the geometry: solid thicknesses invariant across all 150 steps, present-day depths reproducing the input stack exactly, and any single layer's decompaction verifiable by the analytic integral.

## The composition checks

New at this tier, checks that only exist because stages feed each other. Temperature consistency: the final-step profile should agree with a steady solve of the final geometry, since the ending is quiet; 149.76037539670858 passes. Series shape: temperature spikes at each deposition age and relaxes after, in the correct direction per event, up at 80 Ma, down at 120 and at the removal. Cap arithmetic: the cap series recomputes from the burial series by the formula at every age you care to test. And the two-run discipline: the no-event run must differ from the reference run in nothing before 20 Ma beyond numerical whisper, because the phantom does not exist yet; a difference appearing earlier means the runs differ in more than the event, and the signature is contaminated.

## The convergence and oracle backstops

When the machinery itself is in doubt, two expensive checks close the case. Convergence: halve the time step, or double the thermal cell resolution, and confirm graded values move well inside tolerance. Oracle: the independent Python implementation reproduces the fixture to about 1e-9 on kinetics and 1e-4 m on geometry, and the engine's committed goldens are the standing record of that agreement. You will rarely rerun these yourself; knowing they exist, and what agreement they demonstrated, is what lets the cheaper checks above carry daily weight.

## Worked example

A modified run reports final expelled mass of 10230 kg/m2 with final TR unchanged at 0.7423743797385286. Diagnose with the checklist. Generation identity: unchanged TR and potential give unchanged generation, 13946.54641524398. Expulsion identity: expelled rose 181 without generation moving, so the cap history must differ, smaller cap at the binding moment or a different binding moment. Suspects, in register order: retention constants, rebound convention, phantom geometry. Check the 11 Ma cap first: if it is not 3858.026119789524, the geometry or the cap constants moved, and the one-line identity has localised a 150-step model's discrepancy to a single factor at a single date.

## Exercise

List the three closed-form identities with their values. Then answer in one sentence: why does the two-run discipline require the runs to be identical before 20 Ma, and what does an earlier difference prove?

As a self check: potential $18786.405883452077$; generation $18786.405883452077 \times 0.7423743797385286 = 13946.54641524398$; expulsion $13907.011498614682 - 3858.026119789524 = 10048.985378825158$. Before 20 Ma the phantom does not yet exist, so a with-event and a without-event run share every input governing those steps; any earlier divergence proves the runs differ in something besides the event, invalidating the difference as a measurement of the event's effect.
