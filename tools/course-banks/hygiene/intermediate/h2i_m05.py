import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H2 Professional m05, mixtures and the additive index of 1910.1000(d)(2).
# Figures from digest Section 15 (the published example, the teaching mixture,
# unity, when additivity is the wrong model), Section 10 (the mixture
# refusals), the J7 row of Section 1 and Section 25 (the BTEX seam). No
# capstone site, input or answer appears.

q(1, "The teaching mixture is toluene 72.500000 ppm against 200.000000, xylene 31.200000 ppm against 100.000000 and acetone 385.000000 ppm against 1000.000000. What mixture index does the engine return?",
 "1.059500",
 ["0.385000", "0.925000", "1.100000"],
 "The index is the sum of each concentration over its own limit: 0.362500 + 0.312000 + 0.385000 = 1.059500. 0.385000 is only the largest single term, which reads the mixture by its worst component; 0.925000 is the published example's index and 1.100000 the golden's over-unity case.")

q(0, "In the teaching mixture, what is the toluene term?",
 "0.362500",
 ["0.312000", "0.385000", "the limit of 200.000000 divided by 72.500000"],
 "A term is the concentration over its own limit, 72.500000 over 200.000000, which is 0.362500. 0.312000 is the xylene term and 0.385000 the acetone term. Dividing the limit by the concentration inverts the ratio and gives a number above 1 for a component well under its limit.")

q(3, "Every term of the teaching mixture is under 1, and the index is 1.059500. What does that show?",
 "Components that each look acceptable alone can together use more than the whole combined allowance.",
 ["The engine has made an error, since a sum of three terms that are each under 1 can never pass 1 when they are added.",
  "The mixture passes, because the largest term, 0.385000, is the figure the regulation compares with unity.",
  "Only acetone needs control, because its term is the largest of the three and the other two add nothing."],
 "Three terms of 0.362500, 0.312000 and 0.385000 add to more than 1, which is the whole point of the index: a report that checked each component against its own limit would find nothing. The largest term is not what the regulation compares with unity, and no single component explains the excess.")

q(2, "The worked example of 1910.1000(d)(2) is 500.000000 against 1000.000000, 45.000000 against 200.000000 and 40.000000 against 200.000000. What does the engine return?",
 "Terms 0.500000, 0.225000 and 0.200000, and an index of 0.925000",
 ["Terms 0.500000, 0.225000 and 0.200000, and an index of 0.500000, the largest term",
  "Terms 0.500000, 0.225000 and 0.200000, and an index of 1.059500",
  "An index of 0.925000 with every term reported as absent"],
 "Each concentration over its limit gives 0.500000, 0.225000 and 0.200000, and they add to 0.925000, which the engine reproduces from the regulation's own example. The largest term is not the index, 1.059500 belongs to the teaching mixture, and the engine always reports each term.")

q(3, "Why does the engine reproducing the printed (d)(2) example matter, when an additive index is so simple to code?",
 "It sets the rule against a value the source itself prints, so a misreading shared by the engine and its oracle would be caught.",
 ["It is the only way to know which of the limits in the example are licensed.",
  "It proves the additive model is right for every mixture the engine will see.",
  "It fixes the tolerance the capstone grades the mixture index at."],
 "A printed case reproduced at the precision it prints is what this course calls PUBLISHED, REPRODUCED: two people copying the same page wrongly would be caught by that value. It says nothing about which limits are licensed, it cannot prove that additivity suits a given mixture, and a printed example fixes a rule's arithmetic and says nothing about how any answer is scored.")

q(0, "The published example has a largest term of 0.500000 and an index of 0.925000; the teaching mixture has a largest term of 0.385000 and an index of 1.059500. What does the comparison teach?",
 "The index depends only on the sum, so the mixture with the larger single term can be the one that stays under unity.",
 ["The mixture with the larger single term always exceeds first, so the teaching mixture's index must have been misreported by the engine.",
  "The index weights the largest term double before adding the others, which is why the published example stays under unity.",
  "The two cases cannot be compared at all, because one types public OSHA limits and the other types limits from a licensed table."],
 "The index does not care how the sum is shared out: many moderate terms can exceed where one large term does not. Nothing weights the largest term, the teaching mixture's report is correct, and both cases type public OSHA values as limits, so they compare directly.")

q(2, "Acetone at 385.000000 ppm and xylene at 31.200000 ppm carry terms of 0.385000 and 0.312000. How should a mixture be screened?",
 "Rank the components by their terms, since each concentration is divided by its own limit.",
 ["Rank by concentration, so acetone at 385.000000 ppm dominates the mixture by far.",
  "Rank by limit, since the component with the lowest limit always carries the largest term.",
  "Rank by molecular weight, which the engine applies to each term."],
 "Concentrations more than ten times apart give terms of similar size because each is divided by its own limit, so the terms are what show where the combined allowance is spent. A low limit alone does not decide a term without its concentration, and the engine takes no molecular weight.")

q(1, "A mixture's terms add to exactly 1.000000. What does the engine report, and which judgement call decides it?",
 "Exceeds false, by J7: an index of exactly 1 passes.",
 ["Exceeds true, by J7: an index of 1 has reached the limit.",
  "Exceeds false, by J2: a boundary is always inclusive.",
  "A refusal, since an index on the boundary is undefined."],
 "The regulation says the index \"shall not exceed unity\", and an index equal to unity has not exceeded it, so exceeds is true only above 1. The call is J7. J2 is the Associate tier's inclusive noise threshold, a different call on a different boundary, and nothing is refused at 1.")

q(0, "The teaching mixture's terms are 0.362500, 0.312000 and 0.385000 against limits of 200.000000, 100.000000 and 1000.000000 ppm. What happens if a different limit is typed for one component?",
 "That component's term changes with its own limit and the other two are untouched.",
 ["Every term is rescaled, since the index divides its sum by the largest limit.",
  "Nothing moves until the index passes 1, where the engine reads the limits again.",
  "The door refuses the mixture, because its first limits are the ones it holds."],
 "Each term is one component's concentration over that component's own limit, so a limit belongs to one term alone: change the 1000.000000 ppm acetone limit and only the 0.385000 term moves, while toluene's 0.362500 and xylene's 0.312000 stay as they are. There is no shared divisor in the sum, the engine holds no limit table to read again, and every limit is an input the caller types.")

q(1, "If the three components of the teaching mixture acted on different organs independently, what should be compared with what?",
 "Each term against 1 on its own, where the largest is 0.385000.",
 ["The sum of the terms against 1, since the regulation writes the sum.",
  "The sum of the terms against 3, one allowance per component.",
  "The largest concentration against the smallest limit."],
 "Where components act independently each is compared against its own limit and the sum means nothing, so the reading is three terms each under 1. The sum is the right model only for components acting on the same organ by the same mechanism; a sum against 3 and a cross-comparison of concentration and limit are not methods anyone prints.")

q(2, "Where one component is known to potentiate another, what does the additive index do?",
 "It understates the hazard, so the index is a floor and should be reported as one.",
 ["It overstates the hazard, so a mixture above unity may in fact be safe to leave as it is.",
  "It gives the right answer, because potentiation is already built into each substance's limit.",
  "It cannot be computed, so the engine refuses the mixture on the field `components`."],
 "Potentiation means the components together do more harm than either alone, so a sum that only adds understates it, and a mixture below unity can still be a problem. Limits are set per substance and hold no interaction, and the engine computes the additive index whatever the mechanism, since it cannot tell which case a mixture is in.")

q(3, "Which of these is outside what `mixtureExposureIndex` can tell you?",
 "Whether the components act on the same organ by the same mechanism.",
 ["Each component's concentration divided by its own limit, one term per component.",
  "Whether the sum of the terms is above 1, which the door returns as a flag.",
  "Which component carries the largest term."],
 "The door returns each term, the index and whether it exceeds 1, from which the largest term can be read. The mechanism of action is toxicology the engine does not hold, so the choice of model has to be made, and written down, outside it.")

q(3, "A mixture is entered with a limit of zero for its first component. What does the engine return?",
 "A refusal on `components[0].limit`: \"components[0].limit must be a finite number above zero\"",
 ["A term of zero for that component, and an index built from the other components with a warning",
  "An infinite term and exceeds true, since any concentration at all is over a limit of zero",
  "A refusal on `components`: \"components must be a non-empty array\""],
 "Each term divides by its limit, and a limit of nothing would make that division meaningless, so the door stops and points at the first component's limit. Dropping the component or reporting an infinite term would both hide a typing error in the list; the non-empty array message belongs to a list with no components in it.")

q(0, "A mixture lists a component at a concentration of zero. How does the engine treat it?",
 "It accepts it, and the component contributes a term of zero.",
 ["It refuses it, because a concentration of zero is treated like a limit of zero.",
  "It drops the component and warns that the mixture list has shrunk.",
  "It credits the component with its full limit as a term of 1."],
 "A concentration of zero is the right answer for a component that is listed and absent, so its term is zero. A limit of zero is refused because no substance has an allowance of nothing, and that asymmetry is deliberate. The engine neither drops nor inflates a zero component.")

q(2, "A report compares a personal air sample's 8-hour TWA of an aromatic solvent with BTEX emitted from a glycol unit. Where does the emission question belong?",
 "The Gas Processing course, which owns BTEX as an emission from a glycol unit.",
 ["This tier, since the mixture index covers any aromatic solvents.",
  "Safety Performance Statistics, since an emission is an incident.",
  "The Risk, Change and Learning course, since it owns every hazard."],
 "BTEX as an emission from a glycol unit is a different measurement of a different quantity from a personal air sample and its 8-hour TWA, and the Gas Processing course owns it. This tier's concern is the breathing zone. Safety Performance Statistics owns incident rates and Risk, Change and Learning the 5x5 risk matrix.")

emit(Q, '/root/hse-wip-hygiene/banks/h2i_m05.json', expect_n=15)
finish()
