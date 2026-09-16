# Goldens that are not measurements

Every published case behind this course is synthetic. There is an independent oracle written in Python from the same physics, working in SI where the engine works in field units, and no measured pipeline appears anywhere in the course.

{{panel:fc-liquid-explorer}}

## What two implementations can prove

Two people encoding the same physics in different unit systems will disagree the moment one of them makes an arithmetic slip or drops a conversion. That is what these goldens catch, and the small gaps they leave behind are visible in the tables: on one published liquid case the engine returns a Reynolds number of 21519.8423 where the golden returns 21519.8751, and the two friction losses of 11.615250 psi and 11.615228 psi do not share their last digits either.

What a synthetic golden cannot catch is a method that is wrong in both files. If the physics being encoded is the wrong physics, the oracle agrees with the engine and both are confidently wrong together. Agreement between two implementations is evidence about arithmetic. It is not evidence about the world.

## The barrel, measured out of two modules

A barrel is measured out of each module by asking that module a question about itself rather than by reading either source. From lineHydraulics, as the flow area times the length over the line volume: 5.6145833333333 cubic feet per barrel. From chokePerformance, as the erosional velocity times the area times the seconds in a day over the erosional rate: 5.6145833333333 cubic feet per barrel. The ratio of the two is 1.0000000000000.

The figure both of them return is exact by definition rather than by measurement: forty-two gallons of two hundred and thirty-one cubic inches each, over the seventeen hundred and twenty-eight cubic inches in a cubic foot. Two modules inside one chain hold it to every digit the print carries, and each of their own oracles works from that same definition.

## Why a measurement like that is the right kind of result

A golden cannot prove that a barrel is correct. What it can do is set two implementations of one chain against each other and say whether they agree, which is arbitration between implementations and is exactly the job a synthetic case does well. A constant quoted identically by two modules has been checked against the other module rather than against a source.

## The mistake

The mistake is reporting a green golden suite as field validation. It means the engine agrees with an independent implementation of the same assumptions, and upgrading that to agreement with measured pipeline performance changes the claim entirely.

The second mistake is dismissing the goldens for the same reason. They are what makes two independent implementations of one chain comparable at all, and the constant both modules quote is the one their own oracles work from.

## Exercise

Say what a synthetic golden can prove and what it cannot, and give a pair of engine and golden figures that do not match exactly. Then give the barrel measured out of each of the two modules with the ratio between them, and explain what a golden can and cannot establish about a constant two modules share.
