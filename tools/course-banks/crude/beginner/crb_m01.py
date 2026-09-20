import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Associate m01, What an Assay Carries. Written from digest.txt SECTIONS
# 1, 2 and 3 as the four lessons of this module teach them: the four questions
# and their functions, API as a hyperbola in specific gravity, the Obigbo
# library, and the two modules and the kernel.

q(1, "The studio answers four questions, each with its own function. Which function answers whether a mixture will drop asphaltenes in the tank?",
 "screenBlendStability, which runs inside blendCrudes.",
 ["colloidalInstabilityIndex, run on each crude alone.",
  "blendViscosity, since an asphaltene sludge first shows itself as a thicker blend.",
  "watsonK, which characterises each crude."],
 "The function table pairs the tank question with screenBlendStability (inside blendCrudes). colloidalInstabilityIndex is printed for each crude alone, and neither blendViscosity nor watsonK answers any of the four questions.")

q(3, "The module table counts what each engine module exports. What does crudeAssay export?",
 "18 functions and 1 table, CII_BANDS.",
 ["5 functions and 4 constants, among them SPEC_TEMPLATES and BLEND_BASIS.",
  "1 function, solveLP, and 1 constant, LP_STATUS.",
  "18 functions and 4 constants, among them BINDING_TOLERANCE."],
 "crudeAssay exports 18 functions and 1 table, CII_BANDS. The 5 functions and 4 constants are productBlending's row, and solveLP with LP_STATUS is lib/lp/simplex."),

q(0, "Which function does productBlending call in lib/lp/simplex, and where do its gravity and viscosity rules come from?",
 "solveLP, with the gravity and viscosity rules imported from crudeAssay.",
 ["solveLP, with its own restated copy of the gravity and viscosity rules.",
  "optimiseBlend, with the sulfur and SARA rules imported from crudeAssay.",
  "blendCrudes, with the gravity and viscosity rules taken from lib/lp/simplex."],
 "The Product Blending Optimizer calls productBlending, which calls the LP kernel solveLP in lib/lp/simplex and imports the gravity and viscosity rules from crudeAssay rather than restating them. optimiseBlend is productBlending's own function, and blendCrudes is crudeAssay's.")

q(2, "sgFromApi is SG = A / (API + B). What values does the engine give for A and B when they are read back from apiFromSg?",
 "A is 141.5000 and B is 131.5000.",
 ["A is 131.5000 and B is 141.5000.",
  "A is 14.5340 and B is 10.9750.",
  "A is 141.5000 and B is 10.0000, the API of water."],
 "A is apiFromSg(0.5) minus apiFromSg(1), 141.5000, and B is A minus apiFromSg(1), 131.5000. 14.5340 and 10.9750 are the Refutas constants, and 10.0000 is water's API."),

q(2, "The engine is handed specific gravity in equal steps from 0.75 to 1. What does the API step column print?",
 "A different step on every row, from -11.7917 on the first step to -7.4474 on the last.",
 ["One step repeated on every row, -9.2484, because API is a straight line in specific gravity.",
  "Steps that grow toward water, from -7.4474 near 0.75 to -11.7917 at 1.",
  "A step of -11.7917 at the light end, then one constant step for the rest of the way to water."],
 "The table prints five different steps: -11.7917, -10.4044, -9.2484, -8.2748 and -7.4474. API is a hyperbola in specific gravity: equal steps of specific gravity are unequal steps of API.")

q(0, "Each library API goes into sgFromApi and comes back through apiFromSg to four decimals: 17.2 returns 17.2000, 54.6 returns 54.6000. What does the round trip show?",
 "apiFromSg is the inverse of sgFromApi: each API comes back as it went in.",
 ["Each API comes back moved a little, and the round trip column prints the drift.",
  "API blends on a straight line, because a round trip through specific gravity is linear.",
  "The library's API figures were themselves computed from measured specific gravities."],
 "sgFromApi is SG = A / (API + B), and apiFromSg is its inverse. Every row of the round trip column returns the API it was given: 10.0000, 17.2000, 54.6000 and the rest. In the library, API is the input and specific gravity is the computed column.")

q(3, "Which column of the library's property table does the engine compute instead of taking it as typed?",
 "The specific gravity, from API through sgFromApi.",
 ["The API, from a measured specific gravity through apiFromSg.",
  "The viscosity, from each crude's Refutas index through viscosityFromBlendIndex.",
  "The sulfur, from the saturates and aromatics in the SARA analysis."],
 "Specific gravity is computed from API by sgFromApi, so it prints to four decimals (Obigbo Light 0.8408). API, sulfur, viscosity and SARA are inputs and print exactly as typed."),

q(1, "What does the Ebocha partial assay carry beside its curve?",
 "An API of 31.4 and a sulfur of 0.22 wt%, and nothing else.",
 ["A specific gravity of 0.8686 typed from a laboratory, with its API computed from it.",
  "An API, a sulfur and a SARA analysis, with only the metals and viscosity not given.",
  "A full property row, with the blanks typed as 0."],
 "The Ebocha row carries API 31.4 and sulfur 0.22; every other property reads not given. Its 0.8686 is computed from the API, and a not given field is a blank. A blank is no zero."),

q(0, "Which crude in the library has a curve that cannot say what happens at 100 percent distilled?",
 "Ebocha partial assay, whose last point is 88 at 920.",
 ["Asarama Heavy, whose curve ends at 1560.",
  "Ubie Condensate, whose curve ends at 760 F.",
  "Obigbo Light, because the gap from 90 at 1060 to its end point is unmeasured."],
 "Four curves run from 0 to 100 percent. The Ebocha curve starts at 4 percent and stops at 88, and outside a curve's range the value is unknown except where the curve itself says so, below a first point at 0 percent or above a last point at 100.")

q(3, "Which library crude carries the most vanadium, and how much?",
 "Asarama Heavy, at 96 ppm.",
 ["Asarama Heavy, at 41 ppm, the figure in its metals column.",
  "Egbema Medium, at 8.7 ppm.",
  "Obigbo Light, at 1.4 ppm."],
 "Asarama Heavy's vanadium is 96 ppm, the largest in the vanadium column (8.7, 1.4 and 0.2 for the others, Ebocha not given). Its 41 ppm is nickel."),

q(1, "Which library crude has the highest API and the lowest specific gravity?",
 "Ubie Condensate, at 54.6 API and 0.7603.",
 ["Obigbo Light, at 36.8 API and 0.8408, the light crude of the library.",
  "Asarama Heavy, at 17.2 API and 0.9516.",
  "Ebocha partial assay, at 31.4 API and 0.8686."],
 "Ubie Condensate's 54.6 API and 0.7603 are the highest API and lowest specific gravity in the library. Water, at specific gravity 1, is 10.0000 API.")

q(2, "Which of the two apps chooses the shares of a blend?",
 "The Product Blending Optimizer, which returns a least-cost recipe.",
 ["The Crude Assay & Blending Studio.",
  "Neither app; both take the shares a user types.",
  "The studio, through screenBlendStability."],
 "The optimizer's one question is the least-cost recipe that meets every specification, answered by optimiseBlend. None of the studio's four questions asks for a recipe.")

q(0, "Library inputs such as 4.6 cSt and 22 cSt print with one decimal or none, while specific gravity prints as 0.8408. Why?",
 "Inputs print as typed, and every computed figure prints to four decimals.",
 ["The engine rounds each input to its measured precision.",
  "Viscosity is stored in whole cSt, and specific gravity needs four decimals for API.",
  "Only specific gravity is blended, so only it carries full precision."],
 "The digest's precision rule: every computed figure prints to four decimals, and every input prints exactly as it is typed. Viscosity in the library is typed, and specific gravity is computed from API by sgFromApi.")

q(2, "Why can a quantity that mixes on a straight line in specific gravity not also mix on a straight line in API?",
 "API is a hyperbola in specific gravity, so equal steps of one are unequal steps of the other.",
 ["API is quoted at a reference temperature that differs from the one used for specific gravity.",
  "API is defined per unit mass, while specific gravity is defined per unit volume.",
  "API is typed with one decimal and specific gravity with four, so the averages diverge."],
 "API = A / SG - B is a hyperbola in specific gravity: equal steps of specific gravity are unequal steps of API. The engine blends specific gravity on volume and converts the blended figure back to API; API itself is never averaged.")

q(1, "The Ebocha partial assay's TAN reads not given. How does the engine treat it when a blend needs TAN?",
 "As absent: it names Ebocha and returns TAN as not blended.",
 ["As 0, so Ebocha dilutes the blend's TAN.",
  "As the mean TAN of the four full crudes.",
  "As grounds to refuse the whole blend."],
 "The library keeps blanks as blanks. The engine never reads not given as a zero; it names the crude that lacks the value and returns the property as not blended, while the other properties still blend."),

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/beginner/crb_m01.json', label='crb_m01', expect_n=15)
finish()
