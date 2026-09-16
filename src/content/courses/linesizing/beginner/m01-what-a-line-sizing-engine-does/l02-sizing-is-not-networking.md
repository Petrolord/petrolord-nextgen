# Sizing is not networking

This engine sizes ONE line. A system of lines that share a header is a network solve and lives in engines/production/networkSolve.js. Knowing which of the two a question is asking for comes before any arithmetic.

{{panel:fc-liquid-explorer}}

## One pipe, one pressure drop

The OGBIA call takes a rate, a bore, a length, a density, a viscosity and a roughness, and returns what that pipe spends: 25.660631 psi at 2.244621 ft/s. Every input describes the one pipe, and the rate is handed to it rather than worked out by it.

That is the whole shape of the method. Nothing in it decides how much flow goes down this line as opposed to another one, because nothing in it knows another line exists.

## What a network does instead

When several lines meet at a header they share a pressure, and the split between them is unknown until the pressures balance. That is a solve over the whole system, and it is a different engine. Handing this one a rate per line is the caller asserting the answer that a network solve would have produced.

## The other seam: two phases

The multiphase half is not in this engine. Two-phase pressure drop, flow regime and holdup are the Suite Beggs and Brill correlation, which is app code. Wherever a holdup is needed here the engine takes it as an INPUT.

That word is the seam worth seeing. A holdup arriving as an argument is a measurement or an assumption somebody else made, and the engine will use it without ever forming an opinion about it. It will size a line around whatever fraction it is handed, and the answer inherits that assumption whole, which is why the word INPUT is worth reading twice.

## Where the liquid rates are taken

Liquid rates in this engine are at LINE conditions, the dead-liquid case downstream of separation. A live-oil flowline upstream of separation carries full PVT, with gas coming out of solution as the pressure falls, and it belongs elsewhere.

So the 12000.000000 bpd of OGBIA crude is 12000.000000 bpd of liquid in the pipe at 54.500000 lb/ft3. It is not a stock tank figure waiting to shrink, and reading it as one puts the wrong volume through the wrong area.

## The mistake

Using a single-line drop as a network answer. The arithmetic is sound and the result is a real number, so nothing objects. What has gone missing is the question of whether that line was ever going to carry the rate it was handed.

## Exercise

Name the engine a shared-header problem belongs to, and say what this one would do if handed that problem. Then say where two-phase pressure drop lives, what this engine does with a holdup, and at what conditions its liquid rates are taken.
