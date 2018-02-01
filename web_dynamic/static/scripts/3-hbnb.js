window.onload = function () {
  console.log('Finished loading!');
  let selected = {};
  $('INPUT[type=checkbox]').click(function () {
    $(this).each(function () {
      const len = Object.keys(selected).length;
      const _id = $(this)[0]['dataset']['id'];
      const _name = $(this)[0]['dataset']['name'];
      //  add
      if ($(this).is(':checked')) {
        selected[_id] = _name;
      } else {
        // delete
        delete selected[_id];
      }
      let string = '';

      let i = 0;
      for (let key in selected) {
        string = string + selected[key];
        if (i !== len) {
          string = string + ', ';
        }
        i += 1;
      }
      $('DIV.amenities h4').text(string);
    });
  });

  // api status indicator
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    dataType: 'json',
    success: function (res) {
      if (res.status === 'OK') {
        $('DIV#api_status').addClass('available');
      } else {
        $('DIV#api_status').removeClass('available');
      }
    },
    error: function (res) {
      $('DIV#api_status').removeClass('available');
    }
  });

  // Place builder
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({}),
    dataType: 'json',
    contentType: 'application/json',
    success: function (res) {
//      let count = 0;
      $.each(res, function (k, v) {
        let article = $('<article>');

        // NAME
        article.append('<div class="title"><h2>' + v.name + '</h2><div class="price_by_night">$' + v.price_by_night + '</div></div>');
//        console.log('uid: ' + v.user-id);
        // INFO: max guest, number rooms, number bathrooms
        article.append('<div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + v.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + v.number_rooms + ' Bedrooms</div><br /><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i></br>' + v.number_bathrooms + ' Bathroom</div></div>');

        // DESCRIPTION
        article.append('<div class="description">' + v.description + '</div>');

        // OWNER (USER)
//        article.append('<div class="user">');
//        article.append('<strong>Owner: {{ users[place.user_id] }}</strong>');
//        article.append('</div>');

        $('.places').append(article);
//        const user = getUser(v.user_id, count);
//        console.log('USER: ' + user);
//        count += 1;
      });
    }
  });
};

// function getUser (uid, count) {
//  $.ajax({
//    url: 'http:/0.0.0.0:5001/api/v1/users/' + uid,
//    type: 'GET',
//    dataType: 'json',
//    contentType: 'application/json',
//    success: function (res) {
//      console.log('USER: ' + res[count]);
//    }
//  });
// }
