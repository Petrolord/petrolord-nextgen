# Both sides of every guard

A guard is only understood when both of its sides are known. Knowing that an engine refuses nonsense says nothing about where nonsense begins, and the boundary is the part a designer actually stands on.

{{panel:fc-wall-pig-explorer}}

## The limits are all legal values

Every guard in this engine sits at a value that is itself a real engineering condition.

A resistance sum of zero is a line with no fittings on it. An efficiency of exactly one is the ideal the published forms are written for. A holdup of one is a line running liquid full. A line exactly as tall as it is long is vertical. A corrosion allowance of zero is a line that is not expected to corrode, and a swept volume of zero is a dry line.

None of those is an edge case to be tolerated. Each is a condition somebody will legitimately ask about, so each has to be answered rather than refused.

## The engine, handed the value on each side

| guard | value | the engine |
| --- | --- | --- |
| the resistance sum | 0.000000 | answers |
| the resistance sum | -0.000001 | refuses |
| the absolute roughness | 0.000000 | answers |
| the absolute roughness | -0.000001 | refuses |
| the rise of a liquid line against its length | 100.000000 | answers |
| the rise of a liquid line against its length | 100.000001 | refuses |
| the transmission efficiency | 1.000000 | answers |
| the transmission efficiency | 1.000001 | refuses |
| the liquid holdup | 1.000000 | answers |
| the liquid holdup | 1.000001 | refuses |
| the corrosion allowance | 0.000000 | answers |
| the corrosion allowance | -0.000001 | refuses |
| the swept volume | 0.000000 | answers |
| the swept volume | -0.000001 | refuses |

Seven guards, read twice each. Every one of them includes its own limit and refuses the first step past it.

## Read at the precision of the machine

One guard has been walked to the finest resolution available. On a gas line 1.000000 mile long the engine accepts a rise of 5280.000000000 ft, the vertical case, and refuses the next representable value above it, higher by 9.095e-13 ft.

There is no physical difference between those two lines. The point is that the boundary is exactly where it claims to be, with no slack built in on either side.

## Why one side proves nothing

A guard that refuses its own limit is as wrong as one that accepts nonsense, and it fails in a way that is far harder to notice. Refusing a legal vertical line or a legal full-holdup case produces a complaint about a valid question, and the usual response is to change the input until the engine stops objecting.

That is why both sides are read. Testing only the bad side confirms that a guard exists. Testing both sides establishes where it is.

## The mistake

The mistake is verifying a guard with an obviously absurd value. Passing an efficiency of 50 proves nothing that passing 1.000001 does not prove better, and it leaves the question of whether 1.000000 itself survives.

The second mistake is reading an accepted limit as a recommendation. A holdup of 1.000000 is accepted because a liquid-full line is a real condition to ask about, and accepting the question is not advice to design for it.

## Exercise

Name the seven guards this tier reads on both sides and say what real condition sits at each limit. Then give the accepted and refused values for the efficiency and for the liquid holdup, describe the mile-long gas line walked to the last representable step, and explain why a guard that refuses its own limit is the harder defect to notice.
