# The story so far

Five modules, one sheet, and the side of the well it is written on.

## The claim

The kill sheet is written on the drill pipe side because the drill pipe side is calculable, and the choke is used to make the annulus follow.

## What each module established

**Module 1.** Nine inputs, six of them known before the kick, and four outputs plus a schedule. The ICP is a sum and is exact; the FCP is a scaling by the mud weight ratio and is an approximation. The schedule is a straight line from one to the other over the strokes to the bit, and it is linear because strokes measure volume and volume is what displaces. After the bit the pressure is held constant for bottoms up, which is about three quarters of the operation.

**Module 2.** The influx height is the pit gain over the annulus capacity at the bit, and the influx density is the difference between the two shut-in gauges over that height. Both are inferences and the second is two deep. The classification into gas, liquid and mixed uses thresholds of 480 and 960 kg/m3, which are conventions in this engine. And one of the two published scenarios is NAMED gas and computes as a liquid, because its two gauges differ by only 900000 Pa over a 221.8482706948928 m column.

**Module 3.** Hold the bottom hole pressure constant, and watch the DRILL PIPE gauge to do it, because the string is the side whose contents are known. The choke is the only control, it has a transit delay, and it behaves differently once gas reaches it. Pump rate changes are made holding the CASING gauge constant, which is the one reversal of the usual rule.

**Module 4.** A pressure above the schedule is a choke too closed or a restriction in the string, and the casing gauge separates them. Below it is a choke too open or a washout, and the same check applies. In both cases correcting the gauge with the choke makes the well worse, because the gauge was right and the interpretation was wrong.

**Module 5.** Two checks: an independent implementation agreeing to better than 1e-6, and a hand-built example with round numbers whose six main answers are each one line of arithmetic. The second is the stronger claim, and neither says anything about the four assumptions both share.

## The numbers to carry

- ICP is the slow circulating rate pressure plus the SIDPP, exactly.
- FCP is the slow circulating rate pressure times the kill mud over the original mud, approximately.
- The schedule covers about 0.26 of the total strokes on both of these wells.
- The hand example: 4000 strokes to the bit, 12000 bottoms up, a 200 m influx and 9806650 Pa of MAASP.
- Its influx classifies as mixed at 894.0851361066216 kg/m3, which is the middle branch neither well exercises.

## The one sentence

The sheet computes the side of the well it can and leaves the other side to a person with a choke, and every diagnosis during a kill is a comparison between the two gauges.
