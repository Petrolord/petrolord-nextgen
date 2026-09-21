# No hardware fault tolerance check

A competent verification has two halves. One half asks whether the safety instrumented function achieves the required PFDavg. The other asks whether its architecture is allowed to claim the target SIL at all, given how much redundancy it has and how well its failures are understood. That second half is the architectural constraint, often called the hardware fault tolerance requirement. This engine computes the first half and does not touch the second, and it says so in its own header.

## What the engine declines, and why

| not in the engine | why, from the engine header | what the analyst does instead |
| --- | --- | --- |
| a hardware fault tolerance (architectural constraint) check | the requirement is a normative table of IEC 61511-1 and IEC 61508-2, and the engine does not restate a licensed table it could not check against a public source | checks the architecture against the standard separately; a PFDavg that meets the target does not by itself satisfy the architectural constraint |

Two reasons sit in that row and both matter. The requirement lives in a normative table of a licensed standard, so restating it would copy material this course cites and never reproduces. And there was no public source to check a restatement against, so any table typed here would arrive with nothing behind it. A gate that cannot be validated is a gate this course does not build.

## The scope question underneath it

The routes people argue about, the one that starts from failure mode data and the one that starts from proven in use evidence, sit in the same normative material, IEC 61511-1 and IEC 61508-2, with no public source to check an implementation against. The engine leaves them alone for the same reason it leaves the rest of the check alone.

## What a learner must carry away

A PFDavg that meets the required figure is a necessary condition. It is not a sufficient one. A single channel final element can compute its way to a very low PFDavg on optimistic rates and still be a design the standard will not let a project claim its target SIL for. So the sequence in a real project is: establish the required PFDavg from the layer of protection analysis, verify the achieved PFDavg against it, and check the architectural constraint separately with the standard open. The third step happens outside anything this engine returns.

## This is never graded

No capstone in this course grades an architectural constraint, a hardware fault tolerance number or a route. No bank question asks for one. The subject is taught here as a LIMIT of the tool, so that a learner who passes this course does not walk out believing a green PFDavg is a complete verification. Stating a limit plainly is part of what the tool is for, and a verification note written to this course's standard names what was not checked alongside what was.

## Exercise

Write the three steps of a verification for a safety instrumented function in the order a project performs them, and mark which of the three this engine performs. Then take any subsystem you have computed in this module and draft the one sentence you would add to its verification note recording that the architectural constraint was not assessed by the tool, naming who is to assess it and against which standard.
