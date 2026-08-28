# Solution gas ratio

How much gas a barrel of oil is carrying, and what happens to it on the way to the tank.

## The definition

Rs is the volume of gas, measured at standard conditions, that comes out of one stock tank barrel of oil when the oil is brought from reservoir conditions to the surface. Standard cubic feet per stock tank barrel.

Both volumes are measured at the surface. That is worth pausing on: Rs is a ratio of two SURFACE volumes, describing a fluid that is in the reservoir. Neither number is a reservoir volume.

## Why it is defined that way

Because those are the volumes you can meter. A stock tank barrel is a barrel in a tank at 60 F and atmospheric pressure, and a standard cubic foot is a cubic foot at the same conditions. Both are countable at surface with ordinary equipment.

A reservoir-condition definition would need the pressure and temperature quoted with every number and would not correspond to anything anybody sells.

## What it does as pressure falls

Above the bubble point Rs is constant at Rsb. The oil holds all its gas and releasing pressure does not change that.

At the bubble point gas begins to come out. Below it Rs falls, and it falls steeply at first because the light components leave readily.

At atmospheric pressure Rs is zero by definition: whatever is left is the stock tank oil, and everything that came out is the produced gas.

So the Rs curve runs from zero at the tank up to Rsb at the bubble point and then flat above it. That shape is the same for every black oil and it is worth being able to sketch.

## The distinction that catches people

**Solution gas ratio** is a fluid property: gas dissolved in the oil.

**Producing gas-oil ratio** is a well measurement: gas produced divided by oil produced.

Above the bubble point they are equal, because the only gas arriving is what was dissolved. Below it they part company: free gas in the reservoir flows preferentially, so producing GOR climbs above Rs and keeps climbing.

The gap between them is the diagnostic. A producing GOR two or three times the solution gas ratio says free gas is flowing, and the material balance course used exactly that signal.

## Ekene

Designed at 400 scf/stb at the bubble point of 2000 psia. Standing on the same fluid description returns 421.94, which is the disagreement the previous module measured, seen once more.

The deck built in the simulation course carries the designed 400, and the correlated value appears nowhere in it.

## Units, and the way to get them wrong

Field practice quotes Rs in scf/stb. Simulation decks in field units often carry Mscf/stb, which is a thousand times smaller, so 400 scf/stb becomes 0.4.

Both are correct and a number that has crossed between them without conversion is out by a factor of a thousand. The check is a sanity one: a black oil holds hundreds of scf/stb, so a solution gas ratio of 0.4 is either Mscf/stb or a fluid that is barely a live oil at all.

## The misconception to avoid

"Rs is how much gas is in the reservoir." It is how much gas is dissolved in the OIL, per barrel of that oil measured at the tank. Gas in a gas cap is not part of Rs, and free gas that has come out of solution is not either. Confusing the fluid property with the field's gas inventory is how a material balance goes wrong in a way that looks like an aquifer.

## Exercise

First, sketch the Rs curve from atmospheric pressure to well above the bubble point, marking the bubble point and saying what is happening on each side of it.

Second, explain in two sentences why the producing gas-oil ratio and the solution gas ratio are equal above the bubble point and diverge below it.
