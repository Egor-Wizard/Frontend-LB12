$(document).ready(function () {
        const beginnerWords = [
            { word: 'Hello', translation: 'Привіт' },
            { word: 'Goodbye', translation: 'До побачення' },
            { word: 'after', translation: 'Після' },
            { word: 'animal', translation: 'Тварина' },
            { word: 'car', translation: 'автомобіль' },
        ];

        const intermediateWords = [
            { word: 'Upper-intermediate', translation: 'Вище середнього ' },
            { word: 'Thesaurus', translation: 'Тезаурус' },
            { word: 'Hospitable', translation: 'Гостинний' },
            { word: 'Philosophical', translation: 'Философский' },
            { word: 'Acquaintance', translation: 'Знайомство' },
        ];

        const advancedWords = [
            { word: 'challenge', translation: 'виклик' },
            { word: 'innovation', translation: 'інновація' },
            { word: 'global', translation: 'глобальний' },
            { word: 'technology', translation: 'технологія' },
            { word: 'progress', translation: 'прогрес' },
        ];

        let currentStep = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let selectedDifficulty;

        function renderCards() {
            const cardContainer = $('#card-container');
            cardContainer.empty();

            let words;
            switch (selectedDifficulty) {
                case 'beginner':
                    words = beginnerWords;
                    break;
                case 'intermediate':
                    words = intermediateWords;
                    break;
                case 'advanced':
                    words = advancedWords;
                    break;
                default:
                    words = [];
            }

            const shuffledWords = shuffleArray(words);
            shuffledWords.forEach((word, index) => {
                const card = $(`<div class="card" data-index="${index}">${word.word}</div>`);
                cardContainer.append(card);
            });
        }

        function shuffleArray(array) {
            return array.slice().sort(() => Math.random() - 0.5);
        }

        function updateStatus() {
            $('#step-info').text(`Step ${currentStep + 1} of ${beginnerWords.length}`);
            $('#correct-count').text(correctCount);
            $('#incorrect-count').text(incorrectCount);
        }

        function showModal(wordIndex) {
            const modal = $('#result-modal');
            const modalContent = $('#modal-content');
            const modalWord = $('#modal-word');
            const translationInput = $('#translation-input');
            const checkButton = $('#check-translation');

            modalWord.text(beginnerWords[wordIndex].word);
            translationInput.val('');

            modal.show();

            checkButton.off('click').on('click', function () {
                const userTranslation = translationInput.val().trim().toLowerCase();
                const correctTranslation = beginnerWords[wordIndex].translation.toLowerCase();

               if (userTranslation.toLowerCase() === correctTranslation.toLowerCase()) {
    correctCount++;
    $(`.card[data-index="${wordIndex}"]`).addClass('correct-answer');
} else {
    incorrectCount++;
    $(`.card[data-index="${wordIndex}"]`).addClass('incorrect-answer');
}

                currentStep++;
                updateStatus();

                if (currentStep === beginnerWords.length) {
                    modal.hide();
                    showResultModal();
                } else {
                    modal.hide();
                }
            });

            $('.close').click(function () {
                modal.hide();
            });

            $(window).click(function (event) {
                if (event.target === modal[0]) {
                    modal.hide();
                }
            });
        }

        function showResultModal() {
            const modal = $('#result-modal');
            const proficiencyLevel = getProficiencyLevel();

            $('#proficiency-level').text(`Your proficiency level: ${proficiencyLevel}`);
            modal.show();

            $('.close').click(function () {
                modal.hide();
            });

            $(window).click(function (event) {
                if (event.target === modal[0]) {
                    modal.hide();
                }
            });
        }

        function getProficiencyLevel() {
            const accuracyPercentage = (correctCount / beginnerWords.length) * 100;

            if (accuracyPercentage >= 80) {
                return 'Advanced';
            } else if (accuracyPercentage >= 60) {
                return 'Intermediate';
            } else {
                return 'Beginner';
            }
        }

        function getDifficultyFactor() {
            switch (selectedDifficulty) {
                case 'beginner':
                    return 1;
                case 'intermediate':
                    return 2;
                case 'advanced':
                    return 3;
                default:
                    return 1;
            }
        }

        async function translateWordAsync(word) {
            return new Promise(resolve => {
                setTimeout(() => {
                    const translation = prompt(`Translate "${word}"`);
                    resolve(translation);
                }, 0);
            });
        }

        $('#start-quiz').click(function () {
            selectedDifficulty = $('#difficulty').val();
            renderCards();
            updateStatus();
        });

        $('#card-container').on('click', '.card', async function () {
            const index = $(this).data('index');
            showModal(index);
        });
    });
