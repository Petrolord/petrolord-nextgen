import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 Professional m02: The Fatal Accident Rate.
# Digest section 16 (FAR from PLL, the exposed hours, the safety statistics
# base and the golden FAR cases), with section 3 for the one FAR refusal and
# section 34 for the unit rule. FAR is always per 100,000,000 exposed hours.

q(2,
 "The JISIKE crew PLL is 0.002420000000 fatalities per year. The crew is 60 people, each exposed 2000 hours a year. What FAR does the engine return?",
 "2.016667",
 ["121.000000","0.020167","5.000000"],
 "FAR is PLL times 100,000,000 over the exposed hours a year, and the crew's exposed hours are 60 times 2000, 120000, which gives 2.016667. 121.000000 divides by one person's 2000 hours instead of the crew's. 0.020167 uses a base of 1,000,000 hours. 5.000000 is the FAR of a PLL of 2 over 4e+7 hours, a different case.")

q(0,
 "What exposed hours a year go into the JISIKE crew FAR?",
 "120000, the 60 people on the crew at 2000 hours each",
 ["2000, the hours of any one person on the crew",
  "8760, one person present for the whole year on board",
  "4e+7, the hours of the case checked against the other course"],
 "The course derives 120000 exposed hours a year from 60 people each exposed 2000 hours, and that is what the crew's PLL is divided by, since the PLL counts deaths across the whole crew. 2000 is one person's hours and gives the inflated 121.000000. 8760 is a whole year for one person and belongs to occupancy. 4e+7 is the stated hours of the whole-PLL check against the safety statistics course.")

q(3,
 "An analyst divides the JISIKE crew PLL by the 2000 hours one person works. Which FAR do they report?",
 "121.000000",
 ["2.016667","0.020167","1.312785"],
 "Dividing by one person's hours gives 0.002420000000 times 100,000,000 over 2000, which the course shows as 121.000000, sixty times the right figure. 2.016667 is the engine's FAR over the crew's 120000 hours. 0.020167 is the crew figure on the wrong base of 1,000,000 hours. 1.312785 is the golden platform case, a different set of inputs.")

q(1,
 "Which is the engine's model string for the fatal accident rate, verbatim?",
 "FAR = PLL x 100,000,000 / exposed hours per year",
 ["FAR = PLL x 1,000,000 / exposed hours per year",
  "FAR = PLL x exposed hours per year / 100,000,000 hours",
  "FAR = IRPA x 100,000,000 / 8760 hours per year"],
 "The course quotes the model string exactly as the key reads it. A base of 1,000,000 hours is the mistake that turns the JISIKE crew figure into 0.020167. Multiplying by the hours inverts the rate. The FAR is built from a PLL, the expected deaths of a group, and an IRPA over a year of 8760 hours is one person's individual risk.")

q(2,
 "A FAR is requested over zero exposed hours. Quote the refusal the engine sends back.",
 "exposedHoursPerYr: must be above 0 hours: a rate over no exposure is undefined",
 ["initiatingFrequencyPerYr: must be a frequency above 0 per year",
  "locations[0].hoursPerYr: 'deck' must lie in [0, 8760] hours",
  "locations: the occupancy fractions sum to 1.1: one person cannot spend more than the whole year across locations"],
 "The refusal table gives this exact string for no exposed hours, naming the field exposedHoursPerYr: a rate per hour over no hours has no value. The other three are real messages from other functions: an event tree with no initiating frequency, an occupancy of more hours than a year holds, and a roster whose fractions sum above one.")

q(3,
 "The engine's FAR base is imported from another engine. Which one does the basis name?",
 "The safety statistics engine's RATE_BASES.FAR_100M, IOGP fatalities per 100,000,000 hours",
 ["The hours in a year of the LOPA course's engine, 8760, which this engine also imports and which belongs to that course",
  "The Purple Book section 6.3 definition of societal risk, taken from its own printed tables",
  "The R2P2 paragraph 136 point, read as a rate per 100,000,000 hours of exposure"],
 "The course quotes the basis source as engines/hse/safetyStats.js RATE_BASES.FAR_100M (IOGP: fatalities per 100,000,000 hours). The H3 hours in a year is imported too, but it converts occupancy hours for individual risk and sets no FAR base; the LOPA method itself belongs to the LOPA course. Purple Book section 6.3 defines the F-N curve, and the R2P2 point is a frequency of fifty or more deaths per year.")

q(1,
 "A PLL of 2 over 4e+7 exposed hours is stated. What FAR does this engine return, and what does the safety statistics engine return for 2 fatalities over the same hours?",
 "5.000000 from each, the same number to the last bit",
 ["5.000000 here and a hundred times less there, since that course works per 1,000,000 hours",
  "12.000000 here and 5.000000 there, since this engine counts expected deaths",
  "2.016667 from each, since both divide by the crew's hours"],
 "The course shows 5.000000 from both engines on these inputs, the same number to the last bit, because the base is shared. The safety statistics course states its FAR per 100,000,000 hours as well, so no factor of a hundred separates them. 12.000000 is the golden whole-count case. 2.016667 is the JISIKE crew figure, whose PLL and hours are different.")

q(0,
 "The same base gives the same FAR in this course and in the safety statistics course. What separates the two numbers?",
 "That course counts deaths that happened; this one counts deaths expected",
 ["That course counts hours on shore as well; this one counts hours offshore only",
  "That course uses a base of 1,000,000 hours; this one uses 100,000,000",
  "That course reports the FAR as a probability; this one reports it per year"],
 "The course says it plainly: the safety statistics course counts deaths that happened, and this one counts deaths expected, through a PLL. The base is RATE_BASES.FAR_100M in both, per 100,000,000 hours, so a PLL of 2 over 4e+7 hours gives 5.000000 in each. Neither engine splits hours by location, and a FAR is a rate per exposed hours in both, never a probability.")

q(2,
 "Which pair of figures does the course print for the two golden FAR cases run through the engine?",
 "platform 1.312785 and whole-count 12.000000",
 ["platform 2.016667 and whole-count 5.000000",
  "platform 121.000000 and whole-count 12.000000",
  "platform 1.312785 and whole-count 0.020167"],
 "The course shows the golden FAR cases as platform 1.312785 and whole-count 12.000000. 2.016667 and 5.000000 are the JISIKE crew and the check against the safety statistics course. 121.000000 is the crew over one person's hours, and 0.020167 is the crew on a base of 1,000,000 hours, both wrong builds of a teaching stream.")

q(1,
 "How does a FAR differ from an IRPA?",
 "A FAR is expected fatalities of a group per 100,000,000 exposed hours; an IRPA is one person's individual risk per year over the places they occupy.",
 ["They are one quantity in two units, since a FAR is simply an IRPA multiplied by 100,000,000 and then divided by the hours worked.",
  "A FAR is a probability of death per hour of work, while an IRPA is the count of deaths expected over a whole year across a crew.",
  "A FAR follows one person through a working year, while an IRPA spreads a whole crew's expected deaths over the hours in a year."],
 "The course builds the FAR from a PLL, expected deaths across everyone, divided by the exposed hours of that population, and builds the IRPA as the sum over places of LSIR times occupancy for one person. The two answer different questions and neither converts into the other by a unit change. A FAR is a rate and no probability, and the reading that has the FAR following one person swaps the roles of the two quantities.")

q(3,
 "Why is 121.000000 the wrong FAR for the JISIKE crew?",
 "The PLL counts deaths across all 60 people, so its hours must be the crew's 120000; one person's hours inflate the rate sixty times.",
 ["It uses the right hours on the wrong base, 1,000,000 hours, so the figure it reports is a hundred times too large for this crew.",
  "It leaves out the spill with no one near, whose frequency is the largest of the four crew scenarios in the whole set.",
  "It treats the crew PLL as a probability, and a probability cannot be spread over the hours of a whole working year."],
 "The course shows 121.000000 as the PLL over one person's hours, beside the engine's 2.016667 over the crew's 120000. Dividing a group's expected deaths by one member's hours overstates the rate by the head count. The wrong base gives 0.020167, which is too small. The spill adds zero to the PLL either way, and nothing in the calculation reads the PLL as a probability.")

q(0,
 "A FAR call is made directly. What must the caller pass to fatalAccidentRateFromPll?",
 "pllPerYr and exposedHoursPerYr",
 ["scenarios with frequencyPerYr and fatalities, summed inside the call",
  "pllPerYr and a head count of the crew, with 8760 hours per person",
  "individualRiskPerYr and the hours one person spends on the plant"],
 "The function table in the course lists pllPerYr and exposedHoursPerYr, and the call returns the FAR per 100,000,000 exposed hours. The scenarios go to potentialLossOfLife first, whose PLL is then passed in. No head count is taken, since the caller supplies the exposed hours directly. An individual risk per year belongs to other functions and never feeds the FAR.")

q(2,
 "A report quotes the JISIKE crew FAR as 2.016667 with no unit beside it. What does the course's vocabulary require?",
 "That it be stated per 100,000,000 exposed hours",
 ["That it be stated as expected fatalities per year",
  "That it be converted to a probability before it is quoted",
  "That it be stated per person per year of exposure on board"],
 "The course's vocabulary rules that FAR is always per 100,000,000 exposed hours, because the same rate appears in the safety statistics course and a bare number invites a wrong base. Expected fatalities per year is the unit of the PLL. A FAR is never a probability, and a figure per person per year is the shape of an individual risk.")

q(1,
 "The JISIKE crew FAR is 2.016667. What would the same PLL give on a base of 1,000,000 hours, and why is that wrong?",
 "0.020167, a hundred times too small, since the base is fixed at 100,000,000 hours",
 ["121.000000, since the smaller base divides by the hours of one person on the crew instead",
  "5.000000, since the smaller base matches the safety statistics course",
  "2.016667, since the base cancels out whenever the hours are the whole crew's own"],
 "The course shows 0.020167 for a base of 1,000,000 hours, derived, and the engine's base is 100,000,000 hours, imported from the safety statistics engine. 121.000000 is a different mistake, one person's hours. The safety statistics course uses the same 100,000,000 hour base, and its matching case is 5.000000 on other inputs. The base never cancels, since it multiplies the PLL directly.")

q(0,
 "The engine's FAR is built from a PLL. What does that make the FAR's deaths?",
 "Expected deaths, an average per year, so a FAR here need not come from any death that happened",
 ["Recorded deaths from the incident log, averaged across the exposed hours of the crew in that year",
  "The deaths of the single worst scenario in the set, since a FAR is read at its largest contribution",
  "The deaths of scenarios with an N of one or more, since fractional N is dropped before the rate is taken"],
 "PLL is expected fatalities per year, the sum of f times a stated N, so the FAR built on it counts deaths expected, which is how the course separates it from the safety statistics course that counts deaths that happened. The FAR takes the whole PLL, every scenario included. A fractional N such as 0.5 stays in the sum, since the engine accepts an expected number that is not whole.")

emit(Q, '/root/hse-wip-qra/banks/h5i_m02.json', expect_n=15)
finish()
