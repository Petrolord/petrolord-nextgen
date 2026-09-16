import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Expert m01, A Stage Is Not a Pump. Digest section 11.
# expect_n comes from wave.json: questionsPerModuleBank 15.

q(1, "The SOKU K-2101 stage runs at a polytropic efficiency of 0.755000, and its exponent ratio is 0.293761435 while the same function at an efficiency of one returns 0.221789883. What is the quotient of those two figures?",
 "1.324503311, which is one over the polytropic efficiency.",
 ["0.957006239, which is the quotient of the two heads the same stage returns.",
  "1.285000, which is k for the 0.648000 gravity gas being compressed.",
  "0.722539710, which is the isentropic efficiency the stage reports."],
 "A real compression is irreversible, the irreversibility shows up as heat in the gas, and the exponent of the real path is steeper than the reversible one by exactly the factor the efficiency sets.")

q(0, "SOKU leaves at 294.4000 psia and 333.5954 degF. Run the identical stage through the isentropic exponent instead and the answer is 269.8918 degF. What is the size of that difference and why does it matter?",
 "63.7036 degF, and a design that sized coolers and chose valve material off the reversible figure would be short by that much.",
 ["63.7036 degF, which is the amount the stated discharge limit of 300.0000 degF would have to be raised by before the warning clears.",
  "There is no difference at all, because the exponent sets the head and the discharge temperature follows the ratio alone.",
  "63.7036 degF, and it is the rise the interstage cooler has to take out before the second stage picks the gas up."],
 "Both figures are the same stage asked through two exponents. The polytropic one carries the efficiency and the isentropic one does not, so the reversible path predicts a cooler machine than the one being built.")

q(3, "Compressibility on the SOKU stage is 0.987732307 at suction and 0.988949105 at discharge, a difference of 0.001216798. Why does the engine average them?",
 "The head integral runs along the whole path, so one value of z has to stand in for every state between the two ends.",
 ["The suction value cannot be read until the discharge temperature is known, so the average is the only figure available when the head is computed.",
  "Averaging hides the difference of 0.001216798, which would otherwise split the two horsepower routes.",
  "The DAK fit is written in averaged reduced coordinates, so a single-end z sits outside it."],
 "The mean of the two endpoints is the ordinary engineering choice. It is a good one here because the two ends are close, and it would be a weaker one on a stage whose ends are far apart.")

q(2, "The chain on a compressor stage runs exponent, discharge state, the z at that state, the average, and only then the head. What breaks if a calculation fixes z first and works forward?",
 "It has assumed the answer it was about to compute, because the discharge z cannot be read until the discharge temperature is known.",
 ["It loses the suction value of 0.987732307, which is the only one of the two ends the engine reports.",
  "It produces a head in the wrong units, since z carries the conversion from ft lbf per lbm to Btu per hr.",
  "It makes the two horsepower routes disagree, which is the check that would otherwise have caught it."],
 "The discharge temperature came out of the exponent, the discharge z comes out of that temperature, and the average comes out of both ends. Order is what makes the 0.988340706 on this stage mean anything.")

q(0, "SOKU returns a polytropic head of 63604.9582 ft lbf per lbm and an isentropic head of 60870.3418, with a polytropic efficiency of 0.755000000 and an isentropic efficiency of 0.722539710. Which efficiency divides which head?",
 "Each head is divided by the efficiency of its own path, so the polytropic pair go together and the isentropic pair go together.",
 ["The larger head is divided by the larger efficiency in both cases, which on this stage happens to pair 63604.9582 with 0.722539710.",
  "Both heads are divided by the polytropic efficiency, since that is the one the machine actually has and the isentropic figure is a reference.",
  "The isentropic head is divided by the mechanical efficiency of 0.968000 and the polytropic head by the polytropic efficiency."],
 "Each pair is a complete statement of the same machine and the two statements give the same power. Crossing the pairs produces a figure that still looks like a compressor, which is why it survives review.")

q(3, "Gas horsepower by the polytropic route is 2279.6019 and by the isentropic route is 2279.6019, a difference of -9.094947017729282e-13 hp. What does that agreement establish?",
 "Nothing about either head, because the two routes are one expression written two ways.",
 ["That the averaged z of 0.988340706 was taken at the right two states.",
  "That the isentropic efficiency of 0.722539710 was derived and not typed.",
  "That neither head was transcribed wrong, since a typo would open a gap."],
 "The exponent ratio times the polytropic efficiency is the isentropic exponent ratio exactly, so dividing either head by its own efficiency is the same expression. It holds for every input, including a wrong one.")

q(1, "On the identity table the last column runs -2.7755575615628914e-17, -2.7755575615628914e-17, 2.7755575615628914e-17 and 5.551115123125783e-17. What is that column?",
 "A subtraction done on each row, and the residual it shows is the size of double-precision rounding.",
 ["A derived tolerance, which the engine gate uses as the band the two horsepower routes are allowed to differ by.",
  "The gap between the polytropic and the isentropic head on each of the four gas and efficiency pairs.",
  "The residual left by the least-squares solve behind the fit."],
 "The exponent ratio times the polytropic efficiency is compared with the isentropic exponent ratio on each of the four rows. A residual at that magnitude is arithmetic and it is not a disagreement.")

q(2, "The engine gate that compares the two horsepower routes is kept and labelled as a shape property. What is the check that CAN fail beside it?",
 "A numerical quadrature of the integral of v dp along the polytropic path, with a negative control that moves the exponent and must break the comparison.",
 ["A comparison of the polytropic head against the published golden for the same case, which is the only route in the package that does not share the derivation.",
  "A sweep of k from 1.200000 to 1.400000 checking that the head and the power both rise, which fails if either the exponent or the efficiency is transcribed wrong.",
  "A bisection on the stage ratio until the warning turns on, which brackets the answer independently of the head expression."],
 "The question to ask of any gate is what input would make it fail. The control is the load-bearing half, because a comparison nobody has ever seen fail is a comparison nobody has ever tested.")

q(1, "The same SOKU stage is asked against stated discharge limits of 200.0000, 250.0000, 300.0000 and 400.0000 degF. What happens to the discharge temperature across those four probes?",
 "It is 333.5954 degF on every one of them.",
 ["It falls as the stated limit falls, because the engine trims the ratio to stay inside whatever limit the caller states.",
  "It is 333.5954 degF on the first three and 269.8918 degF on the fourth, where no warning is raised.",
  "It is reported only on the row at 400.0000 degF, since the other three return a warning in place of a temperature."],
 "The limit is a limit and it is not an input to the thermodynamics. Three of the four rows carry a warning and the row at 400.0000 degF carries none, and the temperature never moves.")

q(3, "With no discharge limit stated, the warning turns on between a ratio of 2.7616873004480746 and 2.761687300448075, where the discharge temperatures are 299.99999999999994 and 300.00000000000006 degF. What has that bisection established, and what is its standing?",
 "The default the engine applies when a caller states none, and it is held for literature.",
 ["The ratio at which the valves and the lube oil become the binding constraint, which the engine treats as a machine limit.",
  "The width of the bracket the bisection closed on.",
  "The highest ratio one stage may take before staging begins."],
 "The figure is customary and no publication in this repository stands behind it, so nothing graded in this course rests on it. State a limit rather than inheriting one.")

q(0, "Walk the polytropic efficiency across the SOKU stage and the head runs 65574.3395 ft lbf per lbm at 0.650000 and 62157.4133 at 0.860000, while the gas power runs 2729.8297 hp and 1955.7326. Why does a worse machine show a larger head?",
 "A lower efficiency steepens the path, so the stage has more head to deliver and it delivers that head less efficiently.",
 ["A lower efficiency raises the discharge temperature, and the averaged z rises with it by enough to carry the difference.",
  "The head is what the driver supplies, so the mechanical losses are inside it.",
  "A lower efficiency cuts the mass flow, so the head per pound rises."],
 "Read the table as two effects at once. The power carries both of them and the head carries only the first, which is why the power falls faster across that walk than the head does.")

q(2, "Held at the SOKU conditions and walked across k, the exponent ratio runs 0.220750552 at 1.200000, 0.289735099 at 1.280000 and 0.378429518 at 1.400000. What decides which of those rows a machine sits on?",
 "What the user types for k, because it is a property of the fluid and it is a stated input here.",
 ["The polytropic efficiency, since the exponent ratio is the isentropic one divided by it and k is recovered from the pair.",
  "The pressure ratio the stage is asked to take, because a steeper path is what a larger ratio produces.",
  "The suction state, since the DAK correlation returns k along with the compressibility at that reduced pressure and temperature."],
 "A higher k gives a steeper path. The machine contributes the efficiency and the stream contributes k, so a stage report that quotes an exponent without saying which efficiency produced it cannot be checked by anybody.")

q(1, "Across the ratio sweep the warning is null at 1.500000, 2.000000 and 2.500000 and set at 3.000000, 3.500000, 4.000000 and 4.500000. What else is happening down that table?",
 "The discharge pressure, the temperature, the head and the power are all rising together.",
 ["The ratio per stage is falling as the count the engine would choose rises, which is why the warning appears part way down.",
  "The head rises while the power falls, because a larger ratio moves more of the work into the gas and less into the shaft.",
  "The compressibility average falls toward the ideal-gas limit, which is what turns the warning on at 3.000000."],
 "The row at 2.500000 reaches 278.1057 degF and the row at 3.000000 reaches 318.6976 degF, so the stated limit is crossed between them and the warning appears from the fourth row on.")

q(0, "The SOKU stage returns 2279.6019 gas horsepower and 2354.9606 brake horsepower at a mechanical efficiency of 0.968000. Which figure sizes the driver, and what sits between them?",
 "The brake figure, and what sits between them is the gearbox, the bearings and the seals of the machine itself.",
 ["The gas figure, and what sits between them is the driver efficiency, which is applied again when the fuel is worked out.",
  "The brake figure, and what sits between them is the interstage cooling duty the train has to reject.",
  "Either figure, since at a mechanical efficiency of 0.968000 the two are inside the tolerance any driver is quoted to."],
 "Gas horsepower is what the gas receives and brake horsepower is what the coupling has to deliver. A driver sized on the gas figure is short by the mechanical losses of the machine.")

q(2, "The SOKU suction comes back with the note \"Ppr 0.137 against 0.2 at 92 psia and 104 F is below the 0.2 where the DAK fit data start; the z-factor here runs toward the ideal-gas limit\". Is that a complaint?",
 "No. The surface runs to the ideal-gas limit as the reduced pressure goes to zero, so a low-pressure suction is an ordinary machine.",
 ["Yes. A state below the reduced pressure the fit data start at is an extrapolation, and the engine records it so the z of 0.987732307 can be discounted.",
  "No, because the note is raised on the discharge rather than the suction, and the discharge sits inside the fit data on this stage.",
  "Yes, and it is the reason the stage averages the two ends rather than carrying the suction value through."],
 "The engine says where in the correlation the state sits instead of leaving a reader to wonder whether a quiet return meant the state was never checked at all.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/advanced/fc3a_m01.json', expect_n=15)
finish()
