document.addEventListener('DOMContentLoaded', () => {
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
            event.preventDefault();
            const targetId = button.getAttribute('data-target');
            const commentsSection = document.querySelector(targetId);
            if (commentsSection) {
                commentsSection.classList.toggle('show');
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
                    btnText.textContent = 'Hide all';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                    btnText.textContent = 'Show all';
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
                    arrow.style.transform = 'rotate(90deg)';
                    btnText.textContent = 'Hide Replies';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                    const replyCount = repliesContainer.querySelectorAll('.blog-comment-item').length;
                    btnText.textContent = `Show Replies (${replyCount})`;
                }
            }
        });
    });
});
