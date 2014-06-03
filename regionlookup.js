cj(function ($) {

  function checkRegionLookupSource() {

    // The "source" is the DOM selector that triggers the lookup (ex: postcode field)
    if (! CRM.regionlookup.source) {
      return;
    }

    // define autocomplete with all available postcode
    // TODO: should add autocomplete only when at least 3 char are entered to limit ajax transfert
    // cf. civicrm/templates/CRM/common/Navigation.tpl for an example
    // api doc https://github.com/agarzola/jQueryAutocompletePlugin/wiki/Options
    var path = CRM.url('civicrm/ajax/rest', 'entity=RegionLookup&action=get&sequential=1&json=1');

    $(CRM.regionlookup.source).autocomplete(path /*data['values']*/, {

      dataType: 'json',
      parse: function(data) {
        console.log('in there');
        console.log(data);
        console.log(data.values);
        parsed_data = []; 
        for (i=0; i < data.values.length; i++) {
          parsed_data[i] = { data: data.values[i], value: data.values[i].postcode, result: data.values[i].postcode };
        }
        console.log(parsed_data);
        return parsed_data;
        //return data.values;
      },
      extraParams: {
        postcode: function () {
          return $(this).value;
        }
      },
      minChars: 3,
      delay: 400,
      max: 5,
      //autoFill: true,
      //mustMatch: true,
      matchContains: true,
      formatItem: function(row, i, max) {
        console.log(row);
        return row.postcode + ' (' + row.city + ")";
      },
      formatMatch: function(row, i, max) {
        return row.postcode;
      },
      formatResult: function(row, i, max) {
        return row.postcode;
      }
    }).result( function(event, data, formatted) {
      // when user choose something - complete other component of the address

      if (!data['id']) {
        return;
      }

      // assume we have everything in data to speed up things -- otherwise need another call to the api (commented below)
      $.each(data, function(key, val) {
        if (CRM.regionlookup[key]) {
          $(CRM.regionlookup[key]).val(val).change();
        }
      });


      // get the details for this specific id
      /*CRM.api('RegionLookup', 'get', {'sequential': 1, 'id': data['id']}, {
        success: function(data) {
          // copy values to corresponding fields
          $.each(data['values'][0], function(key, val) {
            if (key != 'source' && CRM.regionlookup[key]) {
              $(CRM.regionlookup[key]).val(val).change();
            }
          });
        }
      });*/

    });

  }

  // check for lookup source when starting the page
  checkRegionLookupSource();

  // check for lookup source where an ajax query is completed (ex: dynamic form generation on contact summary)
  cj( document ).ajaxComplete(function(){
  //cj( document ).on('crmFormLoad', function() {
    checkRegionLookupSource();
  });


});

