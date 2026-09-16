# Friction along the pipe

The friction loss is the friction factor times the length over the bore times the velocity head. On the OGBIA line that is 25.660631 psi over 26400.000000 ft.

{{panel:fc-liquid-explorer}}

## The three things it multiplies

The friction factor of 0.0218149625 carries the regime and the wall. The length of 26400.000000 ft over the bore of 7.981000 in carries the shape of the pipe. The velocity head carries the stream.

Each of the three can be changed independently, which is what makes this expression useful for design. A longer line, a rougher wall and a faster stream all raise the loss, and they do it through different terms.

## Length is the one that is simply proportional

Nothing in the friction factor or the velocity head depends on how long the pipe is, so the loss follows the length directly. The same OGBIA duty and the same fittings over a 300.000000 ft manifold run spend 0.291598 psi of pipe friction against 25.660631 psi on the full line.

That proportionality is worth trusting, because it means a loss can be scaled along a route without recomputing anything upstream of it.

## The published cases

| rate bpd | bore in | length ft | velocity ft/s | Reynolds | f | friction psi |
| --- | --- | --- | --- | --- | --- | --- |
| 5000.0000 | 6.065000 | 15000.000000 | 1.619514 | 21519.8423 | 0.0260878890 | 11.615250 |
| 20000.0000 | 10.020000 | 52800.000000 | 2.373400 | 20644.5578 | 0.0260794714 | 56.140803 |
| 800.0000 | 2.067000 | 3000.000000 | 2.230927 | 35684.4798 | 0.0249265571 | 14.550645 |
| 150.0000 | 2.067000 | 5000.000000 | 0.418299 | 15.5476 | 4.1163843599 | 130.867123 |

The first three are turbulent and sit close together in friction factor. The fourth is laminar, and it is the only one of the four whose friction factor is above one.

## What the golden agrees to

The oracle returns 11.615228, 56.140698, 14.550619 and 130.866726 psi on those four cases. Two independent implementations in two unit systems land within a small fraction of a psi, which is what gives the chain its standing.

## What the bore does to this term

The bore reaches this term by more than one route. It stands in the length-over-bore factor and it is inside the velocity head, and those two are what a sweep over the bore is really moving. It is in the Reynolds number and in the relative roughness as well, so it reaches the friction factor too. The sweep over the same OGBIA duty shows what all of that comes to: 97.306913 psi at a bore of 6.065000 in, 25.660631 psi at 7.981000 in and 8.561327 psi at 10.020000 in.

Three bores within a few inches of each other, and the cost falls away steeply across them. This is why bore is the first thing a designer reaches for when a pressure budget will not close.

## The mistake

Reporting the friction loss as the pressure drop. It is one of three terms the engine keeps apart, and on a line with a hill or a fitting list the total is a different number. The second published case spends 56.140803 psi of friction inside a total of 153.516220 psi.

## Exercise

Name the three factors the friction loss multiplies together and say which of them the length sits in. Then give the friction on the 20000.0000 bpd published case and its total, and say what accounts for the difference.
