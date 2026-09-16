# Height from retention

The liquid needs a volume, and in a vertical vessel that volume becomes a depth. ABANA-1 holds 3000.000000 bpd for 3.000000 minutes, which is 35.091146 ft3, and at the gas-required diameter it stands 10.605223 ft deep.

{{panel:fc-separator-explorer}}

## From a rate and a time to a volume

The retention volume is the total liquid rate held for the retention time. On ABANA-1 that is 2600.000000 bpd of oil and 400.000000 bpd of water, 3000.000000 bpd together, converted through 5.614583333333333 ft3 per barrel and the 1440 minutes in a day, then held 3.000000 minutes to give 35.091146 ft3.

Retention time is an input somebody chose. Nothing in the fluid properties produces it. It is a judgement about how long this particular crude needs to release its gas and to break whatever water it is carrying, and it is where operating experience enters a calculation that is otherwise mechanical.

## From a volume to a depth

Divide the volume by the floor area and the result is a depth. That makes depth inversely proportional to area, so it falls quickly as the vessel widens.

| diameter ft | liquid ft |
| --- | --- |
| 2.000000 | 11.169859 |
| 2.500000 | 7.148710 |
| 3.000000 | 4.964382 |
| 3.500000 | 3.647301 |
| 4.000000 | 2.792465 |

Going from 2.000000 to 4.000000 ft of diameter takes the liquid from 11.169859 to 2.792465 ft, which is four times shallower for twice the width, because the area went up four times. The same 35.091146 ft3 is in the vessel in every row.

## The two dimensions come from different places

The diameter came from the gas. The liquid depth comes from the liquid. They meet only through the area, and they pull in opposite directions: the wider the vessel the easier the gas has it and the shallower the liquid sits.

At the gas-required diameter of 2.052551 ft the liquid stands 10.605223 ft deep, which is a tall column of liquid in a narrow drum. That is the shape a gas-sized vertical vessel naturally takes, and it is why the gas-required diameter is so rarely the one built.

## What the retention volume does not include

It is the working volume for the liquid at its normal rate. It carries no allowance for a surge arriving from the line, no space above the liquid for the gas to disengage, and no margin for a controller that lets the level wander. The allowance above the liquid is added separately, and a slug arriving from upstream is a different sizing problem with a vessel of its own.

## The mistake

Holding the oil rate rather than the total liquid rate. On ABANA-1 that would hold 2600.000000 bpd and lose the 400.000000 bpd of water, giving a volume and a depth about a seventh short. The water occupies the vessel whether or not the retention basis was written for it.

## Exercise

Build the ABANA-1 retention volume from 3000.000000 bpd and 3.000000 minutes. Then give the liquid depth at 2.000000 and at 4.000000 ft of diameter, say why doubling the diameter divided the depth by four, and name the input in this calculation that no fluid property produces.
