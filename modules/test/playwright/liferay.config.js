const liferayConfig = {
    environment: {
      baseUrl: process.env.URL || "http://localhost:8080/o/"
    },
    user: {
      login: process.env.LIFERAY_USER_LOGIN || "test@liferay.com",
      password: process.env.LIFERAY_USER_PASSWORD || "test"
    }
  };
  
  export { liferayConfig };