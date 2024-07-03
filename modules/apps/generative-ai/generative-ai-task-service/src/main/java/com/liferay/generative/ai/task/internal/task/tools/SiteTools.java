package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.object.model.ObjectDefinition;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.GroupConstants;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalServiceUtil;
import com.liferay.portal.kernel.service.GroupService;
import com.liferay.portal.kernel.service.ServiceContextThreadLocal;
import com.liferay.portal.kernel.util.LocaleUtil;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import org.osgi.service.component.annotations.Reference;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class SiteTools {

	@Tool("Creates a Liferay site for the given name")
	Group createSite(
		@P("The name of the site which should be created") String name) {

		long userId = PrincipalThreadLocal.getUserId();

		String friendly = "/" + name;

		// Create a map for the site name in different locales
		Map<Locale, String> nameMap = new HashMap<>();
		nameMap.put(LocaleUtil.getDefault(), name);

		// Create a map for the site description in different locales
		Map<Locale, String> descriptionMap = new HashMap<>();
		descriptionMap.put(LocaleUtil.getDefault(), "TODO");


		try {
			Group site = GroupLocalServiceUtil.addGroup(
				userId, // User ID
				GroupConstants.DEFAULT_PARENT_GROUP_ID, // Parent group ID
				Group.class.getName(), // Class name
				0, // Class PK
				GroupConstants.DEFAULT_LIVE_GROUP_ID, // Live group ID
				nameMap, // Site name map
				descriptionMap, // Site description map
				GroupConstants.TYPE_SITE_OPEN, // Site type
				true, // Manual membership
				GroupConstants.DEFAULT_MEMBERSHIP_RESTRICTION, // Membership restriction
				null, // Friendly URL (optional)
				true, // Site flag
				true, // Active flag
				ServiceContextThreadLocal.getServiceContext()); // Service context

		} catch (PortalException e) {
			e.printStackTrace();
		}

		return null;

	}

}
