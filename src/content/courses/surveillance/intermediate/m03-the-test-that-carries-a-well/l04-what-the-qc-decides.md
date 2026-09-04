# What the QC decides

Nothing. `validateWellTests` and `groupTests` live in one file, and neither one asks the other anything.

{{panel:pd-exception-explorer}}

## The QC verdict and the carrying decision are separate

`groupTests` decides which tests are candidates, and it reads `is_valid` and nothing else, dropping a test only when that flag is STRICTLY false. It does not call the QC, and the QC returns no verdict for it to call.

The teaching field OGUTA, invented for this course and neither published nor real, shows the two passing each other. Test g-o9-1 comes out of QC at medium with a `watercut_mismatch`, "Test watercut 39% against 26% in the ledger.", and it carries OGUTA-9 through the whole allocated window anyway: 21 days, a theoretical oil of 19488.000000000 stb and an allocated oil of 20995.477445353 stb.

The one test on that field that the split does drop, g-o17-2, is dropped because it was filed with `is_valid` false, not because QC called it a `short_duration` at medium. The flag on the row decided it, and the flag was set by whoever filed the test. One setting overrides even that. With `includeInvalidTests` true the same 21 days give a theoretical oil of 61028.920833333 stb against 54713.920833333 stb at the default, a last-day oil factor of 1.001040970439 against 1.190463125091, and the `no_test_in_force` diagnostics fall from 57 to 42.

## An empty return has two meanings

The QC returns only the tests that HAVE issues. The published case hands in 7 tests, gets 4 rows back, and the 3 tests with no issue at all are simply absent. There is no count of tests checked anywhere in the object, and QC on an empty test list returns 0 rows.

So an empty array means either every test was clean or no tests ran, and a caller cannot tell which. A dashboard tile reading "no test issues" is true in both cases.

## The mistake

Treating a QC severity as an instruction. `zero_rate` is high on a test that recorded no flow at all, and a high severity is still only a label on a returned row. Nothing downstream reads it, so a test the same file calls high on three codes can go on carrying its well at full weight.

## What it refuses

The QC will not modify a test, will not set `is_valid`, and will not exclude anything from an allocation. It will not tell you which tests it looked at. And it will not distinguish a check that passed from a check that could not run, because both are simply an absent code.

## Exercise

Run the QC over the teaching tests and count the rows returned, then count the tests handed in.

Then say what a caller who saw only the returned rows would have to do to learn how many tests were checked.
