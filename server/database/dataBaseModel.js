const Sequelize = require('sequelize');
const config = require('../config/mysql');

class DatabaseModel {
    constructor() {
        this.tables = {};
        this.sequelize = '';
        // force为true代表清空数据库
        this.force = false;
        this.checkConnection = this.checkConnection.bind(this);
        this.initTable = this.initTable.bind(this);
        this.createTable = this.createTable.bind(this);
    }

    init() {
        return this.connectDatabase()
            .then(this.checkConnection)
            .then(this.initTable)
            .then(this.createTable)
            .then(() => {
                console.log("数据库初始化完毕!");
            })
            .catch(err => {
                console.log(err);
            });

    }

    connectDatabase() {
        return new Promise((resolve, reject) => {
            console.log('数据库连接...')
            this.sequelize = new Sequelize({
                database: config.database,
                username: config.username,
                password: config.password,
                host: config.host, //数据库主机IP
                dialect: "mysql", //数据库类型
                pool: { //连接池配置
                    max: 5, //最大连接数
                    min: 0, //最小连接数
                    acquire: config.aquireTimeout, //请求超时时间
                    idle: 10000 //断开连接后，连接实例在连接池保持的时间
                }
            });
            resolve();
        })
    }

    checkConnection() {
        return new Promise((resolve, reject) => {
            this.sequelize
                .authenticate()
                .then(() => {
                    console.log('数据库连接成功！');
                    resolve();
                })
                .catch(err => {
                    console.error('数据库连接失败！');
                    reject(err);
                });
        });
    }

    initTable() {
        /**
         * 组件库表
         * @id 唯一标识
         * @depedence_id 依赖的框架
         * @name 组建库名称
         * @description 描述信息
         * @url 当前组建的配置文件地址
         */
        this.tables.Group = this.sequelize.define('group', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            depedence_id: { type: Sequelize.INTEGER, allowNull: false },
            name: { type: Sequelize.STRING, allowNull: false },
            description: { type: Sequelize.STRING, allowNull: true },
            url: { type: Sequelize.STRING, allowNull: false }
        }, {
            freezeTableName: true
        });

        /**
         * 依赖表
         * @id 唯一标识
         * @name 框架名称
         * @version 版本号
         */
        this.tables.Dependence = this.sequelize.define('dependence', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            name: { type: Sequelize.STRING },
            version: { type: Sequelize.STRING }
        }, {
            freezeTableName: true
        });

        /**
         * 数据校验方法表
         * @id 唯一标识
         * @name 方法名称
         * @description 描述信息
         */
        this.tables.Validate = this.sequelize.define('validate', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            primaryKey: { type: Sequelize.STRING, allowNull: false },
            description: { type: Sequelize.STRING(255) }
        }, {
            freezeTableName: true
        });

        /**
         * 参数表
         * @id 唯一标识
         * @name 名称
         * @description 描述信息
         * @value 值
         * @value_type 值类型(用于生成代码)
         */
        this.tables.Parameter = this.sequelize.define('parameter', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            name: { type: Sequelize.STRING, allowNull: false },
            description: { type: Sequelize.STRING },
            value_type: { type: Sequelize.STRING }

        }, {
            freezeTableName: true
        });

        /**
         * ParameterToValidate
         * @id 唯一标识
         * @validate_id 校验方法
         * @parameter_id 校验参数
         * @value 值
         */
        this.tables.ParameterToValidate = this.sequelize.define('parameter_to_validate', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            validate_id: { type: Sequelize.INTEGER, allowNull: false },
            parameter_id: { type: Sequelize.INTEGER, allowNull: false }
        }, {
            freezeTableName: true
        });

        /**
         * 模版表
         * @id 唯一标识
         * @name 模板名称
         * @description 模板描述信息
         * @url 模板文件存储地址
         */
        this.tables.Module = this.sequelize.define('module', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            name: { type: Sequelize.STRING, allowNull: false },
            description: { type: Sequelize.STRING },
            url: { type: Sequelize.STRING }
        }, {
            freezeTableName: true
        });

        return Promise.resolve();
    }

    createTable() {
        //关系定义
        this.tables.Dependence.hasOne(this.tables.Group, {
            foreignKey: 'id',
            as: 'depedence_id'
        });

        this.tables.Validate.hasOne(this.tables.ParameterToValidate, {
            foreignKey: 'id',
            as: 'validate_id'
        });

        this.tables.Parameter.hasOne(this.tables.ParameterToValidate, {
            foreignKey: 'id',
            as: 'parameter_id'
        });

        return new Promise((resolve, reject) => {
            //同步实例与DB
            const force = this.force;
            // if (this.isFirst) {
            Promise.all([
                    this.tables.Dependence.sync({ force }),
                    this.tables.Module.sync({ force }),
                    this.tables.Validate.sync({ force }),
                    this.tables.Parameter.sync({ force })
                ])
                .then(() => {
                    return Promise.all([
                        this.tables.Group.sync({ force }),
                        this.tables.ParameterToValidate.sync({ force })
                    ]);
                })
                .then(resolve)
                .catch(err => {
                    console.info("初始化数据库结构时出现错误");
                    reject(err);
                });
            //     } else {
            //         resolve();
            //     }
        });
    }
}

const dbModel = new DatabaseModel();

module.exports = dbModel;