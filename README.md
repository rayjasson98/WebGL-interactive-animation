# WebGL Interactive Animation

*[Ray Jasson](mailto:holmesqueen2070@yahoo.com)*<br>
*28/01/2021*<br>

<br>

## :computer: Program Execution

Play around with the cube, the sphere and the tetrahedron using various lighting and material parameters in the program!

<p align=center><img src="/docs/img/ui.png"></p>
<p align="center"><i>UI of the WebGL program</i></p>

<br>

### :arrow_down_small: Interactive Animation

Each 3D shape can be rotated in 4 directions: up, down, left and right.

You can use:
- **Arrow keys** to control rotation of *all* 3D shapes
- **Buttons** to control rotation of *each individual* 3D shape

The animation is a continuous rotation about the *y*-axis. You can press:
- **ENTER key** to start the animation for *all* 3D shapes
- **START button** to start the animation for *each individual* 3D shape

<br>

### :arrow_down_small: Lighting and Shading

The [Blinn-Phong lighting model](https://en.wikipedia.org/wiki/Blinn%E2%80%93Phong_reflection_model), also known as the modified Phong model, is used to render 3D shapes under various lighting conditions and material properties.

<p align=center><img src="/docs/img/blinn-phong-model.png"></p>
<p align="center"><i>Blinn-Phong Model</i></p>

[Phong Shading](https://en.wikipedia.org/wiki/Phong_shading), also known as per-fragment shading, is used to apply the lighting model to each fragment. Shading calculations are performed in the fragment shader on a per-fragment basis.

There are various lighting and material parameters that can be manipulated in the program:
- Intensities of ambient, diffuse and specular light sources
- Material properties of each 3D shape for ambient, diffuse and specular reflections
- Position of light source in terms of its *x*, *y* and *z*-coordinates
- Shininess coefficient for specular reflection

<br>

### :arrow_down_small: Texture Mapping

[Texture mapping](https://en.wikipedia.org/wiki/Texture_mapping) is the process of painting an image onto the fragments to materialise the effect of rendering a surface with custom texture.  As for now, WebGL only support 2D mapping. In the program, there is a set of 6 images that can be selected for texture mapping.

<br>

## :black_nib: References

- Angel, E., & Shreiner, D. (2015). *Interactive Computer Graphics* (7th ed.). Pearson Education.
- [Phong Shading in WebGL](http://www.cs.toronto.edu/~jacobson/phong-demo/)
- [A GitHub repository for WebGL examples](https://github.com/esangel/WebGL)