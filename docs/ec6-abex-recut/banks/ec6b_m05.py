import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(1, "The engine reports CAPEX 2250.0000 and OPEX 95.0000 a year for a plan whose seven items total more than those two figures together. Which line reaches neither total?",
 "The decommissioning provision of 260.0000, typed as ABEX, which shows in the Operate phase roll-up of 355.0000 and is charged in production year 20.",
 ["The mooring and installation line of 170.0000, which sits inside the Installation phase of 550.0000 rather than in the capex.",
  "The maintenance and integrity line of 23.0000, which is held outside the yearly total because it is charged on the barrels.",
  "The subsea system of 380.0000, which the concept already carries in a capex field of its own."],
 "An ABEX line is neither development capex nor an annual operating cost, so the 260.0000 is in neither the CAPEX total of 2250.0000 nor the OPEX total of 95.0000, and the case charges it in production year 20."),

q(3, "A reader takes the Operate phase roll-up of 355.0000 million USD as the plan's annual operating cost. What has that reader picked up?",
 "A phase total, of which 260.0000 is the decommissioning provision, in place of the 95.0000 a year.",
 ["The right figure for the plan's own case, because the screening economics charge the whole Operate phase in every year of the 20.0000 year life.",
  "The operating cost with the variable 5.0000 USD a barrel in it, as year 1 shows.",
  "The operating cost over the life, 95.0000 a year with the provision of 260.0000."],
 "Operate is 355.0000 because three lines sit in it, and read as an annual figure it charges the plan nearly four times what its economics charge it."),

q(0, "The Installation phase of the plan totals 550.0000 million USD. Which cost items make up that total?",
 "Mooring and installation at 170.0000 together with the subsea system at 380.0000.",
 ["The subsea system at 380.0000 with the part of the drilling line of 520.0000 that is spent offshore.",
  "The FPSO hull and topsides at 1180.0000 less the mooring and installation line of 170.0000.",
  "Development drilling at 520.0000 with maintenance and integrity at 23.0000."],
 "Two of the seven lines sit in Installation, 170.0000 and 380.0000, against Execution 520.0000, Construction 1180.0000 and Operate 355.0000."),

q(2, "A decommissioning provision is typed into the cost items as CAPEX rather than as ABEX. What does the engine do with it?",
 "It adds the line to the CAPEX total without a murmur, because a cost item's type is a field somebody chose.",
 ["It refuses the line by name, as it refuses a negative drilling capex, because an abandonment cost is not capex in a screening case.",
  "It moves the line back to ABEX, because the engine reads the description of a provision before it totals the items by type.",
  "It leaves the CAPEX total at 2250.0000 and raises a warning, since the Operate phase roll-up of 355.0000 already carries the line."],
 "The engine will not classify a line for you: it totals what the types say, so a provision typed as CAPEX lands in the capex the economics run on."),

q(3, "A reviewer adds the decommissioning provision of 260.0000 to the capex to be conservative. What is wrong with the figure that results?",
 "It matches nothing: the engine reports CAPEX 2250.0000, and the new number agrees with no concept estimate.",
 ["The arithmetic holds, and the only cost of it is that the Operate phase roll-up of 355.0000 then counts the same line a second time.",
  "The provision would have to be grown to the end of the 20.0000 year life first.",
  "The engine refuses a capex it did not read from the cost items itself."],
 "The case already charges the 260.0000 in production year 20, where it is deductible; put in the capex it is charged twice and twenty years too early, and it reconciles against nothing."),

q(1, "Across the Base case the operating cost totals 3049.6464 million USD, well above the 1900.0000 that 95.0000 a year over 20.0000 years gives. What is the difference?",
 "The variable charge of 5.0000 USD on every barrel produced, which the fixed OPEX total does not carry.",
 ["The decommissioning provision of 260.0000 and the maintenance and integrity line of 23.0000, which the engine adds to the operating cost across the life.",
  "The escalation the engine applies to the fixed 95.0000 through the 21 rows.",
  "The royalty of 12.5000 percent, charged inside the operating cost line."],
 "The OPEX total of 95.0000 is the fixed part only, so year 1 charges 204.5000 on a full plateau and year 4 charges 193.5500, and the difference across the life is the barrels."),

q(0, "A three year production profile is run against a price deck that holds two prices. What does the engine return?",
 "A refusal naming the year, that the deck has no price for production year 3 and every year of the profile wants one.",
 ["The NPV of -202.4284 the three price deck returns, the last price being carried into the year the deck misses.",
  "An NPV of 126.1636 and no rate of return, the missing year having been valued at zero.",
  "A warning on the card and a value built on the two years priced."],
 "The same profile with three prices is accepted and returns -202.4284, and nothing about the field changed between the two attempts."),

q(2, "A scenario priced at 0 returns an NPV of -3554.2621 million USD, while a deck missing one year's price is refused outright. Why are the two treated differently?",
 "A typed zero is the question somebody asked; a missing year is a question nobody asked, and answering it invents the input and the output together.",
 ["Zero sits inside the band of prices the engine accepts and a missing year sits outside it, in the way a price of -5 sits outside it.",
  "A zero priced barrel is valued at the default of 70.0000 USD a barrel, and the engine has no default to reach for when a year is absent.",
  "A scenario carries one price while a deck carries many, and the engine refuses any deck holding more than one price for a profile."],
 "Zero is a number somebody chose and the engine owes them its answer of -3554.2621; the missing year gets a refusal in place of a price nobody supplied."),

q(1, "A published case runs a deck shorter than its profile with the missing prices treated as zero, and returns an NPV of 126.1636 with no rate of return. What does that case show?",
 "That padding is invisible in the result: the value reads ordinary while the tail is worth nothing and the flow changes sign more than once.",
 ["That a short deck is safe so long as the missing years are valued at zero, since the case still returns a value and only the rate is withheld.",
  "That the engine pads a short deck with zero and reports the status multiple-roots as its way of saying that it has done so.",
  "That a rate of return is withheld whenever the value is small, and 126.1636 falls below the figure at which the engine reports a rate."],
 "One caller padded the missing years with 70.0000 USD a barrel and another with zero, so one plan gave two answers, and neither path said a price had been supplied."),

q(0, "How do the four drivers of the sweep rank by what each does to the value of the plan's own case?",
 "Oil price at 3097.7119, production at 2844.8375, capex at 1287.1745, then operating cost at 326.3064.",
 ["Capex at 1287.1745 first, as the one driver the plan controls, then oil price, production and operating cost behind it.",
  "Production at 2844.8375 first and oil price at 3097.7119 second, because barrels earn the revenue and the deck only prices them.",
  "Operating cost at 326.3064 first, as the only driver charged in all of the 21 rows, then capex, production and oil price."],
 "Ranked by swing the order is oil price, production, capex and operating cost, and the driver at the top moves the value by nearly ten times what the one at the bottom does."),

q(3, "The oil price swing is 3097.7119 and the production swing is 2844.8375, although both drivers scale revenue. What makes the price swing the larger of the two?",
 "A barrel carries a variable operating cost of 5.0000 USD and a dollar of price carries none.",
 ["The royalty of 12.5000 percent is charged on the price and not on the volume, so a move in the deck reaches the net cash flow untouched by it.",
  "Production is moved by 30 percent on the plateau of 60.0000 kbpd alone, while the price is moved by 30 percent in every one of the 21 rows.",
  "The capex of 2250.0000 is sized from the peak rate, so more barrels bring more spend with them and cancel part of the revenue they earn."],
 "30 percent more barrels brings 30 percent more revenue and more cost with it, so price is the stronger driver wherever barrels cost money to lift."),

q(2, "The capex row of the sweep reads 2658.9995 at minus 30 percent and 1371.8250 at plus 30 percent. What is a reader who expects every bar to grow to the right about to report?",
 "That overspending improves the plan, having read the sign of the capex sensitivity backwards.",
 ["That the capex swing of 1287.1745 is the largest of the four, because the bar drawn from 1371.8250 to 2658.9995 is the widest on the chart.",
  "That the base value of 2015.4123 falls outside the capex range, because the two capex figures sit either side of it in the wrong order.",
  "That an overrun of 30 percent is worth 2658.9995."],
 "More capex is less value, so the capex row reads high on the left and low on the right, and an overrun of 30 percent takes the case from 2015.4123 to 1371.8250."),

q(0, "Someone labels the plus 30 percent column of the sweep a P10 case and the minus 30 percent column a P90 case. What is wrong with those labels?",
 "The sweep holds no distribution: it moves one driver by 30 percent and says nothing about how likely that move is.",
 ["They are the wrong way round, because more of a driver is the low case and the label belongs on the column reading 3564.2683.",
  "They belong to the plan as a whole, so only the base value of 2015.4123 may carry one of them.",
  "They may be used on the oil price row, whose swing of 3097.7119 was measured across prices, but not on the other three."],
 "A P-label belongs to a reserves distribution, one fluid at a time, and 30 percent on the oil price and 30 percent on the operating cost are not equally likely events."),

q(1, "A plan that scores 100 percent complete has its economics section emptied. What does the studio report for it then?",
 "89 percent complete, with one named error, that total CAPEX is zero or missing.",
 ["A value of zero and 100 percent complete, because the other eight sections still carry what they carried and the check counts sections.",
  "0 percent complete and three errors, naming the project name, the reserves estimate and the total capex, as an empty plan does.",
  "89 percent complete and no error at all, because the economics fall back to the concept whenever the plan's own cost items are absent."],
 "One section emptied gives one error and a score of 89 percent, and the studio answers with a list of what is missing rather than with a number."),

q(2, "One plan carries a negative value in its economics and another carries a value of exactly zero. How does the completeness check read the two?",
 "The negative value counts as economics done at 11 percent, while the zero scores 0 percent, because a calculated zero cannot be told from an empty field.",
 ["Both count as economics done, because the check asks only whether a figure was written into the section at all.",
  "Neither counts, because the check wants a value above zero and both fail the error that total CAPEX is zero or missing.",
  "The zero counts and the negative does not, because a negative value fails validation and the section reads as not yet estimated."],
 "A negative value scores 11 percent on an otherwise empty record and a value of exactly zero scores 0 percent, which is a property of the check as published."),

emit(Q, '/root/ec-wip-fdp/banks/ec6b_m05.json')
finish()
