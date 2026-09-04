# A volume is not a rate

A ledger row books what a well made. A producing-day rate says what it was doing while it made it. They are the same number only at a full twenty-four hours, and on one teaching well they move in opposite directions.

{{panel:pd-ledger-explorer}}

## Two quantities off one row

The calendar volume is `oil_stb` off the row, in stb over that row. The producing-day rate is `oilPd`, the same volume scaled to twenty-four hours, in stb/d. `derivePoint` computes both on every point and returns both.

The published row of 2025-01-01 books 800.000000 stb of oil over 24.000000 hours and returns an `oilPd` of 800.000000000 stb/d. The published row of 2025-01-02 books 500.000000 stb over 12.000000 hours and returns an `oilPd` of 1000.000000000 stb/d. The second row made the smaller volume and was performing better while it was open, and no single number carries both facts.

## The well built to price it

The teaching field OGUTA was invented for this course and is neither real nor published. Its well OGUTA-6 was built so that only the hours move: the producing-day oil rate is held at 512.000000000 stb/d on all seven of its recent days while the calendar volume swings by a factor of nearly three.

| Date | hours_on, h | oil, stb | oilPd, stb/d |
| --- | --- | --- | --- |
| 2024-11-14 | 16.5 | 352.000000000 | 512.000000000 |
| 2024-11-15 | 7.8 | 166.400000000 | 512.000000000 |
| 2024-11-16 | 19.2 | 409.600000000 | 512.000000000 |
| 2024-11-17 | 14.1 | 300.800000000 | 512.000000000 |
| 2024-11-18 | 9.4 | 200.533333333 | 512.000000000 |
| 2024-11-19 | 21.6 | 460.800000000 | 512.000000000 |
| 2024-11-20 | 12.3 | 262.400000000 | 512.000000000 |

## The two directions

Over that well's recent window the mean calendar oil volume is 307.504761904762 stb and the mean producing-day oil rate is 512.000000000000 stb/d. Over its baseline window both readings are 502.666666666667, the volume in stb and the rate in stb/d. The calendar volume fell by 38.825312618416 per cent. The producing-day rate changed by -1.856763925729 per cent, which is a rise. Same rows, same seven days, opposite signs.

The baseline pair is one number written twice because every baseline row on that well carries an `hours_on` of 24.000000000000 h, and at a full day the volume and the rate are equal by construction.

## The mistake

Reporting a change in production without saying which of the two quantities changed. Down thirty-nine per cent is true of the calendar volume on those rows and false of the producing-day rate, and the well itself did not decline. The engine does not help: it prints "Oil down 39%: 308 vs 503 stb/d baseline." on those rows, putting stb/d after two means of calendar volumes.

## Exercise

Read the seven OGUTA-6 recent rows in the panel and write down the highest and the lowest calendar oil volume.

Then say what the producing-day oil rate is on each of those two days, and which quantity you would need to decide whether the well wants attention.
