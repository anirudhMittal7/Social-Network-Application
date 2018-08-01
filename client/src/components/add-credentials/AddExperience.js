import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'; 

import {addExperience} from '../../actions/profileActions';

class AddExperience extends Component {

	constructor(props) {
		super(props);
		this.state = {
			company: '',
			title: '',
			location: '',
			from: '',
			to: '',
			current: false,
			description: '',
			errors: {},
			disabled: false       //set true if the user checks 'current' and blank out the to field
		}

		this.onChange=this.onChange.bind(this);
		this.onSubmit=this.onSubmit.bind(this);
		this.onCheck=this.onCheck.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors) {
			console.log('nextProps.errors', nextProps.errors);
			this.setState({errors: nextProps.errors});
		}
	}

	onSubmit(event) {
		console.log('submited');
		event.preventDefault();
		const expData = {
			company: this.state.company,
			title: this.state.title,
			location: this.state.location,
			from: this.state.from,
			to: this.state.to,
			current: this.state.current,
			description: this.state.description
		};

		this.props.addExperience(expData, this.props.history);

	}

	onChange(event) {
		this.setState({[event.target.name] : event.target.value});
	}

	onCheck(event){
		this.setState({
			disabled: !this.state.disabled,
			current: !this.state.current
		})
	}

	render() {

		const { errors } = this.state;

		return (
				<div className='add-experience'>
					<div className='container'>
						<div className='row'>
							<div className='col-md-8 m-auto'>
								<Link to='/dashboard' className='btn btn-light'> Go Back to Dashboard </Link>
								<h1 className='text-center display-4'>Add Experience</h1>
								<p className='text-center'> Add any job positions in the past or current </p>
								<small className='d-block pb-3'> *= required </small>

								<form onSubmit={this.onSubmit} >
									<TextFieldGroup 
										placeholder="* Company"
										name="company"
										value={this.state.company}
										onChange={this.onChange}
										error={errors.company}
									/>
									<TextFieldGroup 
										placeholder="* Job Title"
										name="title"
										value={this.state.title}
										onChange={this.onChange}
										error={errors.title}
									/>

									<TextFieldGroup 
										placeholder="Location"
										name="location"
										value={this.state.location}
										onChange={this.onChange}
										error={errors.location}
									/>

									<h6>From Date</h6>

									<TextFieldGroup 
										name="from"
										type="date"
										value={this.state.from}
										onChange={this.onChange}
										error={errors.from}
									/>

									<h6>To Date</h6>

									<TextFieldGroup 
										name="to"
										type="date"
										value={this.state.to}
										onChange={this.onChange}
										error={errors.to}
										disabled={this.state.disabled ? 'disabled' : ''}
									/>

									<div className='form-check mb-4'> 
									   <input type='checkbox' className='form-check-input' name='current' 
									   value={this.state.current} checked={this.state.current} onChange={this.onCheck} 
									   id="current" />
									   <label htmlFor="current" className="form-check-label">Is this your current job ? </label>
									</div>

									<TextAreaFieldGroup 
										placeholder="Job description"
										name="description"
										value={this.state.description}
										onChange={this.onChange}
										error={errors.description}
										info="Please describe your current position"
									/>

									<input type="submit" className="btn btn-info btn-block" value="Submit" />
								</form>

							</div>
						</div>
					</div>
				</div>
			)
	}
}

AddExperience.propTypes = {
	profile: PropTypes.object,
	errors: PropTypes.object,
	addExperience: PropTypes.func
}

function mapStateToProps(state) {
	return {
		profile: state.profile,
		errors: state.errors
	}
}

export default connect(mapStateToProps, {addExperience})(withRouter(AddExperience));