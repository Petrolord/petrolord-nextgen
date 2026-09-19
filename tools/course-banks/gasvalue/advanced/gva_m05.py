import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Expert m05, The Customer's Switch. Digest SECTION 34, and SECTION 29
# for IBAFO's trailers. Simple payback is gradeable here; nothing discounted
# is asked. 15 questions.

q(2, "No CNG consumption is measured for the Lagos bus. What consumption on CNG does conversionEconomics use, and from what source?",
 "10.1449 kg per 100 km, derived from energy equivalence",
 ["9.5 kg per 100 km, as measured",
  "11.6667 kg per 100 km, derived from energy equivalence",
  "9.3333 kg per 100 km, derived from energy equivalence"],
 "SECTION 34 prints consumptionSource derived from energy equivalence and newFuelConsumptionPer100Km 10.1449 kg at the efficiency ratio of 0.92. 11.6667 kg is the ratio of 0.8 and 9.3333 kg the ratio of 1; 9.5 kg is the measured consumption of the separate probe.")

q(0, "How does the engine derive the CNG consumption when none is measured?",
 "PMS consumption times PMS energy, over CNG energy times the efficiency ratio",
 ["PMS consumption times CNG energy, over PMS energy times the efficiency ratio",
  "PMS consumption times PMS energy times the efficiency ratio, over CNG energy",
  "PMS consumption over the efficiency ratio, on the litres of PMS"],
 "SECTION 34 prints the check row PMS consumption x PMS energy over (CNG energy x efficiency ratio) as 10.1449, the same as newFuelConsumptionPer100Km.")

q(1, "What cost per kilometre on CNG does the engine print for the Lagos bus?",
 "38.5507 naira",
 ["109.2000 naira",
  "69.5584 naira",
  "10.1449 naira"],
 "SECTION 34 prints CNG cost per km 38.5507 and PMS cost per km 109.2000; savingPerKm is 69.5584. 10.1449 is the CNG consumption in kg per 100 km.")

q(3, "At the efficiency ratio of 0.92, what annualSaving after maintenance does the engine give?",
 "3825710.1400 naira",
 ["3507666.6700 naira",
  "3995333.3300 naira",
  "6006000.0000 naira"],
 "SECTION 34 prints annualSaving (after maintenance) 3825710.1400. 3507666.6700 is the ratio of 0.8 and 3995333.3300 the ratio of 1; 6006000.0000 is the PMS cost a year.")

q(2, "At the efficiency ratio of 0.92, what simple payback does conversionEconomics print?",
 "0.3137 years",
 ["0.3421 years",
  "0.3004 years",
  "0.3030 years"],
 "SECTION 34 prints simplePaybackYears 0.3137, and the check row conversion cost over annualSaving as 0.3137. 0.3421 is the ratio of 0.8, 0.3004 the ratio of 1, and 0.3030 the measured consumption of 9.5 kg per 100 km.")

q(0, "A measured CNG consumption of 9.5 kg per 100 km is given to the engine. What does it do?",
 "It uses it: consumptionSource as measured, simplePaybackYears 0.3030",
 ["It derives 10.1449 kg from energy equivalence and sets the 9.5 aside",
  "It uses it: consumptionSource as measured, simplePaybackYears 0.3137",
  "It keeps the derived consumptionSource, with payback 0.3030"],
 "SECTION 34: with a measured CNG consumption of 9.5 kg per 100 km the engine uses it: consumptionSource \"as measured\", simplePaybackYears 0.3030. 0.3137 is the payback on the derived consumption.")

q(2, "CNG is priced at 1100 naira a kg for the same bus. What does conversionEconomics return?",
 "annualSaving -191681.1600, with simplePaybackYears null",
 ["annualSaving 3825710.1400 and simplePaybackYears 0.3137",
  "annualSaving -191681.1600 and a simplePaybackYears of 0.3137",
  "REFUSED: Annual distance, base consumption and both fuel prices are required."],
 "SECTION 34: with CNG at 1100 naira a kg there is no saving: annualSaving -191681.1600, simplePaybackYears null, and the note \"The conversion does not save money at these prices, so there is no payback to report.\"")

q(1, "What does conversionEconomics print as its paybackNote?",
 "Simple payback is undiscounted. Anything needing a discount rate belongs in the sanctioned economics engine.",
 ["Simple payback is discounted at the case's own stated rate, and the cash flow is handed on already discounted.",
  "The conversion does not save money at these prices, so there is no payback to report.",
  "Simple payback is undiscounted, and it is taken from the fuel cost alone, before maintenance."],
 "SECTION 34 prints the paybackNote verbatim. The no saving sentence is the note at 1100 naira a kg; annualSaving is printed after maintenance.")

q(0, "What annual cash flow does conversionEconomics hand on for the Lagos bus?",
 "year0 -1200000.0000, recurring 3825710.1400",
 ["year0 -1200000.0000, recurring 2120289.8600",
  "year0 -1200000.0000, recurring 6006000.0000",
  "year0 -1200000.0000, recurring 3995333.3300"],
 "SECTION 34 prints annualCashFlow year0 -1200000.0000 and recurring 3825710.1400. 2120289.8600 is the CNG cost a year, 6006000.0000 the PMS cost a year, and 3995333.3300 the annualSaving at an efficiency ratio of 1.")

q(2, "No measured CNG consumption is given and the efficiency ratio is left blank. What does the engine print?",
 "REFUSED: Either a measured consumption on the new fuel, or both fuels' energy content and an efficiency ratio, are required.",
 ["A consumption derived at an efficiency ratio of 1, 9.3333 kg per 100 km",
  "A consumption derived at the 0.92 ratio, 10.1449 kg per 100 km",
  "REFUSED: Annual distance, base consumption and both fuel prices are required."],
 "SECTION 34's probe table prints this refusal, which ends \"Neither is assumed.\" The other refusal is the probe with no annual distance.")

q(3, "Beside the saving, the switch prints a yearly figure in kg of CO2e avoided. Which is it?",
 "2365.8000",
 ["5579.7100",
  "7700.0000",
  "3825710.1400"],
 "SECTION 34 prints kgCo2eAvoidedPerYear 2365.8000, on the illustrative emission factors 2.3 kg CO2e a litre of PMS and 2.75 a kg of CNG. 5579.7100 is the CNG kg a year, 7700.0000 the PMS litres a year, and 3825710.1400 the annualSaving.")

q(1, "What does the efficiency ratio of 0.92 state for the converted bus?",
 "It turns CNG energy into distance 0.92 times as well as PMS energy.",
 ["CNG carries 0.92 times the energy of PMS for each unit of fuel bought.",
  "It covers 0.92 of its 55000 km a year on CNG, and the rest of it on PMS.",
  "CNG costs 0.92 times as much as PMS for each MJ it supplies."],
 "SECTION 34: the converted engine turns CNG energy into distance 0.92 times as well as PMS energy. The energy contents are typed separately, 32 MJ a litre of PMS and 48 MJ a kg of CNG.")

q(1, "IBAFO's trailers run 4 trips a day with spares 0.1. What does assetFloat print as inCirculation, sparesAllowance and fleetRequired?",
 "7.2000, 0.7200 and 8",
 ["7.2000, 0.0800 and 8",
  "1.8000, 0.7200 and 8",
  "7.2000, 0.7200 and 0.0800"],
 "SECTION 29 prints IBAFO's trailers as inCirculation 7.2000, sparesAllowance 0.7200 and fleetRequired 8, the fleet being the ceiling of the assets in circulation plus the spares allowance. 1.8000 is cycleDays and 0.0800 is spareCapacityUnits, what the ceiling adds.")

q(1, "IBAFO's trailer cycle runs Loading, Run out, On station and Run back. Which one does the engine flag as dominant, with its share?",
 "On station, 0.5556",
 ["Run out and Run back, 0.1667",
  "Loading, 0.1111",
  "At the customer, 0.8421"],
 "On station takes 1 of the 1.8000 days, printed as 0.5556, and the engine names it dominantStage. Loading prints 0.1111 and each run 0.1667. 0.8421 belongs to KANO's cylinders at the customer.")

q(3, "IBAFO's trailers print spareCapacityUnits 0.0800. What does the digest call that field?",
 "What the ceiling adds",
 ["The spares allowance of the fleet",
  "The spares fraction typed for the trailers",
  "The share of the cycle spent loading"],
 "SECTION 29 labels spareCapacityUnits \"what the ceiling adds\". The spares allowance prints 0.7200, the spares fraction typed is 0.1, and Loading's share of the cycle is 0.1111.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/advanced/gva_m05.json', expect_n=15)
finish()
