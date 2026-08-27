# Defending an aquifer

An aquifer is the only term in the material balance that nobody has ever seen. You cannot log it, core it or meter it. It is a body of water inferred from the behaviour of a reservoir, given a shape by a model somebody chose, and sized by constants somebody picked. And it is often the largest single term in the balance. That is not a reason to avoid modelling one. It is a reason to expect to be asked about it.

The test is simple to state. **A reviewer must be able to reach your conclusion from your document without rerunning anything.** Not agree with it. Reach it. If the only way to see why you believe the aquifer is to open the software, the defence has failed, however good the model is.

Four things have to be visible.

## One: the drift that motivated the model

Lead with the evidence, and make it the evidence you had before you chose. The ratio $F/E_t$ survey by survey, as a column, with a sentence on what it does.

This is the item people leave out, because by the time the memo is written the aquifer feels obvious. It is not obvious to a reviewer, and it is the only part of the argument that does not depend on the model. On a closed tank the ratio holds still: Ekene's runs 12139208.1074970 at the first survey and 12139208.1074968 at the sixth. A tank with water arriving does not do that, and the shape of what it does instead is the whole case for the term.

Show the column even when it does not drift. A defence that includes the diagnostic that would have falsified it is worth several that do not.

## Two: the geometry behind the constants

Every constant in an aquifer model came from somewhere, and "the software's default" is not somewhere. For a Fetkovich aquifer that means the full input list, each with a source: aquifer thickness, porosity, total compressibility, permeability, water viscosity, reservoir radius, aquifer radius, radius ratio and encroachment angle. Ahmed Example 10-10 states all of them, which is why it makes a good drill: 100 ft, 0.25, 0.000007 per psi, 200 md, 0.55 cp, 9200 ft, 46000 ft, a radius ratio of 5 and 140 degrees.

Say what each is doing. The 140 degree angle means 0.388888888888889 of the ring around the reservoir is in contact with it, which turns a full circle of 28413649389.1192 bbl into a connected wedge of 11049752540.2130 bbl. The compressibility and the initial pressure turn that wedge into an encroachable 211934253.721285 bbl, under two percent of it. The permeability, thickness, viscosity and radius ratio set how fast that water can move, through a productivity index of 116.496154838747 bbl/d/psi.

A reviewer who has those numbers can argue with your geology. That is the point. A reviewer who has only the word "Fetkovich" can only argue with you.

## Three: the convention

Three bookkeeping decisions sit inside a Fetkovich run, none visible in the answer, each worth a large factor. State all three.

**The encroachment angle enters once.** It is applied when the connected wedge is taken, not when the aquifer volume is quoted. Applying it a second time shrinks the encroachable water by a factor of 2.57142857142857 and drags the four step influx down from 37.9731544101719 MMbbl to 19.6811125122705 MMbbl, a fall of 48.1709833750379 percent.

**The productivity index carries the pseudo steady state denominator.** $\ln(r_{eD}) - 0.75$, which is 0.859437912434100 here, not $\ln(r_{eD})$, which is 1.60943791243410. Use the plain logarithm and the productivity index falls 46.6001200919709 percent to 62.2088067813624 bbl/d/psi, the one step decay term falls 39.8449834608881 percent, and the four step influx comes out 29.7587992634529 percent low at 26.6727996152478 MMbbl.

**The reservoir pressure in each step is the midpoint of the step.** Replace it with the end of step pressure and the drawdown driving every step is larger: the first step alone doubles, from 3.92524784730120 MMbbl to 7.85049569460241 MMbbl, and the four step cumulative comes out 16.3893300978283 percent high at 44.1967000350130 MMbbl.

None of these is a rounding difference, and none is visible in the output. A convention line in the memo is the only place a reviewer can catch one.

## Four: the answer without the aquifer

Always report both. One extra run, one extra line, and it converts a claim into a measurement of what the aquifer is responsible for.

It also catches the failure this tier exists to teach. Force a pot aquifer onto the Ekene tank, which has none, and the engine reports an oil in place of -516449.043355256 stb where the honest run gives 12139208.1074968 stb, an aquifer of 42890161.1573930 rb, a water drive index of 1.04254388249892 and a mechanism reading strong water drive. The fit statistic is 0.999485673716372, which on its own looks healthy.

An engineer who reports only the aquifer case reports a negative oil in place and hopes nobody notices. One who reports both has found that an unnecessary aquifer moved the answer by more than the tank contains, which is a finding rather than an embarrassment.

## Two sanity checks worth putting in the memo

**Influx against encroachable water.** After the four steps of Ahmed 10-10 the aquifer has delivered 37973154.4101719 bbl out of an encroachable 211934253.721285 bbl, a fraction of 0.179174219095844. Under a fifth, consistent with an aquifer still supporting pressure. A fraction near or above one is not a strong aquifer, it is a wrong one.

**Where the aquifer pressure ended up.** The same march leaves the aquifer at 2249.06263967739 psia from an initial 2740 psia. If yours has fallen further than the reservoir, or has gone negative, the influx numbers downstream of it mean nothing.

## Worked example: a defence in one paragraph

Ahmed Example 10-10 aquifer, Fetkovich, four annual steps. Diagnostic: not applicable, the geometry and the influx history are given rather than inferred. Geometry: wedge aquifer, 140 degree encroachment, thickness 100 ft, porosity 0.25, permeability 200 md, water viscosity 0.55 cp, total compressibility 0.000007 per psi, reservoir radius 9200 ft, aquifer radius 46000 ft, radius ratio 5, all from the published example. Constants: full circle 28413649389.1192 bbl, connected wedge 11049752540.2130 bbl at an angle fraction of 0.388888888888889, encroachable water 211934253.721285 bbl against the printed 211900000, productivity index 116.496154838747 bbl/d/psi against the printed 116.5, one step decay 0.422897624804177 against the printed 0.4229. Conventions: angle applied once at the wedge, pseudo steady state denominator, midpoint reservoir pressure per step. Result: cumulative influx 37.9731544101719 MMbbl after four steps against the published 37.971, a relative difference of 0.00567383048077399 percent. Sanity: 0.179174219095844 of encroachable water delivered, aquifer pressure ending at 2249.06263967739 psia. Exposure: the aquifer radius and the radius ratio are the least constrained inputs and both act on the encroachable water directly.

That can be checked by someone who has never opened the software.

## Exercise

Take any aquifer result you have and write the four headed sections: the drift, the geometry, the convention, and the answer without the aquifer. Hand it to a colleague with one instruction: find the number I would most like you not to ask about. Whatever they pick is your exposure line.

Second, and this one is uncomfortable on purpose. Take the Ekene pot aquifer result of -516449.043355256 stb and write the most persuasive defence of it you can manage, using only true statements about the run: the fit statistic of 0.999485673716372, the drive index closure of exactly 1.00000000000000, the strong water drive classification. Then write the single sentence a reviewer needs to dismantle it. Notice how short it is, and notice that it is the one from section one.
