import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Associate m06, The Associate Reading. Written from digest.txt Section 18,
# with Section 1 for the sour stream the last lesson points at. Three lessons:
# the six answers sorted, the reading worked with every constant named at the
# step that uses it, and what the next tier changes.

q(2, "Six answers are reported on OBIAFU. Which of them did not come through the water chain at all?",
 "The contactor diameter of 3.192661 ft and the 74.065024 short tons of aromatics a year.",
 ["The circulation of 6.399830 gpm and the reboiler duty of 0.697269 MMBtu an hour, which are sizes.",
  "The water content of 53.450380 lb per MMscf and the load of 46.450380 lb per MMscf.",
  "The 9215.7553 gallons a day and the duty per gallon of 1815.8525 Btu."],
 "One belongs to a vessel calculation and the other to a mole balance, and both are taught in later tiers. Everything else on the reading is a step of the chain or the rate applied to one."),

q(0, "The gas pressure alone moves and nothing else on the sheet changes. Which of the six answers is the one that cares about pressure for a reason other than how wet the gas is?",
 "The contactor diameter, which is sized on what the gas weighs and how fast it may rise.",
 ["The reboiler duty, which is charged on gallons and the gallons follow the pressure through the loop.",
  "The duty per gallon, which carries the still and absorber temperatures.",
  "The circulation, which the line conditions reach directly."],
 "Pressure reaches the water chain through the inlet content and nowhere else. The vessel is sized by what the gas weighs, which is a question the water chain never asked."),

q(3, "What is the practical use of sorting the six answers into properties, sizes and the vessel figure?",
 "It says which figures to re-derive when the rate moves, which to leave alone, and which to check against a separate method.",
 ["It says which of the six the engine computed and which of them a person typed in.",
  "It says which of the six the published TEG cases cover and which have no golden behind them.",
  "It says which of the six carry a warning at OBIAFU's conditions and which come back clean."],
 "Six figures on a data sheet arrive in the same font in the same table, and nothing on the page says that two are properties, three are sizes and one belongs to a different calculation."),

q(1, "Step one of the worked reading takes 950.000000 psia and 104.000000 degF to 53.450380 lb per MMscf. Which constants did it consume?",
 "The three Magnus coefficients, the standard base of 14.696000 psia and 519.670000 degR, and the molecular weight of water.",
 ["The three Magnus coefficients, the gallons in a cubic foot and the glycol density of 9.300000 lb a gallon.",
  "The standard base, the 1440.000000000 minutes in a day and the molecular weight of water.",
  "The Rankine offset of 459.670000 degR alone, since the fit is written on the absolute scale."],
 "The coefficients give the vapour pressure, the standard base gives the standard cubic feet a pound mole of 379.483571856287, and 18.015280 turns a share of moles into pounds."),

q(2, "Step two takes the content to a load of 46.450380 lb per MMscf. What did that step consume?",
 "No constant at all, and no rate has been mentioned yet.",
 ["The gas rate of 62.000000 MMscfd, which is what makes a content into a load.",
  "The circulation ratio of 3.200000 gal per lb, which is what the spec is applied through.",
  "The molecular weight of water."],
 "A contract allows 7.000000 lb per MMscf out, and the load is one subtraction. The rate arrives at the next step and the ratio at the one after that."),

q(0, "Step three multiplies the load by 62.000000 MMscfd to give 2879.9235 lb a day. What changed about the answer at that step?",
 "It stopped being a property of the gas and became a property of the plant.",
 ["It stopped being a mole figure and became a mass, since the rate is what carries the pound mole into it.",
  "It stopped being a design choice and became a computed result, since the rate is given to the plant rather than chosen.",
  "It stopped being intensive and became a ratio."],
 "One multiplication, and the answer scales with how much gas there is from that point down. Everything above the step is per MMscf and knows nothing about the rate."),

q(3, "Step four turns 2879.9235 lb a day into 6.399830 gpm. Which figure in that step came from a person?",
 "The circulation ratio of 3.200000 gal of glycol per lb of water.",
 ["The 9215.7553 gallons a day, read off the loop the plant actually runs.",
  "The 1440.000000000 minutes in a day, which the module declares under a name.",
  "The 6.399830 gpm itself."],
 "The load came from the contract and the conditions, and the minutes in a day were measured out of the engine. The ratio is the one number here that somebody chose."),

q(1, "Step five consumes two constants that no publication in this repository stands behind. Which two?",
 "The glycol at 9.300000 lb a gallon and the still overhead at 1100.000000 Btu a lb.",
 ["The standard cubic feet a pound mole and the molecular weight of water.",
  "The minutes in a day and the group factor.",
  "The gallons in a cubic foot of 7.480519480519 and the Rankine offset of 459.670000 degR."],
 "Both are declared, and the step spends them on the two halves of the duty. The measured and derived figures in the reading belong to steps one, four and six."),

q(2, "Step six takes 9215.7553 gallons a day at 1815.8525 Btu a gallon to 0.697269 MMBtu an hour. What stands between them?",
 "The group factor of 24000000.",
 ["The 1440.000000000 minutes in a day.",
  "The gallons in a cubic foot, 7.480519480519.",
  "The sensible share of 0.763369."],
 "The group carries the hours in a day and the Btu in a MMBtu together, because this module never uses the two separately and nothing outside it can pull them apart."),

q(0, "Two conversions appear in the worked reading, one at step four and one at step six. Which is which?",
 "1440.000000000 at step four and 24000000 at step six.",
 ["24000000 at step four and then 1440.000000000 at step six.",
  "1440.000000000 at both of them, once on the gallons and once on the Btu.",
  "7.480519480519 at step four and then 24000000 at step six."],
 "The minutes in a day turn gallons a day into gallons a minute. The group factor turns a Btu a day into MMBtu an hour, and they sit two steps apart in the chain."),

q(1, "A declared constant is simply the wrong number, and a measured one is exported under a name the engine does not use for it. How would each show up?",
 "The measured one shows up as a ratio away from 1.000000000000, and the declared one shows up nowhere at all.",
 ["The measured one shows up in the published cases, and the declared one as a ratio away from 1.000000000000.",
  "Both show up as a ratio away from 1.000000000000, since a constant is measured under the name it is declared with.",
  "The measured one shows up nowhere, since it was read out of the engine, and the declared one in the goldens."],
 "A measurement compares the name on the page with the number in use, so a mismatch is exactly what it catches. A declared value that is the wrong number has no publication in this repository to check it against, and pinning it only makes a change to it a reviewed act."),

q(3, "The next tier reads one contactor three separate ways. Which three?",
 "As a staged device, as a mole balance, and as a vessel.",
 ["As a staged device, as a heat balance, and as a vessel to size.",
  "As a mole balance, as a water balance, and as a dew point chart.",
  "As a staged device, as a mole balance, and as a hydrate margin."],
 "The mole balance says how much solution has to move. The stage relation says whether the spec is reachable. The vessel says how wide the steel has to be, and not one of the three derives from the other two."),

q(2, "The Professional tier introduces a limit that nothing in the Associate tier prepares a reader for. What is it?",
 "A removal the column cannot pass however many stages are added, whose remedy is more solvent rather than more steel.",
 ["A duty the reboiler cannot pass however hot the still is run, whose remedy is a lower circulation ratio.",
  "A width the contactor cannot pass however fast the gas rises, whose remedy is a second column in parallel.",
  "A spec the loop cannot pass however strong the lean solution is, whose remedy is a colder gas at the inlet."],
 "In the water chain, tightening the spec always worked and an answer always came back. A staged column has a ceiling in it, and the engine says so rather than returning a number nobody can reach."),

q(0, "UBIE goes to the Professional tier as a mole balance, at 10666.2009 lbmol of acid gas a day. What does that route have in common with the glycol chain?",
 "Nothing in the method. There is no water content in it, no circulation ratio, and the solvent comes from a property table.",
 ["The circulation ratio, which is what turns either pickup into a solution rate in gpm.",
  "The saturation step, which fixes what the gas carries before either spec is applied to it.",
  "The duty a gallon, which both loops assemble from a sensible term and an overhead term."],
 "Both end at a circulation and a duty, and the methods that reach them have nothing in common. The amine duty a gallon is a stated figure rather than one assembled from named parts, and the solvent is chosen from a published property table."),

q(1, "What does this course ask at every tier, with only the answers changing?",
 "Which number the engine computed, which one you chose, and which one it kept to itself.",
 ["Which number the published cases cover, which one the golden reaches by a second road, and which one nothing checks.",
  "Which number is intensive, which is extensive, and which belongs to a vessel.",
  "Which number the studio prints, which one the course prints, and which one only the engine holds."],
 "The discipline is the reason the water chain came first. The three questions are the same on a Kremser removal and on a Joule-Thomson coefficient as on a circulation in gpm."),

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/beginner/fc4b_m06.json', label='fc4b_m06', expect_n=15)
finish()
