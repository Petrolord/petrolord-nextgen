# Row and size caps

{{panel:ae-trust-explorer}}

The explorer panels run the engine inside the page, and a call far larger than any evaluation set could keep that page busy for a long time. The engine therefore caps the size of every input, states each cap in its exported `DEFAULTS`, and refuses a call one step above it with a message that names the field and the cap.

## The caps, each probed at the limit and one above

| cap | value | the refusal one above (verbatim) |
| --- | --- | --- |
| `MAX_DOCS` | 5000 | documents has 5001 entries, above the 5000 this engine accepts |
| `MAX_CHARS` | 20000 | text has 20001 characters, above the 20000 this engine accepts |
| `MAX_QUERIES` | 1000 | queries has 1001 entries, above the 1000 this engine accepts |
| `MAX_K` | 1000 | k must be a whole number from 1 to 1000 |
| `MAX_RECORDS` | 5000 | labels has 5001 records, above the 5000 this engine accepts |
| `MAX_FIELDS` | 50 | fields has 51 entries, above the 50 this engine accepts |
| `MAX_ANSWERS` | 5000 | answers has 5001 entries, above the 5000 this engine accepts |
| `MAX_ROWS` | 100000 | yTrue has 100001 rows, above the 100000 this engine accepts |
| `MAX_LABELS` | 50 | labels has 51 entries, above the 50 this engine accepts |
| `MAX_BINS` | 100 | bins must be a whole number from 1 to 100 |
| `MAX_VALUES` | 10000 | values has 10001 values, above the 10000 this engine accepts |
| `MAX_BOOT` | 100000 | nBoot must be a whole number from 1 to 100000 |

## Reading the caps

Each cap was probed twice: at the cap, where the call is accepted, and one above, where it is refused. A cap is inclusive. 5000 documents run; 5001 do not.

The caps trade time for size, and each is set well above what a teaching set or a small evaluation needs. The Ekene corpus has 60 passages against a cap of 5000; the calibration set has 200 rows against 100000; the bootstrap runs 2000 replicates against 100000.

Two caps are worth reading closely because they share a message with a range rule. A k of 1001 is refused with the same words as a k of 0 or 2.5, because all three break one rule: k must be a whole number from 1 to 1000. The bin cap works the same way. The other caps have their own sentence, naming the count that was passed.

`MAX_ROWS` covers two things: calibration rows and kappa rating pairs.

Every refusal starts with the name of the field it refused, so the message also says where to look. The character cap applies to each text on its own, and a passage that breaks it is named by its position in the list:

> documents[0].text has 20001 characters, above the 20000 this engine accepts

## Why a cap belongs in a report

A cap never changes a result. It either lets the call run exactly or refuses it. That makes it the one rule in this module that cannot quietly move a figure, and it is still worth a line in an evaluation report, because a reader who wants to rerun the evaluation at a larger size needs to know where the engine stops.

## Exercise

Open the trust explorer on "Calibration: Brier, reliability table, ECE and MCE" with the Ekene set loaded. Set the bins to 100 and read the result, then 101 and read the refusal. Switch to "A seeded bootstrap of a mean" and set the replicates to 100000, then 100001, and read what the engine returns each time. Finally set the seed to 4294967295, then 4294967296. For every probe, write whether the value was at the limit or across it.
