/* public/js/main.js */

document.addEventListener('DOMContentLoaded', () => {
    // Flash xabarlarni bir necha soniyadan so'ng yo'qotish
    const flashMessages = document.querySelector('.flash-messages');
    if (flashMessages && flashMessages.children.length > 0) {
        setTimeout(() => {
            let opacity = 1;
            const fadeOutInterval = setInterval(() => {
                opacity -= 0.1;
                flashMessages.style.opacity = opacity;
                if (opacity <= 0) {
                    clearInterval(fadeOutInterval);
                    flashMessages.remove();
                }
            }, 50);
        }, 4000);
    }


    const commentToggleButtons = document.querySelectorAll('.view-comments-btn');

    commentToggleButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Havolaning standart harakatini bekor qilish

            const targetId = button.getAttribute('data-target');
            const commentsSection = document.querySelector(targetId);
            
            if (commentsSection) {
                // 'show' klassini qo'shish yoki olib tashlash
                commentsSection.classList.toggle('show');

                // Tugma matnini holatga qarab o'zgartirish
                if (commentsSection.classList.contains('show')) {
                    button.textContent = 'Hide comments';
                } else {
                    const commentCount = commentsSection.querySelectorAll('.comment-item').length;
                    button.textContent = `View all ${commentCount} comments`;
                }
            }
        });
    });


    const commentForm = document.getElementById('main-comment-form');
    if (commentForm) {
        const parentIdInput = document.getElementById('parentIdInput');
        const replyingToContainer = document.getElementById('replying-to-container');
        const replyingToText = document.getElementById('replying-to-text');
        const cancelReplyBtn = document.getElementById('cancel-reply-btn');

        document.querySelectorAll('.reply-btn').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                const commentId = button.getAttribute('data-comment-id');
                const username = button.getAttribute('data-username');

                parentIdInput.value = commentId;
                replyingToText.innerText = `Replying to @${username}`;
                replyingToContainer.style.display = 'block';
                
                // Formaga scroll qilish
                commentForm.scrollIntoView({ behavior: 'smooth' });
                commentForm.querySelector('textarea').focus();
            });
        });

        cancelReplyBtn.addEventListener('click', () => {
            parentIdInput.value = '';
            replyingToContainer.style.display = 'none';
        });
    }

    const toggleAllBtn = document.querySelector('.toggle-all-comments-btn');
    if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
            const targetId = toggleAllBtn.dataset.targetId;
            const allCommentsContainer = document.getElementById(targetId);
            const arrow = toggleAllBtn.querySelector('.arrow');
            const btnText = toggleAllBtn.querySelector('.btn-text');

            if (allCommentsContainer) {
                const isShown = allCommentsContainer.classList.toggle('show');
                if (isShown) {
                    arrow.style.transform = 'rotate(90deg)';
                    btnText.textContent = 'Barchasini yashirish';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                    btnText.textContent = 'Barchasini ko\'rsatish';
                }
            }
        });
    }


     document.querySelectorAll('.toggle-replies-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.targetId;
            const repliesContainer = document.getElementById(targetId);
            const arrow = button.querySelector('.arrow');
            const btnText = button.querySelector('.btn-text');

            if (repliesContainer) {
                const isShown = repliesContainer.classList.toggle('show');

                if (isShown) {
                    // Ochilganda
                    arrow.style.transform = 'rotate(90deg)';
                    btnText.textContent = 'Javoblarni yashirish';
                } else {
                    // Yopilganda
                    arrow.style.transform = 'rotate(0deg)';
                    const replyCount = repliesContainer.querySelectorAll('.blog-comment-item').length;
                    btnText.textContent = `Javoblarni ko'rish (${replyCount})`;
                }
            }
        });
    });

    // Navigatsiyadagi aktiv sahifani belgilash
    // Bu qism EJS fayldagi kod orqali bajarilmoqda, shuning uchun JS da shart emas.
    // Agar EJS da ishlamasa, quyidagi kodni ishlatish mumkin:
    /*
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    */
});