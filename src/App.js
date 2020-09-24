import React, { Component } from 'react';
import './App.css';
import Chart from './components/Chart';
import Data from "./data/epa-http.json";
import * as d3 from "d3";

class App extends Component {
  constructor(){
    super();
    this.state = {
      timeData:{},
      methodData:{},
      responseData:{},
      sizeData:{}
    }
  }

  componentWillMount(){
    this.getTimeData();
    this.getMethodData();
    this.getResponseData();
    this.getSizeData();
  }

  //getChartData(): generates histogram bins using d3 library.
  //A time origin is set to be the first entry 29:23:53:25.
  getTimeData(){

    var totalBins = 70;
    const initialTime = 2591605/60.
    const minutes = Data.map((d) => parseFloat(d.datetime.second)/60.+
                                    parseFloat(d.datetime.minute)+
                                    parseFloat(d.datetime.hour)*60+
                                    parseFloat(d.datetime.day)*60*24 -
                                    initialTime);
    
    var x = d3.range(d3.min(minutes), d3.max(minutes), parseInt(d3.max(minutes)/totalBins))

    var bins = d3.histogram()
      .thresholds(totalBins)(minutes); 

    const y = bins.map(d => d.length)

    // AJAX set state
    this.setState({
      timeData:{
        labels: x,
        datasets:[
          {
            label:'Server Population',
            data: y
          }
        ]
      }
    });
  }

  getMethodData(){

    var countGET = 0
    var countPOST = 0
    var countHEAD = 0
    var countINVALID = 0
    
    Data.map((d) => {
      if(d.request.method === "GET"){
        countGET = countGET+1;
      }
      else if(d.request.method === "POST"){
        countPOST += 1;
      }
      else if(d.request.method === "HEAD"){
        countHEAD += 1;
      }
      else{
        countINVALID += 1;
      }
    });

    // AJAX set state
    this.setState({
      methodData:{
        labels: ["GET", "POST", "HEAD", "INVALID"],
        datasets:[
          {
            label:'Request method',
            data: [countGET, countPOST, countHEAD,countINVALID]
          }
        ]
      }
    });
  }

  //getResponseData(): counts the response code ocurrences.
  //Utilizes keysCount() to find the repeating keys and do the counting
  getResponseData(){

    function keysCount(arr) {
      var a = [], b = [], prev;
      arr.sort();
      for ( var i = 0; i < arr.length; i++ ) {
          if ( arr[i] !== prev ) {
              a.push(arr[i]);
              b.push(1);
          } else {
              b[b.length-1]++;
          }
          prev = arr[i];
      }
      return [a, b];
    }

    const responses = Data.map((d) => d.response_code)
    var result = keysCount(responses)

    // AJAX set state
    this.setState({
      responseData:{
        labels: result[0],
        datasets:[
          {
            label:'Response codes',
            data: result[1]
          }
        ]
      }
    });
  }

  //getSizeData(): generates histogram bins using d3 library.
  //Filters the parsed size vector with the selected conditions into sizeD.
  getSizeData(){

    var totalBins = 20;
    var sizeD = []
    const response = Data.map(d => parseInt(d.response_code));
    const size = Data.map(d => parseInt(d.document_size));
    for (let i = 0; i < Data.length; i++) {
      if(response[i] === 200 && size[i]<1000){
        sizeD[i] = size[i]
      }
    }

    // Delete NaNs and prepare histogram
    sizeD = sizeD.filter(Boolean)
    var x = d3.range(d3.min(sizeD), d3.max(sizeD), parseInt(d3.max(sizeD)/totalBins))
    var bins = d3.histogram()
      .thresholds(totalBins)(sizeD); 
    const y = bins.map(d => d.length)

    // AJAX set state
    this.setState({
      sizeData:{
        labels: x,
        datasets:[
          {
            label:'Size',
            data: y
          }
        ]
      }
    });
  }

  render() {
    return (
      
      <div className="App">
        <div className ="column ">
          <h4>Request per minute (starting from 29d 23h 53m 25s)</h4>
          <Chart chartData={this.state.timeData}  location="line" legendPosition="bottom"/>
        </div>
          
        <div className ="column ">
          <h4>Distribution of HTTP methods</h4>
          <Chart chartData={this.state.methodData}  displayLegend = "true" location="pie" legendPosition="bottom"/>
        </div>
          
        <div className ="column ">
          <h4>Distribution of HTTP answer codes</h4>
          <Chart chartData={this.state.responseData}  location="bar" legendPosition="bottom"/>
        </div>
        
        <div className ="column ">
          <h4>Size of the answer in bytes filtered by response 200</h4>
          <Chart chartData={this.state.sizeData} location="bar" legendPosition="bottom"/>
        </div>
        
      </div>
    );
  }
}
export default App;