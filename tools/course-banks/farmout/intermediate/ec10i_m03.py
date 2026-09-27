import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Professional m03, Deal Value to Each Side.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene Deep deal or a stated golden input, and every key was re-run through
# the vendored engine by the writer's witness. Each EMV is quoted with its
# position, chance and payoffs. The golden input deal-ekene-bonus-zero is not
# used: see BANKNOTES-intermediate.md. No capstone name, term, series or value.

q(3, "EKO holds 70.000000 percent of the Ekene Deep prospect (synthetic) and considers drilling alone. At a chance of success of 25.000000 percent its position pays 157675235.929265 on a success and -28000000.000000 on a dry hole. What EMV does the engine roll back for EKO alone?",
 "18418808.982316, the EMV of drilling alone",
 ["19833033.704181, which is the EMV of EKO's position after the farm-out",
  "-1806224.721864, the farminee's EMV",
  "157675235.929265, the success payoff taken as though it were certain"],
 "The engine's reason reads \"EKO alone (70%): success 157675235.93, dry hole -28000000, EMV 18418808.98\", and the field is 18418808.982316: a quarter of the success payoff plus three quarters of the dry-hole payoff. 19833033.704181 is EKO after the farm-out and -1806224.721864 is FIN. Taking the success payoff alone ignores the chance of a dry hole.")

q(1, "After the Ekene Deep farm-out EKO keeps 40.000000 percent of a success-case value of 271250337.041807, pays 14000000.000000 of the success well and 12000000.000000 of the dry hole, receives a cash bonus of 2000000.000000 and a reimbursement of 3600000.000000, and pays assignor fees of 392000.000000. The chance of success is 25.000000 percent. What is its EMV?",
 "19833033.704181, from a success of 99708134.816723 and a dry hole of -6792000.000000",
 ["18418808.982316, the same EMV as drilling alone",
  "19683033.704181, the farmor-side rule's figure",
  "18225033.704181, another stated case's EMV"],
 "The engine returns EKO after the farm-out at 19833033.704181, rolled back from a success of 99708134.816723 and a dry hole of -6792000.000000; its reason reads \"EKO after the farm-out (40%, paying 14000000 of the success well and 12000000 of the dry hole): success 99708134.82, dry hole -6792000, EMV 19833033.7\". The bonus and reimbursement arrive and the fees leave in both outcomes. 18418808.982316 is EKO alone; 19683033.704181 belongs to the \"farmor-side\" overrun rule and 18225033.704181 to another stated case.")

q(0, "FIN is asked to pay 40.000000 percent of the Ekene Deep well (46000000.000000 on a success, 40000000.000000 dry, gross-cost cap 44000000.000000, \"post-deal-interests\") to earn 30.000000 percent of 271250337.041807, plus a bonus of 2000000.000000 and a reimbursement of 3600000.000000, at a chance of 25.000000 percent. What does FIN do?",
 "Decline: its EMV of -1806224.721864 is below 0",
 ["Farm in: a success payoff of 57575101.112542 outweighs a dry-hole loss of -21600000.000000",
  "Farm in: EKO's EMV rises by 1414224.721864, and FIN shares in that rise through its interest",
  "Decline: its dry-hole loss of -21600000.000000 is larger than its whole success payoff"],
 "The engine's reason reads \"FIN (30% for 40% of the well): success 57575101.11, dry hole -21600000, EMV -1806224.72\" and \"EKO: the best action is farm out; FIN: decline\". Declining is worth 0, which beats -1806224.721864. A payoff comparison without the chance is no EMV, and 57575101.112542 is larger than the dry-hole loss. EKO's gain is value moved from FIN.")

q(2, "On the Ekene Deep deal FIN earns 30.000000 percent of a success-case value of 271250337.041807 and, on a success, pays 18200000.000000 of the 46000000.000000 well, 2000000.000000 of cash bonus and 3600000.000000 of reimbursement. What is FIN's success payoff?",
 "57575101.112542, after the well share, bonus and reimbursement",
 ["99708134.816723, EKO's success payoff after the farm-out",
  "-21600000.000000, the dry-hole payoff",
  "the whole 30.000000 percent of 271250337.041807 with no well cost, bonus or reimbursement taken off, as the value alone"],
 "The engine returns FIN's success payoff as 57575101.112542: its 30 percent of the success-case value, scaled by the canonical applyJV, less the 18200000.000000 well share, the bonus and the reimbursement, which fall at the valuation date. 99708134.816723 is EKO's success payoff after the farm-out and -21600000.000000 is FIN's dry-hole payoff. The value alone ignores what FIN pays.")

q(2, "Which best actions does the engine report on the Ekene Deep deal (chance of success 25.000000 percent; FIN paying 40.000000 percent for 30.000000 with a bonus of 2000000.000000, a reimbursement of 3600000.000000 and fees of 392000.000000)?",
 "EKO farms out and FIN declines",
 ["EKO drills alone and FIN declines as well",
  "EKO farms out and FIN farms in on these terms",
  "EKO walks away; FIN declines"],
 "The engine's reason is \"EKO: the best action is farm out; FIN: decline\". EKO's three actions are worth 18418808.982316 (drill alone), 19833033.704181 (farm out) and 0 (walk away), so farming out is best; FIN's farm-in is worth -1806224.721864 against 0 for declining. The best actions are computed separately for each side, which is why the farm-out can be EKO's best action while FIN declines it.")

q(0, "On the Ekene Deep deal, add EKO's EMV after the farm-out (19833033.704181), FIN's EMV (-1806224.721864) and the assignor fees (392000.000000), and compare the sum with EKO's EMV alone (18418808.982316). What does the engine's transfer check report?",
 "They add back to 18418808.982316 to the precision the course prints, the engine's difference being float residue under 0.000001",
 ["They fall short of it by the 392000.000000 of fees",
  "They exceed it by 1414224.721864, the value the deal creates",
  "No comparison: the EMVs rest on different interests"],
 "The engine's basis reads \"farmor alone = farmor after the farm-out + farminee + assignor fees: the deal moves value between the two sides and the fees leave both\". The three add to 18418808.982316, and the engine returns their difference from the farmor alone as float residue under 0.000001 in size, so the identity holds to six decimals. The deal creates no value; 1414224.721864 is what moves to EKO from FIN.")

q(3, "On the Ekene Deep deal (chance 25.000000 percent) EKO's EMV is 18418808.982316 alone and 19833033.704181 after the farm-out, while FIN's is -1806224.721864. How much does EKO's EMV rise, and where does it come from?",
 "1414224.721864, value moved from the farminee to the farmor",
 ["1806224.721864, the farminee's loss taken whole by the farmor, with nothing of it leaving the deal as fees",
  "392000.000000, the assignor fees EKO recovers",
  "0.000000, since a farm-out only moves value"],
 "The rise is 19833033.704181 less 18418808.982316, 1414224.721864 (derived). The transfer identity shows where it comes from: FIN's EMV is -1806224.721864, of which 1414224.721864 goes to EKO and 392000.000000 leaves both sides as fees. A farm-out moves value, so EKO's rise is FIN's loss less the fees, and it is well above 0.")

q(1, "On the Ekene Deep deal (chance of success 25.000000 percent) the carry is 4400000.000000 on a success and 4000000.000000 on a dry hole, the cash bonus 2000000.000000 and the reimbursement 3600000.000000. What expected consideration does the engine report?",
 "9700000.000000",
 ["10000000.000000, the consideration on a success, which the engine reports for both outcomes",
  "4100000.000000, the expected carry, reported as the whole consideration",
  "5600000.000000, the bonus and the reimbursement, which is the value of the transaction"],
 "The engine's expected carry is 4100000.000000 (a quarter of 4400000.000000 and three quarters of 4000000.000000), and with the bonus and the reimbursement the expected consideration is 9700000.000000, or 323333.333333 per percent earned. 10000000.000000 is the consideration on the success well alone. The carry is only one part of it, and 5600000.000000 is the value of the transaction the fixture states for the consent fee.")

q(0, "Restate the Ekene Deep deal with a chance of success of 0.000000 percent and every other term unchanged. What does the engine report for EKO?",
 "\"walk away\", every EMV being its dry-hole payoff",
 ["\"farm out\", since -6792000.000000 is the smallest loss of its three actions and so the best of them",
  "\"drill alone\", the chance only scaling payoffs",
  "A refusal, as a chance of 0 leaves nothing to value"],
 "On deal-ekene-dry-hole every EMV is its dry-hole payoff: EKO alone -28000000.000000, EKO after the farm-out -6792000.000000, FIN -21600000.000000. Walking away is worth 0, which beats both losses, so the engine reports \"walk away\" for EKO and \"decline\" for FIN. A chance of 0 is inside the accepted range of 0 to 100 and is no refusal.")

q(3, "The Ekene Deep deal is restated with a carry-amount cap of 3000000.000000 in place of the gross-cost cap; every other term stays (FIN paying 40.000000 percent for 30.000000, chance 25.000000 percent, bonus 2000000.000000, reimbursement 3600000.000000, fees 392000.000000). What EMVs come back?",
 "-706224.721864 for FIN and 18733033.704181 for EKO after the farm-out",
 ["-1806224.721864 for FIN, as a carry cap moves no value",
  "193775.278136 for FIN, which then farms in",
  "-706224.721864 for FIN and 19833033.704181 for EKO"],
 "On deal-ekene-carry-cap the engine returns FIN -706224.721864 and EKO after the farm-out 18733033.704181, with EKO alone unchanged at 18418808.982316. Holding the carry at 3000000.000000 moves money from EKO to FIN on both outcomes, so FIN's EMV rises and EKO's falls by the same amount; FIN still declines. 19833033.704181 is EKO under the gross-cost cap.")

q(3, "Penn State EME 801, Lesson 6 prints a drill yourself or farm out problem: a producer chance of 35.000000 percent, drilling yourself paying -250000.000000 on a dry hole and 500000.000000 on a producer, farming out paying 0.000000 and 50000.000000. What EMVs does the engine return on those figures as a stated deal?",
 "12500.000000 and 17500.000000",
 ["17500.000000 and 12500.000000, the drill-yourself EMV being the larger of the two",
  "500000.000000 and 17500.000000, the dry-hole cost left out of the drilling EMV",
  "12500.000000 and 50000.000000, the farm-out payoff taken as its own EMV"],
 "On deal-psu-eme801 the engine returns 12500.000000 for drilling yourself and 17500.000000 for farming out, the figures the page prints (text, numbers only; the licence is non-commercial, so the course cites the figures and none of the words). Farming out is the larger EMV. Leaving out the dry hole, or taking a payoff as its EMV, ignores the chance.")

q(0, "Which sentence is the engine's stated timing choice for a deal's EMVs, as its basis prints it?",
 "the success-case value is at the valuation date; well costs, bonus, reimbursement and fees fall at the valuation date, undiscounted",
 ["the success-case value is discounted to first production; well costs fall in the year each is drilled and are discounted at the stated rate",
  "every payment is discounted at the success-case rate from the year it falls in",
  "the bonus and fees fall at signing, discounted"],
 "The engine's basis reads \"the success-case value is at the valuation date; well costs, bonus, reimbursement and fees fall at the valuation date, undiscounted\". It is a stated choice the engine names in its basis: a deal whose costs fell a year later would discount them and give different EMVs, and the course grades no figure that depends on the choice. The other sentences describe timings the engine does not use.")

q(1, "A deal call on the Ekene Deep terms leaves out the assignor fees altogether. How does the engine answer?",
 "deal.assignorFees must be a finite number at or above 0; got nothing",
 ["deal.cashBonus must be a finite number at or above 0; got nothing",
  "A result with the fees taken as 0.000000 and a reason that none were stated",
  "A result with the fees set at seven per cent of the value of the transaction"],
 "The engine's words: \"deal.assignorFees must be a finite number at or above 0; got nothing\". The fees are a deal term with no default: a deal with none states 0. The engine never computes them inside dealValue from a rate; the fee call returns the fee, and the deal states it. The cashBonus message is the one for a bonus left out.")

q(2, "A learner types a chance of success of 101 into the deal calculator's box. What does the engine return?",
 "project.chanceOfSuccessPct must be a number from 0 to 100; got 101",
 ["A result at a chance of 100.000000, every EMV being its success payoff and EKO drilling alone",
  "project.chanceOfSuccessPct must be a number from 0 to 100; got nothing, the value being cleared",
  "A result at the stated 101, with a dry-hole weight of -1 and every EMV above its success payoff"],
 "The engine refuses the chance by name: \"project.chanceOfSuccessPct must be a number from 0 to 100; got 101\". It clamps nothing to 100 and computes no weight below 0. The message ending \"got nothing\" is the one for a chance removed from the box.")

q(1, "On the Ekene Deep deal FIN's position pays 57575101.112542 on a success and -21600000.000000 on a dry hole. At what chance of success does the engine roll back its EMV, and where does that chance come from?",
 "25.000000 percent, a stated input of the deal with no default",
 ["27.281304 percent, the chance at which FIN's EMV is 0",
  "35.000000 percent, the producer chance of the Penn State problem, which the engine applies to every farm-out",
  "25.000000 percent, a chance the engine assigns to every exploration prospect it values"],
 "The chance of success is the fixture's stated term, 25.000000 percent, and the engine's source line lists every chance as a stated input with no default. 27.281304 is FIN's break-even chance, a result. The Penn State chance belongs to that problem alone, and the engine assigns no chance to any prospect.")

emit(Q, '/root/cat-wip-farmout/banks/ec10i_m03.json', expect_n=15)
finish()
