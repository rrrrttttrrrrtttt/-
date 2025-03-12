<template>
  <!-- ...existing code... -->
  <div>
    <input v-model="phoneNumber" placeholder="请输入手机号" />
    <button @click="sendVerificationCode">发送验证码</button>
  </div>
  <!-- ...existing code... -->
</template>

<script>
export default {
  data() {
    return {
      phoneNumber: '',
      // ...existing code...
    };
  },
  methods: {
    // ...existing code...
    async sendVerificationCode() {
      try {
        const response = await this.$http.post('/api/send-verification-code', {
          phoneNumber: this.phoneNumber,
        });
        if (response.data.success) {
          this.$toast.success('验证码发送成功');
        } else {
          this.$toast.error('验证码发送失败');
        }
      } catch (error) {
        this.$toast.error('网络错误，请稍后重试');
      }
    },
  },
};
</script>
