# Water under the product

{{panel:supply-tank-explorer}}

## Free water

The digest states the fact this module rests on in one line: free water sits under the product. It is a layer of its own at the bottom of the tank, with the fuel standing on top of it.

Free water is not stock. But it occupies the bottom of the tank, and the dip is a reading of the liquid height, product and water together. A volume read at the dip alone counts the water as if it were fuel.

## The second reading

So the gauger takes a second height: the height of the water layer above the datum, in millimetres. That height is the water cut.

The AKODO morning carries one water cut per tank beside its dip:

| tank | dip mm | water mm |
| --- | --- | --- |
| AK-01 | 9318 | 212 |
| AK-02 | 5406 | 95 |
| AK-03 | 1847 | 41 |

Like the dip, the water cut is a measured input. The engine does not assume a tank is dry. A stated cut of 0 mm is a real reading, and it removes nothing: on AK-02 at 5406 mm, a cut of 0 mm reads water 0.000 m3, gross 1086.941 m3.

## What the engine does with it

dipToStandardVolume takes both heights. It reads the volume at the dip, reads the volume at the water cut, and takes the second off the first:

gross observed volume = volume at the dip less volume at the water cut

For AK-02 this morning, with the dip at 5406 mm and the water at 95 mm, the engine answers water 19.101 m3, gross 1067.840 m3. The volume at the dip on its own reads 1086.941 m3. That figure includes the water, and the engine reports it separately so you can see both.

The other two tanks read the same way. AK-01, dipped at 9318 mm with 212 mm of water, reads 3542.077 m3 at the dip, 80.588 m3 of water and a gross of 3461.489 m3. AK-03, dipped at 1847 mm with 41 mm of water, reads 52.501 m3 at the dip, 0.341 m3 of water and a gross of 52.161 m3. The morning's total gross observed volume is 4581.490 m3.

The gross observed volume is the volume at the dip less the volume at the water cut, read at the temperature the tank was dipped at. Free water has come off. Temperature has not yet been corrected; that is module four.

## Water is a stock question and a quality question

The engine's job with the water cut is narrow: take off the volume the reading says is water, so the stock figure counts only product. The quality of what arrived belongs to the certificate of quality and to the sibling course `crude`.

Use the panel to set AK-02's water cut to 0 mm and then to 95 mm, and read the water and gross volumes each time.

## Exercise

Read AK-02's figures: volume at the dip 1086.941 m3, water 19.101 m3 and gross 1067.840 m3. Say which of those three is the stock of diesel at observed temperature and what the water figure is subtracted from.

Self check: the gross observed volume, 1067.840 m3, is the diesel stock at observed temperature. The water volume, 19.101 m3, read at the 95 mm cut, is taken off the volume at the dip, 1086.941 m3.
