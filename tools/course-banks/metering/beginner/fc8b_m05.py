import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Associate m05, The transmitter and what turndown means.
# Digest sections 11 and 12.

q(2, "A transmitter is spanned at 200.000000 in H2O with an accuracy of 0.075000 percent of span. What does that accuracy figure describe?",
 "A band around the reading whose width was fixed when the span was chosen and which does not narrow as the flow falls.",
 ["A band around the reading that narrows in proportion to the reading, which is what makes the percentage a property of the instrument rather than of the operating point.",
  "The largest error the instrument will show anywhere on its range, whatever it is sitting at.",
  "The repeatability between two readings taken at the same differential."],
 "The accuracy is quoted on the span. The reading falls and the band does not, so the same fixed band becomes a larger share of a smaller number."),

q(0, "What does the digest print for the transmitter contribution at the top and the bottom of this span?",
 "0.075000 percent of reading at a reading of 200.000000 in H2O against 7.500000 percent at a reading of 2.000000 in H2O, a difference of -7.425000 and a ratio of 0.010000.",
 ["0.075000 percent at 200.000000 in H2O against 3.000000 percent at 5.000000 in H2O, which are the two rows the engine holds its limits at.",
  "0.235110 percent at 63.800000 in H2O against 7.500000 percent at 2.000000 in H2O, which is the span from the design reading down.",
  "That the contribution rises by roughly a factor of ten for every tenfold fall in the reading, which is the shape of the column."],
 "That RELATION is the comparison available on this span, and anything else about the shape of the column would be arithmetic done by the reader."),

q(3, "At the top of the span the percent of reading and the percent of span are the same number. Why?",
 "Because the reading is the span there, so the two percentages are taken against the same quantity.",
 ["Because the transmitter is calibrated at the top of its range, so its quoted accuracy is exact at that one point and an approximation everywhere below it.",
  "Because the flow turndown and the differential turndown are both 1.000000 there, and the two percentages track the turndowns.",
  "Because the engine returns the percent of span unchanged whenever the warning is silent, and the top row of the table is silent."],
 "Everywhere below the top of the span the two figures differ, which is the whole mechanism this module rests on."),

q(1, "The ABOH design reading of 63.800000 in H2O sits on the transmitter table. What does that row say?",
 "0.235110 percent of reading, a differential turndown of 3.134796, a flow turndown of 1.770536, and a silent warning.",
 ["0.235110 percent of reading, a differential turndown of 1.770536, a flow turndown of 3.134796, and a silent warning, since the differential turndown is the smaller of the two.",
  "0.375000 percent of reading, a differential turndown of 5.000000 and a flow turndown of 2.236068, which is the row the ABOH design point sits on.",
  "0.235110 percent of reading with the warning firing, because the customary rule has been passed."],
 "Every row of that table is an engine result and a row is a complete statement about one operating point. This one is the run the tier has been reading."),

q(0, "Why is a sentence about how fast the percent of reading column rises down the span the wrong thing to write?",
 "Because the only comparison computed on this span is the one between the top and the bottom, and anything about the shape of the column in between is the reader's own arithmetic.",
 ["Because the column is not monotonic, so a sentence about the rate it rises at would be wrong on at least one pair of rows in the table.",
  "Because the rate depends on the span, so a statement true of a 200.000000 in H2O transmitter would be false on any other one.",
  "Because the percent of reading is a returned figure and no statement may be made about a returned figure that the engine did not also return."],
 "Arithmetic the reader did is the most common way a wrong sentence gets into a lesson or a report, which is why the printed comparison is the one to quote."),

q(2, "A differential turndown and a flow turndown describe the same operating point and are different numbers. Why?",
 "Flow through an orifice goes as the square root of the differential, so turning the flow down by some factor takes the differential down by the square of it.",
 ["The differential turndown is measured from the top of the span and the flow turndown from the design reading, so the two have different starting points.",
  "The flow turndown carries the expansibility factor and the differential turndown does not, which is the compressibility correction separating them.",
  "The differential turndown is the ratio the transmitter reports and the flow turndown is that ratio after the discharge coefficient has been applied to it."],
 "Both columns are returned for every reading, and a rule quoted without saying which quantity it is written in is ambiguous by a factor this module measures."),

q(1, "The engine holds two turndown limits. What are they, and what is the relationship the digest prints between them?",
 "A flow turndown limit of 3.000000 and a differential turndown limit of 9.000000, a difference of 6.000000 and a ratio of 3.000000.",
 ["A flow turndown limit of 9.000000 and a differential turndown limit of 3.000000, a difference of 6.000000 and a ratio of 3.000000, because the differential is the quantity that moves less.",
  "A single limit of 3.000000 applied to whichever turndown the caller asks for.",
  "A flow limit of 3.000000 and a differential limit of 9.000000, with no relationship printed."],
 "They are the same rule written in two quantities, and the digest prints the relationship rather than leaving a reader to work it out."),

q(3, "Which of the two turndowns does the engine's warning fire on, and why does the choice matter?",
 "The flow turndown, because the figure a warning is about should be the figure the rule is written in.",
 ["The differential turndown, because it is the quantity the transmitter reports directly and a warning on a derived figure would be a warning about a calculation.",
  "Whichever of the two reaches its limit first, which on a falling reading is the differential turndown because it moves as the square of the flow.",
  "Both, each checked against the three-to-one figure, so a differential turndown of three sets it off."],
 "The two limits are one rule written twice and are reached at the same reading. The three-to-one figure applied to the differential would flag the ABOH row, at a differential turndown of 3.134796 and a flow turndown of 1.770536, where the warning is silent."),

q(1, "On a 200.000000 in H2O span the warning starts below a reading of 22.222222 in H2O. What is true at that reading?",
 "The flow turndown is 3.000000 and the differential turndown is 9.000000, so both limits are reached at once.",
 ["The flow turndown is 9.000000 and the differential turndown is 3.000000, which is the crossing the bisection was run to find.",
  "The percent of reading has reached the accuracy quoted on the span, which is what the engine screens against.",
  "The flow turndown is 3.000000 and the differential turndown has not yet been reached, which is why the warning fires on the flow figure alone."],
 "That reading was found by bisecting the reading at which the returned warning stops being null. Two statements of one rule are reached together."),

q(2, "The engine's note on every transmitter call reads: `a differential turndown of 3.1 to 1 is a FLOW turndown of 1.77 to 1, because flow goes as the square root of the differential. The customary three-to-one flow rule is a nine-to-one differential turndown`. Whose figures are those?",
 "The ABOH run's own, which the table carries in full as a differential turndown of 3.134796 and a flow turndown of 1.770536.",
 ["The engine's two held limits, rounded for a screen, which is why the customary rule appears in that same sentence.",
  "The figures at the reading where the warning starts, which is where a note about the customary rule would be worth printing.",
  "An illustration with no run behind it, printed so the arithmetic can be seen without reference to any meter at all."],
 "The note describes the run in the rounded form a screen shows, and the table beneath it carries the same operating point at full precision."),

q(0, "Asked for a reading above the transmitter span, the engine returns `the reading is above the transmitter span`. Why is there no number to give?",
 "A transmitter cannot report a differential outside the range it was set up for, so a figure computed from one would come from an instrument that had stopped measuring.",
 ["The percent of reading would come out below the percent of span, and a contribution smaller than the instrument's own quoted accuracy is not something the engine will print.",
  "The turndown would be below 1.000000, and the engine holds its limits as turndowns so a value below one has nowhere to sit against them.",
  "The span is a stated input and the reading is a stated input, and the engine refuses any pair of stated inputs it cannot check against each other."],
 "It arrives in real life when a well is opened up and a span chosen for last year's rate is too small."),

q(3, "A reading crosses from silent to firing. What has and has not changed about the measurement at that point?",
 "The uncertainty of the reading has been climbing all the way down the span, and what changed is that the engine has started saying so.",
 ["The uncertainty of the reading steps up at the threshold, which is why the engine places its flag there rather than anywhere else on the span.",
  "The percent of reading stops being derived from the span and starts being derived from the reading, and that is the change the flag records.",
  "The measurement has failed, and the flow figure beside the flag should be discarded rather than used with a wider band around it."],
 "Silent is not a certificate and firing is not a failure. Firing means the flow turndown has passed the limit the engine holds."),

q(2, "A run sits on the row with a differential turndown of 8.000000. Is the warning firing?",
 "No, because the flow turndown on that row is 2.828427 and the warning fires on the flow turndown.",
 ["Yes, because a differential turndown of 8.000000 is past the customary three-to-one rule and the warning is written against the customary rule.",
  "Yes, because the differential turndown limit the engine holds is 9.000000 and the screen fires as the reading approaches it.",
  "It depends on the span, because the two turndown columns are computed against the span and a differently spanned transmitter would answer differently on the same reading."],
 "The row at a reading of 25.000000 in H2O carries a differential turndown of 8.000000, a flow turndown of 2.828427 and a silent warning."),

q(1, "The differential pressure term in the module six budget on the ABOH run comes from the transmitter. Which figure is it?",
 "0.235110 percent of reading, the figure the transmitter table gives at a reading of 63.800000 in H2O.",
 ["0.075000 percent, the accuracy quoted on the span, since a budget term is a property of the instrument.",
  "0.117555 percent, the contribution on that row.",
  "3.134796, the differential turndown at the design reading, since the term scales with the turndown."],
 "The same figure appears in the transmitter table and in the budget, which is what makes that budget a transmitter derived one."),

q(0, "What does the choice of span decide for the years a meter is in service?",
 "Where the range the instrument can be trusted in sits against the rates the field will actually make.",
 ["Nothing about the band around a reading, since the accuracy is a percentage and a percentage does not depend on the range it is quoted on.",
  "Which of the two turndown limits the engine will apply, because a limit is held against the span rather than against the reading itself.",
  "Whether the uncertainty budget takes its differential term from the transmitter or from a typed figure, since a span is what that derivation needs to run."],
 "Put the span high and the meter saturates rarely and spends its life low on the span. Put it low and the readings are good until the day the rate goes up."),

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/beginner/fc8b_m05.json', expect_n=15)
finish()
