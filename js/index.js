// WebGL variables
var gl;
var program;

// Vertices and Colors
var points = [];
var colors = [];
var normals = [];

var vertices = {
  cube: [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
  ],
  sphere: [
    vec4(0.0, 0.0, -1.0, 1),
    vec4(0.0, 0.942809, 0.333333, 1),
    vec4(-0.816497, -0.471405, 0.333333, 1),
    vec4(0.816497, -0.471405, 0.333333, 1),
  ],
  tetrahedron: [
    vec4(0.0, 0.0, -1.0, 1),
    vec4(0.0, 0.942809, 0.333333, 1),
    vec4(-0.816497, -0.471405, 0.333333, 1),
    vec4(0.816497, -0.471405, 0.333333, 1),
  ],
};

var baseColors = [
  vec4(0.0, 0.0, 0.0, 1.0), // black
  vec4(1.0, 0.0, 0.0, 1.0), // red
  vec4(1.0, 1.0, 0.0, 1.0), // yellow
  vec4(0.0, 1.0, 0.0, 1.0), // green
  vec4(0.0, 0.0, 1.0, 1.0), // blue
  vec4(1.0, 0.0, 1.0, 1.0), // magenta
  vec4(0.0, 1.0, 1.0, 1.0), // white
  vec4(0.0, 1.0, 1.0, 1.0), // cyan
];

var lengths = {
  cube: [],
  sphere: [],
  tetrahedron: [],
};

var translations = {
  cube: { x: 2.5, y: 1.5, z: 0.0 },
  sphere: { x: 0.0, y: -1.5, z: 0.0 },
  tetrahedron: { x: -2.5, y: 1.5, z: 0.0 },
};

var scales = {
  cube: 1.8,
  sphere: 1.0,
  tetrahedron: 1.5,
};

// Viewing
var modelViewMatrix, modelViewMatrixLoc;
var projectionMatrix, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;

// Lighting and Shading
var lightPositionLoc, shininessLoc;
var ambientProductLoc, diffuseProductLoc, specularProductLoc;

// Texture mapping
var textures = {};
var texCoords = [];
var texCoord = [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)];
var texLoc;

function initGraphics() {
  // WebGL functions
  let canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  if (!gl) alert("WebGL isn't available");

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Generate vertices of 3D shapes
  lengths.cube[0] = 0;
  cube();
  lengths.cube[1] = points.length;

  lengths.sphere[0] = points.length;
  sphere();
  lengths.sphere[1] = points.length - lengths.sphere[0];

  lengths.tetrahedron[0] = points.length;
  tetrahedron();
  lengths.tetrahedron[1] = points.length - lengths.tetrahedron[0];

  // Viewing
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
  normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

  // Lighting and Shading
  shininessLoc = gl.getUniformLocation(program, "shininess");
  lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
  ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
  diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
  specularProductLoc = gl.getUniformLocation(program, "specularProduct");

  // Texture mapping
  for (const shape of shapes) {
    configureTexture(shape, imgs[0]);
  }
  texLoc = gl.getUniformLocation(program, "texture");

  // Vertices
  let nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

  let vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  let vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Colors
  let cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  let vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  // Texture mapping
  let tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

  let vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  document.addEventListener("textureChanged", e => {
    configureTexture(e.detail.shape, e.detail.textureImg);
  });

  render();
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Lighting and Shading
  const { shininess, lightPosition: lP } = settings;
  const { ambient: lA, diffuse: lD, specular: lS } = settings.light;
  const { ambient: mA, diffuse: mD, specular: mS } = settings.material;

  let lightPosition = vec4(lP[0], lP[1], lP[2], 0.0);
  let lightAmbient = vec4(lA, lA, lA, 1.0);
  let lightDiffuse = vec4(lD, lD, lD, 1.0);
  let lightSpecular = vec4(lS, lS, lS, 1.0);
  let materialAmbient = hex2rgb(mA);
  let materialDiffuse = hex2rgb(mD);
  let materialSpecular = hex2rgb(mS);

  let ambientProduct = mult(lightAmbient, materialAmbient);
  let diffuseProduct = mult(lightDiffuse, materialDiffuse);
  let specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(ambientProductLoc, flatten(ambientProduct));
  gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct));
  gl.uniform4fv(specularProductLoc, flatten(specularProduct));
  gl.uniform4fv(lightPositionLoc, flatten(lightPosition));
  gl.uniform1f(shininessLoc, shininess);

  // Viewing
  projectionMatrix = ortho(4.5, -4.5, -3.5, 3.5, -5, 5);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  for (const shape of shapes) {
    // Viewing
    const { rotationAngle, textureImg } = settings[shape];
    const { x: transX, y: transY, z: transZ } = translations[shape];
    const scale = scales[shape];

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(transX, transY, transZ));
    modelViewMatrix = mult(modelViewMatrix, rotateX(rotationAngle.x));
    modelViewMatrix = mult(modelViewMatrix, rotateY(rotationAngle.y));
    modelViewMatrix = mult(modelViewMatrix, scalem(scale, scale, scale));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2]),
    ];
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    // Texture mapping
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[shape]);
    gl.uniform1i(texLoc, 0);

    gl.drawArrays(gl.TRIANGLES, lengths[shape][0], lengths[shape][1]);
  }
  requestAnimFrame(render);
}

// Texture maping
function configureTexture(shape, image) {
  // Prevent memory leak
  if (textures[shape] !== null) gl.deleteTexture(textures[shape]);

  textures[shape] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textures[shape]);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    gl.generateMipmap(gl.TEXTURE_2D);
    // prettier-ignore
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

// convert colour picker hex code to vec4
function hex2rgb(hex) {
  let bigint = parseInt(hex.substring(1), 16);
  let R = ((bigint >> 16) & 255) / 255;
  let G = ((bigint >> 8) & 255) / 255;
  let B = (bigint & 255) / 255;
  return vec4(R, G, B, 1.0);
}

// 3D shapes
// Cube drawing
function cube() {
  cubeQuad(1, 0, 3, 2);
  cubeQuad(2, 3, 7, 6);
  cubeQuad(3, 0, 4, 7);
  cubeQuad(6, 5, 1, 2);
  cubeQuad(4, 5, 6, 7);
  cubeQuad(5, 4, 0, 1);
}

function cubeQuad(a, b, c, d) {
  let t1 = subtract(vertices.cube[b], vertices.cube[a]);
  let t2 = subtract(vertices.cube[c], vertices.cube[a]);
  let normal = vec4(normalize(cross(t2, t1)));

  points.push(vertices.cube[a]);
  colors.push(baseColors[a]);
  normals.push(normal);
  texCoords.push(texCoord[0]);

  points.push(vertices.cube[b]);
  colors.push(baseColors[a]);
  normals.push(normal);
  texCoords.push(texCoord[1]);

  points.push(vertices.cube[c]);
  colors.push(baseColors[a]);
  normals.push(normal);
  texCoords.push(texCoord[2]);

  points.push(vertices.cube[a]);
  colors.push(baseColors[a]);
  normals.push(normal);
  texCoords.push(texCoord[0]);

  points.push(vertices.cube[c]);
  colors.push(baseColors[a]);
  normals.push(normal);
  texCoords.push(texCoord[2]);

  points.push(vertices.cube[d]);
  colors.push(baseColors[a]);
  normals.push(normal);
  texCoords.push(texCoord[3]);
}

// Sphere drawing
function sphere() {
  let a = vertices.sphere[0];
  let b = vertices.sphere[1];
  let c = vertices.sphere[2];
  let d = vertices.sphere[3];
  let n = 6;
  sphereDivideTriangle(a, b, c, n);
  sphereDivideTriangle(d, c, b, n);
  sphereDivideTriangle(a, d, b, n);
  sphereDivideTriangle(a, c, d, n);
}

function sphereDivideTriangle(a, b, c, count) {
  if (count > 0) {
    let ab = mix(a, b, 0.5);
    let ac = mix(a, c, 0.5);
    let bc = mix(b, c, 0.5);

    ab = normalize(ab, true);
    ac = normalize(ac, true);
    bc = normalize(bc, true);

    sphereDivideTriangle(a, ab, ac, count - 1);
    sphereDivideTriangle(ab, b, bc, count - 1);
    sphereDivideTriangle(bc, c, ac, count - 1);
    sphereDivideTriangle(ab, bc, ac, count - 1);
  } else {
    sphereTriangle(a, b, c);
  }
}

function sphereTriangle(a, b, c) {
  let t1 = subtract(b, a);
  let t2 = subtract(c, a);
  let normal = vec4(normalize(cross(t2, t1)));
  let scale = 1.0;

  points.push(a);
  colors.push(baseColors[4]);
  normals.push(normal);
  texCoords.push([
    (scale * Math.acos(a[0])) / Math.PI,
    (scale * Math.asin(a[1] / Math.sqrt(1.0 - a[0] * a[0]))) / Math.PI,
  ]);

  points.push(b);
  colors.push(baseColors[4]);
  normals.push(normal);
  texCoords.push([
    (scale * Math.acos(b[0])) / Math.PI,
    (scale * Math.asin(b[1] / Math.sqrt(1.0 - b[0] * b[0]))) / Math.PI,
  ]);

  points.push(c);
  colors.push(baseColors[4]);
  normals.push(normal);
  texCoords.push([
    (scale * Math.acos(c[0])) / Math.PI,
    (scale * Math.asin(c[1] / Math.sqrt(1.0 - c[0] * c[0]))) / Math.PI,
  ]);
}

// Tetrahedron drawing
function tetrahedron() {
  let a = vertices.tetrahedron[0];
  let b = vertices.tetrahedron[1];
  let c = vertices.tetrahedron[2];
  let d = vertices.tetrahedron[3];
  tetraTriangle(a, c, b, 0);
  tetraTriangle(a, c, d, 1);
  tetraTriangle(a, b, d, 2);
  tetraTriangle(b, c, d, 3);
}

function tetraTriangle(a, b, c, color) {
  let t1 = subtract(b, a);
  let t2 = subtract(c, a);
  let normal = vec4(normalize(cross(t2, t1)));

  points.push(a);
  colors.push(baseColors[color]);
  normals.push(normal);
  texCoords.push([0.0, 0.0]);

  points.push(b);
  colors.push(baseColors[color]);
  normals.push(normal);
  texCoords.push([0.5, 1.0]);

  points.push(c);
  colors.push(baseColors[color]);
  normals.push(normal);
  texCoords.push([1.0, 0.0]);
}
