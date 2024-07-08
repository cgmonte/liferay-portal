package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.Http;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;

import java.io.IOException;

public class WebHookTools {

	public WebHookTools(Http http) {
		_http = http;
	}

	@Tool("Send JSON data to external tool using webhook URL")
	void sendJSON(@P("The json data to send") String json,
				  @P("The URL to use to send the data") String url)
		throws IOException {

		Http.Options options = new Http.Options();
		options.setMethod(Http.Method.POST);
		options.setHeaders(
			HashMapBuilder.put("Content-Type","application/json").build()
		);
		options.setLocation(url);
		options.setBody(json,"application/json", "utf-8");
		_http.URLtoString(options);

	}

	private final Http _http;
}
