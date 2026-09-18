import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Professional m06, which film governs, and the threshold comparison that
# sits beside it. Digest Sections 13 and 12 at the rendering they print, with
# the shipped studio case and its H2S change from Section 19. The two boundary
# ratios and the threshold VALUE are HELD, so a question may ask a learner to
# recognise that they are held and may never ask for one as an answer.

q(1, "Why does the H2S to CO2 ratio need no pressure at all?",
 "Both arguments are partial pressures, so the total pressure divides out of the ratio.",
 ["Because the engine applies a fugacity correction to both of the gases before it divides them.",
  "Because the ratio is formed at a reference pressure the engine holds fixed.",
  "Because the mole fractions are normalised to one bar before the division."],
 "A partial pressure is the total pressure multiplied by a mole fraction, so dividing one by the other leaves the ratio of the two mole fractions at any pressure whatsoever. Two mole percentages out of a gas analysis are enough to form it.")

q(3, "The digest forms the H2S to CO2 ratio two ways at five pressures and prints the difference. What is the difference column?",
 "Zero at every pressure.",
 ["Zero below the fugacity cap and non-zero above it.",
  "Small and falling as the pressure rises towards the cap.",
  "Zero at the shipped pressure and non-zero at every other."],
 "That is the whole claim. A ratio that moved with pressure would have been built from the wrong quantity, and the two routes agreeing at five pressures is what says it was not.")

q(0, "What two mistakes does reaching the ratio through MOLE FRACTIONS catch?",
 "An H2S partial pressure built without its mole fraction, and one handed a CO2 fugacity instead.",
 ["A mole fraction typed as a percentage, and a pressure typed in psig.",
  "A total pressure above the cap, and a temperature below absolute zero.",
  "A CO2 fraction of zero, and an H2S fraction that is not a number."],
 "Neither could ever be caught by writing the engine's own ratio out a second time, because a copy of an expression agrees with the expression whatever either of them is doing. Two routes that share a step cannot test the step they share.")

q(2, "In how many words does the regime door answer, and what are they?",
 "Four: carbonate, mixed, sulphide and unknown.",
 ["Three: carbonate, sulphide and unknown, the mixed case being a flag on the rate.",
  "Two: whether the CO2 rate model applies and whether the rate is an upper bound.",
  "Five, the fourth being a severity region."],
 "There is no severity region anywhere in this engine. That claim was withdrawn, and the door reports a regime word and whether its own rate model still applies.")

q(1, "The two ratios that separate those regimes were measured by bisecting the regime word. What is their status?",
 "Neither is sourced anywhere in this repository, both being held for literature.",
 ["Both are published transition ratios that the engine cites in its own module docstring.",
  "One of the two is published and the other was fitted to the vendored golden cases.",
  "Both are exported constants, so their sourcing travels with the export."],
 "Exporting a constant says what the module declares and measuring one says what it actually uses. Neither says where the number came from, and a case near a boundary is near a line of unknown position.")

q(0, "What does the engine do with the rate in the MIXED regime?",
 "It issues the rate and flags it as an upper bound.",
 ["It withholds the rate and keeps the band label and the remaining life.",
  "It refuses the whole screening, because two films are competing.",
  "It issues the rate with no flag at all."],
 "Its own note is that with mixed sulphide and carbonate films the CO2 rate is an upper bound and the real rate depends on which film persists. A mixed film is a reason to read the number as a ceiling.")

q(3, "Above the higher boundary the engine says a CO2-only rate model no longer describes the surface. What does it then report?",
 "The rate as a stated upper bound, with the band label and the remaining life withheld.",
 ["A refusal, because no rate at all can be issued once the model has stopped describing the surface.",
  "The rate, the band label and the remaining life, all three marked as ceilings.",
  "The rate and the remaining life, with only the band label withheld."],
 "Two easier routes were available and the engine takes neither. Refusing the rate outright throws away a usable ceiling, and carrying on regardless is what a bare correlation does. This engine issues the number and tells you what kind of number it now is.")

q(2, "On the studio's shipped default case, what is the H2S to CO2 ratio and which regime does it reach?",
 "0.033333333333, in the mixed regime.",
 ["0.333333333333, in the sulphide regime.",
  "0.140495867769, in the sulphide regime.",
  "0.040000000000, in the mixed regime."],
 "That ratio is formed from an H2S mole fraction of 0.001000 and a CO2 mole fraction of 0.030000, and it would be the same number at any total pressure.")

q(1, "Raise the H2S on the studio's shipped case from 0.1 to 1 mol percent. Why is the rate unchanged?",
 "H2S is not in the CO2 rate correlation, so it cannot move the rate.",
 ["The regime change removes the corrosion inhibitor credit and the two effects cancel.",
  "The engine holds the rate at its previous value once the regime word changes.",
  "The rate is recomputed and rounds to the same figure at six decimals."],
 "The ratio becomes 0.333333333333 and the regime becomes sulphide. That the rate does not move is the lesson in one line, because H2S reaches the regime word and the threshold comparison and reaches the correlation nowhere at all.")

q(0, "On the shipped case, what DOES change on the screen when the H2S goes from 0.1 to 1 mol percent?",
 "Both of the fields a reader summarises by are held back, and the rate becomes a ceiling.",
 ["The rate falls, and the band label and the remaining life follow it down.",
  "The wall shear rises, and the corrosion inhibitor credit is removed.",
  "Nothing changes, since the H2S reaches none of the reported fields."],
 "Nothing failed open there. The arithmetic ran and its two summarising fields were held back, which is a withholding rather than a refusal.")

q(2, "A case arrives with a CO2 partial pressure of zero. What does the regime door return?",
 "The unknown regime, with a note saying which film governs is not known there.",
 ["The carbonate regime, since no CO2 means no competing sulphide film.",
  "The sulphide regime, since the ratio is unbounded above.",
  "A refusal, because a ratio cannot be formed from a zero."],
 "With no CO2 partial pressure there is no ratio to form. Both unknown branches carry a note, so a panel printing the note unconditionally always has a sentence to print.")

q(3, "The sour service door compares one partial pressure against one threshold. What else does it do?",
 "It reports the comparison in two units and counts how far above in powers of ten.",
 ["It classifies a severity region from the partial pressure and the pH.",
  "It recommends a material, a hardness limit and a weldment qualification for the line.",
  "It returns a sulphide stress cracking criterion alongside the comparison."],
 "There is no severity region and no material guidance. The engine reports both as not provided in fields of their own, so a caller cannot read the gap as a value somebody forgot to set.")

q(1, "How far above the screening threshold does the shipped case sit?",
 "1.163506 decades.",
 ["0.455932 decades, which is the swept row an order of magnitude lower.",
  "1.455932 decades, which is the swept row an order of magnitude higher.",
  "0.000000 decades, the case sitting exactly on the threshold."],
 "The decade count is the useful half of that door. A verdict of above the threshold is true of a stream a hair over the line and of one three orders of magnitude over it, and the count separates them without inventing a severity scale.")

q(0, "At an H2S partial pressure of exactly zero, what does the engine report for the decade count?",
 "An absence rather than a figure, because the logarithm of zero is not a screening result.",
 ["Minus infinity, which the studio then renders as a dash.",
  "Zero, which is the count the threshold itself carries.",
  "The count the smallest swept partial pressure produces."],
 "The sour flag is false on that case. Reporting an absence where the arithmetic has no answer is the same habit the oil-wet inhibition figure follows.")

q(2, "Why does this door print its threshold in both bar and psia?",
 "So nobody has to convert, and so no second rounded copy of the number can drift from the first.",
 ["So the reader can choose whichever unit the governing standard is written in.",
  "So the engine can compare the stream against whichever is the more limiting.",
  "So the studio is able to show the held value in the one unit and the sourced value in the other one."],
 "A threshold quoted in one unit and compared in another is where conversion mistakes live. The engine derives the psia figure from the bar figure rather than carrying a separate rounded literal, and it declares in a field of its own that the VALUE is held.")

emit(Q, "/root/wt-fc9-nextgen/tools/course-banks/corrosion/intermediate/fc9i_m06.json", label="fc9i_m06", expect_n=15)
finish()
