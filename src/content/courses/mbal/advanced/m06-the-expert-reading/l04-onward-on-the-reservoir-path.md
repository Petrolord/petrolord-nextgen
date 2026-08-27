# Onward on the reservoir path

You can now close a tank that imports water on its own clock, choose between two solution families for the aquifer that delivers it, run a published benchmark and say honestly what it does and does not prove, apportion a three mechanism drive in a convention you have stated, and write a memo that a stranger can reproduce your answer from. That is the full working range of material balance, and there is nothing left in the subject that a reservoir engineer is expected to know and you do not.

So the question for this last lesson is not what else material balance can do. It is what the number is for.

## The denominator

Material balance produced one number that the rest of reservoir engineering cannot start without: the oil originally in place. Almost nothing downstream is quoted in absolute barrels. It is quoted as a fraction of that number, and the number is the denominator.

Recovery factor is the plainest case. On the Ekene tank, 261475.039999678 stb produced against an oil in place of 12139208.1074968 stb is a recovery factor of 2.15397114609312 percent, and every sentence anybody ever writes about how Ekene is performing sits on that ratio.

Now watch what happens when the denominator is uncertain. The Dake Exercise 9.2 field had produced 77.43 MMstb by year ten. Against the Carter-Tracy answer of 307.221409553720 MMSTB that is a recovery factor of 25.2033216410527 percent. Against Dake's own 312 MMSTB it is 24.8173076923077 percent. Against the 532.588241588393 MMSTB you get by ignoring the aquifer, the same field, on the same production, has recovered 14.5384358785452 percent.

Same oil out of the ground. Three recovery factors, spanning more than ten percentage points, because the denominator moved. And a recovery factor is not a statistic. It is the input to whether an infill well is drilled, whether a waterflood is expanded, whether a field is abandoned, and what an asset is worth. An error in the oil in place does not stay in the oil in place. It propagates into every decision that is expressed as a fraction of it, which is nearly all of them.

That is why this course spent a whole module on evidence rather than arithmetic, and why the reserves memo insists on the counterfactual entry. The denominator has to be defensible for years, not correct on the day.

## What comes next, and what each course adds

**Displacement and special core analysis.** Material balance told you how big the tank is. It said nothing about what fraction of the oil in that tank can be moved at all. That is decided at the pore scale, by relative permeability and capillary pressure, by the saturation at which oil stops flowing and water starts, by wettability and by the end points of the curves that describe them. This is where a recovery factor gets its ceiling, and where you learn that a large tank with hostile rock can be worth less than a small tank with kind rock. You will also meet the way core measurements are scaled to a reservoir, which is its own discipline in provenance and one where the habits from module 5 transfer directly.

**Waterflood management.** In this course the water arriving from an aquifer was a term you had to infer, could not measure, and could not control. In a waterflood it becomes a term you meter at surface and turn up or down. The material balance you have learned does not go away; the influx term becomes an injection term, voidage replacement becomes the arithmetic of keeping the tank in balance deliberately, and the diagnostics you built here become surveillance tools. Sweep, breakthrough, pattern balancing and the difference between water that displaced oil and water that took a short cut are the new material. The tank model is the frame it hangs on.

**Simulation.** Eventually the single tank is not enough, because pressure is not uniform, saturation is not uniform, and the wells are in specific places. Simulation divides the reservoir into cells and solves the same conservation statement in each of them.

Two things to carry into that. First, simulation does not retire material balance. Every simulation model has an oil in place, and the first check any competent reviewer makes is whether it agrees with the tank you closed independently. A model that history matches beautifully while holding the wrong volume is the failure mode of the whole discipline, and material balance is the check that catches it. Second, everything module 4 taught you about the danger of freedom scales up brutally. A tank model has two or three parameters. A simulation model has thousands, and a fit statistic means correspondingly less.

## The habits, not the equations

Four things came out of this tier that are not about material balance at all.

Run the counterfactual and price it in barrels. State the convention in the same sentence as the number. Re run the provenance rather than quoting it. And find something independent to reconcile against, because no tool validates your answer and none of them will tell you when they have not.

Those transfer to every course that follows and to work that has nothing to do with tanks.

## Exercise

Take the oil in place you are most confident in, from this course or from your own field, and write the three sentences it is a denominator in: a recovery factor to date, a remaining reserve, and one decision that turns on either.

Then move the denominator by the size of your largest recorded counterfactual and write the same three sentences again. Put the two versions side by side and decide, honestly, whether the decision in the third sentence changes.

If it does not, you have found a number that is precise enough and you should stop refining it. If it does, you have found the piece of work that is actually worth doing next, and you now know exactly what it is worth.
