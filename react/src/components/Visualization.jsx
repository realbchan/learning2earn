import React, { Component } from 'react';
import * as d3 from 'd3';
// import us_states from './us-states.js'
import {geoPath} from "d3-geo";
import { select } from 'd3-selection';
// import {albersUsa} from "d3-geo-projection";
import './styles/Visualization.css';

class Visualization extends Component{

	constructor(props){
		super(props)
		this.state = {
	      parks:[],
	      us_states:[],
	      ready: false
	    }
	}

	componentWillMount(){
		var url = "https://raw.githubusercontent.com/iambrandonchan/learning2earn/master/react/src/components/state_parks.csv";
		var data = [];
		d3.csv(url, function(d) {
			d['num_parks'] = parseInt(d['num_parks']);
			data.push(d);
		});

		var url_j = "https://raw.githubusercontent.com/iambrandonchan/learning2earn/master/react/src/components/us-states.json";
		
		fetch(url_j)
			.then( (res) => { return res.json() })
			.then( (json) => { 
				this.setState({parks:data, us_states:json[0]['features'], ready: true}, () => {
				console.log("lmaoooooooooo")
			})
			})
	}

	render(){

		if (!this.state.ready) {
			// console.log(this.state)
			return "<p>gg</p>";
		}

		var width = 960,
		    height = 500,
		    centered;

		var projection = d3.geoAlbersUsa()
		    .scale(width)
		    .translate([width/2, height/2]);

		var path = geoPath()
		    .projection(projection);

		var color = d3.scaleLinear()
			  .domain([2,115])
			  .range(["#fff86b","#f21818"]);

		var svg = d3.select("body").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		svg.append("rect")
		    .attr("class", "background")
		    .attr("width", width)
		    .attr("height", height);
		    // .on("click", click);
		var parks = this.state['parks'];
		var new_us_states = this.state['us_states'];
		for (let i = 0; i<parks.length; i++){
			let state_name = parks[i]['state'];
			let state_value = parks[i]['num_parks'];
			for (let j = 0; j<new_us_states.length; j++){
				let json_state = new_us_states[j]['properties']['NAME']
				if (state_name == json_state){
					new_us_states[j]['properties']['num_parks'] = state_value;
					break;
				}
			}

		}

		svg.selectAll("path")
			.data(new_us_states)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke", "#fff")
			.style("stroke-width", "1")
			.style("fill", function(d) {
				let value = d['properties']['num_parks'];
				if (value){
					return color(value);
				}
				return "rgb(213,222,217)";
			});

	 	return(
        <p>LOL</p>
	    );
	}
}
export default Visualization;