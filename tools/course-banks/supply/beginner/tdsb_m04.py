import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Associate m04, The Volume Correction Factor. Digest section 6.
# Every coefficient here is the digest's SYNTHETIC row or a VCF typed off
# AKODO's own (invented) tables. No published coefficient is named.

q(1, "On the course's synthetic coefficient row at 741.6 kg/m3, the VCF at 15 C reads 1.000000. What does that do to a gross observed volume?",
 "Nothing: at the reference temperature the standard volume equals the gross observed volume.",
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
 "Density sits under K0 and K1 in alpha = K0 / rho^2 + K1 / rho + K2, so a denser product has a smaller alpha on this row, swells less and needs less taken back out.")

q(2, "In the temperature sweep of the synthetic row, alpha reads 0.001350036 at every temperature. Why?",
 "alpha depends only on the density and the coefficients.",
 ["The engine holds alpha fixed at its 15 C value and corrects it later.",
  "alpha is rounded to nine decimals, which hides the effect of temperature.",
  "A commodity group has one alpha at any density."],
 "The first line of the form builds alpha from rho and K0, K1 and K2. The density sweep at 31.5 C shows alpha moving from 0.001489796 to 0.000975309 as the density changes.")

q(1, "Product cooled to 10 C gets a synthetic factor of 1.006736 at that same density. What follows for its standard volume?",
 "Its standard volume is larger than its gross observed volume.",
 ["Its standard volume is smaller, since every VCF takes swelling back out.",
  "The engine refuses it, since the form is written for temperatures above 15 C.",
  "It needs no correction, since only warm product changes volume."],
 "A VCF above one raises the volume: cool product has shrunk, and the correction states it as it would stand at 15 C. From 20 C upward the synthetic VCF is below one.")

q(3, "What is dT in VCF = exp( -alpha x dT x (1 + 0.8 x alpha x dT) )?",
 "The observed temperature less 15 C",
 ["15 C less the observed temperature",
  "The change in temperature since yesterday's closing dip",
  "The density at 15 C less the density at the observed temperature"],
 "dT measures how far the product sits from the reference temperature. At 31.5 C it is positive and the synthetic VCF at 741.6 kg/m3 is 0.977583, below one.")

q(2, "The course prints the coefficients K0 = 520, K1 = 0.3 and K2 = 0. What are they?",
 "Synthetic coefficients invented for the course to show the form, used to correct no stock.",
 ["AKODO's own coefficients, used to correct the stock in its petrol tank.",
  "The engine's default row, applied when a caller supplies no coefficients.",
  "The coefficients behind AK-01's typed VCF of 0.980300 at 31.5 C."],
 "They belong to no commodity group. The engine ships no coefficients and has no default, and AKODO corrects its stock with VCFs typed off its own tables.")

q(0, "The correction form takes five inputs: rho, the observed temperature, and K0, K1 and K2. Which are measured at the tank and which come from a published table?",
 "rho and the temperature are measured at the tank; K0, K1 and K2 are published per commodity group.",
 ["rho and K0 are measured at the tank; the temperature, K1 and K2 are published per group.",
  "All five are measured at the tank, from a sample and a thermometer.",
  "The temperature is measured; rho and the three K values come from PRODUCT_REFERENCE."],
 "The density at 15 C comes from a sample and the temperature from a thermometer. The coefficients are published per commodity group, and the engine ships none and refuses without them.")

q(3, "Why would a default coefficient row inside the engine be dangerous even though it would always return a figure?",
 "A wrong group's row still gives a VCF to six decimals, and its error lands in the day's gap as a loss or a gain.",
 ["A default row would make the engine slower, since it would have to recompute alpha for every commodity group on every call.",
  "A default row cannot be combined with a typed VCF, so AKODO's own tables would stop working.",
  "A default row would return a VCF of 1.000000 at every temperature, which leaves every stock uncorrected whatever its temperature."],
 "The VCF multiplies the whole stock. A plausible six decimal factor from the wrong row looks exactly like a right one, so its error shows up in the unaccounted figure with nothing to mark it.")

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
 "The density and the temperature are measured at the tank. The VCF of 0.987600 is the lookup, and like AKODO's tables it is invented for the course.")

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
 "4581.490 m3 is gross observed, three parts at 31.5 C, 30 C and 29 C. 4499.452 m3 states every part at 15 C, the same basis as the opening stock.")

q(1, "A typed VCF is supplied for every AKODO tank. What can the engine check about each one?",
 "Only that it is present; a wrong table, sample or thermometer behind it goes unseen.",
 ["That it matches the synthetic form within a stated tolerance.",
  "That it lies between the typical densities for its product code.",
  "That it is below one whenever the tank is warmer than 15 C."],
 "A typed VCF carries the terminal's table, the density sample and the thermometer with it. What the engine can do is refuse to run without one and report the standard volume as none.")

q(0, "AK-03 reads 52.161 m3 gross observed and 51.556 m3 at standard. What does the word standard add to that second figure?",
 "It is the volume the kerosene would occupy at 15 C.",
 ["It is the volume with the free water taken off the dip.",
  "It is the volume after known losses are booked.",
  "It is the volume the kerosene would fill at 29 C."],
 "Free water came off in forming the gross observed volume. The typed VCF of 0.988400 takes the product from its observed 29 C to the 15 C reference.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/beginner/tdsb_m04.json', expect_n=15)
finish()
