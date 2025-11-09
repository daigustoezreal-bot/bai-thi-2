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
    let inReviewMode = false; // Biến mới: Xác định chế độ xem lại

    // --- LẤY CÁC THÀNH PHẦN GIAO DIỆN ---
    const questionDisplayArea = document.getElementById('question-content-left');
    const answerSheetArea = document.getElementById('answer-sheet-area');
    const questionPalette = document.getElementById('question-palette');
    const submitBtn = document.getElementById('submit-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const navigationArea = document.getElementById('navigation-area');


    // --- HÀM (1): VẼ BẢNG ĐIỀU HƯỚNG (PALETTE) (ĐÃ CẬP NHẬT) ---
    function renderPalette() {
        questionPalette.innerHTML = ''; 
        allQuestions.forEach((q, index) => {
            const questionNumber = index + 1;
            let statusClass = '';

            if (inReviewMode) {
                // Nếu ở chế độ xem lại -> Tô màu ĐÚNG/SAI
                const correctAnswer = allQuestions[index].answer;
                const userAnswer = userAnswers[index];
                if (userAnswer === correctAnswer) {
                    statusClass = 'correct'; // Xanh
                } else {
                    statusClass = 'incorrect'; // Đỏ
                }
            } else {
                // Nếu ở chế độ làm bài -> Tô màu ĐÃ TRẢ LỜI / CHƯA
                statusClass = (userAnswers[index] === null) ? 'unanswered' : 'answered';
            }
            
            // Đánh dấu câu đang xem
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

    // --- HÀM (2): VẼ CÂU HỎI (ĐÃ CẬP NHẬT) ---
    function renderQuestion(index) {
        currentQuestionIndex = index;
        const q = allQuestions[index];
        const correctAnswer = q.answer;
        const userAnswer = userAnswers[index];
        
        // A. Render CỘT TRÁI (Hiển thị)
        let imageHTML = q.image ? `<img src="${q.image}" alt="Nội dung câu hỏi" class="question-image">` : '';
        const questionTextHTML = `<p class="question-text">${q.question}</p>`;
        
        // Logic tô màu cho cột trái (nếu ở review mode)
        const optionsTextHTML = q.options.map((option) => {
            const optionLetter = option[0]; // 'A', 'B', 'C', 'D'
            let optionClass = '';
            
            if (inReviewMode) {
                if (optionLetter === correctAnswer) {
                    optionClass = 'option-correct'; // Xanh
                } else if (optionLetter === userAnswer) {
                    optionClass = 'option-incorrect'; // Đỏ
                }
            }
            return `<li class="${optionClass}">${option}</li>`;
        }).join('');
        
        questionDisplayArea.innerHTML = `
            ${imageHTML}
            ${questionTextHTML}
            <ul class="options-text-list">
                ${optionsTextHTML}
            </ul>
        `;

        // B. Render CỘT PHẢI (Ô chọn A,B,C,D)
        const answerOptions = ['A', 'B', 'C', 'D'];
        answerSheetArea.innerHTML = answerOptions.map(optionLetter => {
            let optionClass = 'option';
            
            if (inReviewMode) {
                // Vô hiệu hóa và tô màu
                optionClass += ' disabled';
                if (optionLetter === correctAnswer) {
                    optionClass += ' option-correct';
                } else if (optionLetter === userAnswer) {
                    optionClass += ' option-incorrect';
                }
            } else {
                // Chế độ làm bài: chỉ tô màu 'selected'
                if (userAnswer === optionLetter) {
                    optionClass += ' selected';
                }
            }
            
            return `
                <li class="${optionClass}" data-option-value="${optionLetter}">
                    ${optionLetter}
                </li>
            `;
        }).join('');

        // C. Cập nhật lại Palette
        renderPalette();

        // D. Ẩn/Hiện nút (Chỉ khi KHÔNG ở review mode)
        if (!inReviewMode) {
            if (currentQuestionIndex === allQuestions.length - 1) {
                nextQuestionBtn.classList.add('hidden');
                submitBtn.classList.remove('hidden');
            } else {
                nextQuestionBtn.classList.remove('hidden');
                submitBtn.classList.add('hidden');
            }
        }
    }

    // --- HÀM (3): BỎ (Không cần hàm showReview() nữa) ---
    
    // --- XỬ LÝ SỰ KIỆN (EVENT LISTENERS) ---

    // 1. Click vào Bảng điều hướng (Palette)
    questionPalette.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('.palette-item');
        if (clickedItem) {
            const index = parseInt(clickedItem.dataset.index);
            renderQuestion(index);
        }
    });

    // 2. Click vào đáp án A, B, C, D (Thêm kiểm tra review mode)
    answerSheetArea.addEventListener('click', (event) => {
        // Nếu đang ở review mode, không làm gì cả
        if (inReviewMode) return; 

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

    // 3. Click nút "Nộp bài" (ĐÃ CẬP NHẬT HOÀN TOÀN)
    submitBtn.addEventListener('click', () => {
        // 1. Kiểm tra câu chưa trả lời
        const firstUnansweredIndex = userAnswers.findIndex(answer => answer === null);
        if (firstUnansweredIndex !== -1) {
            const questionNumber = firstUnansweredIndex + 1;
            const message = `Bạn vẫn còn câu hỏi số ${questionNumber} chưa trả lời. \n\nXác nhận nộp bài?`;
            const userConfirmed = confirm(message);
            if (!userConfirmed) return; 
        }

        // 2. Tính điểm
        let score = 0;
        const totalQuestions = allQuestions.length;
        allQuestions.forEach((question, index) => {
            if (userAnswers[index] === question.answer) score++; 
        });

        // 3. Kích hoạt chế độ REVIEW MODE
        inReviewMode = true; 
        
        // 4. Ẩn các nút điều hướng
        navigationArea.innerHTML = `<h3>Kết quả: ${score} / ${totalQuestions}</h3>`;

        // 5. Render lại câu hỏi hiện tại (để áp dụng style review)
        renderQuestion(currentQuestionIndex);
        
        // 6. Cảnh báo kết quả (vẫn giữ alert cho rõ)
        alert(`Bạn đã hoàn thành bài thi! \nĐiểm số: ${score} / ${totalQuestions}`);
    });

    // 4. Click nút "Câu hỏi tiếp theo"
    nextQuestionBtn.addEventListener('click', () => {
        renderQuestion(currentQuestionIndex + 1);
    });

    // --- KHỞI ĐỘNG ---
    renderQuestion(0); // Bắt đầu ở câu 0
});
