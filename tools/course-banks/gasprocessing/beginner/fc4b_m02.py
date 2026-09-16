import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Associate m02, How Much Water a Gas Carries. Written from digest.txt
# Sections 3 and 4: the saturation division, the vapour pressure that is its
# whole temperature dependence, the pound mole that turns a fraction into
# pounds, the surface those two directions draw, and the three limits.

q(2, "OBIAFU sits at 950.000000 psia and 104.000000 degF, where the vapour pressure of water is 1.069612 psia. How does the method reach a mole fraction of water in the gas of 0.001125908?",
 "By dividing the vapour pressure by the total pressure, which is the whole of the physical step.",
 ["By dividing the vapour pressure by the total pressure and then correcting the result for the compressibility the gas has at those conditions.",
  "By taking the vapour pressure to the total pressure over the standard pressure, so that the fraction is referred back to the standard base the pound mole is written at.",
  "By dividing the vapour pressure by the difference between the total pressure and itself, since the gas the water is mixing into is the part of the pressure that is not water."],
 "Ideal vapour liquid equilibrium over liquid water is one division: 1.069612 over 950.000000 is 0.001125908. No compressibility and no standard base enter here."),

q(0, "In the saturation division, what does each side carry?",
 "The numerator carries the whole temperature dependence and no pressure at all, and the denominator carries the whole pressure dependence and enters only as a divisor.",
 ["The numerator carries the temperature and the gas gravity together, and the denominator carries the pressure, so both sides know something about the gas itself.",
  "The numerator carries the temperature, and the denominator carries the pressure along with a second and separate pressure effect that acts on the vapour pressure above it.",
  "The numerator carries the pressure the water exerts at the surface of the pool, and the denominator carries the temperature converted to the absolute scale the fit was written on."],
 "The vapour pressure of water at 104.000000 degF is 1.069612 psia whatever the gas around it is doing, and there is no separate pressure effect anywhere in the method."),

q(1, "The vapour pressure of water reads 0.255814 psia at 60.000000 degF, 0.506169 at 80.000000, 1.069612 at 104.000000 and 2.904091 at 140.000000. What is a reader entitled to take from those four rows?",
 "The direction, which is that the vapour pressure rises with temperature across the whole of the table.",
 ["The shape of the curve, by dividing the highest reading by the lowest and quoting the result as how steeply the vapour pressure climbs over that span.",
  "The rate of climb per degree, by taking the difference between two adjacent rows and dividing it by the difference in temperature between them.",
  "A check on the fit, since a vapour pressure that rises smoothly over four readings is a fit that has been validated across the span between them."],
 "This course prints the figures a ratio would need and does not print the ratio, which means the two readings are not in a relationship this engine computes. A number nobody computed reads exactly like one somebody did."),

q(3, "Where do the numbers behind the vapour pressure come from, and what standing do they have?",
 "A Magnus form fit whose three coefficients, 0.610940, 17.625000 and 243.040000, are declared constants with no publication in this repository behind them.",
 ["A steam table the module carries internally, read at the gas temperature and interpolated between the rows the table happens to hold.",
  "A correlation the module derives from the standard base of 14.696000 psia and 519.670000 degR, so the coefficients follow from figures already exported.",
  "A published equation the golden also uses, which is why the engine and the golden agree to every figure they both print on the four cases."],
 "The coefficients are exported under their own names and declared, which means customary. The golden deliberately uses a DIFFERENT published vapour pressure equation, which is why its ratios sit near one rather than at one."),

q(0, "Turning a mole fraction of 0.001125908 into 53.450380 lb of water per MMscf passes through two constants. Which two?",
 "The standard cubic feet in a pound mole, 379.483571856287, and the molecular weight of water, 18.015280.",
 ["The gallons in a cubic foot, 7.480519480519, and the glycol density of 9.300000 lb a gallon, which together turn a gas volume into a mass.",
  "The gas constant of 10.731600 and the Rankine offset of 459.670000, which are what the gas law needs to give a density at line conditions.",
  "The molecular weight of dry air, 28.962500, and that of water, 18.015280."],
 "A million standard cubic feet is a definite number of pound moles at 379.483571856287 scf a lbmol, the fraction says what share of them are water, and 18.015280 turns that share into pounds."),

q(1, "A plant doubles its gas rate and nothing else changes. What happens to the water content of 53.450380 lb per MMscf?",
 "Nothing. The content is a property of the gas at its conditions and the rate is nowhere in the division that produced it.",
 ["It doubles, since twice as much gas carries twice as much water past one point.",
  "It falls, since the same vapour pressure is shared across twice the molecules.",
  "It rises slightly, because the higher velocity shortens the contact time and leaves the gas further from the equilibrium the method assumes."],
 "53.450380 is a number per MMscf, and the per is doing real work. The rate arrives later in the chain and multiplies a removal rather than this content."),

q(2, "On the water content surface, what happens going down a column and what happens going across a row?",
 "Down a column the content rises, because the vapour pressure in the numerator rises with temperature. Across a row it falls, because the same vapour pressure is divided by a larger total pressure.",
 ["Down a column the content falls, because a hotter gas expands and holds its water at a lower mole fraction. Across a row it rises, because compression brings the gas and the water closer together.",
  "Down a column the content rises with the vapour pressure. Across a row it also rises, slowly, because the departure from ideal mixing grows with pressure and adds water back.",
  "Down a column the content rises with the vapour pressure. Across a row it holds nearly level, because the pressure cancels between the mole fraction and the pound mole."],
 "At 200.000000 psia the content runs from 60.721539 at 60.000000 degF to 689.331762 at 140.000000, and at 60.000000 degF it runs from 60.721539 at 200.000000 psia down to 8.096205 at 1500.000000."),

q(3, "Sixteen cells of the water surface vary gently and smoothly. What does that smoothness establish?",
 "Nothing about the gas. It is one formula evaluated at sixteen sets of inputs, so the smoothness belongs to the formula.",
 ["That the fit has been checked across the whole surface, since a formula that wandered between the published points would show it as a kink somewhere in the table.",
  "That the gas behaves close to ideally across the whole surface, because a real gas departure large enough to matter would bend one of the sixteen readings away from its neighbours.",
  "That the surface was drawn from measured data, since a family of curves this regular is what a chart built from many measurements at many conditions looks like."],
 "Nothing in the table was solved for and nothing was measured. An answer that varies gently across a table has been evaluated across it, which is a different claim from having been checked across it."),

q(1, "The engine answers at -49.000000 degF with 0.153343 lb per MMscf and at 140.000000 degF with 275.732705, and refuses at -49.000001 and at 140.000001. What is that guard doing at its edges?",
 "Including them, because a guard that refused its own stated limit would be as wrong as one that accepted anything at all.",
 ["Excluding them, since the edge value is exactly where the fit stops describing the curve and an answer there would be an extrapolation of the coefficients.",
  "Rounding to the edge, so that a temperature a millionth of a degree outside is answered at the edge value and flagged with a note rather than refused.",
  "Testing the converted value rather than the typed one."],
 "The band holds from -45 to 60 degC, which is -49 to 140 degF, and the engine answers at exactly the edge and refuses a millionth of a degree outside it."),

q(0, "Between 50 degC and the guard at 60 degC the engine answers and attaches a note. What does the note say is going on?",
 "The coefficients were published over a narrower band than the module guards, so inside the gap the fit is an extrapolation of itself, and it reads about 0.8 percent above the Antoine fit at 60 degC.",
 ["The gas has passed the pressure at which ideal mixing starts to understate the water a real gas carries, so the answer should be replaced by a chart reading.",
  "The fit has left the range the engine will answer over, so the number returned beside the note is the value at the edge rather than at the temperature asked for.",
  "The temperature has reached the point where liquid water is no longer the phase the fit was regressed against, so the answer describes a different equilibrium."],
 "The publication limit is about the CURVE the engine draws and it warns rather than refusing, because the fit still tracks the curve there and the engine can say how far it has drifted."),

q(2, "Above about 1000.000000 psia a different note appears. What is it warning about, and why can no arithmetic inside this module settle it?",
 "Ideal mixing understates the water a real gas carries and the departure grows with pressure, so the answer is a screening number and the design number is a chart reading.",
 ["The fit is being extrapolated beyond the pressures its coefficients were regressed at, so the curve has drifted and the note says by roughly how much.",
  "The total pressure is approaching the point where it no longer exceeds the vapour pressure of water, which is the state the engine refuses just below.",
  "The compressibility the sizing routine computes has left the band its correlation is valid over, so the density the answer rests on can no longer be formed."],
 "The first two limits are about the curve the engine draws. This one is about whether that curve is the right curve at all, and the McKetta-Wehe correction the note names lives outside this module."),

q(3, "An engineer types 200.000000 degF into the gas temperature box of the Studio. What does the dehydration tab do?",
 "It refuses by name, giving the band in both units together with the typed temperature converted, which is 93.3 degC.",
 ["It answers and attaches the publication note, because 200.000000 degF is above the band the coefficients were published over and the engine prefers a flagged number to a refusal.",
  "It answers and attaches the chart note, because a temperature that high only arises on a gas whose pressure is also above the threshold where the correction matters.",
  "It clamps the temperature to the guard edge of 140.000000 degF and answers there, so the whole tab keeps returning numbers while the note records what was typed."],
 "The box takes any number and the whole tab refuses this one. Being told the band, the unit conversion and your own figure is being told what to change and by how much."),

q(1, "A total pressure exactly equal to the water vapour pressure at the gas temperature is refused, in the same words as a pressure below it. Why refuse the equality?",
 "A gas at exactly its own water vapour pressure is all water and nothing else, so refusing the equal case is right rather than over strict.",
 ["The division would return a mole fraction above one at the equality, which is not a fraction at all, so the arithmetic below it fails on its own.",
  "The two cases share one guard, and a guard written with a strict comparison on one side has to refuse the equality on the other to stay consistent.",
  "The vapour pressure is quoted to four figures in the message."],
 "The refusal reads that the total pressure must exceed the water vapour pressure of 1.0696 psia at 104 degF, or the gas is not a gas. It is one guard read from either side of its own limit."),

q(2, "On the four published water cases the engine over golden column reads 1.001865077, 1.004159870, 1.002457408 and 1.006379500. Why is that a better result than a column of exact ones?",
 "The golden comes from a different published vapour pressure equation, so two independent fits of one physical curve are meeting inside their shared band.",
 ["The departures are the real gas correction the golden applies and the engine does not, so the column measures how much ideal mixing is understating the water.",
  "A golden that agreed exactly would have been regenerated from the engine.",
  "All four figures sit above one, so the engine is conservative on every case."],
 "Two copies of one fit agreeing exactly says a transcription was faithful. Two published fits meeting near one says two roads met, which is the whole value of the check."),

q(0, "What does the module give up by computing a vapour pressure instead of reading a chart?",
 "The real gas behaviour a chart has built into it, because the chart was drawn from gas that was measured and the fit was drawn from pure water.",
 ["Reproducibility, because a fit carries rounding a chart reading does not.",
  "The ability to answer away from the published points, which only a chart has.",
  "Nothing at all, since the McKetta-Wehe correction the engine warns about above 1000.000000 psia is the chart behaviour restored to the calculation."],
 "The trade is the character of this method. It is fast, transparent and exactly reproducible, and it is describing an idealisation of the real thing."),

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/beginner/fc4b_m02.json', label='fc4b_m02', expect_n=15)
finish()
