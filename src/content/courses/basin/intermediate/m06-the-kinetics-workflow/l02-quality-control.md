# Quality control

The workflow ends with checks on your own arithmetic. Quality control is the wider habit: checks on inputs, on software, and on the answers other people hand you. This lesson is the kinetics tier's QC practice, organised as the three interrogations you should run before trusting any maturity claim.

## Interrogate the inputs

A kinetic answer inherits every upstream sin, so start by asking the history where it came from. Was the burial reconstruction decompacted, or does the early history sit too shallow? Module 5 priced that at roughly a factor of two in conversion per 300 m of persistent under-burial. Is the heating rate stated, or must you infer that a rate is hiding inside a temperature-quoted window? Is the surface temperature explicit? A track from 20 versus 10 degC shifts every temperature on the way by ten degrees, and ten degrees at the front is a factor of five in rate.

For the kerogen clock, the input interrogation is the spectrum: which type, whose data, and does the sum land near 1. An unstated kerogen type is module 4's factor of 132 wearing a blank name tag.

## Interrogate the software

New software gets the five checks of module 5 before its first real run: two anchors, monotone range, a rate landmark, a graded fixture row, and the separation test. The separation test earns its place every time software changes hands, because the vitrinite-kerogen conflation has a documented history and no visible symptom in ordinary output: Ro looks plausible right up until a spectrum edit moves it.

One more software check specific to integration: run a graded ramp row at the standard step, then at half the step, and confirm the answer moves by less than the tolerance. Convergence you have demonstrated beats convergence you were promised.

## Interrogate the answer

An answer that survives its inputs and its software still has to survive physics. Place every reflectance between the anchors and every TR in [0, 1]; place the pair against each other, since a high Ro with a near-zero Type I or II TR, or mid TR at floor Ro, signals crossed wires. Check direction against the four levers this tier taught: hotter history, higher both; slower ramp at fixed final temperature, higher both; lighter kerogen type, higher TR, unchanged Ro; more time at fixed temperature, slightly higher both, and only slightly, because of the stall.

Magnitude landmarks worth memorising for this: mid oil window is F near 0.43, TR for Type II near 150 degC histories sits around a third to a half, and no isothermal history at 100 degC produces Type II TR above about 0.17.

## The one-line records

QC that is not written down evaporates. The tier's practice is one line per run, stating the clock, the track with its pace, the spectrum if kerogen, the convention, and the checks passed. "Vitrinite, 20 to 150 at 3 degC per Ma, midpoint 0.01 Ma, anchors and row-150 verified: Ro 0.9871." That sentence is auditable a year later; a bare "Ro 0.99 at the source" is not.

## Worked example

A contractor deliverable states: "Source maturity 1.05 percent Ro; transformation 62 percent; Type III; based on present-day temperatures." Run the three interrogations in order and list what each catches. Inputs: present-day temperatures are a snapshot, not a track, so the kinetics were fed an assumption the report does not state. Software: unverifiable from the deliverable, and the pairing already smells. Answer: at Ro 1.05, F is 0.4451, and a Type III spectrum at histories consistent with that reflectance holds TR far below 62 percent, since its bulk sits above the front; the stated pair is internally inconsistent by module 4's spread. Verdict: reject pending the history, the software checks, and an explanation of the pairing.

## Exercise

List the three interrogations with one representative check each. Then answer in one sentence: why does QC insist that the heating rate be stated even when only a reflectance is delivered?

As a self check: interrogate inputs, for instance whether the burial history was decompacted; interrogate software, for instance anchors plus the separation test; interrogate the answer, for instance the Ro-TR pairing against the kerogen type. The rate must be stated because a reflectance's meaning in temperature and depth is rate-dependent, so a delivered Ro without its rate assumption cannot be mapped to any boundary, compared across basins, or checked against the crossing table.
