import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Professional m05, marching a profile. Digest Section 11 only. This
# module's traverse is a LIQUID traverse; the gas analogue is Suite code and
# is not vendored, so nothing here is a gas march.

q(2, "The OGBIA traverse reports four stations over 26400.000000 ft, the first of them at 0.000000 ft and 900.000000 psia. What is different about that first row?",
 "It is an input rather than a result, because a traverse answers where the line is and that question needs to be told where the line started.",
 ["It is the only station the engine places itself, the remaining three being read off the segment list the caller supplied.",
  "It is a result like the others, computed by running the first segment backwards from the arrival pressure of 874.339369 psia so that the whole list is internally consistent.",
  "It is a gauge pressure, the inlet being the one figure a traverse takes relative to atmosphere before converting the rest of the list to absolute."],
 "A single pressure-drop call answers what the line spends. Without an inlet there is no pressure at station 0 and nothing to subtract from.")

q(0, "The OGBIA line is marched flat and then over a ridge that stands 420.000000 ft at its two middle stations. Both arrive at 874.339369 psia. What separates the two cases?",
 "At station 1 the ridge stands at 732.488123 psia against 891.446456 psia on the flat line, a difference of 158.958333 psi that no arrival pressure reports.",
 ["Nothing measurable, since the ridge climbs and descends the same 420.000000 ft and a profile that returns to its starting elevation is equivalent to a flat one at every station.",
  "The spend, which is 25.660631 psi on the flat line and larger on the ridge by the static column the gas had to lift over the crest.",
  "The number of stations, the ridge case adding two rows at 420.000000 ft that the flat case does not carry."],
 "A line is sized on its worst station and not on its last one. The crest is where the pressure is lowest and it is the station a review has to see.")

q(1, "Why does the ridge cost nothing over the whole line?",
 "Elevation is a static column, and on an incompressible liquid a column is paid for on the way up and returned on the way down, so the total spend is the friction alone at 25.660631 psi.",
 ["Because the two middle stations sit at the same 420.000000 ft, so the climb and the descent fall inside the first and last segments and cancel by construction, which is why the same ridge costs a gas line nothing either.",
  "Because the engine nets the profile to its total elevation change before marching it, and the ridge nets to 0.000000 ft between the two ends of the line.",
  "Because the friction over the ridge is lower than over the flat line by exactly the static column, the two effects offsetting to leave the same arrival."],
 "The profile climbs 420.000000 ft and descends the same distance. That is a property of a liquid line, and the gas half of this tier does not have it.")

q(3, "The ridge returns all of its elevation to an incompressible liquid. What does the gas half of this tier do with the same shape of profile?",
 "It does not return it, because the gas elevation term sits inside an exponential and equal distances up and down do not cancel there.",
 ["It returns slightly more than it took, because a descending gas line recovers more head than the matching climb spent and the two together leave the rate above where it started.",
  "It returns it as well, since the elevation term in a gas form is built from the same static column and a column is symmetric whatever fluid stands in it.",
  "It refuses the profile, because a gas call carries a single elevation change and an undulating route cannot be expressed as one figure."],
 "On the 1500.000000 ft table the Weymouth row reads 0.932862 climbing against 1.063402 descending, which average to 0.998132 rather than to one. Marching is where a liquid and a gas part company.")

q(0, "The traverse spends 25.660631 psi over 26400.000000 ft in three segments and a single call over the same length spends 25.660631 psi. What follows from a difference of 0.000000 psi?",
 "That the station list is the entire value of the call, so a reader is choosing between a number and a profile rather than between a rougher answer and a better one.",
 ["That the traverse is redundant on this line, and worth running only where the segments differ enough in slope for the accumulated answer to separate from the single call.",
  "That three segments are too few to resolve the difference, and a survey with a station every few hundred feet would show the marched total pulling away from the single call.",
  "That the single call is internally marching the same three segments, which is why the two agree exactly and why only one of them needs to be run."],
 "A liquid is incompressible, so the density, the velocity, the Reynolds number and the friction factor do not change along the pipe. Splitting it changes nothing the arithmetic depends on.")

q(2, "The digest prints the difference between the marched and single-call totals as 0.000000 psi rather than as a small number. Why is an exact zero worth more than a small residual?",
 "A small residual would need explaining, and the explanation would be either a segmentation effect or an arithmetic one with no way to tell them apart from the total alone.",
 ["A small residual would breach the six-decimal convention the liquid half of this course prints at, and a figure that cannot be printed at its stated precision cannot be checked against a golden.",
  "A small residual would mean the traverse had dropped a boundary between two of its three segments, which is the one defect a total can diagnose on its own.",
  "A small residual would place the answer outside the tolerance the published cases are checked at, so the comparison could not be used as a check on the segment loop."],
 "An exact agreement between two differently assembled paths is a test the digest performs rather than asserts. A mishandled accumulation or a dropped boundary would show as a difference.")

q(1, "What would have to be present for a marched total to differ from a single call over the same length?",
 "Something that makes a segment's answer depend on which segment it is, such as a changing density, a changing bore or a changing duty at an offtake.",
 ["A steeper profile, since the elevation term is what accumulates differently between a march and a single call and a flat or returning profile hides that difference.",
  "A larger number of segments, because each boundary introduces a rounding step and the marched total drifts from the single call in proportion to how finely the line was cut.",
  "A resistance sum on the traverse, since fittings are the one term that accumulates per segment rather than per line."],
 "A changing density is what makes a compressible fluid a different problem. None of the three is present on this line, so the agreement is exact rather than close.")

q(3, "A single call on the OGBIA line carrying the isometric's 4.500000 velocity heads spends 25.793983 psi while the traverse spends 25.660631 psi. What is the gap of 0.133351 psi?",
 "Exactly the fittings, because the traverse has no resistance-sum argument at all.",
 ["A segmentation effect, the three segments each resolving their own velocity head and the single call resolving one for the whole length, which is why the marched figure is the lower of the two.",
  "The elevation term, which the single call carries over the full 26400.000000 ft and the traverse distributes across its three segments at a slightly different total.",
  "An accumulation of rounding across the three segment boundaries, small on this line and growing with the number of stations a caller asks for."],
 "There is nowhere to put a fitting list on a traverse, so the fittings are absent by construction rather than approximated.")

q(0, "Why is the traverse dropping the fittings described as an omission in the signature rather than an error in the arithmetic?",
 "Because a missing argument is a property of the call that is visible before the call is made, by looking at what it accepts, while an arithmetic defect is something that might be fixed in a release.",
 ["Because the arithmetic inside each segment is correct only for a line with no fittings, so the defect is in the domain the traverse is valid over rather than in the code that implements it.",
  "Because the traverse reports a zero fittings field on every station, which records the omission in the output and makes it a declared limit rather than a mistake.",
  "Because the gap of 0.133351 psi is small beside 25.660631 psi, and a difference of that size is a modelling choice rather than an error in either call."],
 "The traverse is not wrong. It computed a correct answer to the question it can be asked, and it cannot be asked about fittings.")

q(2, "On this line the fittings are worth 0.133351 psi against 25.660631 psi of pipe. Why is the size of that gap not the lesson?",
 "Because the gap is exactly whatever the fitting list is worth, so a line with the same pipe and a heavier fitting count has the same structural omission and a larger consequence.",
 ["Because the gap scales with the length of the line, so the same isometric over a longer route would give a proportionally smaller fraction and the omission would matter less.",
  "Because the two calls answer the same question and the gap is therefore a measure of the accuracy of the march rather than of anything the march leaves out.",
  "Because the traverse prints a note whenever the omission is large enough to affect a total, so a reader is warned on the lines where the size of the gap does matter."],
 "Nothing in the traverse output says any of this. There is no zero fittings field and no note, so the absence is silent.")

q(1, "Push 20000.000000 bpd of 56.000000 lb/ft3 crude at 8.000000 cp through 2.067000 in of bore over 20000.000000 ft, entering at 100.000000 psia. What does the traverse do?",
 "It refuses, reporting that the line cannot carry this rate because the pressure reaches zero absolute before the end of the line.",
 ["It returns the station list as far as the pressure stayed positive and reports the remaining stations as null, leaving the caller to decide how far the line is usable.",
  "It returns the stations with a negative pressure at the last of them, since a traverse reports what the arithmetic produced and leaves the physical reading to the caller.",
  "It clamps the arriving pressure to atmospheric and attaches a warning that the duty exceeds what the line will pass."],
 "A rate that costs more than the inlet holds is a rate the line cannot pass. The traverse is the call that knows the inlet, so it is the one in a position to refuse.")

q(3, "The refusal on that line arrives with evidence attached. How many stations does it report standing behind, and what is the last of them?",
 "One station, at 0.000000 ft and 100.000000 psia.",
 ["Three stations, the last of them at 20000.000000 ft, which is the distance the refusal names as the point the march died at and therefore the last row it computed.",
  "No stations at all, since a refused call returns its error in place of the list and the distance it died at is the only positional figure it carries.",
  "Two stations, the inlet at 100.000000 psia and the point at which the pressure first crossed zero absolute, which together bracket the failure."],
 "Four pieces of evidence travel with the error string: the stations it stood behind, the last of those stations, the distance it died at of 20000.000000 ft, and the pressure the arithmetic produced there.")

q(0, "The refusal reports that the arithmetic produced -47328.563502 psia at 20000.000000 ft. Why is that figure shown rather than returned?",
 "Because it is not a pressure at all, so it is presented as evidence of what the arithmetic implied rather than as an answer to the question that was asked.",
 ["Because it is the drop rather than the pressure, and a drop is reported separately from the station list on every traverse whether or not the call refuses.",
  "Because it lies below the floor of the bracket the traverse searches, so it can be quoted as a bound on the answer but not as the answer itself.",
  "Because it is an intermediate value from the segment loop that the engine had not yet corrected for elevation when the refusal fired."],
 "The engine ran the case, produced arithmetic, examined what that arithmetic implied and declined to present the result as a pressure. A call that had not checked would have returned it as though it were an answer.")

q(2, "The same line that the traverse refuses is answered by the single call underneath, which reports a spend of 47428.563502 psi. Why do the two calls disagree?",
 "They were asked different questions: the single call was asked what the duty costs, and the traverse was asked where the fluid is starting from 100.000000 psia.",
 ["The single call omits the fittings while the traverse carries them, and on a duty this severe that difference is large enough to move one call across the physical boundary and not the other.",
  "The single call works in the friction term alone while the traverse adds the elevation, and the line falls far enough over 20000.000000 ft for the two to separate by that margin.",
  "The single call converged and the traverse did not, which is why one of the two returns a number and the other returns the last state its iteration reached."],
 "A line can cost more pressure than any inlet holds, in the same way a journey can cost more money than is in the account. The cost is real and the balance is what makes it impossible.")

q(1, "Of the evidence the refusal carries on that failing line, which piece is the actionable one for a designer?",
 "The distance it died at, because compared against the length of the line it says whether the duty is slightly beyond the line or nowhere near it.",
 ["The pressure the arithmetic produced, because its size against the inlet says how far the duty would have to fall before the line could carry it.",
  "The error string, because it names the state the method has no answer for and therefore says which of the stated inputs has to be changed.",
  "The number of stations the march stood behind, because it locates the failure along the profile in the same way a worst station does on a line that completes."],
 "That figure is the difference between resizing a bore and rethinking a scheme. The error string says only that the line cannot carry the rate, which is what the designer already suspected.")

emit(Q, '/root/fc-wip-linesizing/banks/fc2i_m05.json')
finish()
