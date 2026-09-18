import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Expert m04, The Summary That Reconciles the Screen. Digest section 16.

q(1, "A screening returns seven independent numbers and reconciles none of them. What does a reader do with that, and why?",
 "They summarise it by reading the largest number, because nothing on an unreconciled screen ranks its own contents and attention follows the units.",
 ["They read the numbers in the order the screen prints them and act on the first one that carries a threshold, which is the order the engine computes them in.",
  "They discard the screening and rerun it, because seven unreconciled numbers means it came back incomplete.",
  "They average the alarming figures against the comfortable ones and act on the middle."],
 "A wall shear of 370 Pa looks worse than a life of 0.161915 yr, and on that stream the life is the consequence and the shear is the cause. That is a property of the units rather than of the engineering.")

q(3, "Across the six teaching streams the binding constraint takes four different values. What are they?",
 "Mass transfer to the wall, the corrosion allowance against the design life, the model does not apply, and wall shear on the corrosion inhibitor film.",
 ["Mass transfer to the wall, reaction kinetics, the corrosion allowance against the design life, and the rate category band the stream lands in.",
  "Wall shear on the corrosion inhibitor film, the sour threshold comparison, the corrosion allowance against the design life, and mass transfer to the wall.",
  "The model does not apply, the erosional velocity limit, wall shear on the corrosion inhibitor film, and the corrosion allowance against the design life."],
 "Four constraints across six streams is what makes it a summary. A summary that always said the same thing would be a heading, and there is no erosional velocity limit anywhere in this engine to bind on.")

q(0, "The binding constraint is chosen by walking a fixed sequence and stopping at the first question that fires. What is the sequence?",
 "Does the model apply at all, is the film being stripped, does the allowance fail the design life, are the two resistances comparable, is transport controlling, otherwise kinetics.",
 ["Is the film being stripped, does the model apply at all, is transport controlling, are the two resistances comparable, does the allowance fail the design life, otherwise kinetics.",
  "Does the allowance fail the design life, does the model apply at all, is the film being stripped, is transport controlling, are the two resistances comparable, otherwise kinetics.",
  "Is transport controlling, are the two resistances comparable, is the film being stripped, does the model apply at all, does the allowance fail the design life, otherwise kinetics."],
 "The sequence is the engineering content of the summary. Change the order and the same stream gets a different headline out of the same numbers, so the order is a claim about what matters first.")

q(2, "A stream is reported as mass transfer controlled. What has the sequence already established about it before it reaches that step?",
 "That the CO2 rate model applies, that the corrosion inhibitor film survives the shear, and that the allowance meets the design life.",
 ["That its rate is the largest number on the screen, which is what the steps above the transport test are there to confirm before transport is named.",
  "That it has passed the film test and nothing else.",
  "That its two resistances are comparable within the reporting margin."],
 "A lower step is reached only because every step above it is satisfied. The comparable step sits above the transport test and is reached first, so a stream named transport controlled has already passed it rather than satisfied it.")

q(3, "Why does applicability sit at the top of the sequence rather than anywhere else in it?",
 "Any lower limit would be ranked inside a model that had already stopped describing the stream.",
 ["Because it is the step that fires on the most streams, and a sequence that stops at the first firing question should try its commonest answer first of all.",
  "Because the applicability test needs only the mole fractions, so it can be answered before the shear and the rate have been computed at all on that stream.",
  "Because the withheld block has to be built before the category and the life are issued, and the applicability step is where that block is assembled."],
 "One teaching stream fails it: the H2S to CO2 ratio puts it in the sulphide regime and the binding constraint comes back with no value attached. A film stripping verdict on a surface the correlation does not cover is a precise answer to the wrong question.")

q(1, "Why does the film stripping test sit above the allowance test rather than below it?",
 "The rate depends on the shear verdict, because a stripped film removes the corrosion inhibitor credit before the rate is formed, so a life computed without it is a life at the wrong rate.",
 ["The shear is the larger number on most screens, and a sequence that ranks limits has to meet the larger of two candidates before it can meet the smaller one.",
  "The allowance test needs a design life and the shear test does not, so the shear test is placed where it can run on a screening that carries no design life at all.",
  "The film-stripping threshold of 100.000000000000 Pa is pinned and the design life is typed in, so the pinned comparison is applied before the typed one is reached."],
 "One teaching stream binds at 370 Pa against the 100 Pa at which this module takes the film to be stripped. Both thresholds are held, so the order argument stands on the structure of the calculation rather than on the value of either number.")

q(2, "Each binding constraint is returned with the value it turns on. What does the allowance constraint carry on the two streams that bind there?",
 "1.7 yr of 20 yr, short by 30.75 mm of allowance, and 7.7 yr of 20 yr, short by 4.45 mm.",
 ["The rate and the design life, at 1.676428 mm/yr against 20 yr and 0.361255 mm/yr against 20 yr, since the constraint names the two inputs that produced it.",
  "The required allowance on each, at 33.528563 mm and 7.225094 mm, since the constraint is about an allowance and the required figure is the allowance it asks for.",
  "The consumed depth against the allowance, at 0.400000 mm of 3.175000 mm on both, since the constraint turns on how much of the wall has already gone."],
 "The constraint names the limit and shows the value it turns on so that the claim can be checked rather than taken. Every one of those values is derived from something the screening had already computed.")

q(0, "Where did the constraints come from, and what entered the module with them?",
 "Each is derived from something already computed, and no new correlation and no new constant entered the module with the summary.",
 ["Each is derived from the held list, and the eleven items were extended to cover the four constraint types so the summary could declare its own sources.",
  "Each rests on a small fitted weighting that ranks the limits against one another.",
  "Each is computed afresh from the stream conditions on every screening."],
 "The shear comparison uses the shear and the threshold the engine already has, the allowance test uses the life and the design life already returned, and the transport test compares two terms the rate already carries. A summary layer with a fitted number of its own would be another held item hiding behind a sentence.")

q(3, "Both thresholds in the film stripping comparison are held. What does that do to the argument for the order of the sequence?",
 "Nothing. The order rests on the structure of the calculation, because the rate is formed after the shear verdict whatever the threshold is set to.",
 ["It weakens it to a convention, since a step whose comparison rests on two unsourced numbers cannot be defended as sitting above a step that rests on typed ones.",
  "It removes the step, which is why the engine reports the shear beside the rate rather than ranking it.",
  "It moves the step below the allowance test, since a typed comparison outranks a held one."],
 "The threshold values are held and the coupling between them is not. A verdict taken on an unsourced threshold still changes which rate is formed, so a life computed without it is a life at the wrong rate.")

q(2, "The shipped default case binds on the corrosion allowance against the design life at 4.2 yr of 20 yr. What happens to the constraint under the four changes the digest sweeps?",
 "At 60 ft per second it binds on wall shear at 362 Pa, and at 1 mol percent H2S and oil wet it binds on the model not applying.",
 ["At 60 ft per second it binds on mass transfer to the wall, and at 1 mol percent H2S and oil wet it binds on wall shear on the corrosion inhibitor film.",
  "At 60 ft per second it binds on wall shear at 362 Pa, at 1 mol percent H2S on the allowance against the design life, and oil wet on the model not applying.",
  "At 60 ft per second and at pH 4.0 it binds on wall shear."],
 "The last two are the same constraint reached by different roads, and in both the reader's next action is to read the withheld block rather than to act on a number. The pH change leaves the constraint on the allowance against the design life.")

q(0, "A stream binds on mass transfer to the wall. What does the engine say follows from that?",
 "That velocity and line size move this rate and the chemistry does not.",
 ["That the corrosion inhibitor programme is what moves this rate, since the transport term is the one the credit is applied to before the series combination.",
  "That the rate is an upper bound, since a transport limited surface is one the CO2 correlation is describing at the edge of where it was fitted.",
  "That the reaction term can be ignored, since the series combination sits at whichever term is smaller and the larger one has dropped out of the answer."],
 "On one teaching stream the transport term is 2.34 mm/yr against a reaction term of 27.66 mm/yr, and on another 0.09 mm/yr against 10.01 mm/yr. Changing the temperature or the carbon dioxide on a transport controlled stream moves the larger term and the answer barely follows.")

q(1, "The engine says that slowing the line changes this answer before anything else does. What kind of statement is that?",
 "A statement about the sensitivity of the module's own output. It describes which limit governs the number and stops there.",
 ["A recommendation, which is why the binding constraint is the one field on the screening that the studio renders as an action for the reader to take.",
  "A statement about the world, reached by setting the shear against the erosional velocity limit that the wall shear is compared with on every screening.",
  "A refusal, in the same family as the withheld block."],
 "Naming a limit is a statement about the calculation and recommending an action is a statement about the world, and the second needs a standard, a cost, an operating context and a consequence. This engine has no erosional-velocity criterion, so no constraint here is ever a velocity limit. The sentences are written in plain English and plain English sounds like guidance.")

q(2, "A stream binds on wall shear on the corrosion inhibitor film. What does that constraint still not know?",
 "Whether the velocity is erosional, because this engine has no erosional-velocity criterion and computes a wall shear to decide whether a film survives.",
 ["Whether the shear was computed on the turbulent branch, which the constraint cannot report because the branch name is held along with the Reynolds 4000.000000 switch.",
  "Whether the corrosion inhibitor credit was removed, which is reported in a separate field because the constraint names the limit without naming its consequence.",
  "Whether the rate is an upper bound, which the regime door settles separately and the binding constraint has no access to at the point it is chosen."],
 "Read the four constraint types against the not-provided list and the gaps are plain. A stream binding on the allowance has no retirement thickness and no inspection interval beside it, and a stream binding on the model not applying has no cracking criterion of any kind.")

q(0, "Why is four different constraints across six streams the point rather than an accident of the sample?",
 "A summary that always said the same thing would be a heading rather than a summary.",
 ["Because six streams is the smallest sample that reaches every branch, which is why the vendored golden carries exactly six whole screenings to pin the summary.",
  "Because the four constraints are equally likely by construction, so a spread over six streams is what shows the ranking has not settled on one branch.",
  "Because a constraint that fired on every stream would be the one held item in the summary layer, and the spread is what proves no fitted number entered it."],
 "Each of the four implies a different first move: the line speed, a specification decision, velocity and line size, or reading the withheld block because no rate verdict is being offered.")

q(3, "One step of the sequence asks whether the two resistances are comparable. What is the margin that step uses, and what does it claim?",
 "Within 10.000000 percent the engine answers comparable rather than naming a term. It is a reporting threshold and no claim about where mass transfer stops mattering.",
 ["Within 10.000000 percent the engine names the larger of the two terms, since a bare comparison of two nearly equal numbers should resolve towards the safer reading.",
  "Within 0.100000 percentage points the engine answers comparable, which is the same trigger the corrosion inhibitor shortfall warning is measured to fire at.",
  "Within one rate category band the engine answers comparable, which ties the reporting margin to the bands and is why the margin is held along with them."],
 "A bare comparison of two nearly equal numbers flips on floating-point noise, so the margin exists to stop the word flipping. The measured margin is 0.100000 as a ratio and the engine says in its own words that it is a reporting threshold.")

emit(Q, '/root/wt-fc9-nextgen/tools/course-banks/corrosion/advanced/fc9a_m04.json', expect_n=15)
finish()
