# Water under the product

{{panel:supply-tank-explorer}}

## Why a fuel tank holds water

Water finds its way into fuel tanks. It arrives with a cargo, condenses from humid air drawn in through the vents as a tank breathes, and seeps past roof seals in rain. Water is denser than petrol, diesel or kerosene and does not mix with them, so it sinks and collects as a separate layer on the tank floor. That layer is free water.

Free water is not stock. Nobody sells it, and a buyer who received it would reject the load. But it occupies the bottom of the tank, and the dip tape measures the top of everything in the tank, product and water together. A volume read at the dip alone counts the water as if it were fuel.

## The second reading

So the gauger takes a second height. A strip of water finding paste on the bottom of the tape changes colour where it touches water and stays unchanged in product. The line on the paste gives the height of the water layer above the datum, in millimetres. That height is the water cut.

The AKODO morning carries one water cut per tank beside its dip:

| tank | dip mm | water mm |
| --- | --- | --- |
| AK-01 | 9318 | 212 |
| AK-02 | 5406 | 95 |
| AK-03 | 1847 | 41 |

Like the dip, the water cut is a measured input. The engine does not assume a tank is dry. A stated cut of 0 mm is a real reading, meaning the paste found no water, and it removes nothing.

## What the engine does with it

dipToStandardVolume takes both heights. It reads the volume at the dip, reads the volume at the water cut, and takes the second off the first:

gross observed volume = volume at the dip less volume at the water cut

For AK-02 this morning, with the dip at 5406 mm and the water at 95 mm, the engine answers water 19.101 m3, gross 1067.840 m3. The volume at the dip on its own reads 1086.941 m3. That figure includes the water, and the engine reports it separately so you can see both.

The word gross in gross observed volume means product including anything still dissolved or suspended in it, measured at the temperature it was observed at. Free water has come off. Temperature has not yet been corrected; that is module four.

## Water is a stock question and a quality question

A rising water cut from one morning to the next can mean a leaking roof, a seal failing or a wet receipt. The engine's job here is narrower: take off the volume the reading says is water, so the stock figure counts only product. The quality of what arrived belongs to the certificate of quality and to the sibling course `crude`.

Use the panel to set AK-02's water cut to 0 mm and then to 95 mm, and read the water and gross volumes each time.

## Exercise

Read AK-02's figures: volume at the dip 1086.941 m3, water 19.101 m3 and gross 1067.840 m3. Say which of those three is the stock of diesel at observed temperature and what the water figure is subtracted from.

Self check: the gross observed volume, 1067.840 m3, is the diesel stock at observed temperature. The water volume, 19.101 m3, read at the 95 mm cut, is taken off the volume at the dip, 1086.941 m3.
