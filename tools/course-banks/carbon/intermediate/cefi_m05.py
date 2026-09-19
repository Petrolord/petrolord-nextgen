import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Professional m05, steam, condensate and the pinch.
# Draws on m05's six lessons only: digest SECTION 15 (steamTrapLoss), SECTION
# 16 (condensateReturnValue) and SECTION 17 (pinchTargets). Every flow,
# pressure, price and temperature is invented; the 56.1 kg CO2e per GJ fuel
# emission factor is SYNTHETIC.

q(2, "SECTION 15 prints the engine's choked-flow note for the invented Isiokpo trap at an isentropic exponent of 1.3. Which critical ratio does it name?",
 "0.5457",
 ["0.5774",
  "0.1126",
  "0.555556"],
 "The note at 1.3, verbatim: \"Choked flow: the pressure ratio 0.1126 is at or below the critical 0.5457, so the loss depends on the upstream pressure alone.\" At 1.135 the note names the critical 0.5774. 0.555556 is the pressure ratio of a trap discharging at 5 bar a.")

q(0, "The invented Isiokpo trap, 9 bar a upstream at an exponent of 1.135, discharges into a header at 5 bar a. What does SECTION 15 print?",
 "Choked true, 42.3520 kg an hour",
 ["Choked false, 41.4785 kg an hour",
  "Choked false, 37.5765 kg an hour",
  "Choked true, 44.4620 kg an hour"],
 "The 5 bar a row prints a pressure ratio of 0.555556 against a critical 0.577430, choked true and 42.3520 kg an hour, the same as the trap venting to atmosphere. 41.4785 and 37.5765 are the 6 and 7 bar a rows; 44.4620 is the trap at the superheated exponent of 1.3.")

q(3, "At a downstream pressure of 8 bar a, how many tonnes of steam a year does SECTION 15 print the invented Isiokpo trap losing?",
 "244.029",
 ["315.643",
  "348.419",
  "355.757"],
 "The 8 bar a row prints a pressure ratio of 0.888889, choked false, 29.0510 kg an hour and 244.029 tonnes a year. 315.643 is the 7 bar a row, 348.419 the 6 bar a row and 355.757 every choked row.")

q(1, "The invented Isiokpo trap is given a downstream pressure of 9 bar a, the same as its upstream. What does steamTrapLoss answer?",
 "REFUSED: The downstream pressure (9 bar a) is not below the upstream pressure (9 bar a), so no steam flows through the trap.",
 ["REFUSED: A downstream pressure is required when the box is there. Left out, a trap venting to atmosphere (1.01325 bar a) is the stated default.",
  "No refusal: the pressure ratio is 1, above the critical 0.577430, so choked is false and the loss is 29.0510 kg an hour.",
  "REFUSED: The downstream pressure must be an absolute pressure of zero or more, in bar a."],
 "SECTION 15 prints the 9 bar a call refused with that sentence. The required-box refusal answers a blank downstream box, the absolute-pressure refusal a downstream pressure of -1, and 29.0510 kg an hour is the 8 bar a row.")

q(2, "steamTrapLoss is called for the invented Isiokpo trap with an isentropic exponent of 1. What does SECTION 15 print?",
 "REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam.",
 ["No refusal: an exponent of 1 is read as dry saturated steam and the loss prints at 42.3520 kg an hour.",
  "REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed.",
  "REFUSED: An orifice diameter, an upstream pressure and a steam density are required."],
 "SECTION 15 prints the same refusal for a blank exponent and for an exponent of 1. The discharge coefficient and orifice refusals answer those boxes left blank. 42.3520 kg an hour is the loss at the stated 1.135.")

q(3, "No boiler efficiency is typed for the failed trap. Which result comes back?",
 "355.757 tonnes of steam a year, with the fuel and the carbon none.",
 ["355.757 tonnes of steam a year, with the fuel and the carbon 0.",
  "355.757 tonnes of steam a year, with fuel at a boiler efficiency of 1.",
  "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."],
 "SECTION 15: with the boiler efficiency blank the trap still loses 355.757 tonnes a year, and the fuel and carbon are none. fuelNote: \"Fuel needs a boiler efficiency in (0, 1]. It is not assumed to be 1.\" carbonNote names what carbon needs and calls it absent without them. The refusal quoted is condensateReturnValue's, in SECTION 16.")

q(0, "The hours argument is left out of the call entirely for the invented Isiokpo trap. What does SECTION 15 print?",
 "The stated default of 8760 hours, 371.004 tonnes a year.",
 ["REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.",
  "The record's 8400 hours in service, 355.757 tonnes a year.",
  "The superheated row's figure, 373.481 tonnes of steam a year."],
 "SECTION 15: hours left out of the call take the stated default of 8760, 371.004 tonnes a year. A blank hours box and a call with 9000 hours are refused: \"Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.\" 373.481 is the 1.3 exponent row at 8400 hours.")

q(1, "SECTION 16 prices raising the invented Isiokpo condensate return from 0.35 to 0.65 with the treatment cost left blank. What does it print?",
 "annualValue 121403.28 USD, complete false, and a floor note.",
 ["annualValue 175835.28 USD, complete true, and no note.",
  "annualValue 121403.28 USD, complete true, and no note.",
  "annualValue 175835.28 USD, complete false, and a floor note."],
 "With the treatment blank SECTION 16 prints annualValue 121403.28, complete false and the valueNote \"A floor on the value: Treatment not repeated not priced. The treatment cost is the one usually left out.\" With treatment priced it prints 175835.28 and complete true.")

q(3, "What carbon does the condensate case report once the treatment price is dropped?",
 "742.220, the same as with the treatment priced",
 ["none, since the value is not complete",
  "63.721, the trap's figure for its boiler",
  "742.220 priced and 0.000 left blank"],
 "SECTION 16 prints annualTonnesCo2e 742.220 in both columns, on the SYNTHETIC factor of 56.1 kg CO2e per GJ. Only the treatment line and the totals differ between the columns. 63.721 tCO2e is the trap of SECTION 15.")

q(2, "The invented Isiokpo condensate case is called with a target return of 0.25 against the current 0.35. What does condensateReturnValue answer?",
 "REFUSED: The target return (0.25) is below the current return (0.35). Returning less condensate is a cost, so there is nothing to value.",
 ["REFUSED: Return fractions must lie between 0 and 1.",
  "No refusal: a negative annualValue, with complete true and the fuel line printed below zero for the year.",
  "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."],
 "SECTION 16 prints the call refused with that sentence, and SECTION 25 lists the rule among those MD45-1 put in force. The return-fraction refusal answers a target of 1.2, and the boiler efficiency refusal a blank boiler efficiency.")

q(1, "At a minimum approach of 20 C, which utility targets does SECTION 17 print for the four invented Isiokpo streams?",
 "59.700 kW hot and 273.900 kW cold",
 ["25.950 kW hot and 240.150 kW cold",
  "1.800 kW hot and 216.000 kW cold",
  "59.700 kW hot and 240.150 kW cold"],
 "The 20 C row prints hot utility 59.700 kW and cold utility 273.900 kW. The 15 C row prints 25.950 and 240.150, and the 10 C row 1.800 and 216.000.")

q(0, "SECTION 17 prints a threshold problem: one hot stream at 10 kW/K and one cold at 1 kW/K, at 10 C. Its heat flow is zero only at the top of the cascade. What does the engine report?",
 "No pinch, with threshold problem true.",
 ["A pinch at shifted 195.000 C, threshold false.",
  "A pinch at shifted 35.000 C, threshold true.",
  "No pinch, with threshold problem false."],
 "SECTION 17 prints hot utility 0.000, cold utility 1470.000, pinch hot none and threshold problem true. The engine reports no pinch there: a zero at either end of the cascade is a threshold, and naming it a pinch would invent a constraint. SECTION 25: only an interior zero of the cascade is a pinch.")

q(3, "SECTION 17 prints the engine's note on the pinch. What does it say heat carried across the pinch costs?",
 "One unit more hot utility and one unit more cold utility.",
 ["One unit more hot utility, the cold utility unchanged.",
  "One unit more cold utility, the hot utility unchanged.",
  "Two units more hot utility and none of cold utility."],
 "The note, verbatim: \"Heat carried across the pinch costs twice: one unit more hot utility and one unit more cold utility.\" The note goes on to call the pinch the constraint.")

q(2, "Which heat recovered figure goes with the 10 C row of the Isiokpo pinch targets?",
 "585.150 kW",
 ["561.000 kW",
  "527.250 kW",
  "586.950 kW"],
 "The 10 C row prints heat recovered 585.150 kW. 561.000 is the 15 C row, 527.250 the 20 C row and 586.950 the total cold stream duty.")

q(1, "In the SECTION 17 problem table at 15 C, where does the heat flow reach zero, and how is the pinch reported?",
 "At shifted 110.500 C, inside the range: 118.000 C hot side, 103.000 C cold side.",
 ["At shifted 155.500 C, the top of the cascade: 163.000 C hot side, 148.500 C cold side.",
  "At shifted 33.500 C, the bottom of the cascade: 41.000 C hot side, 32.000 C cold side.",
  "At shifted 111.500 C, inside the range: 118.000 C hot side, 108.000 C cold side."],
 "SECTION 17: the heat flow is zero at shifted 110.500 C, inside the range: the pinch, 118.000 C on the hot side and 103.000 C on the cold side. The cascade starts at 155.500 with the hot utility 25.950 and ends at 33.500 with the cold utility 240.150. 108.000 C is the cold side pinch at 10 C.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/intermediate/cefi_m05.json', label='cefi_m05', expect_n=15)
finish()
