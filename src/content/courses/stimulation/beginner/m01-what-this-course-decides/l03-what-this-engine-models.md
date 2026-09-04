# What this engine models

Nine calculations, in two families. Knowing which is which tells you what you can ask the app.

## The matrix family

**Hawkins skin.** A damage skin from a permeability contrast and a damaged radius. The published case returns 8.481054145.

**Sandstone planning volume.** How much acid it takes to move the treated front out to a chosen radius, and the skin left behind if that front stops short of the damage. Reaching 0.6 m in the published interval takes 29.546905102 m3 and leaves 1.6218604324326575.

**Carbonate wormhole radius and skin.** In carbonate the acid does not restore permeability, it cuts channels. Pumping 8 m3 gives a wormhole radius of 0.391324751 m and a skin of -1.287406553.

**A matrix rate ceiling.** The highest injection rate that still keeps bottomhole pressure below the fracture pressure. Exceed it and the job is no longer a matrix job.

## The fracture family

**Two dimensional geometry.** PKN and KGD, two classic width solutions. The published PKN case gives an average width of 0.004015981871358954 m at a half length of 150 m.

**Material balance.** What you pump equals what stays in the fracture plus what leaks off. In the published case 209.09714590747427 m3 goes in, 36.143836842230584 m3 stays as fracture volume, and 172.95330906524367 m3 leaks away.

**A pump schedule.** A clean pad followed by a proppant ramp. The published schedule spends a pad fraction of 0.7052381992848291 and places 28915.069473784468 kg.

**A propped pack.** The proppant left after closure, as a propped width and a conductivity.

**A fracture pseudo skin.** The geometry turned back into one number a reservoir engineer can use, -5.3116380662677045 for the published case.

## Why the split matters

The matrix family and the fracture family answer different questions and share almost no arithmetic. The one thing they share is the output: both end in a skin, which is why the two routes can be compared at all.

This tier reads the matrix family and reasons about it. The fracture arithmetic is set out above so you know it exists and know what it produces. Computing it is work for the tiers above.

## Exercise

Sort the nine calculations into the two families without looking back.

Name the single quantity that both families produce, and say why that makes the two routes comparable.

Then say which family you would reach for if a well test gave you a large positive skin, and why.
