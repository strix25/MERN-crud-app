import React, { Component } from 'react'
import "./flat.css";

export default class Flat extends Component {
  handleClick = () =>{
    this.props.selectFlat(this.props.flat);
  }
  render() {
    const title = this.props.flat.price + "EUR" + " - " + this.props.flat.name;
    console.log(this.props.flat);

    const imgPath = this.props.flat.mainPicture.replace("\\", "/");
    const postuserid = this.props.flat.userid;
    const postid = this.props.flat._id;
    const style = {
      backgroundImage: `url('//localhost:9000/${imgPath}')`
    };

    return (
      
        <div className="flat" onClick={this.handleClick}>
          <div className="flat-picture" style={style}></div>
          <div className="title-container">
            <div className="flat-title">{title}</div>
            <a href={'//localhost:9000/apartment/' + postuserid + '/' + postid} className="btn-readmore" rel="noopener noreferrer" target="_blank">
              več
            </a>
          </div>
          
        </div>
      
    );
  }
}
