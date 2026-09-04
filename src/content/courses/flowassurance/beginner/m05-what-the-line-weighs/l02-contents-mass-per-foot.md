# Contents mass per foot

`contentsMassLbPerFt` takes a bore and a fluid density and returns lbm per foot. It is the circle of the bore times a density, and it is the second and last mass helper in the module.

{{panel:pd-thermal-explorer}}

## The published bore

The published pipe has a 6.065 in bore, which is a cross sectional area of (pi/4)Di2 = 0.2006268247 ft2. The published cooldown case fills it with a fluid at 55.0 lbm/ft3, and the helper returns 11.0344753586 lbm/ft.

That is the same 6.065 in the overall coefficient of this pipe is referred to, and it is not the 8.625 in the coating reaches. A contents mass built on a coated outside diameter would be describing a solid rod of oil the width of the whole line.

## The steel usually wins

On this pipe the steel mass is 1.72116073 times the contents mass. The module header states the reason it bothers to say so: leaving the pipe heat capacity out is "a common and optimistic error: on an insulated small-bore line the steel can hold as much heat as the oil in it".

A design that counts only the fluid on a line like this has left out the larger of the two masses, and every quantity built on it will be short.

## Gas moves the ratio a long way

Teaching line AKASO SPUR is a gas line on a 9.562 in bore, and the contents there are at 8.60 lbm/ft3, which returns 4.2886768072 lbm/ft. Its steel is 64.4900327983 lbm/ft. The larger bore carries far less fluid mass than the smaller published one, because the density fell further than the area rose. AKASO SPUR is a TEACHING LINE, not a published case and not a real line.

## What it refuses

A zero density returns a NaN, and so does a zero bore. Both are the same statement: there is no contents mass to compute, so none is offered. The refusal is a bare NaN with no message attached, because the return is a number and not an object.

## The mistake

Reaching for a density that belongs to another place in the process. This helper wants the density of what is in the line at line conditions. A stock tank density, or a gas density taken at the wrong pressure, produces a clean answer in the right units describing a fluid the line is not carrying. Nothing in the return can tell the difference, because a density is the one input it cannot check.

## What it does not include

Water in the line, sand, wax already on the wall, or a slug that is somewhere else at the moment. One bore, one density, one uniform fill, for every foot of the line at once.

## Exercise

In the panel, take the 6.065 in bore at 55.0 lbm/ft3 and record the contents mass, then set the density to the AKASO SPUR gas value and record it again.

Then say which of the two masses on the published pipe you would expect to dominate, and check yourself against 1.72116073.
