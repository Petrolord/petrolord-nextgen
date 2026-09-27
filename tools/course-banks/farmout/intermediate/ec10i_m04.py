import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Professional m04, Break-Even Promote and Chance.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene Deep deal or a stated golden input, and every key was re-run through
# the vendored engine by the writer's witness. Every break-even names its term
# and its position. A listed breakpoint below the stated-deal minimum is never
# offered as a deal. deal-ekene-bonus-zero is not keyed (BANKNOTES). No capstone
# name, term, series or value.

EK = "(chance of success 25.000000 percent; a success-case value of 271250337.041807; wells of 46000000.000000 on a success and 40000000.000000 dry under a 44000000.000000 gross-cost cap, \"post-deal-interests\"; FIN earning 30.000000 percent with a 2000000.000000 bonus and a 3600000.000000 reimbursement; fees 392000.000000)"

q(0, "Keep every Ekene Deep term except the share FIN pays: 30.000000 percent earned from EKO, a 25.000000 percent chance, a 271250337.041807 success-case value, the 44000000.000000 gross-cost cap, the 2000000.000000 bonus, the 3600000.000000 reimbursement and 392000.000000 of fees. The deal asks 40.000000 percent. What is FIN's break-even promote?",
 "35.594574 percent paid, a promote of 5.594574 points",
 ["40.000000 percent, the share the deal asks",
  "30.000000 percent, the earned interest",
  "35.960428 percent paid, the break-even share the engine solves on the same deal under the farmor-side overrun rule"],
 "The engine's reason reads \"break-even promote: FIN's EMV is 0 when it pays 35.594574% of the well for 30% (a promote of 5.594574 points)\". The deal asks 40.000000 percent, above it, so FIN declines. 30.000000 is the earned interest, where FIN's EMV is still positive. 35.960428 belongs to the restated deal with the \"farmor-side\" rule.")

q(2, "Between which two breakpoints does the engine interpolate FIN's break-even on the Ekene Deep deal (FIN earning 30.000000 percent of EKO's 70.000000, chance 25.000000 percent, gross-cost cap 44000000.000000), and what is FIN's EMV at each?",
 "30.000000: 2293775.278136; 70.000000: -14106224.721864",
 ["30.000000: -1806224.721864; 70.000000: -14106224.721864",
  "40.000000: -1806224.721864; 70.000000: 0.000000, the second point being where the line meets zero",
  "30.000000: 2293775.278136; 40.000000: -1806224.721864, the asked share being the second breakpoint"],
 "The breakpoints are the earned interest and the farmor's whole interest: at 30.000000 percent paid FIN's EMV is 2293775.278136 and at 70.000000 it is -14106224.721864 (engine). The EMV is a straight line between them, crossing 0 at 35.594574. -1806224.721864 is FIN's EMV at the 40.000000 the deal asks, which is a point on the line and no breakpoint.")

q(3, "Which sentence is the engine's own basis for the break-even promote?",
 "the largest share of the well cost the farminee can pay with its EMV at or above 0: exact, EMV being linear in the share between the breakpoints",
 ["a bisection on the share paid to a stated tolerance, stopping where the EMV changes sign",
  "the share at which the farmor's EMV after the farm-out equals its EMV alone",
  "the smallest share the farminee can pay with its EMV at 0 or below"],
 "The engine's basis reads \"the largest share of the well cost the farminee can pay with its EMV at or above 0: exact, EMV being linear in the share between the breakpoints (the earned interest, the farmor's interest, and each outcome's carry reaching a carry-amount cap)\". No bisection is needed: the EMV is linear on each segment. The break-even promote is the farminee's, and it is the largest acceptable share.")

q(1, "FIN's break-even on the Ekene Deep deal (earning 30.000000 percent, asked 40.000000, chance 25.000000) is a share paid of 35.594574 percent of the well. As a promote ratio, what is that?",
 "1.186486, the break-even share over the 30.000000 held",
 ["1.333333, the ratio of the 40.000000 percent the deal asks over the interest held after the event",
  "1.184239, the ratio at the break-even under a carry-amount cap",
  "5.594574, the break-even in points"],
 "The engine returns the break-even share 35.594574 percent, a promote of 5.594574 points and a ratio of 1.186486 (35.594574 over 30). 1.333333 is the ratio the deal asks. 5.594574 is the break-even promote in points, a different measure of the same point. 1.184239 belongs to the deal restated with a carry-amount cap.")

q(3, "Hold FIN at the asked 40.000000 percent for 30.000000 on the Ekene Deep terms, where its position pays 57575101.112542 on a success and -21600000.000000 on a dry hole. Which chance of success would bring its EMV to 0?",
 "27.281304 percent, above the stated 25.000000",
 ["25.000000 percent, the chance the deal states, at which the EMV is already 0",
  "15.080094 percent, the chance at which EKO's EMV alone reaches 0",
  "6.377457 percent, which is the chance at which EKO's EMV after the farm-out reaches 0"],
 "The engine's reason reads \"FIN: EMV is 0 at a chance of success of 27.281304%\". The deal asks FIN for a chance above the stated 25.000000 percent, which is why its EMV is below 0. 15.080094 and 6.377457 are EKO's break-even chances alone and after the farm-out: every break-even chance belongs to a named position.")

q(0, "EKO's Ekene position pays 157675235.929265 on a success and -28000000.000000 dry when it drills alone, and 99708134.816723 and -6792000.000000 after the farm-out. Which break-even chances does the engine report for those two positions?",
 "15.080094 percent alone and 6.377457 percent after the farm-out",
 ["27.281304 percent alone and 15.080094 percent after the farm-out",
  "6.377457 percent alone and 15.080094 percent after",
  "15.080094 percent in both positions"],
 "The engine's reasons read \"EKO alone: EMV is 0 at a chance of success of 15.080094%\" and \"EKO after the farm-out: EMV is 0 at a chance of success of 6.377457%\". The farm-out lowers the chance the farmor needs: the carry, bonus and reimbursement cut its dry-hole loss. 27.281304 is FIN's break-even chance.")

q(1, "With the Ekene carry capped at 3000000.000000 in place of the gross-cost cap, FIN's EMV line has breakpoints at 36.521739 and 37.500000 as well as at its ends, 30.000000 and 70.000000. What sets the two in the middle?",
 "Each outcome's carry reaching the 3000000.000000 cap",
 ["The two chances of success of the deal's outcomes, one breakpoint set by each",
  "The shares at which EKO's EMV after the farm-out equals its EMV alone on each outcome",
  "The shares at which FIN's EMV on each outcome crosses 0 before the cap applies"],
 "The engine's basis names the breakpoints: \"the earned interest, the farmor's interest, and each outcome's carry reaching a carry-amount cap\". Once an outcome's carry reaches the cap FIN pays no more carry on it, so the EMV line bends; past both it is flat at -706224.721864. FIN's break-even on this deal is 35.527169 percent, a promote of 5.527169 points.")

q(2, "The course's stated case deal-negative-without-promote asks a farminee N for 50.000000 percent of a well to earn 40.000000 percent from a farmor holding 100 percent. The engine's break-even status is \"negative-without-promote\". What does its reason say?",
 "break-even promote: none; paying only its 40% share (no promote) N's EMV is -320000, below 0",
 ["break-even promote: none up to the farmor's whole 100% share; paying it, N's EMV is 1280000, above 0",
  "break-even promote: N's EMV is 0 when it pays 40% of the well for 40% (a promote of 0 points)",
  "A refusal, since a deal with no break-even cannot be valued"],
 "The engine's reason for this case is \"break-even promote: none; paying only its 40% share (no promote) N's EMV is -320000, below 0\": even heads up the farminee loses, so no promote can be paid. The \"none up to the farmor's whole 100% share\" reason is the opposite status, \"positive-at-farmor-share\". A break-even that does not exist is a result with a reason, which is no refusal.")

q(2, "On the stated case deal-promote-exactly-break-even the share asked, 50.000000 percent for 40.000000, is exactly the farminee's break-even share. What does the engine report for the farminee?",
 "An EMV of 0.000000 and a tie between farm in and decline",
 ["An EMV of 0.000000 and \"farm in\", since a tie goes to the deal",
  "An EMV of 0.000000 and \"decline\", as 0 is not above 0",
  "A refusal: a share at the break-even is refused"],
 "The engine's EMV basis says \"ties are reported\": at the break-even the farminee's EMV is 0.000000 and both farm in and decline are listed, and the farmor's drill alone and farm out tie as well. The engine breaks no tie on the caller's behalf. Half a point more (deal-promote-just-above-break-even) and the farminee declines.")

q(3, "The stated case deal-promote-just-above-break-even asks the farminee for 50.500000 percent to earn 40.000000, half a point above the break-even share of the case beside it. What does the engine return?",
 "The farminee declines; the break-even share is still 50.000000",
 ["A tie between farm in and decline, as at the break-even itself, since half a point is inside the tolerance",
  "The farminee farms in; the break-even moves to 50.500000",
  "A refusal naming 50 as the largest share"],
 "On deal-promote-just-above-break-even the engine returns the break-even share 50.000000 (a promote of 10.000000 points, ratio 1.250000) and the farminee's best action \"decline\": any share above the break-even gives an EMV below 0. The break-even is a property of the terms other than the share asked, so asking more does not move it, and the engine refuses no share above the break-even.")

q(0, "On the Penn State EME 801 figures stated as a deal (deal-psu-eme801: a 100 percent owner, a success-case value of 750000.000000, a well of 250000.000000, the incoming party paying the whole well to earn 93.333333 percent at a chance of 35.000000), the owner's farm-out position pays 0.000000 on a dry hole. What break-even chance does the engine report for it?",
 "None: the status is \"never-negative\"",
 ["33.333333 percent, the chance at which its EMV reaches 0",
  "0.000000 percent, the chance at which its dry-hole payoff applies",
  "35.714286 percent, the incoming party's break-even chance"],
 "The engine's reason reads \"YOU after the farm-out: EMV is at or above 0 at every chance of success (the dry hole is not a loss)\". With both payoffs at or above 0 no chance makes the EMV negative, so there is no break-even chance. 33.333333 is the owner's break-even chance drilling alone and 35.714286 is the incoming party's.")

q(1, "Turn to the incoming party of that Penn State problem, which pays the whole 250000.000000 well for 93.333333 percent at a producer chance of 35.000000. Which break-evens does the engine return for it?",
 "It breaks even paying 98.000000 percent of the well, and at a chance of 35.714286 percent; the page prints neither figure",
 ["It breaks even paying 100.000000 percent, the share asked, where its EMV is exactly 0.000000",
  "It breaks even at 93.333333 percent paid, its earned interest, and at the 35.000000 percent stated",
  "Its EMV of 17500.000000 is above 0, so it has no break-even"],
 "The engine returns a break-even share of 98.000000 percent for 93.333333 (a promote of 4.666667 points, ratio 1.050000) and a break-even chance of 35.714286 percent for the incoming party. The page prints its EMVs, 12500.000000 and 17500.000000, which are the owner's; it prints no break-even. At the 100.000000 percent asked the incoming party's EMV is -5000.000000, below 0.")

q(3, "The Ekene Deep deal is restated with the overrun rule \"farmor-side\" (FIN earning 30.000000 percent under a 44000000.000000 gross-cost cap, success well 46000000.000000, dry hole 40000000.000000, chance 25.000000 percent). Its breakpoint table lists 30.000000 and 70.000000, and the solved break-even is 35.960428 percent. What is the listed 30.000000?",
 "A point on the EMV line: a deal stated at 30.000000 is refused, the smallest share being 31.363636",
 ["A deal FIN can sign at no promote, the best share for it on these terms and one the engine accepts",
  "The break-even share of EKO, since the table lists one breakpoint for each side of the deal",
  "The share at which the carry is 0, the smallest share the engine accepts under this rule"],
 "The engine rolls the EMV back at the earned interest to draw its line, and that point can sit below the smallest share a stated deal may carry. On these terms any share below 31.363636 leaves a carry below 0 on the success well, and the deal call refuses it by name. The solved break-even, 35.960428, is above it. The table is FIN's alone, and the carry is 0 at 31.363636.")

q(0, "How does the engine solve the chance of success at which a named position's EMV is 0? Pick its basis as it prints it.",
 "EMV is linear in the chance of success: p* = -dry / (success - dry) when success and dry hole have opposite signs",
 ["the chance is found by bisection between 0 and 100 to a stated tolerance",
  "the chance at which the farmor's and the farminee's EMVs are equal",
  "p* = success / (success - dry), the success payoff's share of the spread between the two payoffs"],
 "The engine's basis reads \"EMV is linear in the chance of success: p* = -dry / (success - dry) when success and dry hole have opposite signs; with both at or above 0 the EMV is never negative, with both at or below 0 never positive\". On FIN's Ekene position, 21600000.000000 over 57575101.112542 plus 21600000.000000 gives 27.281304 percent. No bisection is used, and the other formula weights the wrong payoff.")

q(2, "On deal-break-even-at-farmor-share, N pays the farmor's whole share, 100.000000 percent of the well, for 40.000000 at a chance of 50.000000 percent, and its EMV there is exactly 0. How is the break-even reported?",
 "\"solved\" at 100.000000, a promote of 60.000000 points",
 ["\"positive-at-farmor-share\", since the EMV at the farmor's whole share is not below 0",
  "\"negative-without-promote\", since N earns less than it pays for",
  "No break-even: the line never crosses 0"],
 "The engine reports \"solved\" at 100.000000 percent, a promote of 60.000000 points and a ratio of 2.500000: its reason reads \"break-even promote: N's EMV is 0 when it pays 100% of the well for 40% (a promote of 60 points)\". An EMV of exactly 0 at the farmor's whole share is the break-even. \"positive-at-farmor-share\" needs an EMV above 0 there.")

emit(Q, '/root/cat-wip-farmout/banks/ec10i_m04.json', expect_n=15)
finish()
