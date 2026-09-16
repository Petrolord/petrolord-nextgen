# Goldens that are not measurements

Every published case behind this course is synthetic. There is an independent oracle written in Python from the same physics, working in SI where the engine works in field units, and no measured pipeline appears anywhere in the course.

{{panel:fc-liquid-explorer}}

## What two implementations can prove

Two people encoding the same physics in different unit systems will disagree the moment one of them makes an arithmetic slip or drops a conversion. That is what these goldens catch, and the small gaps they leave behind are visible in the tables: on one published liquid case the engine returns a Reynolds number of 21519.8423 where the golden returns 21519.8751, and the two friction losses of 11.615250 psi and 11.615228 psi do not share their last digits either.

What a synthetic golden cannot catch is a method that is wrong in both files. If the physics being encoded is the wrong physics, the oracle agrees with the engine and both are confidently wrong together. Agreement between two implementations is evidence about arithmetic. It is not evidence about the world.

## The barrel, and what the goldens settled

The strongest thing these goldens did in this package was arbitrate a disagreement between two modules inside one chain.

A barrel was measured out of each module by asking that module a question about itself rather than by reading either source. From lineHydraulics, as the flow area times the length over the line volume: 5.6145833333333 cubic feet per barrel. From chokePerformance, as the erosional velocity times the area times the seconds in a day over the erosional rate: 5.6145833333333 cubic feet per barrel. The ratio of the two is 1.0000000000000.

They were two different numbers one import apart, inside the single chain this studio composes, until the package gave them one definition. The one it kept is exact by definition rather than by measurement, and both modules' own oracles already worked from it, so the goldens said which half of the disagreement was right before anyone asked them.

## Why that is the right kind of result

The goldens did not prove that the barrel is correct. They showed that two implementations of one chain were using different values, and they pointed at which side to change. That is arbitration between implementations, which is exactly the job a synthetic case can do well.

## The mistake

The mistake is reporting a green golden suite as field validation. It means the engine agrees with an independent implementation of the same assumptions, and upgrading that to agreement with measured pipeline performance changes the claim entirely.

The second mistake is dismissing the goldens for the same reason. They found a real defect in a live chain, and the constant they settled is now shared by both modules.

## Exercise

Say what a synthetic golden can prove and what it cannot, and give a pair of engine and golden figures that do not match exactly. Then give the barrel measured out of each of the two modules with the ratio between them, and explain what the goldens established about the disagreement.
