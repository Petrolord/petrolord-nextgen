import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Expert m02, What the Module Does Not Have. Digest sections 14, 21, 22 and 23.

q(1, "A reader arrives at this studio with an inspection question. What does the engine have for it, and what does it lack?",
 "A remaining life against a stated corrosion allowance. It has no interval, no risk basis and no inspection standard of any kind.",
 ["A remaining life with an interval derived from it by the design life, and the risk basis underneath that interval is the one part `NOT_PROVIDED` records as absent.",
  "A wall shear with a film risk word beside it, from which the studio schedules the next look, leaving only the retirement thickness for the reader to supply.",
  "Nothing whatever, which is why an inspection interval sits in `NOT_PROVIDED` beside the minimum thickness."],
 "A remaining life and an inspection interval are different quantities. One divides what is left by a rate, the other is a decision about when to look, and the second needs a method the first cannot supply. For the fitness-for-service question the engine has nothing at all.")

q(3, "Most refusals in this module say an input is wrong or missing. What does the refusal on an allowance that is already consumed say instead?",
 "That the input is fine and the module is the wrong tool, because a line whose allowance is gone has become an inspection and fitness-for-service question.",
 ["That the consumed depth arrived as a negative number, which is the guard the remaining-life door applies before it divides anything at all.",
  "That the remaining life would come out negative, so the door issues a life of zero years and a failing verdict rather than a number nobody could act on.",
  "That the corrosion allowance box was left blank, which is the refusal the door also raises for a zero allowance and for an allowance that is not a number."],
 "The door returns neither a negative life nor a zero one. It says the question has changed, and this module carries no inspection method and no fitness-for-service method of any kind.")

q(0, "This course uses the word integrity narrowly and says so wherever the word appears. What does it mean here?",
 "One arithmetic: a corrosion allowance divided by a rate, and nothing beyond that.",
 ["An assessment of whether the line is fit for service, reached from the remaining life and the corrosion allowance the caller supplied together.",
  "A minimum wall thickness the studio holds the consumed depth against, which is what turns a remaining life into a retirement decision on a real pipe.",
  "A schedule of when the line should next be inspected, which the studio derives by setting the remaining life against the stated design life."],
 "A remaining life of 36.112878 yr on one stream and 0.161915 yr on another is that division and nothing more. The word invites four expectations the module cannot meet, which is why the narrow reading is stated every time.")

q(2, "What does the remaining-life door return when it is handed a rate of zero?",
 "No life, no verdict, `unbounded` true, and a note telling the reader to find out why the rate is zero before reading it as a pass.",
 ["An unbounded life with a passing verdict, since a line losing no metal meets any design life that could be asked of it.",
  "A refusal naming the rate, in the same shape as the refusal it raises for a negative rate and for a rate that is not a number.",
  "A life of zero years and a failing verdict, because a rate the module cannot explain is treated as the most limiting case available."],
 "`remainingYears` is null and `meetsDesignLife` is null. The strongest reassurance on the screen would otherwise arrive from the weakest input, and the golden's own zero-rate row records the same shape.")

q(3, "Four separate paths reach a rate of zero, and a reader should be able to list them. Which set is right?",
 "An oil-wet wetting regime, a stream with no CO2 in it, a corrosion inhibitor at 100 percent efficiency and 100 percent availability, and a typed zero CO2 mole fraction.",
 ["A blank CO2 box, a blank temperature box, an oil-wet wetting regime, and a corrosion inhibitor at 100 percent efficiency and 100 percent availability.",
  "A pH below the reference, a blank velocity, a stream with no CO2 in it, and a corrosion inhibitor at 100 percent efficiency and 100 percent availability.",
  "A wall shear above the film-stripping threshold, an oil-wet wetting regime, a typed zero CO2 mole fraction, and a stream with no CO2 in it."],
 "The blank boxes and the pH below the reference are refusals rather than zero rates, and a shear above the threshold removes the corrosion inhibitor credit and raises the rate. A typed zero is a positive assertion and a blank box is a question the engine cannot answer.")

q(1, "Which course owns the erosional velocity criterion, and what does this engine have in its place?",
 "The Casing and Tubing Design course at its Expert tier. This engine has no erosional-velocity criterion at all and computes a wall shear for a different purpose.",
 ["The Pipeline Network course at its Associate tier. This engine has no erosional-velocity criterion and reads the wall shear against the same limit that course publishes.",
  "The Torque and Drag course at its Expert tier. This engine has no erosional-velocity criterion and uses the film risk word as a stand-in wherever one is needed.",
  "This module itself, through the film risk word, which is why the Casing and Tubing Design course cites this studio when a velocity limit is wanted."],
 "The criterion is cited again in Nodal Analysis and in Gas Well Deliverability. The repair deliberately did not add one here, and the wall shear this module computes answers whether a corrosion inhibitor film survives.")

q(2, "The wall shear in this module carries a coloured risk word. What question does that pairing answer?",
 "Whether a corrosion inhibitor film survives on the steel. This engine has no erosional-velocity criterion, so a low risk word is not clearance on velocity.",
 ["Whether the line is running above its erosional velocity, which is the reading the coloured word was added to the summary rail in order to give.",
  "Whether mechanical erosion is removing metal, which the module estimates from the shear once the film-stripping threshold of 100.000000000000 Pa is passed.",
  "Whether the flow has reached the turbulent branch of this module's friction factor, which is the switch the coloured word turns over at."],
 "The shear meets two held thresholds, at 100.000000000000 Pa and 50.000000000000 Pa. Above the higher one the film is taken to be stripped and the corrosion inhibitor credit is removed from the rate, which is a verdict about a film. The Pipeline and Line Sizing course computes its own friction factor and its own Reynolds number on a different correlation with a different transition, so the two will not agree on the same pipe.")

q(0, "How much of mechanical erosion does this module model?",
 "None of it. There is no sand rate, no particle size and no impingement angle here, and no erosional-velocity criterion either.",
 ["The impingement part of it, through the wall shear, which is why the shear is reported beside the rate rather than folded into it.",
  "The solids part of it, once a sand rate is supplied, and the module falls back on the wall shear when no sand rate has been entered.",
  "All of it above the film-stripping threshold of 100.000000000000 Pa, which is where erosional wall loss is taken to begin in this engine."],
 "Mechanical erosion means wall loss from entrained solids or from liquid impingement. The one rate this engine returns is a general uniform corrosion rate, and a line passing every check here may still be losing metal that way with nothing in the module able to say so.")

q(1, "How should this module's friction factor and this module's Reynolds number be read against the Pipeline and Line Sizing course?",
 "As a second set. This module has its own, on a two-branch form switching at Reynolds 4000.000000, and the line sizing course computes its own with a different correlation and a different transition.",
 ["As the same numbers reached twice. Both modules run the same correlation, so the two agree on any pipe and either one may be quoted as the platform's answer.",
  "As a duplicate the repair removed. The line sizing course now owns both quantities and this module reads its friction factor across rather than forming one.",
  "As a layered pair. The line sizing course supplies the laminar branch and this module supplies the turbulent branch, which is what the Reynolds 4000.000000 switch selects between."],
 "The two will not agree on the same pipe and the engine says so in its own docstring. Removing the duplicate is a cross-module decision the repair deliberately left alone, so this course names the seam rather than hiding it.")

q(0, "The engine returns one rate. What is a reader entitled to take from it about the worst spot on the line?",
 "Nothing. It is a general uniform rate, and the engine names a localised-attack rate among the things it does not provide.",
 ["A conservative bound, since a uniform rate is above the local rate wherever the film is intact.",
  "A pitting rate wherever the regime is sulphide, which is the branch the module carries for localised attack and reports through the withheld block.",
  "A weld and top-of-line rate, since the correlation is fitted on a general surface and the engine applies the wetting regime factor to cover the rest."],
 "Uniform corrosion and localised attack fail a line in different ways and on different timescales, and a single rate has no geometry in it. The engine cannot warn a reader who takes it the other way, because it has no localised model to compare against.")

q(3, "The sour flag on a screening comes back true. What does that value commit the engine to?",
 "That the H2S partial pressure sits above a threshold whose own value the engine declares held in `thresholdHeld`.",
 ["That the stream needs a sour-service material, which the engine then names once the severity region has been resolved from the partial pressure.",
  "That sulphide stress cracking is expected at these conditions, which is the criterion the threshold was placed to separate in the first place.",
  "That the CO2 rate model has stopped describing the surface at these conditions."],
 "The door compares one partial pressure against one threshold and reports the comparison in bar and in psia with the decades above it. A true flag does not mean the line will crack and a false one does not mean it will not.")

q(2, "Three studios on this platform use the phrase corrosion allowance. How do they differ?",
 "This studio consumes an allowance to give a life, while the Pipeline and Line Sizing studio adds one to a pressure-containing wall and the Storage Tank studio adds one to a shell course.",
 ["All three add an allowance to a wall, and this studio is the only one of them that also reports what is left of it after a stated consumed depth.",
  "All three read the same allowance from a shared registry, which is what keeps a life computed here against a wall sized in one of the other two.",
  "This studio and the Storage Tank studio both consume one, while the Pipeline and Line Sizing studio is the only one of the three that sizes a wall around it."],
 "There is no link between them and no minimum thickness anywhere in this module, so the wall this studio is eating is not the wall either of the other two sized. That is recorded, it is stated in the studio's help, and it is deliberately left unwired.")

q(0, "This course never writes the bare word erosion when it means wall loss. What does it write instead, and why?",
 "Mechanical erosion or erosional wall loss, because in the Basin Modelling course erosion is a geological process.",
 ["Erosion corrosion, because the Casing and Tubing Design course owns the erosional velocity criterion and keeps the bare word for its own limit.",
  "Film stripping, because above the 100 Pa threshold the wall shear strips the inhibitor film, and that is the only erosion this module models.",
  "Erosional velocity, because the one quantity the word could name in this studio is a velocity limit, and naming the limit avoids implying a wall loss."],
 "In the Basin Modelling course erosion is material removed from a sedimentary column over geological time, and nothing in that is about steel. This module models no mechanical erosion and has no erosional-velocity criterion, and every use of the term carries that statement. Film stripping is a chemistry verdict about a film.")

q(3, "The Well Integrity and Plug and Abandonment course is the one live course that points at this one. What does it say, and what follows?",
 "It states in its own scope that it carries no corrosion model, no wall loss and no remaining life, and this course fills exactly that refusal.",
 ["It states that its barrier envelope already carries a corrosion allowance, so this course computes the life of that envelope and reports it back into the barrier logic.",
  "It states that it owns wall loss on abandoned wells only, so this course covers lines in service and the two split the same calculation between them.",
  "It states that it cites this module for a remaining life, so the barrier verdict there is reached from the allowance arithmetic computed here."],
 "A barrier envelope is a different object from a corrosion allowance and neither term substitutes for the other. A lesson here may name that course as the owner of barrier logic and must not borrow its vocabulary.")

q(2, "On one of the course's teaching streams the allowance is 3.175000 mm with 0.400000 mm consumed, the rate is 1.676428 mm/yr, the remaining life is 1.655305 yr and the required allowance is 33.528563 mm. What do those four numbers rest on?",
 "A division and a multiplication over a typed allowance, a typed consumed depth and the correlation's rate, and none of them knows the wall thickness or the pipe grade.",
 ["The pin table alone, since a remaining life is itself one of the thirty constants the course measures out of the engine and pins against a literal.",
  "A minimum thickness the module computes from the allowance, which is what makes the required allowance of 33.528563 mm a statement about a real wall.",
  "The Barlow relation, which this module applies with a default design factor so that the allowance can be checked against the wall it is taken off."],
 "The arithmetic inside the door is exact, and the rate it divides by inherits whatever the correlation rests on. On another stream the same allowance at 0.076842 mm/yr gives 36.112878 yr, a required allowance of 1.536848 mm and a shortfall of 0.000000 mm.")

emit(Q, '/root/wt-fc9-nextgen/tools/course-banks/corrosion/advanced/fc9a_m02.json', expect_n=15)
finish()
