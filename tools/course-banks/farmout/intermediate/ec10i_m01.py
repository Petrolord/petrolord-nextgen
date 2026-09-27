import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Professional m01, Caps and Overrun Rules.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene fixture or on a stated golden input, and every key was re-run through
# the vendored engine by the writer's witness (scratch/bank-intermediate). Every
# deal term a figure depends on is stated in the prompt. No capstone name, term,
# series or value appears.

q(1, "On the Ekene Deep well (synthetic), EKO holds 70.000000 percent and PA 30.000000. FIN pays 40.000000 percent to earn 30.000000 percent under a gross-cost cap of 44000000.000000, overrun rule \"post-deal-interests\". The success well costs 46000000.000000. What does FIN pay for it?",
 "18200000.000000, which is 39.565217 percent of the gross cost",
 ["18400000.000000, its 40.000000 percent of the whole well, cap ignored",
  "17600000.000000, its promoted share of the capped cost alone",
  "13800000.000000, its held share, the same as PA pays"],
 "The engine's reason reads \"the gross cost exceeds the cap 44000000 by 2000000: the promote applies to 44000000; the excess is paid by the post-deal interests (FIN 30%, EKO 40%); FIN pays 18200000 (39.565217% of the gross cost)\". Running 40 percent over the whole well ignores the cap. Paying nothing of the excess is the other overrun rule, which this deal does not state. 13800000.000000 is PA's payment, its own 30 percent of the well.")

q(3, "Take a stated well of 48000000.000000 against a gross-cost cap of 40000000.000000, the excess paid by the post-deal interests. Before the deal the farmor EKO has 70.000000 percent and PA the rest; the farminee pays 40.000000 percent for 30.000000, with no bonus and no reimbursement. What is EKO's payment?",
 "15200000.000000",
 ["17600000.000000",
  "12000000.000000",
  "14400000.000000"],
 "The engine returns EKO 15200000.000000 under \"post-deal-interests\": on the promoted 40000000.000000 it pays what FIN's 40 percent leaves of its own share, and on the excess of 8000000.000000 it pays its post-deal 40 percent. 17600000.000000 is EKO's payment under \"farmor-side\", where the farmor takes its whole pre-deal share of the excess. 12000000.000000 belongs to a well that stays within the cap, and 14400000.000000 is PA's payment.")

q(0, "Switch that overrun rule to \"farmor-side\" and keep everything else: the 48000000.000000 well, the 40000000.000000 cap, EKO at 70.000000 and PA at 30.000000 percent, and 40.000000 percent paid for 30.000000 earned. Which carry comes back?",
 "1600000.000000, because FIN pays 16000000.000000 against a held share that grew with the excess",
 ["4000000.000000, the carry on the capped cost, which the engine keeps whole whichever overrun rule is stated",
  "0.000000, since under this rule the farmor alone pays everything above the cap",
  "8000000.000000, the excess itself, which the farmor side covers"],
 "The engine returns a carry of 1600000.000000 under \"farmor-side\". The carry is measured against the whole gross cost: FIN pays its promoted 16000000.000000 and nothing of the excess, while its held 30 percent of the gross cost rises to 14400000.000000, so the part of EKO's share it covers shrinks. 4000000.000000 is the carry under \"post-deal-interests\". A carry of 0.000000 on this well needs a share paid of 36 percent, and the excess is a cost, which the engine never reports as a carry.")

q(2, "PA holds 30.000000 percent and is no party to the farm-out, in which FIN earns 30.000000 of EKO's 70.000000 by paying 40.000000 percent of a 48000000.000000 well capped on its gross cost at 40000000.000000. How does PA's payment move between the two overrun rules?",
 "It stays at 14400000.000000 under both rules",
 ["It falls to 12000000.000000 under \"farmor-side\", sparing PA the excess",
  "It is 12000000.000000 under both, the excess met by the two sides",
  "It rises under \"farmor-side\", taking what the farminee sheds"],
 "PA pays its own 30 percent of the gross cost through the canonical partner split, 14400000.000000 under either rule (engine). The overrun rule moves money between the farmor and the farminee only: FIN pays 18400000.000000 or 16000000.000000 and EKO 15200000.000000 or 17600000.000000. 12000000.000000 is PA's share of a well of 40000000.000000, and no rule hands PA any part of the other sides' excess.")

q(2, "A 40000000.000000 well has its carry capped at 2500000.000000. EKO 70.000000 and PA 30.000000 percent before; FIN earns 30.000000 percent paying 40.000000. With no cap the carry would come to 4000000.000000. How much does FIN pay?",
 "14500000.000000: its own held share plus the carry at the cap",
 ["16000000.000000, the uncapped payment, since a cap on the carry never alters what is paid",
  "13500000.000000, the payment left once the capped carry is taken off",
  "12000000.000000, its held share alone, as under a cap of zero"],
 "The engine's reason reads \"the carry 4000000 is held at the cap 2500000; EKO pays the rest of its 40% share; FIN pays 14500000 (36.25% of the gross cost)\". FIN pays its own 12000000.000000 plus the capped carry of 2500000.000000. 16000000.000000 is the uncapped payment, 13500000.000000 is what EKO pays, and 12000000.000000 is the payment under a carry cap of 0.000000.")

q(0, "What cap state is reported when the carry-amount cap on a 40000000.000000 well is stated as 0.000000 (EKO 70.000000, PA 30.000000; the farminee paying 40.000000 percent for 30.000000)?",
 "\"exceeded\", with the carry held at 0.000000 and FIN paying 12000000.000000",
 ["\"exactly\", since carry and cap both come out at 0.000000",
  "\"below\", since nothing can pass a cap set at nothing",
  "A refusal: a cap amount must be above 0, as for a gross-cost cap"],
 "The engine reports \"exceeded\": the carry the promote produces, 4000000.000000, is held at the cap of 0, so FIN pays its own 12000000.000000 and EKO 16000000.000000. The state compares the uncapped carry with the cap, so \"exactly\" would need an uncapped carry of 0. A gross-cost cap of 0 is refused (\"events[0].cap.amount must be a finite number above 0; got 0\"); a carry-amount cap of 0 is accepted.")

q(3, "Suppose the gross cost equals its gross-cost cap: both are 40000000.000000, with the post-deal interests paying any excess. EKO holds 70.000000, PA 30.000000, and FIN pays 40.000000 percent to earn 30.000000. What does the engine report?",
 "\"exactly\", no excess, the split of a cap never reached",
 ["\"exceeded\" with an excess of 0.000000 and the overrun rule applied to nothing",
  "\"below\", because a cap is reached only when a cost goes past it",
  "\"exactly\", with FIN paying 12000000.000000 as the promote stops at the line"],
 "The engine's reason reads \"the gross cost reaches the cap 40000000 exactly: the promote applies to all of it, with no excess\". A cap reached exactly is its own state, and it splits the cost as a cap not reached would: FIN 16000000.000000, EKO 12000000.000000, a carry of 4000000.000000. The promote applies to all of the capped cost, so FIN's payment does not fall to its held share.")

q(1, "In the deal calculator a learner states a gross-cost cap on the first event and sets the overrun rule control to \"not stated\". Which reply does the engine give, in its own words?",
 "events[0].cap.overrunRule must be one of \"post-deal-interests\", \"farmor-side\"; got nothing",
 ["A result with the excess split by the post-deal interests",
  "events[0].cap must be an object { on } with on \"none\", \"gross-cost\" or \"carry-amount\" (no default); got nothing",
  "A result with the excess left unpaid and flagged in a reason"],
 "A gross-cost cap without its overrun rule is refused by name, and the message is the engine's: \"events[0].cap.overrunRule must be one of \"post-deal-interests\", \"farmor-side\"; got nothing\". No rule is supplied for the caller. The message about events[0].cap is the one for an event with no cap at all. No excess is ever left unpaid: the engine refuses before it splits anything.")

q(0, "A carry-amount cap on the first event also carries the overrun rule \"farmor-side\" inside it. How does the engine answer?",
 "A refusal: events[0].cap.overrunRule must be left out when on is \"carry-amount\" (the farmor pays the rest of its own share); got \"farmor-side\"",
 ["A result with the carry held at the cap and any excess paid by the farmor side alone, as the stated rule says",
  "A refusal: events[0].cap.on must be one of \"none\", \"gross-cost\", \"carry-amount\"; got \"farmor-side\"",
  "A result with the rule ignored and noted in the basis, since there is no excess of cost to split"],
 "The message is the engine's own: \"events[0].cap.overrunRule must be left out when on is \"carry-amount\" (the farmor pays the rest of its own share); got \"farmor-side\"\". A carry-amount cap holds the carry and leaves no excess to split, so an overrun rule has nothing to act on and is refused. The engine never drops a stated term silently. The cap.on refusal names an unknown cap type, and \"carry-amount\" is an accepted one.")

q(3, "In the box a learner types a first-event cap of { \"on\": \"none\", \"amount\": 1 }. What comes back?",
 "events[0].cap.amount must be left out when on is \"none\"; got 1",
 ["No cap, with the amount of 1 dropped because a cap of \"none\" draws no line",
  "A gross-cost cap of 1, which every well then exceeds by almost all its cost",
  "events[0].cap.amount must be a finite number above 0; got 1"],
 "The engine refuses the amount by name: \"events[0].cap.amount must be left out when on is \"none\"; got 1\". A cap of \"none\" has no line, so a stated amount beside it is a contradiction and is never dropped silently. The engine does not turn the amount into a gross-cost cap. The \"above 0\" message is the one for a gross-cost cap of 0, and 1 is above 0.")

q(2, "Under \"farmor-side\", with a 48000000.000000 well capped on gross cost at 40000000.000000, EKO 70.000000 and PA 30.000000, FIN is to earn 30.000000 percent by paying just 35 percent. What happens?",
 "Refused, naming 36 as the smallest share, where the carry is 0",
 ["It runs with a carry of -400000",
  "Refused, naming 40 as the smallest share it takes",
  "It runs with the carry clamped to 0.000000 and FIN paying 14400000.000000"],
 "The engine's words: \"events[0].farmineePaysPct must be at or above 36, the share at which the carry is 0 when the farmor side pays the excess: paying 35% of the promoted 40000000 (14000000) against its held 30% of the gross cost 48000000 (14400000) leaves a carry of -400000; got 35\". A negative carry is refused, and the engine clamps nothing to 0. No overrun rule sets a minimum of 40: the promote only has to be 0 or more, which is 30 on this deal.")

q(1, "One point higher, at 36 percent paid on that farmor-side well (48000000.000000 gross, 40000000.000000 cap; EKO 70.000000, PA 30.000000; FIN earning 30.000000), what does the engine return?",
 "FIN pays 14400000.000000 and EKO 19200000.000000; the carry is 0.000000",
 ["Another refusal: a carry of exactly 0 counts as below 0",
  "FIN pays 16000000.000000 and EKO 17600000.000000, a carry of 1600000.000000",
  "FIN pays 12000000.000000 and EKO 21600000.000000, the farmor side paying it all"],
 "At 36 percent the engine accepts the share and returns a carry of 0.000000, with FIN paying 14400000.000000 and EKO 19200000.000000 (engine, the course's boundary case). The boundary is inclusive: a carry of exactly 0 runs and one point below is refused. The 16000000.000000 split belongs to a share of 40 percent. A payment of 12000000.000000 would be 30 percent paid, which this rule refuses.")

q(0, "Restate the Ekene Deep deal (synthetic) with \"farmor-side\": FIN earns 30.000000 percent under a 44000000.000000 gross-cost cap, the success well costing 46000000.000000 and the dry hole 40000000.000000; EKO holds 70.000000 percent and PA 30.000000 before the deal. Which floor for the share paid does the engine name when it refuses a smaller one?",
 "31.363637 percent, rounded up so that the printed floor is accepted",
 ["30.000000 percent, the earned interest, first in the breakpoint table",
  "36.000000 percent, which zeroes the carry on any well above its cap",
  "35.960428 percent, the break-even share, below which it refuses"],
 "The engine refuses 31 and names the floor: \"deal.farmineePaysPct must be at or above 31.363637 (rounded up at the sixth decimal so that it is accepted), the share at which the carry is 0 when the farmor side pays the excess: paying 31% of the promoted 44000000 (13640000) against its held 30% of the success well cost 46000000 (13800000) leaves a carry of -160000; got 31\". The exact floor prints as 31.363636 at six decimals and sits just above it, so the engine prints it rounded up: a share stated as the printed 31.363637 runs. The check runs on both outcomes, and the success well above the cap sets it. 30.000000 is a breakpoint of the EMV line, which a stated deal at that share would fail. 36 is the minimum of a different well. 35.960428 is the solved break-even, a result that sets no minimum.")

q(1, "The Ekene Deep dry hole costs 40000000.000000, under the deal's gross-cost cap of 44000000.000000, with FIN paying 40.000000 percent for 30.000000 and EKO holding 70.000000 before. What cap state and carry does the dry hole get?",
 "\"below\", and a carry of 4000000.000000",
 ["\"exceeded\" and 4400000.000000, as for the success well",
  "\"exactly\" and 4000000.000000, inside the same cap",
  "\"below\" and 4400000.000000, the carry of the cap amount"],
 "The engine splits each outcome's well cost on its own: the dry hole of 40000000.000000 is below the cap of 44000000.000000, so FIN pays 16000000.000000, EKO 12000000.000000 and the carry is 4000000.000000. The success well of 46000000.000000 exceeds it, with a carry of 4400000.000000. \"exactly\" needs a cost equal to the cap.")

q(2, "Which sentence is the engine's own cap rule, as its basis prints it?",
 "gross-cost: the promote applies to the gross cost up to the cap, the excess by the stated overrun rule; carry-amount: the carry is held at the cap and the farmor pays the rest of its own share",
 ["gross-cost: the farminee pays nothing above the cap, which the farmor meets alone; carry-amount: the carry above the cap is paid by the post-deal interests of the parties",
  "gross-cost: the cap limits the farminee's whole outlay, bonus included; carry-amount: the carry is held at the cap and the excess is shared by every licence party",
  "gross-cost and carry-amount caps: both hold the farminee's payment at the cap, the excess split by the participating interests before the deal"],
 "The engine's basis reads \"gross-cost: the promote applies to the gross cost up to the cap, the excess by the stated overrun rule; carry-amount: the carry is held at the cap and the farmor pays the rest of its own share; none: no cap. Every cap, share and interest is a stated input with no default\". The farmor meeting the excess alone is only one of the two stated overrun rules. A cap never covers the bonus, and the other licence parties pay their own interests under every cap.")

emit(Q, '/root/cat-wip-farmout/banks/ec10i_m01.json', expect_n=15)
finish()
