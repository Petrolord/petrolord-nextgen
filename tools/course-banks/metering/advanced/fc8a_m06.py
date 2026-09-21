import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Expert m06, The register, the refusals and the counts.
# Digest SECTIONS 30, 31 and 32. 15 questions.

q(0, "This course calls and proves 28 distinct refusals. What was that count taken over, and what made a call count?",
 "The assertion list the course build made while it ran, filtered to the ones labelled a refusal, with one count per distinct assertion text, each asserting that the engine returned an error key.",
 ["The refusal messages the three engines export as named constants, with one count for each distinct message.",
  "The guard clauses written in the three engine sources, with one count for each clause that can return early.",
  "The inputs the course build rejected before calling anything, with one count for each input rejected."],
 "A list compiled by reading the source would be a list of refusals somebody believed were reachable, which is a weaker claim than one that provoked every case.")

q(2, "What rule decides whether a call this course made counts as one of its 238 successes?",
 "The result carried no error key and no non-finite number in it.",
 ["The result matched a golden case for the same function, which is what separates a call that ran from a call that ran correctly.",
  "The result carried a figure the course went on to print, so a call whose output is never quoted anywhere is not counted as a success.",
  "The result carried no warning and no note, since a call that returns a caveat is neither a refusal nor a clean success."],
 "The successes and the refusals are counted over the same assertion list filtered two ways, and the rule is what tells the two halves apart.")

q(1, "A course build labels a row a refusal and then calls a case that succeeds. What is the shape of that defect and what stops it here?",
 "Real engine output would print under a false sentence, and nothing numeric could see it, so the file writes nothing at all if any label disagrees with its call.",
 ["The numbers would be invented rather than returned, so a sweep of the literals against the engine finds them and the build stops there.",
  "The row would carry a null where a figure belongs, which the reproducibility check catches on the second build of the file.",
  "The count of refusals would disagree with the count of successes, and the two are asserted to add to the number of calls made."],
 "When you assert a behaviour and print evidence of it, have something check that the evidence is evidence of the thing you asserted.")

q(3, "The register in this course holds fifteen items. What makes something an item?",
 "The engine states, in its own source or its own returned text, that the package does not carry it, does not cite it, or refuses to answer it.",
 ["The item is a table or a correlation named in a standard that any of the three engines would need in order to answer a question a user might ask of it.",
  "The item is named in a standard one of the three engines cites, and the register lists every citation the package carries between its three modules.",
  "The item is a figure this course prints but does not grade, which is why no capstone field rests on one."],
 "Two of the fifteen are outright refusals to answer, where the engine returns a refusal or a withheld flag in place of a number.")

q(2, "This course sorts the register three ways: held (the rows the register marks NOT CARRIED), stated and withheld. What is the difference?",
 "Held is absent and the engine carries on where it can, stated is a value the package chose or was handed and names, and withheld is a question it will not answer.",
 ["Held is a value the caller supplies, stated is a value the standard supplies, and withheld is a value the engine computes and declines to return to a screen.",
  "Held is a figure returned with a warning, stated is a figure returned without one, and withheld is a figure returned as a null with no reason beside it.",
  "Held means the item is carried but not cited, stated means it is cited but not carried, and withheld means it is neither carried nor cited anywhere."],
 "A held item means go and look it up, a stated item means check whose number this is, and a withheld item means the answer is not available from here at any price.")

q(0, "Which two items in the register are the outright refusals?",
 "The straight-run requirement for two elbows in different planes, and the relation that turns a fire duty into a required vent capacity.",
 ["The minimum shell plate thickness band table, and the diameter above which the variable design point method takes over from the one-foot method.",
  "The turnover factor Kn, and the thermal venting table above the capacity at which the package stops claiming proportionality.",
  "The ISA Reynolds number factor, and the noise prediction the engine calls an indication rather than a prediction."],
 "The register proves both by calling them: straightRunDiameters returns withheld true for two elbows in different planes and fireVenting returns ventWithheld true at every wetted area.")

q(1, "Why does the register prove its two refusals by calling them rather than by citing the engine source?",
 "A refusal read off the source is one somebody believes is reachable, and calling it shows the flag and the null coming back.",
 ["Because the engine sources are vendored and a citation into them would pin a line number that moves on the next repair.",
  "Because a source comment is provenance and a course may not quote one, so the call is the only route to the text of the message.",
  "Because the two refusals are raised by three different functions between them, and a citation could only name one of the three."],
 "fireVenting returns ventWithheld true and a null vent capacity at every wetted area, which is a behaviour rather than a claim about the source.")

q(3, "The tank engine's own refusals are listed by the function that raises them. Which pair of functions raises two each?",
 "lossControl and thermalVenting.",
 ["evaporativeLosses and fireVenting, which are the two tank functions that stop on the range of a relation rather than on an input.",
  "tankCapacity and movementVenting, which are the two tank functions whose refusals fire on a rate or a height below zero.",
  "fireVenting and tankCapacity, which are the two tank functions whose refusals are proved twice over in the register itself."],
 "lossControl refuses above a hundred percent and with no efficiency, and thermalVenting refuses at a latitude factor above what the package will apply and with no capacity.")

q(0, "How many refusals does orificeFlow raise in this list, and what are they about?",
 "Four, on a compressible flow with no static pressure, a differential above the static pressure, a bore above the pipe bore and no differential at all.",
 ["Two, on a differential above the static pressure and on an orifice bore above the pipe bore.",
  "Three, on a missing differential, a missing static pressure and a missing discharge coefficient.",
  "One, on a differential above the static pressure, which is the only impossible input the function takes."],
 "Every one of them was provoked, called and inspected for an error key, which is what counting a refusal requires.")

q(2, "The count of counts in this course comes back as nineteen. What rule makes that number checkable?",
 "One per call to the counting helper, which is the only way a count reaches the file at all.",
 ["One per figure the file prints that is a whole number rather than a decimal, which is how a count is told apart from a measurement.",
  "One per section that carries a count, so a section printing several counts contributes one to the total.",
  "One per tree named in the file, since a count and the tree it was counted over are written together."],
 "A count of counts is only checkable if there is exactly one route by which a count can be created, and naming the route is what tells a reader that none arrived some other way.")

q(1, "Two counts on this tank are taken over the same courses array. What separates them?",
 "The governing word the engine returned, which is hydrostatic test for one count and minimum plate thickness for the other.",
 ["The condition each was evaluated at, one over the design case and one over the test case.",
  "The required thickness, with a course counted against the first where the thickness stands above the stated minimum plate thickness.",
  "The head, with the courses below the design liquid level counted in the first and the courses above it counted in the second."],
 "Written without their rules, those two numbers are a one and a four attached to a tank, and a reader cannot tell whether they overlap or exhaust the table.")

q(3, "The course pins fifty engine strings verbatim. What does the pinning actually buy?",
 "Each was asserted to contain a fragment of its own text as the file was built, so a reworded message fails the build rather than teaching wording nobody will see.",
 ["A reader can search the engine source for the string and confirm the message has not been edited since the file was built.",
  "A screen showing a message and an engine returning one cannot drift apart, because the pinned string is the named constant the interface reads and the engine returns on the call itself.",
  "A message that breaches the owner copy rule is exempted by exact text, which is what allows a contrastive to be quoted at all."],
 "A worked example that paraphrased an error message would teach a sentence the learner will never see on the screen, and the same is true of a lesson.")

q(2, "Which of these is never a source for a figure in a document about this package?",
 "A comment in the engine source, because it often describes what the code did at some earlier time.",
 ["A message the engine returns, because a sentence is not a figure and cannot be checked against an engine output.",
  "A figure printed in the course at six decimals, since a rendering is not a value.",
  "A relation line, because a comparison is somebody's reading of two figures."],
 "The test is whether you can make the package produce the figure right now by calling it. A repair note and a review document are in the same position as the comment.")

q(0, "A writer wants to say that one figure in this course is a fraction of another. What does the course require?",
 "That the comparison was computed and printed as a relation carrying both values, their difference and their ratio.",
 ["That both figures come from the same section of the file, so that a comparison never crosses a boundary between two engines.",
  "That the arithmetic is shown, so a reader can follow the subtraction or the division that produced the claim.",
  "That the two figures are quoted at the same precision, since a ratio between two renderings of different length is not defensible."],
 "Your own arithmetic over two published figures is not a source, because the two may not be on the same basis, at the same condition or in the same units.")

q(1, "Why is a course built this way interested in refusals at all?",
 "Because a refusal converts a silent wrong answer into a loud absent one, which stops at the person who asked.",
 ["Because a refusal is the only behaviour of an engine that a course can examine without quoting a figure, so it is what a bank question can be built on.",
  "Because the refusals are where the three engines share a mechanism.",
  "Because a refusal is cheaper to check than a figure and needs no tolerance."],
 "Each refusal sits where the relation would return a number and the number would be meaningless, and where a reader would have no way of knowing anything was wrong.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/advanced/fc8a_m06.json', expect_n=15)
finish()
