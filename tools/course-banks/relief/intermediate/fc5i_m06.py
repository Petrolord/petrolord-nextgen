import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Professional m06, the reading. Digest section 20, with the tier's own
# boundaries. Written to ask what a figure BELONGS to rather than to re-ask an
# earlier module, because a recap module is where a course duplicates itself.

q(3, "A vessel in a pool fire and the drum behind it are read in one session. What do the two halves have in common numerically?",
 "Nothing, since no figure appears in both and no figure in one feeds the other.",
 ["The relief load, which the valve is sized on and the drum then passes.",
  "The vapour rate, which the fire case produces and the drum consumes.",
  "The relieving pressure, which fixes the required area and the vapour density together."],
 "The valve is sized on the load a fire puts on a vessel. The drum is sized on the vapour the header carries and the droplet the flare tip will not accept.")

q(1, "Which figures in that reading did not come back from a route in this module?",
 "The vapour density of 0.124385 lb/ft3, the actual vapour rate of 212.481739 acfs and the relieving pressure.",
 ["The dropout velocity of 4.005010 ft/s, the vapour velocity of 4.467129 ft/s and the required length.",
  "The wetted area of 683.6960 ft2 and the pool fire duty of 4434115.2612 Btu/hr.",
  "The required area of 1.578271 in2 and the L over D of 0.780770."],
 "Two are the caller's conversions from the first module of this tier and the third is arithmetic on a set pressure. Everything else on the screen is an engine return.")

q(0, "Why does this engine not turn a relieving load into a drum rate for you?",
 "Because that conversion needs a composition and a temperature at header conditions that nothing has given it.",
 ["Because the two halves belong to different tiers of this course.",
  "Because the drum route refuses any rate that arrives in pounds an hour.",
  "Because a relieving load is a mass flow and a drum rate is a mass flow at different conditions."],
 "On a real plant the relieving vapour does travel down the header to the drum. The engine declines to pretend to a link it cannot compute, which is honest rather than convenient.")

q(2, "Four judgments in this tier came from outside the engine. Which row of the reading does the standard-to-actual conversion show up in?",
 "The vapour rate row of the drum half.",
 ["The vapour velocity row of the drum half.",
  "The relief load row of the fire half.",
  "The dropout velocity row of the drum half."],
 "The other three land on the level typed into the geometry route, on whether this fire case is the one that sizes the valve, and on the properties behind the settling calculation.")

q(1, "Almost every quantity in this tier has a near neighbour that is also a correct number. Which pair is one of them?",
 "A wetted area read lying down and the same level read standing up.",
 ["A required area and the relief load it was computed from.",
  "A vapour velocity in a drum and the required length that follows from it.",
  "A pool fire duty and the relief load that duty is divided down into."],
 "In every such pair both figures are correct answers to different questions. The others named here are successive steps of one chain rather than two readings of one thing.")

q(3, "A fraction of 0.900000 is handed to the drum as a level and then read as an area fraction instead. What does the course print?",
 "21.212138 ft against 17.274356 ft, a ratio of 0.814362.",
 ["21.212138 ft against 17.274356 ft, at a printed ratio of 1.003995.",
  "14.117118 ft against 13.159863 ft, ratio 0.932192.",
  "10.481166 ft against 10.346904 ft, ratio 0.987190."],
 "At a fraction of 0.500000 the two conventions give 11.039649 ft either way, which is why a check performed only at half depth proves nothing about the convention.")

q(2, "Two figures in a case record are written in psig and psia. Which is which?",
 "The set pressure is psig and the relieving pressure is psia.",
 ["The set pressure is psia and the relieving pressure is psig.",
  "Both are psig, and the atmospheric constant converts the required area instead.",
  "Both are psia, since the fire case is sized on absolute pressures throughout."],
 "A set pressure carried into a place wanting absolute is out by one atmosphere in a direction nothing downstream can see.")

q(0, "Why does this tier insist on quoting an engine answer at the precision the engine returned it at?",
 "Because a rounded restatement is indistinguishable from a number somebody invented.",
 ["Because the graded fields are marked on the last decimal place rather than on a tolerance.",
  "Because the engine refuses a figure it did not itself print at that precision.",
  "Because rounding changes which orifice letter the selection returns."],
 "Rounding partway through a chain also moves everything after it, which is a second reason and the one that costs the most.")

q(3, "Why is an orifice letter on its own an incomplete answer?",
 "Because several different required areas map to one letter, so the margin is what says where the case sits inside it.",
 ["Because the letter is a published table entry and nothing in this package can derive it.",
  "Because the selection returns a letter only when the required area is below the largest standard orifice.",
  "Because the letter changes with the overpressure allowance while the required area does not."],
 "The selection returns the letter, the standard area behind it, the required area it selected for and the margin between them. Quote all four and the reading can be checked.")

q(1, "The engine refuses a call rather than answering it. What goes in the answer box?",
 "The refusal, because the gap was the point of the question.",
 ["The nearest figure the route would have returned had the input been valid.",
  "A zero, since a refusal means the quantity does not exist for that case.",
  "The figure from the equivalent call in the other orientation or convention."],
 "Writing a plausible figure into that gap turns a correct reading into a wrong answer. A warning is different: the load is still the load to quote, with the warning reported beside it.")

q(2, "What is the fourth and most often skipped step in the order this tier works in?",
 "Naming the boundary the answer depends on.",
 ["Converting every figure into one consistent unit set.",
  "Repeating the call at a second diameter to confirm the answer.",
  "Recording the orifice letter with the margin beside it."],
 "The first three are the stated conditions with their units, the quantity each question is asking for, and the engine call with its answer at full precision. The fourth is the difference between an answer and a defensible answer.")

q(0, "Which two things does this tier's walk deliberately exclude?",
 "Any route that picks the governing case, and any route that converts a relieving load into a drum rate.",
 ["Any route that computes a relief load, and any route that computes a settling velocity.",
  "Any route that reads a vessel standing up, and any route that reads a fraction as an area.",
  "Any route that returns a warning, and any route that returns a note."],
 "Looking for either one wastes time. The comparison between scenarios is yours, and the two halves of the flare system are independent by construction.")

q(3, "A drum question states a settling velocity and also mentions a droplet size elsewhere. Which do you use?",
 "The stated settling velocity, because the drum route takes one as an input and never computes one.",
 ["The droplet size, since a velocity computed from it is more defensible than one somebody merely typed in.",
  "Either one, since the settling route reproduces the stated velocity from the droplet size given beside it.",
  "The droplet size, unless the stated velocity falls inside the band the published rows carry."],
 "A computed settling velocity rests on the drag correlation, which is held for literature and unchecked by any published case. A stated one rests on a number a reader can see and defend.")

q(0, "Eleven rows arrive on one screen in eight different units, from seven routes and two conversions. What does this tier ask you to do first?",
 "Label every figure with the half of the system it belongs to.",
 ["Convert every figure to the unit the graded field will be read in.",
  "Check each figure against the published row nearest to it.",
  "Order the figures by the step that produced them."],
 "A required area and a required length are both required, both in the answer, and answers to two unrelated questions. Nothing on the screen groups them.")

q(2, "What arrives at the caller as a note rather than as a refusal or a warning?",
 "The wetted height limit on a pool fire duty, and the L over D judgment on a drum.",
 ["The ignored back-pressure factor on a subcritical gas case, and the near-critical latent heat.",
  "An unrecognised orientation, and a level fraction at one.",
  "The near-critical latent heat on a relief load, and the drum note below an L over D of 2.000000000000."],
 "A note names a decision the engine has left to the caller on a call that succeeded. The other two kinds of message either replace the answer outright or stand beside one that still holds.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/intermediate/fc5i_m06.json', label='fc5i_m06', expect_n=15)
finish()
