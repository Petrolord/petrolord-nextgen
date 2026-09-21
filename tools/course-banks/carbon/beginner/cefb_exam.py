import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Associate tier exam, 42 questions over all six modules. Digest sections 1 to 10 and 25.

q(2, "The course separates a blank box from an argument left out of the call. How does each reach the engine?",
 "A blank arrives as an empty string or null; a left-out argument takes its stated default.",
 ["Both arrive as 0, and the interval check on the destruction efficiency refuses each of them.",
  "A blank takes the stated default; an argument left out of the call is refused as required.",
  "Both take the stated default wherever one exists, and are refused only where none exists."],
 "The course opens with this distinction. It prints a blank or a null flare efficiency refused as required, and the same argument left out of the call answering destructionEfficiencyFraction 1, its stated default of complete combustion.")

q(0, "Which module does the Carbon Footprint & Abatement Studio call?",
 "carbonAbatement",
 ["energyEfficiency",
  "energyEfficiency, through priceSaving",
  "energyEfficiency for its fuel table"],
 "The course pairs each studio with one module: the Carbon Footprint & Abatement Studio with carbonAbatement, the Efficiency Studio with energyEfficiency.")

q(3, "Which label does the Scope 2 total carry in buildInventory's output?",
 "Scope 2 (purchased energy)",
 ["Scope 2 (direct)",
  "Scope 2 (energy and travel)",
  "Scope 2 (indirect, all other)"],
 "The lab's totals table reads Scope 1 (direct), Scope 2 (purchased energy) and Total, Scope 1 and Scope 2.")

q(1, "Refusing an intensity with no boundary, the engine names two figures that differ for one plant. Which two?",
 "Tonnes per tonne charged and tonnes per tonne of saleable product",
 ["Tonnes per barrel produced and tonnes per barrel exported",
  "The Scope 1 intensity and the Scope 2 intensity of one plant",
  "tCO2e on the AR6 sets and tCO2e on the AR5 sets of one year"],
 "The carbonIntensity refusal the engine returns names tonnes per tonne charged and tonnes per tonne of saleable product. The Igbogene boundaries are per barrel, and they are inputs to the call.")

q(1, "Which factor unit does the Purchased electricity line carry?",
 "tCO2/MWh",
 ["tCO2/tCO2",
  "tCH4/t",
  "tCH4/tCH4"],
 "The lab prints the factor unit tCO2/MWh on Purchased electricity, beside Igbogene's invented factor of 0.41. tCO2/tCO2 and tCH4/tCH4 belong to the atom-balance lines and tCH4/t to the vented line.")

q(3, "Typing 98 as the flare's efficiency, meant as a percentage, produces what?",
 "REFUSED: The destruction efficiency must lie in (0, 1].",
 ["It computes at 0.98, reading the 98 as a percentage",
  "It computes at the stated default of complete combustion",
  "REFUSED: A fuel quantity and a carbon content cannot be negative."],
 "The engine returns this refusal for 98 typed as a percentage, the same sentence it returns for 0. The flare's stated efficiency is typed as the fraction 0.98.")

q(0, "Which pair does the 1000 kmol table print at 0.99?",
 "43.569 t of CO2 and 0.160 t of methane",
 ["44.009 t of CO2 and 0.160 t of methane",
  "43.129 t of CO2 and 0.321 t of methane",
  "43.569 t of CO2 and 0.802 t of methane"],
 "Row 0.99 of the lesson's table: co2Tonnes 43.569, ch4Tonnes 0.160. 44.009 belongs to complete combustion, and 0.321 and 0.802 are the methane at 0.98 and 0.95.")

q(2, "Typed at 1.15 kmol of carbon per kmol, with the fuel unchanged, what do the Igbogene heaters emit?",
 "24394.189 t",
 ["23121.448 t",
  "21212.338 t",
  "25799.177 t"],
 "The carbon per kmol table in the course gives 24394.189 at 1.15. 25799.177 is not a heater figure; it is an inventory total with two blocked lines.")

q(3, "Which pair is the Igbogene heaters' 0.999 row?",
 "co2Tonnes 23098.327, ch4Tonnes 8.429",
 ["co2Tonnes 23121.448, ch4Tonnes 8.429",
  "co2Tonnes 23005.841, ch4Tonnes 42.143",
  "co2Tonnes 23098.327, ch4Tonnes 42.143"],
 "The course's lower-efficiency table: 0.999 gives 23098.327 and 8.429; 0.995 gives 23005.841 and 42.143.")

q(1, "Which carbonAbatement constant reads 12.011?",
 "MW_C, the molar mass of carbon",
 ["MW_CH4, the molar mass of methane",
  "MW_CO2, the molar mass of CO2",
  "SCOPE, beside ONE 1 and TWO 2"],
 "The course's constants block lists MW_C as 12.011, beside MW_CO2 44.009 and MW_CH4 16.043.")

q(0, "Which FUEL_REFERENCE row is marked inert and still carries one carbon atom?",
 "CO2, Carbon dioxide (inert)",
 ["N2, Nitrogen (inert)",
  "CH4, Methane",
  "C2H6, Ethane"],
 "In FUEL_REFERENCE the CO2 row has C 1, O 2 and inert yes; N2 is inert with no carbon.")

q(2, "Which figure is the Igbogene flare's CO2 when it burns at 0.9?",
 "2012.884",
 ["2124.711",
  "2236.537",
  "2191.807"],
 "The flare row at 0.9 in the lab reads co2Tonnes 2012.884, beside 81.531 t of methane.")

q(3, "Which row of the flare table totals 2457.133 tCO2e?",
 "0.99, with 8.153 t of methane",
 ["0.98, with 16.306 t of methane",
  "0.95, with 40.765 t of methane",
  "0.9, with 81.531 t of methane"],
 "In the lab the 0.99 row prints a flare total of 2457.133 and ch4Tonnes 8.153. Rows 0.98, 0.95 and 0.9 total 2677.729, 3339.515 and 4442.493.")

q(1, "Read the 0.95 row of the Igbogene flare table. What is ch4Tonnes?",
 "40.765 t of methane",
 ["81.531 t of methane",
  "16.306 t of methane",
  "1214.805 t of methane"],
 "The lab's flare table, row 0.95: ch4Tonnes 40.765. Its methane line, 1214.805, is in tCO2e and is a different quantity.")

q(2, "The escaped-carbon note ends with an instruction for a user holding a measurement. What is it?",
 "Override it",
 ["File the measurement in the compliance register",
  "Switch the set to the non-fossil methane value",
  "Leave the flare efficiency blank until refused"],
 "The last sentence of the escaped-carbon note the course quotes is \"Override it if you have measured otherwise.\"")

q(0, "A source is kept outside the boundary on purpose, excluded true. How many lines does atomBalanceLines hand the inventory?",
 "0 lines",
 ["1 blocked line",
  "2 lines at 0.000 t",
  "1 unsourced line"],
 "The course prints 0 lines for excluded true. A refused flare, by contrast, arrives as one blocked line labelled Flaring.")

q(3, "On the AR5 non-fossil set, the flare's escaped carbon becomes a line of how many tCO2e?",
 "456.571 tCO2e",
 ["440.265 tCO2e",
  "489.183 tCO2e",
  "485.922 tCO2e"],
 "456.571 is the AR5 non-fossil entry in the lab's methane table; 440.265 and 489.183 are AR6 non-fossil and AR5 fossil.")

q(1, "How far above or below the course set does the course place the Igbogene total on AR5 fossil methane?",
 "31.661 tCO2e",
 ["-443.257 tCO2e",
  "-284.951 tCO2e",
  "0.000 tCO2e"],
 "The lab reads 42977.438 for AR5 fossil, and its computed-here column puts that 31.661 above the course set's 42945.777.")

q(2, "The held item H1 records where AR5 and AR6 each stand. What does it say?",
 "AR5 is what UNFCCC reporting has required; AR6 is what the GHG Protocol now recommends.",
 ["AR6 is what UNFCCC reporting has required; AR5 is what the GHG Protocol now recommends.",
  "AR5 and AR6 are both what UNFCCC reporting requires, so the course recommends AR6.",
  "AR6 is what Nigerian regulation requires; AR5 is kept only for comparing old years."],
 "Held item H1 prints both positions and then holds the choice: a regulatory reading and the owner's decision, graded nowhere.")

q(0, "What N2O value sits in the course's own set?",
 "273",
 ["265",
  "29.8",
  "27"],
 "The course's set is CH4 29.8 and N2O 273. The AR5 sets carry 265.")

q(3, "makeGwpSet is given a label and no values. What does the set read?",
 "declared false",
 ["declared true",
  "declared true, with 0 gases",
  "refused, with no set at all"],
 "The course's declared table reads false for a label with no values and false for values with no label.")

q(1, "The flare efficiency is entered with the GWP set already declared. What reasons for not being reportable does buildInventory then give?",
 "1 factor(s) have no source or version; 1 line(s) could not be computed",
 ["the global warming potential set is not declared; 3 line(s) could not be computed",
  "1 factor(s) have no source or version; 2 line(s) could not be computed",
  "none, and reportable reads true"],
 "That is the \"flare efficiency entered\" row of the lab's steps: 5 lines, Scope 1 30030.777, and the electricity factor still blank.")

q(0, "At which step does the Igbogene Scope 2 total first read 12915.000 tCO2e?",
 "The electricity factor entered with its source",
 ["The GWP set declared",
  "The flare efficiency entered",
  "The first pass"],
 "The lab gives Scope 2 as 0.000 on the first three rows; the electricity factor entered with its source brings in the 12915.000.")

q(2, "Across the five Igbogene steps, what does the computed flag read?",
 "true at every step",
 ["false until the survey is referenced",
  "false in the first pass only",
  "true once the set is declared"],
 "Every row of the lab's step table reads computed true. The reportable flag is the one that turns, on the last row.")

q(3, "The vented activity is typed as -142 t and the electricity factor as -0.41. What does that inventory return?",
 "a total of 25799.177 tCO2e with reportable false",
 ["a total of 42945.777 tCO2e with reportable true",
  "a total of 25799.177 tCO2e with reportable true",
  "a refusal of the whole inventory, with no total"],
 "The engine blocks both negative lines and prints the inventory at 25799.177, reportable false, with 2 line(s) that could not be computed.")

q(1, "Which Scope 2 intensity does the inlet to export boundary carry?",
 "0.00353836",
 ["0.00822761",
  "0.00535892",
  "0.01176597"],
 "The lab's inlet to export row: Scope 1 0.00822761, Scope 2 0.00353836, total 0.01176597. 0.00535892 is the crude export only Scope 2.")

q(0, "Which denominator and unit sit under the boundary \"Igbogene crude export only\"?",
 "2410000 barrels of oil exported",
 ["3650000 barrels of oil exported",
  "2410000 barrels of oil equivalent produced",
  "3650000 barrels of oil equivalent produced"],
 "The two boundary rows of the lab carry 3650000 in barrels of oil equivalent produced and 2410000 in barrels of oil exported, both invented.")

q(3, "The inventory disclaimer warns against keeping a second copy of obligations in the inventory. What would the copy create?",
 "Two records that could disagree",
 ["A blocked line for each obligation",
  "A total that counts each tonne twice",
  "An unsourced factor in the register"],
 "The disclaimer ends: a second copy here would create two records that could disagree.")

q(2, "Which share of the complete total belongs to the vented and fugitive methane?",
 "0.098534",
 ["0.300728",
  "0.538387",
  "0.011315"],
 "From the lab's share table (computed here): 0.098534 for vented methane, 0.300728 for electricity, 0.538387 for the heaters.")

q(1, "Which activity and factor does the Vented and fugitive methane line carry?",
 "142.000 t CH4 at a factor of 1 tCH4/t",
 ["16.306 t CH4 at a factor of 1 tCH4/tCH4",
  "142.000 t CH4 at a factor of 29.8 tCH4/t",
  "4231.600 t CH4 at a factor of 1 tCH4/t"],
 "The lab gives the vented line an activity of 142.000 t CH4 and a factor of 1 tCH4/t. 29.8 is the CH4 value of IPCC AR6 GWP100, fossil methane, the line's GWP; 4231.600 is its tCO2e.")

q(0, "A blocked electricity line leaves the inlet to export total intensity equal to which figure of the complete inventory?",
 "Its Scope 1 intensity, 0.00822761",
 ["Its Scope 2 intensity, 0.00353836",
  "Its total intensity, 0.01176597",
  "Its crude export Scope 1, 0.01246090"],
 "The course compares the two and prints them as the same figure: with the Scope 2 line blocked, the total is Scope 1 alone.")

q(3, "Held item H2 names the engine's typical heating values for methane. Which pair does it give?",
 "802.6 LHV and 890.8 HHV MJ per kmol",
 ["890.8 LHV and 802.6 HHV MJ per kmol",
  "1428.6 LHV and 1560.7 HHV MJ per kmol",
  "241.8 LHV and 285.8 HHV MJ per kmol"],
 "The course, H2: the engine's typical methane heating values are 802.6 LHV and 890.8 HHV MJ per kmol; the pair is labelled typical and the fuel analysis governs. FUEL_REFERENCE prints 1428.6 and 1560.7 for ethane and 241.8 and 285.8 for hydrogen.")

q(2, "How many lines does the Igbogene first pass build, and how many of them are blocked?",
 "4 lines, 3 of them blocked",
 ["5 lines, 3 of them blocked",
  "4 lines, 1 of them blocked",
  "5 lines, none of them blocked"],
 "The lab counts the first pass at 4 lines, with 3 blocked and 0 unsourced.")

q(1, "21212.338 t of CO2 is the heaters' figure at which carbon per kilomole of fuel?",
 "1.00",
 ["1.05",
  "1.09",
  "1.15"],
 "In the course's table, 1.00 is the row at 21212.338; 1.09 is the Igbogene input.")

q(0, "Which co2Tonnes figure belongs to the flare's 0.99 row?",
 "2214.172",
 ["2191.807",
  "2236.537",
  "2457.133"],
 "Flare row 0.99 in the lab reads co2Tonnes 2214.172; 2457.133 on that row is the total in tCO2e.")

q(3, "How does the engine's note describe counting escaped carbon as methane?",
 "As the usual and conservative assumption",
 ["As a measured result for each flare",
  "As the AR6 non-fossil convention",
  "As a default set by the owner"],
 "The course's note calls it \"the usual and conservative assumption\" and says to override it if you have measured otherwise. H3 holds it as the engine's stated assumption.")

q(2, "Typed at 0.95 in place of the stated 0.98, where does the flare's unburned methane line go?",
 "From 485.922 to 1214.805 tCO2e",
 ["From 485.922 to 2429.610 tCO2e",
  "From 16.306 to 40.765 tCO2e",
  "Nowhere; only the CO2 line moves"],
 "From the 0.98 row to the 0.95 row of the lab's flare table the methane line goes from 485.922 to 1214.805 tCO2e. 16.306 and 40.765 are tonnes of methane.")

q(1, "Switched from the AR6 fossil set to the AR6 non-fossil set, where does the flare's unburned methane line go?",
 "To 440.265 tCO2e",
 ["To 489.183 tCO2e",
  "To 456.571 tCO2e",
  "Nowhere; it stays 485.922"],
 "The lab lists the flare's methane line as 485.922 on AR6 fossil and 440.265 on AR6 non-fossil; the AR5 figures are 489.183 and 456.571.")

q(3, "Which Igbogene figure holds still across all four GWP sets?",
 "Scope 2, 12915.000 tCO2e",
 ["Scope 1, 30030.777 tCO2e",
  "The total, 42945.777 tCO2e",
  "The vented line, 4231.600 tCO2e"],
 "Scope 2 is a CO2 line with a GWP of 1 whatever the set, so the lab prints 12915.000 four times.")

q(0, "Which flare tCO2e sits on the stated 0.98 row?",
 "2677.729 tCO2e",
 ["2236.537 tCO2e",
  "2191.807 tCO2e",
  "3339.515 tCO2e"],
 "The lab's flare row at 0.98 prints a flare total of 2677.729, of which 2191.807 is CO2.")

q(2, "Which sentence explains a scope 3 line's block?",
 "scope 3 is not Scope 1 or Scope 2, which is all this inventory totals",
 ["A registered emission factor is required.",
  "no global warming potential for CH4 in the declared set",
  "a negative activity: an emission line cannot remove tonnes"],
 "The lab prints this reason for the scope 3 Business travel line. The factor refusal belongs to Diesel generators, the missing GWP blocks the vented methane in the first pass, and the negative activity blocks the vented methane typed as -142 t.")

q(1, "Which boundary's intensity is stated in tCO2e per barrel of oil equivalent produced?",
 "Igbogene flow station and gas plant, inlet to export",
 ["Igbogene crude export only",
  "Igbogene fired heaters and flare only",
  "Igbogene Scope 1 lines only"],
 "The lab gives the inlet to export boundary in barrels of oil equivalent produced and crude export only in barrels of oil exported.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/beginner/cefb_exam.json', expect_n=42)
finish()
