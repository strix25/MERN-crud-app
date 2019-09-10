import React, { Component } from 'react';
import './App.css';
import Flat from './components/flat/flat';
import GoogleMapReact from 'google-map-react';
import Marker from './components/marker/marker';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      flats: [],
      allFlats: [],
      selectedFlat: null,
      search: "",
      filterCity: [],
      filterApparType: [],
      filterMore: []
    };
  }

  componentDidMount(){
    const url = "//localhost:9000/api/list";
    // const url = "https://raw.githubusercontent.com/lewagon/flats-boilerplate/master/flats.json";
    fetch(url)
      .then(response => response.json())
      .then((data) =>{
        this.setState({
          flats: data.data,
          allFlats: data.data
        });
      })
  }

  selectFlat = (flat) => {
    this.setState({
      selectedFlat: flat
    });
  }

  handleSearch = (event) => {
    //ponastavi checkbox-e
    let inputs = document.querySelectorAll("input[type='checkbox']");
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;   
    }

    this.setState({
      search: event.target.value,
      flats: this.state.allFlats.filter((flat) => new RegExp(event.target.value, "i").exec(flat.name))
    })
  }

  filterMaster = () => {
    this.setState({
      search: ""
    })
    
    //TODO:start
    //  let test = this.state.allFlats.filter(flat => this.state.filterCity.includes(flat.city) && this.state.filterApparType.includes(flat.apparType));
    // // // if(this.state.filterCity.length === 0){
    // // //   this.setState({
    // // //     flats: this.state.allFlats
    // // //   });
    // // // }else{
    // // //   let filteredFlats = this.state.allFlats.filter(flat => this.state.filterCity.includes(flat.city));
    
    // // //   this.setState({
    // // //    flats: filteredFlats
    // // //   });
    // // // }
    //TODO: end
    //FIXME:
    if(this.state.filterCity.length === 0 && this.state.filterApparType.length === 0){
      //ponastavi filter
      this.setState({
        flats: this.state.allFlats
      });
    }else if(this.state.filterCity.length !== 0 && this.state.filterApparType.length === 0){
      //filtriraj po filterCity
      let filteredFlats = this.state.allFlats.filter(flat => this.state.filterCity.includes(flat.city));
    
      this.setState({
       flats: filteredFlats
      });
    }else if(this.state.filterCity.length === 0 && this.state.filterApparType.length !== 0){
      //filtriraj po filterApparType
      let filteredFlats = this.state.allFlats.filter(flat => this.state.filterApparType.includes(flat.apparType));
    
      this.setState({
       flats: filteredFlats
      });
    }else{
      //Filtriraj po obema
      let filteredFlats = this.state.allFlats.filter(flat => this.state.filterCity.includes(flat.city) && this.state.filterApparType.includes(flat.apparType));
    
      this.setState({
       flats: filteredFlats
      });
    }
    //FIXME:
  }


  handleCity = (e) => {
    // current array of options
    const options = this.state.filterCity;
    let index;

    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      options.push(e.target.value)
    } else {
      // or remove the value from the unchecked checkbox from the array
      index = options.indexOf(e.target.value)
      options.splice(index, 1)
    }

    // sort the array
    options.sort();    

    // update the state with the new array of options
    this.setState({ filterCity: options });
      
    this.filterMaster(); 
  }

  handleApparType = (e) => {
    // current array of options
    const options = this.state.filterApparType;
    let index;

    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      options.push(e.target.value)
    } else {
      // or remove the value from the unchecked checkbox from the array
      index = options.indexOf(e.target.value)
      options.splice(index, 1)
    }

    // sort the array
    options.sort();    

    // update the state with the new array of options
    this.setState({ filterApparType: options });

    this.filterMaster();
  }

  
  render() {
    let center = {
      lat: 46.6565789,
      lng: 16.1636974
    }

    

    if(this.state.selectedFlat){
      center = {
        lat: Number(this.state.selectedFlat.lat),
        lng: Number(this.state.selectedFlat.lng),
      }
    }

    return (
      <div className="app">
        <div className="navbar">
          <div className="leftside">
            <i className="fa fa-home" ></i><a href="/">Stanovanja</a>
          </div>
          <div className="rightside">
            <a href="//localhost:9000/dashboard">dashboard</a>
          </div>
        </div>
        
        <div className="sidebar">
          <h2>Kraj</h2>
          <label><input type="checkbox" onChange={this.handleCity} name="Notranjska" value="Notranjska"></input>Notranjska</label>   
          <label><input type="checkbox" onChange={this.handleCity} name="Podravska" value="Podravska"></input>Podravska</label>         
          <label><input type="checkbox" onChange={this.handleCity} name="Pomurska" value="Pomurska"></input>Pomurska</label>      
          <label><input type="checkbox" onChange={this.handleCity} name="Gorenjska" value="Gorenjska"></input>Gorenjska</label>   
          <label><input type="checkbox" onChange={this.handleCity} name="Primorska" value="Primorska"></input>Primorska</label>         
          <label><input type="checkbox" onChange={this.handleCity} name="Savinjska" value="Savinjska"></input>Savinjska</label>      
          <label><input type="checkbox" onChange={this.handleCity} name="Koroška" value="Koroška"></input>Koroška</label>   
          <label><input type="checkbox" onChange={this.handleCity} name="Dolenjska" value="Dolenjska"></input>Dolenjska</label>         
          <label><input type="checkbox" onChange={this.handleCity} name="Posavska" value="Posavska"></input>Posavska</label>      
          <label><input type="checkbox" onChange={this.handleCity} name="Zasavska" value="Zasavska"></input>Zasavska</label>      
  
          <h2>Tip</h2>
          <label><input type="checkbox" onChange={this.handleApparType} name="apparType1" value="1"></input>1 sobno</label>   
          <label><input type="checkbox" onChange={this.handleApparType} name="apparType2" value="2"></input>2 sobno</label>         
          <label><input type="checkbox" onChange={this.handleApparType} name="apparType3" value="3"></input>3 sobno</label>
          <label><input type="checkbox" onChange={this.handleApparType} name="apparType4" value="4"></input>4 sobno</label>
        


        </div>
        <div className="main">
          <div className="search">
            <input 
            type="text"
            id="search" 
            placeholder="Search..." 
            value={this.state.search} 
            onChange={this.handleSearch} />
          </div>
          <div className="flats">
            {this.state.flats.map((flat) => {
              return <Flat 
              key={flat._id} 
              flat={flat}
              selectFlat = {this.selectFlat} />
            })}
          </div>
        </div>
        <div className="map">
          <GoogleMapReact
            center={center}
            zoom={13}
          >
          {this.state.flats.map((flat) => {
              return <Marker 
              key={flat.name} 
              lat={flat.lat} 
              lng={flat.lng} 
              text={flat.price}
              selected={flat === this.state.selectedFlat} />
            })}
          </ GoogleMapReact>
        </div>
      </div>
    );
  }
}

export default App;
