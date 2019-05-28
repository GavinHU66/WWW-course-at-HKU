// The middleware in this users.js controls how the server responds to the HTTP GET requests for “http://localhost:3000/users/contactList”.
// The middleware will first retrieve the database connection.
// Then it will retrieve the ‘contactList’ collection,
// encode everything in this collection as a JSON message and send it back to the client.

var express = require('express');
var router = express.Router();

/*
* GET contactList.
*/
router.get('/contactList', function(req, res) {
	var db = req.db;
	var collection = db.get('contactList');
	collection.find({},{},function(err,docs){
		if (err === null)
			res.json(docs);
		else res.send({msg: err});
	});
});

/*
 * POST to addContact.
 */
router.post('/addContact', function(req, res) {
    var db = req.db;
    var collection = db.get('contactList');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT to updateContact
 */
router.put('/updateContact/:id', function (req, res) {
  var db = req.db;
  var collection = db.get('contactList');
  var contactToUpdate = req.params.id;

  //TO DO: update the contact record in contactList collection,
  //according to contactToUpdate and data included in the body of the HTTP request
  collection.update({_id:contactToUpdate}, req.body, function(err, result){
      res.send(
          (err === null) ? { msg: '' } : { msg: err }
      );
  });
});

/*
 * DELETE to delete a contact.
 */
router.delete('/deleteContact/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('contactList');
    var contactToUpdate = req.params.id;

    //TO DO: update the contact record in contactList collection,
    //according to contactToUpdate and data included in the body of the HTTP request
    collection.remove({_id:contactToUpdate}, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });

});

module.exports = router;
