import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Associate m02, Blending on the Right Basis. Written from digest.txt
# SECTIONS 4, 5, 6 and 7 as the five lessons of this module teach them: density
# blends on volume, API through specific gravity, volume shares become mass
# shares, sulfur and the per-mass properties on mass, and a blank is not a zero.

q(2, "Obigbo Light and Egbema Medium are blended 65 and 35 by volume. What API does blendCrudes return, and how is it formed?",
 "32.8173, converted from the blend's specific gravity of 0.8611.",
 ["32.9850, the mean of the two API numbers weighted by barrels.",
  "32.8173, the mean of the two API numbers weighted by barrels.",
  "0.8611, since the engine reports the blend's gravity in specific gravity only."],
 "The engine blends specific gravity on volume, 0.8611, and converts it to 32.8173 API. 32.9850 is the volume-weighted mean of the API numbers, the shortcut the engine refuses; blend API minus that mean is -0.1677."),

q(0, "Half a 20 API crude and half a 40 API crude are blended by volume. What does the engine give, and what does averaging the API numbers by volume give?",
 "The engine gives 29.3808; the volume average of the API numbers gives 30.0000.",
 ["The engine gives 30.0000; the mass-weighted mean of the API numbers gives 29.3808.",
  "The engine gives 29.3808 by averaging the API numbers by volume.",
  "The engine gives 30.0000, then adds -0.6192 to it as a correction for the hyperbola."],
 "The engine blends the two specific gravities (0.8795) and converts back, 29.3808. The shortcut says 30.0000, and blend API minus that mean prints -0.6192. The engine applies no correction: it never averages API at all."),

q(3, "Which weighted mean of the API numbers agrees with the engine's blend API on every row of the gravity table?",
 "The mass-weighted mean, with a difference of 0.0000 on every row.",
 ["The volume-weighted mean, as specific gravity blends on volume.",
  "Neither: no weighting of API numbers reproduces it.",
  "The volume-weighted mean once -0.6192 is subtracted from it on every row."],
 "API = A / SG - B, and 1 / SG blends linearly on mass, so the mass-weighted mean of the API numbers is the blend API; the difference column prints 0.0000 on all four rows. The -0.6192 belongs to the 20 and 40 API blend alone."),

q(1, "The mass-weighted mean of the API numbers matches the blend API to four decimals. How does the engine itself form the blend API?",
 "It blends specific gravity on volume and converts the result to API.",
 ["It forms the mass-weighted mean of the API numbers, which the difference column confirms.",
  "It averages API by volume and then applies the blend API minus that mean as a correction.",
  "It blends the API numbers on mass fractions it has formed from the typed volume shares."],
 "The engine blends specific gravity on volume and converts it back to API; API itself is never averaged. Its basis for API reads: computed from the volume-blended specific gravity, never averaged directly. The mass-weighted mean is printed beside it, where the difference column reads 0.0000.")

q(1, "In the export blend Obigbo Light is 0.6500 of the volume. What is its mass fraction, and why does it move that way?",
 "0.6346: at 0.8408 it is lighter than the blend, so it carries less of the mass.",
 ["0.6500: a share typed by volume is carried over to the mass basis unchanged.",
  "0.3654: the lighter crude takes the smaller mass share once its density is applied.",
  "0.6346: at 0.8408 it is denser than the blend, so its share shrinks on the mass basis."],
 "Mass share is volume share times specific gravity over the sum of those products. Obigbo Light's mass fraction minus volume fraction prints -0.0154, and Egbema Medium, at 0.8990, gains the same 0.0154 to reach 0.3654."),

q(3, "In the three-crude blend at 50, 30 and 20 by volume, Egbema Medium's mass fraction minus volume fraction is 0.0063. Why is it positive, when Asarama Heavy is denser still?",
 "Its 0.8990 is denser than the blend's 0.8804, and the sign is decided against the blend.",
 ["It is listed second, and the engine shares the mass gain out in listing order.",
  "Asarama Heavy's gain is split with it, because the fractions must add to one.",
  "Its sulfur is higher than Obigbo Light's, and the mass shares follow the sulfur."],
 "Which way a share moves is decided against the blend as a whole. Obigbo Light at 0.8408 prints -0.0225, Egbema Medium at 0.8990 prints 0.0063 and Asarama Heavy at 0.9516 prints 0.0162, all beside a blend of 0.8804."),

q(0, "The same numbers 50, 30 and 20 are typed as MASS shares for Obigbo Light, Egbema Medium and Asarama Heavy. What API does the engine give?",
 "29.6100, a different blend from the 29.2240 typed by volume.",
 ["29.2240, since a share's basis does not change the blend.",
  "A refusal: a mass share needs a volume share beside it.",
  "29.2240 on volume, beside a mass-basis API of 29.6100."],
 "Typed by mass, the three crudes make a blend of specific gravity 0.8783 and API 29.6100; typed by volume, 0.8804 and 29.2240. blendCrudes takes every crude by volume or every crude by mass, and the two give different blends.")

q(2, "One crude in a recipe is given a volume share and the other a mass share. What does blendCrudes do?",
 "It refuses: every crude a volume share, or every crude a mass share.",
 ["It converts the mass share to volume through that crude's specific gravity and blends.",
  "It blends the crude with the volume share and names the other crude as missing.",
  "It treats both figures as volume shares and names the blend's basis as mixed."],
 "The refusal reads: Give every crude a volume share, or give every crude a mass share. The two cannot be mixed. Nothing is converted and nothing is blended.")

q(0, "What sulfur does blendCrudes give the Obigbo export blend, and on what basis?",
 "0.2642 wt%, on mass.",
 ["0.2590 wt%, on volume, the fraction a cargo is measured in.",
  "0.2642 wt%, on volume fraction, the basis of the typed shares.",
  "0.0052 wt%, the part of the sulfur the mass basis adds."],
 "Sulfur is per unit mass, so the engine weights it by mass fraction and names the basis mass: 0.2642. 0.2590 is the same property on volume, printed only to be read against the answer; mass minus volume is 0.0052."),

q(2, "Nickel in the three-crude blend: which pair of figures is the engine's and the volume shortcut's?",
 "14.2202 ppm on mass, and 13.5500 ppm on volume.",
 ["13.5500 ppm on mass, and 14.2202 ppm on volume.",
  "14.2202 ppm on mass, and 0.6702 ppm on volume.",
  "6.5980 ppm on mass, and 6.4550 ppm on volume."],
 "The per-mass table's nickel row for the three crudes reads 14.2202 on mass, 13.5500 on volume and 0.6702 for the gap. The export blend's nickel rows are 6.5980 and 6.4550.")

q(3, "The export blend is typed as 13 and 7 instead of 65 and 35. What does the engine return?",
 "The same blend, since the shares are normalised before blending.",
 ["A refusal, because the shares do not add to 100.",
  "The same API, with the sulfur rescaled to the smaller total.",
  "The same API, with sulfur not blended until the shares reach 100."],
 "The shares are normalised: 65 and 35, 13 and 7, and 650000 and 350000 all return 32.8173 and 0.2642. A negative share and shares that add up to zero are refused.")

q(1, "Egbema Medium's sulfur is left blank in the export blend. What does blendCrudes return for the blend's sulfur?",
 "not blended, with the basis: not blended: no value for Egbema Medium.",
 ["0.0888 wt%, with the blank read as a zero and blended on mass.",
  "0.14 wt%, Obigbo Light's own sulfur, as the only crude that carries a value.",
  "A refusal of the whole blend, since one property is missing."],
 "A blank is absent. It is no zero, so the sulfur comes back not blended and the engine names Egbema Medium. 0.0888 is what a sulfur TYPED as 0 gives."),

q(3, "A laboratory sheet shows a sulfur of 0, and it is TYPED in for Egbema Medium. What comes back for the export blend?",
 "0.0888 wt% on mass, with nothing named missing.",
 ["not blended, with Egbema Medium named as missing.",
  "0.0888 wt%, with Egbema Medium named as missing.",
  "0.2642 wt%, with the zero skipped."],
 "A typed 0 is a real zero, blended like any other figure: 0.0888 on mass, 0 properties listed as missing. A blank sulfur comes back not blended, with Egbema Medium named.")

q(0, "With Egbema Medium's sulfur blank, what happens to the export blend's API, TAN and viscosity?",
 "They blend as usual: 32.8173, 0.3915 and 7.4743.",
 ["They are withheld too, as incomplete.",
  "They blend on Obigbo Light alone, the crude with every value.",
  "API blends, and TAN and viscosity are withheld as mass-weighted."],
 "Only the blank property is not blended. Every other property of the same blend is formed as usual: API 32.8173, TAN 0.3915 and viscosity 7.4743 read the same with the sulfur blank as with both sulfurs given.")

q(2, "A blank sulfur is reported as not blended, yet a crude with no API and no specific gravity is refused. Why the difference?",
 "Every property is weighted by density, so a missing gravity spoils the whole blend.",
 ["Gravity is a required field in the studio, and sulfur is an optional one.",
  "The engine refuses every blank, and sulfur is exempt as a per-mass property.",
  "Gravity blends on volume, and a volume property cannot be named as missing."],
 "The refusal says it: No API or specific gravity for Egbema Medium. Every property here is weighted by density. A missing sulfur spoils one property, so only that one is not blended."),

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/beginner/crb_m02.json', label='crb_m02', expect_n=15)
finish()
