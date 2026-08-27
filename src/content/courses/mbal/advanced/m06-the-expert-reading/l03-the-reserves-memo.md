# The reserves memo

The last lesson gave you the workflow that produces the evidence. This one is about the artefact it goes into, and it exists because the artefact is what survives. Your screen does not. Your panel settings do not. Nor does the engine version you ran; module 5 showed a provenance string outliving the code it described by three months.

What survives is a document, read by two people. One books a reserve against your number this quarter. The other audits that booking in five years, when you have moved on, the code has moved on, and all that is left is what you wrote down. Write for the second reader. The first can ask questions.

A defensible material balance memo has six entries. Each is short, each is a claim with its evidence attached, and each is there because submissions get challenged there.

## One: the fluid system and the drive

Name the fluid, the surveys, the pressure range, and where the bubble point sits relative to that range. Then name the mechanisms you found live and the classification the tool gave.

The bubble point is not decoration. Above it the solution gas ratio is constant, the two phase and oil formation volume factors are the same number, and the oil expansion term is pure expansion. Below it the term changes character and so does everything downstream. An auditor who cannot tell which regime the surveys were in cannot check the rest.

## Two: the PVT provenance

For every fluid property the calculation used, state which level of the precedence chain supplied it: values carried on the survey row, a laboratory table interpolated at the survey pressure, or a correlation.

This entry is the most often skipped and the most often decisive, because a result mixing the three levels is partly a laboratory measurement and partly a published curve fit. If any term rests on a correlation, say so in the same sentence as the oil in place, not in an appendix.

## Three: the aquifer model and the geometry behind it

Not "Fetkovich". Not "Carter-Tracy". The model, every constant, where each came from, and the conventions that formed it.

For a wedge aquifer that means the two radii and the ratio between them, the thickness, the porosity, the permeability, the water viscosity, the total compressibility and the encroachment angle. It also means the bookkeeping decisions with factor sized consequences: that the angle was applied exactly once, where the encroachable volume is formed rather than where the bulk volume is quoted; that the productivity index used the pseudo steady state denominator; that the marching scheme used the midpoint pressure. Each is a place where a competent engineer can be wrong by tens of percent, and each is invisible in the answer.

Then the sentence that makes this entry an argument rather than a list: why this model suits this reservoir, from geometry and response time, written so it would still read as a reason if the fit had come out worse.

## Four: the convention used for the indices

Gross withdrawal or net withdrawal, named in the same sentence as the indices. If the two agree because no water was produced, say that too, because it tells the auditor the question was asked.

The sentence costs nothing and prevents the most avoidable dispute in the subject. On Ahmed Example 11-1 the net convention closes to 1.00000000000000 while the gross convention sums to 0.971594137029883. An auditor who sees the second with no convention stated will report a closure failure of 2.8 percent, and will be wrong.

Name the fields too if you are quoting a tool's output, because the engine field `sdi` holds the rock and connate water term the literature calls EDI.

## Five: the benchmark, and at what tolerance, measured when

State the benchmark the tool passed on the path you used, the published source with its edition and example number, the tolerance claimed, and the disagreement you measured yourself, on the version you ran, on a named date.

Copying a provenance string is not this entry. Module 5 took the longest string in the engine and found that of its six numbers, one still holds. Re running the published case converts a quotation into a measurement: on the Dake path it turns "3.53 percent as recorded in May" into "1.53159950201266 percent, measured today, on this build". State what the tier does not cover too: it is about a code path checked against somebody else's data, not about your field.

## Six: what the answer would be under a different but equally defensible choice

The entry that separates a memo from a number. For each decision that could have gone another way, give the alternative and what it costs, in barrels. The alternatives must be ones a competent peer would actually have chosen, and each must be run rather than estimated. An estimate written where a run belongs looks like evidence and is not.

## Worked example: the Dake 9.2 memo

**Fluid and drive.** Oil, eleven annual static surveys, pressure falling from 2740 to 1460 psia, all above the bubble point supplied on the case. Mechanism classified as water drive with depletion, aquifer strength strong.

**PVT provenance.** Formation volume factors, solution gas ratios and gas formation volume factors carried per row on all eleven surveys, from Dake's Table 9.3. Level one throughout. No correlation consulted, no laboratory table reached, no warnings of any kind returned.

**Aquifer.** Carter-Tracy, bounded. Wedge geometry: reservoir radius 9200 ft, radius ratio 5, thickness 100 ft, permeability 200 md, porosity 0.25, water viscosity 0.55 cp, total compressibility 0.000007 per psi, encroachment angle 140 degrees applied once. Bounded rather than infinite because the exercise states the aquifer's outer radius.

**Result and convention.** Oil in place 307.221409553720 MMSTB, cumulative influx 88.0645883139400 MMrb, fit statistic 0.999975248425736. Drive indices at the final survey 0.567843338103932 and 0.417877131928747, summing to 0.997165062762353, in the gross withdrawal convention. This history produced no water, so the net convention gives identical figures and the shortfall of 0.00283493723764727 is a residual in the influx solution rather than a denominator artefact. It is inside the tool's closure threshold of 0.05, and is reported rather than rounded to 1.00.

**Benchmark.** Carter-Tracy oil path, `benchmark_verified`, referenced against Dake 1978 Exercise 9.2 at a stated 3.53 percent recorded on 2026-05-17. Re run on this build against Dake's own 312 MMSTB: disagreement 1.53159950201266 percent. Provenance not refreshed since the recorded date. The tier is a statement about the code path, not about this field.

**Alternatives.** Ignoring the aquifer gives 532.588241588393 MMSTB, 225.366832034673 MMSTB higher, at a fit statistic of 0.999317934436751 and with no warnings. Using the infinite acting solution gives 156.177551848366 MMSTB with an influx of 148.248060002236 MMrb, at a fit statistic of 0.863239485188882. The aquifer decision is the dominant exposure.

## What the memo must never contain

A tier quoted as evidence that the case was set up correctly. A fit statistic quoted as an accuracy. An adjective where a barrel count belongs. A warning count offered as a health measure, when module 5 showed a silent run 225 million barrels wrong. And a counterfactual that was never run.

## Exercise

Write the six entries for a case of your own, then hand the memo to someone who was not in the room and ask them to reproduce your oil in place from it alone. Whatever they have to ask you for is the entry you wrote badly. Fix that entry, not the others, and repeat with a second reader.
