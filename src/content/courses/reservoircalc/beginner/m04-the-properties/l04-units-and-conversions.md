# Units and conversions

Every quantity in this course has a unit, and the unit is part of the quantity rather than a decoration attached to it afterwards. A number without a unit is not an answer. It is a string of digits that a reader has to guess at, and the guesses available differ from each other by factors of a million.

## The metric chain

Everything up to the last step of module 3 stays in metres and cubic metres, and the units multiply along with the numbers.

A cell is 100 m by 100 m, so its area is 10,000 square metres. An oil column is a length in metres. Multiply an area in square metres by a length in metres and you get a volume in cubic metres. Summed over 169 cells, the gross rock volume is 22,269,035.64453125 cubic metres.

Net to gross, porosity and water saturation are all dimensionless. They are volume divided by volume, so multiplying by them changes the size of a quantity and never its unit. That is why the net volume, the pore volume and the hydrocarbon pore volume are all still in cubic metres. If a fraction you have been handed appears to carry a unit, it is not a fraction and you should find out what it is.

## Million and MM

Reservoir volumes are large, so they are reported with a prefix, and two different prefixes are in play here.

On the metric side the volumes are quoted in million cubic metres. The gross rock volume of 22,269,035.64453125 cubic metres is written 22.269036 million cubic metres. The prefix is a factor of $10^6$ and nothing else.

On the oilfield side the prefix is MM, and it needs explaining because it looks like it should mean two million. It does not. The convention comes from Roman numerals, in which M means one thousand. One M is a thousand, so MM is a thousand thousand, which is a million. That is why gas rates appear as Mscf for thousands of standard cubic feet and MMscf for millions, and why oil in place appears as MMstb.

So 12.139208 MMstb means 12,139,208 stock tank barrels. Roughly twelve million barrels of oil in the ground at Ekene at a contact of 1560 m.

The two prefixes are the same factor of a million, one written as a word and one as a pair of letters. Mixing them up in a sentence is harmless. Dropping one of them is not.

## The barrel conversion

The conversion between the two volume systems is fixed:

$$1 \text{ m}^3 = 6.2898 \text{ stb}$$

A barrel is 42 US gallons, and by that definition one barrel is one divided by 6.2898 cubic metres, which is about 0.159. So a cubic metre is a little under six and a third barrels.

The direction matters and it is easy to get backwards. Going from cubic metres to barrels, you multiply, because a barrel is smaller than a cubic metre and it therefore takes more of them to hold the same oil. Going from barrels to cubic metres, you divide. The check takes a second: barrels are the smaller unit, so the count of barrels must be the larger number.

## The three slips

Almost every unit error in volumetrics is one of three.

**Wrong by a factor of $10^6$.** A prefix was dropped or added. Somebody wrote 22.269036 where the calculation wanted 22,269,035.64453125, or reported cubic metres as though they were million cubic metres. This is the most common error and also the easiest to catch, because the result is absurd. A field holding twelve barrels or twelve trillion barrels is not a field that needs discussing.

**Wrong by a factor of 6.2898.** The barrel conversion was skipped, applied twice, or applied in the wrong direction. This one is dangerous precisely because it is not absurd. A booking six times too small or six times too large still looks like a field, and it will survive a quick glance from someone who is only checking that the number has the right number of digits.

**Wrong by the square of 6.2898.** The conversion was applied in the wrong direction, so instead of dividing by it you multiplied, and the answer is out by that factor twice over. Same problem as above with a bigger multiplier.

A fourth trap is depth units. Well picks in North Sea and North American data are commonly in feet while the map grid is in metres. If a column arrives in feet and is multiplied by a cell area in square metres, the resulting number is not a volume in any unit at all. Convert the depths first, then grid, and never mix the two inside one calculation.

## The reporting rule

Two habits close nearly all of this.

Carry the unit through every line of arithmetic, not just the last one. If you write the units alongside the numbers, an inconsistency shows up at the step where it happens rather than at the end where it is untraceable. This is why the chain table in module 3 gives a unit on every row.

Sanity check the size against something physical before the number leaves your desk. The mean column check from the first lesson of module 3 is one such test, and it caught unit errors specifically because a mean thickness has a range a person can judge. The same applies at the end: twelve million barrels from an accumulation covering 1.69 square kilometres is a modest field, which is what six wells over that area should produce. If the same map had returned twelve billion barrels, the error would be a unit slip long before it was geology.

## Exercise

A summary sheet reads "Ekene, contact 1560 m: 12.139208". Say what is missing, then give the two readings a reader could plausibly take from it and state which one is correct. Then say what factor separates a value in million cubic metres from the same volume expressed in stock tank barrels, ignoring shrinkage.

Self check: the unit is missing. A reader could take it as 12.139208 MMstb, which is correct, or as a reservoir volume in million cubic metres, which it is not, since the hydrocarbon pore volume at that contact is 2.315980 million cubic metres. The two readings differ by more than a factor of five, and nothing on the sheet resolves which was meant. Converting million cubic metres to stock tank barrels means multiplying by 6.2898 and then by $10^6$, so the factor is 6,289,800.
