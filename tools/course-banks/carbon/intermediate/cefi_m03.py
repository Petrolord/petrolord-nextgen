import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Professional m03, stack loss efficiency.
# Draws on m03's five lessons only: the stack loss section of the digest (stackLossEfficiency on
# the invented Isiokpo heater), the FUEL_REFERENCE heating values and
# PROPERTY_REFERENCE of SECTION 1, held item H2 of SECTION 25 as a limit, and
# the SECTION 14 mixed-basis refusal lesson five reads. The stack and air
# temperatures and the 1.8 percent radiation loss are invented.

q(2, "The stack loss section prints the invented Isiokpo heater at its current 5.5 percent stack oxygen. What efficiency does it print on HHV?",
 "77.9288 percent",
 ["79.2343 percent",
  "86.4029 percent",
  "87.8476 percent"],
 "The current HHV row prints 77.9288 percent. 79.2343 percent is the target HHV row at 2.8 percent oxygen, 86.4029 percent the current LHV row and 87.8476 percent the target LHV row.")

q(0, "The stack loss section prints a difference of 8.4741 percentage points for the invented Isiokpo heater. Between which two figures?",
 "86.4029 on LHV and 77.9288 on HHV, one heater at one oxygen reading.",
 ["86.4029 and 87.8476 on LHV, the heater before and after tuning.",
  "77.9288 and 79.2343 on HHV, the heater before and after tuning.",
  "The HHV moisture loss 11.2450 and LHV total loss 13.5971."],
 "The stack loss section: the same heater at the same oxygen reads 86.4029 percent on LHV and 77.9288 percent on HHV, a difference of 8.4741 percentage points (computed here from the engine's figures). The tuning pairs are one basis each, current against target.")

q(3, "On the HHV basis, what does stackLossEfficiency's moisture note count as lost from the flue gas water?",
 "The latent heat of the water made from hydrogen is a loss, because HHV counted it as available.",
 ["Only the sensible heat of the water vapour is a loss, as HHV never counted the latent heat.",
  "The latent heat of all the water in the stack is a loss, the air's humidity included.",
  "Neither heat of the water is a loss on HHV, because HHV counted both of them as available."],
 "The HHV note, verbatim: \"On HHV the latent heat of the water made from hydrogen is a loss, because HHV counted it as available.\" The LHV note: \"On LHV only the sensible heat of the water vapour is a loss, because LHV never counted the latent heat as available.\"")

q(1, "How does the HHV moisture loss change when the heater is tuned from its current row to its target row?",
 "11.2450 percent in both rows",
 ["11.2450 falling to 9.0262 percent",
  "1.8088 percent in both of the rows",
  "9.0262 falling to 7.7207 percent"],
 "Both HHV rows print a moisture loss of 11.2450 and both LHV rows 1.8088. The HHV dry flue gas loss is what moves, 9.0262 to 7.7207 percent.")

q(2, "The stack loss section relates the invented Isiokpo heater's HHV dry flue gas loss, 9.0262 percent, to its LHV dry loss at 5.5 percent. How?",
 "9.9883 x 840.9925 / 930.6273: the same kilojoules over a different heating value.",
 ["9.9883 x 930.6273 / 840.9925, the heating values swapped.",
  "9.9883 less 8.4741 plus the 1.8000 radiation loss, carried on both bases.",
  "9.9883 x 77.9288 / 86.4029, the two current efficiencies in place of the heating values."],
 "The stack loss section: the dry flue gas loss is the same kilojoules on both bases, divided by a different heating value: 9.9883 x 840.9925 / 930.6273 = 9.0262 (computed here). 840.9925 and 930.6273 are the fuel's lhvMJPerKmolFuel and hhvMJPerKmolFuel; 77.9288 and 86.4029 are the current efficiencies, which the printed relation does not use.")

q(0, "stackLossEfficiency is called for the invented Isiokpo heater with the radiation and convection loss left blank. What does the stack loss section print?",
 "REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce.",
 ["REFUSED: A stack temperature and a combustion air temperature are required.",
  "REFUSED: The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency.",
  "REFUSED: On a higher-heating-value basis the moisture loss needs both the latent heat of water and the vapour specific heat."],
 "The stack loss section prints the blank radiation loss refused with that sentence. The other three are the refusals the stack loss section prints for a blank stack temperature, a radiation loss of -3 and an HHV call with no latent heat.")

q(3, "The invented Isiokpo radiation and convection loss is raised from 1.8 to 2.5 percent. What current LHV efficiency does the stack loss section print?",
 "85.7029 percent",
 ["87.2029 percent",
  "86.4029 percent",
  "87.8476 percent"],
 "The radiation table prints 87.2029 at 1.0, 86.4029 at 1.8 and 85.7029 at 2.5 percent; 87.8476 is the target LHV row at 2.8 percent oxygen. The digest's sentence over the table is that the radiation loss moves the efficiency one for one.")

q(1, "A radiation and convection loss of -3 is typed for the invented Isiokpo heater. What comes back?",
 "REFUSED: The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency.",
 ["No refusal: the loss enters the ledger as typed, and the current LHV efficiency prints above the 87.2029 percent of the 1.0 row.",
  "REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce.",
  "No refusal: a negative loss is read as 0 and the unburned loss of 0.0000 is carried instead."],
 "The stack loss section prints the call with -3 refused: \"The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency.\" SECTION 25 lists it among the rules in force: a negative radiation or unburned loss is refused.")

q(0, "stackLossEfficiency is called with the heating value basis \"gross\". What does the engine answer?",
 "REFUSED: The heating value basis must be LHV or HHV. \"gross\" is neither, and an efficiency on an unknown basis cannot be compared with anything.",
 ["No refusal: gross is read as HHV and the current row prints 77.9288 percent.",
  "No refusal: gross is read as LHV and the current row prints 86.4029 percent.",
  "REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce."],
 "The stack loss section prints the call refused, and a blank basis gets the same message with \"\" in place of \"gross\". The radiation refusal answers a blank radiation loss.")

q(2, "The basis is typed as \" hhv \", lower case with spaces around it. What does the stack loss section print?",
 "Basis HHV and 77.9288 percent, the current HHV row.",
 ["Basis hhv and 86.4029 percent, the current LHV row.",
  "A refusal: \" hhv \" is neither LHV nor HHV as typed.",
  "Basis LHV and 86.4029 percent, since case is unread."],
 "The stack loss section: the basis is read without regard to case or spaces and reported in capitals: \" hhv \" returns basis HHV and 77.9288 percent, the HHV row above.")

q(3, "The stack loss section checks a relation on all four of its rows for the invented Isiokpo heater. Which one?",
 "The four losses add to the total loss, and the efficiency is 100 less the total loss.",
 ["The dry and moisture losses add to the total loss, and radiation comes off the efficiency.",
  "The four losses add to the efficiency, and the total loss is 100 less the efficiency.",
  "The dry flue gas loss prints the same percent on both bases, row by row."],
 "The stack loss section: in every row the four losses add to the total loss and the efficiency is 100 less the total loss (checked here on all four rows). On the current LHV row that is 13.5971 and 86.4029.")

q(1, "Which stack and combustion air temperatures does the stack loss section give the invented Isiokpo heater?",
 "Stack 238 C, combustion air 28 C",
 ["Stack 238 C, combustion air 25 C",
  "Stack 400 C, combustion air 28 C",
  "Stack 28 C, combustion air 238 C"],
 "The stack loss section: stack 238 C, combustion air 28 C, both invented. 25 C is the reference temperature of the typical latent heat and 400 C the top of the typical flue gas cp range (SECTION 1). The last pairing, 28 C for the stack and 238 C for the air, swaps the two.")

q(0, "Read the tuned line on LHV: which total loss and efficiency sit together there?",
 "Total loss 12.1524 percent, efficiency 87.8476 percent",
 ["Total loss 13.5971 percent, efficiency 86.4029 percent",
  "Total loss 20.7657 percent, efficiency 79.2343 percent",
  "Total loss 12.1524 percent, efficiency 86.4029 percent"],
 "On LHV at 2.8 percent oxygen the total loss is 12.1524 and the efficiency 87.8476. The 5.5 percent line on the same basis reads 13.5971 and 86.4029, and the same target read on HHV 20.7657 and 79.2343.")

q(3, "stackLossEfficiency is asked for an HHV efficiency with the latent heat of water left out. What does the stack loss section print?",
 "REFUSED: On a higher-heating-value basis the moisture loss needs both the latent heat of water and the vapour specific heat.",
 ["No refusal: the HHV moisture loss is taken at the LHV figure of 1.8088 percent and the row is labelled HHV.",
  "No refusal: the latent heat takes the PROPERTY_REFERENCE typical value of 2442 kJ/kg and is named in a note.",
  "REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce."],
 "The stack loss section prints the HHV call with no latent heat refused with that sentence. The typical 2442 kJ/kg is what the Isiokpo calls pass; a blank is refused. The radiation refusal answers a blank radiation loss.")

q(2, "Going from the current 5.5 percent row to the target 2.8 percent row on LHV, which loss does the stack loss section print moving?",
 "The dry flue gas loss, 9.9883 to 8.5436 percent.",
 ["The moisture loss, 1.8088 to 1.8000 percent, as the water falls.",
  "The radiation loss, 1.8000 to 1.0 percent off the chart.",
  "The unburned loss, 1.8000 to 0.0000 percent."],
 "The LHV rows print dry flue gas loss 9.9883 then 8.5436, moisture 1.8088 in both, radiation 1.8000 in both and unburned 0.0000 in both. Total loss goes from 13.5971 to 12.1524.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/intermediate/cefi_m03.json', label='cefi_m03', expect_n=15)
finish()
