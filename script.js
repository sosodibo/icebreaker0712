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

  // Liste de mots pour la question bonus
  const bonusWords = ["Pomme de terre",
                      "Ornithorynque",
                      "Hamster",
                      "Pingouin",
                      "Hélicoptère",
                      "Trampoline",
                      "Toupie",
                      "Trombone",
                      "Chocolat",
                      "Écureuil",
                      "Lama",
                      "Girafe",
                      "Flamant rose",
                      "Hérisson",
                      "Canapé",
                      "Hippopotame",
                      "Otarie",
                      "Canard",
                      "Noël",
                      "Rat mignon",
                      "Dragon",
                      "Ketchup",
                      "Coquillage",
                      "Pizza"];
  let bonusWord = getRandomWord(); // Génère un mot aléatoire au démarrage

  // Questions et points associés
  const questions = [
  { category: "Arrivée", text: "Tu es arrivé·e dans les 10 premiers à la soirée", points: 5 },
  { category: "Arrivée", text: "Mets une étiquette avec ton prénom", points: 5 },
  { category: "Arrivée", text: "Réussis à garder ton étiquette collée toute la soirée", points: 10 },
  { category: "Parler avec des inconnu·e·s", text: "Trouve quelqu’un fan de Zelda", points: 15 },
  { category: "Parler avec des inconnu·e·s", text: "Trouve quelqu’un qui a travaillé chez Shadow", points: 20 },
  { category: "Parler avec des inconnu·e·s", text: "Trouve la personne qui connaît Solène depuis le plus longtemps", points: 15 },
  { category: "Parler avec des inconnu·e·s", text: "Trouve quelqu’un qui a participé à un jeu télé", points: 25 },
  { category: "Parler avec des inconnu·e·s", text: "Demande son hobby préféré à 3 personnes", points: 10, multiple: 3, },
  { category: "Actions soirée", text: "Participe à une partie de jeu vidéo ou de jeu de société", points: 10, multiple: 4,},
  { category: "Parler avec des inconnu·e·s", text: "Trouve qui est complètement fan de parcs d’attractions", points: 20 },
  { category: "Parler avec des inconnu·e·s", text: "Trouve quelqu’un qui parle plus de 2 langues couramment", points: 20 },
  { category: "Parler avec des inconnu·e·s", text: "Trouve le nom de l’animal de compagnie de quelqu’un", points: 5, multiple: 3, },
  { category: "Parler avec des inconnu·e·s", text: "Trouve quelqu’un qui n’habite pas en France", points: 15 },
  { category: "Parler avec des inconnu·e·s", text: "Trouve quelqu’un qui a déjà rencontré des célébrités", points: 20 },
  { category: "Parler avec des inconnu·e·s", text: "Demande à quelqu’un quelle est la chose la plus insolite qu’iel a faite", points: 10, multiple: 3, },
  { category: "Actions soirée", text: "Participe au Blind test", points: 15 },
  { category: "Actions soirée", text: "Bois une boisson (alcool ou sans alcool)", points: 5, multiple: 3, },
  { category: "Actions soirée", text: "Bois un verre d’eau", points: 10 },
  { category: "Actions soirée", text: "Chante en duo ou trio au karaoke", points: 15 },
  { category: "Actions soirée", text: "Chante en duo ou trio avec des gens que tu ne connais", points: 20 },
  { category: "Actions soirée", text: "Tu as le courage de chanter seul·e au karaoké", points: 35 },
  { category: "Bonus", text: `Tu dois réussir à caser le mot "${bonusWord}" dans une conversation`, points: 20 },
  ];






  // Précharger le prénom s'il existe
  const storedName = localStorage.getItem("username");
  const storedScore = localStorage.getItem("score");

  if (storedName) {
    welcomeScreen.style.display = "none";
    questionScreen.style.display = "block";
    welcomeMessage.textContent = `À toi de jouer ${storedName} !`;
    score = parseInt(storedScore) || 0;
    scoreDisplay.textContent = score;
    loadQuestions();
    restoreCheckboxState();
  }

  // Fonction pour générer un mot aléatoire
  function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * bonusWords.length);
    return bonusWords[randomIndex];
  }

  // Charger les questions avec catégories
  function loadQuestions() {
    questionList.innerHTML = "";

    const categories = [...new Set(questions.map((q) => q.category))]; // Récupère les catégories uniques

    categories.forEach((category) => {
      // Ajoute un titre pour chaque catégorie
      const categoryTitle = document.createElement("h3");
      categoryTitle.textContent = category;
      categoryTitle.classList.add("category-title");
      questionList.appendChild(categoryTitle);

      // Ajoute les questions associées à cette catégorie
      questions
        .filter((q) => q.category === category)
        .forEach((question, index) => {
          const listItem = document.createElement("li");
          const label = document.createElement("label");
          label.textContent = `${question.text} (+${question.points} points)`;

          if (question.multiple) {
            // Gestion des questions multiples
            const container = document.createElement("div");
            container.classList.add("checkbox-container");

            for (let i = 0; i < question.multiple; i++) {
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.id = `question-${index}-${i}`;
              checkbox.addEventListener("change", () => togglePoints(checkbox, question.points));
              container.appendChild(checkbox);
            }

            listItem.appendChild(label);
            listItem.appendChild(container);
          } else {
            // Gestion des questions simples
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `question-${index}`;
            checkbox.addEventListener("change", () => togglePoints(checkbox, question.points));
            listItem.appendChild(label);
            listItem.appendChild(checkbox);
          }

          questionList.appendChild(listItem);
        });
    });
  }

  // Restaurer l'état des cases cochées
  function restoreCheckboxState() {
    questions.forEach((question, index) => {
      if (question.multiple) {
        for (let i = 0; i < question.multiple; i++) {
          const checkbox = document.getElementById(`question-${index}-${i}`);
          const isChecked = localStorage.getItem(`question-${index}-${i}`) === "true";
          if (checkbox) checkbox.checked = isChecked;
        }
      } else {
        const checkbox = document.getElementById(`question-${index}`);
        const isChecked = localStorage.getItem(`question-${index}`) === "true";
        if (checkbox) checkbox.checked = isChecked;
      }
    });
  }

  // Ajouter ou retirer des points
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

  // Réinitialisation
  resetButton.addEventListener("click", () => {
    if (confirm("Êtes-vous sûr·e de vouloir réinitialiser ?")) {
      localStorage.clear();
      bonusWord = getRandomWord(); // Regénère un nouveau mot
      location.reload();
    }
  });

  // Commencer
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

  // Partager les réponses
  shareButton.addEventListener("click", () => {
    const name = localStorage.getItem("username") || "Anonyme";
    const responses = questions
      .map((question, index) => {
        if (question.multiple) {
          const checkedOptions = [];
          for (let i = 0; i < question.multiple; i++) {
            if (localStorage.getItem(`question-${index}-${i}`) === "true") {
              checkedOptions.push(`Option ${i + 1}`);
            }
          }
          return checkedOptions.length ? `- ${question.text} : ${checkedOptions.join(", ")}` : null;
        } else {
          return localStorage.getItem(`question-${index}`) === "true" ? `- ${question.text}` : null;
        }
      })
      .filter(Boolean)
      .join("\n");

    const now = new Date();
    const dateTime = now.toLocaleString();
    const textToCopy = `
Salut PNJ, c'est ${name},
j'ai ${score} points d'xp
À ${dateTime}

Je viens rendre mes quêtes :
${responses || "Aucune question répondue"}
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      copyNotification.style.display = "block";
      setTimeout(() => {
        copyNotification.style.display = "none";
      }, 3000);
    }).catch((err) => {
      console.error("Erreur lors de la copie : ", err);
    });
  });
});
