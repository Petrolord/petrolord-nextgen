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
 "CII = (saturates + asphaltenes) / (aromatics + resins). Saturates precipitate asphaltenes; aromatics and resins hold them. Below 0.7 the blend screens stable, and at or above 0.9 unstable.")

q(3, "What does colloidalInstabilityIndex give for Ubie Condensate alone?",
 "8.3458.",
 ["1.1598.",
  "0.7668.",
  "1.7614."],
 "The crude-alone table prints 1.1598 for Obigbo Light, 0.6026 for Egbema Medium, 0.7668 for Asarama Heavy and 8.3458 for Ubie Condensate. 1.7614 is Asarama Heavy with Ubie Condensate at 50 and 50.")

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

q(0, "Asarama Heavy with Egbema Medium at 70 and 30: what blended asphaltenes does the screen form on mass?",
 "9.4791.",
 ["11.9.",
  "6.7035.",
  "3.2450."],
 "The pair's row prints blended saturates 32.2493, aromatics 38.7563, resins 19.5153 and asphaltenes 9.4791, and its CII is 0.7161. 11.9 is Asarama Heavy's own asphaltenes, 6.7035 belongs to the pair with Ubie Condensate and 3.2450 to Egbema Medium with Obigbo Light.")

q(2, "Asarama Heavy alone has a CII of 0.7668 and Ubie Condensate alone 8.3458. How does the engine reach the 50 and 50 pair's CII of 1.7614?",
 "It blends the four SARA fractions on mass and forms the index from the blended fractions.",
 ["It averages the two crudes' own CII figures, each weighted by the crude's mass fraction in the blend.",
  "It averages the two crudes' own CII figures on volume, since the pair is typed by volume in barrels.",
  "It takes the larger of the two crudes' own CII figures as the conservative screen."],
 "screenBlendStability blends each SARA fraction on mass and forms CII = (saturates + asphaltenes) / (aromatics + resins) from the blended fractions: 57.0828, 24.7639, 11.4498 and 6.7035 give 1.7614.")

q(3, "For Asarama Heavy with Ubie Condensate at 50 and 50, what CII does SARA blended on volume give, beside the engine's figure?",
 "1.9718 on volume; the engine's mass figure is 1.7614.",
 ["1.7614 on volume; the engine's figure with the SARA blended on mass is 1.9718.",
  "0.2104, the index the volume fractions give for the pair.",
  "1.7614 on both bases, since the pair is 50 and 50 by volume."],
 "The engine blends SARA on mass: 1.7614. SARA on volume gives 1.9718, and the volume reading minus the engine prints 0.2104. The engine never reports the volume figure."),

q(1, "For Egbema Medium with Obigbo Light at 85 and 15, what does the CII from SARA on volume minus the engine's CII print?",
 "0.0037.",
 ["-0.0020.",
  "0.2104.",
  "0.6671."],
 "The engine's CII is 0.6634 and SARA on volume gives 0.6671, and the difference column prints 0.0037. -0.0020 and 0.2104 are the other two pairs' differences.")

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
 "The rule raised no flag and cannot clear one, and the index says unstable.",
 ["The index is in error, since the gravity screen found nothing wrong with the blend.",
  "The gravity rule is the stricter screen, since it withholds a verdict the index gives.",
  "A contrast of 10.9000 lies inside the range where the gravity rule raises its flag."],
 "The gravity rule can raise a flag and it cannot clear one: when it does not flag, the engine returns stable null, never true. With the SARA taken away, the rule of thumb did not raise its flag, and the index says unstable.")

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
