# The redundancy that checks itself

The bore is arithmetically the outside diameter less two walls, so carrying all three in every row is redundant on purpose. That redundancy is the only self check the table has, and there is no Python referee for `pipeSchedule.js` anywhere.

{{panel:pd-trunk-explorer}}

## Run the check exactly as the header describes it

The module header says a transcription error in any one of the three numbers makes the outside diameter less two walls fail to equal the bore. Run that as strict equality in double precision across all 12 rows and 1 of them already fails.

| Row | od, in | wall, in | Published bore, in | od less two walls, in | Residual, in |
| --- | --- | --- | --- | --- | --- |
| NPS 4 schedule 80 | 4.5 | 0.337 | 3.826 | 3.826 | 0.0000e+0 |
| NPS 6 schedule 40 | 6.625 | 0.28 | 6.065 | 6.0649999999999995 | -8.8818e-16 |
| NPS 6 schedule 80 | 6.625 | 0.432 | 5.761 | 5.761 | 0.0000e+0 |

The failing row is not a bad row. Its residual of -8.8818e-16 in is the last bit of a double, and it is the largest residual anywhere in the table. Every other row of the twelve is exactly zero.

## What the gate runs instead

The shipped assertion does not use equality. It uses a closeness test at three decimals, which passes anything within 5.0000e-4 in of the published bore. That band is 5.6295e+11 times wider than anything the table actually needs. Type a bore four ten-thousandths of an inch wrong on NPS 6 schedule 40, 6.0654 in where the row says 6.065 in, and the gate still passes.

## The size of the hole

A band of five ten-thousandths of an inch admits a real transcription error larger than the redundancy exists to catch, which is the one thing the redundancy was put there to do. A strict check at 1e-12 in would be true of every one of the twelve rows and is twelve orders stricter than what runs today. This is also the loosest assertion in the gate file, and since no oracle imports this module, it is the only thing standing behind the table.

## The mistake

Seeing -8.8818e-16 in and reading it as a defect in the data, then widening the tolerance until the noise disappears. The noise is floating point and it is one bit wide. The tolerance chosen to hide it is 5.6295e+11 times wider than that bit, and a check whose band is larger than the error class it hunts is not a check.

## Exercise

In the panel, compute the outside diameter less two walls for NPS 6 schedule 40 and write down every digit you get.

Then say which of these two a three decimal closeness test would catch: the residual of -8.8818e-16 in, or a bore typed as 6.0654 in.
