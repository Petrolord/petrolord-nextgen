# The margin

`marginPct` is one number for a whole well, and it belongs to a single station.

{{panel:pd-profile-explorer}}

## What it measures

The margin is the controlling station's ratio expressed as a percentage clear of one. EBOCHA-5 at 3100.0 Mscf/d under Coleman controls at 7500.0 ft with a ratio of 0.9619521855, and the well reports a `marginPct` of -3.80478145 percent. A point check at the wellhead alone, ratio 1.1605604334, would report 16.05604334 percent.

Same well, same day, same gas rate. The margin is not a property of the well. It is a property of the station the well was read at.

## The margin as the well declines

| Gas rate, Mscf/d | Margin, percent | Loaded |
| --- | --- | --- |
| 2400.0 | -25.526282 | true |
| 2700.0 | -16.217068 | true |
| 3000.0 | -6.907853 | true |
| 3100.0 | -3.804781 | true |
| 3200.0 | -0.701710 | true |
| 3450.0 | 7.055969 | false |
| 3700.0 | 14.813648 | false |
| 4000.0 | 24.122863 | false |

The margin moves smoothly with rate even where the loaded flag does not move at all, and that is what makes it the more useful of the two. The flag reads `true` at 2400.0 Mscf/d and still reads `true` at 3200.0 Mscf/d, while the margin walks from -25.526282 to -0.701710 percent and tells you the well is nearly back. One of those two is a trend and the other is a word.

## The mistake

Reading the margin as production. A margin of -3.80478145 percent is not a fraction of the 3100.0 Mscf/d and it is not a barrel count. It is how far one velocity ratio at one depth sits from one. The rate that would close it is not this number times anything, because the critical rate at the controlling station is 3222.613396799 Mscf/d and the well is making 3100.0 Mscf/d against it.

The second half of the mistake is comparing margins across wells that were read at different stations. A 16.05604334 percent margin from a gauge and a -3.80478145 percent margin from a controlling station are not two wells. They are one.

## What it refuses

The margin says nothing about how much of the string is loading. At 2400.0 Mscf/d every station on EBOCHA-5 reads loaded, shallowest at 0.0 ft. At 3200.0 Mscf/d only 7500.0 ft does. Both are one negative number, and the difference between them lives in the station list, not in the margin.

It also carries no correlation label. The same six stations scored under Turner give the same controlling depth of 7500.0 ft and a margin of -19.83731788 percent, and the margin alone cannot tell you which of the two you are holding.

## Exercise

Read the margin on EBOCHA-5 at 3000.0, 3100.0 and 3200.0 Mscf/d and write the three values.

Then say which of the three rates you would call the well healthy at, and what number other than the margin you needed to decide.
