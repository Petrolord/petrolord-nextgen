import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 Professional final exam, 42 questions, seven a module:
# the burning flux (section 14), the flame length (15), tilt and surface
# emissive power (16, 17), the view factor (18), transmissivity, the heat flux
# and the seams (19, 20, 22), and the Yellow Book pool fire with the fire
# half refusals (21, 3). Every question is distinct from the module banks.

# ---- how fast a pool burns ----

q(1,
 "Liquefied natural gas spreads into a 5 m pool and ignites. Reading the lng column, what is its burning rate per unit area in kg/(m2 s)?",
 "0.077681",
 ["0.077999","0.069357","0.078000"],
 "The lng column reads 0.077681 at 5 m. 0.077999 is lng at 10 m and 0.078000 its asymptote from 20 m on, while 0.069357 is lng at 2 m. A k beta of only 1.1 per m keeps lng climbing toward 0.078 over a wide range of diameters.")

q(0,
 "Gasoline pools are swept by diameter as well. At a diameter of 1 m, what does its column read in kg/(m2 s)?",
 "0.048265",
 ["0.054175","0.037822","0.052036"],
 "Gasoline at 1 m prints 0.048265. 0.054175 is gasoline at 2 m, closer to its m\"inf of 0.055. 0.037822 is kerosene at 1 m and 0.052036 is lng at 1 m, other columns of the same sweep.")

q(2,
 "How does the solid flame model picture a pool fire before any heat flux is computed?",
 "As a cylinder of flame whose surface emissive power is uniform over it",
 ["As a point at the flame centre that radiates a fraction of the heat release",
  "As a cone of flame whose emissive power rises steadily from base to tip",
  "As a flat disc over the pool that radiates straight upward and sideways"],
 "The course opens with it: the solid flame model treats a pool fire as a cylinder of flame with a uniform surface emissive power, then multiplies by a view factor and a transmissivity. Treating the flame as a radiating point belongs to the facilities engines and is another course's model. No cone or disc geometry appears in the engine.")

q(3,
 "Reading the Babrauskas sweep at a diameter of 10 m, which columns still sit below their asymptotes at six decimals?",
 "lng and heptane, at 0.077999 and 0.100998",
 ["lpg and gasoline, at 0.099000 and 0.055000",
  "kerosene alone, at a value of 0.039000",
  "methanol alone, at a value of 0.015000"],
 "At 10 m lng prints 0.077999 against 0.078 and heptane 0.100998 against 0.101, both still short because their k beta is only 1.1 per m. lpg at 0.099000 and gasoline at 0.055000 have already reached theirs, kerosene reached 0.039000 at 5 m, and methanol has no diameter dependence at all.")

q(3,
 "For which kind of liquid does the engine print the Burgess form?",
 "A single-component liquid below its boiling point",
 ["Any mixture, provided its heat of combustion is stated",
  "A liquid that is already boiling at the ambient temperature",
  "A cryogenic liquid, since Burgess was written for lng and lpg"],
 "The course describes Burgess, m\" = 0.001 dHc / (dHv + Cp (Tb - Ta)), as for a single-component liquid below its boiling point. A boiling liquid is exactly what the boilingPointK refusal turns away, and the form carries a single boiling point, which a mixture does not have.")

q(1,
 "poolBurningRate is asked for a fuel key that POOL_FIRE_FUELS does not contain and no constants are given. Which field does the refusal name?",
 "fuel",
 ["method","boilingPointK","kBetaPerM"],
 "The course lists it as the field fuel, with a message listing the thirteen keys and the alternative of giving massBurningFluxInfKgM2S and kBetaPerM. method is named for an unknown method string, boilingPointK for a Burgess liquid that boils below ambient, and kBetaPerM is one of the two constants the message invites, never the field refused.")

q(0,
 "Two fuels in Table 6.5 share a k beta product of 2.7 per m. Which pair?",
 "butane and benzene",
 ["lng and heptane","lpg and xylene","methanol and ethanol"],
 "The exported table gives butane and benzene each a k beta of 2.7 per m, with m\"inf of 0.078 and 0.085. lng and heptane share 1.1, lpg and xylene share 1.4, and methanol and ethanol carry no k beta at all, their burning rate being independent of the diameter.")

# ---- the flame length ----

q(1,
 "Blow the hardest wind the sweep holds across the heptane bund. How long, in metres, is the flame by the wind correlation?",
 "25.813232",
 ["28.107457","32.511563","35.746382"],
 "Thomas with wind, pushed to the top of the ERHA sweep, returns 25.813232 m at 12 m/s (u* 4.712858, L/D 1.290662). Each weaker wind yields a longer flame: 28.107457 m at 8 m/s, 32.511563 m at 4 m/s, and 35.746382 m for anything under uc, where the scaled speed is pinned at one.")

q(1,
 "Eight metres per second over the heptane bund fire: which ratio u* enters its flame length?",
 "3.141905",
 ["4.712858","1.570953","1.000000"],
 "Dividing 8 m/s by the ERHA uc of 2.546226 m/s gives a ratio above one, so the engine takes u* = 3.141905. Raising the wind to 12 m/s would give 4.712858, dropping it to 4 m/s gives 1.570953, and 1.000000 is the floor the max() imposes whenever the ratio falls short of one.")

q(3,
 "Below the characteristic wind speed, what L/D does Thomas with wind hold ERHA at?",
 "1.787319",
 ["1.855055","1.625578","1.405373"],
 "With u* held at one the wind form prints L/D 1.787319, giving 35.746382 m. 1.855055 is the still air form's L/D, a separate correlation. 1.625578 and 1.405373 are the wind form at 4 m/s and 8 m/s.")

q(3,
 "Which rows of ERHA's wind sweep print identical flame lengths, and why?",
 "The 0 and 2 m/s rows, since both winds sit below uc and u* is held at one",
 ["The 8 and 12 m/s rows, since the flame length saturates at high wind",
  "The 2 and 4 m/s rows, since both lie within one metre per second of uc",
  "None of the rows, since each wind speed produces its own flame length"],
 "The 0 and 2 m/s rows both read 35.746382 m because every wind below uc = 2.546226 m/s gives u* = 1. The 8 and 12 m/s rows differ (28.107457 m and 25.813232 m), the 4 m/s row is above uc at 32.511563 m, and two rows do match.")

q(2,
 "Which leading constant and exponent does the still air correlation, Thomas (1963), carry?",
 "42 and 0.61",
 ["55 and 0.67","0.666 and 0.333","2.02 and 0.09"],
 "Still air Thomas is written L/D = 42 (m\" / (rho_air sqrt(g D)))^0.61, the expression imported from the facilities spacing engine. Its wind counterpart swaps in 55 with a power of 0.67 and adds u*. The pair 0.666 with 0.333 belongs to the lean of the flame, and 2.02 with 0.09 to the Bagster transmissivity.")

q(0,
 "A consequence note quotes ERHA's flame as 35.746382 m and names no correlation. Why is that a gap?",
 "Still air Thomas gives the same fire 37.101102 m, so the length is ambiguous without its method",
 ["The engine prints flame lengths only at twelve decimals, so a six decimal figure has been rounded by hand",
  "A flame length is only defined once a stated transmissivity has been applied",
  "The figure belongs to the Yellow Book benzene fire and cannot describe ERHA"],
 "The wind form at no wind and the still air form are different correlations giving 35.746382 m and 37.101102 m for one fire, so the method must be named in every call and every note. Distances print to six decimals. Transmissivity enters the heat flux, never the flame length, and the Yellow Book flame is 46.775288 m.")

q(0,
 "At an 8 m/s wind, what ratio L/D does the wind form print for ERHA?",
 "1.405373",
 ["1.290662","1.625578","1.855055"],
 "The 8 m/s row prints L/D 1.405373 and 28.107457 m. 1.290662 is the 12 m/s ratio and 1.625578 the 4 m/s ratio. 1.855055 is the still air ratio, which no wind form row ever prints.")

# ---- tilt and surface emissive power ----

q(1,
 "ERHA's gentlest non-zero wind, 2 m/s, gives which Froude number in the tilt table?",
 "0.020394",
 ["0.081577","0.326309","0.0545"],
 "Fr10 = u10^2 / (g D) is 0.020394 at 2 m/s for the 20 m pool. 0.081577 is the 4 m/s row and 0.326309 the 8 m/s row. 0.0545 is the Froude number the Yellow Book example misprints, which should read 0.060060.")

q(3,
 "How far from the vertical does the engine lean ERHA's flame at a 12 m/s wind?",
 "62.577136",
 ["58.130517","49.174202","38.746229"],
 "The 12 m/s row prints 62.577136 degrees. 58.130517 is 8 m/s, 49.174202 is 4 m/s and 38.746229 is 2 m/s. The tilt rises with the wind but ever more slowly.")

q(1,
 "Mudan's correlation is read at D = 5 m. Which W/m2 figure comes out?",
 "85857.396331",
 ["114395.343328","56143.305429","30886.154395"],
 "The Mudan table reads 85857.396331 W/m2 at 5 m. 114395.343328 is the 2 m row, 56143.305429 the 10 m row and 30886.154395 the 20 m row, each smaller as smoke hides more of the flame.")

q(2,
 "At the far end of the Mudan table, a pool of 80 m, which value is printed?",
 "20008.127448",
 ["20987.569646","20736.395957","30886.154395"],
 "At 80 m Mudan prints 20008.127448 W/m2, all but at its 20e3 floor. 20987.569646 is the 40 m row. 20736.395957 is the engine's Mudan value for the Yellow Book benzene pool, and 30886.154395 is the 20 m row.")

q(3,
 "For the heptane bund fire's weakest non-zero breeze, what value of the lean parameter comes out of the correlation?",
 "1.028914",
 ["1.770458","1.943154","3.046437"],
 "Solving tan(t)/cos(t) = c at the lightest breeze in the sweep, 2 m/s, the engine prints c = 1.028914, which turns into 38.746229 degrees of lean. Stronger winds carry larger parameters, 1.770458 at 4 m/s and 3.046437 at 8 m/s, while 1.943154 comes from the Yellow Book benzene case.")

q(3,
 "When SEPact = SEPmax (1 - soot) + SEPsoot soot is called without a soot emissive power, which SEPsoot does the engine use?",
 "20e3 W/m2",
 ["140e3 W/m2","0.8 of SEPmax","52025.691247 W/m2"],
 "The course gives the soot emissive power a default of 20e3 W/m2, while the soot fraction itself is the caller's. 140e3 W/m2 is the leading term of Mudan's diameter form. 0.8 is the soot fraction the Yellow Book quotes for oil products. 52025.691247 W/m2 is ERHA's SEPact, the result of the form.")

q(1,
 "Doubling the ERHA wind from 4 to 8 m/s doubles Re. What value appears at 8 m/s?",
 "10666666.666667",
 ["16000000.000000","5333333.333333","28247014.532194"],
 "Multiplying 8 m/s by the 20 m diameter and dividing by the stated 0.000015 m2/s gives 10666666.666667. Half that wind gives 5333333.333333 and one and a half times it gives 16000000.000000; 28247014.532194 belongs to the Yellow Book example, computed with its printed viscosity.")

# ---- the view factor ----

q(2,
 "The upright flame of radius 10 m and length 30 m has a horizontal target 80 m from its axis. What is Fh there?",
 "0.005919000622",
 ["0.029868910564","0.030449735411","0.007637563862"],
 "At zero tilt and 80 m the table prints Fh 0.005919000622. 0.029868910564 is Fv there and 0.030449735411 the vector sum Fmax. 0.007637563862 is Fh at 80 m once the flame leans 20 degrees toward the target.")

q(2,
 "Lean the cylinder of radius 10 m and length 30 m by 20 degrees toward a receptor standing 30 m out. What most exposed view factor results?",
 "0.229458544930",
 ["0.166740705537","0.326573126713","0.192848362218"],
 "The 20 degree table prints Fmax 0.229458544930 at 30 m. 0.166740705537 is the upright Fmax at 30 m and 0.326573126713 the 40 degree Fmax. 0.192848362218 is the Fv component of the 20 degree row.")

q(1,
 "The validation record's second probe sets a 3, b 2.5 and 45 degrees. Which Fv does the closed form report there?",
 "0.291402",
 ["0.297689","0.350015","0.303765"],
 "For the 45 degree probe the closed form reports Fv 0.291402 while integrating over the visible flame surface returns 0.297689; the gap is flame behind the receptor being wrongly counted. Both routes give Fh 0.350015. 0.303765 is the closed form Fv of the steepest probe, at 60 degrees.")

q(2,
 "Of the two printed Fmax entries that fail to follow from their own components, the one at X/R 1.4 and L/R 0.2 shows 117. What is the recomputed figure, scaled by a thousand?",
 "177.287465",
 ["201.303914","117","210"],
 "Recomputing gives 177.287465, so the printed 117 is off by a wide margin. The companion misfit sits at X/R 1.2, L/R 0.1, recomputing to 201.303914 against a printed 210. Everything else in that table, 303 entries, matches to its last digit.")

q(0,
 "The golden case tilt-40-away leans the flame away from its target. What Fv do both routes give?",
 "0.079320445989",
 ["0.241673530915","0.071305007990","0.023743706812"],
 "tilt-40-away prints Fv 0.079320445989 by the engine and by route B alike. 0.241673530915 is tilt-40-toward, far higher because the flame leans toward its target. 0.071305007990 is tilt-60-away-close and 0.023743706812 is slender-far.")

q(2,
 "Far out at 120 m from the axis, which Fmax does the upright flame give?",
 "0.013690703409",
 ["0.013574612722","0.014822895951","0.014034019286"],
 "Upright at 120 m the table prints Fmax 0.013690703409. 0.013574612722 is the Fv of that row. 0.014822895951 and 0.014034019286 are the Fmax values at 120 m for tilts of 20 and 40 degrees; far from the flame the tilt matters little.")

q(2,
 "In the 40 degree table for the stated flame, which target distances carry the refusal field tiltDeg?",
 "15 m and 20 m, where the flame reaches over the target",
 ["Only 15 m, the one target that stands inside the base",
  "30 m and 50 m, where the tilt raises the view factor",
  "None, as the refusal only applies at a 20 degree tilt"],
 "The 40 degree table, like the 20 degree one, shows tiltDeg at 15 m and 20 m and view factors from 30 m out. No target sits inside the 10 m base. At 30 m and 50 m the engine returns Fmax 0.326573126713 and 0.118733812581, and the overhang refusal is geometric, applying at any tilt that brings the flame over the target.")

# ---- transmissivity and the heat flux ----

q(2,
 "Over just 10 m of air carrying water vapour at 1500 Pa, how much of the heat radiation does the Bagster fit let through?",
 "0.850165",
 ["0.770127","0.723552","0.71474"],
 "A 10 m path at 1500 Pa gives pw x = 15000.000000 N/m, comfortably in band, so tau = 2.02 (pw x)^-0.09 = 0.850165. Longer paths let less through: 0.770127 over 30 m and 0.723552 over 60 m. 0.71474 was read off Hottel charts for the Yellow Book example.")

q(0,
 "Furthest out in the ERHA end-to-end table, at 150 m, which heat flux does the product SEP x F x tau leave, in W/m2?",
 "346.807687",
 ["934.933474","3699.568657","10412.965226"],
 "At 150 m the most exposed view factor has shrunk to 0.008332606429, so 52025.691247 W/m2 times it times the stated 0.8 leaves 346.807687 W/m2. Closer in the product grows fast: 934.933474 at 100 m, 3699.568657 at 60 m and 10412.965226 at 40 m.")

q(0,
 "When does the solid flame distance search return BEYOND_SEARCH_RANGE?",
 "When the target heat flux is still exceeded at the search limit",
 ["When the target heat flux is never reached anywhere, even right at the flame",
  "When no fixed transmissivity was supplied for the search to run on at all",
  "When the tilted flame reaches over the nearest target"],
 "The course explains: a target still exceeded at the search limit returns BEYOND_SEARCH_RANGE, and one never reached even at the flame returns NOT_REACHED with the largest heat flux found. A missing transmissivity is a refusal naming transmissivity, and the overhang is a view factor refusal.")

q(1,
 "Bisection hunts for 5000 W/m2 on ERHA. Measured from the rim of the pool rather than its middle, where is it found?",
 "43.796232",
 ["53.796232","26.451220","36.451220"],
 "REACHED: the 5000 W/m2 point lies 53.796232 m from the centre, and taking off the 10 m radius puts it 43.796232 m from the rim. For the stiffer 12500 W/m2 target the pair is 36.451220 m from the centre and 26.451220 m from the rim.")

q(3,
 "Why does this course add the solid flame model when the facilities engines already carry a pool fire setback?",
 "The facilities pool fire setback states it does not provide the solid flame, so this course adds it and grades only it",
 ["The facilities setback has been withdrawn, so the solid flame model now replaces it in every course across the whole academy",
  "The two models give identical heat fluxes at every distance, so the course simply prefers the newer and more detailed of the two",
  "The facilities setback is graded in this course too, side by side with the solid flame heat flux at each target distance"],
 "The course says the facilities pool fire setback states it does not provide the solid flame model, which this course adds and grades alone. The point source model and setbacks stay with the Facilities courses on relief and flare systems and on layout, nothing is withdrawn, and this course never grades a setback.")

q(3,
 "Beyond the Yellow Book's advice, what goes wrong with the Bagster fit at very small pw x?",
 "Below about 2.5e3 N/m it would return a transmissivity above one",
 ["Below about 2.5e3 N/m it would return a negative transmissivity",
  "Below 1e4 N/m it returns exactly 2.02, the fit's own constant",
  "Below 1e4 N/m the humidity term drops out and tau becomes 0.8"],
 "The course notes that below about 2.5e3 N/m the fit tau = 2.02 (pw x)^-0.09 would exceed one, a transmissivity no air can have. It never turns negative, never collapses to its constant and never falls back to 0.8, which is only the transmissivity stated for the ERHA chain.")

q(2,
 "At 1500 Pa, what product pw x in N/m does the course derive for a 60 m path?",
 "90000.000000",
 ["45000.000000","105000.000000","15000.000000"],
 "1500 Pa times 60 m is 90000.000000 N/m, inside the band, giving 0.723552. 45000.000000 is the 30 m path and 15000.000000 the 10 m path. 105000.000000 is the 70 m path, above 1e5 N/m and refused with pathLengthM.")

# ---- the published pool fire, reproduced ----

q(0,
 "Which L/D does the engine reproduce for the Yellow Book benzene pool fire?",
 "1.102004",
 ["1.101938","1.855055","1.787319"],
 "The engine gives 1.102004 against the printed 1.101938, a relative difference of 5.99e-5 inside 0.0001. 1.855055 and 1.787319 are ERHA's still air and held wind L/D.")

q(3,
 "In the 6.6.3 benzene reproduction, the ratio u10 / uc comes out as which scaled wind speed?",
 "1.629327",
 ["1.62937","1.570953","3.068751"],
 "The engine gives u* 1.629327 against the printed 1.62937, a relative difference of 2.62e-5. 1.570953 is ERHA's u* at 4 m/s. 3.068751 is the example's characteristic wind speed in m/s, the divisor of u10 in u*.")

q(0,
 "Before soot is applied, how bright is the benzene flame of 6.6.3 by the radiative fraction method, in W/m2?",
 "252421.582860",
 ["252400","180128.456236","66484.316572"],
 "Without soot the engine returns 252421.582860 W/m2 where the book shows 252400, a gap of 8.55e-5 against an allowance of 0.001. Once soot is weighted in, the same fire drops to 66484.316572. The ERHA clear flame, 180128.456236, is a heptane fire with its own inputs.")

q(0,
 "Which Fh, for a horizontal receiver, appears in the engine's run of the 6.6.3 benzene fire?",
 "0.029151753404",
 ["0.091923780228","0.029147159519","0.096435502269"],
 "Fh comes out at 0.029151753404, set against a printed 0.029146 at a relative difference of 1.97e-4, the step's allowance being 0.0002. Its vertical partner is 0.091923780228 and their vector sum 0.096435502269. The golden case yb-pool-example-vf carries Fh 0.029147159519, checked by the surface integral.")

q(2,
 "Which tilt parameter tan/cos does the engine reproduce for the Yellow Book example?",
 "1.943154",
 ["1.94315","1.770458","3.046437"],
 "The engine gives 1.943154 against the printed 1.94315, a relative difference of 1.95e-6. It follows from the Froude number 0.060060, the value the example's inputs give. 1.770458 and 3.046437 are ERHA's tilt parameters at 4 m/s and 8 m/s.")

q(0,
 "What does Mudan's diameter form give the Yellow Book benzene pool, in W/m2, against a printed 21000?",
 "20736.395957",
 ["21000","20987.569646","30886.154395"],
 "The engine gives 20736.395957 W/m2, a relative difference of 1.26e-2, inside the 0.02 the golden allows for this step. 21000 is the printed figure. 20987.569646 and 30886.154395 are Mudan at 40 m and 20 m in the course's table.")

q(1,
 "solidFlameHeatFlux is handed a view factor of 1.2. What does the engine reply?",
 "A refusal in its own words: \"viewFactor: must lie in [0, 1]\"",
 ["A heat flux computed with the view factor quietly capped at one",
  "A refusal naming tiltDeg, since the flame must overhang",
  "A heat flux of 1.2 times the product of SEP and tau"],
 "The course lists it: a view factor above one is refused with \"viewFactor: must lie in [0, 1]\". The engine returns a result or a refusal and never caps an input quietly. tiltDeg belongs to the view factor function, and multiplying by an impossible view factor is exactly what the refusal prevents.")

emit(Q, '/root/hse-wip-consequence/banks/h4i_exam.json', expect_n=42)
finish()
