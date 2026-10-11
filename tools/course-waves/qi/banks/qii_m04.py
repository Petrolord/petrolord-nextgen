import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Professional m04, Angles from velocity.
# Sources: Dix in dixInterval and its refusal, the pack's RMS table on the trace
# clock, Walden's straight-ray angle against the ray trace and on the Ekene
# table, the angle gather and the mute, partial stacks, and the usable angle.

q(2, "In the pack's RMS velocity table, what Dix interval velocity does dixInterval return for the interval that closes at the row of 1311.000000 ms?",
 "2885.878392 m/s, the interval that starts at the row of 1288.800000 ms.",
 ["2396.900000 m/s, the RMS velocity printed on that row.",
  "2077.601943 m/s, the interval from 1040.500000 to 1288.800000 ms.",
  "2388.940541 m/s, the RMS velocity the trace clock puts at 1292.000000 ms between the two bracketing rows."],
 "Dix takes the RMS velocities and times of two rows and returns 2885.878392 m/s for the interval that closes at 1311.000000 ms. 2396.900000 is that row's RMS velocity, 2077.601943 belongs to the interval above, and 2388.940541 is an RMS velocity on the trace clock.")

q(0, "A designed RMS velocity table whose RMS velocity falls too fast is passed to dixInterval. What comes back?",
 "A refusal in the engine's own words: \"The RMS velocities give no real interval velocity at 1.1 s.\"",
 ["An interval velocity of zero at 1.1 s, the negative square clamped up to nothing.",
  "The deeper row's RMS velocity, the rule the engine keeps for a table's first row.",
  "A NaN interval velocity at 1.1 s, a result with an empty field and no refusal."],
 "A pair of rows whose numerator Vrms2^2 t2 - Vrms1^2 t1 is negative has no real interval velocity, and the engine refuses, naming the time: \"The RMS velocities give no real interval velocity at 1.1 s.\" Only the first row takes its RMS velocity as its interval velocity.")

q(3, "velocityOnGrid puts the pack's table on the trace clock. What interval velocity does it give the sample at 1292.000000 ms, and from what?",
 "2885.878392 m/s, the Dix velocity of the row segment the sample falls in.",
 ["2077.601943 m/s, printed on the last row above the sample.",
  "2388.940541 m/s, the RMS velocity reused as the interval velocity.",
  "A value linear in time between 2077.601943 and 2885.878392 m/s, read the same way as the RMS velocity column."],
 "On the trace clock the RMS velocity is linear in time between rows (2388.940541 m/s at 1292.000000 ms), and the interval velocity is the Dix velocity of the segment the sample falls in, from 1288.800000 to 1311.000000 ms: 2885.878392 m/s. It steps at each row.")

q(1, "A sample lies later than the last row of the pack's RMS table, 1782.300000 ms. What RMS velocity does velocityOnGrid give it?",
 "2328.600000 m/s, the last row's RMS velocity, held flat outside the table.",
 ["2132.930307 m/s, the last segment's Dix interval velocity carried on.",
  "A refusal naming the time, as the sample lies outside the table.",
  "A value extrapolated along the line through the last two rows."],
 "The RMS velocity is linear between rows and held flat outside the table, so a sample past 1782.300000 ms reads 2328.600000 m/s. 2132.930307 is an interval velocity, and the engine neither refuses nor extrapolates.")

q(2, "On the Ekene table at the top of gather 5 (1292.000000 ms), what is Walden's angle for the 1500 m offset?",
 "31.872141 degrees.",
 ["28.884086 degrees, Walden's angle at 1500 m in the designed four-layer earth, read at the base of its third layer.",
  "28.628580 degrees, the exact ray-trace angle at 1500 m through the designed four-layer teaching earth.",
  "41.065011 degrees, Walden's angle on the Ekene table at the next tabled offset, the 2000 m trace."],
 "With Vrms 2388.940541 and Vint 2885.878392 m/s at 1292.000000 ms, Walden's angle at 1500 m is 31.872141 degrees. 28.884086 and 28.628580 belong to the teaching earth at 1596.736597 ms, and 41.065011 is the 2000 m offset.")

q(3, "The course compares Walden's angle with an exact ray trace at the base of the third layer of the designed teaching earth. What does the comparison show?",
 "Walden reads high at every tabled offset, by 0.009482 degrees at 500 m and by 2.143321 at 3000 m.",
 ["Walden reads low at every offset, by 0.009482 degrees at 500 m and 2.143321 at 3000 m.",
  "Walden and the ray trace differ by a near constant 0.255506 degrees at every offset.",
  "Walden reads high by 2.143321 degrees at 500 m, shrinking to 0.009482 at 3000 m."],
 "Walden less ray trace is positive in every row and grows with offset: 0.009482 degrees at 500 m, 0.255506 at 1500 m, 2.143321 at 3000 m. At 500 m the excess is under a hundredth of a degree; at 3000 m it passes two degrees.")

q(0, "waldenAngle is given an offset so large that its sine works out above one. What does it return?",
 "90 degrees.",
 ["A refusal naming the offset, the way dixInterval refuses a negative numerator and names its time.",
  "A NaN angle, a result with an empty field that the angle gather then skips like a seismic null sample.",
  "40 degrees, the angle of the kit's mute, since every trace past it carries exact zeros at the target."],
 "Past a sine of one waldenAngle returns 90 degrees: it neither refuses nor returns NaN. The kit's mute beyond 40 degrees is a property of the gathers, and the engine knows nothing of it.")

q(1, "The pack's gathers carry the kit's mute beyond 40 degrees. On the Ekene table at 1292.000000 ms, between which tabled offsets does Walden's angle pass 40 degrees?",
 "Between 1500 m (31.872141 degrees) and 2000 m (41.065011 degrees).",
 ["Between 2000 m (41.065011 degrees) and 2500 m (49.493998 degrees), so only the 2500 m trace reaches the mute zone.",
  "Between 1000 m (21.859471 degrees) and 1500 m.",
  "Beyond 2500 m, the far offset staying inside the mute."],
 "Walden's angle at the top is 31.872141 degrees at 1500 m and 41.065011 at 2000 m, so it passes 40 degrees between them. At 2500 m it is 49.493998 degrees. The kit's mute comes from the kit's own angle calculation, which the course does not measure.")

q(3, "How does angleGather treat the mute's exact zeros at a sample?",
 "As live samples, entering the bin mean like any other value.",
 ["As gaps, skipped like a seismic null sample.",
  "As empty bins, so that any bin whose far edge passes the mute angle is left blank at that sample.",
  "As missing data, each replaced by the nearest live amplitude on the same offset trace before binning."],
 "A sample that is not finite or is a seismic null is skipped; the mute's exact zeros are live samples, so a bin reaching past the mute angle averages reflection with zeros. That is why the mute angle and the bin edges must be read together.")

q(2, "On gather 5 at 1292.000000 ms, with bin edges at 5, 15, 25 and 35 degrees, what fold and mean amplitude does the far bin, 25 to 35 degrees, carry?",
 "Fold 2, mean amplitude 320.449005.",
 ["Fold 3, mean amplitude 410.433207, the figures of the mid bin from 15 to 25 degrees at the same sample.",
  "Fold 2, mean amplitude 220.203720, the value of the kit's own far stack trace at Ekene-1 at that time.",
  "Fold 13, every offset averaged."],
 "The far bin holds 2 traces with mean amplitude 320.449005 in trace units. 410.433207 with fold 3 is the mid bin, 220.203720 is the kit's far stack trace, and the gather's 13 offsets do not all fall in 5 to 35 degrees at this time.")

q(1, "What does partialStack return over a stated range of angle bins at a sample?",
 "The fold-weighted mean of the bins, empty where no bin has data.",
 ["The sum of the bins' mean amplitudes over the range, so a range of more bins always stacks to a larger amplitude.",
  "The plain mean of the bins, fold ignored.",
  "The fold-weighted mean of the bins, with a zero written wherever no bin in the range carries any data."],
 "partialStack is the fold-weighted mean of the bins at each sample, and it is empty where no bin has data. A sum would grow with the number of bins, a plain mean ignores fold, and writing zeros would make a gap look like a live amplitude.")

q(0, "At 1292.000000 ms, what are the far partial stack from gather 5 and the kit's far stack trace at Ekene-1?",
 "320.449005 from gather 5 and 220.203720 on the kit's trace.",
 ["220.203720 from gather 5, 320.449005 on the kit's trace.",
  "410.433207 and 357.560150, the 15 to 25 degree pair.",
  "483.072830 from gather 5 and 456.803711 on the kit's trace, the near pair that correlates most closely."],
 "Over 25 to 35 degrees gather 5 gives 320.449005 and the kit's far trace 220.203720. The 410.433207 and 357.560150 pair is the mid range and 483.072830 and 456.803711 the near range; over the window the near pair correlates at 0.997076 and the far pair at 0.961871.")

q(3, "At the top of gather 5 the bins of 5 to 15, 15 to 25 and 25 to 35 degrees carry fold 2, 3 and 2. What does usableAngle return at a stated minimum fold of 3?",
 "None.",
 ["25 degrees, the far edge of the mid bin, the one bin whose fold of 3 meets the stated minimum.",
  "35.000000 degrees, because the three bins together carry far more than 3 traces at that sample.",
  "15 degrees, the far edge of the near bin, which is where the count from the nearest bin begins."],
 "usableAngle counts from the nearest bin and returns the far edge of the last bin with at least the stated minimum fold, and none where even the first bin has too few. The near bin has fold 2, so a minimum of 3 gives none even though the mid bin has fold 3.")

q(2, "A study states a minimum fold of 2 at the top of gather 5. What usable angle does usableAngle return?",
 "35.000000 degrees.",
 ["40 degrees, the angle of the kit's mute, which caps how far out in angle any bin can be trusted.",
  "49.493998 degrees, Walden's angle at the gather's farthest offset of 2500 m at the same time.",
  "None, since the near bin's fold of 2 sits exactly on the minimum and the engine needs more."],
 "At a minimum fold of 2 every bin from the nearest outwards qualifies (fold 2, 3, 2), so the usable angle is the far edge of the far bin, 35.000000 degrees; a fold equal to the minimum counts. The mute and the far-offset angle do not enter the rule.")

q(1, "The opening row at 46.700000 ms has no row above it. What does the engine give as its interval velocity?",
 "1500.000000 m/s, its RMS velocity, by the engine's rule for the first row.",
 ["A refusal, since the first row has no shallower row to pair with.",
  "2042.470033 m/s, the interval to the second row, carried upward.",
  "1974.900000 m/s, the second row's RMS velocity, passed up a row."],
 "The first row's interval velocity is its RMS velocity, 1500.000000 m/s. 2042.470033 is the interval from 46.700000 to 330.600000 ms and 1974.900000 is the second row's RMS velocity; the engine does not refuse the first row.")

emit(Q, '/root/qi-wip-qi/banks/qii_m04.json', expect_n=15)
finish()
