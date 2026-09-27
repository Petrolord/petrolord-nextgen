# Constant inputs

{{panel:materials-spares-calculator}}

Not every input of a lead-time risk call needs to be uncertain. A demand rate may be steady while deliveries vary, or a contract may fix the lead time while demand varies. The engine takes a plain number in place of a triangle, treats it as a constant, and draws nothing for it. This lesson reads how the engine says so.

## A constant draws nothing

For each draw the engine still takes its turn in the same order, the lead time first and then the demand rate, but a constant input spends no uniform number. The basis names each constant. On a case with a constant demand of 1.5 a day and a sampled lead time, 5000 draws on seed 42, verbatim:

> 5000 iterations, one mulberry32(42) stream; per iteration a uniform for the lead time then one for the demand rate (constant: no draw); triangular inverse CDF (lib/stats triInvCDF); the rate holds for the whole lead time

With both inputs constant, as in the case of the previous lesson where demand equalled the stock, no uniform is spent at all, and every draw is the same.

## One draw

A call with a single draw returns that one draw as every percentile. On a case with one iteration, the lead-time demand's P90 is 9.768001 and its P10 is 9.768001; the mean, minimum and maximum equal it too. A single draw is an estimate with no spread to read, and the table shows why a draw count is always quoted.

## The shape control

The spares calculator writes each input's shape through a control, "a constant number" or "a triangle (min, mode, max)". Switching a triangle to a constant keeps its mode, so the seal's lead time of 70, 90 and 160 days becomes a constant 90 days. The switch changes the question: the lead-time spread is gone, and only the demand varies.

## What a constant says

A constant is a stated claim that an input does not vary for the purpose of the calculation. It is as much a stated input as a triangle, and a figure quoted from a call with a constant says so. The engine holds no triangle of its own: an input left out is refused by name, and an input stated as a number is taken at its word.

The same inputs typed into the Materials & Spares Planner give the same draws and the same figures, because the seed and the draw order are stated.

## Exercise

Open the spares calculator on the view "Lead-time risk by Monte Carlo (ungraded)" and start from "The mechanical seal on the Ekene register". Set "Lead time, days: shape (stated)" to "a constant number" and check that the lead time reads 90. Read the sampling line: the lead time now carries "(constant: no draw)". Read the lead-time column: every figure is 90. Predict whether the stockout count at a reorder point of 3 rises or falls, then read it, with its seed and draws. Switch the start to "A constant demand and a sampled lead time", set "Draws (stated)" to 1, and check that every percentile is the same figure.
