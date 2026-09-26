# Conventions that are choices

{{panel:ae-trust-explorer}}

Every figure this engine returns rests on conventions, and most of them are choices. Each has a real alternative in common use, and a figure computed under the alternative can differ in the sixth decimal or in the first. The engine states every choice in the `basis` block it returns with each result. Reading a figure honestly means reading that block, and naming the choice whenever a number from this engine is compared with one from another tool.

## The choices, with the alternative and the reason

| convention | this engine | a common alternative | why the engine chose it |
| --- | --- | --- | --- |
| tokens | ASCII lowercase, split outside [a-z0-9], single characters kept, no stemming | a word pattern of two characters or more (scikit-learn's default), stemming | a learner can tokenise by hand, and single-character tokens such as well numbers matter |
| stop list | off | on | the list removes well, top, bottom, fire and system |
| TF-IDF | raw counts, smooth idf ln((1 + N) / (1 + df)) + 1, unit vectors | unsmoothed idf, other norms | scikit-learn's defaults, so a figure compares directly |
| BM25 idf | Lucene ln(1 + (N - df + 0.5) / (df + 0.5)) | the Robertson form, negative for common terms | never negative |
| BM25 numerator | keeps (k1 + 1) | Lucene 8 and later drop it | Robertson and Zaragoza's form; dropping it scales every score and leaves the order |
| repeated query words | counted once (k3 = 0) | weighted by query frequency | a query is a set of words |
| ties | 12 significant digits, then the id ascending | a relative tolerance, or input order | a key is transitive |
| relevance threshold | grade 1 or more | grade 2 or more | trec_eval's default; state it with every figure |
| precision at k | divides by k | divides by the passages ranked | trec_eval |
| average precision | divides by every relevant judged passage | divides by min(k, relevant) | trec_eval; a missed passage lowers AP |
| ideal DCG | every judged grade | the retrieved grades only | missing a good passage is penalised |
| no relevant passage | excluded from the means and listed | scored 0 | trec_eval |
| short answers | SQuAD normalisation | numeric-aware matching | the published script's rule, stated |
| groundedness | cited and retrieved; numericRelTol 0 | any passage; a tolerance by default | a claim must be traceable to what the system saw |
| calibration bins | an edge value opens the upper bin | scikit-learn closes the lower bin | numpy histogram's rule |
| ECE | non-empty bins, weighted by rows | unweighted mean over bins | Guo et al. (2017) |
| bootstrap interval | lib/stats quantile on the replicates, parameter-percentile labels | linear interpolation | the platform's one quantile |

## Three kinds of choice

Some choices change only the scale of a figure and leave every order alone. Keeping (k1 + 1) in the BM25 numerator multiplies every score by the same factor: the ranking is identical, and only the printed score differs from a Lucene 8 figure.

Some choices change figures and orders together. The relevance threshold is the clearest case in the course. At grade 1 or more system A's MAP at 5 is 0.600278 against system B's 0.593007; at grade 2 or more it is 0.750362 against 0.771014. The better system depends on the threshold, which is why the threshold is stated with every figure.

Some choices decide what counts at all. The tokeniser keeps single characters, so the 3 of Ekene-3 is a token, where scikit-learn's default pattern of two characters or more would drop it. The stop list is off, because scikit-learn's list removes well, top, bottom, fire and system, words that carry meaning in oilfield text: the query "the well top" loses every token with the list on.

Some choices change what a figure means. Groundedness that accepts any passage of the corpus answers "is this figure somewhere in our documents?". Groundedness that accepts only cited and retrieved passages answers "could a reader trace this figure to what the system saw?". The engine asks the second question, because it is the one a reader of the answer needs answered.

## Choices this tier met

The Expert tier added its own choices to the list. The calibration bin edge opens the upper bin, where scikit-learn closes the lower one; on the Ekene set that moves REL from 0.080032 to 0.078849 and leaves ECE and MCE unchanged. ECE weights each bin by its rows. Kappa can be unweighted, linear or quadratic, and the three differ: 0.579841, 0.675940 and 0.771549 on the Ekene annotators. The bin count is a choice too, and moves MCE from 0.660556 at 5 bins to 0.750000 at 15. None of these is a correction of another; each is a stated convention to be named, and a report that compares this engine's figures with another tool's names every one that differs.

## Exercise

Open the trust explorer. On "Cohen's kappa", read the Ekene annotators' kappa under each weighting. On "Calibration: Brier, reliability table, ECE and MCE", read ECE and MCE at 5, 10 and 15 bins. On "A seeded bootstrap of a mean", read system A's interval at levels 0.9 and 0.95. For each of the three choices, write one sentence naming the engine's setting and the figure, and one naming the alternative and the figure it gives.
