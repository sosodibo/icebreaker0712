document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name-input");
  const startButton = document.getElementById("start-button");
  const welcomeScreen = document.getElementById("welcome-screen");
  const questionScreen = document.getElementById("question-screen");
  const welcomeMessage = document.getElementById("welcome-message");
  const questionList = document.getElementById("question-list");
  const scoreDisplay = document.getElementById("score");
  const resetButton = document.getElementById("reset-button");
  const shareButton = document.getElementById("share-button");
  const copyNotification = document.getElementById("copy-notification");

  let score = 0;

  // Questions et points associés
  const questions = [
    { text: "Quelle est votre couleur préférée ?", points: 10 },
    { text: "Avez-vous déjà voyagé à l'étranger ?", points: 20 },
    { text: "Aimez-vous les films d'horreur ?", points: 15 },
    { text: "Avez-vous un animal de compagnie ?", points: 10 },
    { text: "Jouez-vous d'un instrument de musique ?", points: 25 },
    { text: "Aimez-vous cuisiner ?", points: 10 },
    { text: "Avez-vous déjà fait du parachutisme ?", points: 30 },
    { text: "Avez-vous un livre préféré ?", points: 15 },
    { text: "Faites-vous du sport régulièrement ?", points: 20 },
    { text: "Avez-vous une série préférée ?", points: 10 },
  ];

  // Précharger le prénom s'il existe
  const storedName = localStorage.getItem("username");
  const storedScore = localStorage.getItem("score");

  if (storedName) {
    // Si un prénom est trouvé, restaurer l'état précédent
    welcomeScreen.style.display = "none";
    questionScreen.style.display = "block";
    welcomeMessage.textContent = `Bienvenue, ${storedName} !`;
    score = parseInt(storedScore) || 0;
    scoreDisplay.textContent = score;

    // Restaurer l'état des cases à cocher
    loadQuestions();
    restoreCheckboxState();
  }

  // Charger les questions
  function loadQuestions() {
    questionList.innerHTML = ""; // Réinitialiser la liste

    questions.forEach((question, index) => {
      const listItem = document.createElement("li");
      const label = document.createElement("label");
      label.textContent = `${question.text} (+${question.points} points)`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `question-${index}`;
      checkbox.addEventListener("change", () => togglePoints(checkbox, question.points));

      listItem.appendChild(label);
      listItem.appendChild(checkbox);
      questionList.appendChild(listItem);
    });
  }

  // Restaurer l'état des cases cochées
  function restoreCheckboxState() {
    questions.forEach((_, index) => {
      const checkbox = document.getElementById(`question-${index}`);
      const isChecked = localStorage.getItem(`question-${index}`) === "true";
      if (checkbox) checkbox.checked = isChecked;
    });
  }

  // Ajouter ou retirer des points en fonction de la case cochée
  function togglePoints(checkbox, points) {
    if (checkbox.checked) {
      score += points;
    } else {
      score -= points;
    }
    scoreDisplay.textContent = score;
    localStorage.setItem("score", score);
    localStorage.setItem(checkbox.id, checkbox.checked);
  }

  // Réinitialisation de l'application
  resetButton.addEventListener("click", () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser ?")) {
      localStorage.clear();
      location.reload();
    }
  });

  // Commencer avec un prénom
  startButton.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert("Veuillez entrer un prénom !");
      return;
    }
    localStorage.setItem("username", name);
    localStorage.setItem("score", "0");

    welcomeScreen.style.display = "none";
    questionScreen.style.display = "block";
    welcomeMessage.textContent = `Bienvenue, ${name} !`;

    loadQuestions();
  });

  // Fonction pour partager les réponses (copie au presse-papier)
  shareButton.addEventListener("click", () => {
    const name = localStorage.getItem("username") || "Anonyme";
    const score = localStorage.getItem("score") || 0;

    // Récupération de la liste des questions répondues
    const responses = questions
      .map((question, index) => {
        const isChecked = localStorage.getItem(`question-${index}`) === "true";
        return isChecked ? `- ${question.text}` : null;
      })
      .filter((response) => response) // Supprime les nulls (questions non répondues)
      .join("\n");

    // Construction du texte à copier
    const now = new Date();
    const dateTime = now.toLocaleString();
    const textToCopy = `
${name}, points d'xp : ${score} à ${dateTime}

Questions répondues :
${responses || "Aucune question répondue"}
    `.trim();

    // Copie dans le presse-papier
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Afficher et masquer le message
      copyNotification.style.display = "block";
      setTimeout(() => {
        copyNotification.style.display = "none";
      }, 3000); // Notification disparaît après 3 secondes
    }).catch((err) => {
      console.error("Erreur lors de la copie : ", err);
      alert("Une erreur est survenue lors de la copie.");
    });
  });
});
