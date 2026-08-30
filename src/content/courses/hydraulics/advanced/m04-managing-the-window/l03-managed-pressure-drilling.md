# Managed pressure drilling

The fifth lever, and what it changes.

## The equipment

A rotating control device seals the annulus at surface around the drill pipe, so returns come out through a line rather than up an open bell nipple.

A choke on that line applies back pressure, which adds to the pressure everywhere in the annulus.

## What it buys

**Real-time control.** The back pressure can be changed in seconds, which no other lever in this course can.

**Pressure when the pumps are off.** This is the important one. Every other lever produces pressure only while circulating, and the moment the pumps stop the equivalent circulating density falls to the static mud weight.

On a narrow-window well that step is the dangerous moment: it happens at every connection, dozens of times a day.

Managed pressure drilling holds the bottom hole pressure constant across it by adding back pressure exactly as the pump pressure falls.

## The equation it runs on

    bottom hole pressure = hydrostatic + annulus friction + back pressure

Two of the three are what this course computes. The third is the control variable.

So a managed pressure drilling system needs a hydraulics model running in real time, comparing a computed annulus friction against a measured downhole pressure, and adjusting the choke.

That is the most demanding use a drilling hydraulics model gets put to, and it is why the accuracy of the annulus friction calculation matters commercially.

## What it does not fix

The window itself. If the pore pressure and the fracture pressure are 20 kg/m3 apart, managed pressure drilling lets you sit precisely inside a 20 kg/m3 window rather than making it wider.

That is a large improvement and it is not a different problem.

## The related techniques

**Continuous circulation**, which keeps the pumps running through a connection using a special sub, so the equivalent circulating density never falls.

**Dual gradient**, which in deep water lifts the returns from the seabed so that the column above the seabed is seawater.

Both attack the same thing: the difference between the pressures rather than their level.

## What this engine does not have

Any of it. There is no back pressure input, no seabed pump and no continuous circulation.

The engine computes the annulus friction, which is the term a managed pressure system needs, and the control loop is elsewhere.

## Exercise

For the slant well at 0.025 m3/s, compute what back pressure would be needed to hold the bottom hole pressure at its circulating value after the pumps stop.

Express it as a surface pressure in pascals and say whether it is a pressure a choke can hold.
