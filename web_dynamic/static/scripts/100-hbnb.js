let locIds = [];
let locNames = [];
window.onload = function () {
  console.log('Finished loading!');
  buildPage({});

  let selected = {};
  let amenityIds = [];
  // location checkbox action performed
  $('.locations INPUT[type=checkbox]').click(function () {
    let len = locIds.length;
    const _id = $(this)[0]['dataset']['id'];
    const _name = $(this)[0]['dataset']['name'];
    let string = '';
    if ($(this).is(':checked')) {
      if (isStateCheckbox(this)) {
        selectStateCities(_id, true);
      }
      locIds.push(_id);
      locNames.push(_name);
//      console.log(locIds);
    } else {
      if (isStateCheckbox(this)) {
        selectStateCities(_id, false);
      }
      let index = locIds.indexOf(_id);
      locIds.splice(index);
      index = locNames.indexOf(_name);
      locNames.splice(index);
    }
//    console.log('HERE---->' + locNames);
    let i = 0;
    len = locIds.length;
    for (let key in locNames) {
      string = string + locNames[key];
      if (len > 1) {
        if (i !== (len - 1)) {
          string = string + ', ';
        }
      }
      i += 1;
    }
    $('DIV.locations h4').text(string);
  });

  // amenitiy checkbox action performed
  $('.amenities INPUT[type=checkbox]').click(function () {
    $(this).each(function () {
      let len = Object.keys(selected).length;
      const _id = $(this)[0]['dataset']['id'];
      const _name = $(this)[0]['dataset']['name'];
      let string = '';
        //  add
      if ($(this).is(':checked')) {
        selected[_id] = _name;
        amenityIds.push(_id);
      } else {
          // delete
        delete selected[_id];
        const index = amenityIds.indexOf(_id);
        amenityIds.splice(index);
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
    buildPage({'amenities': amenityIds, 'cities': locIds, 'states': locIds});
  });
};

function selectStateCities (stateId, shouldSelect) {
  const locBoxes = $('.locations INPUT[type=checkbox]');
  for (let i = 0; i < locBoxes.length; i++) {
    if (locBoxes[i]['dataset']['state_id'] === stateId) {
      if (shouldSelect) {
        locBoxes[i].checked = true;
        locBoxes[i].disabled = true;
      } else {
        locBoxes[i].checked = false;
        locBoxes[i].disabled = false;
      }
//      const name = locBoxes[i]['dataset']['name'];
//      const id = locBoxes[i]['dataset']['id'];
//      let index = locNames.indexOf(name);
//      locNames.splice(index);
//      index = locIds.indexOf(id);
//      locIds.splice(index);
    }
  }
}

function isStateCheckbox (cb) {
  const stateId = $(cb)[0]['dataset']['state_id'];
//    console.log('state_id: ' + state_id);
  if (stateId === undefined) {
    return true;
  }
  return false;
}

function buildPage (dict) {
  let users = {};
  $.ajax({
    async: false,
    url: 'http://0.0.0.0:5001/api/v1/users/',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function (res) {
      for (let i in res) {
        users[res[i]['id']] = res[i]['first_name'] + ' ' + res[i]['last_name'];
      }
    }
  });
  $.ajax({
    async: false,
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
        article.append('<div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + v.max_guest + ' Guests</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + v.number_rooms + ' Bedrooms</div><br /><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + v.number_bathrooms + ' Bathroom</div></div>');

        // DESCRIPTION
        article.append('<div class="description">' + v.description + '</div>');

        // OWNER (USER)
        article.append('<div class="user"><strong>Owner: ' + users[v.user_id] + '</strong>');
        article.append('</div>');
        $('.places').append(article);
      });
    }
  });
}
