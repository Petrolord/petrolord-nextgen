import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 consequence, Expert tier, module "The Blast Field".
# Digest sections drawn on: 24 (overpressure against distance, the published
# conference column and its printed constants), 25 (the distance for an
# overpressure, and what a free air burst leaves out), 3 (the explosions
# refusals) and 31 (the multi-energy method named as out of the engine).

q(1,
 "`distanceForOverpressure` is asked where BONGA's 500 kg of TNT gives 100000 Pa. What distance does it return?",
 "21.822266 m",
 ["30.090623 m, the distance returned for a target of 50000 Pa",
  "20 m",
  "49.426650 m, the distance returned for a target of 20000 Pa"],
 "The inverse table prints 21.822266 m, at Z = 2.749433, for 100000 Pa. 30.090623 m and 49.426650 m answer the 50000 and 20000 Pa targets. 20 m is a stated row of the forward table, where the overpressure is 121853.141070 Pa, so it lies closer in than the 100000 Pa distance."),

q(3,
 "For a target of 10000 Pa on the same charge, which scaled distance, in m/kg^(1/3), does the bisection settle on?",
 "9.988894",
 ["10, since the ratio table prints Z = 10 against the nearest overpressure to the target",
  "6.227368, the Z the bisection settles on for 20000 Pa",
  "17.786268, the Z the bisection settles on for 5000 Pa"],
 "The inverse table prints Z = 9.988894 for 10000 Pa, giving 79.281907 m. Z = 10 gives 9985.363723 Pa, a little below the target, so the root sits just inside it. 6.227368 and 17.786268 are the 20000 and 5000 Pa rows."),

q(0,
 "How does the engine invert the Kinney and Graham fit to find a distance, in its own method string?",
 "\"inverse of the Kinney and Graham fit by bisection on Z\"",
 ["An algebraic inverse of the closed form, solved exactly for Z and then multiplied by the cube root of the charge",
  "A lookup on the Kingery-Bulmash curves, which the engine interpolates between the printed points",
  "A Newton iteration on the distance in m, holding the charge and the ambient fixed"],
 "The engine's method is the bisection quoted, run on Z, after which the distance follows from Z times the cube root of the charge. The fit has no algebraic inverse in the engine, the Kingery-Bulmash fits are not in the engine at all (section 31), and no Newton step on the distance is used."),

q(2,
 "The inverse table puts 50000 Pa at 30.090623 m for 500 kg. Fed back into the forward fit at that distance, what overpressure does the engine return?",
 "50000 Pa, because every row of the inverse table round trips through the forward fit",
 ["19626.657230 Pa, the overpressure the forward table prints at 50 m",
  "121853.141070 Pa, the overpressure the forward table prints at the 20 m row",
  "100000 Pa, since the bisection brackets the root from above"],
 "Section 25 states that every row round trips through the forward fit, so 30.090623 m returns the 50000 Pa it was searched for, to within the rounding of the printed distance. 19626.657230 Pa and 121853.141070 Pa are the forward rows at 50 m and 20 m, and 100000 Pa is another target altogether."),

q(2,
 "The 500 kg charge gives 2121.136283 Pa at the Z = 40 edge of the judged range. A target below that overpressure is passed to `distanceForOverpressure`. What happens?",
 "It is refused on `overpressurePa`, the field the inverse names when no Z inside the judged range can give the target",
 ["It returns the distance at Z = 40 with the state BEYOND_SEARCH_RANGE, which is the way the plume search reports a target it cannot reach",
  "It returns a distance beyond Z = 40 with a warning that the result is an extrapolation of the fit",
  "It is refused on `scaledDistanceMKg13`, the field the forward fit names outside its range"],
 "The inverse refuses an overpressure the fit cannot give inside its range, on the field `overpressurePa`, in the engine's words \"overpressurePa: lies outside the overpressures the fit gives over Z = 0.05 to 40 m/kg^(1/3)\". It has no BEYOND_SEARCH_RANGE state and no extrapolation warning; those belong to the distance searches and to the Briggs sigmas. `scaledDistanceMKg13` is the forward function's field."),

q(0,
 "The 2020 conference paper PRINTS the Kinney and Graham formula with two constants that its own column does not follow. Which constants does the engine use?",
 "808 and 0.048, which the paper's column follows and two other sources print",
 ["800 and 0.049, as the paper prints them in its formula, since the golden is labelled PUBLISHED from that paper",
  "808 and 0.049, taking the leading constant from the column and the break from the printed formula",
  "800 and 0.048"],
 "Section 24: the paper prints 800 and 0.049, but its column follows 808 and 0.048, and those are the constants in the engine's model string. Using the printed pair, or either mixed pair, would fail to reproduce the column that is the evidence."),

q(3,
 "Why does the golden label the conference column PUBLISHED when the paper misprints its own formula?",
 "Because the column is the evidence: its numbers reproduce through the engine, whatever the printed formula says",
 ["Because the engine uses the printed formula and the column was corrected to agree with it before the golden was written",
  "Because Kinney and Graham (1985) print the same five values in their own worked table of the fit",
  "Because all five cases agree with the engine to better than 3.09e-6 relative, the smallest of the five differences"],
 "The digest says the column is the evidence and the golden is PUBLISHED because its numbers reproduce. The engine does not use the printed formula, the five values come from the 2020 paper's table, and 3.09e-6 is the difference for one case only; cbu-0.5kg-5m sits at 1.70e-4."),

q(1,
 "The conference case cbu-1kg-5m prints 29.24 kPa and the engine gives 29.238107 kPa. Which row of the ratio table against Z does that case sit on?",
 "The Z = 5 row, 29238.106780 Pa, because a 1 kg charge has a cube root of one",
 ["The Z = 10 row, 9985.363723 Pa, because the distance is divided by the half kilogram of the charge",
  "The Z = 2 row, 207926.999232 Pa, the nearest printed Z to the square root of five",
  "The Z = 1 row, 1008789.503793 Pa, since the charge is 1 kg"],
 "Z = R / W^(1/3), and 5 m over the cube root of 1 kg is 5, where the ratio table prints 29238.106780 Pa, the same figure as 29.238107 kPa. The other rows come from a wrong scaling: halving, a square root, or reading the charge as the scaled distance."),

q(0,
 "The conference case cbu-0.5kg-5m reads 19.626657 kPa, which matches BONGA's 500 kg at 50 m, 19626.657230 Pa. Why do the two agree?",
 "They share the scaled distance 6.299605 m/kg^(1/3): a thousand times the charge at ten times the distance",
 ["The conference paper used BONGA's charge and scaled it down by one thousand for its table",
  "The two cases were run at different ambients that happen to cancel the difference in charge",
  "The engine rounds every overpressure near that value to one shared printed figure"],
 "Cube root scaling makes the overpressure a function of Z alone, and both cases sit at Z = 6.299605. The paper's cases are its own, the golden is at 101.325 kPa, and the engine prints six decimals rather than rounding into bands."),

q(3,
 "Among the five conference cases, which carries the largest relative difference between the engine and the printed figure?",
 "cbu-0.5kg-5m, at 1.70e-4",
 ["cbu-1kg-5m, which the digest prints at 6.47e-5",
  "cbu-0.1kg-2m, which the digest prints at 5.73e-5",
  "cbu-0.1kg-1m, which the digest prints at 3.09e-6"],
 "The column's relative differences are 6.47e-5, 1.70e-4, 3.34e-5, 5.73e-5 and 3.09e-6, so cbu-0.5kg-5m, printed 19.63 against 19.626657 kPa, is the largest. The printed values carry two or three decimals, which is what sets the size of each difference."),

q(1,
 "A charge bursts at the ground and its shock reflects. What does the engine do about the reflection?",
 "Nothing in the fit: the fit is a free air burst, and the engine header leaves the ground burst to the caller's choice of charge weight",
 ["It doubles the overpressure for any charge flagged as a ground burst before it reports it",
  "It adds an image charge below the ground, the way the Gaussian plume adds an image source at minus h",
  "It switches to the Kingery-Bulmash hemispherical fit"],
 "Section 25: the fit is a FREE AIR burst of TNT; a burst at the ground reflects its shock and is not modelled, and the header says that is the caller's choice of charge weight. There is no doubling flag and no image charge (the image source is the plume's reflection), and Kingery-Bulmash is not in the engine."),

q(2,
 "A vapour cloud explodes in a congested process area. What does this engine carry for the difference between that cloud and a TNT charge?",
 "Only the yield factor, which carries the whole difference; the TNO multi-energy method, which treats congestion, is not in the engine",
 ["The TNO multi-energy method, whose blast curves the engine reads for a stated level of congestion",
  "A congestion factor applied to the Kinney and Graham ratio",
  "A second heat of combustion for the cloud, which the engine uses in place of the TNT blast energy of 4600000 J/kg"],
 "A vapour cloud is not TNT, and section 25 says the yield factor carries the whole difference. The multi-energy method is named in section 31 as out of the engine because its charts are graphical and no published curve fit was found, so no congestion factor exists. The TNT blast energy is always the denominator."),

q(3,
 "On BONGA's forward table for 500 kg, which stated distance gives 3427.919093 Pa?",
 "200 m",
 ["100 m, where Z is 12.599210",
  "300 m, the farthest row printed",
  "50 m, where Z is 6.299605"],
 "The 200 m row prints Z = 25.198421 and 3427.919093 Pa. The 50 m and 100 m rows are closer and higher, 19626.657230 and 7457.699887 Pa, and the 300 m row is farther and lower, 2247.931733 Pa."),

q(0,
 "The forward table puts BONGA's 20 m row at 121853.141070 Pa, and the inverse table puts 100000 Pa at 21.822266 m. How do the two agree?",
 "They are consistent: 20 m is closer in than 21.822266 m, so it sees more than 100000 Pa",
 ["They disagree, which shows the bisection stops before it converges on the root",
  "They disagree because the forward and inverse functions use different constants",
  "They are consistent only because the forward table uses a rounded scaled distance of 2.519842"],
 "The overpressure falls with distance, so a target closer than the 100000 Pa distance sees a higher overpressure, as 121853.141070 Pa does. The inverse bisects on the same fit, rows round trip, and the forward fit does not depend on the six decimal rounding of Z printed in the table."),

q(1,
 "The conference column is computed at what ambient, and how does the engine's validation record rank that table as evidence?",
 "At an ambient of 101.325 kPa, and it names the table as secondary",
 ["At an ambient of 100000 Pa, and it ranks the table above every Yellow Book case because five values reproduce",
  "At the stated ambient of each case, printed beside it",
  "At 6894.757293168361 Pa, and as a primary source"],
 "Section 24 prints the column at an ambient of 101.325 kPa and says the validation record names the table as secondary. 100000 Pa is one of BONGA's targets, the table prints no per case ambient, and 6894.757293168361 is `PA_PER_PSI`, a pascal count per psi."),

emit(Q, '/root/hse-wip-consequence/banks/h4a_m02.json', expect_n=15)
finish()
