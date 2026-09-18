import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Professional m04, the wall and the limit that fixes a factor.
# Every figure is from digest Sections 10 and 11 at the rendering they print.
# The ten percent margin is taught as a declared reporting threshold, and the
# thin wall limit as an analytic truth that needs no publication.

q(3, "On the studio case the wall carries 0.000228791 hr.ft2.F per Btu. What share of the stack is that?",
 "2.107398 percent, the smallest of the five terms on that case.",
 ["20.341632 percent, the smallest of the five terms on that case.",
  "2.107398 percent, the second smallest of the five terms on that case.",
  "9.211035 percent, the smallest of the five terms on that case."],
 "Metal conducts well and a tube wall is thin, so the term is small on almost every exchanger anybody builds. Small is a reason to check it once rather than a reason to leave it out.")

q(0, "That wall table was measured at an outside diameter held at 1.000000 inches. Two things move the term across it. Which two?",
 "The wall thickness and the conductivity.",
 ["The tube count and the wall thickness.",
  "The conductivity and the fouling allowance.",
  "The tube count and the two film coefficients."],
 "The three conductivity columns in that table stand in inverse proportion to their conductivities, so a less conductive wall moves the term by the same factor in the other direction. The outside diameter is the third thing that moves it, and holding it is what leaves only those two.")

q(2, "How is the cylindrical wall resistance written on this engine?",
 "The outside diameter times the logarithm of the diameter ratio, over twice the conductivity.",
 ["The wall thickness times the logarithm of the diameter ratio, over twice the conductivity.",
  "The outside diameter over the bore, times the thickness, over the conductivity.",
  "The wall thickness over the conductivity, with no geometry in it at all."],
 "A flat plate is the thickness over the conductivity and nothing else. The cylindrical form has to collapse onto it as the wall gets thin, because a thin enough curved wall is a flat one.")

q(1, "The wall term was measured out of the engine rather than argued for on paper. How?",
 "Both film coefficients were made negligible, so the total resistance is the wall alone.",
 ["Both film coefficients were held at the studio values, so the wall is the difference.",
  "The conductivity was driven to zero, so the remaining terms fall out of the total.",
  "The tube count was driven upward until the two film terms stopped moving."],
 "The outside diameter was held at 1.000000 inches throughout and only the thickness moved. That trick isolates any one of the five terms inside a sum.")

q(2, "The ratio of the wall resistance to the flat plate runs 1.127984, 1.036724, 1.010135 and 1.002005 as the wall thins. What does that column say?",
 "It approaches one from above, smoothly, which is the correct side to approach from.",
 ["It approaches one from below, smoothly, which is the correct side to approach from.",
  "It approaches two from above, which is what the factor in the denominator predicts.",
  "It crosses one between the third row and the fourth, as the wall becomes flat."],
 "A cylindrical wall always carries slightly more resistance than a flat plate of the same thickness. The value the column converges to is the whole content of the check.")

q(0, "What would a wrong factor of two in the wall expression do to that ratio column?",
 "It would converge on two or on one half, just as smoothly and just as convincingly.",
 ["It would stop converging altogether, and the four rows would wander with no pattern in them.",
  "It would converge on one all the same, but from below the value rather than from above it.",
  "It would leave the column alone and move the studio share instead."],
 "That is what the limit is for. The twice in the denominator is the kind of thing that gets dropped or doubled once and then lives for years.")

q(1, "Why does a term carrying about two percent of a stack still deserve this check?",
 "An error of a factor of two inside it leaves the coefficient close enough to look right.",
 ["An error inside it moves the controlling verdict onto the wall term itself on this case.",
  "An error inside it is the one the published cases in this repository cover.",
  "An error inside it is carried into the area by the diameter ratio twice."],
 "A small term is one whose value you can afford to be slightly wrong about, which is a different statement from a term you can leave out.")

q(3, "Move that factor the same way in the engine and in the oracle at once. What happens?",
 "The two go on agreeing with each other, and neither agrees with the flat plate.",
 ["The two disagree at once, which is how a moved factor is found.",
  "The two go on agreeing, and so does the flat plate, because the limit is a ratio.",
  "The oracle refuses, because it takes the wall term by quadrature."],
 "A check comparing two implementations of one expression can only find a difference between them. A shared mistake produces no difference to find.")

q(2, "Three kinds of check appear in that lesson. Which can catch an error that both routes share?",
 "An analytic limit, when the limit is violated.",
 ["The same expression written twice, in two files.",
  "A second route to the same answer, written independently.",
  "A published case, when the case is at the right conditions."],
 "The same expression written twice can find a typing error between the two copies. A second route can find an error in either route that the other does not share. Only an analytic limit sees a mistake the two of them hold in common.")

q(0, "What does the oracle behind the published coefficient rows do differently from the engine?",
 "It builds the stack on each term's own area and takes the wall by quadrature.",
 ["It builds the stack on the outside area and takes the wall by a logarithm.",
  "It reads the same five terms and refers them to the bore instead.",
  "It bisects on the coefficient until the five shares add to the total."],
 "Its agreement with the engine is worth something, because two routes that could have differed did not. Route independence still has a limit of its own, since two routes can share an assumption.")

q(1, "Several constants in this module are pinned by their literal value in the engine gate. What does a pin buy?",
 "It makes changing the number a reviewed act rather than a silent one.",
 ["It makes the number evidence, because a review stands behind it.",
  "It makes the number reproducible across the engine and the oracle.",
  "It makes the number a published figure, because the gate cites it."],
 "Pinning a number does not make it right. Move a pinned constant in the engine and in the oracle together and every published case stays green, so on a shared constant every case green is the finding.")

q(3, "This module reports whether the margin between the leading resistance and its runner up is clear. What is the threshold?",
 "10 percent, declared by this module.",
 ["10 percent, taken from a publication.",
  "2 percent, declared by this module.",
  "51.612903 percent, measured on the studio case."],
 "It is a reporting threshold rather than a physical one. Above it the engine lets the word stand, and below it the answer carries a note instead.")

q(2, "A case is built with an outside film of 0.005000000 and an inside film of 0.005100000. What does the engine report?",
 "A margin of 1.960784 percent, and clear reported as no.",
 ["A margin of 1.960784 percent, and clear reported as yes.",
  "A margin of 2.0 percent exactly, and clear reported as no.",
  "A refusal, because the two terms are too close to separate."],
 "The note that comes with it tells the reader to treat the two as jointly controlling rather than acting on the word. The verdict is still reported and it is not hidden.")

q(0, "The note for that case says 2.0 percent and the margin key says 1.960784. Which is which?",
 "The note is prose written for a reader, and the key is the value to compute with.",
 ["The note carries the margin at full precision and the key carries it rounded.",
  "The note is the declared threshold and the key is the margin measured against it.",
  "The note is the margin on the leading term and the key is the margin on the runner up."],
 "A message written for a human and a value written for a caller have different jobs. A tool returning only the message forces every caller to parse a sentence to recover a number.")

q(1, "Compare that near case against the studio case, where the margin is 51.612903 percent. What differs?",
 "The confidence behind the same kind of one word verdict.",
 ["The number of resistances the two stacks were assembled from.",
  "The threshold each of the two cases is measured against.",
  "Which of the two coefficients the verdict was taken on."],
 "A reader given only the leading term would treat the two cases identically. That is why the margin is on the answer, and why the engine says whether it is clear.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/intermediate/fc6i_m04.json', label='fc6i_m04', expect_n=15)
finish()
