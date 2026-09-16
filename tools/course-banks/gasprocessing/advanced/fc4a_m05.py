import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Expert m05, Computed, Chosen and Kept. Digest section 20 for l01, which
# is history and is framed as history in every prompt that touches it, section
# 15 for l02 and l03, section 2 for l04 and section 17 for l05. 15 questions.

q(1, "This engine was repaired after a recon found 49 findings. Before that repair the Joule-Thomson routine divided by a compressibility the relation does not carry. Why is the SHAPE of that former error the lesson rather than the factor?",
 "The discrepancy was nothing at all in the ideal-gas limit and grew with pressure, so it was smallest exactly where a sanity check is easiest.",
 ["The discrepancy was largest at low pressure, where a reader has the strongest intuition, so it was the one place a check would have been believed.",
  "The discrepancy was a constant factor at every state, so no comparison between two states could ever have revealed it.",
  "The discrepancy grew with the heat capacity, which is the one input a caller is most likely to leave at its default."],
 "Ask of any candidate error where it would be smallest and check somewhere else. That is the general lesson, and this engine's former factor of one over the compressibility is the example it happens to have.")

q(0, "Before its repair this routine carried an error of exactly one over the compressibility. Reading the repaired engine's own compressibilities of 0.997251744 at 20.000000 psia and 0.789943160 at 2500.000000 psia, the digest prints 1.002755830 and 1.265913867 beside them. What is that last column, and why is it printed on current figures?",
 "One over each compressibility, printed so the shape of the error this routine used to carry can be read off numbers that are current.",
 ["The correction the engine now applies at each state, which is the repair expressed as a multiplier on the earlier answer.",
  "The ratio of the coefficient to the coefficient at the reference state, which is how the growth with pressure is measured today.",
  "The departure of each compressibility from the value the correlation was published with, which is what the repair was checked against."],
 "The compressibilities are what the engine reports now. The reciprocal column is there so a reader can see how a former error of that shape would have grown, without any stale figure being quoted.")

q(2, "Before the repair the Joule-Thomson routine had no published case and its only check was that the answer fell in a band of 5 to 9 degF per 100 psi. Why could that check never have failed?",
 "Both the wrong answer and the right one sit inside that band.",
 ["The band was read from the same correlation the routine used, so the check restated the thing it was checking.",
  "The band was applied to the mean coefficient of a march, and the routine being checked returned only the inlet coefficient.",
  "The band was wide enough to admit any gas gravity the Sutton correlation carries, so nothing inside the module's own range could breach it."],
 "A gate that restates the formula it is checking, or bounds an answer loosely enough to admit both candidates, is not a check. Ask whether a check could discriminate before asking whether it passed.")

q(3, "One of the four repair items is an input that was range checked, refused outside 90 to 100 weight percent, and then read by nothing. Why is that worse than an input which had never been validated at all?",
 "The validation asserts that the input matters, so a caller who supplied it had every reason to believe it was changing the answer.",
 ["The validation costs a call on every answer, so the loop was paying for a guard that protected nothing it computed.",
  "The validation refused values the loop balance now accepts, so callers were being turned away from states the engine could have answered.",
  "The validation was the only place the strength appeared, so removing it would have left the module with no record of the customary band."],
 "It now drives the loop water balance, and the Associate tier teaches both what it does and what it leaves alone. The general lesson is that a validated input which moves no output is the more misleading of the two.")

q(1, "Among the repair items is one fluid carrying two densities and one module carrying two standard bases. Neither gap was large. Why were both treated as defects anyway?",
 "Nothing downstream can tell which of the two numbers it is holding.",
 ["Both gaps grew with pressure, so a difference that was small on the teaching stream would not have stayed small on a plant stream.",
  "Both numbers were declared rather than derived, and a declared constant that appears twice cannot be pinned by any gate.",
  "Both appeared in the published cases, so the goldens would move."],
 "Section 2 now shows one of each and shows the derived ones being derived. A defect of this kind is a defect whatever its size.")

q(0, "The digest counts 9 repair-history comment lines in this module and 59 across the vendored engines, by reading 226 vendored modules for comment lines carrying one of three phrases. Why is the counting rule stated beside the count?",
 "A count of this kind means nothing without the tree it was taken over and the rule it was taken with.",
 ["Because the three phrases are the only ones the authors were permitted to use.",
  "Because any figure a lesson quotes has to name the call that produced it.",
  "Because provenance figures are the ones the digest has to source."],
 "Widen the rule to the nine keywords the same file also sweeps with and this module alone reads 18, and count the canonical engines repository instead of the subset NextGen vendors and the tree figure more than doubles.")

q(2, "What must a writer establish about a sentence found in an engine source comment before putting it in front of a learner?",
 "Whether it describes what the engine does now.",
 ["Whether the comment is still present in the module it came from, since a quote that has moved is the defect a pin exists to catch.",
  "Whether the sentence names a figure the digest also prints, since a comment that carries no number cannot mislead a reader.",
  "Whether the comment was written by the same author as the routine beneath it, since only that author can vouch for the claim."],
 "Engine source comments are provenance. A sentence lifted out of one arrives with no frame around it, and a writer cannot frame what they did not know was history.")

q(3, "State the error contract this module keeps, and what it asks of a caller.",
 "Every export answers with an object, and one that cannot answer puts a named string on an error key, so a caller checks one property and never catches.",
 ["Every export answers with an object, and one that cannot answer returns a non-finite value on the answer key, so a caller checks that the number is finite.",
  "Every export either answers or throws a named error, so a caller wraps the call and reads the message off what it caught.",
  "Most exports answer with an object and the rest answer with a bare number, so a caller checks the type of what came back before reading it."],
 "Nothing in this module throws. An exception travels up a stack and gets caught somewhere the caller did not choose, and an error on a returned object stays exactly where the question was asked.")

q(1, "A gas at 140.000001 degF is refused by the water routine. What does the message carry beyond the fact of the refusal?",
 "The band in both units and the temperature it was handed, converted into the units the band is stated in.",
 ["The nearest temperature inside the band, so a caller can retry at a state the fit will answer for.",
  "The coefficients the fit was published with, so a caller can see how far the extrapolation would have reached.",
  "The water content the fit would have returned, flagged so that a caller can use it as a screening figure."],
 "A caller is told what to change and by how much. The same habit runs through the module: an unknown solvent names the three the module carries, and a removal no stage count reaches names raising the circulation as the remedy.")

q(0, "Four refusals in this module hand back evidence beside the message. Which of them carries the most fields, and how many?",
 "A march that walks off the correlation, with 7.",
 ["A compressibility off the correlation band, with 7.",
  "The capped stage count, with 6.",
  "A contactor whose liquid is lighter than its gas, with 6."],
 "The march returns 7, a compressibility off band returns 6, and the capped stage count and the contactor liquid return 3 each. A refusal with its evidence can be acted on without re-running anything.")

q(2, "The water fit answers at exactly -49.000000000 degF and at exactly 140.000000000 degF, while the lean glycol strength refuses at exactly 90 and at exactly 100 weight percent. Why do the two guards behave differently at their own edges?",
 "The fit holds at its stated limits, and a strength of 100 weight percent is unreachable while a loop below 90 is a different kind of loop.",
 ["The water fit is exported and the strength is declared, and only an exported band can be enforced at the value it states.",
  "The water fit is read from both sides in the digest and the strength is read from one, so the two tables are not comparable at their edges.",
  "The water guard protects a correlation and the strength guard protects a balance, and a balance is always guarded more tightly than a fit."],
 "A guard that refused its own stated limit would be as wrong as one that accepted anything. Each edge is read from both sides for exactly that reason.")

q(3, "The contract is read on one export, the Kremser removal, at five sets of arguments. What makes that one export enough to read a whole contract on?",
 "It takes two arguments and the four refusals cover both of them at two kinds of bad value each.",
 ["It is the only export that returns a bare fraction.",
  "It is the export the studio calls most often.",
  "It is the only export whose refusal carries no evidence fields."],
 "At an absorption factor of 1.600000 over 6.000000 stages the same call shape returns { fractionRemoved: 0.976783371 }. A reading at one door is a reading of the contract, provided the door was chosen for the variety of its faults.")

q(1, "Suppose one export in a module returned a bare number and signalled a fault with a non-finite value. What would that cost a caller who guards the way this module's contract implies?",
 "Every such guard would sail straight past the fault, which would surface far downstream as an empty field.",
 ["Every such guard would refuse the good answers as well.",
  "The caller would have to catch an exception around that one export.",
  "The studio would render the fault as a named message anyway."],
 "An empty field looks exactly like a field nobody filled in. A contract with one exception is not a contract a caller can rely on, because relying on it means knowing the exception.")

q(2, "The module sorts its constants into three kinds. What is the difference between what a gate over a derived constant proves and what a gate over a declared one proves?",
 "The first proves an identity, and the second proves that nobody changed the number quietly.",
 ["The first proves the value is right, and the second proves the exported name and the number in use are the same number.",
  "The first proves the value is reachable from the published cases, and the second proves it is reachable from the module's own exports.",
  "The first proves the constant is exported and the second that it is used."],
 "A gate over a measured constant is the third promise: the name and the number agree. Reading the three as one is how a pinned number gets presented as a verified one.")

q(0, "The published cases carry 0.999997865073155 on some rows and 1.000000000000000 on others. What separates the two kinds of row?",
 "Whether the quantity passed through the standard molar volume, which the oracle builds from the SI gas constant and the engine builds from the package figure in field units.",
 ["Whether the quantity was checked against an independent route or against the same arithmetic in different units, which is what the mass rows had.",
  "Whether the quantity carries a declared constant, since a declared value is held as a shared copy by the oracle and reproduces exactly.",
  "Whether the quantity is a rate or a content, since a rate carries the standard conditions twice and a content carries them once."],
 "A quantity that shows the signature went through a mole and a quantity that does not, did not. The molar rows agree with one another to 4.441e-16, which is a few units in the last bit rather than a difference in the arithmetic.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/advanced/fc4a_m05.json', expect_n=15)
finish()
