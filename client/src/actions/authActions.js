import {TEST_DISPATCH, GET_ERRORS, SET_CURRENT_USER} from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

//Register
export const registerUser = (userData, history) => (dispatch) => {

	axios
		.post('/api/users/register',userData)
		.then(result => {
			history.push('/dashboard');
		})
		.catch(error =>{
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		});	
}

//Login

export const loginUser = (userData) => (dispatch) => {

	axios.post('/api/users/login',userData)
		.then(res => {
			//save to local storage
			const {token} = res.data;
			//local storage only stores strings
			localStorage.setItem('jwtToken',token);
			//set token to auth header for every request
			setAuthToken(token);
			//Decode token to get user data , installed jwt-decode
			const decoded = jwt_decode(token);
			//Set current User
			dispatch(setCurrentUser(decoded));
		})
		.catch(error => {
			dispatch({
				type: GET_ERRORS,
				payload: error.response.data
			})
		})
}

//set logged in user

export const setCurrentUser = (decoded) => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	}
}

//log user out

export const logoutUser = () => dispatch => {
	//remove item from local storage
	localStorage.removeItem('jwtToken');
	//Remove auth header for future requests
	setAuthToken(false);
	//Set current user to {} which will also set isAuthenticated to false
	dispatch(setCurrentUser({}));

}

