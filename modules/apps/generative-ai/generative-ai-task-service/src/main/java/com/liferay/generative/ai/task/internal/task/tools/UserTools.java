
package com.liferay.generative.ai.task.internal.task.tools;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.model.UserConstants;
import com.liferay.portal.kernel.security.auth.CompanyThreadLocal;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextThreadLocal;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.LocaleThreadLocal;
import com.liferay.portal.kernel.util.StringUtil;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;

public class UserTools {

	@Tool("Creates a new user")
	void createUser(
		@P("The first name of the user") String firstName,
		@P("The last name of the user") String lastName) {

		long userId = PrincipalThreadLocal.getUserId();

		try {
			long creatorUserId = PrincipalThreadLocal.getUserId();

			// Replace with your actual values
			long companyId = CompanyThreadLocal.getCompanyId(); // Company ID
			String emailAddress = firstName + StringUtil.randomString() + "@example.com"; // Email address

			String password = "test"; // Password

			// Create a ServiceContext for the user creation
			ServiceContext serviceContext = ServiceContextThreadLocal.getServiceContext();

			// Create the user
			User user = UserLocalServiceUtil.addUser(
				creatorUserId,
				companyId, // Company ID
				false, // autoPassword
				password,
				password,
				true, // auto screenName
				null, // Screen name
				emailAddress,
				LocaleThreadLocal.getDefaultLocale(),
				firstName, // First name
				"",
				lastName, // Last name
				-1, // prefixListTypeId
				-1, // suffixListTypeId
				true,
				1, // int birthdayMonth
				1, // int birthdayDay
				1985, // int birthdayYear
				"Tester",
				UserConstants.TYPE_REGULAR,
				new long[0], // long[] groupIds
				new long[0], // long[] organizationIds
				new long[0], // long[] roleIds
				new long[0], // long[] userGroupIds
				false, //
				serviceContext // Service context
			);
		}
		catch (PortalException e) {
			throw new RuntimeException(e);
		}
	}


	@Tool("Updates my first name")
	void updateUserFirstName(
		@P("The new first name of the user") String firstName) {

		long userId = PrincipalThreadLocal.getUserId();

		try {
			User user = UserLocalServiceUtil.getUser(userId);

			user.setFirstName(firstName);

			UserLocalServiceUtil.updateUser(user);
		}
		catch (PortalException e) {
			throw new RuntimeException(e);
		}
	}

	@Tool("Updates my last name")
	void updateUserLastName(
		@P("The new last name of the user") String lastName) {

		long userId = PrincipalThreadLocal.getUserId();

		try {
			User user = UserLocalServiceUtil.getUser(userId);

			user.setLastName(lastName);

			UserLocalServiceUtil.updateUser(user);
		}
		catch (PortalException e) {
			throw new RuntimeException(e);
		}
	}

}
