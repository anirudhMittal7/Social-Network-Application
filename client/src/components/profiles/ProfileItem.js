import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import isEmpty from '../../validation/is-empty';

class ProfileItem extends Component {

	render() {
		const {profile} = this.props;
		console.log('profile',profile);

		return ( 
			<div className="card card-body mb-3 bg-light">
				<div className="row">
					<div className="col-md-2">
						<img className="rounded-circle" src={profile.user.avatar} alt="" />
					</div>
					<div className="col-lg-6 col-md-4 col-8">
						<h3>{profile.user.name}</h3>
						<p>
							{profile.status} {isEmpty(profile.company) ? null : (<span> at {profile.company} </span>)}
						</p>
						<p>
							{isEmpty(profile.location) ? null : (<span>  {profile.location} </span>)}
						</p>
						<Link to={`/profile/${profile.handle}`} className="btn btn-primary" > View Profile </Link> 
					</div>

					<div className="col-md-4">
						<h4> Skill Set </h4>
						<ul className="list-group" >
							{profile.skills.slice(0,4).map((skill, index) => (
								<li key={index} className="list-group-item" >
									<i className="fa fa-check pr-1"> {skill} </i>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			)

	}	
}

ProfileItem.propTypes = {
	profile: PropTypes.object.isRequired
}

export default ProfileItem;