// import { login, logout, getInfo } from '@/api/login'
import { login, logout, getInfo } from '@/api/interface'
import { getToken, setToken, removeToken, getCookiesUserName, setCookiesUserName, removeCookiesUserName } from '@/utils/auth'

const user = {
        state: {
            token: getToken(),
            name: '',
            username: getCookiesUserName(),
            avatar: '',
            roles: [],
            customer: {},
        },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_USERNAME: (state, username) => {
            state.username = username
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_CUSTOMER: (state, customer) => {
            state.customer = customer
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    if(response.status == 200) {
                        // 设置cookies
                        setToken(response.data)
                        commit('SET_TOKEN', response.data)
                        setCookiesUserName(username)
                        commit('SET_USERNAME', username)
                        resolve()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo(state.username).then(response => {
                    if(response.status == 200) {
                        commit('SET_CUSTOMER', response.data.customer)
                        commit('SET_NAME', response.data.customer.name)
                        resolve(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_NAME', '')
                    commit('SET_USERNAME', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    removeCookiesUserName()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
