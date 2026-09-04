# The story so far

A line in operation is one exponential read three ways: forwards to an arrival, backwards to the coefficient a target needs, and in time once the pumps stop. Every number a professional reading produces is one of those three, and none is a verdict.

## The forward reading

Lc is m Cp over U pi D, ntu is the length divided by it, and the arrival is the ambient plus the inlet excess times exp of minus ntu. On the published insulated build at 120000.0 lb/hr and Cp 0.50 through the 6.065 in bore the golden relaxation length is 28308.04630582 ft, and the golden arrivals are 156.177944028181 degF at 5280.0 ft, 95.094251896906 degF at 26400.0 ft and 43.357693533435 degF at 105600.0 ft, at golden ntu of 0.186519406637, 0.932597033183 and 3.730388132730.

Lc is exactly linear in mass rate and in heat capacity, and exactly inverse in U and in the reference diameter.

## The backward reading

`uForArrivalTemp` inverts the same exponential and returns the implied ntu beside the U. Derived on the published fluid over 26400.0 ft, a 120.00 degF target needs U 0.801009837807 Btu/(hr ft2 degF) at ntu 0.559615787935, and the forward profile run on that U arrives at 120.000000000000 degF, a round trip error of 0.0000e+0 degF.

It refuses two targets for two different reasons, in two different messages. At or below ambient: a line cannot arrive above ambient no matter how well it is insulated. At or above the inlet: the fluid already enters below the target, so insulation is not the problem.

## The clock

Lumped capacitance. The time constant is M Cp over U A and the time to a target is that constant times ln of the start excess over the target excess. The published cooldown returns 4.662724855250 hr and a time constant of 3.588690771912 hr from the engine, against golden values of 4.662725032604 hr and 3.588690908413 hr. Derived on the same case, U A per foot is 2.119538792399 Btu/(hr ft degF), M Cp is 7.606369304989 Btu/(ft degF) and the log term of 1.299282984130 makes the no-touch time 1.299282984130 time constants.

## The mass, which is chosen rather than computed

`cooldownTime` has two mass slots and no slot for a coating. On the published liquid-filled case the contents carry 72.534444 percent of the M Cp. On TEACHING LINE AKASO SPUR, a gas line, they carry 27.263524 percent of what those two slots see, and folding its foam and weight coat into the shell slot multiplies both the time constant and the no-touch time by 3.5480816986, worth 23.2173871518 hr.

## The end nobody computes

Every quantity here is an engine output. The temperature each of them is set against is not.

## Exercise

Write the three readings out as three formulas and name the one input that appears in all three.

Then say which of the three you would not report without also reporting what you lumped into it.
