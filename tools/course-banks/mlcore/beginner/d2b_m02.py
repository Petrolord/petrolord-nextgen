import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Associate m02, Data the Model Has Not Seen.
# Sources: digest sections 3 (the split refusals), 4 (a split by rows and a
# split by whole wells, the seed table), 5 (the sorted names, the shuffle, the
# test size and its whole-number rule), 9 (the well offsets, for why the unit
# is a well) and 26 (the word "test"). Every figure is printed there.

q(1, "`randomRowSplit` runs on the 270 sonic rows at test fraction 0.3 and seed 5. How many of the nine sonic wells end up with rows on both sides of the split?",
 "All 9: every well that gives random-row test rows also trains the model.",
 ["None of them, since a split is built so that no well can ever land on both of its sides.",
  "Three, the same three wells that the whole-well split holds out at this seed and fraction.",
  "Six, the wells that the whole-well split trains on, since only they have rows to spare."],
 "The 81 random-row test rows come from all 9 wells, and each of those wells also trains the model: the engine's `sharedGroups` lists all nine. None on both sides is the whole-well split's figure, and three is the number of wells that split holds out."),

q(3, "At test fraction 0.3 and seed 5, which wells does `groupSplit` hold out of the nine sonic wells?",
 "EKENE-4, EKENE-5 and EKENE-8, 90 rows, leaving six wells and 180 rows to train.",
 ["EKENE-2, EKENE-7 and EKENE-8, 90 rows; the other six wells train the model on 180 rows.",
  "EKENE-8, EKENE-4, EKENE-5 and EKENE-2, the first four names of the shuffled order at seed 5.",
  "EKENE-1, EKENE-10 and EKENE-2, the first three names of the sorted list before any shuffle."],
 "At seed 5 the shuffled order begins EKENE-8, EKENE-4, EKENE-5, and the first three are the test wells: 90 rows, with EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-7 and EKENE-9 training on 180. EKENE-2, EKENE-7 and EKENE-8 is the draw at seed 1. The test size is ceil(0.3 x 9) = 3 wells, so a fourth name is not held out, and the sorted list is only the starting point of the shuffle."),

q(0, "At the same fraction 0.3, `randomRowSplit` holds out 81 of the 270 sonic rows while `groupSplit` holds out 90. Why do the two counts differ?",
 "The row split takes ceil(0.3 x 270) = 81 rows; the well split takes ceil(0.3 x 9) = 3 wells, and every row of each goes with it.",
 ["The well split rounds its test size up to the next ten rows so that every test well can stay whole.",
  "The row split drops the rows it finds on both sides, which takes 9 rows out of its test set.",
  "Each split draws its own fraction near 0.3 from the seed, so the two sizes land apart by chance."],
 "Both splits use the same rule, ceil(testFraction x count). The row split counts rows and holds out 81. The well split counts wells, holds out 3 of the 9, and takes all 90 of their rows with them. No rounding to tens is involved, nothing is dropped, and the fraction is stated: the seed decides which rows or wells, never how many."),

q(2, "What does the engine's basis say `randomRowSplit` is for?",
 "Demonstrating leakage only; to score a model it points to a split by whole wells.",
 ["Scoring a model quickly whenever a field has too few wells for a split by whole wells to work.",
  "Balancing test rows across the wells, so that each well is tested in proportion to its size.",
  "A stand-in for `groupSplit` wherever a seed must repeat."],
 "The engine's own words are: \"leakage demonstration only: rows of one well can fall on both sides (sharedGroups); use groupSplit or groupKFold to score a model\". The function exists so you can see what happens when rows of one well sit on both sides. Both splits are seeded and repeatable, and nothing in the basis offers the row split as a scoring tool for a field with few wells."),

q(2, "A report says a model scored an RMSE on its \"test\" rows and names no split. In this course, what does the word promise?",
 "Rows the model was not fitted on, held out as whole wells.",
 ["Rows set aside at random, one at a time, across every well of the field.",
  "The rows with the largest residuals, kept back to check the fit where it is weakest.",
  "Any check of a model at all, a score on the rows it was fitted on included."],
 "The course legislates the word: a test row is a row the model was not fitted on, and a test set is a whole well held out unless the text names a random-row split. Rows picked at random must be named as a random-row split. Rows chosen by their residuals were chosen after a fit, and a score on the fitting rows is a training score."),

q(0, "Why does this course hold out whole wells when it builds a test set?",
 "Each well carries its own sonic offset on every row, so a row from a training well shares what the model has already met.",
 ["Wells are the only unit the engine's splitting functions accept, because a row carries no name.",
  "A single row is too short for least squares to score, since RMSE needs 30 rows before it is defined.",
  "Whole wells hold out more rows at the same fraction, and the course wants as large a test set as it can possibly get from nine wells."],
 "Each Ekene well adds its own offset to every DT sample, so the rows of a well sit above or below the others as a block. A row from a training well is barely new. A new well brings its own offset, and holding out whole wells asks that question. `randomRowSplit` takes a row count, RMSE has no 30-row minimum, and the 90 against 81 difference is a matter of rounding a count of wells."),

q(3, "A model has no feature that identifies a well. How does a random-row test score compare with a whole-well test score, both split from the same 270 sonic rows?",
 "It can come out on either side as the draw falls; with no such feature neither direction is assured.",
 ["It comes out lower on every draw, since a random-row split always lets the model meet each well's offset.",
  "It comes out higher on every draw, since a random-row test set is smaller and so carries larger misses.",
  "The two come out identical, since both splits hold out the same fraction of the 270 sonic rows."],
 "If a feature lets the model recognise a well, it can learn each well's offset from the training rows and meet it again in the random-row test rows. If nothing identifies a well, there is no such path, and the random-row score can land on either side of a whole-well score. Whichever way its number moves, it is never the honest estimate for a new well. The two splits also hold out different rows, 81 against 90."),

q(1, "At fraction 0.3, seed 2 holds out EKENE-1, EKENE-5 and EKENE-9, and seed 5 holds out EKENE-4, EKENE-5 and EKENE-8. What does that say about the seed?",
 "It fixes which wells are drawn and nothing else; a score on one set is a score on those wells.",
 ["Seed 5 is the right draw, since it is the teaching split that this tier measures everything on.",
  "Seed 2 is the fairer draw, as its wells spread further through the sorted names.",
  "EKENE-5 must be the hardest well to predict, because two different seeds both chose to hold it out."],
 "A seed fixes the draw and nothing else. Each set of test wells is a fair draw and none is the right one; the teaching split is simply the one the course states and quotes. Any other seed holds out another set and gives another score. The shuffle knows nothing of a well's difficulty, so a well drawn twice says nothing about how hard it is to predict."),

q(0, "Why does EKENE-10 sit second in the engine's sorted list of the nine sonic wells, ahead of EKENE-2?",
 "Names sort by UTF-16 code unit, character by character, and the character 1 comes before the character 2.",
 ["The engine reads the number inside each name and sorts by it, after a first pass on name length.",
  "The list is sorted by top depth, and EKENE-10's first sample lies shallower than EKENE-2's.",
  "Wells are listed in the order they were drilled, as the field's table of wells records against each of the names."],
 "String names sort by UTF-16 code unit, so EKENE-10 comes before EKENE-2 because 1 comes before 2. The engine does not read the number inside a name. Top depth plays no part, and EKENE-10's top at 8304 ft is the deepest in the table anyway. No drilling order is recorded."),

q(3, "In the seed 5 shuffle of the nine sonic wells, the draw at i = 2 is u = 0.720102. What happens at that step?",
 "j = floor(u x 3) = 2, so EKENE-5 swaps with itself and the order stays as it was.",
 ["j = 3, so EKENE-5 swaps with the name at position 3 and moves one place towards the end of the list.",
  "The draw is thrown away, because a name may not swap with itself, and a fresh u is drawn in its place.",
  "Shuffling stops at this step, because a repeated position shows that the order has already settled."],
 "Fisher-Yates from the end takes j = floor(u x (i + 1)); at i = 2 that is j = 2, and the course's table records EKENE-5 swapping with EKENE-5. A self-swap is allowed and changes nothing. No draw is discarded, and the loop runs on down to i = 1, which swaps EKENE-8 with EKENE-4."),

q(1, "After the shuffle, which rule does `groupSplit` apply to choose its test wells?",
 "The first nTest groups of the shuffled order are the test set, and every row of a group goes with it.",
 ["The last nTest groups of the shuffled order are the test set, so that the first ones can train.",
  "Groups are drawn one at a time until their rows reach the test fraction of the total row count.",
  "Test wells are the nTest groups with the fewest rows, which keeps the training set as large as it can possibly be."],
 "The engine's own words are: \"the first nTest groups of the shuffled order are the test set; every row of a group goes with it\". At seed 5 the order starts EKENE-8, EKENE-4, EKENE-5, and those three are held out. The count of test groups is fixed first by ceil(testFraction x count); row counts and group sizes play no part in which groups are chosen."),

q(2, "`groupSplit` is given 25 groups at fraction 0.28. In float, 0.28 x 25 comes out as 7 plus 8.88e-16. How many groups does it hold out?",
 "7, because a product within 1.00e-9 of a whole number is taken as that number before the ceiling.",
 ["8, since the ceiling of anything even a hair above 7 is 8, and the engine applies it exactly as written.",
  "6, as the engine rounds the product down, so that the training set never loses a whole group to float noise.",
  "Seven groups and part of an eighth, split by rows, so the test share lands on 0.28."],
 "The engine's basis states the rule: \"ceil(testFraction x count), a product within 1e-9 of a whole number taken as that number\". 8.88e-16 is well within 1.00e-9, so the product is taken as 7 and 7 groups are held out; a plain ceiling would have held out 8. The engine does not round down, and a group is always held out whole."),

q(3, "A call to `groupSplit` passes nTestGroups 1 and testFraction 0.3 together. What comes back?",
 "A refusal naming `nTestGroups`, whose message is \"nTestGroups and testFraction cannot both be given\".",
 ["One held-out well, since the number of wells takes precedence over the fraction.",
  "Three test wells, because the fraction takes precedence and the count is ignored.",
  "Four wells in the test set: the one named plus the three the fraction asks for."],
 "Pass one size or the other. Given both, the engine refuses on the field `nTestGroups` in the words quoted, and returns no split. Neither setting takes precedence, and the two are never added together."),

q(0, "`groupSplit` on the nine sonic wells is asked for fraction 0.95. What does the engine return?",
 "A refusal on `testFraction`, because ceil(0.95 x 9) = 9 puts every group in the test set and none is left to train.",
 ["Eight test wells and one training well, since the engine always keeps back one well when it must.",
  "All nine wells as the test set, with nothing trained and every score in the result left empty.",
  "The fraction lowered to 0.3 by the engine, with a note in the basis naming the change it made."],
 "The engine's own words are: \"testFraction puts all 9 groups in the test set (ceil(0.95 x 9) = 9): lower it so at least one group trains\". It changes no setting on your behalf, it does not return an empty split, and it does not quietly hold out fewer wells than the fraction asks for: it refuses and names the field."),

q(1, "What does the engine accept as the seed of a split?",
 "A whole number from 0 to 4294967295; a negative seed is refused on the field `seed`.",
 ["Any number at all, a negative one included, which the engine maps into its range first.",
  "Only the seeds 1 to 6, which the course tables for the nine sonic wells.",
  "A text label such as a well name, turned into a number by sorting."],
 "The engine's own words are: \"seed must be a whole number from 0 to 4294967295\", and a negative seed is refused on `seed`. Nothing is mapped into range silently. Seeds 1 to 6 are simply the ones the course prints, and a seed is a number, which the sorting of well names does not produce."),

emit(Q, '/root/dai-wip-mlcore/banks/d2b_m02.json', expect_n=15)
finish()
