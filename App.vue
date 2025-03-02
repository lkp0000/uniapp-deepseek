<script>
// app.js
export default {
    data() {
        return {};
    },
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            wx.cloud.init({
                env: 'your env id'
            });
            console.log(111);
        }
        this.globalData = {};
    },
    globalData: {}
};
</script>
<style>
/**app.wxss**/
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
}
</style>
