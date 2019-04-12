attribute vec3 position;
attribute vec2 texcoords;
uniform mat4 matrix;
varying vec2 iTexcoords;
void main() {
	gl_Position = matrix * vec4(position, 1.0);
	iTexcoords = texcoords;
}
