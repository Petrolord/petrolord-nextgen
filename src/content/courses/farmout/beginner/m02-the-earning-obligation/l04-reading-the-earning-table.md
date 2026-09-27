# Reading the earning table

{{panel:farmout-earning-calculator}}

The earning calculator prints one row for each event: its name, whether it is completed, and eleven columns of terms and figures. Every column is a stated input or a return value of the engine. This lesson reads the row for the Ekene Deep well from left to right, so that each later module can point to its column.

## The row

| column | Ekene Deep-1 exploration well |
| --- | --- |
| gross cost | 46000000.000000 |
| share paid | 40.000000 |
| interest earned | 30.000000 |
| held after | 30.000000 |
| promote points | 10.000000 |
| promote ratio | 1.333333 |
| cap state | exceeded |
| farminee pays | 18200000.000000 |
| farmor pays | 14000000.000000 |
| carry | 4400000.000000 |
| share of the gross cost the farminee pays | 39.565217 |

## The stated columns

The **gross cost**, the **share paid** and the **interest earned** are the deal's terms, copied from the box. The engine checks them and computes nothing new here. The column headed "interest earned" is the participating interest this event earns, on top of anything earlier events earned.

## The computed columns

**Held after** is the participating interest the farminee holds once this event vests. With one event it equals the participating interest earned, 30.000000.

**Promote points** and **promote ratio** measure how much more of the well the farminee pays than the participating interest it holds after the event: 40.000000 less 30.000000 is 10.000000 points, and 40.000000 over 30.000000 is a ratio of 1.333333. The next module takes both apart.

**Cap state** reads "exceeded", "exactly", "below" or "none". The Ekene well exceeds its cap, which is why the two payment columns differ from a plain split. Caps are the Professional tier's first module.

**Farminee pays** and **farmor pays** are the two sides' payments for this event. The other party's payment sits in the table below the row.

**Carry** is the part of the farmor's cost share the farminee pays, 4400000.000000 on this well. A later module shows how it sits inside the promote.

**Share of the gross cost the farminee pays** is the farminee's payment over the gross cost, 39.565217 percent here. With no cap it equals the share paid.

## The reasons repeat the row in words

Below the tables, the engine writes one reason line for each event, and it carries the same figures as the row: the gross cost, the share paid, the participating interest held after, the promote, the cap, the two payments and the carry. Inside a reason the engine prints money rounded to the cent with trailing zeros dropped, so the carry reads "4400000" there. When you reason with a figure, take it from the column at six decimals.

## The tiles are for completed events

The tiles under the tables total the completed events only. On the Ekene case the one event is completed, so the "Farminee pays" tile shows the same 18200000.000000 as the row. On a case with an event not yet completed, the row still shows the obligation while the tiles show 0.000000.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "The Ekene Deep well, a gross-cost cap". Read the event row and match each column to the table above. Then find each figure again in the first reason line. Finally switch the start selector to "A third for a quarter" and, for that row, write down which columns are stated inputs and which the engine computed.
