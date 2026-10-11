import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Expert m02, Post-stack inversion.
# Sources: model-based least squares and the iteration count as regularisation,
# blocky and sparse-spike with lambda on the trace's scale, coloured inversion,
# blind wells against the LFM alone, and the spread across realisations.

q(2, "What does the engine's modelBased minimise, and what does the weight eps do?",
 "||C D m - d||^2 + eps^2 ||m - m0||^2 by CGLS from the LFM m0; eps pulls the result towards the LFM.",
 ["1/2 ||C r - d||^2 + lambda ||r||_1 by FISTA; eps sets how sparse r is.",
  "||C D m - d||^2 alone by CGLS; eps is the step length of each iteration.",
  "||m - m0||^2 alone; eps scales the wavelet before the solver runs."],
 "modelBased minimises ||C D m - d||^2 + eps^2 ||m - m0||^2 by conjugate gradients on the normal equations, starting from the LFM, and eps pulls the result towards it; the course states eps 0.050000. The lambda ||r||_1 problem is the sparse-spike solver's.")

q(0, "The blind model-based inversion at Ekene-1 (eps 0.050000) is run at 20 and at 300 iterations. How do the residual RMS and the AI error at the well move between them?",
 "The residual falls from 3.419041 to 1.233454 while the AI error rises from 8.300748 to 52.851805 percent.",
 ["Both fall, the residual from 3.419041 to 1.233454 and the AI error from 52.851805 to 8.300748 percent.",
  "Both rise, since more iterations let the noise in the trace grow in the residual and in the error alike.",
  "The residual is fixed at 2.121830 and only the AI error moves, from 8.300748 to 52.851805 percent."],
 "The residual keeps falling with more iterations while the error at the well rises, because the solver fits the trace beyond what the stated wavelet and the scale can explain. A smaller residual is no better inversion; 2.121830 is the residual at 60 iterations.")

q(3, "Of the four iteration counts the course runs for the blind model-based inversion at Ekene-1, which gives the lowest AI error at the well?",
 "20 iterations, at 8.300748 percent.",
 ["60 iterations, the stated count, at 10.557858 percent, since the stated setting is the one tuned to this well.",
  "300 iterations, at 52.851805 percent, the run with the smallest residual of 1.233454 and so the closest fit.",
  "120 iterations, at 19.965981 percent, where the correlation and the residual both sit in the middle of the range."],
 "The table prints AI errors of 8.300748, 10.557858, 19.965981 and 52.851805 percent at 20, 60, 120 and 300 iterations. Here the iteration count is also the regularisation, and the smallest residual belongs to the worst error.")

q(1, "At 300 iterations the weight eps is raised from 0.050000 to 5.000000. What does the blind score at Ekene-1 show?",
 "Correlation 0.732457 and AI error 13.421322 percent, with a larger residual of 1.769102.",
 ["Correlation 0.091593 and AI error 52.851805 percent, unchanged by the weight.",
  "A smaller residual of 1.233454 with the correlation at 0.219646, since a heavier weight fits the trace more closely.",
  "Correlation 0.852881 and AI error 10.557858 percent, as at 60 iterations."],
 "At 300 iterations eps 5.000000 gives a correlation of 0.732457, an AI error of 13.421322 percent and a residual of 1.769102, against 0.091593, 52.851805 and 1.233454 at eps 0.050000: a heavier weight holds the result nearer the LFM at the cost of a larger residual.")

q(1, "In the blind model-based inversion at Ekene-1 (eps 0.050000, 60 iterations), how does the inverted AI at 1296.000000 ms compare with the log after the high cut?",
 "It is 7582152.255748, above the log's 6044332.734122.",
 ["It is 5168379.152075, the LFM's value, since the LFM fixes the level inside the sand.",
  "It is 5312165.284155, just below the log, as the solver stops short of the step.",
  "It is 4686769.690526, below the log, because eps pulls it down to the LFM."],
 "At 1296.000000 ms the log after the high cut is 6044332.734122, the LFM 5168379.152075 and the inverted AI 7582152.255748: the inversion finds the step into the sand that the LFM lacks and then overshoots. 5312165.284155 and 4686769.690526 are the inverted values at 1288.000000 and 1280.000000 ms.")

q(3, "QI Studio's starting sparse-spike lambda is 0.002000. How many of the 101 reflectivity samples in the Ekene-1 trace are non-zero, and what does that mean?",
 "101 at 60 and at 400 iterations: on traces of this amplitude that lambda imposes no sparsity.",
 ["96 at 60 iterations and 61 at 400, since any positive lambda removes the weakest spikes at once.",
  "36 at 60 iterations and 27 at 400, the sparse earth the method is named for.",
  "None: the engine refuses a lambda far below the trace's largest amplitude of 399.814697."],
 "lambda is weighed against a misfit in trace units, and on a trace whose largest absolute amplitude is 399.814697, lambda 0.002000 leaves 101 of 101 samples non-zero. 96 and 61 belong to lambda 200.000000, and 36 and 27 to lambda 5000.000000. The stated value silently decides that no sparsity is imposed.")

q(0, "Three methods are run blind at Ekene-1 and scored against the log after the high cut over 27 samples. How do they rank?",
 "Sparse-spike leads at 0.873414 and 8.356661 percent; blocky trails at 0.751173 and 13.130119 percent.",
 ["Blocky leads at 0.873414 and 8.356661 percent, since few large steps suit a sand under a shale.",
  "Model-based leads at 0.852881 and 10.557858 percent; sparse-spike trails at 0.751173.",
  "All three tie at 0.852881, as each shares the same LFM, wavelet and scale at the well."],
 "The table prints model-based 0.852881 and 10.557858, blocky 0.751173 and 13.130119, and sparse-spike 0.873414 and 8.356661 percent. Sparse-spike leads on both measures, at a lambda of 0.002000 that imposes no sparsity.")

q(2, "What does coloured inversion need, and what does it return?",
 "No wavelet and no LFM; it returns relative impedance, band-limited, with no level.",
 ["A scaled wavelet and the LFM, and it returns absolute AI on the trace clock with the level the wells supply.",
  "The LFM alone, and it returns AI whose level follows the wells and whose shape comes from the stated band.",
  "A wavelet per well, and it returns absolute AI with a phase of 0 degrees."],
 "Coloured inversion applies one operator to every trace, an amplitude spectrum from a power law f^alpha inside the band of 8 to 60 Hz and a phase of minus 90 degrees. No wavelet and no LFM, so the output is relative impedance with no level.")

q(3, "How does the course score coloured inversion at the wells, and why?",
 "By correlation alone against the log band-passed between 8 and 50 Hz, since relative impedance has no level to compare.",
 ["By the RMS AI error against the log after the 50 Hz high cut, the same measure as the model-based blind well.",
  "By correlation against the log after the 50 Hz high cut, which keeps the level the operator lacks.",
  "By the residual RMS in trace units, since no log can be compared with a relative result."],
 "Coloured inversion is scored by correlation alone against the log band-passed between 8 and 50 Hz, because relative impedance has no level to compare; Ekene-1 scores 0.931237. The absolute inversions are scored against the log after the 50 Hz high cut.")

q(1, "The coloured operator uses the mean slope alpha -1.012769 of the four pack wells, whose own slopes run from -0.646563 at Ekene-1 to -1.473109 at Ekene-2. Why do the four slopes differ?",
 "The logs are short, so each slope rests on few frequencies.",
 ["Ekene-2's slope carries the wrong polarity, so its impedance spectrum falls where the other wells' rise.",
  "Each well has its own transform length, shorter than 256.",
  "The band of 8 to 60 Hz clips each well's spectrum at a different edge."],
 "The pack covers the Ekene Sand and the shale above it, so each log is short and each slope rests on few frequencies; that is why the four slopes differ. The operator uses one transform length, 256, and the slope is fitted over 5 to 80 Hz.")

q(0, "In the model-based blind-well table (eps 0.050000, 60 iterations), what does the LFM alone show beside the blind inversion?",
 "A negative correlation at every well, and a lower RMS error than the blind inversion at 4 of 4 wells.",
 ["A positive correlation at every well, as the LFM carries both the level and the shape of AI between wells.",
  "A higher RMS error than the blind inversion at 4 of 4 wells, since an LFM carries no detail of the sand.",
  "A lower RMS error at 2 of 4 wells only, Ekene-2 and Ekene-3, with a negative correlation at each well."],
 "The LFM alone correlates at -0.190352 to -0.345505, negative at every well: it carries the level and none of the shape. Its RMS error is lower than the model-based blind error at 4 of 4 wells, 8.638086 against 10.557858 percent at Ekene-1. The 2 of 4 figure belongs to sparse-spike.")

q(2, "Against the LFM-only RMS error, where does the blind sparse-spike inversion have the lower AI error?",
 "At Ekene-1 and Ekene-4.",
 ["At all four pack wells, as its blind correlations from 0.778867 to 0.881157 suggest.",
  "At Ekene-2 and Ekene-3, where its blind correlations are the highest of the four wells.",
  "At none of the wells, since the LFM alone has the lower error than any inversion at every well."],
 "Sparse-spike's blind AI error is 8.356661 percent at Ekene-1 against the LFM's 8.638086, and 10.144841 at Ekene-4 against 10.307658; the LFM has the lower error at Ekene-2 and Ekene-3. A study quotes both figures.")

q(2, "Twenty noisy realisations of the Ekene-1 full stack are each inverted blind. What is the mean relative spread in AI over the logged samples?",
 "0.645787, the mean of (Q90 - Q10) / Q50 over the 27 logged samples.",
 ["0.727077, the largest relative spread the table prints, at 1304.000000 ms.",
  "0.507162, the spread at 1280.000000 ms.",
  "0.546074, the spread at 1296.000000 ms."],
 "Per sample the quantiles across the realisations give (Q90 - Q10) / Q50, and its mean over the 27 logged samples is 0.645787. 0.507162, 0.546074 and 0.727077 are single samples at 1280.000000, 1296.000000 and 1304.000000 ms.")

q(0, "In the course's percentile convention for parameters, what is Q10 of AI across the realisations?",
 "The LOW figure, the value 10 percent of realisations fall below.",
 ["The HIGH figure, the value 10 percent of realisations exceed, labelled as volumes are labelled.",
  "The median of the realisations, read as Q50 once ten seeds have been run from each of the twenty.",
  "The relative spread, (Q90 - Q10) / Q50, at the sample."],
 "Q10 is the 10th percentile, the value 10 percent of realisations fall below, so it is the LOW figure; at 1288.000000 ms it is 4056484.639171 against Q90 6743113.590982. P-labels are kept for outcomes such as volumes, where P90 is the low figure.")

q(3, "The realisations add seeded Gaussian noise at a signal-to-noise ratio of 4 on the 20 seeds 101 to 120. What may a study claim for the spread they give?",
 "An estimate on stated seeds and a stated noise level; a different set of seeds gives different figures.",
 ["The uncertainty of the AI at Ekene-1 from every source, the LFM, the wavelet and the iteration count included.",
  "A fixed property of the trace, the same on any seeds once at least 20 realisations have been run.",
  "The spread of the field's AI between the wells, since each realisation is inverted blind at the well."],
 "The realisations differ in one assumption, the noise, at a signal-to-noise ratio of 4 on seeds 101 to 120, and the mean relative spread of 0.645787 is an estimate on those seeds and that noise level. A different set of seeds gives different figures.")

emit(Q, '/root/qi-wip-qi/banks/qia_m02.json', expect_n=15)
finish()
