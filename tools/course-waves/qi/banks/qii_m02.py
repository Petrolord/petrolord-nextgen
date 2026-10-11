import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Professional m02, The tie and the field wavelet.
# Sources: the bulk shift and its sign, anchors and the folding refusal, the
# time-depth record, the wavelet comparison, the field wavelet and its misfit,
# QI Studio's issue register rules and the designed disagreeing well.

q(1, "suggestBulkShift returns a POSITIVE shift for a well. What does the sign mean?",
 "The seismic event is later, so the synthetic moves down.",
 ["The seismic event is earlier, so the synthetic moves up the trace to meet it.",
  "The checkshots read too late by the shift.",
  "The polarity is reversed at that well."],
 "A positive bulk shift means the seismic event is later, so the synthetic moves down. The designed check shows it: checkshot times moved by -8.000000 ms come back as a shift of 8.000000 ms. The checkshots themselves stay as imported, and polarity is the phase match's question.")

q(3, "Which pack wells need a non-zero bulk shift, each with the statistical wavelet of its own trace?",
 "Ekene-2 and Ekene-4, each by -4.000000 ms.",
 ["Ekene-1 and Ekene-3, each by -4.000000 ms, the two wells whose wavelets are the most alike of the four.",
  "None: all four tie at 0.000000 ms.",
  "Ekene-2 and Ekene-4, each by 8.000000 ms, the move the designed check plants in the checkshot times."],
 "Ekene-2 and Ekene-4 tie best at -4.000000 ms, with correlations 0.965477 and 0.962720, while Ekene-1 and Ekene-3 need 0.000000 ms. The 8.000000 ms figure belongs to the designed check, and a high correlation does not set the shift to zero.")

q(0, "Over what lags does suggestBulkShift search for the largest correlation of the synthetic with the trace?",
 "Every whole-sample lag up to the stated search of 20 ms, on the samples both traces carry.",
 ["Every lag up to 5 samples, the maximum lag compareWavelets allows in its alignment.",
  "Fractional lags at 1 ms steps up to 8 ms, the reach of the event pick.",
  "Lags up to 30 degrees of phase, the span the issue register flags."],
 "The bulk shift takes the normalised cross-correlation at every whole-sample lag up to the stated 20 ms search, on the samples both carry, and keeps the lag of the largest. So Ekene-2's -4.000000 ms is one sample on the 4.000000 ms clock; 5 samples is the wavelet comparison's lag and 8 ms the pick's reach.")

q(2, "Ekene-1's checkshot times are moved by -8.000000 ms before the synthetic is built. What does the bulk shift find?",
 "8.000000 ms, with a correlation of 0.983438.",
 ["-8.000000 ms, the same sign as the planted move, with a correlation of 0.983438.",
  "8.000000 ms, with the correlation dropping to 0.965477 because the synthetic has moved.",
  "0.000000 ms, since the stated search of 20 ms is measured from the moved checkshot times."],
 "The search returns the opposite of the planted move, 8.000000 ms, and the correlation equals the unshifted tie's 0.983438, because a whole-sample move slides the same synthetic samples along the clock. 0.965477 is Ekene-2's tie.")

q(0, "A tie carries anchors at (1250, 1252) and (1350, 1356) ms. To what seismic time does the synthetic time 1400.000000 ms map?",
 "1406.000000 ms: beyond the last anchor the mapping continues with slope one.",
 ["1356.000000 ms: past the last anchor every time is held there.",
  "1304.000000 ms: halfway between the anchors, half of each shift.",
  "1202.000000 ms: past the anchors the warp falls back to the first anchor's shift, as one anchor would give."],
 "Between anchors the mapping is linear, and beyond the first and the last it continues with slope one, a constant shift; so 1400.000000 ms maps to 1406.000000 ms with the last anchor's shift. 1304.000000 ms is where 1300.000000 ms maps, and 1202.000000 ms is where 1200.000000 ms maps.")

q(3, "What does makeTieWarp do with a single anchor?",
 "It applies one constant shift: a bulk shift.",
 ["It refuses, since a linear mapping between anchors needs at least two of them to define a slope.",
  "It stretches the whole trace about the anchor so that every time scales by the ratio of its two times.",
  "It applies the anchor's shift at that time only and leaves every other sample of the synthetic in place."],
 "Beyond the first and the last anchor the mapping continues with slope one, a constant shift, so the single-anchor case is a bulk shift. Nothing is stretched about the anchor and nothing is refused.")

q(1, "A learner gives makeTieWarp a second anchor whose seismic time is earlier than the first anchor's. What happens?",
 "It refuses: both times must increase from one anchor to the next, and this pair would fold time.",
 ["It sorts the anchors by seismic time and builds the warp from the reordered pair without any comment.",
  "It drops the second anchor and keeps a bulk shift at the first.",
  "It maps the interval with a negative slope, running time backwards."],
 "Both times must increase from one anchor to the next, and makeTieWarp refuses a pair that would fold time. Its message carries a punctuation mark the course does not print, so the course names it by what it refuses; a tie may stretch or squeeze an interval and may not reverse it.")

q(2, "A tie is accepted at a well. What happens to the time-depth record?",
 "Rows derived from its anchors are kept as a new set beside the imported checkshots, which stay as imported.",
 ["The imported checkshots are overwritten by the warped times, so the record holds one set, the tied one.",
  "Only the bulk shift is stored, as one number added to every checkshot's one-way time.",
  "The record is held inside QI Studio alone, and Seismolord keeps its own separate untied checkshots."],
 "Once a tie is accepted, rows derived from its anchors through the same time-depth line are kept as a new set beside the imported checkshots, which stay as they were imported. QI Studio reads the tie each well has in Seismolord, with its QC record, so every app reads one tie.")

q(3, "At Ekene-1, what is the two-way time of the top of the Ekene Sand, 5078.740157 ft, linear between checkshot levels?",
 "1288.796378 ms.",
 ["1288.876000 ms, the two-way time of the checkshot level at 5079.002625 ft, the nearest one to the top.",
  "644.398189 ms, the one-way time the checkshots give at the top, read as two-way time without doubling.",
  "1311.086000 ms, the two-way time of the checkshot at 5183.989501 ft, the level next to the base."],
 "Linear between the levels at 4687.500000 ft and 5079.002625 ft, the top lands at 1288.796378 ms, just above that level's 1288.876000 ms. Two-way time is 2 x the one-way time, so 644.398189 ms is the one-way figure, and 1311.086000 ms sits by the base.")

q(0, "A well ties with a non-zero bulk shift. What does that do to the times committed to its record below the shift?",
 "It moves every one of them by that same amount.",
 ["Nothing: the committed time is always the checkshot time, whatever shift the tie found.",
  "It moves only the top of the reservoir, the one event the tie was matched on.",
  "It scales each in proportion to depth."],
 "With a bulk shift of zero, as at Ekene-1 and Ekene-3, the committed time is the checkshot time; a non-zero shift moves every time below by the same amount. Ekene-2 and Ekene-4 tied at -4.000000 ms, one sample.")

q(1, "How does compareWavelets measure the similarity of two wavelets?",
 "After aligning by the lag of largest correlation, up to 5 samples, and scaling to unit energy, as the zero-lag correlation.",
 ["As the ratio of their peak frequencies, so Ekene-2's 23.394907 Hz against Ekene-4's 26.530951 Hz sets the pair's figure.",
  "As the correlation at zero lag on the raw wavelets, so a stronger trace's wavelet scores higher against the reference.",
  "As the correlation at the best lag within the 20 ms bulk shift search, with every wavelet normalised to a peak of 1."],
 "The first wavelet is the reference; every other is aligned to it by the lag of largest correlation, up to 5 samples, all are scaled to unit energy, and the zero-lag correlation of each pair is the similarity. Unit energy removes strength, so a stronger trace scores no higher.")

q(2, "Which two pack wells have the least alike statistical wavelets, and at what similarity?",
 "Ekene-2 and Ekene-4, at 0.986771.",
 ["Ekene-1 and Ekene-3, 0.999524.",
  "Ekene-2 and Ekene-3, at 0.994059, the lowest Ekene-3 pair.",
  "Ekene-1 and Ekene-4, at 0.996130, the reference against the farthest well."],
 "The smallest similarity in the matrix is Ekene-2 with Ekene-4, 0.986771, the lowest and highest frequency wells. Ekene-1 with Ekene-3, 0.999524, is the most alike pair, and every lag to the reference is 0 samples.")

q(3, "compareWavelets averages the four Ekene statistical wavelets into one field wavelet. What does the average carry?",
 "31 samples, peak 24.769590 Hz, centroid 25.155328 Hz.",
 ["61 samples at 2 ms, peak 24.769590 Hz.",
  "31 samples, peak 25.039790 Hz, a 25 Hz Ricker.",
  "31 samples, peak 24.488746 Hz, centroid 25.084884 Hz, since the reference well's spectrum is kept as it is."],
 "The average is the mean of the aligned, unit-energy wavelets, scaled to unit energy again: 31 samples, peak 24.769590 Hz, centroid 25.155328 Hz. 61 samples is the average resampled from 4 ms to 2 ms; the Ricker and Ekene-1 rows are other wavelets.")

q(0, "Ekene-3's wavelet is rotated before the comparison, once by 90 degrees and once by 180 degrees. Which case breaks the 0.8 rule for a well unlike the others?",
 "Only the reversed polarity case: Ekene-3 at 0.693702; at 90 degrees it stays above the rule at 0.911984.",
 ["Both: at 90 degrees Ekene-3 falls to 0.911984 and reversed to 0.693702, each under the 0.8 rule.",
  "Neither: the other three wells drop with it, and the average absorbs a single well's rotation.",
  "Only the 90 degree case, since a quarter-turn spans more than the register's 30 degrees."],
 "Reversed, Ekene-3 correlates with the average at 0.693702, below 0.8; at 90 degrees it scores 0.911984 and passes. The 30 degree span is a separate phase rule, and in both cases the pulled average lowers the other wells too.")

q(2, "Under QI Studio's issue register rules, how is a tie with a mean windowed correlation of 0.6 graded?",
 "Fair: below 0.7, at or above 0.5.",
 ["Poor, below the 0.7 rule.",
  "Unlike the others, since a correlation below the 0.8 rule sends the well out of the field wavelet.",
  "Flagged, since a tie correlation below 0.7 is treated like a phase span of more than 30 degrees."],
 "A tie whose mean windowed correlation is below 0.5 is poor and one below 0.7 fair, so 0.6 is fair. The 0.8 rule applies to a wavelet's correlation with the average, and the flag applies to phases spanning more than 30 degrees.")

emit(Q, '/root/qi-wip-qi/banks/qii_m02.json', expect_n=15)
finish()
