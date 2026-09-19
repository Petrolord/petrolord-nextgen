import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Associate m03, The Liquids in the Gas. Digest sections 7, 8 and 9.

q(3, "The engine's basis sentence for gpmC2Plus and gpmC3Plus says gallons per Mscf follows from three things. Which three?",
 "The moles in a thousand cubic feet, the molar mass and the liquid density",
 ["The moles in a thousand cubic feet, the carbon per molecule and the liquid density",
  "The heating value, the molar mass and the liquid density of each component",
  "The mass in one Mscf, GAL_PER_FT3 and the richness edges in RICHNESS_GPM"],
 "\"Derived from the composition and the component liquid densities: gallons per Mscf follows from the moles in a thousand cubic feet, the molar mass and the liquid density.\"")

q(1, "How many gallons of ethane and heavier per Mscf does characteriseGas report for EGBEMA?",
 "5.9942",
 ["3.2205",
  "5.0897",
  "2.7737"],
 "EGBEMA's gpmC2Plus is 5.9942. 3.2205 is its gpmC3Plus (propane and heavier), 2.7737 is the ethane between the two, and 5.0897 is the studio opening gas's gpmC2Plus.")

q(0, "OGUTA reads gpmC2Plus 1.3157 and gpmC3Plus 0.4890. What does the digest name the column between them, and what does it print for OGUTA?",
 "The ethane, 0.8268",
 ["The ethane, 2.7737",
  "The propane, 0.8268",
  "The methane, 0.8268"],
 "The column is gpmC2Plus minus gpmC3Plus, and the digest heads it \"the ethane\": 0.8268 on OGUTA, 2.7737 on EGBEMA and 2.4003 on the studio's opening gas. Methane is not recoverable as NGL and is in neither cut.")

q(2, "Which components does gpmC3Plus sum over?",
 "C3, IC4, NC4 and C5",
 ["C2, C3, IC4, NC4 and C5",
  "C3, IC4 and NC4, pentanes plus left out",
  "C1, C2, C3, IC4, NC4 and C5"],
 "gpmC3Plus sums propane to pentanes plus; gpmC2Plus sums ethane to pentanes plus. The per-component table marks C3, IC4, NC4 and C5 true in gpmC3Plus and C2 true only in gpmC2Plus.")

q(2, "A gas reads gpmC3Plus of exactly 2.5000. Which richness word does the engine give it?",
 "rich",
 ["moderate",
  "lean",
  "null"],
 "RICHNESS_GPM puts the change from moderate to rich at gpmC3Plus 2.5000, and a gas at or above the upper edge reads rich. The word reads null when gpmC3Plus is itself missing, as with propane's density blank.")

q(0, "Which is the full set of components that carry no liquid density in the reference and are summed in neither liquid cut?",
 "Methane, nitrogen and carbon dioxide",
 ["Methane alone",
  "Nitrogen and carbon dioxide",
  "Methane, ethane and nitrogen"],
 "The per-component table reads recoverable false, in neither cut and gal/Mscf none on C1, N2 and CO2, and the reference prints liquid density none on the same three rows. C2 is recoverable and is in gpmC2Plus at 2.7737 gal/Mscf on EGBEMA.")

q(3, "Which gas reads lean, and on which figure is the word read?",
 "OGUTA, at gpmC3Plus 0.4890",
 ["OGUTA, at gpmC2Plus 1.3157",
  "The studio's opening gas, at gpmC3Plus 2.6894",
  "EGBEMA, at gpmC3Plus 3.2205"],
 "The richness word is read off gpmC3Plus. OGUTA's 0.4890 is below the lower edge of 1.0000 and reads lean; EGBEMA at 3.2205 and the studio's opening gas at 2.6894 read rich.")

q(1, "EGBEMA is analysed with propane's liquid density left blank. What does characteriseGas return for the liquids?",
 "gpmC2Plus null, gpmC3Plus null, richness null, missingLiquidDensity C3",
 ["gpmC2Plus 2.7737 from the ethane alone, gpmC3Plus null, missingLiquidDensity C3",
  "gpmC2Plus 5.9942, gpmC3Plus 3.2205, richness rich, missingLiquidDensity none",
  "REFUSED, since every recoverable component needs a liquid density"],
 "The probe row prints gpmC2Plus null, gpmC3Plus null, richness null and missingLiquidDensity C3, with ghvBtuScf still 1248.4110. A blank density leaves the liquids content and the richness word missing; neither is a partial sum.")

q(0, "EGBEMA is analysed with n-butane's heating value left blank. What does ghvBtuScf read?",
 "null, with a ghvNote beside it",
 ["1248.4110, the value with every heating value typed",
  "an average over the rest",
  "REFUSED, with no figure"],
 "The n-butane probe row prints ghvBtuScf null with a ghvNote, while its gallon figures and richness word read as typed.")

q(3, "The n-butane heating value probe on EGBEMA: which gallon figures and richness word come back?",
 "5.9942 and 3.2205 gal/Mscf, rich",
 ["null and null, richness null",
  "null, with missingLiquidDensity NC4",
  "5.0897 and 2.6894 gal/Mscf, rich"],
 "The n-butane heating value probe prints gpmC2Plus 5.9942, gpmC3Plus 3.2205, richness rich and missingLiquidDensity none, the same liquids as EGBEMA as typed. 5.0897 and 2.6894 are the studio's opening gas.")

q(1, "What does the digest print for EGBEMA's propane and heavier mass against its whole mass in one Mscf?",
 "6.6647 of 26.7066 kg, a share of 0.2496",
 ["5.5819 of 25.4954 kg, a share of 0.2189",
  "6.6647 of 26.7066 kg, a share of 0.2189",
  "0.9798 of 21.0224 kg, a share of 0.0466"],
 "EGBEMA's row reads kgPerMscf 26.7066, c3PlusKgPerMscf 6.6647 and c3PlusKgPerMscf over kgPerMscf 0.2496. 5.5819 of 25.4954 at 0.2189 is the studio's opening gas and 0.9798 of 21.0224 at 0.0466 is OGUTA.")

q(2, "c3PlusKgPerMscf is read on the probe that blanks propane's density. What does EGBEMA's read?",
 "6.6647 kg/Mscf",
 ["null, beside gpmC3Plus null",
  "null, with missingLiquidDensity C3",
  "a partial mass, propane left out"],
 "The mass ceiling reads no liquid density. With propane's density blank, c3PlusKgPerMscf is still 6.6647 and kgPerMscf 26.7066, while the gallon figures read null.")

q(0, "In EGBEMA's per-component gallons, which row gives 1.7019 gal/Mscf, and which cuts is it in?",
 "C3, in both gpmC2Plus and gpmC3Plus",
 ["C2, in gpmC2Plus only",
  "C3, in gpmC3Plus only",
  "NC4, in both cuts"],
 "The C3 row reads 1.7019 gal/Mscf and true in both cuts. C2 reads 2.7737 and is in gpmC2Plus only; NC4 reads 0.6602.")

q(3, "RICHNESS_GPM exports the edges of a screening word. Beside that word, what does the digest say governs a route's liquids?",
 "The route's own liquids limit",
 ["The RICHNESS_GPM edge the gas sits above",
  "The richness word, read off gpmC3Plus",
  "gpmC2Plus, read against the same edges"],
 "The digest reads the richness word off gpmC3Plus against RICHNESS_GPM and calls it \"a screening word; a route's own liquids limit governs\".")

q(1, "Where does the richness word change from lean to moderate?",
 "At gpmC3Plus 1.0000",
 ["At gpmC3Plus 2.5000",
  "At gpmC2Plus 1.0000",
  "At gpmC2Plus 2.5000"],
 "The RICHNESS_GPM table puts lean to moderate at gpmC3Plus 1.0000 and moderate to rich at 2.5000. A gas at or above the lower edge reads moderate. The word is read off gpmC3Plus.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/beginner/gvb_m03.json', expect_n=15)
finish()
