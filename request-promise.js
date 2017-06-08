


const request = require('request');
const sleep = require('system-sleep');
const colors = require('colors');







//const host = "http://office.avkcom.ru:50000/";
const host = "http://192.168.137.106:8282/";

const startEventId = 40;
const auth = host + "auth/login-check?login=admin&password=avkcom.ru";
const startEvent = host + "api/start-event-execute?id=" + startEventId;
const processStepGet = host + "api/process-step-get?processStepId=";
const entityInstanceGet = host + "/api/entity-field-get-list?entityInstanceId=";
const entityFieldSave = host + "api/entity-field-save?entityFieldInstanceId=";
const addCollection = host + "api/entity-field-collection-element-add?entityInstanceId=";
const stepClose = host + "api/process-step-complete";
const processStepGetList = host + "api/process-step-get-list-for-process?processId="


let DELAY = 1000;




	request(auth, function (error, response, body) {
	 let values = response.headers["set-cookie"][0];
	 request({
		  url: host,
		  headers: {
		    'Cookie': values
		  }
	 }, function(error, response, body){

	 	let processId = 0;


	 	 request({url: startEvent, headers: {'Cookie': values}}, function(error, response, body){
	 	 	let result = JSON.parse(body || "{}");
	 	 	let processStepId = (result.data || {}).newProcessStepId;
	 	 	processId = (result.data || {}).newProcessId;

	 	 	if (result.success) {
	 	 		console.log("SUCCESS".green, "create new process id: ", processStepId);
	 	 	} else {
	 	 		console.log("ERROR".red, "\n", (result.data || {}).message, "\n");
	 	 	}

	 	 	if (!processStepId) {
	 	 		return;
	 	 	}

	 	 	request({url: processStepGet+processStepId, headers: {'Cookie': values}}, function(error, response, body){
	 	 		let result = JSON.parse(body || "{}");
	 	 		if (result.success) {
	 	 			//console.log(result.data)

	 	 			let adapterRequestId = result.data.adapterRequestId;

	 	 			result.data.outputEntityList.forEach((entity) => {
	 	 				
	 	 				let mainEntityInstanceId = entity.entityInstanceId;
	 	 			

	 	 				request({url: entityInstanceGet + mainEntityInstanceId, headers: {'Cookie': values}}, function(error, response, body){
	 	 					let resultB5 = JSON.parse(body || "{}");


	 	 					if (resultB5.success) {
	 	 						

	 	 						let addCollectionTest = false;
	 	 						resultB5.data.fields.forEach((field, i)=> {


	 	 							if (field.type === "textfield") {
	 	 								let entityFieldInstanceId = (field.values[0] || {}).entityFieldInstanceId;
	 	 								request({url: entityFieldSave + entityFieldInstanceId + "&stringValue=912345678", headers: {'Cookie': values}}, function(error, response, body){
	 	 									//let result = JSON.parse(body || "{}");
	 	 									console.log("ADD TEXT IN TEXTFIELD FOR adapterRequestId".green, adapterRequestId, "processStepId".green, processStepId);
	 	 								});
	 	 								
	 	 							} else if (field.type === "composite-link" && field.collection) {
	 	 								if (!addCollectionTest) {
	 	 									addCollectionTest = true;
	 	 									let entityFieldInstanceId = mainEntityInstanceId;
	 	 									let fieldId = field.fieldId;
	 	 									//console.log(field)
	 	 									//console.log(addCollection + entityFieldInstanceId + "&entityFieldId="+fieldId)
	 	 									request({url: addCollection + entityFieldInstanceId + "&entityFieldId="+fieldId, headers: {'Cookie': values}}, function(error, response, body){
	 	 										let newResult = JSON.parse(body || "{}");
	 	 										let childEntityInstanceId = (newResult.data || {}).childEntityInstanceId;
	 	 								

	 	 										request({url: entityInstanceGet + childEntityInstanceId, headers: {'Cookie': values}}, function(error, response, body){
	 	 											let resultB10 = JSON.parse(body || "{}");
	 	 											


	 	 											if (resultB10.success) {
	 	 												

	 	 												let addCollectionTestFree = false;
	 	 												resultB10.data.fields.forEach((field, i)=> {


	 	 													if (field.type === "textfield") {
	 	 														let entityFieldInstanceIdMy = (field.values[0] || {}).entityFieldInstanceId;
	 	 														request({url: entityFieldSave + entityFieldInstanceIdMy + "&stringValue=912345678", headers: {'Cookie': values}}, function(error, response, body){
	 	 															//let result = JSON.parse(body || "{}");
	 	 															console.log("ADD TEXT IN TEXTFIELD FOR adapterRequestId".green, adapterRequestId, "processStepId".green, processStepId);
	 	 														});
	 	 														
	 	 													} else if (field.type === "composite-link" && field.collection) {
	 	 														if (!addCollectionTestFree) {
	 	 															addCollectionTestFree = true;
	 	 															let entityFieldInstanceIdMy = childEntityInstanceId;
	 	 															let fieldId = field.fieldId;
	 	 															//console.log(field)
	 	 															//console.log(addCollection + entityFieldInstanceId + "&entityFieldId="+fieldId)
	 	 															request({url: addCollection + entityFieldInstanceIdMy + "&entityFieldId="+fieldId, headers: {'Cookie': values}}, function(error, response, body){
	 	 																//let result = JSON.parse(body || "{}");
	 	 																console.log("ADD ELEMENT IN COLLECTION FOR adapterRequestId".green, adapterRequestId, "processStepId".green, processStepId, "entityFieldInstanceId".green, entityFieldInstanceId);
	 	 																//let childEntityInstanceId = SON.parse(body).data.childEntityInstanceId;

	 	 															
	 	 															});

	 	 														}
	 	 														
	 	 													}




	 	 												});

	 	 												//console.log()


	 	 											} else {
	 	 												console.log("ERROR".red, "\n", (result.data || {}).message, "\n");
	 	 											}

	 	 										});








	 	 									});

	 	 								}
	 	 								
	 	 							}




	 	 						});

	 	 						//console.log()


	 	 					} else {
	 	 						console.log("ERROR".red, "\n", (result.data || {}).message, "\n");
	 	 					}



	 	 			


	 	 				});

	 	 			});



	 	 			
	 	 			sleep(DELAY + 1.5);
	 	 			request({url: stepClose, headers: {'Cookie': values}, method: 'POST', form: {adapterRequestId: adapterRequestId} }, function(error, response, body){
	 	 				let result = JSON.parse(body || "{}");
	 	 				if (result.success) {
	 	 					console.log("CLOSE STEP".green, adapterRequestId);


	 	 					sleep(DELAY * 3);


	 	 					request({url: processStepGetList + processId, headers: {'Cookie': values}}, function(error, response, body){
	 	 							
	 	 							let rows = JSON.parse(body).data.rows;
	 	 							let currentProcessStepId = rows[rows.length-1].id;
	 	 							

	 	 							request({url: processStepGet+currentProcessStepId, headers: {'Cookie': values}}, function(error, response, body){
	 	 								let resultT2 = JSON.parse(body || "{}");
	 	 								if (resultT2.success) {
	 	 									

	 	 									let finishedAdapterRequestId = resultT2.data.adapterRequestId;
	 	 									


	 	 										request({url: stepClose, headers: {'Cookie': values}, method: 'POST', form: {adapterRequestId: finishedAdapterRequestId} }, function(error, response, body){
	 	 											let resultT3 = JSON.parse(body || "{}");
	 	 											if (resultT3.success) {
	 	 												console.log("\nFINISHED PROCESS".green, processId, "STEP FOR adapterRequestId".green, finishedAdapterRequestId, "\n");
	 	 											}
	 	 										});









	 	 								}

	 	 							});


	
	 	 					});
























	 	 				} else {
	 	 					console.log("ERROR".red, (result || {}).message, (result || {}).data, "\n");
	 	 				}
	 	 				
	 	 			});



	 	 			








	 	 		} else {
	 	 			console.log("ERROR".red, "\n", (result.data || {}).message, "\n");
	 	 		}

	 	 	});




	 	 });



	 });


	});
