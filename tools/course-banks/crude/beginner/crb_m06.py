import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Associate m06, The Associate Reading. Written from digest.txt SECTIONS 3
# and 12, read as one library and one export blend, as the three lessons of this
# module teach them: the Obigbo blend end to end, the library crude by crude, and
# what the next tier changes.

q(3, "Which pairing of a figure and a basis is the engine's own for the Obigbo export blend?",
 "viscosity 7.4743 cSt, on the Refutas index on mass fraction",
 ["API 32.8173, on volume, like the specific gravity it came from",
  "sulfur 0.2642 wt%, on volume, the fraction the cargo is typed in",
  "nickel 6.5980 ppm, on the Refutas index on mass fraction"],
 "The engine names volume for specific gravity and mass for sulfur, TAN, nitrogen, nickel and vanadium. Viscosity carries \"Refutas index on mass fraction\", and API carries its own sentence: \"computed from the volume-blended specific gravity, never averaged directly\"."),

q(0, "What CII and verdict does the export blend carry with every SARA supplied?",
 "0.9163, band unstable, stable false.",
 ["0.9163, band uncertain.",
  "0.6634, band stable, stable true.",
  "1.1598, which is Obigbo Light's own index alone."],
 "At or above 0.9 the band is unstable, and 0.9163 is at or above it. 0.6634 is Egbema Medium with Obigbo Light at 85 and 15, and 1.1598 is Obigbo Light alone."),

q(2, "Every per-mass property of the export blend is weighted by which fractions?",
 "0.6346 for Obigbo Light and 0.3654 for Egbema Medium.",
 ["0.6500 and 0.3500, the volume shares as typed.",
  "0.4775 and 0.3063, the mass fractions the blend carries.",
  "0.6346 for sulfur, and 0.6500 for the two metals, nickel and vanadium."],
 "The engine forms the mass fractions once, from the volume shares and each crude's specific gravity, and every per-mass property reads them. 0.4775 and 0.3063 belong to the three-crude blend."),

q(1, "With SARA the export blend screens unstable, and without SARA the gravity screen gives no verdict. Which answer should a terminal act on?",
 "The index: the fallback declines to decide, and the index decides unstable.",
 ["The gravity screen, since it reads the gravities the buyer is quoted on.",
  "Neither, since two screens of one blend that disagree cancel each other out.",
  "The gravity screen, since no verdict outranks a verdict drawn from SARA."],
 "The two answers agree in the only way they can: the fallback declines to decide, and the index decides. The engine's message for the unstable band reads: Do not commingle without a lab test."),

q(1, "The export blend's cut yields on the default cuts total 100.0000 and the set closes. Why does every cut have a yield?",
 "Both crudes' curves run from 0 to 100 percent.",
 ["The engine normalises the blend's six yields to 100.",
  "The blend's curve is the volume average of the two crudes' temperatures.",
  "Egbema Medium's LPG yield of 0.0000 is dropped from the set."],
 "With both curves covering 0 to 100 percent, every cut on the blend's curve has a yield: 0.2708, 22.1456, 16.6342, 17.0344, 26.8621 and 17.0528. Cuts with no yield: nothing. The Professional tier explains how that curve is formed."),

q(2, "Which library crude is the naphtha source, by its yield on the default cuts?",
 "Ubie Condensate, at 52.5974.",
 ["Obigbo Light, at 25.2590, the light crude.",
  "Ubie Condensate, at 22.7807 volume percent.",
  "Egbema Medium, at 16.3636, the medium crude."],
 "Ubie Condensate's Naphtha cut is 52.5974, the largest in the Naphtha column; 22.7807 is its Kerosene / Jet. A condensate is a diluent and a naphtha source."),

q(0, "In the three-crude blend Asarama Heavy is 20 by volume. What is its mass fraction, and what is the vanadium gap there?",
 "0.2162, and vanadium on mass minus volume is 1.5761 ppm.",
 ["0.2000, since a volume share carries straight over, and 0.1123 ppm.",
  "0.1846, and 1.5761 ppm.",
  "0.2162, and vanadium on mass minus volume is 0.6702 ppm there."],
 "Asarama Heavy, at 0.9516, carries 0.2162 of the mass. 0.1846 is its volume fraction when 20 is typed by mass, 0.6702 is the nickel gap, and 0.1123 is the export blend's vanadium gap."),

q(3, "What can the Ebocha partial assay blend for?",
 "Gravity and sulfur; any other property is not blended, with Ebocha named.",
 ["Every property, with its blanks read as zero.",
  "Nothing, since a partial assay is refused.",
  "Gravity alone, since its curve stops at 88."],
 "Ebocha carries an API of 31.4 and a sulfur of 0.22, and everything else is not given. It can blend for those two; for any property it does not carry, the engine names it each time."),

q(2, "Which library crude is the one whose aromatics and resins hold asphaltenes in a blend?",
 "Egbema Medium, with a CII alone of 0.6026.",
 ["Asarama Heavy, CII alone 0.7668.",
  "Obigbo Light, CII alone 1.1598.",
  "Ubie Condensate, with a CII alone of 8.3458."],
 "Egbema Medium carries 42.6 wt% aromatics and 19.8 wt% resins. Blended at 85 with 15 of Obigbo Light, the pair screens stable at 0.6634."),

q(0, "Which held convention does the Professional tier add, beside the one this tier has already met?",
 "Watson K taken at the blend's fifty percent point.",
 ["The Refutas index averaged on mass fraction, with ASTM D7152 beside it.",
  "Sulfur and the metals weighted on mass fraction by the engine.",
  "The two thresholds of the gravity-contrast rule, found by bisection."],
 "The Refutas basis is the held convention of module three. The Professional tier adds Watson K taken at the fifty percent point, a screening basis; the strict basis is the mean average boiling point."),

q(3, "How does the Professional tier say a blend's own curve is formed?",
 "Yields add on volume at each temperature, and temperatures are never averaged.",
 ["The crudes' temperatures at each volume percent are averaged on volume.",
  "The crudes' curves are averaged on mass, as sulfur and the metals are.",
  "The blend's cut yields are read from the heavier crude's curve alone."],
 "The next tier shows the engine forming a blend's curve from its crudes' curves: yields add on volume at each temperature. In this tier the export blend's cut yields are read as given."),

q(1, "Why does the gravity rule flag Asarama Heavy with Ubie Condensate when SARA is left out?",
 "A contrast of 37.4000 with a light paraffinic crude, past both thresholds.",
 ["Its CII of 1.7614 is past the 0.9 edge, which the rule reads.",
  "A contrast of 37.4000 on its own; the lighter crude is not checked.",
  "Asarama Heavy's 11.9 wt% asphaltenes, which the rule reads directly."],
 "A flag needs a contrast above 15.0000 and a lighter crude above 35.0000, both at once. Ubie Condensate is 54.6 API. The rule reads gravities only; the CII route is a different screen."),

q(0, "Obigbo Light is called the light, low-sulfur backbone of the export blend. Which figures support that?",
 "36.8 API and 0.14 wt% sulfur.",
 ["0.8408 API and 0.14 wt% sulfur.",
  "36.8 API, 0.48 wt% sulfur.",
  "54.6 API, 0.03 wt% sulfur."],
 "Obigbo Light is 36.8 API, specific gravity 0.8408, with 0.14 wt% sulfur. 0.48 is Egbema Medium's sulfur, and 54.6 and 0.03 are Ubie Condensate's."),

q(2, "The export blend's 7.4743 cSt is reported under a held convention. What does that mean for its reader?",
 "It is the engine's figure on the basis it names, and the choice of basis is held open.",
 ["It is provisional, and the engine will recompute it on volume fractions when asked.",
  "It is the correct figure, and the volume-basis 7.3107 is a slip.",
  "It is a straight cSt average on mass, standing in until a basis is decided."],
 "The engine blends the Refutas index on mass fraction and names that basis. ASTM D7152 blends on volume, which gives 7.3107 for this blend, and the course does not say which is right."),

q(3, "A buyer reads the export blend's gravity, sulfur and viscosity. Which set is the engine's result?",
 "32.8173 API, 0.2642 wt% sulfur and 7.4743 cSt.",
 ["32.9850 API, 0.2590 wt% sulfur and 7.3107 cSt.",
  "32.8173 API, 0.2590 wt% sulfur and 10.9576 cSt on mass.",
  "32.9850 API, 0.2642 wt% and 7.4743 cSt."],
 "32.9850 is the volume-weighted mean of the API numbers, 0.2590 is sulfur on volume, 7.3107 is the index on volume and 10.9576 is the straight cSt average. None of them is in the engine's result."),

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/beginner/crb_m06.json', label='crb_m06', expect_n=15)
finish()
