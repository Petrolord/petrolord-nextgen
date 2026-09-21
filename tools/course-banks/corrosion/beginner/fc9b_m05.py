import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Associate m05, The pH and the Water. Digest section 7, with the oil wet
# row and the pH change of section 19 that this module's fourth lesson teaches.

q(1, "The pH correction is a multiplier relative to something. Relative to what, and what is it there?",
 "Relative to the pH the correlation was fitted at, which is 4.000000, where the factor is exactly 1.000000.",
 ["Relative to neutral water, so the factor is exactly one at a pH of seven and departs from one on either side of it.",
  "Relative to the in situ pH of the shipped case, 4.500000.",
  "Relative to whichever pH the previous run happened to use."],
 "The engine returns the reference with the factor, so a reader always knows what the correction is taken against. At the reference the factor is one by definition rather than by a clamp."),

q(3, "Read the factors down the swept column. What are they?",
 "1.000000 at a pH of 4.000000, 0.316228 at 5.000000, 0.100000 at 6.000000, 0.031623 at 7.000000 and 0.010000 at 8.000000.",
 ["1.000000 at a pH of 9.000000 and 0.003162 at 4.000000, so the correction rises as the water becomes more acid across the band.",
  "0.562341 at 4.000000 and 1.000000 at 4.500000, which is the shipped in situ pH and the condition the correction is taken against.",
  "1.000000 at every pH in the band, since the correction never reaches the rate."],
 "At 4.500000 the factor is 0.562341 and at 5.500000 it is 0.177828, so the half unit steps fill the same pattern in. Above the reference the factor falls below one, which reduces the rate."),

q(2, "What is the scale free property of the pH correction, and what did the course measure for it?",
 "One decade per two pH units, and the measured ratio came out at 0.100000000000 four times across the swept band.",
 ["One decade per pH unit, and the measured ratio came out at 0.100000000000 at every step of the swept band.",
  "A halving per pH unit, and the measured ratio came out at 0.562341 four times, which is the factor at the shipped in situ pH.",
  "A fixed difference rather than a fixed ratio, and the measured step came out at 0.100000000000 across the band."],
 "Every one of the four is the same number. It is a property of the FORM of the correction rather than of the size of its slope, so it can be checked from the outside on any machine."),

q(0, "On one of the engine's worked streams the rate falls from 4.724817 mm/yr at a pH of 4.000000 to 0.014941 mm/yr at 9.000000. What is the ratio between the two ends?",
 "316.227766.",
 ["100.000000, which is the two decades the correction covers across a five unit walk in pH.",
  "0.100000000000, which is the same figure the two unit decade property is measured at.",
  "1.741101126592, which is the ratio a doubling produces anywhere in this engine."],
 "The rate falls at every step of that column and each step down is smaller than the one above it. The course asserts that on every rebuild rather than printing it once and trusting it."),

q(3, "The decade ratio is measured out of the engine rather than compared against a figure prepared in advance. Why does this course prefer that?",
 "An expected number produced by anything sharing a constant with the engine cannot test that constant, and a scale free ratio needs no expected number at all.",
 ["A scale free property can be measured at more points, so it carries more evidence than a single comparison against one expected figure.",
  "A scale free property is what the engine exports, so it is the only quantity on which a declaration and a behaviour can be compared.",
  "An expected number has to be rounded before it can be compared, and rounding is what the precision rules in this course exist to prevent."],
 "The decade property tells you the correction is a clean power law and it tells you nothing about whether the power is the published one. The slope itself is held for literature."),

q(0, "Set an in situ pH of 3.500000 on a screening. What comes back?",
 "A refusal, carrying the reference of 4.000000 so a caller can print the boundary to the user.",
 ["A factor of 1.000000000000, which is the boundary value the correction is clamped to below its own reference.",
  "A factor extrapolated from the slope and marked as such.",
  "A refusal from the range guard of nought to fourteen."],
 "The same answer comes back at 2.000000, at 3.000000 and at 3.999900. At exactly 4.000000 the engine returns a factor of 1.000000000000, which is the boundary reached by definition."),

q(2, "The engine's refusal below the reference says what, in its own words?",
 "That the pH correction is only defined at or above its reference pH of 4, that pH 3.5 is below it, and that no factor is returned rather than a factor of 1.",
 ["That the in situ pH is outside the band the correction was fitted over, and that the nearest value inside the band has been used instead.",
  "That a more acid water is a more corrosive one, and that the correction has therefore been clamped to its largest permitted value.",
  "That the screening is incomplete because the pH correction did not run, in the same words the shear refusal uses."],
 "The message names the reference so the reader is left in no doubt that the model has run out of ground. A refusal travels well, and it reaches a colleague reading the screenshot a week later."),

q(1, "Why would a factor of one below the reference be the wrong silence?",
 "It is the least limiting answer available, and it would make an input inert across a whole range while the box still accepted values.",
 ["It is the most limiting answer available, so it would report a rate above anything the correlation could support at that acidity.",
  "It would break the one decade per two pH units property, which is asserted across the whole swept band and would fail on the first rebuild of the course.",
  "It would disagree with the boundary value the engine returns at exactly 4.000000, where a factor above one is what the correction gives instead."],
 "A more acid water is not a less corrosive one. Refusing puts the limit where the user can see it and forces the next decision to be made by a person with a reason instead of by a default."),

q(2, "The reference guard and the range guard are separate. What does each one do?",
 "The range guard enforces a pH between nought and fourteen and names the value typed. The reference guard sits inside that range and refuses a chemically valid pH.",
 ["The range guard enforces the published validity band of the correlation and the reference guard enforces the band the studio accepts in its own box.",
  "The range guard runs on the whole screening door and the reference guard runs on the bare factor door, so only one of them is reachable from the studio.",
  "The range guard refuses and the reference guard clamps, which is why a pH below 4.000000 still produces a number while a pH of 15 does not."],
 "A pH of 15 comes back as an in-situ pH between 0 and 14 is required. A blank box is refused by a third message again, because a blank is a question rather than a value."),

q(0, "The shipped case runs at an in situ pH of 4.500000. Move it to 4.000000 and what happens to the rate?",
 "It rises from 0.754524 mm/yr to 1.341754 mm/yr, and below 4.000000 the engine refuses.",
 ["It falls from 1.341754 mm/yr to 0.754524 mm/yr, since the correction reduces the rate as the water becomes more acid.",
  "It stays at 0.754524 mm/yr, since the pH correction reaches the reported rate only through the wetting regime.",
  "It rises from 0.754524 mm/yr to 4.724817 mm/yr, which is the rate the correlation gives at its own fitted condition."],
 "A learner should be able to say why those two facts belong together. The pH factor at 4.500000 is 0.562341, and at the reference it is exactly one."),

q(3, "Change the in situ pH box alone on the shipped case. Which other factor in the chain moves?",
 "None of the others, which is what makes a change in the printed rate easy to attribute to a cause.",
 ["The film multiplier moves with it, because the onset expression takes the pH factor as one of its arguments.",
  "The wetting factor moves with it, because both corrections are applied to the same combined figure in the same step.",
  "The transport term moves with it, because the pH reaches the rate through the water chemistry at the wall."],
 "The pH factor is one of the multipliers applied to the combined figure the two rate terms produce, alongside the film multiplier, the wetting regime and the corrosion inhibitor credit."),

q(1, "What does in situ pH mean on that box, and why does the distinction matter?",
 "Hydrogen ion activity in the water phase at conditions, which is not a produced water sample measured at the surface.",
 ["The pH of the produced water at the surface separator, which is the measurement most operators on a live system already have to hand.",
  "The pH the correlation itself was fitted at, which is the reason the box on the studio ships already filled in at a value near the reference.",
  "The pH of the condensed water alone, which is what a top of line calculation would need and this module returns."],
 "The difference between the two numbers on a live system is not small. The box on the screen asks for the in situ value and the correction is taken against the fitted condition."),

q(2, "Take the shipped case and choose oil wet instead of water wet. What happens to the rate and to the two fields beside it?",
 "The rate becomes 0.000000 mm/yr, and both the category and the remaining life are withheld.",
 ["The rate becomes 0.000000 mm/yr, the category reads negligible and the remaining life is reported as unbounded.",
  "The rate is unchanged, because the wetting regime reaches only the summary and not the calculation behind it.",
  "The rate becomes 0.000000 mm/yr and the screening refuses, since a zero rate cannot be divided into an allowance."],
 "The binding constraint on that case reads that the model does not apply. The rate is zero because oil wetting was assumed rather than because a rate was calculated."),

q(3, "On that oil wet case the corrosion inhibition figure comes back as null rather than as zero. Why?",
 "A reported zero percent effectiveness on a line that has a corrosion inhibitor programme would be a statement, and it would be a false one.",
 ["Zero is reserved for a programme that was typed in at zero efficiency, so null is what the engine uses for every other absent figure.",
  "The corrosion inhibitor arithmetic is the one part of the chain that refuses rather than returning, so null is what a refusal looks like in that field.",
  "Null is what the field carries whenever the rate is withheld, which is the same treatment the category and the life receive."],
 "There is nothing for the programme to be effective against when the rate is zero by assumption. An unbounded life arriving off a dropdown would be the strongest reassurance on the screen resting on the weakest input in it."),

q(0, "How should the wetting dropdown be treated by the person setting it?",
 "As an assertion being made about the whole line at all times, including start up, shutdown, low rate operation and any low point where water can collect.",
 ["As a setting chosen from the water cut, since the engine reads the water cut fraction in every one of the three regimes.",
  "As a reporting preference, since the regime reaches the summary rail and the rate is computed the same way whichever is chosen.",
  "As a value the engine will correct, since an unrecognised regime falls through to the least limiting of the three."],
 "An unrecognised string is refused and the message lists the three regimes the engine accepts, so a typed regime never falls through. If the claim cannot be defended, the intermittent regime exists."),

emit(Q, '/root/fc-wip-corrosion/banks/fc9b_m05.json', expect_n=15)
finish()
