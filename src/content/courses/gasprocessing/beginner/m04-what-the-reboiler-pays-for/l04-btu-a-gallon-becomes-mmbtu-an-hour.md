# Btu a gallon becomes MMBtu an hour

Two named heat terms have to become a reboiler size. One is charged on the solvent and one on the water, they are added, and then the gallons a day and the clock turn a per gallon figure into a rate.

{{panel:fc-water-explorer}}

## The sum

On OBIAFU the sensible term is 1386.1650 Btu a gallon and the overhead term is 429.6875 Btu a gallon. The two sum to 1815.8525 Btu a gallon, and the sensible half is 0.763369 of that total.

That last figure is worth recording rather than estimating. It is the one comparison between the two heat terms that this course computes for you, and it says that on this stream at this ratio the larger part of the reboiler is doing nothing more interesting than warming glycol up.

## The rate

The loop moves 9215.7553 gallons a day. Each of them needs 1815.8525 Btu. That is a quantity of Btu a day, and a reboiler is specified in MMBtu an hour, so the conversion divides by the hours in a day and by the Btu in a MMBtu.

This module never uses those two separately, so they can only be established as a group. Asked for a gallons a day, a duty a gallon and a duty in MMBtu an hour from the same call, the engine gives a group factor of 24000000. The OBIAFU duty comes out at 0.697269 MMBtu an hour.

## Reading a duty for what it contains

A reboiler duty is the most quoted number in a dehydration package and it is a composite of four separate decisions. The still temperature and the absorber temperature set the sensible term. The circulation ratio sets how much water each gallon carries. The reflux ratio adds its fraction on top. The rate and the ratio together set how many gallons there are.

Quoting 0.697269 MMBtu an hour without those four is quoting an answer with its question removed. Two plants with the same duty can have arrived there by different routes, and the route decides what would happen if anything changed.

## What the duty does not include

It is the reboiler and nothing else. The glycol pump, the gas and glycol exchanger, the flash vessel, the cooling of the lean glycol before it re enters the contactor and the heat already taken out of the gas upstream are all absent. The duty is a firing rate for one vessel.

## Exercise

Add the sensible and overhead terms for OBIAFU, check the sum against 1815.8525 Btu a gallon, and record the fraction of it that is sensible. Then take the gallons a day and the group factor and produce the duty in MMBtu an hour.
