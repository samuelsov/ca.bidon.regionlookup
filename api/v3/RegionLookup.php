<?php

/**
 * Return all postal code with city
 *
 * @param array $params
 * @return array API result descriptor
 * @see civicrm_api3_create_success
 * @see civicrm_api3_create_error
 * @throws API_Exception
 */

function civicrm_api3_region_lookup_get($params) {

  watchdog('debug', 'civicrm_api3_region_lookup_get -- ' . print_r($params,1));

  // check params

  if (isset($params['s'])) {
    $params['postcode'] = $params['s'];
  }

  watchdog('debug', '(2) civicrm_api3_region_lookup_get -- ' . print_r($params,1));


  // id -> return corresponding piece of data
  if (isset($params['id']) && !empty($params['id'])) {
    $query = 'SELECT * FROM civicrm_regionlookup WHERE id = %1';
    $p = array(1 => array($params['id'], 'Integer'));
    $dao = CRM_Core_DAO::executeQuery($query, $p);

  // postcode -> return corresponding data
  } elseif (isset($params['postcode']) && !empty($params['postcode'])) {
    $query = "SELECT * FROM civicrm_regionlookup WHERE postcode = %1 ORDER BY id asc";
    $p = array(1 => array($params['postcode'], 'String'));
    $dao = CRM_Core_DAO::executeQuery($query, $p);

  // return all
  } else {
    $query = 'SELECT * FROM civicrm_regionlookup ORDER BY postcode asc';
    $dao = CRM_Core_DAO::executeQuery($query);
  }

  // fields to return
  // TODO: add return in params to choose some fields instead of everything
  $fields = CRM_RegionLookup_BAO_RegionLookup::getFields();
  unset($fields['source']);
  unset($fields['callback']);
  
  $results = array();
  while ($dao->fetch()) {
    $result = array();
    foreach ($fields as $key => $fieldname) {
      $result[$key] = $dao->$key;
    }

    if ($params['sequential']) {
      $results[] = $result;
    } else {
      $results[$dao->id] = $result;
    }

  } 

  return civicrm_api3_create_success($results, $params, 'regionlookup', 'get'); 

}

?>
