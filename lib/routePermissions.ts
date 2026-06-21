export const routePermissions: Record<string, string[]> = {
  "/dashboard/accounts/users": ["view_user"],
  "/dashboard/accounts/users/new": ["add_user"],
  "/dashboard/accounts/users/add": ["add_user"],
  "/dashboard/accounts/roles": ["view_group", "view_permission"],
  "/dashboard/accounts/audit": ["view_logentry"],
  
  "/dashboard/hotels": ["view_hotel"],
  "/dashboard/hotels/list": ["view_hotel"],
  "/dashboard/hotels/new": ["add_hotel"],
  "/dashboard/hotels/guests": ["view_person"],
  "/dashboard/hotels/guests/new": ["add_person"],
  "/dashboard/hotels/companions": ["view_companions"],
  
  "/dashboard/security/centers": ["view_center"],
  "/dashboard/security/centers/add": ["add_center"],
  "/dashboard/security/places": ["view_place"],
  "/dashboard/security/places/add": ["add_place"],
  "/dashboard/security/owners": ["view_onwer"],
  "/dashboard/security/documents": ["view_documents"],
  "/dashboard/security/blacklist": ["view_blacklist"],
  "/dashboard/security/nationalities": ["view_nationality"],
  
  "/dashboard/travels": ["view_travel"],
  "/dashboard/travels/companies": ["view_travel"],
  "/dashboard/travels/trips": ["view_trip"],
  "/dashboard/travels/lines": ["view_linetravel"],
  "/dashboard/travels/passengers": ["view_traveler"],
};
