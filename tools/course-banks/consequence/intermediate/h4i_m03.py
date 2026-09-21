import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 Professional m03: tilt and surface emissive power.
# Digest section 16 (the tilt correlation, Froude and Reynolds numbers on
# ERHA) and section 17 (Mudan from the diameter, the radiative fraction with
# and without soot, three methods for one fire), with section 3 for the
# viscosity and radiative fraction refusals.

q(2,
 "ERHA (20 m, heptane) is tilted by a 4 m/s wind at 10 m, with a stated air viscosity of 0.000015 m2/s. How many degrees from the vertical does the engine lean the flame?",
 "49.174202",
 ["38.746229","50.828697","58.130517"],
 "The tilt table prints 49.174202 degrees at 4 m/s. 38.746229 is the 2 m/s row and 58.130517 the 8 m/s row. 50.828697 is the tilt of the Yellow Book benzene fire in section 21, a different pool, wind and viscosity.")

q(0,
 "In ERHA's tilt table, which Froude number Fr10 = u10^2 / (g D) stands against a wind of 8 m/s?",
 "0.326309",
 ["0.081577","0.734196","0.060060"],
 "The 8 m/s row prints a Froude number of 0.326309. 0.081577 is the 4 m/s row and 0.734196 the 12 m/s row; the Froude number goes as the square of the wind. 0.060060 is the Froude number of the Yellow Book benzene example once computed from its own inputs.")

q(3,
 "The Reynolds number Re = u10 D / nu enters the tilt correlation. What does ERHA's table print for it at 2 m/s?",
 "2666666.666667",
 ["5333333.333333","16000000.000000","28247014.532194"],
 "At 2 m/s with D 20 m and nu 0.000015 m2/s the table prints 2666666.666667. 5333333.333333 is the 4 m/s row and 16000000.000000 the 12 m/s row, the Reynolds number being linear in the wind. 28247014.532194 is the Reynolds number the engine computes for the Yellow Book example, whose printed viscosity is about half the physical value.")

q(1,
 "The engine solves tan(t)/cos(t) = c for the tilt. Which tilt parameter c does it print for ERHA at a 12 m/s wind?",
 "4.184770",
 ["3.046437","1.770458","1.943154"],
 "The 12 m/s row prints c = 4.184770 and a tilt of 62.577136 degrees. 3.046437 is c at 8 m/s and 1.770458 is c at 4 m/s. 1.943154 is the tilt parameter of the Yellow Book benzene example.")

q(2,
 "Why does the air viscosity matter only weakly to the flame tilt?",
 "The Reynolds number enters the correlation only to the power 0.117",
 ["The engine fixes the viscosity at 15 C and ignores the stated value",
  "The viscosity cancels between the Froude and Reynolds numbers",
  "The tilt depends on the viscosity only when the wind is zero"],
 "The correlation is tan(t)/cos(t) = 0.666 Fr10^0.333 Re^0.117, so the viscosity reaches the tilt through Re to a small power. The engine has no default viscosity at all: it is an input the caller must state. The Froude number carries no viscosity, so nothing cancels, and at zero wind there is no tilt whatever the viscosity.")

q(3,
 "A caller asks poolFireTilt for a tilt and leaves out the air viscosity. How does the engine answer?",
 "It refuses, naming airKinematicViscosityM2S and noting that air at 15 C is about 1.5e-5",
 ["It uses the Yellow Book's printed 7.5133e-6 as a default and returns a tilt with a warning",
  "It returns a tilt of 0.000000 degrees, since the Reynolds number cannot then be formed",
  "It uses the viscosity of air at 15 C by default and records the value in the basis block"],
 "The viscosity is an input with no default, and the engine's refusal reads \"airKinematicViscosityM2S: must be above 0 m2/s (air at 15 C is about 1.5e-5; the YB example prints 7.5133e-6)\". The printed Yellow Book value is quoted in that message, never used as a fallback. A zero tilt belongs to a zero wind, and the engine does not substitute a physical default and carry on.")

q(0,
 "Mudan's form gives the surface emissive power from the pool diameter alone. What does it return in W/m2 for a 20 m pool?",
 "30886.154395",
 ["56143.305429","20987.569646","52025.691247"],
 "Mudan: SEP = 140e3 exp(-0.12 D) + 20e3 (1 - exp(-0.12 D)) gives 30886.154395 W/m2 at 20 m. 56143.305429 is the 10 m row and 20987.569646 the 40 m row. 52025.691247 is ERHA's soot weighted surface emissive power, a different method for a pool of the same diameter.")

q(1,
 "For a small 2 m pool, what does the diameter correlation print as its emissive power in W/m2?",
 "114395.343328",
 ["85857.396331","180128.456236","252421.582860"],
 "The diameter table prints 114395.343328 W/m2 at 2 m. 85857.396331 is the 5 m row. 180128.456236 is ERHA's clear flame SEPmax by the radiative fraction, and 252421.582860 is the Yellow Book clear flame value, neither of them a Mudan figure.")

q(3,
 "Why does Mudan's surface emissive power fall toward 20e3 W/m2 as a pool grows?",
 "A large sooty fire hides its bright core behind smoke, so less of the flame surface shows its full emissive power",
 ["A larger pool burns at a lower burning flux, so less fuel per square metre reaches the flame to be radiated",
  "The view factor of a larger flame is smaller, and the engine folds that reduction into the emissive power",
  "Transmissivity falls with the pool diameter, so the engine lowers the emissive power to allow for the air"],
 "Section 17 gives the reason: a large sooty fire hides its bright core behind smoke, so the power falls toward 20e3 W/m2. The Babrauskas burning flux rises toward its asymptote with the diameter, never falls. The view factor and the transmissivity are separate factors in q = SEP x F x tau, never folded into the emissive power.")

q(2,
 "ERHA at a 4 m/s wind has a flame length of 32.511563 m, a heat of combustion of 44600000 J/kg and a stated radiative fraction of 0.3. What clear flame SEPmax in W/m2 does the engine compute?",
 "180128.456236",
 ["52025.691247","252421.582860","30886.154395"],
 "SEPmax = Fs m\" dHc / (1 + 4 L/D) gives 180128.456236 W/m2 for ERHA. 52025.691247 is SEPact once a soot fraction of 0.8 is applied. 252421.582860 is the Yellow Book benzene clear flame value. 30886.154395 is Mudan's diameter form at 20 m.")

q(0,
 "Adding a stated soot fraction of 0.8 to ERHA's radiative fraction method, what surface emissive power SEPact in W/m2 comes back?",
 "52025.691247",
 ["180128.456236","66484.316572","30886.154395"],
 "SEPact = SEPmax (1 - soot) + SEPsoot soot, with the soot emissive power at its default of 20e3 W/m2, gives 52025.691247 for ERHA. 180128.456236 is SEPmax with no soot. 66484.316572 is the Yellow Book example's soot value. 30886.154395 is Mudan's method on the same fire.")

q(1,
 "ERHA's three surface emissive power methods return three different values. What does the engine do about that?",
 "Every call names its method, and a heat flux is quoted with the method that made it",
 ["It averages the three methods and reports the mean as the surface emissive power",
  "It picks the largest of the three, so that the heat flux is always a conservative one",
  "It refuses any fire on which the three methods disagree by more than its tolerance"],
 "Section 17 says the three methods give three answers for one fire, 30886.154395, 180128.456236 and 52025.691247 W/m2, and that is why every call names its method and why a heat flux is quoted with its method. The engine never averages methods, never picks one silently and has no refusal for disagreement between them.")

q(3,
 "A caller passes surfaceEmissivePower a radiative fraction above one. Which range does the engine's refusal quote from the Yellow Book?",
 "0.1 to 0.4",
 ["0.8 for oil products","0.3 by default","20e3 and upward"],
 "The refusal reads \"radiativeFraction: must lie in (0, 1]: the YB gives 0.1 to 0.4\". 0.8 is the soot fraction the Yellow Book quotes for oil products, a different input. 0.3 is the radiative fraction stated for ERHA, a teaching input with no default status. 20e3 W/m2 is the default soot emissive power.")

q(2,
 "In the clear flame form SEPmax = Fs m\" dHc / (1 + 4 L/D), what does a longer flame relative to its pool do to SEPmax?",
 "It lowers SEPmax, because L/D sits in the denominator",
 ["It raises SEPmax, since more flame surface is burning",
  "It leaves SEPmax unchanged, as L/D only moves the view factor",
  "It lowers SEPmax only when a soot fraction is also stated"],
 "The heat released per square metre of pool is spread over a flame surface that grows with L/D, and the form divides by 1 + 4 L/D, so a longer flame has a lower SEPmax. More surface does not raise the power per square metre of it. L/D appears in this form as well as in the view factor, and the soot weighting applies after SEPmax is found.")

q(1,
 "With no wind at all, what tilt does ERHA's table print, and what does the Froude number read?",
 "A tilt of 0.000000 degrees, with a Froude number of 0.000000",
 ["A tilt of 38.746229 degrees, with a Froude number of 0.020394",
  "A refusal naming the field windSpeed10mMS for the calm air",
  "A tilt of 62.577136 degrees, the maximum the correlation allows"],
 "Section 16 prints the zero wind row as all zeros: no wind, no tilt. 38.746229 degrees with 0.020394 is the 2 m/s row. The calm air refusal naming windSpeed10mMS belongs to Mackay and Matsugu evaporation, and the tilt function does not refuse zero wind. 62.577136 degrees is simply the 12 m/s row.")

emit(Q, '/root/hse-wip-consequence/banks/h4i_m03.json', expect_n=15)
finish()
