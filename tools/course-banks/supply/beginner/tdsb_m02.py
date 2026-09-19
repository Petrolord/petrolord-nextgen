import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Associate m02, The Strapping Table. Digest sections 3 and 4.

q(1, "AK-01 is dipped at 9318 mm. Between which two entries of its 250 mm table does volumeAtDip draw its line?",
 "9250 mm at 3516.228 m3 and 9500 mm at 3611.261 m3",
 ["9500 mm at 3611.261 m3 and 14750 mm at 5606.957 m3",
  "0 mm at 0.000 m3 and 9500 mm at 3611.261 m3",
  "250 mm at 95.033 m3 and 9500 mm at 3611.261 m3"],
 "The entry just below and the entry just above bracket the dip, and the straight line joining them reads 3542.077 m3 at 9318 mm.")

q(3, "What does volumeAtDip do with a dip that falls between two entries of a strapping table?",
 "It draws a straight line between the entry below and the entry above, and reads the volume off that line at the dip.",
 ["It returns the volume of the nearer entry, so a dip reads the tabled height closest to it.",
  "It rebuilds the tank's shape from its diameter and computes the volume at the dip.",
  "It returns the volume of the entry below, so a stock never counts product the table has not listed."],
 "Linear interpolation is the whole of what volumeAtDip does between entries: two entries and one dip are the whole input, as when 9318 mm reads 3542.077 m3 on AK-01.")

q(0, "AK-01's 250 mm table and the same tank strapped every 10 mm both read 3542.077 m3 at the 9318 mm dip. Why do they agree to the litre?",
 "AK-01 is a vertical cylinder, which is linear in height, so the straight line between two entries is exact.",
 ["The engine refines a coarse table to a 10 mm step before it interpolates.",
  "The dip of 9318 mm lands on an entry of both tables, so neither interpolates.",
  "Both volumes are rounded to the litre, which hides what a coarse step costs."],
 "Every millimetre of a vertical cylinder adds the same slice, so a coarser step costs nothing at the dip: 3542.077 m3 and 3542.077 m3.")

q(2, "At 41 mm on AK-03 the 100 mm table reads 0.341 m3 and the 10 mm table 0.220 m3. Which figure does the digest print for the 100 mm table less the 10 mm table?",
 "0.120 m3",
 ["-0.007 m3, the difference at that tank's morning dip",
  "0.341 m3, since the finer table reads no water",
  "0.220 m3, the reading on the finer of the two tables"],
 "The last column is computed from the unrounded volumes, so the printed 0.120 m3 is the figure to quote. It is never recomputed from the rounded columns.")

q(1, "At AK-03's morning dip of 1847 mm, which of its two tables reads the higher volume?",
 "The 10 mm table, 52.508 m3 against 52.501 m3",
 ["The 100 mm table, 52.501 m3 against 52.508 m3",
  "Neither, since the two agree to the litre as AK-01's tables do at 9318 mm",
  "The 100 mm table, by the 0.120 m3 printed for that bullet"],
 "The 100 mm table less the 10 mm table is -0.007 m3 at 1847 mm, so the finer table reads the higher volume there. The 0.120 m3 belongs to the 41 mm height.")

q(3, "AK-01 is dipped at 14800 mm, above its last entry of 14750 mm. What does the engine answer?",
 "REFUSED: The dip is above the last strapping entry. The table does not cover this height, and extrapolating one invents capacity the tank does not have.",
 ["REFUSED: The dip is below the first strapping entry. The table does not cover this height; extend it down to the tank floor.",
  "5606.957 m3, the dip held at the last entry with a warning beside it",
  "REFUSED: No dip reading."],
 "At 14750 mm the dip lands on the last entry and reads 5606.957 m3. Above it there is one point and nothing to interpolate to, so the engine refuses.")

q(2, "Why will volumeAtDip not carry the slope of the last step upward to read a dip above the last entry?",
 "A line carried past the last entry would invent capacity the tank does not have.",
 ["Above the last entry the engine needs the tank's diameter, which a strapping table does not carry.",
  "A dip above the last entry is always a typing error, so the engine treats it as no reading at all.",
  "The engine keeps extrapolation for horizontal tanks, whose curve it can follow past the last entry."],
 "The refusal gives the reason in its own words: the table does not cover this height, and extrapolating one invents capacity the tank does not have. AK-02 at 12010 mm and AK-03 at 3010 mm, the bullet, are refused with the same sentence.")

q(0, "A partial calibration of AK-01 starts at 300 mm with 114.040 m3. A dip of 180 mm is put to it. What does the engine answer?",
 "REFUSED: The dip is below the first strapping entry. The table does not cover this height; extend it down to the tank floor.",
 ["gross 114.040 m3, the dip read at the first entry",
  "REFUSED: A dip cannot be negative.",
  "REFUSED: The dip is above the last strapping entry. The table does not cover this height, and extrapolating one invents capacity the tank does not have."],
 "The table states nothing below 300 mm, so there is no second point to draw a line to. The refusal sends the user back to the calibration.")

q(1, "On that partial table, why does the engine not draw a line from an empty tank at 0 mm up to the first entry?",
 "The table does not cover that height, and the refusal asks for it to be extended down to the tank floor.",
 ["It does draw that line whenever the first entry sits below 800 mm, which is where this table ends.",
  "It reads any dip below the first entry as a negative dip, and refuses it with that sentence.",
  "The line would need the product's density, and a strapping table holds heights and volumes only."],
 "The partial table starts at 300 mm, where the volume is 114.040 m3 and not the empty tank. A dip of 180 mm gets the refusal for a dip below the first strapping entry, which ends by asking for the table to be extended down to the tank floor. A negative dip gets a different sentence.")

q(3, "Two dips are refused: 180 mm on the partial table and -5 mm on AK-01's full table. What cures each?",
 "More calibration for the 180 mm dip, and a fresh reading for the -5 mm dip.",
 ["A fresh reading for the 180 mm dip, and more calibration for the -5 mm dip.",
  "A fresh reading for both, since each dip lies below the table and must be taken again.",
  "More calibration for both, extending each table down past the height that was refused."],
 "180 mm is a real height the calibration does not cover. -5 mm is a height that cannot exist. Both stop the chain at its first link.")

q(2, "AK-01's partial calibration runs from 300 mm to 800 mm. Put to it through dipToStandardVolume with no water, what does a dip of 640 mm return?",
 "gross 243.285 m3",
 ["gross 114.040 m3",
  "Refused",
  "gross 3542.077 m3"],
 "640 mm lies inside the partial table and reads gross 243.285 m3 with no water. 300 mm, its first entry, reads 114.040 m3, and a dip of 180 mm below it is refused. 3542.077 m3 is AK-01's morning dip of 9318 mm on the full table.")

q(0, "AK-03's strapping table has 31 entries every 100 mm. Which are its first and its last entries?",
 "From 0.000 m3 at 0 mm to 81.289 m3 at 3000 mm",
 ["From 0.000 m3 at 0 mm to 2412.743 m3 at 12000 mm",
  "From 50.925 m3 at 1800 mm to 54.279 m3 at 1900 mm",
  "From 0.000 m3 at 0 mm to 52.501 m3 at 1847 mm"],
 "AK-03, the horizontal bullet 3 m across and 11.5 m long, is strapped from 0 mm = 0.000 m3 to 3000 mm = 81.289 m3. 12000 mm is AK-02's last entry; 1800 mm and 1900 mm are the entries that bracket AK-03's morning dip of 1847 mm, which is no entry.")

q(1, "Which step and which count of entries belong to AK-02's strapping table?",
 "250 mm, 49 entries",
 ["250 mm, 60 entries",
  "100 mm, 31 entries",
  "10 mm, 301 entries"],
 "AK-02, the vertical AGO tank 16 m across, is strapped every 250 mm to 12000 mm in 49 entries. 60 entries is AK-01's table, 31 entries AK-03's, and 301 entries the bullet strapped every 10 mm.")

q(3, "Swept up AK-01's own table, which of these heights does the engine interpolate?",
 "125 mm",
 ["250 mm", "9500 mm", "0 mm"],
 "0 mm, 250 mm and 9500 mm are entries of the 250 mm table and return their own volumes. 125 mm sits between entries and reads 47.517 m3 by interpolation.")

q(2, "Which volume does volumeAtDip return for AK-01 dipped exactly on the highest height its table lists?",
 "5606.957 m3",
 ["3611.261 m3",
  "A refusal above the last entry",
  "2412.743 m3"],
 "A dip on the last entry reads that entry's own volume, 5606.957 m3. Only a dip above it, such as 14800 mm, is refused. 3611.261 m3 is the 9500 mm entry, and 2412.743 m3 is AK-02's last entry.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_m02.json', expect_n=15)
finish()
