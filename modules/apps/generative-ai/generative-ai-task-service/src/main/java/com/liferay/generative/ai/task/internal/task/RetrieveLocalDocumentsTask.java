/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.internal.task;

import com.liferay.generative.ai.task.task.Task;
import com.liferay.generative.ai.task.task.TaskContext;
import com.liferay.generative.ai.task.task.TaskResponse;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.search.SearchContext;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.search.constants.SearchContextAttributes;
import com.liferay.portal.search.document.Document;
import com.liferay.portal.search.hits.SearchHit;
import com.liferay.portal.search.hits.SearchHits;
import com.liferay.portal.search.searcher.SearchRequest;
import com.liferay.portal.search.searcher.SearchRequestBuilder;
import com.liferay.portal.search.searcher.SearchRequestBuilderFactory;
import com.liferay.portal.search.searcher.SearchResponse;
import com.liferay.portal.search.searcher.Searcher;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Petteri Karttunen
 */
public class RetrieveLocalDocumentsTask extends BaseTask implements Task {

	public RetrieveLocalDocumentsTask(
		JSONObject configurationJSONObject, TaskContext taskContext,
		Searcher searcher,
		SearchRequestBuilderFactory searchRequestBuilderFactory) {

		super(configurationJSONObject, "local_retrieve_documents", taskContext);

		_searcher = searcher;
		_searchRequestBuilderFactory = searchRequestBuilderFactory;
	}

	@Override
	public TaskResponse execute(
		Map<String, Object> chainInput, Map<String, Object> input) {

		SearchResponse searchResponse = _searcher.search(
			_getSearchRequest(
				_createSearchContext(input),
				attributesJSONObject.getInt("topK", 3)));

		SearchHits searchHits = searchResponse.getSearchHits();

		if (searchHits.getTotalHits() == 0) {
			new TaskResponseImpl(null, null);
		}

		return new TaskResponseImpl(
			_getDebugInfo(searchHits),
			HashMapBuilder.<String, Object>put(
				attributesJSONObject.getString("output_field", "context"),
				_getTexts(searchHits)
			).build());
	}

	@Override
	public boolean validate() {
		return false;
	}

	private SearchContext _createSearchContext(Map<String, Object> input) {
		SearchContext searchContext = new SearchContext();

		searchContext.setAttribute(
			"search.experiences.ip.address", taskContext.getIpAddress());
		searchContext.setCompanyId(taskContext.getCompanyId());

		//searchContext.setGroupIds(new long[] {groupId});

		searchContext.setKeywords(
			MapUtil.getString(
				input, attributesJSONObject.getString("input_field", "text")));
		searchContext.setLocale(locale);
		searchContext.setTimeZone(taskContext.getTimeZone());
		searchContext.setUserId(taskContext.getUserId());

		return searchContext;
	}

	private Map<String, Object> _getDebugInfo(SearchHits searchHits) {
		return HashMapBuilder.<String, Object>put(
			"totalHits", searchHits.getTotalHits()
		).build();
	}

	private SearchRequest _getSearchRequest(
		SearchContext searchContext1, int size) {

		SearchRequestBuilder searchRequestBuilder =
			_searchRequestBuilderFactory.builder();

		searchRequestBuilder.from(
			0
		).queryString(
			searchContext1.getKeywords()
		).size(
			size
		).withSearchContext(
			searchContext2 -> {
				_setSearchExperiencesSearchContextAttributes(
					searchContext1, searchContext2);

				searchContext2.setAttribute(
					SearchContextAttributes.
						ATTRIBUTE_KEY_CONTRIBUTE_TUNING_RANKINGS,
					Boolean.TRUE);
				searchContext2.setCompanyId(searchContext1.getCompanyId());
				//searchContext2.setGroupIds(searchContext1.getGroupIds());
				searchContext2.setKeywords(searchContext1.getKeywords());
				searchContext2.setLocale(searchContext1.getLocale());
				searchContext2.setTimeZone(searchContext1.getTimeZone());
				searchContext2.setUserId(searchContext1.getUserId());
			}
		);

		return searchRequestBuilder.build();
	}

	private List<String> _getTexts(SearchHits searchHits) {
		String resultField = replaceTemplateVariables(
			locale,
			attributesJSONObject.getString(
				"result_field", "content_${language_id}"));

		List<SearchHit> searchHitList = searchHits.getSearchHits();

		List<String> texts = new ArrayList<>();

		ListUtil.isNotEmptyForEach(
			searchHitList,
			searchHit -> {
				Document document = searchHit.getDocument();

				texts.add(document.getString(resultField));
			});

		return texts;
	}

	private void _setSearchExperiencesSearchContextAttributes(
		SearchContext sourceSearchContext, SearchContext targetSearchContext) {

		MapUtil.isNotEmptyForEach(
			sourceSearchContext.getAttributes(),
			targetSearchContext::setAttribute);

		String sxpBlueprintExternalReferenceCode =
			attributesJSONObject.getString("sxpBlueprintExternalReferenceCode");

		if (!Validator.isBlank(sxpBlueprintExternalReferenceCode)) {
			targetSearchContext.setAttribute(
				"search.experiences.blueprint.external.reference.code",
				sxpBlueprintExternalReferenceCode);
		}

		String sxpBlueprintId = attributesJSONObject.getString(
			"sxpBlueprintId");

		if (!Validator.isBlank(sxpBlueprintId)) {
			targetSearchContext.setAttribute(
				"search.experiences.blueprint.id", sxpBlueprintId);
		}
	}

	private final Searcher _searcher;
	private final SearchRequestBuilderFactory _searchRequestBuilderFactory;

}