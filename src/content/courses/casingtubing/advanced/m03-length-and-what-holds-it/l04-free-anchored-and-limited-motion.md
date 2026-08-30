# Free, anchored and limited motion

Three completion architectures, and this engine models one and a half of them.

{{panel:ct-tubing-explorer}}

## The three

**Free motion.** The tubing ends in a seal assembly that slides in a polished bore. It moves as much as it likes, up to the length of the bore, and it transmits essentially no axial force to the packer.

**Anchored.** The tubing is latched to the packer and cannot move at all. Every prevented length change becomes a force.

**Limited motion.** The tubing can move within a range and is stopped at the ends of it. Below the limit it behaves like a free string, and at the limit it behaves like an anchored one.

## What the engine computes

Both endpoints and neither middle.

    hasPacker: true   ->  the piston force is computed
    hasPacker: false  ->  the piston force is zero

and the length changes are always computed as though the string were free.

So the force column is an ANCHORED answer, the length column is a FREE answer, and there is no limited-motion mode.

## Which is the right reading for a real completion

Take the free length change first. If it is inside the stroke, the string never reaches its stop, so the free reading is right and the packer force from these three mechanisms is small.

If the free length change EXCEEDS the stroke, the string reaches its stop and from that point on it behaves as anchored. The force is then somewhere between zero and the fully anchored number, depending on how far past the stop it wanted to go.

The engine reports the fully anchored force in both situations, which is conservative in the second and pessimistic in the first.

## The three cases read this way

**Production heating.** Free length 0.8947604591459051 m against 1.5 m of stroke, so the string never reaches its stop. The reported 123684.94705447978 N of compression is therefore an overstatement of the force actually reaching the packer.

**Injection cooling.** Free length minus 1.81047908170819 m against 1.5 m, so it strokes out with 0.31 m to spare. It DOES reach the stop, and the reported 250266.9927748846 N is the right kind of answer.

**Stimulation.** Free length minus 3.3451361131262445 m, more than twice the stroke. It reaches the stop early in the event, and the reported 462406.42264968524 N is close to real.

## The design point

A seal assembly long enough to absorb the movement converts a force problem into a non-problem, and it costs almost nothing.

That is why free-motion completions are common, and why the first question about a packer force calculation should be whether the string reaches its stop at all.

## Exercise

For the production heating case, say what the reported packer safety factor of 5.416989018921467 actually means, given that the string does not reach its stop.

Then say what it would mean if the same case were run on a latched packer.
