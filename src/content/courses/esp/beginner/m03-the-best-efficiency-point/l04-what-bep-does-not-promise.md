# What BEP does not promise

Six things the best efficiency point is routinely assumed to guarantee, and does not.

{{panel:pd-stage-explorer}}

## It is not the most head or the least power

On the published golden vendor curve the BEP head is 26.992525 ft, while head at 1500 bbl/d is 31.985714 ft. Head falls monotonically across the published range, so the BEP head is never the tallest.

Brake power per stage on a specific gravity of 1.00 runs 0.64381596 hp at 1500 bbl/d and 0.75437842 hp at 3500 bbl/d, climbing the whole way. Best efficiency is not least power, and a motor sized on the assumption that it is comes up short.

## It is not the vendor's number

The sheet reports 74.00 percent at 2500 bbl/d. The engine reports 0.739054805 fraction at 2635.0000 bbl/d, because it takes the peak of a cubic fitted through five points rather than the tallest of the five. The fit reads 0.73657143 fraction at the vendor's own best rate.

## It is not the true peak

`bepOf` is a 400 step scan across the published range, so the rate is quantised to 5.0000 bbl/d on this curve. Every reference stage shows the same effect: generated with BEP rates of 1000, 2500, 4000 and 7000 bbl/d, they come back at 1001.1250, 2498.7500, 4002.0000 and 7001.5000 bbl/d.

## It does not promise the reading is trustworthy

Head and efficiency are transcribed separately, and the BEP search reads only efficiency. On the teaching curve BRASS-11, a mild head error moves the BEP head from 26.992525 to 26.041925 ft while the BEP rate stays 2635.0000 bbl/d and the fit raises no warning, its rmse of 0.58797473 ft sitting below the 0.640000 ft threshold. Even the decimal slip version, which does raise a warning, returns a BEP rate of 2635.0000 bbl/d.

## It does not promise `region` means what you think

The band around the BEP decides `region` only when the duty is inside the published range. Outside it the range alone decides, and the BEP is not consulted. Reference stage ref-540-2500 returns `upthrust` at 3350 bbl/d with inside the published range true, and `upthrust` again at 3800 bbl/d with it false. The word is the same and the evidence behind it is not.

## The mistake

Designing to the BEP rate and treating everything that follows as protected by it. The BEP fixes one reading on one of three curves, scanned on a grid, from data nothing has checked, and it labels a band that stops describing anything once the duty leaves the published range.

What it does honestly promise is the efficiency: 0.739054805 fraction is the largest value the efficiency fit takes anywhere on the grid it was scanned across, and no other rate on that curve returns more.

## Exercise

Read the BEP rate, head and efficiency, then read head at 1500 bbl/d and brake power at 3500 bbl/d.

Write down the one thing in your readings that the BEP genuinely maximised, and one thing you might have assumed it did.
