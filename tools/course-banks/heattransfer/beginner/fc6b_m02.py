import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Associate m02, The Stream and Its Capacity Rate. Written from digest.txt
# Section 2: the capacity rate as the whole of what a balance knows about a
# stream, the duty a stated outlet sets, the same duty stated three ways with
# the basis the engine reports, and the smaller capacity rate that governs.

q(1, "A capacity rate is a mass flow multiplied by a heat capacity. What does an energy balance keep of a stream once that multiplication is done?",
 "Nothing else at all. The capacity rate is the whole of what the balance knows about that stream.",
 ["The mass flow as well, since the balance needs it again to place the duty on the right side of the exchanger.",
  "The heat capacity as well, to be re-applied once the duty is known.",
  "The fluid the stream is made of, because the balance carries it through to the film and the fouling allowance later."],
 "Two streams with the same capacity rate behave identically in every equation in this module, whether one is a lot of a fluid with a small heat capacity or a little of one with a large heat capacity."),

q(3, "The studio hot stream runs 50000.0000 lb an hour at 0.550000 Btu per lb per degF. What is its capacity rate, and in what units?",
 "27500.0000 Btu an hour per degF.",
 ["2750000.0000 Btu an hour per degF.",
  "27500.0000 Btu an hour per lb per degF.",
  "50000.0000 Btu an hour per degF, since the heat capacity is a property rather than a rate."],
 "A mass flow times a heat capacity, and the units follow the multiplication: lb an hour times Btu per lb per degF is Btu an hour per degF."),

q(0, "Two streams carry different mass flows and different heat capacities and arrive at the same capacity rate. What can any equation in this module use to tell them apart?",
 "Nothing at all, because the balance keeps only the product, and every equation downstream of it reads that product rather than the two figures behind it.",
 ["The heat capacity, which the engine reads again at the outlet temperature.",
  "The temperature change each one shows, since a heavier flow moves more slowly for a given duty.",
  "The basis key, which names the stream the balance worked from."],
 "The studio cold stream is 80000.0000 lb an hour at 1.000000 Btu per lb per degF and the studio hot stream 50000.0000 at 0.550000. Each one reaches the balance as one number, and the multiplication throws the rest away on purpose."),

q(2, "The studio case gives two capacity rates, two inlet temperatures and a hot outlet of 200.000000 degF against a hot inlet of 300 F. What does the balance produce from that, and in which order?",
 "The duty first, at 2750000.0000 Btu an hour, and then the cold outlet from that duty, at 134.375000 degF.",
 ["The cold outlet first, at 134.375000 degF, and then the duty from the cold rise, at 2750000.0000 Btu an hour.",
  "The duty and the cold outlet together from one expression, at 2750000.0000 Btu an hour and 134.375000 degF, since neither is derived from the other.",
  "The duty alone, at 2750000.0000 Btu an hour, with the cold outlet left to a later door."],
 "One stated outlet gives the hot drop, the hot drop and the hot capacity rate give the duty, and that duty divided by the cold capacity rate of 80000.0000 Btu an hour per degF gives the cold rise. Three numbers came out of one."),

q(1, "The balance answers with five keys and one of them is the basis. What does the basis key say?",
 "Which of the three statings the engine worked from, in words, so the reading is reported rather than inferred.",
 ["Which arrangement the duty was computed under, so a reader knows whether a parallel test or a counter test was applied to it.",
  "Which of the two streams governs the balance, which is the one whose temperature moves furthest for the duty.",
  "Which of the four terminal temperatures the engine treated as fixed while it iterated the other three."],
 "On the studio case it reads hot outlet. Two people with the same screen open can disagree about a duty entirely because one typed a cold outlet and the other typed a hot one, and this key ends that argument."),

q(0, "On the studio streams, the hot outlet, the cold outlet and the duty are each stated in turn. What moves across those three answers?",
 "Only the basis, which reads hot outlet, then cold outlet, then stated duty. The duty and both outlet temperatures are the same in all three.",
 ["The duty is the same in all three at 2750000.0000 Btu an hour, and the outlet that was not stated moves a little in each case.",
  "Nothing moves at all, including the basis, because the engine reports the stating it prefers rather than the one it was given.",
  "The duty moves between the three statings, because a stated duty is taken as given while a stated outlet is worked through the capacity rates."],
 "The duty is 2750000.0000 Btu an hour, the hot outlet 200.000000 degF and the cold outlet 134.375000 degF on every one of the three rows. They are three views of one state."),

q(2, "A study states a duty of 3200000 Btu/hr on the studio hot stream and a hot outlet of 200 F at the same time. What does the balance do?",
 "It refuses, and quotes back the 183.6364 F that duty would leave the stream at beside the 200 F that was given.",
 ["It answers on the stated duty, because a duty is the more direct input of the two and the outlet is then recomputed from it.",
  "It answers on the stated outlet, because a terminal temperature outranks a duty here.",
  "It answers with the duty the two inputs imply between them, which is the midpoint of the duty stated and the duty the outlet sets."],
 "Stating two of the three is an assertion that they agree, and the engine checks the assertion rather than picking a winner. Choosing silently would make the answer depend on a rule nobody wrote down."),

q(3, "Why does the engine refuse that pair rather than preferring one of the two figures?",
 "Because a silent preference makes an answer depend on a rule that is written down nowhere, and a reader cannot tell afterwards which figure was used.",
 ["Because the two figures are in different units, and the module converts nothing silently anywhere.",
  "Because a duty stated beside an outlet is outside the band of the guard that runs first, and every guard in the balance refuses rather than clamping.",
  "Because the check is cheaper than the arithmetic, so a disagreement is caught before any division has been done."],
 "The message works the outlet the stated duty implies, prints it beside the outlet typed, and tells the reader to state one of them."),

q(1, "ORON states its hot outlet, the same basis as the studio case. What comes out of its balance?",
 "A duty of 5046800.0000 Btu an hour, with its cold stream leaving at 167.515873 degF.",
 ["A duty of 5046800.0000 Btu an hour, with its cold stream leaving at 134.375000 degF.",
  "A duty of 2750000.0000 Btu an hour, with its cold stream leaving at 167.515873 degF.",
  "A duty of 5046800.0000 Btu an hour, with its hot stream leaving at 167.515873 degF."],
 "ORON is the four-pass exchanger this course carries beside the studio case. The two share nothing but the method, so no figure from one belongs in the other."),

q(2, "On the studio case the hot capacity rate is 27500.0000 and the cold one 80000.0000 Btu an hour per degF. Which stream's temperature moves further, and why?",
 "The hot stream, because the same duty passes through both and the smaller capacity rate needs more degrees to carry it.",
 ["The cold stream, because the larger capacity rate absorbs more Btu an hour and so travels further in temperature.",
  "Whichever stream is stated, because the stated outlet fixes one change and the other follows from the duty.",
  "Neither, because the two changes are equal by the balance and only their starting temperatures differ."],
 "The hot stream falls from 300 F to 200.000000 degF while the cold rises from 100 F to 134.375000 degF. That follows from one duty dividing by two different capacity rates."),

q(0, "The engine reports a capacity ratio of 0.343750 on the studio case. How is it formed, and what does that fix about it?",
 "The smaller capacity rate over the larger, which is why it is never above one.",
 ["The hot capacity rate over the cold one, which is why it is below one whenever the cold stream is the larger.",
  "The cold rise over the hot drop, which is why it is dimensionless and never above one.",
  "The governing capacity rate over the duty, which is why it carries the units of a reciprocal temperature."],
 "It is 27500.0000 over 80000.0000 on this case. Defined smaller over larger, so the definition rather than the case is what keeps it at or below one."),

q(3, "Where does the capacity ratio enter the chain this tier walks?",
 "Nowhere. Sizing asks for a duty, a driving force and a coefficient, and never asks which stream is the smaller.",
 ["In the area, which is the duty over the coefficient, the correction factor and the capacity ratio.",
  "In the log mean, because the ratio decides which two ends the driving force is built from.",
  "In the tube count, because the ratio sets how many passes a bundle needs to carry the governing stream."],
 "Knowing which stream governs is where the rating question begins, and rating belongs to a later tier. This tier identifies the governing stream and carries its capacity rate forward."),

q(1, "ORON's hot stream is 45880.0000 and its cold stream 110880.0000 Btu an hour per degF. What may a reader write down about ORON from those two figures?",
 "That the hot stream is the smaller one and so the governing one, and no more than that.",
 ["That the hot stream governs, and that ORON's capacity ratio is the smaller figure divided by the larger.",
  "That the cold stream governs, being the one carrying the most heat.",
  "That neither governs until the duty is known, because the governing stream depends on which outlet was stated."],
 "The direction is readable straight off the capacity rate table. This course does not print a capacity ratio for ORON, because the engine was not asked for one there, and a figure made by dividing two columns is a figure nothing in this module stands behind."),

q(2, "What simplification is inside every capacity rate in this module?",
 "That the heat capacity is constant across the whole temperature range of the exchanger.",
 ["That the mass flow is the same at both ends of the exchanger, which fails as soon as any fluid leaks.",
  "That the two streams have the same heat capacity, which is what lets one duty serve both sides.",
  "That the heat capacity was measured on the fluid rather than taken from a table of similar fluids."],
 "A real fluid's heat capacity moves with temperature and this module does not track that. A stream changing phase, or one whose heat capacity moves a lot between inlet and outlet, is a case where the simplification is worth naming."),

q(0, "The capacity rate has a door of its own. What does it answer with, and what does it refuse?",
 "An object carrying one key, the capacity rate, and it refuses a non-positive mass flow with a named string.",
 ["An object carrying three keys, the capacity rate and the two figures it was formed from, and it refuses a heat capacity above one.",
  "A bare number, which is the documented exception to the object contract in this module, and it refuses nothing at all.",
  "An object carrying one key, and it answers a zero mass flow with a zero rather than refusing."],
 "One key, because a capacity rate is a single number with no parts. A stream that is not flowing is not a stream the balance can use, so a non-positive flow is refused rather than answered with a zero."),
emit(Q, '/root/fc-wip-heattransfer/banks/fc6b_m02.json', expect_n=15)
finish()
