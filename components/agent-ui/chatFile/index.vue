<template>
    <!-- components/agent-ui-new/chatFIle/chatFile.wxml -->
    <!-- <text>components/agent-ui-new/chatFIle/chatFile.wxml</text> -->
    <view class="chat_file">
        <view class="chat_file__content">
            <image class="chat_file__icon" :src="iconPath" />
            <view class="chat_file__info">
                <view class="chat_file__name">{{ fileData.fileName }}</view>
                <view class="chat_file__size">
                    {{ formatSize }}
                    <image v-if="!fileData.fileId" style="width: 20px; height: 20px" src="/static/components/agent-ui/imgs/loading.svg" mode="" />
                </view>
            </view>
        </view>
        <image
            v-if="'enableDel'"
            @tap="removeFileFromParents"
            style="width: 15px; height: 15px; position: absolute; top: 0px; right: 0px"
            src="/static/components/agent-ui/imgs/close-filled.png"
            mode="aspectFill"
        />
    </view>
</template>

<script>
// components/agent-ui-new/chatFIle/chatFile.js
export default {
    data() {
        return {
            formatSize: '',
            iconPath: '/static/components/agent-ui/imgs/file.svg'
        };
    },

    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },

    watch: {
        'fileData.fileId': function (fileId) {
            if (!fileId) {
                this.setData({
                    formatSize: '解析中'
                });
            } else {
                this.setData({
                    formatSize: this.transformSize(this.fileData.fileSize)
                });
            }
        }
    },

    /**
     * 组件的属性列表
     */
    props: {
        enableDel: {
            type: Boolean,
            default: true
        },
        fileData: {
            type: Object,
            default: () => ({
                tempId: '',
                rawType: '',
                fileName: '',
                tempPath: '',
                fileSize: 0,
                fileUrl: '',
                fileId: ''
            })
        }
    },

    /**
     * 组件的方法列表，
     */
    methods: {
        attached: function () {
            // const formatSize = this.transformSize(this.data.fileSize)
            const { fileName, tempPath, fileId } = this.fileData;
            const type = this.getFileType(fileName);
            console.log('type', type);
            if (fileId) {
                this.setData({
                    formatSize: this.transformSize(this.fileData.fileSize),
                    iconPath: '../imgs/' + type + '.svg'
                });
                return;
            }
            this.setData({
                formatSize: '解析中',
                iconPath: '../imgs/' + type + '.svg'
            });

            // 上传云存储获取 fileId
            uniCloud.uploadFile({
                cloudPath: fileName,

                // 云上文件路径
                filePath: tempPath,

                // 本地文件路径
                success: (res) => {
                    console.log('上传成功，fileID为：', res.fileID);
                    // 此时你可以使用res.fileID进行后续操作
                    // this.setData({
                    //   fileData: {
                    //     ...this.data.fileData,
                    //     fileId: res.fileID
                    //   }
                    // })
                    this.$emit('changeChild', {
                        detail: {
                            tempId: this.fileData.tempId,
                            fileId: res.fileID
                        }
                    });
                },

                fail: (err) => {
                    console.error('上传失败：', err);
                }
            });
        },

        // 提取文件后缀
        getFileType: function (fileName) {
            let index = fileName.lastIndexOf('.');
            const fileExt = fileName.substring(index + 1);
            if (fileExt === 'docx' || fileExt === 'doc') {
                return 'word';
            }
            if (fileExt === 'xlsx' || fileExt === 'xls') {
                return 'excel';
            }
            if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'svg') {
                return 'image';
            }
            if (fileExt === 'pdf') {
                return 'pdf';
            }
            return 'file';
        },

        // getFileIcon: function (fileName) {
        //   const type = this.getFileType(fileName)
        //   console.log('type', type)
        //   if(type === 'pdf') {
        //     return 'pdf.png'
        //   }

        //   return 'image.png'
        // },
        // 转换文件大小（原始单位为B）
        transformSize: function (size) {
            if (size < 1024) {
                return size + 'B';
            } else if (size < 1048576) {
                return (size / 1024).toFixed(2) + 'KB';
            } else {
                return (size / 1024 / 1024).toFixed(2) + 'MB';
            }
        },

        removeFileFromParents: function () {
            console.log('remove', this.fileData);
            this.$emit('removeChild', {
                detail: {
                    tempId: this.fileData.tempId
                }
            });
        }
    },

    created: function () {}
};
</script>
<style>
/* components/agent-ui-new/chatFIle/chatFile.wxss */
.chat_file {
    padding: 24rpx;
    background: #ffffff;
    border-radius: 12rpx;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.253);
    margin: 16rpx 5rpx;
    width: 130px;
    position: relative;
}

.chat_file:active {
    background: #f9f9f9;
}

.chat_file__content {
    display: flex;
    align-items: center;
    gap: 24rpx;
}

.chat_file__icon {
    width: 80rpx;
    height: 80rpx;
    flex-shrink: 0;
}

.chat_file__info {
    flex: 1;
    min-width: 0;
}

.chat_file__name {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 8rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chat_file__size {
    font-size: 24rpx;
    color: #999999;
}
</style>
