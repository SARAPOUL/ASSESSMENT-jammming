import { useState } from 'react';
import './SearchBar.css';

function SearchBar(props) {

    const [term, setterm] = useState('')
    const search = () => {
        props.onSearch(term)
    }
    const handleTermChange = (e) => {
        setterm(e.target.value)
    }
    return (
        <div className="SearchBar">
            <input placeholder="Enter A Song, Album, or Artist"
                onChange={handleTermChange} />
            <button className="SearchButton" onClick={search}>SEARCH</button>
        </div>
    )
}

export default SearchBar