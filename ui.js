function Ui(){
	
}
Ui.init = function(){
	$("#ui input[type=text]").on("keyup", function(e){
		if(e.keyCode == 13){
			$(".plot-it").trigger("click");
		}
	});	
	$(".plot-it").on("click", function(){
		Plotter.setExpression($(".expression").val());
		Plotter.refresh();
	});
}
