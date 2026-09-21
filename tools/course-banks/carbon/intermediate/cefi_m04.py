import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Professional m04, what tuning is worth.
# Draws on m04's four lessons only: digest SECTION 14 (excessAirSaving on the
# invented Isiokpo heater) and the stack loss efficiencies it takes. The 2
# percent safe floor and the 410000 GJ a year on LHV are invented. The
# percentage-point shortcut is the digest's arithmetic, a wrong route shown
# for contrast, and no question keys it as a saving.

q(1, "The course prints the engine's method for the saving from tuning the invented Isiokpo heater. Which ratio does it give?",
 "(target - current) / target",
 ["(target - current) / current",
  "(target - current) / a hundred",
  "(target - current) / (target + current)"],
 "The method, verbatim: \"Fuel scales inversely with efficiency at the same duty, so the saving is (target - current) / target. The divisor is the target efficiency. Subtracting the efficiency percentages divides by a hundred and understates the saving.\"")

q(3, "The course works the percentage-point shortcut on the invented Isiokpo figures, 410000 GJ a year on LHV. What does it print for it?",
 "5923.008 GJ a year, 819.363 GJ below the engine's saving.",
 ["5923.008 GJ a year, 819.363 GJ above the engine's saving.",
  "6742.370 GJ a year, the same figure the engine returns.",
  "8337.934 GJ a year, the figure the 2.0 percent row prints."],
 "The course, computed here from the engine's efficiencies: a saving fraction of 0.0144463600, which is 5923.008 GJ a year, 819.363 GJ below the engine's saving. The engine's own sentence says subtracting the percentages understates the saving. 6742.370 is annualEnergySavedGJ and 8337.934 the 2.0 row of the sweep.")

q(0, "Which figure in the lesson is the saving fraction of the percentage-point shortcut, the course's own arithmetic on the invented Isiokpo efficiencies?",
 "0.0144463600",
 ["0.0164448058",
  "0.0164763814",
  "6742.370"],
 "The lesson prints the shortcut's fraction as 0.0144463600 and marks it computed here; the engine does not return it. 0.0164448058 is the engine's fuelSavingFraction on LHV, 0.0164763814 the HHV fraction from the two HHV efficiencies of the stack loss section, and 6742.370 is annualEnergySavedGJ.")

q(2, "The invented Isiokpo tuning is asked for a target of 1.5 percent oxygen against the 2 percent floor declared after a combustion test. What does the course print?",
 "REFUSED: A target of 1.5 percent oxygen is below the 2 percent declared safe for this burner. Raise the target or re-declare the floor after a combustion test.",
 ["REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.",
  "No refusal: the saving is printed above the 8337.934 GJ a year of the 2.0 row, with a note that the target sits below the floor.",
  "REFUSED: A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control."],
 "The course prints the 1.5 percent target refused with that sentence, naming both figures. The target-required refusal answers a blank target and the floor refusal a blank floor. The sweep prints no row below the floor.")

q(1, "A tuning call for the invented Isiokpo heater gives a current reading and a safe floor but leaves the target empty. Which answer comes back from excessAirSaving?",
 "REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.",
 ["No refusal: the target is taken at the 2 percent floor and the saving prints as 8337.934 GJ a year.",
  "No refusal: the target is taken at 2.8 percent, the Isiokpo case, and the saving prints as 6742.370 GJ.",
  "REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared."],
 "The course prints the blank target refused with that sentence. 8337.934 GJ is the 2.0 row and 6742.370 GJ the 2.8 row, each a typed target. The different-bases refusal answers a current efficiency on LHV with a target on HHV.")

q(3, "excessAirSaving is given a current efficiency on LHV and a target efficiency on HHV for the invented Isiokpo heater. What does the course print?",
 "REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared.",
 ["No refusal: the engine converts the HHV target to LHV and prints fuelSavingPercent 1.6445.",
  "No refusal: basis HHV and a fuelSavingPercent of 1.6476, the HHV fraction as a percent.",
  "REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor."],
 "The course prints the mixed pair refused with that sentence. 1.6445 is the LHV fuelSavingPercent from two LHV efficiencies and 1.6476 the HHV figure from two HHV efficiencies. The target-required refusal answers a blank target.")

q(2, "Reading the sweep table, which saving percent does the 3.5 percent target carry?",
 "1.2718",
 ["0.6786",
  "2.0336",
  "1.6445"],
 "fuelSavingPercent 1.2718 belongs to the 3.5 percent target, beside 5214.422 GJ a year. The 4.5 target carries 0.6786, the floor at 2.0 carries 2.0336 and the Isiokpo 2.8 target 1.6445.")

q(0, "Which target row of the course's sweep sits on the declared 2 percent floor of the invented Isiokpo burner, and what does it save a year?",
 "The 2.0 row, 8337.934 GJ a year",
 ["The 2.8 row, 6742.370 GJ a year",
  "The 3.5 row, 5214.422 GJ a year",
  "The 1.5 row, a saving above 8337.934 GJ"],
 "The sweep prints targets of 2.0, 2.8, 3.5 and 4.5 percent, every one at or above the declared floor, and the 2.0 row saves 8337.934 GJ a year at 88.1965 percent on LHV. A target of 1.5 percent against the 2 percent floor is refused.")

q(1, "How does excessAirSaving arrive at annualEnergySavedGJ 6742.370 for the invented Isiokpo heater?",
 "It multiplies fuelSavingFraction 0.0164448058 by the 410000 GJ of fuel a year it is given.",
 ["It multiplies the shortcut fraction 0.0144463600 by the 410000 GJ of fuel a year it is given.",
  "It multiplies fuelSavingPercent 1.6445 by the heater's duty, taken from the fuel analysis.",
  "It divides the 410000 GJ a year by the target efficiency of 87.8476 and subtracts the fuel."],
 "The course prints the fraction, 0.0164448058, and the fuel it is applied to, 410000 GJ a year on LHV (invented); annualEnergySavedGJ is 6742.370. The course's shortcut applies 0.0144463600 to the same fuel and gets 5923.008 GJ.")

q(3, "The course prints a saving fraction of 0.0164763814 for the same invented tuning on HHV. What does it say about the fuel figure that fraction multiplies?",
 "The engine multiplies the fraction by the fuel it is given, and matching its basis is the caller's job.",
 ["The engine converts the 410000 GJ to HHV before it multiplies, so the basis always matches.",
  "The engine refuses any annual fuel figure that is not labelled with its heating value basis.",
  "The engine takes the fuel on HHV from the typical 890.8 and prints an annual HHV saving."],
 "The course states: \"The engine multiplies a saving fraction by the annual fuel it is given, and the basis of that fuel figure is the caller's to match.\" It prints no annual HHV saving in gigajoules, and the 410000 GJ it prints is stated on LHV.")

q(0, "Which efficiency sits on the bottom of the engine's saving ratio for the invented Isiokpo tuning on LHV?",
 "The target efficiency, 87.8476 percent.",
 ["The current efficiency, 86.4029 percent.",
  "A hundred percent, the shortcut's divisor.",
  "The HHV target efficiency, 79.2343 percent."],
 "The method: the saving is (target - current) / target, so the target efficiency sits below the line, 87.8476 percent on LHV at 2.8 percent oxygen. Dividing by a hundred is the shortcut the same sentence says understates the saving.")

q(2, "What fuelSavingPercent does the course print for the same invented tuning, 5.5 to 2.8 percent oxygen, on HHV?",
 "1.6476",
 ["1.6445",
  "2.0336",
  "1.2718"],
 "On HHV the same tuning is a saving fraction of 0.0164763814, fuelSavingPercent 1.6476, computed from the two HHV efficiencies of the stack loss section. 1.6445 is the LHV figure, 2.0336 and 1.2718 the 2.0 and 3.5 rows of the LHV sweep.")

q(1, "The sweep is run to a target of 4.5 percent oxygen. What target efficiency does that row carry?",
 "86.9933 percent",
 ["87.5160 percent",
  "86.4029 percent",
  "88.1965 percent"],
 "86.9933 percent is what the 4.5 target carries, with a saving of 2782.362 GJ a year. 87.5160 goes with 3.5 and 88.1965 with the 2.0 floor; 86.4029 is currentEfficiencyPercent, the heater at 5.5 percent.")

q(3, "Which of these figures does excessAirSaving not return for the invented Isiokpo tuning?",
 "The shortcut's 0.0144463600",
 ["fuelSavingFraction 0.0164448058",
  "fuelSavingPercent 1.6445 on LHV",
  "annualEnergySavedGJ 6742.370"],
 "The output rows are basis, currentEfficiencyPercent, targetEfficiencyPercent, fuelSavingFraction, fuelSavingPercent and annualEnergySavedGJ. The shortcut figure sits outside that table, marked computed here.")

q(0, "What basis does the course's output carry for the invented Isiokpo tuning, and on what basis is its 410000 GJ of fuel a year stated?",
 "Basis LHV, with the fuel stated on LHV.",
 ["Basis HHV, with the fuel stated on LHV.",
  "Basis LHV, with the fuel stated on HHV.",
  "No basis output; fuel stated on HHV."],
 "The course's output table prints basis LHV, and its inputs are 410000 GJ of fuel a year on LHV (invented). The two efficiencies it takes, 86.4029 and 87.8476, are the LHV rows of the stack loss section.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/intermediate/cefi_m04.json', label='cefi_m04', expect_n=15)
finish()
