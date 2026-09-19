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

q(1, "AK-02 is dipped at 5406 mm with a water cut of 5500 mm. Why does the engine refuse instead of trimming the water down to the dip?",
 "It cannot tell which reading is wrong, and trimming would pick the dip as correct with no reason to.",
 ["It trims the water only on horizontal tanks, where the narrowing shell makes the top of the water uncertain.",
  "A water cut above the dip reads above the table, so the table refuses it before the dip is ever read.",
  "Trimming would make the gross 0.000 m3, and the engine never reports a tank holding no product."],
 "A water layer standing higher than the liquid surface cannot happen, so one of the two readings is wrong. The refusal asks for both to be checked.")

q(2, "A gauger types a negative water height, -3 mm, for the diesel tank. Why is it refused and never clamped up to zero?",
 "A water cut of 0 mm is a real reading that says the paste found no water, and -3 mm is a typing or reference error.",
 ["A negative cut means water below the datum, which the table cannot convert unless the terminal extends its calibration down past 0 mm.",
  "The engine reads -3 mm as 3 mm and refuses only when that falls between two entries of the table.",
  "Any cut below the first water entry of 95 mm is refused on AK-02, since the table starts there."],
 "REFUSED: A water cut cannot be negative. A clamp to 0 mm would turn an error into a claim that the tank is dry.")

q(0, "With AK-01's partial calibration in use, the product reads 640 mm and the water paste 150 mm. Which answer comes back from dipToStandardVolume?",
 "REFUSED: The water cut cannot be converted: The dip is below the first strapping entry. The table does not cover this height; extend it down to the tank floor.",
 ["REFUSED: The water cut is above the product dip. Check both readings.",
  "REFUSED: A water cut cannot be negative.",
  "gross 243.285 m3, the water left out because the table cannot read it"],
 "The dip of 640 mm is inside the table, but 150 mm lies below its first entry, so the water volume cannot be read and there is no gross. The refusal carries the table's own sentence.")

q(3, "When the water cut cannot be converted, why does the engine refuse the whole call instead of reporting the volume at the dip?",
 "That volume would count the water as product and look like a normal gross.",
 ["The volume at the dip is formed after the water, so it does not exist yet when the water fails.",
  "The engine reports the volume at the dip only when the dip lands exactly on an entry of the table.",
  "A refused water cut also invalidates the dip, since both readings come from a single tape."],
 "A gross observed volume has had its water taken off, or it is not reported. The 640 mm dip reads gross 243.285 m3 only with its 0 mm water.")

q(1, "Why is the 150 mm row on the partial table the one the lesson says to remember?",
 "Water lives at the bottom of the tank, the part a partial calibration leaves out, so a table can read every dip and still fail on the water.",
 ["It is the one row where the engine reports a gross with the water left out and labelled as missing.",
  "It shows that a water cut is always converted through a separate table from the dip.",
  "It is the one height where the partial and full tables give different answers for the same water."],
 "The partial table starts at 300 mm with 114.040 m3. Every dip AKODO takes may land inside it while the water, at the floor, lands below it.")

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

q(2, "The paste on AK-02's tape shows no water, so the cut is typed as 0 mm. How is that treated?",
 "Takes it as a real reading and removes nothing, so the gross is 1086.941 m3.",
 ["Refuses it, since 0 mm of water is read the same way as a blank box with no reading in it.",
  "Assumes the tank's usual water of 95 mm, since a tank that is truly dry is unlikely.",
  "Reports the gross as none until a water cut above 0 mm is given."],
 "A stated cut of 0 mm means the paste found no water. The swept table reads water 0.000 m3, gross 1086.941 m3 for it.")

q(1, "On the partial table with the dip at 640 mm, which water cut is refused with the sentence about water above the product dip?",
 "700 mm",
 ["150 mm", "-10 mm", "0 mm"],
 "700 mm stands above the 640 mm dip. 150 mm is refused because the table cannot convert it, -10 mm because a cut cannot be negative, and 0 mm returns gross 243.285 m3.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_m03.json', expect_n=15)
finish()
