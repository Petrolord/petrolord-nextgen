# From release to harm

{{panel:cq-release}}

{{panel:cq-fire}}

{{panel:cq-harm}}

The three tiers of this course each answered one question. How much gets out and where does it go; what does the fire radiate; who is hurt. A real consequence study asks all three in a row, and the answer to each becomes an input to the next. This lesson runs one chain end to end on the teaching streams, one engine call at a time, and reads what each step hands on.

## One chain, four calls

The chain, on the teaching streams:

| step | engine call | what it returns |
| --- | --- | --- |
| the release | the AMENAM gas line at 2e6 Pa through its 0.025 m hole | 1.032722 kg/s, CHOKED |
| the plume | that rate as a sustained carbon monoxide release in the UBIT wind of 3 m/s, class F | 4582.243793 mg/m3 at ground level 200 m downwind |
| the exposure | that concentration held for 30 minutes (stated) on the pb-carbon-monoxide preset | a probit of 4.431141 |
| the harm | the probit through the standard normal CDF | a probability of 0.284726 |

Each step is one engine call, and each carries its basis: the model, its source and its units. A consequence note carries every one of them.

## What each hand-off decides

The release is choked, so its mass rate is linear in the upstream pressure. If the line pressure is uncertain, that uncertainty passes straight through to the plume.

The plume step makes two choices the note must defend. Class F, the stable night-time class, is the one that keeps a plume thin and near the ground, and at 500 m it gave the highest ground level concentration of the six classes in the Associate tier's plume table. And the release is treated as sustained and ground level on the centreline, which puts the receptor where the concentration is highest.

The exposure step chooses a time and a preset. Thirty minutes is stated, and it enters the toxic load to the first power. The pb-carbon-monoxide preset is the one Purple Book toxic preset with a published worked case behind it; like every Purple Book preset it is a teaching comparison in this course, and a graded toxic probit would use a Lees preset.

## The same shape for a fire and a blast

A pool fire runs the same way through the fire panel: a spill becomes a pool, the pool has a burning flux, a flame length, a tilt and a surface emissive power, and the heat flux at a target feeds a thermal probit. A blast runs through the harm panel alone: a fuel mass, a stated yield, a TNT mass, a scaled distance, an overpressure and the hsc probit. In every chain the stated inputs that are not the engine's own, a transmissivity, a yield factor, a pool thickness, carry as much weight as any computed figure.

## Where the chain is weakest

Look for the step with the least evidence behind it. In this chain it is the preset, a Purple Book coefficient resting on one worked case. In a blast chain it is the TNT equivalence, a single route quantity. The note should say so beside the result.

## Exercise

On the release panel, run the AMENAM gas line at 2e6 Pa and confirm 1.032722 kg/s, CHOKED. On the plume view, enter that rate for carbon monoxide in a 3 m/s wind in class F and confirm 4582.243793 mg/m3 at 200 m, to within the rounding of the typed rate. On the harm panel's toxic view, enter that concentration in mg/m3 for 30 minutes on pb-carbon-monoxide and confirm a probability of 0.284726. Then repeat the plume step in class D and write one sentence on what the class choice did to the harm.
