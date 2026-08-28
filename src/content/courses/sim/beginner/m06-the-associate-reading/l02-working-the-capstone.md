# Working the capstone

Six numbers, all of them things you read or compute directly from the deck. This lesson walks the mechanism for each and names the mistake most likely to produce a plausible wrong answer.

## What you are given

The Ekene deck: 30 by 30 by 5 cells at 100 m, field units, the five-layer column scaled to a net pay of 34.585155812896204 ft, the SCAL course's Corey set with connate water 0.35 and residual oil 0.25, and the six vertical wells completed through the full column.

{{panel:sim-deck-explorer}}

Every one of the six fields is visible in this panel or computable from what it shows.

## Field 1: the cell count

Multiply the three grid dimensions. The likely mistake is counting COLUMNS rather than cells, which gives 900 and is the number TOPS carries. The check: TOPS has one value per column and PORO has one per cell, so the two counts differ by a factor of the layer count.

## Field 2: the crest depth

The shallowest of the 900 TOPS values, in feet.

Two mistakes. Reading the shallowest LAYER BASE rather than the shallowest top gives a deeper number. And converting to metres gives a number about a third of the right one, which is easy to spot and easy to submit by accident on a field everyone discusses in metres.

The check: the crest must be shallower than the contact, or the field has no oil at all.

## Field 3: the first layer's thickness

The top layer's dz, in feet.

The likely mistake is assuming the five layers are equal, which would give one fifth of 34.585155812896204 and is wrong for every layer. The thicknesses are in the waterflood course's proportions of 18, 22, 16, 14 and 14, so layer 1 takes 18 of 84.

The check: your five thicknesses must sum to the stated net pay, and the second must be the largest.

## Field 4: where SWOF starts

The first saturation in the water-oil table.

The likely mistake is giving the first saturation of SGOF instead, which is zero. Read the table's name before its rows.

The check: this value is the connate water saturation, so it must be strictly between zero and one and it must equal one minus the last SGOF saturation.

## Field 5: where SGOF closes

The last gas saturation in the gas-oil table.

The likely mistake is 1. That is the answer for SWOF and it is the classic axis-closure error: a gas-oil table closes at one minus connate water, because connate water never leaves the rock.

The check: field 4 plus field 5 must equal exactly one. If they do not, one of the two tables has the wrong axis.

## Field 6: connections per vertical well

Count the COMPDAT records for one vertical well, or read k1 and k2 and take the span inclusive.

The likely mistake is off-by-one: k1 = 1 and k2 = 5 is five connections, not four. The check: the total COMPDAT count for the six vertical wells should be six times this number.

## The general advice

Every one of these is a reading exercise rather than a calculation, and every likely mistake is reading the right kind of number off the wrong block. Before submitting, for each answer, name the keyword you read it from. Half the near-misses in this tier come from that sentence not being written.

## Exercise

First, for each of the six fields, write down the keyword you would read it from and one number that would tell you immediately that you had read the wrong block.

Second, apply the field 4 plus field 5 check and confirm it gives exactly one. Then state what a result of 0.9 would tell you about which table to inspect.
