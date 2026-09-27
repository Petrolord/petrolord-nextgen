# A change of control

{{panel:farmout-earning-calculator}}

A participating interest can change hands without any licence party signing a farm-out. If someone buys control of the company that holds it, the licence stays with the same holder while the people behind the holder change. The Act treats that as an assignment too. This lesson reads where the Act draws the line and how the 2024 Regulations apply it.

## Control counts as an assignment

The Act says so in one sentence:

> "(3) For the purpose of subsection (1), a change of control in the holder of a licence or lease under subsection (1) shall be deemed to be an assignment." (PIA s.95(3))

So a sale of the holder's shares can need the same consent as a sale of its participating interest.

## Where the line sits

The Act defines a change of control by voting power, and puts the line at more than half:

> "“change of control” means any person or persons acting jointly or in concert, to acquire direct or indirect beneficial ownership of a percentage of the voting power of the outstanding voting securities of the holder, by contract or otherwise, that exceeds 50% at any time." (PIA s.95(14))

Three features of that definition matter when you read a deal. The test is voting power in the holder, which is a company, and says nothing about a participating interest in the licence. It counts persons acting together, so several buyers each below the line can cross it jointly. And the figure must exceed 50%, so exactly half does not cross it. The engine records the figure as a constant, `changeOfControlAbovePct`, with the value 50 and the citation PIA s.95(14).

## The Regulations and a listed holder

The 2024 Regulations require the Minister's consent to a change in control of a holder, with one exception:

> "(3) A change in the control of a company that holds an interest in a licence or lease, (a “holder”), other than a licensee, lessee or indirect controller of a licence or lease listed on a public exchange, shall require prior written consent of the Minister." (AOI Regulations 2024 reg. 3(3))

For an exploration licence the consent is again the Commission's:

> "(c) a change in control of a company that holds an interest in a PEL shall require prior written consent of the Commission." (AOI Regulations 2024 reg. 16(c))

## What the engine does with control

The engine computes no change of control. Its earning call reads participating interests in the licence, and no term in the box states who owns the voting securities of a holder.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "A heads-up deal". Use the "event 1: share the farminee pays, percent (stated)" and "event 1: participating interest earned, percent (stated)" controls to set both to 70, and run it. Read the participating interests after the deal: EKO has handed its whole participating interest to FIN. Then write two sentences: why this outright assignment needs consent under s.95, and why a sale of EKO's shares would be read under s.95(3) and s.95(14) with no change in this table.
