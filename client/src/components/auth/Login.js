import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';

import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			password: '',
			email: '',
			errors:{} 
		}

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

	}

	onChange(event) {
		this.setState({[event.target.name] : event.target.value})
	}

	onSubmit(event) {
		event.preventDefault();
		const user = {
			email: this.state.email,
			password: this.state.password
		};

		console.log(user);

		this.props.loginUser(user);
	}

	componentWillReceiveProps(nextProps) {

		if(nextProps.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}

		if(nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
	}

	componentDidMount() {
		//user already logged in
		if(this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	render() {
		const {errors} = this.state;
		return (
				 <div className="login">
				    <div className="container">
				      <div className="row">
				        <div className="col-md-8 m-auto">
				          <h1 className="display-4 text-center">Log In</h1>
				          <p className="lead text-center">Sign In To Your Account </p>

				          <form onSubmit = {this.onSubmit} >

				          	<TextFieldGroup placeholder="Enter email address" name="email" type="email"
				          		value={this.state.email} onChange={this.onChange} error={errors.email} />

				          	<TextFieldGroup placeholder="Enter password" name="password" type="password"
				          		value={this.state.password} onChange={this.onChange} error={errors.password} />
		
					     
				            <input type="submit" className="btn btn-info btn-block mt-4" />
				          </form>


				        </div>
				      </div>
				    </div>
				  </div>

			)
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {auth: state.auth, errors: state.errors}
}

export default connect(mapStateToProps, {loginUser })(Login);