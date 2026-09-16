# Two machines and two modules

This course is about two rotating machines and the two engine modules that size them. A pump raises the pressure of a liquid and a compressor raises the pressure of a gas, and the engines answer different questions about each because the two fluids behave differently.
## The two modules, and how big they are

The pump work lives in engines/facilities/pumps.js, which carries 14 exports. The compression work lives in engines/facilities/compression.js, which carries 8 exports. Between them the two modules hold 22 exported functions, and the counts are read off the modules themselves rather than remembered.

Neither module stands alone. compression.js takes its gas constant, its molecular weight of air and its Rankine offset from engines/production/gasProperties.js, it takes the compressibility validity window it works inside from engines/facilities/separatorSizing.js, and it takes its two power packagings from lib/units/fieldUnits.js. pumps.js reads that same units file. One constant in one place, used by both machines.

## The pump chain, in the order it runs

Catalogue points give a curve. A friction head at a stated flow gives a system curve. The two cross at exactly one flow. The power, the suction margin and the operating region are all asked THERE, at that crossing, and nowhere else.

That last sentence is the whole tier. A pump has no operating point until it is connected to something. The pump curve says what the machine can make and the system curve says what the piping demands, and neither on its own has a flow to quote. The duty is solved as their intersection, which is why every answer that follows it moves when the system moves.

## The compressor chain, in the order it runs

A pressure ratio and a gas give a stage. Two limits give a stage count. The stages chain into a train with cooling between them. The gas is compressible, so a stage cannot be described by a curve somebody types in, and every answer comes out of a thermodynamic path instead of an intersection. That work belongs to the Expert tier of this course.

## Where each one runs live

Both chains run in shipped applications: the pump chain in the Pump Station Designer, the compression chain in the Compressor Station Designer.

## The mistake

Treating a pump curve as an answer. A catalogue curve is one half of a question. Quoting a flow off it, or quoting the head at the flow you hoped for, produces a number that no system has agreed to. The engine will not do this, and its refusals in this module are mostly refusals to answer half a question.

## Exercise

Name the two engine modules, give the export count of each, and say which third module supplies the power packagings both of them use. Then write the pump chain in order, from catalogue points to the operating region, and say at which flow the power and the operating region are asked.
