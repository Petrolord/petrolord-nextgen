import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Professional m06, the Professional reading.
# Draws on m06's three lessons only: SECTIONS 11 to 17 read as one plant (the
# invented Isiokpo heater, trap, condensate system and streams), SECTION 1's
# sentence on the two studios and the SECTION 25 rules those lessons quote.
# Every input is invented; the 56.1 kg CO2e per GJ factor is SYNTHETIC.

q(1, "Follow the invented Isiokpo heater's current reading of 5.5 percent oxygen through the oxygen table and the stack loss rows. Which pair does it become?",
 "32.1223 percent excess air and 86.4029 percent on LHV",
 ["13.9199 percent excess air and 87.8476 percent on LHV",
  "32.1223 percent excess air and 79.2343 percent on HHV",
  "21.2938 percent excess air and 86.4029 percent on LHV"],
 "Excess air 32.1223 percent is the 5.5 row of the oxygen table; 86.4029 percent is the current row on LHV. The 2.8 target pairs 13.9199 with 87.8476, 79.2343 is that target on HHV, and 21.2938 goes with a 4 percent reading.")

q(1, "Across the invented Isiokpo steam and stream calls, which one does the engine answer in part while naming the gap?",
 "The condensate case with its treatment cost blank",
 ["The condensate case with its boiler efficiency blank",
  "The trap with its isentropic exponent blank",
  "The pinch targets with the minimum approach blank"],
 "The treatment-blank condensate case still prints a total and flags it as a floor. The other three calls get no answer at all: condensateReturnValue refuses a blank boiler efficiency, steamTrapLoss a blank exponent, and the pinch targets a blank minimum approach.")

q(0, "A blank boiler efficiency reaches both the invented Isiokpo trap and the Isiokpo condensate case. What do the two lessons print?",
 "The trap keeps its steam figure and leaves fuel and carbon none; the condensate call is refused.",
 ["Both are refused, each with the message that a boiler efficiency in (0, 1] is required.",
  "The condensate case reports its water lines with fuel none; the trap call is refused outright.",
  "Both take a boiler efficiency of 1 and name it in a note beside the fuel and the carbon."],
 "The trap row with no boiler efficiency keeps its 355.757 tonnes a year and prints fuel and carbon as none. For condensateReturnValue the same blank is one of its four refusals, so no value prints.")

q(2, "Across the invented Isiokpo steam calls, which of these gaps does the course answer with a stated default?",
 "The trap's hours left out of the call, taken at 8760",
 ["The trap's hours box left blank, taken at 8760",
  "The condensate case's hours box left blank, taken at 8400",
  "The trap's discharge coefficient left blank, taken at 1"],
 "Of these gaps only one draws a default: the trap's hours absent from the call, which the course answers with 8760 and 371.004 tonnes a year. Both hours boxes, the trap's and the condensate case's, are refused when present but blank, and the discharge coefficient refusal says it is not defaulted.")

q(3, "Which of these Isiokpo figures is an engine output, where the course marks the other three computed here?",
 "annualEnergySavedGJ 6742.370",
 ["The 8.4741 point LHV and HHV gap",
  "The trap's extra 17.724 tonnes a year",
  "The shortcut's 5923.008 GJ a year"],
 "The tuning lesson's output table prints annualEnergySavedGJ 6742.370. The stack loss section marks the 8.4741 point gap computed here, the steam trap lesson the 17.724 tonnes a year between exponents, and the tuning lesson the shortcut's 5923.008 GJ, which the engine does not return.")

q(1, "The invented Isiokpo trap's downstream table in the course ends with one sentence. Which?",
 "At or below the critical ratio the loss does not move with the downstream pressure; above it the downstream pressure lowers the loss.",
 ["At or below the critical ratio the downstream pressure lowers the loss; above it the loss does not move with the downstream pressure.",
  "Above the critical ratio the downstream pressure raises the loss, and at or below it the loss depends on the downstream pressure alone.",
  "At every ratio the loss moves with the downstream pressure, and the critical ratio only marks where the flow note changes its words."],
 "The course prints that sentence under the table: 42.3520 kg an hour at 1.01325, 3 and 5 bar a, all choked, then 41.4785, 37.5765 and 29.0510 at 6, 7 and 8 bar a, choked false.")

q(2, "The course prints a saving fraction for the invented Isiokpo tuning on HHV. Which two efficiencies is it computed from?",
 "77.9288 and 79.2343 percent, both on HHV",
 ["86.4029 and 87.8476, both on LHV",
  "77.9288 on HHV and 87.8476 percent on LHV",
  "86.4029 on LHV and 79.2343 on HHV"],
 "In the course, on HHV the same tuning is a saving fraction of 0.0164763814, computed from the two HHV efficiencies of the stack loss section, the current 77.9288 and the target 79.2343. A pair on mixed bases is refused: \"The two efficiencies are on different bases (LHV and HHV) and cannot be compared.\"")

q(0, "Four Isiokpo figures from the tuning, trap and condensate lessons are set side by side. Which of them is an amount of carbon?",
 "742.220 tCO2e a year from the condensate",
 ["6742.370 GJ a year saved by tuning",
  "355.757 tonnes a year of trap steam",
  "13230.304 GJ a year from condensate"],
 "The condensate lesson prints annualTonnesCo2e 742.220 on the SYNTHETIC factor. 6742.370 GJ is the tuning's LHV energy saved, 355.757 tonnes a year is steam lost by the trap, and 13230.304 GJ is the condensate case's energySavedGJPerYear.")

q(3, "The stack loss section gives the invented Isiokpo heater a radiation and convection loss of 1.8 percent. Where does that figure come from?",
 "It is read off the heater vendor's chart, invented for the course.",
 ["It is the typical value energyEfficiency.PROPERTY_REFERENCE ships.",
  "The engine computes it from the heater's surface and firing rate.",
  "It is the stack oxygen loss the excess air of 32.1223 percent gives."],
 "The stack loss section: radiation and convection loss 1.8 percent read off the heater vendor's chart (invented). PROPERTY_REFERENCE ships flue gas cp, vapour cp and latent heat only, and the blank refusal says the chart against surface area and firing rate is one this module does not reproduce.")

q(1, "The invented Isiokpo trap reports carbon only when three inputs are given. Which does its carbonNote name?",
 "The steam energy content, the boiler efficiency and an emission factor.",
 ["The discharge coefficient, the hours a year and an emission factor.",
  "The steam density, the boiler efficiency and the steam price a tonne.",
  "The isentropic exponent, the orifice and the steam energy content."],
 "carbonNote, verbatim: \"Carbon needs the steam energy content, the boiler efficiency and an emission factor.\" Without them the carbon is absent. At Isiokpo they are 2650 MJ a tonne, 0.83 and the SYNTHETIC 56.1 kg CO2e per GJ.")

q(2, "Pricing a saving per tonne is governed by one of the rules in force. Which wording is it?",
 "The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate.",
 ["The cost per tonne of a saving sets its capital against one year's saving, and needs no rate.",
  "The cost per tonne of a saving is the simple payback, and needs a life but no discount rate.",
  "A saving, its price and its factor may sit on different heating value bases if each is named."],
 "The course's rules in force list \"The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate\" and \"A saving, its price and its factor declared on different heating value bases are refused\".")

q(0, "The course prints the invented Isiokpo pinch at approaches of 10, 15 and 20 C. What does the pinch do across those rows?",
 "The hot side stays at 118.000 C while the cold side reads 108.000, 103.000 and 98.000 C.",
 ["Both sides stay put, 118.000 C on the hot side and 103.000 C on the cold side, at each row.",
  "The cold side stays at 103.000 C while the hot side reads 118.000, 110.500 and 98.000 C.",
  "The pinch appears only at 15 C; the 10 and 20 C rows print threshold problem true instead."],
 "The three target rows print pinch hot 118.000 C each time and pinch cold 108.000, 103.000 and 98.000 C, with threshold problem false in every row. 110.500 is the shifted temperature of the 15 C zero.")

q(3, "In the heater chain from stack oxygen to tuning, which input does the course say is declared after a combustion test?",
 "The minimum safe stack oxygen, 2 percent at Isiokpo.",
 ["The current dry stack oxygen, 5.5 percent at Isiokpo.",
  "The target stack oxygen, 2.8 percent at Isiokpo.",
  "The stack temperature, 238 C at the invented heater."],
 "The tuning lesson prints a minimum safe stack oxygen of 2 percent declared after a combustion test (invented), and refuses it blank: \"A minimum safe stack oxygen is required and is not defaulted.\" The excess air lesson asks for a measured dry stack oxygen, the 2.8 percent target is checked against the declared floor, and the 238 C stack is an invented input of the stack loss section.")

q(1, "A failed steam trap has its own rule in force. According to that row, what must a trap be given?",
 "A boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year.",
 ["A downstream pressure, a discharge coefficient and a steam price for every tonne.",
  "A boiler efficiency, a declared safe floor and a radiation and convection loss.",
  "An emission factor, an orifice diameter and a year of 8760 hours in service."],
 "The course's rules in force: \"A trap needs a boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year\", pointing at the steam trap lesson. The safe floor belongs to the tuning lesson and the radiation loss to the stack loss section; 8760 hours is the stated default when hours are left out of the call.")

q(2, "Every pinch target row for the four invented Isiokpo streams prints a balance check of 0.000. How does the course define it?",
 "(hot utility plus hot stream duty) less (cold utility plus cold stream duty)",
 ["(hot utility plus cold utility) less (hot stream duty plus cold stream duty)",
  "(hot utility plus cold stream duty) less (cold utility plus hot stream duty)",
  "(hot stream duty plus cold utility) less (hot utility plus cold stream duty)"],
 "In the course, the balance check is (hot utility plus hot stream duty) less (cold utility plus cold stream duty): heat in less heat out, 0.000 when the targets close. Heat recovered is the hot streams' duty less the cold utility, 801.150 less 240.150 is 561.000 kW at 15 C.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/intermediate/cefi_m06.json', label='cefi_m06', expect_n=15)
finish()
