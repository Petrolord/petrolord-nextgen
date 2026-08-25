# The hand chain

Bulk volume is where this course's mandate ends, but the engine carries the chain two steps further, net and pore, and the fixture's per-block numbers are exactly hand-reachable. This lesson runs the chain for block 1, both to certify the numbers and to mark, precisely, the line where Earth Modeling hands off.

## The chain and its per-block constants

With a property populated per block, volumes extend: net equals bulk times NTG, pore equals net times porosity, and hydrocarbon pore volume applies one minus water saturation. Block 1's zone A properties, from its single well W1: NTG 0.798, porosity 0.315, Sw 0.252. Constants across the block, module three explained why.

The chain, in m3:

$$\mathrm{net} = 13{,}998{,}750 \times 0.798 = 11{,}171{,}002.5$$
$$\mathrm{pore} = 11{,}171{,}002.5 \times 0.315 = 3{,}518{,}865.7875$$
$$\mathrm{HCPV} = 3{,}518{,}865.7875 \times (1 - 0.252) = 2{,}632{,}111.60905$$

Every digit matches the fixture's stored volume table. The multiplications are exact by hand because the block's map is constant: with a kriged or trended map, pore volume becomes a node-by-node sum, and the hand route degrades to a check on magnitude. A one-well block is, in this one narrow sense, the easiest block to audit.

Block 0's chain runs the same way with its weighted constants, NTG 0.7940853080568722 and porosity 0.28631191845445614: net 24,617,637.156398103, pore 7,048,322.922064076. The digits sprawl because the constants are weighted means, but the structure is identical.

## What is deliberately absent

No formation volume factor, no recovery factor, no barrels. The chain stops at pore volume (and its HCPV variant) because the next multiplications belong to ReservoirCalc: contacts decide WHICH cells count as hydrocarbon, fluid properties shrink reservoir volumes to surface volumes, and recovery turns in-place into reserves. The division of labour is binding in both course plans, and it is architectural, not ceremonial: this course's outputs, per-block bulk with per-block property maps, are exactly the inputs that course's booking consumes. The two-blocks-two-contacts question that block partitioning raises is, not coincidentally, the ReservoirCalc Professional tier's centrepiece, taught on its own fixture.

The one number to carry across the boundary with care: HCPV here uses BLOCK-CONSTANT Sw, not a contact. It answers "pore volume times hydrocarbon fraction as logged", a property-model number, not "volume above a contact", a booking number. Quoting this HCPV as if a contact had been applied is the classic hand-off error between the two disciplines, and the honest label on it is "no contact applied".

## Closure survives the chain

Because the property maps are per-block and the volume pass sums per block and total together, closure holds at every link on this model: block net volumes sum to the total net, pore to pore, exactly as bulk did. Fixture totals: net 35,788,639.65639808, pore 10,567,188.709564094. The audit habit extends unchanged: any nonzero closure at any link is structural, and the FIRST link that fails localises the defect, a property-grid misalignment fails pore but not net, a label defect fails everything from bulk down.

## Worked example

Audit one full-precision multiplication the way a reviewer would, using the shortest defensible route. Block 1 pore: $13{,}998{,}750 \times 0.798 \times 0.315$. Group the constants first: $0.798 \times 0.315 = 0.25137$. Then $13{,}998{,}750 \times 0.25137 = 3{,}518{,}865.7875$. Two multiplications, no rounding, agreeing with the engine to the last digit; the tiny float tail on the stored bulk (the .999999998) is beneath the fifth decimal of the pore figure and invisible here. When the constants are round, regrouping is the fastest exact audit; when they are fifteen-digit weighted means, audit the SHARES instead, as module three did.

## Exercise

Compute block 1's hydrocarbon pore volume as a FRACTION of its bulk volume, and decompose the fraction into its three factors. Then state which single factor a new well in block 1's north would most plausibly move, and why the other two are more robust to one more well.
