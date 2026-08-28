# Carrying shape between rocks

The lab measured one plug. The model needs curves for a rock region no plug was cut from, with its own connate water, its own residual oil, its own endpoint permeabilities from logs or from an analogue. The standard answer is a shape transfer: read the measured table as pure shape on the normalized axis, then rebuild it inside the target frame. The engine's `scaleKrTable` does exactly this, and nothing more.

## The three moves

Given a source table and a target frame $\{S_{wc}, S_{or}, k_{rw,max}, k_{ro,max}\}$, the function walks a grid of normalized saturations $S_{wn}$ from 0 to 1 and, at each one,

1. finds the source saturation $S_{w,src} = S_{wc,src} + S_{wn} \cdot \text{span}_{src}$ and interpolates the source table there,
2. divides by the source endpoint values to get the normalized pair,
3. multiplies by the target endpoints and posts the result at $S_{w,tgt} = S_{wc,tgt} + S_{wn} \cdot \text{span}_{tgt}$.

The spans are the mobile windows, $1 - S_{wc} - S_{or}$ on each side. For the Ekene source the span is 0.4; move the curves onto a target frame of $S_{wc}$ 0.25, $S_{or}$ 0.3, $k_{rw,max}$ 0.45, $k_{ro,max}$ 0.85 and the target span is 0.45: the same shape now stretches across a slightly wider window sitting lower on the saturation axis.

## The worked transfer

Run the Ekene 13-row grid onto that frame with a 9-point output and the ends land exactly where the target frame dictates:

| row | $S_w$ | $k_{rw}$ | $k_{ro}$ |
| --- | --- | --- | --- |
| first | 0.25 | 0 | 0.85 |
| middle | 0.475 | 0.07954951288348665 | 0.2124999999999999 |
| last | 0.7 | 0.45 | 0 |

The middle row is worth walking by hand. $S_{wn}$ one half maps back to the source at $S_w = 0.35 + 0.5 \times 0.4 = 0.55$, which is a row of the source table, so interpolation returns the stored pair exactly: $k_{rw}$ 0.05303300858899109 and $k_{ro}$ 0.2249999999999999. Dividing by the source endpoints gives the normalized pair 0.17677669529663698 and 0.2499999999999999 from the previous lesson, and multiplying by the target endpoints gives $0.17677669529663698 \times 0.45 = 0.07954951288348665$ and $0.2499999999999999 \times 0.85 = 0.2124999999999999$. Three moves, no fitting, no new physics.

Forward, on the target axis, the same $S_{wn}$ posts at $S_w = 0.25 + 0.5 \times 0.45 = 0.475$. Notice the two halves of the map never mix: source saturations are only read, target saturations are only written, and the normalized axis is the only place they meet.

## What is preserved and what is replaced

Preserved: the exponents and every detail of curvature. A Corey source with $n_w$ 2.5 produces a scaled table that is Corey with $n_w$ 2.5, because step 2 strips the frame and step 3 installs a new one without touching the powers in between. Any bump, plateau, or measurement wobble in the source shape rides along too, faithfully rescaled.

Replaced: everything about the frame. The output honors the target endpoints exactly, by construction, first row and last row included. Read the scaled table's implied endpoints back and you get $S_{wc}$ 0.25 and $S_{or}$ 0.30000000000000004, the target values with a sixteenth-digit float wrinkle from computing $1 - 0.7$, the same class of artifact lesson 1 taught you to name and move past.

One caution on step 1: the source is interpolated linearly between its rows. If the source table is sparse, the transfer carries the interpolation error of the Associate tier's lesson on tables along with the shape. A transfer is only as smooth as the table it reads.

## The misconception to avoid

A shape transfer does not make the target curves measured. The output table has laboratory digits in it and none of a laboratory's authority: its shape is borrowed from one plug, and its frame is an interpretation from logs or analogues. Reports that quote a scaled table without naming the source plug and the assumed endpoints convert an argument into a fact. The honest sentence is always of the form: shape from plug X, endpoints assumed as Y.

## Exercise

First, using the three moves by hand, compute the scaled pair at $S_{wn} = 0.75$ for the target frame above. You may use the normalized values at $S_{wn}$ 0.7499999999999998 from lesson 1, and you should state the target saturation at which the pair is posted.

Second, a colleague transfers the Ekene shape onto a target with $S_{wc}$ 0.45 and $S_{or}$ 0.35. Compute the target span, then say what that span does to the fractional flow problem downstream even though every kr value in the table is legitimate.
