// BlzOutlook.js
//
// Bullseye is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.


Blz.Outlook = {
	OlActionCopy: {
		olReply: 0,
		olReplyAll: 1,
		olForward: 2,
		olReplyFolder: 3,
		olRespond: 4
	},
	OlActionReplyStyle: {
		olOmitOriginalText: 0,
		olEmbedOriginalItem: 1,
		olIncludeOriginalText: 2,
		olIndentOriginalText: 3
	},
	OlActionResponseStyle: {
		olOpen: 0,
		olSend: 1,
		olPrompt: 2
	},
	OlActionShowOn: {
		olDontShow: 0,
		olMenu: 1,
		olMenuAndToolbar: 2
	},
	
	OlAttachmentType: {
		olByValue: 1,
		olByReference: 4,
		olEmbeddedItem: 5,
		olOLE: 6
	},
	OlBusyStatus: {
		olFree: 0,
		olTentative: 1,
		olBusy: 2,
		olOutOfOffice: 3
	},
	
	OlDaysOfWeek: {
		olSunday: 1,
		olMonday: 2,
		olTuesday: 4,
		olWednesday: 8,
		olThursday: 16,
		olFriday: 32,
		olSaturday: 64
	},
	OlDefaultFolders: {
		olFolderDeletedItems: 3,
		olFolderOutbox: 4,
		olFolderSentMail: 5,
		olFolderInbox: 6,
		olFolderCalendar: 9,
		olFolderContacts: 10,
		olFolderJournal: 11,
		olFolderNotes: 12,
		olFolderTasks: 13
	},
	OlFlagStatus: {
		olNoFlag: 0,
		olFlagComplete: 1,
		olFlagMarked: 2
	},
	
	OlFolderDisplayMode: {
		olFolderDisplayNormal: 0,
		olFolderDisplayFolderOnly: 1,
		olFolderDisplayNoNavigation: 2
	},
	
	OlFormRegistry: {
		olDefaultRegistry: 0,
		olPersonalRegistry: 2,
		olFolderRegistry: 3,
		olOrganizationRegistry: 4
	},
	OlGender: {
		olUnspecified: 0,
		olFemale: 1,
		olMale: 2
	},
	OlImportance: {
		olImportanceLow: 0,
		olImportanceNormal: 1,
		olImportanceHigh: 2
	},
	OlInspectorClose: {
		olSave: 0,
		olDiscard: 1,
		olPromptForSave: 2
	},
	OlItems: {
		olMailItem: 0,
		olAppointmentItem: 1,
		olContactItem: 2,
		olTaskItem: 3,
		olJournalItem: 4,
		olNoteItem: 5,
		olPostItem: 6
	},
	OlJournalRecipientsType: {
		olAssociatedContact: 1
	},
	OlMailingAddress: {
		olNone: 0,
		olHome: 1,
		olBusiness: 2,
		olOther: 3
	},
	OlMailRecipientType: {
		olOriginator: 0,
		olTo: 1,
		olCC: 2,
		olBCC: 3
	},
	OlMeetingRecipientType: {
		olOrganizer: 0,
		olRequired: 1,
		olOptional: 2,
		olResource: 3
	},
	OlMeetingResponse: {
		olMeetingTentative: 2,
		olMeetingAccepted: 3,
		olMeetingDeclined: 4
	},
	OlMeetingStatus: {
		olNonMeeting: 0,
		olMeeting: 1,
		olMeetingReceived: 3,
		olMeetingCanceled: 5
	},
	OlNoteColor: {
		olBlue: 0,
		olGreen: 1,
		olPink: 2,
		olYellow: 3,
		olWhite: 4
	},
	OlRecurrenceType: {
		olRecursDaily: 0,
		olRecursWeekly: 1,
		olRecursMonthly: 2,
		olRecursMonthNth: 3,
		olRecursYearly: 5,
		olRecursYearNth: 6
	},
	OlRemoteStatus: {
		olRemoteStatusNone: 0,
		olUnMarked: 1,
		olMarkedForDownload: 2,
		olMarkedForCopy: 3,
		olMarkedForDelete: 4
	},
	OlResponseStatus: {
		olResponseNone: 0,
		olResponseOrganized: 1,
		olResponseTentative: 2,
		olResponseAccepted: 3,
		olResponseDeclined: 4,
		olResponseNotResponded: 5
	},
	OlSaveAsType: {
		olTXT: 0,
		olRTF: 1,
		olTemplate: 2,
		olMSG: 3,
		olDoc: 4
	},
	OlSensitivity: {
		olNormal: 0,
		olPersonal: 1,
		olPrivate: 2,
		olConfidential: 3
	},
	OlTaskDelegationState: {
		olTaskNotDelegated: 0,
		olTaskDelegationUnknown: 1,
		olTaskDelegationAccepted: 2,
		olTaskDelegationDeclined: 3
	},
	OlTaskOwnerShip: {
		olNewTask: 0,
		olDelegatedTask: 1,
		olOwnTask: 2
	},
	OlTaskRecipientType: {
		olUpdate: 1,
		olFinalStatus: 2
	},
	OlTaskResponse: {
		olTaskSimple: 0,
		olTaskAssign: 1,
		olTaskAccept: 2,
		olTaskDecline: 3
	},
	OlTaskStatus: {
		olTaskNotStarted: 0,
		olTaskInProgress: 1,
		olTaskComplete: 2,
		olTaskWaiting: 3,
		olTaskDeferred: 4
	},
	OlTrackingStatus: {
		olTrackingNone: 0,
		olTrackingDelivered: 1,
		olTrackingNotDelivered: 2,
		olTrackingNotRead: 3,
		olTrackingRecallFailure: 4,
		olTrackingRecallSuccess: 5,
		olTrackingRead: 6,
		olTrackingReplied: 7
	},
	OlUserPropertyType: {
		olText: 1,
		olNumber: 3,
		olDateTime: 5,
		olYesNo: 6,
		olDuration: 7,
		olKeywords: 11,
		olPercent: 12,
		olCurrency: 14,
		olFormula: 18,
		olCombination: 19
	}
}


Blz.Util.extend(Blz.Outlook, {
	olEventPrefix:"blzOutlookApp_",
	taskEventPrefix:"blzOutlookTasks_",
	apptEventPrefix:"blzOutlookAppts_",
	
	
	initialize: function() {
		this.outlookObject = null;
		this.taskItems = null;
		this.apptItems = null;
		this.warned = false;
		this.userFolderName = "";
		this.notifyMethodPrefix = "onOutlook";
	},
	
	connectOutook: function() {
		if (!this.outlookObject && !this.warned) {
			try {
				this.outlookObject = Blz.Widget.createComObject("Outlook.Application");
				Blz.Widget.connectComObject(this.outlookObject, this.olEventPrefix);
				
				var versParts = this.outlookObject.Version.split(".");
				var majorVersion = 0;
				if (versParts && versParts.length > 0) majorVersion = Number(versParts[0]);
				if (majorVersion < 9) {
					Blz.Widget.alert("This widget requires Outlook 2000 or later.");
					throw ("This widget requires Outlook 2000 or later.");
				}
				this.majorVersion = majorVersion;
				
				// connect folder
				this.connectFolders();
			} catch (e) {
				//Blz.Widget.alert( "Unable to connect to Outlook: " + e );
				this.outlookObject = null;
				this.taskItems = null;
				this.apptItems = null;
				this.warned = true; // don't connect once we have an error.
			}
		}
		return this.outlookObject;
	},
	
	disconnect: function() {
		if (this.outlookObject) {
			try {
				this.disconnectFolders();
				Blz.Widget.disconnectComObject(this.outlookObject);
			} catch (e) {
				Blz.Widget.print("Unable to disconnect to Outlook: " + e);
			}
			this.taskItems = null;
			this.apptItems = null;
			this.outlookObject = null;
		}
	},
	
	reconnect: function() {
		//Blz.Widget.print("reconnet");
		this.disconnect();
		this.connectOutook();
	},
	
	connectFolders: function() {
		//Blz.Widget.print("connectFolders");
		try {
			this.disconnectFolders();
			if (this.outlookObject) {
				var ns = this.outlookObject.GetNamespace("MAPI");
				var folders = ns.Folders;
				
				// Connect to the tasks folder for notifications.
				this.taskItems = null;
				this.taskItems = this.getTaskFolder(ns).Items;
				Blz.Widget.connectComObject(this.taskItems, this.taskEventPrefix);
				
				// Connect to the calendar folder for notifications.
				this.apptItems = null;
				this.apptItems = this.getCalendarFolder(ns).Items;
				Blz.Widget.connectComObject(this.apptItems, this.apptEventPrefix);
			}
		} catch (e) {
			Blz.Widget.msgbox("connect outlook", "Unable to connect to Outlook: " + e);
		}
	},
	
	disconnectFolders: function() {
		try {
			if (this.taskItems) {
				Blz.Widget.disconnectComObject(this.taskItems);
				this.taskItems = null;
			}
			if (this.apptItems) {
				Blz.Widget.disconnectComObject(this.apptItems);
				this.apptItems = null;
			}
		} catch (e) {
			
		}
	},
	
	setUserFolderName: function(name) {
		if (this.userFolderName != name) {
			this.userFolderName = name;
			this.connectFolders();
		}
	},
	
	getUserFolderName: function() {
		return this.userFolderName;
	},
	
	openFolder: function(folderID) {
		try {
			var o = this.connectOutook();
			if (o) {
				var ns = o.GetNamespace("MAPI");
				var folder;
				// Get Tasks
				if (folderID == this.OlDefaultFolders.olFolderCalendar) folder = this.getCalendarFolder(ns);
				else if (folderID == this.OlDefaultFolders.olFolderTasks) folder = this.getTaskFolder(ns);
				else folder = ns.GetDefaultFolder(folderID);
				if (folder) folder.Display();
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.openFolder : " + e);
		}
	},
	
	sendMail: function(mailTo, mailCc, mailSubject, mailBody, send) {
		try {
			var o = this.connectOutook();
			if (!o) return;
			
			//var ns = o.GetNamespace("MAPI");
			var m = o.CreateItem(this.OlItems.olMailItem);
			if (m) {
				m.To = mailTo;
				if (mailCc) m.CC = mailCc;
				if (mailSubject) m.Subject = mailSubject;
				m.Body = mailBody;
				if (send) m.Send();
				else m.Display();
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.sendMail : " + e);
		}
	},
	
	getOutlookItem: function(taskID, folderID) {
		var item = null;
		try {
			var o = this.connectOutook();
			if (o) {
				var ns = o.GetNamespace("MAPI");
				var folder;
				if (folderID == this.OlDefaultFolders.olFolderCalendar) folder = this.getCalendarFolder(ns);
				else if (folderID == this.OlDefaultFolders.olFolderTasks) folder = this.getTaskFolder(ns);
				else folder = ns.GetDefaultFolder(folderID);
				item = ns.GetItemFromID(taskID, folder.StoreID);
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.getOutlookItem: " + e);
		}
		return item;
	},
	
	openItem: function(taskID, folderID) {
		try {
			var item = this.getOutlookItem(taskID, folderID);
			if (item) {
				item.Display(false);
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.openItem: " + e);
		}
	},
	
	deleteItem: function(taskID, folderID) {
		try {
			var item = this.getOutlookItem(taskID, folderID);
			if (item) {
				Blz.Widget.print("try to delete item");
				item.Delete();
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.deleteItem : " + e);
		}
	},
	
	doneTaskItem: function(taskID) {
		try {
			var item = this.getOutlookItem(taskID, this.OlDefaultFolders.olFolderTasks);
			if (item) {
				Blz.Widget.print("try to done task item");
				//item.Status = this.OlTaskStatus.olTaskComplete; // TODO: debug
				item.MarkComplete();
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.doneTaskItem: " + e);
		}
	},
	
	openTasksFolder: function() {
		this.openFolder(this.OlDefaultFolders.olFolderTasks);
	},
	openCalendar: function() {
		this.openFolder(this.OlDefaultFolders.olFolderCalendar);
	},
	openTask: function(taskID) {
		this.openItem(taskID, this.OlDefaultFolders.olFolderTasks);
	},
	openAppointment: function(taskID) {
		this.openItem(taskID, this.OlDefaultFolders.olFolderCalendar);
	},
	
	deleteTask: function(taskID) {
		this.deleteItem(taskID, this.OlDefaultFolders.olFolderTasks);
	},
	deleteAppointment: function(taskID) {
		this.deleteItem(taskID, this.OlDefaultFolders.olFolderCalendar);
	},
	
	createAppointment: function(dayOffset) {
		try {
			var theDayOffset = Number(dayOffset);
			var o = this.connectOutook();
			if (!o) return;
			var ns = o.GetNamespace("MAPI");
			// Get the items for a date
			var calendar = (ns) ? this.getCalendarFolder(ns) : null;
			if (calendar && calendar.Items) {
				var newItem = calendar.Items.Add();
				if (newItem) {
					if (theDayOffset != 0) {
						// must to use UTC for AppointmentItem...
						var e = new Blz.Outlook.Date();
						e.addDays(theDayOffset);
						var utcDate = new Date(e.date.getTime());
						newItem.Start = utcDate;
					}
					newItem.Display();
				}
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.createAppointment : " + e);
		}
	},
	
	createTask: function() {
		try {
			var o = this.connectOutook();
			if (!o) return;
			
			var ns = o.GetNamespace("MAPI");
			var tasks = (ns) ? this.getTaskFolder(ns) : null;
			if (tasks && tasks.Items) {
				var newItem = tasks.Items.Add();
				if (newItem) newItem.Display();
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.createTask : " + e);
		}
	},
	
	getTasks: function() {
		var todoItems = [];
		try {
			var o = this.connectOutook();
			if (!o) return todoItems;
			var ns = o.GetNamespace("MAPI");
			// Get Tasks
			var tasks = this.getTaskFolder(ns);
			var items = tasks.Items;
			for (var i = 0, len = items.Count; i < len; i++) {
				var task = items.Item(i + 1);
				var myPriority = 0;
				switch (task.Importance) {
					case this.OlImportance.olImportanceLow:
						myPriority = 9;
						break;
					case this.OlImportance.olImportanceNormal:
						myPriority = 5;
						break;
					case this.OlImportance.olImportanceHigh:
						myPriority = 1;
						break;
				}
				
				// TaskItem
				// http://msdn.microsoft.com/en-us/library/bb176792.aspx
				
				// 期限を設定していないときに何故か4051/1/1のようなDateが設定される.
				// このため4000年以上のものはundefinedにするworkaroundを入れる.
				var emptyTime = new Date(4000, 1, 1, 0, 0, 0, 0);
				
				todoItems.push({
					id : task.EntryID,
					title : task.Subject,
					priority : myPriority,
					start : (task.StartDate < emptyTime) ? task.StartDate : undefined,
					end : (task.DueDate < emptyTime) ? task.DueDate : undefined,
					isDone: (task.Status == this.OlTaskStatus.olTaskComplete) ? true : false,
					isPrivate : (task.Sensitivity == this.OlSensitivity.olPrivate) ? true : false
					//summary: task.Body,
				});	
				//Blz.Widget.print("task.Subject = " + task.Subject);
				//Blz.Widget.print("task.DueDate = " + task.DueDate);
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.getTasks : " + e);
		}
		return todoItems;
	},
	
	getAppointments: function(dt) {
		var eventItems = [];
		try {
			var o = this.connectOutook();
			if (o == !o) return [];
			var ns = o.GetNamespace("MAPI");
			
			// Get the items for a date
			var calendar = this.getCalendarFolder(ns);
			var items = calendar.Items;
			items.Sort("[Start]", false); // false means ascending
			items.IncludeRecurrences = true;
			
			var todayIs = dt;
			var tomorrowIs = dt.clone();
			tomorrowIs.addDays(1);
			var dayStart = todayIs.toPeriodString(this.majorVersion);
			var dayEnd = tomorrowIs.toPeriodString(this.majorVersion);
			var filter1 = "[Start] >= '" + dayStart + "' AND [Start] < '" + dayEnd + "'";
			var filter2 = "[End] > '" + dayStart + "' AND [End] <= '" + dayEnd + "'";
			var filter3 = "[Start] <= '" + dayStart + "' AND [End] >= '" + dayEnd + "'";
			var filter = "(" + filter1 + ") OR (" + filter2 + ") OR (" + filter3 + ")";
			//Blz.Widget.print(query);
			
			var selected = items.Restrict(filter);
			var apptItem = selected.GetFirst();
			
			while (apptItem) {
				eventItems.push(this.createEvent(apptItem));
				apptItem = selected.GetNext();
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.getAppointments : " + e);
		}
		return eventItems;
	},
	
	createEvent: function(apptItem) {
		// AppointmentItem object
		// http://msdn.microsoft.com/ja-jp/library/cc446751.aspx
		var event = {};
		try {event.id = apptItem.EntryID;} catch (e) {Blz.Widget.print("Blz.Outlook.createEvent : " + e);}
		try {event.title = apptItem.Subject;} catch (e) {Blz.Widget.print("Blz.Outlook.createEvent : " + e);}
		try {event.description = apptItem.Text;} catch (e) {Blz.Widget.print("Blz.Outlook.createEvent : " + e);}
		try {event.start = apptItem.Start;} catch (e) {Blz.Widget.print("Blz.Outlook.createEvent : " + e);}
		try {event.end = apptItem.End;} catch (e) {Blz.Widget.print("Blz.Outlook.createEvent : " + e);}
		try {event.allDay = apptItem.AllDayEvent;} catch (e) {Blz.Widget.print("Blz.Outlook.createEvent : " + e);}
		try {event.isPrivate = (apptItem.Sensitivity == this.OlSensitivity.olPrivate) ? true : false;} catch (e) {Blz.Widget.print("Blz.Outlook.createEvent : " + e);}
		try {event.location = apptItem.Location;} catch (e) {Blz.Widget.print("Blz.Outlook.createEvent : " + e);}
		return event;
		/*
		var event = {
					id: apptItem.EntryID,
					title: apptItem.Subject,
					description: apptItem.Text,
					start: apptItem.Start,
					end: apptItem.End,
					//category: apptItem.Categories,
					allDay: apptItem.AllDayEvent,
					isPrivate: (apptItem.Sensitivity == this.OlSensitivity.olPrivate) ? true : false,
					location: apptItem.Location
					//remainder: apptItem.ReminderSet,
					// Hack, can't get this propery on Vista and YWE4
					//response : apptItem.MeetingResponseStatus,
					//busy: apptItem.BusyStatus
				});*/
	},
	
	getLocalFolderNames: function() {
		var names = [];
		try {
			var o = this.connectOutook();
			if (!o) return;
			
			var ns = o.GetNamespace("MAPI");
			var folders = ns.Folders;
			for (var i = 1; i <= folders.Count; i++) {
				var folder = folders.Item(i);
				var cfolders = (folder) ? folder.Folders : null;
				if (cfolders) {
					for (var j = 1; j <= cfolders.Count; j++) {
						var item = cfolders.Item(j);
						try {
							if (item && item.DefaultItemType == this.OlItems.olAppointmentItem) {
								names.push(folder.Name);
								break;
							}
						} catch (e) {
							Blz.Widget.print("Blz.Outlook.getLocalFolderNames : " + e);
						}
					}
				}
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.getLocalFolderNames : " + e);
		}
		return names;
	},
	
	findLocalFolder: function(ns, name) {
		this.getLocalFolderNames(ns);
		var folders = ns.Folders;
		var mlboxFolder = null;
		try {
			for (var i = 1, len = folders.Count; i <= len; i++) {
				var item = folders.Item(i);
				//Blz.Widget.print("folder" + "(" + i + ")" + item.Name + "=" + item.Class)
				if (item && name == item.Name) {
					mlboxFolder = item;
					break;
				}
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.findLocalFolder : " + e);
		}
		return mlboxFolder;
	},
	
	getTaskFolder: function(ns) {
		// use default folder for tasks.
		//return ns.GetDefaultFolder( this.OlDefaultFolders.olFolderTasks );
		
		var tasks = null;
		try {
			var folder = this.findLocalFolder(ns, this.userFolderName);
			var folders = (folder) ? folder.Folders : null;
			if (folders) {
				for (var i = 1, len = folders.Count; i <= len; i++) {
					var item = folders.Item(i);
					if (item.DefaultItemType == this.OlItems.olTaskItem) {
						tasks = item;
						break;
					}
				}
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.getTaskFolder : " + e);
		}
		return (tasks) ? tasks : ns.GetDefaultFolder(this.OlDefaultFolders.olFolderTasks);
	},
	
	getCalendarFolder: function(ns) {
		var calendar = null;
		try {
			var folder = this.findLocalFolder(ns, this.userFolderName);
			var folders = (folder) ? folder.Folders : null;
			if (folders) {
				for (var i = 1, len = folders.Count; i <= len; i++) {
					var item = folders.Item(i);
					if (item && item.DefaultItemType == this.OlItems.olAppointmentItem) {
						calendar = item;
						break;
					}
				}
			}
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.getCalendarFolder : " + e);
		}
		return (calendar) ? calendar : ns.GetDefaultFolder(this.OlDefaultFolders.olFolderCalendar);
	},
	
	addEvent: function() {
		try {
			var o = this.connectOutook();
			if (!o) return;
			var ns = o.GetNamespace("MAPI");
			var tasks = this.getCalendarFolder(ns);
			var newItem = (tasks) ? tasks.Items.Add() : null;
			if (newItem) newItem.Display();
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.addEvent : " + e);
		}
	},
	
	addTask: function() {
		try {
			var o = this.connectOutook();
			if (!o) return;
			var ns = o.GetNamespace("MAPI");
			var tasks = this.getTaskFolder(ns);
			var newItem = (tasks) ? tasks.Items.Add() : null;
			if (newItem) newItem.Display();
		} catch (e) {
			Blz.Widget.print("Blz.Outlook.addTask : " + e);
		}
	},
	
	onOutookQuited:function() {
		Blz.Widget.print("onOutookQuited");
		this.disconnect();
		this.notifyObservers("Quited", {});
	},
	onOutlookTaskItemAdded:function(item) {
		Blz.Widget.print("onOutlookTaskItemAdded");
		this.notifyObservers("TaskItemAdded", {item:item});
	},
	onOutlookTaskItemChanged:function(item) {
		Blz.Widget.print("onOutlookTaskItemChanged");
		this.notifyObservers("TaskItemChanged", {item:item});
	},
	onOutlookTaskRemoved:function() {
		Blz.Widget.print("onOutlookTaskRemoved");
		this.notifyObservers("TaskItemRemoved", {});
	},
	onOutlookApptItemAdded:function(item) {
		Blz.Widget.print("onOutlookApptItemAdded");
		Blz.Widget.print(item);
		this.notifyObservers("ApptItemAdded", {item:item});
	},
	onOutlookApptItemChanged:function(item) {
		Blz.Widget.print("onOutlookApptItemChanged");
		this.notifyObservers("ApptItemChanged", {item:item});
	},
	onOutlookApptItemRemoved:function() {
		Blz.Widget.print("onOutlookApptItemRemoved");
		this.notifyObservers("ApptItemRemoved", {});
	}
});

Blz.Util.extend(Blz.Outlook,Blz.Notifier);

function blzOutlookApp_Quit() {
	Blz.Outlook.onOutookQuited();
}
function blzOutlookTasks_ItemAdd(item) {
	Blz.Outlook.onOutlookTaskItemAdded(item);
}
function blzOutlookTasks_ItemChange(item) {
	Blz.Outlook.onOutlookTaskItemChanged(item);
}
function blzOutlookTasks_ItemRemove() {
	Blz.Outlook.onOutlookTaskRemoved();
}
function blzOutlookAppts_ItemAdd(item) {
	Blz.Outlook.onOutlookApptItemAdded(item);
}
function blzOutlookAppts_ItemChange(item) {
	Blz.Outlook.onOutlookApptItemChanged(item);
}
function blzOutlookAppts_ItemRemove() {
	Blz.Outlook.onOutlookApptItemRemoved();
}
