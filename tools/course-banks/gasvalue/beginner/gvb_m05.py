import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Associate m05, CO2e and Its Limits. Digest sections 12, 13 and 14,
# with the methane share defined in section 10. The GWPs are case inputs; the
# rows at 20 and 40 are the digest's comparison rows.

q(1, "EGBEMA's flare is run with the methane GWP left blank. What comes back?",
 "CO2 182079.024 and methane 1136.490 t/yr, with the CO2e and the methane share both null",
 ["A refusal naming the missing GWP, with no tonnes of CO2, methane or CO2e reported at all",
  "CO2e 182079.024 t/yr with the methane counted at no GWP, and the methane share of the flare's CO2e at 0.0000",
  "CO2e 215946.438 t/yr at a GWP of 29.8, taken as the engine's default, with a note saying so"],
 "The blank GWP table reads flareCo2Tonnes 182079.024, flareCh4Tonnes 1136.490, flareCo2eTonnes null, methaneShareOfFlareCo2e null and blockedBy \"no methane global warming potential supplied\". The methane GWP is an input with no default.")

q(3, "At a methane GWP of 40, what flareCo2eTonnes does EGBEMA's flare give?",
 "227538.640",
 ["204808.832",
  "215946.438",
  "218744.723"],
 "The GWP table reads 227538.640 at 40, 204808.832 at 20 and 215946.438 at the study's 29.8, the rows at 20 and 40 for comparison only. 218744.723 is the CO2e with the combustion efficiency left out.")

q(3, "Read at the comparison GWP of 20, what share of EGBEMA's flare CO2e is methane?",
 "0.1110",
 ["0.1998",
  "0.1568",
  "0.1548"],
 "At 20 the share column prints 0.1110. 0.1998 sits at 40, 0.1568 at the study's 29.8, and 0.1548 is the stand-in row at 0.97.")

q(2, "How does the digest form methaneShareOfFlareCo2e?",
 "flareCh4Tonnes times the GWP over flareCo2eTonnes",
 ["flareCh4Tonnes over flareCo2eTonnes",
  "flareCh4Tonnes times the GWP over flareCo2Tonnes",
  "flareCh4Tonnes over flareCo2Tonnes"],
 "methaneShareOfFlareCo2e is flareCh4Tonnes times the GWP over flareCo2eTonnes, 0.1568 on EGBEMA at 29.8. CO2e is the CO2 plus the methane times the GWP.")

q(0, "abatement is called with a destruction efficiency of 1.2. What does it answer?",
 "REFUSED: A flare destruction efficiency in (0, 1] is required. For a flare it is most of the answer and it is contested, so it is not assumed.",
 ["REFUSED: A flare combustion efficiency must lie in (0, 1] and cannot exceed the destruction efficiency.",
  "It caps the efficiency at 1 and reports flareCh4Tonnes 0.000, as at a destruction efficiency of 1.",
  "REFUSED: A characterised gas is required."],
 "The refusal table gives the destruction efficiency sentence for a blank and for 1.2 alike. The range it states is (0, 1].")

q(3, "EGBEMA's call carries a combustion efficiency of 0.98 above a destruction efficiency of 0.97. What does abatement answer?",
 "REFUSED: A flare combustion efficiency must lie in (0, 1] and cannot exceed the destruction efficiency.",
 ["It cuts the combustion efficiency to 0.97 and says so in a note, as it does when the combustion efficiency is left out of the call.",
  "REFUSED: A flare destruction efficiency in (0, 1] is required. For a flare it is most of the answer and it is contested, so it is not assumed.",
  "It uses 0.98 as typed and reports a CO2 above EGBEMA's 182079.024 t/yr."],
 "The refusal table prints the combustion efficiency sentence for 0.98 above 0.97. A combustion efficiency cannot exceed the destruction efficiency.")

q(1, "On-stream days are omitted from the call entirely, never typed. What does abatement do?",
 "It takes the stated default, scfPerYear 2625000000",
 ["REFUSED: On-stream days are required, more than 0 and no more than 366.",
  "It takes EGBEMA's 355 days, scfPerYear 2662500000",
  "It takes the top of the range, 366 days"],
 "On-stream days omitted from the call take the stated default, and scfPerYear reads 2625000000. Typed blank, they are refused.")

q(2, "Which two on-stream days probes does abatement's refusal table answer with the on-stream days sentence?",
 "Days typed blank ('') and days typed as 367",
 ["Days omitted from the call and days typed as 367",
  "Days typed blank ('') and days omitted",
  "Days typed as 355 and days typed as 367"],
 "The table prints \"REFUSED: On-stream days are required, more than 0 and no more than 366.\" for the blank and for 367. Omitted days take the stated default (scfPerYear 2625000000), and EGBEMA's 355 days are answered.")

q(3, "Which of these calls does abatement answer with \"REFUSED: A characterised gas is required.\"?",
 "A call on a gas the analysis refused",
 ["A call carrying no gas volume",
  "A call with on-stream days blank",
  "A call with the methane GWP blank"],
 "The refusal table prints that sentence for a gas the analysis refused. No volume gets \"REFUSED: A gas volume is required.\", blank days get the on-stream days sentence, and a blank GWP is answered with the CO2e null.")

q(0, "What does the digest say about a flare that is not lit?",
 "It is not modelled; the engine's flare is lit.",
 ["It is modelled at destruction efficiency 0.5.",
  "It is modelled with its methane set by the combustion efficiency.",
  "It is refused with REFUSED: A gas volume is required."],
 "Among the stated limits: an unlit flare is not modelled. Gas sent to a flare that is not lit is vented, all of it methane; the engine's flare is lit.")

q(1, "40 CFR 98.233(n)(1) is a United States rule with tiered default pairs. What does the engine do with them?",
 "Neither efficiency takes a default; both stay inputs.",
 ["It uses the rule's first tier when a box is left blank.",
  "It uses the NUPRC flare regulations' basis when blank.",
  "It uses EGBEMA's 0.97 and 0.955 as the defaults."],
 "The stated limit: the efficiencies have no default. Whether a Nigerian flare study defaults to any tier, or to the NUPRC flare regulations' basis, is a regulation reading, and both efficiencies stay inputs. The studio opens with both blank and abatement refuses.")

q(2, "The digest shows the on-stream days default by asking one function with the days omitted. Which, and what does it report?",
 "routeEconomics, onstreamDays 350",
 ["abatement, onstreamDays 355",
  "routeEconomics, onstreamDays 366",
  "characteriseGas, onstreamDays 350"],
 "SECTION 13: routeEconomics, asked with the days omitted, reports onstreamDays 350, and 7.5 MMscfd times a million times 350 is the omitted call's scfPerYear.")

q(0, "Which of these does the engine ship?",
 "Typical component heating values and liquid densities",
 ["A methane GWP, taken whenever the GWP box is left blank",
  "A credit price for the tonnes a route abates",
  "A default flare destruction efficiency"],
 "The digest: the methane GWP and any credit price are case inputs, and the engine ships neither; the efficiencies have no default. The component heating values and liquid densities are the engine's own labelled typical tables.")

q(3, "EGBEMA at a destruction efficiency of 0.97 appears with a methane share of 0.1568 and of 0.1548. What separates the two rows?",
 "The combustion efficiency used: 0.955 against 0.97",
 ["The GWP: 29.8 against 20",
  "The methane in the flare: 1136.490 against 1531.658 t/yr",
  "The on-stream days: 355 against 350"],
 "With both efficiencies given the combustion efficiency is 0.955 and the share 0.1568; with it left out, 0.97 stands in and the share reads 0.1548. The methane is 1136.490 in both. The share at a GWP of 20 is 0.1110.")

q(2, "Which term of CO2e does the methane GWP multiply?",
 "The methane alone",
 ["The CO2 and the methane",
  "The CO2 alone",
  "The methane and the unburned ethane and heavier"],
 "CO2e is the CO2 plus the methane times the GWP, so the GWP sits on the methane term.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/beginner/gvb_m05.json', expect_n=15)
finish()
