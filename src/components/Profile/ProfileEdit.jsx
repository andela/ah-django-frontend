import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import userAvatar from '../../assets/images/avatar.png';
import defaultCover from '../../assets/images/cover.jpg';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import { fetchUserProfile, profileInputHandler, updateProfile } from '../../redux/actions';
import Config from '../../config/config';
import 'react-datepicker/dist/react-datepicker.css';

const CLOUDINARY_UPLOAD_PRESET = Config.upload_preset;
const CLOUDINARY_UPLOAD_URL = Config.upload_url;

export class ProfileEdit extends Component {
  onImageDrop = (files) => {
    const { handleInput } = this.props;
    const file = files[0];
    const upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        handleInput({ field: 'image', value: response.body.secure_url });
      }
    });
  };

  handleInput = (e) => {
    const { handleInput } = this.props;
    handleInput({ field: e.target.name, value: e.target.value });
  };

  handleDate = (date) => {
    const { handleInput } = this.props;
    handleInput({ field: 'birthDate', value: date });
  };

  save = (e) => {
    const {
      currentUser: {
        profile: {
          firstName, lastName, birthDate, bio, gender, image, username,
        },
      },
      saveData,
    } = this.props;
    saveData({
      firstName,
      lastName,
      birthDate,
      bio,
      gender,
      image,
      username,
    });
    e.preventDefault();
  };

  handleMessage = () => {
    const {
      currentUser: { message },
    } = this.props;
    if (message) {
      return message;
    }
    return '';
  };

  render() {
    const { getUserProfile, currentUser } = this.props;
    getUserProfile(currentUser.profile.username);

    return (
      <section className="main-content content-margin">
        <div className="container">
          <div className="profile-view">
            <div className="profile-cover" style={{ backgroundImage: `url("${defaultCover}")` }}>
              <div className="profile-avatar-wrapper">
                <label htmlFor="file" style={{ color: 'rgb(248, 248, 248)' }}>
                  <i className="fa fa-pencil fa-lg" />
                  <Dropzone onDrop={this.onImageDrop} accept="image/*" multiple={false}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input
                          {...getInputProps()}
                          name="file"
                          id="file"
                          className="hide"
                          type="file"
                        />
                      </div>
                    )}
                  </Dropzone>
                </label>
                <img
                  src={currentUser.profile.image || userAvatar}
                  className="profile-avatar edit"
                  alt="Profile"
                />
              </div>
            </div>
            <div className="profile-form">
              <div className="form-errors" data-test="form-errors">
                {this.handleMessage()}
              </div>
              <div className="small-input">
                <div className="single-input">
                  <Input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    onChange={this.handleInput}
                    value={currentUser.profile.firstName}
                  />
                </div>
                <div className="single-input">
                  <Input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    onChange={this.handleInput}
                    value={currentUser.profile.lastName}
                  />
                </div>
              </div>
              <div className="small-input">
                <div className="single-input">
                  <select
                    name="gender"
                    id="gender"
                    onChange={this.handleInput}
                    value={currentUser.profile.gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div className="single-input">
                  <DatePicker
                    nanme="birthDate"
                    selected={currentUser.profile.birthDate}
                    onChange={this.handleDate}
                    placeholderText="Birth Date"
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
              <div>
                <textarea
                  name="bio"
                  type="text"
                  className="large-input"
                  placeholder="Bio"
                  value={currentUser.profile.bio || ''}
                  onChange={this.handleInput}
                />
              </div>
              <div className="col-12 content-right">
                <Button
                  type="button"
                  classes={`primary ${currentUser.loading ? 'loading' : ''}`}
                  onClick={this.save}
                >
                  SAVE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ProfileEdit.propTypes = {
  currentUser: PropTypes.object.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  handleInput: PropTypes.func.isRequired,
  saveData: PropTypes.func.isRequired,
};

export const mapStateToProps = ({ currentUser }) => ({ currentUser });

export const mapDispatchToProps = dispatch => ({
  getUserProfile: username => dispatch(fetchUserProfile(username)),
  handleInput: ({ field, value }) => dispatch(profileInputHandler({ field, value })),
  saveData: ({
    firstName, lastName, gender, birthDate, bio, image, username,
  }) => dispatch(
    updateProfile({
      firstName,
      lastName,
      gender,
      birthDate,
      bio,
      image,
      username,
    }),
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileEdit);
