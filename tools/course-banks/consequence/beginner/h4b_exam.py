import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 consequence, ASSOCIATE final exam, 42 questions: seven per module, each
# asked from a different row or angle than the module banks.
# m01 sections 1 to 4 and 34; m02 section 5; m03 sections 6 and 7; m04
# sections 8 and 9; m05 sections 10 to 12; m06 sections 11 and 13.

# ---------------------------------------------------------------- m01
q(1,
  "A reviewer asks the engine to report how often the AMENAM line will leak. What should the analyst tell them?",
  "The engine computes effects only: it says what happens if the release occurs, and how often it occurs belongs elsewhere.",
  ["The engine reports a leak frequency in the basis block of every outflow result, beside the model and the source.",
   "The engine derives the frequency from the hole diameter, since a larger hole is a rarer event on any line.",
   "The frequency is the mass rate divided by the inventory."],
  "Section 1: the engine computes effects and never frequencies, and a consequence model says what happens if the release occurs; how often it occurs belongs elsewhere. The basis block carries the model, its source and its units, and no frequency. Nothing in the engine turns a hole size or a mass rate into a frequency.")

q(0,
  "A vessel pressure is known in bar gauge. The engine never converts a unit it was not asked to. What must the analyst do before typing it?",
  "Convert it to pascals and add the atmosphere, because a name ending in Pa means pascals and an absolute pressure.",
  ["Type the bar figure as it stands, since the engine reads the unit from the value and converts it on the way in.",
   "Convert it to pascals only, since the engine adds `ATM_PA` itself to any upstream pressure.",
   "Type it into a field whose name ends in Bar."],
  "The unit lives in the argument name, and Pa there means pascals measured from vacuum. So the bar reading has to become pascals, and the atmosphere the gauge leaves out has to go back in; skip that and the call runs one atmosphere short. The value itself carries no unit the engine could read, `ATM_PA` is ambient and never an addition, and no name uses Bar.")

q(2,
  "`ATM_PA` is one of the exported constants. What is it, and when does the engine use it?",
  "101325 Pa, the ambient pressure unless a call states otherwise.",
  ["9.80665, the gravitational acceleration.",
   "100000 Pa, one bar, which the engine takes as ambient whenever no pressure is typed for it.",
   "101325 Pa, added to every upstream pressure."],
  "Section 1 prints `ATM_PA` as 101325, and section 2 says ambient is `ATM_PA`, 101325 Pa, unless a call states otherwise. 9.80665 is `G_M_S2`. 100000 is the upper end of `BAGSTER_RANGE_PA_M`, which has nothing to do with ambient. Every pressure is typed absolute, so nothing is added to it.")

q(3,
  "Which statement about a refusal from this engine is true?",
  "It carries no number: it holds the engine's message and the field it names.",
  ["It carries the result at the nearest valid input.",
   "It carries a number flagged as unreliable.",
   "It carries a partial result."],
  "Section 3 says each refusal is the engine's `error` string with the field it names, and that a refusal carries no number. Nothing is computed at a nearby input, nothing is flagged and returned, and no partial result is kept.")

q(3,
  "Which of the engine's named sources fixes the pool diameter and the Mackay and Matsugu evaporation?",
  "YB, the TNO Yellow Book CPR 14E (2005).",
  ["PB, the TNO Purple Book.",
   "ALOHA, the NOAA documentation.",
   "CCOHS, the conversion source."],
  "The YB row of the sources table covers outflow through a hole, the pool diameter and Mackay and Matsugu, so the pool and its evaporation are Yellow Book work. PB is where the worked carbon monoxide plume comes from. ALOHA is the dispersion source. CCOHS is only the unit conversion, with nothing to say about a pool.")

q(1,
  "The engine names the TNO Purple Book CPR 18E (1999). What does it use that source for among the Associate material?",
  "A worked carbon monoxide plume, which the golden reproduces as a published check.",
  ["The Briggs rural sigma coefficients for the six Pasquill-Gifford classes.",
   "The molar volume of 24.45 L/mol used to convert between the two concentration units.",
   "The subsonic outflow coefficient psi used in the gas outflow model once the flow stops being choked."],
  "Section 4 lists a worked carbon monoxide plume among what the Purple Book fixes, the case section 11 reproduces at 21.260627 g/m3. The Briggs coefficients come from ALOHA, the molar volume from CCOHS, and psi from the Yellow Book.")

q(0,
  "The exported constant `BRIGGS_ADVISORY_RANGE_M` holds 100 to 10000. What happens to a plume asked for outside it?",
  "The sigmas are returned with a warning to treat the result as an extrapolation.",
  ["The call is refused on `downwindDistanceM`, naming the range the Briggs curves are quoted for.",
   "The distance is clamped to the nearest end of the range and the result is computed there.",
   "Nothing: the constant is documentation only."],
  "The name says advisory, and that is how it acts: at 60 m or 20000 m the sigma table marks a warning and still prints the spreads. The only distance refusal belongs to 0 m, the distance typed is the distance used, and the warning text is the constant at work.")

# ---------------------------------------------------------------- m02
q(1,
  "Only 1 m of crude now stands over the hole and the blanket is unchanged. Which driving pressure and rate does the sweep print?",
  "A driving pressure of 107010.652500 Pa and 16.419486 kg/s.",
  ["A driving pressure of 98675.000000 Pa and 15.767020 kg/s, the figures for a head of 0 m.",
   "123681.957500 Pa and 17.652215 kg/s.",
   "11.225132 kg/s."],
  "The head sweep prints 107010.652500 Pa and 16.419486 kg/s at 1 m. 98675.000000 Pa and 15.767020 kg/s are the 0 m row, and 123681.957500 Pa and 17.652215 kg/s the 3 m row. 11.225132 kg/s is the ambient ullage row of the other sweep, with the head at 6 m.")

q(1,
  "The AMENAM ullage at 150000 Pa gives 15.768131 kg/s; the head at 0 m with the 200000 Pa ullage gives 15.767020 kg/s. Why are the two so close?",
  "Their driving pressures are almost equal, 98688.915000 against 98675.000000 Pa, and the rate follows the driving pressure alone.",
  ["Both are choked, so both pass the same rate.",
   "They are the same case printed twice, with a rounding difference in the sixth decimal between the two sweeps.",
   "The discharge coefficient changes between the two sweeps and happens to compensate for the change in pressure."],
  "The mass rate depends on the driving pressure P minus ambient. The ullage sweep prints 98688.915000 Pa at 150000 Pa, and the head sweep prints 98675.000000 Pa at 0 m, so the rates nearly agree. A liquid through a hole is never choked in this model, the two cases differ in both head and ullage, and the discharge coefficient is held at 0.62 throughout.")

q(3,
  "The AMENAM hole is shrunk to 0.01 m with everything else held. What area and mass rate does the engine print?",
  "0.000078539816 m2 and 0.774186 kg/s.",
  ["0.000490873852 m2 and 4.838663 kg/s, which is the row the hole sweep prints for 0.025 m.",
   "0.001963495408 m2 and 19.354651 kg/s, since the hole enters only through the discharge coefficient.",
   "0.007853981634 m2 and 77.418603 kg/s, the row for a hole of 0.1 m, ten times the size."],
  "The hole sweep prints 0.000078539816 m2 and 0.774186 kg/s at 0.01 m. 0.000490873852 m2 and 4.838663 kg/s are the 0.025 m row. 0.001963495408 m2 and 19.354651 kg/s are the line's own 0.05 m hole, and the rate is linear in the area. 0.007853981634 m2 and 77.418603 kg/s belong to 0.1 m.")

q(3,
  "Suppose the analyst types 0.6 for Cd on the crude line. Which rate comes back, and in what way does Cd enter it?",
  "18.730307 kg/s; the rate is linear in the discharge coefficient.",
  ["19.354651 kg/s, replacing any coefficient below 0.62.",
   "24.973743 kg/s, since a smaller coefficient passes more.",
   "18.730307 kg/s, since the rate goes as the square root of the coefficient, the same as it does for the driving pressure."],
  "The coefficient sweep prints 18.730307 kg/s at 0.6, and section 5 says the rate is linear in the discharge coefficient. The engine uses the typed coefficient and replaces nothing. 24.973743 kg/s is the 0.8 row, larger because a larger coefficient passes more. The square root holds the driving pressure and the density.")

q(2,
  "At what ullage pressure does the AMENAM line reach 48.888640 kg/s with its 6 m head?",
  "1000000 Pa, a driving pressure of 948688.915000 Pa.",
  ["500000 Pa, a driving pressure of 448688.915000 Pa, since the rate is linear in the ullage above ambient.",
   "200000 Pa, the stated blanket.",
   "10000000 Pa, where the gas line reaches its highest choked rate."],
  "The ullage sweep prints 48.888640 kg/s at 1000000 Pa, with a driving pressure of 948688.915000 Pa. 500000 Pa gives 33.621626 kg/s, and the rate follows the square root of the driving pressure. 200000 Pa gives 19.354651 kg/s. 10000000 Pa is a row of the methane line in section 6, a different model.")

q(0,
  "An analyst has a hole measured as an area and no diameter. What does the liquid outflow function accept?",
  "The area, as `holeAreaM2`; its refusal for a zero diameter names the area as the alternative.",
  ["Only a diameter, so the analyst must back-calculate one first.",
   "The area, but only in cm2, as `holeAreaCm2`.",
   "Neither without a discharge coefficient of one."],
  "The bracket in the zero diameter message, \"(or holeAreaM2)\", is the engine telling the analyst that an area in square metres will do. Nothing needs back-calculating, no name takes square centimetres, and Cd is its own input whatever its value.")

q(0,
  "The AMENAM line carries 850 kg/m3 crude, 6 m of head and a 200000 Pa ullage. Where does the pressure at the hole of 250013.915000 Pa come from?",
  "The static head rhoL g hL plus the 200000 Pa above the liquid, all absolute.",
  ["The 200000 Pa ullage plus one atmosphere, 101325 Pa, since the ullage is typed as gauge.",
   "The driving pressure 148688.915000 Pa plus the static head.",
   "The ullage times the density over the head."],
  "Section 5: P = rhoL g hL + PaL is the absolute pressure at the hole, the static head plus the pressure above the liquid. The ullage is stated absolute, so no atmosphere is added. The driving pressure is P minus ambient, 148688.915000 Pa, and it already contains the head. The last formula is not the model.")

# ---------------------------------------------------------------- m03
q(1,
  "With the methane line held at 150000 Pa the pressure ratio reads 0.675500. How does the engine classify the flow, and at what rate?",
  "SUBSONIC, psi 0.958958, 0.074275 kg/s.",
  ["CHOKED, psi 1.000000.",
   "SUBSONIC, psi 0.756455.",
   "SUBSONIC, psi 0.999177."],
  "0.675500 sits well above 0.543927, so this row is subsonic, carrying psi 0.958958 and 0.074275 kg/s. Psi of 1.000000 only appears from 250000 Pa upward. 0.756455 is the row below it and 0.999177 the row above.")

q(3,
  "Push the methane teaching line to 2000000 Pa. Which rate and density appear in its row?",
  "1.032722 kg/s at 12.861124 kg/m3.",
  ["5.163609 kg/s at 64.305619 kg/m3, the rate and density printed for 10000000 Pa.",
   "0.258180 kg/s at 3.215281 kg/m3, which are the figures for 500000 Pa.",
   "0.129090 kg/s, the choked rate, which is the same at every upstream pressure once the hole chokes."],
  "The table prints 1.032722 kg/s and an upstream density of 12.861124 kg/m3 at 2000000 Pa. 5.163609 kg/s belongs to 10000000 Pa and 0.258180 kg/s to 500000 Pa. A choked rate is linear in the upstream pressure, so it does not stay at the 250000 Pa figure.")

q(1,
  "A gas with gamma of 1.2 leaks from the same hole into open air. Where does the engine put its choking threshold?",
  "0.564474, choking at 179503.418325 Pa.",
  ["0.584679, the 1.1 row.",
   "0.528282, the 1.4 row.",
   "0.543927, choking at 186284.176006 Pa, the figure for every gas."],
  "Reading across the gamma row for 1.2 gives 0.564474, and dividing ambient by it gives 179503.418325 Pa. The 1.1 and 1.4 rows hold the other two ratios offered. 0.543927 is methane's own, at 1.31, and each gamma carries its own threshold.")

q(2,
  "The AMENAM GAS line gives 0.129090 kg/s at 250000 Pa and 0.258180 kg/s at 500000 Pa. Why exactly twice?",
  "Both rows are choked, and a choked rate is linear in the upstream pressure.",
  ["The outflow coefficient psi doubles between the two rows, from 0.5 at 250000 Pa to one at 500000 Pa, and the rate follows it.",
   "The ratio has quadrupled, and the rate follows its square root.",
   "The discharge coefficient is doubled."],
  "Section 6: both rows are CHOKED, and once choked the mass rate is LINEAR in the upstream pressure; doubling it doubles the rate, as the upstream density doubles from 1.607640 to 3.215281 kg/m3. Psi is 1.000000 on both rows. The pressure has doubled and the rate with it. The discharge coefficient is held at 0.62.")

q(3,
  "Of the two air cases straddling the boundary, the one with the smaller ratio, 0.52773437499999998, is air-barely-choked. How does the engine label it?",
  "CHOKED, psi 1.000000000000, 0.113903 kg/s.",
  ["SUBSONIC, psi 0.999944960481, 0.112711 kg/s, since the ratio is within one part in a thousand of the critical value.",
   "CHOKED, 0.112711 kg/s.",
   "A refusal, too close to call."],
  "Air's threshold is 0.52828178771717416, and this ratio falls just under it, so the label is choked, psi sits at exactly one and the rate is 0.113903 kg/s. 0.112711 kg/s is its subsonic neighbour. However near the boundary a case lands, the rule decides it and nothing is refused.")

q(3,
  "Set the yb-hydrogen-t0 case against the oracle's nozzle maximisation route. What does the golden show?",
  "15.311760 kg/s from both, CHOKED, a relative difference of 5.80e-16.",
  ["15.31 kg/s from both, since the golden rounds each route to the printed digits of the Yellow Book before comparing them.",
   "15.292930 kg/s from the engine against 15.311760 kg/s from route B, the gap the inferred heat capacity ratio closes.",
   "SUBSONIC in the engine and CHOKED by route B."],
  "Section 6 prints the yb-hydrogen-t0 row: CHOKED, the engine 15.311760 kg/s and route B 15.311760 kg/s, relative difference 5.80e-16. Nothing is rounded to the book's digits. 15.292930 kg/s is what the engine gives at a heat capacity ratio of 1.4 and is no route B figure. The two routes agree on the regime.")

q(1,
  "Which upstream pressure puts the AMENAM GAS line exactly at its critical pressure ratio of 0.543927?",
  "186284.176006 Pa, derived; the engine reports CHOKED there with psi 1.000000000000.",
  ["250000 Pa, the first choked row of the table.",
   "180000 Pa, the last subsonic row, since the boundary lies at the last subsonic entry.",
   "208201.258009 Pa, where a gas with a heat capacity ratio of 1.67 chokes into the atmosphere."],
  "Section 7 derives 186284.176006 Pa for the AMENAM line and reports CHOKED there with psi 1.000000000000. 250000 Pa and 180000 Pa are table rows on either side of the boundary. 208201.258009 Pa belongs to a heat capacity ratio of 1.67; the methane line's is 1.31.")

# ---------------------------------------------------------------- m04
q(2,
  "The 30 m3 spill is given a stated thickness of 0.02 m. What area and equivalent diameter come back?",
  "1500.000000 m2 and 43.701937 m.",
  ["1415.000000 m2 and 42.445659 m, since the Yellow Book example uses the same thickness.",
   "600.000000 m2 and 27.639532 m, which are the figures printed for a stated thickness of 0.05 m.",
   "400.000000 m2 and 22.567583 m."],
  "The thickness table prints 1500.000000 m2 and 43.701937 m at 0.02 m. The Yellow Book example shares the thickness but spills 28.3 m3, giving 1415.000000 m2 and 42.445659 m. 600.000000 m2 and 27.639532 m are the 0.05 m row. 400.000000 m2 and 22.567583 m are the bund.")

q(2,
  "The confined pool covers a 400 m2 bund floor. What does its equivalent diameter of 22.567583 m describe?",
  "The diameter of a circle with the same area as the bund floor, D = sqrt(4 A / pi).",
  ["The longest side of the bund, measured along its wall at the height the spill reaches.",
   "The distance the spill runs from the hole to the far wall of the bund before it comes to rest.",
   "The depth of the pool times the area, 0.075000 m times 400 m2."],
  "Section 8 gives the model string \"pool covers the bund floor; D = sqrt(4 A / pi)\": the equivalent diameter is that of a circle of the bund's area. The bund's shape is not an input, and the engine models no run of liquid across the floor: the pool simply covers it. Depth times area is the volume, 30 m3.")

q(1,
  "What comparison decides whether `poolFromSpill` refuses a spill as overtopping its bund?",
  "The depth the spill would stand at on the bund floor, volume over area, against the wall height.",
  ["The spill volume against the bund's volume, the floor area times a standard wall height of 1 m that the engine assumes.",
   "The equivalent diameter against the longest side of the bund, measured along the wall.",
   "The stated thickness against the wall height."],
  "The bracket in the overtopping message names the test: depth above the wall height. The depth is volume over floor area, so the whole comparison is two heights. No wall height is assumed, a diameter is never compared with a side, and thickness belongs to the unbunded case.")

q(2,
  "The 30 m3 spill is spread at a stated 0.05 m. What equivalent diameter does the engine return?",
  "27.639532 m, over 600.000000 m2.",
  ["43.701937 m, the 0.02 m row.",
   "87.403874 m, the 0.005 m row.",
   "22.567583 m, the bund's equivalent diameter, because every pool of 30 m3 is the same size."],
  "The thickness table prints 600.000000 m2 and 27.639532 m at 0.05 m. 43.701937 m is the 0.02 m row. 87.403874 m is the 0.005 m row: a THINNER pool is the wider one. 22.567583 m belongs to the 400 m2 bund; the thickness sets the area, so the same volume gives different sizes.")

q(0,
  "The wind at 10 m over the hexane-like pool rises to 8 m/s. What evaporation rate does the engine print?",
  "0.970521 kg/s of vapour.",
  ["0.672653 kg/s, the rate the wind sweep prints at 5 m/s.",
   "0.451595 kg/s, since the wind enters only the mass transfer coefficient and leaves the rate unchanged.",
   "1.673771 kg/s, the rate the pool diameter sweep prints for a 20 m pool."],
  "The wind sweep prints 0.970521 kg/s at 8 m/s. 0.672653 kg/s is the 5 m/s row. The mass transfer coefficient multiplies straight into the rate, so the wind raises it: 0.451595 kg/s is the 3 m/s case. 1.673771 kg/s is the 20 m pool in the diameter sweep.")

q(2,
  "A 5 m hexane-like pool evaporates under the same conditions. What evaporation flux and rate does the engine print?",
  "0.006205441275 kg/(m2 s) and 0.121844 kg/s.",
  ["0.005749887804 kg/(m2 s), the 10 m pool.",
   "0.021562 kg/s, the 2 m pool.",
   "0.005749887804 kg/(m2 s) and 0.121844 kg/s, since the evaporation flux is the same for every pool size."],
  "The diameter sweep prints 0.006205441275 kg/(m2 s) and 0.121844 kg/s at 5 m. 0.005749887804 and 0.451595 are the 10 m pool, and 0.006863506842 and 0.021562 the 2 m pool. The evaporation flux falls slowly as the pool grows, since the diameter enters to the power minus 0.11, so it is not the same at every size.")

q(2,
  "The hexane-like pool has a mass transfer coefficient of 0.010163820387. What is it, and how does it reach the rate?",
  "A velocity in m/s; it multiplies Pv mu / (R T) to give the evaporation flux, which the pool area turns into the rate.",
  ["A rate in kg/s, which the pool area divides to give the evaporation flux of the pool.",
   "A dimensionless fraction of the pool that evaporates each second.",
   "The Schmidt number, which defaults to 0.8 when none is typed."],
  "Section 9: the model string is \"km = 0.004786 u10^0.78 (2r)^-0.11 Sc^-0.67; q = km Pv mu / (R T) x A\", and `massTransferCoefficientMS` carries m/s in its name. km times Pv mu / (R T) is the evaporation flux, 0.005749887804 kg/(m2 s), and times the area the rate. The Schmidt number is an input to km, defaulting to 0.8.")

# ---------------------------------------------------------------- m05
q(0,
  "What crosswind and vertical spreads does class D give at 300 m?",
  "sigma_y 23.647903 m and sigma_z 14.948186 m.",
  ["The same two figures, swapped.",
   "sigma_y 32.515866 m and sigma_z 23.310861 m, which are the two spreads the table prints for class C at 300 m.",
   "sigma_y 65.031732 m, sigma_z 60.000000 m."],
  "The sigma tables print 23.647903 m and 14.948186 m for class D at 300 m. Swapping 23.647903 and 14.948186 confuses the crosswind and vertical spreads. 32.515866 and 23.310861 m are class C, and 65.031732 and 60.000000 m are class A.")

q(0,
  "Class A's sigma_z reads 20.000000 m at 100 m and 200.000000 m at 1000 m. Why exactly proportional to the distance?",
  "Its sz2 and sz3 are both 0, so sigma_z = sz1 x = 0.2 x.",
  ["All six classes are linear in the distance for sigma_z, since sigma_z is the vertical spread and the ground limits it.",
   "Class A is clamped to a linear form inside 100 m to 10 km, the advisory range that the curves are quoted for.",
   "Its sz1 is 0, so only the sz2 term survives."],
  "The `BRIGGS_RURAL` table gives class A sz1 0.2, sz2 0 and sz3 0, so sigma_z = sz1 x (1 + sz2 x)^sz3 reduces to 0.2 x. Class D goes from 5.595029 m at 100 m to 37.947332 m at 1000 m, less than seven times as much, so the classes differ. Nothing is clamped, and sz1 is 0.2.")

q(1,
  "Closer in, only 200 m out, what does the neutral class give for UBIT on the axis at the ground?",
  "1272.709839 mg/m3.",
  ["4764.608684 mg/m3, the reading the engine gives at 100 m on the same centreline.",
   "1111.651553 mg/m3, the same point.",
   "239.712839 mg/m3."],
  "The UBIT table prints 1272.709839 mg/m3 at 200 m in class D. 4764.608684 mg/m3 is 100 m. 1111.651553 is the same 200 m reading in ppm, a different unit. 239.712839 mg/m3 is 500 m; the sigmas at 200 m are 15.842361 and 10.524696 m, so the plume has spread.")

q(3,
  "At 500 m the UBIT release gives 45.301469 mg/m3 in one class and 103.663813 mg/m3 in another. Which classes are they?",
  "Class B and class C.",
  ["Class E and class F, the two stable classes, since the stable plume stays thin and near the ground.",
   "Class A and class B, since the two most unstable classes give the two lowest ground level readings at 500 m.",
   "Class C and class D, the two neutral classes in the middle of the table the engine exports."],
  "The class table at 500 m prints 45.301469 mg/m3 for B and 103.663813 mg/m3 for C. E and F give 555.698014 and 1562.900663 mg/m3. A gives 19.767914 mg/m3, the lowest. Only D is neutral, at 239.712839 mg/m3.")

q(2,
  "An alarm reads 1200 ppm of carbon monoxide in a room at 293.15 K. As mass per cubic metre, what does the engine give?",
  "1397.291071 mg/m3 at that temperature.",
  ["1373.858385 mg/m3, the figure the conversion gives at 298.15 K.",
   "1499.600503 mg/m3, the figure the conversion gives at 273.15 K.",
   "1700.095669 mg/m3, the figure for hydrogen sulphide at the same 293.15 K."],
  "Read the 1200 ppm carbon monoxide row in the 293.15 K column: 1397.291071. The neighbouring columns belong to warmer and colder air, and the conversion always uses the temperature stated. 1700.095669 comes from the hydrogen sulphide row, whose heavier molecule gives more mass for the same ppm.")

q(0,
  "At the freezing point of water, 273.15 K, and one atmosphere, how many litres does a mole of ideal gas fill in the engine's conversion?",
  "22.413970 L/mol.",
  ["24.45 L/mol, the CCOHS figure at every temperature.",
   "24.465404 L/mol, the molar volume the engine uses at 298.15 K.",
   "24.055117 L/mol, the molar volume the engine uses at 293.15 K."],
  "R T / P at the freezing point gives 22.413970 L/mol, the smallest of the three temperatures tabled. Colder gas packs tighter, so the warmer rows carry the larger figures offered. The CCOHS number is a published approximation of the warmest row, and the engine always computes its own volume.")

q(3,
  "In the plume expression, the term exp(-(z + h)^2 / 2 sz^2) sits beside exp(-(z - h)^2 / 2 sz^2). What does it stand for?",
  "The image source at minus h: the ground reflects what reaches it.",
  ["A correction for the stack's own height, subtracted from the first term to account for the gas absorbed by the ground below the release.",
   "The crosswind spread of the plume, which the engine adds to the vertical term to widen the plume sideways.",
   "A second release of the same size above the first, used only for a stack."],
  "Section 11: the second exponential is the IMAGE SOURCE at minus h, and the ground reflects what reaches it. It is added to the first term, and total reflection absorbs nothing. The crosswind term is exp(-y^2 / 2 sy^2), a separate factor. The image sits below the ground at minus h for every release height, including a ground level one.")

# ---------------------------------------------------------------- m06
q(3,
  "Under a clear night sky the UBIT gas drifts from the ground. How far downwind does the ground reading still exceed 100 mg/m3?",
  "2564.337939 m.",
  ["830.322126 m, the distance the table gives for the same target under class D.",
   "943.433416 m, which the table gives for class F falling to 500 mg/m3.",
   "9384.252298 m, the class F distance to 20 mg/m3."],
  "A clear night with light wind is class F, and its 100 mg/m3 row reads 2564.337939 m. The neutral class stops far shorter. The other two class F figures answer the 500 and 20 mg/m3 targets, a higher and a lower threshold.")

q(0,
  "How far downwind does the class D centreline stay above 500 mg/m3 for the UBIT release from the ground?",
  "Out to 331.629944 m.",
  ["Out to 943.433416 m, the distance to 500 mg/m3 that the table gives for class F.",
   "Out to 239.712839 m, since that is the concentration at 500 m.",
   "It never reaches 500 mg/m3, so the state is NOT_REACHED."],
  "The table prints REACHED at 331.629944 m for class D and 500 mg/m3, and from the ground the concentration falls monotonically, so it is above 500 mg/m3 inside that distance. 943.433416 m is class F. 239.712839 is a concentration in mg/m3 and never a distance. The ground level centreline starts far above 500 mg/m3, 4764.608684 at 100 m.")

q(3,
  "A much lower threshold, 20 mg/m3, is set for the elevated release. Which pair of distances bounds the ground zone above it?",
  "At 150.672013 m on the way up and 2151.227430 m on the way down.",
  ["At 2265.987260 m only.",
   "At 221.924194 m and 656.636313 m.",
   "Nowhere."],
  "Twenty is far under the elevated plume's maximum, so the curve crosses it once climbing and once falling: 150.672013 m and 2151.227430 m bound the zone. A single figure is what a ground release gives. The narrower pair answers the higher 100 mg/m3 threshold. Since the ground reading climbs past twenty, the threshold is certainly met.")

q(0,
  "The elevated release's table repeats one maximum, 153.887548 mg/m3 at 347.557177 m, on every target row. Why does the target never move it?",
  "The maximum belongs to the plume itself, set by the release rate, the wind, the stack height and the class; a target only decides where that curve is crossed.",
  ["The engine computes the maximum on the first row only and copies it to the other rows, which saves running a second search.",
   "It does move, but the six decimal print rounds away every change between the rows of the table.",
   "Every target in the table is REACHED."],
  "Section 13 prints the same maximum beside targets of 500, 100, 20 and 5000 mg/m3: the ground curve under a 25 m stack is fixed before any target is named, and the target only picks the crossings, two for 100 and 20 and none for 500 and 5000. Nothing is copied between rows, rounding hides no change because there is none, and two of the four rows are NOT_REACHED.")

q(2,
  "Someone stands 20 m off the plume axis, half a kilometre downwind of UBIT in neutral weather. What reading do they get?",
  "210.227800 mg/m3, a ratio of 0.876998 to the axis reading.",
  ["105.544135 mg/m3, 0.440294 of the centreline, the reading the crosswind table gives at 50 m.",
   "239.712839 mg/m3, since 20 m is well inside sigma_y.",
   "9.008708 mg/m3, 0.037581 of the centreline, the reading the crosswind table gives at 100 m."],
  "Twenty metres is small beside a sigma_y of 39.036003 m, so the Gaussian factor stays high at 0.876998 and the reading is 210.227800 mg/m3. The two lower figures belong to people standing farther out. Any offset at all lowers the reading, so the axis value itself is wrong too.")

q(0,
  "A distance search returns a far distance of null. What can that mean?",
  "The target was NOT_REACHED (the peak is below it) or the search ended BEYOND_SEARCH_RANGE (still above it where the search stopped).",
  ["The target is met at the source, which the plume cannot evaluate at a downwind distance of 0 m.",
   "The release is at ground level, where the far distance is always null and the near distance carries the answer.",
   "The engine refused the call."],
  "Section 13: NOT_REACHED leaves both distances null, as the stack does at 500 mg/m3, and BEYOND_SEARCH_RANGE returns a far distance of null, as class F to 20 mg/m3 capped at 2000 m does. From the ground the NEAR distance is the null one, and the far distance carries the answer. A refusal returns no distances at all.")

q(1,
  "What does `plumeDistanceToConcentration` vary, and what does it hold fixed, while it searches?",
  "It varies the downwind distance and holds the receptor on the centreline at the receptor height.",
  ["It varies the crosswind distance at a fixed downwind distance until the reading equals the target.",
   "It varies the release height until the ground level reading equals the target.",
   "It varies the stability class from A to F at a fixed distance and reports the first class that meets the target."],
  "Section 13: it finds the downwind distances at which the centreline concentration at the receptor height equals a target, by bisection. The crosswind offset is zero because the distance is always a centreline distance. The release height and the class are inputs to the search, and neither is searched over.")

emit(Q, '/root/hse-wip-consequence/banks/h4b_exam.json', expect_n=42)
finish()
