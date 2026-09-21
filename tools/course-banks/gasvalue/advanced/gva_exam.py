import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Expert tier exam. Digest SECTIONS 25 to 36, the whole Expert tier.
# Written last, on stems the module banks do not use. 42 questions.

# SECTION 25
q(3, "What typical boiling point does LPG_REFERENCE print for propane?",
 "-42 C",
 ["-0.5 C",
  "38 C",
  "18 C"],
 "LPG_REFERENCE prints propane's typical boiling point as -42 C and n-butane's as -0.5 C. 38 C is the boiling point at KANO's vaporizer pressure and 18 C the liquid's inlet temperature (the vaporizer lesson).")

q(0, "By the engine's note on LPG_REFERENCE, what is the authority for liquid density, latent heat and calorific value?",
 "The certificate of quality",
 ["The typical row in LPG_REFERENCE",
  "The range printed beside each typical figure",
  "The site's code value, typed with its basis"],
 "The note: \"Typical values only, offered as a starting point. Liquid density, latent heat and calorific value vary with the product and the supplier; the certificate of quality is the authority.\"")

q(1, "The studio opens on propane 0.4 and butane 0.6 by liquid volume. What density does lpgBlendProperties return?",
 "553.6000 kg/m3",
 ["557.4000 kg/m3",
  "508 kg/m3",
  "999.1 kg/m3"],
 "The blend lesson prints the studio opening blend at densityKgM3 553.6000 (volume). 557.4000 kg/m3 is KANO's blend, 508 kg/m3 propane's typical row, and 999.1 kg/m3 is WATER_KG_M3 (the vessel lesson).")

q(1, "lpgBlendProperties is given a negative volume fraction. Which line comes back?",
 "REFUSED: A volume fraction cannot be negative.",
 ["REFUSED: Every component needs a volume fraction.",
  "A blend taken on the components whose fractions are positive.",
  "REFUSED: The maximum fill ratio must lie between 0 and 1."],
 "The blend lesson's probe table prints \"REFUSED: A volume fraction cannot be negative.\" A blank butane volume fraction gets \"Every component needs a volume fraction.\"; the fill ratio refusal belongs to lpgStorageSizing.")

# SECTION 26
q(3, "KANO's vessel is given a fill limit of 1. What does lpgStorageSizing print?",
 "REFUSED: The maximum fill ratio must lie between 0 and 1.",
 ["REFUSED: At this density the filling density fills the vessel liquid-full.",
  "The vessel sized liquid-full, with no vapour space left.",
  "REFUSED: A maximum fill ratio is required and is not defaulted."],
 "The vessel lesson's probe table prints \"REFUSED: The maximum fill ratio must lie between 0 and 1.\" for a fill limit of 1. The liquid-full refusal is the probe with a filling density of 0.6 on water capacity; the not defaulted refusal is a blank fill limit.")

q(2, "The fill ratio basis is typed as 'weight'. What does the engine do?",
 "REFUSED: Unknown fill ratio basis \"weight\". Use liquid_volume or water_capacity_mass.",
 ["It reads weight as water_capacity_mass and names that basis in its output.",
  "It takes liquid_volume, the basis it takes when none is given in the call.",
  "REFUSED: A liquid density is required; it is not assumed."],
 "The vessel lesson's probe table prints the unknown basis refusal for 'weight'. liquid_volume is what the engine takes when the basis is OMITTED from the call; a basis that is typed and unknown is refused.")

q(0, "What deliveriesPerMonth does lpgStorageSizing print for KANO, and by which rule?",
 "12.0000, the demand times 30 over the delivery",
 ["12.0000, usableTonnes over the delivery of 20 t",
  "8.8840, usableTonnes over the demand",
  "40.0000, the demand times the lead time plus the safety stock"],
 "The vessel lesson: deliveriesPerMonth is the demand times 30 over the delivery, and both rows print 12.0000. usableTonnes over the demand is coverDays, 8.8840 at the 0.85 fill; the demand times the lead time plus the safety stock is reorderAtTonnes, 40.0000.")

q(1, "The call for KANO's vessel at 0.85 leaves the lead time field out altogether. Which pair comes back?",
 "missingInputs none, reorderAtTonnes 16.0000",
 ["lead time in missingInputs, reorderAtTonnes null",
  "missingInputs none, reorderAtTonnes 40.0000",
  "lead time in missingInputs, reorderAtTonnes 16.0000"],
 "Left out of the call, the lead time takes the stated 0 (the vessel lesson): no missing inputs, and a reorder point of 16.0000, the safety stock alone. Typed blank (''), the lead time is named missing and the reorder point is null; 40.0000 belongs to the 3 day lead time.")

q(3, "KANO's 0.42 is read as a share of the liquid volume, on the basis it was not stated on. What does the course print?",
 "35.1162 t, which is 27.8271 t below the 62.9433 t",
 ["62.9433 t, the same as on water capacity",
  "71.0685 t, the 0.85 liquid_volume figure",
  "27.8271 t, which is 35.1162 t below the 62.9433 t"],
 "Read on the liquid volume, the 0.42 gives 35.1162 t, and the course prints that as 27.8271 t below the 62.9433 t the filling density gives. 71.0685 t is the 0.85 limit's usable stock.")

q(2, "How does vaporizerDuty form the term Warm the liquid to boiling?",
 "Mass flow times liquid heat capacity times (boiling point less inlet)",
 ["Mass flow times vapour heat capacity times (outlet less boiling point)",
  "Mass flow times liquid heat capacity times (outlet less inlet)",
  "Mass flow times the latent heat"],
 "The vaporizer lesson: warm the liquid is the mass flow times the liquid heat capacity times (boiling point less inlet). The vapour heat capacity term is the superheat and the latent heat term is the boil.")

q(3, "What does KANO's Superheat the vapour term print?",
 "5.1567 kW, 0.0601 of the duty",
 ["8.8472 kW, 0.1031 of the duty",
  "5.1567 kW, 0.1031 of the duty",
  "71.8176 kW, 0.0601 of the duty"],
 "The superheat row reads 5.1567 kW and 0.0601. The 0.1031 share and 8.8472 kW belong to warming the liquid to boiling, and 71.8176 kW to the boil.")

q(0, "KANO's vaporizer is given a vapour outlet of 30 C against a boiling point of 38 C. What comes back?",
 "REFUSED: The vapour leaves at 30 C, below the boiling point given (38 C), so it would condense.",
 ["A superheat term printed below zero, with the duty reduced by it.",
  "dutyKW 71.8176, the boil alone, with superheat named as missing.",
  "REFUSED: The liquid enters at 18 C, above the boiling point given (-0.5 C)."],
 "The outlet probe is refused with a line that ends by asking for an outlet above the boiling point at the vaporizer's pressure. A blank boiling point is the case that returns the boil alone, and the -0.5 C boiling point is the inlet probe.")

q(3, "KANO's vaporizer is run with no latent heat. What does vaporizerDuty print?",
 "REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed.",
 ["A duty on n-butane's typical latent heat of 385 kJ/kg from LPG_REFERENCE.",
  "The warming and superheat terms, with the boil named as a missing term.",
  "A duty on the blend's latent heat of 397.7592 kJ/kg, taken by default."],
 "The vaporizer lesson's probe table prints the latent heat refusal. A latent heat is a property of the product, and the engine assumes none.")

# SECTION 28
q(0, "What arrivalsPerHour does the carousel print for KANO's 3200 cylinders over a 10 hour shift?",
 "320.0000 cylinders an hour",
 ["4516.3600 cylinders an hour",
  "3200 cylinders an hour",
  "11.7333 cylinders an hour"],
 "The carousel lesson prints arrivalsPerHour 320.0000. 4516.3600 is throughputCapacityPerDay, 3200 the cylinders a shift, and 11.7333 the queue's offered load in erlangs.")

q(0, "What does KANO's carousel print for minimumPositionsForThroughput and meetsDemand?",
 "13 and true",
 ["16 and true",
  "17 and true",
  "13 and false"],
 "The carousel lesson prints minimumPositionsForThroughput 13 and meetsDemand true. 16 is queuePositions; 17 is the positions rounded to the nearest whole one, the shortcut the engine does not take.")

q(2, "On its 16 working positions, what probabilityOfWaiting does KANO's carousel print?",
 "0.1769",
 ["0.1078",
  "0.0633",
  "0.7333"],
 "The carousel lesson prints queue probabilityOfWaiting 0.1769. 0.1078 and 0.0633 are the carousel run at availability 1 on 17 and on 18 positions; 0.7333 is the queue utilisation.")

q(0, "The studio's opening carousel runs 16 positions at availability 0.9 for 8 hours. What does it print?",
 "effectivePositions 14.4000, queuePositions 14",
 ["effectivePositions 14.4000, queuePositions 15",
  "effectivePositions 16.5600, queuePositions 16",
  "effectivePositions 14, queuePositions 14.4000"],
 "The carousel lesson: the studio's opening carousel prints effectivePositions 14.4000, queuePositions 14 and averageWaitMinutes 0.9850. 16.5600 and 16 are KANO's.")

q(3, "KANO's carousel is sized with no fill time. Which line comes back?",
 "REFUSED: Demand, fill time and a position count are required and must be positive.",
 ["REFUSED: Arrivals, fill time and a dispenser count are required and must be positive.",
  "REFUSED: Shift hours must be positive and availability must lie in (0, 1].",
  "A carousel run on the studio's 2.5 minutes a cylinder."],
 "The carousel lesson's probe table prints the demand, fill time and position count refusal. The arrivals and dispenser count refusal is cngDispensing's (the forecourt lesson).")

# SECTION 29
q(0, "By Little's Law, KANO's 3200 cylinders a day over a 28.5000 day cycle are held in circulation. Which figure does assetFloat print for them?",
 "91200.0000",
 ["98496",
  "7296.0000",
  "28.5000"],
 "The basis sentence is \"Little's Law: assets in the system = throughput x time in the system.\" and the KANO table prints inCirculation 91200.0000. 98496 is the fleet after the spares and the ceiling, 7296.0000 the spares allowance, and 28.5000 the cycle in days.")

q(2, "A cylinder float is asked for with an empty list of cycle stages. The engine's answer?",
 "REFUSED: At least one cycle stage with a duration is required.",
 ["REFUSED: No duration for At the customer.",
  "A fleet of none, since no stage holds an asset.",
  "REFUSED: The spares allowance cannot be negative."],
 "The fleet lesson's probe table prints the at least one stage refusal for no stages. \"No duration for At the customer.\" is KANO's cycle with that stage left blank.")

# SECTION 30
q(1, "Which bank of IBAFO's gas storage holds 448.1628 kg?",
 "High, 2 m3 at 270 bar(a)",
 ["Mid, 2 m3 at 250 bar(a)",
  "Low, 2 m3 at 230 bar(a)",
  "Mid, read at 250.0130 bar(a)"],
 "The bank lesson prints massKg 448.1628 on the High row. The Mid bank holds 425.6293 kg, the Low bank 400.5918 kg, and 250.0130 bar(a) gives 425.6447 kg.")

q(2, "For the 249 bar gauge reading, what does the absolute minus gauge-as-absolute row print?",
 "1.0130 bar(a) and 1.2054 kg",
 ["1.0130 bar(a) and 425.6447 kg",
  "250.0130 bar(a) and 1.2054 kg",
  "249 bar(a) and 424.4393 kg"],
 "The bank lesson's gauge table prints absolute minus gauge-as-absolute as 1.0130 bar(a) and 1.2054 kg. 249 and 424.4393 kg are the gauge reading typed as if absolute; 250.0130 and 425.6447 kg are gauge plus atmosphere.")

q(0, "The bank mass is requested without any pressure. What is printed?",
 "REFUSED: A pressure is required.",
 ["REFUSED: A gas specific gravity is required.",
  "The mass at the atmosphere of 1.013 bar(a).",
  "REFUSED: A temperature is required."],
 "gasMassInVessel refuses a missing pressure with that line (the bank lesson). 1.013 bar(a) is the site's atmosphere in the bank lesson's gauge example.")

q(0, "Which ppr does IBAFO's Low bank print at 30 C, and is the correlation in range?",
 "ppr 4.9479, correlationInRange true",
 ["ppr 4.9479, correlationInRange false",
  "ppr 5.8084, correlationInRange true",
  "ppr 0.9727, correlationInRange false"],
 "The bank lesson's table prints the Low bank at ppr 4.9479 with correlationInRange true. 5.8084 is the High bank's ppr, and 0.9727 is the tpr of the Low bank at -80 C, where correlationInRange is false.")

# SECTION 31
q(2, "Which startBar and endBar does the cascade's bank table print for the Low bank?",
 "230.0000 and 58.9110",
 ["250.0000 and 118.3350",
  "270.0000 and 202.6470",
  "230.0000 and 118.3350"],
 "The Low bank runs from 230.0000 to 58.9110 bar(a). The Mid bank's pair is 250.0000 and 118.3350, and the High bank's 270.0000 and 202.6470.")

q(2, "cascadeEfficiency is a ratio of two cascade masses. Which two, and at what value for IBAFO?",
 "Delivered over stored, 0.4775",
 ["Delivered over stored, 0.1505",
  "Left in the banks over stored, 0.4775",
  "Delivered over stored, 0.4577"],
 "The cascade lesson prints cascadeEfficiency (delivered over stored) 0.4775 for IBAFO. 0.1505 is the same 6.0000 m3 as one bank, and 0.4577 the studio's opening cascade.")

q(0, "The studio's opening cascade, three 1.5 m3 banks at 250 bar(a), prints how many fills before recharge?",
 "33, with the next vehicle reaching 195.5640 bar(a)",
 ["38, with the next vehicle reaching 197.7590 bar(a)",
  "33, with the next vehicle reaching 197.7590 bar(a)",
  "38, with the next vehicle reaching 195.5640 bar(a)"],
 "The cascade lesson: the studio's opening cascade prints fillsBeforeRecharge 33, cascadeEfficiency 0.4577, leftInBanksKg 542.689 and nextVehicleReachesBar 195.5640. 38 and 197.7590 are IBAFO's.")

q(1, "cascadeFills is given a target pressure below the start. What does it print?",
 "REFUSED: A start and a higher target pressure are required.",
 ["REFUSED: At least one bank is required.",
  "REFUSED: A temperature is required.",
  "A count of no fills, with hitFillLimit false."],
 "A target below the start is refused with the start and higher target line (the cascade lesson). The bank refusal is for a call with no banks, and the temperature refusal for a temperature left blank.")

q(1, "One of IBAFO's banks is given a volume and no pressure. What does cascadeFills print?",
 "REFUSED: Every bank needs a volume and a pressure.",
 ["REFUSED: A pressure is required.",
  "REFUSED: At least one bank is required.",
  "A cascade run on the other two banks alone."],
 "The cascade lesson's probe table prints \"REFUSED: Every bank needs a volume and a pressure.\" for a bank with no pressure. \"A pressure is required.\" is gasMassInVessel's line (the bank lesson).")

q(2, "Where does IBAFO's stageCount of 4 come from?",
 "The Facilities compression engine that cngCompression calls",
 ["cngCompression's own staging rule on bar(a)",
  "A stage count typed with IBAFO's compressor inputs",
  "The ratio of 255 to 5 bar(a), taken to a whole number"],
 "The compressor lesson's basis reads: \"Staging, polytropic head and real-gas Z from the Facilities compression engine; this converts units and does not reimplement the thermodynamics.\" The staging is the Facilities engine's: cngCompression converts IBAFO's 400 kg/h, suction 5 bar(a) at 32 C and discharge 255 bar(a) to field units, calls that engine and converts the answer back.")

q(1, "Which stage of IBAFO's compressor runs from 35.7070 to 95.4220 bar(a)?",
 "Stage 3",
 ["Stage 2",
  "Stage 4",
  "Stage 1"],
 "The compressor lesson's stage table: stage 1 runs 5.0000 to 13.3620, stage 2 13.3620 to 35.7070, stage 3 35.7070 to 95.4220 and stage 4 95.4220 to 255.0000, each at a ratio of 2.6723.")

q(1, "The station compressor bridge gets a suction and a discharge but no throughput. Result?",
 "REFUSED: A throughput is required.",
 ["REFUSED: A suction pressure and a higher discharge pressure are required.",
  "REFUSED: A pressure is required.",
  "A bridge with qMMscfd 0.4473 taken as the default."],
 "The compressor lesson's probe table prints \"REFUSED: A throughput is required.\" for no throughput. 0.4473 is IBAFO's qMMscfd for its 400 kg/h, and the pressure refusal is gasMassInVessel's.")

# SECTION 33
q(2, "How busy are IBAFO's two dispensers at 14 buses an hour, as the engine's utilisation?",
 "0.7000",
 ["0.4667",
  "1.2500",
  "0.5765"],
 "The forecourt lesson prints utilisation 0.7000 on 2 dispensers and 0.4667 on 3. 1.2500 is 25 buses an hour on 2 dispensers, and 0.5765 the probabilityOfWaiting on 2.")

q(2, "What does cngDispensing's note say about a forecourt?",
 "A CNG fill takes minutes, so a forecourt queues at traffic a liquid-fuel operator would think of as quiet.",
 ["A CNG fill takes seconds, so a forecourt queues only at traffic a liquid-fuel operator would call heavy.",
  "A forecourt is a different queue from the carousel and the loading rack, and is sized on its own rule.",
  "A forecourt queues only once its utilisation reaches 1.2500, and never below it."],
 "The forecourt lesson prints the note verbatim, and states that a CNG forecourt is the same queue as the carousel and the loading rack. 1.2500 is the utilisation of the overloaded forecourt, and the queues on 2 and 3 dispensers at 14 buses an hour both print a probability of waiting.")

q(1, "At 25 buses an hour on 2 dispensers, what does the queue's message say of the average wait?",
 "No average waiting time exists.",
 ["It is 5.7647 minutes, as at 14 buses an hour.",
  "It is the 6 minutes of one fill.",
  "It is 1.2500 times the fill time."],
 "The message: \"The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.\"")

q(3, "Two dispensers serve IBAFO's 14 buses an hour. How likely is a bus to wait, by the engine?",
 "0.5765",
 ["0.2024",
  "0.7000",
  "0.1769"],
 "The forecourt lesson prints probabilityOfWaiting 0.5765 on 2 dispensers and 0.2024 on 3; 0.7000 is the utilisation on 2. 0.1769 is KANO's carousel (the carousel lesson).")

# SECTION 34
q(1, "What CNG kg a year and CNG cost a year does the Lagos bus switch print?",
 "5579.7100 kg and 2120289.8600 naira",
 ["7700.0000 kg and 2120289.8600 naira",
  "5579.7100 kg and 6006000.0000 naira",
  "2365.8000 kg and 2120289.8600 naira"],
 "The bus switch lesson prints CNG kg a year 5579.7100 and CNG cost a year 2120289.8600. 7700.0000 is the PMS litres a year, 6006000.0000 the PMS cost a year, and 2365.8000 kgCo2eAvoidedPerYear.")

q(3, "Per kilometre, how much does the Lagos bus save by switching, by the engine?",
 "69.5584",
 ["38.5507",
  "109.2000",
  "10.1449"],
 "savingPerKm reads 69.5584. A kilometre on PMS costs 109.2000 and on CNG 38.5507; 10.1449 is newFuelConsumptionPer100Km in kg.")

q(0, "The switch economics are run without the bus's yearly kilometres. Which line does the engine print?",
 "REFUSED: Annual distance, base consumption and both fuel prices are required.",
 ["REFUSED: Either a measured consumption on the new fuel, or both fuels' energy content and an efficiency ratio, are required.",
  "A saving per km, with the annual figures left null.",
  "REFUSED: A throughput is required."],
 "The bus switch lesson's probe table prints the annual distance refusal. The either or refusal is the probe with no measured consumption and a blank efficiency ratio.")

q(3, "The converted bus is assumed to use CNG energy exactly as well as PMS energy, a ratio of 1. Which consumption and payback does the switch print?",
 "9.3333 kg per 100 km, payback 0.3004 years",
 ["10.1449 kg per 100 km, payback 0.3137 years",
  "11.6667 kg per 100 km, payback 0.3421 years",
  "9.3333 kg per 100 km, payback 0.3030 years"],
 "The bus switch lesson's ratio table prints 9.3333 and 0.3004 at a ratio of 1, 10.1449 and 0.3137 at 0.92, and 11.6667 and 0.3421 at 0.8. 0.3030 is the payback on the measured 9.5 kg per 100 km.")

# SECTIONS 35 and 36
q(3, "Which of these is a HELD limit in the limits lesson?",
 "Fill limits by code are not shipped.",
 ["The DAK and Sutton coefficients are validated by the oracle.",
  "The compressor's thermodynamics are checked by this course's oracle.",
  "The flare efficiencies default to the rule's tiers."],
 "The limits lesson holds four limits: the flare efficiencies have no default, an unlit flare is not modelled, fill limits by code are not shipped, and GWP values and credit prices are case inputs. The DAK and Sutton coefficients are pinned and not validated, and the compressor's thermodynamics are validated in Facilities.")

q(1, "The end-to-end table closes on IBAFO. Which three of its figures appear there?",
 "Mid bank 425.6293 kg, 38 fills before recharge, 8 trailers",
 ["Mid bank 425.6447 kg, 38 fills before recharge, 8 trailers",
  "Mid bank 425.6293 kg, 12 fills before recharge, 8 trailers",
  "Mid bank 425.6293 kg, 38 fills before recharge, 7.2000 trailers"],
 "The rollout lesson prints IBAFO Mid bank 425.6293 kg, fills before recharge 38 and trailers required 8. 425.6447 kg is the gauge plus atmosphere reading, 12 fills the one bank case, and 7.2000 the trailers in circulation.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/advanced/gva_exam.json', expect_n=42)
finish()
