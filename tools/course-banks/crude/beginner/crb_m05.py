import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Associate m05, Will the Blend Stay Stable. Written from digest.txt
# SECTION 11 (and the export blend's CII from SECTION 12, which the lessons of
# this module quote) as the five lessons teach them: the colloidal instability
# index, three bands and three answers, SARA blends on mass, the gravity rule
# that can raise a flag and cannot clear one, and no gravity, no screen.

q(1, "How does the engine form the colloidal instability index from a SARA analysis?",
 "Saturates plus asphaltenes, over aromatics plus resins.",
 ["Aromatics plus resins, over saturates plus asphaltenes, so a high CII is stable.",
  "Saturates plus aromatics over resins plus asphaltenes.",
  "Asphaltenes over resins."],
 "The top of the fraction is what destabilises: the saturates that push asphaltenes out, and the asphaltenes themselves. Aromatics and resins, at the bottom, hold them."),

q(3, "Ubie Condensate carries only 0.2 wt% asphaltenes, yet its CII alone is 8.3458. Where does its danger lie?",
 "In its 89.1 wt% saturates, which push asphaltenes out of a crude that carries them.",
 ["In its own asphaltenes, which it drops in its own tank once its CII is past the 0.9 edge.",
  "In its low viscosity of 1.1 cSt, which lets asphaltenes settle out faster.",
  "Nowhere, since a CII of a crude alone only describes that crude."],
 "A condensate has almost no asphaltenes of its own to lose. Its danger is as a blend component: its saturates, poured into a crude that carries asphaltenes, are exactly what pushes them out."),

q(0, "A blend's CII is 0.7161. What does screenBlendStability return?",
 "stable null in the uncertain band, with a spot test named.",
 ["stable false, since 0.7161 is past the 0.7 threshold.",
  "stable true, since 0.7161 is below 0.9.",
  "stable false in the unstable band, with a lab test demanded."],
 "Below 0.7 is stable (true), from 0.7 to below 0.9 is uncertain (null, spot test), and at or above 0.9 is unstable (false). Asarama Heavy with Egbema Medium at 70 and 30 lands at 0.7161."),

q(2, "Which of these pairs screens stable on the CII, and at what index?",
 "Egbema Medium with Obigbo Light, 85 and 15, at 0.6634.",
 ["Asarama Heavy with Egbema Medium, 70 and 30, at 0.7161.",
  "Egbema Medium alone, at 0.6026, as the stabilising crude.",
  "The Obigbo export blend, 65 and 35, at 0.9163."],
 "0.6634 is below 0.7, so the pair returns stable true. 0.7161 is uncertain, the export blend's 0.9163 is unstable, and 0.6026 is a crude alone, which is no blend verdict."),

q(0, "Why must a stable answer of null never be drawn as a tick?",
 "Null means the screen cannot decide; a tick turns we do not know into safe.",
 ["Null means the SARA was blank, and the engine treats a blank as absent data.",
  "Null is a weak yes: the blend may be loaded, with a routine check in the tank.",
  "Null means no CII was formed, so nothing can be drawn."],
 "Stable null is its own answer: the index sits where blends go either way. The engine names the tests that can decide it, ASTM D7112 and D7157, and the assay explorer draws no verdict as its own state."),

q(2, "Asarama Heavy alone has a CII of 0.7668 and Ubie Condensate alone 8.3458. How does the engine reach the 50 and 50 pair's CII of 1.7614?",
 "It blends the four SARA fractions on mass and forms the index from the blended fractions.",
 ["It averages the two crudes' own CII figures, each weighted by the crude's mass fraction in the blend.",
  "It averages the two crudes' own CII figures on volume, since the pair is typed by volume in barrels.",
  "It takes the larger of the two crudes' own CII figures as the conservative screen."],
 "The CII is a ratio, and a ratio of averages differs from an average of ratios. The blend's index comes from the blend's composition, and there is no shortcut from the two single-crude indices to it."),

q(3, "For Asarama Heavy with Ubie Condensate at 50 and 50, what CII does SARA blended on volume give, beside the engine's figure?",
 "1.9718 on volume; the engine's mass figure is 1.7614.",
 ["1.7614 on volume; the engine's figure with the SARA blended on mass is 1.9718.",
  "0.2104, the index the volume fractions give for the pair.",
  "1.7614 on both bases, since the pair is 50 and 50 by volume."],
 "The engine blends SARA on mass: 1.7614. SARA on volume gives 1.9718, and the volume reading minus the engine prints 0.2104. The engine never reports the volume figure."),

q(1, "SARA blended on volume gives 1.9718, 0.7141 and 0.6671 for the three pairs, where the engine gives 1.7614, 0.7161 and 0.6634. Would the volume basis have moved any pair into a different band?",
 "No: each volume figure sits in the same band as the engine's figure.",
 ["Yes: the uncertain pair falls to stable at 0.7141.",
  "Yes: the stable pair rises into uncertain at 0.6671.",
  "Yes: the unstable pair falls to uncertain at 1.9718."],
 "Against the thresholds 0.7 and 0.9: 1.9718 is unstable, 0.7141 is uncertain and 0.6671 is stable, the bands the engine gives. The uncertain pair's gap is -0.0020 beside a band edge of 0.7, which is why the basis must be right."),

q(1, "With no SARA, the screen falls back to a gravity-contrast rule. What can that rule return?",
 "stable false when it flags, and stable null when it does not.",
 ["stable false when it flags, and stable true whenever it does not.",
  "stable true, null or false, the same three answers as the index.",
  "only stable null, since a rule of thumb decides nothing."],
 "The rule can raise a flag and it cannot clear one: when it does not flag, the engine returns stable null. Stable true comes only from the CII route."),

q(0, "The lighter crude is held at 40 API. At a contrast of 15.0000 the engine gives no verdict, and at 15.0100 it returns false. What do the two probes show?",
 "The contrast must be above 15.0000; a contrast at the threshold does not flag.",
 ["The flag is raised at a contrast of 15.0000 and above.",
  "The lighter crude, at 40 API, is below its own threshold.",
  "The rule reads contrasts only to two decimals near the edge."],
 "Bisection on the engine puts the contrast threshold at 15.0000, with the lighter crude at 45 API. At exactly 15.0000 there is no verdict; at 15.0100 the rule flags. 40 API is past the lighter-crude threshold of 35.0000."),

q(3, "A pair with no SARA has a lighter crude of 35 API and a heavier one of 19 API, a contrast of 16.0000. What does the rule return?",
 "No verdict: the lighter crude sits at its 35.0000 threshold and must be above it.",
 ["false: the contrast of 16.0000 is past its 15.0000 threshold, which is enough.",
  "false: both conditions are met, the contrast at 16.0000 and the lighter crude at 35.",
  "true: a contrast of 16.0000 with a lighter crude of 35 is a stable combination."],
 "A flag needs a contrast above one threshold and a lighter crude above the other, both at once. At 35.01 with the same heavier crude the rule flags, with a contrast of 16.0100."),

q(2, "With SARA removed, the export blend's gravity screen shows a contrast of 10.9000 and no verdict. With SARA, it screens unstable at 0.9163. What do the two answers show?",
 "An absent flag is no clearance: a true would have called stable a blend the index calls unstable.",
 ["The index is in error, since the gravity screen found nothing wrong with the blend.",
  "The gravity rule is the stricter screen, since it withholds a verdict the index gives.",
  "A contrast of 10.9000 lies inside the range where the gravity rule raises its flag."],
 "The rule captures one known danger, and a blend can drop asphaltenes for reasons the gravity spread does not show. So an absent flag proves nothing, and the engine will not turn it into a stable verdict."),

q(3, "SARA is supplied for Obigbo Light only, in the export blend. What does the screen do?",
 "It falls back to api-contrast, and says SARA was not supplied for every crude.",
 ["It forms the CII from Obigbo Light's SARA alone.",
  "It reads Egbema Medium's missing SARA as zero and forms the CII.",
  "It refuses the blend until SARA is supplied for both."],
 "The index needs SARA on every crude. With SARA on some crudes only, the basis is api-contrast, the stable answer is no verdict, and the message begins: SARA was not supplied for every crude, so this is an API-contrast screen only."),

q(0, "screenBlendStability is called on its own with no SARA and one crude that has no API and no specific gravity. What does it return?",
 "Basis none, the contrast not formed, and no verdict.",
 ["Basis api-contrast, with the missing gravity taken as zero and the pair flagged.",
  "A refusal that names the crude with no gravity.",
  "Basis api-contrast, formed from the one crude that has a gravity."],
 "Neither route is open, so no stability screen is made and the message says why. The refusal quoted is blendCrudes', which refuses such a crude before any screen is made."),

q(1, "Which route of the screen can return stable true?",
 "Only the CII route, with the blend's index below 0.7.",
 ["Either route: an index below 0.7, or a gravity rule that does not flag.",
  "Only the gravity rule, when the contrast is at or below 15.0000.",
  "The CII route, with the blend's index anywhere below 0.9."],
 "Stable false comes from either route. No verdict comes from three places: the uncertain band, a gravity screen that did not flag, and a screen that could not be made. Stable true comes only from an index below 0.7."),

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/beginner/crb_m05.json', label='crb_m05', expect_n=15)
finish()
