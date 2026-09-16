import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Expert m05, What the Method Does Not Know. Digest section 17.

q(2, "The digest lists five things this course teaches as limits and never as answers, while the lessons speak of four held items. How do those two counts fit together?",
 "Four of the five are a figure or a law nobody in this package has read a source for, and the fifth is the provenance of the published cases rather than a figure at all.",
 ["The fifth is the multiphase half, which is absent rather than held, so the lessons drop it from the list of held items and count the remaining four.",
  "The fifth is the transitional band, which the engine bounds at a Reynolds number of 2100 and 4000, and a bounded item is counted as held by the digest and as closed by the lessons.",
  "The fifth is the efficiency multiplier, which the lessons fold into the fully rough friction law Weymouth assumes, because neither of the two is a property of any pipe that anybody entered."],
 "The four are the API RP 14E c factors, the efficiency multiplier, the band between the branches and the friction law Weymouth assumes. The fifth entry records that every published case in this course is synthetic.")

q(0, "The API RP 14E c factors are 100.000000, 125.000000 and 175.000000. What exactly is unchecked about them?",
 "The recommended practice says its own figures are conservative and nobody here has read a source that says how conservative, and the third is labelled operator practice with no publication behind it at all.",
 ["The three figures are correct for the services they name and the engine applies the wrong one to a service it does not carry, so what is unchecked is the lookup rather than the values.",
  "The figures come from a table the wellhead engine owns, so this course has no way to read them at all and records the three it is handed without seeing the source.",
  "The three figures are stated without the units they carry, so an erosional velocity computed from one of them cannot be reproduced without assuming what those units were."],
 "A held item is not a wrong number. These are the figures the industry uses and the derived velocities are arithmetically correct, and what is missing is the reading.")

q(1, "The engine refuses a transmission efficiency at or below zero and above 1.000000. Why does that not settle the efficiency question?",
 "A bound is not a source, so knowing the range a value may take says nothing about which value belongs on a line.",
 ["The bound is applied after the rate is formed, so an efficiency outside it still reaches three of the four transmission forms before the guard is able to catch it.",
  "The bound is stated at a precision of 1.000000, which is coarser than the four decimals a gas rate is printed at, so it cannot discriminate between the values a designer would choose between.",
  "The bound belongs to General Flow alone, since it is the only form that reports what it settled on, and the other three forms carry no bound on the multiplier at all."],
 "Knowing that a value lies above zero and at most 1.000000 leaves every value in that interval available, and the four transmission forms carry no other statement about it.")

q(3, "The band from a Reynolds number of 2100 to one of 4000 is held for the literature. What is being held there?",
 "The question of what a friction factor in that band should be, since the engine computes on the turbulent branch there and labels the answer transitional.",
 ["The boundary itself, since the engine could draw it anywhere between 2100 and 4000 and the choice of 2100 is what nobody has read a source for.",
  "The laminar law, since it is the branch that stops applying at a Reynolds number of 2100 and nothing anywhere in this package stands behind the form that branch carries.",
  "The regime word, since the arithmetic in the band is sound and only the label the engine attaches to it is the part the package cannot source."],
 "The step across the boundary is 1.603040 times. It is taught as a limit and never graded, and interpolating across it would hand back a curve that looks like every other answer.")

q(0, "The fully rough friction law Weymouth assumes is on the held list even though this course measured it. Why does measuring it not take it off the list?",
 "The measurement extracts the law out of the engine and nothing in the package sources the law itself, so what survives is the qualitative statement rather than a figure to grade.",
 ["The measurement was made on four bores only, so the law is held until the remaining published bores have been swept and the implied friction factor confirmed on each of them.",
  "The measurement depends on the General Flow friction factor, which the digest records as failing to settle on these four bores, so the implied figures inherit an open question.",
  "The measurement is stated at ten decimals where the goldens work to four, so the figures cannot be compared against an independent implementation and stay unchecked for that reason."],
 "Section 15 measures it by asking General Flow what friction factor would make it agree. What the four rows establish on their own is that Weymouth's friction depends on the diameter.")

q(2, "What keeps a held item from quietly carrying a graded answer in this course?",
 "Every value that touches one states its own assumption alongside, so every graded erosional figure states its c factor and every graded gas figure states its efficiency.",
 ["The engine refuses to compute any value that depends on a held item, which is why an erosional velocity is reported as a limit rather than as a result of the sizing chain.",
  "The graded fields are drawn from the wall and the pigging chains only, since neither of those touches a c factor, an efficiency or a friction correlation at any step.",
  "The tolerance on every graded field is widened until it spans the range a held item could move the answer over, so a held item cannot change whether an answer scores."],
 "That turns a held item from a hidden dependency into a stated condition, and a stated condition is something a reader can disagree with.")

q(3, "A reviewer proposes dropping the c factors from the course entirely on the grounds that they are unsourced. What is wrong with that?",
 "These are the best figures available and an erosional velocity at a stated c factor is a complete answer to a stated question, so the course teaches them and declines only to let one carry a graded conclusion.",
 ["Nothing is wrong with it, since a value nobody stands behind cannot support an engineering decision and removing it is the only treatment consistent with holding it.",
  "The c factors are bounded by the engine in the way the efficiency is, and a bounded value has a source in the bound, so they were never truly unsourced in the first place.",
  "The erosional check would then have no ceiling at all, and a sizing chain with no ceiling would accept any velocity, which is a worse failure than an unsourced one."],
 "Promoting a held figure by repetition is the first mistake and refusing to use it at all is the second. A c factor of 100.000000 quoted in three documents starts to look like a standard.")

q(1, "Every published case behind this course comes from an independent oracle written in Python from the same physics, in SI where the engine works in field units. What can that arrangement prove?",
 "That neither implementation made an arithmetic slip or dropped a conversion, because two encodings in different unit systems disagree the moment one of them does.",
 ["That the physics being encoded is the physics of a real pipeline, since an independent implementation reaching the same answer is the strongest confirmation available short of a field test.",
  "That the engine's field-unit conversions are correct, which is the only class of error two implementations can differ on once they have been written from one set of equations.",
  "That the engine converges, since the oracle solves the same implicit relations by a different method and agreement between two methods is what a convergence check would establish."],
 "Agreement between two implementations is evidence about arithmetic. The published wall, pigging and friction cases in this course all carry a golden of that kind.")

q(0, "What is the one class of error a synthetic golden cannot catch?",
 "A method that is wrong in both files, because the oracle then agrees with the engine and the two are confidently wrong together.",
 ["A unit error, because the oracle works in SI and the engine in field units, so a conversion applied twice appears in both files and cancels out of the comparison.",
  "An error in a held item, because neither file has read a source for the c factors or the efficiency and both encode whatever figure the package handed them.",
  "An error at a boundary, because the oracle carries no guards at all and so cannot be asked what it does on either side of one."],
 "If the physics being encoded is the wrong physics, agreement proves nothing about the world. No measured pipeline is in this course.")

q(2, "Why does the oracle work in SI units when the engine it checks works in bpd, inches, feet, psia and degrees Rankine?",
 "Because a conversion that has been dropped or applied twice cannot survive being written out in two different unit systems, which is the error the goldens exist to catch.",
 ["Because the published transmission forms are stated in SI and the oracle reproduces them in the units they were published in, which removes one step from the comparison.",
  "Because the graded capstone fields are stated in SI, so the oracle produces them directly and the engine's field-unit answers are converted once before they are compared.",
  "Because SI avoids the gravitational constant the field form has to carry, and a constant that never appears cannot be typed in wrongly."],
 "Two people encoding the same physics in different unit systems disagree the moment one of them makes an arithmetic slip. Field units are what the engine works in and what this course reports.")

q(3, "One barrel was measured out of two modules by asking each module a question about itself. What were the two questions, and what came back?",
 "The flow area times the length over the line volume from lineHydraulics, and the erosional velocity times the area times the seconds in a day over the erosional rate from chokePerformance, both returning 5.6145833333333.",
 ["The line volume over the flow area times the length from lineHydraulics, and the erosional rate over the erosional velocity times the area from chokePerformance, which returned figures whose ratio is 1.0000000000000.",
  "The swept volume at a holdup of 1.000000 over the line volume from lineHydraulics, and the same ratio taken at the erosional ceiling from chokePerformance, both returning 5.6145833333333.",
  "The published golden volume against the engine volume in each of the two modules, which is the only measurement available that does not read either source file."],
 "The ratio of the two is 1.0000000000000. Neither figure was read out of a source file, which is what makes each one a measurement of the module rather than a reading of its code.")

q(1, "The two modules were one import apart inside a single chain and were using different barrels. How did the goldens settle which half to change?",
 "Both modules' own oracles already worked from the definition, so the goldens said which half of the disagreement was right before anyone asked them.",
 ["The goldens were re-cut against the figure the larger of the two modules carried, which made lineHydraulics the reference and chokePerformance the half that moved.",
  "The goldens could not settle it, so the package took the value that is exact by definition and re-cut both oracles against it afterwards.",
  "The goldens flagged the ratio of the two figures as differing from 1.0000000000000, which named the disagreement without ever saying which of its two sides was the wrong one."],
 "The value kept is exact by definition rather than by measurement: forty-two gallons of two hundred and thirty-one cubic inches each, over the seventeen hundred and twenty-eight cubic inches in a cubic foot.")

q(2, "What does this engine contain of the multiphase half?",
 "None of it. There is no flow regime, no slip, no holdup correlation and no slug model anywhere in it.",
 ["The holdup correlation only, which is why a swept volume can be computed at all, while the flow regime and the slug model belong to the Suite app code.",
  "The slug model only, since the swept volume and the interval a catcher allows are both slug quantities and both are computed inside this engine.",
  "The flow regime only, which is reported as the regime word beside the friction factor, while slip and holdup are taken as inputs wherever they are needed."],
 "Two-phase pressure drop, flow regime and holdup are the Suite Beggs and Brill correlation, which is app code. Wherever this engine needs a holdup it takes one as an input.")

q(0, "Why is an absence harder for a reader to notice than a held item?",
 "A held item announces itself in writing, and an absence has no field to attach a warning to, so a two-phase line returns a velocity, a Reynolds number, a friction factor and a pressure drop that are all arithmetically correct for a single-phase fluid.",
 ["An absence is refused by the engine in the ordinary way, so a reader sees only an error string and has no figure in front of them to question.",
  "A held item is graded and an absence is not, so a reader meets the held item in the capstone and never meets the absence at all.",
  "An absence is recorded in the digest under a different heading from the held items, and a reader working from the lessons alone never reaches that part of the digest."],
 "The engine cannot detect it, because a mixture density is a perfectly ordinary number. Nothing in the answer says the single-phase result is the wrong model rather than an imprecise one.")

q(3, "A report states that the golden suite for this engine is green and describes that as validation of the line sizing method. What has been overstated?",
 "Green means the engine agrees with an independent implementation of the same assumptions, and calling that agreement with measured pipeline performance changes the claim entirely.",
 ["Green means every published wall, pigging and friction case reproduces, which says nothing at all about the cases that were never published, so the overstatement is one of coverage rather than one of kind.",
  "Green means the engine agrees with the oracle to the four decimals the goldens are stated at, and the overstatement is the precision the word validation implies.",
  "Green means the arithmetic closed on the day the goldens were cut, and since nothing here reads a clock the overstatement is that the result is current."],
 "The goldens arbitrate between implementations and they do not speak for any measured pipeline. Dismissing them for the same reason is the opposite mistake, since they found a real defect in a live chain.")

emit(Q, '/root/fc-wip-linesizing/banks/fc2a_m05.json', expect_n=15)
finish()
