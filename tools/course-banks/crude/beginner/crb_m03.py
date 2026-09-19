import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Associate m03, Viscosity Through an Index. Written from digest.txt
# SECTION 8 as the four lessons of this module teach it: why viscosity needs an
# index, the Refutas index and its constants, the index blends on mass (HELD,
# FINDINGS C12: taught as a limit, no basis keyed as the right one), and the
# domain where the index has no answer.

q(3, "Asarama Heavy and Ubie Condensate are blended 50 and 50 by volume. What viscosity does the engine give, and what does a straight average of the cSt figures on mass give?",
 "9.2496 cSt from the engine, and 339.5596 from the straight average.",
 ["339.5596 cSt from the engine, and 9.2496 from the straight average on mass.",
  "9.2496 cSt from the engine, and 330.3100 from the straight cSt average.",
  "6.8074 cSt from the engine, and 9.2496 from the straight average."],
 "The engine gives 9.2496 through the Refutas index. The straight average on mass gives 339.5596, and linear average minus the engine prints 330.3100. 6.8074 is the index averaged on volume fractions."),

q(1, "Why does a straight average of cSt figures fail for a blend of a thick crude and a thin one?",
 "A little thin oil cuts a thick oil's viscosity hard, and the average carries the thick crude's cSt at full size.",
 ["It is taken on volume fractions, and viscosity is a property that belongs on mass.",
  "It leaves out the 0.8000 offset that sits inside the double logarithm of the index.",
  "It is taken on mass fractions, which understate the thin crude's share of the barrels."],
 "The physics is that the thin crude thins the whole blend. Viscosity becomes close to linear in blend share only after a double logarithm is taken, so the engine averages an index and transforms the answer back."),

q(0, "The engine's index is VBI = A x ln(ln(nu + 0.8)) + B, nu in cSt. What values does it give for A and B?",
 "14.5340 for A, and 10.9750 for B.",
 ["10.9750 for A, and 14.5340 for B.",
  "141.5000 for A, and 131.5000 for B.",
  "14.5340 for A, and 0.8000 for B."],
 "B is viscosityBlendIndex(e - 0.8), 10.9750, and A is viscosityBlendIndex(e^e - 0.8) minus B, 14.5340. 141.5000 and 131.5000 are the API constants, and 0.8000 is the offset inside the double log."),

q(2, "How is the constant B read back from the engine itself?",
 "As viscosityBlendIndex(e - 0.8), where the double log is 0.",
 ["As viscosityBlendIndex(e^e - 0.8), where the double log is 1.",
  "As viscosityFromBlendIndex of a very negative index.",
  "As viscosityBlendIndex(1), the index of 1 cSt."],
 "Where ln(nu + 0.8) is 1 the double log is 0, so the index there is B, 10.9750. At e^e - 0.8 the double log is 1, which gives A plus B. viscosityBlendIndex(1) is 3.2518."),

q(2, "Asarama Heavy's 610 cSt gives an index of 37.9879, and viscosityFromBlendIndex of that index returns 610.0000. What does this show?",
 "The two functions are exact inverses of each other.",
 ["The index is a straight line in viscosity above 100 cSt.",
  "The engine clamps a heavy crude to its typed viscosity.",
  "The index is blended on mass, since the trip is exact."],
 "Every crude's viscosity goes into the index and comes back unchanged: 4.6 returns 4.6000, 22 returns 22.0000, 1.1 returns 1.1000."),

q(3, "From 1 cSt to 1000 cSt the index moves from 3.2518 to 39.0657. What does that compression make possible?",
 "Index values that can be averaged close to linearly across a thousandfold range of viscosity.",
 ["Reading the index directly as a viscosity in cSt, with no trip back through viscosityFromBlendIndex.",
  "A refusal of every viscosity above 1000 cSt as lying outside the index domain.",
  "Averaging the index on volume and on mass with the same answer on every blend."],
 "Each probe multiplies the viscosity by ten, and the index moves 3.2518, 23.5747, 33.1962, 39.0657. The compression is what makes the index blend close to linearly where the viscosity does not."),

q(1, "What basis does the engine name for a blend viscosity it returns?",
 "Refutas index on mass fraction.",
 ["Refutas index on volume fraction, the ASTM D7152 form.",
  "mass, the basis it names for sulfur and the metals.",
  "computed from the volume-blended specific gravity."],
 "The engine names its basis in the result: \"Refutas index on mass fraction\". ASTM D7152 blends the same family of index on volume."),

q(0, "What does the course say about the basis the Refutas index is averaged on?",
 "The engine uses mass, ASTM D7152 uses volume, and the choice is held open.",
 ["Mass is correct, and the ASTM D7152 volume figure is an error.",
  "Volume is correct, since ASTM D7152 is a standard practice for blend viscosity.",
  "The two bases give the same viscosity whenever the crudes differ in density."],
 "Which basis to use is a HELD decision (FINDINGS C12). The course teaches what the engine does, what the other basis gives and that the two differ, and does not say which is right."),

q(1, "For the Obigbo export blend, what does the index averaged on volume fractions give, beside the engine's own figure?",
 "7.3107 cSt, against the engine's 7.4743 with the index on mass.",
 ["7.4743 cSt, the same as on mass, since both crudes are light.",
  "10.9576 cSt, against the engine's 7.4743 with the index on mass.",
  "0.1636 cSt, the viscosity the volume fractions leave."],
 "On volume fractions the index gives 7.3107, the engine gives 7.4743 on mass, and mass basis minus volume basis prints 0.1636. 10.9576 is the straight cSt average on mass, with no index."),

q(3, "Of the three blends printed on both bases, where is the mass basis minus the volume basis largest?",
 "Egbema Medium and Asarama Heavy, at 4.1448 cSt.",
 ["Asarama Heavy and Ubie Condensate, at 2.4422 cSt.",
  "Asarama Heavy and Ubie Condensate, at 330.3100 cSt.",
  "The Obigbo export blend, at 0.1636 cSt."],
 "The difference column prints 0.1636, 2.4422 and 4.1448. 330.3100 is linear average minus the engine, a different comparison."),

q(0, "What makes the difference column between the two index bases positive on every pair printed?",
 "The thicker crude is also the denser, so it weighs more on mass and its high index pulls the average up.",
 ["An index averaged on mass is always above one averaged on volume, whatever the crudes are.",
  "The volume basis drops the 0.8000 offset, which lowers every index it averages by that amount.",
  "Mass fractions add to more than one when the crudes in a blend differ in density."],
 "The mass and volume fractions differ whenever the crudes differ in density. In each pair here the thicker crude is the denser one, so the mass basis gives its high index more weight."),

q(2, "A blend must pump below a viscosity limit. The figure with the index on mass clears the limit and the figure on volume does not. What does the course say to do?",
 "Measure the actual blend in a laboratory.",
 ["Take the engine's figure, since it names its basis.",
  "Take the volume figure, since ASTM D7152 is a standard.",
  "Average the two figures and compare that with the limit."],
 "When both bases clear a limit the choice does not change the decision. When one clears and the other does not, the decision needs a laboratory measurement of the actual blend, because the basis is a held convention."),

q(0, "What does viscosityBlendIndex return for a viscosity of 0.2 cSt?",
 "No index: 0.2 lies outside the domain.",
 ["-122.8888, just inside the edge.",
  "0.2000, the lowest viscosity the index reaches.",
  "3.2518, used as a floor."],
 "The probes print no index at 0.1 and at 0.2, and -122.8888 at 0.2001. The edge itself is outside the domain, and the lowest viscosity the index reaches is 0.2000."),

q(1, "Why does the index domain end at 0.2000 cSt?",
 "ln(nu + 0.8) is zero where nu + 0.8 is 1, and the double log is undefined there.",
 ["The engine clamps anything thinner than 0.2000 to 0.2001 before indexing.",
  "Ubie Condensate at 1.1 cSt is the thinnest crude, and the edge sits below it.",
  "The index turns negative below 0.2000, and the engine refuses a negative index."],
 "The engine reports the edge by asking its own inverse about a very negative index: the lowest viscosity the index reaches is 0.2000, and 1 minus that gives the offset 0.8000. The engine returns no index there and does not invent one. A negative index is allowed: 0.2001 gives -122.8888."),

q(3, "One crude in a blend is typed at 0.1 cSt. What does blendCrudes return for the blend viscosity?",
 "not blended, with the basis: not blended: a component viscosity is missing or outside the index domain.",
 ["A refusal of the whole blend, as for a crude with no gravity.",
  "The blend viscosity with the 0.1 cSt clamped to 0.2001.",
  "The other crude's viscosity alone, with the thin crude named."],
 "There is no index for that crude, so there is no blend index. The engine puts no zero, floor or clamp in the gap. Gravity, sulfur and the rest still blend."),

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/beginner/crb_m03.json', label='crb_m03', expect_n=15)
finish()
