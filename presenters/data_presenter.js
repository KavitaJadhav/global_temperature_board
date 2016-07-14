	var dataPresenter = {};

	dataPresenter.welcome = function(request, response){
		response.render('home');        
	}

	dataPresenter.inLineGraphFormat = function(request, response){
		response.render('line_graph', {data: this.temperature_data});        
	}

	dataPresenter.temperature_data = function(){
			data = {'values': {		2001: 0.3,
				2002: 0.4,
				2003: 0.3,
				2004: 0.5,
				2005: 0.7,
				2006: 0.6},
			'axis_info': {'x': 'Month', 'y': 'Temperature'}
			}
		return data
	}

	exports.dataPresenter = dataPresenter