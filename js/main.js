const shapes = ["cube", "sphere", "tetrahedron"];
const directions = ["up", "down", "left", "right"];
let imgs, settings;

window.addEventListener("load", () => {
  imgs = Array.from(document.querySelectorAll("img"));
  settings = {
    cube: {
      rotationAngle: {
        x: 0.0,
        y: 0.0,
      },
    },
    sphere: {
      rotationAngle: {
        x: 0.0,
        y: 0.0,
      },
    },
    tetrahedron: {
      rotationAngle: {
        x: 0.0,
        y: 0.0,
      },
    },
    shininess: 50.0,
    lightPosition: [0.0, 0.0, 0.0],
    light: {
      ambient: 0.5,
      diffuse: 0.5,
      specular: 0.5,
    },
    material: {
      ambient: "#ffffff",
      diffuse: "#ffffff",
      specular: "#ffffff",
    },
  };

  // Add event listeners for user input
  setShininess();
  setLightPosition();
  setLightParams();
  setMaterialParams();
  setAnimation();
  setTextureImg();

  // Starts rendering graphics
  initGraphics();
});

function setShininess() {
  document.getElementById("shininess-input").addEventListener("change", e => {
    settings.shininess = Number(e.target.value);
    document.getElementById("shininess-output").value = e.target.value;
  });
}

function setLightPosition() {
  const lightPosition = Array.from(
    document.querySelectorAll(".light-position-input")
  );

  lightPosition.forEach(lP => {
    const i = lP.dataset.index;

    lP.addEventListener("change", () => {
      settings.lightPosition[i] = Number(lP.value);
      document.querySelector(
        `.light-position-output[data-index="${i}"]`
      ).value = lP.value;
    });
  });
}

function setLightParams() {
  const lightInputs = Array.from(document.querySelectorAll(".light-input"));

  lightInputs.forEach(l => {
    const light = l.dataset.light;

    l.addEventListener("change", () => {
      settings.light[light] = Number(l.value);
      document.querySelector(`.light-output[data-light="${light}"]`).value =
        l.value;
    });
  });
}

function setMaterialParams() {
  const materialInputs = Array.from(
    document.querySelectorAll(".material-input")
  );

  materialInputs.forEach(m => {
    m.addEventListener("change", () => {
      settings.material[m.dataset.material] = m.value;
    });
  });
}

function setAnimation() {
  const directionInputs = Array.from(
    document.querySelectorAll(".direction-input")
  );
  let intervals = {};

  directionInputs.forEach(d => {
    const shape = d.dataset.shape;
    const direction = d.dataset.direction;

    d.addEventListener("mousedown", e => {
      if (direction === "up") {
        intervals.up = setInterval(() => {
          settings[shape].rotationAngle.x -= 10.0;
        }, 50);
      } else if (direction === "down") {
        intervals.down = setInterval(() => {
          settings[shape].rotationAngle.x += 10.0;
        }, 50);
      } else if (direction === "left") {
        intervals.left = setInterval(() => {
          settings[shape].rotationAngle.y += 10.0;
        }, 50);
      } else if (direction === "right") {
        intervals.right = setInterval(() => {
          settings[shape].rotationAngle.y -= 10.0;
        }, 50);
      }
    });

    d.addEventListener("mouseup", () => {
      clearInterval(intervals[direction]);
    });
  });

  const animationInputs = Array.from(
    document.querySelectorAll(".animation-input")
  );
  const animationBtns = {
    cube: animationInputs[0],
    sphere: animationInputs[1],
    tetrahedron: animationInputs[2],
  };

  let keyDownInterval = { cube, sphere, tetrahedron };
  let keyDown = false;

  function animate(shape, directionInputs, interval, enter) {
    return function () {
      if (animationBtns[shape].value === "START") {
        interval = setInterval(() => {
          settings[shape].rotationAngle.y -= 10.0;
        }, 50);

        if (enter === true) keyDownInterval[shape].enter = interval;
        directionInputs.forEach(d => (d.disabled = true));
        animationBtns[shape].value = "STOP";
      } else {
        if (enter === true) interval = keyDownInterval[shape].enter;
        clearInterval(interval);
        directionInputs.forEach(d => (d.disabled = false));
        animationBtns[shape].value = "START";
      }
    };
  }

  animationInputs.forEach(a => {
    const shape = a.dataset.shape;
    const directionInputs = document.querySelectorAll(
      `.direction-input[data-shape="${shape}"]`
    );
    let interval;
    a.addEventListener(
      "mousedown",
      animate(shape, directionInputs, interval, false)
    );
  });

  document.addEventListener("keydown", e => {
    if (keyDown === true) return;
    else keyDown = true;

    if (e.key == "Enter") {
      for (const shape of shapes) {
        const directionInputs = document.querySelectorAll(
          `.direction-input[data-shape="${shape}"]`
        );
        let interval;
        animate(shape, directionInputs, interval, true)();
      }
    } else if (e.key === "ArrowUp") {
      for (const shape of shapes) {
        keyDownInterval[shape].up = setInterval(() => {
          settings[shape].rotationAngle.x -= 10.0;
        }, 50);
      }
    } else if (e.key === "ArrowDown") {
      for (const shape of shapes) {
        keyDownInterval[shape].down = setInterval(() => {
          settings[shape].rotationAngle.x += 10.0;
        }, 50);
      }
    } else if (e.key === "ArrowLeft") {
      for (const shape of shapes) {
        keyDownInterval[shape].left = setInterval(() => {
          settings[shape].rotationAngle.y += 10.0;
        }, 50);
      }
    } else if (e.key === "ArrowRight") {
      for (const shape of shapes) {
        keyDownInterval[shape].right = setInterval(() => {
          settings[shape].rotationAngle.y -= 10.0;
        }, 50);
      }
    }
  });

  document.addEventListener("keyup", () => {
    for (const shape of shapes) {
      for (const direction of directions) {
        clearInterval(keyDownInterval[shape][direction]);
      }
    }
    keyDown = false;
  });
}

function setTextureImg() {
  const textureInputs = Array.from(document.querySelectorAll(".texture-input"));

  textureInputs.forEach(t => {
    t.addEventListener("change", () => {
      let textureChangedEvent = new CustomEvent("textureChanged", {
        detail: { shape: t.dataset.shape, textureImg: imgs[parseInt(t.value)] },
      });
      document.dispatchEvent(textureChangedEvent);
    });
  });
}
