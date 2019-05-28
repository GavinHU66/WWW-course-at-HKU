import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import $ from 'jquery';


class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.storeData = this.storeData.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLoggedIn(data){
    this.props.handleLoggedIn(data);
  }

  storeData(data){
    this.props.storeData(data);
  }

  handleSignIn(){
    $.ajax({
      url: "http://localhost:3001/signin",
      xhrFields: {withCredentials: true},
      dataType : 'json',
      type: "POST",
      data: {
        "username" : this.state.username,
        "password" : this.state.password,
        "request" : "signin"
      },
      crossDomain: true,
      success: function (data) {
        if (data.msg === '') {
          this.storeData(data);
          this.handleLoggedIn(true);
        } else {
          alert("Login failed!");
        }
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });
  }

  render() {
    return (
      <div className="login-page">
        <div className="user-input">
          Username
          <input
              className="login-input"
              type="text"
              placeholder=""
              value={this.state.username}
              onChange={this.handleUsernameChange}
          />
          <br/><br/>
          Password
          <input
              className="login-input"
              type="password"
              placeholder=""
              value={this.state.password}
              onChange={this.handlePasswordChange}
          />
          <br/><br/>
        </div>
        <button type="button" className="signin-button" onClick={this.handleSignIn}>Signin</button>
        </div>
    );
  }
} // LoginPage



class NaviBar extends Component {

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleShowUserProfile = this.handleShowUserProfile.bind(this);
  }

  handleLogout(){
    $.ajax({
      url: "http://localhost:3001/logout",
      xhrFields: {withCredentials: true},
      type: "GET",
      crossDomain: true,
      success: function (data) {
        if (data.msg === '') {
          this.props.handleLoggedIn(false);
        } else {
          alert("logout failed!");
        }
      }.bind(this),

      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });

  }

  handleShowUserProfile(){
    this.props.handleShowUserProfile();
  }

  render() {

    return (
      <div className="navibar">
        <img className="navibar-user-icon user-icon" src={this.props.user.userIcon} alt="user icon load failed!" onClick={this.handleShowUserProfile}/>
        <span className="navibar-user-name" onClick={this.handleShowUserProfile}>{this.props.user.username}</span>
        <button className="navibar-logout-button" onClick = {this.handleLogout}>log out</button>
      </div>
    );
  }
} // NaviBar



class StarredFriendList extends Component {

  render() {

    let starredFriend = [];
    this.props.friendList.map((friend,index) => {
      if (friend.friendStarredOrNot === "Y"){
        starredFriend.push(
          <div className="starred-friend-list-friend">
            {friend.friendName}
          </div>
        );
      }
    });

    return (
      <div className="starred-friend-list col-1">
        <div className="starred-friend-list-heading">Starred Friends</div>
        {starredFriend}
      </div>
    );
  }

} // StarredFriendList



class SocialMedia extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newlyDeletedCommIds : [],
      newlyPostedCommInfo : []
    };
    this.loadCommentUpdates = this.loadCommentUpdates.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }
  componentDidMount() {
    this.timer = setInterval(
      () => this.loadCommentUpdates(),
      3000
    );

    this.timer = setInterval(
      () => this.handleRefresh(),
      3000
    );

  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleRefresh(){
    this.setState({
      newlyDeletedCommIds : [],
      newlyPostedCommInfo : []
    });
    this.props.handleLoad();
  }

  loadCommentUpdates(){
    $.ajax({
      url: "http://localhost:3001/loadcommentupdates",
      xhrFields: {withCredentials: true},
      dataType : 'json',
      type: "GET",
      crossDomain: true,
      success: function (data) {
        if (data.msg === '') {
          this.setState({
            newlyDeletedCommIds : data.deletedCommentIds,
            newlyPostedCommInfo : data.newComments
          });
        } else {
          alert("Update comment failed!");
        }
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });
  }

  render() {

    let posts = [];
    this.props.data.postList.map((post,index) => {
      posts.push(
        <Post
          key={index}
          post={post}
          currentUserName={this.props.data.user.username}
          handleLoad={this.props.handleLoad}
          newlyDeletedCommIds={this.state.newlyDeletedCommIds}
          newlyPostedCommInfo={this.state.newlyPostedCommInfo}
        />
      );
    });

    return (
      <div className="social-media col-2">
        <div className="social-media-heading">Posts & Comments</div>
        {posts}
      </div>
    );
  }
}



class UserPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shouldShowSocialMedia : true,
      shouldShowUserProfile : false,
      userProfileData : null
    };
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleShowUserProfile = this.handleShowUserProfile.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.handleLoad(),
      3000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleLoad(){
    this.props.handleLoad();
  }

  handleLoggedIn(data){
    this.props.handleLoggedIn(data);
  }

  handleShowUserProfile(){
        $.ajax({
          url: "http://localhost:3001/getuserprofile",
          xhrFields: {withCredentials: true},
          dataType : 'json',
          type: "GET",
          crossDomain: true,
          success: function (data) {
            if (data.msg === '') {
              this.setState({
                shouldShowSocialMedia : !this.state.shouldShowSocialMedia,
                shouldShowUserProfile : !this.state.shouldShowUserProfile,
                userProfileData : data
              });
            } else {
              alert("get UserProfile failed!");
            }
          }.bind(this),
          error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
          }.bind(this)
        });
  }


  render() {
    return (
      <div>
        <NaviBar
          handleLoggedIn={this.handleLoggedIn}
          handleShowUserProfile={this.handleShowUserProfile}
          user={this.props.data.user}
        />
        <StarredFriendList
          friendList={this.props.data.friendList}
        />

        {
          this.state.shouldShowSocialMedia &&
            <SocialMedia
              data={this.props.data}
              handleLoad={this.props.handleLoad}
            />
        }

        {
          this.state.shouldShowUserProfile &&
            <UserProfile
              userProfileData={this.state.userProfileData}
              handleLoggedIn={this.handleLoggedIn}
              handleShowUserProfile={this.handleShowUserProfile}
            />
        }

      </div>

    );
  }
} // UserPage



class UserProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: this.props.userProfileData.mobileNumber,
      homeNumber: this.props.userProfileData.homeNumber,
      address: this.props.userProfileData.address
    };
    this.handleMobileNumberChange = this.handleMobileNumberChange.bind(this);
    this.handleHomeNumberChange = this.handleHomeNumberChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleMobileNumberChange(e) {
    this.setState({
      mobileNumber: e.target.value
    });
  }

  handleHomeNumberChange(e) {
    this.setState({
      homeNumber: e.target.value
    });
  }

  handleAddressChange(e) {
    this.setState({
      address: e.target.value
    });
  }


  handleSave() {

    var newProfile = {
      "mobileNumber" : this.state.mobileNumber,
      "homeNumber" : this.state.homeNumber,
      "address" : this.state.address
    };

    $.ajax({
      url: "http://localhost:3001/saveuserprofile",
      type: "PUT",
      data: newProfile,
      xhrFields: {withCredentials: true},
      dataType : 'json',
      crossDomain: true,
      success: function (data) {
        alert("Saved!");
        this.props.handleShowUserProfile();
      }.bind(this),

      error: function (xhr, ajaxOptions, thrownError) {
        alert("Saved Failed!");
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });

  }

  render() {
    return (
      <div className="user-profile col-5">
        <div className="user-profile-heading">
          User Profile
        </div>
        <div className="user-profile-label">
          Mobile number
        </div>
        <input
            className="user-profile-input"
            type="text"
            placeholder=""
            value={this.state.mobileNumber}
            onChange={this.handleMobileNumberChange}
        />
        <br/><br/>

        <div className="user-profile-label">
          Home number
        </div>
        <input
            className="user-profile-input"
            type="text"
            placeholder=""
            value={this.state.homeNumber}
            onChange={this.handleHomeNumberChange}
        />
        <br/><br/>

        <div className="user-profile-label">
          Mailing address
        </div>
        <input
            className="user-profile-input"
            type="text"
            placeholder=""
            value={this.state.address}
            onChange={this.handleAddressChange}
        />
        <br/><br/>

        <button type="button" onClick={this.handleSave}>Save</button>

        <br/><br/>

      </div>
    );
  }
}



class FrontApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn : false,
      data : null
    };
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.storeData = this.storeData.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleLoggedIn(loggedIn){
    this.setState({
      loggedIn: loggedIn
    });
  }

  storeData(data){
    this.setState({
      data: data
    });
  }

  handleLoad(){
    $.ajax({
      url: "http://localhost:3001/signin",
      xhrFields: {withCredentials: true},
      dataType : 'json',
      type: "POST",
      data: {
        "username" : this.state.data.user.username,
        "password" : this.state.data.user.password,
        "request" : "handleLoad"
      },
      crossDomain: true,
      success: function (data) {
        if (data.msg === '') {
          this.setState({
            data: data
          });
        } else {
          alert("Load failed!");
        }
      }.bind(this),
      error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
      }.bind(this)
    });
  }

  render() {
    return (

      <div>
        <div>
          <h1 className="heading"> Social App </h1>
        </div>
        <div>
          {
            this.state.loggedIn?
              <UserPage
                handleLoggedIn={this.handleLoggedIn}
                handleLoad={this.handleLoad}
                data={this.state.data}
              />
              :
              <LoginPage
                handleLoggedIn={this.handleLoggedIn}
                storeData={this.storeData}
              />
          }
        </div>
      </div>

    );
  }
} // FrontApp



class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      commentToBePost: "",
    };
    this.handleCommentToBePostChange = this.handleCommentToBePostChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleStarUpdate = this.handleStarUpdate.bind(this);
  }

  handleCommentToBePostChange(e) {
    this.setState({
      commentToBePost: e.target.value
    });
  }

  handleKeyPress(e){
      if(e.keyCode === 13){
        if (this.state.commentToBePost.length === 0) {
          alert("at least write something ^_^");
        } else {
          $.ajax({
            url: "http://localhost:3001/postcomment/" + this.props.post.postId,
            xhrFields: {withCredentials: true},
            dataType : 'json',
            type: "POST",
            data: {
              "comment" : this.state.commentToBePost,
            },
            crossDomain: true,
            success: function (data) {
              if (data.msg === '') {
                this.setState({
                  commentToBePost: ""
                });
                this.props.handleLoad();
              } else {
                alert("Post Comment failed! >_<");
              }
            }.bind(this),
            error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
            }.bind(this)
          });
        }
      }
   }

   handleStarUpdate(e){
     $.ajax({
        url: "http://localhost:3001/updatestar/" + this.props.post.posterId,
        type: "PUT",
        data: {
          starState : this.props.post.posterStar
        },
        xhrFields: {withCredentials: true},
        crossDomain: true,
        dataType : 'json',
        success: function (data) {
          if (data.msg === '') {
            this.props.handleLoad();
          } else {
            alert("Update star failed! >_<");
          }
        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
          alert("Update star failed! >_<");
          alert(xhr.status);
          alert(thrownError);
        }.bind(this)
      });
   }


  render() {
    var newlyDeletedCommIds = (typeof this.props.newlyDeletedCommIds == "undefined")? [] : this.props.newlyDeletedCommIds;
    var newlyPostedCommInfo = (typeof this.props.newlyPostedCommInfo == "undefined")? [] : this.props.newlyPostedCommInfo;

    let comments = [];
    if (this.props.post.comments.length !== 0) {
      this.props.post.comments.map((comment,index) => {

          if (!newlyDeletedCommIds.includes(comment.commentId)){
            comments.push(
              <Comment
                key={index}
                comment={comment}
                currentUserName={this.props.currentUserName}
                handleLoad={this.props.handleLoad}
              />
            );
          }
      });
    }

    return (
      <div className="post">

        <div className="post-images col-3">
          <img className="user-icon" src={this.props.post.posterIcon} alt="user icon load failed!" />
          {
            this.props.post.posterStar === "Y" &&
              <img className="star" src="../images/starred.png" alt="star icon load failed!" onClick={this.handleStarUpdate}/>
          }
          {
            this.props.post.posterStar === "N" &&
              <img className="star" src="../images/unstarred.png" alt="star icon load failed!" onClick={this.handleStarUpdate}/>
          }
        </div>

        <div className="post-textcontent col-4">
          {
            this.props.post.posterName === this.props.currentUserName?
              <div className="post-name">You</div>
              :
              <div className="post-name">{this.props.post.posterName}</div>
          }
          <div className="post-time">{this.props.post.postTime}</div>
          <div className="post-location">{this.props.post.postLocation}</div>
          <div className="post-content">{this.props.post.postContent}</div>
          {comments}
          <input
              className="commment-input"
              type="text"
              placeholder="write your comment here..."
              value={this.state.commentToBePost}
              onChange={this.handleCommentToBePostChange}
              onKeyDown={this.handleKeyPress}
          />
        </div>
        </div>

    );
  }
}



class Comment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  togglePopup() {
    this.setState({
      visible: !this.state.visible
    });
  }

  handleDelete(e) {
    this.togglePopup();
      $.ajax({
        type: "DELETE",
        url: "http://localhost:3001/deletecomment/" + this.props.comment.commentId,
        crossDomain: true,
        xhrFields: {withCredentials: true},
        success: function (data) {
          if (data.msg === '') {
            this.props.handleLoad();
          } else {
            alert("Delete Comment failed! >_<");
          }
        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
          alert("Delete Comment failed! >_<");
          alert(xhr.status);
          alert(thrownError);
        }.bind(this)
      });
  }

  render() {

    var commentName = (this.props.currentUserName === this.props.comment.commentName)? "You" : this.props.comment.commentName;

    return (
      <div className="comment-container">
        {
          commentName === "You"?
            <div className="comment" onDoubleClick={this.togglePopup}>
              {this.props.comment.commentPostTime}{" "}
              {commentName} said:{" "}
              {this.props.comment.commentContent}
            </div>
            :
            <div className="comment" >
              {this.props.comment.commentPostTime}{" "}
              {commentName} said:{" "}
              {this.props.comment.commentContent}
            </div>
        }
        {
          this.state.visible &&
            <div className="delete-popup">
                <div>
                    <div className="prompt-delete-text">Delete this message?</div>
                    <button className="cancel-delete-button" onClick={() => this.togglePopup()}>Canel</button>
                    <button className="confirm-delete-button" onClick={() => this.handleDelete()}>OK</button>
                </div>
            </div>
        }
      </div>
    );
  }
}



export default FrontApp;
