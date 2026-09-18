import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Professional m01, the wetting regime.
# Every figure is from digest Section 8 at the rendering that section prints,
# with the shipped studio case from Section 19. No corrosion rate the
# correlation produced appears anywhere in this bank, and no band label is ever
# an answer, because Section 21 holds both.

q(0, "In which of the three wetting regimes does this engine read the water cut box?",
 "In the intermittent regime alone.",
 ["In the water-wet regime and the intermittent regime, since both carry water on the wall.",
  "In every one of the three, because the water cut scales the wetting factor in all of them.",
  "In the oil-wet regime alone, where it sets how much of the wall the water still reaches."],
 "In the water-wet regime the wetting factor is 1.000000 whatever the box says, and in the oil-wet regime it is 0.000000 whatever the box says. Only the intermittent regime takes the water cut through to the factor, and it is range checked there.")

q(1, "Select oil wet and the wetting factor is 0.000000. What does the engine then do with the band label and the remaining life?",
 "It withholds both and says the zero was assumed rather than calculated.",
 ["It issues both alongside the zero, since a zero is a perfectly good number to label and to divide into.",
  "It refuses the whole screening outright.",
  "It issues the band label and withholds only the life."],
 "The arithmetic ran, so this is a withholding rather than a refusal. The engine's own words are that the rate is zero by assumption, and nothing was calculated to reach it, and that an unbounded life off a dropdown is the strongest reassurance on the screen arriving from the weakest input.")

q(2, "On an oil-wet case, what does the engine report for the effective corrosion inhibition?",
 "An absence rather than a figure, reported as null.",
 ["Zero percent, which is the honest reading when there is no metal loss left to remove.",
  "One hundred percent, since with the rate at zero the programme has removed everything.",
  "The water-wet percentage, unchanged."],
 "A reported zero percent inhibition on a line that carries a corrosion inhibitor programme would be a statement about the programme, and it would be a false one. With the rate zero by assumption there is nothing for the corrosion inhibitor to be effective against, so the percentage has no subject.")

q(3, "A user types a wetting regime the engine cannot resolve. What happens?",
 "It refuses, and the message names the three regimes and quotes the string it was given.",
 ["It falls through to the water-wet branch, which is the most limiting of the three regimes.",
  "It falls through to the intermittent branch.",
  "It resolves to whichever regime was used last."],
 "The wetting regime can take the rate to zero on its own, so resolving an unrecognised string to any branch would be choosing that lever on the user's behalf from a typing mistake. The engine works hard to understand what was meant and never invents what was meant.")

q(1, "The strings oilWet, OILWET, oil-wet, Oil Wet and oil_wet all reach the same branch. What does that tell you about the matcher?",
 "It is insensitive to case and to punctuation.",
 ["It accepts any string containing the letters of a regime name in any order at all.",
  "It is insensitive to case only, and the punctuated spellings reach the branch by a separate alias list.",
  "It strips every character that is not a letter and then matches on the first three letters it is left holding."],
 "Five spellings of one idea resolve because they are unambiguous. The generosity stops at ambiguity: a string the matcher cannot resolve refuses by name rather than falling through to a branch.")

q(2, "In the water-wet regime the water cut box is set to 0.370000. What is the wetting factor?",
 "1.000000, because the box is not read in this regime.",
 ["0.370000, because the box is read in every one of the three regimes.",
  "The oil fraction, because that is what the factor is in this branch.",
  "The engine refuses the case."],
 "A learner who moves the box in the wrong regime and sees nothing happen has found a real property of the model rather than a fault in the screen.")

q(0, "Set the regime to intermittent and the water cut to 1.000000. Which regime's answer do you land on?",
 "The water-wet answer, at a wetting factor of 1.000000.",
 ["The oil-wet answer, at a factor of 0.000000.",
  "Neither, since it is a third mechanism.",
  "The water-wet answer, once availability is raised."],
 "The intermittent branch takes the water cut straight through to the wetting factor, so at a water cut of 1.000000 it produces the water-wet factor and at a water cut of 0.000000 it produces the oil-wet one.")

q(3, "The water cut argument carries a default parameter of one in the engine signature. Which way does that default point?",
 "Towards the most limiting answer, because a wetting factor of 1.000000 is the largest value the regime can take.",
 ["Towards the least limiting answer, because the wetting factor it supplies is the smallest the regime can take.",
  "Neither way, because a default parameter is never reached from the studio layer or from a direct caller.",
  "Towards the least limiting answer, because it silently switches the branch to oil wet."],
 "A direct caller that omits the key entirely gets a wetting factor of 1.000000, which is the water-wet answer, and the digest records that direction as conservative. A water cut typed as not-a-number refuses instead, and not-a-number is what the studio layer produces from a blank box.")

q(2, "Inside the intermittent regime a water cut arrives as not-a-number. What does the engine return?",
 "A refusal naming the input: the intermittent regime needs a finite water cut fraction.",
 ["A wetting factor of 1.000000, taken from the default parameter that argument carries in the engine signature.",
  "A wetting factor of 0.000000, the safest value available.",
  "A screening with that row left empty."],
 "A default parameter is reached only when an argument is genuinely absent. A value that is present and is not a number is a different thing. That is why the live studio never reaches the default, because a blank box produces not-a-number.")

q(0, "A water cut of 5 is typed into the intermittent regime. Why does the engine refuse it?",
 "A fraction is checked against nought to one, and five is outside it.",
 ["A water cut above one is read as a percentage, and the engine will not guess which unit was meant.",
  "The engine refuses any water cut larger than its own default parameter would supply.",
  "It exceeds the corrosion inhibitor availability."],
 "Nought to one on every fraction is one of the range guards this module enforces on what a caller types. The message names the value it was given, and a water cut of -0.1 refuses with the same shape.")

q(1, "Why does the engine describe the oil-wet zero as assumed rather than calculated?",
 "The zero follows by arithmetic from a word chosen in a list, and nothing was measured to produce it.",
 ["The correlation returned a small positive value that the wetting factor then rounded down to exactly zero.",
  "The result sits below the smallest positive value this module is able to print, so it is reported as zero.",
  "The corrosion inhibitor programme on that case removed the whole of the metal loss for the whole of the year."],
 "The multiplier for the oil-wet regime is 0.000000, that multiplier reaches the rate, and the regime arrived from a dropdown. The strongest reassurance on the screen would otherwise arrive from the weakest input.")

q(3, "Across the three wetting regimes, with every other input held still, what happens to the rate?",
 "It runs from its full water-wet value down to zero, with nothing but the dropdown moved.",
 ["It moves by less than the corrosion inhibitor availability moves it across that input's own range.",
  "It stays where it is, because the wetting factor is applied after the band label has been chosen.",
  "It moves only between the water-wet and the intermittent branches, the oil-wet branch being a refusal."],
 "One dropdown takes the rate to zero with nothing else touched, and that is why the regime carries a module of its own at this tier.")

q(2, "What separates the oil-wet withholding from a refusal?",
 "A refusal means no answer is available, while a withholding means the arithmetic ran and its outputs would mislead as verdicts.",
 ["There is nothing at all between them, since both of them leave the field entirely blank on the screen that the user is actually reading.",
  "A withholding names the input at fault and a refusal does not.",
  "A refusal clears when you retype the input."],
 "On the oil-wet case the rate is reported. The band label and the remaining life are held back, and that is the smallest withholding that keeps the summary consistent with the arithmetic.")

q(1, "The regime list is closed at three entries. What follows for a reader arriving from multiphase flow?",
 "There is no flow-pattern model here, so the regime is a coarse interpretation the engineer supplies.",
 ["A fourth entry is reachable by typing a flow pattern name, which the matcher resolves to the nearest of the three.",
  "The three entries are derived from the line hydraulics this module computes alongside the corrosion rate.",
  "The list is short because a longer one would not fit the dropdown."],
 "A gasWet string refuses, and so does an empty string, which is what a form produces before anybody has chosen. The module will not tell you which regime a line is in and it holds nothing to work it out from.")

q(0, "On an oil-wet case, which parts of the screening still compute?",
 "The wall shear and the chemistry figures, because none of them depends on the regime.",
 ["Nothing at all, since the regime sits at the top of the calculation.",
  "The band label and the remaining life alone.",
  "Only the corrosion inhibitor arithmetic."],
 "Only the fields downstream of the rate are held back. Reading what survives is how you tell a withholding from a refusal on the screen itself.")

emit(Q, "/root/wt-fc9-nextgen/tools/course-banks/corrosion/intermediate/fc9i_m01.json", label="fc9i_m01", expect_n=15)
finish()
