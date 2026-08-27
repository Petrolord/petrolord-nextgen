# Onward on the reservoir path

You came into this course able to read a rate against time. You leave it able to validate an engine against the published record, defend a window with an experiment instead of a statistic, treat a decline exponent as a governed claim rather than a fit output, report a range instead of a point, and refit a flooded well while saying out loud which stream you are describing and what is driving it. That is a complete decline-analysis skill, and it is enough to carry a producing asset's forecast on your own.

It is also, on its own, a narrow instrument. Everything you have done extrapolates a rate. Not one number in this course knows how much oil is in the ground, what is pushing it, how efficiently the water is sweeping it, or what would happen if you drilled somewhere else. Decline analysis cannot answer those questions and does not pretend to. The rest of the reservoir path is where they get answered, and this course is the first of the series for a reason: it produces the input the others start from.

## What you carry across

One number, and you have already computed it. The four producers' cumulative production at the flood start, 261475.03999967827 stb, is the sum of four Arps integrals and it is the last row of the material-balance history in the same fixture directory you have been fitting all course. Nothing else you produced crosses the boundary intact. The fitted declines do not, the EURs do not, the type curves do not. The cumulative does, and its quality is entirely your responsibility.

## Material balance, next

RC2 takes that cumulative, joins it to a pressure history and a PVT description, and answers the question decline analysis structurally cannot: how much oil is in the tank, and what drive mechanism is emptying it. You have already seen its arithmetic run once, in module 5 lesson 4, where dividing an underground withdrawal by a total expansion returned 12139208.107496822 stb from a single survey row.

The interesting part is not that the Ekene fixture closes to the volumetric answer. It is what happens when a real one does not. A material balance that disagrees with the map is the most informative result in reservoir engineering, and the three suspects are always the same: the mapped volume, the drive model, and the cumulative. You now know how the third one goes wrong, which means you can clear or convict it faster than anybody who has not done this course.

## Then displacement, then the flood, then simulation

**SCAL and fractional flow.** Relative permeability, Corey curves, mobility ratio, Buckley-Leverett. This is where the water-cut curve you divided out in module 5 stops being a fixture parameter and becomes something predicted from rock and fluid properties. If module 5 left you with the feeling that the honest way to forecast a watering-out well is to forecast the water separately, this is the course that shows you how.

**Waterflood management.** Voidage replacement, pattern balancing, injector surveillance, Hall plots. The Ekene flood you have only seen from the producers' side has an injection ledger with an under-injected start-up and an injector losing injectivity in 2025, and the surveillance course reads the same event from the other end of the pattern. Response lags and lift factors stop being parameters in a JSON block and become consequences of decisions somebody made about rate and pattern.

**Simulation.** Where the tank becomes cells and the analytical assumptions you have been policing all course are replaced by different ones, which also need policing. The habit this course built, asking what a model assumes and what would change its answer, transfers directly and matters more there, not less, because a simulator will happily give you a beautifully history-matched answer built on a completely wrong description of the reservoir.

## The habit worth keeping

The Ekene field runs through all of it: the same six wells, the same sand, the same 2023-01-01 flood, the same generator. That continuity is deliberate, so that each course adds a way of looking at a reservoir you already know rather than a new dataset to learn.

What should transfer is not the numbers. It is the reflex you built here of asking, before accepting any output, what regime it describes, what stream it was measured on, and what would have to be true for it to be wrong. That reflex is the whole of reservoir engineering judgment, and decline analysis is simply the cheapest place to learn it.

## Exercise

Take your Expert capstone submission and write, for each of the six fields, the one question you would now want answered before you would book that number on a real asset. Then sort the six questions by whether decline analysis can answer them at all. The ones that land in the second pile are your reading list, and you will find that each of them is the subject of one of the courses named above. Keep the list. Come back to it after RC2 and mark off what you can now answer.
