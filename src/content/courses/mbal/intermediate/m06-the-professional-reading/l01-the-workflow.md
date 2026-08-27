# The workflow

The Associate workflow was a straight line. Assemble, compute, plot, fit, check, reconcile, declare. It runs left to right and never asks you to make a choice, because on a closed tank there is nothing to choose.

Five modules have now taken that away from you. A real tank may be importing water, and if it is you must decide which aquifer model to use, with which constants, in which convention. A real dataset may not carry its fluid properties, and if it does not you must decide what stands in for them. Those are choices, and choices are where readings go wrong.

So the Professional workflow is not a longer straight line. It is three phases, and the whole discipline is in keeping them apart and in order.

**Diagnose. Then model. Then defend.**

## Phase one: diagnose

Nothing in this phase fits an aquifer, and nothing in it is allowed to know which model you are going to pick.

**Establish provenance before you compute anything.** For every fluid property the case will use, know which level of the precedence chain supplies it. Per row, laboratory table, or correlation. Do this before the first term is computed, because it is the only phase in which the question is cheap. Later it becomes an interrogation of a result you have already written down.

**Build the terms and the line, exactly as the Associate tier did.** Withdrawal, oil expansion, rock and water expansion, total expansion, per survey, with units attached. Then plot $F$ against $E_t$ and look at it.

**Read the drift.** This is the step the Associate tier did not have. Take the ratio $F/E_t$ survey by survey and read it as a column of numbers, not as a fitted slope. On the Ekene tank it is the same number at every survey, 12139208.1074970 at the first and 12139208.1074968 at the sixth, and a constant ratio means the closed tank model is complete. A ratio that climbs survey after survey means the withdrawal is outrunning the expansion the tank can supply on its own, and something is delivering the difference. The direction, the size and the shape of that drift are your evidence, and they are the only evidence you will ever have that is independent of the model you are about to choose.

**Write down what the drift is worth before you go on.** A sentence is enough. It commits you before the fitting starts, and a committed diagnosis is much harder to quietly revise once a model is on the screen.

## Phase two: model

**Choose from geometry and time, not from fit.** The aquifer models differ in what they can represent. One responds instantly and has no clock. One has a productivity index and a clock and depletes. What you know about the aquifer's size, its connection to the reservoir, its encroachment angle and how quickly the field responded should drive the choice. If you cannot say why the model suits the reservoir before you run it, you are choosing by fit statistic, and lesson 4 of module 2 showed what a fit statistic is worth.

**Get the constants from the geometry and record the convention.** For a time marching model that means the encroachment angle applied exactly once, the pseudo steady state denominator in the productivity index, and the midpoint pressure convention in the marching scheme. Each of those is a bookkeeping decision with a factor sized consequence, and each belongs in your notes rather than in your memory.

**Run it, and read more than the oil in place.** The fit and the slope, yes. Also the drive indices and whether they close. Also the aquifer's own numbers: the cumulative influx against the encroachable water, and where the aquifer pressure ended up. An aquifer that has delivered more water than it contains is not a result, it is a message.

**Run the no aquifer case too, every time.** One extra run, and it gives you the single most useful number in the whole reading, which is how much of your answer the aquifer is responsible for.

## Phase three: defend

**State both answers and the difference.** With the aquifer and without it, in barrels, with the direction named.

**State the convention and the constants.** Not "Fetkovich", but Fetkovich with these geometry inputs, this angle applied at this point, this denominator, this pressure convention.

**State what would change the answer.** The Associate version of this step named the pressure surveys and the depletion behind the fit. Add two Professional items: the aquifer parameters you chose rather than measured, and the level of the precedence chain each fluid property came from. If any term rests on a correlation, say so in the same sentence as the oil in place, not in an appendix.

Notice what the three phases forbid. You may not choose an aquifer model in phase one, you may not gather new diagnostic evidence in phase two, and you may not discover in phase three that you never ran the case without the aquifer. The order is the protection.

## Worked example: Ekene through the Professional workflow

Phase one. Provenance: per-row oil formation volume factor and solution gas ratio on all seven rows, level one of the chain, plus a laboratory table that the sort warnings tell you is inert and that the engine never reaches. Terms and line as before, ending at $F$ 317926.842484584 rb and $E_t$ 0.0261900809071921 rb/stb. Drift: none. The ratio holds at 12139208.1074968 across six surveys. Written verdict, before any model is chosen: this tank shows no water influx signature at all.

Phase two. On that diagnosis the model is no aquifer, and there is nothing to choose. Slope 12139208.1074968 stb, fit statistic 1.00000000000000, indices 0.607003891050583 depletion and 0.392996108949419 rock and connate water, water drive exactly zero, sum 1.00000000000000, mechanism depletion drive.

Now the counterfactual, which is where the Professional workflow earns itself. Force a pot aquifer onto the same data and the engine returns an oil in place of -516449.043355256 stb, an aquifer holding 42890161.1573930 rb, a water drive index of 1.04254388249892 and a mechanism reading strong water drive. The fit statistic is 0.999485673716372. If you had skipped phase one and let the fit choose, nothing on the screen would have stopped you except the minus sign.

Phase three. With no aquifer, 12139208.1074968 stb. With an unnecessary pot aquifer, -516449.043355256 stb, a swing of 12655657.1508521 stb from a decision that no data supported. Convention: no aquifer, so none applies. Exposure: the static pressures, and the per-row fluid properties, whose provenance upstream of the file is not recorded.

## Exercise

Write the phase one verdict for a tank you have not modelled yet. Use any dataset with at least four surveys, compute $F/E_t$ per survey, and write two sentences: what the ratio does, and what you therefore expect the correct model to be. Sign and date it.

Then run the case both ways, with your chosen model and with no aquifer, and write the phase three paragraph. If your phase one verdict turned out wrong, do not edit it. Write underneath what evidence would have pointed you the right way, because that is the only part of this exercise that makes you better at the next tank.
