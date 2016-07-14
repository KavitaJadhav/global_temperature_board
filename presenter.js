var presenter = {};

var dataPresenter = require('./presenters/data_presenter.js').dataPresenter;

var presenter = {
	home : function(req,res){
		res.render('home');
	},
	lineGraph : function(req,res){
		// dataPresenter.temperature_data();
		res.render('line_graph');
	}
};

exports.presenter = presenter;