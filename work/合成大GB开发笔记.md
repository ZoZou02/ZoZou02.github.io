
# 合成大GB

由p5.js更换到pixijs
## 1. 技能修改
- [x] UFO技能优化，调节上升速度
- [x] 上升时全员改成Hit动画
- [x] ~~添加UFO光线~~
- [x] 添加UFO音效
- [x] ~~添加晃动技能（实现较难）~~
- [x] 添加UFO随机飞行出现，点击全员变成外星人
- [x] 上到下变，添加特效和音效。（点击两次才变，第一次点击悬停，say hi，悬停动画上下浮动）
- [x] ufo飞行只出现一次，最高等级的一只不变外星人

## 2. bug修复
- [x] 暂停页面点击继续游戏会导致释放头像
- [x] 结束后烟雾动画没有消失
- [x] ~~添加github代理链接加载资源~~   是用jsDeliver更慢了
- [x] 点击排行榜会出现游戏面板
- [x] UFO技能上升合成之后，上升好像没有变化
- [x] 排行榜g粗体，下面的其他也粗体

## 3. 页面UI
- [x] 二级页面：排行榜、暂停页面、结束页面 重新设计 
- [x] 排行榜日期添加年
- [x] 首页优化，开始游戏颜色得换
- [x] 标题设计 合成大GB
- [x] 添加作者信息、声明等
- [x] 添加音乐、音效静音按钮和音量调节
- [x] 加载页面圆环优化
- [x] 加载页面添加加载进度 xx/xx 显示加载内容信息 提示错误信息 自动重新刷新加载 提示用户更换网络尝试
- [x] 加载页面去掉背景
- [x] 分数增加优化，现在多重合成时分数会一直向下堆叠在
- [x] 修改背景为头像一格一格运动，蓝色滤镜，动画参考nikke BFG
- [x] 继续优化头像背景，绘制、动画卡顿
- [x] 新纪录提示，结算页面显示最高记录
- [x] 结算显示本局gb合成数量，排行榜也加上
- [x] 游戏页面按钮统一？

## 4. 音效
- [x] G11 刘C梦！！ 
- [x] 添加按钮音效
- [x] 添加BGM
- [x] 播放音效的概率降低
- [x] 音量均衡！！！！！！！！！
- [x] 音效调节添加参考音效，每次调节触发一次进行参考

## 5. 其他
- [x] gee之后再合成lee，+5000，中间提示
- [x] 游戏主页面点外星人进入外星人模式，然后出现ufo，点击ufo回到普通模式
- [x] 技能按钮位置下调
- [x] ~~帧数优化，去掉锁帧~~

## 6. about文本

我Geebar谁啊 https://space.bilibili.com/15264115
樱井飞鸟 https://space.bilibili.com/480992315
Lee唉咯 https://space.bilibili.com/773977
残杀Top丶KILL https://space.bilibili.com/24453454
袖子杨杨 https://space.bilibili.com/355316181
悠姆帕不是大果冻 https://space.bilibili.com/1638789
牧牧川 https://space.bilibili.com/4731411
芙老大kawa https://space.bilibili.com/31807853
黑無象 https://space.bilibili.com/310941
小咒kojiko https://space.bilibili.com/25691069

## 7. 想法
- +5000机制是否需要限制次数


## 8. 参数

### 8.1. 物理参数

| 参数 | 位置 | 作用 |
|------|------|------|
| `gravity: 1.2` | [`PHYSICS.gravity`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L15) | 重力大小，越大掉得越快 |
| `restitution: 0.2` | [`PHYSICS.restitution`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L16) | 弹性（碰撞反弹程度），0~1 |
| `friction: 0.1` | [`PHYSICS.friction`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L17) | 摩擦力，越大越不容易滑动 |
| `density: 0.001` | [`PHYSICS.density`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L18) | 密度，影响质量和惯性 |

### 8.2. 头像半径（空间占用的核心）

| 等级 | 半径 | 位置 |
|------|------|------|
| 0 (👽) | 16 | [`FRUITS[0].radius`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L32) |
| 1 (残杀) | 22 | [`FRUITS[1].radius`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L33) |
| ... | ... | ... |
| 10 (GEE) | 66 | [`FRUITS[10].radius`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L42) |


### 8.3. 合成判断相关

| 参数 | 位置 | 作用 |
|------|------|------|
| 碰撞即合成 | [`game.js _handleCollision`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/game.js#L228-L270) | 同等级碰撞就触发，没有额外距离判断 |
| `MERGE_AUDIO_CFG.delay_time: 80` | [`config.js:58`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L58) | 碰撞后延迟多少毫秒执行合成（视觉缓冲） |
| 最大等级不合成 | [`game.js:250`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/game.js#L250) | 两个10级改成消失加分（刚改的） |

### 8.4. 难度相关

| 参数 | 位置 | 作用 |
|------|------|------|
| `initialFruitMaxLevel: 4` | [`DIFFICULTY.initialFruitMaxLevel`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L22) | 掉落头像的最高等级（0~4随机） |
| `dangerTimeoutSeconds: 5` | [`DIFFICULTY.dangerTimeoutSeconds`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L23) | 危险线触发后几秒算游戏结束 |
| `DROP_DELAY: 500` | [`config.js:91`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L91) | 每次掉落间隔（毫秒） |

### 8.5. 游戏区域大小

| 参数 | 位置 |
|------|------|
| `GAME_WIDTH: 360` | [`config.js:6`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L6) |
| `GAME_HEIGHT: 550` | [`config.js:7`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L7) |
| `WALL_THICKNESS: 20` | [`config.js:8`](file:///d:/develop/myHomePage/galleryz/biggerPixi/js/config.js#L8) |

##视频参考
【【黑無象】傻笑纯享2.0，进来继续笑！！】 https://www.bilibili.com/video/BV1Xe411A7Ud/?share_source=copy_web&vd_source=a4fc10438ccc15adfed8d3ba5c681aa3


## 9. 命令
发布到bigger正式
```bash
git release
```

``