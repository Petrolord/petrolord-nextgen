import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Associate m02, The Gas by the Mole. Digest sections 5 and 6.

q(1, "On what basis does characteriseGas blend a gas's heating value?",
 "Mole-weighted over the normalised analysis, inerts included",
 ["Mass-weighted over the normalised analysis, inerts included",
  "Mole-weighted over the hydrocarbons alone, rescaled to one",
  "Weighted by liquid volume over the recoverable components"],
 "Every property in the gas lesson is a mole-weighted sum over the normalised analysis, and the heating value is the mole-weighted heating value. The mass weighting (1537.2878 Btu/scf on EGBEMA) and the hydrocarbons alone (1308.6069) are the two shortcuts the course prints beside the engine's 1248.4110.")

q(3, "What heating value, in Btu/scf, does characteriseGas return for EGBEMA?",
 "1248.4110",
 ["1537.2878",
  "1308.6069",
  "1210.7800"],
 "ghvBtuScf for EGBEMA is 1248.4110. 1537.2878 is the same heating values weighted by mass, 1308.6069 is the engine asked about the hydrocarbons alone, and 1210.7800 is the studio's opening gas.")

q(0, "Which mixture molar mass, in lb/lbmol, sits behind the 25.4954 kg that one Mscf of the studio gas weighs?",
 "21.3303",
 ["22.3436",
  "17.5880",
  "16.043"],
 "molarMassLbLbmol reads 21.3303 on the studio's opening gas. 22.3436 is EGBEMA's, 17.5880 is OGUTA's and 16.043 is pure methane's reference molar mass.")

q(2, "EGBEMA's inertMoleFraction is 0.0460. Which normalised fractions does the engine sum to get it?",
 "nitrogen at 0.0180 plus carbon dioxide at 0.0280",
 ["carbon dioxide at 0.0280 plus pentanes plus at 0.0120",
  "nitrogen at 0.0180 plus pentanes plus at 0.0120",
  "nitrogen, carbon dioxide and methane at 0.7420"],
 "inertMoleFraction is the sum of the normalised fractions of the components the reference marks inert, nitrogen and CO2. The course's table prints N2 0.0180, CO2 0.0280, N2 plus CO2 0.0460 and the engine's 0.0460. C5 and C1 are not marked inert.")

q(0, "OGUTA's carbonPerMol is 1.0580 and its hydrocarbonCarbonPerMol is 1.0430. What does the course say carbonPerMol minus hydrocarbonCarbonPerMol is, in every row?",
 "The CO2 mole fraction",
 ["The inert mole fraction",
  "The nitrogen mole fraction",
  "The ethane mole fraction"],
 "In every row, carbonPerMol minus hydrocarbonCarbonPerMol is the CO2 mole fraction: the only carbon that cannot burn is the carbon already in CO2. OGUTA's co2MoleFraction is 0.0150, and its inertMoleFraction, 0.0270, also counts nitrogen, which carries no carbon.")

q(3, "Which of EGBEMA's two carbon counts includes the carbon already in CO2?",
 "carbonPerMol, 1.3600",
 ["hydrocarbonCarbonPerMol, 1.3320",
  "Both, as CO2 carries one carbon per molecule",
  "Neither, as the reference marks CO2 inert"],
 "The carbon per mole counts every carbon atom, the CO2's included; the hydrocarbon carbon per mole counts only the carbon that can burn. EGBEMA reads 1.3600 and 1.3320, and the gap is its CO2 mole fraction, 0.0280.")

q(2, "How many kilograms does characteriseGas give for one Mscf of OGUTA?",
 "21.0224",
 ["26.7066",
  "25.4954",
  "19.1757"],
 "OGUTA's kgPerMscf is 21.0224, at a molar mass of 17.5880 lb/lbmol. 26.7066 is EGBEMA, 25.4954 the studio's opening gas and 19.1757 one Mscf of pure methane.")

q(1, "One Mscf of EGBEMA carries 26.7066 kg and one Mscf of OGUTA 21.0224 kg. By which figure of each gas does the engine's mass rule multiply the moles in a thousand standard cubic feet?",
 "Its molar mass: 22.3436 and 17.5880 lb/lbmol",
 ["Its heating value: 1248.4110 and 1035.6050 Btu/scf",
  "Its carbon per mole: 1.3600 and 1.0580",
  "Its methane fraction: 0.7420 and 0.9250"],
 "The mass in one Mscf is the moles in a thousand standard cubic feet times the molar mass. EGBEMA's molarMassLbLbmol is 22.3436 and OGUTA's is 17.5880.")

q(3, "The course probes a gas of methane 0.9 and propane 0.1, with propane's carbon number left blank. What carbonPerMol does the engine report?",
 "1.2000, as with 3 typed",
 ["A refusal naming C3, since no carbon number was typed",
  "None: carbonPerMol is left null and named missing",
  "1.2000 for hydrocarbonCarbonPerMol, carbonPerMol null"],
 "A hydrocarbon typed without a carbon number takes it from the reference by its code. Both probe rows, propane's carbon number typed and left blank, read carbonPerMol 1.2000 and hydrocarbonCarbonPerMol 1.2000.")

q(0, "An analysis carries an unknown code, XX, with no carbon number. What does characteriseGas answer?",
 "REFUSED: No carbon number for XX. The flare's CO2 is counted atom by atom, so it is not assumed.",
 ["REFUSED: A characterised gas is required.",
  "It takes XX at one carbon per molecule and reports the gas with a note saying so.",
  "It leaves XX out of the carbon per mole and scales the remaining fractions to one."],
 "The refusal table prints that sentence for the unknown code XX with no carbon number. \"A characterised gas is required\" is abatement's answer to a gas the analysis refused.")

q(2, "Which probe gets the answer \"REFUSED: Every component needs a mole fraction.\"?",
 "Methane typed as a blank ('')",
 ["Every mole fraction typed as zero",
  "Methane 1.1 and ethane -0.1",
  "Code XX with no carbon number"],
 "The blank mole fraction gets that sentence. A sheet of zeros gets \"REFUSED: The gas composition sums to nothing.\", methane 1.1 with ethane -0.1 gets \"REFUSED: A mole fraction cannot be negative.\" and XX gets the carbon number refusal.")

q(1, "What methaneMoleFraction does characteriseGas report for OGUTA?",
 "0.9250",
 ["0.7420",
  "0.7800",
  "0.7411"],
 "The gas lesson prints OGUTA's methane at 0.9250; the other three belong to EGBEMA, the studio gas and the short sheet as scaled.")

q(3, "The engine is asked about EGBEMA's hydrocarbons alone, inerts left out and the rest scaled to one. What does the course print for that heating value?",
 "1308.6069 Btu/scf, 60.1959 above the engine's",
 ["1308.6069 Btu/scf, 60.1959 below the engine's",
  "1537.2878 Btu/scf, 288.8768 above the engine's",
  "1248.4110 Btu/scf, the same as the engine's"],
 "The hydrocarbons-alone row reads 1308.6069 with 60.1959 in the \"minus the engine's\" column, and the course says both shortcuts read higher than the engine on this gas. 1537.2878 with 288.8768 is the mass-weighted row, and 1248.4110 is the engine on moles.")

q(0, "Which gas does the course print with carbonPerMol 1.3000 and hydrocarbonCarbonPerMol 1.2800?",
 "The studio's opening gas, with CO2 0.0200",
 ["EGBEMA, with CO2 0.0280",
  "OGUTA, with its CO2 mole fraction at 0.0150",
  "The propane probe, methane 0.9 and propane 0.1"],
 "The studio's opening gas reads 1.3000 and 1.2800 with a co2MoleFraction of 0.0200. EGBEMA reads 1.3600 and 1.3320, OGUTA 1.0580 and 1.0430, and the propane probe 1.2000 and 1.2000.")

q(2, "The studio's opening gas carries N2 0.02 and CO2 0.02. What inertMoleFraction does the engine report for it?",
 "0.0400",
 ["0.0200",
  "0.0460",
  "0.0270"],
 "The studio's row prints N2 plus CO2 0.0400 beside the engine's 0.0400. Its co2MoleFraction alone is 0.0200; 0.0460 and 0.0270 belong to EGBEMA and OGUTA.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/beginner/gvb_m02.json', expect_n=15)
finish()
