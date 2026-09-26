import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Associate m01, What a Tender Evaluation Decides.
# Sources: the digest's function table, constants and what the engine does not
# do; the sources table with editions and read dates; the Ekene tenders and
# their planted situations; the refusal table (pass mark, weights, price
# method, award basis); what is graded; and the vocabulary table. Every figure
# is printed there, and the keyed figures were re-run through the engine
# (scratch/bank-beginner/witness.mjs).

q(1, "Where does a learner run the practicals of this course?",
 "In the course's own calculator panels, which call the same vendored engine the lessons quote.",
 ["In a Suite tendering app that opens beside the lesson with the Ekene bids already loaded into it.",
  "On a spreadsheet template the learner downloads and fills in by hand.",
  "Against a stored answer sheet the panel looks up by bid code."],
 "This is an engine course with no Suite app: the envelope calculator, the award calculator and the contract calculator each call engines/supplychain/tender.js on the learner's own bids and settings. There is no downloaded template, and the panel computes every figure on the inputs given, so a learner's own bids run as readily as the Ekene ones.")

q(3, "In what order does a two-envelope evaluation take its stages?",
 "Mandatory requirements, the pass mark, the price envelopes of the passing bids, then the award.",
 ["Price envelopes of every bid first, so that the committee can set a pass mark from the spread of prices.",
  "Pass mark first, then the mandatory requirements of the bids that cleared it, and the award last of all.",
  "Both envelopes of each bid at once, with price as one more criterion."],
 "The engine's stages basis reads: technical envelope (mandatory requirements, then the pass mark), then the commercial envelope of the passing bids only, then the award. Opening prices first defeats the purpose of sealing them, a mandatory failure is found before any scoring, and price is never a technical criterion in this process.")

q(0, "WS4 quotes 763200.000000, the lowest total of the six well services bids, and scores 65.000000 against a pass mark of 70. What becomes of its price?",
 "It is never opened, so none of its figures enters a later stage.",
 ["It is opened and ranked first on cost, since a low price outweighs a narrow technical miss of five points.",
  "Its price is held in reserve and opened if the award to a passing bid later falls through for any reason.",
  "It lowers the average that prices WS3's missing nitrogen, although WS4 itself cannot be awarded."],
 "Only passing bids have their commercial envelope opened (World Bank Procurement Regulations para 6.29; Public Procurement Act 2007 s.51(2)). WS4 fails at 65.000000, so its price is never read: it cannot rank on cost, nothing is held in reserve, and its nitrogen line does not reach the average, which uses the other responsive bids only.")

q(2, "Which edition of the World Bank Procurement Regulations for IPF Borrowers does this course read?",
 "The Seventh Edition, September 2025.",
 ["The February 2025 edition, published together with the Guidance on Evaluating Bids and Proposals.",
  "The edition in the Official Gazette of 19 June 2007, which the Nigerian Act adopts by reference.",
  "Whatever edition the tender committee holds, because the engine records no edition in its citations."],
 "The sources table names the Regulations as the Seventh Edition, September 2025, read on 2026-09-26. February 2025 is the edition of the Guidance and of the Goods SPD, the 2007 gazette date belongs to the Public Procurement Act, and the engine's own citation carries the edition as (7th ed.).")

q(2, "The materials tender's criteria name API 5CT and API 6D data sheets. How does the course treat those texts?",
 "It names them by number and quotes none of their text, because they are paid standards.",
 ["Its lessons quote their acceptance limits, which specification is scored against.",
  "The Public Procurement Act 2007 takes their place and sets casing specifications.",
  "Each clause the criteria cite is printed, as for any public text."],
 "Licensed texts are never quoted: the API numbers are named as the bidders' specification and taught by concept. The Public Procurement Act sets no product specification, and the API standards are paid texts, so no clause is printed.")

q(0, "The engine returns WS4 with the status fail-pass-mark and a reason. How does the course describe that outcome?",
 "As a result returned with a reason: WS4 is excluded and the other bids go on.",
 ["A refusal, because the engine declined to open the commercial envelope of the bid.",
  "An error object whose field is passMark.",
  "A hidden warning the panel shows only when asked."],
 "A refusal is an object with error and field, returned when an input is bad, and no result comes back with it. A bid excluded at a stage is a result with its reason beside it, so the course says it was excluded, or returned with the reason. The panel prints every reason in the engine's words.")

q(3, "Which settings does the engine refuse by name when they are missing, saying there is no default?",
 "The pass mark, the technical weight, the price and technical methods, and the award basis.",
 ["Only the pass mark; the technical weight falls back to 0.7, the figure the well services tender states.",
  "The arithmetic tolerance, since 0.005 is never assumed and each bill must carry a tolerance of its own.",
  "The omission rule, since no omitted item can be priced until one is chosen."],
 "The refusal table shows the pass mark, the technical weight, the price and technical methods and the award basis each refused with the words there is no default. The technical weight has no fallback. The tolerance is left out safely, as 0.005 applies when none is stated, and the omission rule defaults to the average of ITB 34.1.")

q(1, "A tender's five criterion weights sum to 99. What does the technical envelope return?",
 "A refusal naming the field criteria: \"criteria weights must sum to 100; they sum to 99\".",
 ["Scores computed with every weight scaled up so the percentages reach 100.",
  "A result scored as given, with the pass mark lowered by one point.",
  "Bids scored after the missing point is added to methodology."],
 "The engine reads weights as percentages and requires a sum of 100 within 1e-9; any other sum is refused with the message quoted, in the engine's own words. It rescales nothing, moves no pass mark and assigns no missing point, since each of those would be a decision the tender never stated.")

q(0, "A learner types mean-deviation as the price method of a combined award. What does the engine return?",
 "A refusal naming priceMethod, since the engine scores price by two named methods only.",
 ["A combined score in which each bid's price is scored by its distance from the mean evaluated cost.",
  "The lowest-ratio score, applied as the method the tender states.",
  "A ranking on the technical percentage alone, with the price dropped."],
 "The engine's message, in its own words, is \"priceMethod must be 'lowest-ratio' or 'linear'; there is no default\". It computes no mean-deviation score, substitutes no method it was not given and never drops a term silently; a refused input returns no ranking at all.")

q(2, "What is true of the bidders WS1 to WS6 and MS1 to MS5?",
 "They are codes in synthetic fixtures written by a stated script.",
 ["Anonymised contractors from an Ekene tender held in 2027, with their real prices kept.",
  "Firms on a national contractor register, renamed so that no bid can be traced back.",
  "Sample bids taken from the World Bank Guidance and moved onto the Ekene wells."],
 "Every Ekene tender, bidder, price and score is synthetic, written for this platform by a stated script that reproduces the files byte for byte, and each file is labelled SYNTHETIC. No real company, tender or price list appears, and the Guidance's worked examples are separate cases the course recomputes on their own.")

q(3, "What makes a figure a gradable answer in this course?",
 "It is a value the engine returns on bids, criteria and settings stated in advance, entered to six decimals.",
 ["A value read from a published worked example, entered to two decimals as the Guidance prints it.",
  "Any figure within a tolerance the learner states when submitting it.",
  "An estimate of what the job will cost, checked against the final account."],
 "Every graded number is a return value of the engine on fixed inputs, so the same inputs give the same number on any machine and each graded figure is quoted to six decimals as the panel prints it. Printed examples round to two decimals, a learner never states a tolerance, and an evaluated cost ranks bids without forecasting the job's cost.")

q(1, "At the commercial stage of the well services tender, which bids are responsive in this course's sense?",
 "WS1, WS2, WS3 and WS5, the four that passed the technical envelope with no rejection.",
 ["All six bids, because every one of them answered the invitation before the closing time.",
  "WS1 to WS5, since WS4 answered every criterion and was scored at 65.000000 like the rest.",
  "Only WS3 and WS5, the two bids that win an award."],
 "Responsive names a bid still in the evaluation at that stage: it passed the technical envelope and was not rejected at the commercial stage. WS6 failed a mandatory requirement and WS4 fell below the pass mark, so neither is responsive there, whatever it answered. Winning an award is a separate matter from staying in the evaluation.")

q(3, "Which sentence uses the term lowest evaluated cost as this course legislates it?",
 "WS5 holds it, at 862141.000000, with omissions at the average and the fixture's schedule.",
 ["WS4 holds it, because 763200.000000 is the lowest total quoted by any of the six well services bids.",
  "WS2 and WS5 share it, each quoting 849400.000000 before correction.",
  "WS1 holds it once its discount of 15000.000000 is deducted."],
 "The lowest evaluated cost is built by the engine from the corrected price, discount, deviations, omissions and schedule, and it is never a quoted price. WS4's price is never opened, WS2 and WS5 part once WS2's bill is corrected, and WS1's figure of 928200.000000 ranks third.")

q(0, "Which figure in the engine is an engine convention that no cited text states?",
 "The arithmetic tolerance of 0.005, half a cent, used when a call states no tolerance.",
 ["Unit rate prevailing over the amount a bidder writes beside it on a line of the bill.",
  "Pricing an item a bid omits at the average of the prices the other responsive bids quote.",
  "Opening a price only after the technical scoring is complete."],
 "The course names the tolerance 0.005 (half a cent) as an engine convention, stated in the basis. The unit rate rule comes from ITB 35.1 of the Works SPD, the average from ITB 34.1, and the two-envelope order from para 6.29 of the Regulations with s.48 and s.51(2) of the Public Procurement Act 2007.")

q(1, "What does every refusal from the engine carry?",
 "An error and the field it refuses, with a message that begins with that field's name.",
 ["A partial result for the valid bids, with any bid holding a bad input dropped without a word.",
  "Defaults put in place of the bad input, with a warning.",
  "Numbered error codes to look up in a table of codes."],
 "Every function returns either a result or an object with error and field, where field names the input refused and the message starts with that name and states the exact condition that failed. The engine drops nothing silently, supplies no default for a refused input, and uses messages with no numbered codes.")

emit(Q, '/root/cat-wip-procurement/banks/sc2b_m01.json', expect_n=15)
finish()
