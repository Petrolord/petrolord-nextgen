import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Associate m02, What Is in the Stream. Digest section 4, with the shipped
# studio figures of section 19 where the module's four lessons quote them.

q(2, "A gas analysis gives carbon dioxide at 3 mol% and the engine reports a carbon dioxide partial pressure of 1.530013 bar. What arithmetic produced that figure?",
 "The total pressure of 51.000427 bar multiplied by a mole fraction of 0.030000, with no correlation constant anywhere in the step.",
 ["The total pressure multiplied by the mole fraction and then by the fugacity coefficient of 0.878581, which is the correction every pressure on this screen carries.",
  "The mole fraction divided into the total pressure of 51.000427 bar.",
  "The fugacity of 1.344240 bar divided by the coefficient of 0.878581."],
 "A partial pressure is the total pressure times the mole fraction. The hydrogen sulphide figure is reached the same way, 0.001000 of the same total pressure giving 0.051000 bar."),

q(0, "Partial pressure and fugacity are two numbers for one molecule. On the shipped case, what are they and what sits between them?",
 "A partial pressure of 1.530013 bar and a fugacity of 1.344240 bar, with a coefficient of 0.878581 between them.",
 ["A partial pressure of 1.344240 bar and a fugacity of 1.530013 bar, the fugacity being the larger because the coefficient exceeds one on a compressed gas.",
  "A partial pressure of 1.530013 bar and a fugacity of 1.344240 bar, which the engine reaches by applying the same coefficient it applies to hydrogen sulphide.",
  "Two figures that agree to six decimals at this pressure, so the studio prints both only because the correlation names one of them."],
 "The coefficient falls below one as the total pressure rises, so the fugacity sits below the partial pressure. At a total pressure of 1.000000 bar the two are 0.030000 bar and 0.029924 bar."),

q(3, "Which quantity feeds which calculation in this engine?",
 "The fugacity drives the rate chain, and the partial pressures drive the hydrogen sulphide comparison and the ratio that decides which corrosion product governs.",
 ["The partial pressure drives the rate chain, and the fugacity drives the threshold comparison and the corrosion product ratio.",
  "The fugacity drives everything downstream of the composition, so the threshold comparison and the ratio are both made on corrected quantities.",
  "The partial pressure drives everything, and the fugacity is reported beside it for a reader who wants the thermodynamic figure."],
 "Both terms of the rate correlation take the fugacity, and so does the film factor and the temperature at which that factor leaves one. Nothing in the rate chain takes the carbon dioxide partial pressure directly."),

q(1, "Walk the total pressure up at a fixed composition and read the fugacity coefficient. What happens?",
 "It falls, from 0.997465 at 1.000000 bar to 0.974938 at 10.000000 bar, 0.880814 at 50.000000 bar and 0.601919 at 200.000000 bar.",
 ["It rises with pressure, which is why a high pressure line reports a fugacity above its own partial pressure.",
  "It holds near one until the cap is reached and then drops in a single step to 0.530179, which is the value it is held at above the cap.",
  "It falls with pressure and with temperature together, so the coefficient cannot be read from the pressure alone at any point on the curve."],
 "The gap between a partial pressure and a fugacity is negligible near atmospheric pressure and is not negligible on a high pressure line. The constants behind that curve are held for literature."),

q(2, "At a total pressure of 249.000000 bar the coefficient is 0.531526 and at 400.000000 bar it is 0.530179. What has happened in between?",
 "The pressure cap was reached, so the coefficient is held flat at its value there and `pressureCapApplied` turns true.",
 ["The coefficient passed through a minimum and is now climbing again, which the cap flag records so a reader knows which side of the turn they are on.",
  "The correlation was extrapolated past its validity band.",
  "Nothing has happened. The difference is the sixth significant figure."],
 "At 249.000000 bar the flag is false and at 251.000000 bar and 400.000000 bar the coefficient is 0.530179 with the flag true, identical to its value at 250.000000 bar."),

q(0, "Above the cap the engine returns a note in its own words. What does that note do that silently holding the value would not?",
 "It states that the coefficient is held at its 250 bar value and that what the correlation does above the cap is not established here.",
 ["It converts the reported coefficient into a bracket by giving the two values the correlation would take at the ends of its published validity band.",
  "It refuses the screening outright, which is what stops a rate above the cap from ever reaching a report that somebody else will read later.",
  "It substitutes the coefficient with the last value the correlation was fitted at and records the substitution in the clamps list beside the other clamped inputs."],
 "The engine's own words: the fugacity coefficient is held at its 250 bar value: 399.99999999999994 bar is above the cap and what the correlation does above it is not established here. Holding a value flat is a stated convention."),

q(3, "What is the standing of the cap itself and of the behaviour above it?",
 "Both are held for literature, so a screening run above the cap is reporting a convention back to the reader.",
 ["The cap is a published validity limit and only the behaviour above it is held, which is why the engine is willing to report a number there.",
  "Both are measured by bisection, so the value above the cap is a measurement.",
  "The cap is held and anything above it is refused."],
 "Section 21 lists the 250 bar fugacity cap and what the correlation does above it as one held item. No graded field in this course sits above the cap for that reason."),

q(1, "A user types 3 into the box that wants a carbon dioxide mole fraction. What does the engine do?",
 "It refuses and quotes the value back, saying the CO2 mole fraction must be between 0 and 1: 3 is outside it.",
 ["It accepts the figure and reports a partial pressure three hundred times the total pressure, since the range guard covers only negative values.",
  "It reads the number as mole percent, divides by a hundred and carries on, which is the conversion the studio layer would have applied.",
  "It clamps the fraction to 1 and records the clamp in the list of inputs the engine moved, alongside the corrosion inhibitor clamps."],
 "The range guard on a fraction is one of very few guards this module enforces. Nought to one on every fraction, nought to fourteen on pH, a temperature above absolute zero, and the partial pressure sum against the total."),

q(2, "A blank carbon dioxide box and a carbon dioxide mole fraction of 3 are both refused, and the two messages are different. Why?",
 "A blank is a question the engine cannot answer and a 3 is a value it can reject, so one asks for a finite figure and the other names the range and the value.",
 ["The blank is caught by the whole screening door and the out of range value by the fugacity door, so the two messages come from two different layers.",
  "The blank refusal is thrown and the out of range refusal is returned as an object, so a caller sweeping candidate compositions can carry on past the second.",
  "The blank is refused by the sum guard, because an absent fraction makes the sum of the two mole fractions impossible to compare against the total."],
 "A blank box gives back that a finite CO2 mole fraction is required. A 3 gives back the range and the value that failed it. A typed zero is a third case again, a positive assertion that there is no carbon dioxide."),

q(3, "Three temperatures are refused at the fugacity door. Which description matches what the engine does?",
 "A blank temperature asks for a finite figure, and a temperature at or below absolute zero is refused with the typed value named in the message.",
 ["All three are clamped to the nearest temperature inside the correlation's published validity band and the clamp is reported.",
  "A blank temperature is refused and a temperature below absolute zero is accepted, since the correlation is a function of the reciprocal temperature and stays finite there.",
  "All three return not a number from the whole screening door, which a caller is expected to test for before reading any field."],
 "The refusals name the input. A temperature at absolute zero comes back as a temperature above absolute zero is required, with the figure that was typed quoted inside the message."),

q(0, "The bare coefficient door returns not a number at a temperature of -300 C rather than a finite figure. Why does that matter?",
 "A finite number there would be read as an answer by anything that only tests for an error key.",
 ["A finite number there would be inside the correlation's published validity band, which the engine has no way of enforcing.",
  "Not a number is what the studio layer converts into the refusal the user sees, so the bare door has to produce it for the message to exist.",
  "A ratio below absolute zero comes back negative."],
 "Anything checking only for an error key would take a finite coefficient as a valid one and carry it straight into the rate chain. Not a number cannot be mistaken for an answer."),

q(2, "Does this engine apply a fugacity correction to hydrogen sulphide?",
 "No, and it says so in a field rather than leaving the absence to be inferred, so `ph2sFugacityApplied` comes back false on every screening.",
 ["Yes, using the same coefficient it applies to carbon dioxide, since the coefficient is a property of the total pressure rather than of the molecule.",
  "Yes, but only above the cap, where the correction is held flat for both gases at the value the coefficient takes there.",
  "No, and the absence is left undeclared, which is why a caller looking for the coefficient field has to work out from the results that none exists."],
 "The hydrogen sulphide partial pressure at the shipped defaults is 0.051000 bar, printed as 0.739699 psia, and it is the total pressure times the mole fraction with nothing else done to it."),

q(1, "What does the declared absence of a hydrogen sulphide fugacity correction let you say, and what does it not?",
 "You may say the comparison is made on an uncorrected partial pressure. You may not say where a corrected one would land, because nothing here computes one.",
 ["You may say a corrected pressure would sit lower, since the coefficient falls below one, and you may not say by how much without the constants.",
  "You may say both gases are treated alike, and you may not say which of the two the threshold comparison is made against.",
  "You may say the correction was withdrawn like the severity region, and you may not say whether it will return."],
 "Whether a correction belongs there is a question for the literature and for the Fluid Properties course, which owns fugacity as a thermodynamic quantity. Here the honest statement is the narrow one."),

q(3, "The ratio that decides which corrosion product governs is reported as 0.033333333333 on the shipped case. What is it free of?",
 "Any fugacity coefficient and any total pressure, because both of its arguments are partial pressures and the total pressure divides out.",
 ["Any held constant, which is why the regime word it produces is one of the few verdicts this course is able to grade.",
  "Any mole fraction, since the engine forms it from the two partial pressures the screening has already computed.",
  "Any dependence on the two mole fractions, since the engine forms it from partial pressures rather than from the composition itself."],
 "Both arguments are the total pressure times a mole fraction, so the ratio equals the ratio of the two mole fractions at any pressure at all. The shipped fractions are 0.030000 and 0.001000."),

q(0, "Where does the thermodynamics of fugacity belong, and what is this course's own ground?",
 "The Fluid Properties course owns the thermodynamics. What is specific here is the routing of the two quantities.",
 ["This course owns both, since no other live course computes a fugacity coefficient from a temperature and a pressure.",
  "The Pipeline & Line Sizing course owns it, because the same coefficient appears in its own pressure drop calculation on the same stream.",
  "Neither, since the coefficient constants are held and a held quantity cannot be said to be owned by any course at all."],
 "Name the owner for the thermodynamics, then teach which quantity drives the rate, which drives the threshold and the film ratio, and that no fugacity correction is applied to hydrogen sulphide at all."),

emit(Q, '/root/fc-wip-corrosion/banks/fc9b_m02.json', expect_n=15)
finish()
