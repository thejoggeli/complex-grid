precision highp float;
varying vec2 iTexcoords;
uniform sampler2D iTexture;
void main() {
//	gl_FragColor = texture2D(sampler, uv);
	gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
}
