/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.portal.search.internal.ml.embedding.text;

import com.liferay.petra.reflect.ReflectionUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.servlet.HttpHeaders;
import com.liferay.portal.kernel.util.ContentTypes;
import com.liferay.portal.kernel.util.Http;
import com.liferay.portal.kernel.util.HttpUtil;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.search.rest.dto.v1_0.EmbeddingProviderConfiguration;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Petteri Karttunen
 */
public class VertexAITextEmbeddingProvider
	extends BaseTextEmbeddingProvider implements TextEmbeddingProvider {

	@Override
	public Double[] getEmbedding(
		EmbeddingProviderConfiguration embeddingProviderConfiguration,
		String text) {

		Map<String, Object> attributes =
			(Map<String, Object>)embeddingProviderConfiguration.getAttributes();

		if ((attributes == null) || !attributes.containsKey("location") ||
			!attributes.containsKey("model") ||
			!attributes.containsKey("projectId")) {

			if (_log.isDebugEnabled()) {
				_log.debug("Required attributes are missing");
			}

			return new Double[0];
		}

		String sentences = extractSentences(
			MapUtil.getInteger(attributes, "maxCharacterCount", 1000), text,
			MapUtil.getString(
				attributes, "textTruncationStrategy", "beginning"));

		if (Validator.isBlank(sentences)) {
			return new Double[0];
		}

		return _getEmbedding(attributes, sentences);
	}

	private String _getAuthenticationToken() throws Exception {
		String authenticationToken = StringPool.BLANK;

		try {
			ProcessBuilder processBuilder = new ProcessBuilder(
				_GET_AUTHENTICATION_TOKEN_COMMAND);

			processBuilder.redirectErrorStream(true);

			Process process = processBuilder.start();

			try (BufferedReader bufferedReader = new BufferedReader(
					new InputStreamReader(process.getInputStream()))) {

				authenticationToken = bufferedReader.readLine();
			}
			catch (IOException ioException) {
				_log.error(ioException);
			}

			if (process.exitValue() != 0) {
				throw new Exception(
					StringBundler.concat(
						_GET_AUTHENTICATION_TOKEN_COMMAND, StringPool.SPACE,
						" failed with exit status ", process.exitValue()));
			}
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}
		}

		return authenticationToken;
	}

	private Double[] _getEmbedding(
		Map<String, Object> attributes, String text) {

		try {
			Http.Options options = new Http.Options();

			JSONObject jsonObject = JSONUtil.put(
				"instances",
				JSONFactoryUtil.createJSONArray(
				).put(
					JSONUtil.put("content", text)
				)
			).put(
				"parameters",
				JSONUtil.put(
					"autoTruncate",
					MapUtil.getBoolean(attributes, "autoTruncate", true))
			);

			options.addHeader(
				HttpHeaders.AUTHORIZATION,
				"Bearer " + _getAuthenticationToken());
			options.addHeader(
				HttpHeaders.CONTENT_TYPE, ContentTypes.APPLICATION_JSON);
			options.setBody(
				jsonObject.toString(), ContentTypes.APPLICATION_JSON,
				StringPool.UTF8);
			options.setCookieSpec(Http.CookieSpec.STANDARD);
			options.setLocation(_getLocation(attributes));
			options.setPost(true);

			JSONObject responseJSONObject = JSONFactoryUtil.createJSONObject(
				HttpUtil.URLtoString(options));

			JSONArray predictionsJSONArray = responseJSONObject.getJSONArray(
				"predictions");

			JSONObject firstPredictionJSONObject =
				predictionsJSONArray.getJSONObject(0);

			JSONObject embeddingsJSONObject =
				firstPredictionJSONObject.getJSONObject("embeddings");

			List<Double> list = JSONUtil.toDoubleList(
				_getJSONArray(embeddingsJSONObject.getJSONArray("values")));

			return list.toArray(new Double[0]);
		}
		catch (Exception exception) {
			return ReflectionUtil.throwException(exception);
		}
	}

	private JSONArray _getJSONArray(JSONArray jsonArray1) {
		JSONArray jsonArray2 = jsonArray1.getJSONArray(0);

		if (jsonArray2 != null) {
			return _getJSONArray(jsonArray2);
		}

		return jsonArray1;
	}

	private String _getLocation(Map<String, Object> attributes) {
		return StringBundler.concat(
			"https://", MapUtil.getString(attributes, "location"),
			"-aiplatform.googleapis.com/v1/projects/",
			MapUtil.getString(attributes, "projectId"), "/locations/",
			MapUtil.getString(attributes, "location"),
			"/publishers/google/models/",
			MapUtil.getString(attributes, "model"), ":predict");
	}

	private static final List<String> _GET_AUTHENTICATION_TOKEN_COMMAND =
		new ArrayList<String>() {
			{
				add("gcloud");
				add("auth");
				add("print-access-token");
			}
		};

	private static final Log _log = LogFactoryUtil.getLog(
		VertexAITextEmbeddingProvider.class);

}