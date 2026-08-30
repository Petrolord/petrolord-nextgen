# A rope that can push a little

The model in one sentence, and the assumption that makes it work.

## The question

You are lowering 3500 m of steel into a hole that bends. How much of the string's weight actually reaches the hook, how much torque does it take to turn it, and will it go in at all?

Those three questions are torque and drag, and every answer this course gives comes from one model.

## The model

The soft-string model treats the drill string as a heavy flexible cable lying in the hole. It has weight, it has axial stiffness, and it has NO bending stiffness at all.

That last part is the assumption. A real drill pipe resists being bent; the model pretends it does not. What the model keeps is the consequence of the bend: where the hole curves, the tension in the string pulls it against the wall, and where it does not curve, gravity does.

## Why a rope is a reasonable pretence

Because the pipe is thin and the hole is long.

A 5 inch drill pipe bent around a build of 3 degrees per 30 m is bent to a radius of about 570 m. Over one 10 m interval the pipe deflects a few centimetres from straight. The bending moment that resists that deflection is real, and it is small next to the tension times the curvature, which is what presses the pipe against the wall.

So for most wells, most of the time, ignoring the stiffness costs a few percent and buys a model that runs in milliseconds.

## The two things the model computes

**Drag** is the axial friction force between the string and the hole. It opposes whatever the string is doing: it fights you on the way out and helps hold the string up on the way in.

**Torque** is the rotational friction, the moment you have to supply at surface to keep the string turning against the same contact.

Both come from the same normal force. That is the single most important structural fact in this course: torque and drag are not two separate calculations, they are two components of one friction force resolved in two directions.

## What the model is not

It is not a stress analysis. It does not tell you whether the pipe will fail; it gives the tension and the torque, and a separate check compares those against the pipe's rating.

It is not a dynamic model. It computes a steady state. Stick-slip, whirl and the difference between static and kinetic friction are real and are outside it.

It is not a measurement. Every number in it rests on a friction factor that was chosen rather than measured, and the Professional tier is largely about that.

## Exercise

Before the next lesson, write down what you would expect to happen to the hookload as a well goes from vertical to 40 degrees to horizontal, with the same string and the same mud. Then write down what you expect to happen to the surface torque.

Keep the two answers. The next module computes them, and one of them is not what most people guess.
