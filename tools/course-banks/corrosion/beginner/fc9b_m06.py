import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Associate m06, One Screen End to End. Digest section 19, with the unit
# conversions of section 24. No capstone condition and no plant name is here.

q(1, "The studio's shipped case types a temperature of 140 F, a pressure of 725 psig and a velocity of 10 ft/s. What reaches the engine?",
 "60.000000 C, 51.000427 bar and 3.048000 m/s.",
 ["60.000000 C, 725 bar and 3.048000 m/s, since the pressure is the one field the engine takes in the unit it was typed in.",
  "140 C, 51.000427 bar and 10.000000 m/s, since only the pressure carries a conversion on the way in.",
  "60.000000 C, 51.000427 bar and 0.152400 m/s, the velocity being converted by the same factor as the line inside diameter."],
 "The engine works in the units the correlations are published in. A line inside diameter of 6 in becomes 0.152400 m, a density of 56 lb/ft3 becomes 897.036000 kg/m3 and a viscosity of 1 cp becomes 1.000000 mPa s."),

q(3, "Those two rate terms are handed to the step that combines them. What comes out, and which step is named?",
 "A combined figure of 9.253475 mm/yr with transport controlling at a margin of 2.779300.",
 ["A combined figure of 27.162967 mm/yr, which is the two terms in series, with transport controlling.",
  "A combined figure of 11.701938 mm/yr, the smaller term unchanged.",
  "A combined figure of 9.253475 mm/yr with reaction kinetics controlling, since the reaction term is the larger of the two."],
 "The combination is the reciprocal of the sum of the reciprocals, so it sits below both terms and near the smaller one. Where transport controls, velocity and line size move the answer."),

q(0, "Between the combined figure of 9.253475 mm/yr and the uninhibited rate of 5.203611 mm/yr, what has been applied?",
 "The film multiplier of 1.000000000000, the pH factor of 0.562341 and the water wetting factor of 1.000000.",
 ["The corrosion inhibitor credit of 85.500000 percent.",
  "The conversion from mm/yr to mpy and back again.",
  "The fugacity coefficient of 0.878581, applied to the combined figure."],
 "The computed film onset is 80.984504 C and the stream is at 60.000000 C, so no film credit is taken. The uninhibited rate is the same case with no corrosion inhibitor credit at all."),

q(2, "The datasheet corrosion inhibitor is 90.000000 percent efficient at 95.000000 percent availability. What does the engine report, and what is the rate?",
 "An effective protection of 85.500000 percent, a shortfall of 4.500000 percentage points, and a rate of 0.754524 mm/yr.",
 ["An effective protection of 90.000000 percent and a rate of 0.754524 mm/yr, the availability being reported beside it without entering the arithmetic.",
  "An effective protection of 95.000000 percent and a rate of 5.203611 mm/yr.",
  "An effective protection of 85.500000 percent and a rate of 5.203611 mm/yr."],
 "The engine's warning on that screen names availability as what limits the result, and it states the metal loss as 1.45 times the datasheet number. The uninhibited rate is 5.203611 mm/yr."),

q(1, "Every rate on the shipped screen carries mpy beside mm/yr. What are the two figures for the reported rate and for the uninhibited rate?",
 "0.754524 mm/yr is 29.705656 mpy, and 5.203611 mm/yr is 204.866591 mpy.",
 ["0.754524 mm/yr is 204.866591 mpy, and 5.203611 mm/yr is 29.705656 mpy, the two being reported in the opposite order on the rail.",
  "0.754524 mm/yr is 29.705656 mpy, and the uninhibited rate is reported in mm/yr alone because no datasheet figure exists for it.",
  "Both convert to the same mpy figure of 29.705656, since the conversion is applied once to the reported rate and carried across."],
 "The conversion is a division by 25.4 and a multiplication by a thousand, and it is stated rather than assumed. The reaction term of 44.225132 mm/yr is 1741.146915 mpy."),

q(3, "What does the flow side of the shipped screen report?",
 "A Reynolds number of 416686.8569 on this module's own definition, a turbulent branch, a wall shear of 14.408065 Pa and a film risk of low.",
 ["A Reynolds number of 416686.8569 and a wall shear of 362.474888 Pa, with the film risk high and the corrosion inhibitor credit removed.",
  "A Reynolds number of 416686.8569 with the laminar branch selected, since the switch sits at a Reynolds number of 4000.000000.",
  "A wall shear of 14.408065 Pa with no Reynolds number, since this module reads the friction factor from the line sizing course instead."],
 "So no corrosion inhibitor credit is removed on this screen. The Pipeline & Line Sizing course computes its own friction factor and its own Reynolds number with a different correlation, and the two will not agree on the same pipe."),

q(0, "Read the hydrogen sulphide rows on that same default case. What is on them?",
 "A hydrogen sulphide partial pressure of 0.051000 bar, which is 0.739699 psia, above the screening threshold by 1.163506 decades.",
 ["A hydrogen sulphide partial pressure of 0.051000 bar, below the screening threshold, with the severity region reported as low.",
  "A hydrogen sulphide fugacity of 0.051000 bar, above the screening threshold, with a material recommendation the studio prints behind a disclosure.",
  "A hydrogen sulphide partial pressure of 1.530013 bar, above the screening threshold by 1.163506 decades, with the region held rather than withdrawn."],
 "The severity region and the material guidance are both reported as NOT PROVIDED. The comparison is made on an uncorrected partial pressure, and the threshold value itself is held."),

q(2, "The shipped screen reports a hydrogen sulphide to carbon dioxide ratio of 0.033333333333. What regime does that give, and what does the engine say about the rate?",
 "Mixed, and the rate is marked as an upper bound.",
 ["Carbonate, and the rate is graded normally with no marking of any kind on it.",
  "Sulphide, and the rate is withheld along with the category and the remaining life.",
  "Mixed, and the rate is withheld because a mixed film means the model no longer describes the surface."],
 "A mixed film is not a reason to withhold a screening number, only a reason to read it as a ceiling. The ratio equals the ratio of the two mole fractions, which here are 0.030000 and 0.001000."),

q(1, "The allowance block on the shipped screen reads what?",
 "A remaining allowance of 3.175000 mm, a remaining life of 4.207953 yr, an allowance the design life demands of 15.090473 mm and a shortfall of 11.915473 mm.",
 ["A remaining allowance of 3.175000 mm, a remaining life of 20.000000 yr and no shortfall, since nothing has been consumed on this case.",
  "A remaining allowance of 15.090473 mm and a remaining life of 4.207953 yr, the first being what the design life demands and the second what the rate gives.",
  "A remaining allowance of 3.175000 mm and a remaining life of 4.207953 yr, with no demanded allowance because no design life was supplied."],
 "The case does not meet its design life of 20.000000 yr. The consumed depth on the shipped case is 0.000000 mm, so the remaining allowance is the whole 3.175000 mm."),

q(0, "The binding constraint on the shipped screen is the corrosion allowance against the design life. What does the engine say it turns on?",
 "4.2 yr of 20 yr, and the sentence beside it names the allowance shortfall in millimetres.",
 ["14.408065 Pa of wall shear, which is the value the shear branch of the reconciliation reads.",
  "0.033333333333, the ratio the regime branch reads.",
  "2.779300, the controlling margin on that case."],
 "In the engine's own words: at 0.755 mm/yr the allowance runs out in 4.2 years against a 20 year design life, short by 11.92 mm of allowance. Nothing in that sentence is new information."),

q(3, "Take the velocity from 10 to 60 ft/s on the shipped case. What happens?",
 "The wall shear becomes 362.474888 Pa against the measured stripping threshold of 100.000000 Pa, the corrosion inhibitor credit is removed, and the rate becomes 13.080024 mm/yr.",
 ["The wall shear becomes 362.474888 Pa and the rate is unchanged, since the shear reaches the summary rail and not the calculation.",
  "The rate falls, because a higher velocity raises the transport term and the series combination sits nearer the smaller term.",
  "The screening refuses, because a velocity of that size is outside the published validity band of the transport correlation."],
 "The credited rate of 1.896603 mm/yr is reported beside it, a ratio of 6.896552, and the remaining life falls from 4.207953 yr to 0.242737 yr. The binding constraint becomes the wall shear on the corrosion inhibitor film."),

q(2, "One change moves the hydrogen sulphide box from 0.1 to 1 mol%. Where does the reported rate end up?",
 "It is unchanged at 0.754524 mm/yr, because hydrogen sulphide is not in the correlation at all.",
 ["It rises, because the ratio of 0.333333333333 puts the stream in the sulphide regime, where the sulphide film is the faster of the two mechanisms competing at the wall.",
  "It falls, by the ratio of the two partial pressures.",
  "It is withheld along with the category and the life, so no rate figure is reported on that screening at all."],
 "What changes is that the category and the remaining life are withheld and the rate is kept only as a stated upper bound. The regime becomes sulphide and the binding constraint becomes that the model does not apply."),

q(1, "Two of the five changes to the shipped case end with the same binding constraint. Which two, and what is it?",
 "The move to 1 mol% hydrogen sulphide and the move to the oil wet regime, and the constraint is that the model does not apply.",
 ["The move to 60 ft/s and the move to 1 mol% hydrogen sulphide, and the constraint is the wall shear on the corrosion inhibitor film.",
  "The move to pH 4.0 and the move to the oil wet regime, and the constraint is the allowance against the design life.",
  "The move to 60 ft/s and the move to pH 4.0, and the constraint is mass transfer to the wall."],
 "Both of those two cases withhold the category and the remaining life, so no rate verdict is being offered and the reader is sent to the withheld block instead."),

q(0, "The shipped screen prints the two rate terms in mils a year as well as in millimetres a year. What are those two figures?",
 "1741.146915 mpy for the reaction term and 460.706213 mpy for the transport term.",
 ["460.706213 mpy for the reaction term and 1741.146915 mpy for the transport term, in the order the rail prints them.",
  "29.705656 mpy and 204.866591 mpy, which are the two rates the corrosion inhibitor credit sits between.",
  "1741.146915 mpy for the reaction term, with the transport term printed in millimetres a year alone."],
 "The two terms in millimetres a year are 44.225132 and 11.701938. Every rate on that screen carries mpy beside mm/yr, because every input on it is in field units."),

q(3, "Why does the shipped screen name a limit at all rather than leaving the reader with its fields?",
 "A reader handed seven independent numbers and no reconciliation summarises by reading the largest one.",
 ["Because a binding constraint is required before a rate can be issued, which is why the screening is incomplete without one.",
  "Because the named limit is what the capstone grades.",
  "Because the limit is the one field carrying no held constant."],
 "The named limit tells you what to change first. It is silent about what steel to buy, when to inspect and what thickness to retire at, because the module has none of those."),

emit(Q, '/root/fc-wip-corrosion/banks/fc9b_m06.json', expect_n=15)
finish()
