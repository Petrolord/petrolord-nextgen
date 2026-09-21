import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 Professional m04: the view factor.
# Digest section 18 (Raj and Mudan view factors, Fv, Fh and Fmax as their
# vector sum, a stated flame swept over distance and tilt, the overhang
# refusal and its route B evidence, the target inside the base, the printed
# Table 6.A.1).

q(2,
 "A vertical flame of radius 10 m and length 30 m faces a ground level target 15 m from its axis. Which Fmax does the engine return?",
 "0.400055173586",
 ["0.332171054250","0.222949619043","0.285075235764"],
 "At zero tilt and 15 m the table prints Fv 0.332171054250, Fh 0.222949619043 and Fmax 0.400055173586. The first two are the vertical and horizontal target view factors that combine into Fmax. 0.285075235764 is Fmax at 20 m, a target further out.")

q(1,
 "For the same upright flame, what view factor does a vertical target facing it see at 50 m from the axis?",
 "0.069804515030",
 ["0.073136774631","0.021824698965","0.088024443375"],
 "Fv at 50 m and zero tilt is 0.069804515030. 0.073136774631 is Fmax at that distance, which also takes in the horizontal target. 0.021824698965 is Fh there. 0.088024443375 is Fv at 50 m once the flame is tilted 20 degrees toward the target.")

q(3,
 "How does the engine form Fmax from the vertical and horizontal view factors?",
 "As their vector sum, sqrt(Fv^2 + Fh^2), the most exposed target orientation",
 ["As the larger of the two, since a target can only ever face one way at any one time",
  "As their plain sum Fv + Fh, capped at one by the refusal on view factors",
  "As their average, weighting the vertical and the horizontal plane equally"],
 "Both model strings end \"Fmax the vector sum\", and the course writes Fmax = sqrt(Fv^2 + Fh^2) as the most exposed orientation. At 15 m upright that turns 0.332171054250 and 0.222949619043 into 0.400055173586, which is neither their larger member, their plain sum nor their average.")

q(2,
 "The stated flame is tilted 20 degrees toward a target standing 20 m from its axis. What does the engine return?",
 "A refusal naming tiltDeg, because the flame reaches over the target",
 ["Fmax 0.285075235764, as tilt is ignored close in",
  "A refusal naming distanceFromAxisM, because the target is inside the base",
  "Fmax 0.229458544930, the value the table prints for the 20 degree flame"],
 "The 20 degree table shows the field tiltDeg at 15 m and 20 m: 1 + (L/R) sin(tilt) is at or above X/R there, so the tilted flame reaches over the target. 0.285075235764 is the upright Fmax at 20 m and the engine never drops a stated tilt. The target is outside the 10 m base, so distanceFromAxisM does not apply. 0.229458544930 is the 20 degree Fmax at 30 m.")

q(0,
 "At 50 m from the axis, what Fmax does the engine print once the stated flame leans 40 degrees toward the target?",
 "0.118733812581",
 ["0.094301715956","0.073136774631","0.108494493589"],
 "Tilt toward the target raises the view factor: at 50 m Fmax goes from 0.073136774631 upright to 0.094301715956 at 20 degrees and 0.118733812581 at 40 degrees. 0.108494493589 is the Fv component alone at 40 degrees.")

q(1,
 "Which condition makes cylinderViewFactor refuse a tilted flame?",
 "1 + (L/R) sin(tilt) at or above X/R",
 ["X/R below one while the tilt is zero",
  "L/R above 3 with any tilt of the flame at all",
  "A tilt above 40 degrees at any distance"],
 "The engine's refusal reads \"tiltDeg: the tilted flame reaches over the target (1 + (L/R) sin(tilt) >= X/R): the closed form does not apply to a target under the flame\". A target at or inside the base, X/R at or below one, is a different refusal naming distanceFromAxisM. Neither a fixed L/R nor a 40 degree tilt draws the line: the 40 degree table returns view factors from 30 m outward, and the condition turns on L/R, X/R and the tilt together.")

q(3,
 "For the probe a 2, b 1.5 at a 30 degree tilt, a target under the flame, what vertical view factor does the numerical surface integral (route B) give?",
 "0.401252",
 ["0.394516","0.433471","0.374215"],
 "The probe table prints route B Fv 0.401252 against the closed form's 0.394516, which counts flame surface behind the target as seen. 0.433471 is Fh for this probe, where the two routes agree. 0.374215 is route B Fv for a different probe, a 3, b 2.2 at 60 degrees.")

q(0,
 "Under the flame, how do the closed form and the numerical surface integral compare on the probes the validation record tabulates?",
 "Fv disagrees while Fh agrees exactly on every probe",
 ["Both Fv and Fh disagree by the same fraction",
  "Fh disagrees while Fv agrees exactly on each of the probes",
  "Both agree, so the refusal guards only speed"],
 "On all three probes Fh is identical (0.433471, 0.350015 and 0.609719 by both routes) while Fv differs, as far as 0.303765 against 0.374215. The closed form counts flame surface behind the target as seen, which spoils Fv and leaves Fh right. The refusal exists because the closed form gives a wrong number there.")

q(3,
 "Why does the engine describe its overhang refusal as its own judgement?",
 "The Yellow Book states no domain for the formula, so the limit is the engine's call",
 ["The Yellow Book sets the limit at X/R equal to two, and the engine copies it",
  "The golden sets the limit, and the engine refuses whatever the golden omits",
  "Mudan's paper bounds the tilt at 40 degrees, and the engine extends it a little"],
 "The course closes the probe table with it: the refusal is the engine's judgement, because the Yellow Book states no domain for the formula. No printed limit at a fixed X/R exists, a golden is evidence and never a rule the engine reads, and no tilt bound from the source is named.")

q(1,
 "What does the engine do with a target placed at or inside the base of the flame?",
 "It refuses, naming distanceFromAxisM: a view factor model needs the target outside the flame",
 ["It returns an Fmax equal to exactly one, since the target is then fully surrounded by the burning flame",
  "It moves the target out to the edge of the base and returns the edge value there with a warning",
  "It refuses, naming tiltDeg, since any target that close counts as under the flame"],
 "The engine's words: \"distanceFromAxisM: the target is at or inside the flame base: a view factor model needs the target outside the flame\". It never invents a view factor of one or relocates a target. tiltDeg is the overhang refusal, which concerns a tilted flame reaching over a target that lies outside the base.")

q(0,
 "The Yellow Book's Table 6.A.1 prints Fmax 210 (times 1000) at X/R 1.2 and L/R 0.1. What does the engine compute for that cell, times 1000?",
 "201.303914",
 ["177.287465","117","210"],
 "303 cells of the table reproduce to the last printed digit, and 2 Fmax cells do not follow from their own Fh and Fv. This one computes to 201.303914 against the printed 210. 177.287465 is the computed value of the other odd cell, X/R 1.4 and L/R 0.2, whose printed figure is 117. 210 is the printed value itself.")

q(2,
 "Which model names does the engine give its view factors at zero tilt and with tilt?",
 "Raj for the vertical cylinder and Mudan for the tilted one",
 ["Mudan for both, with the tilt set to zero when upright",
  "Thomas upright and Babrauskas with a stated tilt",
  "Bagster at zero tilt and Burgess once the flame leans"],
 "The model strings read \"vertical cylinder view factor (Raj), target at ground level\" and \"tilted cylinder view factor (Mudan), target at ground level\". Mudan also names the diameter form of surface emissive power, a different function. Thomas is the flame length, Babrauskas and Burgess the burning rate, and Bagster the transmissivity.")

q(1,
 "In the view factor calls, what do a and b stand for?",
 "a = L / R and b = X / R, with X measured from the axis of the flame base to the target",
 ["a = D / L and b = X / D, with X measured along the ground from the flame surface out to the target",
  "a = L / D and b = R / X, with X measured from the downwind edge to the target",
  "a is the tilt in radians and b is the height of the target above the ground divided by the radius R"],
 "The course defines a = L / R and b = X / R, with X the distance from the axis of the flame base to a small target at ground level. The path from the flame surface is the Bagster path length, a different distance. The target is at ground level, so no height enters b, and the tilt is its own argument.")

q(2,
 "With the stated flame tilted 40 degrees toward a target 30 m from the axis, what does the horizontal target's view factor come to?",
 "0.219644967041",
 ["0.124341196034","0.241673530915","0.071282105127"],
 "The 40 degree table prints Fh 0.219644967041 at 30 m, which matches the golden case tilt-40-toward by the numerical surface integral. 0.124341196034 is Fh at 30 m with a 20 degree tilt and 0.071282105127 is Fh upright. 0.241673530915 is the Fv of the same 40 degree row.")

q(0,
 "How many golden view factor cases does the second route, a 400 by 400 Gauss-Legendre integration, check against the closed form?",
 "Nine, and they agree to the twelfth decimal in Fv and Fh",
 ["Three probes, and all three of them agree on Fv but differ in Fh",
  "Two cells, the Fmax cells the printed table got wrong",
  "303 cells, one for each figure the printed table carries"],
 "The course lists 9 golden cases, from yb-pool-example-vf to slender-far, with engine and route B equal in both Fv and Fh as printed. The three probes are targets under the flame, where Fv differs and Fh agrees. The 303 cells and the 2 odd Fmax cells belong to the printed Table 6.A.1, a separate check.")

emit(Q, '/root/hse-wip-consequence/banks/h4i_m04.json', expect_n=15)
finish()
