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
      search: ""
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
    this.setState({
      search: event.target.value,
      flats: this.state.allFlats.filter((flat) => new RegExp(event.target.value, "i").exec(flat.name))
    })
  }

  render() {
    let center = {
      lat: 48.864716,
      lng: 2.349014
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
            <i class="fa fa-home" ></i><a href="/">Stanovanja</a>
          </div>
          <div className="rightside">
            <a href="//localhost:9000/dashboard">dashboard</a>
          </div>
        </div>
        
        <div className="sidebar">
          <h2>Kraj</h2>
          <label><input type="checkbox" name="favorite_pet" value="Cats"></input>Murska Sobota</label>   
          <label><input type="checkbox" name="favorite_pet" value="Dogs"></input>Maribor</label>         
          <label><input type="checkbox" name="favorite_pet" value="Birds"></input>Ljubljana</label>      
  
          <h2>Tip</h2>
          <label><input type="checkbox" name="favorite_pet" value="Cats"></input>1 sobno</label>   
          <label><input type="checkbox" name="favorite_pet" value="Dogs"></input>2 sobno</label>         
          <label><input type="checkbox" name="favorite_pet" value="Birds"></input>3 sobno</label>
          <label><input type="checkbox" name="favorite_pet" value="Birds"></input>4 sobno</label>

          <h2>Dodatno</h2>
          <label><input type="checkbox" name="favorite_pet" value="Cats"></input>klima</label>   
          <label><input type="checkbox" name="favorite_pet" value="Dogs"></input>parking</label>         
          <label><input type="checkbox" name="favorite_pet" value="Birds"></input>balkon</label>
        

        </div>
        <div className="main">
          <div className="search">
            <input 
            type="text" 
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
