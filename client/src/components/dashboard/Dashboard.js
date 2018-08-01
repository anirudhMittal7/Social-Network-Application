import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrentProfile, deleteAccount} from '../../actions/profileActions';
import {Link} from 'react-router-dom';
import ProfileActions from './ProfileActions';
import Experience from './Experience';
import Education from './Education';

class Dashboard extends Component{

	componentDidMount() {
		this.props.getCurrentProfile();
	}

	onDeleteClick(event) {
		this.props.deleteAccount();



	}

	render() {

		const {user} = this.props.auth;
		const {profile,loading} = this.props.profile;

		let dashboardContent="";
		
		if(profile === null || loading) {
			dashboardContent=<h2> Loading ... </h2>;
		} else {
			//dashboardContent = <h1> Hello </h1>;

			//check if logged in user has a profile or not
			if(Object.keys(profile).length > 0) {

				dashboardContent=(
					<div>
						<p className="lead text-muted">Welcome <Link to={`/profile/${profile.handle}`} > {user.name} </Link> </p>
						
						<ProfileActions />

						<Experience experience={profile.experience} />

						<Education education = {profile.education} />

						<div style={{marginBottom : '100px'}} />
						<button onClick={this.onDeleteClick.bind(this)} className='btn btn-danger'> Delete My Account </button>
					</div>
				);

			}else {
				//user logged in has no profile
				dashboardContent = (
						<div>
							<p className="lead text-muted">Welcome {user.name} </p>
							<p> Please set up your profile </p>
							<Link to="/create-profile" className="btn btn-lg btn-info">Create Profile</Link>
						</div>
						)

			}
		}

		return (
				<div className="dashboard">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<div className="display-4"> <h1>DashBoard </h1></div>
								{dashboardContent}
							</div>
				 		</div>
				 	</div>
				 </div>
			)
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.profile,
		auth: state.auth
	}
}



Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired
}

export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard);