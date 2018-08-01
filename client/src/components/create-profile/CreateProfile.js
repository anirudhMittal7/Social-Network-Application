import React,{Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';
import {createProfile} from '../../actions/profileActions';

import {withRouter} from 'react-router-dom';

class CreateProfile extends Component{

	constructor(props) {
		super(props);
		this.state = {
			displaySocialInputs: false,
			handle: "",
			company: "",
			website: "",
			location: "",
			status: "",
			skills: "",
			githubusername: "",
			bio: "",
			twitter: "",
			facebook: "",
			linkedin: "",
			youtube: "",
			instagram: "",
			errors: {}
		}

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
	}

	onSubmit(event) {
		event.preventDefault();
		console.log('submitted');
		const profileData = {
			handle: this.state.handle,
			company: this.state.company,
			website: this.state.website,
			location: this.state.location,
			status: this.state.status,
			skills: this.state.skills,
			githubusername: this.state.githubusername,
			bio: this.state.bio,
			twitter: this.state.twitter,
			facebook: this.state.facebook,
			linkedin: this.state.linkedin,
			youtube: this.state.youtube,
			instagram: this.state.instagram

		}
		console.log(profileData);
		this.props.createProfile(profileData,this.props.history);

	}

	onChange(event) {
		// console.log(event.target.name);
		// console.log(event.target.value);
		this.setState({[event.target.name] : event.target.value})
	}

	render() {

		const {errors, displaySocialInputs} = this.state;
		//select options
		const options = [
			{ 'label': '* Select Professional Status', 'value': 0},
			{ 'label': 'Junior Developer', 'value': 'Junior Developer'},
			{ 'label': 'Student', 'value': 'Student'},
			{ 'label': 'Instructor or Teacher', 'value': 'Instructor or Teacher'},
			{ 'label': 'Senior Developer', 'value': 'Senior Developer'},
			{ 'label': 'Intern', 'value': 'Intern'},
			{ 'label': 'Other', 'value': 'Other'}
		]

		let socialInputs;

		if(displaySocialInputs) {
			//display the social inputs
			socialInputs = (
					<div>
						<InputGroup 
							placeholder="Twitter Profile URL"  
							name="twitter"
							icon="fab fa-twitter"
							value={this.state.twitter}
							onChange={this.onChange}
							errors={errors.twitter}
						/>

						<InputGroup 
							placeholder="Facebook Profile URL"  
							name="facebook"
							icon="fab fa-facebook"
							value={this.state.facebook}
							onChange={this.onChange}
							errors={errors.facebook}
						/>

						<InputGroup 
							placeholder="Linkedin Profile URL"  
							name="linkedin"
							icon="fab fa-linkedin"
							value={this.state.linkedin}
							onChange={this.onChange}
							errors={errors.linkedin}
						/>

						<InputGroup 
							placeholder="YouTube Profile URL"  
							name="youtube"
							icon="fab fa-youtube"
							value={this.state.youtube}
							onChange={this.onChange}
							errors={errors.youtube}
						/>

						<InputGroup 
							placeholder="Instagram Profile URL"  
							name="instagram"
							icon="fab fa-instagram"
							value={this.state.instagram}
							onChange={this.onChange}
							errors={errors.instagram}
						/>
					</div>

				)


		}


		return (
				<div className="create-profile">
					<div className="container">
						<div className="row">
							<div className="col-md-8 m-auto">
								<h1 className="display-4 text-center">Create Your Profile </h1>
								<small className="d-block pb-3"> * required field </small>

								<form onSubmit={this.onSubmit}> 
									<TextFieldGroup 
										placeholder="* Profile Handle"
										name="handle"
										value={this.state.handle}
										onChange={this.onChange}
										error={errors.handle}
										info="A unique handle for your profile URL"
									/>

									<SelectListGroup 
										placeholder="Status"
										name="status"
										value={this.state.status}
										onChange={this.onChange}
										error={errors.status}
										options = {options}
										info="Give an idea of your current career status"
									/>

									<TextFieldGroup 
										placeholder="Company/University"
										name="company"
										value={this.state.company}
										onChange={this.onChange}
										error={errors.company}
										info="Company or University or School you are at"
									/>

									<TextFieldGroup 
										placeholder="Your Website (if any)"
										name="website"
										value={this.state.website}
										onChange={this.onChange}
										error={errors.website}
										info="Please enter your website URL"
									/>

									<TextFieldGroup 
										placeholder="Location"
										name="location"
										value={this.state.location}
										onChange={this.onChange}
										error={errors.location}
										info="City or state suggested (eg. Los Angeles, CA)"
									/>

									<TextFieldGroup 
										placeholder="* Skills"
										name="skills"
										value={this.state.skills}
										onChange={this.onChange}
										error={errors.skills}
										info="Please use comma separated values (eg. HTML, Javascript, React) "
									/>

									<TextFieldGroup 
										placeholder="GitHub UserName"
										name="githubusername"
										value={this.state.githubusername}
										onChange={this.onChange}
										error={errors.githubusername}
										info="Your GitHub Username (if any)"
									/>

									<TextAreaFieldGroup 
										placeholder="Short bio of yourself"
										name="bio"
										value={this.state.bio}
										onChange={this.onChange}
										errors={errors.bio}
										info="Tell us a bit about yourself"
									/>

									<div className="mb-3">
										<button type="button" onClick ={() => {
												this.setState(prevState => ({
													displaySocialInputs: !prevState.displaySocialInputs   //toggle this
												}))
											}
										} className="btn btn-light"> 
										Add Social Network links (Optional)
										</button>
									</div>

									{socialInputs}

									<input type="submit" value="Submit" className="btn btn-primary" />


								</form>
							</div>
						</div>
					</div>
				</div>
			)

	}
}

CreateProfile.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {
		profile: state.profile,
		errors: state.errors
	}
}

export default connect(mapStateToProps,{createProfile})(withRouter(CreateProfile));