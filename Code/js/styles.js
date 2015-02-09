function style() {
	$(".pure-button").click(function() {
		$("#" + this.id).toggleClass("selected");
	});
};
