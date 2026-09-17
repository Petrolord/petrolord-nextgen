import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Expert m02, The shell and which of three things governs.
# Digest SECTION 26 only. 15 questions.

q(0, "On the bottom course of this tank the engine returns 0.214385 in at the design condition, 0.218926 in at the test condition and a required thickness of 0.218926 in. What has decided the answer?",
 "The hydrostatic test, because the required thickness is the largest of the two computed conditions and the stated minimum plate.",
 ["The product, because a specific gravity of 0.912400 is the input the course was run at.",
  "The stated minimum plate thickness of 0.187500 in, which is the floor the engine applies.",
  "An average of the two conditions, which is what the one-foot method forms."],
 "The engine returns hydrostatic test as the governing word on that row, and 0.218926 in is the test thickness rather than the design thickness of 0.214385 in.")

q(2, "Across the gravity sweep on the bottom course the test thickness sits at 0.218926 in on every row. Why does that column never move?",
 "The test is always water, and water does not care what the tank will eventually hold.",
 ["Because the test thickness is clamped at the stated minimum plate thickness of 0.187500 in, so it cannot fall below it or rise above it while the product moves.",
  "Because the engine runs the test condition once and reuses it for every course, which is why one figure is carried down the whole of that column.",
  "Because the sweep holds the head constant at 34.600000 ft, and holding the head fixed fixes both of the computed thicknesses on the row."],
 "The design column climbs from 0.129233 in at a gravity of 0.550000 to 0.270214 in at 1.150000 while the test column stays at 0.218926 in throughout.")

q(1, "The digest reports that the water test takes the bottom course of this tank below a gravity of 0.931727. How was that figure obtained?",
 "By bisecting the governing word the engine returns, narrowing the interval until the word changed.",
 ["By reading it from the API 650 band table the package carries for the diameter of this tank.",
  "By interpolating linearly between the design thickness at a gravity of 0.912400 and the design thickness at 1.000000, which is the pair of rows the crossover falls between on the sweep.",
  "By rearranging the one-foot relation for the gravity at which the two computed thicknesses are equal, which is an exact solution rather than a search."],
 "Nothing in the package publishes 0.931727 as a threshold, because it is a property of this geometry and this test condition rather than a published quantity.")

q(3, "Which two rows of the gravity sweep bracket the reported crossover of 0.931727?",
 "The row at 0.912400, governed by the hydrostatic test, and the row at 1.000000, governed by product design.",
 ["The row at 0.850000 and the row at 0.912400, which are the last two rows before the required thickness stops tracking the test column.",
  "The row at 1.000000 and the row at 1.150000, which are the two rows on which the design thickness stands above the test thickness of 0.218926 in.",
  "The row at 0.750000 and the row at 0.850000, where the design thickness passes 0.187500 in and the stated minimum stops being the largest of the three."],
 "The governing word is hydrostatic test at 0.912400 and product design at 1.000000, so the change lies between them and 0.931727 is inside that interval.")

q(2, "Where does the minimum shell plate thickness of 0.187500 in on this tank come from?",
 "It is a value the caller stated, which the engine applies and names in the result.",
 ["It is read from the API 650 band table for this tank diameter, which the engine carries so that a minimum never has to be supplied by a caller at all.",
  "It is the thinnest plate the one-foot method can return at the head of the top course, so the engine takes it as a floor for every course below that one.",
  "It is a default the engine falls back on when no minimum is supplied, chosen so that a shell is never specified thinner than a plate a fabricator will roll."],
 "The engine says so: API 650 bands the minimum by tank diameter and this package does not carry that band table, so the value in force is the caller's.")

q(0, "Four of the five courses on this tank come back at 0.187500 in. What is the engine telling a reader who sees that?",
 "That neither computed condition asks for that much plate on those courses, so the stated floor is the largest of the three candidates.",
 ["That the head on those four courses is too small for the one-foot relation to be applied, so the engine substitutes the floor.",
  "That the four courses were not evaluated at the test condition, since a test condition below the floor is not computed.",
  "That the stated minimum has been used as a starting value and refined upward on each of the four."],
 "On course 5 the computed thicknesses are 0.010209 in and 0.010425 in, and the required thickness is still 0.187500 in because the floor governs.")

q(1, "The engine returns five courses for this tank. What rule produced that count?",
 "One course per whole or part course height in the shell height, taken as the ceiling of the shell height divided by the course height.",
 ["One course per whole course height that fits inside the shell height, with any remainder added to the topmost full course.",
  "One course for every eight feet of design liquid level, which is why the count follows the level rather than the shell.",
  "One course per row the engine can evaluate at both conditions, so a course whose thickness falls below the floor is not counted."],
 "The fifth course runs from 32.000000 ft to 36.000000 ft and is shorter than the four below it, and it counts because the rule takes a part course as a course.")

q(3, "Why can a reader be sure the bottom course of a shell computed this way is the thickest?",
 "The head falls as the courses go up, both thickness relations are linear in it, and the stated minimum is a floor, so the required thickness cannot increase upward.",
 ["Because the engine sorts the courses by required thickness before it returns them, which puts the thickest at the bottom of the table.",
  "Because the bottom course is the only one evaluated at the hydrostatic test condition, and a test condition always asks for more plate.",
  "Because the bottom course is the tallest, and the one-foot method scales the thickness with the height of the course it is applied to."],
 "The engine returns that as a property of its method and sets its own flag to true for it, which is a claim a reader can check against the table rather than a single result.")

q(0, "On this tank one course is governed by the hydrostatic test and four by the stated minimum plate thickness. What does the pair of counts rest on?",
 "One courses array, with the governing word the engine returns deciding which count a course falls into.",
 ["Two separate sweeps, one run at the test condition and one run against the floor.",
  "The required thickness column, with any course standing above 0.187500 in counted as a test case and every other course counted against the floor.",
  "The head column, with the courses whose head is taken below the design liquid level counted separately from the courses above it."],
 "Both counts are taken over the same courses array, and the rule is that a course counts when the engine returns that governing word, which is what tells the two apart.")

q(2, "The engine writes a note wherever the water test decides a course. Which sentence is it?",
 "`the water test governs this course, not the product: a light product does not stress the shell as hard as the water it will be tested with, and designing for the product alone would under-thickness it`",
 ["A note saying that the product design thickness has been superseded by a test value and that the test value is the one to procure plate against, with the design figure retained beside it for reference on any later change of service.",
  "A note saying that the hydrostatic test head is taken from the design liquid level and that a tank tested to a different level has to be re-run before the thickness is used.",
  "A note saying that the water test is the governing case on every tank below the diameter at which the variable design point method takes over from the one-foot method."],
 "The message is quoted as the engine writes it, because that is the sentence a user reads on the screen, and it names the failure it exists to prevent.")

q(1, "A tank is designed on its product alone and the product is lighter than water. What has gone wrong?",
 "The shell is thinner than the hydrostatic test will demand of it, and the test is not optional.",
 ["Nothing, as long as the product gravity is above the crossover of 0.931727, because above that gravity the product is the governing condition on the bottom course anyway.",
  "The thickness comes out too great rather than too small on a light product.",
  "The shell is sound but the courses are counted wrongly, because the course count follows the product head rather than the shell height when the design case governs."],
 "On the sweep the design thickness at a gravity of 0.550000 is 0.129233 in where the test asks for 0.218926 in, and the required thickness is the larger of the two.")

q(3, "The floor on this tank is lowered until no course is governed by it any more. Which of the engine's notes stops being written?",
 "The one beginning `neither the product nor the water test needs this much plate`, because it is written where the stated minimum governs.",
 ["The note about the one-foot method, since that note is attached only where a computed condition rather than a stated floor is what decides a course of the shell.",
  "The note that names the provenance of the stated minimum, since a minimum that governs nothing is no longer a value in force.",
  "The note about the water test, since a lowered floor moves the crossover gravity and takes the bottom course with it."],
 "That note names the value in force and the condition it beat, so it belongs to the rows where the required thickness sits above both computed thicknesses.")

q(2, "What does the note about the one-foot method oblige an engineer to do?",
 "Check the tank diameter against the standard, because the diameter at which the variable design point method is required is not carried here.",
 ["Re-run the shell at the variable design point method, which the engine offers as a second mode for any tank standing above the diameter limit the standard sets.",
  "Treat the thickness as an extrapolation, in the way a thermal rate above the stated capacity limit is labelled an extrapolation.",
  "Add a corrosion allowance to every course, since the one-foot method returns a bare thickness."],
 "The relation implemented is the one-foot method and it is implemented correctly. What the package cannot tell you is where the method's own range ends.")

q(0, "The bottom course of this tank carries a head of 34.600000 ft while its own top is at 8.000000 ft. How is the head being measured?",
 "From the design liquid level down to a point in the course, so the head is a depth below the liquid rather than a course height.",
 ["From the bottom of the tank up to the top of the course, which is why the head on the top course is the smallest.",
  "From the design liquid level down to the top of the course below, which is what the one-foot offset in the name refers to, so each course is measured against the course lying beneath it.",
  "From the top of the shell down to the bottom of the course, so the head is the plate standing above it."],
 "The head on course 5 is 2.600000 ft where the course itself runs from 32.000000 ft to 36.000000 ft, which only makes sense as a depth below the liquid.")

q(1, "What is the limit of the bisection method this module teaches?",
 "It finds a boundary the engine has, and there is nothing to converge on where the engine refuses to answer at all.",
 ["It cannot resolve a boundary more finely than the sweep rows either side of it, so a crossover is only ever known to the width of the coarsest interval the table happens to carry.",
  "It works on a returned number and not on a returned word, so a result that answers in a word has to be turned into a number before a boundary can be found in it.",
  "It assumes the word changes only once, so a second change further along is hidden."],
 "The crossover at 0.931727 was found by asking the engine which side of the boundary it was on, and a quantity the engine withholds offers no such answer to narrow.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/advanced/fc8a_m02.json', expect_n=15)
finish()
