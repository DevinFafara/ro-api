exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: "",
      };
    }
  
    const { password } = JSON.parse(event.body);
    const correctPassword = process.env.REACT_APP_PASSWORD;
  
    return {
      statusCode: password === correctPassword ? 200 : 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({
        success: password === correctPassword,
        message: password === correctPassword
          ? "Mot de passe valide !"
          : "Mot de passe incorrect !",
      }),
    };
  };
  