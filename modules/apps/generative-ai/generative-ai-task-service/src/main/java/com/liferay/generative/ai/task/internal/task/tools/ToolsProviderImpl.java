package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.portal.kernel.util.HashMapBuilder;

import java.util.Map;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;

@Component(service = ToolsProvider.class)
public class ToolsProviderImpl implements ToolsProvider {

	@Override
	public Object getTool(String key) {
		return tools.get(key);
	}

	@Activate
	protected void activate() {
		tools = HashMapBuilder.<String, Object>put(
			"blogs", new BlogsTools()
		).put(
			"objects", new ObjectsTools()
		).put(
			"site", new UserTools()
		).put(
			"user", new UserTools()
		).build();
	}

	private Map<String, Object> tools;

}