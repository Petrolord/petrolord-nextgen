import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Professional m01, choosing k with the elbow.
# Every figure is the course's elbow on the 180 cored rows of the Ekene field
# (GR, RHOB, NPHI, PEF, standard scaling, seed 3, 10 starts at every k) unless
# the question states otherwise. No capstone field, well, stated input or
# graded answer appears.

q(1, "The elbow on the 180 cored rows (GR, RHOB, NPHI, PEF, standard scaling, seed 3, 10 starts) begins at k 1. What inertia does that first row print?",
 "720.000000, the number of rows times the number of logs",
 ["4.000000, one unit for each standardised log, since the one cluster sits at the mean of every log",
  "245.390847, because a single cluster already absorbs the first drop the curve can show",
  "Nothing at all, because inertia needs at least two centres before a sum of squares exists"],
 "At k 1 every row sits in one cluster about the mean, and each standardised log contributes n = 180 to the sum of squares, so four logs give 720.000000. 4.000000 is what the correlation eigenvalues sum to, a different quantity. 245.390847 is the inertia at k 2, and the elbow prints a k 1 row, with no drop beside it.")

q(3, "At k 4 the elbow prints a drop of 22.942083. What does it print as the drop fraction at k 4?",
 "0.282430, the drop divided by the inertia at k 3",
 ["0.668972, the k 4 drop set against the inertia of the k 2 row above it",
  "22.942083 again, since the drop and its fraction are one column printed twice",
  "0.112303, since each fraction is read on the row after the drop it belongs to"],
 "The basis reads \"inertia(k - 1) - inertia(k); dropFraction divides by inertia(k - 1)\", so the k 4 fraction is 22.942083 over the k 3 inertia 81.231125, which prints 0.282430. 0.668972 is the fraction at k 3 and 0.112303 the fraction at k 5; the drop and the fraction are separate columns.")

q(0, "Over k 2 to 8, at which k do the largest drop and the largest drop fraction fall?",
 "The drop peaks at k 2, 474.609153, and the fraction at k 3, 0.668972",
 ["At k 2 for both: drop 474.609153, fraction 0.659179",
  "Both peak at k 3: drop 164.159721, fraction 0.668972",
  "k 4 for the drop, 22.942083, where the core's four facies sit, and k 5 for the fraction"],
 "The largest drop is 474.609153 at k 2, taken from the one-cluster figure 720.000000. The fraction at k 2 is 0.659179, a little below the 0.668972 at k 3, and the drop at k 3 is 164.159721, well below the k 2 drop. The k 4 drop, 22.942083, is smaller than both.")

q(2, "Which k does the elbow call return as its reading of the inertia curve?",
 "None; it prints the drops, and the one k it names is bestSilhouetteK",
 ["The k with the largest drop fraction, k 3, returned as the elbow",
  "k 4, returned as the elbow because the core describes 4 facies",
  "Whichever k has the smallest inertia: k 8, at 41.863457"],
 "The basis reads \"bestSilhouetteK has the highest mean silhouette; a tie goes to the smaller k. No elbow is picked automatically: read the drops\". The elbow is never told the core's four facies, and the smallest inertia is no answer because inertia keeps falling as k grows.")

q(1, "With one start per k and seed 265 over k 1 to 8, the k 8 inertia is 45.270437 against 45.153181 at k 7. What does the engine do?",
 "It returns the result, lists k 8 in inertiaRises and adds a warning",
 ["Refuses the call and names nInit, since the curve rises",
  "Swaps the k 7 centres in at k 8 to keep the curve falling",
  "Quietly raises nInit to 10 and prints 41.697291 at k 8 with no message"],
 "An inertia rise is a warning and never a refusal: the engine lists the k in `inertiaRises` and warns, in its own words, \"inertia rises at k = 8: those runs stopped in a local minimum; raise nInit\". It changes no run; 41.697291 is what the same seed gives when the caller asks for the default 10 starts.")

q(3, "The same seed 265 elbow is rerun with the default 10 starts at every k. What does it print at k 8?",
 "41.697291, and no rise is flagged",
 ["45.270437, the one-start figure, since the seed fixes the first start",
  "41.863457, the seed 3 figure, since ten starts at every seed reach one value",
  "45.153181, the k 7 figure carried up so the rise is removed"],
 "With the default 10 starts the seed 265 elbow shows no rise, reading 41.697291 at k 8. 45.270437 and 45.153181 are the one-start figures at k 8 and k 7, and 41.863457 is the seed 3 elbow at k 8: two seeds with ten starts need not agree.")

q(2, "An elbow at seed 3 with 10 starts prints 47.642067 at k 6. What does a single kmeans call at k 6, seed 3, 10 starts return?",
 "47.642067, because each k runs its own fresh mulberry32(seed) stream",
 ["A different inertia, since k 1 to 5 used up the stream first",
  "44.956011, the run started for the k above it",
  "No inertia until nInit is given, since a lone kmeans call has no default starts"],
 "The basis reads \"kmeans(X, k, seed, nInit) for each k, each k with its own mulberry32(seed) stream, so a row equals the single kmeans call\", and at k 6 both return 47.642067. 44.956011 is the k 7 inertia, and kmeans takes 10 starts when nInit is left out.")

q(0, "At k 5 the elbow prints 11 passes for the winning start. What do those passes count?",
 "Assignment passes of the winning start, the confirming pass included",
 ["Centre updates summed over all 10 starts at k 5, one for each move of a centre",
  "Starts at k 5 whose inertia came out within reach of the winner",
  "Sweeps needed before the drop fraction at k 5 stopped changing"],
 "The k-means basis reads \"iterations counts assignment passes (scikit-learn n_iter_)\", the pass that confirms the labels included, and the elbow prints them for the winning start only. The count describes one start, and the drop fraction is computed once from two finished runs.")

q(3, "An elbow is asked for with kMin 0. What comes back?",
 "A refusal naming kMin: \"kMin must be a whole number, 1 or more\"",
 ["A run from k 1, since the engine treats a kMin of 0 as the default lower end",
  "An extra row at k 0 with an inertia of 0, since no cluster leaves nothing to sum",
  "The kMax refusal, since kMax must lie from kMin to 180"],
 "The engine refuses a kMin of 0 by name, in its own words \"kMin must be a whole number, 1 or more\". It never substitutes a default and never prints a k 0 row; the kMax message is a separate refusal, raised when kMax falls below kMin.")

q(1, "An elbow asks for kMin 4 and a kMax below it. Which field does the refusal name, and what range does it state?",
 "kMax, from kMin (4) to 180 (the number of rows)",
 ["kMin, from 1 up to kMax, since the smaller end of the range is the one out of place",
  "k, from 1 to 180, the kmeans range, because the elbow passes each k to kmeans",
  "nInit, since a range running backwards leaves no starts to draw"],
 "The engine's own words are \"kMax must be a whole number from kMin (4) to 180 (the number of rows)\". It names kMax and states both ends: kMin at the bottom and the number of rows at the top.")

q(0, "An elbow call passes a word where withSilhouette belongs. What does the engine do?",
 "Refuses it: \"withSilhouette must be true or false\"",
 ["Scores the silhouette anyway, since any word that is not empty counts as true",
  "Skips the silhouette, as if it were false",
  "Returns the elbow with a warning that the silhouette setting was read as false"],
 "withSilhouette must be a true or false value, and a word is refused by name in the engine's words \"withSilhouette must be true or false\". The engine neither coerces the word nor falls back to a default with a warning.")

q(2, "Which reading of the drop fraction column over k 2 to 8 matches the figures?",
 "It falls to 0.282430 at k 4 and 0.112303 at k 5, and no larger k shown reaches 0.112303 again",
 ["Falls at every step after k 2, so the curve bends once and smoothly",
  "Its lowest figure is the last one, 0.068791 at k 8, as the curve flattens out",
  "Rises from 0.282430 at k 4 to 0.112303 at k 5, which makes k 4 a dip"],
 "The fractions read 0.659179, 0.668972, 0.282430, 0.112303, 0.079256, 0.056380 and 0.068791 for k 2 to 8. They rise from k 2 to k 3 and again from k 7 to k 8, so the fall is not smooth; the lowest is 0.056380 at k 7; and 0.112303 is below 0.282430.")

q(1, "Why is the k with the smallest inertia no answer to the choice of k?",
 "Inertia falls as k grows when every k is fitted well, down to 0 at one cluster per distinct row",
 ["The smallest inertia sits at k 1, where every row shares the one centre at the mean",
  "Inertia is in squared standard units, and those units change from one k to the next",
  "Past the number of facies, extra centres make the inertia rise again with k"],
 "The course states that inertia always falls as k grows when every k is fitted well, reaching 0 at one cluster per distinct row. k 1 carries the largest inertia, 720.000000; the units are the same standard units at every k; and on these rows the inertia falls at every step from k 1 to k 8, ending at 41.863457.")

q(0, "At k 4 with seeds 1 to 10, how do one start and ten starts compare against the lowest inertia 58.289042?",
 "8 of the 10 seeds stop above it with one start; with ten, 9 of the 10 reach it",
 ["5 of the 10 seeds stop above it with one start; with ten starts all 10 of them reach it",
  "8 of the 10 seeds stop above it with one start; with ten starts all 10 of them reach it",
  "2 of the 10 stop above it with one start; ten starts change none"],
 "With one start, 8 of the 10 seeds stop above 58.289042, as high as 78.775612. With ten starts 9 of the 10 reach it and seed 5 stops at 58.297079, so ten starts make a poor stop less likely without ruling it out.")

q(2, "Why is an elbow quoted with its scaling?",
 "Inertia is in squared units of the scaled logs: at k 4 standard reads 58.289042 and raw 10331.820703",
 ["Min-max scaling reaches 4.258929 at k 4, a tighter fit than the 58.289042 of standard scaling",
  "Scaling changes only the passes each start takes, and the inertia comes back the same",
  "The raw inertia is the standard inertia put back in log units, so both describe one fit"],
 "The three scalings at k 4, seed 3, 10 starts give 58.289042 standard, 10331.820703 raw and 4.258929 min-max. These are in different units and cannot be compared, so 4.258929 is no tighter fit, and the raw figure is a different clustering on different distances.")

emit(Q, '/root/dai-wip-facies/banks/d3i_m01.json', expect_n=15)
finish()
