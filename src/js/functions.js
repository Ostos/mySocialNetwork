function post(pp,c,p,cp,el){

	// Configuration object for the DustJS template
	var cfw = {
		postPerson: pp,
		comment: c,
		photo: p,
		commentPerson:cp
	};

	// Render the 'wall-post' template using cfw as configuration object
	dust.render("wall-post",cfw,function(err,out){
		el.after(out);
	});
}