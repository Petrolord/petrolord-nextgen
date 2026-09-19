import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Associate m01, What a Terminal Measures. Digest sections 1 and 2.

q(2, "terminalDepot exports 8 functions and 0 constants. What does that 0 tell you about where a strapping table, a correction coefficient and an opening stock come from?",
 "None of them lives in the module, so each one arrives from the terminal that owns the tank.",
 ["They live in fuelPricing, whose 8 constants the tank calls read.",
  "They are built into the functions as defaults, so none is counted.",
  "They sit in a registry of tanks outside the engine's exported names."],
 "terminalDepot exports its rules as 8 functions and no fixed data at all, so every table, coefficient and opening stock is an input the terminal supplies.")

q(0, "Which two of fuelPricing's constants hold data that is true everywhere and forever, whatever the market or the date?",
 "LITRES_PER_M3 and M3_PER_BBL",
 ["IMPORT_TEMPLATE and PUMP_TEMPLATE",
  "PRODUCT_REFERENCE and CHARGE_BASIS",
  "RATE_DISCLAIMER and PRODUCT_REFERENCE"],
 "A cubic metre holds 1000 litres and a barrel is 0.158987294928 m3 by definition. The templates carry line items with every rate absent, and the density table is labelled a starting point.")

q(3, "dipToStandardVolume is called on AK-01 with its dip, its water cut and its table, and with no volume correction factor. What does the engine answer?",
 "gross 3461.489 m3 and standard none, with a note that only the gross observed volume is reported",
 ["REFUSED, because a tank call with no volume correction factor forms no figure of any kind",
  "gross 3461.489 m3 and standard 3461.489 m3, the missing factor taken as exactly one",
  "gross 3461.489 m3 and standard 0.000 m3, the blank factor read as zero"],
 "The engine walks the chain as far as the measured inputs reach. The gross observed volume, 3461.489 m3, needs no VCF, so it prints; the standard volume reads none.")

q(1, "A form sends volumeAtDip a tank with its strapping table and a dip box left blank. What does the engine answer?",
 "REFUSED: No dip reading.",
 ["0.000 m3, the volume at 0 mm on AK-01's table",
  "REFUSED: A dip cannot be negative.",
  "REFUSED: No strapping table for this tank."],
 "A blank dip and a null dip return the same refusal. A blank box never becomes 0 mm, because 0 mm is the empty tank and reads 0.000 m3, which is a different fact.")

q(2, "reconcileStock is given the opening stock, the receipts, the deliveries and the known losses of the AKODO day, and no closing dip. What comes back?",
 "expected closing 4508.100 m3 and unaccounted none, with a note that the day cannot be closed",
 ["REFUSED: No opening stock, so the day cannot be closed. The opening stock is yesterday's closing dip.",
  "expected closing 4508.100 m3 and unaccounted 0.000 m3, the day read as balanced",
  "a refusal with no figure at all, because the ledger needs both ends before any line of it is formed"],
 "The expected closing needs only the opening stock and the day's movements, so 4508.100 m3 prints. The unaccounted figure needs the dip, so it reads none.")

q(3, "Which of these calls returns a partial answer with a named gap when one input is missing, and does not refuse?",
 "dipToStandardVolume with no VCF",
 ["volumeAtDip with no table",
  "volumeCorrectionFactor with no density",
  "reconcileStock with no opening stock"],
 "dipToStandardVolume still has everything it needs for the gross, so it reports gross 3461.489 m3 and gives the standard volume as none. The other three have nothing to form and refuse.")

q(1, "The lesson imagines a blank opening stock read as 0 m3 on the AKODO day, where the real opening stock is 4953.700 m3. What would that zero do to the day?",
 "It would book a whole tank of yesterday's product as a gain made today.",
 ["It would leave the gap as it is, since the opening sets only the band.",
  "It would bring on the still day reading, since no stock moves.",
  "It would halve the expected closing, as if two stocks were averaged."],
 "The expected closing starts from the opening stock. Reading 4953.700 m3 as 0 m3 pushes the whole of yesterday's stock into the gap as an apparent gain, a clean looking figure that is wrong.")

q(0, "What does IMPORT_TEMPLATE tell a user about each of its line items, from ocean freight to the demurrage provision?",
 "Which charge exists, its basis and its stage, with the rate left for the user to supply.",
 ["A typical rate for each charge, labelled as a starting point in the same way as PRODUCT_REFERENCE.",
  "The rate in force when the engine was built, with a note to confirm it against the regulation.",
  "The order of the charges, with a rate of zero wherever the user leaves one blank."],
 "The rate shipped column reads none on all 9 rows. RATE_DISCLAIMER says every rate is a required input, so the template names charges and bases and never an amount.")

q(3, "PRODUCT_REFERENCE lists PMS at a typical density of 745 kg/m3. When does anything in fuelPricing read that figure?",
 "Only when a caller passes it in; the certificate of quality is the authority.",
 ["Whenever a PMS tank's density is left blank, as the default for its volume correction factor.",
  "Whenever a measured density falls outside 720-775 kg/m3.",
  "On every PMS call, in place of the sample density."],
 "The engine labels these densities a starting point: nothing in the module reads them unless a caller passes one in, and the certificate of quality is the authority. PMS reads 745 kg/m3 only as a label.")

q(2, "volumeCorrectionFactor refuses a call made with no coefficients. Which two ways forward does its refusal offer?",
 "Supply K0, K1 and K2, or enter a VCF read from your own tables.",
 ["Supply K0, K1 and K2, or accept the product's typical density.",
  "Enter a VCF of 1.000000, or state the density at 15 C and let the engine pick a row.",
  "Pick a commodity group from the engine's own table."],
 "The refusal names the API MPMS Chapter 11.1 coefficients, says the package does not ship them, and offers exactly two routes: supply K0, K1 and K2, or enter a VCF from your own tables.")

q(1, "volumeCorrectionFactor is called with coefficients and an observed temperature, and the density box is empty. What does the engine answer?",
 "REFUSED: Density at 15 C and observed temperature are both needed.",
 ["REFUSED: Density is required to convert between mass and volume; it is not assumed.",
  "a VCF worked at the typical density of 745 kg/m3",
  "REFUSED: No volume correction factor supplied, so only the gross observed volume is reported."],
 "The form needs its two measured inputs. The mass and volume sentence belongs to cargoQuantities, and the note about a missing VCF is dipToStandardVolume's, which does not refuse.")

q(0, "In the Associate chain, free water has just been read through the table and taken off. What is the next link?",
 "A volume correction factor turns the gross observed volume into a volume at standard.",
 ["The day closes on the gross observed volume, and the correction is applied to the gap afterwards.",
  "The table is read again at the gross volume to find its height.",
  "The days are summed and read for a direction."],
 "The six links run dip, table, free water, VCF, the day and the run of days. The gross observed volume, such as AK-01's 3461.489 m3, is corrected to standard before the day is closed.")

q(3, "The course runs on three invented records. Which one is the coastal import terminal with three tanks whose readings this tier uses?",
 "AKODO",
 ["IBAFO, the depot with the loading rack",
  "BADAGRY, the petrol cargo priced to the nozzle",
  "A real terminal, since a stock needs real dips"],
 "AKODO is the coastal import terminal with three tanks, AK-01 to AK-03. IBAFO is the inland depot and BADAGRY the cargo, and all three records are invented for the course.")

q(2, "throughputEconomics is called with every input except an emission factor. How does the engine answer?",
 "It reports the margin, gives the emissions as none and says why in a note.",
 ["It refuses the whole call, since the carbon side is incomplete.",
  "It computes the emissions with a typical factor labelled as a starting point, as it does with densities.",
  "It reports emissions of 0.000, as a missing factor adds nothing."],
 "The note says factors are published, versioned data and an invented one would be worse than none. A missing value stays missing and is never read as 0.")

q(1, "The lesson asks what would happen if a blank VCF were read as 0. What would AK-01's standard volume become?",
 "Zero, wiping out the stock with nothing on its face to say so.",
 ["The gross 3461.489 m3, since a factor of 0 leaves a volume uncorrected.",
  "A refusal, since the engine rejects any VCF below 1.000000.",
  "The volume at the dip, since a zero factor switches the correction off."],
 "Standard volume is the gross times the VCF, so a zero factor erases the stock. That is why the engine reports the standard volume as none when the VCF is missing and says so.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_m01.json', expect_n=15)
finish()
