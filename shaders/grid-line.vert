attribute vec3 position;
attribute vec4 color;
uniform mat4 matrix;
varying vec4 iColor;
void main() {
	gl_Position = matrix * vec4(position, 1.0);
	iColor = color;
}
