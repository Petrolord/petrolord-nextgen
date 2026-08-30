# Marching up from the bit

The direction the calculation runs, and why it has to be that one.

## The boundary condition

The calculation starts at the bit, not at surface. That is because the bit end is where the boundary condition is known.

For a tripping operation the string is hanging free, so the tension at the bit is zero and the torque is zero.

For an on-bottom operation the bit is carrying weight, so the tension at the bit is MINUS the weight on bit, which is -89000 N in this course, and the torque is the bit torque, 2700 N.m.

Those are the only two things known before the calculation runs. The hookload, which is what you actually want, is the last thing it produces.

## The recursion

Working upward one interval at a time:

    T(above) = T(below) + w cos(theta) ds + fa mu N
    M(above) = M(below) + ft mu N r

The first term in the tension recursion is the weight the interval adds, resolved along the hole. The second is the axial component of friction. In the torque recursion the only term is the tangential component of the same friction acting at the tool joint radius.

## The two direction cosines

`fa` and `ft` split one friction force between the axial and tangential directions, according to how the pipe is moving.

    va = axial velocity
    vt = 2 pi r rpm / 60, the tangential velocity of the tool joint surface
    fa = va / hypot(va, vt),  ft = vt / hypot(va, vt)

That single pair of expressions produces every difference between the six operations in this course. Tripping has vt = 0, so fa = 1 and ft = 0: all friction is axial, and there is no torque at all. Rotating off bottom has va = 0, so all friction is tangential and the hookload is the free-hanging weight.

Back reaming does both at once, and the two components share the same total. That sharing is why rotating while tripping reduces drag, and it is not free: the drag it removes reappears as torque.

## Why not march down from surface

Because the hookload at surface is unknown. You could guess it and shoot for a bit-end condition, but that is a boundary-value problem solved by iteration, and it would have to be re-solved for every case.

Marching up from a known bit condition is an initial-value problem, so one pass gives the answer.

## The sign convention

Tension positive, compression negative. The hookload is the tension at the top of the string plus any block weight, which is zero in this course.

That convention makes it possible for a hookload to come out negative, which sounds absurd and is the subject of module 3's last lesson.

## Exercise

For the vertical well tripping out, work the recursion by hand over the top 500 m of drill pipe: no friction, no curvature, so the only term is the weight.

Then say what the recursion would have given if you had marched DOWN from an assumed surface hookload that was 10 kN too high, and where that error would have shown up.
