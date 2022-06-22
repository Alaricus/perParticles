# perParticles

**Performant Particles** is a demo that was written to handle a comparatively large amount of particles without slowing down to the same degree as existing solutions. Since it was intended as a proof of concept rather than a ready to use solution, it cannot be imported as a package, but it should still be easy to use. All of the customization options are listed at the top of perParticles.js file and are self-explanatory.

You can view the live demo [here](https://alaricus.github.io/perParticles/). It is set to the same particle amount and maximum line distance as the tests described below.

## Test Setup

### Hardware

The tests were performed on a system with an AMD Ryzen 7 5800X CPU and 32Gb of DDR4 3600 RAM. The monitor used had a native resolution of 5120x1440 and a maximum refresh rate of 240Hz.

### Software

Microsoft Edge version 93.0.961.52 (64-bit) on Windows 10 version 10.0.19043 (Build 19043).

[Stats.js](https://github.com/mrdoob/stats.js) was used to measure FPS.


## Test Results

### Test 1:

| Software            | FPS     | Resoution | Particles | Max Line Distance |
|---------------------|---------|-----------|-----------|-------------------|
| perParticles | 75-95   | 1920x1080 | 1000      | 150px             |
| [Particles.js](https://github.com/VincentGarreau/particles.js/) | 23-25 | 1920x1080 | 1000 | 150px |
| [tsParticles](https://github.com/matteobruni/tsparticles) | 13-15 | 1920x1080 | 1000 | 150px |

### Test 2:

| Software            | FPS     | Resoution | Particles | Max Line Distance |
|---------------------|---------|-----------|-----------|-------------------|
| perParticles | 175-195 | 5120x1440 | 1000      | 150px             |
| [Particles.js](https://github.com/VincentGarreau/particles.js/) | 63-66 | 5120x1440 | 1000 | 150px |
| [tsParticles](https://github.com/matteobruni/tsparticles) | 29-32 | 5120x1440 | 1000 | 150px |

### Takeaway

The FPS results were consistent across multiple measurements on the same computer. Naturally these results are specific to the hardware and software used. Testing on your own device may yield different results. Somewhat lower performance would be expected on CPUs with 8 or fewer cores, unfortunately I didn't have any on hand to test with. For what it's worth, according to people who ran some impromptu tests for me on their phones and computers, perParticles still visibly outperforms other solutions.
