import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Professional m03, the pool fire duty.
# Digest sections 14 and 15, at the rendering those sections print.
# The two constants, the exponent and the credit, with what the oracle reaches.

q(0, "What shape does the API 521 pool fire duty have in this engine?",
 "A constant, times an environment factor, times the wetted area raised to a published exponent.",
 ["A constant, times the wetted area, divided by the environment factor.",
  "A constant, times an environment factor, times the wetted area, all raised to a published exponent.",
  "A constant, times the wetted area raised to a published exponent, with the environment factor applied to the relief load afterwards."],
 "Three inputs and two published figures. Which of the two constants applies is decided by a single answer about the plot.")

q(2, "Which single answer decides which of the two pool fire constants the duty uses?",
 "Whether the plot has adequate drainage and firefighting.",
 ["Whether the vessel is insulated to a rated fire standard.",
  "Whether the vessel is read lying down or standing up.",
  "Whether the wetted height reaches the limit the note names."],
 "Insulation and the other credits arrive separately as the environment factor. Drainage and firefighting are the one input that switches the constant itself.")

q(1, "What are the two pool fire constants this engine carries?",
 "21000.000000000000 Btu/hr with drainage and 34500.000000000000 Btu/hr without.",
 ["21000.000000000000 Btu/hr without drainage and 34500.000000000000 Btu/hr with it.",
  "21000.000000000000 Btu/hr with drainage and 34500.000000000000 Btu/hr where the vessel is insulated.",
  "34500.000000000000 Btu/hr in both cases, with drainage entering through the environment factor."],
 "Both are quoted at a wetted area of 1 ft2 and an environment factor of 1, which is the condition under which the constant is the whole answer.")

q(3, "How were those two constants recovered from an engine that does not export them?",
 "By asking for a duty at a wetted area of 1 ft2 and an environment factor of 1, then repeating it with the drainage answer flipped.",
 ["By dividing two duties at the same area and reading the constant off the quotient.",
  "By fitting the duty against the wetted area across the whole sweep and reading the intercept.",
  "By taking them from the published standard, since no question put to the engine can isolate a constant."],
 "At a wetted area of one the area term is one whatever the exponent happens to be, so the answer is the constant alone. That is what makes it a measurement rather than a transcription.")

q(0, "What is the factor between the two pool fire constants, and how is it known?",
 "1.642857142857, computed as the ratio of the two measured constants.",
 ["1.642857142857, typed into the course from the same page the constants came from.",
  "0.820000000000, which is the published exponent carried through the ratio.",
  "It is not a figure this course carries, because a ratio between two published constants is the reader's own invention."],
 "The two constants are measured by calling the engine, and their ratio follows from them. A ratio somebody computed reads exactly like one nobody did, which is why this one is printed.")

q(2, "The pool fire exponent is 0.820000000000. What question recovered it?",
 "The log ratio of two duties at 100 and 1000 ft2, over the log ratio of those areas.",
 ["The quotient of two duties at 100 and 1000 ft2, over the quotient of those areas.",
  "The slope of the duty plotted against the wetted area, at a fixed environment factor and a fixed drainage answer.",
  "The ratio of the duty per ft2 at 50.0000 ft2 to the duty per ft2 at 5000.0000 ft2."],
 "The leading constant never enters that expression, which is what makes it a measurement of the exponent rather than a rearrangement of a duty.")

q(3, "The duty per ft2 runs from 10384.9568 Btu/hr at 50.0000 ft2 down to 4533.1981 Btu/hr at 5000.0000 ft2. Why?",
 "Because the exponent is below one, so total duty grows more slowly than the area does.",
 ["Because the environment factor falls as a vessel gets larger.",
  "Because the constant with drainage applies to the larger areas and the one without applies to the smaller.",
  "Because the larger areas in the sweep are vertical readings and the smaller ones horizontal."],
 "Every row in that sweep holds the environment factor and the drainage answer fixed, so the only thing moving is the area under its published power.")

q(1, "What physical detail is the exponent standing in for, given what the relation does not carry?",
 "That a large vessel is not uniformly engulfed, since the relation has no flame height, pool extent or wind in it.",
 ["That a large vessel loses more heat to its surroundings, since the relation has no ambient temperature in it.",
  "That a large vessel holds more liquid, since the relation has no inventory in it.",
  "That a large vessel is more likely to be insulated, since the relation has no insulation thickness in it."],
 "The fire's whole geometry lives inside one published constant and one published power, which is exactly why this is a screening calculation.")

q(2, "What does the validation oracle actually check about the two constants and the exponent?",
 "That the USC pair follows from the published SI pair with the exponent carried through the unit conversion.",
 ["That the two constants stand in the published ratio to each other at every wetted area.",
  "That the duty per ft2 falls monotonically across the whole area sweep.",
  "That the duty the engine returns matches a pool fire model derived independently in SI."],
 "It checks the unit packaging and it would not notice wrong pool fire physics behind the published pair, because it never leaves that pair.")

q(0, "What follows, in this course, from the fact that the constants and the exponent are held for literature?",
 "Nothing graded in this course reads a fire duty or a fire relief load.",
 ["Nothing in this course teaches the fire case, which is deferred to the tier above.",
  "The fire duty is taught without any figures, since a held item cannot be printed.",
  "The published fire rows are excluded from the set, since a held figure cannot be validated."],
 "A held item is taught as a stated value with its reference named and is kept out of the graded surface. It is question material as a limit rather than as an answer.")

q(3, "On the teaching vessel at an environment factor of 1.000000, what does the drainage answer do to the duty?",
 "It moves it between 4434115.2612 Btu/hr and 7284617.9291 Btu/hr.",
 ["It moves it between 4434115.2612 and 1330234.5784 Btu/hr.",
  "It moves it between 4434115.2612 and 6796981.4402 Btu/hr.",
  "It leaves the duty alone and moves the relief load instead, from 34641.5255 lb/hr upward."],
 "One field, and the duty changes by the factor between the two constants. That answer is a judgment about a plot rather than a measurement, so it belongs in the case record with a reason beside it.")

q(1, "Where the honest position is that nobody knows whether the plot drains, what goes in the box, and why?",
 "False, because the duty that follows is the larger one and a valve sized against it passes the smaller case too.",
 ["True, because the smaller duty is the one the published rows are validated against.",
  "False, because the engine refuses a drainage answer it cannot check.",
  "Either, because the environment factor can be lowered to compensate for whichever answer is used."],
 "A boolean carries no uncertainty, so there is no partial credit for a bund that drains a small spill and is overwhelmed by a large one. The answer has to be defensible on its own.")

q(0, "How does the published fire set show that the two constants have not been transposed?",
 "It carries one geometry at both drainage answers.",
 ["It carries four rows at four wetted areas.",
  "It carries the ratio between the two constants as a column of its own.",
  "It carries a duty per ft2 column on every row."],
 "The two rows at 628.3000 ft2 differ only in the drainage answer, so a module that used the wrong constant on either branch could not reproduce both.")

q(3, "The three published relief-load rows all sit at a relative difference of 5.876e-10. What does the sameness of that figure say?",
 "A constant rounded on its way into print, which every row then inherits equally.",
 ["That the three cases were run at the same duty and differ only in their latent heats.",
  "That the load route converged to the same residual on all three, which is what the rows exist to show.",
  "That the published loads were recomputed from the engine figures, so the rows cannot disagree."],
 "A case-dependent error moves from row to row. One that does not move is arithmetic in the conversion the route performs, which is the same conversion every time.")

q(2, "One published load row reads 99999.9999 lb/hr against an engine load of 100000.0000 lb/hr. What is that?",
 "One number written two ways, so reporting it as a disagreement reports a print format.",
 ["A genuine disagreement at the fourth decimal, which is why the row was kept in the set.",
  "The engine rounding up where the published figure rounds down, which no tolerance can reconcile.",
  "The one row in the set where the load route is outside the range the oracle can reach."],
 "The row runs a duty of 10000000.0000 Btu/hr against a latent heat of 100.000000 Btu/lb, which is a division with a clean answer. What differs is how each side chose to print it.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/intermediate/fc5i_m03.json', label='fc5i_m03', expect_n=15)
finish()
