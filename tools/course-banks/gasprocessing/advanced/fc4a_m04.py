import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Expert m04, The Still Overhead Nobody Sells. Digest section 13, with the
# constant kinds from section 2 and the declared items from section 16.
# Lessons l01 aromatics arrive in the glycol, l02 a mole balance from ppmv,
# l03 short tons a year, l04 one molecular weight for four compounds.
# 15 questions.

q(2, "Trace an aromatic molecule from the inlet gas to the point where it leaves the plant. What is the route?",
 "Into the lean glycol in the contactor, round the loop in the rich glycol, and out with the water in the still overhead vapour.",
 ["Into the lean glycol in the contactor, out of the rich glycol in the flash drum, and away in the flash gas.",
  "Into the amine solution in the sweetening column, round the amine loop, and out of the regenerator with the acid gas.",
  "Into the lean glycol in the contactor, round the loop, and back into the dry gas when the regenerated glycol returns."],
 "Aromatics are soluble in glycol and they are in the gas, so a contactor bought to absorb water absorbs them too. In the still the glycol is boiled to drive the water off and the aromatics go with it.")

q(0, "The absorbed fraction the BTEX balance turns on is 0.150000 on the teaching stream. Where does the engine get it?",
 "From the caller, as an input with a customary default.",
 ["From the glycol circulation ratio, since the fraction absorbed follows from how many gallons meet each pound of water.",
  "From the contactor pressure and temperature.",
  "From the published cases, which fix it at the value the golden was generated with so that the balance reproduces."],
 "It is a chart or a field figure and this module does not derive it from anything. Once it has been supplied, the arithmetic from it is a mole balance and nothing else.")

q(1, "On the teaching stream at 180.000000 ppmv and an absorbed fraction of 0.150000, what does the engine return?",
 "405.8358 lb a day and 74.065024 short tons a year.",
 ["270.5572 lb a day and 49.376683 short tons a year, which is the same stream at the customary fraction.",
  "541.1143 lb a day and 98.753366 short tons a year.",
  "901.8572 lb a day and 164.588943 short tons a year."],
 "270.5572 lb a day is the same concentration at an absorbed fraction of 0.100000, 541.1143 is the same at 0.200000, and 901.8572 is 400.000000 ppmv at the fraction in the question.")

q(3, "Why does this figure sit in the Expert tier when the arithmetic behind it is the simplest in the module?",
 "Because it is the number a dehydration unit produces that nobody asked it to produce, and a designer who has never seen it computed will not have it when a permit writer asks.",
 ["Because the mole balance needs the standard cubic feet in a pound mole, which is the one derived constant the lower tiers never meet.",
  "Because a speciated emissions inventory is the hardest answer this module gives, and speciation is what separates the tiers.",
  "Because it is the only figure in the module that cannot be reproduced from the published cases, so it takes an expert to verify."],
 "It is also the clearest case in the module of the doctrine the whole engine is written against. The absorbed fraction is a choice, so it is an input on the page. The mole balance is computable, so it is computed.")

q(0, "What kind of operation is every step in the chain from a concentration in ppmv to a mass a day?",
 "A multiplication.",
 ["A multiplication, except for the last step, which solves for the mass that closes the loop balance.",
  "A multiplication, except for the molecular weight, which is looked up for the compound the caller names.",
  "A multiplication at the front and a division at the back, since the time base and the mass base both divide out."],
 "A concentration in parts per million by volume is a mole fraction. Multiply by the moles the plant handles, by the fraction the glycol absorbs and by a molecular weight, and convert the bases. No step solves anything, iterates or looks anything up.")

q(2, "Tripling the concentration from 60 to 180 ppmv at a fixed absorbed fraction multiplies the pounds a day by 3.000000000000, and doubling the fraction from 0.1 to 0.2 at a fixed concentration multiplies it by 2.000000000000. Where do those two figures come from?",
 "The lesson dividing two rows of the printed table by one another.",
 ["The engine, which returns a sensitivity beside each answer so a reader can see how the balance responds.",
  "The oracle, which publishes the ratio as a case of its own.",
  "An assumption about what a mole balance ought to do."],
 "Neither figure is an estimate. If either had come back as anything other than a clean whole number, something in the chain would have been doing more than multiplying.")

q(1, "A reader concludes from the linearity of that table that the absorbed fraction holds across the whole concentration range the table covers. What is wrong with the conclusion?",
 "Linearity is a property of the arithmetic, which was given one multiplier and told to apply it at every row.",
 ["The table covers only two concentrations at a fixed fraction, so it says nothing about linearity at any other pair of rows.",
  "The fraction does hold, and a fraction that moved would curve the column.",
  "Linearity in the pounds a day does not carry to the short tons a year."],
 "A real glycol loop does not absorb a fixed fraction of the aromatics at every concentration, every temperature and every circulation rate. Read the columns as what follows from the fraction you supplied.")

q(3, "The absorbed fraction is a typed operating value. What happens to a relative uncertainty attached to it?",
 "It lands unchanged on the pounds a day and on the short tons a year, because there is no damping anywhere in the chain.",
 ["It is reduced by the mole balance, since a fraction multiplied into a much larger molar flow contributes less of the spread than it started with.",
  "It cannot be carried through at all, because a declared constant has no uncertainty a course can quote.",
  "It affects the pounds a day alone, since the short tons a year comes from a measured group whose own spread dominates it."],
 "That is the honest use of linearity. A traceable answer is one whose uncertainty can be stated as plainly as its value.")

q(0, "Why does the engine report the still overhead in two units at once rather than in one?",
 "A pounds a day figure is what an operator recognises on a shift and a short tons a year figure is what a permit is written in.",
 ["Because the mole balance produces the annual figure and the daily figure is the one the studio renders, so both are returned to keep the two screens in step.",
  "Because the two figures come from two different calls and returning them together saves the caller from making the second one.",
  "Because the annual figure carries the absorbed fraction and the daily figure does not, so a reader can see the effect of the fraction by comparing them."],
 "Both come from the same mole balance and neither is a conversion a reader has to perform. Handing over one and asking the reader to convert is how a factor of the wrong size gets introduced.")

q(2, "The course prints 0.182500000000 for the still overhead. What is that figure?",
 "The days in a year over the pounds in a short ton, measured as one BTEX answer over another from the same call.",
 ["The short tons a year at an absorbed fraction of one, which is the basis every other fraction scales from.",
  "The fraction of the aromatics in the inlet gas that the still overhead actually carries out of the plant.",
  "The pounds a day over the short tons a year, which is the direction a reader converts in."],
 "It is the short tons a year over the pounds a day. Divide 74.065024 by 405.8358 and the same figure comes back.")

q(1, "Why can that pair of constants only be measured as a group?",
 "The engine never uses either of them separately, so nothing outside it can pull them apart.",
 ["Because each of the two is declared rather than derived, and a declared constant can be pinned as a group but never measured alone.",
  "Because one call can never expose more than one constant.",
  "Because the days in a year is not exported under a name of its own."],
 "What can be measured from outside is their ratio, by taking one answer of a call over another answer of the same call. A group cannot say which of its parts is wrong when the group is.")

q(3, "A constant is measured out of the engine and the course prints a ratio of 1.000000000000 between the measurement and the exported name. What has that established?",
 "That the exported name and the number the arithmetic actually uses are the same number.",
 ["That the constant is correct, since a measurement agreeing with an export to twelve decimals is as close to a proof as a constant gets.",
  "That the constant is derived rather than declared.",
  "That the published cases would fail if it were changed."],
 "It is a small claim and a real one. What it does not say is whether the value itself is right, which for a declared constant nothing in this package can say.")

q(2, "The mole balance carries a molecular weight with a default of 92.000000. What is that number?",
 "Toluene, standing for a four-compound cut.",
 ["The mean of the molecular weights of benzene, toluene, ethylbenzene and the xylenes, weighted by their usual shares in the cut.",
  "Benzene, which is the compound a permit cares about most and therefore the conservative choice for a screening figure.",
  "A chart value read against the glycol solubility of the cut, which is why it appears with the absorbed fraction."],
 "A real BTEX cut is four compounds with four different molecular weights and four different solubilities in glycol, and this module represents the whole cut with a single figure.")

q(0, "Which of the three kinds of constant is that molecular weight, and what does its kind allow?",
 "Declared, so pinning it is all any gate can do.",
 ["Measured, so the course can ask the engine a question whose answer is the molecular weight and nothing else.",
  "Derived, so it cannot be wrong unless the thing it is computed from is wrong as well.",
  "Declared, so the published cases check it against the golden every time they are run."],
 "The module exports it in one place under its own name and its own comment says that pinning it is all any gate can do. Pinning records that a change would be a reviewed act rather than an edit nobody noticed.")

q(1, "What is a BTEX answer from this module a screening figure for, and what will it not survive?",
 "Sizing a still overhead route or a vapour recovery decision, and it will not survive being presented as a speciated emissions inventory.",
 ["Setting the absorbed fraction for a loop at a new concentration, and it will not survive a change in the circulation ratio.",
  "Comparing two glycols on their aromatic pickup, and it will not survive a change in the inlet concentration.",
  "Estimating the reboiler duty the overhead adds, and it will not survive being quoted in short tons a year."],
 "The honest reading is a total mass of aromatics at a stated molecular weight and a stated absorbed fraction, both of which the user supplied. Benzene is usually the compound a permit cares about most and the engine offers no way to split the cut.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/advanced/fc4a_m04.json', expect_n=15)
finish()
