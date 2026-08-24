# Why build a model

Ask a subsurface team what they have and most of them will list maps. A top reservoir map, a base map, a fault polygon, a thickness map somebody made last year against a deadline. All of that is real work, and none of it is an earth model.

An earth model is one object. It is a description of where the rock is, written onto a single frame, and everything downstream reads from that one object rather than from a drawer of separate files. Volumes come out of it. Well plans are drilled into it on paper before they are drilled in the ground. Simulation grids are built from it. Because those consumers all read the same thing, the thing has to be internally consistent in a way that a folder of surfaces has never been obliged to be.

## What a structural model contains

Strip a structural model down and three parts remain.

There is a frame. That is the geometry the model is written on: an origin, a count of nodes across, a count of nodes up, and a cell size. The golden model used throughout this course has a frame of 25 by 20 nodes at 50 m cells with its origin at (1000, 2000), which is 500 nodes covering the field.

There are surfaces. Each surface holds one depth value, in metres, at every node of that frame. This model carries three of them: TopA, TopB and BaseB.

There are zones. A zone is the rock between two surfaces, and its thickness at a node is one subtraction. This model carries two zones. Zone A is the rock between TopA and TopB. Zone B is the rock between TopB and BaseB.

Those three parts are the container. Fill the container with fluid properties and you get a volume of oil, which is another course's job. Slice the container into layers and you get a simulation grid. Push a planned trajectory through the container and you get a prognosis of what the bit will meet and when. Every one of those uses collapses if the container is wrong.

## Why a folder of surfaces is not a model

Three specific things are missing from a folder of maps, and each one is a reason this course exists.

The first is a shared frame. Maps arrive on whatever grid the person who made them chose. In this fixture the three source surfaces sit on three different grids, none of which matches any other or the model frame. Two surfaces stored on different grids cannot be subtracted, because node number 137 on one of them is not the same place on the ground as node number 137 on the other. Thickness is a subtraction, so until the surfaces share a frame there is no thickness, and without thickness there is no volume.

The second is an enforced relationship. Nothing in a folder stops a base surface from sitting above the top surface that is supposed to lie over it. Each map was gridded on its own, from its own picks, with its own smoothing. Where the interpolators disagreed slightly, the surfaces cross. A folder tolerates that quietly, because a folder is just files. A model cannot, because a negative thickness is rock that does not exist, and it will propagate into a volume as a negative contribution nobody notices.

The third is accountability for what changed. When a model is rebuilt, the build reports what it had to do: how many nodes were adjusted, on which surface, and where. That report is the difference between a model you can defend in a review and a stack of images somebody re-contoured by hand. On this fixture the build had to adjust 180 of the 500 nodes on BaseB. Module 3 is entirely about that number, what it means and why it must never be hidden.

## The consumers set the standard

The standard a model is held to comes from what reads it.

Volumetrics reads thickness at every node and multiplies by a cell area. It needs the frame and it needs thicknesses that are never negative.

Well planning reads depths along a proposed trajectory. It needs the surfaces to be in the right order down the hole, because a prognosis that lists BaseB above TopB is a prognosis the drilling team cannot use.

Simulation reads the zones as layers. It needs zones that are continuous objects across the frame, including where a zone pinches out to zero thickness and stops being present at all.

Reporting reads summary statistics. It needs to know what any mean was averaged over, which is the single habit this course cares most about teaching you.

Not one of those four is satisfied by a folder that happens to contain the right pictures.

## What consistency costs

Building a model is mostly the work of making separate things agree. You will spend one module putting three surfaces onto one frame, one module enforcing their order down the hole, one module differencing them into zone thicknesses, and one module integrating those thicknesses into bulk rock volume. None of that adds new geological knowledge. It converts what the interpreters produced into an object the rest of the business can compute with, and it produces a record of every adjustment it made along the way.

That is the trade. You give up the freedom of independent maps and you get an object that supports arithmetic.

## Exercise

Name three operations that a model supports and a folder of independently gridded maps does not, and for each one state the property of the model that makes it possible. Then say in one sentence why a negative thickness is more dangerous than a map that is plainly missing.

Self check: thickness by subtraction needs a shared frame, so that the same node index means the same place on the ground for both surfaces. A defensible volume needs thicknesses that are never negative, which needs an enforced order of surfaces down the hole. A well prognosis needs the same enforced order, so that the surfaces are listed in the order the bit will meet them. Any answer along those lines is correct. A negative thickness is more dangerous than a missing map because a missing map announces itself and stops the work, while a negative thickness computes cleanly, enters a volume as a quiet subtraction, and produces a wrong number that looks exactly like a right one.
