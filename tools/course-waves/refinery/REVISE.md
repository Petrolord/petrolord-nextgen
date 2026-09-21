# refinery REVISE: what a revision writer changes after the extension round (2026-09-19)

The digest was rebuilt on engines e4d3b10 (re-vendor b30406eb). Before any edit
it was byte-identical to the foundation digest, and all eighteen graded values
are unchanged. Then it was extended ADDITIVELY for the writers' gaps
(DIGEST-GAPS.md), with five existing lines changed:

| digest line (section) | was | now | why |
|---|---|---|---|
| header `# ENGINES:` | petrolord-engines 60ee266 | petrolord-engines e4d3b10 | the re-vendor |
| S13 row "hydrotreater typed as shut", margin change | -6653670.78 | -6653670.77 | every printed difference is now the difference of the PRINTED figures (424264.71 - 7077935.48) |
| S13 row "hydrotreater capacity left blank", margin change | 95572.86 | 95572.87 | same rule (7173508.35 - 7077935.48) |
| S13 row "jet floor ... fuel oil floor", margin change | -1148089.06 | -1148089.05 | same rule |
| S14 debottleneck row 420000, change in margin | 59545.40 | 59545.39 | same rule (7077935.48 - 7018390.09); the per-barrel figure 2.9773 is unchanged |

digest: 651 lines / 24 sections before; 730 lines / 24 sections after. No other
existing line moved.

Module name: the academy module is `commercial_trading` ("Commercial & Trading").
No lesson names the academy module (grep for "Midstream & Downstream",
"Midstream and Downstream", "downstream module": 0 hits; the four lessons that
say "downstream units" mean process units downstream of the crude unit and
stay). Nothing to change in lessons for the module ruling.

## Associate (beginner)

MUST FIX: m04 l05 `capital-in-the-construction-years`: its three-year row
(21333333.33 x 3) may now add the total and rule line from S5: "capital /
construction years = 64000000.00 / 3 ... sum to the capital: true", first
producing year 3, 23 years in the streams. Replace any "on the panel" cells with
those figures.

NEW FIGURES MAY BE USED:
- m01 l03 `a-blank-box-is-refused`: S2 now also refuses a blank tax rate and a
  null discount rate in feasibilityEconomics (engine sentence unchanged: "A
  discount rate and a tax rate are needed to value the project.").
- m02 (l03, l04): S3 prints that capital per bpd falls at every step as capacity
  rises (modular true, stick-built true) and total capital rises (true, true).
- m04 (l01, l03, l04, l05): S5 prints how each column is built (revenue =
  1518000.00 x 83.7900 = 127193220.00; crude cost x 76.0000; variable opex x
  3.2000), that every producing year repeats year 2 (true), first and last
  producing years (2, 21), fixed opex starting in year 2, and a table of each
  schedule term left blank reading as the engine's default (annual throughput
  1530000.00, 22 years, year 0 capex 32000000.00 in every row).
- m06 l01, l02: may use any of the above.

## Professional (intermediate)

MUST FIX (quoted changed cells):
- m01 l04 `blank-limits-and-typed-zeros` line 25: -6653670.78 -> -6653670.77, and
  any 95572.86 -> 95572.87, -1148089.06 -> -1148089.05.
- m03 l02 `gross-margin-per-barrel-of-crude` table rows 24, 25, 28 and line 30:
  -6653670.77, 95572.87, -1148089.05. Its exercise (line 40) may now use S13's
  new gross-margin-change table.
- m04 l05 `pricing-a-debottleneck` line 15: 59545.40 -> 59545.39.
- m06 l01 `the-abua-plan-end-to-end` line 48 (reformer sweep): check any quoted
  change in margin against S14 (59545.39).
- m02 l01 `a-unit-with-no-feed` lines 33-35: "bind nothing" is now shown, not
  only stated: S11 adds crude unit utilisation 0.00 percent, margin difference
  2536290.33, and the same configuration with that unit's capacity typed as 0
  giving margin 9614225.81 ("the same margin: true"). Quote those.

NEW FIGURES MAY BE USED:
- m03 (l02, l04), m01 l04: S13's new table, gross margin per barrel and its change
  from the plan as typed under each change.
- m04 l03 `a-stream-valued-through-a-unit` and l01, l02: S14 now derives naphtha
  91.4500 through the reformer (0.8500 x 111.0000 + 0.1000 x 0.0000 - 2.9000) and
  gasoil 94.1016 as the break-even of the partly run Bonny Light (82.5500 cost
  and the printed stream values); and, under the floors change, the crude runs,
  every product volume (jet 324178.57, fuel oil 700000.00), "floor met exactly:
  true", and residue 79.6607 as the same break-even.
- m05 l01 `cargoes-spaced-across-the-period` (and l05, m06 l02): S15's cargo rule
  table (crude run / cargo size 0.8226, 2.7500, 1.5000 -> 1, 3, 2 cargoes; days
  between cargoes 31, 10, 15; the receipt dates).
- m05 l04 `dates-in-every-time-zone`: S16's second table now has all seven zones
  (Europe/London and America/Los_Angeles added, both 2027-03-01, true). The lesson
  may now say both tables cover the same seven zones.

## Expert (advanced)

MUST FIX: none of the quoted figures changed. Lessons quoting 79.2440, 117.8320
and 38.5879 together (m05 l01, l02, l03; m04 l05; m06 l02) must not write a
subtraction of the four-decimal figures as if it were exact: 117.8320 - 38.5879
is 79.2441, the printed pool is 79.2440. Use S23's new nine-decimal table for any
arithmetic (117.831965348 - 38.587936000 = 79.244029348).

NEW FIGURES MAY BE USED:
- m02 (l02, l03, l04): S20's new table of plan and actual unit values and the
  quantity gap per line (Escravos 78.9000 / 80.2000, gap 135000.00; Forcados
  actual unit value 0.0000, gap -400000.00; and the rest).
- m03 l03 and m01 l02: S21's dualLedgerTotals table: plan cost 80049000.00,
  revenue 84825300.00, margin 4776300.00; actual cost 60658650.00, revenue
  60423500.00, margin -235150.00; each "the same margin as reconcilePeriod reads:
  true".
- m04 l01, l02, l04: S22 prints opex 307.5315 = 291.7664 + 15.7651 and the capital
  117831965.35 spread as 58915982.67 in each construction year (unrounded halves
  sum to the capital: true).
- m05 (l01 to l04): S23's nine-decimal table (years 0 to 6) and the rule line:
  taxable income = gross revenue - opex - capex deducted; the loss carried forward
  = the loss carried in - taxable income, never below zero; the tax = (taxable
  income - the loss carried in) x 30 percent once that is above zero.
- m06 l03 `what-is-held-and-what-the-oracles-check` (line 25 already describes the
  unit_run limit): S24 now states it as H3; name it H3 beside H1 and H2.
