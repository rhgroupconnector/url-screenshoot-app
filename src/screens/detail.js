import React from 'react';
import { Link } from 'react-router-dom';

class DetailView extends React.Component{

    render(){
        return(
            <div>Details
                
            <Link to="/">Home</Link>
            </div>
        )
    }
}

export default DetailView;