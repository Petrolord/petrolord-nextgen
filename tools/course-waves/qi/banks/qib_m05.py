import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Associate m05, Will the fluid show.
# Sources: the fluids at Ekene conditions and the Wood mix, oil-to-brine
# substitution on a log, how far AI and Vp/Vs move, the wet trend on a
# crossplot, the distance from the wet trend, and the m05 refusals.

q(1, "At the stated Ekene conditions (180 degF, 3200 psia, 32 API, gas-oil ratio 400 scf/stb), what bulk modulus does liveOil return?",
 "0.852881 GPa.",
 ["2.662550 GPa, the stiffer of the two fluids, which is what the brine function returns at the same conditions.",
  "0.865443, the oil's reference density in g/cc from apiToRho0, read off the table as if it were a modulus.",
  "1.398867 GPa, the pore fluid's modulus at the oil-leg mean Sw of 0.574254."],
 "Batzle-Wang at the stated conditions gives the live oil a bulk modulus of 0.852881 GPa, density 754.214377 kg/m3 and Vp 1063.400328 m/s. 2.662550 GPa is the brine, 0.865443 g/cc is a density, and 1.398867 GPa is the Wood mix of the two at the oil-leg mean Sw.")

q(3, "woodMix mixes the Ekene brine and live oil at Sw 0.500000. Which result does it return, and what does it show?",
 "1.291926 GPa, which sits much nearer the oil's 0.852881 GPa than the brine's 2.662550 GPa: the Wood average stays close to the softer phase.",
 ["2.662550 GPa, because any brine in the pore space sets the modulus of the mix to the stiffer phase as soon as it is present.",
  "879.708973 GPa, the mix at half saturation, read straight from the woodMix table's other column, the one that climbs in even steps as Sw rises.",
  "0.987056 GPa, the halfway point between the two fluids, since Wood's average weights each modulus by its volume fraction."],
 "At Sw 0.500000 Wood's average returns 1.291926 GPa, far nearer the oil than the brine: the Wood average sits close to the softer phase until the brine fraction is high. 879.708973 is the mix's density in kg/m3, and 0.987056 GPa is the mix at Sw 0.200000.")

q(0, "The lab converts the stated Ekene pressure of 3200 psia before calling Batzle-Wang. What does the brine function receive?",
 "22.063223 MPa, using 1 MPa = 145.037738 psi.",
 ["82.222222 MPa, the converted temperature figure.",
  "145.037738 MPa, the conversion factor the lab divides by, passed on in place of the pressure.",
  "71.243043 MPa, read from the converted gas-oil ratio, which the lab hands to the brine engine in litres per litre."],
 "3200 psia over 145.037738 psi per MPa is 22.063223 MPa. 82.222222 is the temperature in degC, 71.243043 is the gas-oil ratio in L/L for the oil, and 145.037738 is the factor itself.")

q(2, "A learner sets the pressure to 0 in the feasibility explorer and calls brine. What does the panel print?",
 "The engine's own words: \"Temperature (degC) and positive pressure (MPa) required.\"",
 ["The engine's own words: \"Salinity must be a weight fraction in [0, 0.5).\"",
  "A brine row with every field NaN and the gap shown, as elasticPoint does.",
  "The engine's own words: \"API gravity must be in (0, 100).\", since the oil and the brine share one check on the conditions."],
 "brine refuses a pressure of 0 MPa with the message on temperature and positive pressure. The salinity message comes from a salinity of 0.6 and the API message from apiToRho0 at 0 API; a NaN result belongs to elasticPoint with Vs above Vp.")

q(0, "Oil-to-brine substitution at 5082.000000 ft at Ekene-1 takes Vs from 1358.537000 to 1349.137957 m/s. What does the course say the method holds fixed?",
 "The shear modulus; the density swaps the pore fluid, so Vs falls a little as the rock gets denser.",
 ["Vs itself, so the small fall is rounding in the table.",
  "The density, so the whole Vs change comes from brine adding shear stiffness to the frame that the oil had taken away.",
  "The pore fluid's bulk modulus, which the method keeps at its in situ value, so every velocity change is a density change alone."],
 "Gassmann substitution leaves the shear modulus unchanged and swaps the pore fluid in the density, rho_new = rho + phi (rho_brine - rho_fluid): at 5082.000000 ft density rises from 2311.300000 to 2343.616460 kg/m3 and Vs falls slightly. The pore fluid's modulus does change, from 1.189766 GPa in situ to brine.")

q(3, "At 5082.000000 ft (Vsh 0.325800) the substitution's mineral modulus is 30.444339 GPa. Where does that figure come from?",
 "Quartz (K 36.600000 GPa) and clay (K 20.900000 GPa) mixed by Voigt-Reuss-Hill on the sample's Vsh.",
 ["Quartz alone at 36.600000 GPa, softened by the porosity of 0.220700.",
  "The in situ pore fluid of 1.189766 GPa added to the clay's 20.900000 GPa as the frame takes on the oil and brine in it.",
  "The clean sample at 5114.000000 ft, whose 35.087723 GPa the lab applies to every oil-leg depth, scaled by its Vsh."],
 "mixMinerals mixes quartz (36.600000 GPa) and clay (20.900000 GPa) by Voigt-Reuss-Hill on each sample's Vsh, so the shaly sample at 5082.000000 ft carries 30.444339 GPa and the clean one at 5114.000000 ft 35.087723 GPa. The pore fluid, 1.189766 GPa here, enters Gassmann separately.")

q(1, "A learner passes substituteVels a porosity of 0. What happens?",
 "It refuses: \"Porosity must be in (0, 1).\"",
 ["It returns the in situ Vp unchanged, since with no pore space there is no fluid for brine to replace in the rock.",
  "It refuses: \"vp, vs and rho must be positive.\"",
  "It refuses: \"Fractions must sum to 1.\", the check mixMinerals makes on the quartz and clay fractions it is given."],
 "substituteVels refuses a porosity of 0 with the porosity message, in the engine's own words. The positivity message answers a negative Vp, and the fractions message is mixMinerals given quartz 0.7 and clay 0.2. The engine returns no unchanged Vp in place of a refusal.")

q(2, "Over the 65 oil-leg samples of Ekene-1, how far does taking the leg to brine move the mean AI (acoustic impedance)?",
 "Up 7.456776 percent, from 6641244.924742 to 7136467.682134 kg/(m2 s).",
 ["Up 7.142745 percent, the same move the leg's mean Vp/Vs makes when brine replaces the oil.",
  "Down 7.456776 percent, because brine is denser and the heavier pore fluid slows the compressional wave through the rock.",
  "Up to 7358819.677147 kg/(m2 s), the water leg's figure."],
 "The mean of the sample values of AI rises 7.456776 percent, 6641244.924742 to 7136467.682134 kg/(m2 s): Vp and density both rise when brine replaces the oil. 7.142745 percent is the Vp/Vs change, and 7358819.677147 is the measured water leg, which is different rock.")

q(3, "The Ekene-1 oil leg taken to brine reads a mean AI (acoustic impedance) of 7136467.682134 kg/(m2 s); the measured water leg reads 7358819.677147. What does the course say about that gap?",
 "The two are different rock: the substituted figure is the fluid effect alone, and the water leg adds the difference in porosity and clay.",
 ["The substitution is undercooked: brine has not fully replaced the oil.",
  "It is residual oil left in the water leg below the contact at 5118.110236 ft, which lowers that leg's measured impedance.",
  "The two should agree, so the gap is the error of Gassmann and a study corrects every substituted figure up to the water leg."],
 "The substituted oil leg keeps its own rock (porosity 0.203626, Vsh 0.178134) and changes only the fluid; the water leg is different rock (0.197677, 0.117854). So the substituted figures are the fluid effect alone and the water-leg figures add porosity and clay. The water leg's AI is the higher one, so no oil lowers it.")

q(0, "For the Ekene-1 oil leg in situ, the course prints an AI (acoustic impedance) of 6641244.924742 and one of 6639018.603084 kg/(m2 s). How do they differ?",
 "6641244.924742 is the mean of the 65 sample values; 6639018.603084 is elasticPoint on the layer's mean Vp and density.",
 ["They are one figure, printed twice at six decimals, and the gap between them is rounding carried through two different routes through the lab.",
  "6639018.603084 is the mean of the sample values and 6641244.924742 is elasticPoint on the layer's means.",
  "6641244.924742 is the oil leg after substitution to brine, and 6639018.603084 is the same leg as it is."],
 "Two kinds of mean appear: the substitution table averages each sample's AI to 6641244.924742, while the elastic set averages Vp, Vs and density first and computes AI from the means, 6639018.603084. Taken to brine the leg's mean of the sample values reads 7136467.682134.")

q(1, "How does fitFluidLine fit the wet trend to the brine-substituted block boundaries?",
 "By total least squares through the origin, the principal axis of the (A, B) points, so neither A nor B is treated as free of error.",
 ["By ordinary least squares of B on A with a free intercept, so the line need not pass through the origin of the crossplot.",
  "By the published Castagna, Swan and Foster slope, computed from the blocks' mean Vs/Vp and a Gardner exponent and then drawn through the points.",
  "By ordinary least squares of B on A through the origin, fitted to the in situ blocks before any sample is taken to brine."],
 "The wet trend is the fluid line through the origin fitted by total least squares to the intercepts and gradients of block boundaries after every sample with oil (79 of 800 at Ekene-1) is taken to brine. The Castagna, Swan and Foster slope is the published line, a separate comparison.")

q(2, "On Ekene-1 with 16 ft blocks, the fitted wet trend has slope -2.257963. What does the published Castagna, Swan and Foster line give?",
 "-0.404345, at the blocks' mean Vs/Vp of 0.408987 and a Gardner exponent of 0.25.",
 ["-66.112544, the published line's angle.",
  "-2.565814, since the published line is the fitted line at the 8 ft blocks the publication assumes for every well.",
  "-2.257963 as well, because the published line is calibrated to the same blocked logs and so lands on the fitted slope."],
 "backgroundSlope assumes one Vs/Vp for every boundary and returns -0.404345 at Vs/Vp 0.408987 and g 0.25, far shallower than the fitted -2.257963. -66.112544 degrees is the fitted line's angle and -2.565814 is the fitted slope at 8 ft blocks.")

q(0, "At Ekene-1, what happens to the fitted wet trend when the stated block length is cut from 16 ft to 8 ft?",
 "49 interfaces in place of 24, and the slope steepens to -2.565814.",
 ["16 interfaces, and the slope settles at -2.254272.",
  "The engine refuses: \"A fluid line needs at least three interfaces.\", because shorter blocks leave fewer boundaries.",
  "Nothing in the slope: it stays -2.257963, since the block length only changes how many points the crossplot draws."],
 "The block length is a stated choice: 8 ft blocks (16 samples) give 49 interfaces and slope -2.565814, with rms distance 0.006424. 16 interfaces and -2.254272 belong to 24 ft blocks, and the three-interface refusal answers a fit given two interfaces, the opposite end.")

q(3, "Against the fitted wet trend, the top of the Ekene Sand at Ekene-1 sits at -0.072091 in situ and -0.004519 with brine. How does the course read that pair?",
 "The oil moves the top 0.067572 further to the hydrocarbon side.",
 ["The brine top is the anomaly, because -0.004519 lies on the positive side of a falling trend line where wet rock should not sit.",
  "Both lie inside the trend's own scatter, an rms distance of 0.006806, so no fluid effect can be read from the pair.",
  "The oil moves the top 0.067572 toward the positive side, away from the side a hydrocarbon sand moves to on a falling line."],
 "Negative is the hydrocarbon side. The brine top sits almost on the trend at -0.004519, and the same rock with oil sits at -0.072091, 0.067572 further negative. The rock is the same in both rows, so the oil moves the point off the trend.")

q(1, "Measured from the published line, the Ekene-1 top reads -0.458460 in situ and -0.363599 with brine. What does that show?",
 "The line a distance is read from is a stated choice: both tops read far negative from the published line, and the oil top still lies further to the negative side.",
 ["The published line is the correct background, so the brine top is a strong fluid anomaly and the oil leg is wet.",
  "The two lines give the same distance once the sign is dropped, so a verdict may quote either one without naming it.",
  "The oil moves the top toward the positive side when it is read from the published line, the reverse of what the fitted line shows."],
 "The two lines give different distances: from the fitted line the tops read -0.072091 and -0.004519, from the published line -0.458460 and -0.363599. Which line the distance is read from is a stated choice, and a verdict states it beside the figure.")

emit(Q, '/root/qi-wip-qi/banks/qib_m05.json', expect_n=15)
finish()
