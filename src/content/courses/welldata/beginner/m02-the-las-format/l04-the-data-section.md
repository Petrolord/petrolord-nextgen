# The data section

Everything before `~A` is bookkeeping; the data section is the payload. In an unwrapped LAS 2.0 file it is a plain numeric grid: whitespace-separated columns, one column per entry in the `~C` section in the same order, depth first, and one row per depth sample.

## Reading a real row

The reference file `basic_20.las` declares five curves in its curve section:

```
DEPT.M    : 1  DEPTH
GR  .GAPI  : 2  GAMMA RAY
RHOB.G/C3  : 3  BULK DENSITY
NPHI.V/V   : 4  NEUTRON POROSITY
DT  .US/M  : 5  SONIC TRANSIT TIME
```

So every data row must carry exactly five numbers, in that order. Here is the first row of the file:

```
 1500.0000    43.1351     2.1893     0.2338   399.7369
```

Read it across against the curve contract: depth 1500.0 m, gamma ray 43.1351 GAPI, bulk density 2.1893 g/cc, neutron porosity 0.2338 v/v, sonic transit time 399.7369 us/m. That is the entire trick to reading LAS data by eye: the `~C` section is the column key, and the columns never change order mid-file.

The file spans 1500 to 1650 m at a 0.5 m step, which is (1650 - 1500) / 0.5 + 1 = 301 rows. That 301 is one of the six numbers the capstone grades, and now you can verify it from first principles instead of trusting a panel.

## Nulls are numbers in the grid

Missing data is not blank in a LAS file. It is a sentinel number, declared once in the well section (`NULL.   -999.25` in five of the teaching files) and written literally into the grid wherever a value is absent. Somewhere in `basic_20.las` the gamma ray column reads `-999.2500`, and that sample is not a reading of minus nine hundred and ninety nine API units; it is the agreed code for "no reading here".

The parser substitutes the NULL value with NaN, the floating-point not-a-number, as it tokenises. One subtlety is worth respecting: the comparison happens on the full-precision parsed value before any storage conversion, so `-999.2500` in the text matches a declared NULL of `-999.25` exactly. After parsing, every curve is a numeric array in which real samples are finite and absent samples are NaN, which is the representation every downstream computation in this platform expects. The whole next module is about what those NaNs do to counting and statistics.

## A flat stream, reshaped

Here is the engine detail that makes the parser robust: it does not actually read the data section row by row. It reads every numeric token after `~A` into one flat stream, in order, and then reshapes that stream by the curve count. With five declared curves, tokens 1 to 5 are sample one, tokens 6 to 10 are sample two, and so on.

This design buys two things. First, wrapped files come free: whether five values sit on one physical line or are spread over three, the token stream is identical, so LAS 1.2 wrapped data and LAS 2.0 unwrapped data go down the same code path. Second, corruption is detectable by arithmetic: if the total token count is not an exact multiple of the curve count, the file is ragged or truncated, and the parser reports exactly that instead of shifting every later column by one. A silent one-column shift is among the nastiest data corruptions in this business, because every value still looks plausible; it is simply attached to the wrong curve.

Two error rules complete the picture. A token that is not a number at all (a stray word in the data block) raises an error naming its line. And blank lines or `#` comments inside the data block are skipped, matching how real exports sometimes pad their grids.

## What comes out

For each declared curve the parser returns the mnemonic, unit and description from `~C`, plus the samples as a typed array with NaN for nulls, the sample count, the null count, and the first and last finite values. That per-curve summary is exactly what the QC panel in the app renders, and by the end of this course you will read it the way a data manager does: sample counts prove the file parsed to the declared depth range, null counts show coverage, and first and last finite values catch curves that start late or die early.

## Exercise

The file `feet_20.las` declares the same five curves and spans 4900 to 5200 ft at a 2 ft step. Predict its row count from first principles, then check it against the QC panel in the app. Self-check: (5200 - 4900) / 2 + 1 = 151 rows. Then say what the parser reports if one row of that file lost its last value, leaving 754 tokens instead of 755. Self-check: 754 is not a multiple of 5, so it refuses the file as ragged or truncated rather than mis-aligning the columns.
