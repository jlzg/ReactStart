import React, { Component } from 'react';
import logo from './logo.svg';
import './main-page.css';
import Header from './header';
import FeaturedHouse from './featured-house';
import HouseFilter from './house-filter';
import SearchResults from '../search-results';
import House from '../house';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchHouses();
  }

  fetchHouses = () => {
    fetch('/houses.json')
    .then(rsp => rsp.json())
    .then(allhouses => {
      this.allhouses = allhouses;
      this.determinFeaturedHouses();
      this.determinUniqueCountries();
    });
  };

  determinFeaturedHouses = () => {
    if(this.allhouses){
      const randomIndex = Math.floor(Math.random() * this.allhouses.length);
      const featuredHouse = this.allhouses[randomIndex];
      this.setState({featuredHouse});
    }
  };

  determinUniqueCountries = () => {

    const countries = this.allhouses ?
      Array.from(new Set(this.allhouses.map(h => h.country)))
      : [];
      countries.unshift(null);
      this.setState({countries});

  };

  filterHouses = (country) => {
    this.setState({activeHouse : null});
    const filteredHouses = this.allhouses.filter(h => h.country == country);
    this.setState({filteredHouses});
    this.setState({country});
  }

  setActiveHouse = (house) => {
    this.setState({activeHouse: house});
  }

  render() {
    let activeComponent = null;
    if(this.state.country)
      activeComponent = <SearchResults country={this.state.country} filteredHouses={this.state.filteredHouses} setActiveHouse={this.setActiveHouse} />;
    if(this.state.activeHouse)
      activeComponent = <House house={this.state.activeHouse} />;
    if(!activeComponent)
      activeComponent = <FeaturedHouse house={this.state.featuredHouse} />;

      return (
      <div className="container">
        <Header subtitle="Providing house details"/>
        <HouseFilter countries={this.state.countries} filterHouses = {this.filterHouses} />
        {activeComponent}
      </div>
    );
  }
}

export default App;
