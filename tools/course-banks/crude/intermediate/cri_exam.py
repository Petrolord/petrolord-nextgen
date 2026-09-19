import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Professional final exam, 42 questions over all six modules. Every figure
# is from digest SECTIONS 13 to 18, with the Kwale blend's SG and API as the
# Professional lessons quote them. Nine questions need two modules at once
# (Q5, Q6, Q7, Q20, Q21, Q28, Q35, Q36, Q37). Watson K at T50 (HELD C13) is
# asked about as what the engine does, never as the right basis.

q(1, "Take the 1030 F row of the Kwale table, where Kwale Light has distilled 90.0000 percent and Ughelli Medium 80.0000. Which blend figure sits on that row?",
 "85.5000 percent.",
 ["92.9219 percent.",
  "90.0000 percent.",
  "74.9677 percent."],
 "The blend at 55 and 45 is the volume-weighted sum of the two at a fixed temperature. 92.9219 is the blend at 1200 F and 74.9677 the blend at 860 F.")

q(3, "The studio opens on its default pair, 60 and 40. What does the digest print for the two crudes' own fifty percent points averaged by volume share, minus the engine's interpolated T50?",
 "-5.1429 F.",
 ["-2.9207 F.",
  "-3.3184 F.",
  "72.8571 F."],
 "On the default pair the engine reads T50 at 617.1429 F and the crudes' T50 averaged by volume share is 612.0000 F; the shortcut table prints that difference as -5.1429 F. Each other option sits in the same table on another row or in another column.")

q(0, "The Ebocha partial assay's last TBP point is 88 at 920. What does its curve say above 920 F?",
 "Nothing: its last point is below 100 percent, so the value above it is unknown.",
 ["That it is fully distilled, as the engine takes 100 percent above a last point.",
  "That it holds at 88 percent, the last value the assay recorded at 920 F.",
  "That it rises along its last segment's slope until it reaches 100 percent."],
 "Above a last point at 100 percent everything has distilled; Ebocha's last point is 88 percent, so the curve says nothing about its heaviest part. The Kwale Light and Ebocha blend stops at 920 F with 85.4516 percent.")

q(2, "Ughelli Medium's assay carries 70 at one temperature. Find that row in the Kwale table: which temperature is it, and what has the blend distilled?",
 "860 F, where the blend reads 74.9677 percent.",
 ["720 F, where the blend reads 64.0000 percent.",
  "650 F, where the blend reads 56.9474 percent.",
  "1030 F, where the blend reads 85.5000 percent."],
 "Ughelli Medium's assay carries 70 at 860. 720 F is Kwale Light's 70 percent point and 650 F is Ughelli Medium's 50 percent point.")

q(1, "Kwale Light and the Ebocha partial assay, 50 and 50, are cut on Kwale's set. Which fact from the blend's curve decides that two cuts have no yield?",
 "The curve keeps only temperatures where both crudes are known, so it starts at 110 F, above the 90 F bound those two cuts need.",
 ["The curve keeps every temperature Kwale Light measured, but Ebocha's share of the light end is taken as zero, which the cuts refuse.",
  "The curve keeps 8 of 11 temperatures, and the engine drops the two lightest cuts whenever a curve loses three points.",
  "The curve stops at 920 F, below the upper bounds of the two lightest cuts on Kwale's set."],
 "The blend's curve runs from 3.5217 percent at 110 F to 85.4516 percent at 920 F; of 11 temperatures it keeps 8. A cut whose bound lies outside that stretch cannot be answered.")

q(3, "Why is the blend's T50 read with temperatureAtVolumePercent, the same function a single crude uses?",
 "blendDistillationCurves gives the blend a curve of its own, so every temperature question about the blend is asked of that curve.",
 ["The engine treats the blend as its lighter crude whenever a temperature is asked of it, so a single crude's function applies to the blend unchanged.",
  "temperatureAtVolumePercent averages the crudes' curves inside itself before it reads a temperature, so the one function serves blends and crudes alike.",
  "A blend has no curve of its own, so the function is run on each crude and the two answers are weighted."],
 "Once the blend has a curve, the same function reads it. For the Kwale blend the engine's T50 is 587.3184 F.")

q(0, "Ughelli Medium's assay carries 30 at 480. Which Kwale Light and blend figures share that row?",
 "43.7500 and 37.5625 percent.",
 ["30.0000 and 37.5625 percent.",
  "43.7500 and 43.6471 percent.",
  "50.0000 and 43.6471 percent."],
 "The 480 F row reads Kwale Light 43.7500, Ughelli Medium 30.0000 and the blend 37.5625 percent. 43.6471 and 50.0000 are the blend and Kwale Light at 530 F.")

q(3, "What temperature does the engine read off the Kwale blend's curve at 90 volume percent?",
 "1133.0737 F.",
 ["1030 F.",
  "1200 F.",
  "796.5882 F."],
 "The engine interpolates on the blend's own curve, so the answer sits on no measured row. 1030 F and 1200 F are the rows either side, and 796.5882 F is the blend's 70 percent point.")

q(2, "The Kwale blend's curve reaches 212.2121 F at which volume percent?",
 "10 percent.",
 ["8.0714 percent.",
  "14.5833 percent.",
  "30 percent."],
 "The digest reads the Kwale blend at 10, 30, 50, 70 and 90 percent: 212.2121, 411.6294, 587.3184, 796.5882 and 1133.0737 F. 8.0714 is the blend at 190 F and 14.5833 at 265 F.")

q(0, "The Kwale blend's curve is read at 10, 30, 50, 70 and 90 percent. Why is each of those five temperatures an interpolation?",
 "None of the five is a volume percent that any of the blend's 14 points reads, so each falls between two points.",
 ["The engine rounds each reading to four decimals, and a rounded figure has to be interpolated back onto the curve.",
  "Each reading is taken on one crude's curve and carried to the blend, which needs a line drawn between the two.",
  "The blend's points sit at every 10 percent, so a reading between two of them is a line between two points."],
 "10 percent lies between the blend's rows at 190 F (8.0714) and 265 F (14.5833), and 90 percent between 1030 F (85.5000) and 1200 F (92.9219). The engine reads 212.2121 F and 1133.0737 F between them.")

q(1, "What does T50 tell a reader about a blend?",
 "The temperature at which the blend's own curve reaches 50 percent distilled.",
 ["The mean of the temperatures at which each crude reaches half of its own barrels, weighted by the crudes' volume shares in the blend.",
  "The temperature at which the blend's vapour pressure reaches half an atmosphere in a closed test cell, the figure a tank farm reads.",
  "The cut point at which the refinery splits naphtha from kerosene on the blend's own curve."],
 "temperatureAtVolumePercent(curve, 50) reads the temperature at which the blend's own curve reaches 50 percent. The studio also takes the blend's T50 as the boiling temperature in Watson K. For the Kwale blend it is 587.3184 F.")

q(3, "How does watsonK combine its two inputs?",
 "Tb^(1/3) / SG, with Tb in degrees Rankine.",
 ["SG^(1/3) / Tb, with Tb in degrees Rankine.",
  "Tb^(1/3) x SG, with Tb in degrees F.",
  "Tb / SG^(1/3), with Tb in degrees F."],
 "SG is the blend's specific gravity, blended on volume, 0.8595 for the Kwale blend. Tb is a boiling temperature on the absolute scale, which the studio takes as the blend's T50.")

q(2, "Suppose the Kwale blend's T50 is read from the grid instead of by interpolation. How far does the error travel?",
 "Into Watson K, which reads 12.0447 at the grid reading against 11.8135 at the interpolated T50.",
 ["Nowhere past T50, since Watson K is taken at the mean average boiling point.",
  "Into the cut yields, which the engine draws from the T50 before it cuts the rest of the curve.",
  "Into the netback, which the engine scales by the blend's T50 before it takes processing off."],
 "The grid reading minus the engine is 62.6816 F, and the studio takes Tb in Watson K as the blend's T50, so the characterisation factor moves with it.")

q(0, "Cutting the Kwale blend's own curve between 330 F and 480 F gives which kerosene figure?",
 "16.2860 volume percent.",
 ["16.2136 volume percent.",
  "18.1944 volume percent.",
  "16.6604 volume percent."],
 "16.2136 is the crude yields weighted by mass fraction, 18.1944 is Kwale Light's own kerosene, and 16.6604 is the blend's Kerosene / Jet on the studio's default cuts.")

q(1, "A refinery lifts its diesel cut to end at 700 F. How much of the Kwale blend does Diesel / AGO then take?",
 "24.4225 percent of every barrel.",
 ["19.3849 percent of every barrel.",
  "38.0150 percent of every barrel.",
  "5.0376 percent of every barrel."],
 "Diesel / AGO gains 5.0376 over its 19.3849 at 650 F, and Atmospheric residue falls to 38.0150.")

q(3, "On the studio's default cut set, how much of the Kwale blend lands in Vacuum residue?",
 "16.3586 percent by volume.",
 ["18.7143 percent by volume.",
  "26.6940 percent by volume.",
  "43.0526 percent by volume."],
 "The default set splits the heavy end at 1000 F. 26.6940 is the blend's Vacuum gasoil, 43.0526 its Atmospheric residue on Kwale's cuts, and 18.7143 the default pair's Vacuum residue.")

q(2, "Which cut set does the digest call a vacuum refinery's?",
 "The studio's default cuts, which split the heavy end at 1000 F.",
 ["Kwale's own cuts, with a single heavy cut from 650 F upward.",
  "The cut set drawn inside the Ebocha partial curve, from 110 F to 920 F.",
  "Kwale's cuts with the diesel end point moved from 650 F to 700 F."],
 "The studio's default cuts are printed on the Kwale blend for contrast as a vacuum refinery's cut set: Vacuum gasoil runs from 650 F to 1000 F and Vacuum residue from 1000 F with no upper bound.")

q(0, "Kwale's Kerosene / DPK runs from 330 F to 480 F and the default Kerosene / Jet from 350 F to 500 F. Why do the two kerosene yields of the same blend differ?",
 "Each covers a different stretch of the same curve, because two boundaries moved.",
 ["The default set weights the kerosene yield on mass, since jet is sold by the tonne.",
  "The two sets are drawn on different blends, one per refinery's crude slate.",
  "The default set normalises its yields to 100 percent after adding a vacuum split."],
 "The Kwale blend yields 16.2860 on Kwale's kerosene and 16.6604 on the default set's. Each moved boundary shifts barrels between the two cuts that share it.")

q(3, "What are Kwale Light's and Ughelli Medium's own Atmospheric residue yields on Kwale's cuts?",
 "37.3684 for Kwale Light and 50.0000 for Ughelli Medium.",
 ["43.0526 for Kwale Light and 43.2685 for Ughelli Medium.",
  "50.0000 for Kwale Light and 37.3684 for Ughelli Medium.",
  "37.3684 for Kwale Light and 40.1548 for Ughelli Medium."],
 "The two crude columns are each crude's own cut yields on Kwale's cuts. 43.0526 is the blend's residue and 43.2685 the mass-weighted reading; 40.1548 is the Kwale Light and Ebocha blend's residue.")

q(2, "On the Kwale Light and Ebocha blend, which output names LPG / Light ends and Naphtha as unknownCuts, and which names them as unyieldedCuts?",
 "cutYields names them in unknownCuts, and netbackValue names them in unyieldedCuts.",
 ["netbackValue names them in unknownCuts, and cutYields names them in unyieldedCuts.",
  "cutYields names them in both lists, and netbackValue carries the two lists forward.",
  "blendDistillationCurves names them in unknownCuts, and cutYields in unyieldedCuts."],
 "The two lists are the same gap seen by two functions. netbackValue keeps their yield and value empty and reports complete: false, with a netback of 48.3393 $/bbl over the cuts it can value.")

q(1, "Beside the engine's 0.7174 for LPG / Light ends, what does blendOnMass print for the Kwale blend?",
 "0.6951.",
 ["0.7174.",
  "1.3043.",
  "0.4615."],
 "0.6951 is the mass-weighted LPG figure. 1.3043 is Kwale Light alone, and 0.4615 is the default pair's LPG on the studio's default cuts.")

q(0, "Which row of Kwale's term table belongs to Diesel / AGO?",
 "18.9972 $/bbl of crude, from a yield of 19.3849 volume percent at 98 $/bbl of product.",
 ["24.5400 $/bbl of crude, from a yield of 43.0526 volume percent at 57 $/bbl of product.",
  "18.9972 $/bbl of crude, from a yield of 19.4040 volume percent at 98 $/bbl of product.",
  "98 $/bbl of crude, the diesel price, taken whole as the value of the cut."],
 "24.5400 is the residue's value. 19.4040 is diesel's mass-weighted reading (blendOnMass), which the netback does not use.")

q(3, "How is the Kwale gross product value of 74.2412 $/bbl of crude formed?",
 "It is the sum of the five cut values, each a yield fraction times its product price.",
 ["It is the mean of the five product prices, weighted by the crudes' volume shares.",
  "It is the netback plus the loss value, before processing and freight are added back.",
  "It is the sum of the five product prices, scaled by the fraction of barrels that close."],
 "The five values are 0.3443, 15.2137, 15.1460, 18.9972 and 24.5400 $/bbl of crude. The loss at 0.8 percent comes off after that sum.")

q(2, "In the Kwale netback, what are processing cost and freight per?",
 "Per barrel of crude: 6.8000 and 1.9000 $/bbl.",
 ["Per barrel of product: 6.8000 and 1.9000 $/bbl.",
  "Per barrel of crude: 0.5939 and 6.8000 $/bbl.",
  "Per barrel of crude, each scaled down by the 0.8 percent loss: 6.8000 and 1.9000 $/bbl."],
 "The netback formula ends with minus processing cost minus freight, all per barrel of crude. 0.5939 is the loss term, a different line of the account.")

q(1, "Which terms does netbackValue report beside the Kwale netback of 64.9473 $/bbl of crude?",
 "Gross 74.2412, loss value 0.5939, processing 6.8000 and freight 1.9000.",
 ["None: it reports the total, and the terms are left to the caller.",
  "Gross 74.2412, loss value 0.0696, processing 6.8000 and freight 1.9000.",
  "Gross 74.2412, loss value 0.5939, processing 1.9000 and freight 6.8000."],
 "Every term is reported beside the total: gross product value 74.2412, value lost to losses at 0.8 percent 0.5939, processing cost 6.8000 and freight 1.9000 $/bbl of crude. 0.0696 is how far the after-the-costs reading lands from the engine.")

q(0, "Under the complete Kwale valuation the digest prints: Costs taken as zero because they were blank: nothing. What does that line confirm?",
 "assumedZero is empty, so the netback of 64.9473 carries no assumed zero.",
 ["Every cut had a price, so unpricedCuts is empty and the valuation is complete.",
  "Every cost was refused and none entered the netback of 64.9473.",
  "The loss was taken on the product side, so no cost was reduced by it."],
 "A cost left blank would be taken as zero and named, as freight and losses are in the 67.4412 $/bbl case. Complete: true is the separate line about prices and yields.")

q(3, "What is the netback of 64.9473 $/bbl a measure of?",
 "What a barrel of the Kwale blend is worth at the Kwale refinery, once its products are valued and losses, processing and freight come off.",
 ["What a barrel of the Kwale blend sells for at the loading terminal before any refinery bids, set by the marker and the blend's API.",
  "What the Kwale refinery earns on each barrel of product it sells from the blend, after the product-side losses and before its own costs.",
  "What a barrel of the Kwale blend is worth against the marker crude, the figure a trader quotes when offering the blend at the refinery."],
 "netback = sum(cut yield fraction x cut product price) x (1 - loss percent / 100) - processing cost - freight, all per barrel of crude. The differential against the marker is a separate figure, -7.5527 $/bbl.")

q(2, "Which cut of the Kwale blend is priced at 48 $/bbl of product, and what is it worth per barrel of crude?",
 "LPG / Light ends, 0.3443 $/bbl of crude.",
 ["LPG / Light ends, 0.7174 $/bbl of crude.",
  "Naphtha, 15.2137 $/bbl of crude.",
  "Atmospheric residue, 24.5400 $/bbl of crude."],
 "The LPG / Light ends row reads a yield of 0.7174 volume percent, a price of 48 $/bbl of product and a value of 0.3443 $/bbl of crude. Naphtha is priced at 74 and Atmospheric residue at 57.")

q(1, "Which of the three rows valued against Kwale's marker carries a differential of -8.8324 $/bbl?",
 "Ughelli Medium alone, netting back 63.6676 $/bbl.",
 ["Kwale Light alone, netting back 65.9944 $/bbl.",
  "The blend at 55 and 45, netting back 64.9473 $/bbl.",
  "Ughelli Medium alone, netting back 72.9512 $/bbl."],
 "Each differential is that row's netback minus 72.5. 72.9512 is Ughelli Medium's gross, before the loss and the costs.")

q(0, "What is Kwale's marker of 72.5 $/bbl?",
 "The marker netback netbackValue sets each crude's netback against.",
 ["A published market price for a real grade, entered as the reference crude.",
  "The volume-weighted mean of the two crudes' netbacks at 55 and 45.",
  "The Kwale blend's gross product value before the loss and the costs."],
 "netbackValue takes a marker netback and reports the differential: this crude's netback minus the marker's. Like every figure in the course, 72.5 is invented. 64.9473 is the volume-weighted mean of the two crudes' netbacks and 74.2412 the blend's gross.")

q(3, "What does the digest print as the first point of the default pair's blend curve at or past 50 percent?",
 "690 F.",
 ["650 F.",
  "617.1429 F.",
  "614.2222 F."],
 "The shortcut table prints the default pair's grid reading minus the engine as 72.8571 F, the grid reading being 690 F. The Kwale blend's grid reading is 650 F. The other two options are the default pair's own interpolated and mass-weighted readings.")

q(2, "With nothing typed, the Crude Assay & Blending Studio values its default pair on its default cuts. Which gross product value and netback does it show?",
 "Gross 76.6165 and netback 69.7334 $/bbl.",
 ["Gross 74.2412 and netback 64.9473 $/bbl.",
  "Gross 75.2968 and netback 65.9944 $/bbl.",
  "Gross 72.9512 and netback 63.6676 $/bbl."],
 "The studio's default table prints gross product value 76.6165 and netback 69.7334 $/bbl. 74.2412 and 64.9473 are the Kwale blend's, 75.2968 and 65.9944 Kwale Light's alone, and 72.9512 and 63.6676 Ughelli Medium's alone.")

q(1, "What kind of test is D86, and how is a crude assay reported?",
 "D86 is a product test; a crude assay is reported as a TBP distillation.",
 ["D86 is the crude assay test; TBP is kept for finished products.",
  "D86 is a product test; a crude assay is reported as a D86 curve converted by d86ToTbp.",
  "D86 is a crude assay test that d86ToTbp converts with its own table."],
 "The digest: D86 is a product test; a crude assay is reported as a TBP distillation. d86ToTbp ships no coefficient table, and called without one it refuses.")

q(0, "Why does d86ToTbp ship no coefficient table for API Technical Data Book Procedure 3A1.1?",
 "Reproducing a published table from memory is something the engines refuse to do.",
 ["The table is proprietary to each refinery, calibrated on its own D86 runs.",
  "The conversion needs no table once the 50 percent point is known.",
  "The table applies only to products, and cutYields would refuse a converted crude."],
 "d86ToTbp has the structure of the cut-point-difference conversion. Called without the table it refuses and names two ways forward: supply it, or enter the assay as a TBP distillation.")

q(3, "Kwale Light's gross product value alone is 75.2968 $/bbl. What is it formed from?",
 "Kwale Light's own cut yields on Kwale's cuts, such as 24.2512 naphtha, each times Kwale's price for that product.",
 ["The blend's cut yields on Kwale's cuts, such as 20.5591 naphtha, weighted up by Kwale Light's volume share of 55.",
  "Kwale Light's own cut yields on the studio's default cuts, each times the default price for that product.",
  "Kwale Light's own cut yields weighted by mass fraction, each times Kwale's price for that product."],
 "Kwale Light's naphtha of 24.2512 at 74 and its residue of 37.3684 at 57 are two of its five pairings. The blend's own naphtha, 20.5591, belongs to the blend's gross of 74.2412.")

q(2, "Which rule from module 1 lies at the root of the 0.0000 between the Kwale blend's netback and the volume-weighted mean of its crudes' netbacks?",
 "Yields are additive on volume.",
 ["Temperatures are weighted on mass.",
  "A blank cost is taken as zero.",
  "A blend's curve keeps every row."],
 "Because yields add on volume, the blend's cut yields equal the volume-weighted crude yields, and the gross, the loss and the per-barrel costs keep that weighting through to the netback.")

q(1, "Which of these printed differences shows a shortcut that fails?",
 "The volume-weighted mean of the crudes' T50 minus the engine, -3.3184 F.",
 ["The volume-weighted crude yields minus the blend's cut yields, 0.0000 on every cut.",
  "The blend's netback minus the volume-weighted mean of its crudes' netbacks, 0.0000.",
  "The change in the total when the diesel end moves to 700 F, 0.0000."],
 "Yields add on volume, so the cut yields and the netback each match their volume-weighted readings at 0.0000. The volume-weighted mean of the crudes' T50 minus the engine's 587.3184 F is -3.3184 F. The diesel end point is a cut point moving, which is no shortcut.")

q(0, "What blend API does the studio show when it opens on its default pair, 60 and 40?",
 "30.6451.",
 ["33.1219.",
  "32.8173.",
  "29.3808."],
 "The default table prints blend API 30.6451. 33.1219 is the Kwale blend's API, 32.8173 the Associate tier's Obigbo export blend and 29.3808 its 20 and 40 API pair at 50 and 50.")

q(3, "Segment overlap is one of the oracle's roads. Which figure does it reach that way, and what is the engine's road to the same figure?",
 "A cut's yield: the oracle measures each segment's overlap with the cut, where the engine takes the curve at the upper bound minus the lower.",
 ["The blend's T50: the oracle measures how much of each straight segment lies below 50 percent, where the engine interpolates between the two points either side.",
  "The netback: the oracle overlaps the product segments with the cargo's barrels, where the engine sums yield fractions times prices and takes off the costs.",
  "The mass fractions: the oracle overlaps each crude's barrels with its pounds, where the engine converts volume shares to mass shares with a formula."],
 "The oracle takes yields by segment overlap. cutYields returns each cut's yield as the curve at the cut's upper bound minus the curve at its lower bound. The oracle finds T50 by bisection and loads a cargo in barrels and pounds.")

q(2, "How does the oracle recover a viscosity from a Refutas index?",
 "By bisection, halving an interval until the viscosity whose index matches is closed in on.",
 ["By viscosityFromBlendIndex, the engine's own inversion, run inside the oracle.",
  "By averaging the crudes' viscosities linearly on mass fraction and reading the index off that average.",
  "By blending the index on volume fractions, as ASTM D7152 does, then inverting it."],
 "The engine inverts the index directly with viscosityFromBlendIndex. The oracle searches for it, so the two roads are independent.")

q(1, "One cut of the Kwale blend contributes 15.1460 $/bbl of crude. Which cut, from which yield and price?",
 "Kerosene / DPK, 16.2860 volume percent at 93 $/bbl of product.",
 ["Naphtha, 20.5591 volume percent at 74 $/bbl of product.",
  "Kerosene / DPK, 16.2136 volume percent at 93 $/bbl of product.",
  "Diesel / AGO, 19.3849 volume percent at 98 $/bbl of product."],
 "Kerosene / DPK is worth 15.1460 $/bbl of crude. Naphtha is worth 15.2137 and Diesel / AGO 18.9972. 16.2136 is kerosene's mass-weighted reading, which the netback does not use.")

q(0, "The Kwale blend, 55 and 45, prints API 33.1219 and sulfur 0.2268 wt%. Which SG sits beside them, the SG that Watson K divides by?",
 "0.8595.",
 ["0.8727.",
  "0.8328.",
  "0.8922."],
 "The digest prints Blend API 33.1219, SG 0.8595, sulfur 0.2268 wt% (mass basis). 0.8727 is the studio's default pair's SG, 0.8328 Kwale Light's and 0.8922 Ughelli Medium's.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/intermediate/cri_exam.json', label='cri_exam', expect_n=42)
finish()
