import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Professional m03, gas sizing and the style table.
# Every figure is from digest SECTION 20 and SECTION 21 at the rendering those
# sections print. Nothing keyed in this bank is a number that rests on the
# engine's own stated table values, because the engine says a certified vendor
# figure for the specific trim always replaces them and this course grades no
# figure that rests on them.

q(1, "On gas the choking boundary is a pressure drop ratio. What is that ratio?",
 "The pressure drop divided by the inlet pressure.",
 ["The outlet pressure divided by the inlet pressure.",
  "The pressure drop divided by the outlet pressure.",
  "The inlet pressure divided by the vapour pressure."],
 "The engine returns it on every gas sizing along with the terminal value it is being compared against. It is written x.")

q(2, "The gas valve is marched down its outlet pressure. What is the pressure drop ratio on the row at an outlet pressure of 90.000000 psia?",
 "0.635480",
 ["0.554475",
  "0.716484",
  "0.688654"],
 "The ratio reads 0.554475 on the row at an outlet pressure of 110.000000 psia and 0.716484 on the row at an outlet pressure of 70.000000 psia.")

q(0, "On how many rows of the gas march does the engine report choked flow, and over what tree and rule?",
 "3, over the 9 gas outlet pressures, with the choked flag alone deciding membership.",
 ["5, counted over the 9 outlet pressures asked of the gas valve, with a row counting when the expansion factor returned there has reached its floor.",
  "4, counted over the 9 outlet pressures asked of the gas valve, with a row counting when the engine returns choked true.",
  "6, over the 9 gas outlet pressures, admitted where x exceeds one half."],
 "Membership is decided by the flag and by nothing else, which is what makes the figure something a reader can go and recount.")

q(3, "Two things follow from the gas boundary being a ratio rather than a pressure. What are they?",
 "It is dimensionless, so it can be quoted for a valve style without knowing the service, and the pressure it corresponds to depends entirely on the inlet pressure.",
 ["It is dimensionless, so it can be quoted for a valve style without knowing the service, and the pressure it corresponds to is fixed once the style is chosen.",
  "It carries units of pressure over pressure, so it has to be restated whenever the units of the datasheet change, and it moves with the outlet pressure alone.",
  "It is dimensionless, so it applies unchanged to liquid service as well, and the pressure it corresponds to is the same at every inlet condition the plant reaches."],
 "That is why a gas valve has to be checked at every inlet condition the plant can reach rather than at the design case alone.")

q(1, "What happens to a familiar rule of thumb that carries a pressure drop in the head as an absolute figure?",
 "It does not survive contact with the gas boundary, because the same absolute drop is a small ratio at a high inlet pressure and a large one at a low inlet pressure.",
 ["It survives unchanged, because the engine converts an absolute drop into a ratio before it compares anything.",
  "It survives on any service below the terminal value, because the ratio and the absolute drop agree there.",
  "It becomes conservative, because an absolute drop always corresponds to a ratio above the terminal value."],
 "On gas the boundary moves with the inlet pressure, so a valve comfortably below it at one inlet condition can be past it at another.")

q(0, "What does the expansion factor correct for?",
 "The gas expanding through the valve, which lowers the density in the throat so that less mass passes than an incompressible calculation would predict.",
 ["The gas being compressed through the valve, which raises the density in the throat so that more mass passes than an incompressible calculation predicts.",
  "The difference between the specific heat ratio of the gas handled and the specific heat ratio of the gas the valve was certified on.",
  "The recovery of pressure downstream of the vena contracta, which returns part of the drop the valve took and reduces the effective drop."],
 "It is where the gas choking boundary shows itself in the arithmetic. It falls with the pressure drop ratio and is floored.")

q(2, "Why is the floor on the expansion factor exactly two thirds?",
 "It is the value the linear form takes at its own terminal point, which is why it is the same figure on every choked gas service anybody sizes.",
 ["It is a rounding of the ratio of the specific heats of air, which is the gas that valve terminal ratios are quoted on.",
  "It is a convention this engine adopted so that the factor reaches a readable figure at the boundary.",
  "It is the fraction of the inlet density the throat density falls to when the flow becomes sonic in the vena contracta."],
 "The factor falls linearly with the pressure drop ratio and the terminal ratio is where it is floored. Put the terminal ratio into the linear form and the factor comes out at two thirds of unity, for every valve style and every gas.")

q(3, "What does the engine size on once the pressure drop ratio has reached its terminal value?",
 "The terminal ratio, because past it the flow is sonic in the vena contracta and further pressure drop buys nothing.",
 ["The stated ratio, because the terminal value screens the service rather than entering the arithmetic of the answer.",
  "The ratio halfway between the stated and the terminal value, which is the engine's stated compromise at the boundary.",
  "Nothing, because the engine withholds the coefficient on a choked gas service and returns the terminal ratio alone."],
 "The engine says so with the answer: `choked flow: x of 0.878 is at or past the terminal 0.680, so the flow is sonic in the vena contracta and further pressure drop buys nothing. The terminal ratio has been used for sizing, and the noise and trim wear at this condition need a multistage trim`.")

q(1, "Which half of the gas choked flow message is the half people skip?",
 "The engineering half, which says the noise and the trim wear at that condition need a multistage trim.",
 ["The sizing half, which says the terminal ratio has been used for sizing and that the coefficient beside it is correct.",
  "The opening clause, which gives the pressure drop ratio and the terminal ratio it has reached.",
  "The closing clause, which names the standard the terminal ratio was read from."],
 "A gas valve running sonic in the throat is a noise and wear problem whatever its coefficient says, and the remedy is staged letdown rather than a larger body.")

q(1, "What does the specific heat ratio factor return at a specific heat ratio of 1.100000?",
 "0.785714",
 ["0.857143",
  "0.928571",
  "1.185714"],
 "A specific heat ratio of 1.100000 covers the heavier hydrocarbon gases and the richer process streams. The factor at 1.200000 is 0.857143 and at 1.300000 it is 0.928571.")

q(2, "At which of the specific heat ratios in this course does the factor return exactly 1.000000?",
 "1.400000",
 ["1.300000",
  "1.200000",
  "1.660000"],
 "Air at ordinary conditions sits at a specific heat ratio close to that value, which tells you what the factor is for: it scales a valve's terminal behaviour, quoted on air, onto the gas actually being handled.")

q(3, "Where does the specific heat ratio factor show its effect?",
 "At the boundary, because it multiplies the terminal ratio and so moves the boundary rather than the answer at a given operating point.",
 ["At every operating point equally, because it multiplies the coefficient the sizing equation returns.",
  "Only on services above the terminal ratio, because below it the factor is held at unity by the engine.",
  "Only on monatomic gases, because the factor departs from unity nowhere else in the range this course covers."],
 "Its effect is invisible on any service comfortably away from the boundary and decisive on any service near it, which is why a stream whose composition changes with plant mode has to be checked at each mode.")

q(1, "How many valve styles does this engine carry, and over what tree and rule?",
 "8, counted over the styles array the module exports, with every entry counting and no filter applied.",
 ["5, counted over the styles array the module exports, with an entry counting when it carries both a pressure recovery factor and a terminal ratio.",
  "8, counted over the styles array the module exports, with an entry counting when its label names a globe or a ball.",
  "4, counted over the styles array the module exports, with an entry counting when its pressure recovery factor is above one half."],
 "The tree is the exported array and the rule is that nothing is filtered out of it, which is what makes the count checkable by anybody who can read the export.")

q(2, "The engine states the status of its own pressure recovery factors and terminal ratios. What does it instruct?",
 "That a certified vendor figure for the specific trim always replaces them.",
 ["That they may be used unchanged wherever the style label matches the valve supplied.",
  "That they should be interpolated between styles when the trim supplied sits between two.",
  "That they are cited to a published document and may be quoted against it in a calculation."],
 "The message is `the FL and xT above are this engine's stated table values. They are not cited to a document in this repository, they are trim and vendor dependent by nature, and a certified vendor figure for the specific trim always replaces them`.")

q(0, "Why is the choice of valve style a sizing decision rather than a procurement detail?",
 "The allowable drop is built from the pressure recovery factor, so the same service on two different styles chokes at two different outlet pressures.",
 ["The coefficient is read off the style, so the same service on two different styles returns two different flows at the same drop.",
  "The terminal ratio is what the engine sizes every liquid service on, so the style decides the drop used on liquid and on gas alike.",
  "The style decides the rangeability, so the same service on two different styles lands at two different travels at its normal duty."],
 "A valve type chosen for cost or for space can move a boundary that the process never asked to move.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/intermediate/fc8i_m03.json', label='fc8i_m03', expect_n=15)
finish()
