import React, { Component } from 'react'
import "./flat.css";

export default class Flat extends Component {
  handleClick = () =>{
    this.props.selectFlat(this.props.flat);
  }
  render() {
    const title = this.props.flat.price + this.props.flat.priceCurrency + " - " + this.props.flat.name;

    const style = {
      backgroundImage: `url('${this.props.flat.imageUrl}')`
    };

    return (
      
        <div className="flat" onClick={this.handleClick}>
          <div className="flat-picture" style={style}></div>
          <div className="title-container">
            <div className="flat-title">{title}</div>
            <a href="//localhost:9000/odd/id" className="btn-readmore" rel="noopener noreferrer" target="_blank">
              več
            </a>
          </div>
          
        </div>
      
    );
  }
}
