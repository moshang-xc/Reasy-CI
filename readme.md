# Reasy-CI

## 功能记录

1. 无需登录
2. 切换组件
3. 读取组件的相关配置
4. 组件数据一键入库，同时可以一键更新组件的数据配置
5. 记录已生成的页面模板，供下次使用，点击保存可将模板入库，没有入库的模板默认保存在浏览器本地
6. **记录的配置数据与组件无关，通过提供的组件使用模板生成代码**
7. 支持样式类的生成
8. 使用element-UI配置界面
9. 提供组件录入管理，已配置项目管理，新项目配置页面
10. 提供数据校验方法的名称和参数录入洁面

## 设计思路
1. 上传组件配置，写入特定的文件夹，数据库组建表只记录，组建与写入地址的信息，不记录配置信息。
2. 组件代码生成逻辑，怎么生成，通过配置怎么去生成对应的代码
3. 存储的配置，也存储配置文件，数据库记录配置名称和配置文件的地址

## 代码生成思路
1. 读取页面配置信息
2. 根据页面的生命周期生成对应的代码
3. 如何做到同一份配置根据不同组件库生成不同的代码（目前应该是做不到的，不同的库拥有的组件不一样配置也不一样，无法做到，除非找到对应的映射关系，才能共用一套配置）

## todo
1. 每天定时跑一遍程序删除没有使用的的配置文件，对应的file表中的数据也进行清空
2. 验证上传的属性配置文件的正确性（必填属性是否填写，枚举值是否存在）
3. 验证上传的代码生成文件的正确性

## 问题记录
1. 更新组件的配置文件，无法更新对应的数据，需要重启服务，server没有更新缓存