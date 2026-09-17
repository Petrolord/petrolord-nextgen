import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Professional m04, the coupling between the shear verdict and the rate.
# Every figure is from digest Section 11 at the rendering that section prints,
# with the shipped studio case and its five changes from Section 19. The ratios
# and the lives here are free of every held constant, which is why they can be
# asked about where a correlation rate cannot.

q(3, "The wall shear says the corrosion inhibitor film is gone. What does this engine do with the rate?",
 "It computes the rate with the credit removed and reports the credited rate beside it.",
 ["It computes the rate with the credit taken in full and prints a warning under it.",
  "It refuses the rate, because the corrosion inhibitor programme no longer describes the line.",
  "It computes both rates and reports whichever of the two is the larger as the answer."],
 "A rate that still carried the credit with a warning underneath would leave the number and the sentence beside it disagreeing, and a reader resolves that by trusting the number. Here the arithmetic carries the verdict.")

q(1, "What new correlation was written to remove the corrosion inhibitor credit?",
 "None. The credit is simply not taken, so the rate is the uninhibited rate for those conditions.",
 ["A stripped-film correlation fitted to the two shear thresholds.",
  "A derating curve on the datasheet efficiency, indexed by the wall shear.",
  "A second mass-transfer term that applies once the film has gone."],
 "That is why the relationship between the two rates stays arithmetic rather than becoming a second model. Both rates run through the same chain with the same inputs and differ in one factor.")

q(2, "For the one digest stream whose film is stripped, the stripped rate is how many times the credited rate?",
 "4.699248 times.",
 ["1.000000 times, as it is on every other stream in that table.",
  "6.896552 times, which is the figure the shipped case reaches at 60 ft per second.",
  "2.189815 times, which is the jump across the friction branch switch."],
 "That factor is exactly the reciprocal of the fraction of the metal loss the corrosion inhibitor programme leaves behind. The digest asserts the property to twelve figures on every rebuild.")

q(0, "What quantity does the ratio of the stripped rate to the credited rate equal?",
 "The reciprocal of the fraction of the metal loss the corrosion inhibitor programme leaves.",
 ["The ratio of the wall shear on the case to the film-stripping threshold it was taken against.",
  "The ratio of the two band edges the rate happens to sit between.",
  "The ratio of the uninhibited rate to the mass-transfer term."],
 "Nothing in the correlation is in it. The two rates share the whole chain and every held constant, coefficient and correction factor divides out exactly.")

q(1, "Why can a graded capstone field in this course be a ratio of two lives?",
 "Because the allowance is common to both, so the ratio reduces to the corrosion inhibitor arithmetic.",
 ["Because the remaining-life door is the only one the engine exports by name.",
  "Because the band edges cancel between the two lives on the same case.",
  "Because a life in years is a measurement rather than a derived figure."],
 "The remaining life is a remaining allowance divided by a rate, and the allowance is the same on both sides, so the ratio of the two lives is the ratio of the two rates the other way up. Neither carries a held constant.")

q(3, "Take the shipped studio case and raise the velocity from 10 to 60 ft per second. What is the ratio between the rate and the credited rate there?",
 "6.896552.",
 ["4.699248, the same figure the stripped digest stream carries.",
  "1.45, which the shipped warning names on the default case.",
  "1.000000, because the chemistry was not altered between the two screens."],
 "The two stripped cases in this course have different temperatures, different pressures, different chemistry and different lines. Their ratios differ because the two corrosion inhibitor programmes differ, and for no other reason.")

q(0, "At 60 ft per second on the shipped case, what happens to the remaining life?",
 "It falls from 4.207953 yr to 0.242737 yr.",
 ["It falls from 4.207953 yr to 0.760876 yr, which is the stripped digest stream's credited life.",
  "It is withheld, because the corrosion inhibitor credit is no longer being taken on that case.",
  "It is unchanged, because the allowance and the design life were not altered."],
 "Nothing about the chemistry moved between those two screens. One flow input moved and the module changed which rate it was willing to stand behind, and the life follows the rate.")

q(2, "Which wall shear produced the stripped verdict on that faster screen, and what was it measured against?",
 "362.474888 Pa, against the measured stripping threshold of 100.000000 Pa.",
 ["14.408065 Pa, against that same stripping threshold measured at 100.000000 Pa.",
  "369.638295 Pa, against the moderate band this module measures at 50.000000 Pa.",
  "362.474888 Pa, against an erosional velocity limit this module carries."],
 "The film risk is high there, the credit is removed and the rate the screen reports becomes the uninhibited one. The threshold itself is held for literature and no source for it exists in this repository.")

q(1, "On a stream whose film survives, what do the rate column and the credited rate column show?",
 "The same figure, and the ratio between them is 1.000000.",
 ["Two different figures, the credited one smaller.",
  "One figure and one blank, the credited column being filled only when it differs.",
  "Two figures whose ratio is the availability."],
 "Four of the digest's streams are in that position and on each of them the two rate columns agree and the two life columns agree. Printing a figure twice looks redundant until you meet the case where they differ.")

q(0, "Why does the engine report the credited rate even when the credit was taken in full?",
 "Because it is the rate a reader working from a datasheet efficiency already has in their head.",
 ["Because the two figures are needed to form the band label on that case.",
  "Because the remaining life is computed from the credited rate rather than the rate.",
  "Because the capstone grades the credited rate rather than the rate itself."],
 "A screen showing only the stripped rate would look like a different calculation rather than the same calculation with one credit removed. Printing both lets the reader see exactly what the shear verdict cost.")

q(3, "The stripping threshold is held for literature. What does that leave a reader holding on a stripped case?",
 "A pair of bounds, the stripped rate if the held threshold is right and the credited rate if the film survives.",
 ["A single rate, since the engine has already chosen which of the two applies.",
  "A refusal, since no verdict can rest on a number with no source.",
  "A band label, which is the one field the threshold does not reach."],
 "Nothing in this repository settles which of the two is true, so a reader who quotes both and says which assumption produces which is giving an honest account of what the module knows.")

q(2, "In what order does the whole screening compute the shear and the rate?",
 "The shear first, because the rate depends on whether the film survived it.",
 ["The rate first, with the wall shear read afterwards only to colour the risk word.",
  "Both at once, the two of them being independent of one another on any case.",
  "The rate first, and the shear only when the rate has passed a band edge."],
 "That ordering is forced by the coupling. Every step after the first is allowed to depend on the shear verdict, and reading the order tells you which parts of the screen are hostage to which inputs.")

q(0, "The density box is blank, so the film survival check cannot run. Why does the engine refuse to issue a rate?",
 "Because it does not know whether the corrosion inhibitor credit applies, so the rate would be one of two figures.",
 ["Because the density is one of the arguments of the correlation from which this module's corrosion rate is computed.",
  "Because a remaining life cannot be formed without a density for the stream.",
  "Because the band label is taken against a density corrected rate."],
 "On the shipped case at 60 ft per second the two candidate rates differ by the ratio of 6.896552. Issuing one of them while the credit question is open would be choosing between them at random.")

q(1, "Which four blank boxes produce the screening incomplete message?",
 "The density, the viscosity, the velocity and the line inside diameter.",
 ["The temperature, the pressure, the CO2 fraction and the in-situ pH.",
  "The corrosion allowance, the consumed depth, the design life and the rate.",
  "The wetting regime, the water cut, the efficiency and the availability."],
 "Each of those four reaches the wall shear door, and each message has two halves: the first says the film survival check did not run, and the second names the box. A reader gets the cause and the fix from one sentence.")

q(2, "On the stripped digest stream the binding constraint names the wall shear. What does the engine say to change first?",
 "Slowing the line, which changes this answer before anything else does.",
 ["Raising the corrosion inhibitor efficiency quoted on the chemical's datasheet.",
  "Increasing the corrosion allowance that the line was originally built with.",
  "Lowering the in-situ pH so the correction factor falls."],
 "Its words are that the wall shear is above the value at which this module takes the film to be stripped, so the credit is removed and the rate is 4.70 times what the datasheet efficiency would give. The rate, the warning and the summary all say the same thing on that case.")

emit(Q, "/root/wt-fc9-nextgen/tools/course-banks/corrosion/intermediate/fc9i_m04.json", label="fc9i_m04", expect_n=15)
finish()
