# Two kinds of cell on two boxes

Induced gas flotation and dissolved gas flotation are sold as two different machines, and in a studio they are usually two entries on a menu. In this module they are the same model, given different numbers.

{{panel:pw-device-explorer}}

## What the two machines actually are

INDUCED GAS FLOTATION entrains coarse bubbles mechanically. An impeller or an eductor pulls gas into the water and shears it into bubbles, and the gas rate is high because that is how the machine works.

DISSOLVED GAS FLOTATION saturates water under pressure and then releases it. Gas comes out of solution as very fine bubbles, and the gas rate is low, because only what was dissolved is available.

Those are the two real differences: bubble size and gas rate. Everything else about the two cells is the same physics of bubbles rising through water and intercepting oil.

## The two presets

| preset | gas ratio | bubble micron | superficial gas m/s | cut micron |
| --- | --- | --- | --- | --- |
| induced gas | 0.2 | 300 | 0.006440457549 | 17.235518 |
| dissolved gas | 0.03 | 80 | 0.000966068632 | 6.128184 |

The dissolved cell cuts 2.812500 times finer on 0.150000 times the gas. Both of those figures are derived, the pairs on those two rows divided.

That is a real engineering statement and the model earned it. The dissolved cell is working at 0.150000 times the gas and still reports the finer cut, which the interception law makes sense of: the rate carries the inverse cube of the bubble diameter and carries the gas rate only once, so bubble size is the stronger of the two levers by a wide margin.

## Why this is a test of the model rather than of the menu

Here is the point of the lesson. A model in which the bubble size could not move the cut would make these two presets the SAME DEVICE behind two menu entries, and no amount of menu would change that.

So a reader handed a studio with an induced gas button and a dissolved gas button has a question to ask before trusting either: which inputs differ between them, and does the model use those inputs? If the answer is a label and a different picture, the two buttons are decoration.

This one uses them. The bubble size enters the interception rate through its cube, the gas rate enters through the flux, and both of those are on the return so a reader can see which one moved.

## What a preset is worth

A preset is a convenience and never an authority. Both rows above are the same function called twice, and a caller with a real bubble size distribution from a vendor should type it rather than press either button.

It is also worth remembering what neither preset carries. Both rows use the module's declared attachment efficiency, which is the one calibration in this device and has no derivation behind it, so the absolute level of both cut sizes rests on a chosen number while the comparison between them rests on the interception law.

## Exercise

State the two inputs that separate a dissolved gas cell from an induced gas one in this module, and say which of them the interception rate is most sensitive to.

Then describe the test you would run on any studio with two device presets to find out whether they are two devices or one.
