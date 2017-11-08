import React, { Component } from 'react';
import './Private.css';
import { getUserInfo } from '../../ducks/users';
import { connect } from 'react-redux';


class Private extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: {}
        }
    }

    componentDidMount() {  //fires when component mounts
        this.props.getUserInfo();
    }

    bankBalance() {
        return '$' + Math.floor((Math.random() + 1) * 10000) + '.00';
    }

    render() {
        const user = this.props.user;
        return (
            <div className=''>
                <h1>Community Bank</h1><hr />
                <h4>Account information:</h4>
                { user.id ? <img className='avatar' src={user.img} alt='' /> : null }
                <p>Username: { user.id ? user.user_name : null }</p>
                <p>Email: { user.id ? user.email : null } </p>
                <p>ID: { user.id ? user.auth_id : null }</p>
                <h4>Available balance: { user.id ? this.bankBalance() : null } </h4>
                <a href='http://localhost:3005/auth/logout'><button>Log out</button></a>
            </div> 
        )
    }
}


function mapStateToProps(state) { //literally taking state from the store and mapping it to the props object --> merges it into the props object
    return {
        user: state.user
    }
}


export default connect(mapStateToProps, { getUserInfo })(Private);