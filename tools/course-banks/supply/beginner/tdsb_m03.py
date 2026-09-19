import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Associate m03, Free Water and the Gross Volume. Digest section 5 and the water-cut refusals of section 4.

q(2, "dipToStandardVolume is given a dip and a water cut. Through what does it turn the water cut into a volume?",
 "The same strapping table that reads the dip.",
 ["A separate water table the terminal keeps for its tank bottoms.",
  "A fixed volume per millimetre of water, the same for every tank.",
  "The table read once at the dip less the water height."],
 "The water lies at the bottom of the same tank, so the same calibration turns its height into a volume. On AK-02 the 95 mm cut reads 19.101 m3 through that table.")

q(0, "AK-02 stays dipped at 5406 mm while its water cut is raised from 95 mm to 400 mm. Which figures move?",
 "Water goes from 19.101 m3 to 80.425 m3 and gross from 1067.840 m3 to 1006.516 m3, while the volume at the dip stays 1086.941 m3.",
 ["The volume at the dip goes from 1086.941 m3 to 1006.516 m3, while the water volume stays 19.101 m3.",
  "Only the gross moves, from 1067.840 m3 to 1006.516 m3, since the water volume is fixed by the tank.",
  "Nothing moves, since 400 mm of water is still below the dip of 5406 mm."],
 "The dip has not changed, so neither has the volume at the dip, 1086.941 m3. The water volume rises to 80.425 m3 and the gross falls to 1006.516 m3.")

q(3, "AK-02's water cut is set equal to its dip, 5406 mm. What does the engine answer?",
 "water 1086.941 m3, gross 0.000 m3",
 ["REFUSED: The water cut is above the product dip. Check both readings.",
  "water 0.000 m3, gross 1086.941 m3, the cut read as no water at all",
  "water 1086.941 m3 and gross none, since a tank of water holds no product"],
 "A water cut equal to the dip is possible: the tank holds water and no product, so the whole 1086.941 m3 is water and the gross is 0.000 m3.")

q(1, "A water cut of 5500 mm is typed against AK-02's dip of 5406 mm. Which answer comes back?",
 "REFUSED: The water cut is above the product dip. Check both readings.",
 ["water 1086.941 m3, gross 0.000 m3, the water trimmed down to the dip",
  "REFUSED: A water cut cannot be negative.",
  "water 1105.841 m3, read at the 5500 mm entry, and gross none"],
 "A water cut above the product dip is refused, and the sentence asks for both readings to be checked. A cut equal to the dip, 5406 mm, is not refused: it reads water 1086.941 m3 and gross 0.000 m3.")

q(2, "A gauger types -3 mm for the water on the diesel tank. How does the engine answer?",
 "Refused as a negative water cut",
 ["Clamped to 0 mm: water 0.000 m3, gross 1086.941 m3",
  "Refused as a negative dip",
  "Refused as no dip reading"],
 "The engine refuses with its own sentence for the water: A water cut cannot be negative. It never clamps the cut to 0 mm, which is a real reading that returns water 0.000 m3 and gross 1086.941 m3. The negative-dip sentence belongs to the dip.")

q(0, "With AK-01's partial calibration in use, the product reads 640 mm and the water cut 150 mm. Which answer comes back from dipToStandardVolume?",
 "REFUSED: The water cut cannot be converted: The dip is below the first strapping entry. The table does not cover this height; extend it down to the tank floor.",
 ["REFUSED: The water cut is above the product dip. Check both readings.",
  "REFUSED: A water cut cannot be negative.",
  "gross 243.285 m3, the water left out because the table cannot read it"],
 "The dip of 640 mm is inside the table, but 150 mm lies below its first entry, so the water volume cannot be read and there is no gross. The refusal carries the table's own sentence.")

q(3, "Which water volume comes off AK-03's volume at the dip for its 41 mm cut?",
 "0.341 m3",
 ["0.220 m3",
  "0.120 m3",
  "51.126 m3"],
 "The 41 mm cut goes through AK-03's own 100 mm table and reads 0.341 m3, which leaves gross 52.161 m3. 0.220 m3 is the same height on the 10 mm table, 0.120 m3 the difference between the two tables there, and 51.126 m3 the shortcut read at 1806 mm.")

q(1, "The 150 mm water cut on AK-01's partial calibration is refused because it lies below the table's first entry. Which is that first entry?",
 "300 mm at 114.040 m3",
 ["0 mm at 0.000 m3, the empty tank",
  "250 mm at 95.033 m3",
  "125 mm at 47.517 m3"],
 "The partial table starts at 300 mm, where the volume is 114.040 m3 and not the empty tank, and ends at 800 mm. 0 mm, 125 mm and 250 mm are heights on AK-01's full table.")

q(2, "On AK-03, dipped at 1847 mm with 41 mm of water, a shortcut subtracts the heights first and reads the table once at 1806 mm. What does it give against the engine's gross?",
 "51.126 m3 against the gross 52.161 m3",
 ["52.161 m3 against the gross 51.126 m3",
  "52.501 m3 against the gross 52.161 m3",
  "51.126 m3 against the gross 52.508 m3"],
 "The engine reads each height through the table where it was measured. The shortcut reads 51.126 m3 because the water fills the narrow bottom of a curved tank.")

q(0, "On AK-01, the shortcut reads 3461.488 m3 at 9106 mm against the engine's gross of 3461.489 m3. What about AK-01 puts the two readings there?",
 "It is a vertical cylinder, holding the same volume in every millimetre of height.",
 ["Its 250 mm step is fine enough that no reading between entries departs from the tank.",
  "Its water cut of 212 mm is small enough for the shortcut to be the engine's own method.",
  "The engine switches to the shortcut on vertical tanks and keeps it off the bullet."],
 "On a vertical tank a slice of height holds the same volume wherever it is taken, so the two readings land at 3461.488 m3 and 3461.489 m3. The engine never takes the shortcut on any tank.")

q(3, "Which of AK-01's morning figures is the petrol stock at observed temperature?",
 "3461.489 m3",
 ["3542.077 m3", "3461.488 m3", "80.588 m3"],
 "3542.077 m3 is the volume at the dip, which still includes the water. 80.588 m3 is the water. 3461.488 m3 is the shortcut reading the engine never uses.")

q(1, "AK-03's row prints volume at the dip 52.501 m3, water 0.341 m3 and gross observed 52.161 m3. Which gross should a report quote?",
 "52.161 m3, the printed gross, which the engine forms from the unrounded volumes",
 ["The printed dip volume less the printed water, worked out from the rounded columns of the row",
  "51.126 m3, the table read once at the dip less the water height",
  "52.501 m3, since 41 mm of water sits below the bullet's first step"],
 "The engine computes each gross from the unrounded volumes, so a printed pair can differ from the printed gross in the third decimal. Quote the printed 52.161 m3.")

q(0, "The three AKODO tanks total 4581.490 m3 gross observed. What does the word gross say about that total?",
 "Free water has come off and nothing else has: the volume still stands at its observed temperature.",
 ["The total is at standard, the stock the AKODO day is closed on.",
  "The water is still in it, and gross marks it as the total at the dip.",
  "The heel below each outlet has come off, leaving only pumpable product."],
 "Gross means free water off. Observed means at this morning's temperatures, so 4581.490 m3 mixes three temperatures and three products and is not yet a stock to close a day on.")

q(2, "AK-02's water cut, dipped at 5406 mm, is typed as 0 mm. How is that treated?",
 "Takes it as a real reading and removes nothing, so the gross is 1086.941 m3.",
 ["Refuses it, since 0 mm of water is read the same way as a blank box with no reading in it.",
  "Assumes the tank's usual water of 95 mm, since a tank that is truly dry is unlikely.",
  "Reports the gross as none until a water cut above 0 mm is given."],
 "A stated cut of 0 mm is a real reading, and it removes nothing. The swept table reads water 0.000 m3, gross 1086.941 m3 for it.")

q(1, "On the partial table with the dip at 640 mm, which water cut is refused with the sentence about water above the product dip?",
 "700 mm",
 ["150 mm", "-10 mm", "0 mm"],
 "700 mm stands above the 640 mm dip. 150 mm is refused because the table cannot convert it, -10 mm because a cut cannot be negative, and 0 mm returns gross 243.285 m3.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_m03.json', expect_n=15)
finish()
