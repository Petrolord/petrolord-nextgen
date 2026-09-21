import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Expert m03, Gas in a Bank. Digest SECTION 30. 15 questions.

q(0, "What pressureBasis does lpgCng print on every CNG result?",
 "absolute (bar(a))",
 ["gauge (bar(g))",
  "absolute (psia)",
  "gauge plus atmosphere (bar)"],
 "The bank lesson: every pressure in lpgCng is absolute, and the engine says so on every CNG result: pressureBasis \"absolute (bar(a))\".")

q(2, "Of the three IBAFO banks, which mass does gasMassInVessel print for the Mid bank at 250 bar(a)?",
 "425.6293 kg",
 ["356.2099 kg",
  "425.6447 kg",
  "448.1628 kg"],
 "The Mid row prints massKg 425.6293 and idealMassKg 356.2099. 425.6447 kg is the mass for the gauge reading of 249 bar plus the atmosphere, 250.0130 bar(a); 448.1628 kg is the High bank.")

q(3, "IBAFO's banks hold gas of specific gravity 0.62. Which Z does the engine give the bank at 230 bar(a)?",
 "0.8181",
 ["0.8369",
  "0.8584",
  "1.2224"],
 "The Low row prints z 0.8181 and realVersusIdeal 1.2224. 0.8369 is the Mid bank's Z and 0.8584 the High bank's.")

q(1, "Every IBAFO bank prints realVersusIdeal above one. What does the course say that shows?",
 "Every bank holds more gas than the ideal gas law says.",
 ["Every bank holds less gas than the ideal gas law says.",
  "Z is above one at these pressures, for every bank.",
  "The correlation is outside its range for every bank."],
 "The bank lesson: at these pressures Z is below one, so every bank holds more gas than the ideal gas law says (realVersusIdeal above one). The three rows print correlationInRange true.")

q(2, "IBAFO's three banks are all at 30 C. Which column of the bank table prints the same figure on all three?",
 "tpr, at 1.5266",
 ["ppr, at 5.3782",
  "z, at 0.8369",
  "realVersusIdeal, at 1.1949"],
 "The bank table prints tpr 1.5266 on the Low, Mid and High rows. ppr, z and realVersusIdeal each print a different figure on each bank; 5.3782, 0.8369 and 1.1949 are the Mid bank's.")

q(0, "In m = P V M over Z R T, what does gasMassInVessel take as M?",
 "The gas's specific gravity times the molar mass of air",
 ["The specific gravity of 0.62 alone, as a ratio",
  "The molar mass of air, with the gravity put into Z",
  "The gas mass over the bank volume at 30 C"],
 "The bank lesson: M is the gas's molar mass, its specific gravity times the molar mass of air, in kg/kmol.")

q(3, "In what unit does the pressure P enter the mass equation in gasMassInVessel?",
 "Pa, as bar(a) times 100000",
 ["bar(a), as typed",
  "psia, as bar(a) times PSI_PER_BAR",
  "bar, as the gauge plus 1.013"],
 "The bank lesson: P is the pressure in Pa (bar(a) times 100000). Every pressure in lpgCng is absolute.")

q(2, "An IBAFO bank reads 249 bar on its gauge, and 249 is typed straight into the engine as if absolute. What mass comes back?",
 "424.4393 kg",
 ["425.6447 kg",
  "425.6293 kg",
  "1.2054 kg"],
 "The gauge table prints 424.4393 kg for the gauge reading typed as if absolute and 425.6447 kg for gauge plus atmosphere; 1.2054 kg is absolute minus gauge-as-absolute. 425.6293 kg is the Mid bank at 250 bar(a).")

q(2, "For the same 249 bar gauge reading, what pressure does the gauge plus atmosphere row give the engine?",
 "250.0130 bar(a)",
 ["249 bar(a)",
  "250 bar(a)",
  "1.0130 bar(a)"],
 "The row labelled gauge plus atmosphere prints 250.0130 bar(a), the site's atmosphere taken as 1.013 bar(a). The row for the gauge typed as if absolute prints 249, the difference row prints 1.0130, and 250 bar(a) is what the Mid bank is typed at.")

q(0, "What range does DAK_RANGE print for the Dranchuk-Abou-Kassem correlation?",
 "ppr 0.2 to 30, tpr 1 to 3",
 ["ppr 1 to 3, tpr 0.2 to 30",
  "ppr 0.2 to 3, tpr 1 to 30",
  "ppr 1 to 30, tpr 0.2 to 3"],
 "The bank lesson: DAK_RANGE: ppr 0.2 to 30, tpr 1 to 3. Outside it the engine still answers and says so.")

q(3, "IBAFO's Low bank is run at -80 C. What does gasMassInVessel do?",
 "It answers, with correlationInRange false and a note calling the value an extrapolation.",
 ["REFUSED: A temperature is required.",
  "It answers with tpr held at 1, the bottom of DAK_RANGE, so that correlationInRange reads true for the bank.",
  "It refuses the bank, since tpr 0.9727 lies below the range the correlation was fitted over."],
 "The bank lesson prints the probe with tpr 0.9727, correlationInRange false, and the note \"Outside the range the Dranchuk-Abou-Kassem correlation was fitted over. The value is an extrapolation and should be checked against measured data.\" Outside the range the engine still answers.")

q(1, "Which Z method does gasMassInVessel use for massKg?",
 "Dranchuk-Abou-Kassem on Sutton pseudo-criticals",
 ["Sutton on Dranchuk-Abou-Kassem pseudo-criticals",
  "Z taken as one, the ideal gas law",
  "Dranchuk-Abou-Kassem on the gauge pressure"],
 "The bank lesson: Z by Dranchuk-Abou-Kassem on Sutton pseudo-criticals. Z taken as one is how the engine forms idealMassKg, which it prints beside massKg; the pressures are absolute.")

q(2, "IBAFO's bank is put to gasMassInVessel with the gas gravity left blank (''). What does the engine print?",
 "REFUSED: A gas specific gravity is required.",
 ["REFUSED: A pressure is required.",
  "The mass on air's molar mass, the gravity taken as one.",
  "REFUSED: A temperature is required."],
 "The bank lesson's probe table prints \"REFUSED: A gas specific gravity is required.\" for a blank gas gravity. The pressure and temperature refusals are the probes with no pressure and no temperature.")

q(1, "gasMassInVessel prints idealMassKg beside massKg on every bank. What is idealMassKg?",
 "The same mass with Z taken as one",
 ["The mass at the gauge reading typed as absolute",
  "The mass the bank gives up to the cascade",
  "The mass on the specific gravity alone, M taken as 0.62"],
 "The bank lesson: the ideal mass is the same m = P V M over Z R T with Z taken as one. The gauge reading typed as absolute is its own row of the gauge table, and M is the specific gravity times the molar mass of air.")

q(3, "Which massKg and idealMassKg does the engine print for the IBAFO bank at 230 bar(a)?",
 "400.5918 kg and 327.7131 kg",
 ["425.6293 kg and 356.2099 kg",
  "448.1628 kg and 384.7067 kg",
  "400.5918 kg and 356.2099 kg"],
 "The Low row, 2 m3 at 230 bar(a), prints massKg 400.5918 and idealMassKg 327.7131. 425.6293 kg and 356.2099 kg are the Mid bank's; 448.1628 kg and 384.7067 kg the High bank's.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/advanced/gva_m03.json', expect_n=15)
finish()
