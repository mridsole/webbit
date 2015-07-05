// defines a wrapper object around the REST API for interacting with the server/database
// requires jquery

webbitAPI = {

};

// success(response), fail(err)
// requires nodeData as format: { text, loc, connect }
webbitAPI.newNode = function(nodeData, success, fail) {

  var callback = function(response, status) {

    response.done( function(response, textStatus, jqXHR) {
      success(response);
    });

    response.fail( function(jqXHR, textStatus, err) {
      fail(err);
    });
  };

  $.ajax({ url: 'api/new', method: 'POST', data: nodeData, complete: callback });
};

// success(response), fail(err)
webbitAPI.getAllNodes = function(nodeData, success, fail) {

  var callback = function(response, status) {

    response.done( function(response, textStatus, jqXHR) {
      success(response);
    });

    response.fail( function(jqXHR, textStatus, err) {
      fail(err);
    });
  };

  $.ajax({ url: 'api/new', method: 'GET', complete: callback });
};
