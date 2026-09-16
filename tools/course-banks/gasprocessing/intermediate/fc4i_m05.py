import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Professional m05, the vessel the gas goes up. Every figure is from digest
# Section 12: the two teaching columns, the compressibility sweep, the K value
# sweep, the liquid densities and the two kinds of published case. The equation
# itself belongs to Separation and Slug Catching and is not re-derived here.

q(1, "Which course owns the Souders-Brown equation, the K value and the settling velocity?",
 "Separation and Slug Catching, which teaches the six published K rows and the mist extractor that sets them.",
 ["This course, since the contactor sizing call is where the allowed velocity and the diameter are both formed.",
  "Flow Assurance, which owns the gas side of every vessel in the package.",
  "Nobody in the package, because the allowed velocity is a chart reading that this engine simply takes as an input."],
 "What is new in this module is the duty rather than the equation. A contactor is a mass transfer column, and it is sized on the gas that has to rise through a descending liquid.")

q(3, "What is a contactor doing that a knockout drum is not?",
 "Passing gas up through a liquid running down against it.",
 ["Draining a liquid that has already fallen out of the gas.",
  "Holding a slug of liquid until the gas above it is dry.",
  "Separating two liquids from each other by density."],
 "The arithmetic of the width happens to be the same arithmetic. The reason for it is different, and so is the liquid it is measured against.")

q(0, "What are the diameters of the two teaching columns?",
 "3.192661 ft on OBIAFU and 4.208602 ft on UBIE.",
 ["4.208602 ft on OBIAFU and 3.192661 ft on UBIE.",
  "3.192661 ft on both, since one call sizes them.",
  "4.515105 ft on OBIAFU and 2.764926 ft on UBIE."],
 "OBIAFU is a glycol column at 950.000000 psia and 104.000000 degF and UBIE is an amine column at 985.000000 psia and 112.000000 degF. The last pair are two rows of the K value sweep on one stream.")

q(2, "Where does the compressibility in this sizing come from?",
 "The engine computes it from the DAK correlation off Sutton pseudo-criticals built from the gas gravity.",
 ["It is an input with a customary default on the page, in exactly the way the K value beside it is offered.",
  "It is read from the amine or glycol property table, which carries it beside the solution density and the molecular weight.",
  "It is taken from the gas properties door of the package, which exports a single figure covering every gas."],
 "A compressibility is computable from first principles once a correlation has been chosen, so it is computed. A caller may supply one and the engine will use it, and the answer says which happened.")

q(3, "The sweep carries a row at 1400.000000 psia and 60.000000 degF and a row at 2000.000000 psia and 110.000000 degF. What separates them?",
 "The pressure, the temperature and the gravity all move between those two rows.",
 ["The pressure alone moves, which is why the compressibility falls.",
  "The pressure and the temperature move and the gravity is held.",
  "The gravity alone moves, and the compressibility follows it."],
 "The first carries a gravity of 0.700000 and a compressibility of 0.738367833, the second a gravity of 0.750000 and 0.751811429. A sentence attributing either figure to the pressure alone is a sentence about a calculation nobody performed.")

q(1, "What can zSource report on a sizing answer?",
 "Either the DAK correlation at these conditions, or supplied by the caller.",
 ["Either the DAK correlation at these conditions, or the Sutton pseudo-criticals.",
  "Only the DAK correlation at these conditions, since the module forms its own.",
  "The correlation name and the validity band it was evaluated inside."],
 "The two branches are genuinely different claims. A supplied compressibility is somebody's assertion; a computed one is a correlation's answer at stated conditions, with that correlation's validity band behind it.")

q(2, "Moving the K value from 0.150000 to 0.400000 on one stream does what?",
 "Takes the allowed velocity from 0.659228 to 1.757940 ft per s and the diameter from 4.515105 to 2.764926 ft.",
 ["Takes the allowed velocity from 0.659228 to 1.757940 ft per s and the diameter from 2.764926 to 4.515105 ft.",
  "Takes the allowed velocity from 1.757940 to 0.659228 ft per s and the diameter from 4.515105 to 2.764926 ft.",
  "Takes the allowed velocity from 0.659228 to 1.318455 ft per s and the diameter from 4.515105 to 3.192661 ft."],
 "A higher allowed velocity needs less area to pass the same gas. The pair at 1.318455 and 3.192661 is the K of 0.300000 row, which is where OBIAFU sits.")

q(0, "Why is the K value sweep the one clean single-variable sweep in this module?",
 "Only the K value moves down it, on one stream at one pressure and one temperature.",
 ["Only the K value has a customary default, so the other inputs cannot be moved.",
  "The K value enters the velocity linearly, which no other input does.",
  "The compressibility is held fixed down the sweep, which the engine allows for K alone."],
 "The compressibility sweep moves three inputs at once and the amine comparison moves a strength and a rich limit together. Here a reader can be certain nothing else moved with it.")

q(1, "What is a K value encoding that this engine cannot see?",
 "A mist extractor, an operating philosophy and a tolerance for entrainment.",
 ["A gas gravity, a pressure and a temperature, which the answer reports back.",
  "A liquid density and a solvent choice, which the property table carries.",
  "A stage efficiency and a tray spacing, which set the height of the same vessel."],
 "None of those is visible to an engine that has been handed a rate, a pressure and a gravity. It is a choice, so it stays a choice, and it is on the page rather than hidden in the arithmetic.")

q(3, "Somebody compares the OBIAFU and UBIE diameters. What must they carry alongside?",
 "The two K values, 0.300000 and 0.250000.",
 ["The two stage counts, since the height and the width are tied.",
  "The two absorption factors, which the sizing call takes as an input.",
  "The two circulations, which set the liquid load the vessel sees."],
 "A diameter is conditional on a K value in exactly the way a stage count is conditional on an absorption factor. Quote one without the other and the number cannot be checked or reproduced.")

q(2, "What liquid density does the sizing use when a caller says nothing?",
 "69.568831 lb per ft3, the module's one glycol density.",
 ["64.883034 lb per ft3, the MDEA solution density.",
  "63.011408 lb per ft3, the lightest of the three amine solutions.",
  "It has no default and refuses until one is given."],
 "A sweetening caller who says nothing gets a glycol column. The amine densities are built from each amine's solution gravity: MEA 63.011408, DEA 63.635283 and MDEA 64.883034 lb per ft3.")

q(0, "On one duty a column sized against glycol comes out 3.828818705 ft and against MDEA solution 3.900134220 ft. What does that pair say?",
 "A column sized against the wrong liquid is confidently the wrong width, by a factor of 1.018625984 here.",
 ["The amine column is wider because an amine solution carries more acid gas per gallon.",
  "The two liquids may be used interchangeably, since the two widths agree to a hundredth.",
  "The glycol figure is the conservative one, so it is the safe default for either service."],
 "Confidently is the important word. Nothing in the answer looks unusual, the arithmetic is correct throughout, and the result is a plausible diameter for a vessel measured against a fluid it will never contain.")

q(2, "The contactor golden comes in two kinds. What is the difference?",
 "Three cases pass a compressibility in, and two let the engine compute its own.",
 ["Three cases size against glycol, and two size against an amine solution.",
  "Three cases check the diameter, and two check the allowed velocity only.",
  "Three cases are published and two are the engine's own answers restated."],
 "A case that hands the engine half the answer can only check the other half. The two computing cases are the branch the live studio always takes, because it never passes a compressibility in.")

q(0, "Why does the golden carry a case that is an amine column sized against an amine solution?",
 "Because a golden made entirely of glycol columns would pass whatever the amine route did.",
 ["Because the amine density is the only one the engine builds rather than reads.",
  "Because the amine route uses a different equation from the glycol route.",
  "Because an amine column is the only case the live studio ever runs."],
 "A case only checks the path it walks. Reading a golden for what it omits is a slower and more useful exercise than reading it for what it agrees on.")

q(1, "The sizing takes a gas rate, a pressure, a temperature, a gas gravity, a K value and a liquid density. Which of those is the design choice?",
 "The K value.",
 ["The liquid density.",
  "The gas gravity.",
  "The gas rate."],
 "The liquid density describes the solvent the column is sized against and the other four describe the gas. A stage count and a diameter stay independent here, because the module carries no tray hydraulics to tie them together.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/intermediate/fc4i_m05.json', label='fc4i_m05', expect_n=15)
finish()
