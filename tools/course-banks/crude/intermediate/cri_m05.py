import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# crude Professional m05, against the marker. Every figure is from digest
# SECTION 17 (the marker, the three single-crude and blend rows, the
# volume-weighted mean, the two netbackValue refusals and the two d86ToTbp
# refusals), with the Kwale T50 readings from SECTION 14. Refusals are quoted
# as the digest prints them after REFUSED.

q(3, 'How does netbackValue define the differential against a marker?',
 "This crude's netback minus the marker's netback.",
 ["The marker's netback minus this crude's netback.",
  "This crude's gross product value minus the marker's netback.",
  "This crude's netback over the marker's netback, as a ratio."],
 "Kwale's marker is 72.5 $/bbl. The blend nets back 64.9473 $/bbl and the engine reports the differential as -7.5527 $/bbl.")

q(1, "The Kwale blend's differential against its marker is -7.5527 $/bbl. What does the sign say?",
 "The blend nets back less than the marker, since the differential is this crude's netback minus the marker's.",
 ["The blend nets back more than the marker crude, read on the marker minus crude convention.",
  "The blend's gross product value falls short of the marker's gross by that figure.",
  "The blend's valuation is incomplete, since a negative differential flags a missing term."],
 "The engine's convention: this crude's netback minus the marker's, so a negative differential is a netback below the marker's. Gross product value and completeness do not enter it.")

q(0, "What does netbackValue report for Kwale Light valued alone on Kwale's terms?",
 'Gross 75.2968, netback 65.9944 and a differential of -6.5056 $/bbl.',
 ['Gross 72.9512, netback 63.6676 and a differential of -8.8324 $/bbl.',
  'Gross 74.2412, netback 64.9473 and a differential of -7.5527 $/bbl.',
  'Gross 75.2968, netback 65.9944 and a differential of -7.5527 $/bbl.'],
 "Each crude alone is valued on the same Kwale cut set, product prices, processing cost, freight and losses as the blend. The blend's own row reads 74.2412, 64.9473 and -7.5527.")

q(2, "Three rows are valued against Kwale's marker: Kwale Light alone, Ughelli Medium alone and the blend. What makes the rows comparable?",
 "Each is valued on the same Kwale cut set, product prices, processing cost, freight and losses, so only the crude changes.",
 ["Each crude is valued on a cut set of its own, drawn at its own measured temperatures, so the yields show each crude at its best and the rows share a scale.",
  "Each row's netback is normalised by its own gross, so crudes of different value can be read on one scale.",
  "Each row is valued against a marker built from that row's own crude, so each differential is consistent with itself whatever terms the row carries."],
 "One set of terms stands behind all three rows, and every differential here is against the same 72.5 $/bbl.")

q(3, 'What does netbackValue take from the caller in order to report a differential against a marker?',
 "A marker netback in $/bbl, such as Kwale's 72.5, which it sets against this crude's own netback.",
 ["The marker crude's own TBP assay, which it blends and values on the same cuts before the subtraction is made.",
  "A marker gross product value, which it sets against this crude's gross before any cost or loss is taken.",
  'A marker sulfur and API, from which it prices a quality differential per barrel against this crude.'],
 "netbackValue takes a marker netback and reports this crude's netback minus the marker's. Kwale Light alone reports -6.5056 against the same 72.5.")

q(1, "Kwale Light and Ughelli Medium each have a netback of their own. Weighted 55 and 45 on volume, where do they land against the blend's netback?",
 'The mean is 64.9473 $/bbl, and the course prints the difference as 0.0000.',
 ['The mean is 65.0169 $/bbl, and the course prints the difference as 0.0696.',
  'The mean is 64.9473 $/bbl, and the course prints the difference as -7.5527.',
  'The mean is 65.5412 $/bbl, and the course prints the difference as 0.5939.'],
 'The blend is worth what its barrels are worth: its netback and the volume-weighted netbacks of its crudes are the same figure.')

q(0, "Why does the netback of the Kwale blend equal the volume-weighted mean of its crudes' netbacks?",
 "Yields add on volume and every other term is per barrel, so the blend is worth what its barrels are worth.",
 ["The engine forms the blend's netback as that mean, so the two figures are one computation printed twice.",
  "The two crudes carry the same netback, 64.9473 $/bbl each, so any weighting lands on the blend's figure.",
  "Netbacks blend on mass, and at 55 and 45 the mass and volume shares of these two crudes coincide."],
 "The blend's netback is computed from the blend's own curve, its own cut yields and the full chain. The mean is formed from the two single-crude netbacks, 65.9944 and 63.6676.")

q(2, "What does the course say d86ToTbp has the structure of?",
 "The cut-point-difference conversion, API Technical Data Book Procedure 3A1.1.",
 ["A fixed offset added at every point of the D86 curve, with no coefficient table needed.",
  "A bisection on the D86 curve for the temperature of each TBP point in turn.",
  "The Refutas index form, blended on volume fraction the way ASTM D7152 blends it."],
 "The course: d86ToTbp has the structure of the cut-point-difference conversion (API Technical Data Book Procedure 3A1.1) and ships no coefficient table. Called without the table, it refuses.")

q(1, "Against Kwale's marker of 72.5 $/bbl, what differential does netbackValue report for Ughelli Medium valued alone, and what does its sign say?",
 "-8.8324 $/bbl: valued alone on Kwale's cut set and prices, Ughelli Medium nets back below the marker.",
 ["-6.5056 $/bbl: valued alone on Kwale's terms, Ughelli Medium nets back less than the marker.",
  "-7.5527 $/bbl: a crude valued alone is reported through the blend's differential, which it shares.",
  '63.6676 $/bbl: a crude valued alone carries a netback of its own and no differential against the marker.'],
 'The Ughelli Medium alone row reads gross 72.9512, netback 63.6676 and differential -8.8324. -6.5056 belongs to Kwale Light alone and -7.5527 to the blend.')

q(3, 'On this valuation, does blending Kwale Light and Ughelli Medium create or destroy netback?',
 "Neither: the blend nets back the volume-weighted mean of its crudes' netbacks.",
 ["It destroys netback, because the blend's Watson K at T50 of 11.8135 marks it as a poorer feed than either crude.",
  "It destroys netback, because the blend's loss of 0.5939 is taken on a mixed barrel.",
  "It creates netback, because the blend's curve has 14 points where each crude's assay has fewer."],
 "The course prints the blend's netback minus the volume-weighted mean of its crudes' netbacks as 0.0000, with every row on the same cut set, prices, costs and losses.")

q(0, 'What does netbackValue return when asked to value with losses of 101 percent?',
 'REFUSED: Losses must be between 0 and 100 percent.',
 ['A netback on losses taken as zero, with losses named in assumedZero as a blank would be.',
  'A netback on a negative product value, with complete: false beside it.',
  'A netback on losses of 0.8 percent, the last valid figure it was given.'],
 'The engine refuses the input and returns no netback. The Kwale figure of 0.8 percent lies inside the range and is valued.')

q(2, "Which loss percents does the course show netbackValue refusing?",
 "101 percent and -1 percent, each refused with the same sentence.",
 ["101 percent only; -1 percent is taken as zero and named in assumedZero.",
  "-1 percent only; 101 percent is capped at 100 and valued.",
  "Neither; both are valued, with complete: false beside the netback."],
 "The refusal table prints two rows, losses of 101 percent and losses of -1 percent, and one sentence for both: REFUSED: Losses must be between 0 and 100 percent.")

q(3, "A blank loss is taken as zero and named. A loss of 101 percent is refused. What separates the two?",
 "A blank loss is taken as zero in assumedZero; losses must be between 0 and 100 percent.",
 ["A blank loss is named in unpricedCuts, and 101 percent is capped at 100 percent.",
  "A blank loss makes the valuation incomplete, and 101 percent is valued with complete: false.",
  "Both are refused in the engine; the blank is taken as zero by the studio alone."],
 "The course prints Kwale with freight and losses left blank at 67.4412 $/bbl, assumedZero naming freight, losses, and complete: true. Losses of 101 percent return REFUSED: Losses must be between 0 and 100 percent.")

q(0, 'A crude arrives with only a D86 curve. What does d86ToTbp return when called without a coefficient table?',
 'REFUSED: D86 to TBP conversion needs the API Technical Data Book Procedure 3A1.1 coefficient table, which is not shipped with this package. Supply it, or enter the assay as a TBP distillation, which is how crude assays are reported.',
 ["A TBP curve converted with the package's own copy of the Procedure 3A1.1 coefficients, with the table's source named beside the result for the reader to check.",
  "The D86 curve returned unchanged and labelled as TBP, since the two distillations agree closely enough for a screening valuation on the refinery's cuts.",
  "A TBP curve shifted by the published offset at each point, with the curve's initial and end points held where the D86 test placed them in the laboratory."],
 'D86 is a product test; a crude assay is reported as a TBP distillation. The refusal names two ways forward: supply the table, or enter the assay as a TBP distillation.')

q(1, "Why does d86ToTbp refuse a D86 curve with no 50 percent point, even with a table supplied?",
 "The engine anchors the conversion at the 50 percent point, and this D86 curve carries no such point to anchor on.",
 ["The engine reads T50 as the crude's midpoint for Watson K, and it refuses any curve that cannot supply one.",
  "A D86 curve with no 50 percent point is a product test, and a crude assay must carry its own T50 point.",
  "The engine interpolates the 50 percent point from the other points and refuses when the two nearest points are far apart."],
 "The engine returns REFUSED: The D86 curve needs a 50 percent point to anchor the conversion. The method has the structure of the cut-point-difference conversion.")

emit(Q, '/root/wt-md-crude-nextgen/tools/course-banks/crude/intermediate/cri_m05.json', label='cri_m05', expect_n=15)
finish()
