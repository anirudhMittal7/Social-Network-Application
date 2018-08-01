import React,{Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ProfileItem from './ProfileItem';

import {getProfiles} from '../../actions/profileActions';


class Profiles extends Component {


	componentDidMount() {
		this.props.getProfiles();
	}


	render() {

		const {profiles, loading} = this.props.profile;
		let profileItems;

		if( profiles === null || loading) {
			profileItems = 'Loading Profiles ....';
		} else {

			if(profiles.length > 0) {
				console.log(profiles);
				profileItems = profiles.map(profile => (
						<ProfileItem key={profile._id} profile={profile} />
					));

			} else {
				profileItems = <h3> No Profiles Found </h3>;
			}
		}

		return(
				<div classNames="profiles">
					<div className="container" >
						<div className="row">
							<div className = "col-md-12">
								<h1 className="display-4 text-center"> Developer Profiles </h1>
								<p> Browse and Connect with Developers </p>
								{profileItems}
							</div>
						</div>
					</div>
				</div>

			)


	}

}

Profiles.propTypes = {
	getProfiles: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {
		profile: state.profile
	}
}

export default connect(mapStateToProps, {getProfiles})(Profiles);