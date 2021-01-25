let imgs, settings;

window.addEventListener("load", () => {
  imgs = Array.from(document.querySelectorAll("img"));
  settings = {
    cube: {
      rotationAngle: {
        x: 0.0,
        y: 0.0,
      },
      textureImg: imgs[0],
    },
    sphere: {
      rotationAngle: {
        x: 0.0,
        y: 0.0,
      },
      textureImg: imgs[1],
    },
    tetrahedron: {
      rotationAngle: {
        x: 0.0,
        y: 0.0,
      },
      textureImg: imgs[2],
    },
    shininess: 5.0,
    lightPosition: [1.0, 1.0, 1.0],
    light: {
      ambient: 1.0,
      diffuse: 1.0,
      specular: 1.0,
    },
    material: {
      ambient: "#ffffff",
      diffuse: "#ffffff",
      specular: "#ffffff",
    },
  };

  setShininess();
  setLightPosition();
  setLightProps();
  setMaterialProps();
  setAnimation();

  initGraphics();
});

function setShininess() {}

function setLightPosition() {}

function setLightProps() {}

function setMaterialProps() {}

function setAnimation() {}
