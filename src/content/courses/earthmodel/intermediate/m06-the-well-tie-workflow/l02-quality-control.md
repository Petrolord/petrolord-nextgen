# Quality control

A tie workflow needs its own QC, distinct from the geology it evaluates: checks that the MACHINERY is right, run before any conclusion about surfaces or picks is allowed. This lesson collects the checks this course has used into a deliberate kit.

{{panel:em-tie-explorer}}

## The vertical controls

The three vertical wells are the kit's centrepiece, as module three argued. Their ties must be exact small numbers reachable by hand: minus 2, plus 2, plus 5; plus 1, plus 7, plus 37; plus 0.5, plus 6, plus 36. Any float dust on these is a machinery defect, because nothing in their arithmetic leaves integers and halves. Run them first, every time the machinery or the model changes.

## Internal consistency checks

The zone ledger identity is a QC tool as much as a geological one: for each vertical well, BaseB residual minus TopB residual must equal the well's logged zone B minus the model's zone B at the well, exactly. It cross-checks four numbers per well that were computed through different code paths, surfaces sampled at the same point for two different tops against two pick depths. The identity holding at machine precision on W1, W3 and W4 certifies the sampling and differencing plumbing jointly.

For the deviated well, the decompositions of module five serve the same role: the swing between assumed-vertical and true residuals must equal the depth channel plus the surface relief channel, per pick. Three more closed loops.

## Order-of-magnitude tripwires

Cheap bounds catch gross errors before subtle analysis starts. Lateral reach must not exceed MD: a trajectory whose reach beats its hole length has broken trigonometry. TVDSS at a pick must be less than MD minus KB for any deviated hole and equal for a vertical one. The ratio of rock crossed to hole length in a hold must be the cosine of the inclination. Each tripwire is one comparison, and each catches a class of bug that summary statistics absorb silently.

## The panel as QC instrument

The section drawing earns its place in the kit: sign errors, swapped surfaces and mislocated landings are all VISIBLE as geometry before they are legible as numbers. A pick dot floating above its surface with a positive-labelled residual is a sign convention broken; a white path bending west when the survey says east is an azimuth error; surfaces crossing each other is a clamp not applied. Thirty seconds of looking at each well in the panel is the cheapest audit this workflow has.

## What this kit does not check

Nothing here validates the INPUTS: a wrong KB entered consistently, a survey tool with a systematic inclination bias, a pick miscorrelated in every well the same way, all pass every check above. Machinery QC bounds what the tie table's numbers MEAN, not whether the world agrees with the inputs. The defence against input error is redundancy across wells and sources, which is exactly why the fixture carries four wells and why the eastern BaseB story was credible: two independent wells, one signal.

## Worked example

Apply the kit to a fault someone actually made in building this course: a draft of the panel computed the vertical-assumption trajectory with an empty survey list, which the engine treats as a single station at MD 0, so every pick clamped to the wellhead at TVDSS minus KB. Which checks catch it? The tripwires do: every pick's TVDSS read as minus 30, above sea level, failing the TVDSS bound instantly, and every residual leapt to over 1500 m. The vertical controls also catch it, since W1's ties stopped being minus 2, plus 2, plus 5. Two independent alarms for one bug is what a good kit feels like; the fix was to model the assumed-vertical hole as one deep station rather than no stations.

## Exercise

Design one additional tripwire for the CONTROL POINTS specifically, of the same cheap comparison form as the ones above, and state which failure mode of module five it would catch and which it provably cannot.
