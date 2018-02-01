window.onload = function () {
  console.log('Finished loading!');
  buildPage({});

  let selected = {};
  let amenityIdList = [];
  $('INPUT[type=checkbox]').click(function () {
    $(this).each(function () {
      let len = Object.keys(selected).length;
      const _id = $(this)[0]['dataset']['id'];
      const _name = $(this)[0]['dataset']['name'];
      let string = '';
      //  add
      if ($(this).is(':checked')) {
        selected[_id] = _name;
        amenityIdList.push(_id);
      } else {
        // delete
        delete selected[_id];
        const index = amenityIdList.indexOf(_id);
        amenityIdList.splice(index);
      }
      let i = 0;
      len = Object.keys(selected).length;
      for (let key in selected) {
        string = string + selected[key];
        if (len > 1) {
          if (i !== (len - 1)) {
            string = string + ', ';
          }
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

// curl -X POST http://0.0.0.0:5001/api/v1/places_search -H "Content-Type: application/json"
// -d '{"amenities": ["6f8987f8-7354-4770-8774-4f5e25acb173", "416cddd7-746e-4715-821c-3ad30b9bc3c3"]}'
  $('BUTTON').on('click', function () {
    $('.places').empty();
    $('.places').append('<h1>Places</h1>');
    buildPage({'amenities': amenityIdList});
  });
};

function buildPage (dict) {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(dict),
    success: function (res) {
      $.each(res, function (k, v) {
        let article = $('<article>');

        // NAME
        article.append('<div class="title"><h2>' + v.name + '</h2><div class="price_by_night">$' + v.price_by_night + '</div></div>');

        // INFO: max guest, number rooms, number bathrooms
        article.append('<div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + v.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + v.number_rooms + ' Bedrooms</div><br /><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i></br>' + v.number_bathrooms + ' Bathroom</div></div>');

        // DESCRIPTION
        article.append('<div class="description">' + v.description + '</div>');

        // OWNER (USER)
//        article.append('<div class="user">');
//        article.append('<strong>Owner: {{ users[place.user_id] }}</strong>');
//        article.append('</div>');

        $('.places').append(article);
      });
    }
  });
}

// function getUser (uid, count) {
//   $.ajax({
//    url: 'http:/0.0.0.0:5001/api/v1/users/' + uid,
//    type: 'GET',
//    dataType: 'json',
//    contentType: 'application/json',
//    success: function (res) {
//      console.log('USER: ' + res[count]);
//    }
//  });
// }
