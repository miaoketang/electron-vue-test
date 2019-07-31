<template>
  <div id="wrapper">
    <div class="fake-title-bar">
      PicGo - {{ version }}
      <div class="handle-bar" v-if="os === 'win32'">
        <!-- 如果是windows系统 就加上模拟的操作按钮-->
        <i class="el-icon-minus" @click="minimizeWindow"></i>
        <i class="el-icon-close" @click="closeWindow"></i>
      </div>
      <el-button type="primary" @click="openURL">打开百度</el-button>
      <el-button type="primary" @click="openDialog">打开dialog</el-button>
    </div>
  </div>
</template>

<script>
// import SystemInformation from './LandingPage/SystemInformation'
import { remote } from 'electron'
const { BrowserWindow, dialog, Menu } = remote

export default {
  name: 'landing-page',
  data() {
    return {
      os: '',
      version: 'v0.0.1',
      menu: null
    }
  },
  components: {},
  created() {
    this.os = process.platform
    this.buildMenu()
  },
  methods: {
    // open(link) {
    //   require('electron').shell.openExternal(link)
    // }
    buildMenu() {
      const _this = this
      const template = [
        {
          label: '关于',
          click() {
            dialog.showMessageBox({
              title: 'PicGo',
              message: 'PicGo',
              detail: `Version: ${this.version}\nAuthor: Molunerfinn\nGithub: https://github.com/Molunerfinn/PicGo`
            })
          }
        },
        {
          label: '赞助PicGo',
          click() {
            _this.visible = true
          }
        }
      ]
      this.menu = Menu.buildFromTemplate(template)
    },
    openDialog() {
      this.menu.popup(remote.getCurrentWindow()) // 获取当前打开Menu的窗口
    },
    // openDialog() {
    //   this.$electron.remote.dialog.showMessageBox({
    //     title: 'PicGo',
    //     message: 'PicGo',
    //     detail: `Version: ${this.version}\nAuthor: Molunerfinn\nGithub: https://github.com/Molunerfinn/PicGo`
    //   })
    // },
    openURL() {
      this.$electron.remote.shell.openExternal('https://www.baidu.com/')
    },
    minimizeWindow() {
      const window = BrowserWindow.getFocusedWindow()
      window.minimize()
    },
    closeWindow() {
      const window = BrowserWindow.getFocusedWindow()
      window.close()
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
