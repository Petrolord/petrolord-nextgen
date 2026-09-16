import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(3, "The minus 30 percent oil price end of the EGINA sweep is 466.5563. How was that figure produced?",
 "By re-running the whole case with one input changed, royalty, tax, the discount at 10.0000 percent and the production shape all included.",
 ["By scaling the base of 2015.4123 million USD down in proportion to the price move, which is what would make the two ends of the row symmetric about it.",
  "By taking the revenue of 16095.0492 down by 30 percent and carrying that difference straight through to the value the case finally reports.",
  "By discounting the base case at a rate 30 percent higher than 10.0000 percent, which is how the sweep expresses a fall in the price."],
 "A full re-calculation is why the ends are not symmetric about 2015.4123: 466.5563 and 3564.2683 are not the same distance from it.")

q(1, "What combination of moves can the EGINA sweep never show?",
 "Two drivers moving together, so a price fall arriving with a capex overrun sits outside the table entirely.",
 ["A move of more than 30 percent in any driver, since the sweep re-runs the case only at the two ends its own convention fixes.",
  "A fall in the value produced by a rise in a driver, since three of the four drivers raise the value when they themselves rise.",
  "A move in the production shape, since the sweep changes when the plateau ends each time it scales the profile up or down."],
 "The worst single figure in the table is 466.5563, which is the worst the sweep can produce and not the worst the project can suffer.")

q(2, "Ranked by swing the EGINA drivers run Oil Price, Production, CAPEX, OPEX. What does that ordering establish?",
 "Which input the value of this case is most exposed to, given a move of the same relative size, 30 percent either way, in each of the four drivers.",
 ["Which input is most likely to move far enough to matter, which is what would let a drilling capex and a long run oil price be ranked against one another.",
  "Which input the engine is least certain of, since a wider swing reflects a looser estimate behind the number that was entered for it.",
  "Which input carries the most money, since a swing of 3097.7119 is the share of the revenue of 16095.0492 that the price controls."],
 "A 30 percent move in a drilling capex and a 30 percent move in a long run oil price are not comparable events, and the ranking says nothing about either.")

q(0, "A reviewer sets the EGINA price swing of 3097.7119 against a swing reported on a different project. What is wrong with that?",
 "Each swing is a share of its own base, so the two are not on one scale.",
 ["The other project was not run on the same terms, royalty 12.5000 percent and tax 30.0000 percent, so only its ends may be compared.",
  "A swing is comparable only where both cases were discounted at 10.0000 percent, and a sweep does not record the rate it was run at.",
  "The sweep moves one driver at a time, so only a single driver swing from a single case may ever be set beside another on a page."],
 "As a share of its own base the EGINA price swing is 1.537012, which is the figure that travels between cases; 3097.7119 does not travel.")

q(1, "A 30 percent move in price and a 30 percent move in production both scale revenue, yet the price swing is 3097.7119 and the production swing 2844.8375. Why?",
 "A barrel carries its own variable operating cost of 5.0000 USD and a dollar of price does not, so the extra barrels give part of their earnings back.",
 ["Royalty at 12.5000 percent and tax at 30.0000 percent fall on the price and not on the volume, which is where the two swings separate.",
  "The production driver moves only the plateau while the price driver moves every year of the profile, so fewer years carry the volume move.",
  "The price driver is applied before discounting at 10.0000 percent and the production driver after it, which costs volume part of its effect."],
 "Over the Base life the operating cost is 3049.6464 against revenue of 16095.0492; royalty at 2011.8812 and tax at 3276.9239 take their share of both drivers alike.")

q(2, "The published case with no royalty and no tax has a base of 2738.0331, price ends of 1651.9056 to 3824.1606 and production ends of 1735.4539 to 3740.6123. What does it settle?",
 "That the gap between price and volume is not a fiscal artefact, since price stays the wider driver even with the government take removed.",
 ["That the government take is what separates the two, since the base moves from 2015.4123 to 2738.0331 once royalty and tax come out of the case.",
  "That the ordering reverses on a case with no take, which is why the production ends of 1735.4539 and 3740.6123 are quoted beside the price ends.",
  "That a case with no royalty and no tax carries no variable operating cost either, so both drivers move the value by the same amount."],
 "Price is wider on every published case, this one included: 1651.9056 sits below 1735.4539 at the low end and 3824.1606 above 3740.6123 at the high end.")

q(0, "On the published marginal case at 900 capex and 45 a barrel the base is 212.7034, the price downside is -225.0477 and the production downside is -169.4603. What does the pair show?",
 "Both downsides take the case below zero, and the price downside goes further because the barrels still being lifted still cost 5.0000 USD each while earning less for each one.",
 ["The case survives a volume shortfall and fails only on price, since -169.4603 is a smaller loss than the base is a gain.",
  "The two drivers are interchangeable here, since both ends are negative and a value below zero is a failure either way.",
  "The ordering flips on a marginal case, since -225.0477 is the further from the base and a wider fall means a smaller swing."],
 "On a marginal case the ordering decides whether a project survives at all: the upside ends are 650.4545 and 594.8670 and both downside ends are losses.")

q(3, "What would close the gap between the price row and the production row of a sweep?",
 "A case with no variable cost per barrel, since the gap comes from the operating cost the barrels carry.",
 ["A case with no royalty and no tax, since the government take is what charges the barrels rather than the price they are sold at.",
  "A larger case, since the example FPSO profile on a base of 10032.1182 carries a wider gap and a smaller case carries none at all.",
  "A longer life, since discounting at 10.0000 percent weighs the late barrels down and the price move is spread more evenly across the years."],
 "A case with a higher variable cost per barrel separates them further, and the 5.0000 USD a barrel is what splits 3097.7119 from 2844.8375.")

q(2, "The CAPEX row of the EGINA sweep reads 2658.9995 at one end and 1371.8250 at the other. Which end is the overrun?",
 "1371.8250, the plus 30 percent end of the row, and 2658.9995 is what the case is worth if the capex comes in 30 percent under.",
 ["2658.9995, since the sweep prints the ends of every row in order of size and a cost driver always puts its worst outcome first of the two.",
  "2658.9995, since an overrun raises the capex and the sweep reports the higher value against the higher spend on the row.",
  "Neither of them, since a capex move changes the deepest cash position of -2250.0000 and not the value the sweep reports."],
 "The sweep prints minus and then plus rather than in order of size, so this row runs high to low; read the label before the value.")

q(0, "Capex swings the value by 1287.1745 and operating cost by 326.3064 on the same relative move. What accounts for the difference?",
 "Capex lands in year 0 before a barrel is produced, where discounting touches it least, while operating cost spreads across the producing years and the later portions count for less.",
 ["Capex is the larger input and the sweep moves each by 30 percent, so the two swings sit in the same ratio as the inputs.",
  "Capex is charged before royalty and tax while operating cost is charged after them, so the terms absorb part of the opex move.",
  "The capex bar is symmetric about the base of 2015.4123 and the operating cost bar is not, which stretches the capex swing."],
 "As a share of base that is 0.638666 against 0.161906, and the capex move works directly on the deepest cash position of -2250.0000.")

q(2, "A chart ranks the four bars by their right hand end rather than by their swing. What does that do?",
 "It sorts the two cost drivers as though their overruns were upsides, since the CAPEX and the OPEX rows both run from high to low.",
 ["It puts the base of 2015.4123 in the middle of the chart, which is where a sweep is read from in any case and costs its reader nothing at all.",
  "It reverses the ranking of Oil Price and Production, whose right hand ends of 3564.2683 and 3437.8310 sit fairly close together on the page.",
  "It drops OPEX from the chart, since its ends of 2178.5655 and 1852.2591 both sit above the right hand end of the capex row."],
 "The swings are 3097.7119, 2844.8375, 1287.1745 and 326.3064, and only a swing puts the four rows of the sweep on one footing.")

q(3, "On the published marginal case the capex ends are 470.1383 and -44.7315. What does reading that row backwards produce?",
 "A case that fails on a cost overrun read as a case that thrives on one, since the overrun end of that row is the end that sits below zero.",
 ["A case that fails on a cost saving, since 470.1383 is the end the sweep prints first and a first end is always taken to be the adverse one on a row.",
  "No error at all, since both ends are correct runs of the case and a base of 212.7034 sits between them whichever way round they are read.",
  "A swing read at the wrong sign, which the share of base of 0.638666 corrects as soon as the row is ranked against the other three."],
 "An overrun of 30 percent takes that case from 212.7034 down to -44.7315, and the direction of the row is the only thing that says so.")

q(0, "Why may the figure 466.5563 not be labelled a P90 NPV?",
 "It is one conditional run, and a P-label belongs to a reserves distribution one fluid at a time, such as an oil P50 of 130.0000 MMbbl.",
 ["It is the low end rather than the high end, so it would have to be labelled a P10 NPV to match the convention.",
  "A P-label may be carried by a value in money, but only once the sweep is re-run on a distribution of prices.",
  "A P90 is fixed at a different exceedance from the 30 percent the sweep moves, so the label is right at another figure."],
 "Calling it a P90 asserts that a 30 percent price fall has a particular chance of being exceeded, and the sweep contains no such claim; a gas P50 of 70.0000 Bcf is what a P-label describes.")

q(2, "A manager reads the eight ends of a tornado as the range the project could land in. What is missing from that reading?",
 "Every case where two drivers move together, which the sweep never runs and which on a marginal case is worse than either end alone.",
 ["The base of 2015.4123 million USD, which the chart leaves out and which a reader needs before either end of any row can be placed at all.",
  "The upside beyond 30 percent, since the eight ends are conditional on the sweep's own convention and a driver can move a good deal further than that.",
  "The discount rate, since every one of the eight ends was struck at 10.0000 percent and a range of outcomes has to be stated before it is discounted."],
 "On the marginal case the price downside of -225.0477 and the capex overrun end of -44.7315 are both in the table, and the case where both happen is not.")

q(1, "What is a tornado chart genuinely good for?",
 "Ranking the four drivers of one case by their arithmetic leverage, as a work list for where to spend effort on tightening an estimate.",
 ["Sizing the risk carried by a case, since the widest bar of the four names the driver most likely to move by an amount that hurts the value of it.",
  "Testing whether the inputs behind a case were right, since a base that is wrong shows up as a set of ends that will not balance.",
  "Bracketing the outcome, since the widest end and the narrowest end mark the limits the case can reach on any combination of moves."],
 "A driver with a swing of 326.3064 does not repay much study on this case and one with a swing of 3097.7119 does.")

emit(Q, '/root/ec-wip-fdp/banks/ec6a_m03.json')
finish()
