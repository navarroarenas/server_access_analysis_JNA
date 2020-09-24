import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';


class Chart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData,
    }
  }
  
  static defaultProps = {
    displayTitle:false,
    displayLegend: false,
    legendPosition:'bottom',
    location: "bar"
  }

//CONDITIONAL RENDER: "bar" "line" "pie" types. 
//The custom option for the selector is being injected through props.location
  render(){

    if (this.props.location === "bar"){
      return (
        <div className="chart">
          <div className="item">
            <Bar
              data={this.state.chartData}
              options={{
                title:{
                  display:this.props.displayTitle,
                  fontSize:25
                },
                legend:{
                  display:this.props.displayLegend,
                  position:this.props.legendPosition
                },
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: false,
                      labelString: ""
                    }
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: false,
                      labelString: ""
                    }
                  }]  
                }
              }}
            />
          </div>
        </div>
      )
    }

    if (this.props.location === "line"){
      return (
        <div className="chart">
          <div className="item">
            <Line
              data={this.state.chartData}
              options={{
                title:{
                  display:this.props.displayTitle,
                  fontSize:25
                },
                legend:{
                  display:this.props.displayLegend,
                  position:this.props.legendPosition
                },
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: false,
                      labelString: ""
                    }
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: false,
                      labelString: ""
                    }
                  }]  
                }
              }}
            />
          </div>
        </div>
      )
    }

    if (this.props.location === "pie"){
      return (
        <div className="chart">
          <div className="item">
            <Pie
              data={this.state.chartData}
              options={{
                title:{
                  display:this.props.displayTitle,
                  fontSize:25
                },
                legend:{
                  display:this.props.displayLegend,
                  position:this.props.legendPosition
                },
                backgroundColor:this.props.backgroundColor
              }}
            />
          </div>
        </div>
      )
    }
  }
}

export default Chart;