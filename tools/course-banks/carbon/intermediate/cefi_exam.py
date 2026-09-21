import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Professional tier exam, 42 questions over the whole tier (SECTIONS 11
# to 17 with the SECTION 1 constants and SECTION 25 rows the lessons quote).
# Written LAST, on rows and refusals the module banks do not key, so a
# candidate answers from the material. Every flow, temperature, pressure,
# price and efficiency is invented; the 56.1 kg CO2e per GJ factor is SYNTHETIC.

q(2, "In the course's demand table, what unweighted c + h/4 + s - o/2 term does the C3H8 row of the invented Isiokpo fuel carry?",
 "5",
 ["3.5",
  "2",
  "0"],
 "The C3H8 row reads 5 in the c + h/4 + s - o/2 column. CH4 reads 2, C2H6 3.5, and both inerts 0.")

q(2, "The course says the air's nitrogen is the rest of the stoichiometric air. Which figure does it print for it, in kmol per kmol fuel?",
 "7.886152",
 ["9.975652",
  "8.999152",
  "0.015000"],
 "In the course, the air's nitrogen is the rest of that air, 7.886152 (computed here; products.airN2PerKmolFuel 7.886152). 9.975652 is the stoichiometric air itself, 8.999152 the dry flue gas at 0 percent oxygen in the oxygen table, and 0.015000 the fuel's own nitrogen.")

q(3, "Which heating values does the course print for the invented Isiokpo fuel gas as analysed, inerts included?",
 "840.9925 LHV and 930.6273 HHV MJ per kmol",
 ["862.5564 LHV and 930.6273 HHV MJ per kmol",
  "802.6 LHV and 890.8 HHV MJ per kmol",
  "840.9925 LHV and 862.5564 HHV MJ per kmol"],
 "The course prints lhvMJPerKmolFuel 840.9925 and hhvMJPerKmolFuel 930.6273. 862.5564 is the LHV with the CO2 taken out and the rest renormalised; 802.6 and 890.8 are FUEL_REFERENCE's typical methane pair, held as H2.")

q(1, "At which stack oxygen does the course strike its flue gas mass balance, and what does each side weigh?",
 "3 percent; 351.0222 kg per kmol of fuel on each side",
 ["5.5 percent; 351.0222 kg per kmol of fuel on each side",
  "0 percent; 351.0222 kg in and 351.0222 kg out per kg of fuel",
  "3 percent; 351.0222 kg in, and less out once argon is dropped"],
 "The course strikes THE MASS BALANCE at 3 percent stack oxygen, per kmol of fuel: 351.0222 in, 351.0222 out, out less in 0.000001 (computed here). Air's argon leaves inside the atmospheric nitrogen.")

q(2, "Which rows of energyEfficiency.FUEL_REFERENCE carry the flag inert yes?",
 "CO2 and N2",
 ["N2 and H2",
  "CO2 alone",
  "CH4 and H2"],
 "The course prints inert yes on the Carbon dioxide (inert) and Nitrogen (inert) rows, each with 0 typical LHV and HHV. H2, Hydrogen, prints no with 241.8 LHV and 285.8 HHV MJ/kmol.")

q(1, "The oxygen table's top reading is 12 percent. How much excess air goes with it?",
 "121.0076 percent",
 ["55.7461 percent",
  "32.1223 percent",
  "20.946 percent"],
 "The 12 row prints 121.0076 percent excess air and 22.046948 kmol of air per kmol fuel. 55.7461 is the 8 row and 32.1223 the 5.5 row; 20.946 percent is the bound in the refusal for a reading of all air.")

q(0, "Which figure is the wet flue gas of the invented Isiokpo heater at its current 5.5 percent reading, in kmol per kmol fuel?",
 "14.236563",
 ["12.203563",
  "13.180063",
  "16.593191"],
 "Wet flue gas 14.236563 sits beside dry flue gas 12.203563 and actual air 13.180063 on the 5.5 line. 16.593191 is the wet flue gas at 8 percent.")

q(3, "At a dry reading of 2 percent, the invented burner's safe floor, how much excess air does the oxygen table show?",
 "9.5230 percent",
 ["32.1223 percent",
  "13.9199 percent",
  "55.7461 percent"],
 "9.5230 percent, beside 10.925631 kmol of air per kmol fuel. 13.9199 is the Isiokpo 2.8 target, 32.1223 the current 5.5 reading and 55.7461 a reading of 8.")

q(2, "Tuned to 2.8 percent and read on the higher heating value, how big is the heater's total loss?",
 "20.7657 percent",
 ["22.0712 percent",
  "12.1524 percent",
  "13.5971 percent"],
 "The target HHV row prints dry loss 7.7207, moisture 11.2450, radiation 1.8000, unburned 0.0000, total 20.7657 and efficiency 79.2343. 22.0712 is the current HHV total, 12.1524 the target LHV total and 13.5971 the current LHV total.")

q(1, "At 5.5 percent oxygen the stack loss section weighs the invented Isiokpo flue gas per kmol of fuel. Which pair does it print?",
 "363.6388 kg dry flue gas and 36.6245 kg moisture",
 ["363.6388 kg dry flue gas and 18.5068 kg moisture",
  "36.6245 kg dry flue gas and 363.6388 kg moisture",
  "363.6388 kg dry flue gas and 2.033000 kg moisture"],
 "The stack loss section prints dryFlueGasKgPerKmolFuel 363.6388 and moistureKgPerKmolFuel 36.6245 at 5.5 percent. 18.5068 is the fuel's molar mass and 2.033000 the water in kmol.")

q(0, "No stack temperature is entered for the heater. Which answer does the efficiency call give?",
 "REFUSED: A stack temperature and a combustion air temperature are required.",
 ["REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce.",
  "No refusal: the typical 238 C is used and named in a note.",
  "REFUSED: A flue gas specific heat is required."],
 "The stack loss section prints the blank stack temperature refused with that sentence. 238 C is the invented Isiokpo stack, an input and no default. The radiation refusal answers a blank radiation loss, and the specific heat refusal a blank flue gas cp.")

q(3, "What dry flue gas loss does the heater's 2.8 percent target row print on HHV?",
 "7.7207 percent",
 ["9.0262 percent",
  "8.5436 percent",
  "11.2450 percent"],
 "The target HHV row carries a dry loss of 7.7207 beside a moisture loss of 11.2450. 9.0262 is the dry loss at 5.5 percent on HHV, and 8.5436 the target dry loss on LHV.")

q(1, "Which of the four losses prints the same 1.8000 in every one of the invented heater's four stack loss rows?",
 "The radiation and convection loss",
 ["The moisture loss on each basis",
  "The unburned and other loss",
  "The dry flue gas loss on LHV"],
 "Radiation prints 1.8000 on all four rows: current and target, LHV and HHV. Moisture prints 1.8088 on LHV and 11.2450 on HHV, unburned 0.0000, and the LHV dry loss 9.9883 then 8.5436.")

q(2, "stackLossEfficiency returns an LHV efficiency with a comparison warning. What does that warning say?",
 "This efficiency is on LHV. An efficiency on the other basis is a different number for the same heater and the two must not be compared.",
 ["This efficiency is on LHV. An efficiency on the other basis is the same number less the latent heat, and the two may then be compared freely.",
  "This efficiency is on LHV. Convert it to HHV with the typical 890.8 before it is set against an efficiency on the other basis.",
  "This efficiency is on LHV. On the other basis the same heater reads 8.4741 points higher, and the two must be compared that way."],
 "The comparison warning on LHV, verbatim: \"This efficiency is on LHV. An efficiency on the other basis is a different number for the same heater and the two must not be compared.\" The stack loss section prints the HHV figure 8.4741 points lower, 77.9288 against 86.4029.")

q(0, "The heater's flue gas specific heat is not supplied. Which answer does stackLossEfficiency give?",
 "REFUSED: A flue gas specific heat is required.",
 ["No refusal: the typical 1.1 kJ/kg K is used.",
  "REFUSED: A stack temperature and a combustion air temperature are required.",
  "No refusal: 1.95 is taken from the vapour."],
 "A missing flue gas cp draws its own one-line refusal. The Isiokpo calls pass the typical 1.1, and 1.95 kJ/kg K belongs to water vapour.")

q(3, "At a dry reading of 4 percent, how much air does the invented Isiokpo fuel take, in kmol per kmol fuel?",
 "12.099847",
 ["11.123347",
  "13.156347",
  "11.364257"],
 "The 4 percent line carries actual air 12.099847, dry flue gas 11.123347 and wet flue gas 13.156347, with 21.2938 percent excess air. 11.364257 is the actual air at 2.8 percent.")

q(2, "Held item H2 sets two computed-here figures beside the engine's typical methane pair. Which?",
 "A difference of 88.2, and 87.985 MJ for two moles of water condensed at the engine's latent heat",
 ["A difference of 87.985, and 88.2 MJ for two moles of water condensed at the engine's latent heat",
  "A corrected methane HHV that replaces 890.8 in FUEL_REFERENCE from this course onward, graded",
  "A difference of 88.2 that the course grades, and an ISO 6976 value of 87.985 to be filed instead"],
 "The course prints both as computed here: 88.2 between the typical LHV and HHV, and 87.985 MJ from 2 x 18.015 kg at 2442 kJ/kg. H2 is a stated limit; nothing in it is graded or corrected.")

q(1, "In the course's sweep for the invented Isiokpo heater, how much fuel a year does a 4.5 percent target save on LHV?",
 "2782.362 GJ",
 ["5214.422 GJ",
  "6742.370 GJ",
  "8337.934 GJ"],
 "The 4.5 row prints target efficiency 86.9933, fuelSavingPercent 0.6786 and annualEnergySavedGJ 2782.362. 5214.422 is the 3.5 row, 6742.370 the 2.8 row and 8337.934 the 2.0 row, all against 410000 GJ a year (invented).")

q(1, "The invented Isiokpo tuning sweep's lowest target sits on the declared 2 percent floor. What target efficiency on LHV does it print there?",
 "88.1965 percent",
 ["87.8476 percent",
  "87.5160 percent",
  "86.9933 percent"],
 "The 2.0 target prints 88.1965 percent and 8337.934 GJ a year. 87.8476 goes with 2.8, 87.5160 with 3.5 and 86.9933 with 4.5.")

q(3, "What does the second sentence of the engine's tuning method say subtracting the efficiency percentages does to the saving?",
 "It understates the saving.",
 ["It overstates the saving.",
  "It leaves the saving on LHV unchanged.",
  "It doubles the saving on HHV alone."],
 "The second sentence ends on the word understates, and names the cause: a divisor of a hundred where the target efficiency belongs. On the Isiokpo figures the course's shortcut lands 819.363 GJ a year short.")

q(0, "The engine's tuning method opens by holding one thing fixed while fuel scales inversely with efficiency. What is it?",
 "The duty",
 ["The fuel burned",
  "The excess air",
  "The stack temperature"],
 "The method's first sentence says fuel scales inversely with efficiency at the same duty.")

q(2, "The invented Isiokpo trap is called with no downstream pressure at all. Where does the course say it is taken to discharge?",
 "To atmosphere, ATMOSPHERE_BAR_A, 1.01325 bar a.",
 ["At 5 bar a downstream, still choked.",
  "At its critical ratio, 0.5774 of 9 bar a.",
  "Nowhere: the call is refused as blank."],
 "In the course, with no downstream pressure given the trap vents to ATMOSPHERE_BAR_A, 1.01325 bar a. A downstream box present but blank is refused; a box left out takes the atmosphere default.")

q(1, "Raise the invented Isiokpo trap's downstream pressure to 6 bar a. What happens to choked, and to the year's loss?",
 "Choked false, 348.419 tonnes a year",
 ["Choked true, 355.757 tonnes a year",
  "Choked false, 315.643 tonnes a year",
  "Choked true, 348.419 tonnes a year"],
 "Its ratio, 0.666667, is above the critical 0.577430, so choked is false and the loss falls to 41.4785 kg an hour. Choked rows lose 355.757 tonnes; 315.643 goes with 7 bar a.")

q(3, "The course states the critical pressure ratio at or below which a trap's flow is choked. Which expression is it?",
 "(2/(k+1))^(k/(k-1))",
 ["(2/(k+1))^((k-1)/k)",
  "(2/(k-1))^(k/(k+1))",
  "(1/(k+1))^(k/(k-1))"],
 "In the course, the flow is choked while the downstream pressure over the upstream is at or below the critical ratio (2/(k+1))^(k/(k-1)). The course prints it as 0.577430 at k = 1.135 and 0.5457 at 1.3.")

q(0, "The trap's discharge coefficient is not given. Which answer does the engine give?",
 "REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed.",
 ["No refusal: the coefficient is taken at the record's 0.72, the Isiokpo trap's typed figure, and the loss prints at 42.3520 kg an hour as before.",
  "REFUSED: An orifice diameter, an upstream pressure and a steam density are required.",
  "No refusal: the coefficient is read as 1, and the fuel and carbon are marked as absent."],
 "The course prints the blank discharge coefficient refused with that sentence. 0.72 is the Isiokpo trap's typed coefficient (invented). The orifice refusal answers a blank orifice.")

q(2, "At the stated exponent of 1.135 and an invented 22 USD a tonne, what annual cost does the course print for the trap's lost steam?",
 "7826.65 USD",
 ["8216.58 USD",
  "22176.00 USD",
  "54432.00 USD"],
 "The 1.135 row prints 355.757 tonnes a year and 7826.65 USD. 8216.58 is the 1.3 row, and 22176.00 and 54432.00 are the condensate case's raw water and treatment lines.")

q(1, "The course prints the trap's carbon chain as relations. How is its 63.721 tCO2e a year formed?",
 "1135.851 GJ x 56.1 kg CO2e per GJ / 1000",
 ["355.757 t x 56.1 kg CO2e per GJ / 1000",
  "1135.851 GJ x 56.1 x 0.83 / 1000",
  "1192.439 GJ x 56.1 kg CO2e per GJ / 1000"],
 "In the course, annual tCO2e = GJ x kg per GJ / 1000 = 63.721, on the annual fuel 1135.851 GJ and the SYNTHETIC 56.1 kg CO2e per GJ. The boiler efficiency 0.83 enters one step earlier, in the fuel. 1192.439 GJ is the fuel of the 1.3 row.")

q(3, "Switch the trap's steam to superheated, exponent 1.3. What carbon a year does the course then print, in tCO2e?",
 "66.896",
 ["63.721",
  "56.1",
  "742.220"],
 "The 1.3 row prints 44.4620 kg an hour, 373.481 tonnes a year, 8216.58 USD, 1192.439 GJ and 66.896 tCO2e. 63.721 is the 1.135 row, 56.1 the SYNTHETIC kg CO2e per GJ, and 742.220 the condensate case.")

q(2, "What does the course compute from the engine's figures for the gap between the 1.3 and 1.135 exponent rows of the trap?",
 "17.724 tonnes a year more at 1.3, a ratio of 1.049821",
 ["17.724 tonnes a year less at 1.3, a ratio of 1.049821",
  "1.049821 tonnes a year more at 1.3, a ratio of 17.724",
  "355.757 tonnes a year more at 1.3, a ratio of 0.5457"],
 "In the course, at the superheated exponent the same trap loses 17.724 tonnes a year more, a ratio of 1.049821 to the saturated figure (computed here). 373.481 against 355.757 tonnes a year.")

q(2, "The choked-flow note for the invented Isiokpo trap names a pressure ratio of 0.1126. Which call is that ratio from?",
 "The call with no downstream pressure given",
 ["The call at 3 bar a downstream",
  "The critical ratio at the saturated exponent",
  "The call at 8 bar a downstream"],
 "The trap's record gives no downstream pressure, and with none given the course takes it to vent to atmosphere, 1.01325 bar a; the choked-flow note printed for it names 0.1126. The downstream table prints 3 bar a at 0.333333 and 8 bar a at 0.888889, and the same note names the critical 0.5774 at 1.135.")

q(1, "Someone types 9000 into the trap's hours box. Which answer comes back?",
 "REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.",
 ["No refusal: the hours are cut to 8784 and the loss is printed for a full year of service.",
  "No refusal: the stated default of 8760 hours is used, and the loss is 371.004 tonnes a year.",
  "REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam."],
 "9000 is above the 8784 bound the refusal states, and the course prints it refused in the blank's words. Only hours left out of the call entirely reach the 8760 default.")

q(3, "With the treatment cost priced on the invented Isiokpo condensate case, which line does the course print as 54432.00 USD?",
 "Treatment not repeated",
 ["Raw water not bought",
  "Fuel not burned reheating makeup",
  "The trap's annual steam cost"],
 "The course prints Fuel not burned reheating makeup 99227.28, Raw water not bought 22176.00 and Treatment not repeated 54432.00 USD. The trap's cost, 7826.65 USD, is the steam trap lesson's.")

q(0, "A return fraction of 1.2 is typed as the target of the invented condensate case. Which answer comes back?",
 "REFUSED: Return fractions must lie between 0 and 1.",
 ["REFUSED: The target return (0.25) is below the current return (0.35). Returning less condensate is a cost, so there is nothing to value.",
  "No refusal: the return is capped at 1 and complete prints true.",
  "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."],
 "The course prints the target of 1.2 refused with \"Return fractions must lie between 0 and 1.\" The target-below-current refusal answers a target of 0.25 against 0.35, and the boiler efficiency refusal a blank boiler efficiency.")

q(2, "pinchTargets is handed streams whose supply and target temperatures are all equal. What does the course print?",
 "REFUSED: No stream changes temperature, so there is nothing to target.",
 ["No refusal: both utilities print 0.000 kW and threshold problem prints true.",
  "REFUSED: A minimum approach temperature is required and must not be negative.",
  "No refusal: every stream is read as cold, and the cold utility is 0.000 kW."],
 "The course prints that refusal for a set of streams where nothing changes temperature. The minimum approach refusal answers a blank approach.")

q(0, "Which pair of condensate figures does the course print the same with the treatment cost priced and with it left blank?",
 "40320.000 t of extra condensate and 13230.304 GJ saved a year",
 ["175835.28 USD annualValue and complete true in both columns",
  "54432.00 USD of treatment and 742.220 tCO2e in both columns",
  "121403.28 USD annualValue and 13230.304 GJ saved a year"],
 "Both columns print extraCondensateTonnesPerYear 40320.000 and energySavedGJPerYear 13230.304, and annualTonnesCo2e 742.220. Treatment not repeated is 54432.00 priced and none blank, and annualValue is 175835.28 against 121403.28, complete true against false.")

q(1, "Four invented Isiokpo streams are printed in the pinch lesson. Which one is cold, by the course's rule?",
 "C2 stabiliser feed, 57 C to 104 C: its supply is below its target.",
 ["H2 lean oil cooler, 118 C to 41 C: its supply is above its target.",
  "H1 compressor aftercooler, 163 C to 48 C: its CP is 3.15 kW/K.",
  "H2 lean oil cooler, 118 C to 41 C: its CP is 5.7 kW/K."],
 "In the course, a stream is hot when its supply is above its target. C2 goes from 57 to 104 C, so it is cold, as C1 is. H1 and H2 have supplies above their targets and are hot, whatever their CP.")

q(3, "In the course's problem table at 15 C for the invented Isiokpo streams, what surplus does the interval from shifted 148.500 C to 111.500 C carry?",
 "-44.400 kW",
 ["22.050 kW",
  "-3.600 kW",
  "96.600 kW"],
 "The row prints CP hot 3.150000, CP cold 4.350000, surplus -44.400 and heat flow below 3.600. 22.050 is the interval above it, -3.600 the interval below, and 96.600 the interval from 110.500 to 64.500.")

q(0, "Starting from the hot utility at the top of that 15 C cascade, what heat flow sits under the first interval?",
 "48.000 kW",
 ["22.050 kW",
  "25.950 kW",
  "3.600 kW"],
 "The cascade starts from the hot utility, 25.950 kW, at the top; the first interval's surplus is 22.050 kW, and the heat flow below it prints 48.000 kW. 3.600 kW is the heat flow below the second interval.")

q(2, "A stream with a heat capacity flowrate of -2 is passed to pinchTargets. What does the course print?",
 "REFUSED: A heat capacity flowrate cannot be negative. Whether a stream is hot or cold is set by its supply and target temperatures.",
 ["No refusal: a CP of -2 marks the stream as cold, and it is cascaded at 2 kW/K on the cold side of the table.",
  "REFUSED: A minimum approach temperature is required and must not be negative.",
  "REFUSED: No stream changes temperature, so there is nothing to target."],
 "The course prints the CP of -2 refused with that sentence, and lists it among the rules in force. The approach refusal answers a blank minimum approach, and the last refusal a set of streams that never change temperature.")

q(1, "The course's threshold problem runs one hot and one cold stream at a 10 C minimum approach. What cold utility does it print?",
 "1470.000 kW",
 ["1480.000 kW",
  "1300.000 kW",
  "240.150 kW"],
 "The threshold row prints hot utility 0.000, cold utility 1470.000, pinch hot none and threshold problem true. 1480.000 and 1300.000 are points on its heat flow table, and 240.150 kW is the Isiokpo cold utility at 15 C.")

q(3, "How does the course say the streams are shifted before the problem table is cascaded?",
 "Hot streams down and cold streams up, by half the minimum approach.",
 ["Hot streams up and cold streams down, by half the minimum approach.",
  "Hot streams down and cold streams up, by the whole minimum approach.",
  "Cold streams down by the whole minimum approach, hot streams unmoved."],
 "In the course, hot streams are shifted down and cold streams up by half the minimum approach; the cascade below already carries the hot utility at the top. At 15 C the heat flow is zero at shifted 110.500 C, reported as 118.000 C hot and 103.000 C cold.")

q(0, "Tighten the minimum approach to 10 C. How much hot utility do the four invented Isiokpo streams then need?",
 "1.800 kW",
 ["25.950 kW",
  "59.700 kW",
  "0.000 kW"],
 "1.800 kW of hot utility and 216.000 kW of cold at 10 C, pinched at 118.000 C and 108.000 C. At 15 C the hot utility is 25.950 and at 20 C 59.700; the threshold case needs 0.000.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/intermediate/cefi_exam.json', label='cefi_exam', expect_n=42)
finish()
