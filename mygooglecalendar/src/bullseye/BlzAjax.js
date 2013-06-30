// BlzAjax.js
//
// Bullseye is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.Ajax = {
	get: function(url, callback, params, headers) {
		Ext.Ajax.request({
			method: 'GET',
			url: url,
			params: params,
			headers: headers,
			
			callback: function(options, success, response) {
				callback({
					success: success,
					data: response.responseText,
					response: response,
					options: options
				});
			}
		});
	},
	post: function(url, postData, callback, headers) {
		Ext.Ajax.request({
			method: 'POST',
			url: url,
			params: postData,
			headers: headers,
			callback: function(options, success, response) {
				callback({
					success: success,
					data: response.responseText,
					response: response,
					options: options
				});
			}
		});
	}
}
