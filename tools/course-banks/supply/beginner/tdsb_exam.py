import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Associate tier exam. Draws on all six Associate modules (digest
# sections 1 to 8). Every rate or coefficient named is the course's invented
# figure: the 0.2 percent tolerance, AKODO's typed VCFs and the SYNTHETIC row.

q(1, "A tank with no calibration at all is put to volumeAtDip with a good dip. Which sentence comes back?",
 "REFUSED: No strapping table for this tank.",
 ["REFUSED: No dip reading.",
  "REFUSED: A dip cannot be negative.",
  "REFUSED: The dip is below the first strapping entry. The table does not cover this height; extend it down to the tank floor."],
 "A strapping table is the only link between a height and a volume for one tank. With none, there is nothing to interpolate between, so any volume would be invented.")

q(0, "AK-02's strapping table ends at 12000 mm with 2412.743 m3. Over which heights can volumeAtDip read a dip on AK-02?",
 "From 0 mm up to 12000 mm; a dip at 12010 mm is refused.",
 ["From 0 mm upward, with heights past 12000 mm carried on the slope of the last step.",
  "Only at the entries themselves, one every 250 mm, since a dip must land on one.",
  "From 250 mm up to 12000 mm, since a dip of 0 mm counts as no reading."],
 "AK-02's table starts at the empty tank and stops at 12000 mm. Between the two it interpolates; the digest's dip at 12010 mm gets the refusal for a dip above the last strapping entry.")

q(2, "On the partial table with the dip held at 640 mm, the water cut is raised from 0 mm to 150 mm. What happens to the answer?",
 "gross 243.285 m3 gives way to a refusal, because 150 mm lies below the table's first entry at 300 mm.",
 ["gross 243.285 m3 falls to 114.040 m3, the volume at the table's first entry, as the water is taken off.",
  "gross 243.285 m3 is kept and the water is reported as none, since the dip is inside the table.",
  "gross 243.285 m3 gives way to the refusal for water above the product dip."],
 "The water cut goes through the same table as the dip. At 150 mm that table has no entry beneath it, so the water volume cannot be read and the call is refused.")

q(3, "On AK-02, which step turns 1067.840 m3 into 1054.599 m3?",
 "Multiplying by the typed VCF of 0.987600",
 ["Taking off the 19.101 m3 of free water",
  "Interpolating between 5250 mm and 5500 mm",
  "Booking the day's known losses of 3.100 m3"],
 "1067.840 m3 is AK-02's gross observed volume, with the water already off. The typed VCF, read off AKODO's own invented tables, brings it to 1054.599 m3 at standard.")

q(3, "What basis must the opening stock and the dipped closing share for reconcileStock's gap to mean anything?",
 "Both the opening stock and the dipped closing are in m3 at standard.",
 ["Both are gross observed, since that is the volume the tanks really held.",
  "The opening is at standard and the closing gross observed, as each was dipped.",
  "Either basis will do, provided the tolerance percent is raised to cover the gap."],
 "Closed on the gross 4581.490 m3 against an opening at standard, the day reads unaccounted 73.390 m3, a gain outside tolerance, with nothing in the tanks changed.")

q(1, "Which of these calls prints one figure and gives another as none?",
 "reconcileStock with no closing dip",
 ["volumeAtDip with no dip",
  "volumeCorrectionFactor with no coefficients",
  "reconcileStock with no opening stock"],
 "With no closing dip the expected closing, 4508.100 m3, still prints and the unaccounted figure reads none. The other three calls refuse outright.")

q(0, "The digest straps two AKODO tanks a second time at 10 mm. On which of them does the step change the reading at the dip?",
 "AK-03, the bullet",
 ["AK-01, the vertical tank",
  "Both of them, by the same amount",
  "Neither of them, to the litre"],
 "AK-01's 250 mm and 10 mm tables both read 3542.077 m3. On AK-03 the 100 mm table less the 10 mm table is -0.007 m3 at the 1847 mm dip.")

q(1, "The total gross observed volume of 4581.490 m3 is summed over tanks standing at which temperatures?",
 "31.5 C, 30 C and 29 C",
 ["15 C for all three tanks",
  "10 C, 15 C and 20 C",
  "35 C, 40 C and 31.5 C"],
 "Gross observed volumes stand at the temperatures they were dipped at. That is why 4581.490 m3 is not a stock to close a day on, and 4499.452 m3 at 15 C is.")

q(1, "In the printed tolerance sweep, what is the smallest percent at which the AKODO day reads within tolerance?",
 "0.2 percent, a band of 12.365 m3",
 ["0.1 percent, a band of 6.183 m3",
  "0.05 percent, a band of 3.091 m3",
  "0.3 percent, a band of 18.547 m3"],
 "The gap is -8.648 m3 in every row. At 0.05 and 0.1 percent the day reads outside the band; the row at 0.2 percent is the first printed as true.")

q(3, "Two percents of throughput appear in this tier: -0.1399 and -0.0494. What is the denominator of each?",
 "6182.500 m3 for the day's -0.1399, and 55085.000 m3 for the nine days' -0.0494",
 ["55085.000 m3 for the day's -0.1399, and 6182.500 m3 for the nine days' -0.0494",
  "4953.700 m3, the opening stock, for both figures",
  "6310.000 m3, the latest day's throughput, for both figures"],
 "The day's percent is its gap on its own throughput. The trend's percent is the cumulative gap, -27.200 m3, on the cumulative throughput, printed as 55085.000 m3.")

q(3, "On which day does the cumulative unaccounted column first go below zero?",
 "day 5",
 ["day 2",
  "day 4",
  "day 9"],
 "The running total reads 4.200, 0.600, 2.500 and 0.100 m3 over days 1 to 4, sits below zero from day 5 onward and reaches -27.200 m3 at day 9.")

q(2, "RATE_DISCLAIMER gives the engine's reason for shipping no rate. What does it say about duties, levies and regulated margins?",
 "They are set by regulation, differ by market and change.",
 ["They are published once a year, so the engine ships the latest.",
  "They are fixed by the course, so the user types none of them.",
  "They are typical figures, labelled as a starting point."],
 "The disclaimer reads: Line items only. Every rate is a required input, to be confirmed against the regulation in force. Every rate in this course is invented for it.")

q(0, "How many rates do the two fuelPricing templates ship?",
 "None: 9 of 9 import line items and 7 of 7 pump line items are absent.",
 ["9 import rates and 7 pump rates, each marked for confirmation.",
  "7 pump rates only, since the import side depends on the cargo.",
  "One rate per basis in CHARGE_BASIS, and none for the pump."],
 "IMPORT_TEMPLATE carries 9 line items and PUMP_TEMPLATE 7, and the rate shipped column reads none on every row. The templates name charges and bases only.")

q(0, "fuelPricing.M3_PER_BBL reads 0.158987294928. What kind of figure is it?",
 "The size of a barrel in m3, fixed by definition",
 ["A conversion invented for this course like its rates",
  "A typical ratio for petrol, labelled a starting point",
  "A rate the user must confirm against the regulation"],
 "LITRES_PER_M3 at 1000 and M3_PER_BBL are the two constants true everywhere and forever. Nothing about them depends on a market or a date.")

q(1, "AK-01 is dipped at 125 mm and reads 47.517 m3. Which two entries bracket that dip?",
 "0 mm at 0.000 m3 and 250 mm at 95.033 m3",
 ["125 mm at 47.517 m3, an entry of its own",
  "250 mm at 95.033 m3 and 9250 mm at 3516.228 m3",
  "0 mm at 0.000 m3 and 300 mm at 114.040 m3"],
 "AK-01's table steps every 250 mm from the empty tank, so 125 mm lies between its first two entries. The 300 mm entry belongs to the partial calibration.")

q(3, "A terminal extends its partial calibration down to the tank floor. Which refused rows does that cure?",
 "The 180 mm dip and the 150 mm water cut",
 ["The 700 mm water cut and the -10 mm water cut",
  "The 14800 mm dip and the 180 mm dip",
  "The -5 mm dip and the 150 mm water cut"],
 "Both 180 mm and 150 mm lie below the first entry at 300 mm. Water above the dip, a negative reading and a dip above the last entry need a fresh reading or a check.")

q(1, "Someone reading the bullet's table only once, at the product height less the water height, would look up which height?",
 "1806 mm",
 ["1800 mm", "1847 mm", "41 mm"],
 "Subtracting heights first gives 1806 mm, which reads 51.126 m3. The engine reads 1847 mm and 41 mm separately and returns the gross 52.161 m3.")

q(2, "Across the synthetic temperature sweep at 741.6 kg/m3, at which temperature does the VCF sit furthest below one?",
 "40 C, at 0.965932",
 ["10 C, at 1.006736",
  "31.5 C, at 0.977583",
  "15 C, at 1.000000"],
 "The warmer the product the further below one the synthetic VCF reads, down to 0.965932 at the sweep's top temperature of 40 C. These coefficients are invented and correct no stock.")

q(3, "In the two lines of the correction form, where does the density at 15 C enter?",
 "In the first line, alpha = K0 / rho^2 + K1 / rho + K2.",
 ["In the second line, through dT.",
  "In both lines equally, as a multiplier on the whole exponent.",
  "Nowhere, since the density only selects the commodity group."],
 "Temperature enters the second line alone and density the first alone. That is why alpha reads 0.001350036 across the temperature sweep and moves across the density sweep.")

q(3, "Inside the exponent of the VCF there is a bracket carrying the number 0.8. What role does that bracket play?",
 "A second order term",
 ["The density correction",
  "The water cut adjustment",
  "A rate chosen by the course"],
 "alpha x dT is roughly the fraction by which the volume has swollen, and the exponential turns it into a shrinking factor. The bracket with 0.8 refines that as a second order term.")

q(1, "AKODO's typed VCFs are 0.980300, 0.987600 and 0.988400. What do all three share, and why?",
 "Each is below one, because each tank was dipped above 15 C.",
 ["Each is above one, because each product is denser than water.",
  "Each is the synthetic row's figure at that tank's temperature.",
  "Each equals one less the tank's water share at its morning dip."],
 "Above the reference the correction takes the swelling back out. The three were typed off AKODO's own tables, which are invented for the course.")

q(2, "A still day reads unaccounted 0.500 m3. Which direction does the engine print?",
 "gain",
 ["loss", "balanced", "none"],
 "unaccounted = dipped closing - expected closing, so a positive figure is a gain. With no throughput the tolerance is 0.000 m3 and the day reads within tolerance false.")

q(2, "Where do AKODO's known losses of 3.100 m3 enter the day?",
 "They are taken off in forming the expected closing.",
 ["They are added to receipts and deliveries to form the throughput.",
  "They are taken off the dipped closing before the gap is read.",
  "They widen the tolerance band on the day by their own amount."],
 "expected closing = opening + receipts - deliveries - known losses. Throughput is receipts plus deliveries alone, 6182.500 m3.")

q(1, "In the demonstration that cannot fail, a closing dip of 4600.000 m3 is used. What expected closing does the ledger give?",
 "4600.000 m3",
 ["5045.600 m3", "4508.100 m3", "4499.452 m3"],
 "The opening taken from that dip is 5045.600 m3, and the ledger undoes the derivation exactly, so the expected closing is the dip itself and the gap is 0.000 m3.")

q(2, "Which refusal stops the AKODO chain at its very first link, before any table is consulted?",
 "REFUSED: A dip cannot be negative.",
 ["REFUSED: The water cut is above the product dip. Check both readings.",
  "REFUSED: No opening stock, so the day cannot be closed. The opening stock is yesterday's closing dip.",
  "REFUSED: Density at 15 C and observed temperature are both needed."],
 "A dip of -5 mm is a height that cannot exist, so the tape reading itself is rejected. The other sentences belong to the water, the day and the correction.")

q(0, "Which description matches AK-01's strapping table?",
 "60 entries every 250 mm, from 0 mm to 14750 mm",
 ["49 entries every 250 mm, from 0 mm to 12000 mm",
  "31 entries every 100 mm, from 0 mm to 3000 mm",
  "60 entries every 250 mm, from 300 mm to 800 mm"],
 "AK-01 is 22 m in diameter and strapped to 14750 mm, where it reads 5606.957 m3. The 49 entry table is AK-02's and the 31 entry table AK-03's.")

q(2, "Moving inland to IBAFO, which new inputs join the dip and the table on the list of things never guessed?",
 "A bay count, a heel, a distance and a payload",
 ["A dip, a water cut and a strapping table",
  "A published coefficient row and a duty",
  "An opening stock and a closing dip"],
 "The dip, the water cut, the table and both ends of the day belong to this tier. The next tier adds new inputs and treats each the same way.")

q(2, "In the trimmed record, what is the shortest run of loss the digest shows printing the prompt?",
 "4 days of loss",
 ["3 days of loss",
  "6 days of loss",
  "2 days of loss"],
 "The trimmed table is the only evidence: its row for 6 kept days shows 3 days of loss with no prompt, and its row for 7 kept days shows 4 days with the prompt.")

q(2, "When a cost or price build-up is called with rates left out, how does the price module answer?",
 "It labels the build-up incomplete and counts the missing rates.",
 ["It refuses the call until every rate in the template is typed.",
  "It fills each missing rate with zero and reports a finished total.",
  "It fills each missing rate from PRODUCT_REFERENCE's starting points."],
 "This is the third shape of answer, met in the Expert tier. A partial total is never read as a finished one.")

q(0, "What does the word standard mean on AKODO's closing stock of 4499.452 m3?",
 "Every part is stated as it would stand at 15 C.",
 ["Every part has had its free water taken off.",
  "Every part was dipped at the same hour.",
  "Every part was measured on a 10 mm table."],
 "The standard total 4499.452 m3 sums AK-01, AK-02 and AK-03 each corrected by its typed VCF to the 15 C reference, which is what lets it meet an opening stock on the same basis.")

q(0, "The gross observed volume and the standard volume each remove something from the volume at the dip. What does each remove?",
 "The gross removes free water; the standard volume then removes the effect of temperature.",
 ["The gross removes the effect of temperature; the standard volume then removes free water.",
  "The gross removes free water; the standard volume removes the day's known losses.",
  "Both remove free water, read once at the dip and once again at the reference."],
 "On AK-01, 3542.077 m3 at the dip less 80.588 m3 of water is 3461.489 m3 gross observed, and the typed 0.980300 brings that to 3393.298 m3 at standard.")

q(1, "Why must the tolerance percent be fixed before the day is closed?",
 "A percent tuned until the day passes is a softer form of the reconciliation that cannot fail.",
 ["The engine locks the percent once the dip is typed and refuses a change afterwards.",
  "The percent is a published figure that the terminal may not alter from day to day.",
  "A later percent would change the unaccounted figure, which is formed from the band."],
 "At 0.1 percent the AKODO day is outside a band of 6.183 m3 and at 0.2 percent inside 12.365 m3, with the gap at -8.648 m3 throughout. The verdict rests on the chosen percent.")

q(3, "How many functions and constants does fuelPricing export?",
 "9 functions and 8 constants",
 ["8 functions and 0 constants",
  "8 functions and 9 constants",
  "9 functions and 0 constants"],
 "terminalDepot exports 8 functions and 0 constants. fuelPricing's 8 constants include the two templates, the disclaimer and the two conversions.")

q(3, "AK-02 is dipped at 5406 mm with 400 mm of water. What gross observed volume does the engine return?",
 "1006.516 m3",
 ["1086.941 m3", "1067.840 m3", "80.425 m3"],
 "The water at 400 mm reads 80.425 m3 through AK-02's table and comes off the volume at the dip, 1086.941 m3, leaving a gross of 1006.516 m3.")

q(2, "Trace AK-01's standard volume of 3393.298 m3 back one link. Which two figures does it rest on?",
 "3461.489 m3 gross observed and a typed VCF of 0.980300",
 ["3542.077 m3 at the dip and a typed VCF of 0.980300",
  "3461.489 m3 and a VCF built from K0 = 520, K1 = 0.3 and K2 = 0",
  "4499.452 m3 in total and AK-01's share of the three tanks"],
 "standard volume = gross observed volume x VCF. The gross already has the water off, and the VCF is typed off AKODO's own tables; the synthetic row corrects no stock.")

q(0, "AK-01 is dipped at exactly 9500 mm. What does volumeAtDip return?",
 "3611.261 m3, the entry's own volume",
 ["3542.077 m3, interpolated from 9318 mm",
  "3516.228 m3, the entry below the dip",
  "A refusal, since a dip must fall between two entries"],
 "When a dip lands on an entry the engine returns that entry's volume. At 9318 mm it interpolates between 9250 mm and 9500 mm.")

q(3, "What direction does reconcileStock print for a day with throughput whose unaccounted figure is 0.000 m3?",
 "balanced",
 ["loss", "gain", "none"],
 "Each row of the derived demonstration reads unaccounted 0.000 m3, within tolerance true, direction balanced. A balanced day built that way measured nothing.")

q(0, "AK-02's water cut rises from one morning to the next. What could that mean at the terminal?",
 "A leaking roof, a failing seal or a wet receipt",
 ["A drifting meter on the tank's deliveries",
  "A strapping table cut at too coarse a step",
  "A VCF typed for the wrong temperature"],
 "Water arrives with a cargo, condenses from humid air as a tank breathes, and seeps past roof seals. The engine's job is narrower: take the water off, as with 19.101 m3 at 95 mm.")

q(0, "How are the density and the temperature that feed the correction form taken at an AKODO tank?",
 "The temperature by a thermometer at set levels, the density by a sample corrected to 15 C",
 ["Both from PRODUCT_REFERENCE, whose typical figures stand in for a sample",
  "The temperature from the tank's table, the density from the dip in millimetres",
  "Both from the certificate of quality of the cargo that last arrived in the tank"],
 "Both are measured inputs. A typical density is a starting point at most, and the certificate of quality is the authority on what arrived.")

q(2, "What makes a table's first and last entries the edges of any stock figure from that tank?",
 "The engine interpolates between them and refuses below the first and above the last.",
 ["The engine extrapolates beyond them but flags the result as uncertified.",
  "The first entry is always the empty tank and the last the full one.",
  "The terminal sets them to its safe working range for each product."],
 "A strapping table is trusted over the heights it covers and nowhere else. The partial table starting at 300 mm shows that a first entry need not be the empty tank.")

q(0, "PRODUCT_REFERENCE lists DPK at a typical 800 kg/m3, and AK-03's kerosene was measured at 796.8 kg/m3. Which figure goes into AK-03's VCF lookup?",
 "796.8 kg/m3, the measured density",
 ["800 kg/m3, the reference figure",
  "Whichever lies nearer the range midpoint",
  "Neither, since a typed VCF needs no density"],
 "Nothing reads the reference unless a caller passes it in. AKODO reads its VCF of 0.988400 off its own tables for the measured 796.8 kg/m3 and 29 C.")

q(1, "How does the closing dip of one AKODO day relate to the opening stock of the next?",
 "They are the same measurement, taken once at the changeover and used twice.",
 ["The opening is the closing dip corrected a second time to standard the next morning.",
  "The opening is the closing dip less the known losses booked overnight.",
  "The opening is the expected closing, 4508.100 m3, carried forward."],
 "The closing dip is recorded at standard, belongs to yesterday and is fixed before today's dips are taken. That is why the AKODO day opens on 4953.700 m3.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_exam.json', expect_n=42)
finish()
