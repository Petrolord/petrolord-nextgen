# supply REVISE: what the extension round changed, and what each lesson must do

The digest was re-cut on engines e4d3b10 (MD3-1, re-vendored as f45ce066) and
extended to close DIGEST-GAPS.md. **634 lines to 712 lines, 24 sections either
side. All eighteen graded values are unchanged** (fields.json and capstone.json
are byte-identical to the foundation's).

## Existing digest lines that CHANGED (two, and only two)

1. Header `# ENGINES:` now reads e4d3b10 (MD3-0 and MD3-1). No lesson quotes it.
2. SECTION 1, the forecourt and rack line, now ends `agree: true`. It read
   `false` because the dump fed stationSizing's rounded outputs back into
   rackQueue. The comparison now uses the station's own unrounded inputs, and a
   new line prints what the rounded inputs give (0.688454 against 0.688546).
Every other change adds a line or a table row. The `cover days | 1.04` row
is unchanged, and a formula sentence follows it.

Lesson m06 l04 of the Expert tier was edited in this round for the module ruling
(line 3 names the Supply Chain & Logistics module; line 19 reads "Neither this
course nor the two Commercial & Trading courses teach or compute ...").

## THE ARITHMETIC RULE (binds every revision)

A printed sum or difference that the engine computed from unrounded figures can
disagree with the arithmetic of the printed roundings in the last decimal. The
digest now says so where it happens: SECTION 3 (difference column), SECTION 5
(AK-03's volume less water against its gross) and SECTION 6 (the three
standard volumes add to 4499.453, the unrounded total prints 4499.452). No
lesson, exercise or question may ask the learner to do that arithmetic. Quote
the printed result.

## Associate

- **m01 l01**: SECTION 1 now lists function and constant names separately:
  terminalDepot 8 functions, 0 constants; fuelPricing 9 functions, 8 constants.
  Use these lines for any count.
- **m02 l04**: optional. AK-02 and AK-03 dipped 10 mm above their last entries
  now print the same refusal (new table in SECTION 4).
- **m02 l05**: keep quoting 0.120 as printed. Add that the column is computed
  from unrounded volumes. Check that the exercise and the self check never ask
  for 0.341 less 0.220.
- **m03 l04, m06 l01** (line 39, "52.161 m3 is the volume at the dip less ..."):
  state it as the engine's rule. Do not present 52.501 less 0.341 as producing
  52.161; cite the new SECTION 5 note.
- **m04 l05, m06 l01**: where the total standard volume is read, add the SECTION
  6 sentence: the printed standard volumes add to 4499.453 and the day closes
  on 4499.452. No exercise sums the three.
- **m05 l01, m05 l04**: throughput is now printed, 6182.500 m3 (SECTION 7). The
  tolerance lesson can quote it as the base of the tolerance.
- **m05 l05, m06 l02**: the nine days' cumulative throughput is now printed,
  55085.000 m3. A threshold table shows the prompt printed at a run of 4, 5 and
  6 days and not at 2 or 3. Replace any stated threshold with a reading of that
  table.

## Professional

- **m01 l01** (line 29) **and m01 l05**: a load time of 0 minutes is now refused
  with the engine's "Arrival rate and load time are both needed." (new row in
  the SECTION 10 refusal table; SECTION 23 lists it as an MD3-1 rule).
- **m01 l04**: Erlang B is now printed. The engine does not export it, so the
  digest derives it from the engine's Erlang C and says so: 0.270685 against
  the Erlang C of 0.787753 on the IBAFO rack (SECTION 9). A load-minute sweep
  carries a B column (SECTION 10). Quote it as derived.
- **m02 l01**: the mean wait of a truck that does queue is now printed:
  47.2652 / 0.787753 = 60.0000 minutes. Use it to show what the engine's
  average includes. The load-minute sweep (16 to 26 minutes) is new too.
- **m03 l02**: a new sentence gives the ullage rule (tank by tank, never below
  zero).
- **m03 l04**: with no daily throughput, turns a year now read none, like days
  of cover (MD3-1). If the lesson says anything about a missing throughput,
  quote the new line.
- **m04 l01, m04 l04**: a blank throughput or fee is refused ("Throughput and
  the throughput fee are both needed for the money answer."). A blank fixed
  cost gives margin 14388.00 USD with assumedZero naming the fixed cost (new
  table, SECTION 13). m04 l04 line 39 ("A blank read as zero ...") must say
  that the engine names a zero it assumed.
- **m05 l02**: every cost line at 156 km and at 468 km is now printed.
- **m05 l03**: a new sentence says driverCostPerTrip defaults to 0 in the
  signature, which explains the left-out row.
- **m05 l05**: if the lesson quotes the SECTION 1 agreement, it now reads true.
  The rounding note may be used.
- **m05 l06** (line 32): add the cover days formula (usable litres / litres a
  day). The engine rounds this one to two decimals, which is why it breaks the
  header's four.
- **m06 l02**: the forecourt's 33000.00 litre delivery is the lane's payload,
  and the station checks the payload loaded. The 32901.00 litres
  delivered after the transit loss do not enter the check (new SECTION 16 line).

## Expert

- **m02 l05**: add "a rate typed 0 is a rate". Duty typed 0 is complete true and
  duty blank is complete false; both total 25114857.82 USD. Also add the full
  less the floor: 26513943.86 - 24774210.79 = 1739733.07 USD (printed
  arithmetic of printed figures).
- **m03 l04** (line 30, "It touches the lines charged at discharge"): widen the
  statement. The engine charges every per-quantity line on the bill-of-lading
  quantity, including the per-litre regulatory line (109854.60 USD on
  45772751.75 litres) and the port line (SECTION 19). H1 names the discharge
  charges, and the same contract question applies to every per-quantity line.
- **m04 l02**: the VAT-on-landed build-up (1066.7292) is complete true.
- **m05 l01, l02, l04**: say the exchange rates swept are invented. The bracket
  solveCrossing searched is 1200.0000 to 2100.0000. A new table gives the
  landed cost, the Government share and the pump price at each rate.
- **m06 l02**: add the three MD3-1 rules from SECTION 23 (zero load refused;
  throughput and fee required, blank costs named; no turns without
  throughput).
- **m06 l04**: done in this round (module ruling).

## Not filled, reported

A missing ocean loss is read as zero loss by landedCost (complete true). This
is candidate finding F-R4 in RECON.md section 8. It is not printed, so no lesson
may state what a missing ocean loss does.
