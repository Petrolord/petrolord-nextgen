import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 Professional m06: a published pool fire, reproduced.
# Digest section 21 (the Yellow Book 6.6.3 benzene pool fire step by step,
# its tolerances and its errata as facts about the published source) and
# section 3 (the refusals of the fire half).

q(2,
 "The Yellow Book pool fire of 6.6.3 is a confined benzene fire with a 5 m/s wind at 10 m. What characteristic wind speed in m/s does the engine compute for it?",
 "3.068751",
 ["3.06866","2.546226","1.629327"],
 "The step table prints the engine at 3.068751 m/s against the printed 3.06866, a relative difference of 2.97e-5 inside the 0.0001 the golden allows. 3.06866 is the book's own figure. 2.546226 m/s is ERHA's characteristic wind speed. 1.629327 is the scaled wind speed of this same example, a ratio.")

q(0,
 "For that benzene example, what mean flame length in m does the engine reproduce?",
 "46.775288",
 ["46.7725","37.101102","32.511563"],
 "The engine gives 46.775288 m against the printed 46.7725, a relative difference of 5.96e-5. 46.7725 is the printed value. 37.101102 m is ERHA by Thomas in still air and 32.511563 m is ERHA by Thomas with wind at 4 m/s.")

q(3,
 "How many degrees from the vertical does the engine tilt the Yellow Book benzene flame?",
 "50.828697",
 ["50.8286","49.174202","58.130517"],
 "The engine's tilt is 50.828697 degrees against the printed 50.8286, a relative difference of 1.92e-6 inside a tolerance of 0.00001. 49.174202 is ERHA's tilt at 4 m/s and 58.130517 is ERHA at 8 m/s.")

q(1,
 "What heat flux in W/m2 does the engine reproduce at 100 m from the centre of the Yellow Book benzene pool?",
 "4582.518673",
 ["4581","934.933474","3699.568657"],
 "The final step prints the engine at 4582.518673 W/m2 against the printed 4581, a relative difference of 3.32e-4 inside the 0.001 the golden allows. 4581 is the printed figure. 934.933474 is ERHA at 100 m and 3699.568657 is ERHA at 60 m, a different fire and a different transmissivity.")

q(3,
 "The worked example prints a Froude number of 0.0545. What does u10^2 / (g D) actually come to with the example's inputs?",
 "0.060060",
 ["0.0545","0.081577","0.020394"],
 "The course records it as an erratum in the source: u10^2 / (g D) is 0.060060, and the printed tilt parameter and tilt follow only from that value. 0.0545 is the misprint itself. 0.081577 and 0.020394 are ERHA's Froude numbers at 4 m/s and 2 m/s.")

q(1,
 "The example prints an air viscosity of 0.0000075133 m2/s \"for air at 15 C\". Why does the golden keep that printed value?",
 "The printed tilt depends on that value, and the viscosity moves the tilt only weakly",
 ["It is the correct physical value for air at 15 C, so there is nothing at all to correct",
  "The engine's default viscosity is the printed one, so the golden has to match it exactly",
  "Changing it would move the printed heat flux by more than the tolerance the golden allows"],
 "Air at 15 C is about twice the printed value, which makes this an erratum in the source. The golden uses the printed value because the printed tilt depends on it, and its effect is small because Re enters as a power of 0.117. The engine has no default viscosity at all. Run at the physical value, the heat flux would still sit inside its 0.001; the printed tilt is the step that needs the printed viscosity.")

q(0,
 "Three steps of the example speak of a target \"50 m from the flame surface\". What distance do those steps actually compute with?",
 "100 m, the distance from the pool centre given in the inputs",
 ["50 m from the flame surface, exactly as the wording says it does",
  "50 m from the pool centre, the printed figure read as a centre distance",
  "The flame length of 46.7725 m added onto the 50 m printed in the text"],
 "The course lists this among the errata of the published source: the steps compute with 100 m, the distance from the pool centre given in the inputs. The 50 m wording matches no step's arithmetic, whether read from the surface or the centre, and nothing adds the flame length onto it.")

q(2,
 "Which step of the reproduction shows the largest relative difference between engine and print?",
 "The Mudan surface emissive power, 1.26e-2 inside a tolerance of 0.02",
 ["The Reynolds number, whose relative difference is 2.48e-4 inside 0.001",
  "The heat flux at 100 m, at a relative difference of 3.32e-4 inside 0.001",
  "The flame tilt in degrees, which differs by 1.92e-6 inside a 0.00001 band"],
 "The Mudan surface emissive power prints 20736.395957 W/m2 against 21000, a relative difference of 1.26e-2, the largest in the table. The Reynolds number, the heat flux and the tilt reproduce far more closely, at 2.48e-4, 3.32e-4 and 1.92e-6. Every step still sits inside the tolerance the golden states for it.")

q(2,
 "Where does the example's transmissivity of 0.71474 come from, and how does the engine treat it?",
 "It is read from Hottel charts in the source, and the engine takes it as a stated input",
 ["It is Bagster's value at the example's humidity, which the engine recomputes each call",
  "It is the engine's own default for a benzene fire, set from the source's worked step",
  "It is back-fitted by the golden so that the printed heat flux comes out at 4581 W/m2"],
 "The source line names it: tau 0.71474 from Hottel charts, and every step reproduces with the example's own inputs, the transmissivity as printed. Bagster is a single route quantity and is not what the example uses. The engine has no default transmissivity, and the golden takes the value as printed with no fitting.")

q(3,
 "With soot, what surface emissive power in W/m2 does the engine compute for the Yellow Book benzene fire?",
 "66484.316572",
 ["66000","52025.691247","252421.582860"],
 "The engine gives 66484.316572 W/m2 against the printed 66000, a relative difference of 7.34e-3 inside 0.01. 52025.691247 is ERHA's soot value. 252421.582860 is the clear flame value of this same example, before the soot fraction is applied.")

q(0,
 "What maximum view factor does the engine reproduce at the example's target?",
 "0.096435502269",
 ["0.091923780228","0.029151753404","0.091915844294"],
 "The engine prints Fmax 0.096435502269 against the printed 0.0964, a relative difference of 3.68e-4 inside 0.001. 0.091923780228 is the engine's Fv and 0.029151753404 its Fh, the two components the vector sum combines. 0.091915844294 is the Fv of the golden view factor case yb-pool-example-vf, where the closed form and the surface integral agree.")

q(1,
 "How should a lesson describe the errata of the Yellow Book pool fire?",
 "As facts about the published source, since this engine has no repair history",
 ["As bugs the engine carried in an earlier version and has since fixed in a later release",
  "As rounding the engine itself introduced, since it prints six decimals throughout",
  "As tolerances the golden widened after the engine first failed the example"],
 "The course states the engine has no repair history and that the errata it teaches belong to published sources. The Froude number, the viscosity and the 50 m wording are misprints in the book, and each golden tolerance was stated for its step. A sentence about former engine behaviour would be a defect.")

q(3,
 "A caller asks the view factor function for a target the tilted flame reaches over. Which words does the engine refuse with?",
 "tiltDeg: the tilted flame reaches over the target (1 + (L/R) sin(tilt) >= X/R): the closed form does not apply to a target under the flame",
 ["distanceFromAxisM: the target is at or inside the flame base: a view factor model needs the target outside the flame",
  "pathLengthM: pw x lies outside 1e4 to 1e5 N/m, where the YB advises against the Bagster fit: supply a transmissivity from another source",
  "fuel: must be one of liquid-hydrogen, lng, lpg, butane, hexane, heptane, benzene, xylene, gasoline, kerosene, jp-5, methanol, ethanol, or give massBurningFluxInfKgM2S and kBetaPerM"],
 "The course lists the overhang refusal verbatim as the tiltDeg message. The other three are real engine messages for other calls: distanceFromAxisM for a target inside the flame base, pathLengthM for a Bagster path outside its band, and fuel for a burning rate asked of a fuel Table 6.5 does not carry.")

q(0,
 "Which refusal does the engine give a distance search that was called with no fixed transmissivity?",
 "transmissivity: a fixed transmissivity in (0, 1] is required for a distance search",
 ["pathLengthM: pw x lies outside 1e4 to 1e5 N/m, where the YB advises against the Bagster fit: supply a transmissivity from another source",
  "viewFactor: must lie in [0, 1]",
  "burningFluxKgM2S: must be a burning flux above 0 kg/(m2 s)"],
 "The engine's words for solidFlameDistanceForHeatFlux are \"transmissivity: a fixed transmissivity in (0, 1] is required for a distance search\". The pathLengthM message is Bagster's own refusal outside its band. The viewFactor message belongs to solidFlameHeatFlux for a view factor above one, and the burningFluxKgM2S message to the flame length function.")

q(2,
 "What Reynolds number does the engine compute for the Yellow Book example, against the printed 28240000?",
 "28247014.532194",
 ["28240000","16000000.000000","10666666.666667"],
 "The engine gives 28247014.532194 against the printed 28240000, a relative difference of 2.48e-4 inside a tolerance of 0.001. 16000000.000000 and 10666666.666667 are ERHA's Reynolds numbers at 12 m/s and 8 m/s. 28240000 is the printed figure, which the book rounds.")

emit(Q, '/root/hse-wip-consequence/banks/h4i_m06.json', expect_n=15)
finish()
