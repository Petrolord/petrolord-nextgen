import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Associate m04, The Volume Correction Factor. Digest section 6.
# Every coefficient here is the digest's SYNTHETIC row or a VCF typed off
# AKODO's own (invented) tables. No published coefficient is named.

q(1, "On the course's synthetic coefficient row at 741.6 kg/m3, the VCF at 15 C reads 1.000000. What does that do to a gross observed volume?",
 "Nothing: at 15 C the standard volume equals the gross observed volume.",
 ["It shrinks it by the second order term in the bracket with 0.8, which is present even at 15 C.",
  "It raises it slightly, since 15 C sits below every AKODO tank's temperature.",
  "It marks the volume as uncorrected, since a VCF of exactly one means no factor was supplied at all."],
 "In VCF = exp( -alpha x dT x (1 + 0.8 x alpha x dT) ), dT is zero at 15 C, so the exponent is zero and the factor is exactly 1.000000.")

q(3, "The synthetic form at 741.6 kg/m3 is warmed from 20 C to 40 C. Which figures move?",
 "The VCF falls from 0.993236 to 0.965932 while alpha stays 0.001350036.",
 ["alpha falls from 0.001350036 to 0.000975309 and the VCF falls with it from 0.993236 to 0.965932.",
  "The VCF rises from 0.993236 to 1.006736 while alpha stays 0.001350036.",
  "Both stay put, since the synthetic row fixes the VCF for a density."],
 "alpha is built from density and the coefficients alone, so it reads 0.001350036 in every row of the temperature sweep. Temperature enters only the second line of the form.")

q(0, "The synthetic form at 31.5 C is swept from 700 kg/m3 to 900 kg/m3. Which way do alpha and the VCF move?",
 "alpha falls from 0.001489796 to 0.000975309 and the VCF rises from 0.975246 to 0.983832.",
 ["alpha rises from 0.000975309 to 0.001489796 and the VCF falls from 0.983832 to 0.975246 as the product gets denser.",
  "alpha stays 0.001350036 and only the VCF moves, from 0.975246 to 0.983832.",
  "Both fall together, alpha to 0.000975309 and the VCF to 0.975246."],
 "Density sits under K0 and K1 in alpha = K0 / rho^2 + K1 / rho + K2. On this row alpha falls from 0.001489796 at 700 kg/m3 to 0.000975309 at 900 kg/m3, and the VCF rises from 0.975246 to 0.983832.")

q(2, "In the temperature sweep of the synthetic row, alpha reads 0.001350036 at every temperature. Why?",
 "alpha depends only on the density and the coefficients.",
 ["The engine holds alpha fixed at its 15 C value and corrects it later.",
  "alpha is rounded to nine decimals, which hides the effect of temperature.",
  "A commodity group has one alpha at any density."],
 "The first line of the form builds alpha from rho and K0, K1 and K2. The density sweep at 31.5 C shows alpha moving from 0.001489796 to 0.000975309 as the density changes.")

q(1, "The correction form is written with rho. Which density is rho?",
 "The density at 15 C, in kg/m3",
 ["The density at the observed temperature",
  "The typical density in PRODUCT_REFERENCE",
  "The density of the free water"],
 "The form states rho as the density at 15 C in kg/m3, and the refusal without one asks for the density at 15 C and the observed temperature. PRODUCT_REFERENCE is read only when a caller passes one of its densities in.")

q(3, "What is dT in VCF = exp( -alpha x dT x (1 + 0.8 x alpha x dT) )?",
 "The observed temperature less 15 C",
 ["15 C less the observed temperature",
  "The change in temperature since yesterday's closing dip",
  "The density at 15 C less the density at the observed temperature"],
 "dT measures how far the product sits from the reference temperature. At 31.5 C it is positive and the synthetic VCF at 741.6 kg/m3 is 0.977583, below one.")

q(2, "The course prints the coefficients K0 = 520, K1 = 0.3 and K2 = 0. What are they?",
 "Synthetic coefficients invented for the course to show the form; they correct no stock.",
 ["AKODO's own coefficients, which correct the stock in its petrol tank.",
  "The engine's default row, applied when a caller supplies no coefficients.",
  "The coefficients behind AK-01's typed VCF of 0.980300 at 31.5 C."],
 "They belong to no commodity group. The engine ships no coefficients and has no default, and AKODO corrects its stock with VCFs typed off its own tables.")

q(0, "The correction form takes five inputs: rho, the observed temperature, and K0, K1 and K2. Which are the tank's own figures and which come from a published table?",
 "rho and the temperature are the tank's own; K0, K1 and K2 are published per commodity group.",
 ["rho and K0 are the tank's own; the temperature, K1 and K2 are published per group.",
  "All five are the tank's own, typed in beside its dip and its water cut.",
  "The temperature is the tank's own; rho and the three K values come from PRODUCT_REFERENCE."],
 "AKODO prints a density and a temperature for each tank. The coefficients are a published table per commodity group; the engine ships none, has no default and refuses without them. PRODUCT_REFERENCE carries typical densities only.")

q(3, "volumeCorrectionFactor is called with a density and a temperature and no coefficients. Which coefficient row does the engine fall back on?",
 "None: it has no default, and it refuses the call",
 ["The synthetic row, K0 = 520, K1 = 0.3 and K2 = 0",
  "The nearest commodity group's row",
  "A row with a VCF of 1.000000 at any temperature"],
 "The engine ships no coefficients and has no default. It refuses, asking for K0, K1 and K2 or a VCF read from your own tables. The synthetic row is printed only to show the form, and no stock is corrected with it.")

q(1, "AK-01's gross observed volume could be multiplied by the synthetic form's VCF at its density and temperature, or by the VCF typed off AKODO's own tables. Which one touches the stock?",
 "The typed VCF, 0.980300",
 ["The synthetic VCF, since a computed form outranks a figure typed by hand",
  "Neither, until the synthetic and the typed figures agree",
  "The synthetic VCF, since it is worked at the same 741.6 kg/m3 and 31.5 C"],
 "The synthetic figure is the form on invented coefficients, printed as an illustration. Only the typed figure, itself invented for the course, multiplies a stock: 3461.489 m3 becomes 3393.298 m3.")

q(0, "AK-02 holds diesel at 846.3 kg/m3 and 30 C, and its VCF typed is 0.987600. Which of those figures came from a lookup?",
 "The VCF, read off AKODO's own tables for that density and temperature and typed in",
 ["The density, read off PRODUCT_REFERENCE for diesel and typed in",
  "The temperature, read off the tank's table at the dip of 5406 mm",
  "All three, since each is read off the synthetic sweep"],
 "AKODO reads its VCF off its own tables for each tank's density and temperature and types it in; 0.987600 is that lookup, invented for the course. AK-02's 846.3 kg/m3 is not PRODUCT_REFERENCE's 840 for AGO, and a strapping table holds heights and volumes only.")

q(2, "The three printed standard volumes, each rounded to the litre, add to 4499.453 m3. On which total is the AKODO day closed?",
 "4499.452 m3, the total summed from the unrounded standard volumes",
 ["4499.453 m3, the sum of the three printed standard volumes",
  "4581.490 m3, the total gross observed volume of the three tanks",
  "4499.453 m3, since a stock is always quoted to the litre it prints"],
 "The engine sums the unrounded standard volumes and the digest prints that total as 4499.452 m3. The sum of the printed rows is not the figure the day closes on.")

q(3, "The morning has two totals, 4581.490 m3 and 4499.452 m3. Which can be set against an opening stock held at standard?",
 "4499.452 m3",
 ["4581.490 m3, since it counts every litre in the tanks with the water off",
  "Either, since both are in m3 and both have the free water removed",
  "4581.490 m3, since it is the larger and so the more complete of the two"],
 "4581.490 m3 is the gross observed total, each tank at its own temperature of 31.5 C, 30 C and 29 C. 4499.452 m3 is the standard total the day is closed on. The same day closed on the gross against an opening held at standard reads unaccounted 73.390 m3, a gain outside tolerance.")

q(1, "Which AKODO tank is corrected at a density of 846.3 kg/m3 and a temperature of 30 C?",
 "AK-02",
 ["AK-01",
  "AK-03",
  "None of them; that pair is a synthetic sweep point"],
 "AK-02, the AGO tank, is corrected at 846.3 kg/m3 and 30 C with a typed VCF of 0.987600. AK-01 stands at 741.6 kg/m3 and 31.5 C, and AK-03 at 796.8 kg/m3 and 29 C. The synthetic density sweep prints 846.3 kg/m3 at 31.5 C, and no stock is corrected with it.")

q(0, "AK-03 reads 52.161 m3 gross observed and 51.556 m3 at standard. Which figure turns the first into the second?",
 "Its typed VCF, 0.988400",
 ["The synthetic VCF, 0.980162",
  "Its water, 0.341 m3",
  "Known losses, 3.100 m3"],
 "Standard volume = gross observed volume x VCF, and AKODO types each tank's VCF off its own tables: 0.988400 for AK-03 at 796.8 kg/m3 and 29 C. The synthetic 0.980162 is worked at 31.5 C and corrects no stock, and the water is already off the gross.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_m04.json', expect_n=15)
finish()
