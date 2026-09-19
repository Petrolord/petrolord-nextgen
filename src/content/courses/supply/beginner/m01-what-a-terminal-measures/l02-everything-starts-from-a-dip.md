# Everything starts from a dip

{{panel:supply-tank-explorer}}

## A height is the first measurement

Nobody can see a volume inside a closed tank. A gauger lowers a weighted tape until the bob touches the tank floor and reads how high the product stands. That reading is the dip. It is a height, it is read in whole millimetres, and it is the first measured input in every stock figure this tier produces.

A dip on its own says nothing about cubic metres. Turning the height into a volume needs a second input that belongs to the particular tank, its strapping table, and that is the subject of the next module. For now the point is simpler. Everything downstream of the dip inherits it. If the dip is wrong, the volume, the gross stock, the standard stock and the day's gap are all wrong, and nothing later in the chain can tell.

## The AKODO morning

AKODO has three tanks, and each was dipped once this morning.

| tank | product | dip mm |
| --- | --- | --- |
| AK-01 | PMS | 9318 |
| AK-02 | AGO | 5406 |
| AK-03 | DPK | 1847 |

PMS is petrol, AGO is diesel and DPK is kerosene. AK-01 and AK-02 are vertical tanks. AK-03 is a horizontal bullet, and the curve of its shell matters in module two.

A second tape reading is taken at the bottom of each tank: the height of free water standing under the product. It is also a height in millimetres, and module three shows how the engine turns it into a volume and takes it off.

## The engine starts where the tape stops

volumeAtDip is the call that reads a dip against a table. Put a tank to it without a dip, whether the dip is null or simply left blank, and the engine refuses:

REFUSED: No dip reading.

Both cases return the same sentence. A blank box in a form does not become 0 mm, because 0 mm is a real reading: it is the empty tank, and on AK-01's table it reads 0.000 m3. A tank that nobody dipped and a tank that is empty are different facts, and only a tape can say which one you have.

## How far one dip carries

Given its dip, its water cut and its table, AK-01 can be carried as far as a gross observed volume without anything else. When dipToStandardVolume is called with no volume correction factor, the engine still reports what it can and says where it stopped:

gross 3461.489 m3, standard none; note: No volume correction factor supplied, so only the gross observed volume is reported.

That line shows the pattern of the whole course. The engine walks the chain as far as the measured inputs reach and names the first link nobody supplied.

Use the panel to put each AKODO tank at its morning dip and read the volume it returns. Then clear a dip and read what the panel shows in its place.

## Exercise

Read AK-01's line from dipToStandardVolume above: gross 3461.489 m3 and standard none. Say which input the engine had and which it lacked, and what the word none tells you about the standard volume.

Self check: the engine had the dip, the water cut and the table, so it formed the gross observed volume. It lacked a volume correction factor, so the standard volume is reported as none. None means nobody formed the figure; it is a missing value.
