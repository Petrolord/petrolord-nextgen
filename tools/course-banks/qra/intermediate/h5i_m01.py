import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 Professional m01: Potential Loss of Life.
# Digest sections 15 (PLL as the sum of f times N), 1 and 3 (what the engine
# computes and the refusals of potentialLossOfLife) and 34 (the vocabulary).
# Every N is a STATED input; this bank never asks for one to be computed.

q(1,
 "The JISIKE crew scenarios are stated as a process fire at 5e-4 per year with N of 1.2, a module explosion at 4e-5 per year with N of 8, a fall from height at 3e-3 per year with N of 0.5, and a spill with no one near at 6e-3 per year with N of 0. What PLL does the engine return?",
 "0.002420000000",
 ["0.006421666667","0.009540000000","0.000336000000"],
 "PLL is the sum over scenarios of the frequency times the stated N, and the four products 0.000600000000, 0.000320000000, 0.001500000000 and 0.000000000000 add to 0.002420000000 fatalities per year. 0.006421666667 divides each frequency by its N where the model multiplies. 0.009540000000 adds the four frequencies and ignores N altogether. 0.000336000000 is the expected fatalities of the JISIKE off-site set, which is a different group of scenarios.")

q(2,
 "Of the four JISIKE crew scenarios, which one carries the largest single contribution to the crew PLL?",
 "The fall from height, at 0.001500000000 per year",
 ["The module explosion, at 0.000320000000 per year",
  "The process fire, at 0.000600000000 per year",
  "The spill with no one near, at the largest frequency, 6e-3 per year"],
 "The contribution of a scenario is its f times N, and the fall from height gives 3e-3 times 0.5, which is 0.001500000000 per year, the largest of the four. The module explosion has the largest N of 8 but a small frequency, so it adds only 0.000320000000. The process fire adds 0.000600000000. The spill has the largest frequency but an N of 0, so it adds nothing at all.")

q(0,
 "What does the module explosion alone, stated at 4e-5 per year with an N of 8, add to the JISIKE crew PLL?",
 "0.000320000000",
 ["0.000040000000","0.000600000000","0.001500000000"],
 "The module explosion contributes f times N, 4e-5 times 8, which the engine prints as 0.000320000000 per year. 0.000040000000 is the frequency alone with N ignored, the mistake that inflates the whole set to 0.009540000000. 0.000600000000 is the process fire and 0.001500000000 is the fall from height, both of them other rows of the same table.")

q(3,
 "The engine's model string for PLL says something about N beyond naming it. What does it say?",
 "N is the expected number of deaths of the scenario and is not necessarily whole, citing PB 6.3 and 6.4.",
 ["N must be a whole count of deaths, since a fraction of a person cannot die, and a fractional N is rounded up first.",
  "N is the head count present in the area of the scenario, whether or not anyone there would die in it.",
  "N is the probability of death at the scenario's worst place, multiplied by one hundred people."],
 "The model string reads, verbatim: \"PLL = sum f_i x N_i; N the expected number of deaths of the scenario (PB 6.3, 6.4: not necessarily whole)\". The engine accepts an N of 1.2 or 0.5 without rounding, because an expected value need not be a whole number. A head count is the population before any probability of death is applied to it. N is a number of deaths, so a probability dressed as N misreads the input entirely.")

q(1,
 "The JISIKE spill with no one near is stated at 6e-3 per year with an N of 0. What happens to it in the PLL call?",
 "It is accepted and adds 0.000000000000 per year, since f times an N of 0 is zero whatever the frequency.",
 ["It is refused, because the engine requires every scenario to carry an N above zero before it will sum anything.",
  "It adds its whole frequency of 6e-3 per year, since each scenario is counted once whether anyone dies in it.",
  "It is dropped from the list before the sum and its frequency is reported in a separate field beside the PLL."],
 "The digest's table prints the spill's f times N as 0.000000000000, and the engine accepts an N of 0 because the allowed range is 0 or more. Only a negative N is refused. Counting its frequency is the N ignored mistake behind 0.009540000000. Setting zero death scenarios aside with their frequency reported is what the F-N curve does, and the PLL call simply carries the zero contribution.")

q(0,
 "A PLL call is given a scenario named 'fire' with fatalities of minus one. The engine refuses it. Which message is the engine's own words?",
 "scenarios[0].fatalities: 'fire' must have 0 or more fatalities (an expected number need not be whole)",
 ["scenarios[0].frequencyPerYr: 'fire' must have a frequency of 0 or more per year",
  "scenarios[0].fatalityProbability: 'fire' must be a probability of death in [0, 1]",
  "scenarios[0].name: every scenario needs a name"],
 "The refusal table in the digest gives this exact string for negative fatalities in potentialLossOfLife, naming the field scenarios[0].fatalities. The other three are real engine messages for other inputs: a negative frequency in locationIndividualRisk, a probability of death above one in the same function, and a nameless scenario in fnCurve. None of them is what a negative N returns.")

q(2,
 "A manager reads the JISIKE crew PLL of 0.002420000000 as the chance that someone on the crew dies this year. What does the course say about that reading?",
 "PLL is an expected number of deaths per year, never a probability, and for a large enough population it can exceed one.",
 ["It is a fair reading while the figure stays below one, and it becomes a count only after it passes one.",
  "It is right, since PLL is the probability that at least one of the 60 people on the crew dies in the year.",
  "It is right once the PLL has been divided by the crew's head count, which turns the expected value into a chance."],
 "The digest says PLL is an expected number of deaths per year, that it is never a probability, and that it can exceed one for a large enough population, so no threshold turns it into a chance. The probability that at least one person dies is a different quantity the engine never returns. Dividing by the head count gives a figure per person, which is still an expectation and still no probability.")

q(3,
 "Which inputs does potentialLossOfLife take?",
 "scenarios with frequencyPerYr and fatalities",
 ["scenarios with frequencyPerYr and fatalityProbability, one per place",
  "pllPerYr and exposedHoursPerYr, both as plain numbers per year",
  "locations with lsirPerYr and occupancyFraction or hoursPerYr"],
 "The function table in the digest lists potentialLossOfLife as taking scenarios with frequencyPerYr and fatalities, and returning the PLL and each scenario contribution. Scenarios with a fatalityProbability feed locationIndividualRisk, which returns an LSIR. pllPerYr and exposedHoursPerYr feed fatalAccidentRateFromPll. Locations with an LSIR and an occupancy feed individualRiskPerAnnum.")

q(0,
 "Individual risk follows one person. What question does potential loss of life answer instead?",
 "How many deaths a year are expected across everyone the scenarios reach, as the expected value of societal risk.",
 ["What individual risk the most exposed person on the crew carries, taken over every place they occupy in the year.",
  "What individual risk a person would carry at one place all the time, outdoors and unprotected there.",
  "How often an event kills fifty or more people at once, read against the one published R2P2 point."],
 "The digest opens the Professional tier by saying individual risk follows one person while societal risk asks how many die at once, and PLL is its expected value. The most exposed person over a year is an IRPA, and one place all the time is an LSIR, both of them Associate quantities. The frequency of fifty or more deaths is a point on the F-N curve, which is a different view of the same societal picture.")

q(1,
 "The golden case fractional-and-zero-N carries one fractional N and one N of zero. What PLL does the engine return for it?",
 "0.000685000000",
 ["0.002420000000","0.000336000000","0.000600000000"],
 "The digest runs the golden case fractional-and-zero-N through the engine and prints 0.000685000000 per year. 0.002420000000 is the JISIKE crew PLL and 0.000336000000 the JISIKE off-site expected fatalities, both teaching streams with their own inputs. 0.000600000000 is the process fire contribution alone.")

q(3,
 "Where does the expected number of deaths N of each scenario come from when a PLL is built?",
 "It is a stated input: the probability of death, from the consequence course, taken over the population cell by cell, and this course never computes it.",
 ["The PLL call derives it from the LSIR at each place times the head count there, so the caller types only frequencies.",
  "It is read from the event tree, whose leaf probabilities give the share of the crew that dies in each outcome.",
  "It is the crew's head count, 60, scaled down by the fraction of the year the crew is exposed on board."],
 "The seam table in the digest says N is the probability of death over the population, cell by cell, and that this course takes it as a stated input; producing a probability of death belongs to the consequence course. The PLL call takes N as typed and derives nothing. An event tree gives outcome frequencies, and a head count scaled by exposure is still no number of deaths.")

q(2,
 "Summing f over N for the JISIKE crew gives 0.006421666667. What is wrong with that figure?",
 "It divides each frequency by its N where the model multiplies, so it is no count of deaths at all.",
 ["Nothing, since it is the engine's PLL read per death, which the vocabulary also accepts under that name.",
  "It leaves out the spill with no one near, whose frequency of 6e-3 per year the engine would have added in.",
  "It counts the fall from height twice, once for each half of its N of 0.5 that the engine keeps."],
 "The digest's table of how PLL was built prints 0.006421666667 as the sum of f over N, derived, beside the engine's 0.002420000000 from f times N. The model string multiplies, and nothing in the engine or its vocabulary reads a PLL per death. The spill adds nothing to f times N and cannot be divided by, so leaving it out of the wrong sum changes nothing. Nothing in either route counts a scenario twice.")

q(1,
 "The vocabulary this course legislates fixes how PLL is described. Which description follows the rule?",
 "Expected fatalities per year, never a probability",
 ["The probability of a fatal accident in a year",
  "Fatalities per 100,000,000 exposed hours of the crew",
  "The yearly chance of death for the average worker on board"],
 "Section 34 of the digest rules that PLL means expected fatalities per year and is never a probability, because it is easy to misread as one. A chance of a fatal accident or a chance of death per worker are exactly the misreadings the rule is there to stop. Fatalities per 100,000,000 exposed hours is the unit of the FAR, which is computed from a PLL and is a different quantity.")

q(0,
 "When potentialLossOfLife refuses an input, what does it return?",
 "An object carrying error and field, where field names the offending input",
 ["A PLL of zero, with the reason for the refusal written into its basis block",
  "The PLL of the valid scenarios, with the refused one dropped from the sum",
  "A thrown exception carrying a stack trace and no field of its own"],
 "The digest says every function returns either a result object carrying a basis block or an object with error and field, where field names the offending input. A zero PLL would read as a real answer, and a partial sum would hide a scenario the analyst typed, so the engine returns neither. It returns the refusal as data, which is why every refusal in the table names a field.")

q(2,
 "The engine's own header lists what it declines to do. Which of these is on that list?",
 "It has no aversion weighted integral, and implements the expected value sum of f times N instead.",
 ["It computes N itself from each scenario's frequency whenever the caller leaves the fatalities out.",
  "It refuses any scenario whose N is not a whole number, since an expected count must be an integer.",
  "It rounds every PLL to three significant figures, matching the way the Purple Book prints its figures."],
 "The digest reads from the engine's header that it has no aversion weighted risk integral, because no source it read defines one, and that the expected value sum of f times N is implemented instead. The engine invents no number, so it never fills in an N. A fractional N is accepted, as the model string says. PLL is printed at twelve decimals, and the rounding of a published source is about that source.")

emit(Q, '/root/hse-wip-qra/banks/h5i_m01.json', expect_n=15)
finish()
