export async function post (request, suite, data){

	const headers = {
		Authorization: 'Basic ' + btoa('test@liferay.com:test'),
	};

	const objectAdminBaseURL = 'http://localhost:8080/o/object-admin/v1.0';

	const response = await request.post(`${objectAdminBaseURL}/${suite}`, {
		headers,
		data
	  });

	  const respondeJSON = await response.json();

	  return respondeJSON;

}