var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;


function generateCurrentTime() {
  var now = new Date();
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = ["Jan","Feb","Mar","Apr","May","Jue","Jul","Aug","Sep","Oct","Nov","Dec"];
  var hour = (now.getHours()<10)? "0"+now.getHours() : now.getHours();
  var minute = (now.getMinutes()<10)? "0"+now.getMinutes() : now.getMinutes();
  var second = (now.getSeconds()<10)? "0"+now.getSeconds() : now.getSeconds();
  var userLastCRTime = hour + ":" + minute + ":" + second + " " + days[now.getDay()] + " " + months[now.getMonth()] + " " + now.getDate() + " " + now.getFullYear();
  return userLastCRTime;
}

// take two time in String and out put 1 if timeString1 is later
function compareTime(timeString1, timeString2){
  if (timeString1.length > 0 && timeString2.length > 0){
    var temp1Arr = timeString1.split(" ");
    var temp1hms = temp1Arr[0].split(":");
    temp1Arr.shift();
    var time1 = temp1hms.concat(temp1Arr);

    var temp2Arr = timeString2.split(" ");
    var temp2hms = temp2Arr[0].split(":");
    temp2Arr.shift();
    var time2 = temp2hms.concat(temp2Arr);

    // compare year
    if (parseInt(time1[6], 10) > parseInt(time2[6], 10)){
      return 1;
    } else if (parseInt(time1[6], 10) < parseInt(time2[6], 10)){
      return -1;
    }

    // compare month
    var months = ["Jan","Feb","Mar","Apr","May","Jue","Jul","Aug","Sep","Oct","Nov","Dec"];
    if (months.indexOf(time1[4]) > months.indexOf(time2[4])) {
      return 1;
    } else if (months.indexOf(time1[4]) < months.indexOf(time2[4])) {
      return -1;
    }

    // compare date
    if (parseInt(time1[5], 10) > parseInt(time2[5], 10)){
      return 1;
    } else if (parseInt(time1[5], 10) < parseInt(time2[5], 10)){
      return -1;
    }

    // compare hour
    if (parseInt(time1[0], 10) > parseInt(time2[0], 10)){
      return 1;
    } else if (parseInt(time1[0], 10) < parseInt(time2[0], 10)){
      return -1;
    }
    // compare minute
    if (parseInt(time1[1], 10) > parseInt(time2[1], 10)){
      return 1;
    } else if (parseInt(time1[1], 10) < parseInt(time2[1], 10)){
      return -1;
    }
    // compare second
    if (parseInt(time1[2], 10) > parseInt(time2[2], 10)){
      return 1;
    } else if (parseInt(time1[2], 10) < parseInt(time2[2], 10)){
      return -1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }

}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// implement middleware for user signin
router.post('/signin', function(req, res) {

    console.log("in /signin middleware");

    res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, authorization",
      "Access-Control-Max-Age":"1728000",
      'Access-Control-Allow-Credentials': 'true'
    });
    var db = req.db;
    var username = req.body.username;
    var password = req.body.password;
    var filter = { 'name': username, 'password': password };
    var collection = db.get('userList');

    collection.findOne(filter, function (err, result) {
      if (err === null){
        if (result == null) {
          res.send({msg: "Login failure"});
        } else {

          var user = result;
          var userId = user['_id'];
          var username = user["name"];
          var userIconPath = user["icon"];

          // update of lastCommentRetrievalTime
          if (req.body.request === "signin"){

              var userLastCRTime = generateCurrentTime();
              collection.update({ "_id": userId}, { $set: {"lastCommentRetrievalTime": userLastCRTime}}, function(err, result){
                (err == null)? console.log("Update userLastCRTime successfully!\n") : console.log("Update userLastCRTime Failed!\n");
              });
          }

          // retrieve information from mongodb
          // console.log("user", user);
          if (user.friends.length === 0){
            // console.log("user.friends.length === 0");
            var toClient = new Object();
            toClient.user = {
               username: user.name,
               password: user.password,
               userIcon: user.icon,
               userId: user['_id'],
               mobileNumber: user.mobileNumber,
               homeNumber: user.homeNumber,
               address: user.address,
               lastCommentRetrievalTime: user.lastCommentRetrievalTime
            }
            toClient.friendList = [];
            toClient.postList = [];
            toClient.msg = "";
            // console.log("signin toClient", toClient);
            res.cookie('userId', user['_id']);
            res.send(toClient);
          } else {
            // console.log("user.friends is not []");
            db.get("userList").aggregate(
              [
                { $match :
                  { name : username }
                },

                {
                  $unwind : "$friends"
                },

                { $addFields : { "userId": { "$toString": "$_id" }}},
                { $addFields : { "friendIdObj": { "$toObjectId": "$friends.friendId" }}},

                {
                  $lookup:
                  {
                    from : "userList",
                    localField :  "friendIdObj",
                    foreignField : "_id",
                    as : "friendsInfo"
                  },
                },

                {
                  $unwind : "$friendsInfo"
                },

                {
                  $lookup:
                  {
                    from : "postList",
                    localField :  "friends.friendId",
                    foreignField : "userId",
                    as : "friendsPosts"
                  },

                },

                { $unwind: { path: "$friendsPosts", preserveNullAndEmptyArrays: true }},

                { $addFields : { "friendsPosts.postId": { "$toString": "$friendsPosts._id" }}},

                {
                  $lookup:
                  {
                    from : "commentList",
                    localField :  "friendsPosts.postId",
                    foreignField : "postId",
                    as : "friendsPostsComments"
                  },
                },

                { $unwind: { path: "$friendsPostsComments", preserveNullAndEmptyArrays: true }},

                { $addFields : { "friendsPostsComments.userIdObj": { "$toObjectId" : "$friendsPostsComments.userId" }}},
                { $addFields : { "friendsPostsComments.commentId": { "$toString" : "$friendsPostsComments._id" }}},

                {
                  $lookup:
                  {
                    from : "userList",
                    localField :  "friendsPostsComments.userIdObj",
                    foreignField : "_id",
                    as : "commentOwner"
                  },
                },

                { $unwind: { path: "$commentOwner", preserveNullAndEmptyArrays: true }},

                { $addFields : { "commentOwner.commenterId": { "$toString" : "$commentOwner._id" }}},

                {
                  $lookup:
                  {
                    from : "postList",
                    localField :  "userId",
                    foreignField : "userId",
                    as : "currentUserPost"
                  },
                },

                { $unwind: { path: "$currentUserPost", preserveNullAndEmptyArrays: true }},

                { $addFields : { "currentUserPost.postId": { "$toString" : "$currentUserPost._id" }}},

                {
                  $lookup:
                  {
                    from : "commentList",
                    localField :  "currentUserPost.postId",
                    foreignField : "postId",
                    as : "currentUserPostsComments"
                  },
                },

                { $unwind: { path: "$currentUserPostsComments", preserveNullAndEmptyArrays: true }},
                { $addFields : { "currentUserPostsComments.userIdObj": { "$toObjectId" : "$currentUserPostsComments.userId" }}},
                { $addFields : { "currentUserPostsComments.commentId": { "$toString" : "$currentUserPostsComments._id" }}},

                {
                  $lookup:
                  {
                    from : "userList",
                    localField :  "currentUserPostsComments.userIdObj",
                    foreignField : "_id", // string
                    as : "userPostsCommentsOwner"
                  },
                },
                { $unwind: { path: "$userPostsCommentsOwner", preserveNullAndEmptyArrays: true }},


              ], function(err, result){
                  if (err == null) {
                    // console.log("signin result", result);
                    var friendsIdList = [];
                    for (var i = 0; i < result.length; i++) {
                      if (!friendsIdList.includes(result[i].friends.friendId)) {
                        friendsIdList.push(result[i].friends.friendId);
                      }
                    }

                    var toClient = new Object();

                    // user's friends
                    function Friend(friendId, friendName, friendIcon, friendStarredOrNot) {
                      this.friendId = friendId;
                      this.friendName = friendName;
                      this.friendIcon = friendIcon;
                      this.friendStarredOrNot = friendStarredOrNot;
                    }

                    // user's friends' posts
                    function Post(postId, postTime, postLocation, postContent, posterId, posterName, posterIcon, posterStar) {
                      this.postId = postId;
                      this.postTime = postTime;
                      this.postLocation = postLocation;
                      this.postContent = postContent;
                      this.posterId = posterId;
                      this.posterName = posterName;
                      this.posterIcon = posterIcon;
                      this.posterStar = posterStar;
                      this.comments = [];
                    }

                    // user's friends' posts' comments
                    function Comment(commentId, commentName, commentPostTime, commentContent, commentPostId) {
                      this.commentId = commentId;
                      this.commentName = commentName;
                      this.commentPostTime = commentPostTime;
                      this.commentContent = commentContent;
                      this.commentPostId = commentPostId;
                    }

                    var userInfo = {
                      username : result[0].name,
                      password : result[0].password,
                      userIcon : result[0].icon,
                      userId : result[0].userId,
                      mobileNumber : result[0].mobileNumber,
                      homeNumber : result[0].homeNumber,
                      address : result[0].address,
                      lastCommentRetrievalTime : result[0].lastCommentRetrievalTime
                    }

                    toClient.user = userInfo;

                    var friendList = [];
                    for (var i = 0; i < result.length; i++) {
                      if ( i == 0 || result[i].friendsInfo.name != result[i-1].friendsInfo.name ){
                        friendList.push(new Friend(result[i].friends.friendId, result[i].friendsInfo.name, result[i].friendsInfo.icon, result[i].friends.starredOrNot));
                      }
                    }
                    toClient.friendList = friendList;

                    var postList = [];
                    var dupliCheckArr = [];
                    // friends' posts and corresponded comments
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].friendsPosts !== null && !dupliCheckArr.includes(result[i].friendsPosts.postId)) {
                          var dupliCommCheckArr = [];
                          var comments = [];
                          for (var j = 0; j < result.length; j++) {
                            if (result[j].friendsPostsComments !== null && result[j].friendsPostsComments.userIdObj !== null && !dupliCommCheckArr.includes(result[j].friendsPostsComments.commentId) && result[j].friendsPostsComments.deleteTime == '' ) {
                              if (result[j].friendsPostsComments.postId == result[i].friendsPosts.postId) {
                                // if the commenter is current user's friend
                                // --> if commenter id is included in current user's friends.friendId
                                if (friendsIdList.includes(result[j].friendsPostsComments.userId) || result[j].friendsPostsComments.userId === userInfo.userId) {
                                  comments.push(new Comment(result[j].friendsPostsComments.commentId, result[j].commentOwner.name, result[j].friendsPostsComments.postTime, result[j].friendsPostsComments.comment, result[j].friendsPosts.postId));
                                  dupliCommCheckArr.push(result[j].friendsPostsComments.commentId);
                                }
                              }
                            }
                          }
                          var post = new Post(result[i].friendsPosts.postId, result[i].friendsPosts.time, result[i].friendsPosts.location, result[i].friendsPosts.content, result[i].friends.friendId, result[i].friendsInfo.name, result[i].friendsInfo.icon, result[i].friends.starredOrNot);

                          if (comments.length > 1){
                            comments.sort(function(comment1, comment2){
                              return compareTime(comment1.commentPostTime, comment2.commentPostTime);
                            });
                          }

                          post.comments = comments;
                          postList.push(post);
                          dupliCheckArr.push(result[i].friendsPosts.postId);
                        }
                    }

                    // current user's posts and corresponded comments
                    dupliCheckArr = [];
                    for (var i = 0; i < result.length; i++) {
                      if (result[i].currentUserPost !== null && result[i].currentUserPost.postId !== null && !dupliCheckArr.includes(result[i].currentUserPost.postId)){
                        var dupliCommCheckArr = [];
                        var comments = [];
                        for (var j = 0; j < result.length; j++) {
                          if (result[j].currentUserPostsComments.userIdObj !== null && !dupliCommCheckArr.includes(result[j].currentUserPostsComments.commentId) && result[j].currentUserPostsComments.deleteTime == "") {
                            if (friendsIdList.includes(result[j].currentUserPostsComments.userId) || result[j].currentUserPostsComments.userId === userInfo.userId){
                              if (result[j].currentUserPostsComments.postId === result[i].currentUserPost.postId) {
                                comments.push(new Comment(result[j].currentUserPostsComments.commentId, result[j].userPostsCommentsOwner.name, result[j].currentUserPostsComments.postTime, result[j].currentUserPostsComments.comment, result[j].currentUserPost.postId));
                                dupliCommCheckArr.push(result[j].currentUserPostsComments.commentId);
                              }
                            }
                          }
                        }
                        var post = new Post(result[i].currentUserPost.postId, result[i].currentUserPost.time, result[i].currentUserPost.location, result[i].currentUserPost.content, result[i].userId, result[i].name, result[i].icon, "N/A");
                        comments.sort(function(comment1, comment2){
                          return compareTime(comment1.commentPostTime, comment2.commentPostTime);
                        });
                        post.comments = comments;
                        postList.push(post);
                        dupliCheckArr.push(result[i].currentUserPost.postId);
                      }
                    }

                    // later post appears first
                    postList.sort(function(post1, post2){
                      return compareTime(post1.postTime, post2.postTime);
                    });

                    toClient.postList = postList;
                    toClient.msg = "";

                    // console.log("signin toClient", toClient);
                    res.cookie('userId', result[0].userId);
                    res.send(toClient);

                  } else {
                    res.send({msg: err});
                  }
              }
            ); // end of db.get("userList").aggregate()
          } // end of friends is not []
        } // end of result != null
      } // end of err == null
      else { // if err exists
        res.send({msg: err});
      } // end of err exists
    });
});

// implement middleware for user logout
router.get('/logout', function (req, res) {
    console.log("in /logout middleware");
    res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, authorization",
      "Access-Control-Max-Age":"1728000",
      'Access-Control-Allow-Credentials': 'true'
    });
    var db = req.db;
    var collection = db.get('userList');
    var id = new ObjectId(req.cookies.userId);

    collection.update({ '_id': id }, { $set: { 'lastCommentRetrievalTime': "" } }, function (err, result) {
        if(err===null){
            console.log("update lastCommentRetrievalTime successfully!!");
            res.clearCookie("userId");
            console.log("logout successfully! ^_^");
            res.send({ msg: '' });
        }else{
            console.log("logout failed! >_<");
            res.send({ msg: err });
        }

    });
});

// implement middleware for user getting user profile
router.get('/getuserprofile', function (req, res) {
    console.log("in /getuserprofile middleware");
    res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, authorization",
      "Access-Control-Max-Age":"1728000",
      'Access-Control-Allow-Credentials': 'true'
    });
    var db = req.db;
    var collection = db.get('userList');
    var filter = { '_id' : new ObjectId(req.cookies.userId)};

    collection.findOne(filter, function (err, result) {
        if(err===null){
          if (result == null) {
          } else {
              var user = result;
              var toClient = new Object();
              toClient.mobileNumber = user["mobileNumber"];
              toClient.homeNumber = user["homeNumber"];
              toClient.address = user["address"];
              toClient.msg = '';
              console.log("find user profile successfully!^_^");
              res.json(toClient);
          }
        }else{
            console.log("find user profile failed!>_<");
            res.send({ msg: err });
        }
    });
});

// implement middleware for user saving user profile
router.put('/saveuserprofile', function (req, res) {
    console.log(" in /saveuserprofile middleware");
    res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, authorization",
      "Access-Control-Max-Age":"1728000",
      'Access-Control-Allow-Credentials': 'true'
    });
    var db = req.db;
    var collection = db.get('userList');
    collection.update({ '_id': req.cookies.userId }, { $set: {"mobileNumber": req.body.mobileNumber, "homeNumber": req.body.homeNumber, "address": req.body.address}}, function (err, result) {
      (err === null)? console.log("update profile successfully!") : console.log("update profile failed!>_<");
      res.send(
          (err === null) ? { msg: '' } : { msg: err }
      );
    });
});

// implement middleware for user updating star
router.put('/updatestar/:friendId', function (req, res) {

  console.log("in /updatestar middleware");
    res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, authorization",
      "Access-Control-Max-Age":"1728000",
      'Access-Control-Allow-Credentials': 'true'
    });
    var db = req.db;
    var collection = db.get('userList');
    var newStarState = (req.body.starState == "Y")? "N" : "Y";

    collection.update( { '_id': new ObjectId(req.cookies.userId), "friends.friendId" : req.params.friendId }, { $set: {"friends.$.starredOrNot": newStarState } }, function (err, result) {
      (err === null) ? console.log("update star successfully! ^_^") : console.log("update star failed! >_<");
      res.send(
          (err === null) ? { msg: '' } : { msg: err }
      );
    });
});

// implement middleware for user posting comment
router.post('/postcomment/:postId', function(req, res) {
    res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, authorization",
      "Access-Control-Max-Age":"1728000",
      'Access-Control-Allow-Credentials': 'true'
    });
    var db = req.db;
    var collection = db.get('commentList');

    var time = generateCurrentTime();
    var newComment  = { "postId" : req.params.postId, "userId" : req.cookies.userId, "postTime" : time, "comment" : req.body.comment, "deleteTime" : ''  };

    collection.insert(newComment, function(err, result){
        (err === null) ? console.log("post comment successfully! ^_^") : console.log("post comment failed! >_<");;
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

// implement middleware for user deleting comment
router.delete('/deletecomment/:commentId', function(req, res) {
  console.log("in /deletecomment middleware");
    res.set({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, authorization",
      "Access-Control-Max-Age":"1728000",
      'Access-Control-Allow-Credentials': 'true'
    });
    var db = req.db;
    var contactID = req.params.id;
    var collection = db.get('commentList');

    var time = generateCurrentTime();

    collection.update({ '_id': new ObjectId(req.params.commentId) }, { $set: {"deleteTime" : time}}, function(err, result){
      res.send((err === null) ? {msg:''} : {msg:err});
    });
});

// implement middleware for loading comments update
router.get('/loadcommentupdates', function (req, res) {

      res.set({
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, authorization",
        "Access-Control-Max-Age":"1728000",
        'Access-Control-Allow-Credentials': 'true'
      });

      var db = req.db;

      // since the assignment note requires to retrive information from
      // "commentList" database based on the the value of _id cookie,
      // we have to first visit "userList" database and look up "commentList"
      // database step by step
      var collection = db.get('userList');

      collection.findOne({ '_id': new ObjectId(req.cookies.userId)}, function (err, result) {
        if (err === null){
          if (result == null) {
          } else {
            var user = result;
            var userId = user['_id'];
            var username = user["name"];
            var userIconPath = user["icon"];

            // retrieve information from mongodb
            db.get("userList").aggregate(
              [
                { $match :
                  { name : username }
                },

                {
                  $unwind : "$friends"
                },

                { $addFields : { "userId": { "$toString": "$_id" }}},
                { $addFields : { "friendIdObj": { "$toObjectId": "$friends.friendId" }}},

                {
                  $lookup:
                  {
                    from : "userList",
                    localField :  "friendIdObj",
                    foreignField : "_id",
                    as : "friendsInfo"
                  },
                },

                {
                  $unwind : "$friendsInfo"
                },

                {
                  $lookup:
                  {
                    from : "postList",
                    localField :  "friends.friendId",
                    foreignField : "userId",
                    as : "friendsPosts"
                  },

                },

                { $unwind: { path: "$friendsPosts", preserveNullAndEmptyArrays: true }},

                { $addFields : { "friendsPosts.postId": { "$toString": "$friendsPosts._id" }}},

                {
                  $lookup:
                  {
                    from : "commentList",
                    localField :  "friendsPosts.postId",
                    foreignField : "postId", // string
                    as : "friendsPostsComments"
                  },
                },

                { $unwind: { path: "$friendsPostsComments", preserveNullAndEmptyArrays: true }},

                { $addFields : { "friendsPostsComments.userIdObj": { "$toObjectId" : "$friendsPostsComments.userId" }}},
                { $addFields : { "friendsPostsComments.commentId": { "$toString" : "$friendsPostsComments._id" }}},

                {
                  $lookup:
                  {
                    from : "userList",
                    localField :  "friendsPostsComments.userIdObj",
                    foreignField : "_id",
                    as : "commentOwner"
                  },
                },

                { $unwind: { path: "$commentOwner", preserveNullAndEmptyArrays: true }},

                { $addFields : { "commentOwner.commenterId": { "$toString" : "$commentOwner._id" }}},

                {
                  $lookup:
                  {
                    from : "postList",
                    localField :  "userId",
                    foreignField : "userId",
                    as : "currentUserPost"
                  },
                },

                { $unwind: { path: "$currentUserPost", preserveNullAndEmptyArrays: true }},

                { $addFields : { "currentUserPost.postId": { "$toString" : "$currentUserPost._id" }}},

                {
                  $lookup:
                  {
                    from : "commentList",
                    localField :  "currentUserPost.postId",
                    foreignField : "postId",
                    as : "currentUserPostsComments"
                  },
                },

                { $unwind: { path: "$currentUserPostsComments", preserveNullAndEmptyArrays: true }},
                { $addFields : { "currentUserPostsComments.userIdObj": { "$toObjectId" : "$currentUserPostsComments.userId" }}},
                { $addFields : { "currentUserPostsComments.commentId": { "$toString" : "$currentUserPostsComments._id" }}},

                {
                  $lookup:
                  {
                    from : "userList",
                    localField :  "currentUserPostsComments.userIdObj",
                    foreignField : "_id",
                    as : "userPostsCommentsOwner"
                  },
                },
                { $unwind: { path: "$userPostsCommentsOwner", preserveNullAndEmptyArrays: true }},

              ], function(err, result){
                  if (err == null) {

                    var friendsIdList = [];
                    for (var i = 0; i < result.length; i++) {
                      if (!friendsIdList.includes(result[i].friends.friendId)) {
                        friendsIdList.push(result[i].friends.friendId);
                      }
                    }

                    var toClient = new Object();

                    var lastCommentRetrievalTime = result[0].lastCommentRetrievalTime;
                    console.log("lastCommentRetrievalTime", lastCommentRetrievalTime);

                    // user's friends' posts' comments
                    function Comment(commentId, commentName, commentPostTime, commentContent, commentPostId) {
                      this.commentId = commentId;
                      this.commentName = commentName;
                      this.commentPostTime = commentPostTime;
                      this.commentContent = commentContent;
                      this.commentPostId = commentPostId;
                    }


                    var dupliCheckArr = [];

                    var deletedCommentIds = [];
                    var newComments = [];

                    for (var i = 0; i < result.length; i++) {
                      var testedComment = result[i].friendsPostsComments;

                      if (testedComment !== null && testedComment.commentId !== null && !dupliCheckArr.includes(testedComment.commentId)) {
                        if (friendsIdList.includes(testedComment.userId) || testedComment.userId === result[0].userId) {

                          // for deleted without notice comments
                          if (testedComment.deleteTime !== ''){
                            if (compareTime(lastCommentRetrievalTime, testedComment.deleteTime)<0) {
                              if (!deletedCommentIds.includes(testedComment.commentId)){
                                deletedCommentIds.push(testedComment.commentId);
                              }
                            }
                          }

                          // for newly posted comments
                          if (testedComment.deleteTime === ''){
                            if (compareTime(lastCommentRetrievalTime, testedComment.postTime)<0) {
                              newComments.push(new Comment(testedComment.commentId, result[i].commentOwner.name, testedComment.postTime, testedComment.comment, testedComment.postId));
                            }
                          }

                        }
                        dupliCheckArr.push(testedComment.commentId);
                      }
                    }


                    for (var i = 0; i < result.length; i++) {
                      var testedComment = result[i].currentUserPostsComments;
                      // var testedComment = result[i].currentUserPostsComments;

                      if (testedComment !== null && testedComment.commentId !== null && !dupliCheckArr.includes(testedComment.commentId)) {
                        if (friendsIdList.includes(testedComment.userId) || testedComment.userId === result[0].userId) {

                          // for deleted without notice comments
                          if (testedComment.deleteTime !== ''){
                            if (compareTime(lastCommentRetrievalTime, testedComment.deleteTime)<0) {
                              if (!deletedCommentIds.includes(testedComment.commentId)){
                                deletedCommentIds.push(testedComment.commentId);
                              }
                            }
                          }

                          // for newly posted comments
                          if (testedComment.deleteTime === ''){
                            if (compareTime(lastCommentRetrievalTime, testedComment.postTime)<0) {
                              newComments.push(new Comment(testedComment.commentId, result[i].userPostsCommentsOwner.name, testedComment.postTime, testedComment.comment, testedComment.postId));
                            }
                          }

                        }
                        dupliCheckArr.push(testedComment.commentId);

                      }
                    }

                    toClient.deletedCommentIds = deletedCommentIds;
                    toClient.newComments = newComments;

                    // update of lastCommentRetrievalTime
                    var userLastCRTime = generateCurrentTime();
                    collection.update({ "_id": new ObjectId(req.cookies.userId)}, { $set: {"lastCommentRetrievalTime": userLastCRTime}}, function(err, result){
                      (err == null)? console.log("Update userLastCRTime successfully!\n") : console.log("Update userLastCRTime Failed!\n");
                    });

                    toClient.msg = "";
                    // console.log("loadcommentupdates toClient:");
                    // console.log(toClient);
                    console.log("load comment update successfully!^_^");
                    res.send(toClient);

                  } else {
                    console.log("load comment update failed!>_<");
                    res.send({msg: err});
                  }
              }
            ); // end of db.get("userList").aggregate()
          } // end of result != null
        } // end of err == null
        else { // if err exists
          res.send({msg: err});
        } // end of err exists
      });
});

/*
 * Handle preflighted request
 */
router.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials','true');
  res.send(200);
});

module.exports = router;
