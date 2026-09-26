import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Expert m04, Whole-Tender Evaluation. Every figure is quoted from
# digest.txt: evaluateTender on the well services tender (stages, objects,
# award, exclusions), the award under three settings, the stepped technical
# weight under linear pricing as printed, nobody passing, every opened bid
# rejected (a result) against rankTender's refusal, and the materials tender
# under the two omission rules and the two s.14 readings.

K = [0, 2, 1, 3, 1, 0, 2, 3, 0, 1, 3, 2, 1, 0, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("In what order does evaluateTender chain the stages of a tender?",
 "Technical envelope on every bid, then the commercial envelope of the passing bids only, then the award",
 ["The commercial envelope of every bid first, so the lowest price can be found, then the technical scores",
  "Arithmetic and evaluated costs on every bid at once, then the pass mark, then the combined score",
  "Mandatory checks and prices together, then the award, then the technical scores as a tie-break"],
 "The engine's stages basis: technical envelope (mandatory requirements, then the pass mark), then the commercial envelope of the passing bids only, then the award. A bid that fails the technical envelope never has its price opened, so no stage prices every bid first, and the technical scores are settled before any price is read.")

# 2
x("evaluateTender returns technical and commercial objects for the well services tender. How do they compare with separate calls of technicalEvaluation and evaluatedCosts?",
 "They are the same objects the separate calls return; nothing is recomputed in another way",
 ["The chained objects round every figure to two decimals, the precision an award report prints",
  "They differ in the commercial object, which the chain builds for all six bids, the failed ones included",
  "The chain drops each bid's reasons to keep the one call's output short"],
 "The course checks that the chained technical and commercial objects are the same objects the separate calls return. The engine rounds nothing it returns. The commercial envelope in the chain holds only the passing bids, WS5, WS2, WS1 and WS3, and every reason and exclusion is kept with its stage.")

# 3
x("At the fixture settings (combined, technical weight 0.7, priceMethod lowest-ratio, technicalMethod relative), which bid does evaluateTender award on the well services tender, and with what reason?",
 "WS3, with the reason \"WS3 has the highest combined score\"",
 ["WS5, with the reason that it has the lowest evaluated cost of the passing bids",
  "WS1, since its 82.500000 is the best score of the bids that ask for no weeks of delay",
  "WS3, with the reason that its evaluated cost of 957990.000000 sits nearest the estimate"],
 "The award is WS3 at a combined score of 96.998434, and the engine's reason is \"WS3 has the highest combined score\". WS5 has the lowest evaluated cost, which wins only under a lowest-cost award. WS1 ranks second on the combined score. The should-cost plays no part in the award; WS3's ratio to it is only read afterwards.")

# 4
x("Which bids does evaluateTender list as excluded on the well services tender, and at which stage?",
 "WS4 and WS6, both at the technical stage",
 ["WS4 at the commercial stage, since its price was the lowest quoted, and WS6 at the technical",
  "WS6 alone, at the technical stage, since WS4 is scored and ranked last by combined score",
  "WS2 and WS5 at the commercial stage, for their corrected bill and their misplaced decimal point"],
 "The excluded list is WS4 (technical) and WS6 (technical): WS6 fails the signed-bid-form requirement and is not scored, and WS4 scores 65.000000 against a pass mark of 70, so its price envelope is never opened, although its quoted total of 763200.000000 is the lowest of the six. Arithmetic corrections change a price without excluding the bid, so WS2 and WS5 stay responsive.")

# 5
x("An evaluateTender call on the well services tender states no award basis at all. How does the engine respond?",
 "The refusal \"award must be 'lowest-cost' or 'combined'; there is no default\"",
 ["Combined award, the World Bank default, assumed with a note",
  "Both awards side by side so the learner can pick one afterwards",
  "Lowest-cost award, since s.24(3) of the Public Procurement Act 2007 makes it the default"],
 "The award basis decides everything after the commercial envelope, so it is an input with no default and the engine refuses a call without one, naming the field award. It assumes no basis, returns no pair of awards to choose from, and cites no text that sets a default basis.")

# 6
x("Asked to apply the s.14 content rule inside a combined-score award, what does the whole-tender call do?",
 "A refusal that says s.14 works at the commercial stage of a lowest-cost award, and to state content as a rated criterion with its weight",
 ["A combined award in which each bid's content is added to its technical percentage before ranking",
  "The combined award as usual, with Nigerian content ignored and no mention of it in the reasons",
  "Lowest-cost award instead, since the engine switches the basis whenever content is stated"],
 "In the engine's words: \"nigerianContent applies s.14 at the commercial stage of a lowest-cost award; with award 'combined' state Nigerian content as a rated criterion with its weight instead\". It does not blend content into a score, silently ignore a stated input, or change a stated award basis.")

# 7
x("The well services tender is run through evaluateTender at a stated pass mark of 90. What does the engine return?",
 "Award null and commercial null, with the reason that no bid passed and no commercial envelope is opened",
 ["A refusal naming passMark, since no bid can reach a mark of 90 on this tender and the call cannot finish",
  "An award to WS3, the bid that came nearest the mark, with a note in its reasons saying that it fell short of 90",
  "An award on price alone among all six bids, since the technical stage cleared nobody"],
 "The highest technical percentage is WS3's 85.000000, so nobody passes. The call is well formed, so the engine returns a result: award null, commercial null, reason (verbatim) \"no bid passed the technical envelope; no commercial envelope is opened\". A pass mark from 0 to 100 is accepted. No bid below the mark is awarded, and no price is opened, so price cannot pull a weak technical offer back in.")

# 8
x("The same tender is run with a stated maxWeeks of 5, so every bid that passes the technical envelope is late. What does evaluateTender return?",
 "Award null with the reason \"every opened bid was rejected at the commercial stage\"",
 ["The refusal \"bids has no bid left to score: every bid is rejected\" under the field bids",
  "An award to WS1, the least late of the four at 6 weeks, with the lateness priced",
  "A refusal naming schedule.maxWeeks, since 5 sits below every bid's weeks"],
 "evaluateTender returns a result here: award null and the reason \"every opened bid was rejected at the commercial stage\", with each late bid's exclusion, for example \"WS1: offers completion in 6 weeks, beyond the maximum 5 weeks; the bid is nonresponsive\". The refusal about no bid left to score belongs to rankTender called on its own. Beyond maxWeeks a bid is rejected and is not priced, and a maxWeeks of 5 is a valid input.")

# 9
x("Handed a list in which every bid carries a rejection, which call refuses, and what is its field?",
 "rankTender, under the field bids: every bid is rejected, so none is left to score",
 ["evaluateTender, under award, since it cannot return an award without a bid",
  "Both calls refuse with the same message, since each of them ranks the same bids in the end",
  "Neither: each returns award null with the reason that every bid was rejected"],
 "The refusal \"bids has no bid left to score: every bid is rejected\" is rankTender's alone: asked to rank nothing, it refuses. evaluateTender in the same situation returns a result, award null with a reason, so it does not refuse. A refusal means the inputs must be fixed before the evaluation can run; a null award is an outcome to report.")

# 10
x("After the maxWeeks 5 run, WS1, WS2, WS3 and WS5 carry exclusions at the commercial stage. In this course's vocabulary, were they ever responsive?",
 "Yes after the technical envelope, and no longer once the schedule check rejected them",
 ["Never, since a bid is responsive only when it answers every rule of the invitation in full",
  "They still are, since responsive describes any bid that answered the invitation on time",
  "Only WS1 is, since its 6 weeks sit closest to the maximum of 5"],
 "Responsive names a bid still in the evaluation at that stage: it passed the technical envelope and was not rejected at the commercial stage. The four bids were responsive after the technical envelope and stopped being responsive when each was found nonresponsive for completion beyond 5 weeks. The everyday sense, any bid that answered the invitation, is the one the course sets aside.")

# 11
x("With the bids, scores and evaluated costs fixed, the well services award is run under three settings. Which row does the engine return?",
 "WS3 under lowest-ratio, WS5 under linear, and WS5 under lowest-cost",
 ["Lowest-ratio and linear both give WS3, and lowest-cost gives WS5",
  "Linear gives WS3, while lowest-ratio and lowest-cost both give WS5",
  "Under linear it is WS1; lowest-ratio gives WS3 and lowest-cost WS5"],
 "The engine awards WS3 under lowest-ratio pricing at technical weight 0.7, WS5 under linear pricing at the same weight, and WS5 under a lowest-cost award. Under linear the dearest responsive bid, WS3, scores 0.000000 on price and its combined score falls to 70.000000, so it cannot win at 0.7. WS1 becomes most advantageous under linear pricing only at weights of 0.85 and 0.9 on the stepped table.")

# 12
x("On the materials tender with a lowest-cost award and no content rule, the omission rule is switched to the option named highest. What does the engine return?",
 "An award to MS2, with MS4's inspection priced at 14500.000000, under an option the engine labels as unused by the cited texts",
 ["The award stays with MS4, since the omission rule changes a price and cannot move an award",
  "A refusal, since the course grades only the cited average and the engine accepts nothing else",
  "An award to MS2 at the cited rule, the highest price being the World Bank's method for an omission"],
 "Under 'highest' the engine adds 14500.000000 for MS4's inspection, its evaluated cost becomes 548744.982386 against MS2's 547863.577232, and MS2 is awarded. The engine accepts the option and says in its own basis that it is \"the 'highest' option, which the cited texts do not use; the cited rule is the average of World Bank SPD ITB 34.1\". The cited average gives MS4 at 546244.982386. The course teaches and grades the average only.")

# 13
x("The materials tender is run through evaluateTender with a lowest-cost award and each bid's content, under the relative reading of s.14. What award does the engine return, and what is its reason?",
 "MS2, and the award reason is the s.14 reason itself, readings included",
 ["MS4, the lowest evaluated cost, since s.14 only records the content lead in a note",
  "MS3, the highest content at 86.240876, protected and selected under s.16",
  "MS2, with the reason \"MS2 has the lowest evaluated cost\" after the content lead is priced"],
 "Under the relative reading MS2's lead of 7.960608 percent of MS4's content is at least 5 percent, so s.14 selects MS2, and the award reason is the s.14 reason with its three readings. Under the points reading, 4.541020 percentage points is less than 5 and MS4 stands. MS3 sits 6.445634 percent above the lowest and is outside the s.14 group; s.16 protects it and selects nothing. MS4 keeps the lowest evaluated cost under either reading.")

# 14
x("On the stepped table under linear pricing, at a technical weight of 0.85, what does the engine return?",
 "WS1 is most advantageous; WS5 and WS3 tie and the lower evaluated cost puts WS5 above WS3",
 ["WS5 and WS3 tie for most advantageous, and the earlier receipt time then awards the tender to WS3",
  "WS3 is most advantageous, since at 0.85 its technical lead outweighs its weaker price score",
  "WS5 is most advantageous at 85.000000, ahead of WS3 on the bidder id"],
 "The engine's row for 0.85 is WS1 87.162020, WS2 86.332826, WS5 85.000000, WS3 85.000000, with WS3 ordered by lower evaluated cost: the two tie to twelve significant digits and WS5, at 862141.000000, ranks above WS3. The tie sits at third place, so WS1 is most advantageous. The tie-break is the lower evaluated cost first, before receipt time or bidder id, and WS3 becomes most advantageous only at 0.95.")

# 15
x("On the well services tender the combined score awards WS3 while a lowest-cost award gives WS5. Why do the two differ?",
 "WS3 carries the highest technical percentage and the fourth-lowest evaluated cost, and 0.7 weights the first",
 ["WS3's evaluated cost includes an omission that the combined score leaves out, which lowers the price it is scored on",
  "WS5's schedule adjustment is dropped by the combined score, raising its commercial score",
  "The combined score uses quoted totals, on which WS3's 918000.000000 sits lower"],
 "The engine's own explanation: the combined score weighs the technical percentage at 0.7, and WS3 carries the highest technical percentage (85.000000, St 100.000000) and the fourth-lowest evaluated cost (957990.000000). The combined score uses the same evaluated costs, omission and schedule adjustment included, and never the quoted totals.")

emit(Q, '/root/cat-wip-procurement/banks/sc2a_m04.json', expect_n=15)
finish()
