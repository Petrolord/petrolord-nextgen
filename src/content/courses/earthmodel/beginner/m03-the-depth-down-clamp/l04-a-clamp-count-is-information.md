# A clamp count is information

A clamp count is easy to treat as noise. It appears in a build log next to a lot of other numbers, it does not stop the run, and the framework it belongs to looks perfectly presentable afterwards. Software that reports it is doing you a favour that is easy to ignore.

This lesson argues the opposite case. The clamp count is one of the most informative numbers the framework produces, and it is not information about the software. It is information about your input surfaces.

## What the count is measuring

The clamp does not go looking for trouble. It repairs a node only when the surfaces handed to it disagreed at that node about which of them is deeper. So the count is a direct measurement of how far two of your interpretations contradict each other, expressed in nodes.

A count of zero says the two surfaces were already consistent everywhere. That is what TopA and TopB did on this model. A count of 180 on BaseB says the interpretation of BaseB and the interpretation of TopB disagreed about their order at 180 of the 500 nodes of the frame, which is 36 percent of the model.

Nothing in that sentence is about the clamp. The clamp is the messenger. The count belongs to the surfaces, and it would have been the same 180 whether or not anyone ever ran a repair.

## Two very different stories give the same count

Here is the reason the number cannot be filed and forgotten. At least two quite different situations produce a large clamp count, and they call for opposite responses.

The first is a real pinch-out. Zone B genuinely dies out across part of the area, because it was eroded off a high, or because it onlapped one and was never deposited there. The interpreter mapped BaseB across the whole area anyway, as interpreters routinely do, and where the zone is gone the two picks sit on the same reflector or drift across each other slightly. The clamp collapses the zone to zero, the model gains a pinch-out line, and the geology is now correct. Nothing needs fixing.

The second is two surfaces that were never reconciled. TopB was interpreted last year on one volume, BaseB was interpreted this year on a reprocessed one, or by a different person, or against a different datum, or in feet. Nobody ever displayed them together. The clamp then quietly manufactures a pinch-out that no geologist has ever claimed exists, and it does it over a third of the model. The framework is legal and the geology is fiction.

There are quieter variants of the second story. A depth conversion applied to one surface and not the other. A surface exported with its null value written as zero. A stack listed in the wrong order, so that the code believes a shallow surface is the deep one. Every one of these arrives as a clamp count and none of them announces which it is.

The count cannot tell the two stories apart. Only you can, and only by looking.

## How to account for a count

The habit is three steps, and it takes minutes.

Read the count. Get it out of the log and into the project record, per surface, as a number and as a share of the frame. On this model that record reads: TopA 0, TopB 0, BaseB 180 of 500, which is 36 percent.

Explain the count. Map the fixed nodes and look at them. Do they form one coherent region with a sensible edge, which is what a pinch-out looks like, or are they scattered across the model in a pattern no depositional process would make. Do they sit where the structure would predict the zone to die. Does a well in that area confirm the zone is missing, or does it log a healthy interval of it. Ask whether both surfaces came from the same volume, the same datum and the same units.

Then write the explanation down next to the count, in one sentence, in the document that carries the model. On this model the sentence is that BaseB was clamped at 180 of 500 nodes, and those nodes are the pinch-out of zone B, which is confirmed by the zone B thickness grid being exactly zero at the same 180 nodes.

## Never ship a count you cannot account for

That is the rule this lesson exists to install. A framework whose clamp counts you cannot explain is not ready to hand on, however tidy the surfaces look and however plausible the volumes are.

The reason is that the count is your only warning. Once the clamp has run, the model is valid, and every check downstream will pass. Thicknesses are positive, volumes are positive, the simulator accepts the grid. The evidence that a third of your model was rebuilt by an algorithm exists in exactly one place, and if you drop it there is no way for the next person to find out.

Be equally wary of the reverse habit. Some workflows offer to suppress the reporting, or to smooth the repaired surface so that the pinch-out looks gentler. Suppressing the count throws away the only measurement you have of how much your surfaces disagreed. Smoothing the repair spreads a sharp geological boundary into a gradual thinning that no data supports, and it makes the pinch-out line, which is a mappable thing, impossible to draw.

A reviewer who is handed a framework should ask for the counts before they ask for the volumes. If you are the one being asked, have the answer ready.

## Exercise

You are handed a framework built by someone else. It reports clamp counts of [0, 0, 180] on a 500 node frame and nothing else. Write down the share of the frame that was repaired, and list three questions you would ask before you accept the model.

Self check: 180 of 500 nodes were repaired on the base surface, which is 36 percent of the frame, and nothing was repaired on the two upper surfaces. Reasonable questions are whether the 180 fixed nodes form one coherent region with a mappable edge or are scattered, whether any well in that area confirms the zone is missing there, and whether the two surfaces that disagreed share the same datum, the same units and the same depth conversion. Until at least those are answered, the count of 180 is a description of a disagreement between two interpretations rather than evidence of a pinch-out.
