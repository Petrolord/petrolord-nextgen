import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Associate m02, The Water And The Oil. Written from digest.txt Section 3,
# which is where the temperature and the salinity the predecessor model
# collected and ignored finally decide something: the water viscosity, the
# brine density, the crude density from API gravity, and the difference.

q(1, "In the viscosity sweep over six temperatures at 62000 ppm TDS, the salinity factor column reads 1.111600 on every row. Why?",
 "The factor depends on the dissolved solids alone, and only the temperature moved down that sweep.",
 ["The factor is a declared constant of the module rather than something computed, so no input of any kind can move it.",
  "The factor is quoted against the value in the last row of the table, so the row it is normalised on necessarily reads one.",
  "The temperature effect is already inside the fresh water column, so the factor is what is left once that effect has been divided out of the brine figure."],
 "The salinity factor is one plus 1.8 times the mass fraction of dissolved solids. The multiplier is declared and the factor is not: hold the salinity at 62000 ppm and it repeats, and the sweep at 41 C over six salinities moves it from 1.000000 to 1.504000."),

q(3, "Across the sweep from 20 C to 95 C at one salinity, the brine viscosity falls by a factor of 3.403251. What does a designer take from that?",
 "The same vessel is catching a very different droplet out of the same water at the two ends of that sweep, because a rise velocity goes as one over the viscosity.",
 ["Viscosity is a weak enough function of temperature over any real produced water range that a summer sample and a winter sample can be treated as the same duty.",
  "The cut size of a gravity device moves by that same factor of 3.403251, since the cut size and the rise velocity are the same quantity read two ways.",
  "The figure is the ratio of the fresh water column to the brine column, so it measures what the salinity is worth rather than what the temperature is worth."],
 "A rise velocity carries one over the viscosity, so the droplets in the hotter water rise faster and the device catches finer oil. A cut size carries the square root of that group rather than the whole of it, and the ratio column is each brine viscosity over the last row of its own column."),

q(0, "Water at 41 C is heated upstream of a basin and nothing else about the stream changes. Which way does the basin cut size move, and why?",
 "Finer, because the water thins, every droplet rises faster, and a device that catches a droplet rising at the design velocity now catches a smaller one.",
 ["Coarser, because the crude thins with temperature as well and the density difference falls away faster than the viscosity does.",
  "It does not move, because the cut size comes from the flow over the plan area and neither of those is a property of the water.",
  "Finer, because the brine density rises with temperature and a heavier brine carries a larger density difference against the oil."],
 "The surface loading is unchanged by heating and the cut size is the inversion of the rise balance at that loading, which does carry the viscosity. Brine density falls with temperature rather than rising, and the module states the fit it uses over its own temperature range."),

q(2, "What form does the salinity correction on viscosity take in this module, and what status does it have?",
 "One plus 1.8 times the mass fraction of dissolved solids, with the multiplier declared and no publication here to check it against.",
 ["A power law in the mass fraction whose exponent was fitted to the published brine data this repository carries for the purpose.",
  "A multiplier read from the same three-constant temperature fit, so that salinity and temperature enter the answer through one expression.",
  "One plus the mass fraction multiplied by the brine density slope of 700, which is the one constant covering both of the salinity effects."],
 "The correction is linear in the mass fraction and the multiplier sits in the frozen declared object. The slope of 700 is the other salinity effect entirely, which is what dissolved solids do to the density."),

q(1, "A caller hands this module a salinity just above 300000 ppm TDS. What comes back, and what is the stated reason?",
 "A refusal naming the figure, because the salinity correction here is stated to 300000 ppm and past saturation a linear correction has nothing behind it.",
 ["The answer computed at 300000 ppm, with a warning saying the input was moved up to the top of the stated range, on the grounds that the correction is very nearly flat by the time it gets there.",
  "A refusal naming the figure, because no brine of that salinity exists at any temperature this module's density fit is stated over.",
  "The answer with a warning, because the module holds the salinity band as customary rather than as a limit on the correction itself."],
 "The refusal names the input and the limit together. Moving a bad input quietly to the nearest good one would delete the input, and the caller would never learn which number the answer belonged to."),

q(0, "A negative total dissolved solids figure reaches this module. What is the shape of what happens, and why does it matter beyond the obvious?",
 "It is refused with the quantity stated first and then the input named, which is the shape every input check in this engine takes.",
 ["It is treated as fresh water, since a salinity below zero and a salinity of zero produce the same correction factor of 1.000000.",
  "It is answered with a warning, because the linear correction remains computable below zero and the caller may be probing the sensitivity.",
  "It is refused without naming the figure, because a quantity that cannot be negative needs no explanation beyond its own definition."],
 "The engine names the quantity, names the range and names the figure that fell outside it. Quietly moving a bad value to the nearest usable one would hide which number the answer belonged to."),

q(3, "Two rows of the brine density table sit at 41 C, one at 0 ppm TDS and one at 62000. The fresh column reads 991.861174 on both. What follows?",
 "The whole of the difference between 991.861174 and 1035.261174 is the dissolved solids, because the temperature term produced the same number twice.",
 ["The fresh column is a declared reference rather than a computed figure, which is why it repeats whenever the salinity is the only input that moved.",
  "The salinity term is applied to the fresh figure as a multiplier rather than as an addition, so that the 62000 ppm row is simply the 0 ppm row above it scaled by the salinity factor of 1.111600.",
  "The brine density has no temperature dependence at all once the salinity term is added, which is why the fit is stated over so narrow a range."],
 "Temperature sets the fresh water density and salinity adds to it. The factor of 1.111600 is the viscosity correction, and it is a multiplier on a different property entirely."),

q(2, "What does the declared constant brineDensitySlopeKgM3 of 700 set, and what is its status?",
 "How fast the brine density rises with dissolved solids, chosen rather than published, and kept in the same frozen object as the rest.",
 ["The density of the dissolved solids themselves, out of which this module assembles a brine density by treating the water as a mixture of salt and water.",
  "The upper density this module will describe a brine at, past which the salinity correction is refused rather than extrapolated.",
  "The rate at which the brine density falls with temperature, which is the other half of the two term fit the module uses."],
 "It is the salinity slope on density and nothing else. The module states the temperature range its fresh water density fit holds over, and that range is where a refusal on temperature comes from."),

q(1, "How does this module get from a degree API to a crude density at treating temperature?",
 "The API figure becomes a specific gravity at 60 F, that is taken against a declared reference water of 999 kg/m3, and the result is thinned at a declared 0.0007 for each degree.",
 ["The API figure becomes a specific gravity at 60 F and is taken against the brine density of the stream, so the difference the devices need falls out in one step.",
  "The API figure is converted directly to a density at treating temperature by the standard relation, which carries its own temperature term.",
  "The API figure becomes a specific gravity, and the thermal expansion is looked up for the crude family the gravity places it in."],
 "Three steps, two of them declared choices. The reference water is a choice, and the one expansion rate is applied to every crude in the sweep from the heaviest to the lightest, which real crudes do not do."),

q(0, "The UZERE crude is 24 API and the stream is at 41 C. What does the module make of it?",
 "A specific gravity of 0.909968 and a density of 892.869375 kg/m3 at treating temperature.",
 ["A specific gravity of 0.909968 with the density read against a reference water of 1000 kg/m3 rather than the declared figure.",
  "A specific gravity of 0.909968 and a density of 967.534410 kg/m3.",
  "A density of 892.869375 kg/m3 at 60 F, which the module then corrects to treating temperature before any device is sized."],
 "The specific gravity is taken at 60 F and the density is reported at the line temperature. 967.534410 is the 12 API row of the same sweep, and reading a crude at its reference temperature rather than at the line temperature is the ordinary way this chain goes wrong."),

q(3, "The UZERE brine is 1035.261174 kg/m3 and its crude is 892.869375. What is the density difference doing in this module?",
 "It is 142.391799 kg/m3, and it is the entire driving force behind every gravity and centrifugal device here.",
 ["It is 142.391799 kg/m3, and it is what the grade efficiency curve is integrated against.",
  "It is the sum of those two densities, because buoyancy on a droplet carries the weight of both fluids at once.",
  "It is 142.391799 kg/m3 at 60 F, corrected to the line temperature later."],
 "Buoyancy is the difference, both densities are already reported at the line temperature, and the grade efficiency is integrated against the droplet bins rather than against any density."),

q(2, "Across the six crudes of the API sweep the density difference against the UZERE brine runs from 67.726764 to 253.057299 kg/m3. What is that worth?",
 "A factor of about three in the driving force, and the digest says it is the same factor on every cut size squared.",
 ["A factor of about three in the driving force, and the same factor again on every cut size, since the two are proportional.",
  "A factor of about three in the driving force, which the short-circuit allowance of 1.5 was chosen to absorb on an ordinary basin.",
  "A factor of about three in the driving force, and no effect on a cut size at all, which follows from the flow over the plan area."],
 "The cut size carries the square root of that group, so the factor lands on the cut size squared. It is a property of the two fluids, settled before anybody opens an equipment catalogue."),

q(1, "A caller describes an oil heavier than the water it sits in. What does this module do?",
 "It refuses by name, saying the oil must be lighter than the water for it to rise.",
 ["It reports a negative rise velocity and a cut size with a warning attached, since the algebra remains computable throughout.",
  "It reports the settling velocity of the oil instead and marks the device as a bottom draw rather than an overflow.",
  "It answers with a cut size of NaN and no error, leaving the caller to notice that nothing usable came back."],
 "A method built on buoyancy has nothing to say about that case, so the module declines rather than returning a cut size somebody might use. It is physically possible for very heavy crude in fresh hot water."),

q(0, "At 41 C the brine viscosity runs from 0.000639217342 Pa.s at 0 ppm TDS to 0.000961382883 at 280000. Taken on its own, what does that column do to a cut size, and what else moves with it?",
 "On its own a thicker water slows every droplet and coarsens the cut, and salinity raises the brine density at the same time, which moves the driving force the other way.",
 ["On its own a thicker water slows every droplet and coarsens the cut, and nothing else in the fluid properties responds to salinity at all.",
  "On its own a thicker water speeds every droplet up, because the drag term sits underneath the density difference in the balance.",
  "Nothing at all, since the viscosity enters the removal rather than the cut size and the removal is a fraction of the oil."],
 "Salinity acts on both of the properties this course runs on. Reading one column of a sweep and calling the duty harder or easier leaves out the other one, and both belong to the same water."),

q(2, "Which two steps between a degree API and a crude density at treating temperature rest on a declared choice?",
 "The reference water the specific gravity is taken against, and the rate at which the crude thins with temperature.",
 ["The relation from degrees API to specific gravity, and the reference water of 999 kg/m3 the gravity is taken against.",
  "The reference temperature of 60 F, and the API range the module holds to.",
  "The thermal expansion rate of 0.0007 for each degree, and the brine density slope the difference is then taken against."],
 "The API relation itself is standard and the reference temperature comes with it. The brine slope belongs to the water rather than to the crude, and the API range is a stated limit rather than a step in the chain."),

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/beginner/fc7b_m02.json', label='fc7b_m02', expect_n=15)
finish()
