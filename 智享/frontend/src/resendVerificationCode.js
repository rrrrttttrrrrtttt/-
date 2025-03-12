document.getElementById('resendButton').addEventListener('click', function() {
    // 禁用按钮以防止重复点击
    this.disabled = true;

    // 发送网络请求
    fetch('/api/resendVerificationCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: '12345' }) // 替换为实际的用户ID
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('验证码已重新发送');
        } else {
            alert('发送失败，请稍后再试');
        }
        // 重新启用按钮
        this.disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('发送失败，请稍后再试');
        // 重新启用按钮
        this.disabled = false;
    });
});
