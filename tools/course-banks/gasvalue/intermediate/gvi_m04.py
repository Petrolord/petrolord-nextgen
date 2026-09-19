import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Professional m04, The Counterfactual.
# Draws on m04's five lessons only: digest SECTION 21 (abatement: the avoided
# flare at the recovery, three counterfactuals on one flare, the gas to power
# counterfactual, blockedBy, the warning and grossClaimIfNoCounterfactual).
# Every counterfactual figure is the study's input, invented and illustrative,
# and no question keys which counterfactual a project should declare.

q(0, "The CNG route recovers 0.88 of EGBEMA's flare of 215946.438 t/yr of CO2e. What avoidedFlareCo2eTonnes does abatement print?",
 "190032.865",
 ["215946.438",
  "218032.865",
  "202989.652"],
 "The digest: \"The gas it does not recover is still flared, so the avoided flare CO2e is the flare's CO2e times the recovery.\" CNG prints 190032.865. 215946.438 is the whole flare, 218032.865 the net against diesel and 202989.652 the gas to power route's avoided flare at 0.94.")

q(2, "How does abatement form the net abatement from its three terms?",
 "The avoided flare, less what burning the product emits, plus what the product displaces.",
 ["The avoided flare, plus what burning the product emits, less what the product displaces.",
  "The whole flare, less what burning the product emits, plus what the product displaces.",
  "What the product displaces, less the avoided flare, less what burning the product emits."],
 "The digest: \"The net abatement is the avoided flare, less what burning the product emits, plus what the product displaces.\" The avoided flare is the flare's CO2e times the recovery, 190032.865 on the CNG route.")

q(1, "Against the counterfactual \"CNG displacing diesel in haulage trucks\", what does abatement print?",
 "net 218032.865; net minus the gross flare 2086.427",
 ["net 190032.865; net minus the gross flare -25913.573",
  "net 218032.865; and -2010.348 below the flare",
  "net 62032.865; net minus the gross flare -153913.573"],
 "The diesel row: displaced fuel 156000, net 218032.865, net minus the gross flare 2086.427. The other two CNG rows print nets of 190032.865 and 62032.865, and -2010.348 is no CNG figure.")

q(3, "Against \"CNG displacing pipeline gas already burned\", which net abatement and net minus the gross flare print?",
 "190032.865 and -25913.573",
 ["218032.865 and 2086.427 t/yr",
  "62032.865 and -153913.573",
  "190032.865 and -153913.573"],
 "On that row the net prints 190032.865 and its difference from the gross flare prints -25913.573. The 218032.865 and 2086.427 pair is the diesel row, and 62032.865 with -153913.573 the row where nothing is displaced.")

q(3, "\"CNG sold into a market that burned nothing\" displaces 0. What net abatement does abatement print for it?",
 "62032.865 t/yr",
 ["190032.865 t/yr",
  "-2010.348 t/yr",
  "215946.438 t/yr"],
 "Its row: displaced fuel 0, net 62032.865, net minus the gross flare -153913.573. -2010.348 belongs to gas to power, and 215946.438 is the flare itself.")

q(1, "On the three CNG counterfactuals, which one gives a net abatement LARGER than the gross flare?",
 "Displacing diesel in haulage trucks",
 ["Displacing pipeline gas already burned",
  "A market that burned nothing, as no fuel is burned",
  "None of the three: a net never exceeds the flare"],
 "The digest: \"Displacing diesel, the net abatement is larger than the gross flare; displacing gas already burned, or selling into a market that burned nothing, it is smaller.\" The diesel row's net minus the gross flare is 2086.427.")

q(0, "Gas to power recovers 0.94, and its counterfactual \"Gas to power for a new load that burned nothing\" types product combustion 205000 and displaced 0. What does abatement print?",
 "avoided 202989.652; net -2010.348; this route adds emissions",
 ["avoided 202989.652; net 218032.865; this route abates",
  "avoided 190032.865; net 62032.865; this route abates",
  "avoided 215946.438; net -2010.348; this route adds emissions"],
 "The digest prints avoidedFlareCo2eTonnes 202989.652 and netAbatementTonnesCo2ePerYear -2010.348, and: \"The net is below zero: this route adds emissions.\" 215946.438 is the whole flare, and 190032.865 and 62032.865 are the CNG route's figures.")

q(2, "Across its three counterfactuals, what does the CNG route's avoidedFlareCo2eTonnes print?",
 "190032.865 on each of the three rows",
 ["62032.865 on each of the three",
  "215946.438 on each row",
  "190032.865 on diesel only, and null on the other two"],
 "The counterfactual table prints avoidedFlareCo2eTonnes 190032.865 on the diesel, pipeline gas and burned nothing rows alike. 215946.438 is the whole flare, and 62032.865 is the net where nothing is displaced.")

q(0, "In abatement's blocked probe table, which probe prints the blockedBy text that names the methane global warming potential?",
 "the probe with no GWP",
 ["the probe at 1.5",
  "the no label probe",
  "the probe with no displaced fuel figure"],
 "The digest's probe \"no GWP\" prints a net of null beside blockedBy \"no methane global warming potential supplied\". Recovery 1.5 prints the recovery text, and the label and displaced fuel probes print the counterfactual text.")

q(3, "A recovery of 1.5 is typed into abatement. What does blockedBy read?",
 "no recovery fraction in (0, 1]: gas the plant does not recover is still flared",
 ["the counterfactual is not declared: what the product displaces, and what burning it emits",
  "no methane global warming potential supplied",
  "recovery capped at 1: the whole flare is taken as avoided"],
 "The digest's probe \"recovery 1.5\" prints a net of null and blockedBy \"no recovery fraction in (0, 1]: gas the plant does not recover is still flared\", the same text as the probe with no recovery fraction.")

q(2, "Two probes leave out a counterfactual input: one has no counterfactual label, the other no displaced fuel figure. What does blockedBy read?",
 "The same text on both: the counterfactual is not declared",
 ["A different text on each probe, naming the missing input",
  "Nothing on the label probe, as a label is only a name",
  "The same text on both: no displaced fuel was supplied"],
 "Both probes print a net of null and blockedBy \"the counterfactual is not declared: what the product displaces, and what burning it emits\".")

q(1, "Beside a blocked net, which figure does abatement still report, and in which field?",
 "215946.438 t/yr, as grossClaimIfNoCounterfactual",
 ["190032.865 t/yr, as grossClaimIfNoCounterfactual",
  "215946.438 t/yr, as netAbatementTonnesCo2ePerYear",
  "218032.865 t/yr, as grossClaimIfNoCounterfactual"],
 "The digest: \"The flare's gross CO2e is still reported beside a blocked net, as grossClaimIfNoCounterfactual (215946.438 t/yr here): the claim the engine will not make.\" The net itself prints null on every blocked probe.")

q(3, "The warning abatement prints while the counterfactual is undeclared closes on an instruction. Which?",
 "\"State what the product displaces and what burning it emits.\"",
 ["\"State the recovery the plant achieves, and the GWP used.\"",
  "\"Report the gross flare as the abatement until declared.\"",
  "\"Declare the credit price before the net is reported.\""],
 "That instruction is the warning's last sentence. Its first sentence reads \"No abatement is reported.\"")

q(0, "With no counterfactual label declared, what does netAbatementTonnesCo2ePerYear print?",
 "null",
 ["0",
  "215946.438",
  "190032.865"],
 "Every blocked probe prints a net of null. abatement gives no net without every input it rests on, and says which is missing first in blockedBy. The gross flare, 215946.438, is reported in grossClaimIfNoCounterfactual, and 190032.865 is the avoided flare.")

q(2, "The counterfactual table marks two of its columns as inputs. Which two?",
 "product combustion and displaced fuel",
 ["recoveryFraction and avoidedFlareCo2eTonnes",
  "flareCo2eTonnes and the recovery",
  "displaced fuel and net minus the gross flare"],
 "The table heads its columns \"product combustion (input)\" and \"displaced fuel (input)\". avoidedFlareCo2eTonnes, netAbatementTonnesCo2ePerYear and the net minus the gross flare are printed results.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/intermediate/gvi_m04.json', label='gvi_m04', expect_n=15)
finish()
