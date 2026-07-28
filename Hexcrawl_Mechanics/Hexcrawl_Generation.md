### Hexmap Generation
The world is an n by n hex map. The size is measured at 3 scales (with each map having its own hexes. This is represented by the expression ((n^2)(3x(x-1)+1)(7)):
1. World
2. Landmass
3. Region

n^2 \* x mapped to each hex above \* x mapped to each hex above

[World Generation](world_generation.md)

Create your world first, then overlay that world with a hex map. Otherwise, you may get too caught in the process of creating the actual landmasses themselves, glaciation, elevation, etc. (As I know far too well.)

