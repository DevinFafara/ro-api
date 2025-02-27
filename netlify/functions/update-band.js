const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Méthode non autorisée" }),
    };
  }

  try {
    const { id, ...updatedData } = JSON.parse(event.body);
    const repoOwner = process.env.REACT_APP_GITHUB_REPO_OWNER;
    const repoName = process.env.REACT_APP_GITHUB_REPO_NAME;
    const filePath = process.env.REACT_APP_GITHUB_FILE_PATH
    const branch = process.env.GITHUB_BRANCH || "gh-pages"; // Valeur par défaut
    const githubToken = process.env.REACT_APP_GITHUB_TOKEN

    const fileUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Récupérer le fichier JSON existant
    const response = await fetch(fileUrl, {
      headers: { Authorization: `token ${githubToken}` },
    });

    if (!response.ok) {
      throw new Error("Impossible de récupérer le fichier JSON");
    }

    const fileData = await response.json();
    const sha = fileData.sha;
    const content = JSON.parse(Buffer.from(fileData.content, "base64").toString("utf-8"));

    // Mettre à jour le groupe dans le fichier JSON
    content.groups = content.groups.map((group) =>
      group.id === id ? { ...group, ...updatedData } : group
    );

    // Encodage du nouveau JSON en Base64
    const updatedContent = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");

    // Envoyer les modifications à GitHub
    const updateResponse = await fetch(fileUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Mise à jour des infos du groupe",
        content: updatedContent,
        sha,
        branch,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error("Erreur lors de la mise à jour du fichier JSON sur GitHub");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Fichier mis à jour avec succès" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
