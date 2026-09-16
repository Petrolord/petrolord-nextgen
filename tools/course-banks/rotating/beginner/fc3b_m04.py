import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Associate m04, Power, Head and Pressure. Digest Section 4 only.
# Section 16 is SHARED by the three tier readings, so its published power
# goldens are in range here and their figures are quoted where they sharpen
# the distinction between the engine's own agreement and the engine against a
# golden. Nothing here grades a held item.

q(1, "At the OKONO duty of 1234.452969 gpm and 417.801018 ft on a fluid of gravity 1.040000, through a pump of efficiency 0.740000 and a motor of 0.920000, what are the three powers?",
 "Hydraulic 135.450994 hp, brake 183.041884 hp and motor input 198.958569 hp.",
 ["Hydraulic 183.041884 hp, brake 198.958569 hp, motor input 148.363379 hp.",
  "Hydraulic 135.450994 hp, brake 198.958569 hp, motor 183.041884 hp.",
  "Hydraulic 148.363379 hp, brake 183.041884 hp, motor 135.450994 hp."],
 "The motor input is also reported as 148.363379 kW. Each of the three is larger than the one before it because each takes in another set of losses."),

q(3, "Which of the three powers describes the duty rather than the equipment?",
 "Hydraulic power, which is this rate lifted this head at this density.",
 ["Brake power, since the shaft is the one place where the duty and the machine meet and a single figure describes both.",
  "Motor input, since it is the only one a station meter can measure.",
  "All three equally, because each is asked at the solved duty."],
 "Brake power is what the pump shaft has to be turned with and motor input is what the supply has to deliver. Both of those are statements about the equipment."),

q(2, "How much does the pump lose and how much does the motor lose at the OKONO duty?",
 "The pump loses 47.590890 hp and the motor a further 15.916686 hp.",
 ["The pump loses 15.916686 hp and the motor a further 47.590890 hp, the larger share going to the electrical side.",
  "Neither loses anything. The efficiencies are stated at the duty.",
  "The motor loses 47.590890 hp and the pump nothing."],
 "Derived from the three powers. Two efficiencies applied in series, each taking its share."),

q(0, "What is lost by multiplying the pump efficiency and the motor efficiency together and applying the product once?",
 "The shaft figure, which is the one the coupling, the shaft and the bearings have to survive.",
 ["The supply figure, since a single combined efficiency reaches the hydraulic power and stops there.",
  "Nothing at all. The product reaches the same supply figure and the shaft figure follows from it by division.",
  "The hydraulic figure, which can no longer be recovered."],
 "Applying the product once reaches the same supply figure and produces no shaft figure at all."),

q(2, "The OKONO electrical load list is built on 183.041884 hp. What is wrong with that?",
 "That is the brake power, which is what the shaft receives. The supply has to carry the motor's own losses on top, a further 15.916686 hp here.",
 ["Nothing. That is the motor input, which is the figure a load list is built on.",
  "That is the hydraulic power, so the list omits the losses of both the pump and the motor.",
  "That is the motor input of 198.958569 hp expressed in kilowatts and read back as horsepower."],
 "Brake power is the right figure to select the motor against, because a motor is rated on what its shaft delivers. It is the wrong figure for the cable, the starter and the running cost, which all carry the supply figure of 198.958569 hp."),

q(3, "The OKONO duty head of 417.801018 ft is converted to a discharge pressure and then converted back. What comes back?",
 "417.801018 ft, because one packaging is used in both directions.",
 ["Slightly less, the round trip losing the 0.203016 ft the fit carries at shutoff.",
  "A refusal, because the reverse conversion is one of the bare-number exports and cannot be called on a figure it produced.",
  "188.100891 ft, since the reverse conversion returns the pressure expressed in the units of head."],
 "The two directions are separate exports and either could have been written with a different constant inside it. They were not."),

q(0, "Hold the head at 417.801018 ft and change only the fluid. What does the discharge pressure do across gravities of 0.620000 and 1.250000?",
 "It runs from 112.137070 psi to 226.082802 psi while the head column never moves.",
 ["It stays at 188.100891 psi, because the head was solved on a curve already stated for the fluid in service.",
  "It runs from 226.082802 psi to 112.137070 psi, the lighter fluid standing higher in the same machine.",
  "It runs from 180.866242 psi to 153.736305 psi."],
 "The impeller is doing the same work on every row. What each fluid weighs is what turns that height into a pressure."),

q(2, "Why is a pump curve published in feet of head?",
 "A curve in feet is a property of the machine, so one catalogue serves every fluid the machine will ever move.",
 ["Feet are the unit the least-squares fit is conditioned in, so a curve published in psi would have to be refitted before it could be solved against a system.",
  "A curve in psi cannot be crossed with a system curve, because the system side is stated as a static lift and a friction head and those are both heights.",
  "The catalogue is measured on water, and only feet carries across unchanged."],
 "A curve in psi would be a property of the machine and one fluid together, and it would have to be reissued for every service."),

q(1, "A vendor quotes a pump at 188.100891 psi on a produced water of gravity 1.040000. What does that machine give on a light condensate of gravity 0.620000?",
 "112.137070 psi, and nothing about the machine has changed.",
 ["188.100891 psi, since a discharge pressure is what the machine delivers and the fluid only sets the flow.",
  "226.082802 psi, because a lighter fluid meets less resistance and the same impeller raises it further.",
  "The quote cannot be converted. A pressure taken on one fluid carries no information about the same machine on another."],
 "The number that travels between services is the head. The pressure belongs to the machine, the station and the fluid together."),

q(3, "pumps.js exports no constants and names almost none internally. How does this course state what is inside it?",
 "By measuring each packaging, choosing inputs that make every other term equal to one and reading it off the return.",
 ["By reading the numeric literals out of the module source, which is the only place an inline packaging is written down.",
  "By quoting the handbook figures the packagings approximate, since a packaging with no name has no other definition available.",
  "By taking them from the published golden cases, whose own oracle states every constant it was written through."],
 "Four come out that way: the feet per psi, the horsepower packaging, the kilowatts per horsepower and the default motor efficiency."),

q(2, "Which single call measures the field horsepower packaging, and what does it return?",
 "One over the hydraulic power at unit flow, unit head, unit gravity and unit efficiency, which gives 3960.000000.",
 ["The brake power over the hydraulic power at unit efficiency, which gives 3960.000000.",
  "The discharge pressure at unit head and unit gravity, inverted, which gives 2.310000000.",
  "The motor input in kilowatts over the motor input in horsepower at unit motor efficiency, which gives 0.745699871582."],
 "Make every other term one and the packaging is the only thing left in the expression."),

q(0, "What is 0.940000000000 in this module, and how was it obtained?",
 "The motor efficiency the engine assumes when the caller states none, read as the brake power over the motor input with the argument left out.",
 ["The pump efficiency floor, below which the power call refuses rather than returning a figure.",
  "The share of the motor input that reaches the shaft on the OKONO station, where 0.920000 was stated.",
  "The largest motor efficiency the guard will accept, measured by walking the argument upward until it refuses."],
 "A default produces a complete answer with nothing on screen to say it was assumed, which is why it is worth a measurement of its own."),

q(1, "Why is a default worth measuring at all?",
 "It produces a complete answer with nothing on screen to say it was assumed, so it cannot be seen any other way.",
 ["It is the only value in the module that can change between engine versions, so measuring it dates the answer.",
  "It is applied after the guards rather than before them, so a stated value and a defaulted value take different routes.",
  "It is the one figure the return prints twice, once as supplied and once as used, so the two can be compared."],
 "A reader who states the efficiency has made a decision. A reader who omits it has also made a decision and may not know it."),

q(3, "The feet-per-psi packaging and the horsepower packaging are each unpicked for the water density they carry. What comes out?",
 "62.337662337662 lb per ft3 from both, a difference of 0 lb per ft3.",
 ["62.337662337662 lb per ft3 from the first and a figure 0.999553114 of it from the second, which is the gap the power gate tolerance is built from.",
  "Two densities that cannot be compared, because one is formed from a pressure over a height and the other from a rate times a height.",
  "62.337662337662 lb per ft3 from the first alone. The horsepower packaging carries a volumetric conversion rather than a density."],
 "144 square inches per square foot over the measured 2.310000000 gives one, and 33000 ft lbf per minute per horsepower over the measured 3960.000000 with 1728 over 231 gives the other. The 0.999553114 is a different gap entirely: it is the engine against the published power goldens, whose oracle worked through SI watts at a water density of its own."),

q(2, "What is 1714.285714285714 in this module?",
 "The quotient of the two measured packagings, which is what ties them together and is measurable directly out of the pair.",
 ["The implied water density expressed in pounds per cubic inch rather than per cubic foot.",
  "The ratio of the motor input in horsepower to the motor input in kilowatts, scaled by the default motor efficiency.",
  "The number of gallons per minute that one horsepower lifts through one foot on a fluid of unit gravity."],
 "Change one packaging without changing the other and it moves. That is what makes it a check rather than a coincidence."),

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/beginner/fc3b_m04.json', expect_n=15)
finish()
