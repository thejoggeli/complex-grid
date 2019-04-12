$(document).ready(function(){
	Monitor.setup({showTitle: false});	// setup Gfw 
	Gfw.setup({scaling:true, height:12});
	Gfw.createCanvas("d2", {"renderMode": RenderMode.Canvas2d});
	Gfw.createCanvas("main", {"renderMode": RenderMode.Canvas3d});
	Gfw.getCanvas("main").setActive();
	Gfw.onUpdate = onUpdate;
	Gfw.onRender = onRender;
	Gfw.onResize = onResize;
	Gfw.setBackgroundColor("#000000");
	// init
	onInit();
	Gfw.start();
});

function onInit(){
	Gfw.camera.zoom = 1.0;
	Plotter.init();
	Plotter.transition = 0.3;
	Plotter.plot();
	vv = {mat4:[], mat3:[], vec4:[], vec3:[], vec2:[], quat:[]};
	for(var i = 0; i < 10; i++){
		vv.mat4[i] = glMatrix.mat4.create();
		vv.mat3[i] = glMatrix.mat3.create();
		vv.vec4[i] = glMatrix.vec4.create();
		vv.vec3[i] = glMatrix.vec3.create();
		vv.vec2[i] = glMatrix.vec2.create();
		vv.quat[i] = glMatrix.quat.create();
	}
}

function onResize(){
	
}

function onUpdate(){
	if(Input.isKeyDown(37)){
		Plotter.transition = Numbers.clamp(Plotter.transition-Time.deltaTime, 0, 1);
		Plotter.plot();
	} else if(Input.isKeyDown(39)){
		Plotter.transition = Numbers.clamp(Plotter.transition+Time.deltaTime, 0, 1);
		Plotter.plot();	
	}
	if(Input.keyDown(48+1)){
		Plotter.transition = 0;
		Plotter.plot();
	} else if(Input.keyDown(48+2)){
		Plotter.transition = 1;
		Plotter.plot();
	}
	if(Input.keyDown(48+3)){
		Plotter.gridDetail = Numbers.clamp(Plotter.gridDetail-1, 1, 1000);
		Plotter.plot();
	} else if(Input.keyDown(48+4)){
		Plotter.gridDetail = Numbers.clamp(Plotter.gridDetail+1, 1, 1000);
		Plotter.plot();
	}
	Gfw.cameraMovement(50);
	Gfw.camera.recalcBounds();
	// monitor stuffs
	Monitor.set("FPS", Time.fps);
	Monitor.set("Expression", Plotter.expression);
	Monitor.set("Transition", roundToFixed(Plotter.transition, 3));
	Monitor.set("Detail", Plotter.gridDetail);
}

function onRender(){
	Plotter.render();
}















