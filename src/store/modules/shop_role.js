import api from '@/api'

const state = {
  list: [],
  status: ''
}

const mutations = {
  SET_LIST: (state, list) => {
    state.list = list
  },
  SET_STATUS: (state, status) => {
    state.status = status
  }
}

const actions = {
  async loadList({ commit, state }, force = false) {
    if (!force && (state.status === 'loading' || state.status === 'success')) return

    try {
      commit('SET_STATUS', 'loading')
      const res = await api.shop_role.list(null, {
        catchErrorResponse: false
      })

      commit('SET_LIST', res.data)
      commit('SET_STATUS', 'success')
    } catch (err) {
      commit('SET_STATUS', 'error')
    }
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
