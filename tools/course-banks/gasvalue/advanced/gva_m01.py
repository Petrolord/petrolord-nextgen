import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Expert m01, The LPG Blend and the Vessel. Digest SECTIONS 25 and 26.
# 15 questions. Every figure is the digest's, at its printed precision.

q(2, "lpgBlendProperties prints a basis beside each of the three properties it returns for KANO's blend. Which pairing does it print?",
 "Density on volume, latent heat on mass, molar mass on mole.",
 ["Density on mass, latent heat on volume, molar mass on mole.",
  "Density on volume, latent heat on volume, molar mass on mass.",
  "Density on mole, latent heat on mass, molar mass on volume."],
 "SECTION 25 prints KANO's row as 557.4000 (volume), 397.7592 (mass) and 52.7681 (mole), and states: density blends on volume; latent heat per kilogram blends on mass; molar mass blends on moles. Each other pairing moves at least one property onto a basis the engine does not use for it.")

q(0, "KANO's blend is propane 0.35 and butane 0.65 by liquid volume, on the typical figures. What latent heat does the engine return for it?",
 "397.7592 kJ/kg",
 ["399.0000 kJ/kg",
  "399.6821 kJ/kg",
  "385 kJ/kg"],
 "The KANO row prints latentHeatKJkg 397.7592 on mass. 399.0000 kJ/kg is KANO's latent heat averaged on the volume fractions, which SECTION 25 prints as 1.2408 kJ/kg from the engine's; 399.6821 kJ/kg is the studio opening blend; 385 kJ/kg is n-butane's typical row in LPG_REFERENCE.")

q(1, "KANO's blend is typed as propane 0.35 by liquid volume. What propane mass fraction does lpgBlendProperties print for it?",
 "0.3190",
 ["0.3671",
  "0.6810",
  "0.6329"],
 "The KANO row prints a propane mass fraction of 0.3190 and a butane mass fraction of 0.6810. 0.3671 and 0.6329 are the studio opening blend's propane and butane mass fractions.")

q(1, "What molar mass does the engine return for KANO's blend, and on which basis?",
 "52.7681 kg/kmol, on mole",
 ["52.0456 kg/kmol, on mole",
  "52.7681 kg/kmol, on mass",
  "58.122 kg/kmol, on mole"],
 "The KANO row prints molarMassKgKmol 52.7681 (mole). 52.0456 kg/kmol is the studio opening blend's; 58.122 kg/kmol is n-butane's own molar mass in LPG_REFERENCE; and the molar mass blends on moles, so a mass basis is wrong for it.")

q(1, "KANO's blend is run with butane's latent heat left blank. What does lpgBlendProperties return?",
 "A null latent heat, and the density still 557.4000 kg/m3",
 ["A latent heat on propane alone, and the density 557.4000 kg/m3",
  "A null latent heat and a null density for the blend",
  "REFUSED: A liquid density is required for every component; it is not assumed."],
 "SECTION 25: with butane's latent heat left blank the blend's latent heat is null and its density still 557.4000 kg/m3, with the note \"A property missing on any component is reported as missing for the blend. It is never averaged over the components that have it.\" The quoted refusal is the one for a blank butane liquid density.")

q(0, "A butane liquid density left blank is put to lpgBlendProperties. What does the engine print?",
 "REFUSED: A liquid density is required for every component; it is not assumed.",
 ["REFUSED: A liquid density is required; it is not assumed.",
  "REFUSED: Every component needs a volume fraction.",
  "A null density, reported as missing for the blend."],
 "SECTION 25's probe table prints this refusal for the blank butane density. \"A liquid density is required; it is not assumed.\" is lpgStorageSizing's refusal for a vessel with no liquid density (SECTION 26), and \"Every component needs a volume fraction.\" is the refusal for a blank butane volume fraction.")

q(3, "lpgStorageSizing is called for KANO's vessel with the fill limit left blank. What comes back?",
 "REFUSED: A maximum fill ratio is required and is not defaulted.",
 ["The vessel sized at 0.85 on liquid_volume.",
  "REFUSED: The maximum fill ratio must lie between 0 and 1.",
  "REFUSED: Unknown fill ratio basis \"\". Use liquid_volume or water_capacity_mass."],
 "SECTION 26: the fill limit is required and has no default; the blank probe prints \"REFUSED: A maximum fill ratio is required and is not defaulted. It is a code limit for the product and the vessel: LPG expands and a vessel filled liquid-full ruptures hydraulically.\" 0.85 is one of two illustrative limits typed for KANO, neither a code value.")

q(2, "The fill ratio basis is OMITTED from the call for KANO's vessel at a fill limit of 0.85. What does the engine do?",
 "It takes liquid_volume, names it, and gives 71.0685 t usable.",
 ["It takes water_capacity_mass, names it, and gives 62.9433 t usable.",
  "REFUSED: Unknown fill ratio basis \"\". Use liquid_volume or water_capacity_mass.",
  "It names the basis in missingInputs and gives usableTonnes null."],
 "SECTION 26: omitted from the call, the engine takes liquid_volume and names it in its output: fillRatioBasis liquid_volume, usableTonnes 71.0685 at a fill limit of 0.85. The refusal is what a basis typed blank ('') gets. 62.9433 t is the 0.42 limit on water_capacity_mass.")

q(2, "KANO's vessel is sized at a fill limit of 0.42 on water_capacity_mass. What usable LPG does the engine return?",
 "62.9433 t",
 ["35.1162 t",
  "71.0685 t",
  "27.8271 t"],
 "The 0.42 water_capacity_mass row prints usableTonnes 62.9433. 35.1162 t is the same 0.42 read on the other basis, as a share of the liquid volume, and 27.8271 t is how far that reading sits below the filling density's 62.9433 t. 71.0685 t is the 0.85 liquid_volume row.")

q(0, "On the water-capacity basis, at what density does the engine weigh the vessel's water capacity?",
 "WATER_KG_M3, that is 999.1 kg/m3",
 ["The blend's 557.4000 kg/m3",
  "n-butane's typical 584 kg/m3",
  "The studio blend's 553.6000 kg/m3"],
 "SECTION 26: on the water-capacity basis the engine weighs the water capacity at WATER_KG_M3 = 999.1 kg/m3. 557.4000 kg/m3 is KANO's blend density, the liquid density the vessel rows use; 584 kg/m3 is n-butane's typical row; 553.6000 kg/m3 is the studio opening blend.")

q(3, "At the 0.85 liquid_volume fill, which reorder point and ullage at reorder does lpgStorageSizing print for KANO?",
 "reorderAtTonnes 40.0000, ullageAtReorderTonnes 31.0685",
 ["reorderAtTonnes 40.0000, ullageAtReorderTonnes 22.9433",
  "reorderAtTonnes 16.0000, ullageAtReorderTonnes 31.0685",
  "reorderAtTonnes 16.0000, ullageAtReorderTonnes 22.9433"],
 "The 0.85 row prints reorderAtTonnes 40.0000 and ullageAtReorderTonnes 31.0685. 22.9433 is the 0.42 row's ullage; 16.0000 is the safety stock, which is the reorder point only when the lead time is omitted and takes the stated 0.")

q(1, "KANO's lead time is left blank ('') at the 0.85 fill. What does lpgStorageSizing return?",
 "lead time in missingInputs, reorderAtTonnes null, cover still 8.8840 days",
 ["missingInputs none, reorderAtTonnes 16.0000 from the safety stock alone",
  "REFUSED on the lead time, with no cover and no reorder point given",
  "lead time in missingInputs, reorderAtTonnes 40.0000, cover 8.8840 days"],
 "SECTION 26: a blank lead time is missing: missingInputs lead time; reorderAtTonnes null; deliveryFitsUllage no verdict; the cover (8.8840 days) does not depend on it and is still given. missingInputs none with a reorder point of 16.0000 is what the engine gives when the lead time is OMITTED and takes the stated 0.")

q(2, "A filling density of 0.6 on water capacity is put to KANO's vessel at the blend density. What does the engine print?",
 "REFUSED: At this density the filling density fills the vessel liquid-full. Check the limit and its basis.",
 ["REFUSED: The maximum fill ratio must lie between 0 and 1.",
  "A usable volume larger than the 150 m3 vessel, with the vapour space printed below zero.",
  "REFUSED: Unknown fill ratio basis \"weight\". Use liquid_volume or water_capacity_mass."],
 "SECTION 26's probe table prints the liquid-full refusal for this case. The between 0 and 1 refusal is the probe with a fill limit of 1; the unknown basis refusal is the basis typed as 'weight'.")

q(0, "What vapour space does lpgStorageSizing leave in KANO's 150 m3 vessel at the 0.42 water_capacity_mass limit?",
 "37.0770 m3",
 ["22.5000 m3",
  "112.9230 m3",
  "127.5000 m3"],
 "The 0.42 row prints usableM3 112.9230 and vapourSpaceM3 37.0770; the digest states vapourSpaceM3 is the vessel less usableM3. 22.5000 m3 is the vapour space at the 0.85 liquid_volume fill, and 127.5000 m3 that row's usable volume.")

q(3, "At the 0.85 fill, usableTonnes over the demand is printed as 8.8836, and the engine's coverDays as 8.8840. What does the digest give as the reason?",
 "The engine reports coverDays rounded to three decimals.",
 ["The engine holds the 16.0000 t safety stock back from the cover.",
  "The engine takes the cover on the water capacity at 999.1 kg/m3.",
  "The engine adds the 3 day lead time before it divides."],
 "SECTION 26's rounding note: the engine reports coverDays to three decimals, so its cover prints with a final 0 at four decimals and can differ in the fourth decimal from usableTonnes over the demand. The digest's rule is that coverDays is usableTonnes over the demand, with no safety stock, water weight or lead time in it.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/advanced/gva_m01.json', expect_n=15)
finish()
