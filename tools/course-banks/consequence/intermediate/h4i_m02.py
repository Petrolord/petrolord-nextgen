import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 Professional m02: the flame length.
# Digest section 15 (ERHA, Thomas in still air, Thomas with wind, the
# characteristic wind speed, u* held at one, the wind sweep) with section 3
# for the flame length refusal and section 32 for still air Thomas as a
# single route quantity.

q(1,
 "ERHA is a heptane bund fire of 20 m diameter in air of density 1.2 kg/m3, burning at 0.101000 kg/(m2 s). What mean flame length in m does Thomas in still air give it?",
 "37.101102",
 ["35.746382","32.511563","46.775288"],
 "The still air form L/D = 42 (m\" / (rho_air sqrt(g D)))^0.61 gives ERHA a flame length of 37.101102 m. 35.746382 m is Thomas with wind at a wind below the characteristic speed, a different correlation. 32.511563 m is Thomas with wind at 4 m/s. 46.775288 m is the Yellow Book benzene pool fire of section 21, a different fire.")

q(3,
 "What ratio of flame length to pool diameter does the still air Thomas form return for ERHA?",
 "1.855055",
 ["1.787319","1.625578","1.102004"],
 "The still air L/D for ERHA is 1.855055, so twenty metres of pool gives 37.101102 m of flame. 1.787319 is the wind form's L/D with u* held at one. 1.625578 is the wind form at 4 m/s. 1.102004 is the L/D of the Yellow Book benzene example.")

q(0,
 "The characteristic wind speed uc = (g m\" D / rho_air)^(1/3) sets where the wind starts to matter. What is it for ERHA, in m/s?",
 "2.546226",
 ["3.068751","1.570953","1.629327"],
 "Section 15 prints uc = 2.546226 m/s for ERHA. 3.068751 m/s is the characteristic wind speed of the Yellow Book benzene fire, a different pool. 1.570953 is ERHA's scaled wind speed u* at 4 m/s, a ratio with no unit. 1.629327 is the scaled wind speed of the Yellow Book example.")

q(2,
 "With a 4 m/s wind at 10 m over ERHA, what scaled wind speed u* does the engine use?",
 "1.570953",
 ["1.000000","3.141905","4.712858"],
 "u* = max(1, u10 / uc), and 4 m/s is above ERHA's uc of 2.546226 m/s, so u* is 1.570953. 1.000000 is the held value for any wind below uc. 3.141905 is u* at 8 m/s and 4.712858 is u* at 12 m/s.")

q(2,
 "Thomas with wind is evaluated for ERHA at a 10 m wind of 8 m/s. What flame length in m results?",
 "28.107457",
 ["25.813232","32.511563","35.746382"],
 "At 8 m/s u* is 3.141905 and L/D is 1.405373, which gives 28.107457 m. 25.813232 m is the 12 m/s row, where the flame is shorter still. 32.511563 m is the 4 m/s row. 35.746382 m is the length for every wind below uc, where u* is held at one.")

q(3,
 "Twelve metres per second is the strongest wind in the ERHA sweep. What L/D does Thomas with wind give there?",
 "1.290662",
 ["1.405373","1.625578","1.787319"],
 "The 12 m/s row prints u* 4.712858 and L/D 1.290662, for a flame of 25.813232 m. 1.405373 is the 8 m/s row, 1.625578 the 4 m/s row and 1.787319 the value shared by every wind at or below uc.")

q(0,
 "ERHA's wind sweep prints the same flame length at no wind and at 2 m/s. Why do those two rows agree?",
 "Both winds are below uc, so u* = max(1, u10 / uc) is held at one and the wind term drops out",
 ["The engine switches to the still air form whenever the wind at 10 m is below 3 m/s here",
  "The flame tilt absorbs the wind below uc, so the length is copied from the zero wind row",
  "The burning flux falls with the wind at exactly the rate that cancels the u* power law"],
 "Section 15 says the scaled wind speed is held at one below uc, 2.546226 m/s for ERHA, so every wind below it gives 35.746382 m, no wind included. The engine never swaps correlations on its own: the still air form gives 37.101102 m and is only used when named. The tilt is a separate function with no effect on the length, and the burning flux is set by Babrauskas with no wind in it.")

q(2,
 "Thomas with wind is called with no wind at all, and Thomas in still air is called on the same fire. How do their answers relate?",
 "They differ, 35.746382 m against 37.101102 m, because they are two different correlations",
 ["They agree exactly, since the wind form collapses into the still air form when the wind is zero",
  "The wind form refuses a zero wind, so only the still air form can return a length here",
  "They differ by the ratio 1.570953, which is the scaled wind speed the wind form applies"],
 "Section 15 states the wind form at no wind (35.746382 m) is a different correlation from the still air form (37.101102 m): the constants 55 and 0.67 against 42 and 0.61. The method is named in every call and the two are not interchangeable. The wind form holds u* at one and does not refuse a zero wind, and 1.570953 is u* at 4 m/s, unrelated to this comparison.")

q(3,
 "Which constants belong to Thomas with wind as the Yellow Book states it?",
 "A leading 55, an exponent of 0.67 and a factor u* to the power -0.21",
 ["A leading 42 and an exponent of 0.61, with no wind factor of any kind",
  "A leading 0.666, a Froude exponent of 0.333 and a Reynolds power of 0.117",
  "A leading 140e3 falling as exp(-0.12 D) toward a floor of 20e3"],
 "The engine's string reads \"Thomas with wind: L/D = 55 (m\" / (rho_air sqrt(g D)))^0.67 u*^-0.21, u* = max(1, u10 / uc)\". 42 with 0.61 is the still air form. 0.666 with 0.333 and 0.117 are the tilt correlation of section 16. 140e3 and 20e3 with exp(-0.12 D) are Mudan's surface emissive power.")

q(0,
 "Above uc, how does the Thomas with wind flame length respond as the wind strengthens?",
 "It shortens, as u* to the power -0.21",
 ["It lengthens as the wind drives more air into the fire",
  "It stays fixed at 35.746382 m for every wind speed",
  "It shortens in proportion to the wind speed itself"],
 "Section 15 says that above uc the flame shortens as the wind rises, as u*^-0.21: 32.511563 m at 4 m/s, 28.107457 m at 8 m/s and 25.813232 m at 12 m/s. The length does not grow with the wind. 35.746382 m holds only below uc, and a power of -0.21 is far weaker than a straight proportion: tripling the wind from 4 to 12 m/s shortens the flame by much less than two thirds.")

q(1,
 "Where does the engine's still air Thomas flame height come from?",
 "It is imported from the facilities engine's spacing module and is not restated",
 ["It is written out again inside the consequence engine as a separate copy of the same expression",
  "It is read from the Yellow Book pool fire golden at each call it makes",
  "It is derived from the wind form by setting u* to one in every case"],
 "The digest's engine note says the consequence engine imports the still air Thomas flame height from engines/facilities/spacing.js and restates none of its helpers, and section 15 repeats that the expression is imported. A golden is test data and is never read at run time. Setting u* to one in the wind form gives 35.746382 m for ERHA, a different number from the still air 37.101102 m.")

q(2,
 "Section 32 lists Thomas in still air among the single route quantities. What does a capstone in this course do about it?",
 "It never grades a still air flame length, because only the transcription stands behind it",
 ["It grades the still air length at a looser tolerance, to allow for the transcription it rests on",
  "It grades it only for heptane, where the Yellow Book pool fire provides the check",
  "It grades the still air length as the upper bound on any flame length with wind"],
 "Section 32 marks Thomas in still air as caught by nothing but the transcription, and a single route quantity is taught and never carries a graded answer. No tolerance is loosened for it. The Yellow Book pool fire checks Thomas WITH wind, and it is a benzene fire in any case. The still air length is no bound on the wind form either: the two are separate correlations.")

q(0,
 "Which inputs fix ERHA's characteristic wind speed uc?",
 "Gravity, the burning flux, the pool diameter and the air density",
 ["The wind at 10 m, the kinematic viscosity of air and gravity",
  "The flame length, the tilt and the surface emissive power",
  "The heat of combustion and the radiative fraction of the fuel"],
 "Section 15 gives uc = (g m\" D / rho_air)^(1/3): gravity, the burning flux, the diameter and the air density. The wind and the viscosity enter the tilt through the Froude and Reynolds numbers. The flame length and tilt are outputs downstream of uc, and the heat of combustion with the radiative fraction set the surface emissive power.")

q(3,
 "A caller hands poolFireFlameLength a burning flux of zero. What comes back?",
 "A refusal naming burningFluxKgM2S, whose words say it must be a burning flux above 0 kg/(m2 s)",
 ["A flame length of zero with a warning, since no fuel burns in that case",
  "The still air length, since the call is quietly rerouted to the other form",
  "A refusal that names the field fuel instead, and lists every one of the fuel keys that Table 6.5 does carry"],
 "Section 3 tables it: \"burningFluxKgM2S: must be a burning flux above 0 kg/(m2 s)\". The engine returns a result or a refusal, so a zero length with a warning is not what it does, and it never swaps a named method. The fuel refusal belongs to poolBurningRate, a different function.")

q(1,
 "How long is the ERHA flame, in metres, by the wind correlation when the breeze is 4 m/s?",
 "32.511563",
 ["28.107457","35.746382","37.101102"],
 "The 4 m/s row prints u* 1.570953, L/D 1.625578 and a flame length of 32.511563 m, the length section 17 then carries into the surface emissive power. 28.107457 m belongs to 8 m/s. 35.746382 m is the held length below uc. 37.101102 m is the still air form.")

emit(Q, '/root/hse-wip-consequence/banks/h4i_m02.json', expect_n=15)
finish()
