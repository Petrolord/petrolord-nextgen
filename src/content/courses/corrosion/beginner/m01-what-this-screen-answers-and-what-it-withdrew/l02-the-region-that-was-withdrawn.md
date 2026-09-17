# The region that was withdrawn

{{panel:fc-chemistry-explorer}}

The first thing to know about this app is something it declines to tell you. Ask it for a sour service severity region, or for a material recommendation that follows from one, and it answers that neither is provided. That answer is current, permanent and deliberate, and it is the most important sentence in this course.

The reason is worth stating plainly. A curve that carries a standard's name and tells an engineer what steel to buy is making a claim about the standard rather than about the fit. A fit that is out by a factor of two in a number is a tolerance problem and you repair it by measuring. A fit that is invented and then labelled with somebody else's authority is a different kind of thing, because the number is not where the claim sits. The only honest repair available there is to stop claiming it and to say that the thing is not provided.

## The absence is a field rather than a gap

The engine returns `regionProvided` as false and `materialGuidanceProvided` as false on every screening. A caller reading a missing property cannot tell a deliberate refusal from an unset value, so the refusal is published as a value of its own and the studio prints the rows rather than hiding them.

What the sour door does return is a comparison and nothing else. At the shipped studio defaults the hydrogen sulphide partial pressure is 0.051000 bar, which the engine also prints as 0.739699 psia. The screening threshold it is compared against is 0.003500000000 bar, which is 0.050763208303 psia. The stream sits above the threshold, and the engine reports how far above in powers of ten, which at these defaults is 1.163506 decades. The verdict it gives in words is that the stream is above the hydrogen sulphide screening threshold, and it stops there.

## The threshold value itself is held

The engine declares that threshold held, through a field of its own, which means the number has no source anywhere in this repository. Holding a live number in place while saying so is the careful choice here. Moving it to some other unsourced value would repeat the same mistake with the sign flipped, so the number stays, the engine says it cannot vouch for it, and it prints the threshold in both units so nobody has to convert it themselves.

Read the panel beside this lesson with that in mind. It shows the partial pressures, the threshold in both units and the decades above it, and it shows the two provided flags as false. There is no severity region on it and no material guidance on it, because the app carries neither. Two further numbers on the same screen, the boundaries that decide which corrosion product governs, are held in the same way.

## Exercise

Run the shipped case and record the hydrogen sulphide partial pressure of 0.051000 bar, the threshold of 0.003500000000 bar and the reported 1.163506 decades above it. A decade is a factor of ten, so work out for yourself what the decade figure implies about those first two numbers and check whether your reading matches the flag the engine sets. Then write one sentence saying what this screening tells a materials engineer, and one saying what they must go elsewhere for.
