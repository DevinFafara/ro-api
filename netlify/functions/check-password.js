exports.handler = async (event) => {
    const { password } = JSON.parse(event.body);
    const correctPassword = process.env.REACT_APP_PASSWORD;
  
    if (password === correctPassword) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Mot de passe valide !" }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Mot de passe incorrect !" }),
      };
    }
  };