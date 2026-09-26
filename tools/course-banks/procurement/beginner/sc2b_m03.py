import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Associate m03, Arithmetic Correction.
# Sources: the arithmetic rule in the engine's basis and its citation, the
# correction table for all six well services bids, the two corrected lines and
# their verbatim reasons, the tolerance boundary rows, the quoted total rule,
# the flag on a line with no discrepancy, words against figures, and the
# correctArithmetic refusals. The keyed figures were re-run through the engine
# (scratch/bank-beginner/witness.mjs).

q(3, "WS2 prices 18 days of the coiled tubing spread at 27000.000000 a day and writes the amount as 468000.000000. Which figure stands?",
 "The unit rate stands, and the engine corrects the line amount to 486000.000000 because 18 x 27000 is that figure.",
 ["The written amount, since 468000.000000 is what the bidder signed.",
  "Neither: the line is struck and priced as an omission.",
  "The lower of the two, to protect the company."],
 "The unit rate prevails unless the decimal point in it is obviously misplaced (ITB 35.1(a)), and WS2 declares no such error, so the engine returns \"the unit rate prevails and the amount is corrected to 486000\". Nothing is struck or priced as an omission, and the rule picks the rate whatever its direction.")

q(1, "After its ct-spread line is corrected, what is WS2's corrected total?",
 "867400.000000",
 ["849400.000000, the quoted total, since totals are carried as the bidder wrote them.",
  "486000.000000, the corrected amount of the one line found in discrepancy.",
  "885574.000000, the bid's figure after its deviation and its weeks are added."],
 "The corrected total is the sum of the corrected lines: 849400.000000 plus the 18000.000000 correction on ct-spread gives 867400.000000. The quoted total is what the check replaces, 486000.000000 is one line, and 885574.000000 is WS2's evaluated cost, built later from the corrected price.")

q(0, "WS5 types its acid unit rate as 13.8 on 60 m3 and writes the amount as 82800.000000, declaring the decimal point misplaced. What does the engine do?",
 "The quoted amount governs and the rate is corrected to 1380.000000.",
 ["The unit rate governs, and the acid line is cut to 828, which WS5 must then honour.",
  "WS5 is rejected at the commercial stage for an obvious error in its priced bill.",
  "The acid line is struck and priced at the average."],
 "With decimalMisplaced true on a line in discrepancy, the engine returns \"the quoted amount governs and the unit rate is corrected to 1380\", the amount divided by the quantity. The unit rate rule would have cut the line to 828, which is why the exception exists; the bid is not rejected and nothing is priced as an omission.")

q(2, "What is WS5's arithmetic correction after its acid line is read?",
 "0.000000, so its total stays at 849400.000000",
 ["18000.000000, the same correction that WS2's bill receives on ct-spread.",
  "82800.000000, the full amount of the acid line that the rate replaced.",
  "12741.000000"],
 "When the quoted amount governs, the amount stays and only the unit rate changes, so the corrected total equals the quoted total and the correction is 0.000000. 18000.000000 is WS2's correction, the acid amount is unchanged, and 12741.000000 is WS5's completion-time adjustment, a later term of its evaluated cost.")

q(0, "Who decides that a unit rate's decimal point is obviously misplaced?",
 "The evaluation does, and states it as decimalMisplaced true on the line.",
 ["The engine does, by testing whether the gap is a power of ten.",
  "The bidder's total decides it when the gap exceeds 0.005.",
  "No one; every misplaced point is read as a unit-rate slip."],
 "The flag is an input on the line, set when the evaluation has judged the point misplaced, so the judgement stays visible in the report and a reader can disagree with it. The engine does not guess from the size of the gap, and a gap above the tolerance alone triggers the unit rate rule.")

q(3, "decimalMisplaced is set to true on a line whose quantity is 0. What does the engine return?",
 "A refusal: \"lines[0].quantity must be above 0 when decimalMisplaced is true (the unit rate is corrected as quoted amount / quantity)\".",
 ["A unit rate of zero, since any amount divided across no units is taken as nothing.",
  "The line left as quoted, because a flag on a quantity of 0 changes nothing in the bill.",
  "Silence: the flag is dropped and the unit rate rule applies to the line as usual."],
 "The corrected rate is the quoted amount divided by the quantity, and that division has no meaning at zero, so the engine refuses the line in the words quoted, its own. It sets no rate, leaves nothing silently, and drops no flag.")

q(2, "With a stated tolerance of 0.5, a line reads 1 x 100.5 against a quoted 100. What does the engine return?",
 "No correction: a gap equal to the tolerance is no discrepancy.",
 ["A corrected amount of 100.750000 under the rule that the unit rate prevails.",
  "100.5, since any gap is corrected.",
  "A refusal naming tolerance, because the gap and the tolerance coincide."],
 "The rule reads greater than: a line is in discrepancy when the gap exceeds the tolerance. At a gap of 0.5 and a tolerance of 0.5 the engine returns 100.000000 with rule null. 100.750000 is the corrected amount of the second stated line, 1 x 100.75, whose gap of 0.75 is above the tolerance, and nothing is refused.")

q(1, "When a call states no tolerance, what gap puts a bill line in discrepancy?",
 "Any gap above 0.005, half a cent, an engine convention.",
 ["Any gap of one currency unit or more, as ITB 35.1 sets it.",
  "Any gap at all, because the default tolerance is zero, so every trace of rounding counts.",
  "A gap above 0.5, the tolerance the course states for its boundary test of two lines."],
 "ARITHMETIC_TOLERANCE is 0.005, used when tolerance is left out, and the course names it as an engine convention: no cited text states a tolerance. A tolerance of zero would count binary rounding as an error, and 0.5 is the stated tolerance of one boundary test.")

q(1, "Stated as a test, WS1's lines sum to 943200 but the bid states a total of 940000. What does the engine do?",
 "It takes the lines, so the total is 943200.000000 and the correction 3200.000000.",
 ["Every line is scaled down in proportion so that 940000 stays the bid's price.",
  "A stated total governs the lines beneath it, so 940000 is kept.",
  "It rejects WS1 as nonresponsive for a total that disagrees with its own bill."],
 "The engine's reason is \"the quoted total 940000 differs from the sum of the quoted lines 943200 by more than 0.005; the subtotals prevail\". The corrected total is the sum of the corrected lines, so no line is scaled, the stated total does not govern, and the bid is corrected without rejection.")

q(3, "Stated as a test, 60 m3 at 1380 is quoted as 82800 with decimalMisplaced set to true. How many lines does the engine correct?",
 "None.",
 ["One, since a line flagged as misplaced always has its rate recomputed from the amount.",
  "One, the acid line, which is struck and priced at the average of the other bids.",
  "All six, because a flag on any line sends the whole bill back for correction."],
 "A decimalMisplaced flag on a line with no discrepancy changes nothing: 60 x 1380 is 82800, so the gap is zero and the engine corrects 0 lines. The flag only decides which figure governs when a line is already in discrepancy, and it never touches another line.")

q(0, "Which texts does the course name for the rule that the unit rate prevails?",
 "ITB 35.1 of the SPD for Works, two-envelope (September 2025); the 2007 Act s.31(4) permits it.",
 ["ITB 34.1 of the SPD for Works, two-envelope, and s.32(3) of the Public Procurement Act 2007.",
  "Para 6.29 of the Regulations (Seventh Edition, September 2025), which opens the commercial envelope.",
  "The Guidance on Evaluating Bids and Proposals (February 2025), Annex 3 on comparative scoring."],
 "The engine cites the World Bank SPD Request for Bids, Works, two-envelope (Sep 2025) ITB 35.1(a) and (b), and the Public Procurement Act 2007 s.31(4) permits correction. ITB 34.1 and s.32(3) cover omitted items, para 6.29 the two envelopes, and Annex 3 is a worked combined score.")

q(2, "A bid's amount in words differs from its amount in figures. What does the engine compute for that?",
 "Nothing; ITB 35.1(c) is taught as a concept only.",
 ["Words govern, and the engine corrects the figure to match them.",
  "Figures govern whenever the gap exceeds the tolerance of 0.005.",
  "The lower of the two amounts, which the report then flags."],
 "The engine compares no amount in words against figures; the course names ITB 35.1(c) and grades nothing on it. It has no text field for words at all, so it cannot correct toward either reading, and the tolerance applies only to quantity times unit rate against the quoted amount.")

q(0, "A learner renames a second bill line so that two lines both carry the id mob. What comes back?",
 "A refusal in the engine's words: \"lines[1].id repeats the id 'mob'\".",
 ["Both lines are priced, with the second one renamed to mob-2 by the engine.",
  "The two mob lines are merged into one.",
  "Only the first mob line is kept."],
 "Every correction must name its line, and two lines with one name cannot be told apart in a report, so the engine refuses a repeated id and names the line that repeats it. It renames nothing, merges nothing and drops nothing silently.")

q(1, "WS2 and WS5 both quote 849400.000000. After arithmetic correction, which statement holds?",
 "WS2 stands at 867400.000000 and WS5 stays at 849400.000000.",
 ["Both stand at 849400.000000, as neither correction moves a total.",
  "Both rise to 867400.000000, because each has one line corrected.",
  "WS5 falls to 828 on acid while WS2 keeps its quoted total."],
 "WS2's ct-spread line is corrected by the unit rate rule and its total rises by 18000.000000; WS5's acid line is corrected by the misplaced decimal exception, where the amount governs, so its total does not move. The two bids, level as quoted, part at this stage.")

q(3, "Can an arithmetic correction raise a bid's price?",
 "Yes: WS2's price goes up when its unit rate prevails on ct-spread.",
 ["No, as a correction only removes an error that favoured the bidder.",
  "No, because the rule caps a corrected total at the quoted total.",
  "Only when the bidder asks for it in writing before opening."],
 "Arithmetic correction is no penalty and no gift: it restores what the bid's own rates say. On WS2 it raises the total from 849400.000000 to 867400.000000. No cap on the quoted total exists in the rule, and the bidder's consent is not an input to it.")

emit(Q, '/root/cat-wip-procurement/banks/sc2b_m03.json', expect_n=15)
finish()
