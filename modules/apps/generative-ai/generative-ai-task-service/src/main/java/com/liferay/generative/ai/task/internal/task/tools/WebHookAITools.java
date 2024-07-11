/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.petra.string.StringUtil;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.Http;
import com.liferay.portal.kernel.util.Validator;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;

import java.io.IOException;

import java.net.MalformedURLException;

/**
 * @author Louis-Guillaume Durand
 */
public class WebHookAITools implements AITools {

	public WebHookAITools(JSONObject configurationJSONObject, Http http) {
		_configurationJSONObject = configurationJSONObject;
		_http = http;
	}

	@Tool("Create or add an object in JSON format using a webhook")
	public String add(@P("The json data to send") String json) {
		JSONObject actionJSONObject = _getActionJSONObject(_ACTION_ADD);

		try {
			_validateAction(actionJSONObject, _ACTION_ADD);
			String url = actionJSONObject.getString("url");

			_validateURL(url);

			Http.Options options = new Http.Options();

			options.setBody(json, "application/json", "utf-8");
			options.setHeaders(
				HashMapBuilder.put(
					"Content-Type", "application/json"
				).build());

			options.setLocation(url);
			options.setMethod(_getActionMethod(actionJSONObject));

			return _http.URLtoString(options);
		}
		catch (IOException e) {
			_log.error(e.getMessage(), e);

			return e.getMessage();
		}
	}

	@Override
	public JSONObject getConfigurationJSONObject() {
		return _configurationJSONObject;
	}

	@Tool("Remove an object by ID using a webhook")
	public String remove(@P("The ID of the object to remove") String id) {
		JSONObject actionJSONObject = _getActionJSONObject(_ACTION_REMOVE);

		try {
			_validateAction(actionJSONObject, _ACTION_REMOVE);
			String actionURL = actionJSONObject.getString("url");

			_validateURL(actionURL);
			String parameter = actionJSONObject.getString("parameter");

			_validateParameter(parameter);

			Http.Options options = new Http.Options();

			if (parameter.equalsIgnoreCase(_PARAMETER_BODY)) {
				JSONObject jsonObject = JSONUtil.put("id", id);

				options.setBody(
					jsonObject.toString(), "application/json", "utf-8");
				options.setHeaders(
					HashMapBuilder.put(
						"Content-Type", "application/json"
					).build());
			}

			StringBundler urlSB = new StringBundler(actionURL);

			if (StringUtil.equalsIgnoreCase(parameter, _PARAMETER_PATH)) {
				if (!actionURL.endsWith(StringPool.SLASH)) {
					urlSB.append(StringPool.SLASH);
				}

				urlSB.append(id);
			}
			else if (StringUtil.equalsIgnoreCase(parameter, _PARAMETER_QUERY)) {
				urlSB.append("?id=");
			}

			options.setLocation(urlSB.toString());
			options.setMethod(_getActionMethod(actionJSONObject));

			return _http.URLtoString(options);
		}
		catch (IOException e) {
			_log.error(e.getMessage(), e);

			return e.getMessage();
		}
	}

	private JSONObject _getActionJSONObject(String type) {
		JSONArray actionsJSONArray = _configurationJSONObject.getJSONArray(
			"actions");

		for (int i = 0; i < actionsJSONArray.length(); i++) {
			JSONObject actionJSONObject = actionsJSONArray.getJSONObject(i);

			if (StringUtil.equalsIgnoreCase(
					actionJSONObject.getString("type"), type)) {

				return actionJSONObject;
			}
		}

		return null;
	}

	private Http.Method _getActionMethod(JSONObject actionJSONObject)
		throws IOException, UnsupportedOperationException {

		String method = actionJSONObject.getString("method");

		if (Validator.isNull(method)) {
			throw new IOException("Missing method attribute for the action");
		}

		if (StringUtil.equalsIgnoreCase(method, "POST")) {
			return Http.Method.POST;
		}

		if (StringUtil.equalsIgnoreCase(method, "DELETE")) {
			return Http.Method.DELETE;
		}

		throw new UnsupportedOperationException(method);
	}

	private void _validateAction(JSONObject actionJSONObject, String type)
		throws IOException {

		StringBundler errorMessageSB = new StringBundler(3);

		if (Validator.isNull(actionJSONObject)) {
			errorMessageSB.append(
				"Expected an action with type attribute set to '");
			errorMessageSB.append(type);
			errorMessageSB.append("'");

			throw new IOException(errorMessageSB.toString());
		}
	}

	private void _validateParameter(String parameter) throws IOException {
		if (Validator.isNull(parameter)) {
			throw new IOException(
				"Missing the parameter attribute for the action");
		}

		if (!StringUtil.equalsIgnoreCase(parameter, _PARAMETER_BODY) &&
			!StringUtil.equalsIgnoreCase(parameter, _PARAMETER_PATH) &&
			!StringUtil.equalsIgnoreCase(parameter, _PARAMETER_QUERY)) {

			throw new IOException("Invalid value for the parameter attribute.");
		}
	}

	private void _validateURL(String url) throws MalformedURLException {
		if (Validator.isNull(url)) {
			throw new MalformedURLException(
				"Missing URL in webhook configuration");
		}
	}

	private static final String _ACTION_ADD = "add";

	private static final String _ACTION_REMOVE = "remove";

	private static final String _PARAMETER_BODY = "body";

	private static final String _PARAMETER_PATH = "path";

	private static final String _PARAMETER_QUERY = "query";

	private static final Log _log = LogFactoryUtil.getLog(WebHookAITools.class);

	private final JSONObject _configurationJSONObject;
	private final Http _http;

}