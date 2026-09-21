# Energy intensity and its peer

`energyEfficiency.energyIntensity` divides a plant's energy by its throughput and, if it is given one, compares the result with a peer. SECTION 24 prints it on the invented AGBOR complex, and the engine attaches two sentences that decide how the result can be read.

{{panel:carbon-abatement-explorer}}

## The streams

Agbor's energy, every figure invented for this course:

| stream | GJ | share |
| --- | --- | --- |
| Fuel gas | 740000.000 | 0.843786 |
| Purchased power | 96000.000 | 0.109464 |
| Imported steam | 41000.000 | 0.046750 |

The throughput is 1240000 tonnes. The peer intensity is 680 MJ a tonne, an invented figure that Agbor has the right to use.

## The result

| output | complete | total GJ | intensity MJ per tonne | versus peer | gap MJ per tonne |
| --- | --- | --- | --- | --- | --- |
| all three streams | true | 877000.000 | 707.2581 | 1.040085 | 27.2581 |
| purchased power blank | false | 781000.000 | 629.8387 | none | none |

With all three streams, the result is complete. The shares are each stream's part of the 877000.000 GJ total: Fuel gas 0.843786, Purchased power 0.109464 and Imported steam 0.046750. Agbor uses 707.2581 MJ a tonne, the ratio to the peer is 1.040085 and the gap is 27.2581 MJ a tonne. Each of those is printed by the engine.

## A missing stream is not compared

With Purchased power blank, the total is 781000.000 GJ and the intensity 629.8387 MJ a tonne, and complete is false. The engine does not compare it with the peer: versus peer none and gap none. The peerNote, verbatim: "Not compared with the peer: a stream is missing, so the intensity is a floor and would flatter the plant."

Read the note's two claims. The intensity is a floor, because energy is missing from the numerator. And a floor compared with a peer would flatter the plant. So the engine prints the floor and withholds the comparison. SECTION 25 lists the rule in force: an intensity with a stream missing is not compared with the peer.

## The peer is the user's

The disclaimer, verbatim: "This is the plant's own energy per tonne of throughput. It is NOT the Solomon Energy Intensity Index, which is a proprietary benchmark with its own standard-energy methodology. Any peer figure compared here is one you supplied and have the right to use."

Two limits follow from it. The engine computes the plant's own energy per tonne and nothing more. And the peer, 680 MJ a tonne here, is an input the user supplies and must have the right to use. The course's peer is invented, and this lesson names no published benchmark figure.

## A throughput is required

The divisor cannot be left out:

REFUSED: A throughput is required.

## Reading the gap

SECTION 24 prints the arithmetic, each step computed here and equal to the engine's figure: the intensity is total GJ x 1000 over the throughput in tonnes, 877000.000 x 1000 / 1240000 = 707.2581 MJ a tonne; versus peer is the intensity over the peer, 1.040085; the gap is the intensity less the peer, 27.2581 MJ a tonne. They are printed only because every stream is present and complete is true. The lab prints no cost and no carbon figure for the gap, and this lesson computes none.

## Energy intensity and carbon intensity

This intensity is energy in MJ per tonne of throughput. The Associate tier read a carbon intensity in tCO2e per barrel of oil equivalent on a named boundary. The two are different quantities with different units, and neither is converted into the other here.

## Exercise

Read the total, the intensity, the ratio to the peer and the gap with all three streams, and the same outputs with Purchased power blank, with the peerNote. Say what the two rows, read with the note, show about why the engine withholds the peer comparison when a stream is missing.
