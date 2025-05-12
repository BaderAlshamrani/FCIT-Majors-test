const questions = [{"text": "I enjoy writing code and debugging programs.", "majors": ["cs"]}, {"text": "I like designing visually appealing interfaces.", "majors": ["it"]}, {"text": "Securing systems against hackers fascinates me.", "majors": ["it"]}, {"text": "I enjoy analyzing large datasets to find patterns.", "majors": ["cs"]}, {"text": "Understanding computer hardware components interests me.", "majors": ["cs"]}, {"text": "I like managing projects and coordinating teams.", "majors": ["is"]}, {"text": "Studying algorithms and their efficiency excites me.", "majors": ["cs"]}, {"text": "I enjoy explaining technical concepts to others.", "majors": ["is"]}, {"text": "Building smart systems that can learn interests me.", "majors": ["cs"]}, {"text": "I'm detail\u2011oriented and enjoy testing software.", "majors": ["cs", "it"]}, {"text": "Working with databases and information systems interests me.", "majors": ["is"]}, {"text": "I like developing mobile applications.", "majors": ["it", "cs"]}, {"text": "I'm interested in cloud computing infrastructure.", "majors": ["it"]}, {"text": "Mathematics and statistics are enjoyable subjects for me.", "majors": ["cs"]}, {"text": "I like solving user problems through technology.", "majors": ["is"]}, {"text": "Computer graphics and animation fascinate me.", "majors": ["cs"]}, {"text": "I prefer working close to business processes.", "majors": ["is"]}, {"text": "I enjoy researching new artificial intelligence techniques.", "majors": ["cs"]}, {"text": "Ethical hacking to find vulnerabilities interests me.", "majors": ["it"]}, {"text": "System administration and computer networks interest me.", "majors": ["it"]}];
const majorsInfo = {"cs": {"name": "Computer Science", "desc": "Core programming, algorithms, and theoretical computing\u2014branches include Artificial Intelligence, Machine Learning, and Data Science."}, "it": {"name": "Information Technology", "desc": "Practical implementation of technology systems\u2014branches include Cloud Computing, Cybersecurity, Mobile & Web Development, and Networking."}, "is": {"name": "Information Systems", "desc": "Aligns technology with business processes\u2014branches include Business Analysis, Database Management, and Project Management."}};

let current = 0;
let scores = {};
let chart; // Chart.js instance
let selectedYes = null;   // tracks the current Yes/No choice for this question

const startBtn = document.getElementById('startBtn');
const quizContainer = document.getElementById('quizContainer');
const questionText = document.getElementById('questionText');
const choicesDiv = document.getElementById('choices');
const nextBtn = document.getElementById('nextBtn');
const resultContainer = document.getElementById('resultContainer');
const bestMajorText = document.getElementById('bestMajorText');
const majorDesc = document.getElementById('majorDesc');
const restartBtn = document.getElementById('restartBtn');

startBtn.addEventListener('click', () => {
    startBtn.parentElement.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    initQuiz();
});

function initQuiz() {
    current = 0;
    scores = {};
    Object.keys(majorsInfo).forEach(m => scores[m] = 0);
    showQuestion();
}

function showQuestion() {
    const q = questions[current];
    questionText.textContent = `Q${current+1}. ` + q.text;
    choicesDiv.innerHTML = '';
    ['Yes','No'].forEach(choice => {
        const div = document.createElement('div');
        div.className = 'choice';
        div.textContent = choice;
        div.addEventListener('click', () => selectChoice(div, choice === 'Yes'));
        choicesDiv.appendChild(div);
    });
    nextBtn.disabled = true;
}

let answered = false;
function selectChoice(el, isYes) {
    // Remove any previous highlight
    Array.from(choicesDiv.children).forEach(child => child.classList.remove('selected'));

    /* If they previously selected “Yes” we must roll back
       the increments we added to each major’s score.        */
    if (selectedYes === true) {
        questions[current].majors.forEach(m => scores[m]--);
    }

    // Highlight the newly clicked choice
    el.classList.add('selected');
    selectedYes = isYes;

    // Apply score if “Yes” is chosen
    if (isYes) {
        questions[current].majors.forEach(m => scores[m]++);
    }

    answered = true;         // something is now chosen
    nextBtn.disabled = false;
}


nextBtn.addEventListener('click', () => {
    if(!answered) return;
    answered = false;
    current++;
    if(current < questions.length){
        showQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    quizContainer.classList.add('hidden');

    // Calculate percentages
    const totalPoints = Object.values(scores).reduce((a,b)=>a+b,0) || 1;
    const labels = Object.keys(scores).map(k => majorsInfo[k].name);
    const data = Object.keys(scores).map(k => Math.round(scores[k]/totalPoints*100));

    // Determine best major
    const bestKey = Object.keys(scores).reduce((a,b)=>scores[a]>scores[b]?a:b);
    const bestPercent = data[labels.findIndex(l => l === majorsInfo[bestKey].name)];

    // Destroy old chart if exists
    if(chart) chart.destroy();

    const ctx = document.getElementById('resultChart').getContext('2d');
    chart = new Chart(ctx, {
        type:'bar',
        data:{
            labels: labels,
            datasets:[{
                label:'Match Percentage',
                data: data
            }]
        },
        options:{
            scales:{
                y:{beginAtZero:true,max:100}
            }
        }
    });

    bestMajorText.textContent = `Your best major is: ${majorsInfo[bestKey].name} ({bestPercent}%)`;
    majorDesc.textContent = majorsInfo[bestKey].desc;

    resultContainer.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
    resultContainer.classList.add('hidden');
    startBtn.parentElement.classList.remove('hidden');
});
