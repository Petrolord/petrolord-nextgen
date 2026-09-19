import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Associate m06, The Associate Reading. Digest sections 3 to 8 read as one terminal and one day.

q(1, "Reading AK-01 end to end, what input stands behind its water figure of 80.588 m3?",
 "AK-01's own table, read at the 212 mm tape reading",
 ["The typed VCF of 0.980300, applied to the water",
  "The dip of 9318 mm less the gross of 3461.489 m3",
  "A fixed share of the volume at the dip of 3542.077 m3"],
 "The water cut is a second tape reading, 212 mm, turned into 80.588 m3 through the same strapping table that reads the 9318 mm dip.")

q(3, "The same AKODO day is closed on the gross closing stock of 4581.490 m3 against an opening stock held at standard. What does the engine read?",
 "unaccounted 73.390 m3, direction gain, within tolerance false",
 ["unaccounted -8.648 m3, direction loss, within tolerance true",
  "unaccounted 0.000 m3, balanced, within tolerance true",
  "REFUSED, since a gross closing stock cannot be put to reconcileStock"],
 "The closing stock is gross observed at three observed temperatures and the opening is held at standard. On that basis the day reads unaccounted 73.390 m3, direction gain, within tolerance false.")

q(0, "Between the standard closing and the gross closing of the AKODO day, what is the one input that differs?",
 "The closing stock: 4499.452 m3 at standard against 4581.490 m3 gross observed.",
 ["The opening stock: 4953.700 m3 on one closing and 4945.052 m3 on the other.",
  "The tolerance: 0.2 percent on one closing and 0.1 percent on the other.",
  "The receipts: 2870.000 m3 on one closing and none on the other."],
 "Only the closing stock moves. The standard closing matches the opening stock's basis and reads a loss within tolerance; the gross closing reads a gain produced by mixing units.")

q(2, "Reading AK-03 backwards from its standard volume of 51.556 m3, how should its gross of 52.161 m3 be treated?",
 "Quoted as printed, since the engine forms it from the unrounded volumes at 1847 mm and 41 mm.",
 ["Rebuilt from the rounded 52.501 m3 and 0.341 m3 before it is multiplied by the VCF of 0.988400.",
  "Replaced by the shortcut reading of 51.126 m3, since the bullet's curve makes the gross unreliable.",
  "Replaced by the 10 mm table's reading of 52.508 m3."],
 "52.161 m3 is quoted as printed and is not rebuilt from the rounded columns. Multiplied by the typed 0.988400 it gives 51.556 m3 at standard.")

q(2, "At the end of the tank chain, a call returns gross 3461.489 m3 and standard none. Which link was left unsupplied?",
 "The VCF",
 ["The water cut", "The strapping table", "The opening stock"],
 "A missing table or an unconvertible water cut refuses the whole call, and the opening stock belongs to the day. A missing VCF lets the gross print and names the standard volume none.")

q(3, "On AK-01's partial table the dip reads 640 mm and the water 700 mm. How far down the chain does anything get formed?",
 "Nothing is formed: the call is refused and no gross, standard volume or gap follows.",
 ["The gross of 243.285 m3 is formed and only the standard volume is named none.",
  "The volume at the dip is formed and the water is left out with a note beside it.",
  "The chain runs to the day, which then reads the gap outside tolerance."],
 "REFUSED: The water cut is above the product dip. Check both readings. A refused link stops the chain there, so nothing downstream is formed from it.")

q(0, "At a tolerance of 0.1 percent the AKODO band is 6.183 m3. What does the day then read?",
 "The same -8.648 m3, now outside the band: within tolerance false.",
 ["A smaller gap of 6.183 m3, since the band caps what can be reported.",
  "The same -8.648 m3, still within the band, since a loss is judged on one side.",
  "A refusal, since a band under the gap cannot close the day."],
 "The unaccounted figure stays -8.648 m3. At 0.1 percent the band is 6.183 m3 and the day is outside it; at 0.2 percent it is 12.365 m3 and the day is within.")

q(1, "The nine-day record is kept to 7 days. What do the run and the prompt read?",
 "A run of 4, with the prompt",
 ["A run of 4, with no prompt",
  "A run of 7, with the prompt",
  "A run of 3, with no prompt"],
 "Kept to 5 or 6 days the run is 2 or 3 days of loss and the prompt is none; kept to 7, 8 or 9 days the run is 4, 5 or 6 days and the prompt prints.")

q(1, "Two candidate openings exist for one day: yesterday's dip at 4953.700 m3, or 4945.052 m3 worked back from today's dip. What rule follows?",
 "The opening stock is an input taken from before the day began, yesterday's closing dip.",
 ["The opening stock may be taken from either source, provided the day closes inside its band.",
  "The derived opening is to be preferred, since it is built from the day's own measured figures.",
  "The two openings are averaged and the day closed on the mean."],
 "The derived opening balances every day, 0.000 m3, so it measures nothing. The real opening reads -8.648 m3, a loss within 12.365 m3, because it could have come out wrong.")

q(0, "Which figure on the AKODO sheet is a tape height and no volume at all?",
 "9318 mm",
 ["3542.077 m3", "80.588 m3", "4499.452 m3"],
 "9318 mm is AK-01's dip. 3542.077 m3 and 80.588 m3 are read through its table, and 4499.452 m3 is the standard total the day closes on.")

q(2, "What does the Professional tier add that the Associate tier never touched?",
 "Time spent waiting, money and carbon, at the inland depot IBAFO",
 ["The coefficient table this tier refused, shipped at last for AKODO",
  "A second AKODO day, reconciled against the first",
  "The BADAGRY cargo's price at the pump"],
 "The Professional tier moves to IBAFO and models its rack as a queue, its tank farm, its throughput economics and its lane. BADAGRY belongs to the Expert tier.")

q(3, "Which rule from this tier does the next tier carry over unchanged?",
 "A missing value stays missing.",
 ["A VCF is always typed off the terminal's own tables.",
  "A tolerance is always 0.2 percent of throughput.",
  "A strapping table is always read at 250 mm steps."],
 "The table of missing inputs covers both apps, and the next tier's calls answer the same way: bays that are not a whole number, a missing distance or payload, and a missing demand are refused, never guessed.")

q(1, "Link two of the chain on AK-02: the dip of 5406 mm lies between 5250 mm at 1055.575 m3 and 5500 mm at 1105.841 m3. What is the input the engine cannot do without here?",
 "AK-02's own strapping table",
 ["AK-02's typed VCF of 0.987600",
  "AK-02's density of 846.3 kg/m3",
  "AK-02's water cut of 95 mm"],
 "The table's two entries and the dip are the whole input to volumeAtDip, which reads 1086.941 m3. With no table the engine refuses.")

q(3, "Across the whole AKODO reading, which reading of the table does the engine never take?",
 "One reading at the dip less the water height",
 ["One reading at the dip, and another at the water cut",
  "One reading between two entries, drawn as a straight line",
  "One reading at an entry, when a dip lands exactly on it"],
 "On AK-03 the shortcut at the dip less the water reads 51.126 m3 against the gross 52.161 m3. The engine reads each height where it was measured.")

q(0, "Which list runs AK-01's figures in the order the chain forms them: the dip, the volume at the dip, the gross observed volume, the standard volume?",
 "9318 mm, 3542.077 m3, 3461.489 m3, 3393.298 m3",
 ["9318 mm, 3461.489 m3, 3542.077 m3, 3393.298 m3",
  "9318 mm, 3542.077 m3, 3393.298 m3, 3461.489 m3",
  "9318 mm, 3542.077 m3, 3461.488 m3, 3393.298 m3"],
 "The chain reads the table at the dip, takes the water off to reach the gross observed volume, and then applies the typed VCF for the standard volume. Swapping the gross and the volume at the dip, or the gross and the standard, breaks that order, and 3461.488 m3 is the shortcut reading the engine never takes.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_m06.json', expect_n=15)
finish()
