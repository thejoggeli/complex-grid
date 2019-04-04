$(document).ready(function(){
	Monitor.setup({showTitle: false});	// setup Gfw 
	Gfw.setup({scaling:true, height:100});
	Gfw.createCanvas("main", {"renderMode": RenderMode.Canvas2d});
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
	Gfw.camera.zoom = 3.5;
	Plotter.init();
	Plotter.transition = 1;
	Plotter.plot();
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
	Gfw.cameraMovement(50);
	Gfw.camera.recalcBounds();
	// monitor stuffs
	Monitor.set("FPS", Time.fps);
}

function onRender(){
	Plotter.render();
}















