document.addEventListener('DOMContentLoaded', () => {

    // --- DỮ LIỆU CÂU HỎI (Giữ nguyên) ---
    const allQuestions = [
        {
            question: "1. According to paragraph A, what event allowed Philadelphia to recover from the yellow fever epidemic?",
            options: [
                "A. The development of a new vaccine",
                "B. The arrival of Dr William Masters",
                "C. The first frost of the season",
                "D. The city's inhabitants leaving"
            ],
            answer: "C"
        },
        {
            question: "2. What mystery is Dr. Masters trying to solve, according to paragraph B?",
            options: [
                "A. Why mosquitoes carry disease",
                "B. Why wealthy nations are mostly in latitudes above 40 degrees",
                "C. Why agricultural economists study weather",
                "D. Why the Journal of Economic Growth is popular"
            ],
            answer: "B"
        },
        {
            question: "3. What are the two main benefits of cold snaps mentioned in paragraph B?",
            options: [
                "A. They make people work harder and sleep better",
                "B. They freeze crops and stop mosquitoes from breeding",
                "C. They allow for winter sports and tourism",
                "D. They freeze pests and disease-carrying organisms"
            ],
            answer: "D"
        },
        // ... (Các câu 4, 5, 6 của bạn ở đây)
        {
            question: "4. The study by Masters and McMillian was published in:",
            options: ["A. A book...", "B. The Purdue...", "C. The Journal...", "D. A Tufts..."],
            answer: "C"
        },
        {
            question: "5. Dựa vào ảnh X-quang, chẩn đoán là gì?",
            image: "https://i.imgur.com/83R0J2E.png", 
            options: ["A. Gãy xương cẳng tay", "B. Trật khớp vai", "C. Gãy xương đòn", "D. Hoàn toàn bình thường"],
            answer: "A"
        },
        {
            question: "6. (Đây là câu hỏi ví dụ 6)",
            options: ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
            answer: "D"
        }
    ];

    // --- BIẾN TRẠNG THÁI ---
    let currentQuestionIndex = 0; 
    let userAnswers = new Array(allQuestions.length).fill(null);

    // --- LẤY CÁC THÀNH PHẦN GIAO DIỆN ---
    const questionDisplayArea = document.getElementById('question-content-left');
    const answerSheetArea = document.getElementById('answer-sheet-area');
    const questionPalette = document.getElementById('question-palette');
    
    // Lấy 2 nút mới
    const submitBtn = document.getElementById('submit-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');


    // --- HÀM (1): VẼ BẢNG ĐIỀU HƯỚNG (PALETTE) ---
    function renderPalette() {
        questionPalette.innerHTML = ''; 
        allQuestions.forEach((q, index) => {
            const questionNumber = index + 1;
            let statusClass = (userAnswers[index] === null) ? 'unanswered' : 'answered';
            if (index === currentQuestionIndex) {
                statusClass += ' active';
            }
            const paletteItem = `
                <div class="palette-item ${statusClass}" data-index="${index}">
                    ${questionNumber}
                </div>
            `;
            questionPalette.innerHTML += paletteItem;
        });
    }

    // --- HÀM (2): VẼ CÂU HỎI (ĐÃ CẬP NHẬT LOGIC NÚT BẤM) ---
    function renderQuestion(index) {
        currentQuestionIndex = index;
        const q = allQuestions[index];
        
        // A. Render CỘT TRÁI (Hiển thị)
        let imageHTML = q.image ? `<img src="${q.image}" alt="Nội dung câu hỏi" class="question-image">` : '';
        const questionTextHTML = `<p class="question-text">${q.question}</p>`;
        const optionsTextHTML = q.options.map(option => `<li>${option}</li>`).join('');
        
        questionDisplayArea.innerHTML = `
            ${imageHTML}
            ${questionTextHTML}
            <ul class="options-text-list">
                ${optionsTextHTML}
            </ul>
        `;

        // B. Render CỘT PHẢI (Ô chọn A,B,C,D)
        const savedAnswer = userAnswers[index]; 
        const answerOptions = ['A', 'B', 'C', 'D'];
        answerSheetArea.innerHTML = answerOptions.map(optionLetter => `
            <li 
                class="option ${savedAnswer === optionLetter ? 'selected' : ''}" 
                data-option-value="${optionLetter}"
            >
                ${optionLetter}
            </li>
        `).join('');

        // C. Cập nhật lại Palette
        renderPalette();

        // === D. LOGIC MỚI: HIỂN THỊ NÚT BẤM TƯƠNG ỨNG ===
        if (currentQuestionIndex === allQuestions.length - 1) {
            // Đây là câu cuối cùng
            nextQuestionBtn.classList.add('hidden'); // Ẩn nút "Câu tiếp"
            submitBtn.classList.remove('hidden'); // Hiện nút "Nộp bài"
        } else {
            // Đây không phải câu cuối
            nextQuestionBtn.classList.remove('hidden'); // Hiện nút "Câu tiếp"
            submitBtn.classList.add('hidden'); // Ẩn nút "Nộp bài"
        }
    }

    // --- HÀM (3): HIỂN THỊ REVIEW (Giữ nguyên) ---
    function showReview(score, totalQuestions) {
        const reviewHTML = `
            <div class="content-wrapper" style="padding: 30px;">
                <h2>Kết quả bài thi</h2>
                <p style="font-size: 1.2em;">
                    Bạn đã trả lời đúng: 
                    <b>${score} / ${totalQuestions}</b> câu.
                </p>
                <hr>
            </div>
        `;
        const leftColumn = document.getElementById('question-display-area');
        leftColumn.innerHTML = reviewHTML;
        document.getElementById('answer-panel').innerHTML = ''; // Xóa cột phải
        leftColumn.style.borderRight = 'none';

        allQuestions.forEach((q, index) => {
            const correctAnswer = q.answer;
            const userAnswer = userAnswers[index];
            let imageHTML = q.image ? `<img src="${q.image}" alt="Nội dung câu hỏi" class="question-image">` : '';
            const optionsHTML = q.options.map((option) => {
                const optionLetter = option[0];
                let optionClass = 'option disabled'; 
                if (optionLetter === correctAnswer) optionClass += ' option-correct';
                else if (optionLetter === userAnswer) optionClass += ' option-incorrect';
                return `<li class="${optionClass}">${option}</li>`;
            }).join('');
            const questionHTML = `
                <div class="question-item" style="padding: 0 30px;">
                    ${imageHTML}
                    <p>${q.question}</p>
                    <ul class="options-list" style="padding:0;">${optionsHTML}</ul>
                </div>
            `;
            leftColumn.innerHTML += questionHTML;
        });
    }

    // --- XỬ LÝ SỰ KIỆN (EVENT LISTENERS) ---

    // 1. Click vào Bảng điều hướng (Palette)
    questionPalette.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('.palette-item');
        if (clickedItem) {
            const index = parseInt(clickedItem.dataset.index);
            renderQuestion(index);
        }
    });

    // 2. Click vào đáp án A, B, C, D
    answerSheetArea.addEventListener('click', (event) => {
        const selectedOption = event.target.closest('.option');
        if (selectedOption) {
            const optionValue = selectedOption.dataset.optionValue;
            userAnswers[currentQuestionIndex] = optionValue;
            const allOptions = answerSheetArea.querySelectorAll('.option');
            allOptions.forEach(opt => opt.classList.remove('selected'));
            selectedOption.classList.add('selected');
            renderPalette(); // Cập nhật palette
        }
    });

    // 3. Click nút "Nộp bài"
    submitBtn.addEventListener('click', () => {
        const firstUnansweredIndex = userAnswers.findIndex(answer => answer === null);
        if (firstUnansweredIndex !== -1) {
            const questionNumber = firstUnansweredIndex + 1;
            const message = `Bạn vẫn còn câu hỏi số ${questionNumber} chưa trả lời. \n\nXác nhận nộp bài?`;
            const userConfirmed = confirm(message);
            if (!userConfirmed) return; 
        }

        let score = 0;
        const totalQuestions = allQuestions.length;
        allQuestions.forEach((question, index) => {
            if (userAnswers[index] === question.answer) score++; 
        });

        showReview(score, totalQuestions);
    });

    // 4. === EVENT MỚI: CLICK NÚT "CÂU HỎI TIẾP THEO" ===
    nextQuestionBtn.addEventListener('click', () => {
        // Chỉ cần gọi hàm render câu tiếp theo
        renderQuestion(currentQuestionIndex + 1);
    });

    // --- KHỞI ĐỘNG ---
    renderQuestion(0); // Bắt đầu ở câu 0
});
