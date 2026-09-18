import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Associate m05, From An Area To A Letter. Written from digest.txt Section
# 10, which is the four lessons of this module: the fourteen standard orifices,
# the smallest one that will do, what a margin is worth, and the refusal past
# the largest orifice.

q(1, "The engine own exported orifice table carries fourteen rows. What does the column of ratios between neighbouring areas show?",
 "That the ladder is not geometric, since the steps run from 1.205556 up to 1.781818 in no tidy direction.",
 ["That the ladder is geometric, since every step is close enough to the same figure for the spread to be rounding.",
  "That the ladder is geometric above the J orifice, since the steps settle once the areas pass 1.287000 in2.",
  "That the ladder is not geometric, since the steps fall steadily from 1.781818 at the bottom to 1.205556 at the top."],
 "The ratios are 1.781818, 1.566327, 1.638436, 1.560636, 1.639490, 1.428127, 1.552231, 1.261830, 1.205556, 1.470046, 1.731975, 1.447964 and 1.625000 going up. The smallest sits between M and N in the middle of the ladder and the largest between the two smallest orifices."),

q(2, "Which letters does the published ladder skip between D and T?",
 "I, O and S.",
 ["I, O and U.",
  "I, S and V.",
  "O, S and X."],
 "Read the exported table top to bottom: D, E, F, G, H, J, K, L, M, N, P, Q, R and T. Fourteen letters are printed across a span of seventeen, and the three absent ones are what is left. Why the published table leaves them out is not something the engine or the digest says."),

q(0, "State the selection rule this engine applies.",
 "Return the smallest listed orifice whose area is at or above the required area.",
 ["Return the smallest listed orifice strictly above the required area.",
  "Return the listed orifice closest to the required area either way.",
  "Return the smallest listed orifice at or above the area times a margin."],
 "At or above is the whole of it, with no margin applied on the way. The boundary rows are what distinguish this rule from the strictly above one, because the two agree everywhere else."),

q(3, "A required area of 0.110000 in2 takes D and a required area of 0.110001 in2 takes E. What do those two rows prove?",
 "That the comparison is at or above rather than strictly above.",
 ["That the ladder is walked from the top down rather than from the bottom up.",
  "That the engine rounds a required area to the precision of the published table.",
  "That a required area below the smallest listed orifice is refused rather than served."],
 "A boundary case is the only case that can distinguish two rules which agree everywhere else. The first row lands exactly on the smallest listed area and takes it, with a margin of exactly 1.000000."),

q(1, "What does a required area of 0.050000 in2 select, and with what margin?",
 "D at 0.110000 in2, with a margin of 2.200000.",
 ["D at 0.110000 in2, with a margin of 1.000000.",
  "Nothing, since the required area is below the smallest listed orifice.",
  "E at 0.196000 in2, with a margin of 1.781818."],
 "The smallest listed orifice is still the smallest one at or above the requirement, so the engine serves it. A very small required area therefore buys a lot of spare capacity, which is a property of the published ladder."),

q(0, "How is the margin the engine returns defined?",
 "The purchased orifice area divided by the required area.",
 ["The required area divided by the purchased orifice area.",
  "The purchased orifice area less the required area, in in2.",
  "The ratio of the purchased orifice area to the rung below it."],
 "Every row landing exactly on a listed area comes back at 1.000000, which is the same statement read a second way. The ratio to the rung below is the ladder column rather than the margin on a selection."),

q(2, "The three streams of this tier end at 2.223779 in2, 1.867758 in2 and 0.949984 in2. What do they select?",
 "L, L and J, at margins of 1.282951, 1.527500 and 1.354759.",
 ["L, K and J, at margins of 1.282951, 1.527500 and 1.354759.",
  "L, L and J, at margins of 1.282951, 1.354759 and 1.527500.",
  "L, L and K, at margins of 1.282951, 1.527500 and 1.838000."],
 "Read each required area up to the first rung at or above it, then divide that rung by it. The 1.838000 is the K orifice area rather than a margin, and the two margins belong to the streams in the order the areas were given."),

q(3, "Two cases with identical engineering behind them come back with very different margins. What does that say about a margin?",
 "That it is an artefact of where a required area fell between two rungs.",
 ["That one of the two cases was sized on a load that was not the governing one.",
  "That the certified discharge coefficients on the two cases differ, since a margin carries Kd.",
  "That a margin is a design allowance, and the two cases were allowed different accumulations."],
 "A margin is not a safety factor and not a measure of how conservative the sizing was. That is why nothing graded in this course is a margin or an orifice letter."),

q(0, "What does the validation suite check about the orifice table, and why can it not check more?",
 "It checks the selection behaviour, because nothing in this package derives any of the fourteen published areas.",
 ["It checks each of the fourteen areas against a standard bore, because a published area is a geometry.",
  "It checks the ratios between the rungs, because those are the only figures the engine computes here.",
  "It checks the margins the selection returns, because a margin is derived from two areas the engine holds."],
 "Behaviour is checkable where the numbers are not: the smallest orifice at or above the requirement, a required area exactly equal to a listed one, and the refusal past the largest. The ratios and the margins are arithmetic on figures that are themselves typed."),

q(1, "A required area of 26.000001 in2 is handed to the selection. What comes back?",
 "A refusal naming the required area and the T orifice, with a second key carrying a whole number of valves.",
 ["A refusal naming the required area and the T orifice, with the margin that a single T would have left.",
  "The T orifice with a margin below one, since the largest listed orifice is the best the ladder can do.",
  "A refusal naming the required area alone, since the number of valves depends on a spacing the engine is never told."],
 "The second key is `multipleOfT`, read off the returned object rather than listed. Returning the largest orifice with a margin below one would be an answer that looks like an answer and is not."),

q(3, "At 79.000000 in2 the refusal carries 4 and at 105.000000 in2 it carries 5. What is that figure?",
 "How many of the largest orifice the required area needs.",
 ["How many rungs above the largest orifice it sits.",
  "How many square inches are left over after the count.",
  "How many times the area exceeds the largest orifice."],
 "It turns a dead end into the beginning of a design. A caller that reads only the `error` string throws that figure away, which is why the key has a name worth knowing."),

q(2, "The refusal at 26.000100 in2 reads: required area 26.0001 in2 exceeds a T orifice (26 in2): use multiple valves. What is the point of the figure inside the message?",
 "The message carries the figure that made it true, so the statement and its evidence sit on the same line.",
 ["The message carries the required area rounded to the precision of the published table it failed against.",
  "The message carries the area of the largest orifice, so a caller can work out the shortfall from the text.",
  "The message carries the figure the caller typed, so a caller can see what was lost on the way in."],
 "A refusal reading only that the area is too large would leave a user guessing which of their inputs the engine had actually received. The required area appears in the text to eight significant figures."),

q(0, "A required area of 0.500000 in2 takes G at 0.503000 in2 with a margin of 1.006000. How should that be read?",
 "As the honest answer to the question that was asked, with almost no spare area over the requirement.",
 ["As a case that should be rounded up a rung, since a margin that close to one is outside the ladder intent.",
  "As evidence that the comparison is strictly above, since the required area and the listed area differ.",
  "As a case the engine would have refused had the required area been any larger at all."],
 "Nothing is wrong with it. There is a difference between a valve that just passes and a valve that passes, and reading that difference is the caller job rather than the engine one."),

q(2, "What shape does a selection call return when it succeeds, and when it refuses?",
 "An object either way, carrying the letter, the areas and the margin on a success and an `error` string with the valve count on a refusal.",
 ["An object on a success and a bare NaN on a refusal, which is the contract the seven number returning exports keep.",
  "An object either way, carrying the letter and the margin on a success and the same fields with the letter left empty on a refusal.",
  "An object on a success and a thrown error on a refusal, which is why a caller has to handle two shapes on this route."],
 "There is no partial answer hiding beside the refusal. A bare number returning NaN is the contract of a different set of exports, and nothing in this module throws."),

q(1, "Why is a refusal past the largest orifice not a failure of the tool?",
 "Because one valve of a standard size will not do that job, which is a real engineering answer.",
 ["Because the ladder can be extended by the caller, and the engine is waiting to be handed a fifteenth row.",
  "Because a required area that large is usually a bad input.",
  "Because the refusal is advisory and a caller may ignore it."],
 "The engine declining to invent a fifteenth orifice is the tool being correct about the limits of the table it was given, and it hands back the valve count so the answer can be acted on."),

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/beginner/fc5b_m05.json', label='fc5b_m05', expect_n=15)
finish()
