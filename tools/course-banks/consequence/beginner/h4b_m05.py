import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 consequence, ASSOCIATE m05 "The Gaussian Plume".
# Digest sections 10 (Pasquill-Gifford classes, the Briggs rural sigmas, the
# range warning and the sz2 note), 11 (the continuous plume with ground
# reflection on the UBIT carbon monoxide release, the class at 500 m, the
# wind, the Purple Book worked case and the mass flux integral) and 12 (ppm
# and mg/m3 at the stated temperature).

q(1,
  "Which Pasquill-Gifford class is the most stable, which the most unstable, and which is neutral?",
  "F is the most stable (a clear night, light wind), A the most unstable (a sunny afternoon, light wind), and D is neutral.",
  ["A is the most stable, because its sigmas are the largest and the plume holds together, and F the most unstable, with D neutral.",
   "F is the most stable, A the most unstable, and C is neutral, since C sits in the middle of the six letters.",
   "D is the most stable, being neutral, and A and F are both unstable at the two ends of the table the engine exports."],
  "The course explains: class A is the most unstable (a sunny afternoon, light wind) and class F the most stable (a clear night, light wind); D is neutral. A has the LARGEST sigmas because an unstable atmosphere spreads the plume fastest, so large sigmas mean strong mixing. Neutral is D, whatever its place in the alphabet.")

q(3,
  "What sigma_z does the engine return for class D at 1000 m?",
  "37.947332 m.",
  ["55.950288 m, the vertical spread the ALOHA note calls the misprint.",
   "76.277007 m, the crosswind spread in the same class at the same distance.",
   "23.076923 m, from the class E column at the same 1000 m."],
  "The sigma_z table prints 37.947332 m for class D at 1000 m, with the engine's sz2 of 0.0015. 55.950288 m is what the misprinted 0.00015 would give, derived for comparison and never returned. 76.277007 m is sigma_y, the crosswind spread, for class D at 1000 m. 23.076923 m is class E.")

q(2,
  "ALOHA prints the class D sz2 as 0.0015 and notes that a value printed since Briggs 1973 is incorrect. Which does the engine carry?",
  "0.0015, the ALOHA value; the 0.00015 printed since Briggs 1973 is the misprint.",
  ["0.00015, because Briggs 1973 is the original source of the rural curves and the engine follows the original over any later table.",
   "Both, and it reports the larger vertical spread as a warning on every class D result it returns to the analyst.",
   "0.0003, the class E and F value."],
  "The course explains: the engine carries 0.0015. ALOHA notes that 0.00015, printed since Briggs 1973, is incorrect; at 1000 m the two would give 37.947332 and 55.950288 m. The engine carries one coefficient and no warning compares them. 0.0003 is sz2 for classes E and F.")

q(0,
  "The Briggs sigmas are asked for at 60 m, below the usual range. What does the engine do?",
  "It returns them with a warning that the distance is outside 100 m to 10 km and the result should be treated as an extrapolation.",
  ["It refuses, because the sigmas are undefined below 100 m.",
   "It returns the sigmas at 100 m instead, the nearest distance inside the range the curves are quoted for.",
   "It returns them with no comment."],
  "The course explains: outside 100 m to 10 km the sigmas carry a warning and are still returned: \"the downwind distance is outside 100 m to 10 km, the range these curves are usually quoted for; treat the result as an extrapolation\". The table marks 60 m and 20000 m \"yes\". Nothing is refused or clamped to 100 m, and the warning is not silent.")

q(3,
  "The UBIT release is 2 kg/s of carbon monoxide in a 3 m/s wind, class D. At ground level on the centreline from a ground level release, what is the concentration at 500 m?",
  "239.712839 mg/m3, or 209.377772 ppm.",
  ["73.313504 mg/m3, the reading the engine gives at 1000 m on the same centreline.",
   "1562.900663 mg/m3, the reading of the same release under class F.",
   "209.377772 mg/m3, since the engine prints the same figure whether the unit is ppm or mg/m3."],
  "The UBIT table prints 239.712839 mg/m3 and 209.377772 ppm at 500 m in class D. 73.313504 mg/m3 is the 1000 m row. 1562.900663 mg/m3 is class F at 500 m. 209.377772 is the same concentration in ppm, and ppm and mg/m3 differ by the molar mass over the molar volume.")

q(1,
  "Why does the plume's ground level centreline concentration from a ground level release come out as Q / (pi sy sz u)?",
  "Both exponentials in the reflected expression equal one there, so the image source at minus h doubles what an unbounded plume would give.",
  ["Because the engine drops the second exponential at the ground, so the expression loses its factor of two.",
   "Because the sigmas are set to one at ground level.",
   "Because the ground absorbs the plume, which halves the unbounded result, and the two in the denominator cancels against it."],
  "The course explains: at ground level on the centreline from a ground level release the two exponentials are both one, and the reflection DOUBLES what an unbounded plume would give, turning Q / (2 pi sy sz u) into Q / (pi sy sz u). The engine keeps the image source, so nothing is dropped. The sigmas depend on the class and distance. Total ground reflection is the opposite of absorption.")

q(0,
  "At 500 m the UBIT release gives 1562.900663 mg/m3 in class F. How does that compare with class D, and why?",
  "6.519887 times class D: the stable night-time plume stays thin and near the ground.",
  ["19.767914 mg/m3 is higher still, because the unstable class A plume mixes the gas down to the ground fastest.",
   "About the same as class D, since the release rate and the wind are unchanged and the class only moves the plume sideways.",
   "6.519887 times class D, because class F has the fastest wind."],
  "The course says class F gives the highest ground level concentration at 500 m, derived 6.519887 times class D (239.712839 mg/m3), because the plume stays thin and near the ground. 19.767914 mg/m3 is class A and is the LOWEST in the table. The class sets both sigmas, so it changes the concentration a great deal. The wind is 3 m/s in every row.")

q(2,
  "The UBIT wind is doubled with the class and distance held. What does the plume do to the concentration, and what happens as the wind falls to zero?",
  "It halves, since the concentration is inversely proportional to the wind at fixed sigmas; at zero the engine refuses, having no calm air form.",
  ["It doubles, since a stronger wind carries more of the gas from the release to the receptor in the same time.",
   "It is unchanged, because the Briggs sigmas already carry the wind, so at zero the engine returns the class F value.",
   "It halves, and at zero it returns the largest concentration the table carries, from class F."],
  "The course explains: the concentration is inversely proportional to the wind speed at fixed sigmas, and the plume has no calm air form; the engine's words are \"windSpeedMS: must be above 0 m/s: the Gaussian plume divides by the wind speed and has no calm-air form\". A stronger wind dilutes the gas into more air. The sigmas depend on class and distance only. A refusal carries no number, so nothing comes back from class F.")

q(2,
  "The Purple Book worked case (Q 100 kg/s, u 5 m/s, h = z = 1 m, sigma_y 28.8 m, sigma_z 10.3 m) prints C = 21.3 g/m3. What does the engine give, and how does it take the sigmas?",
  "21.260627 g/m3, with the sigmas given explicitly in place of a class.",
  ["21.3 g/m3 exactly, with the sigmas looked up from class D at the printed distance of 1000 m.",
   "21.260627 mg/m3, since the engine reports every plume concentration in mg/m3 and the book in g/m3.",
   "21.260627 g/m3, with the sigmas computed from class F by Briggs."],
  "The course explains: the engine gives 21.260627 g/m3 against the printed 21.3 g/m3, and the worked case is at z = h = 1 m with the sigmas given explicitly, which the engine accepts in place of a class. No class lookup is made, so there is no class D or class F in it. The figure is 21.260627 g/m3: the book case is in g/m3, and reading it as mg/m3 is a thousandfold error.")

q(0,
  "For eight plume cases the oracle integrates u times the concentration over every crosswind distance and every height above the ground. What does that second route show?",
  "It recovers the release rate, a ratio of 1 to within one part in a billion; a plume that dropped the reflection would return a half.",
  ["It recovers twice the release rate, since the image source adds a second plume of its own below the ground.",
   "It recovers the concentration at 500 m in class D, 239.712839 mg/m3, independently of the engine's own code.",
   "It recovers the release rate only in class D."],
  "The course describes the mass flux integral: the golden records the recovered release rate over the true one, which is 1 to within one part in a billion in every case. The reflection keeps all the gas above the ground, which is why it recovers exactly Q and why dropping it would return a half. The integral recovers a rate and says nothing about one concentration, and it holds for all eight cases.")

q(3,
  "400 ppm of carbon monoxide (28.01 g/mol) is converted to mg/m3 at 101325 Pa. What does the engine return at 298.15 K, and at 273.15 K?",
  "457.952795 at 298.15 K and 499.866834 mg/m3 at 273.15 K.",
  ["499.866834 at 298.15 K and 457.952795 mg/m3 at 273.15 K, since a warmer gas carries more mass in each cubic metre.",
   "465.763690 mg/m3 at both, because the engine converts at 293.15 K whatever temperature the call states.",
   "608.192135 at 273.15 K, since the conversion uses the molar mass of hydrogen sulphide."],
  "The course's table prints 457.952795 mg/m3 at 298.15 K and 499.866834 mg/m3 at 273.15 K for 400 ppm of carbon monoxide. A colder gas is denser, so the same ppm is MORE mg/m3 when cold. The engine converts at the STATED temperature, and 465.763690 is the 293.15 K column. 608.192135 is hydrogen sulphide at 273.15 K.")

q(1,
  "What molar volume does the engine use at 298.15 K and 101325 Pa, and how does it relate to the CCOHS 24.45 L/mol?",
  "24.465404 L/mol from R T / P; the printed 24.45 lies within one part in a thousand of it.",
  ["24.45 L/mol exactly, since the engine takes the CCOHS figure as a constant for every conversion it makes.",
   "22.413970 L/mol, the molar volume at 273.15 K, which the engine uses for every temperature.",
   "24.055117 L/mol, at 293.15 K."],
  "The course explains: the molar volume is the ideal gas R T / P at the stated temperature and pressure, 24.465404 L/mol at 298.15 K, and the CCOHS and NIOSH figure of 24.45 approximates it, gated at one part in a thousand. The engine computes it and holds no constant 24.45. 22.413970 and 24.055117 L/mol are the 273.15 K and 293.15 K rows.")

q(0,
  "Hydrogen sulphide (34.08 g/mol) at 50 ppm reads 76.024017 mg/m3 at 273.15 K and 69.649372 mg/m3 at 298.15 K. What does that difference teach?",
  "A ppm to mg/m3 conversion is only correct at the temperature it was made at, because a colder gas is denser.",
  ["The engine's two conversion functions disagree, since mgM3ToPpm uses a different molar volume from ppmToMgM3.",
   "Hydrogen sulphide changes molar mass with temperature.",
   "The warmer figure is the true one, and 273.15 K is used only for occupational limits in the CCOHS source."],
  "The course explains: a colder gas is denser, so the same ppm is more mg/m3, and the molar volume is taken at the STATED temperature. The two functions are exact inverses at the same temperature and pressure, so they never disagree. The molar mass is a stated constant of the substance. Neither temperature is the true one; each is right at its own temperature.")

q(3,
  "The plume returns mg/m3. When does it also return ppm, and what does `ppmToMgM3` do with no molar mass?",
  "Only when a molar mass is given; with none the conversion is refused: \"molarMassGMol: must be a molar mass above 0 g/mol\"",
  ["Always, since the plume carries the molar mass of carbon monoxide as its default and converts at 298.15 K.",
   "Only in class D, because the conversion assumes air of 28.01 g/mol whenever no molar mass at all is typed into the call by the analyst.",
   "Never: ppm comes only from `mgM3ToPpm` called by hand, and the missing molar mass is taken as 1 g/mol."],
  "The course explains: the plume returns mg/m3, and ppm only when a molar mass is given, and the course lists the refusal on `molarMassGMol` in the quoted words. The engine carries no default molar mass. 28.01 g/mol is carbon monoxide, a stated input of the UBIT release, and class plays no part in the unit.")

q(2,
  "Which spread does sigma_y describe, and which sigma_z, and what unit do both carry?",
  "sigma_y is the crosswind spread and sigma_z the vertical spread, both in m.",
  ["sigma_y is the vertical spread and sigma_z the crosswind spread, both in m.",
   "sigma_y is the downwind spread and sigma_z the vertical spread, both dimensionless fractions of the distance.",
   "Both are crosswind spreads in m, one for the near field and one for the far."],
  "The course says it plainly: sigma_y is the crosswind spread and sigma_z the vertical spread, both in m. Reversing them puts y and z on the wrong axes of the plume expression, where y is the crosswind distance and z the receptor height. Neither is a downwind spread, and neither is a fraction.")

emit(Q, '/root/hse-wip-consequence/banks/h4b_m05.json', expect_n=15)
finish()
