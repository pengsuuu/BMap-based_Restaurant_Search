# BMap-based_Restaurant_Search
[Basic Description]
You can search some restaurants from my favourite list.

[Initial version document]
Written time:18:00, Jan 14, 2016 @Beijing
Author: Pengsu Zhao

[Required/Committed features (all achieved)]
1. Listing some restaruants by user searching. (Seach innput value could be location or a specific name)
2. User allowed to filtering list results. (filter options could be price arrange and district)
3. User allowed to have a sorted list by different ways. (sorting results by price, distance or rates)
4. While more results comes up, they should be split into different page, the pager bar provided to user.

[Use Guide]
1. Basic Requirement:
   You have to connect your device to Internet.
   All imgs, data and other formated data trived from server, as JSON format.
   Otherwise, what you expected...
2. About Search options: 
   You can searching results by the name of restaurant, strict name, street name.
   When you search some place or restaurant out of Beijing city, there will be no results comes out.
   This is not a functional error. The reason is all data behind this demo only coverd a little set of Beijing's Restaruant.
   No surprise, if you input valid data, like(“月坛北街”), 
   this place has no restarunt that included in my data table, so nothing will shows up.
3. About Marker on map:
   After successful reasearching, you can saw the markers on the map, 
   but you not allowed to click that button to get extra information.
   I didn't add this function into my feature lists. ("SearchInfoWindow.js" will helps)
4. Extra Information about this demo:
   I used Bootstrap, jQuery, and Baudi Map API. (Tools: Webstorm and Postman)
   I used my personal Baidu API developer ID, API version 2.0.
   
   Some information in this demo, I saw it from "dazhongdianping.com".
   This demo will be used for learning, also will be sent to YF company, as they required to.
   
 
