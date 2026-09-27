import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Expert m04, Reconciliation. Every numeric or refusal key is a return of
# the vendored engine's reconcile on a golden input (rec-ekene,
# rec-ekene-not-closing, rec-difference-exactly-tolerance,
# rec-difference-above-tolerance, rec-divest-acquire, rec-order-breaks,
# rec-no-production and the reconcile refusals); scratch/bank-advanced/witness.mjs
# recomputes each key. The Ekene movements are synthetic. No capstone figure.

K = [0, 2, 1, 3, 3, 0, 2, 1, 2, 0, 3, 1, 1, 0, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The Ekene field Reserves (synthetic) open the year at 15.200000, 21.000000 and 27.500000 MMbbl. The movements are production 1.1, revisions 0.3, -0.2 and -0.6, transfers 3.4, 5.1 and 6.9, and improved recovery 0.5, 0.8 and 1.2. What computed closing 1P does the engine return?",
 "18.300000",
 ["15.200000, the opening, because a stated closing takes the place of the computed one",
  "25.600000",
  "33.900000, the closing of the high category"],
 "Opening plus movements, category by category: 15.2 less 1.1, plus 0.3, 3.4 and 0.5 gives 18.300000 (engine). The stated closing is a check on the computed one and replaces nothing; 25.600000 and 33.900000 are the computed closings of 2P and 3P.")

# 2
x("Carry the same Ekene movements through to the high category. Where does the 3P close?",
 "33.900000",
 ["27.500000, the opening 3P, since production and revisions offset the additions",
  "25.600000, the 2P closing",
  "38.387162, the arithmetic 3P of the Ekene Reserves aggregation"],
 "27.5 less 1.1, less 0.6, plus 6.9 and 1.2 gives 33.900000 (engine). The movements do not offset one another; 25.600000 is the 2P closing; and 38.387162 is an aggregation figure from a different call, a sum of three projects' high estimates.")

# 3
x("In a Reserves reconciliation, how does the engine apply a production movement?",
 "As one quantity subtracted from the 1P, the 2P and the 3P alike",
 ["From the 1P alone, since production draws on the proved volumes first",
  "In proportion to each category, so the 3P loses the most barrels",
  "From the 2P alone, with the 1P and 3P moved by revisions"],
 "The engine's basis reads that production comes out of every Reserves category alike: one quantity, 1.1 in the Ekene case, is subtracted from 1P, 2P and 3P. That is the engine's stated convention, printed as a reading; no category is spared and nothing is prorated.")

# 4
x("A caller states the Ekene production movement with a low, a best and a high. What does the engine return?",
 "movements[0].low must be left out for production (one quantity applies to every category); got 1",
 ["a result that subtracts each stated figure from its own category",
  "movements[0].quantity must be left out for revisions (state low, best and high); got 1",
  "a result that averages the three figures and subtracts the average from every category"],
 "Production is one quantity for every category, and the engine refuses it stated by category, in its own words. It neither subtracts per category nor averages; the \"left out for revisions\" message is the mirror case, a quantity stated on a movement that takes three figures.")

# 5
x("A Contingent Resources reconciliation carries a production movement. What does the engine return?",
 "a refusal: produced quantities come out of Reserves, and sub-economic production is shown as a revision (PRMS 3.1.3.5)",
 ["a result that subtracts the production from 1C, 2C and 3C alike",
  "a result that moves the production into Reserves as a transfer",
  "a refusal: movements[0].low must be left out for production"],
 "The engine refuses production in Contingent Resources and lists the six movement types it takes there; its message says produced quantities come out of Reserves and that sub-economic production moves from Contingent Resources to production and is shown as a revision (PRMS 3.1.3.5). It subtracts nothing and transfers nothing on its own.")

# 6
x("How does the engine read the sign of a divestments movement?",
 "It is entered positive and subtracted from every category",
 ["It is signed, so a divestment is entered as a negative figure and added",
  "It is entered positive and added, like an acquisition",
  "It is entered as one quantity, like production"],
 "Revisions and transfers are signed; improved recovery, extensions and discoveries and acquisitions are entered positive and added; divestments are entered positive and subtracted. The engine refuses a negative divestment; divestments take a low, a best and a high.")

# 7
x("Suppose a divestment is typed as -1 at 1P to show barrels leaving. How does reconcile answer?",
 "movements[0].low must be a finite number at or above 0; got -1",
 ["a result that adds the -1, since a negative divestment is an acquisition",
  "a result reading the sign as a slip",
  "movements[0].type must be one of \"revisions\", \"transfers\"; got -1"],
 "Divestments are entered positive and subtracted, so a negative figure is refused: movements[0].low must be a finite number at or above 0; got -1. The engine reinterprets no sign; the type message is about an unknown movement type and would name the type.")

# 8
x("On the golden input rec-ekene-not-closing the 2P computed closing differs from the stated one by 0.200000 at a tolerance of 0.001000. What does the engine return?",
 "a result, closes false, with the line: the reconciliation does not close: 2P differs by 0.2 (tolerance 0.001)",
 ["a refusal naming the closing, since a reconciliation that misses is an error in the stated figures",
  "a result, closes true, since 0.2 rounds to 0 at the precision of the stated movements",
  "a result, closes false, with the stated closing replaced by the computed one"],
 "A reconciliation that does not close is a result: the engine names each category that misses and by how much, in its own words. It refuses nothing, rounds nothing away and overwrites no stated figure; the stated closing stays as the check it is.")

# 9
x("When the 2P miss is -0.250000 and the stated tolerance is exactly 0.250000 (rec-difference-exactly-tolerance), is the call closed?",
 "closes true: a difference equal to the tolerance closes",
 ["closes false: the difference must be strictly inside the tolerance",
  "closes false: a negative difference never closes",
  "a refusal: the tolerance must exceed every difference"],
 "The engine's reading is that a difference equal to the tolerance closes, printed as: the reconciliation closes: every category within the stated tolerance 0.25. The alternative it names, equal not closing, is a reading; the sign of the difference does not matter; and nothing is refused.")

# 10
x("Suppose the 2P miss grows to -0.312500 while the stated tolerance stays 0.250000 (golden input rec-difference-above-tolerance). Does the call close?",
 "closes false",
 ["closes true, because the difference is negative and so below the tolerance",
  "closes true, because the tolerance is read as a share of the 2P",
  "a refusal naming the tolerance, since the difference exceeds it"],
 "The size of the difference, 0.312500, is above 0.250000, so the reconciliation does not close (engine, closes false). A negative difference is measured by its size; the tolerance is an absolute figure in the stated unit; and a miss is a result and no error.")

# 11
x("The Ekene reconciliation carries 1.1 of production. What 2P replacement ratio does the engine return?",
 "5.181818",
 ["23.272727, since the replacement ratio is the 2P over the production",
  "5.7, the movements other than production before any division",
  "0.300000, the 1P revision over the production"],
 "The engine divides every movement other than production at 2P (revisions -0.2, transfers 5.1 and improved recovery 0.8, together 5.7) by the production 1.1: 5.181818. 23.272727 is the 2P life index, a different figure; 5.7 is the numerator before the division; 0.300000 is the 1P revision alone.")

# 12
x("The engine's 2P life index on the Ekene reconciliation is 23.272727 years. How is it read?",
 "The closing 2P over the period's production rate, read at the best estimate",
 ["The closing 1P over the period's production, read at the low estimate of the stated closing",
  "The opening 2P over the production, read before the movements",
  "The 2P replacement ratio multiplied by the period in years"],
 "25.600000 over 1.1 a year gives 23.272727 years (engine). The engine states that reading: the life index is read at the best estimate, and the alternative it names is the index at the low estimate. It uses the closing figure, and the replacement ratio is a separate line.")

# 13
x("On the golden input rec-divest-acquire the divestments exceed the additions. What 2P replacement ratio does the engine return?",
 "-0.750000",
 ["0.750000, since the ratio is reported by its size",
  "null, since a divestment period has no ratio",
  "a refusal: the ratio cannot be negative"],
 "Every movement other than production counts, divestments subtracted, so the ratio can fall below 0: -0.750000 (engine). The sign is kept, a figure is printed, and nothing is refused; the ratio is null only when the period carries no production.")

# 14
x("The Ekene reconciliation prints its difference at 2P as 0.000000. Which statement is true of that difference?",
 "It is not exactly 0; it is a floating-point residue of the sums, and the call closes because it lies within the tolerance 0.001000",
 ["It is exactly 0, because the stated closing of 25.600000 was copied from the computed one",
  "It is exactly 0, so the tolerance plays no part in whether the reconciliation closes",
  "It is not exactly 0, so the reconciliation fails to close at the stated tolerance of 0.001000"],
 "A figure that prints as 0.000000 at six decimals is not thereby 0: the engine's difference is a floating-point residue of the sums, and the call closes because every difference is within the stated tolerance 0.001000 (engine, closes true). Printed alike is not equal; the residue is far smaller than the tolerance.")

# 15
x("On rec-order-breaks the computed closing is 13.000000, 12.000000 and 14.000000. What does the engine report about its order?",
 "a result with order breaks true and the line: the computed closing is out of order (1P <= 2P <= 3P fails)",
 ["a refusal, since every closing must be ordered low <= best <= high before the engine returns it",
  "a result that sorts the three categories into order before comparing them with the stated closing figures it was given",
  "a result with order breaks false, since each category was built from the same stated movements"],
 "An out-of-order computed closing is a result: the engine returns order breaks true and prints, in its own words, the computed closing is out of order (1P <= 2P <= 3P fails). The ordering refusal applies to a stated opening; the engine sorts nothing; and stated movements can leave the categories out of order however they were built.")

emit(Q, '/root/cat-wip-prms/banks/ec11a_m04.json', expect_n=15)
finish()
