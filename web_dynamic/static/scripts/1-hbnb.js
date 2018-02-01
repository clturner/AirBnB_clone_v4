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
};
