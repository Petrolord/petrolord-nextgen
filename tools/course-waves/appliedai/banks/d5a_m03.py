import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Expert m03, Decomposing the Brier Score. Figures from the course's
# decomposition section (the five terms at 10 bins and their closure, one bin,
# the six stated rows and WBC as Stephenson, Coelho and Jolliffe (2008) label it
# in eq. 7, the bin-edge rule against the library rule, log loss imported from
# the machine learning engine) and the refusal table.

K = [3, 1, 0, 2, 1, 3, 2, 0, 3, 0, 1, 2, 0, 3, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Which identity does the engine close on the Ekene calibration set, and with what terms at 10 bins?",
 "Brier = REL - RES + UNC + WBV - WBC: 0.080032 - 0.064570 + 0.153900 + 0.000689 - 0.001669 = 0.168382",
 ["Brier = REL + RES - UNC, the three classic terms alone: 0.080032 + 0.064570 - 0.153900 leaves the rest to rounding",
  "Brier = REL - RES + UNC: 0.080032 - 0.064570 + 0.153900, which is 0.169362 and matches the score once rounded",
  "Brier = REL - RES + UNC + WBV - 2 WBC, taking the engine's 0.001669 and doubling it before it is subtracted"],
 "The basis states Brier = REL - RES + UNC + WBV - WBC after Stephenson, Coelho and Jolliffe (2008) eq. 7, and the five figures sum to 0.168382, the Brier score, with a closure of -8.33e-17. The three classic terms give 0.169362, which is a different number from 0.168382 at six decimals and does not match. The engine's WBC already carries the paper's factor 2, so doubling it again breaks the identity. Resolution enters with a minus sign and uncertainty with a plus.")

# 2
x("REL - RES + UNC on the Ekene rows at 10 bins is 0.169362, and the Brier score is 0.168382. What accounts for the difference?",
 "The two within-bin terms, WBV and WBC, which the three classic terms leave out",
 ["Rounding in the last bits of a double, which the closure of -8.33e-17 reports",
  "The 17 rows on an interior bin edge, which the classic terms place in the lower bin",
  "Log loss, which the calibration call adds to the classic terms before it reports"],
 "Reliability and resolution treat every row in a bin as if it carried the bin's mean probability. WBV and WBC account for the spread inside each bin, and with them the sum is exactly the Brier score. The closure measures the gap left after all five terms, which is -8.33e-17; the gap here is about a thousandth. The engine's bin rule opens the upper bin for every term, and log loss is a separate figure.")

# 3
x("Uncertainty on the Ekene rows is 0.153900. What sets it, and can a better classifier lower it?",
 "Only the outcomes: base rate x (1 - base rate) = 0.190000 x 0.810000; no classifier can change it",
 ["Bin choice: it is the spread of observed frequencies across bins, so choosing finer bins can lower it",
  "Probability spread: it is their variance, so a classifier that spreads them further lowers it",
  "The worst bin: it is MCE squared, so fixing bin 7 would bring the uncertainty term down"],
 "UNC = base rate (1 - base rate), and the base rate is the share of outcomes that are 1, so the term belongs to the outcomes alone and stays 0.153900 whatever the classifier or the bin count. The spread of observed frequencies around the base rate is resolution. The spread of the probabilities inside bins is WBV. MCE plays no part in the decomposition.")

# 4
x("Every Ekene row is put in one bin. What do reliability and resolution become?",
 "RES is 0.000000 and REL is 0.043806, the squared gap between the mean probability and the base rate",
 ["Both become 0.000000, because a single bin has nothing to compare its rows against",
  "RES becomes 0.153900, the uncertainty, and REL 0.000000, since one bin is calibrated",
  "The call is refused: a decomposition needs at least two bins to separate the rows"],
 "With one bin the observed frequency is the base rate itself, so resolution, the spread of bin frequencies from the base rate, is 0: one bin cannot resolve anything. Reliability becomes (mean probability - base rate)^2 = 0.043806, a test of the average only. The bin count runs from 1 to 100, so one bin is accepted.")

# 5
x("Six stated rows, probabilities 0.61, 0.62, 0.64, 0.66, 0.68 and 0.69 with outcomes 1, 0, 1, 0, 1, 1, all fall in bin 6. Their pooled within-bin covariance is 0.003333. What WBC does the engine return?",
 "0.006667, twice the pooled covariance, as WBC carries the factor 2 of the paper's fifth term",
 ["0.003333, since WBC is the pooled within-bin covariance itself and the identity itself is what doubles it",
  "0.000867, since WBC measures how widely the six stated probabilities spread about their bin mean",
  "The pooled covariance halved, as the six rows are split between two outcomes"],
 "Stephenson, Coelho and Jolliffe (2008) write the fifth term of eq. 7 as -(2/N) sum (y - observed_k)(p - mean p_k) and name it -WBC, so WBC is twice the pooled within-bin covariance: 2 x 0.003333 = 0.006667, the engine's figure, with a closure of 0. Quoting the covariance as WBC is a real wrong method, and the identity then fails to close. 0.000867 is WBV on these rows. Nothing halves the covariance.")

# 6
x("In the engine's identity Brier = REL - RES + UNC + WBV - WBC, where is the factor 2 of Stephenson, Coelho and Jolliffe's eq. 7 fifth term?",
 "Inside WBC: the paper names the whole fifth term -WBC, so WBC is twice the pooled within-bin covariance",
 ["In front of WBC: the engine's identity reads - 2 WBC and applies the 2 to its reported 0.001669 each time",
  "Inside WBV: the fourth term carries it, and WBC is left as the pooled within-bin covariance without any factor",
  "Nowhere at all, because the pooled within-bin covariance never needs a factor for the Brier identity to close"],
 "The line after eq. 7 names the five components BS = REL - RES + UNC + WBV - WBC, and the fifth component written out is -(2/N) sum (y - observed_k)(p - mean p_k), so the 2 belongs to WBC as the paper labels it. The engine's WBC is the paper's, and the identity has no further 2. WBV is sum (p - mean p_k)^2 / N with no factor. Drop the 2 and the identity no longer closes.")

# 7
x("On the six stated rows in bin 6, WBV is 0.000867. What does that term measure?",
 "The spread of the probabilities inside the bin, sum (p - mean p_k)^2 / N",
 ["How far the bin's mean probability, 0.650000, sits from its observed frequency",
  "The covariance of outcomes with probabilities in the bin, before its factor of 2",
  "The spread of the outcomes inside the bin about the observed frequency, 0.666667"],
 "The basis gives WBV = sum (p - mean p_k)^2 / N, the within-bin variance of the probabilities; on the six rows the squared deviations from 0.650000 give 0.000867. The distance of a bin's mean probability from its observed frequency is what reliability squares and weights. The covariance of outcome with probability is what WBC carries, twice over. The outcomes' own spread enters no term by that name.")

# 8
x("The calibration call returns a closure of -8.33e-17 for the Ekene rows at 10 bins. How is that figure read?",
 "The five terms and the Brier score agree up to rounding in the last bits of a double",
 ["A small negative bias in the Brier score, to be added back to the score before it is quoted",
  "The within-bin covariance term, which the engine reports under a second name here",
  "Evidence that a term is wrong, since an exact identity should give 0.000000 flat"],
 "The closure is the Brier score minus the five-term sum, 0 up to rounding. A figure near 1e-16 is floating-point noise and says the terms agree with the score; one the size of a term would say a term was wrong. Nothing is added back to the Brier score, and WBC is reported as its own term, 0.001669.")

# 9
x("At 10 bins a probability of exactly 0.3 falls on the edge between bins 2 and 3. Where does the engine put it, and where would scikit-learn's calibration_curve?",
 "The engine opens the upper bin, bin 3; the library puts it in the lower bin, bin 2",
 ["Both put it in bin 3, since the two tools share numpy histogram's rule for edges",
  "The engine puts it in bin 2, closing the lower bin; the library puts it in bin 3",
  "Each splits it, half a row to bin 2 and half a row to bin 3, so no bin is favoured"],
 "The bin rule is i/M <= p < (i+1)/M with the edges as computed in double precision, so an interior-edge value opens the upper bin: bin 3. scikit-learn's calibration_curve puts it in the lower bin. The engine's rule is numpy histogram's; the library's is the other convention. No tool splits a row between bins.")

# 10
x("How many Ekene probabilities sit exactly on an interior edge at 10 bins, and how many of the ten bins change their row count under the library rule?",
 "17 probabilities, with the values 0.1, 0.2, 0.3, 0.4 and 0.6; 6 of the 10 bins hold a different count",
 ["5 probabilities, one on each of the edge values; only bin 7 holds a different count between rules",
  "None, since probabilities to 2 decimals never meet an edge computed in double precision exactly",
  "17 probabilities, all at 0.5; every one of the 10 bins holds a different number of rows as a result"],
 "The course counted 17 edge probabilities over the whole set, with the values 0.1, 0.2, 0.3, 0.4 and 0.6, and derived the library rule's table: 6 of the 10 bins hold a different number of rows. Bin 7 is one of the bins that keeps its count, holding no edge value. A value typed as 0.3 is compared with the double 3/10 and does meet it. No edge value is 0.5 on this set.")

# 11
x("On the Ekene rows the library rule gives REL 0.078849 against the engine's 0.080032, while ECE and MCE agree. Why does MCE agree?",
 "The largest gap is in bin 7, which holds no edge value, so moving the edge rows cannot touch it",
 ["MCE uses no bins, being a mean over rows like the Brier score, so no edge rule can ever move it",
  "The library rule rescales the gaps so that the worst one always matches under either rule",
  "Every bin is over-confident, so the maximum of the gaps is fixed by the mean probability"],
 "MCE is the largest gap over non-empty bins, and on this set it is bin 7's 0.723333 under both rules because bin 7 holds no edge value. The over-confidence argument explains why ECE agrees: moving an edge row between two over-confident bins leaves the pooled gap unchanged. MCE is built from bins, and no rule rescales gaps. REL differs, by -1.18e-3, so the rule is named whenever tables are compared.")

# 12
x("Log loss on the Ekene rows is 0.503184 with 5 probabilities clipped. Where does the figure come from?",
 "From engines/dataai/ml.js logLoss, imported and called on the same rows, eps 1e-15",
 ["From a copy of the formula kept inside the evaluation engine itself, clipped at eps 1e-15",
  "From the Brier score, since log loss is simply its natural logarithm on the same rows",
  "From the bins: the mean of -ln of each bin's gap, taken over the non-empty bins"],
 "The calibration call imports logLoss from the machine learning engine and calls it on the same rows; the course checked the figure is exactly what that function returns. One definition on the platform means one answer, so the evaluation engine keeps no copy. Log loss is -(1/n) sum [y ln p + (1 - y) ln(1 - p)] on the rows and uses no bins.")

# 13
x("Why does the log loss function clip every probability into [eps, 1 - eps] before taking logarithms?",
 "A probability of exactly 0 or 1 would make the logarithm infinite for a row that went the other way",
 ["To keep log loss below 1 on every set, so it reads on the same scale as the Brier score does",
  "To round the probabilities to 2 decimals, as the calibration set's fixture record states them",
  "So that probabilities exactly on an interior bin edge move off the edge into the lower bin"],
 "ln 0 is minus infinity, so a row given 0 that turns out relevant, or 1 that turns out not, would make the mean infinite. Clipping at eps 1e-15 sets a large finite cost instead, and the Ekene set has 5 such probabilities clipped. Log loss can exceed 1 after clipping; the fixture's rounding happened when the file was written; and log loss uses no bins.")

# 14
x("A calibration call passes eps 0.5. What happens?",
 "A refusal naming `eps`: \"eps must be a number above 0 and below 0.5\"",
 ["Every probability is clipped to 0.5, and log loss is reported as ln 2",
  "The engine ignores eps, since it has no log loss of its own to pass on",
  "A refusal naming `bins`, since eps also sets the width of the bins"],
 "The calibration call passes eps straight to the imported logLoss, which refuses 0.5 with the field `eps` named, in the words quoted: at 0.5 every probability would be clipped to 0.5. The engine does pass eps through; it does not ignore it. eps has nothing to do with the bins.")

# 15
x("Inside one bin, the rows with the higher probabilities are more often the relevant ones. What sign does WBC take, and how does it move the Brier score?",
 "WBC is positive, and entering the identity with a minus sign it lowers the Brier score",
 ["WBC is negative, and entering with a minus sign it raises the Brier score further still",
  "WBC is 0, since the bin's mean probability already accounts for every row within the bin",
  "WBC is positive, and entering with a plus sign it raises the Brier score by that amount"],
 "WBC is 2 sum (y - observed_k)(p - mean p_k) / N: when higher probabilities go with outcomes of 1 inside a bin the products are positive on balance, so WBC is positive, and the identity subtracts it. Ranking well inside a bin lowers the Brier score. The bin mean ignores the spread, which is exactly what WBV and WBC restore; WBC enters with a minus sign.")

emit(Q, '/root/dai-wip-appliedai/banks/d5a_m03.json', expect_n=15)
finish()
