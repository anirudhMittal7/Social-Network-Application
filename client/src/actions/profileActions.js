import axios from 'axios';
import {GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS, SET_CURRENT_USER, GET_PROFILES} from './types';



//get profile
export const getCurrentProfile = () => dispatch => {
	//set profile loading
	dispatch(setProfileLoading());

	axios.get('/api/profile')
	.then(res => 
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		})
	)
	.catch(err => {
		dispatch({
			type: GET_PROFILE,
			payload: {}
		})
	})
}

//Create Profile
export const createProfile = (profileData,history) => dispatch => {

	axios.post('/api/profile',profileData)
	.then(result => {
		history.push('/dashboard')
	})
	.catch(error => {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	})
}

export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING
	}
}

//clear profile
export const clearCurrentProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE
	}
}

//add experience
export const addExperience = (expData, history) => dispatch => {

	axios
		.post('/api/profile/experience', expData)
		.then(res => history.push('/dashboard'))
		.catch(error =>

				dispatch({
					type: GET_ERRORS,
					payload: error.response.data
				})

			)
}

//add education

export const addEducation= (eduData, history) => dispatch => {

	axios
		.post('/api/profile/education', eduData)
		.then(res => history.push('/dashboard'))
		.catch(error =>

				dispatch({
					type: GET_ERRORS,
					payload: error.response.data
				})

			)
}

//delete experience

export const deleteExperience = (id, history) => dispatch => {

	axios
		.delete(`api/profile/experience/${id}`)
		.then(res => 
				dispatch({
					type: GET_PROFILE,
					payload: res.data
				})
			)
		.catch(error =>
				dispatch({
					type: GET_ERRORS,
					payload: error.response.data
				})
			   )
}

//delete education

export const deleteEducation = (id, history) => dispatch => {

	axios
		.delete(`api/profile/education/${id}`)
		.then(res => 
				dispatch({
					type: GET_PROFILE,
					payload: res.data
				})
			)
		.catch(error =>
				dispatch({
					type: GET_ERRORS,
					payload: error.response.data
				})
			   )
}

//fetch all Profiles

export const getProfiles = () => dispatch => {

	dispatch(setProfileLoading())
	axios
		.get('/api/profile/all')
		.then(res => 
				dispatch({
					type: GET_PROFILES,
					payload: res.data
				})
			)
		.catch(err =>
				dispatch({
					type: GET_PROFILES,
					payload: null
				})
			)
}

//fetch profile by handle

export const getProfileByHandle = (handle) => dispatch => {
	dispatch(setProfileLoading());

	axios
		.get(`/api/profile/handle/${handle}`)
		.then(res => 
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_PROFILE,
				payload: null
			})
		)
}


//delete account
export const deleteAccount = () => dispatch => {
	if(window.confirm('Are you sure ? This cannot be undone')) {
		axios
			.delete('/api/profile')
			.then(res => 
					dispatch({
						type: SET_CURRENT_USER,
						payload: {}
					})
				)
			.catch(error => 
					dispatch({
						type: GET_ERRORS,
						payload: error.response.data
					})
				)
	}
}

