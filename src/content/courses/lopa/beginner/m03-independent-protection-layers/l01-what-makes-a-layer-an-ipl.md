# What makes a layer an IPL

{{panel:lp-worksheet}}

An independent protection layer is a device, system or action that stops this scenario reaching its consequence, and that does so independently of the initiating event and of every other layer credited on the same row. Each layer credited enters the row through one number, its IPL PFD, the probability that it fails to act when the scenario calls on it. The engine multiplies the IPL PFDs of the credited layers into the frequency.

## The four layers on the ORONI row

| IPL | IPL PFD, stated | independent, stated | auditable, stated |
| --- | --- | --- | --- |
| high level alarm with operator response | 0.1 | true | not given |
| relief valve sized for the blocked outlet case | 0.01 | true | not given |
| BPCS level trip on the initiating controller | 0.1 | false | not given |
| operator round on a procedure never audited | 0.1 | true | false |

Four layers are listed and the engine credits two of them. The list is the analyst's claim. The flags beside each entry are the analyst's assertions about it, and the credit decision is made from those flags alone, which the next two lessons take apart.

## The three things every entry needs

An entry needs a name, an IPL PFD and a flag. The name is required because a layer with no name cannot be reviewed or checked against the others:

> ipls[0].name: every IPL needs a name

The IPL PFD is a probability above zero and no more than one, and zero is refused with the reason attached:

> ipls[0].pfd: 'relief' must have a PFD above 0 and no more than 1 (a PFD of 0 is a perfect layer, which none is)

The flag is what the engine reads to decide credit, and it is read strictly. Lesson two of this module deals with what strictly means.

## The layer and the number are two separate claims

It is worth separating them because reviews confuse them. The first claim is that this thing is a layer at all for this scenario: it detects the condition, it acts, and it acts in time. The second claim is the figure. A relief valve entered at 0.01 and an alarm with operator response entered at 0.1 differ by a factor of ten, and that gap is a statement about how much more reliable a mechanical device with a proof test regime is than a person reading a display and acting under pressure.

The engine checks neither claim. It holds the figure to its range, requires a name, applies the credit flags and multiplies. Everything else is the analyst's judgement and the review's job, and the engine's own record says as much about the credit rules themselves.

## Exercise

Using the table above, multiply the IPL PFDs of the two layers the engine credits, the alarm at 0.1 and the relief valve at 0.01, and confirm the credited product of 0.001000000000. Then work out what that product would be if the BPCS level trip at 0.1 were also credited, and write one sentence about which of the two figures a plant should plan its spending on.
