import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Professional m02, the fifty percent point and the Watson factor. Every
# figure is from digest SECTION 14, with the Kwale blend's SG from SECTION 13.
# Watson K at T50 is HELD item C13: questions ask what the engine does and what
# the limit is, and none keys a boiling point basis as the right one.

q(2, "What does temperatureAtVolumePercent(curve, 50) return for the Kwale blend, Kwale Light and Ughelli Medium at 55 and 45?",
 "587.3184 F, interpolated between the blend's own curve points either side of 50 percent.",
 ["650 F, the temperature of the first point of the blend's curve at or past 50 percent, read straight off the grid.",
  "584.0000 F, the volume-weighted mean of the two crudes' own 50 percent temperatures at 55 and 45.",
  "586.0503 F, the mass-weighted mean of the two crudes' own 50 percent temperatures."],
 "The engine reads the blend's own curve. The grid reading, 650 F, and the two averaged midpoints, 584.0000 F and 586.0503 F, are printed beside it as readings the engine does not use.")

q(0, "Between which two points of the Kwale blend's curve does the engine interpolate to reach its T50?",
 "The blend's own rows at 530 F and 650 F.",
 ["The blend's own rows at 480 F and 530 F.",
  "The blend's own rows at 650 F and 720 F.",
  "Kwale Light's own rows at 530 F and 650 F."],
 "50 percent lies between 43.6471 at 530 F and 56.9474 at 650 F on the blend's curve, and the engine's T50 of 587.3184 F sits on the straight line between them.")

q(3, "The Kwale blend's grid reading of T50 is 650 F. What does that temperature report about the blend?",
 "The temperature of a grid point at which the blend has already reached 56.9474 percent, which is Ughelli Medium's own fifty percent point.",
 ["The temperature at which the blend reaches exactly 50 percent, read straight from the grid without the rounding that a straight line between two points would add.",
  "The temperature at which Kwale Light reaches 50 percent on its own assay, carried over to the blend because Kwale Light holds the larger volume share.",
  "The volume-weighted mean of the two crudes' 50 percent temperatures, rounded to the nearest point on the grid."],
 "At 650 F the blend's curve reads 56.9474 percent. The grid reading minus the engine is 62.6816 F for the Kwale blend.")

q(1, "What does the digest print for the grid reading minus the engine, on the Kwale blend and on the studio's default pair?",
 "62.6816 F on the Kwale blend and 72.8571 F on the default pair.",
 ["72.8571 F on the Kwale blend and 62.6816 F on the default pair.",
  "-3.3184 F on the Kwale blend and -5.1429 F on the default pair.",
  "62.6816 F on the Kwale blend and -2.9207 F on the default pair."],
 "The Kwale grid reading is 650 F against 587.3184 F, and the default pair's is 690 F against 617.1429 F. -3.3184 and -5.1429 F are the volume-weighted means minus the engine, and -2.9207 F is the default pair's mass-weighted mean minus the engine.")

q(2, "Which volume percents make up the digest's table of other points on the Kwale blend, the T50 row among them?",
 "At 10, 30, 50, 70 and 90 percent distilled.",
 ["At 0, 25, 50, 75 and 100 percent.",
  "At each of the 14 points of the blend's curve.",
  "At 50 percent alone, the blend's T50."],
 "That table has five rows, 10, 30, 50, 70 and 90 percent, and its 50 percent row is the engine's T50 of 587.3184 F. The blend's 14 curve points sit at the temperatures the two crudes measured.")

q(0, "For the Kwale blend, what is the volume-weighted mean of the crudes' own T50, and how far does it sit from the engine?",
 "584.0000 F, which the digest prints as -3.3184 F against the engine.",
 ["586.0503 F, which the digest prints as -1.2681 F against the engine.",
  "584.0000 F, which the digest prints as 62.6816 F against the engine.",
  "612.0000 F, which the digest prints as -5.1429 F against the engine."],
 "The volume-weighted mean of 530 and 650 at 55 and 45 is printed as 584.0000 F. 586.0503 F is the mass-weighted mean, and 612.0000 F belongs to the default pair.")

q(3, "The mass-weighted mean of the API numbers is the blend API. Does mass weighting do the same for the Kwale crudes' own T50?",
 "No: the digest prints the mass-weighted mean minus the engine as -1.2681 F.",
 ["Yes: the digest prints the mass-weighted mean minus the engine as 0.0000 F.",
  "No: the digest prints the mass-weighted mean minus the engine as 62.6816 F.",
  "Yes: the mass-weighted mean of the crudes' T50 is the engine's 587.3184 F."],
 "The Kwale row prints the mass-weighted mean of the crudes' T50 as 586.0503 F beside the engine's 587.3184 F, and the difference as -1.2681 F. 62.6816 F is the grid reading minus the engine. The 0.0000 belongs to the mass-weighted mean of the API numbers.")

q(1, "For the studio's default pair, 60 and 40, which volume-weighted and mass-weighted means of the crudes' T50 does the digest print?",
 "612.0000 F and 614.2222 F.",
 ["584.0000 F and 586.0503 F.",
  "614.2222 F and 612.0000 F.",
  "612.0000 F and 617.1429 F."],
 "The default pair's row reads the volume-weighted mean of the crudes' T50 as 612.0000 F and the mass-weighted mean as 614.2222 F, beside the engine's 617.1429 F. 584.0000 F and 586.0503 F are the Kwale blend's.")

q(0, "How does the digest establish the offset watsonK adds to a temperature in F?",
 "It reads it back from the function: watsonK at 0 F and SG 1, cubed, is 459.6700.",
 ["It types the published Rankine offset of 459.6700 into the digest from a table of constants.",
  "It bisects watsonK until the function stops returning a value, and takes that temperature.",
  "It takes the offset as the grid reading minus the engine, 62.6816, scaled onto the Rankine scale."],
 "watsonK = Tb^(1/3) / SG with Tb in degrees Rankine. At SG 1 the division does nothing, so the cube of K is Tb in Rankine, and at 0 F that is the offset the engine gives itself.")

q(2, "Which Watson K does the studio report for the Kwale blend, and on what inputs?",
 "11.8135, at the interpolated T50 of 587.3184 F and SG 0.8595.",
 ["12.0447, at the grid reading of 650 F and SG 0.8595.",
  "11.7452, at the T50 of 617.1429 F and SG 0.8727.",
  "11.8135, at the mean average boiling point and SG 0.8595."],
 "The studio takes Tb as the blend's T50. 12.0447 is K at the grid reading, and 11.7452 belongs to the studio's default pair. The mean average boiling point is not computed by the studio.")

q(3, "What does watsonK return at -500 F, and at SG 0?",
 "No value in either case.",
 ["A K computed at 0 F in place of -500 F, and no value at SG 0.",
  "No value at -500 F, and a K on the default pair's SG 0.8727 at SG 0.",
  "A K taken on 459.6700 degrees Rankine in both cases."],
 "watsonK declines a non-physical input: at -500 F it returns no value, and at SG 0 it returns no value.")

q(1, "The studio takes the boiling temperature in Watson K as the blend's T50. How does this course treat that choice?",
 "As held item C13, a stated limit: K at T50 is a screening figure and is never graded.",
 ["As a graded figure: Watson K at T50 prints to four decimals, so it is marked like any other four-decimal figure.",
  "As a refusal: the studio reports no K until a mean average boiling point is typed in beside the blend's curve.",
  "As the strict basis, since the interpolated T50 of a two crude blend is its mean average boiling point."],
 "The studio takes Tb as the blend's T50, and the page labels K as the screening figure. The digest records that choice as C13, taught here as a stated limit.")

q(0, "Which two Watson K figures sit on the default pair's row, at T50 interpolated and then at the grid reading?",
 "11.7452 and 12.0043.",
 ["12.0043 and 11.7452.",
  "11.8135 and 12.0447.",
  "11.7452 and 12.0447."],
 "The default pair's row reads SG 0.8727, Watson K at T50 interpolated 11.7452 and Watson K at the grid reading 12.0043. 11.8135 and 12.0447 are the Kwale blend's.")

q(3, "What does the Kwale valuation downstream of module 2 take from Watson K?",
 "Nothing: the cut yields come from the curve, and the netback from the yields, prices, loss and costs.",
 ["The product prices, which the engine scales by K before it sums the cut values, so that a more paraffinic blend nets back more per barrel of crude.",
  "The cut points, which the engine shifts up or down the blend's curve in proportion to K before it takes any cut yield off that curve.",
  "The loss percent, which the engine raises for a lower K on the grounds that an aromatic blend loses more."],
 "cutYields takes each cut as the curve at its upper bound minus the curve at its lower bound, and netback = sum(cut yield fraction x cut product price) x (1 - loss percent / 100) - processing cost - freight. Watson K appears in neither.")

q(1, "For the studio's default pair, 60 and 40, which of the four printed T50 readings is read off the blend's own curve?",
 "The 617.1429 F reading printed for the 60 and 40 pair.",
 ["The 690 F reading printed for the 60 and 40 pair.",
  "The 612.0000 F reading printed for the 60 and 40 pair.",
  "The 614.2222 F reading printed for the 60 and 40 pair."],
 "617.1429 F is the engine's interpolated T50. 690 F is the first curve point at or past 50 percent, and 612.0000 F and 614.2222 F are the volume-weighted and mass-weighted means of the crudes' T50.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/intermediate/cri_m02.json', label='cri_m02', expect_n=15)
finish()
