function ShaderProgram(){
	this.attributes = {};
	this.uniforms = {};
	this.channels = {};
	this.program;
}
ShaderProgram.channelIndex = 0;
ShaderProgram.prototype.create = function(vsrc, fsrc){
	// shaders
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vsrc);
	gl.compileShader(vertexShader);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fsrc);
	gl.compileShader(fragmentShader);
	this.program = gl.createProgram();
	gl.attachShader(this.program, vertexShader);
	gl.attachShader(this.program, fragmentShader);
	gl.linkProgram(this.program);
	
	if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
		var linkErrLog = gl.getProgramInfoLog(this.program);
		console.error("Shader this.program did not link successfully. " + "Error log: " + linkErrLog);		
		var print_error = function(shader, src){			
			var compilationLog = gl.getShaderInfoLog(shader);
			if(compilationLog != ""){
				console.error(compilationLog);
				var split = src.split("\n");
				for(var i = 0; i < split.length; i++){
					var line = ""+(i+1);
					console.warn(line.padStart(5)+": " + split[i]);
				}
			}
		}		
		print_error(vertexShader, vsrc);
		print_error(fragmentShader, fsrc);		
		return;
	} else {
		gl.useProgram(this.program);
	}
}
ShaderProgram.prototype.addAttribute = function(name){
	this.attributes[name] = {
		name: name,
		location: gl.getAttribLocation(this.program, name),
	};
	console.log("attribute", this.attributes[name]);
}
ShaderProgram.prototype.addUniform = function(name){
	this.uniforms[name] = {
		name: name,
		location: gl.getUniformLocation(this.program, name),
	};	
	console.log("uniform", this.uniforms[name]);
}
ShaderProgram.prototype.use = function(){
	gl.useProgram(this.program);
}



