package com.hriston.phonegap.plugins;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

public class Calendar extends CordovaPlugin {

	public static final String ACTION_CREATE_EVENT = "createEvent";
	public static final String ACTION_DELETE_EVENT = "deleteEvent";
	public static final String ACTION_FIND_EVENT = "findEvent";
	public static final String ACTION_MODIFY_EVENT = "modifyEvent";

	public static final Integer RESULT_CODE_CREATE = 0;
	private CallbackContext callback;

	public static final String[] EVENT_PROJECTION = new String[] {
		"title", 
		"description", 
		"eventLocation", 
		"dtstart", 
		"dtend", 
		"allDay"
	};
	
	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    	if (ACTION_CREATE_EVENT.equals(action)) {
    		this.callback = callbackContext;
            final Intent calIntent = new Intent(Intent.ACTION_EDIT)
                        .setType("vnd.android.cursor.item/event")
                        .putExtra("title", args.getString(0))
                        .putExtra("eventLocation", args.getString(1))
                        .putExtra("description", args.getString(2))
                        .putExtra("beginTime", args.getLong(3))
                        .putExtra("endTime", args.getLong(4))
                        .putExtra("allDay", isAllDayEvent(new Date(args.getLong(3)), new Date(args.getLong(4))));
            this.cordova.startActivityForResult(this, calIntent, RESULT_CODE_CREATE);
            return true;
    	} else if (ACTION_FIND_EVENT.equals(action)) {
    		ContentResolver contentResolver = cordova.getActivity().getContentResolver();
    		Uri uri = Uri.parse("content://com.android.calendar/events");
    		String selection = "(((title LIKE ?) OR (eventLocation LIKE ?) OR (description LIKE ?)) AND ((dtstart " +
    				"> ?) AND (dtend < ?)))";
    		//String[] selectionArgs = new String[]{args.getString(0), args.getString(1), args.getString(2), args.getString(3), args.getString(4)};
    		
    		JSONArray jsarray = args.getJSONArray(0);
    		JSONArray jsonResult = new JSONArray();
    		for (int i = 0; i < jsarray.length(); i++) {
    			JSONObject jsobject = jsarray.getJSONObject(i);
    			String eventType = jsobject.getString("type");
    			String search = jsobject.getString("search");
    			String[] selectionArgs = new String[]{search, search, search, args.getString(1), args.getString(2)};
    			Cursor cursor = contentResolver.query(uri, EVENT_PROJECTION, selection, selectionArgs, null);
        		while (cursor.moveToNext()) {
        			jsonResult.put(getJSONObject(
    						cursor.getString(0),
    						cursor.getString(1),
    						cursor.getString(2),
    						cursor.getString(3),
    						cursor.getString(4),
    						cursor.getString(5),
    						eventType));
    			}
        		cursor.close();
    		}
    		
    		callbackContext.success(jsonResult);
    		return true;
    	} else {
            callbackContext.error("calendar." + action + " is not (yet) supported on Android.");
            return false;
        }
    }

	private JSONObject getJSONObject(String title, String description, String eventLocation, String beginTime, String endTime, String allDay, String eventType) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("title", title);
            obj.put("description", description);
            obj.put("eventLocation", eventLocation);
            obj.put("beginTime", beginTime);
            obj.put("endTime", endTime);
            obj.put("allDay", allDay);
            obj.put("eventType", eventType);
        } catch (JSONException e) {
            System.out.println("Event.toString JSONException: "+e.getMessage());
        }
        return obj;
    }
	
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (requestCode == RESULT_CODE_CREATE) {
			if (resultCode == Activity.RESULT_OK) {
				callback.success();
			} else if (resultCode == Activity.RESULT_CANCELED) {
				callback.error("User cancelled");
			} else {
				callback.error("Unable to add event (" + resultCode + ").");
			}
		}
	}

	private boolean isAllDayEvent(final Date startDate, final Date endDate) {
		return startDate.getHours() == 0 && startDate.getMinutes() == 0
				&& startDate.getSeconds() == 0 && endDate.getHours() == 0
				&& endDate.getMinutes() == 0 && endDate.getSeconds() == 0;
	}
}
