/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.generative.ai.task.task;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

/**
 * @author Petteri Karttunen
 */
public class TaskContext {

	public TaskContext(TaskContext taskContext) {
		_attributes = taskContext._attributes;
		_audioInputField = taskContext._audioInputField;
		_companyId = taskContext._companyId;
		_imageInputField = taskContext._imageInputField;
		_ipAddress = taskContext._ipAddress;
		_locale = taskContext._locale;
		_taskContextParameters = taskContext._taskContextParameters;
		_textInputField = taskContext._textInputField;
		_timeZone = taskContext._timeZone;
		_userId = taskContext._userId;
	}

	public Object getAttribute(String key) {
		if (_attributes == null) {
			return null;
		}

		return _attributes.get(key);
	}

	public String getAudioInputField() {
		return _audioInputField;
	}

	public long getCompanyId() {
		return _companyId;
	}

	public String getImageInputField() {
		return _imageInputField;
	}

	public String getIpAddress() {
		return _ipAddress;
	}

	public Locale getLocale() {
		return _locale;
	}

	public TaskContextParameter getTaskContextParameter(String name) {
		if (_taskContextParameters == null) {
			return null;
		}

		return _taskContextParameters.get(name);
	}

	public String getTextInputField() {
		return _textInputField;
	}

	public TimeZone getTimeZone() {
		return _timeZone;
	}

	public long getUserId() {
		return _userId;
	}

	public static class Builder {

		public Builder() {
			_taskContext = new TaskContext();
		}

		public Builder attribute(String key, Object value) {
			if (_taskContext._attributes == null) {
				_taskContext._attributes = new HashMap<>();
			}

			_taskContext._attributes.put(key, value);

			return this;
		}

		public Builder audioInputField(String audioInputField) {
			_taskContext._audioInputField = audioInputField;

			return this;
		}

		public TaskContext build() {
			return new TaskContext(_taskContext);
		}

		public Builder companyId(long companyId) {
			_taskContext._companyId = companyId;

			return this;
		}

		public Builder imageInputField(String imageInputField) {
			_taskContext._imageInputField = imageInputField;

			return this;
		}

		public Builder ipAddress(String ipAddress) {
			_taskContext._ipAddress = ipAddress;

			return this;
		}

		public Builder locale(Locale locale) {
			_taskContext._locale = locale;

			return this;
		}

		public Builder taskContextAttribute(String key, TaskContextParameter taskContextParameter) {
			if (_taskContext._taskContextParameters == null) {
				_taskContext._taskContextParameters = new HashMap<>();
			}

			_taskContext._taskContextParameters.put(key, taskContextParameter);

			return this;
		}


		public Builder textInputField(String textInputField) {
			_taskContext._textInputField = textInputField;

			return this;
		}

		public Builder timeZone(TimeZone timeZone) {
			_taskContext._timeZone = timeZone;

			return this;
		}

		public Builder userId(long userId) {
			_taskContext._userId = userId;

			return this;
		}

		private final TaskContext _taskContext;

	}

	private TaskContext() {
	}

	private Map<String, Object> _attributes;
	private String _audioInputField;
	private long _companyId;
	private String _imageInputField;
	private String _ipAddress;
	private Locale _locale;
	private Map<String, TaskContextParameter> _taskContextParameters;
	private String _textInputField;
	private TimeZone _timeZone;
	private long _userId;

}