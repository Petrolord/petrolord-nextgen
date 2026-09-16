import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Professional m02, the four transmission forms. Digest Section 8 only.

q(1, "On the SOKU trunk the four forms read 66104956.1404, 86864172.0167, 88369202.2673 and 73861363.0502 scfd on identical inputs. What does that spread of 1.336801 establish?",
 "That the disagreement lies inside the published correlations, since the bore, the length, the two pressures, the gravity, the temperature, the compressibility and the efficiency were the same on all four calls.",
 ["That three of the four are being computed incorrectly, because one pipe under one set of conditions carries one rate and four answers cannot all be right about it.",
  "That the efficiency of 1.000000 is too high for this trunk, since a spread of that width closes once each form is run at the efficiency it was fitted at.",
  "That the forms disagree about the elevation term, which is the one part of a transmission form that is not shared between them."],
 "Only the name of the form changed between the four rows. Whatever separates 66104956.1404 scfd from 88369202.2673 scfd is inside the correlations and nowhere else.")

q(3, "Where do Weymouth and Panhandle B sit among the four forms on the SOKU trunk?",
 "Weymouth is the lowest at 66104956.1404 scfd and Panhandle B the highest at 88369202.2673 scfd.",
 ["Weymouth is the lowest at 66104956.1404 scfd and Panhandle A the highest at 86864172.0167 scfd, with Panhandle B between Panhandle A and General Flow at 88369202.2673 scfd.",
  "Weymouth is the highest at 66104956.1404 scfd and Panhandle B the lowest at 88369202.2673 scfd, the ratio column of 1.336801 being read against the largest of the four rather than against Weymouth.",
  "General Flow is the lowest at 73861363.0502 scfd and Panhandle B the highest at 88369202.2673 scfd, Weymouth sitting above General Flow because it carries the largest diameter exponent of the four."],
 "Against Weymouth the column reads 1.000000, 1.314034, 1.336801 and 1.117335, so General Flow is second lowest and Panhandle B is the top of the four.")

q(0, "General Flow returns 73861363.0502 scfd on the SOKU trunk together with a friction factor of 0.0112132010. What can be asked of that answer that cannot be asked of the other three?",
 "What surface the rate was computed for, because the returned factor is the only statement any of the four forms makes about the roughness of the pipe.",
 ["What rate the line would carry at a different efficiency, because the returned factor is what the efficiency multiplies and the other three apply it to the rate directly.",
  "Whether the iteration converged, because the factor is reported alongside a flag the other three have no iteration to produce.",
  "What the equivalent length factor was on the call, because a form that solves for its own friction has to report the length that friction acted over."],
 "A Weymouth or a Panhandle answer carries no roughness at all, so it cannot be interrogated about the pipe it assumed. The factor is a result rather than an input.")

q(2, "The diameter exponent of each form is reported as measured rather than quoted. How was the measurement taken?",
 "The form was asked for a rate at a bore of 10.000000 in and again at 20.000000 in, and the exponent is the base-two logarithm of the ratio of those two engine rates.",
 ["The rate was differentiated against the bore across the published cases, whose bores run from 6.065000 in to 16.000000 in, and the exponent is the slope that fit produces.",
  "The leading constant of each published form was divided out of the SOKU rate, and what remains once the length and the pressures are removed is the diameter term.",
  "Each form was run at the SOKU bore of 11.938000 in and the exponent read off the ratio of that rate to the rate the next form gives on the same bore."],
 "Doubling makes the arithmetic legible, because the ratio across a factor of two in diameter is two raised to the exponent. The constants in front of each form divide out of a ratio.")

q(1, "Which form gains most from a larger bore and which gains least?",
 "Weymouth gains most at 2.6666666667 and Panhandle B least at 2.5300000000.",
 ["Panhandle B gains most at 2.5300000000 and Weymouth least at 2.6666666667, since a form that already returns the highest rate on a given trunk has the most room to grow when the pipe is enlarged.",
  "Panhandle A gains most at 2.6182000000 and General Flow least at 2.5974750199, the two Panhandles bracketing the other pair on this table.",
  "General Flow gains most at 2.5974750199, because it is the only form that resolves its own friction factor and therefore the only one whose response to a bore change is computed rather than fitted."],
 "The exponent is what says how much a bigger pipe buys. Weymouth carries the largest of the four and Panhandle B the smallest.")

q(3, "Panhandle B returns the highest rate of the four on the SOKU trunk and carries the smallest diameter exponent of the four. Why is that not a contradiction?",
 "The rate a form gives on one line and the way it responds to a change of bore are separate properties of the correlation.",
 ["The exponent is measured at bores of 10.000000 in and 20.000000 in while the rate is quoted at 11.938000 in, and a form's exponent is only defined over the range of bores it was measured across.",
  "The exponent describes how the rate responds to length rather than to bore, so a form can carry the smallest exponent of the four and still return the largest rate on a trunk of 32.000000 miles.",
  "The efficiency of 1.000000 on the SOKU call suppresses the diameter term, so the ordering of the rates on that trunk reflects the leading constants of the four forms alone."],
 "Panhandle B reads 88369202.2673 scfd on this trunk and carries 2.5300000000. One is where the form starts and the other is how fast it climbs.")

q(0, "At a bore of 10.000000 in Panhandle B reads 56450013.6000 scfd against Panhandle A's 54628394.3526 scfd. At 20.000000 in the two read 326039290.8986 and 335409354.2407 scfd. What does that pair of rows show?",
 "That which of the two Panhandles is higher is a question about the bore rather than a fact about the forms, because the higher exponent overtakes the higher starting point somewhere between those two sizes.",
 ["That Panhandle B loses accuracy above 10.000000 in, which is why its published cases in this package stop at a bore of 16.000000 in and the crossing is outside the range either form was fitted for.",
  "That the two forms are the same correlation stated at two bores, the apparent crossing being the point at which the published constant of one is replaced by the constant of the other.",
  "That the exponents were measured on the wrong pair of bores, since an ordering that reverses across the measurement interval cannot be used to derive a single exponent for either form."],
 "Panhandle A carries 2.6182000000 against Panhandle B's 2.5300000000. An ordering established on one bore is an ordering on that bore, and this pair crosses inside the range an ordinary trunk is built at.")

q(2, "General Flow at an efficiency of 0.850000 reads 62616519.4059 scfd and at 0.900000 reads 66364215.5127 scfd. Weymouth at an efficiency of 1.000000 reads 66104956.1404 scfd. What do those three figures show together?",
 "That a form standing above another at equal efficiency can fall below it at a lower one, since General Flow is under the Weymouth figure at 0.850000 and over it at 0.900000.",
 ["That the efficiency is the dominant input of the two forms, since moving General Flow from 0.850000 to 0.900000 shifts it further than the whole gap between the two correlations at equal efficiency.",
  "That General Flow and Weymouth agree at an efficiency somewhere near 0.900000, which is the efficiency at which the two published correlations were fitted to the same data.",
  "That an efficiency below 0.900000 is outside the range General Flow is valid over, which is why its rate there falls under a Weymouth rate computed at full efficiency."],
 "General Flow reads 73861363.0502 scfd against Weymouth's 66104956.1404 scfd at equal efficiency. Two forms at two efficiencies can be ordered any way the efficiencies please, so the efficiency travels with the rate.")

q(1, "The efficiency is held for the literature in this course. What does that status require of a graded gas figure?",
 "That it states the efficiency it was computed at, because the multiplier is linear and no publication in this package stands behind any particular value of it.",
 ["That it is computed at an efficiency of 1.000000, which is the only value the course will grade against and the reason the published cases at 0.950000 and 0.920000 are taught rather than examined.",
  "That it is quoted as a ratio against Weymouth rather than as a rate, since a ratio between two forms at one efficiency is independent of what that efficiency was.",
  "That it carries the friction factor the form settled on, which is the figure that records what was assumed about the pipe when no efficiency can be defended."],
 "Weymouth moves from 56189212.7194 scfd at 0.850000 to 66104956.1404 scfd at 1.000000 on one pipe. A rate quoted without its efficiency is not a reproducible number.")

q(3, "Every published case in this package prints the engine rate and the golden beside it. What does agreement on all four forms prove?",
 "That each form is being computed as published, and nothing about which of them is right.",
 ["That the four forms have been reconciled against one another, since a golden set generated from a single source cannot carry four different answers for one pipe without an inconsistency showing up.",
  "That the spread of 1.336801 between the forms is inside the tolerance the goldens are checked at, which is what allows any of the four to be quoted for this trunk.",
  "That the disagreement between the forms is an artefact of the engine rather than of the correlations, because a golden agreement removes the implementation as a source of it."],
 "An implementation problem is one form drifting away from its own golden. A method disagreement is every form sitting on its own golden and the four still returning different rates.")

q(0, "The published 8.000000 in case at 25.000000 miles is run twice through Weymouth on otherwise identical inputs, at 800.000000 ft of rise and 800.000000 ft of fall. It reads 35264696.4591 scfd and 36855536.7412 scfd. Which is which, and why is the pair in the set?",
 "Climbing gives 35264696.4591 scfd and descending 36855536.7412 scfd, and the pair isolates the elevation term because every other condition on those two rows is identical to the last digit.",
 ["Climbing gives 36855536.7412 scfd and descending 35264696.4591 scfd, a climbing line arriving with more pressure in hand because the column of gas it lifted is returned at the delivery point.",
  "The higher figure is the descending case, and the pair is in the set to show that the elevation term is symmetric, since equal distances up and down move the rate by equal amounts.",
  "The two are the same case computed at two efficiencies, since the published set holds the elevation at 0.000000 ft for every Weymouth row and varies the efficiency instead."],
 "The set moves one thing at a time, which is what lets a reader separate a bore error from a length error from an elevation error. A descent carries more.")

q(2, "A designer runs all four forms and reports their average. What is wrong with that?",
 "The average is a fifth number with no publication behind it, no case it was ever fitted to, and no golden anywhere in this package that it could be checked against.",
 ["The average is weighted wrongly, because General Flow resolves its own friction factor and therefore deserves more weight than the three forms that do not.",
  "The average is defensible only once each form has been run at its own fitted efficiency, and on this trunk all four were run at 1.000000.",
  "The average is a reasonable central estimate but it discards the friction factor of 0.0112132010, which is the only figure on the four answers that can be checked."],
 "Choosing is engineering rather than arithmetic. It is settled by what the line resembles, what the operator has calibrated against, and what a contract names.")

q(1, "What position does General Flow occupy among the four forms on the SOKU trunk?",
 "Second lowest at 1.117335 against Weymouth, and closer to Weymouth than to either Panhandle, so the four forms do not sit evenly spaced across the spread between them.",
 ["Second highest at 1.117335 against Weymouth, standing between the two Panhandles because its measured exponent of 2.5974750199 falls between theirs.",
  "Lowest of the four at 1.117335 against Weymouth, since the iteration it runs converges from below and settles under every form that is evaluated in a single pass.",
  "Highest of the four at 1.117335 against Weymouth, the ratio column being read against Panhandle B as the reference rather than against Weymouth."],
 "General Flow sits nearer the bottom of the four than the top. It stands about a third of the way from Weymouth to Panhandle B rather than halfway between them.")

q(0, "A reviewer takes the exponent of 2.6666666667 and uses it to scale a Panhandle B answer to a larger bore. What has gone wrong?",
 "An exponent belongs to the correlation that carries it, and on this table the spread across the four is wide enough to reverse an ordering between two of them.",
 ["Nothing has gone wrong arithmetically, but the result should be quoted against Weymouth rather than against Panhandle B, since 2.6666666667 is the Weymouth exponent and the ratio column is indexed on that form.",
  "The exponent was measured by doubling from 10.000000 in to 20.000000 in, so it may only be applied to a bore change of exactly that factor and not to an arbitrary one.",
  "An exponent describes the pipe rather than the form, so the error is in applying a figure measured on one trunk to a bore the trunk does not have."],
 "Panhandle B carries 2.5300000000 and Weymouth 2.6666666667. An exponent is a property of a correlation and never of a pipe.")

q(3, "One published case runs 16.000000 in over 80.000000 miles from 700.000000 psia to 650.000000 psia at an efficiency of 0.920000. What makes it a useful member of the set?",
 "It is the longest and widest case, and its two pressures are the closest together of any in the set, so a small driving group and a large pipe are read together on one row of the set.",
 ["It is the only case in the set carrying an elevation change, which is what lets the shared elevation term be separated from the four forms' differing friction treatments across a single row.",
  "It is the only case run at an efficiency other than 1.000000, so it is where the linear multiplier can be checked against a form's own golden without a second variable moving.",
  "It is the case whose engine value and golden agree most closely across all four forms, which is why the set is anchored on it and the shorter cases read against it."],
 "Bores in the set run from 6.065000 in to 16.000000 in and lengths from 10.000000 to 80.000000 miles, so a reader can separate a bore error from a length error.")

emit(Q, '/root/fc-wip-linesizing/banks/fc2i_m02.json', expect_n=15)
finish()
